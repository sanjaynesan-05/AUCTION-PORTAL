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
        
        default_password = "auction123"
        
        # Get all users
        users = db.query(User).all()
        if not users:
            return {
                "status": "info",
                "message": "No users found in database",
                "updated": 0,
                "total_users": 0
            }
        
        # Reset each user's password with error handling
        updated = 0
        errors = []
        
        for user in users:
            try:
                hashed_pwd = pwd_context.hash(default_password)
                user.password_hash = hashed_pwd
                updated += 1
            except Exception as e:
                errors.append(f"User {user.username}: {str(e)}")
                continue
        
        # Try to commit
        try:
            db.commit()
        except Exception as commit_error:
            db.rollback()
            return {
                "status": "error",
                "message": "Failed to commit password changes",
                "updated": 0,
                "error": str(commit_error)
            }
        
        response = {
            "status": "success",
            "message": f"Successfully reset {updated}/{len(users)} user passwords to 'auction123'",
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
        
        if errors:
            response["errors"] = errors
        
        return response
        
    except Exception as e:
        try:
            db.rollback()
        except:
            pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error resetting passwords: {str(e)}"
        )
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
