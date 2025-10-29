# 🎯 Auction Data Flow

Complete guide to how auction data is saved, synchronized, and displayed across the IPL Auction Portal.

## 📊 Overview

The auction system uses a **3-phase data flow**:
1. **Memory (In-Process)** - Real-time auction state
2. **Database (SQLite)** - Persistent storage
3. **WebSocket (Real-Time)** - Live synchronization

## 🔄 Data Flow Diagram

```
┌─────────────┐
│   PRESENTER │
│   (WebUI)   │
└──────┬──────┘
       │ 1. Emit Event (start-auction, mark-sold, etc.)
       ▼
┌─────────────────────────────────────┐
│   WebSocket Server (Socket.io)     │
│   ├─ Authenticate JWT               │
│   ├─ Validate Role & Permissions    │
│   └─ Route to Handler                │
└──────┬──────────────────────────────┘
       │ 2. Process Event
       ▼
┌─────────────────────────────────────┐
│   In-Memory Auction State           │
│   ├─ Current Player                  │
│   ├─ Auction Status (active/paused) │
│   ├─ Current Bid Amount              │
│   └─ Bidding Team                    │
└──────┬──────────────────────────────┘
       │ 3. Update State
       ├─────────────────────┬────────────────┐
       ▼                     ▼                ▼
┌─────────────┐      ┌─────────────┐   ┌─────────────┐
│  Database   │      │  WebSocket  │   │   Viewers   │
│  (SQLite)   │      │  Broadcast  │   │   (WebUI)   │
│             │      │             │   │             │
│ 4. Persist  │      │ 5. Emit to  │   │ 6. Update   │
│    Data     │      │    All      │   │    UI       │
└─────────────┘      └─────────────┘   └─────────────┘
```

## 🎬 Phase 1: Event Emission (Client → Server)

### Presenter Actions
```typescript
// Presenter clicks "Start Auction"
socket.emit('start-auction', {});

// Presenter marks player as sold
socket.emit('mark-sold', {
  playerId: 'player-uuid',
  teamId: 'csk-uuid',
  price: 150
});

// Presenter navigates to next player
socket.emit('next-player', {});
```

### Viewer Actions
```typescript
// Viewer places bid
socket.emit('place-bid', {
  playerId: 'current-player-uuid',
  teamId: 'csk-uuid',
  amount: 120
});
```

## 🧠 Phase 2: In-Memory State Management

### Auction State Object
```javascript
const auctionState = {
  // Auction control
  isActive: false,
  isPaused: false,
  
  // Current player
  currentPlayerIndex: 0,
  currentPlayer: {
    id: 'player-uuid',
    name: 'MS Dhoni',
    role: 'WK-Batsman',
    basePrice: 100,
    status: 'unsold'
  },
  
  // Current bidding
  currentBid: {
    amount: 120,
    teamId: 'csk-uuid',
    teamName: 'Chennai Super Kings'
  },
  
  // All players (loaded from DB)
  players: [],
  
  // All teams (loaded from DB)
  teams: [],
  
  // Last updated timestamp
  lastUpdated: Date.now()
};
```

### State Updates
```javascript
// When player is marked as sold
auctionState.players[currentIndex].status = 'sold';
auctionState.players[currentIndex].soldPrice = bidAmount;
auctionState.players[currentIndex].teamId = teamId;

// Update team purse
const team = auctionState.teams.find(t => t.id === teamId);
team.purse -= bidAmount;
team.totalPlayers += 1;
```

## 💾 Phase 3: Database Persistence

### When Data is Saved

1. **Player Sold** - Immediate save
```javascript
socket.on('mark-sold', async (data) => {
  // Update in-memory state
  updateAuctionState(data);
  
  // Save to database
  await Player.update({
    status: 'sold',
    soldPrice: data.price,
    teamId: data.teamId
  }, {
    where: { id: data.playerId }
  });
  
  // Update team purse
  await Team.update({
    purse: sequelize.literal(`purse - ${data.price}`)
  }, {
    where: { id: data.teamId }
  });
  
  // Broadcast update
  io.emit('player-sold', auctionState);
});
```

2. **Player Unsold** - Immediate save
```javascript
socket.on('mark-unsold', async (data) => {
  await Player.update({
    status: 'unsold'
  }, {
    where: { id: data.playerId }
  });
  
  io.emit('player-unsold', auctionState);
});
```

3. **Auction End** - Batch save
```javascript
socket.on('end-auction', async () => {
  // Save all pending changes
  await saveFinalAuctionState(auctionState);
  
  // Generate report
  const report = await generateAuctionReport();
  
  // Broadcast end
  io.emit('auction-ended', { auctionState, report });
});
```

## 📡 Phase 4: Real-Time Broadcast

### Broadcasting to All Clients
```javascript
// Broadcast auction state to all connected users
io.emit('auction-state', auctionState);

// Broadcast to specific role
io.to('presenters').emit('presenter-update', data);

// Broadcast to specific team
io.to(`team-${teamId}`).emit('team-update', data);
```

### Client-Side Reception
```typescript
// React component receiving updates
useEffect(() => {
  socket.on('auction-state', (state) => {
    // Update Zustand store
    useAuctionStore.setState({
      currentPlayer: state.currentPlayer,
      isActive: state.isActive,
      teams: state.teams
    });
  });
  
  socket.on('player-sold', (state) => {
    // Show notification
    toast.success(`${state.currentPlayer.name} sold to ${state.currentBid.teamName}!`);
  });
}, []);
```

## 🎯 Complete User Flow Examples

### Example 1: Starting an Auction

**Step 1** - Presenter clicks "Start Auction"
```typescript
// Frontend (Presenter)
const handleStartAuction = () => {
  socket.emit('start-auction', {});
};
```

**Step 2** - Server processes event
```javascript
// Backend
socket.on('start-auction', async () => {
  // Check permissions
  if (socket.user.role !== 'presenter') {
    return socket.emit('error', { message: 'Access denied' });
  }
  
  // Update state
  auctionState.isActive = true;
  auctionState.isPaused = false;
  auctionState.currentPlayerIndex = 0;
  auctionState.currentPlayer = auctionState.players[0];
  
  // Broadcast to all
  io.emit('auction-started', auctionState);
});
```

**Step 3** - All clients receive update
```typescript
// Frontend (All Users)
socket.on('auction-started', (state) => {
  // Presenter UI shows controls
  setShowAuctionControls(true);
  
  // Viewer UI shows current player
  setCurrentPlayer(state.currentPlayer);
  
  // Status indicator turns green
  setAuctionStatus('Active');
});
```

### Example 2: Placing a Bid

**Step 1** - Viewer enters bid amount
```typescript
// Frontend (Viewer - CSK Owner)
const handlePlaceBid = (amount: number) => {
  socket.emit('place-bid', {
    playerId: currentPlayer.id,
    teamId: userTeam.id, // CSK UUID
    amount: amount
  });
};
```

**Step 2** - Server validates and processes
```javascript
// Backend
socket.on('place-bid', async (data) => {
  // Check permissions
  if (socket.user.role !== 'viewer') {
    return socket.emit('error', { message: 'Only viewers can bid' });
  }
  
  // Validate bid amount
  const team = await Team.findByPk(data.teamId);
  if (team.purse < data.amount) {
    return socket.emit('error', { message: 'Insufficient purse' });
  }
  
  // Validate bid increment
  if (data.amount <= auctionState.currentBid.amount) {
    return socket.emit('error', { message: 'Bid must be higher' });
  }
  
  // Update current bid (not saved yet)
  auctionState.currentBid = {
    amount: data.amount,
    teamId: data.teamId,
    teamName: team.name
  };
  
  // Broadcast to all
  io.emit('bid-placed', auctionState);
});
```

**Step 3** - All clients see updated bid
```typescript
// Frontend (All Users)
socket.on('bid-placed', (state) => {
  // Update current bid display
  setCurrentBid(state.currentBid.amount);
  setLeadingTeam(state.currentBid.teamName);
  
  // Show notification
  if (state.currentBid.teamId === userTeam.id) {
    toast.success('You are the leading bidder!');
  } else {
    toast.info(`${state.currentBid.teamName} bid ₹${state.currentBid.amount} Cr`);
  }
});
```

### Example 3: Selling a Player

**Step 1** - Presenter confirms sale
```typescript
// Frontend (Presenter)
const handleMarkSold = () => {
  socket.emit('mark-sold', {
    playerId: currentPlayer.id,
    teamId: currentBid.teamId,
    price: currentBid.amount
  });
};
```

**Step 2** - Server persists to database
```javascript
// Backend
socket.on('mark-sold', async (data) => {
  // Check permissions
  if (socket.user.role !== 'presenter') {
    return socket.emit('error', { message: 'Access denied' });
  }
  
  // Start transaction
  const transaction = await sequelize.transaction();
  
  try {
    // Update player
    await Player.update({
      status: 'sold',
      soldPrice: data.price,
      teamId: data.teamId
    }, {
      where: { id: data.playerId },
      transaction
    });
    
    // Update team
    await Team.update({
      purse: sequelize.literal(`purse - ${data.price}`)
    }, {
      where: { id: data.teamId },
      transaction
    });
    
    // Commit transaction
    await transaction.commit();
    
    // Update in-memory state
    const player = auctionState.players.find(p => p.id === data.playerId);
    player.status = 'sold';
    player.soldPrice = data.price;
    player.teamId = data.teamId;
    
    const team = auctionState.teams.find(t => t.id === data.teamId);
    team.purse -= data.price;
    team.totalPlayers += 1;
    
    // Broadcast to all
    io.emit('player-sold', auctionState);
    
  } catch (error) {
    await transaction.rollback();
    socket.emit('error', { message: 'Failed to save' });
  }
});
```

**Step 3** - All clients update UI
```typescript
// Frontend (All Users)
socket.on('player-sold', (state) => {
  const player = state.currentPlayer;
  const team = state.teams.find(t => t.id === player.teamId);
  
  // Show success notification
  toast.success(
    `${player.name} sold to ${team.name} for ₹${player.soldPrice} Cr!`
  );
  
  // Update team roster
  if (userTeam.id === team.id) {
    // Viewer sees their new player
    addPlayerToRoster(player);
    updateTeamPurse(team.purse);
  }
  
  // Presenter moves to next player automatically
  if (userRole === 'presenter') {
    socket.emit('next-player', {});
  }
});
```

## 📊 Data Display in Different Roles

### Admin Panel
```typescript
// Shows ALL data
- All teams with full financial details
- All players (sold/unsold)
- All bids history
- Auction statistics
- User management
```

### Presenter Panel
```typescript
// Shows ALL auction data
- Current player with bidding controls
- All teams with live purse updates
- Auction controls (start/pause/end)
- Player navigation (next/previous)
- Mark sold/unsold controls
```

### Viewer Panel (CSK Owner)
```typescript
// Shows ONLY CSK data
- CSK team details (name, purse, players)
- Current player being auctioned
- Bid placement controls
- CSK roster and spending
- Real-time auction status
```

## 🔄 State Synchronization

### On Initial Connection
```javascript
// New client connects
socket.on('connection', (socket) => {
  // Authenticate user
  const user = verifyJWT(socket.handshake.auth.token);
  socket.user = user;
  
  // Send current auction state
  socket.emit('auction-state', auctionState);
  
  // Join role-specific room
  socket.join(user.role);
  
  // Join team-specific room (for viewers)
  if (user.role === 'viewer' && user.teamId) {
    socket.join(`team-${user.teamId}`);
  }
});
```

### On Reconnection
```javascript
// Client reconnects after disconnect
socket.on('connect', () => {
  // Request latest state
  socket.emit('get-auction-state', {});
  
  // Server sends full state
  socket.on('auction-state', (state) => {
    // Sync local state with server
    syncAuctionStore(state);
  });
});
```

## 🧪 Testing Data Flow

### Test Complete Flow
```bash
cd backend
node test-auction-flow.js
```

### Manual Test
```bash
# 1. Start auction (as presenter)
curl -X POST http://localhost:5000/api/test/start-auction \
  -H "Authorization: Bearer <presenter-token>"

# 2. Place bid (as viewer)
curl -X POST http://localhost:5000/api/test/place-bid \
  -H "Authorization: Bearer <viewer-token>" \
  -d '{"amount": 120}'

# 3. Mark sold (as presenter)
curl -X POST http://localhost:5000/api/test/mark-sold \
  -H "Authorization: Bearer <presenter-token>"

# 4. Verify in database
sqlite3 backend/database.sqlite "SELECT * FROM players WHERE id='player-uuid';"
```

## 🔗 Related Documentation

- [WebSocket Events](../api/WEBSOCKET-EVENTS.md) - Real-time event reference
- [REST API Reference](../api/REST-API.md) - API documentation
- [RBAC Permissions](RBAC.md) - Permission system
- [Viewer Restrictions](VIEWER-RESTRICTIONS.md) - Team filtering

---

**Last Updated**: January 29, 2025  
**Status**: ✅ Production Ready
