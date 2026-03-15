# src/workflows/research_graph.py

from langgraph.graph import StateGraph, END
from src.state.state import ResearchState
from src.agents.planner import planner_node
from src.agents.researcher import researcher_node
from src.agents.reviewer import reviewer_node

# 1. The Router Function
# This function looks at the State after the Reviewer finishes.
# It tells LangGraph which edge to take next.
def route_after_reviewer(state: ResearchState) -> str:
    """Decides whether to end the process or loop back to the Planner."""
    if state.get("final_report"):
        return "end"
    else:
        return "planner"

def build_research_graph():
    """
    Assembles the Multi-Agent Research Graph.
    """
    # 2. Initialize the Graph with our State Schema
    workflow = StateGraph(ResearchState)
    
    # 3. Add all our Agent Nodes
    workflow.add_node("planner", planner_node)
    workflow.add_node("researcher", researcher_node)
    workflow.add_node("reviewer", reviewer_node)
    
    # 4. Define the Standard Edges (the straight paths)
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "researcher")
    workflow.add_edge("researcher", "reviewer")
    
    # 5. Define the Conditional Edge (the fork in the road)
    # After the 'reviewer' node, run 'route_after_reviewer'.
    # If it returns "end", go to the END node. If "planner", go to the planner node.
    workflow.add_conditional_edges(
        "reviewer",
        route_after_reviewer,
        {
            "end": END,
            "planner": "planner"
        }
    )
    
    # 6. Compile the graph into an executable application
    return workflow.compile()

# Instantiate the graph so it can be imported by our API later
research_graph_app = build_research_graph()