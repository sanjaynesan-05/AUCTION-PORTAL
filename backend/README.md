# Backend - IPL Auction Portal API

FastAPI backend server for the IPL Auction Portal application with PostgreSQL (NEON) database.

## Project Structure

```
backend/
├── src/
│   └── main.py             # Main FastAPI server entry point
├── config/                 # Configuration files
│   └── database.py         # Database setup & connection
├── routes/                 # API route definitions
├── controllers/            # Business logic handlers
├── models/                 # Database models
├── middleware/             # Custom middleware
├── utils/                  # Utility functions
├── venv/                   # Virtual environment
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
└── README.md
```

## Technology Stack

- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database**: PostgreSQL (NEON - Cloud DB)
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Authentication**: JWT
- **Python**: 3.8+

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- NEON PostgreSQL cloud database account

## Setup Instructions

### 1. Create Virtual Environment

```bash
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file with your NEON database URL:

```env
# Server Configuration
PORT=8000
ENVIRONMENT=development

# Database Configuration (NEON PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-xxxxx.region.aws.neon.tech/auction_portal?sslmode=require

# JWT Configuration
JWT_SECRET=your_super_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 5. Get Your NEON Database URL

1. Go to [NEON Console](https://console.neon.tech)
2. Create a new PostgreSQL database
3. Copy the connection string (CONNECTION STRING tab)
4. Paste it in `.env` as `DATABASE_URL`

### 6. Run the Server

```bash
python src/main.py
```

Or with auto-reload (development):

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at: `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /api/health` - Health check with database status

### Documentation
- `GET /docs` - Swagger UI (Interactive)
- `GET /redoc` - ReDoc (Alternative)

### Endpoints (To be implemented)

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

**Players:**
- `GET /api/players` - Get all players
- `GET /api/players/{id}` - Get player by ID
- `POST /api/players` - Create new player
- `PUT /api/players/{id}` - Update player
- `DELETE /api/players/{id}` - Delete player

**Teams:**
- `GET /api/teams` - Get all teams
- `GET /api/teams/{id}` - Get team details
- `GET /api/teams/{id}/squad` - Get team squad
- `PUT /api/teams/{id}/purse` - Update team purse

**Auction:**
- `GET /api/auction/status` - Get auction status
- `POST /api/auction/start` - Start auction
- `POST /api/auction/bid` - Place bid
- `POST /api/auction/sold` - Mark player as sold
- `POST /api/auction/unsold` - Mark player as unsold

## Database Models

### Users
- id, username, email, password_hash, role, is_active, timestamps

### Teams
- id, name, short_name, logo_url, color, total_purse, remaining_purse

### Players
- id, name, role, nationality, age, base_price, image_url, stats, team_id, sold, sold_price

### AuctionBids
- id, player_id, team_id, bidder_id, bid_amount, is_winning_bid, timestamp

### AuctionStatus
- id, current_player_id, is_active, current_bid, current_highest_bidder_id, timestamps

## Testing

```bash
pytest
```

## Connecting to NEON

### Connection Methods

**Direct Connection:**
```bash
psql "postgresql://user:password@ep-xxxxx.region.aws.neon.tech/auction_portal?sslmode=require"
```

**From Python:**
The application automatically connects using the `DATABASE_URL` from `.env`

### Useful NEON Commands

- Create table: Define in `models/models.py` → Run `init_db()`
- View data: Use NEON Console or connect with psql
- Monitor: Check NEON console for logs and metrics

## Troubleshooting

### Connection Error
- Verify `DATABASE_URL` in `.env`
- Check NEON console for active database
- Ensure IP whitelist allows your connection

### Import Errors
- Activate virtual environment first
- Run `pip install -r requirements.txt` again
- Check Python version (3.8+)

### Port Already in Use
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8001
```

## Development Workflow

1. Create routes in `/routes`
2. Implement controllers in `/controllers`
3. Use models from `/models/models.py`
4. Add middleware in `/middleware` if needed
5. Test with FastAPI `/docs` endpoint

## Deployment

### Environment Setup
Change `ENVIRONMENT=production` in `.env`

### Run in Production
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

## Team

IPL Auction Portal Backend Team

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [NEON Documentation](https://neon.tech/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
