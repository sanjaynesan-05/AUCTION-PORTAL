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
        
        # All users use the same password for development/testing
        default_password = "auction123"
        
        # Get all users
        users = db.query(User).all()
        if not users:
            return {"status": "info", "message": "No users found in database", "updated": 0}
        
        # Reset each user's password
        updated = 0
        for user in users:
            try:
                hashed = pwd_context.hash(default_password)
                user.password_hash = hashed
                updated += 1
            except Exception as user_error:
                print(f"Error hashing password for user {user.username}: {user_error}")
                continue
        
        # Commit all changes
        db.commit()
        
        return {
            "status": "success",
            "message": f"Reset {updated} user passwords to 'auction123'",
            "updated": updated,
            "total_users": len(users),
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
        try:
            db.rollback()
        except:
            pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error resetting passwords: {str(e)}"
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
