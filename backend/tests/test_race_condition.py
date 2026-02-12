import pytest
import asyncio
import sys
import os

# Add parent directory to path to allow importing 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select
from app.db.session import async_session_maker
from app.services.auction_service import place_bid, reset_auction_logic, get_auction_state
from app.models.all_models import Player, Team, AuctionState, Bid

@pytest.mark.asyncio
async def test_concurrent_bids():
    async with async_session_maker() as session:
        # Setup: Ensure clean state
        from sqlalchemy import delete
        
        # 1. Wipe teams to avoid duplicates from previous runs
        # Use a nested transaction or separate execution to ensure it commits
        await session.execute(delete(Bid)) # Bids reference teams, delete first (though cascade might handle it)
        await session.execute(delete(Player)) # Players reference teams
        await session.execute(delete(Team))
        await session.commit()

        # 2. Reset logic (initializes state if needed)
        await reset_auction_logic(session)
        
        # 3. Add multiple teams with funds
        teams = []
        for i in range(10):  # 10 teams
            t = Team(name=f"Team {i}", code=f"T{i}", purse_balance=100000000)
            session.add(t)
            teams.append(t)
            
        await session.commit()
        # Refresh to get IDs
        for t in teams:
            await session.refresh(t)

        # 3. Add a player and select for auction
        player = Player(name="Star Player", role="BATSMAN", base_price=100000, points=10)
        session.add(player)
        await session.commit()
        await session.refresh(player)
        
        # 4. Set Auction Active
        state = await session.get(AuctionState, 1) # Should exist from reset
        state.status = "ACTIVE"
        state.current_player_id = player.id
        state.current_bid = 100000
        state.current_bidder_id = None
        await session.commit()
        
        print(f"Starting Concurrent Bid Test on Player: {player.name} ({player.id})")
        
        # 5. Simulate Concurrent Bids using asyncio.gather
        # Each team tries to bid increment by specific amount?
        # Or simpler: all try to bid slightly higher than current state but race against each other
        # The logic is tricky because state.current_bid updates.
        # But place_bid validates amount > current_bid.
        # If we launch tasks with fixed amounts, most will fail.
        # If we launch tasks that read-then-write, the read happens outside lock.
        # The true race condition test is ensuring that if 2 requests come in with valid 'new' bids,
        # they are processed sequentially correctly due to locking.
        
        # Let's say we have 5 teams. 
        # Team 0 bids 200k.
        # Team 1 bids 200k (fails)
        # Team 2 bids 300k.
        # Team 3 bids 300k (fails).
        
        # To truly test locking, we can try to bid same amount concurrently and ensure 
        # only ONE succeeds and others fail with "Bid too low" or "Self-bidding" or database lock wait.
        
        # Scenario: All try to bid 200,000 simultaneously. Only one should succeed.
        bid_amount = 200000
        
        tasks = []
        outcomes = []
        
        async def try_bid(team_id, amount):
            try:
                # We need a new session per task to simulate concurrent requests properly
                # because the session is not thread-safe/task-safe for simultaneous usage really
                # but async session maker creates a new session.
                # However, here we inside one 'async with async_session_maker() as session' block 
                # which is the main test session.
                # The service function takes 'session'.
                
                # To simulate concurrency, we must use separate sessions.
                async with async_session_maker() as thread_session:
                     await place_bid(amount, team_id, thread_session)
                     return "SUCCESS"
            except Exception as e:
                return str(e)

        print(f"Launching {len(teams)} concurrent bids for amount {bid_amount}...")
        
        for team in teams:
            tasks.append(try_bid(team.id, bid_amount))
            
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        success_count = 0
        failures = []
        
        for r in results:
            if r == "SUCCESS":
                success_count += 1
            else:
                failures.append(r)
                
        print(f"Results: {success_count} Success, {len(failures)} Failed")
        
        # Verification
        # EXACTLY ONE should succeed.
        # The others should fail with 'Bid too low' because the state updated.
        # Or 'Self-bidding' if same team somehow double clicked (but here different teams).
        
        assert success_count == 1
        print("Concurrency Check PASSED: Exactly 1 bid succeeded, others rejected.")
        
        # Verify final state
        await session.refresh(state)
        assert state.current_bid == bid_amount
        
if __name__ == "__main__":
    asyncio.run(test_concurrent_bids())
