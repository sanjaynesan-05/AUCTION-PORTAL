# COMPLETE REFACTORING GUIDE - Admin-Controlled Auction System

## ✅ COMPLETED - BACKEND

### Models Refactored (backend/app/models/orm.py)
- ✅ Player: status (PENDING/SOLD), sold_price, sold_to_team_id
- ✅ Team: Simplified to id, name, color
- ✅ AuctionState: Singleton with status (IDLE/LIVE/SOLD)
- ✅ Removed BidHistory, user team associations
- ✅ Added timezone-aware UTC timestamps

### API Endpoints Created
- ✅ Admin API (backend/app/api/admin.py):
  - POST /admin/auction/select-player
  - POST /admin/auction/start
  - POST /admin/auction/increment
  - POST /admin/auction/end
  - POST /admin/auction/next
  
- ✅ Public API (backend/app/api/public.py):
  - GET /auction/state
  - GET /auction/players
  - GET /auction/teams
  - GET /auction/players/pending

### WebSocket Updated
- ✅ Broadcast-only (backend/app/api/websocket.py)
- ✅ Auto-broadcast on admin actions
- ✅ Thread-safe updates

### Auth Enhanced
- ✅ require_admin() middleware added
- ✅ Admin-only access control

### Seed Updated
- ✅ New schema compatibility
- ✅ Players start as PENDING
- ✅ Simplified team data
- ✅ Admin users only

## 🔄 IN PROGRESS - FRONTEND

### Files to Delete
```powershell
Remove-Item frontend\src\pages\ViewerScreen.tsx
Remove-Item frontend\src\pages\AdminPanel.tsx (will recreate)
Remove-Item frontend\src\pages\PresenterPanel.tsx (will recreate)
```

### AdminPanel.tsx - NEW IMPLEMENTATION NEEDED
Located at: frontend/src/pages/AdminPanel.tsx

**Required Features:**
1. Display current auction state
2. Pending players list (click to select)
3. Start Auction button (when IDLE)
4. Bid increment buttons: +₹10L, +₹25L, +₹50L, +₹100L (when LIVE)
5. Team dropdown selector (when LIVE)
6. End Auction button (finalizes sale, when LIVE with team selected)
7. Next Player button (when SOLD)
8. Real-time state refresh (poll or WebSocket)

**API Calls:**
- GET /auction/state (poll every 2s)
- GET /auction/players/pending
- GET /auction/teams
- POST /admin/auction/select-player {player_id}
- POST /admin/auction/start {}
- POST /admin/auction/increment {amount}
- POST /admin/auction/end {team_id}
- POST /admin/auction/next {}

### PresenterPanel.tsx - NEW IMPLEMENTATION NEEDED
Located at: frontend/src/pages/PresenterPanel.tsx

**Required Features:**
1. FULLSCREEN display
2. Current player display (name, role, image, base price)
3. Live current bid (large, prominent)
4. Auction status indicator (IDLE/LIVE/SOLD)
5. Winning team (when SOLD, with team color)
6. Smooth animations on bid updates
7. WebSocket-only (no REST mutations)
8. Auto-reconnect WebSocket

**WebSocket Integration:**
```typescript
const ws = new WebSocket(`${WS_URL}/ws/auction`);
ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  if (type === 'auction_state_update') {
    setAuctionState(data);
  }
};
```

### Routes Update (frontend/src/routes/AppRoutes.tsx)
```typescript
// Remove:
- /viewer route

// Keep:
- /login
- /admin
- /presenter (read-only display)
- /unauthorized
```

### Remove Bidder Logic
Files to clean:
- frontend/src/store/useAuctionStore.ts (remove placeBid, placeBidFromViewer)
- frontend/src/hooks/useAuctionSync.ts (simplify to admin-only actions)
- frontend/src/context/RoleContext.tsx (remove viewer role handling)

## ⏳ TODO - TESTS

### Backend Tests to Update
Located at: backend/tests/

**Test Files to Create/Update:**
1. test_admin_api.py
   - test_select_player()
   - test_start_auction()
   - test_increment_bid()
   - test_end_auction()
   - test_next_player()
   - test_prevent_bid_after_sold()
   - test_websocket_broadcast()

2. test_public_api.py
   - test_get_auction_state()
   - test_get_players()
   - test_get_teams()

3. test_websocket.py
   - test_broadcast_only()
   - test_auto_broadcast_on_state_change()

**Run Tests:**
```powershell
cd backend
pytest -v
```

## 🚀 DEPLOYMENT STEPS

1. **Database Migration:**
   ```powershell
   # Drop old tables
   # Run new migrations
   # Seed with new data
   ```

2. **Backend Deploy:**
   ```powershell
   git add backend/
   git commit -m "Backend refactor complete"
   git push origin ft/backend
   ```

3. **Frontend Build:**
   ```powershell
   cd frontend
   npm run build
   npm run preview # Test locally
   ```

4. **Frontend Deploy:**
   ```powershell
   git add frontend/
   git commit -m "Frontend refactor complete"
   git push origin ft/backend
   ```

5. **Verify:**
   - Admin login works
   - Can select player
   - Can start auction
   - Can increment bid
   - Can end auction
   - Presenter sees real-time updates
   - WebSocket reconnects on disconnect

## 📋 VERIFICATION CHECKLIST

- [ ] Backend boots without errors
- [ ] Database seeds correctly
- [ ] Admin can login
- [ ] Admin can select player
- [ ] Admin can start auction
- [ ] Admin can increment bid
- [ ] Admin can end auction
- [ ] Presenter receives WebSocket updates
- [ ] No race conditions
- [ ] One auction at a time enforced
- [ ] All tests pass
- [ ] Frontend builds without errors
- [ ] Deployed and accessible

## 🔍 KEY ARCHITECTURE DECISIONS

1. **Single Source of Truth:** AuctionState table is singleton (id=1 always)
2. **No Client Bidding:** Only admin can modify auction state
3. **WebSocket Broadcast-Only:** Clients receive updates, cannot send
4. **Timezone Aware:** All timestamps use UTC
5. **Admin-Only Auth:** Simplified to single admin role
6. **Status-Based Flow:** IDLE → LIVE → SOLD → (reset to IDLE)

## 📝 NOTES

- Old bidding system completely removed
- No user credits/purse tracking
- No bid validation for multiple clients
- Presenter is pure display (no mutations)
- Admin has full control via REST API
- WebSocket for instant updates across devices
