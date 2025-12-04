"""Simple endpoint to reset users - can be called from anywhere"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from passlib.context import CryptContext

router = APIRouter(prefix="/system", tags=["system"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/reset-passwords")
async def reset_passwords(db: Session = Depends(get_db)):
    """Reset all user passwords to defaults (for testing/development)"""
    try:
        from app.models.orm import User
        
        # All users use the same password for development/testing
        # This is < 72 chars to avoid bcrypt truncation
        default_password = "auction123"
        
        users = db.query(User).all()
        updated = 0
        
        for user in users:
            user.password_hash = pwd_context.hash(default_password)
            updated += 1
        
        db.commit()
        
        return {
            "status": "success",
            "message": f"Reset {updated} user passwords to 'auction123'",
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
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {str(e)}"
        )
