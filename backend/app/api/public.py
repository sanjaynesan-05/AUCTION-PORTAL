"""
Public Auction API - Read-only endpoints for presenter display
No authentication required - safe for public consumption
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.models.orm import Player, Team, AuctionState, PlayerStatus, AuctionStatus
from app.database import get_db
from typing import List, Optional

router = APIRouter(prefix="/auction", tags=["auction-public"])


@router.get("/state", operation_id="get_auction_state_public")
async def get_auction_state(db: Session = Depends(get_db)):
    """
    Get current auction state (Public endpoint)
    
    Returns:
    - Current player being auctioned
    - Auction status (IDLE, LIVE, SOLD)
    - Current bid amount
    - Winning team (if SOLD)
    """
    state = db.query(AuctionState).filter(AuctionState.id == 1).first()
    
    if not state:
        # Initialize if doesn't exist
        state = AuctionState(id=1)
        db.add(state)
        db.commit()
        db.refresh(state)
    
    # Build response
    response = {
        "status": state.status.value,
        "currentBid": state.current_bid,
        "lastUpdate": int(state.last_update.timestamp() * 1000) if state.last_update else 0,
        "currentPlayer": None,
        "winningTeam": None
    }
    
    # Add current player data
    if state.current_player_id:
        player = db.query(Player).filter(Player.id == state.current_player_id).first()
        if player:
            response["currentPlayer"] = {
                "id": player.id,
                "name": player.name,
                "role": player.role,
                "basePrice": player.base_price,
                "status": player.status.value,
                "soldPrice": player.sold_price,
                "nationality": player.nationality,
                "age": player.age,
                "battingStyle": player.batting_style,
                "bowlingStyle": player.bowling_style,
                "image": player.image,
                "stats": player.stats
            }
    
    # Add winning team data
    if state.winning_team_id:
        team = db.query(Team).filter(Team.id == state.winning_team_id).first()
        if team:
            response["winningTeam"] = {
                "id": team.id,
                "name": team.name,
                "color": team.color,
                "logo": team.logo
            }
    
    return response


@router.get("/players", operation_id="get_all_players_public")
async def get_players(db: Session = Depends(get_db)):
    """
    Get all players with their status (Public endpoint)
    Useful for displaying player list on presenter
    """
    players = db.query(Player).all()
    
    return [
        {
            "id": p.id,
            "name": p.name,
            "role": p.role,
            "basePrice": p.base_price,
            "status": p.status.value,
            "soldPrice": p.sold_price,
            "soldToTeamId": p.sold_to_team_id,
            "nationality": p.nationality,
            "age": p.age,
            "image": p.image
        }
        for p in players
    ]


@router.get("/teams", operation_id="get_all_teams_public")
async def get_teams(db: Session = Depends(get_db)):
    """
    Get all teams (Public endpoint)
    """
    teams = db.query(Team).all()
    
    return [
        {
            "id": t.id,
            "name": t.name,
            "color": t.color,
            "logo": t.logo
        }
        for t in teams
    ]


@router.get("/players/pending", operation_id="get_pending_players")
async def get_pending_players(db: Session = Depends(get_db)):
    """
    Get all pending (unsold) players (Public endpoint)
    """
    players = db.query(Player).filter(Player.status == PlayerStatus.PENDING).all()
    
    return [
        {
            "id": p.id,
            "name": p.name,
            "role": p.role,
            "basePrice": p.base_price,
            "nationality": p.nationality,
            "age": p.age,
            "image": p.image
        }
        for p in players
    ]
