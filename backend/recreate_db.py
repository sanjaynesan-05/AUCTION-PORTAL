import asyncio
from app.db.session import engine, Base
from app.models.all_models import Team, Player, Bid, AuctionState

async def reset_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables dropped and recreated.")

if __name__ == "__main__":
    asyncio.run(reset_db())
