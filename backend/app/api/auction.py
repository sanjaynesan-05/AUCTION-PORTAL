from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas import (
    Player, Team, AuctionState,
    PlaceBidRequest, PlaceBidResponse, MarkSoldRequest, MarkUnsoldRequest
)
from app.models.orm import (
    Player as PlayerORM, Team as TeamORM, AuctionState as AuctionStateORM, 
    BidHistory as BidHistoryORM
)
from app.database import get_db
from datetime import datetime
import time

router = APIRouter(prefix="/auction", tags=["auction"])


def player_to_schema(p: PlayerORM) -> Player:
    """Convert ORM player to schema"""
    return Player(
        id=p.id,
        name=p.name,
        role=p.role,
        basePrice=p.base_price,
        sold=p.sold,
        teamId=p.team_id,
        price=p.price,
        nationality=p.nationality,
        age=p.age,
        battingStyle=p.batting_style,
        bowlingStyle=p.bowling_style,
        image=p.image,
        stats=p.stats
    )


def get_unsold_players(db: Session) -> List[PlayerORM]:
    """Get all unsold players"""
    return db.query(PlayerORM).filter(PlayerORM.sold == False).all()


@router.get("/state", response_model=dict, operation_id="get_current_auction_state")
async def get_auction_state(db: Session = Depends(get_db)):
    """Get current auction state"""
    state = db.query(AuctionStateORM).first()
    if not state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Auction state not initialized"
        )
    
    current_player = None
    if state.current_player_id:
        player = db.query(PlayerORM).filter(PlayerORM.id == state.current_player_id).first()
        if player:
            current_player = player_to_schema(player).model_dump()
    
    return {
        "currentIndex": state.current_index,
        "currentPlayer": current_player,
        "auctionStarted": state.auction_started,
        "auctionPaused": state.auction_paused,
        "currentBid": state.current_bid,
        "currentBidder": state.current_bidder_id,
        "bidHistory": [],
        "lastUpdate": int(state.last_update.timestamp() * 1000) if state.last_update else int(time.time() * 1000)
    }


@router.post("/start", operation_id="start_auction_now")
async def start_auction(db: Session = Depends(get_db)):
    """Start the auction"""
    unsold_players = get_unsold_players(db)
    if not unsold_players:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No unsold players available"
        )
    
    state = db.query(AuctionStateORM).first()
    if not state:
        state = AuctionStateORM()
        db.add(state)
    
    state.auction_started = True
    state.auction_paused = False
    state.current_index = 0
    state.current_player_id = unsold_players[0].id
    state.current_bid = 0
    state.current_bidder_id = None
    state.last_update = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Auction started", "state": {
        "currentIndex": 0,
        "currentPlayer": player_to_schema(unsold_players[0]).model_dump(),
        "auctionStarted": True,
        "auctionPaused": False,
        "currentBid": 0,
        "currentBidder": None,
        "bidHistory": [],
        "lastUpdate": int(time.time() * 1000)
    }}


@router.post("/pause", operation_id="pause_auction_now")
async def pause_auction(db: Session = Depends(get_db)):
    """Pause the auction"""
    state = db.query(AuctionStateORM).first()
    if not state or not state.auction_started:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Auction not started"
        )
    
    state.auction_paused = True
    state.last_update = datetime.utcnow()
    db.commit()
    
    return {"message": "Auction paused"}


@router.post("/resume", operation_id="resume_auction_now")
async def resume_auction(db: Session = Depends(get_db)):
    """Resume the auction"""
    state = db.query(AuctionStateORM).first()
    if not state or not state.auction_started:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Auction not started"
        )
    
    state.auction_paused = False
    state.last_update = datetime.utcnow()
    db.commit()
    
    return {"message": "Auction resumed"}


@router.post("/next", operation_id="move_to_next_player")
async def next_player(db: Session = Depends(get_db)):
    """Move to next player"""
    state = db.query(AuctionStateORM).first()
    if not state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Auction state not initialized"
        )
    
    unsold_players = get_unsold_players(db)
    next_index = state.current_index + 1
    
    current_player = None
    if next_index < len(unsold_players):
        state.current_index = next_index
        state.current_player_id = unsold_players[next_index].id
        state.current_bid = 0
        state.current_bidder_id = None
        state.last_update = datetime.utcnow()
        current_player = player_to_schema(unsold_players[next_index]).model_dump()
    else:
        state.current_player_id = None
        state.auction_started = False
        state.current_bid = 0
        state.current_bidder_id = None
        state.last_update = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Moved to next player", "state": {
        "currentIndex": state.current_index,
        "currentPlayer": current_player,
        "auctionStarted": state.auction_started,
        "auctionPaused": state.auction_paused,
        "currentBid": state.current_bid,
        "currentBidder": state.current_bidder_id,
        "bidHistory": [],
        "lastUpdate": int(time.time() * 1000)
    }}


@router.post("/previous", operation_id="move_to_previous_player")
async def previous_player(db: Session = Depends(get_db)):
    """Move to previous player"""
    state = db.query(AuctionStateORM).first()
    if not state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Auction state not initialized"
        )
    
    unsold_players = get_unsold_players(db)
    prev_index = max(0, state.current_index - 1)
    
    current_player = None
    if prev_index >= 0 and prev_index < len(unsold_players):
        state.current_index = prev_index
        state.current_player_id = unsold_players[prev_index].id
        state.current_bid = 0
        state.current_bidder_id = None
        state.last_update = datetime.utcnow()
        current_player = player_to_schema(unsold_players[prev_index]).model_dump()
    
    db.commit()
    
    return {"message": "Moved to previous player", "state": {
        "currentIndex": state.current_index,
        "currentPlayer": current_player,
        "auctionStarted": state.auction_started,
        "auctionPaused": state.auction_paused,
        "currentBid": state.current_bid,
        "currentBidder": state.current_bidder_id,
        "bidHistory": [],
        "lastUpdate": int(time.time() * 1000)
    }}


@router.post("/bid", response_model=PlaceBidResponse, operation_id="place_bid_on_player")
async def place_bid(bid_request: PlaceBidRequest, db: Session = Depends(get_db)):
    """Place a bid on current player"""
    state = db.query(AuctionStateORM).first()
    if not state or not state.auction_started or not state.current_player_id:
        return PlaceBidResponse(success=False, message="Cannot place bid at this time")
    
    team = db.query(TeamORM).filter(TeamORM.id == bid_request.teamId).first()
    if not team:
        return PlaceBidResponse(success=False, message="Team not found")
    
    player = db.query(PlayerORM).filter(PlayerORM.id == state.current_player_id).first()
    if not player:
        return PlaceBidResponse(success=False, message="Player not found")
    
    # Validation
    min_valid_bid = player.base_price if state.current_bidder_id is None else state.current_bid
    
    if bid_request.amount < min_valid_bid:
        is_first_bid = state.current_bidder_id is None
        message = f"First bid must be at least ₹{player.base_price}L (base price)" if is_first_bid else f"Bid must be higher than current bid of ₹{state.current_bid}L"
        return PlaceBidResponse(success=False, message=message)
    
    if bid_request.teamId == state.current_bidder_id:
        return PlaceBidResponse(success=False, message="Cannot bid consecutively from the same team")
    
    if bid_request.amount > team.remaining_purse:
        return PlaceBidResponse(success=False, message="Bid exceeds team purse")
    
    # Record bid
    bid = BidHistoryORM(
        player_id=player.id,
        team_id=bid_request.teamId,
        amount=bid_request.amount,
        bid_time=datetime.utcnow()
    )
    db.add(bid)
    
    # Update state
    state.current_bid = bid_request.amount
    state.current_bidder_id = bid_request.teamId
    state.last_update = datetime.utcnow()
    
    db.commit()
    
    return PlaceBidResponse(success=True, message="Bid placed successfully")


@router.post("/mark-sold", operation_id="mark_player_as_sold")
async def mark_sold(request: MarkSoldRequest, db: Session = Depends(get_db)):
    """Mark player as sold"""
    player = db.query(PlayerORM).filter(PlayerORM.id == request.playerId).first()
    team = db.query(TeamORM).filter(TeamORM.id == request.teamId).first()
    
    if not player or not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player or team not found"
        )
    
    # Update player
    player.sold = True
    player.team_id = request.teamId
    player.price = request.price
    
    # Update team
    team.remaining_purse -= request.price
    
    # Update auction state
    state = db.query(AuctionStateORM).first()
    if state:
        state.current_bid = 0
        state.current_bidder_id = None
        state.last_update = datetime.utcnow()
    
    db.commit()
    
    # Get current player after marking sold
    current_player = None
    if state and state.current_player_id:
        current_player_obj = db.query(PlayerORM).filter(PlayerORM.id == state.current_player_id).first()
        if current_player_obj:
            current_player = player_to_schema(current_player_obj).model_dump()
    
    return {"message": "Player marked as sold", "state": {
        "currentIndex": state.current_index if state else 0,
        "currentPlayer": current_player,
        "auctionStarted": state.auction_started if state else False,
        "auctionPaused": state.auction_paused if state else False,
        "currentBid": state.current_bid if state else 0,
        "currentBidder": state.current_bidder_id if state else None,
        "bidHistory": [],
        "lastUpdate": int(time.time() * 1000)
    }}


@router.post("/mark-unsold", operation_id="mark_player_as_unsold")
async def mark_unsold(request: MarkUnsoldRequest, db: Session = Depends(get_db)):
    """Mark player as unsold"""
    player = db.query(PlayerORM).filter(PlayerORM.id == request.playerId).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    # Mark as unsold
    player.sold = False
    player.team_id = None
    player.price = 0
    
    # Update auction state
    state = db.query(AuctionStateORM).first()
    if state:
        state.current_bid = 0
        state.current_bidder_id = None
        state.last_update = datetime.utcnow()
    
    db.commit()
    
    # Get current player after marking unsold
    current_player = None
    if state and state.current_player_id:
        current_player_obj = db.query(PlayerORM).filter(PlayerORM.id == state.current_player_id).first()
        if current_player_obj:
            current_player = player_to_schema(current_player_obj).model_dump()
    
    return {"message": "Player marked as unsold", "state": {
        "currentIndex": state.current_index if state else 0,
        "currentPlayer": current_player,
        "auctionStarted": state.auction_started if state else False,
        "auctionPaused": state.auction_paused if state else False,
        "currentBid": state.current_bid if state else 0,
        "currentBidder": state.current_bidder_id if state else None,
        "bidHistory": [],
        "lastUpdate": int(time.time() * 1000)
    }}


@router.post("/reset", operation_id="reset_auction_to_initial_state")
async def reset_auction_endpoint(db: Session = Depends(get_db)):
    """Reset auction to initial state"""
    # Reset all players
    db.query(PlayerORM).update({"sold": False, "team_id": None, "price": None})
    
    # Reset all teams
    db.query(TeamORM).update({"remaining_purse": 12000})
    
    # Reset auction state
    state = db.query(AuctionStateORM).first()
    if state:
        state.current_index = 0
        state.current_player_id = None
        state.auction_started = False
        state.auction_paused = False
        state.current_bid = 0
        state.current_bidder_id = None
        state.last_update = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Auction reset successfully"}
