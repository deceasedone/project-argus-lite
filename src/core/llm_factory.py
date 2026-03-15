# src/core/llm_factory.py

from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from src.core.config import settings

def get_llm():
    """Factory function to initialize and return the selected LLM."""
    
    if settings.LLM_PROVIDER.lower() == "openai":
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is missing in .env")
        return ChatOpenAI(
            model=settings.MODEL_NAME, 
            temperature=0.1,
            api_key=settings.OPENAI_API_KEY
        )
        
    elif settings.LLM_PROVIDER.lower() == "groq":
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is missing in .env")
        return ChatGroq(
            model=settings.MODEL_NAME, 
            temperature=0.1,
            api_key=settings.GROQ_API_KEY
        )
        
    else:
        raise ValueError(f"Unsupported LLM_PROVIDER: {settings.LLM_PROVIDER}")