# 🚀 Quick Start - PostgreSQL Backend

## Prerequisites
- ✅ Node.js (v16+)
- ✅ PostgreSQL (v15+) or Docker

## Installation (5 Minutes)

### Option 1: Automated Setup (Recommended)

```powershell
# 1. Run PostgreSQL setup script
.\setup-postgresql.ps1

# 2. Install dependencies
cd server
npm install

# 3. Initialize database (creates tables + seed data)
npm run init-db

# 4. Start server
npm start
```

### Option 2: Manual Setup

```powershell
# 1. Install PostgreSQL from https://www.postgresql.org/download/

# 2. Create database
psql -U postgres -c "CREATE DATABASE auction_portal;"

# 3. Update server/.env
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/auction_portal

# 4. Install dependencies
cd server
npm install

# 5. Initialize database
npm run init-db

# 6. Start server
npm start
```

### Option 3: Docker (Easiest)

```powershell
# 1. Start PostgreSQL container
docker run --name auction-postgres `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=auction_portal `
  -p 5432:5432 -d postgres:15

# 2. Install dependencies
cd server
npm install

# 3. Initialize database
npm run init-db

# 4. Start server
npm start
```

## Verify Installation

```powershell
# Test API
curl http://localhost:5000/api/health

# Expected output:
# {
#   "success": true,
#   "message": "Server is running",
#   "database": "auction_portal",
#   "timestamp": "2025-10-29T..."
# }
```

## Default Credentials

**Admin User:**
- Username: `admin`
- Password: `admin123`

## API Endpoints

All endpoints remain the same as before:
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/players` - Get players
- `GET /api/teams` - Get teams

## Troubleshooting

### Cannot connect to database
```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# Start service
Start-Service postgresql-x64-15
```

### Port 5432 already in use
```powershell
# Check what's using the port
netstat -ano | findstr :5432
```

### Authentication failed
- Check password in `server/.env`
- Verify PostgreSQL user exists
- Try connecting with psql: `psql -U postgres`

## Next Steps

1. ✅ Server running at `http://localhost:5000`
2. 🎨 Start frontend: `cd .. && npm start`
3. 🏏 Access application at `http://localhost:5173`
4. 📚 Read full docs: `POSTGRESQL-SETUP.md`

## Support Files

- 📖 `POSTGRESQL-SETUP.md` - Complete setup guide
- 🔄 `MIGRATION-SUMMARY.md` - MongoDB → PostgreSQL changes
- 🏗️ `BACKEND.md` - Full API documentation
- ⚙️ `setup-postgresql.ps1` - Automated setup script

---

**Done! Your backend is now running on PostgreSQL! 🎉**
