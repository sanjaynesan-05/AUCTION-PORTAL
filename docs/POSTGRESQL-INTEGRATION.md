# PostgreSQL Integration - Step by Step Guide

## 📋 Overview
This guide will walk you through integrating PostgreSQL with your IPL Auction Portal backend.

---

## Step 1: Install PostgreSQL

### Option A: Download Official Installer (Recommended)
1. Visit: https://www.postgresql.org/download/windows/
2. Download PostgreSQL 15 or 16 installer
3. Run the installer with these settings:
   - **Port**: 5432 (default)
   - **Password**: Set a strong password (you'll need this!)
   - **Components**: Install all (PostgreSQL Server, pgAdmin, Command Line Tools)
4. Note down your password - you'll need it for the .env file

### Option B: Using Chocolatey (if installed)
```powershell
choco install postgresql
```

### Option C: Using Scoop (if installed)
```powershell
scoop install postgresql
```

---

## Step 2: Verify PostgreSQL Installation

After installation, restart PowerShell and test:

```powershell
# Check if PostgreSQL is installed
psql --version

# Should output something like: psql (PostgreSQL) 15.x or 16.x
```

---

## Step 3: Configure Environment Variables

### Update your `.env` file with your PostgreSQL credentials:

```properties
# PostgreSQL Connection
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/auction_portal

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Logging
LOG_LEVEL=info
```

**Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation!**

---

## Step 4: Create Database

### Option A: Using pgAdmin (GUI)
1. Open pgAdmin 4
2. Connect to PostgreSQL server (use your password)
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `auction_portal`
5. Click "Save"

### Option B: Using Command Line
```powershell
# Connect to PostgreSQL
psql -U postgres

# Enter your password when prompted

# Create database
CREATE DATABASE auction_portal;

# List databases to verify
\l

# Exit
\q
```

---

## Step 5: Test Database Connection

Run our database test script:

```powershell
cd "d:\AUCTION PORTAL\backend"
node -e "require('./database').connectDB().then(() => console.log('✅ Connected!')).catch(err => console.error('❌ Error:', err.message))"
```

**Expected Output:**
```
✅ PostgreSQL Connected!
📊 Database: auction_portal
🔧 Host: localhost:5432
✅ Connected!
```

---

## Step 6: Initialize Database Schema

This will create all tables (Users, Teams, Players) and seed initial data:

```powershell
cd "d:\AUCTION PORTAL\backend"
npm run init-db
```

**Expected Output:**
```
🗄️  Initializing PostgreSQL database...
✅ Database synced successfully!
🌱 Seeding initial data...
✅ Created 3 users (admin, presenter, viewer)
✅ Created 10 IPL teams
✅ Created 20+ players
✅ Database initialization complete!
```

---

## Step 7: Start Backend Server

```powershell
cd "d:\AUCTION PORTAL\backend"
npm start
```

**Expected Output:**
```
✅ PostgreSQL Connected!
📊 Database: auction_portal
🚀 Server running on port 5000
📱 Client URL: http://localhost:5173
🌍 Environment: development
```

---

## Step 8: Test API Endpoints

### Test 1: Health Check
```powershell
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "database": "auction_portal",
  "timestamp": "2025-10-29T..."
}
```

### Test 2: Login
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"admin123\"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "username": "admin",
      "role": "admin"
    }
  }
}
```

### Test 3: Get All Teams
```powershell
# First get the token from login response, then:
curl http://localhost:5000/api/teams `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Step 9: Verify Data in Database

### Using pgAdmin:
1. Open pgAdmin
2. Navigate to: Servers → PostgreSQL → Databases → auction_portal → Schemas → public → Tables
3. Right-click on "Users" → View/Edit Data → All Rows
4. You should see 3 users (admin, presenter, viewer)

### Using Command Line:
```powershell
psql -U postgres -d auction_portal

# View users
SELECT id, username, role FROM "Users";

# View teams
SELECT id, name, "shortName", purse FROM "Teams";

# View players
SELECT id, name, role, "basePrice", sold FROM "Players";

# Exit
\q
```

---

## 🎯 Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `auction_portal` created
- [ ] `.env` file configured with correct credentials
- [ ] Database connection test passed
- [ ] Tables created (Users, Teams, Players)
- [ ] Initial data seeded successfully
- [ ] Backend server starts without errors
- [ ] Health check endpoint responds
- [ ] Login endpoint works
- [ ] Can fetch teams/players with authentication

---

## 🐛 Common Issues & Solutions

### Issue 1: "psql: command not found"
**Solution:** Add PostgreSQL to PATH:
1. Find PostgreSQL bin folder (usually `C:\Program Files\PostgreSQL\15\bin`)
2. Add to System Environment Variables → Path
3. Restart PowerShell

### Issue 2: "password authentication failed"
**Solution:** 
1. Check `.env` file has correct password
2. Verify password in pgAdmin
3. Reset password if needed: `ALTER USER postgres PASSWORD 'new_password';`

### Issue 3: "database does not exist"
**Solution:**
```powershell
psql -U postgres
CREATE DATABASE auction_portal;
\q
```

### Issue 4: "Connection refused"
**Solution:**
1. Check PostgreSQL service is running:
   ```powershell
   Get-Service -Name postgresql*
   ```
2. If not running, start it:
   ```powershell
   Start-Service postgresql-x64-15
   ```

### Issue 5: Port 5432 already in use
**Solution:**
1. Find what's using port 5432:
   ```powershell
   netstat -ano | findstr :5432
   ```
2. Either stop that process or change PostgreSQL port in .env

---

## 📚 Next Steps

After successful integration:
1. ✅ Test all API endpoints
2. ✅ Start frontend and verify full-stack connection
3. ✅ Test real-time auction features via Socket.io
4. ✅ Monitor logs in `backend/logs/` folder

---

## 🆘 Need Help?

If you encounter issues:
1. Check `backend/logs/error.log`
2. Enable debug logging in `.env`: `LOG_LEVEL=debug`
3. Test database connection manually
4. Verify PostgreSQL service is running

---

**Ready to start? Let's begin with Step 1! 🚀**
