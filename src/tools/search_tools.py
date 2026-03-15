# src/tools/search_tools.py

from tavily import TavilyClient
from src.core.config import settings

def perform_web_search(query: str, max_results: int = 3) -> str:
    """
    Executes a web search using Tavily and formats the results into a readable string.
    """
    if not settings.TAVILY_API_KEY:
        raise ValueError("TAVILY_API_KEY is missing from .env")
        
    client = TavilyClient(api_key=settings.TAVILY_API_KEY)
    
    try:
        # We use 'search' and extract the content directly
        response = client.search(
            query=query, 
            search_depth="advanced", # 'advanced' does a deeper scrape than 'basic'
            max_results=max_results
        )
        
        # Format the results into a clean string for the LLM to read
        results_str = f"Search Results for '{query}':\n\n"
        for result in response.get("results",[]):
            results_str += f"Title: {result['title']}\n"
            results_str += f"URL: {result['url']}\n"
            results_str += f"Content: {result['content']}\n"
            results_str += "-" * 50 + "\n"
            
        return results_str
        
    except Exception as e:
        return f"Error performing search for '{query}': {str(e)}"