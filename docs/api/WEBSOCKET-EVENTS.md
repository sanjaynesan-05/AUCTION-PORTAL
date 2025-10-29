# 📡 WebSocket Events Reference

Real-time event documentation for the IPL Auction Portal using Socket.io.

## 🔌 Connection

### Connect to Server
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: '<jwt-token>'  // Include JWT token for authentication
  }
});
```

### Connection Events
```javascript
// Connected successfully
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

// Disconnected
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

// Connection error
socket.on('connect_error', (error) => {
  console.error('Connection failed:', error.message);
});
```

---

## 📤 Events Client Can Emit

### 🎤 Presenter Events

#### start-auction
Start the auction.

**Permission**: Presenter only

**Emit:**
```javascript
socket.emit('start-auction', {});
```

**Server Response:**
- Broadcasts `auction-started` to all clients
- Updates auction state to active

---

#### pause-auction
Pause the ongoing auction.

**Permission**: Presenter only

**Emit:**
```javascript
socket.emit('pause-auction', {});
```

**Server Response:**
- Broadcasts `auction-paused` to all clients

---

#### resume-auction
Resume a paused auction.

**Permission**: Presenter only

**Emit:**
```javascript
socket.emit('resume-auction', {});
```

**Server Response:**
- Broadcasts `auction-resumed` to all clients

---

#### end-auction
End the auction completely.

**Permission**: Presenter only

**Emit:**
```javascript
socket.emit('end-auction', {});
```

**Server Response:**
- Saves final auction state to database
- Broadcasts `auction-ended` to all clients

---

#### next-player
Move to the next player.

**Permission**: Presenter only

**Emit:**
```javascript
socket.emit('next-player', {});
```

**Server Response:**
- Broadcasts `player-changed` with new current player

---

#### previous-player
Move to the previous player.

**Permission**: Presenter only

**Emit:**
```javascript
socket.emit('previous-player', {});
```

**Server Response:**
- Broadcasts `player-changed` with new current player

---

#### mark-sold
Mark current player as sold to a team.

**Permission**: Presenter only

**Emit:**
```javascript
socket.emit('mark-sold', {
  playerId: 'player-uuid',
  teamId: 'team-uuid',
  price: 150  // In crores
});
```

**Server Response:**
- Updates player in database
- Updates team purse
- Broadcasts `player-sold` to all clients

---

#### mark-unsold
Mark current player as unsold.

**Permission**: Presenter only

**Emit:**
```javascript
socket.emit('mark-unsold', {
  playerId: 'player-uuid'
});
```

**Server Response:**
- Updates player in database
- Broadcasts `player-unsold` to all clients

---

### 👥 Viewer Events

#### place-bid
Place a bid on the current player.

**Permission**: Viewer only

**Emit:**
```javascript
socket.emit('place-bid', {
  playerId: 'current-player-uuid',
  teamId: 'viewer-team-uuid',
  amount: 120  // In crores
});
```

**Validation:**
- Team has sufficient purse
- Bid is higher than current bid
- Auction is active
- Player is available for bidding

**Server Response:**
- Updates current bid (in-memory only)
- Broadcasts `bid-placed` to all clients

**Error Responses:**
```javascript
socket.on('error', (data) => {
  // "Insufficient purse"
  // "Bid must be higher than current bid"
  // "Auction is not active"
  // "Only viewers can place bids"
});
```

---

## 📥 Events Client Receives

### auction-state
Full auction state sent on connection or state change.

**Listen:**
```javascript
socket.on('auction-state', (state) => {
  console.log('Auction state:', state);
});
```

**Payload:**
```javascript
{
  isActive: true,
  isPaused: false,
  currentPlayerIndex: 5,
  currentPlayer: {
    id: 'player-uuid',
    name: 'MS Dhoni',
    role: 'WK-Batsman',
    basePrice: 100,
    status: 'available'
  },
  currentBid: {
    amount: 120,
    teamId: 'csk-uuid',
    teamName: 'Chennai Super Kings'
  },
  players: [ /* all players */ ],
  teams: [ /* all teams */ ],
  lastUpdated: 1704067200000
}
```

---

### auction-started
Auction has started.

**Listen:**
```javascript
socket.on('auction-started', (state) => {
  console.log('Auction started!');
  // Update UI to show auction controls
});
```

---

### auction-paused
Auction has been paused.

**Listen:**
```javascript
socket.on('auction-paused', (state) => {
  console.log('Auction paused');
  // Disable bid button
});
```

---

### auction-resumed
Auction has resumed.

**Listen:**
```javascript
socket.on('auction-resumed', (state) => {
  console.log('Auction resumed');
  // Enable bid button
});
```

---

### auction-ended
Auction has ended.

**Listen:**
```javascript
socket.on('auction-ended', ({ auctionState, report }) => {
  console.log('Auction ended');
  console.log('Final report:', report);
  // Show final results
});
```

---

### player-changed
Current player has changed.

**Listen:**
```javascript
socket.on('player-changed', (state) => {
  console.log('Now showing:', state.currentPlayer.name);
  // Update current player display
  // Reset bid amount
});
```

---

### bid-placed
A new bid has been placed.

**Listen:**
```javascript
socket.on('bid-placed', (state) => {
  const { amount, teamName } = state.currentBid;
  console.log(`${teamName} bid ₹${amount} Cr`);
  
  // Show notification
  // Update bid display
});
```

---

### player-sold
Player has been sold to a team.

**Listen:**
```javascript
socket.on('player-sold', (state) => {
  const player = state.currentPlayer;
  const team = state.teams.find(t => t.id === player.teamId);
  
  console.log(`${player.name} sold to ${team.name} for ₹${player.soldPrice} Cr`);
  
  // Show success notification
  // Update team roster
  // Update team purse
});
```

---

### player-unsold
Player went unsold.

**Listen:**
```javascript
socket.on('player-unsold', (state) => {
  const player = state.currentPlayer;
  
  console.log(`${player.name} went unsold`);
  
  // Show notification
  // Move to next player
});
```

---

### error
Error message for the client.

**Listen:**
```javascript
socket.on('error', (data) => {
  console.error('Error:', data.message);
  
  // Show error notification to user
});
```

**Common Error Messages:**
- `"Access denied"` - Insufficient permissions
- `"Invalid token"` - Authentication failed
- `"Insufficient purse"` - Team cannot afford bid
- `"Bid must be higher"` - Bid amount too low
- `"Auction is not active"` - Cannot bid when paused/ended
- `"Only viewers can bid"` - Non-viewer tried to bid
- `"Only presenters can control auction"` - Non-presenter tried to control

---

## 🔄 Complete Flow Examples

### Example 1: Auction Start Flow

```javascript
// Presenter clicks "Start Auction"
socket.emit('start-auction', {});

// All clients receive
socket.on('auction-started', (state) => {
  // Presenter UI: Show auction controls
  // Viewer UI: Show current player & bid button
  // Admin UI: Show auction monitoring
});
```

### Example 2: Bidding Flow

```javascript
// Viewer (CSK) places bid
socket.emit('place-bid', {
  playerId: 'player-123',
  teamId: 'csk-uuid',
  amount: 120
});

// All clients receive
socket.on('bid-placed', (state) => {
  // state.currentBid = { amount: 120, teamId: 'csk-uuid', teamName: 'CSK' }
  
  // Show: "CSK bid ₹120 Cr"
  // Update leading bidder display
});

// MI places higher bid
socket.emit('place-bid', {
  playerId: 'player-123',
  teamId: 'mi-uuid',
  amount: 130
});

// All clients receive
socket.on('bid-placed', (state) => {
  // state.currentBid = { amount: 130, teamId: 'mi-uuid', teamName: 'MI' }
  
  // Show: "MI bid ₹130 Cr"
  // Update leading bidder
});
```

### Example 3: Player Sold Flow

```javascript
// Presenter confirms sale
socket.emit('mark-sold', {
  playerId: 'player-123',
  teamId: 'mi-uuid',
  price: 130
});

// All clients receive
socket.on('player-sold', (state) => {
  // state.currentPlayer.status = 'sold'
  // state.currentPlayer.soldPrice = 130
  // state.currentPlayer.teamId = 'mi-uuid'
  
  // MI team purse reduced by 130
  // MI roster gains new player
  
  // Show success notification
  // Presenter auto-moves to next player
});
```

---

## 🛡️ Security & Authentication

### Token Authentication
```javascript
// Include JWT in connection
const socket = io('http://localhost:5000', {
  auth: { token: jwtToken }
});

// Server verifies token and attaches user info
// socket.user = { id, username, role, teamId }
```

### Permission Checks
```javascript
// Server-side validation
socket.on('start-auction', async () => {
  // Check if presenter
  if (socket.user.role !== 'presenter') {
    return socket.emit('error', { 
      message: 'Only presenters can start auction' 
    });
  }
  
  // Proceed with auction start
});
```

---

## 🧪 Testing WebSocket Events

### Test Script
```bash
cd backend
node test-websocket.js
```

### Manual Test with JavaScript
```javascript
// Connect
const socket = io('http://localhost:5000', {
  auth: { token: '<your-jwt-token>' }
});

// Listen for connection
socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);
  
  // Test event
  socket.emit('place-bid', {
    playerId: 'player-uuid',
    teamId: 'team-uuid',
    amount: 100
  });
});

// Listen for response
socket.on('bid-placed', (state) => {
  console.log('✅ Bid placed:', state.currentBid);
});

socket.on('error', (data) => {
  console.error('❌ Error:', data.message);
});
```

---

## 📊 Event Summary Table

| Event | Emitter | Receiver | Permission |
|-------|---------|----------|------------|
| `start-auction` | Presenter | - | Presenter |
| `pause-auction` | Presenter | - | Presenter |
| `resume-auction` | Presenter | - | Presenter |
| `end-auction` | Presenter | - | Presenter |
| `next-player` | Presenter | - | Presenter |
| `previous-player` | Presenter | - | Presenter |
| `mark-sold` | Presenter | - | Presenter |
| `mark-unsold` | Presenter | - | Presenter |
| `place-bid` | Viewer | - | Viewer |
| `auction-state` | Server | All | - |
| `auction-started` | Server | All | - |
| `auction-paused` | Server | All | - |
| `auction-resumed` | Server | All | - |
| `auction-ended` | Server | All | - |
| `player-changed` | Server | All | - |
| `bid-placed` | Server | All | - |
| `player-sold` | Server | All | - |
| `player-unsold` | Server | All | - |
| `error` | Server | Sender | - |

---

## 🔗 Related Documentation

- [REST API Reference](REST-API.md) - HTTP endpoints
- [RBAC Permissions](../features/RBAC.md) - Role permissions
- [Auction Flow](../features/AUCTION-FLOW.md) - Data flow
- [Testing Guide](../guides/TESTING.md) - Testing instructions

---

**WebSocket URL**: `ws://localhost:5000`  
**Last Updated**: January 30, 2025  
**Socket.io Version**: 4.8.1
