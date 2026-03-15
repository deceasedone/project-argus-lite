# main.py

import uvicorn

if __name__ == "__main__":
    # Point uvicorn to the app object inside src/api/server.py
    # reload=True automatically restarts the server when you save a file!
    uvicorn.run("src.api.server:app", host="0.0.0.0", port=8000, reload=True)