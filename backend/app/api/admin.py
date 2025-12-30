"""
Admin API - Full control over auction state
Only accessible by authenticated admin users
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.models.orm import Player, Team, AuctionState, PlayerStatus, AuctionStatus
from app.database import get_db
from app.api.auth import require_admin
from app.api.websocket import manager
from datetime import datetime, timezone

router = APIRouter(prefix="/admin/auction", tags=["admin"])


# Request/Response Models
class SelectPlayerRequest(BaseModel):
    player_id: int


class IncrementBidRequest(BaseModel):
    amount: int


class EndAuctionRequest(BaseModel):
    team_id: int


def get_auction_state_singleton(db: Session) -> AuctionState:
    """Get or create the singleton auction state"""
    state = db.query(AuctionState).filter(AuctionState.id == 1).first()
    if not state:
        state = AuctionState(id=1)
        db.add(state)
        db.commit()
        db.refresh(state)
    return state


async def broadcast_state_update(db: Session):
    """Broadcast current auction state to all WebSocket clients"""
    await manager.broadcast_auction_update(db)


@router.post("/select-player", operation_id="admin_select_player")
async def select_player(
    request: SelectPlayerRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Select a player for auction (Admin only)
    Resets auction state to IDLE with selected player
    """
    # Verify player exists and is pending
    player = db.query(Player).filter(
        Player.id == request.player_id,
        Player.status == PlayerStatus.PENDING
    ).first()
    
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found or already sold"
        )
    
    # Update auction state
    state = get_auction_state_singleton(db)
    state.current_player_id = player.id
    state.status = AuctionStatus.IDLE
    state.current_bid = 0
    state.winning_team_id = None
    state.last_update = datetime.now(timezone.utc)
    
    db.commit()
    
    # Broadcast update
    await broadcast_state_update(db)
    
    return {
        "message": "Player selected",
        "player": {
            "id": player.id,
            "name": player.name,
            "base_price": player.base_price
        }
    }


@router.post("/start", operation_id="admin_start_auction")
async def start_auction(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Start auction for currently selected player (Admin only)
    Sets status to LIVE and initializes bid at base price
    """
    state = get_auction_state_singleton(db)
    
    if not state.current_player_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No player selected. Select a player first."
        )
    
    if state.status == AuctionStatus.LIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Auction already in progress"
        )
    
    # Get player to set base price
    player = db.query(Player).filter(Player.id == state.current_player_id).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Selected player not found"
        )
    
    # Start auction
    state.status = AuctionStatus.LIVE
    state.current_bid = player.base_price
    state.winning_team_id = None
    state.last_update = datetime.now(timezone.utc)
    
    db.commit()
    
    # Broadcast update
    await broadcast_state_update(db)
    
    return {
        "message": "Auction started",
        "current_bid": state.current_bid,
        "status": state.status.value
    }


@router.post("/increment", operation_id="admin_increment_bid")
async def increment_bid(
    request: IncrementBidRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Increment the current bid (Admin only)
    Can only be done when auction is LIVE
    """
    state = get_auction_state_singleton(db)
    
    if state.status != AuctionStatus.LIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot increment bid. Auction status is {state.status.value}"
        )
    
    if request.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Increment amount must be positive"
        )
    
    # Increment bid
    state.current_bid += request.amount
    state.last_update = datetime.now(timezone.utc)
    
    db.commit()
    
    # Broadcast update
    await broadcast_state_update(db)
    
    return {
        "message": "Bid incremented",
        "current_bid": state.current_bid
    }


@router.post("/end", operation_id="admin_end_auction")
async def end_auction(
    request: EndAuctionRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    End auction and mark player as SOLD to team (Admin only)
    Finalizes the sale and updates player record
    """
    state = get_auction_state_singleton(db)
    
    if state.status != AuctionStatus.LIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot end auction. Auction status is {state.status.value}"
        )
    
    if not state.current_player_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No player in auction"
        )
    
    # Verify team exists
    team = db.query(Team).filter(Team.id == request.team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Get player and mark as sold
    player = db.query(Player).filter(Player.id == state.current_player_id).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    player.status = PlayerStatus.SOLD
    player.sold_price = state.current_bid
    player.sold_to_team_id = team.id
    
    # Update auction state
    state.status = AuctionStatus.SOLD
    state.winning_team_id = team.id
    state.last_update = datetime.now(timezone.utc)
    
    db.commit()
    
    # Broadcast update
    await broadcast_state_update(db)
    
    return {
        "message": "Player sold",
        "player": {
            "id": player.id,
            "name": player.name,
            "sold_price": player.sold_price,
            "team": team.name
        }
    }


@router.post("/next", operation_id="admin_next_player")
async def next_player(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Move to next player (Admin only)
    Resets auction state for next auction
    """
    state = get_auction_state_singleton(db)
    
    # Reset state for next auction
    state.current_player_id = None
    state.status = AuctionStatus.IDLE
    state.current_bid = 0
    state.winning_team_id = None
    state.last_update = datetime.now(timezone.utc)
    
    db.commit()
    
    # Broadcast update
    await broadcast_state_update(db)
    
    # Get next pending player for convenience
    next_pending = db.query(Player).filter(Player.status == PlayerStatus.PENDING).first()
    
    return {
        "message": "Ready for next player",
        "next_available": {
            "id": next_pending.id,
            "name": next_pending.name
        } if next_pending else None
    }


@router.post("/finalize", operation_id="admin_finalize_sale")
async def finalize_sale(
    request: EndAuctionRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Finalize sale - assign team to current bid and mark as SOLD (Admin only)
    This is the new common bidding approach
    """
    state = get_auction_state_singleton(db)
    
    if state.status != AuctionStatus.LIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot finalize sale. Auction status is {state.status.value}"
        )
    
    if not state.current_player_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No player in auction"
        )
    
    # Verify team exists
    team = db.query(Team).filter(Team.id == request.team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Get player and mark as sold
    player = db.query(Player).filter(Player.id == state.current_player_id).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    player.status = PlayerStatus.SOLD
    player.sold_price = state.current_bid
    player.sold_to_team_id = team.id
    
    # Update auction state
    state.status = AuctionStatus.SOLD
    state.winning_team_id = team.id
    state.last_update = datetime.now(timezone.utc)
    
    db.commit()
    
    # Broadcast update
    await broadcast_state_update(db)
    
    return {
        "message": "Sale finalized",
        "player": {
            "id": player.id,
            "name": player.name,
            "sold_price": player.sold_price,
            "team": team.name
        }
    }


# Player CMS endpoints
class UpdatePlayerRequest(BaseModel):
    name: str | None = None
    role: str | None = None
    basePrice: int | None = None
    age: int | None = None
    nationality: str | None = None
    battingStyle: str | None = None
    bowlingStyle: str | None = None
    image: str | None = None


@router.put("/players/{player_id}", operation_id="admin_update_player")
async def update_player(
    player_id: int,
    request: UpdatePlayerRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    """
    Update player details (CMS functionality - Admin only)
    Allows editing player information
    """
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    # Update fields if provided
    if request.name is not None:
        player.name = request.name
    if request.role is not None:
        player.role = request.role
    if request.basePrice is not None:
        player.base_price = request.basePrice
    if request.age is not None:
        player.age = request.age
    if request.nationality is not None:
        player.nationality = request.nationality
    if request.battingStyle is not None:
        player.batting_style = request.battingStyle
    if request.bowlingStyle is not None:
        player.bowling_style = request.bowlingStyle
    if request.image is not None:
        player.image = request.image
    
    db.commit()
    db.refresh(player)
    
    return {
        "message": "Player updated successfully",
        "player": {
            "id": player.id,
            "name": player.name,
            "role": player.role,
            "base_price": player.base_price,
            "age": player.age,
            "nationality": player.nationality
        }
    }
