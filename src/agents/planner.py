# src/agents/planner.py

from pydantic import BaseModel, Field
from typing import List, Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from src.core.llm_factory import get_llm
from src.state.state import ResearchState

# 1. Define the Structured Output Schema
class ResearchPlan(BaseModel):
    """Schema for the research plan output."""
    steps: List[str] = Field(
        description="A step-by-step list of search queries or tasks to execute to answer the user's query fully."
    )

def planner_node(state: ResearchState) -> Dict[str, Any]:
    """
    The Planner Agent: Breaks down the user's complex query into a systematic research plan.
    """
    print("--- PLANNER AGENT: Generating Research Plan ---")
    
    query = state.get("query")
    feedback = state.get("feedback")
    
    # 2. Get our LLM and bind the structured output schema
    llm = get_llm()
    structured_llm = llm.with_structured_output(ResearchPlan)
    
    # 3. Create the System Prompt
    system_instructions = """You are an expert Research Director. 
    Your goal is to take a complex user query and break it down into a list of 3 to 5 highly 
    targeted, actionable search queries. These queries will be handed to a Web Researcher Agent.
    
    Make the queries specific enough to yield high-quality, factual web results."""
    
    # If the Reviewer sent the Planner back for a revision, include the feedback.
    if feedback:
        system_instructions += f"\n\nNOTE: The previous plan was insufficient. Feedback: {feedback}"
        
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_instructions),
        ("human", "User Query: {query}")
    ])
    
    # 4. Chain the prompt and the LLM together
    chain = prompt | structured_llm
    
    # 5. Execute the chain
    result: ResearchPlan = chain.invoke({"query": query})
    
    # 6. Return the dictionary to update the State's 'plan' field
    # LangGraph will automatically take this dictionary and update the state.
    return {"plan": result.steps}