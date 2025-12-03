from pydantic import BaseModel
from typing import Optional, List
from .player import Player


class BidHistory(BaseModel):
    teamId: int
    amount: int
    timestamp: int


class LastBid(BaseModel):
    amount: int
    teamId: int
    teamName: str
    timestamp: int


class AuctionState(BaseModel):
    currentIndex: int
    currentPlayer: Optional[Player] = None
    auctionStarted: bool
    auctionPaused: bool
    currentBid: int
    currentBidder: Optional[int] = None
    bidHistory: List[BidHistory] = []
    lastBid: Optional[LastBid] = None
    lastUpdate: int


class PlaceBidRequest(BaseModel):
    teamId: int
    amount: int


class PlaceBidResponse(BaseModel):
    success: bool
    message: str


class MarkSoldRequest(BaseModel):
    playerId: int
    teamId: int
    price: int


class MarkUnsoldRequest(BaseModel):
    playerId: int
