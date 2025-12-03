# 📚 DEVELOPER QUICK REFERENCE

## How to Use the DataService

### Import the service
```typescript
import { dataService, Player, Team } from '../services/dataService';
```

### Use in components
```typescript
// Functional component with hooks
const [players, setPlayers] = useState<Player[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    const data = await dataService.getPlayers();
    setPlayers(data);
    setLoading(false);
  };
  fetchData();
}, []);
```

### Use in Zustand store
```typescript
// Store actions already call dataService
const { startAuction, placeBid, markSold } = useAuctionStore();

// These are now async
await startAuction();
await placeBid(1, 2, 5000000); // playerId, teamId, amount
await markSold(1, 2, 5000000); // playerId, teamId, price
```

---

## API Endpoints Reference

### Authentication
```
POST /auth/login
- Request: { username, password }
- Response: { access_token, user }

POST /auth/logout
- Request: {}
- Response: { message }

GET /auth/me (requires Bearer token)
- Response: { user }
```

### Players
```
GET /players
- Response: Player[]

GET /players/{id}
- Response: Player

POST /players
- Request: { name, role, basePrice, image?, team?, status? }
- Response: Player

PUT /players/{id}
- Request: Partial<Player>
- Response: Player

DELETE /players/{id}
- Response: { message }
```

### Teams
```
GET /teams
- Response: Team[]

GET /teams/{id}
- Response: Team

PUT /teams/{id}/purse
- Request: { purse }
- Response: Team
```

### Auction
```
GET /auction/state
- Response: AuctionState

POST /auction/start
- Request: {}
- Response: AuctionState

POST /auction/pause
- Request: {}
- Response: AuctionState

POST /auction/resume
- Request: {}
- Response: AuctionState

POST /auction/next
- Request: {}
- Response: AuctionState

POST /auction/previous
- Request: {}
- Response: AuctionState

POST /auction/bid
- Request: { player_id, team_id, bid_amount }
- Response: AuctionState

POST /auction/mark-sold
- Request: { player_id, team_id, final_price }
- Response: AuctionState

POST /auction/mark-unsold
- Request: { player_id }
- Response: AuctionState

POST /auction/reset
- Request: {}
- Response: AuctionState
```

---

## Type Definitions

### Player
```typescript
interface Player {
  id?: number;
  name: string;
  role: string;          // 'batsman' | 'bowler' | 'all-rounder'
  basePrice: number;     // in lakhs
  image?: string;        // URL
  team?: string;         // Team name if sold
  soldPrice?: number;    // Final price if sold
  soldTo?: string;       // Team name if sold
  status?: 'available' | 'sold' | 'unsold';
}
```

### Team
```typescript
interface Team {
  id?: number;
  name: string;          // Full team name
  shortName: string;     // 3-letter code
  color: string;         // Hex color for UI
  logo?: string;         // Logo URL
  purchasedPlayers?: Player[];
  purseRemaining: number; // Remaining budget in lakhs
}
```

### AuctionState
```typescript
interface AuctionState {
  auctionId?: number;
  currentPlayer?: Player;
  currentBid?: number;   // Current highest bid
  currentBidder?: string; // Team that placed bid
  status: 'idle' | 'ongoing' | 'paused' | 'completed';
  totalPlayers?: number;
  playersProcessed?: number;
  purchasedCount?: number;
  unsoldCount?: number;
  timeRemaining?: number;
  teams?: Team[];
}
```

### User
```typescript
interface User {
  id?: number;
  username: string;
  role: 'admin' | 'presenter' | 'viewer' | 'team';
  teamName?: string;
  email?: string;
}
```

---

## Store Actions Cheat Sheet

### Start the auction
```typescript
const { startAuction } = useAuctionStore();
await startAuction();
```

### Place a bid
```typescript
const { placeBid } = useAuctionStore();
await placeBid(teamId, amount);
```

### Place bid from viewer (with validation)
```typescript
const { placeBidFromViewer } = useAuctionStore();
const result = await placeBidFromViewer(amount, teamId);
if (result.success) {
  console.log('Bid accepted');
} else {
  console.log(result.message); // Error message
}
```

### Mark player as sold
```typescript
const { markSold } = useAuctionStore();
await markSold(playerId, teamId, finalPrice);
```

### Mark player as unsold
```typescript
const { markUnsold } = useAuctionStore();
await markUnsold(playerId);
```

### Pause/Resume
```typescript
const { pauseAuction, resumeAuction } = useAuctionStore();
await pauseAuction();
await resumeAuction();
```

### Move to next/previous player
```typescript
const { nextPlayer, previousPlayer } = useAuctionStore();
await nextPlayer();
await previousPlayer();
```

### Reset auction
```typescript
const { resetAuction } = useAuctionStore();
await resetAuction();
```

---

## Sample Usage in Component

```typescript
import { useAuctionStore } from '../store/useAuctionStore';
import { dataService } from '../services/dataService';

export function AuctionController() {
  const {
    auctionStarted,
    currentPlayer,
    currentBid,
    startAuction,
    nextPlayer,
    markSold,
  } = useAuctionStore();

  const handleStartAuction = async () => {
    await startAuction();
  };

  const handleMarkSold = async (teamId: number, finalPrice: number) => {
    if (currentPlayer?.id) {
      await markSold(currentPlayer.id, teamId, finalPrice);
      // Auto-move to next player
      await nextPlayer();
    }
  };

  if (!auctionStarted) {
    return <button onClick={handleStartAuction}>Start Auction</button>;
  }

  return (
    <div>
      <h2>{currentPlayer?.name}</h2>
      <p>Current Bid: ₹{currentBid}L</p>
      <button onClick={() => handleMarkSold(1, currentBid)}>
        Mark Sold
      </button>
    </div>
  );
}
```

---

## Error Handling Best Practice

```typescript
const handleAction = async () => {
  try {
    const result = await dataService.someMethod();
    if (result) {
      console.log('Success');
    }
  } catch (error) {
    console.error('Failed to perform action:', error);
    // Show user-friendly error message
  }
};
```

---

## Testing API Manually

### Using curl
```bash
# Get all players
curl http://localhost:8000/players

# Get all teams
curl http://localhost:8000/teams

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin@123"}'

# Start auction (with token)
curl -X POST http://localhost:8000/auction/start \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Using API Documentation
Go to: http://localhost:8000/docs

This opens interactive Swagger UI where you can:
- See all endpoints
- View request/response schemas
- Test endpoints directly
- Authorize with JWT token

---

## Common Issues & Solutions

### "Cannot find module 'dataService'"
✅ Make sure you're importing from `../services/dataService`

### "Async/await not working"
✅ Make sure your function is async:
```typescript
const handleClick = async () => {
  await dataService.getPlayers();
}
```

### "Store not updating"
✅ Remember store actions are now async:
```typescript
// Wrong: await not used
startAuction();

// Right: await the promise
await startAuction();
```

### "API calls return null"
✅ Check that backend is running on port 8000
✅ Check JWT token is set with `apiClient.setToken(token)`
✅ Check browser console for detailed errors

---

## Development Workflow

1. **Start Backend**
   ```bash
   cd backend
   source venv/bin/activate  # or .\venv\Scripts\Activate.ps1
   python -m uvicorn app.main:app --reload --port 8000
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Monitor Network**
   - Open DevTools (F12)
   - Go to Network tab
   - Perform actions and watch API calls

4. **Debug Store**
   - Open Redux DevTools extension (if installed)
   - Or log store state: `console.log(useAuctionStore.getState())`

---

## Performance Tips

- ✅ Use store data when possible (already fetched)
- ✅ Avoid multiple API calls in useEffect (dependency array)
- ✅ Implement loading states for better UX
- ✅ Cache team/player lists in store
- ✅ Use pagination for large datasets

---

## Production Checklist

- [ ] Remove console.log statements
- [ ] Add proper error boundaries
- [ ] Implement retry logic for failed API calls
- [ ] Add loading indicators
- [ ] Test all user flows
- [ ] Set up environment variables
- [ ] Enable HTTPS for API calls
- [ ] Configure CORS properly
- [ ] Set up monitoring/logging
- [ ] Test on multiple devices

---

**Last Updated**: 2024
**Backend Version**: Python 3.10+, FastAPI, SQLAlchemy
**Frontend Version**: React 18, TypeScript, Zustand, Vite
