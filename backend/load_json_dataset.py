import asyncio
import json
import sys
import os

# Fix for Windows Asyncio Loop
import platform
if platform.system() == 'Windows':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# Configure stdout to handle UTF-8
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, delete, func
from app.models.all_models import Team, Player, Bid, AuctionState
from app.db.session import Base, DATABASE_URL

engine = create_async_engine(DATABASE_URL, echo=False, connect_args={"statement_cache_size": 0})
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def load_json_to_db():
    json_path = "ipl_auction_dataset.json"
    
    print(f"[1/6] Reading JSON file: {json_path}")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"[2/6] Loaded {len(data['teams'])} teams and {len(data['players'])} players")
    
    async with async_session() as session:
        # Clear existing data
        print("[3/6] Clearing existing data...")
        await session.execute(delete(Bid))
        
        # Clear AuctionState references
        state = await session.get(AuctionState, 1)
        if state:
            state.current_player_id = None
            state.current_bidder_id = None
            await session.commit()
        
        await session.execute(delete(Player))
        await session.execute(delete(Team))
        await session.commit()
        
        # Insert Teams
        print("[4/6] Inserting teams...")
        for team_data in data['teams']:
            team = Team(
                name=team_data['name'],
                code=team_data['code'],
                logo_url=team_data.get('logo_url'),
                color=team_data.get('color'),
                primary_color=team_data.get('primary_color'),
                secondary_color=team_data.get('secondary_color'),
                purse_balance=team_data.get('purse_balance', 12000000000)
            )
            session.add(team)
        
        await session.commit()
        print(f"    Inserted {len(data['teams'])} teams")
        
        # Insert Players
        print("[5/6] Inserting players...")
        player_count = 0
        for player_data in data['players']:
            # Handle the typo in JSON (base_portion vs base_price)
            base_price = player_data.get('base_price', player_data.get('base_portion', 5000000))
            
            player = Player(
                name=player_data['name'],
                role=player_data.get('role', 'BATSMAN'),
                nationality=player_data.get('nationality', 'India'),
                age=player_data.get('age', 25),
                matches=player_data.get('matches', 0),
                runs=player_data.get('runs', 0),
                wickets=player_data.get('wickets', 0),
                average=player_data.get('average'),
                strike_rate=player_data.get('strike_rate'),
                economy=player_data.get('economy'),
                base_price=base_price,
                points=player_data.get('points', 0),
                image_url=player_data.get('image_url')
            )
            session.add(player)
            player_count += 1
            
            if player_count % 20 == 0:
                await session.commit()
        
        await session.commit()
        print(f"    Inserted {player_count} players")
        
        # Initialize Auction State
        print("[6/6] Initializing auction state...")
        unsold_count = await session.scalar(
            select(func.count(Player.id)).where(Player.is_sold == False)
        )
        
        result = await session.execute(select(AuctionState).where(AuctionState.id == 1))
        state = result.scalar_one_or_none()
        
        if state:
            state.status = "WAITING"
            state.remaining_players_count = unsold_count
            state.current_player_id = None
            state.current_bidder_id = None
            state.current_bid = 0
        else:
            state = AuctionState(
                id=1,
                status="WAITING",
                remaining_players_count=unsold_count,
                current_bid=0
            )
            session.add(state)
        
        await session.commit()
        
        print("")
        print("="*50)
        print("DATABASE IMPORT COMPLETED SUCCESSFULLY")
        print("="*50)
        print(f"Teams: {len(data['teams'])}")
        print(f"Players: {player_count}")
        print(f"Status: WAITING")
        print(f"Available Players: {unsold_count}")
        print("="*50)

if __name__ == "__main__":
    try:
        asyncio.run(load_json_to_db())
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
