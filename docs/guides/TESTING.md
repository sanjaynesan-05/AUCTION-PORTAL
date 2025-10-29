# 🧪 Testing Guide

Comprehensive testing guide for the IPL Auction Portal.

## 📋 Test Checklist

Use this checklist to verify all features are working correctly.

### ✅ Authentication Tests
- [ ] Login with admin account
- [ ] Login with presenter account
- [ ] Login with viewer account (CSK)
- [ ] Login with invalid credentials (should fail)
- [ ] Access protected route without token (should fail)
- [ ] Access with expired token (should fail)

### ✅ RBAC Tests
- [ ] Admin can view all users
- [ ] Presenter cannot view users (403)
- [ ] Viewer cannot view users (403)
- [ ] Admin can create players
- [ ] Presenter cannot create players (403)
- [ ] Viewer can only see their team's players

### ✅ Viewer Restriction Tests
- [ ] CSK viewer sees only CSK players
- [ ] MI viewer sees only MI players
- [ ] CSK viewer sees only CSK team in team list
- [ ] CSK viewer cannot access MI team (403)
- [ ] Viewer can access `/my-team` endpoint

### ✅ Auction Flow Tests
- [ ] Presenter can start auction
- [ ] Viewer cannot start auction (403)
- [ ] Viewer can place bid
- [ ] Admin cannot place bid (403)
- [ ] Presenter can mark player as sold
- [ ] Presenter can navigate players
- [ ] All clients receive real-time updates

### ✅ WebSocket Tests
- [ ] Client connects successfully with valid token
- [ ] Connection fails with invalid token
- [ ] All roles receive `auction-state` on connect
- [ ] Bid updates broadcast to all clients
- [ ] Player sold updates broadcast to all clients

---

## 🛠️ Manual Testing

### 1. Authentication Testing

#### Test Admin Login
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Expected: 200 OK with token and role "admin"
```

#### Test Invalid Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'

# Expected: 401 Unauthorized
```

### 2. RBAC Testing

#### Test Admin Access to Users
```bash
# Login as admin first, then:
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer <admin-token>"

# Expected: 200 OK with list of users
```

#### Test Presenter Access to Users
```bash
# Login as presenter first, then:
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer <presenter-token>"

# Expected: 403 Forbidden
```

### 3. Viewer Restriction Testing

#### Test CSK Viewer Sees Only CSK
```bash
# Login as csk_owner
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"csk_owner","password":"password123"}' \
  | jq -r '.data.token')

# Get players (should only show CSK)
curl http://localhost:5000/api/players \
  -H "Authorization: Bearer $TOKEN"

# Get teams (should only show CSK)
curl http://localhost:5000/api/teams \
  -H "Authorization: Bearer $TOKEN"

# Expected: Only CSK data in both responses
```

#### Test Cross-Team Access Denial
```bash
# Try to access MI team with CSK token
curl http://localhost:5000/api/teams/mi-uuid \
  -H "Authorization: Bearer $TOKEN"

# Expected: 403 Forbidden
```

### 4. Auction Flow Testing

#### Test Start Auction (Presenter)
```bash
# Via WebSocket (see WebSocket test script)
socket.emit('start-auction', {});

# Expected: All clients receive 'auction-started' event
```

#### Test Place Bid (Viewer)
```bash
socket.emit('place-bid', {
  playerId: 'current-player-uuid',
  teamId: 'csk-uuid',
  amount: 120
});

# Expected: All clients receive 'bid-placed' event
```

---

## 🤖 Automated Testing

### Backend Tests

#### Run All Tests
```bash
cd backend
npm test
```

#### Test RBAC
```bash
cd backend
node test-rbac.js
```

**Expected Output:**
```
🧪 Testing Admin Account...
✅ Admin can view all users
✅ Admin can create players

🧪 Testing Presenter Account...
❌ Presenter cannot view users (403) ✓
✅ Presenter can start auction

🧪 Testing Viewer Account...
❌ Viewer cannot view users (403) ✓
✅ Viewer can place bids
❌ Viewer cannot start auction (403) ✓
```

#### Test Viewer Restrictions
```bash
cd backend
node test-viewer-restrictions.js
```

**Expected Output:**
```
🧪 Testing CSK Viewer
✅ Login successful
✅ Got own team: Chennai Super Kings
✅ Teams filtered - Only sees CSK
✅ Players filtered - 15 CSK players, 0 others
✅ Access denied for MI team (403)

🧪 Testing MI Viewer
✅ Login successful
✅ Got own team: Mumbai Indians
✅ Teams filtered - Only sees MI
✅ Players filtered - 18 MI players, 0 others
✅ Access denied for CSK team (403)
```

#### Test WebSocket
```bash
cd backend
node test-websocket.js
```

**Expected Output:**
```
✅ WebSocket Connected
✅ Socket ID: abc123
✅ Transport: websocket
✅ Received auction-state
✅ Presenter can start auction
✅ Viewer can place bid
✅ All events working correctly
```

### Frontend Tests

#### Component Tests
```bash
cd frontend
npm test
```

#### E2E Tests (if configured)
```bash
cd frontend
npm run test:e2e
```

---

## 🔍 Test Scenarios

### Scenario 1: Complete Auction Flow

**Objective**: Test full auction from start to finish

**Steps**:
1. Login as presenter
2. Start auction
3. Login as 2-3 viewers in different browsers/tabs
4. Viewers place bids on current player
5. Presenter marks player as sold
6. Verify player appears in winning team's roster
7. Verify team's purse is reduced
8. Presenter moves to next player
9. Repeat for 3-5 players
10. Presenter ends auction

**Expected**:
- All actions succeed
- All viewers see real-time updates
- Data persists in database
- Team rosters and purses update correctly

### Scenario 2: Viewer Isolation

**Objective**: Verify viewers can only see their team's data

**Steps**:
1. Login as `csk_owner`
2. Note the available players (should be CSK only)
3. Try to access MI team via API
4. Login as `mi_owner` in another browser
5. Note the available players (should be MI only)
6. Verify CSK viewer cannot see MI's data

**Expected**:
- Each viewer sees only their team
- Cross-team API calls return 403
- No data leakage between teams

### Scenario 3: Permission Boundaries

**Objective**: Test role permission enforcement

**Steps**:
1. Login as viewer
2. Try to start auction (should fail)
3. Try to create a player (should fail)
4. Try to place a bid (should succeed)
5. Login as presenter
6. Try to place a bid (should fail)
7. Try to start auction (should succeed)

**Expected**:
- Viewers can only bid
- Presenters can only control auction
- All unauthorized actions return 403

---

## 📊 Performance Testing

### Load Test (Optional)

```bash
# Install Apache Bench
# Windows: Download from Apache website
# Mac: brew install httpd
# Linux: sudo apt install apache2-utils

# Test login endpoint
ab -n 1000 -c 10 -p login.json -T application/json \
  http://localhost:5000/api/auth/login
```

### WebSocket Load Test

```javascript
// test-websocket-load.js
const io = require('socket.io-client');

// Connect 100 clients
for (let i = 0; i < 100; i++) {
  const socket = io('http://localhost:5000', {
    auth: { token: getToken() }
  });
  
  socket.on('connect', () => {
    console.log(`Client ${i} connected`);
  });
}
```

---

## 🐛 Debugging Tests

### Enable Debug Logs

```bash
# Backend
cd backend
DEBUG=* npm start

# Frontend
cd frontend
npm run dev -- --debug
```

### Check Database State

```bash
# Open SQLite database
cd backend
sqlite3 database.sqlite

# Check users
SELECT * FROM users;

# Check players
SELECT * FROM players WHERE status='sold';

# Check teams
SELECT id, name, purse FROM teams;
```

### Check WebSocket Connections

```javascript
// In server.postgres.js
io.on('connection', (socket) => {
  console.log('New connection:', socket.id, socket.user);
  
  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
  });
});
```

---

## ✅ Test Report Template

After testing, document results:

### Test Execution Report

**Date**: YYYY-MM-DD  
**Tester**: Name  
**Environment**: Local / Dev / Staging

| Test Area | Test Cases | Passed | Failed | Notes |
|-----------|------------|--------|--------|-------|
| Authentication | 6 | 6 | 0 | All login tests passed |
| RBAC | 8 | 7 | 1 | Viewer bid test intermittent |
| Viewer Restrictions | 5 | 5 | 0 | All isolation tests passed |
| Auction Flow | 7 | 6 | 1 | Sold event delay (~500ms) |
| WebSocket | 5 | 5 | 0 | All real-time tests passed |

**Total**: 31 passed, 2 failed

**Issues Found**:
1. Viewer bid test occasionally times out - investigate network
2. Sold event has 500ms delay - optimize database query

---

## 🔗 Related Documentation

- [Test Accounts](TEST-ACCOUNTS.md) - All test credentials
- [REST API Reference](../api/REST-API.md) - API endpoints
- [WebSocket Events](../api/WEBSOCKET-EVENTS.md) - Real-time events
- [RBAC Permissions](../features/RBAC.md) - Role permissions

---

**Last Updated**: January 30, 2025  
**Test Scripts Location**: `backend/*.js`  
**Status**: ✅ Ready for Testing
