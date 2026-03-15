# ui/components.py
import streamlit as st

def render_sidebar():
    """Renders the sidebar for engine selection."""
    with st.sidebar:
        st.title("⚙️ Engine Configuration")
        st.markdown("Select the autonomous engine you wish to use.")
        
        engine_choice = st.radio(
            "Select Engine:",
            options=["General Research", "Financial Analysis"],
            index=0
        )
        
        st.markdown("---")
        st.markdown("**Powered by:**")
        st.markdown("- LangGraph\n- FastAPI\n- Llama-3 / GPT-4o\n- Tavily & yFinance")
        
        return engine_choice