"""
FastAPI main server for IPL Auction Portal
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to Python path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Lifespan handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 IPL Auction Portal Backend is starting...")
    yield
    # Shutdown
    print("🛑 IPL Auction Portal Backend is shutting down...")

# Create FastAPI app
app = FastAPI(
    title="IPL Auction Portal API",
    description="Backend API for IPL Auction Management System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "IPL Auction Portal API",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "IPL Auction Portal Backend",
        "database": "PostgreSQL (NEON)",
        "timestamp": "2026-01-08"
    }

# Import routes (once created)
from routes import teams, players, auction
app.include_router(teams.router, prefix="/api/teams", tags=["Teams"])
app.include_router(players.router, prefix="/api/players", tags=["Players"])
app.include_router(auction.router, prefix="/api/auction", tags=["Auction"])

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "error": exc.detail,
        "status_code": exc.status_code
    }

if __name__ == "__main__":
    PORT = int(os.getenv("PORT", 8000))
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    
    print(f"\n✨ Starting FastAPI server on port {PORT}")
    print(f"📍 Environment: {ENVIRONMENT}")
    print(f"📚 API Docs: http://localhost:{PORT}/docs\n")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=PORT,
        reload=ENVIRONMENT == "development"
    )
