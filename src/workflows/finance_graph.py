# src/workflows/finance_graph.py

from langgraph.graph import StateGraph, END
from src.state.state import ResearchState
from src.workflows.research_graph import route_after_reviewer # Reusing our router!
from src.agents.finance_agents import finance_planner_node, finance_researcher_node, finance_reviewer_node

def build_finance_graph():
    workflow = StateGraph(ResearchState)
    
    workflow.add_node("planner", finance_planner_node)
    workflow.add_node("researcher", finance_researcher_node)
    workflow.add_node("reviewer", finance_reviewer_node)
    
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "researcher")
    workflow.add_edge("researcher", "reviewer")
    
    workflow.add_conditional_edges(
        "reviewer",
        route_after_reviewer, # Reusing the exact same routing logic!
        {"end": END, "planner": "planner"}
    )
    
    return workflow.compile()

finance_graph_app = build_finance_graph()