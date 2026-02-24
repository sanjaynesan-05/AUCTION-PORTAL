import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.models.all_models import Team, Player
from app.db.session import DATABASE_URL

async def inspect_db():
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        print("--- TEAMS ---")
        result = await session.execute(select(Team))
        teams = result.scalars().all()
        for t in teams:
            print(f"{t.code}: {t.logo_url}")
            
        print("\n--- PLAYERS (First 5) ---")
        result = await session.execute(select(Player).limit(5))
        players = result.scalars().all()
        for p in players:
            print(f"{p.name}: {p.image_url}")

if __name__ == "__main__":
    asyncio.run(inspect_db())
