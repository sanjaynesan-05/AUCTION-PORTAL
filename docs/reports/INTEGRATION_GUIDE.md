# Frontend-Backend Integration Guide

Complete guide for the IPL Auction Portal full-stack development setup.

---

## 🎯 Project Overview

| Component | Technology | Status |
|-----------|-----------|--------|
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS | ✅ Ready |
| **Backend** | FastAPI + SQLAlchemy + PostgreSQL | ✅ Ready |
| **API Communication** | Typed API Client with WebSocket | ✅ Ready |
| **Database** | PostgreSQL (Neon serverless) | ✅ Connected |
| **Authentication** | JWT with secure token management | ✅ Implemented |
| **Real-time Updates** | WebSocket for live auction events | ✅ Configured |
| **Testing** | 24 passing tests (backend) | ✅ All passing |

---

## 📁 Monorepo Structure

```
d:\AUCTION PORTAL/
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── api/                # API endpoints
│   │   ├── models/             # ORM and seeding
│   │   ├── main.py             # FastAPI app
│   │   ├── config.py           # Configuration
│   │   └── database.py         # Database setup
│   ├── tests/
│   │   └── test_api.py         # 24 tests
│   ├── .env                    # Environment variables
│   ├── requirements.txt        # Python packages
│   ├── venv/                   # Virtual environment
│   └── README.md               # Backend docs
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom hooks
│   │   ├── context/            # Context providers
│   │   ├── services/
│   │   │   └── apiClient.ts    # Type-safe API client ⭐
│   │   ├── store/              # Zustand store
│   │   ├── data/               # Mock data
│   │   ├── utils/              # Utilities
│   │   └── App.tsx             # Main app
│   ├── public/                 # Static assets
│   ├── .env.development        # Dev config
│   ├── .env.production         # Prod config
│   ├── vite.config.ts          # Vite with proxy ⭐
│   ├── package.json            # Frontend packages
│   └── README.md               # Frontend docs
│
├── package.json                # Root monorepo scripts ⭐
├── README.md                   # Project overview
├── INTEGRATION_GUIDE.md        # This file
└── BACKEND_ANALYSIS.md         # Backend technical docs
```

**⭐ = Key files for frontend-backend integration**

---

## 🔑 Key Integration Files

### 1. Root `package.json` (Monorepo Scripts)

**Location:** `d:\AUCTION PORTAL\package.json`

**Purpose:** Manages concurrent execution of frontend and backend

**Key Scripts:**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run backend:dev\" \"npm run frontend:dev\"",
    "frontend:dev": "cd frontend && npm run dev",
    "frontend:build": "cd frontend && npm run build",
    "backend:dev": "cd backend && .\\venv\\Scripts\\python -m uvicorn app.main:app --reload",
    "backend:test": "cd backend && .\\venv\\Scripts\\pytest tests/test_api.py -v"
  }
}
```

**Usage:**
```bash
npm run dev              # Start both frontend and backend
npm run frontend:dev     # Frontend only
npm run backend:dev      # Backend only
npm run backend:test     # Run tests
```

---

### 2. Frontend Vite Config (API Proxy)

**Location:** `frontend/vite.config.ts`

**Purpose:** Proxies frontend API calls to backend

**Key Configuration:**
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
    '/ws': {
      target: 'ws://localhost:8000',
      ws: true,
    },
  },
},
```

**Effect:**
- `http://localhost:5173/api/...` → `http://localhost:8000/api/...`
- `ws://localhost:5173/ws/...` → `ws://localhost:8000/ws/...`

---

### 3. API Client (Type-Safe Requests)

**Location:** `frontend/src/services/apiClient.ts`

**Purpose:** Handles all HTTP requests to backend with automatic authentication

**Key Features:**
```typescript
// Initialize
export const apiClient = new APIClient();

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
  },
  PLAYERS: {
    LIST: '/api/players',
    GET: '/api/players/{id}',
    CREATE: '/api/players',
    UPDATE: '/api/players/{id}',
    DELETE: '/api/players/{id}',
  },
  // ... more endpoints
};

// Methods
apiClient.get<T>(endpoint: string): Promise<T>
apiClient.post<T>(endpoint: string, data?: any): Promise<T>
apiClient.put<T>(endpoint: string, data?: any): Promise<T>
apiClient.delete<T>(endpoint: string): Promise<T>
```

**Usage Example:**
```typescript
import { apiClient, API_CONFIG } from '@/services/apiClient';

// Login
const response = await apiClient.post(API_CONFIG.AUTH.LOGIN, {
  username: 'admin',
  password: 'admin123'
});

// Fetch players
const players = await apiClient.get(API_CONFIG.PLAYERS.LIST);

// Update player
await apiClient.put(API_CONFIG.PLAYERS.UPDATE.replace('{id}', '1'), {
  name: 'Updated Name'
});
```

---

### 4. Environment Configuration

**Frontend Development:** `frontend/.env.development`
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

**Frontend Production:** `frontend/.env.production`
```env
VITE_API_URL=https://your-production-api.com
VITE_WS_URL=wss://your-production-api.com
```

**Backend:** `backend/.env`
```env
DATABASE_URL=postgresql+psycopg://username:password@neon.tech/database
SECRET_KEY=Fj2uwgQnnNW0Jt5AzGC5ag4GpH9ADZqOqtfLApoDWUI
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

---

## 🚀 Getting Started (Step by Step)

### Step 1: Backend Setup

```bash
cd d:\AUCTION\ PORTAL\backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run tests to verify setup
pytest tests/test_api.py -v

# Start backend (optional - it will start with npm run dev)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected:**
- ✅ All 24 tests pass
- ✅ Backend runs on http://localhost:8000
- ✅ API docs available at http://localhost:8000/docs

### Step 2: Frontend Setup

```bash
cd d:\AUCTION\ PORTAL\frontend

# Install dependencies
npm install

# Verify build works
npm run build

# (Optional) Start frontend only
npm run dev
```

**Expected:**
- ✅ node_modules directory created
- ✅ Frontend runs on http://localhost:5173
- ✅ API proxy configured

### Step 3: Full Stack Development

```bash
cd d:\AUCTION\ PORTAL

# Start both frontend and backend concurrently
npm run dev
```

**Expected Output:**
```
npm notice it worked if it ends with ok

> AUCTION PORTAL@1.0.0 dev
> concurrently "npm run backend:dev" "npm run frontend:dev"

[0] ✔ Backend starting...
[0] INFO:     Uvicorn running on http://0.0.0.0:8000
[0] INFO:     Application startup complete
[1] ✔ Frontend starting...
[1]   VITE v7.2.0  ready in 235 ms
[1]   ➜  Local:   http://localhost:5173/
[1]   ➜  press h to show help
```

### Step 4: Access the Application

| URL | Purpose |
|-----|---------|
| `http://localhost:5173` | Frontend app |
| `http://localhost:8000` | Backend API |
| `http://localhost:8000/docs` | Swagger API docs |
| `ws://localhost:8000/ws/auction` | WebSocket connection |

### Step 5: Login & Test

**Test Accounts:**
```
Admin:
  Username: admin
  Password: admin123

Presenter:
  Username: presenter
  Password: presenter123

Viewer (CSK):
  Username: csk_viewer
  Password: csk@2024
```

**Test Flow:**
1. Open http://localhost:5173
2. Login with admin account
3. Navigate to Admin Panel
4. Create a player (tests API POST)
5. View players (tests API GET)
6. Try real-time updates

---

## 🔌 API Communication Flow

### Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. POST /api/auth/login
       ├─────────────────────────────────►
       │                        ┌──────────────┐
       │                        │   Backend    │
       │                        │   FastAPI    │
       │    2. JWT Token        │              │
       │◄─────────────────────────────────────┤
       │                        │              │
└──────┴──────┐                └──────────────┘
│   Storage   │
│   Token     │
└─────────────┘
       │
       │ 3. Include in Authorization header
       │    Authorization: Bearer <TOKEN>
       │
       ├─────────────────────────────────►
       │   4. GET /api/players
       │                        ┌──────────────┐
       │                        │   Backend    │
       │    5. Player Data      │   (verified) │
       │◄─────────────────────────────────────┤
       │                        │              │
       │                        └──────────────┘
```

### Real-Time Updates Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. WebSocket Connection
       │ ws://localhost:8000/ws/auction
       │
       ├──────────────────────────────────►
       │                        ┌──────────────┐
       │                        │   Backend    │
       │                        │   WebSocket  │
       │                        │   Manager    │
       │                        │              │
       │   2. Auction Update    │              │
       │   (broadcast to all)   │              │
       │◄──────────────────────────────────────┤
       │   {"state": "paused",  │              │
       │    "current_player"...}│              │
       │                        │              │
       │                        └──────────────┘
```

---

## 📡 WebSocket Integration

### Connect to WebSocket

```typescript
const ws = new WebSocket(API_CONFIG.WEBSOCKET.AUCTION);

ws.onopen = () => {
  console.log('Connected to auction updates');
};

ws.onmessage = (event) => {
  const auctionUpdate = JSON.parse(event.data);
  console.log('Auction updated:', auctionUpdate);
  // Update UI with new state
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from auction updates');
  // Attempt reconnect after delay
};
```

### Sample WebSocket Message

```json
{
  "event": "auction_update",
  "state": "bidding",
  "current_player_id": 1,
  "current_player_name": "Virat Kohli",
  "current_bid": 5000000,
  "current_bidder_team_id": 1,
  "is_sold": false,
  "timestamp": "2025-12-03T10:30:45Z"
}
```

---

## 🧪 Testing the Integration

### Test 1: API Health Check

```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Auction API is running"
}
```

### Test 2: Login via Frontend

1. Navigate to `http://localhost:5173`
2. Enter credentials: `admin` / `admin123`
3. Click Login
4. Check browser Network tab → should see successful POST to `/api/auth/login`

### Test 3: Fetch Players

```typescript
// In browser console
import { apiClient, API_CONFIG } from 'http://localhost:5173/src/services/apiClient.ts';
const players = await apiClient.get(API_CONFIG.PLAYERS.LIST);
console.log(players);
```

### Test 4: WebSocket Connection

```typescript
// In browser console
const ws = new WebSocket('ws://localhost:8000/ws/auction');
ws.onmessage = (e) => console.log('Message:', e.data);
```

---

## 🔍 Troubleshooting

### Issue: Frontend shows CORS errors

**Cause:** Backend API not running or proxy not configured

**Solution:**
1. Verify backend running: `http://localhost:8000/docs`
2. Check Vite proxy config in `frontend/vite.config.ts`
3. Restart dev server: `npm run dev`

### Issue: WebSocket connection fails

**Cause:** Backend not accepting WebSocket connections

**Solution:**
1. Verify backend is running
2. Check WebSocket endpoint is correct: `ws://localhost:8000/ws/auction`
3. Ensure firewall allows WebSocket connections

### Issue: API returns 401 Unauthorized

**Cause:** JWT token missing or expired

**Solution:**
1. Login again to get new token
2. Check token is stored in localStorage: `localStorage.getItem('authToken')`
3. Verify token is included in requests (check Network tab)

### Issue: Database connection fails

**Cause:** PostgreSQL connection string incorrect or database offline

**Solution:**
1. Check `.env` file has correct DATABASE_URL
2. Verify Neon PostgreSQL is accessible
3. Check logs: `python -m uvicorn app.main:app --reload`

### Issue: Tests fail after changes

**Cause:** Database seeding issue or schema changes

**Solution:**
```bash
cd backend
# Delete test database
rm test_auction.db

# Run tests again
pytest tests/test_api.py -v
```

---

## 📊 Performance Optimization

### Frontend
- ✅ Vite enables fast development with HMR
- ✅ Tailwind CSS with JIT compilation
- ✅ Code splitting handled by Vite
- ✅ API Client automatically caches responses

### Backend
- ✅ FastAPI auto-documentation with Swagger
- ✅ SQLAlchemy connection pooling
- ✅ WebSocket broadcasting without blocking
- ✅ Async request handling

### Database
- ✅ PostgreSQL Neon serverless scales automatically
- ✅ Connection pooling with SQLAlchemy
- ✅ Indexed queries for fast lookups
- ✅ Built-in replication for high availability

---

## 🚢 Deployment Checklist

### Frontend Deployment

- [ ] Update `VITE_API_URL` in `.env.production`
- [ ] Update `VITE_WS_URL` in `.env.production` (use `wss://`)
- [ ] Run `npm run build`
- [ ] Deploy `dist/` folder to hosting
- [ ] Test API endpoints are accessible
- [ ] Test WebSocket connections

### Backend Deployment

- [ ] Update `DATABASE_URL` for production database
- [ ] Update `SECRET_KEY` with new secure key
- [ ] Set `ALGORITHM` and `ACCESS_TOKEN_EXPIRE_MINUTES`
- [ ] Configure CORS for production domain
- [ ] Deploy to server (Heroku, Railway, AWS, etc.)
- [ ] Run migrations if needed
- [ ] Verify API endpoints are accessible

### Verification

- [ ] API health check passes
- [ ] Login works with valid credentials
- [ ] API requests from frontend succeed
- [ ] WebSocket real-time updates work
- [ ] All 24 tests pass

---

## 📚 Additional Resources

- **Backend Docs:** `backend/README.md` and `backend/BACKEND_ANALYSIS.md`
- **Frontend Docs:** `frontend/README.md`
- **API Documentation:** `http://localhost:8000/docs` (Swagger UI)
- **FastAPI Guide:** https://fastapi.tiangolo.com/
- **React Guide:** https://react.dev/
- **WebSocket Guide:** https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

---

## ✅ Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Backend | ✅ Ready | All 24 tests passing |
| Frontend | ✅ Ready | All components organized |
| API Client | ✅ Ready | 24+ endpoints defined |
| WebSocket | ✅ Ready | Proxy configured |
| Database | ✅ Ready | PostgreSQL Neon connected |
| Authentication | ✅ Ready | JWT implemented |
| Tests | ✅ 24/24 | All passing |
| Documentation | ✅ Complete | README + this guide |

---

**Ready for Development & Deployment!**

**Last Updated:** December 3, 2025
