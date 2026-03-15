# src/agents/finance_agents.py

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
    llm = get_llm().with_structured_output(ResearchPlan)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a Financial Planner. Extract the stock ticker symbols from the user's query. "
                   "Output a plan where each step is simply the uppercase TICKER symbol (e.g., 'AAPL', 'TSLA')."),
        ("human", "User Query: {query}")
    ])
    
    result = prompt | llm
    return {"plan": result.invoke({"query": query}).steps}

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
    
    llm = get_llm().with_structured_output(ReviewerDecision)
    compiled_research = "\n\n".join(research_data)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a Senior Wall Street Analyst. Review the financial data provided. "
                   "If the data is sufficient, set 'is_complete' to True and write a professional "
                   "Investment Analysis Report in 'final_report' using Markdown. Include a Buy/Hold/Sell recommendation. "
                   "If data is missing, set 'is_complete' to False and provide feedback."),
        ("human", "Original Request: {query}\n\nMarket Data:\n{compiled_research}")
    ])
    
    decision = (prompt | llm).invoke({"query": query, "compiled_research": compiled_research})
    
    if decision.is_complete:
        return {"final_report": decision.final_report, "revision_count": state.get("revision_count", 0) + 1}
    else:
        return {"feedback": decision.feedback, "revision_count": state.get("revision_count", 0) + 1}