# 🚀 Quick Start Guide

## Prerequisites
- Node.js 16+ installed
- PowerShell (Windows)

## Setup (First Time)

### Option 1: Automated Setup (Recommended)
```powershell
# Run from project root directory
.\setup.ps1
```

This will:
- ✅ Install all dependencies (backend + frontend)
- ✅ Initialize SQLite database
- ✅ Create admin account (admin/admin123)
- ✅ Create presenter account (presenter/presenter123)  
- ✅ Create 10 viewer accounts (team owners)

### Option 2: Manual Setup
```powershell
# Backend setup
cd backend
npm install
npm run init-db
node create-presenter.js
node scripts/assign-teams-to-viewers.js

# Frontend setup
cd ../frontend
npm install
```

## Running the Application

### Option 1: Automated Start (Recommended)
```powershell
# Run from project root directory
.\start-servers.ps1
```

This will start both servers in separate windows:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### Option 2: Manual Start

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

## Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Presenter | `presenter` | `presenter123` |
| CSK Viewer | `csk_owner` | `password123` |
| MI Viewer | `mi_owner` | `password123` |
| ... | (all teams) | `password123` |

📖 **Complete credentials**: See [CREDENTIALS.md](CREDENTIALS.md)

## Testing the Connection

1. **Start both servers** (backend + frontend)
2. **Open browser**: http://localhost:5173
3. **Login** with any account (try: admin/admin123)
4. **Check console**: Should see "✅ WebSocket connected"

## Features to Test

### As Admin (admin/admin123):
- View all teams and players
- Create/edit/delete players
- Manage users

### As Presenter (presenter/presenter123):
- Start auction
- Navigate through players
- Mark players as sold/unsold
- Control auction flow

### As Viewer (csk_owner/password123):
- View own team only
- Place bids on players
- Watch live auction

## Troubleshooting

### Backend won't start
```powershell
cd backend
npm run init-db
npm start
```

### Frontend won't start
```powershell
cd frontend
npm install
npm run dev
```

### "Cannot connect to server"
1. Check backend is running (http://localhost:5000)
2. Check `.env` files exist
3. Check firewall settings

### Database errors
```powershell
cd backend
rm database.sqlite
npm run init-db
```

## Project Structure

```
AUCTION-PORTAL/
├── backend/              # Express + Socket.io server
│   ├── database.sqlite   # SQLite database
│   └── .env             # Backend configuration
├── frontend/            # React + TypeScript
│   └── .env             # Frontend configuration  
├── setup.ps1            # Automated setup script
├── start-servers.ps1    # Start both servers
└── CREDENTIALS.md       # All login credentials
```

## Next Steps

- 📖 Read [CREDENTIALS.md](CREDENTIALS.md) for all accounts
- 📖 Read [docs/README.md](docs/README.md) for full documentation
- 🧪 Try different roles (admin, presenter, viewer)
- 🎮 Test live auction with multiple users

## Support

For issues:
1. Check [docs/guides/TESTING.md](docs/guides/TESTING.md)
2. Check browser console for errors
3. Check terminal logs
4. See troubleshooting section above
