# 🏏 Enterprise Gamified IPL Auction Portal - Backend Master Plan (10/10 Production Ready)

## 1. Executive Summary

This plan outlines the architecture for a **production-grade, competition-safe** backend for the IPL Auction Portal. It elevates the system from a simple simulation to a robust financial and gamification engine capable of handling concurrency, race conditions, and real-time synchronization with absolute data integrity.

**Core Pillars:**
1.  **🔒 Atomic Safety**: Analyzing financial transactions with database-level locking (`FOR UPDATE`).
2.  **💰 Audit Trail**: Complete history of every bid with indexed logs for dispute resolution.
3.  **🏆 Dynamic Gamification**: Real-time SQL-calculated leaderboards (`DENSE_RANK`) based on squad strength, optimized with specific indices.
4.  **⚡ Real-Time Sync**: WebSocket broadcasting with full state synchronization on reconnect and event sequencing guarantees.

---

## 2. System Architecture

The backend utilizes **FastAPI** (Python 3.11+) and **PostgreSQL**.

### **Directory Structure**
```text
backend/
├── app/
│   ├── api/routes/          # API Endpoints
│   ├── core/                # Config, Security (Startup event handlers)
│   ├── db/                  # Database Session & Base
│   ├── models/              # SQLAlchemy Models (Teams, Players, Bids, State)
│   ├── services/            # Business Logic (Auction, Bidding, Scoring)
│   ├── schemas/             # Pydantic Models (Validation)
│   ├── websockets/          # Connection Manager
│   ├── utils/               # Shared helpers (Time, Math)
│   └── enums/               # AuctionStatus, Roles, PlayerRoles
├── alembic/                 # Migrations
├── tests/                   # Pytest Suites
└── main.py                  # App Entrypoint
```

---

## 3. Database Schema (PostgreSQL)

Using **SQLAlchemy (Async)** with strict constraints and optimized indices.

### **3.1 Teams Table**
Tracks financial and gamification state.
```python
class Team(Base):
    __tablename__ = "teams"
    
    id = Column(UUID, primary_key=True)
    name = Column(String, unique=True)
    code = Column(String(3), unique=True) # CSK
    
    # Financials
    purse_balance = Column(Numeric(12, 2), default=120000000) # ₹120 Cr
    
    # Gamification
    total_points = Column(Integer, default=0)
    players_count = Column(Integer, default=0)
    
    # Precise Optimization & Constraints
    __table_args__ = (
        CheckConstraint("purse_balance >= 0", name="check_purse_non_negative"),
        CheckConstraint("players_count <= 25", name="check_squad_limit"),
        # Index for Lightning Fast Leaderboard
        Index("idx_team_rank", total_points.desc(), purse_balance.desc()),
    )
```

### **3.2 Players Table**
Inventory with point values.
```python
class Player(Base):
    __tablename__ = "players"
    
    id = Column(UUID, primary_key=True)
    name = Column(String)
    role = Column(Enum('BATSMAN', 'BOWLER', '...'))
    
    # Auction Info
    base_price = Column(Numeric(10, 2))
    sold_price = Column(Numeric(10, 2), nullable=True)
    is_sold = Column(Boolean, default=False)
    
    # Gamification
    points = Column(Integer, default=0) 
    
    # Relations (Safe Delete)
    team_id = Column(UUID, ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)

    # Optimization & Safety
    __table_args__ = (
        CheckConstraint("points >= 0", name="check_points_non_negative"),
        Index("idx_players_is_sold", "is_sold"), # Speed up unsold count
    )
```

### **3.3 Bids Table (Audit Log)** 
Essential for history and dispute resolution.
```python
class Bid(Base):
    __tablename__ = "bids"

    id = Column(UUID, primary_key=True)
    # Safe Delete logic: If player/team deleted, keep bid history but NULL reference? 
    # Or CASCADE? For audit, usually we want to keep data, but for strict ref integrity:
    player_id = Column(UUID, ForeignKey("players.id", ondelete="CASCADE"))
    team_id = Column(UUID, ForeignKey("teams.id", ondelete="CASCADE"))
    amount = Column(Numeric(10,2))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Optimization
    __table_args__ = (
        Index("idx_bids_player_id", "player_id"),
        Index("idx_bids_timestamp", "timestamp"),
    )
```

### **3.4 Auction State (Singleton)**
Tracks live context with internal caching.
```python
class AuctionState(Base):
    __tablename__ = "auction_state"
    # ID=1 always
    
    status = Column(Enum('WAITING', 'ACTIVE', 'PAUSED', 'COMPLETED'))
    current_player_id = Column(UUID, ForeignKey("players.id"), nullable=True)
    current_bid = Column(Numeric, default=0)
    current_bidder_id = Column(UUID, ForeignKey("teams.id"), nullable=True)
    
    # Optimization
    remaining_players_count = Column(Integer, default=0) # Cached counter
    
    # Concurrency Tracking
    version = Column(Integer, default=0) 
```

---

## 4. Critical Business Logic & Transactions

### **4.1 Confirm Sale (Atomic, Locking & Sequencing)**
Ensures strict ACID compliance and broadcast ordering.

```python
async def confirm_sale(session: AsyncSession):
    winner = None
    async with session.begin(): # Start Transaction
        # 1. Lock Auction State (Pessimistic Lock)
        result = await session.execute(
            select(AuctionState).where(AuctionState.id == 1).with_for_update()
        )
        state = result.scalar_one()

        if not state.current_bidder_id:
            raise Exception("No active bid to confirm")
        
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
        team.purse_balance -= state.current_bid
        player.is_sold = True
        player.team_id = team.id
        player.sold_price = state.current_bid
        
        # 5. Apply Gamification
        team.total_points += player.points
        team.players_count += 1
        
        # 6. Reset State for Next Player
        state.current_bid = 0
        state.current_bidder_id = None
        state.remaining_players_count -= 1
        state.version += 1
        
        # 7. Check for Auction Completion
        if state.remaining_players_count <= 0:
            state.status = "COMPLETED"
            # Get winner for broadcast inside logic block but broadcast later
            winner = await get_top_team(session) 

    # 8. Post-Commit Broadcast (Safe)
    await ws_manager.broadcast("PLAYER_SOLD", {...})
    await ws_manager.broadcast("LEADERBOARD_UPDATE", {...})
    
    if winner:
         await ws_manager.broadcast("AUCTION_COMPLETED", { "winner": winner })
```

### **4.2 Place Bid (Atomic & Validated)**
Includes rigid validations within the lock.

```python
async def place_bid(amount: int, team_id: UUID, session: AsyncSession):
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

        if amount <= state.current_bid:
             raise ValueError("Bid too low")

        if state.current_bidder_id == team_id:
             raise ValueError("Self-bidding not allowed")
             
        team = await session.get(Team, team_id)
        if team.purse_balance < amount:
             raise ValueError("Insufficient funds")
        if team.players_count >= 25:
             raise ValueError("Squad full")
        
        # 3. Update
        state.current_bid = amount
        state.current_bidder_id = team_id
        state.version += 1
        
        # 4. Log
        session.add(Bid(
            player_id=state.current_player_id, 
            team_id=team_id, 
            amount=amount
        ))
        
    # 5. Broadcast (After Commit)
    await ws_manager.broadcast("BID_UPDATE", { "amount": amount, "team": ... })
```

### **4.3 Dynamic Leaderboard (Optimized)**
Uses index on `(total_points DESC, purse_balance DESC)`.

```sql
SELECT 
    id, name, code, total_points, purse_balance, players_count,
    DENSE_RANK() OVER (ORDER BY total_points DESC, purse_balance DESC) as rank
FROM teams
ORDER BY rank ASC;
```

---

## 5. API Endpoints & Reset

### **Reset Endpoint ("Nuclear Option")**
Calculates count safely before update.

```python
@router.post("/auction/reset")
async def reset_auction(session: AsyncSession):
    async with session.begin():
        # 1. Pre-calculate count
        count = await session.scalar(select(func.count()).select_from(Player))
        
        # 2. Reset Tables
        await session.execute(update(Team).values(purse_balance=120000000, total_points=0, players_count=0))
        await session.execute(update(Player).values(is_sold=False, sold_price=None, team_id=None))
        await session.execute(delete(Bid))
        
        # 3. Reset State
        await session.execute(
            update(AuctionState).values(
                status="WAITING", 
                current_bid=0, 
                current_bidder_id=None,
                remaining_players_count=count, # Safe usage
                version=0
            )
        )
```

### **Startup Check**
In `main.py` startup event:
```python
# Self-healing: Fix cached counters on restart
count = await count_unsold_players()
await update_auction_state_count(count)
```

---

## 6. WebSocket Events

| Event Type | Payload | Frontend Action |
| :--- | :--- | :--- |
| `SyncState` | `{ full_state }` | **On Reconnect**: Full refresh of UI. |
| `BidUpdate` | `{ amount, team }` | Animate new bid. |
| `PlayerSold` | `{ player, price }` | Show gavel animation. |
| `LeaderboardUpdate`| `[ { rank, team } ]`| Re-render sidebar/leaderboard page. |
| `AuctionCompleted` | `{ winner, points }` | Show Confetti & Final Podium. |

---

## 7. Testing Strategy (Enterprise)

1.  **Race Condition Check**: Simulate 50 concurrent bids on the same player.
2.  **Double-Confirm Check**: Two admins hitting "Sold" at the exact same ms.
3.  **Crash Recovery**: Kill backend process mid-bid, restart, verify DB consistent.
4.  **Network Resilience**: Disconnect WebSocket client, reconnect, ensure `SyncState` restores view.
5.  **Purse Stress**: Run script to exhaust purse to exactly 0 and ensure -1 fails.
6.  **Squad Limit Check**: Try to buy 26th player -> Fail.
7.  **Reset Integrity**: reset -> verify `remaining_players_count` matches `count(*)`.

---

## 8. Frontend Implications
The React frontend must be updated to:
1.  Handle `SyncState` event on mount/reconnect.
2.  Display `rank` from `LeaderboardUpdate` (using `DENSE_RANK`).
3.  Show "Squad Full" warning if `players_count >= 25`.
4.  Listen for `AuctionCompleted` to show the winner screen.
