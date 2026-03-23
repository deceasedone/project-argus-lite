from typing import Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from src.core.llm_factory import get_llm
from src.state.state import ResearchState
from src.tools.search_tools import perform_web_search

def researcher_node(state: ResearchState) -> Dict[str, Any]:
    """
    The Researcher Agent: Executes the research plan by searching the web
    and summarizing the findings for each step.
    """
    print("--- RESEARCHER AGENT: Executing Search Plan ---")
    
    plan = state.get("plan",[])
    llm = get_llm()
    
    new_research_data =[]
    
    # Prompt to summarize the raw search results
    summarize_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Research Analyst. Read the raw search results provided. "
                   "Extract and summarize the most factual, relevant, and important information "
                   "that answers the research goal. Cite the URLs where possible."),
        ("human", "Research Goal: {goal}\n\nRaw Search Results:\n{raw_data}")
    ])
    
    summarize_chain = summarize_prompt | llm
    
    # Iterate through the planner's steps
    for step in plan:
        print(f"-> Searching for: {step}")
        
        # 1. Call the Tavily Search Tool
        raw_search_results = perform_web_search(query=step)
        
        # 2. Ask the LLM to summarize the raw HTML/text into a neat research note
        summary_response = summarize_chain.invoke({
            "goal": step,
            "raw_data": raw_search_results
        })
        
        # 3. Store the summarized finding
        # summary_response.content contains the actual text from the LLM
        new_research_data.append(f"### Research on: {step}\n{summary_response.content}")
        
    # Return the new data. LangGraph will APPEND this to the existing 'research_data' list
    # because we used `Annotated[List[str], operator.add]` in our state.py!
    return {"research_data": new_research_data}