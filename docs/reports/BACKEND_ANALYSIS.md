# IPL Auction Portal - Complete Analysis & Backend Setup

## Frontend Architecture Analysis

### Routes Structure
The React application uses React Router with the following routes:

1. **`/`** → Redirects to `/login`
2. **`/login`** → Login page with role-based authentication
3. **`/admin`** → Admin panel (role-guarded: admin only)
4. **`/presenter`** → Presenter panel (role-guarded: presenter only)
5. **`/viewer`** → Viewer screen (role-guarded: viewer only)
6. **`/unauthorized`** → Unauthorized access page

### State Management
- **Library**: Zustand for global state management
- **Persistence**: localStorage for state persistence
- **Real-time Sync**: BroadcastChannel API for multi-tab synchronization

### Key Features

#### Authentication
- Three user roles: `admin`, `presenter`, `viewer`
- Mock users with credentials stored in `mockUsers.ts`
- Role-based route protection with `RoleGuard` component
- Team-specific viewers (each of 10 IPL teams has a viewer account)

#### Auction State
```typescript
{
  players: Player[]           // All players in the auction
  teams: Team[]              // All teams with their purse and players
  currentIndex: number       // Index of current player in unsold list
  currentPlayer: Player      // Currently active player
  auctionStarted: boolean    // Auction status
  auctionPaused: boolean     // Pause status
  currentBid: number         // Current highest bid
  currentBidder: number      // ID of team with highest bid
  bidHistory: BidHistory[]   // History of all bids for current player
  lastUpdate: number         // Timestamp of last update
}
```

#### Auction Operations
1. **Start Auction**: Initialize auction with first unsold player
2. **Pause/Resume**: Control auction flow
3. **Next/Previous Player**: Navigate through players
4. **Place Bid**: Viewers place bids with validation
5. **Mark Sold**: Admin/Presenter marks player as sold to team
6. **Mark Unsold**: Player remains unsold
7. **Reset Auction**: Reset all data to initial state

#### Bid Validation Rules
- First bid must be at/above base price
- Subsequent bids must be higher than current bid
- Bid cannot exceed team's remaining purse
- Same team cannot place consecutive bids
- Dynamic bid increments based on current bid amount

## Backend Implementation (FastAPI)

### Tech Stack
- **Framework**: FastAPI 0.115.5
- **Server**: Uvicorn with auto-reload
- **Authentication**: JWT tokens with python-jose
- **Password Hashing**: bcrypt via passlib
- **Testing**: pytest with async support
- **WebSocket**: Real-time updates via WebSockets
- **Validation**: Pydantic v2 models

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py          # JWT authentication utilities
│   │   ├── endpoints.py     # Auth endpoints (login/logout)
│   │   ├── auction.py       # Auction management endpoints
│   │   ├── management.py    # Player/Team CRUD endpoints
│   │   └── websocket.py     # WebSocket real-time updates
│   ├── models/
│   │   ├── __init__.py
│   │   └── database.py      # In-memory data storage
│   └── schemas/
│       ├── __init__.py
│       ├── player.py        # Player Pydantic models
│       ├── team.py          # Team Pydantic models
│       ├── user.py          # User & auth models
│       └── auction.py       # Auction state models
├── tests/
│   ├── __init__.py
│   └── test_api.py          # Comprehensive API tests
├── requirements.txt         # Python dependencies
├── README.md               # Setup & usage documentation
└── .gitignore             # Git ignore patterns
```

### API Endpoints

#### Authentication (`/auth`)
- `POST /auth/login` - Login and get JWT token
- `POST /auth/logout` - Logout (client-side token removal)
- `GET /auth/me` - Get current authenticated user

#### Auction Management (`/auction`)
- `GET /auction/state` - Get current auction state
- `POST /auction/start` - Start the auction
- `POST /auction/pause` - Pause the auction
- `POST /auction/resume` - Resume the auction
- `POST /auction/next` - Move to next player
- `POST /auction/previous` - Move to previous player
- `POST /auction/bid` - Place a bid on current player
- `POST /auction/mark-sold` - Mark player as sold to team
- `POST /auction/mark-unsold` - Mark player as unsold
- `POST /auction/reset` - Reset auction to initial state

#### Player Management (`/players`)
- `GET /players` - Get all players
- `GET /players/{id}` - Get player by ID
- `POST /players` - Create new player
- `PUT /players/{id}` - Update player
- `DELETE /players/{id}` - Delete player

#### Team Management (`/teams`)
- `GET /teams` - Get all teams
- `GET /teams/{id}` - Get team by ID
- `PUT /teams/{id}/purse` - Update team purse

#### WebSocket (`/ws`)
- `WS /ws/auction` - WebSocket connection for real-time auction updates

### Data Models

#### Player
```python
{
  id: int
  name: str
  role: str (Batsman/Bowler/All-rounder/Wicketkeeper)
  basePrice: int (in lakhs)
  sold: bool
  teamId: Optional[int]
  price: Optional[int]
  nationality: str
  age: int
  battingStyle: Optional[str]
  bowlingStyle: Optional[str]
  image: str
  stats: {
    matches: int
    runs: int
    wickets: int
    average: float
    strikeRate: float
  }
}
```

#### Team
```python
{
  id: int
  name: str
  shortName: str
  purse: int (in lakhs, starting at 12000)
  logo: str
  players: List[int]
  color: str
  primaryColor: str
  secondaryColor: str
}
```

#### User
```python
{
  id: str
  username: str
  password: str (hashed)
  role: 'admin' | 'presenter' | 'viewer'
  teamId: Optional[int]  # Only for viewers
  teamName: Optional[str]  # Only for viewers
}
```

### Mock Data

#### Users (Credentials)
| Username | Password | Role | Team |
|----------|----------|------|------|
| admin | admin123 | admin | - |
| presenter | presenter123 | presenter | - |
| csk_viewer | csk@2024 | viewer | Chennai Super Kings |
| mi_viewer | mi@2024 | viewer | Mumbai Indians |
| rcb_viewer | rcb@2024 | viewer | Royal Challengers Bangalore |

#### Teams
10 IPL teams pre-configured:
- Chennai Super Kings (CSK)
- Mumbai Indians (MI)
- Royal Challengers Bangalore (RCB)
- Kolkata Knight Riders (KKR)
- Delhi Capitals (DC)
- Rajasthan Royals (RR)
- Punjab Kings (PBKS)
- Sunrisers Hyderabad (SRH)
- Gujarat Titans (GT)
- Lucknow Super Giants (LSG)

#### Players
5 sample players included (expandable):
- Virat Kohli (Batsman, ₹200L base)
- Jasprit Bumrah (Bowler, ₹150L base)
- MS Dhoni (Wicketkeeper, ₹180L base)
- Rohit Sharma (Batsman, ₹190L base)
- Rashid Khan (Bowler, ₹140L base)

### Testing

**Test Suite**: 23 comprehensive tests covering:
- Authentication (login, logout, invalid credentials)
- Player CRUD operations
- Team operations
- Auction state management
- Bidding system with validation
- Player sold/unsold marking
- Auction navigation (next/previous)
- Auction reset functionality

**Test Results**: ✅ **23/23 tests passing** (100% success rate)

### Setup Instructions

#### 1. Navigate to Backend Directory
```bash
cd "d:\AUCTION PORTAL\backend"
```

#### 2. Create Virtual Environment
```bash
python -m venv venv
```

#### 3. Activate Virtual Environment
**Windows:**
```powershell
.\venv\Scripts\Activate.ps1
```

#### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 5. Run Tests
```bash
pytest tests/test_api.py -v
```

#### 6. Start Server
```bash
python -m uvicorn app.main:app --reload
```

Server will run on: `http://127.0.0.1:8000`

#### 7. Access API Documentation
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### CORS Configuration
Backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative port)

### Key Features Implemented

✅ **Complete REST API** with all CRUD operations
✅ **JWT Authentication** with secure token handling
✅ **Real-time WebSocket** support for live updates
✅ **Comprehensive validation** for all operations
✅ **Bid validation rules** matching frontend logic
✅ **In-memory storage** for fast development
✅ **23 passing tests** with pytest
✅ **Auto-reload** development server
✅ **CORS enabled** for frontend integration
✅ **API documentation** with Swagger & ReDoc

### Next Steps for Production

1. **Database Integration**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Environment Variables**: Move secrets to `.env` file
3. **Authentication Enhancement**: Add refresh tokens, password reset
4. **Rate Limiting**: Add API rate limiting for security
5. **Logging**: Implement structured logging
6. **Docker**: Containerize the application
7. **CI/CD**: Set up automated testing and deployment
8. **Frontend Integration**: Connect React app to backend API

### Backend Server Status

🟢 **Server Running**: `http://127.0.0.1:8000`
✅ **Health Check**: `/health` endpoint responding
✅ **Authentication**: Login endpoint working
✅ **Data Endpoints**: Players, teams, auction state accessible
✅ **Tests**: 100% passing (23/23)

### Sample API Calls

#### Login
```bash
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

#### Get Players
```bash
curl http://127.0.0.1:8000/players
```

#### Start Auction
```bash
curl -X POST http://127.0.0.1:8000/auction/start
```

#### Place Bid
```bash
curl -X POST http://127.0.0.1:8000/auction/bid \
  -H "Content-Type: application/json" \
  -d '{"teamId": 1, "amount": 200}'
```

## Summary

✅ Complete frontend analysis documented
✅ FastAPI backend built from scratch
✅ All API endpoints implemented
✅ WebSocket support for real-time updates
✅ JWT authentication configured
✅ Comprehensive test suite (23/23 passing)
✅ Virtual environment set up
✅ All dependencies installed
✅ Server running and tested successfully

The backend is production-ready for development and testing, with a clear path for production deployment enhancements.
