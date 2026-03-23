# main.py

import uvicorn
import os

if __name__ == "__main__":
    # Render assigns a dynamic port via the PORT environment variable.
    # Default to 8000 for local development if PORT is not set.
    port = int(os.environ.get("PORT", 8000))
    
    # We remove reload=True for production safety!
    uvicorn.run("src.api.server:app", host="0.0.0.0", port=port)