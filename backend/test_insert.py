import asyncio
import json
import sys
import os
import platform

if platform.system() == 'Windows':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.all_models import Team
from app.db.session import DATABASE_URL, create_async_engine

engine = create_async_engine(DATABASE_URL, echo=True, connect_args={"statement_cache_size": 0})
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def test_insert():
    async with async_session() as session:
        team = Team(
            name="Test Team",
            code="TEST",
            purse_balance=120000000
        )
        session.add(team)
        await session.commit()
        print("Success!")

asyncio.run(test_insert())
