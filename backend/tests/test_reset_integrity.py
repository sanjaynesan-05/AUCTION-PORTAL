import pytest
import asyncio
import sys
import os

# Add parent directory to path to allow importing 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select, func
from app.db.session import async_session_maker
from app.services.auction_service import reset_auction_logic
from app.models.all_models import Player, Team, Bid, AuctionState

@pytest.mark.asyncio
async def test_reset_auction_integrity():
    async with async_session_maker() as session:
        # Setup: Create some dummy data
        # Ensure we have teams and players
        # (This assumes existing data or we might need to seed some if empty)
        
        # 1. Ensure Auction State exists
        from app.services.auction_service import get_auction_state
        await get_auction_state(session)
        # Ensure implicit transaction from get_auction_state is closed
        await session.commit()

        # 2. Reset everything first to known clean state
        await reset_auction_logic(session)
        
        # 3. Modify state (Simulate an auction in progress)
        # Select a player
        result = await session.execute(select(Player).limit(1))
        player = result.scalars().first()
        
        if not player:
             # Seed a player if none exists
             player = Player(name="Test Player", role="BATSMAN", base_price=2000000, points=10)
             session.add(player)
             await session.commit()
             await session.refresh(player)

        # Mark as sold
        player.is_sold = True
        player.sold_price = 5000000
        session.add(player)
        
        # Add a bid
        team_result = await session.execute(select(Team).limit(1))
        team = team_result.scalars().first()
        if not team:
            team = Team(name="Test Team", code="TST", purse_balance=100000000)
            session.add(team)
            await session.commit()
            await session.refresh(team)
            
        bid = Bid(player_id=player.id, team_id=team.id, amount=5000000)
        session.add(bid)
        
        # Update state
        state_result = await session.execute(select(AuctionState).where(AuctionState.id == 1))
        state = state_result.scalar_one()
        state.status = "COMPLETED"
        state.current_bid = 5000000
        
        await session.commit()
        
        # 3. CALL RESET
        await reset_auction_logic(session)
        
        # 4. VERIFY INTEGRITY
        # Check teams reset
        reloaded_team = await session.get(Team, team.id)
        assert reloaded_team.purse_balance == 120000000
        assert reloaded_team.total_points == 0
        assert reloaded_team.players_count == 0
        
        # Check player reset
        reloaded_player = await session.get(Player, player.id)
        assert reloaded_player.is_sold == False
        assert reloaded_player.sold_price is None
        assert reloaded_player.team_id is None
        
        # Check bids deleted
        bids_count = await session.scalar(select(func.count(Bid.id)))
        assert bids_count == 0
        
        # CRITICAL: Check remaining_players_count matches total players
        total_players = await session.scalar(select(func.count(Player.id)))
        auction_state = await session.get(AuctionState, 1)
        
        print(f"Total Players: {total_players}")
        print(f"State Remaining Count: {auction_state.remaining_players_count}")
        
        assert auction_state.remaining_players_count == total_players
        assert auction_state.status == "WAITING"
        assert auction_state.current_bid == 0
        assert auction_state.current_bidder_id is None
        
        print("RESET INTEGRITY TEST PASSED")

if __name__ == "__main__":
    asyncio.run(test_reset_auction_integrity())
