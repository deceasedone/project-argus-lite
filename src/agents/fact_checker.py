# src/agents/fact_checker.py

from typing import Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from src.core.llm_factory import get_llm
from src.state.state import ResearchState

def fact_checker_node(state: ResearchState) -> Dict[str, Any]:
    print("--- FACT CHECKER AGENT: Verifying Raw Data ---")
    
    research_data = state.get("research_data",[])
    
    # If no data yet, just pass
    if not research_data:
        print("-> No research data to fact-check")
        return {"research_data":[]}

    llm = get_llm()
    compiled_research = "\n\n".join(research_data)
    print(f"-> Fact-checking {len(research_data)} research items ({len(compiled_research)} chars)")
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a strict Fact-Checker. Read the raw research data. "
                   "Remove any fluff, opinions, or irrelevant web-scraping artifacts. "
                   "Output ONLY a clean, consolidated list of verified facts, statistics, and highly relevant points."),
        ("human", "Raw Research:\n{compiled_research}")
    ])
    
    try:
        result = (prompt | llm).invoke({"compiled_research": compiled_research})
        checked_content = result.content if hasattr(result, 'content') else str(result)
        print(f"-> Fact-checking completed ({len(checked_content)} chars)")
        
        # We OVERWRITE the messy research data with our clean, fact-checked data
        return {"research_data": [checked_content]}
    except Exception as e:
        print(f"-> ERROR during fact-checking: {e}")
        print(f"-> Returning original research data")
        return {"research_data": research_data}