# src/agents/reviewer.py

from pydantic import BaseModel, Field
from typing import Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from src.core.llm_factory import get_llm
from src.state.state import ResearchState

# 1. Structured Output Schema for the Reviewer's Decision
class ReviewerDecision(BaseModel):
    is_complete: bool = Field(
        description="True if the research is sufficient to answer the user's query fully. False if vital information is missing."
    )
    feedback: str = Field(
        description="If is_complete is False, provide specific feedback on what is missing so the Planner can create a new search plan."
    )
    final_report: str = Field(
        description="If is_complete is True, write the final, comprehensive, and well-formatted Markdown report. Leave empty if False."
    )

def reviewer_node(state: ResearchState) -> Dict[str, Any]:
    """
    The Reviewer Agent: Evaluates the research. Either outputs a final report, 
    or sends feedback to trigger another research iteration.
    """
    print("--- REVIEWER AGENT: Evaluating Research ---")
    
    query = state.get("query")
    research_data = state.get("research_data",[])
    
    # Track how many times we've looped to prevent infinite LLM costs
    current_revisions = state.get("revision_count", 0)
    MAX_REVISIONS = 2
    
    llm = get_llm()
    structured_llm = llm.with_structured_output(ReviewerDecision)
    
    # 2. Compile the research into a single string for the LLM to read
    compiled_research = "\n\n".join(research_data)
    
    # 3. If we hit the loop limit, FORCE the LLM to write the report with what it has.
    if current_revisions >= MAX_REVISIONS:
        print(f"-> Max revisions ({MAX_REVISIONS}) reached. Forcing final report generation.")
        force_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an Expert Editor. You must write a comprehensive final report in Markdown "
                       "based ONLY on the provided research. You cannot ask for more information."),
            ("human", "Original Query: {query}\n\nResearch Data:\n{compiled_research}")
        ])
        # We don't use the structured output here because we just want a big text string
        report_chain = force_prompt | llm
        result = report_chain.invoke({"query": query, "compiled_research": compiled_research})
        
        return {
            "final_report": result.content,
            "revision_count": current_revisions + 1
        }
    
    # 4. Normal evaluation flow
    evaluation_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an Expert Editor and Fact Checker. Compare the Research Data against the Original Query. "
                   "If the research data fully answers the query, set 'is_complete' to True and write a detailed, "
                   "professional Markdown report in 'final_report'.\n"
                   "If critical information is missing, set 'is_complete' to False and write actionable "
                   "instructions in 'feedback' for the researcher to find the missing gaps."),
        ("human", "Original Query: {query}\n\nResearch Data:\n{compiled_research}")
    ])
    
    eval_chain = evaluation_prompt | structured_llm
    decision: ReviewerDecision = eval_chain.invoke({"query": query, "compiled_research": compiled_research})
    
    # 5. Update State based on the LLM's decision
    if decision.is_complete:
        print("-> Research complete! Generating final report.")
        return {
            "final_report": decision.final_report,
            "revision_count": current_revisions + 1
        }
    else:
        print(f"-> Research incomplete. Feedback: {decision.feedback}")
        return {
            "feedback": decision.feedback,
            "revision_count": current_revisions + 1
        }