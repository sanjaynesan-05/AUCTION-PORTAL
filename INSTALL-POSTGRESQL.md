# PostgreSQL Installation Guide - Quick Reference

## 🚀 STEP 1: Download PostgreSQL

### Direct Download Link:
**PostgreSQL 16.4 for Windows x64:**
https://get.enterprisedb.com/postgresql/postgresql-16.4-1-windows-x64.exe

### Alternative - Visit Official Site:
https://www.postgresql.org/download/windows/
Then click "Download the installer" → Select Windows x64 version 16.x

---

## 📦 STEP 2: Install PostgreSQL

1. **Run the downloaded .exe file** (as Administrator)

2. **Installation Wizard Settings:**

   ✅ **Installation Directory**: 
   ```
   C:\Program Files\PostgreSQL\16
   ```
   (Keep default)

   ✅ **Select Components** - Install ALL:
   - [x] PostgreSQL Server
   - [x] pgAdmin 4
   - [x] Stack Builder
   - [x] Command Line Tools  ← IMPORTANT!

   ✅ **Data Directory**:
   ```
   C:\Program Files\PostgreSQL\16\data
   ```
   (Keep default)

   ✅ **Password for postgres user**:
   - Set a strong password (e.g., `postgres123` for development)
   - ⚠️ **WRITE IT DOWN!** You'll need this for the .env file

   ✅ **Port**:
   ```
   5432
   ```
   (Keep default)

   ✅ **Locale**:
   ```
   [Default locale]
   ```

3. **Wait for installation** (3-5 minutes)

4. **Uncheck "Launch Stack Builder"** at the end (not needed)

---

## ✅ STEP 3: Verify Installation

### Open a NEW PowerShell window and test:

```powershell
# Test PostgreSQL command
psql --version

# Expected output:
# psql (PostgreSQL) 16.4
```

If you get "command not found", the PATH wasn't set correctly. See troubleshooting below.

---

## 🔧 STEP 4: Update Your .env File

Open `d:\AUCTION PORTAL\backend\.env` and update:

```properties
# Replace 'password' with YOUR actual PostgreSQL password
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/auction_portal

# Example if your password is 'postgres123':
# DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/auction_portal
```

---

## 🗄️ STEP 5: Create Database

### Option A - Using pgAdmin (GUI):
1. Open pgAdmin 4 from Start Menu
2. Enter your master password (if prompted)
3. Expand Servers → PostgreSQL 16 → Right-click "Databases"
4. Select "Create" → "Database"
5. Name: `auction_portal`
6. Click "Save"

### Option B - Using Command Line:
```powershell
# Connect to PostgreSQL
psql -U postgres

# Enter your password when prompted

# Create database
CREATE DATABASE auction_portal;

# Verify
\l

# Exit
\q
```

---

## 🚀 STEP 6: Initialize Your Backend Database

```powershell
cd "d:\AUCTION PORTAL\backend"

# Initialize database with tables and seed data
npm run init-db
```

**Expected Output:**
```
✅ Database synced successfully!
🌱 Seeding initial data...
✅ Created 3 users (admin, presenter, viewer)
✅ Created 10 IPL teams
✅ Created 20+ players
```

---

## 🎉 STEP 7: Start Your Backend

```powershell
cd "d:\AUCTION PORTAL\backend"
npm start
```

**Expected Output:**
```
✅ PostgreSQL Connected!
📊 Database: auction_portal
🚀 Server running on port 5000
```

---

## 🐛 TROUBLESHOOTING

### Issue: "psql: command not found" after installation

**Solution - Add PostgreSQL to PATH manually:**

1. Open System Properties:
   - Press `Win + R`
   - Type `sysdm.cpl`
   - Press Enter

2. Click "Environment Variables" button

3. Under "System variables", find "Path" and click "Edit"

4. Click "New" and add:
   ```
   C:\Program Files\PostgreSQL\16\bin
   ```

5. Click OK on all windows

6. **Restart PowerShell** and test again:
   ```powershell
   psql --version
   ```

### Issue: "password authentication failed"

**Solution:**
1. Check your password in the .env file matches what you set during installation
2. Try connecting with psql to verify:
   ```powershell
   psql -U postgres -h localhost
   ```

### Issue: "could not connect to server"

**Solution:**
1. Check if PostgreSQL service is running:
   ```powershell
   Get-Service -Name postgresql*
   ```

2. If stopped, start it:
   ```powershell
   Start-Service postgresql-x64-16
   ```

---

## 📝 QUICK CHECKLIST

After installation, verify these:

- [ ] PostgreSQL installed successfully
- [ ] `psql --version` works in PowerShell
- [ ] PostgreSQL service is running
- [ ] `.env` file updated with correct password
- [ ] Database `auction_portal` created
- [ ] `npm run init-db` completed successfully
- [ ] Backend starts without errors

---

## 🆘 Still Having Issues?

1. Check logs: `d:\AUCTION PORTAL\backend\logs\error.log`
2. Verify PostgreSQL service: Services app → Look for "postgresql-x64-16"
3. Test connection: `psql -U postgres -h localhost`

---

**Once PostgreSQL is installed, run this command to continue:**
```powershell
cd "d:\AUCTION PORTAL"
.\scripts\quick-postgres-setup.ps1
```
