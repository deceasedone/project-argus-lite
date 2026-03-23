from typing import Dict, Any
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from src.core.llm_factory import get_llm
from src.state.state import ResearchState
from src.tools.finance_tools import get_stock_info, get_stock_news
from src.agents.planner import ResearchPlan
from src.agents.reviewer import ReviewerDecision

def finance_planner_node(state: ResearchState) -> Dict[str, Any]:
    print("--- FINANCE PLANNER: Extracting Tickers ---")
    query = state.get("query")

    llm = get_llm()
    compiled_query = query or "No query provided"

    # Try structured output first (works with OpenAI/Gemini, may fail with Groq)
    try:
        structured_llm = llm.with_structured_output(ResearchPlan)

        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a Financial Planner. Extract the stock ticker symbols from the user's query. "
                       "Output a plan where each step is simply the uppercase TICKER symbol (e.g., 'AAPL', 'TSLA')."),
            ("human", "User Query: {query}")
        ])

        result = (prompt | structured_llm).invoke({"query": compiled_query})
        return {"plan": result.steps}

    except Exception as e:
        print(f"-> ERROR with structured output: {e}")
        print(f"-> Falling back to regular text generation")

        # Fallback: extract tickers manually with regex or simple parsing
        import re

        # Simple regex to find potential ticker symbols (2-5 uppercase letters)
        ticker_pattern = r'\b[A-Z]{2,5}\b'
        potential_tickers = re.findall(ticker_pattern, compiled_query)

        # Filter out common words that might match
        common_words = {'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'HAD', 'BY', 'HOT', 'BUT', 'SOME', 'WHAT', 'THERE', 'WHEN', 'YOUR', 'HOW', 'EACH', 'WHICH', 'THEIR', 'TIME', 'WILL', 'ABOUT', 'WOULD', 'THERE', 'COULD', 'OTHER'}
        filtered_tickers = [t for t in potential_tickers if t not in common_words]

        if filtered_tickers:
            print(f"-> Extracted tickers via regex: {filtered_tickers}")
            return {"plan": filtered_tickers}
        else:
            # If no tickers found, ask the LLM to extract them in plain text
            fallback_prompt = ChatPromptTemplate.from_messages([
                ("system", "Extract stock ticker symbols from the user's query. List them as comma-separated uppercase symbols like 'AAPL, TSLA, MSFT'. If no clear tickers, suggest common ones based on the query topic."),
                ("human", "User Query: {query}")
            ])

            result = (fallback_prompt | llm).invoke({"query": compiled_query})
            response_text = result.content if hasattr(result, 'content') else str(result)

            # Parse the response to extract tickers
            tickers = [t.strip().upper() for t in response_text.replace(',', ' ').split() if t.strip() and len(t.strip()) <= 5]
            print(f"-> Extracted tickers via LLM: {tickers}")
            return {"plan": tickers}

def finance_researcher_node(state: ResearchState) -> Dict[str, Any]:
    print("--- FINANCE RESEARCHER: Fetching Market Data ---")
    plan = state.get("plan",[])
    
    new_data =[]
    for ticker in plan:
        print(f"-> Fetching data for: {ticker}")
        info = get_stock_info(ticker)
        news = get_stock_news(ticker)
        new_data.append(f"### Data for {ticker}\n{info}\n{news}")
        
    return {"research_data": new_data}

def finance_reviewer_node(state: ResearchState) -> Dict[str, Any]:
    print("--- FINANCE REVIEWER: Writing Investment Report ---")
    query = state.get("query")
    research_data = state.get("research_data",[])

    llm = get_llm()
    compiled_research = "\n\n".join(research_data) if research_data else "No research data available."
    print(f"-> Compiled research length: {len(compiled_research)} characters")

    # Try structured output first (works with OpenAI/Gemini, may fail with Groq)
    try:
        structured_llm = llm.with_structured_output(ReviewerDecision)

        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a Senior Wall Street Analyst. Review the financial data provided. "
                       "If the data is sufficient, set 'is_complete' to True and write a professional "
                       "Investment Analysis Report in 'final_report' using Markdown. Include a Buy/Hold/Sell recommendation. "
                       "If data is missing, set 'is_complete' to False and provide feedback."),
            ("human", "Original Request: {query}\n\nMarket Data:\n{compiled_research}")
        ])

        decision = (prompt | structured_llm).invoke({"query": query, "compiled_research": compiled_research})
        print(f"-> Decision received. Is complete: {decision.is_complete}")

        if decision.is_complete:
            return {"final_report": decision.final_report, "revision_count": state.get("revision_count", 0) + 1}
        else:
            return {"feedback": decision.feedback, "revision_count": state.get("revision_count", 0) + 1}

    except Exception as e:
        print(f"-> ERROR with structured output: {e}")
        print(f"-> Falling back to regular text generation")

        # Fallback: generate report directly without structured output
        fallback_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a Senior Wall Street Analyst. Write a comprehensive Investment Analysis Report "
                       "based on the provided market data. Use Markdown formatting and include Buy/Hold/Sell recommendations "
                       "for each stock analyzed. Make it professional and data-driven."),
            ("human", "Original Request: {query}\n\nMarket Data:\n{compiled_research}")
        ])

        result = (fallback_prompt | llm).invoke({"query": query, "compiled_research": compiled_research})
        final_report = result.content if hasattr(result, 'content') else str(result)
        print("-> Fallback report generated successfully")

        return {"final_report": final_report, "revision_count": state.get("revision_count", 0) + 1}