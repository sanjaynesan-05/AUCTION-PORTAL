"""
Players API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from models.models import Player, Team

router = APIRouter()

@router.get("/")
async def get_all_players(db: Session = Depends(get_db)):
    """Get all players"""
    players = db.query(Player).all()
    return {
        "players": [
            {
                "id": player.id,
                "name": player.name,
                "role": player.role,
                "nationality": player.nationality,
                "age": player.age,
                "basePrice": (player.base_price or 0) * 100,  # Convert to Crores
                "image": player.image_url,
                "sold": player.sold,
                "teamId": player.team_id,
                "price": (player.sold_price or 0) * 100 if player.sold else None,
                "stats": {
                    "matches": player.matches_played,
                    "runs": player.runs_scored,
                    "wickets": player.wickets_taken,
                    "average": player.average,
                    "strikeRate": player.strike_rate
                }
            }
            for player in players
        ],
        "total": len(players)
    }

@router.get("/{player_id}")
async def get_player(player_id: int, db: Session = Depends(get_db)):
    """Get player by ID"""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    return {
        "id": player.id,
        "name": player.name,
        "role": player.role,
        "nationality": player.nationality,
        "age": player.age,
        "basePrice": (player.base_price or 0) * 100,
        "image": player.image_url,
        "sold": player.sold,
        "teamId": player.team_id,
        "price": (player.sold_price or 0) * 100 if player.sold else None,
        "stats": {
            "matches": player.matches_played,
            "runs": player.runs_scored,
            "wickets": player.wickets_taken,
            "average": player.average,
            "strikeRate": player.strike_rate
        }
    }

@router.put("/{player_id}/sell")
async def sell_player(player_id: int, team_id: int, price: float, db: Session = Depends(get_db)):
    """Sell player to a team"""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Update player
    player.sold = True
    player.sold_price = price / 100  # Convert from Crores
    player.team_id = team_id
    
    # Update team purse
    team.remaining_purse -= price / 100
    
    db.commit()
    
    return {
        "success": True,
        "playerId": player.id,
        "playerName": player.name,
        "teamId": team.id,
        "teamName": team.name,
        "soldPrice": price
    }

@router.put("/{player_id}/unsold")
async def mark_unsold(player_id: int, db: Session = Depends(get_db)):
    """Mark player as unsold"""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    if player.sold and player.team_id:
        team = db.query(Team).filter(Team.id == player.team_id).first()
        if team:
            team.remaining_purse += player.sold_price or 0
    
    player.sold = False
    player.sold_price = None
    player.team_id = None
    
    db.commit()
    
    return {
        "success": True,
        "playerId": player.id,
        "playerName": player.name,
        "status": "unsold"
    }
