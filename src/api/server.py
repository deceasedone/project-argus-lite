# src/api/server.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import router

def create_app() -> FastAPI:
    """Factory function to initialize and configure the FastAPI application."""
    app = FastAPI(
        title="Multi-Agent AI Engine",
        description="API for routing complex queries to specialized autonomous AI agents.",
        version="2.0.0"
    )

    # Add CORS middleware to handle cross-origin requests from the frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins (for development)
        allow_credentials=True,
        allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
        allow_headers=["*"],  # Allow all headers
    )

    # Register our endpoints (/research and /finance)
    app.include_router(router, prefix="/api/v1")

    # A simple health check endpoint
    @app.get("/")
    def health_check():
        return {"status": "ok", "message": "Multi-Agent System is online."}

    return app

# Instantiate the app
app = create_app()