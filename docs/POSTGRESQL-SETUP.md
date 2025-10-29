# 🐘 PostgreSQL Migration Guide - IPL Auction Portal

## 📋 Overview

The backend has been migrated from MongoDB to PostgreSQL using Sequelize ORM. This provides better data integrity, ACID compliance, and powerful relational database features.

## 🆕 What Changed

### Technology Stack
- ❌ **Removed**: MongoDB, Mongoose
- ✅ **Added**: PostgreSQL, Sequelize ORM, pg driver

### Database Architecture
- **User Table**: Authentication and role management
- **Player Table**: Cricket player data with JSONB stats
- **Team Table**: IPL team information
- **Relationships**: One-to-Many (Team → Players)

## 🛠️ Installation & Setup

### Step 1: Install PostgreSQL

**Windows:**
1. Download PostgreSQL from [official website](https://www.postgresql.org/download/windows/)
2. Run the installer (PostgreSQL 15 or higher recommended)
3. Set a password for the `postgres` user (remember this!)
4. Default port: 5432
5. Install pgAdmin 4 (GUI tool, optional but recommended)

**Alternative - Using Docker:**
```powershell
docker run --name auction-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=auction_portal -p 5432:5432 -d postgres:15
```

### Step 2: Create Database

**Option A: Using psql (Command Line)**
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE auction_portal;

# Exit
\q
```

**Option B: Using pgAdmin**
1. Open pgAdmin 4
2. Right-click on "Databases"
3. Create → Database
4. Name: `auction_portal`
5. Click "Save"

**Option C: Using Docker**
```powershell
# Database is automatically created with the docker run command
docker exec -it auction-postgres psql -U postgres -d auction_portal
```

### Step 3: Install Backend Dependencies

```powershell
cd server
npm install
```

This will install:
- `pg` - PostgreSQL client for Node.js
- `sequelize` - Promise-based ORM
- All existing dependencies (express, socket.io, etc.)

### Step 4: Configure Environment Variables

Update `server/.env`:

```env
# PostgreSQL Connection String
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/auction_portal

# JWT Secret Key
JWT_SECRET=your-secret-key-change-this-in-production-12345

# Server Port
PORT=5000

# Client URL
CLIENT_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

**Connection String Format:**
```
postgresql://username:password@host:port/database_name
```

**Examples:**
```env
# Local PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/auction_portal

# Docker
DATABASE_URL=postgresql://postgres:password@localhost:5432/auction_portal

# Heroku
DATABASE_URL=postgresql://user:pass@host.compute.amazonaws.com:5432/dbname

# AWS RDS
DATABASE_URL=postgresql://username:password@mydb.123456789012.us-east-1.rds.amazonaws.com:5432/auction_portal
```

### Step 5: Initialize Database

Run the initialization script to create tables and seed data:

```powershell
cd server
npm run init-db
```

This will:
- ✅ Create all database tables (users, players, teams)
- ✅ Create default admin user (username: `admin`, password: `admin123`)
- ✅ Seed 10 IPL teams
- ✅ Seed 5 sample players

**Expected Output:**
```
🔄 Starting database initialization...

✅ PostgreSQL connection established

📋 Creating database tables...
✅ Tables created successfully

👤 Creating default admin user...
✅ Admin user created (username: admin, password: admin123)

📊 Current database status:
   - Players: 5
   - Teams: 10
   - Users: 1

✅ Database initialization complete!
```

### Step 6: Start the Server

```powershell
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000
📱 Client URL: http://localhost:5173
🌍 Environment: development
🗄️  Database: PostgreSQL

✅ PostgreSQL Connected successfully
📊 Database: auction_portal
🏠 Host: localhost:5432
📋 Database tables synchronized
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(30) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'presenter', 'viewer')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Teams Table
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  short_name VARCHAR(5) UNIQUE NOT NULL,
  purse DECIMAL(10, 2) DEFAULT 12000,
  logo TEXT,
  color VARCHAR(7) NOT NULL DEFAULT '#000000',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Players Table
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper')),
  base_price DECIMAL(10, 2) DEFAULT 0,
  sold BOOLEAN DEFAULT FALSE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  price DECIMAL(10, 2),
  nationality VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 16 AND age <= 50),
  batting_style VARCHAR(255),
  bowling_style VARCHAR(255),
  image TEXT,
  stats JSONB DEFAULT '{"matches": 0, "runs": 0, "wickets": 0, "average": 0, "strikeRate": 0}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔍 PostgreSQL Management

### Using psql (Command Line)

```powershell
# Connect to database
psql -U postgres -d auction_portal

# List all tables
\dt

# Describe table structure
\d users
\d players
\d teams

# View data
SELECT * FROM users;
SELECT * FROM teams;
SELECT * FROM players WHERE sold = false;

# Exit
\q
```

### Using pgAdmin 4 (GUI)

1. **Connect to Server**
   - Servers → PostgreSQL 15 → Databases → auction_portal

2. **View Tables**
   - Schemas → public → Tables

3. **Query Tool**
   - Right-click on database → Query Tool
   - Write SQL and execute

4. **View Data**
   - Right-click on table → View/Edit Data → All Rows

## 🧪 Testing the API

### 1. Health Check
```powershell
curl http://localhost:5000/api/health
```

### 2. Register User
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"testuser\",\"password\":\"test123\",\"role\":\"viewer\"}'
```

### 3. Login
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"admin123\"}'
```

### 4. Get Players (Protected)
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
curl -H "Authorization: Bearer $token" http://localhost:5000/api/players
```

### 5. Get Teams (Protected)
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
curl -H "Authorization: Bearer $token" http://localhost:5000/api/teams
```

## 🔄 Database Operations

### Reset Database
```powershell
# Drop all tables and recreate
cd server
node -e "require('./models').syncDatabase({ force: true }).then(() => process.exit())"

# Run init-db again
npm run init-db
```

### Backup Database
```powershell
# Backup to file
pg_dump -U postgres -d auction_portal -f backup.sql

# Restore from backup
psql -U postgres -d auction_portal -f backup.sql
```

### Check Connection
```powershell
# Test PostgreSQL connection
psql -U postgres -c "SELECT version();"
```

## 🐛 Troubleshooting

### Issue: Cannot connect to PostgreSQL

**Error:**
```
❌ PostgreSQL Connection Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. Check if PostgreSQL is running:
   ```powershell
   # Windows
   Get-Service -Name postgresql*
   
   # Start service
   Start-Service postgresql-x64-15
   ```

2. Verify connection string in `.env`
3. Check PostgreSQL port (default: 5432)
4. Verify username and password

### Issue: Authentication failed

**Error:**
```
password authentication failed for user "postgres"
```

**Solutions:**
1. Reset PostgreSQL password:
   ```powershell
   psql -U postgres
   ALTER USER postgres PASSWORD 'new_password';
   ```
2. Update `DATABASE_URL` in `.env`

### Issue: Database does not exist

**Error:**
```
database "auction_portal" does not exist
```

**Solutions:**
1. Create database manually:
   ```sql
   CREATE DATABASE auction_portal;
   ```
2. Or use Docker with auto-creation

### Issue: Port already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5432
```

**Solutions:**
1. Stop other PostgreSQL instances
2. Change port in connection string
3. Kill process on port 5432:
   ```powershell
   netstat -ano | findstr :5432
   taskkill /PID <PID> /F
   ```

### Issue: Tables not created

**Error:**
```
relation "users" does not exist
```

**Solutions:**
1. Run init-db script:
   ```powershell
   npm run init-db
   ```
2. Check for SQL errors in logs
3. Verify user has CREATE TABLE permissions

## 📊 Performance Tips

### Indexes
All important columns are indexed automatically:
- `users.username` (unique)
- `teams.name`, `teams.short_name` (unique)
- `players.sold`, `players.role`, `players.team_id`, `players.name`

### Connection Pooling
Sequelize uses connection pooling by default:
```javascript
{
  max: 10,      // Maximum connections
  min: 0,       // Minimum connections
  acquire: 30000, // Max time to get connection
  idle: 10000   // Max time connection can be idle
}
```

### Query Optimization
- Use `include` for eager loading
- Use `attributes` to select specific columns
- Use `raw: true` for plain objects
- Add indexes for frequently queried columns

## 🔒 Security

### Production Checklist
- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable SSL for database connection
- [ ] Use environment variables for sensitive data
- [ ] Enable PostgreSQL SSL mode
- [ ] Restrict database user permissions
- [ ] Use prepared statements (Sequelize does this automatically)
- [ ] Enable rate limiting on API endpoints

### SSL Connection (Production)
```javascript
// In database.js
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
}
```

## 📚 Useful SQL Queries

### Get auction statistics
```sql
SELECT 
  COUNT(*) as total_players,
  COUNT(*) FILTER (WHERE sold = true) as sold_players,
  COUNT(*) FILTER (WHERE sold = false) as unsold_players,
  SUM(price) as total_spent
FROM players;
```

### Team-wise spending
```sql
SELECT 
  t.name,
  t.short_name,
  t.purse as remaining_purse,
  (12000 - t.purse) as total_spent,
  COUNT(p.id) as players_bought
FROM teams t
LEFT JOIN players p ON p.team_id = t.id
GROUP BY t.id, t.name, t.short_name, t.purse
ORDER BY total_spent DESC;
```

### Most expensive players
```sql
SELECT 
  p.name,
  p.role,
  p.price,
  t.short_name as team
FROM players p
LEFT JOIN teams t ON t.id = p.team_id
WHERE p.sold = true
ORDER BY p.price DESC
LIMIT 10;
```

## 🎯 Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create database
3. ✅ Install dependencies
4. ✅ Configure `.env`
5. ✅ Run `npm run init-db`
6. ✅ Start server with `npm start`
7. ✅ Test API endpoints
8. ✅ Connect frontend
9. 🎉 Start auction!

## 📖 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [pg (node-postgres) Documentation](https://node-postgres.com/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)

---

**🐘 Your backend is now powered by PostgreSQL! 🚀**
