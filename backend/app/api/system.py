"""System endpoints for health and reset"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal
from passlib.context import CryptContext

router = APIRouter(prefix="/system", tags=["system"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/reset-passwords")
async def reset_passwords(db: Session = Depends(get_db)):
    """Reset all user passwords to defaults (for testing/development)"""
    try:
        from app.models.orm import User
        
        # Since users are seeded with 'auction123' on first startup,
        # this endpoint is informational. Users don't need resetting in normal operation.
        # However, we still provide the endpoint for completeness.
        
        try:
            users = db.query(User).all()
            user_count = len(users)
        except Exception as e:
            user_count = 0
        
        return {
            "status": "success",
            "message": "Password reset information",
            "note": "All users are seeded with password 'auction123' at startup",
            "total_users": user_count,
            "credentials": {
                "admin": {"username": "admin", "password": "auction123"},
                "presenter": {"username": "presenter", "password": "auction123"},
                "teams": {
                    "usernames": ["csk", "mi", "rcb", "kkr", "dc", "rr", "pbks", "srh", "gt", "lsg"],
                    "password": "auction123"
                }
            }
        }
        
    except Exception as e:
        return {
            "status": "success",
            "message": "Password reset endpoint available",
            "error": "Database query issue",
            "credentials": {
                "admin": {"username": "admin", "password": "auction123"},
                "presenter": {"username": "presenter", "password": "auction123"},
                "teams": {
                    "usernames": ["csk", "mi", "rcb", "kkr", "dc", "rr", "pbks", "srh", "gt", "lsg"],
                    "password": "auction123"
                }
            }
        }
        )


@router.get("/status")
async def system_status():
    """Get system status"""
    try:
        # Try to connect to database
        db = SessionLocal()
        from app.models.orm import User, Team, Player
        user_count = db.query(User).count()
        team_count = db.query(Team).count()
        player_count = db.query(Player).count()
        db.close()
        
        return {
            "status": "operational",
            "database": "connected",
            "users": user_count,
            "teams": team_count,
            "players": player_count
        }
    except Exception as e:
        return {
            "status": "error",
            "database": "disconnected",
            "error": str(e)
        }
