# 🔐 Role-Based Access Control (RBAC)

## Updated WebSocket Event Permissions

---

## 📊 Permission Matrix

| Event | Admin | Presenter | Viewer | Description |
|-------|-------|-----------|--------|-------------|
| **Listen to `auction-state`** | ✅ | ✅ | ✅ | Receive real-time auction updates |
| **`start-auction`** | ✅ | ✅ | ❌ | Start the auction session |
| **`pause-auction`** | ✅ | ✅ | ❌ | Pause/resume auction |
| **`set-current-player`** | ✅ | ✅ | ❌ | Select player for bidding |
| **`place-bid`** | ❌ | ❌ | ✅ | Place bids on players (Viewers only!) |
| **`mark-sold`** (assign-player) | ✅ | ✅ | ❌ | Finalize player assignment |
| **`reset-auction`** | ✅ | ❌ | ❌ | Reset entire auction state |

---

## 👤 Role Descriptions

### 🔴 Admin
**Full Control** - Complete access to all auction features
- ✅ Start/pause/reset auction
- ✅ Manage players and teams
- ✅ View all auction data
- ✅ Control auction flow
- ❌ Cannot place bids (conflict of interest)

**Use Case:** System administrator, auction organizer

### 🟡 Presenter
**Auction Controller** - Can run the auction but cannot reset
- ✅ Start/pause auction
- ✅ Select players for bidding
- ✅ Mark players as sold
- ✅ View all auction data
- ❌ Cannot reset auction
- ❌ Cannot place bids

**Use Case:** Auctioneer, host, presenter on stage

### 🟢 Viewer
**Bidder** - Can only place bids and watch auction
- ✅ Receive real-time auction updates
- ✅ **Place bids on players** (primary role)
- ✅ View current player and bids
- ❌ Cannot control auction flow
- ❌ Cannot manage players/teams

**Use Case:** Team owners, bidders, participants

---

## 🔄 Why This Design?

### Separation of Concerns
```
┌──────────────┐
│    Admin     │ → Manages system, resets auction
├──────────────┤
│  Presenter   │ → Controls auction flow, no bidding
├──────────────┤
│   Viewer     │ → Places bids only, no control
└──────────────┘
```

### Key Principle
**"Those who control the auction cannot bid"**
- Prevents conflict of interest
- Ensures fair bidding
- Maintains auction integrity
- Viewers focus on bidding
- Admins/Presenters focus on facilitation

---

## 🎯 Usage Examples

### Admin Flow
```javascript
// Admin starts auction
socket.emit('start-auction', {});

// Admin can reset if needed
socket.emit('reset-auction', {});

// Admin CANNOT bid
socket.emit('place-bid', { teamId: 1, bidAmount: 15000000 });
// ❌ Error: "Unauthorized: Only viewers can place bids"
```

### Presenter Flow
```javascript
// Presenter starts auction
socket.emit('start-auction', {});

// Presenter sets current player
socket.emit('set-current-player', { playerId: 123 });

// Presenter marks player as sold
socket.emit('mark-sold', {});

// Presenter CANNOT reset
socket.emit('reset-auction', {});
// ❌ Error: "Unauthorized: Only admin can reset auction"

// Presenter CANNOT bid
socket.emit('place-bid', { teamId: 1, bidAmount: 15000000 });
// ❌ Error: "Unauthorized: Only viewers can place bids"
```

### Viewer Flow
```javascript
// Viewer listens to auction updates
socket.on('auction-state', (data) => {
  console.log('Current player:', data.currentPlayer);
  console.log('Current bid:', data.currentBid);
});

// Viewer places bid
socket.emit('place-bid', { 
  teamId: 1, 
  bidAmount: 15000000 
});
// ✅ Success! Bid placed

// Viewer CANNOT control auction
socket.emit('start-auction', {});
// ❌ Error: "Unauthorized: Only admin/presenter can start auction"

socket.emit('set-current-player', { playerId: 123 });
// ❌ Error: "Unauthorized: Only admin/presenter can set player"
```

---

## 🧪 Testing RBAC

### Run the RBAC Test Suite
```bash
cd backend
node test-rbac.js
```

### Expected Output
```
📊 ROLE-BASED ACCESS CONTROL SUMMARY
═══════════════════════════════════════════════════════════

┌─────────────────────────┬───────┬───────────┬─────────┐
│ Event                   │ Admin │ Presenter │ Viewer  │
├─────────────────────────┼───────┼───────────┼─────────┤
│ auction-state           │  ✅   │    ✅     │   ✅    │
│ start-auction           │  ✅   │    ✅     │   ❌    │
│ pause-auction           │  ✅   │    ✅     │   ❌    │
│ set-current-player      │  ✅   │    ✅     │   ❌    │
│ place-bid               │  ❌   │    ❌     │   ✅    │
│ assign-player           │  ✅   │    ✅     │   ❌    │
│ reset-auction           │  ✅   │    ❌     │   ❌    │
└─────────────────────────┴───────┴───────────┴─────────┘
```

---

## 🔒 Security Implementation

### JWT Token Validation
```javascript
// Backend: server.postgres.js
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  socket.user = {
    id: decoded.id,
    username: decoded.username,
    role: decoded.role  // 'admin', 'presenter', or 'viewer'
  };
  
  next();
});
```

### Role Check Middleware
```javascript
// Example: place-bid event (Viewer only)
socket.on('place-bid', async (data) => {
  if (socket.user.role !== 'viewer') {
    socket.emit('error', { 
      message: 'Unauthorized: Only viewers can place bids' 
    });
    return;
  }
  // Process bid...
});

// Example: start-auction event (Admin/Presenter)
socket.on('start-auction', async (data) => {
  if (!['admin', 'presenter'].includes(socket.user.role)) {
    socket.emit('error', { 
      message: 'Unauthorized: Only admin/presenter can start auction' 
    });
    return;
  }
  // Start auction...
});

// Example: reset-auction event (Admin only)
socket.on('reset-auction', async (data) => {
  if (socket.user.role !== 'admin') {
    socket.emit('error', { 
      message: 'Unauthorized: Only admin can reset auction' 
    });
    return;
  }
  // Reset auction...
});
```

---

## 📝 Frontend Integration

### Role-Based UI Components

```javascript
// React component with role-based rendering
import { useAuth } from './context/AuthContext';
import socket from './services/socket';

function AuctionControls() {
  const { user } = useAuth();

  return (
    <div>
      {/* All users see auction state */}
      <AuctionStatus />

      {/* Admin and Presenter see controls */}
      {['admin', 'presenter'].includes(user.role) && (
        <div>
          <button onClick={() => socket.emit('start-auction', {})}>
            Start Auction
          </button>
          <button onClick={() => socket.emit('pause-auction', {})}>
            Pause Auction
          </button>
          <button onClick={() => socket.emit('set-current-player', { playerId: 1 })}>
            Next Player
          </button>
        </div>
      )}

      {/* Only Admin sees reset */}
      {user.role === 'admin' && (
        <button onClick={() => socket.emit('reset-auction', {})}>
          Reset Auction
        </button>
      )}

      {/* Only Viewer sees bid button */}
      {user.role === 'viewer' && (
        <button onClick={() => socket.emit('place-bid', { 
          teamId: selectedTeam, 
          bidAmount: bidAmount 
        })}>
          Place Bid
        </button>
      )}
    </div>
  );
}
```

---

## ✅ Summary

### Key Changes Made:
1. ✅ **`place-bid`** now restricted to **Viewer role only**
2. ✅ Admin and Presenter **cannot place bids**
3. ✅ Maintains fair auction practices
4. ✅ Clear separation of roles
5. ✅ Prevents conflict of interest

### Benefits:
- 🔒 Enhanced security
- ⚖️ Fair bidding process
- 🎯 Clear role boundaries
- 👥 Better user experience
- 🛡️ Prevents abuse

### Files Updated:
- ✅ `backend/server.postgres.js` - Updated `place-bid` permissions
- ✅ `backend/test-rbac.js` - New comprehensive RBAC test
- ✅ `RBAC-PERMISSIONS.md` - Complete documentation

**Your auction system now has proper role-based access control!** 🎉
