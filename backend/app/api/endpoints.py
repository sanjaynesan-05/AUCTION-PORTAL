from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.schemas import UserLogin, Token, UserResponse
from app.models.orm import User
from app.database import get_db
from app.api.auth import create_access_token, verify_password
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return JWT token
    """
    # Find user in database
    user = db.query(User).filter(User.username == user_data.username).first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}
    )
    
    # Create user response
    user_response = UserResponse(
        id=user.id,
        username=user.username,
        role=user.role,
        teamId=user.team_id,
        teamName=user.team_name
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


@router.post("/logout")
async def logout():
    """
    Logout user (client-side token removal)
    """
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = None, db: Session = Depends(get_db)):
    """
    Get current authenticated user
    """
    user = db.query(User).filter(User.username == current_user.get("sub")).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=user.id,
        username=user.username,
        role=user.role,
        teamId=user.team_id,
        teamName=user.team_name
    )
