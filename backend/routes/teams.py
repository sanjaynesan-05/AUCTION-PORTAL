"""
Teams API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from models.models import Team, Player

router = APIRouter()

@router.get("/")
async def get_all_teams(db: Session = Depends(get_db)):
    """Get all teams"""
    teams = db.query(Team).all()
    return {
        "teams": [
            {
                "id": team.id,
                "name": team.name,
                "shortName": team.short_name,
                "logo": team.logo_url,
                "color": team.color,
                "purse": team.remaining_purse * 100,  # Convert to Crores
                "totalPurse": team.total_purse * 100
            }
            for team in teams
        ],
        "total": len(teams)
    }

@router.get("/{team_id}")
async def get_team(team_id: int, db: Session = Depends(get_db)):
    """Get team by ID"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    return {
        "id": team.id,
        "name": team.name,
        "shortName": team.short_name,
        "logo": team.logo_url,
        "color": team.color,
        "purse": team.remaining_purse * 100,
        "totalPurse": team.total_purse * 100
    }

@router.get("/{team_id}/squad")
async def get_team_squad(team_id: int, db: Session = Depends(get_db)):
    """Get team squad (players bought)"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    players = db.query(Player).filter(
        Player.team_id == team_id,
        Player.sold == True
    ).all()
    
    return {
        "teamId": team.id,
        "teamName": team.name,
        "players": [
            {
                "id": player.id,
                "name": player.name,
                "role": player.role,
                "price": (player.sold_price or 0) * 100,  # Convert to Crores
                "image": player.image_url
            }
            for player in players
        ],
        "total": len(players)
    }

@router.put("/{team_id}/purse")
async def update_team_purse(team_id: int, amount: float, db: Session = Depends(get_db)):
    """Update team purse"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    team.remaining_purse = amount / 100  # Convert from Crores
    db.commit()
    
    return {
        "success": True,
        "teamId": team.id,
        "newPurse": team.remaining_purse * 100
    }
