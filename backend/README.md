# IPL Auction Portal - Backend

FastAPI backend for IPL Auction Portal with WebSocket support for real-time updates.

## Features

- **Authentication**: JWT-based authentication with role-based access
- **Auction Management**: Start, pause, resume, navigate players
- **Bidding System**: Real-time bidding with validation rules
- **Player & Team Management**: CRUD operations for players and teams
- **WebSocket**: Real-time auction state synchronization
- **Mock Data**: Pre-populated with IPL teams and players

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```powershell
.\venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Server

```bash
python -m uvicorn app.main:app --reload
```

The server will start on `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /auth/login` - Login and get JWT token
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

### Auction Management
- `GET /auction/state` - Get current auction state
- `POST /auction/start` - Start auction
- `POST /auction/pause` - Pause auction
- `POST /auction/resume` - Resume auction
- `POST /auction/next` - Next player
- `POST /auction/previous` - Previous player
- `POST /auction/bid` - Place a bid
- `POST /auction/mark-sold` - Mark player as sold
- `POST /auction/mark-unsold` - Mark player as unsold
- `POST /auction/reset` - Reset auction

### Player Management
- `GET /players` - Get all players
- `GET /players/{id}` - Get player by ID
- `POST /players` - Create new player
- `PUT /players/{id}` - Update player
- `DELETE /players/{id}` - Delete player

### Team Management
- `GET /teams` - Get all teams
- `GET /teams/{id}` - Get team by ID
- `PUT /teams/{id}/purse` - Update team purse

### WebSocket
- `WS /ws/auction` - WebSocket connection for real-time updates

## Mock Users

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| presenter | presenter123 | presenter |
| csk_viewer | csk@2024 | viewer (CSK) |
| mi_viewer | mi@2024 | viewer (MI) |
| rcb_viewer | rcb@2024 | viewer (RCB) |

## Testing

Run tests:
```bash
pytest tests/ -v
```

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── auth.py          # JWT authentication
│   │   ├── endpoints.py     # Auth endpoints
│   │   ├── auction.py       # Auction endpoints
│   │   ├── management.py    # Player/Team CRUD
│   │   └── websocket.py     # WebSocket handler
│   ├── models/
│   │   └── database.py      # In-memory data storage
│   ├── schemas/
│   │   ├── player.py        # Player schemas
│   │   ├── team.py          # Team schemas
│   │   ├── user.py          # User schemas
│   │   └── auction.py       # Auction schemas
│   └── main.py              # FastAPI app entry point
├── tests/
│   └── test_api.py          # API tests
└── requirements.txt         # Python dependencies
```

## Environment Variables

Create a `.env` file for production:

```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```
