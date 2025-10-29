# 🔐 Role-Based Access Control (RBAC)

Complete permission system for the IPL Auction Portal.

## 👥 User Roles

### 1. Admin
**Purpose**: System administrator with full control

**Capabilities**:
- Manage all users, teams, and players
- Access all auction data
- Configure system settings
- View audit logs
- Cannot place bids (conflict of interest)

### 2. Presenter
**Purpose**: Auction host/presenter

**Capabilities**:
- Control auction flow (start, pause, resume)
- Navigate through players
- Mark players as sold/unsold
- View all teams and players
- Access real-time auction status
- Cannot place bids (conflict of interest)

### 3. Viewer (Team Owner)
**Purpose**: Team representative who participates in bidding

**Capabilities**:
- Place bids on players
- View their own team's data only
- See real-time auction updates
- Track their team's purse and spending
- Cannot see other teams' data
- Cannot control auction flow

## 📊 Permission Matrix

| Action | Admin | Presenter | Viewer |
|--------|-------|-----------|--------|
| **Authentication** |
| Login | ✅ | ✅ | ✅ |
| Register | ✅ | ❌ | ❌ |
| Change own password | ✅ | ✅ | ✅ |
| **User Management** |
| View all users | ✅ | ❌ | ❌ |
| Create users | ✅ | ❌ | ❌ |
| Edit users | ✅ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ |
| Assign teams to viewers | ✅ | ❌ | ❌ |
| **Player Management** |
| View all players | ✅ | ✅ | ❌ |
| View own team's players | ✅ | ✅ | ✅ |
| Add players | ✅ | ❌ | ❌ |
| Edit players | ✅ | ❌ | ❌ |
| Delete players | ✅ | ❌ | ❌ |
| **Team Management** |
| View all teams | ✅ | ✅ | ❌ |
| View own team | ✅ | ✅ | ✅ |
| Edit teams | ✅ | ❌ | ❌ |
| Reset team purse | ✅ | ❌ | ❌ |
| **Auction Control** |
| Start auction | ❌ | ✅ | ❌ |
| Pause auction | ❌ | ✅ | ❌ |
| Resume auction | ❌ | ✅ | ❌ |
| End auction | ❌ | ✅ | ❌ |
| Navigate players | ❌ | ✅ | ❌ |
| Mark player sold/unsold | ❌ | ✅ | ❌ |
| **Bidding** |
| Place bid | ❌ | ❌ | ✅ |
| View own bids | ❌ | ❌ | ✅ |
| View all bids | ✅ | ✅ | ❌ |
| **Real-Time Events** |
| Receive auction updates | ✅ | ✅ | ✅ |
| Receive bid updates | ✅ | ✅ | ✅ (own team) |
| Broadcast events | ❌ | ✅ | ❌ |

## 🔌 WebSocket Event Permissions

### Events Viewers Can Emit

| Event | Description | Payload |
|-------|-------------|---------|
| `place-bid` | Place bid on current player | `{ playerId, teamId, amount }` |
| `ping` | Keep connection alive | `{}` |

### Events Presenters Can Emit

| Event | Description | Payload |
|-------|-------------|---------|
| `start-auction` | Start the auction | `{}` |
| `pause-auction` | Pause the auction | `{}` |
| `resume-auction` | Resume the auction | `{}` |
| `end-auction` | End the auction | `{}` |
| `next-player` | Move to next player | `{}` |
| `previous-player` | Move to previous player | `{}` |
| `mark-sold` | Mark player as sold | `{ playerId, teamId, price }` |
| `mark-unsold` | Mark player as unsold | `{ playerId }` |

### Events All Roles Receive

| Event | Description | Who Receives |
|-------|-------------|--------------|
| `auction-state` | Full auction state | All connected users |
| `auction-started` | Auction has started | All connected users |
| `auction-paused` | Auction has paused | All connected users |
| `auction-resumed` | Auction has resumed | All connected users |
| `auction-ended` | Auction has ended | All connected users |
| `player-changed` | Current player changed | All connected users |
| `bid-placed` | New bid placed | All connected users |
| `player-sold` | Player sold to team | All connected users |
| `player-unsold` | Player went unsold | All connected users |
| `error` | Error message | Sender only |

## 🛡️ Security Implementation

### 1. JWT Authentication
All API endpoints (except login/register) require JWT token:

```javascript
// Request header
Authorization: Bearer <jwt-token>
```

Token payload includes:
```javascript
{
  id: "user-uuid",
  username: "username",
  role: "admin" | "presenter" | "viewer",
  teamId: "team-uuid" | null  // For viewers only
}
```

### 2. Middleware Protection

```javascript
// authMiddleware.js
const authMiddleware = (req, res, next) => {
  // Verify JWT token
  // Decode and attach user to req.user
  // Continue to route handler
};
```

### 3. Role Checking

```javascript
// Route example
router.post('/players', authMiddleware, async (req, res) => {
  // Check if admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  // Create player
});
```

### 4. WebSocket Authentication

```javascript
// Socket.io middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  // Verify JWT
  const user = jwt.verify(token, process.env.JWT_SECRET);
  socket.user = user;
  next();
});

// Event handler
socket.on('place-bid', (data) => {
  // Check if viewer
  if (socket.user.role !== 'viewer') {
    return socket.emit('error', { message: 'Access denied' });
  }
  
  // Process bid
});
```

## 🧪 Testing RBAC

### Test Script
```bash
cd backend
node test-rbac.js
```

### Manual Testing

#### 1. Test Admin Access
```bash
# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Try to view all users (should work)
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer <admin-token>"
```

#### 2. Test Presenter Access
```bash
# Login as presenter
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"presenter","password":"presenter123"}'

# Try to view all users (should fail with 403)
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer <presenter-token>"
```

#### 3. Test Viewer Access
```bash
# Login as CSK viewer
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"csk_owner","password":"password123"}'

# Try to view all players (should only see CSK)
curl http://localhost:5000/api/players \
  -H "Authorization: Bearer <viewer-token>"

# Try to view MI team (should fail with 403)
curl http://localhost:5000/api/teams/mi-uuid \
  -H "Authorization: Bearer <viewer-token>"
```

## 📝 Common Scenarios

### Scenario 1: Admin Creates New Player
```
1. Admin logs in
2. JWT token includes role: "admin"
3. POST /api/players with admin token
4. Middleware verifies admin role
5. Player created successfully
```

### Scenario 2: Presenter Starts Auction
```
1. Presenter logs in
2. WebSocket connection with presenter token
3. Emit 'start-auction' event
4. Socket middleware checks role === "presenter"
5. Auction starts, broadcast to all users
```

### Scenario 3: Viewer Places Bid
```
1. Viewer logs in (e.g., csk_owner)
2. JWT includes teamId for CSK
3. WebSocket emit 'place-bid' event
4. Socket middleware checks role === "viewer"
5. Backend validates teamId matches bid
6. Bid processed, broadcast to all users
```

### Scenario 4: Viewer Tries to Access Other Team
```
1. Viewer logs in (e.g., csk_owner)
2. GET /api/teams/mi-uuid with viewer token
3. Middleware decodes token, sees teamId = CSK
4. Route handler checks: teamId !== mi-uuid
5. Returns 403 Forbidden
```

## ⚠️ Security Best Practices

1. **Never Trust Client** - Always validate on server
2. **Token Expiry** - JWT tokens expire after 7 days
3. **Password Hashing** - bcryptjs with 10 salt rounds
4. **Rate Limiting** - Auth endpoints limited to 5 req/15 min
5. **Input Validation** - Express Validator on all inputs
6. **CORS Protection** - Only allowed origins can connect
7. **Helmet.js** - Security headers enabled
8. **Audit Logging** - All actions logged with Winston

## 🔗 Related Documentation

- [Viewer Restrictions](VIEWER-RESTRICTIONS.md) - Team-based filtering
- [REST API Reference](../api/REST-API.md) - API documentation
- [WebSocket Events](../api/WEBSOCKET-EVENTS.md) - Real-time events
- [Testing Guide](../guides/TESTING.md) - Testing instructions

---

**Last Updated**: January 29, 2025  
**Status**: ✅ Production Ready
