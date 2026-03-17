import asyncio
from sqlalchemy import select
from app.db.base import AsyncSessionLocal
from app.models.all_models import Team

async def check_teams():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Team))
        teams = result.scalars().all()
        for t in teams:
            print(f"Team: {t.code}, Logo: {t.logo_url}, Purse: {t.purse_balance}")

if __name__ == "__main__":
    asyncio.run(check_teams())
