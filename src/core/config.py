# src/core/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # LLM Provider Toggle (e.g., "openai", "groq", or "gemini")
    # Groq is recommended for higher rate limits and better free tier
    LLM_PROVIDER: str = "groq"
    MODEL_NAME: str = "llama-3.1-8b-instant"
    
    # API Keys
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    TAVILY_API_KEY: Optional[str] = None

    # Load from the .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

# Instantiate the settings object so it can be imported across the app
settings = Settings()