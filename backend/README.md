# IPL Auction Portal Backend (Production Grade)

This backend is built with FastAPI, PostgreSQL (AsyncPG), SQLAlchemy 2.0, and WebSockets.

## 🚀 Setup & Run

### 1. Environment Setup
The backend runs in a virtual environment.
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Database Migration
Ensure your `.env` file has the correct `DATABASE_URL`.
```powershell
python -m alembic upgrade head
```

### 3. Run Server
```powershell
python run.py
```
Server will start at `http://localhost:8000`.
Docs available at `http://localhost:8000/docs`.

## 🧪 Testing

### Integrity Test (Nuclear Option)
Verify the reset functionality and data consistency:
```powershell
python tests/test_reset_integrity.py
```

## 📂 Project Structure

- **app/models**: Database models (Team, Player, AuctionState, Bid)
- **app/services**: Business logic (Auction engine, Bidding, Reset)
- **app/api**: REST Endpoints
- **app/websockets**: Real-time event manager

## 🔑 Key Features Implemented

1.  **Atomic Bidding**: Uses `FOR UPDATE` locking to prevent race conditions.
2.  **Real-time Sync**: WebSockets broadcast all events (`BID_UPDATE`, `PLAYER_SOLD`, `LEADERBOARD_UPDATE`).
3.  **Gamified Logic**: Leaderboard calculation based on points and purse balance.
4.  **Nuclear Reset**: Complete auction reset with integrity checks.
