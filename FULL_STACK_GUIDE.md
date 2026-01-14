# IPL Auction Portal - Full Stack Overview

## Project Architecture

```
AUCTION-PORTAL/
│
├── frontend/                          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── backend/                           # FastAPI + PostgreSQL (NEON)
│   ├── src/
│   │   └── main.py                    # FastAPI server entry point
│   ├── config/
│   │   └── database.py                # PostgreSQL + SQLAlchemy setup
│   ├── models/
│   │   └── models.py                  # Database models
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   ├── venv/                          # Python virtual environment
│   ├── requirements.txt               # Python dependencies
│   ├── .env                           # Environment variables
│   ├── run.ps1                        # PowerShell startup script
│   ├── run.bat                        # Batch startup script
│   ├── README.md                      # Backend documentation
│   └── SETUP.md                       # Setup guide
│
├── .git/                              # Git repository
└── README.md                          # Project overview
```

## Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.5.3
- **Build Tool**: Vite 7.1.9
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: Zustand 5.0.8
- **Routing**: React Router 7.9.4
- **Icons**: Lucide React 0.344.0
- **Animations**: Framer Motion 12.23.24

### Backend
- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn 0.24.0
- **Language**: Python 3.8+
- **ORM**: SQLAlchemy 2.0.23
- **Validation**: Pydantic 2.5.0
- **Authentication**: JWT + Bcrypt
- **Database**: PostgreSQL (NEON Cloud)

## Running the Project

### Start Frontend

```bash
cd frontend
npm install      # First time only
npm run dev
```

**Frontend runs on**: http://localhost:5173

### Start Backend

```bash
cd backend

# Option 1: PowerShell
.\run.ps1

# Option 2: Command Prompt
run.bat

# Option 3: Manual
.\venv\Scripts\activate
python src/main.py
```

**Backend runs on**: http://localhost:8000

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Database Setup (NEON)

1. **Create NEON Account**
   - Go to https://neon.tech
   - Sign up for free account
   - Create new PostgreSQL database

2. **Get Connection String**
   - Copy connection string from NEON console
   - Format: `postgresql://user:password@ep-xxxxx.region.aws.neon.tech/auction_portal?sslmode=require`

3. **Update Backend Configuration**
   - Edit `backend/.env`
   - Add: `DATABASE_URL=<your_neon_connection_string>`

4. **Test Connection**
   - Run backend: `python src/main.py`
   - Check health: http://localhost:8000/api/health

## Features Implemented

### Frontend
✅ 2-Role Authentication (Admin/Presenter)
✅ Real-time Auction Dashboard
✅ Professional Sold/Unsold Modal
✅ Interactive Team Purse Display
✅ Circular SVG Progress Rings
✅ Responsive Design (Mobile & Desktop)
✅ Cross-tab Synchronization
✅ Floating Team Purse Widget

### Backend (Ready to Build)
✅ FastAPI server structure
✅ Database models defined
✅ SQLAlchemy ORM configured
✅ CORS middleware configured
✅ Environment configuration setup
✅ Health check endpoint
✅ API documentation endpoints

## API Endpoints (To Implement)

### Authentication
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
```

### Players
```
GET    /api/players
GET    /api/players/{id}
POST   /api/players
PUT    /api/players/{id}
DELETE /api/players/{id}
```

### Teams
```
GET    /api/teams
GET    /api/teams/{id}
GET    /api/teams/{id}/squad
PUT    /api/teams/{id}/purse
```

### Auction
```
GET    /api/auction/status
POST   /api/auction/start
POST   /api/auction/bid
POST   /api/auction/sold
POST   /api/auction/unsold
```

## Data Models

### User
```python
{
    id: int,
    username: str,
    email: str,
    password_hash: str,
    role: "admin" | "presenter",
    is_active: bool,
    created_at: datetime
}
```

### Team
```python
{
    id: int,
    name: str,
    short_name: str,
    logo_url: str,
    color: str,
    total_purse: float,
    remaining_purse: float
}
```

### Player
```python
{
    id: int,
    name: str,
    role: "Batsman" | "Bowler" | "All-Rounder" | "Wicketkeeper",
    nationality: str,
    age: int,
    base_price: float,
    image_url: str,
    team_id: int | null,
    sold: bool,
    sold_price: float | null,
    stats: {
        matches_played: int,
        runs_scored: int,
        wickets_taken: int,
        average: float,
        strike_rate: float
    }
}
```

## Development Workflow

### Frontend Development
1. Create components in `src/components/`
2. Use Zustand for state management
3. Use React Router for navigation
4. Style with Tailwind CSS
5. Test API calls with backend

### Backend Development
1. Create routes in `routes/`
2. Implement controllers in `controllers/`
3. Use models from `models/models.py`
4. Add middleware in `middleware/`
5. Test with API documentation at `/docs`

## Connecting Frontend to Backend

### Frontend API Calls

```typescript
// Example: Fetch teams from backend
const response = await fetch('http://localhost:8000/api/teams');
const teams = await response.json();
```

### CORS Configuration

Backend already configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative frontend)

## Virtual Environment Management

### Install New Package
```bash
pip install package_name
pip freeze > requirements.txt  # Update requirements
```

### Remove Package
```bash
pip uninstall package_name
pip freeze > requirements.txt
```

### Reinstall All Packages
```bash
pip install -r requirements.txt --force-reinstall
```

## Deployment

### Frontend (Build)
```bash
cd frontend
npm run build
# Output: dist/ folder (ready for hosting)
```

### Backend (Production)
```bash
cd backend
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

## Directory Reference

- **frontend/src/** - React components, pages, hooks, store
- **backend/src/** - FastAPI server entry point
- **backend/config/** - Database configuration
- **backend/models/** - SQLAlchemy database models
- **backend/routes/** - API route definitions
- **backend/controllers/** - Business logic
- **backend/middleware/** - Custom middleware
- **backend/venv/** - Python virtual environment

## Troubleshooting

### Backend won't start
1. Check `.env` file exists with DATABASE_URL
2. Verify virtual environment: `.\venv\Scripts\activate`
3. Reinstall dependencies: `pip install -r requirements.txt --force-reinstall`
4. Check port 8000 is free

### Frontend can't reach backend
1. Ensure backend is running on http://localhost:8000
2. Check CORS configuration in backend
3. Verify API endpoint paths match documentation

### Database connection error
1. Get NEON connection string
2. Update DATABASE_URL in `.env`
3. Check IP is whitelisted in NEON console
4. Test with: `psql "your_connection_string"`

## Next Steps

1. ✅ Frontend and backend folders created
2. ✅ Frontend development complete
3. ✅ Backend structure set up
4. ⏳ Provide NEON database URL
5. ⏳ Implement backend API routes
6. ⏳ Connect frontend to backend
7. ⏳ Full integration testing
8. ⏳ Deployment preparation

## Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [NEON Database](https://neon.tech/docs)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Pydantic Validation](https://docs.pydantic.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Project Status**: Full-stack setup complete ✅
**Ready to**: Build API routes and integrate frontend ⚡
