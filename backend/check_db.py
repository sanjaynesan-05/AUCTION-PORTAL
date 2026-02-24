import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, func
from app.models.all_models import Team, Player, AuctionState
from app.db.session import DATABASE_URL

# Fix for Windows Asyncio Loop
import platform
if platform.system() == 'Windows':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

engine = create_async_engine(DATABASE_URL, echo=False, connect_args={"statement_cache_size": 0})
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def check_database():
    async with async_session() as session:
        # Count teams
        team_count = await session.scalar(select(func.count(Team.id)))
        print(f"Teams in database: {team_count}")
        
        # Count players
        player_count = await session.scalar(select(func.count(Player.id)))
        print(f"Players in database: {player_count}")
        
        # Check Auction State
        result = await session.execute(select(AuctionState).where(AuctionState.id == 1))
        state = result.scalar_one_or_none()
        print("\nAuction State:")
        if state:
            print(f"  - Status: {state.status}")
            print(f"  - Current Player ID: {state.current_player_id}")
            print(f"  - Current Bid: {state.current_bid}")
            print(f"  - Remaining Players: {state.remaining_players_count}")
        else:
            print("  - No Auction State found!")

        # Count Sold/Unsold
        sold_count = await session.scalar(select(func.count(Player.id)).where(Player.is_sold == True))
        unsold_count = await session.scalar(select(func.count(Player.id)).where(Player.is_sold == False))
        print(f"\nPlayer Stats: {sold_count} Sold, {unsold_count} Unsold")

        # Sample some players
        result = await session.execute(select(Player).limit(5))
        players = result.scalars().all()
        print("\nSample Players:")
        for player in players:
            status = "Sold" if player.is_sold else "Unsold"
            print(f"  - {player.name} ({status}) - ₹{player.base_price/100000:.1f}L")

if __name__ == "__main__":
    asyncio.run(check_database())
