"""
Admin endpoint to reset users (for development/testing only)
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.orm import User
from app.models.seed import seed_users

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/reset-users", tags=["admin"])
async def reset_users(db: Session = Depends(get_db)):
    """
    Reset all users to default credentials (DEVELOPMENT ONLY)
    WARNING: This deletes all existing users and reseeds with defaults
    """
    try:
        # Delete all users
        db.query(User).delete()
        db.commit()
        
        # Reseed users with defaults
        seed_users(db)
        
        return {
            "message": "Users reset successfully",
            "credentials": {
                "admin": {"username": "admin", "password": "admin123", "role": "admin"},
                "presenter": {"username": "presenter", "password": "presenter123", "role": "presenter"},
                "teams": {"usernames": ["csk", "mi", "rcb", "kkr", "dc", "rr", "pbks", "srh", "gt", "lsg"], "password": "team123", "role": "viewer"}
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reset users: {str(e)}"
        )
