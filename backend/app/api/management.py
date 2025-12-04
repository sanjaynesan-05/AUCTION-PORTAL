from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas import Player, PlayerCreate, PlayerUpdate, Team, TeamUpdate
from app.models.orm import Player as PlayerORM, Team as TeamORM
from app.database import get_db

router = APIRouter(tags=["management"])


# Player endpoints
@router.get("/players", response_model=List[Player])
async def get_players(db: Session = Depends(get_db)):
    """Get all players"""
    players = db.query(PlayerORM).all()
    return [
        Player(
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
        for p in players
    ]


@router.get("/players/{player_id}", response_model=Player)
async def get_player(player_id: int, db: Session = Depends(get_db)):
    """Get player by ID"""
    player = db.query(PlayerORM).filter(PlayerORM.id == player_id).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    return Player(
        id=player.id,
        name=player.name,
        role=player.role,
        basePrice=player.base_price,
        sold=player.sold,
        teamId=player.team_id,
        price=player.price,
        nationality=player.nationality,
        age=player.age,
        battingStyle=player.batting_style,
        bowlingStyle=player.bowling_style,
        image=player.image,
        stats=player.stats
    )


@router.post("/players", response_model=Player, status_code=status.HTTP_201_CREATED)
async def create_player(player: PlayerCreate, db: Session = Depends(get_db)):
    """Create a new player"""
    # Generate new ID
    last_player = db.query(PlayerORM).order_by(PlayerORM.id.desc()).first()
    new_id = (last_player.id + 1) if last_player else 1
    
    # Create player
    new_player = PlayerORM(
        id=new_id,
        name=player.name,
        role=player.role,
        base_price=player.basePrice,
        nationality=player.nationality,
        age=player.age,
        batting_style=player.battingStyle,
        bowling_style=player.bowlingStyle,
        image=player.image,
        stats=player.stats,
        sold=False
    )
    db.add(new_player)
    db.commit()
    db.refresh(new_player)
    
    return Player(
        id=new_player.id,
        name=new_player.name,
        role=new_player.role,
        basePrice=new_player.base_price,
        sold=new_player.sold,
        teamId=new_player.team_id,
        price=new_player.price,
        nationality=new_player.nationality,
        age=new_player.age,
        battingStyle=new_player.batting_style,
        bowlingStyle=new_player.bowling_style,
        image=new_player.image,
        stats=new_player.stats
    )


@router.put("/players/{player_id}", response_model=Player)
async def update_player(player_id: int, player_update: PlayerUpdate, db: Session = Depends(get_db)):
    """Update a player"""
    player = db.query(PlayerORM).filter(PlayerORM.id == player_id).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    # Update only provided fields
    update_data = player_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "basePrice":
            setattr(player, "base_price", value)
        elif field == "battingStyle":
            setattr(player, "batting_style", value)
        elif field == "bowlingStyle":
            setattr(player, "bowling_style", value)
        else:
            setattr(player, field, value)
    
    db.commit()
    db.refresh(player)
    
    return Player(
        id=player.id,
        name=player.name,
        role=player.role,
        basePrice=player.base_price,
        sold=player.sold,
        teamId=player.team_id,
        price=player.price,
        nationality=player.nationality,
        age=player.age,
        battingStyle=player.batting_style,
        bowlingStyle=player.bowling_style,
        image=player.image,
        stats=player.stats
    )


@router.delete("/players/{player_id}")
async def delete_player(player_id: int, db: Session = Depends(get_db)):
    """Delete a player"""
    player = db.query(PlayerORM).filter(PlayerORM.id == player_id).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    db.delete(player)
    db.commit()
    return {"message": "Player deleted successfully"}


# Team endpoints
@router.get("/teams", response_model=List[Team])
async def get_teams(db: Session = Depends(get_db)):
    """Get all teams"""
    teams = db.query(TeamORM).all()
    return [
        Team(
            id=t.id,
            name=t.name,
            shortName=t.short_name,
            purse=t.remaining_purse,
            logo=t.logo,
            players=[p.id for p in t.players],
            color=t.color,
            primaryColor=t.primary_color,
            secondaryColor=t.secondary_color
        )
        for t in teams
    ]


@router.get("/teams/{team_id}", response_model=Team)
async def get_team(team_id: int, db: Session = Depends(get_db)):
    """Get team by ID"""
    team = db.query(TeamORM).filter(TeamORM.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    return Team(
        id=team.id,
        name=team.name,
        shortName=team.short_name,
        purse=team.remaining_purse,
        logo=team.logo,
        players=[p.id for p in team.players],
        color=team.color,
        primaryColor=team.primary_color,
        secondaryColor=team.secondary_color
    )


@router.put("/teams/{team_id}/purse", response_model=Team)
async def update_team_purse(team_id: int, team_update: TeamUpdate, db: Session = Depends(get_db)):
    """Update team purse"""
    team = db.query(TeamORM).filter(TeamORM.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    team.remaining_purse = team_update.purse
    db.commit()
    db.refresh(team)
    
    return Team(
        id=team.id,
        name=team.name,
        shortName=team.short_name,
        purse=team.remaining_purse,
        logo=team.logo,
        players=[p.id for p in team.players],
        color=team.color,
        primaryColor=team.primary_color,
        secondaryColor=team.secondary_color
    )
