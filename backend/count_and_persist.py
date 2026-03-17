import asyncio
from sqlalchemy import select, func, update
from app.models.all_models import Player, Team
from app.db.session import async_session_maker
import sys
import os

# Fix for Windows Asyncio Loop
import platform
if platform.system() == 'Windows':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def count_and_persist():
    async with async_session_maker() as session:
        # 1. Count Players
        count = await session.scalar(select(func.count(Player.id)))
        
        # 2. List Players (briefly)
        result = await session.execute(select(Player.name).order_by(Player.name).limit(10))
        names = [row[0] for row in result.all()]
        
        # 3. Update Team Purses to 100 Crore (1,000,000,000)
        # Assuming 1 Crore = 10,000,000, so 100 Crore = 1,000,000,000
        await session.execute(update(Team).values(purse_balance=1000000000.0))
        await session.commit()
        
        print(f"Total Players in Database: {count}")
        print(f"Sample Players: {', '.join(names)}...")
        print("Successfully updated all team purses to ₹100 Crore.")

if __name__ == "__main__":
    # Ensure backend path is in sys.path
    sys.path.append(os.path.join(os.getcwd(), "backend"))
    asyncio.run(count_and_persist())
