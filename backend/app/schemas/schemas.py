from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class TeamBase(BaseModel):
    name: str
    code: str
    purse_balance: float = 120000000.0
    total_points: int = 0
    players_count: int = 0

class TeamCreate(TeamBase):
    pass

class TeamResponse(TeamBase):
    id: UUID
    class Config:
        from_attributes = True

class PlayerBase(BaseModel):
    name: str
    role: str
    nationality: str = "India"
    age: Optional[int] = None
    image: Optional[str] = None
    set_number: int = 1
    set_name: str = "Marquee Players"
    base_price: int = 20
    sold_price: Optional[float] = None

class PlayerCreate(PlayerBase):
    points: int = 0

class PlayerResponse(PlayerBase):
    id: UUID
    is_sold: bool = False
    team_id: Optional[UUID] = None
    points: int = 0
    class Config:
        from_attributes = True

class BidBase(BaseModel):
    amount: float

class BidResponse(BidBase):
    id: UUID
    player_id: UUID
    team_id: UUID
    timestamp: datetime
    class Config:
        from_attributes = True

class AuctionStateResponse(BaseModel):
    status: str
    current_player_id: Optional[UUID]
    current_bid: float
    current_bidder_id: Optional[UUID]
    remaining_players_count: int
    version: int
    class Config:
        from_attributes = True

class BidRequest(BaseModel):
    team_id: Optional[UUID] = None
    amount: float
