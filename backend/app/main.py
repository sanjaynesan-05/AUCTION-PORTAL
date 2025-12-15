from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import endpoints, websocket, system, admin, public
from app.database import init_db, SessionLocal
from app.models.seed import safe_seed_database
from app.config import API_TITLE, API_DESCRIPTION, API_VERSION
from sqlalchemy.orm import Session
import sys
import os

# Initialize database on startup (skip if in test mode)
if "pytest" not in sys.modules:
    try:
        init_db()
        db = SessionLocal()
        safe_seed_database(db)
        db.close()
    except Exception as e:
        print(f"Database initialization error: {e}")

# Create FastAPI app
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION
)

# Configure CORS - Allow all origins for development/testing
# In production, replace ["*"] with specific domain list
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for multi-device testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(endpoints.router)  # Auth endpoints
app.include_router(admin.router)  # Admin-only auction control
app.include_router(public.router)  # Public read-only auction data
app.include_router(websocket.router)  # WebSocket broadcast
app.include_router(system.router)  # System utilities


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "IPL Auction Portal API",
        "version": API_VERSION,
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Server running on 0.0.0.0:{port}")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    )
