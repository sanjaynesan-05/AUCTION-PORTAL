from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db.session import get_db
from app.models.all_models import Player
from app.schemas.schemas import PlayerCreate, PlayerResponse
from io import StringIO
import csv

router = APIRouter()

@router.get("/", response_model=List[PlayerResponse])
async def get_players(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Player).order_by(Player.id))
    players = result.scalars().all()
    return players

@router.post("/", response_model=PlayerResponse)
async def create_player(player: PlayerCreate, db: AsyncSession = Depends(get_db)):
    new_player = Player(**player.dict())
    db.add(new_player)
    await db.commit()
    await db.refresh(new_player)
    return new_player

@router.post("/bulk-upload")
async def bulk_upload_players(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    try:
        contents = await file.read()
        decoded = contents.decode('utf-8')
        csv_reader = csv.DictReader(StringIO(decoded))
        
        players_to_add = []
        for row in csv_reader:
            # Assumes CSV columns: name, role, base_price, points
            player = Player(
                name=row['name'],
                role=row['role'],
                base_price=float(row['base_price']),
                points=int(row.get('points', 0))
            )
            players_to_add.append(player)
            
        if players_to_add:
            db.add_all(players_to_add)
            await db.commit()
            
        return {"status": "success", "count": len(players_to_add)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
