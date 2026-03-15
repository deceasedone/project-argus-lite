# src/api/server.py

from fastapi import FastAPI
from src.api.routes import router

def create_app() -> FastAPI:
    """Factory function to initialize and configure the FastAPI application."""
    app = FastAPI(
        title="Multi-Agent AI Engine",
        description="API for routing complex queries to specialized autonomous AI agents.",
        version="2.0.0"
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