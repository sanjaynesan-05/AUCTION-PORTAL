from pydantic import BaseModel
from typing import Optional


class PlayerStats(BaseModel):
    matches: Optional[int] = 0
    runs: Optional[int] = 0
    wickets: Optional[int] = 0
    average: Optional[float] = 0.0
    strikeRate: Optional[float] = 0.0


class PlayerBase(BaseModel):
    name: str
    role: str
    basePrice: int
    nationality: str
    age: int
    battingStyle: Optional[str] = None
    bowlingStyle: Optional[str] = None
    image: str
    stats: Optional[PlayerStats] = None


class PlayerCreate(PlayerBase):
    pass


class PlayerUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    basePrice: Optional[int] = None
    nationality: Optional[str] = None
    age: Optional[int] = None
    battingStyle: Optional[str] = None
    bowlingStyle: Optional[str] = None
    image: Optional[str] = None
    stats: Optional[PlayerStats] = None


class Player(PlayerBase):
    id: int
    sold: bool = False
    teamId: Optional[int] = None
    price: Optional[int] = None

    class Config:
        from_attributes = True
