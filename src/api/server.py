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
        allow_origins=["*"],   # Allows any frontend (Vercel, localhost) to connect
        allow_credentials=False, # MUST BE FALSE when using "*" for origins
        allow_methods=["*"],   
        allow_headers=["*"],   
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