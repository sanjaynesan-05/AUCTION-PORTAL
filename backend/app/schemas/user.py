from pydantic import BaseModel
from typing import Optional, Literal


class UserBase(BaseModel):
    username: str
    role: Literal['admin', 'presenter', 'viewer']
    teamId: Optional[int] = None
    teamName: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
