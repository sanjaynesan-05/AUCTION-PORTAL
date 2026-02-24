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
    base_price: float
    points: int = 0

class PlayerCreate(PlayerBase):
    pass

class PlayerResponse(PlayerBase):
    id: UUID
    sold_price: Optional[float] = None
    is_sold: bool = False
    team_id: Optional[UUID] = None
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
