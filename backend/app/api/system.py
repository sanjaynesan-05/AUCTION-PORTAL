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
        
        password_map = {
            "admin": "admin123",
            "presenter": "presenter123",
            "csk": "team123",
            "mi": "team123",
            "rcb": "team123",
            "kkr": "team123",
            "dc": "team123",
            "rr": "team123",
            "pbks": "team123",
            "srh": "team123",
            "gt": "team123",
            "lsg": "team123"
        }
        
        users = db.query(User).all()
        updated = 0
        
        for user in users:
            if user.username in password_map:
                user.password_hash = pwd_context.hash(password_map[user.username])
                updated += 1
        
        db.commit()
        
        return {
            "status": "success",
            "message": f"Reset {updated} user passwords",
            "credentials": {
                "admin": {"username": "admin", "password": "admin123"},
                "presenter": {"username": "presenter", "password": "presenter123"},
                "teams": {"usernames": ["csk", "mi", "rcb", "kkr", "dc", "rr", "pbks", "srh", "gt", "lsg"], "password": "team123"}
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {str(e)}"
        )
