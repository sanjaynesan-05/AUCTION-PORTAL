# IPL Auction Portal - Backend Implementation Plan (FastAPI)

## 1. Project Architecture

This plan introduces a dedicated backend service to replace the current client-side-only architecture. This will enable secure, persistent, and truly real-time auction management suitable for production use.

### **Technology Stack**

| Component | Choice | Reason |
| :--- | :--- | :--- |
| **Language** | Python 3.11+ | Strong async support, excellent type hinting. |
| **Framework** | **FastAPI** | High performance, automatic API docs (Swagger), native WebSocket support. |
| **Database** | **PostgreSQL** | Robust relational data integrity for financial transactions (bids/purses). |
| **ORM** | **SQLAlchemy IDO (Async)** | Modern async ORM for non-blocking database operations. |
| **Migrations** | **Alembic** | Version control for database schema changes. |
| **Authentication** | **OAuth2 (JWT)** | Stateless, standard secure authentication flow. |
| **Real-Time** | **WebSockets** | Replacing `localStorage` sync with server-push events for true cross-device sync. |
| **Validation** | **Pydantic v2** | Fast, strictly typed data validation. |
| **Task Queue** | *Redis (Optional)* | Only if we add complex background jobs (e.g., email notifications). |

### **Directory Structure**

We will add a `backend/` directory to the root of the repository:

```text
/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── auth.py
│   │   │   │   │   ├── auction.py
│   │   │   │   │   ├── players.py
│   │   │   │   │   └── teams.py
│   │   │   └── api.py
│   │   ├── core/
│   │   │   ├── config.py       # Env vars
│   │   │   └── security.py     # JWT & Password hashing
│   │   ├── db/
│   │   │   └── session.py
│   │   ├── models/             # SQLAlchemy Models
│   │   │   ├── user.py
│   │   │   ├── player.py
│   │   │   ├── team.py
│   │   │   └── bid.py
│   │   ├── schemas/            # Pydantic Schemas
│   │   ├── services/           # Business Logic
│   │   │   └── auction_engine.py
│   │   └── main.py
│   ├── alembic/                # DB Migrations
│   ├── tests/
│   ├── requirements.txt
│   └── .env
├── src/                        # Existing Frontend
...
```

---

## 2. Database Schema Design

### **Users Table**
Stores admin and presenter credentials.
- `id`: UUID (PK)
- `username`: String (Unique)
- `hashed_password`: String
- `role`: Enum (`ADMIN`, `PRESENTER`, `VIEWER`)
- `is_active`: Boolean

### **Teams Table**
Stores franchise information and financial state.
- `id`: UUID (PK)
- `name`: String (e.g., "Chennai Super Kings")
- `code`: String (e.g., "CSK")
- `purse_balance`: Decimal (12, 2) —— **Critical for validation**
- `logo_url`: String
- `primary_color`: String
- `secondary_color`: String

### **Players Table**
Stores auction inventory.
- `id`: UUID (PK)
- `name`: String
- `role`: Enum (`BATSMAN`, `BOWLER`, `ALL_ROUNDER`, `WICKET_KEEPER`)
- `base_price`: Decimal (10, 2)
- `sold_price`: Decimal (10, 2) (Nullable)
- `is_sold`: Boolean (Default: `False`)
- `team_id`: UUID (FK -> `teams.id`) (Nullable)
- `stats`: JSONB (Matches, runs, etc.)
- `image_url`: String

### **Bids Table** (Audit Log)
Records every bid for history and replayability.
- `id`: UUID (PK)
- `player_id`: UUID (FK)
- `team_id`: UUID (FK)
- `amount`: Decimal (10, 2)
- `timestamp`: DateTime (UTC)

### **AuctionState Table** (Singleton)
Tracks the *live* state of the auction. Only one row exists.
- `id`: Integer (PK=1)
- `current_player_id`: UUID (FK -> `players.id`)
- `status`: Enum (`WAITING`, `ACTIVE`, `PAUSED`, `COMPLETED`)
- `current_bid_amount`: Decimal (10, 2)
- `current_highest_bidder_id`: UUID (FK -> `teams.id`)
- `last_activity`: DateTime

---

## 3. Real-Time WebSocket Strategy

This is the core replacement for your `useAuctionSync` hook.

### **Connection Flow**
1. Client connects to `ws://api.domain.com/ws/auction`.
2. Handshake includes JWT token for `Auth`.
3. Server adds client to `ConnectionManager`.

### **Event Types (Server -> Client)**

| Event Name | Payload | Trigger |
| :--- | :--- | :--- |
| `SyncState` | Full `AuctionState` object | On Connect / Reconnect |
| `BidUpdate` | `{ amount, team_id, player_id }` | Valid Bid Placed |
| `PlayerChanged` | `{ player }` | Admin clicks "Next Player" |
| `Timers` | `{ remaining_seconds }` | Server-side countdown tick |
| `Sold` | `{ player_id, team_id, price }` | Admin confirms sale |

### **Handling Latency**
- **Optimistic UI**: Frontend updates immediately on user action.
- **Server Validated**: Server broadcasts the *definitive* state. If client was wrong (e.g., insufficient funds), server sends `Error` event and client rolls back.

---

## 4. API Endpoint Plan

### **Authentication**
- `POST /auth/token`: Login (Username/Password) -> Returns Access Token.
- `GET /users/me`: Get current user profile.

### **Auction Actions** (Protected: Admin/Presenter)
- `POST /auction/start`: Resume/Start the session.
- `POST /auction/pause`: Pause bidding.
- `POST /auction/reset`: **Dangerous**. Reset all team purses and player statuses.

### **Player Management**
- `GET /players`: List all players (filters: `sold`, `unsold`).
- `PUT /players/{id}`: Update player details.
- `POST /players/{id}/assign`: Force assign player to team (Admin override).

### **Bidding Engine**
- `POST /bid`: Place a bid.
  - **Input**: `{ amount, player_id }` (Team inferred from user or context).
  - **Logic**:
    1. Check if auction is `ACTIVE`.
    2. Check if `amount` > `current_bid`.
    3. Check `team.purse_balance` >= `amount`.
    4. **Atomic Transaction**: Deduct potential funds (optional) or just validate.
    5. Update `AuctionState`.
    6. Broadcast `BidUpdate` via WebSocket.

---

## 5. Migration Roadmap

### **Phase 1: Foundation (Days 1-2)**
- [ ] Initialize FastAPI project structure.
- [ ] Set up PostgreSQL via Docker.
- [ ] Implement User, Team, Player models.
- [ ] Create seed script to migrate data from `mockPlayers.ts` and `mockTeams.ts` to DB.

### **Phase 2: Core Logic (Days 3-4)**
- [ ] Implement Auth (JWT).
- [ ] Create CRUD endpoints for Players and Teams.
- [ ] Implement `AuctionManager` service (Business logic for rules).

### **Phase 3: Real-Time & Integration (Days 5-7)**
- [ ] Implement WebSocket endpoint.
- [ ] Update React frontend to replace `useAuctionSync` with `useWebSocket`.
- [ ] Replace `localStorage` persistence with API calls.
- [ ] Test race conditions (two teams bidding simultaneously).

### **Phase 4: Polish (Day 8+)**
- [ ] Dockerize entire stack (Frontend + Backend + DB).
- [ ] Add deployment config (e.g., Docker Compose / Kubernetes).
