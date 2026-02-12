from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db.session import get_db
from app.models.all_models import Team
from app.schemas.schemas import TeamCreate, TeamResponse
from app.services.auction_service import get_leaderboard

router = APIRouter()

@router.get("/", response_model=List[TeamResponse])
async def get_teams(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Team))
    teams = result.scalars().all()
    return teams

@router.post("/", response_model=TeamResponse)
async def create_team(team: TeamCreate, db: AsyncSession = Depends(get_db)):
    new_team = Team(**team.dict())
    db.add(new_team)
    await db.commit()
    await db.refresh(new_team)
    return new_team

@router.get("/leaderboard")
async def leaderboard(db: AsyncSession = Depends(get_db)):
    return await get_leaderboard(db)
