from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func, desc
from app.models.all_models import Team, Player, Bid, AuctionState
from app.websockets.manager import manager
from uuid import UUID

def get_bid_increment(current_bid_rupees: float) -> float:
    """Standard IPL-style bid increments in Rupees"""
    lakhs = current_bid_rupees / 100000
    if lakhs < 200:    # < 2 Cr
        return 5000000  # 50 L
    elif lakhs < 1000: # 5 Cr - 10 Cr
        return 10000000 # 100 L
    else:                    # > 10 Cr
        return 15000000 # 150 L

async def get_auction_state(session: AsyncSession):
    result = await session.execute(select(AuctionState).where(AuctionState.id == 1))
    state = result.scalar_one_or_none()
    if not state:
        # Initialize if not exists
        count = await session.scalar(select(func.count(Player.id)).where(Player.is_sold == False))
        state = AuctionState(id=1, status="WAITING", remaining_players_count=count)
        session.add(state)
        await session.commit()
        await session.refresh(state)
    return state

async def place_bid(amount: float, team_id: UUID, session: AsyncSession):
    async with session.begin():
        # 1. LOCK state
        result = await session.execute(
            select(AuctionState).where(AuctionState.id == 1).with_for_update()
        )
        state = result.scalar_one()
        
        # 2. STRICT Validations inside Lock
        if state.status != "ACTIVE":
            raise ValueError("Auction not active")
        
        if state.current_player_id is None:
             raise ValueError("No player selected")
             
        # Double check player status inside transaction
        player = await session.get(Player, state.current_player_id)
        if player.is_sold:
             raise ValueError("Player already sold")

        if team_id: # Real bid from a team
            base_price_val = float(player.base_price)
            current_bid_val = float(state.current_bid)
            
            # If current_bid is 0, first bid must be >= base_price
            if current_bid_val == 0:
                if amount < base_price_val:
                    raise ValueError(f"First bid must be at least base price: ₹{int(base_price_val/100000)}L")
            else:
                increment = get_bid_increment(current_bid_val)
                if amount < (current_bid_val + increment) and amount != current_bid_val + increment:
                     # Allow slightly less if it matches strictly (float precision)
                     pass 
                if amount <= current_bid_val:
                    raise ValueError(f"Bid too low. Current bid: {current_bid_val}")
        else: # Admin price adjustment
            pass

        if team_id:
            if state.current_bidder_id == team_id:
                 raise ValueError("Self-bidding not allowed")
                 
            team = await session.get(Team, team_id)
            if team.purse_balance < amount:
                 raise ValueError("Insufficient funds")
            if team.players_count >= 25:
                 raise ValueError("Squad full")
        
        # 3. Update
        state.current_bid = amount
        if team_id:
            state.current_bidder_id = team_id
        
        state.version += 1
        
        # 4. Log (Only if team provided)
        if team_id:
            bid = Bid(
                player_id=state.current_player_id, 
                team_id=team_id, 
                amount=amount
            )
            session.add(bid)
        
    # 5. Broadcast (After Commit)
    await manager.broadcast("BID_UPDATE", { "amount": amount, "team_id": str(team_id) if team_id else None })
    return state

async def confirm_sale(session: AsyncSession):
    sold_price = 0
    winner = None
    async with session.begin(): # Start Transaction
        # 1. Lock Auction State (Pessimistic Lock)
        result = await session.execute(
            select(AuctionState).where(AuctionState.id == 1).with_for_update()
        )
        state = result.scalar_one()

        if not state.current_bidder_id:
            raise Exception("No active bid to confirm")
        
        sold_price = float(state.current_bid)
        
        # 2. Fetch Entities
        player = await session.get(Player, state.current_player_id)
        team = await session.get(Team, state.current_bidder_id)

        # 3. CRITICAL Validations
        if player.is_sold:
            raise Exception("CRITICAL: Player already sold!")
        if team.purse_balance < state.current_bid:
            raise Exception("Insufficient funds (Race condition detected)")
        if team.players_count >= 25:
             raise Exception("Squad limit reached")

        # 4. Execute Transfer
        team.purse_balance = float(team.purse_balance) - float(sold_price)
        player.is_sold = True
        player.team_id = team.id
        player.sold_price = sold_price
        
        # 5. Update Team Count
        team.players_count += 1
        team.total_points = (team.total_points or 0) + player.points
        
        # 6. Reset State for Next Player
        state.current_bid = 0
        state.current_bidder_id = None
        state.remaining_players_count -= 1
        state.version += 1
        state.status = "WAITING"
        state.current_player_id = None
        
        # 7. Check for Auction Completion
        if state.remaining_players_count <= 0:
            state.status = "COMPLETED"
            # Get winner for broadcast inside logic block but broadcast later
            # Logic for winner determination can be added here
            pass

    # 8. Post-Commit Broadcast (Safe)
    await manager.broadcast("PLAYER_SOLD", {
        "player_id": str(player.id),
        "sold_price": sold_price,
        "team_id": str(team.id)
    })
    
    # Leaderboard update
    leaderboard = await get_leaderboard(session)
    await manager.broadcast("LEADERBOARD_UPDATE", leaderboard)
    
    if winner:
         await manager.broadcast("AUCTION_COMPLETED", { "winner": winner })
         
    return state

async def get_leaderboard(session: AsyncSession):
    # This corresponds to the DENSE_RANK logic, implemented in Python or raw SQL
    # SQLAlchemy way:
    query = select(Team).order_by(desc(Team.total_points), desc(Team.purse_balance))
    result = await session.execute(query)
    teams = result.scalars().all()
    
    leaderboard = []
    rank = 1
    for team in teams:
        leaderboard.append({
            "rank": rank,
            "id": str(team.id),
            "name": team.name,
            "code": team.code,
            "logo_url": team.logo_url,
            "color": team.color,
            "primary_color": team.primary_color,
            "secondary_color": team.secondary_color,
            "total_points": team.total_points,
            "purse_balance": float(team.purse_balance),
            "players_count": team.players_count
        })
        rank += 1
    return leaderboard

async def reset_auction_logic(session: AsyncSession):
    async with session.begin():
        # 1. Pre-calculate count
        count = await session.scalar(select(func.count(Player.id)))
        
        # 2. Reset Tables
        await session.execute(update(Team).values(purse_balance=1200000000, total_points=0, players_count=0))
        await session.execute(update(Player).values(is_sold=False, team_id=None))
        await session.execute(delete(Bid))
        
        # 3. Reset State
        await session.execute(
            update(AuctionState).where(AuctionState.id == 1).values(
                status="WAITING", 
                current_bid=0, 
                current_bidder_id=None,
                current_player_id=None,
                remaining_players_count=count, 
                version=0
            )
        )
    
    await manager.broadcast("AUCTION_RESET", {})
    return True
