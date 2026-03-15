# ui/app.py

import streamlit as st
import requests
from components import render_sidebar

# API URLs
RESEARCH_API_URL = "http://localhost:8000/api/v1/research"
FINANCE_API_URL = "http://localhost:8000/api/v1/finance"

st.set_page_config(page_title="AI Multi-Agent System", page_icon="🤖", layout="wide")

# 1. Render Sidebar and get User Choice
engine_choice = render_sidebar()

# 2. Dynamic UI based on choice
if engine_choice == "General Research":
    st.title("🌐 General Web Research Engine")
    st.markdown("Asks specialized agents to scrape the web and compile a factual report.")
    placeholder_text = "e.g., What are the latest advancements in solid-state batteries?"
    target_api = RESEARCH_API_URL
else:
    st.title("📈 Financial Analyst Engine")
    st.markdown("Asks specialized Wall Street agents to pull live market data and news, outputting an investment report.")
    placeholder_text = "e.g., Analyze AAPL and MSFT recent performance and news."
    target_api = FINANCE_API_URL

# 3. User Input
query = st.text_input("Enter your query:", placeholder=placeholder_text)

if st.button("Run Engine"):
    if not query:
        st.warning("Please enter a query.")
    else:
        with st.spinner(f"Agents are running the {engine_choice} pipeline... ⏳"):
            try:
                # Dynamically hit the correct API endpoint
                response = requests.post(target_api, json={"query": query})
                
                if response.status_code == 200:
                    data = response.json()
                    st.success(f"Analysis Complete! (Took {data['iterations']} iterations)")
                    st.markdown("---")
                    st.markdown(data['final_report'])
                else:
                    st.error(f"Backend Error: {response.text}")
                    
            except requests.exceptions.ConnectionError:
                st.error("Failed to connect to the backend. Is FastAPI running on port 8000?")