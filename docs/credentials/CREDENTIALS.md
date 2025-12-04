# IPL Auction Portal - Complete Credentials List

## 🎯 Login Credentials (12 Total Users)

All passwords are simple and easy to remember. Format: `username@123`

---

## 👑 Admin User (1)

| Role | Username | Password | Notes |
|------|----------|----------|-------|
| **Admin** | `admin` | `admin@123` | Full system access, can manage everything |

---

## 🎤 Presenter User (1)

| Role | Username | Password | Notes |
|------|----------|----------|-------|
| **Presenter** | `presenter` | `presenter@123` | Can control auction, manage bidding, announce results |

---

## 🏆 Team Representatives (10)

Each team has a dedicated login for their representative. They can view players, place bids, and manage their team's purse.

| # | Team Name | Short Code | Username | Password | Team ID |
|---|-----------|-----------|----------|----------|---------|
| 1 | Chennai Super Kings | CSK | `csk` | `csk@123` | 1 |
| 2 | Mumbai Indians | MI | `mi` | `mi@123` | 2 |
| 3 | Royal Challengers Bangalore | RCB | `rcb` | `rcb@123` | 3 |
| 4 | Kolkata Knight Riders | KKR | `kkr` | `kkr@123` | 4 |
| 5 | Delhi Capitals | DC | `dc` | `dc@123` | 5 |
| 6 | Rajasthan Royals | RR | `rr` | `rr@123` | 6 |
| 7 | Punjab Kings | PBKS | `pbks` | `pbks@123` | 7 |
| 8 | Sunrisers Hyderabad | SRH | `srh` | `srh@123` | 8 |
| 9 | Gujarat Titans | GT | `gt` | `gt@123` | 9 |
| 10 | Lucknow Super Giants | LSG | `lsg` | `lsg@123` | 10 |

---

## 🔐 Password Pattern

All credentials follow a simple, easy-to-remember pattern:

**Format:** `<username>@123`

**Examples:**
- CSK team → Username: `csk` → Password: `csk@123`
- Admin → Username: `admin` → Password: `admin@123`
- Presenter → Username: `presenter` → Password: `presenter@123`

---

## 📱 Quick Reference - Copy & Paste Ready

### Admin Login
```
Username: admin
Password: admin@123
```

### Presenter Login
```
Username: presenter
Password: presenter@123
```

### Team Logins (Quick Copy)

**CSK** → `csk` / `csk@123`
**MI** → `mi` / `mi@123`
**RCB** → `rcb` / `rcb@123`
**KKR** → `kkr` / `kkr@123`
**DC** → `dc` / `dc@123`
**RR** → `rr` / `rr@123`
**PBKS** → `pbks` / `pbks@123`
**SRH** → `srh` / `srh@123`
**GT** → `gt` / `gt@123`
**LSG** → `lsg` / `lsg@123`

---

## 🎮 How to Use

### For Testing
1. Open the application at `http://localhost:3000` (or your frontend URL)
2. Click **Login**
3. Enter username and password from the table above
4. Click **Sign In**

### For API Testing
Using cURL or Postman:
```bash
POST http://localhost:8000/auth/login
Content-Type: application/json

{
  "username": "csk",
  "password": "csk@123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "username": "csk",
    "role": "viewer",
    "team_id": 1,
    "team_name": "Chennai Super Kings"
  }
}
```

---

## 📊 User Roles & Permissions

### Admin (`admin`)
- ✅ View all data
- ✅ Manage users
- ✅ Access admin panel
- ✅ View analytics
- ✅ System configuration

### Presenter (`presenter`)
- ✅ Control auction
- ✅ Announce players
- ✅ Manage bidding
- ✅ View live updates
- ✅ Pause/Resume auction
- ✅ View auction analytics

### Team Representatives (CSK, MI, RCB, etc.)
- ✅ View available players
- ✅ Place bids on players
- ✅ Monitor team purse
- ✅ View purchased players
- ✅ View bid history
- ✅ Track spending

---

## 🔄 Database Sync

All credentials have been **automatically created** in the PostgreSQL database when the backend started.

**Database:** PostgreSQL (Neon)
**Table:** `users`
**Status:** ✅ All 12 users created and hashed passwords stored securely

---

## 🚀 Getting Started

### Step 1: Start Backend
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Start Frontend
```bash
npm run frontend:dev
```
Or run both:
```bash
npm run dev
```

### Step 3: Test Login
Use any of the credentials above to log in and test the application.

---

## ⚠️ Important Notes

- **Passwords are hashed** in the database using bcrypt for security
- **All 12 accounts are pre-created** during database seeding
- **No additional registration needed** - just log in with provided credentials
- **Each team username matches their short code** for easy memorization
- **Password pattern is consistent** (`username@123`) for simplicity

---

## 📞 Support

If you need to:
- **Add more users:** Update `backend/app/models/seed.py` with new users
- **Change passwords:** Modify the password in `seed.py` and reseed the database
- **Reset database:** Delete existing `users` table records and run seed again

---

**Generated:** 2025-12-04  
**Status:** ✅ All credentials active and ready for testing
