import traceback
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.workflows.research_graph import research_graph_app
from src.workflows.finance_graph import finance_graph_app
from src.core.config import settings

# 1. Create a Router to group our endpoints
router = APIRouter()

# 2. Define the Request Schema (What the frontend sends us)
class ResearchRequest(BaseModel):
    query: str

# 3. Define the Response Schema (What we send back to the frontend)
class ResearchResponse(BaseModel):
    final_report: str
    iterations: int

@router.post("/research", response_model=ResearchResponse)
async def conduct_research(request: ResearchRequest):
    """
    Endpoint to trigger the Multi-Agent Research Workflow.
    """
    try:
        # 4. Initialize the LangGraph State
        initial_state = {
            "query": request.query,
            "revision_count": 0,
            "research_data": [],
            "plan":[],
            "feedback": "",
            "final_report": ""
        }
        
        # 5. Invoke the Graph (This runs the AI agents synchronously)
        print(f"--- API: Starting research for '{request.query}' ---")
        final_state = research_graph_app.invoke(initial_state)
        
        # 6. Extract the final report and return it
        return ResearchResponse(
            final_report=final_state.get("final_report", "Error: No report generated."),
            iterations=final_state.get("revision_count", 0)
        )
        
    except Exception as e:
        # If anything crashes in the agent workflow, print full traceback and return detailed 500 error
        error_details = traceback.format_exc()
        print("ERROR in research workflow:")
        print(error_details)

        # Check for common quota/rate limit errors and provide helpful messages
        error_str = str(e).lower()
        if "quota" in error_str or "rate limit" in error_str or "429" in error_str:
            user_friendly_error = (
                f"API quota exceeded. This happens when you reach the daily limit for your LLM provider. "
                f"Try again tomorrow, or switch to a different provider in your .env file. "
                f"Current provider: {settings.LLM_PROVIDER}. "
                f"Available alternatives: groq (generous free tier), openai (paid), gemini (limited free tier)."
            )
            raise HTTPException(status_code=429, detail=user_friendly_error)
        else:
            raise HTTPException(status_code=500, detail=error_details)

@router.post("/finance", response_model=ResearchResponse)
async def conduct_financial_analysis(request: ResearchRequest):
    """
    Endpoint to trigger the Financial Analyst Workflow.
    """
    try:
        initial_state = {
            "query": request.query,
            "revision_count": 0,
            "research_data": [],
            "plan":[],
            "feedback": "",
            "final_report": ""
        }
        
        print(f"--- API: Starting financial analysis for '{request.query}' ---")
        # Notice we call finance_graph_app here instead of research_graph_app
        final_state = finance_graph_app.invoke(initial_state)
        
        return ResearchResponse(
            final_report=final_state.get("final_report", "Error: No report generated."),
            iterations=final_state.get("revision_count", 0)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))