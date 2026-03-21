# src/agents/formatter.py

from typing import Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from src.core.llm_factory import get_llm
from src.state.state import ResearchState

def formatter_node(state: ResearchState) -> Dict[str, Any]:
    print("--- FORMATTING AGENT: Applying UI/UX Markdown ---")
    
    final_report = state.get("final_report", "")
    
    if not final_report:
        print("-> Warning: No final report to format")
        return {"final_report": ""}
    
    print(f"-> Report length: {len(final_report)} characters")
    
    llm = get_llm()
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an Expert UI/UX Copywriter. Take the provided draft report and format it into "
                   "beautiful, highly readable Markdown. \n"
                   "REQUIREMENTS:\n"
                   "- Add an 'Executive Summary' at the top.\n"
                   "- Use H2 (##) and H3 (###) headers.\n"
                   "- Bold key terms, companies, and metrics.\n"
                   "- Do NOT change the factual meaning of the text, only the formatting."),
        ("human", "Draft Report:\n{final_report}")
    ])
    
    try:
        result = (prompt | llm).invoke({"final_report": final_report})
        formatted_content = result.content if hasattr(result, 'content') else str(result)
        print("-> Formatting completed successfully")
        return {"final_report": formatted_content}
    except Exception as e:
        print(f"-> ERROR during formatting: {e}")
        print(f"-> Returning unformatted report")
        return {"final_report": final_report}