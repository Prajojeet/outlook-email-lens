
"""
Local development script for testing the Email Comparison API
Run this file to start the server locally on http://localhost:8000
"""

import uvicorn
from main import app

if __name__ == "__main__":
    print("Starting Email Comparison API locally...")
    print("API will be available at: http://localhost:8000")
    print("Health check: http://localhost:8000/health")
    print("API endpoint: http://localhost:8000/compare")
    print("\nPress Ctrl+C to stop the server")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000, 
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )
