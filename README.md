
# 👁️ Project Argus Lite

## 📖 Overview
**Project Argus Lite** is a production-ready, multi-agent AI system built to autonomously plan, execute, and synthesize complex research and financial analysis. 

Instead of relying on unpredictable AI loops, Argus uses **State-Machine orchestration (LangGraph)** to deterministically route tasks between specialized AI personas (Planner, Researcher, Reviewer). The backend is a fully containerized **FastAPI** microservice, making it highly scalable and ready for enterprise frontends.

## 🏗️ Architecture & Tech Stack
* **Orchestration:** LangGraph (Stateful, cyclic agent routing)
* **Backend API:** FastAPI (Application Factory Pattern, Pydantic validation)
* **LLM Layer:** OpenAI / Gemini / Groq / Ollama (Abstracted via Factory Pattern)
* **Data Tools:** Tavily Search API (Web scraping), `yfinance` (Market data)
* **Frontend:** Next.js
* **Infrastructure:** Docker & Docker Compose

## ✨ Features
1. **General Research Engine:** Agents break down a query, search the web, summarize findings, and compile a factual Markdown report.
2. **Financial Analyst Engine:** Agents extract stock tickers, fetch live market data/news, and write professional investment recommendations.
3. **Fail-Safe Routing:** Reviewer agents evaluate research quality and trigger recursive loops if critical data is missing (capped at a max-revision limit to prevent infinite loops).

## 🚀 Quick Start (Local Development)

Project Argus Lite is fully containerized. You do not need to install Python dependencies manually.

**1. Clone the repository and set up your environment variables:**
```bash
git clone https://github.com/yourusername/project-argus-lite.git
cd project-argus-lite
cp .env.example .env

cd ui/argus-lite-ui
npm install
```
*(Add your OpenAI, Groq, Gemini and/or Tavily API keys to the `.env` file).*

**2. Spin up the microservices using Docker:**
```bash
docker-compose up --build
```
```bash
python main.py on root directory
npm run dev in ui/argus-lite-ui
```
**3. Access the applications:**
* **Frontend UI:** `http://localhost:8501`
* **FastAPI Swagger Docs:** `http://localhost:8000/docs`

## 🧠 Why this Architecture?
Project Argus utilizes the **Strategy Pattern** for AI. The LangGraph State schema and routing logic remain 100% agnostic to the task. Adding a new capability (e.g., a "Legal Analysis Engine") simply requires writing new Tools and Prompts, without altering the underlying core infrastructure. 
