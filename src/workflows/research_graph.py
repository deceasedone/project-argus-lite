# src/workflows/research_graph.py

from langgraph.graph import StateGraph, END
from src.state.state import ResearchState
from src.agents.planner import planner_node
from src.agents.researcher import researcher_node
from src.agents.reviewer import reviewer_node
from src.agents.fact_checker import fact_checker_node
from src.agents.formatter import formatter_node

# 1. The Router Function
# This function looks at the State after the Reviewer finishes.
# It tells LangGraph which edge to take next.
def route_after_reviewer(state: ResearchState) -> str:
    """Decides whether to format the report or loop back to the Planner."""
    if state.get("final_report"):
        return "formatter"
    else:
        return "planner"

def build_research_graph():
    """
    Assembles the Multi-Agent Research Graph.
    """
    # 2. Initialize the Graph with our State Schema
    workflow = StateGraph(ResearchState)
    
    # 3. Add all our 5 Agent Nodes
    workflow.add_node("planner", planner_node)
    workflow.add_node("researcher", researcher_node)
    workflow.add_node("fact_checker", fact_checker_node)
    workflow.add_node("reviewer", reviewer_node)
    workflow.add_node("formatter", formatter_node)
    
    # 4. Define the Standard Edges (the straight paths)
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "researcher")
    workflow.add_edge("researcher", "fact_checker")
    workflow.add_edge("fact_checker", "reviewer")
    
    # 5. Define the Conditional Edge (the fork in the road)
    workflow.add_conditional_edges(
        "reviewer",
        route_after_reviewer,
        {
            "formatter": "formatter",
            "planner": "planner"
        }
    )
    
    # 6. Final Edge: Formatter ends the process
    workflow.add_edge("formatter", END)
    
    # 7. Compile the graph into an executable application
    return workflow.compile()

# Instantiate the graph so it can be imported by our API later
research_graph_app = build_research_graph()