# 🎯 IPL Auction Portal - Complete Login Credentials

## ✅ Status: All 12 Credentials Created & Verified

**Generated:** December 4, 2025  
**Database:** PostgreSQL (Neon)  
**Status:** ✅ All users created and tested

---

## 📋 Credentials Overview

| Category | Count | Details |
|----------|-------|---------|
| **Admin** | 1 | System administrator access |
| **Presenter** | 1 | Auction control & broadcasting |
| **Teams** | 10 | One representative per IPL team |
| **Total** | **12** | All ready for simultaneous login |

---

## 👑 ADMIN ACCOUNT

```
Username: admin
Password: admin@123
Role:     Admin (Full system access)
```

**Capabilities:**
- View all system data
- Manage user accounts
- Access admin dashboard
- System configuration
- View comprehensive analytics

---

## 🎤 PRESENTER ACCOUNT

```
Username: presenter
Password: presenter@123
Role:     Presenter (Auction control)
```

**Capabilities:**
- Control auction flow (start, pause, resume)
- Announce current player
- Manage live bidding
- Display bid information
- View real-time auction updates

---

## 🏆 TEAM ACCOUNTS (10 IPL Teams)

### Indian Premier League Teams

#### 1️⃣ Chennai Super Kings (CSK)
```
Username: csk
Password: csk@123
Team ID:  1
```

#### 2️⃣ Mumbai Indians (MI)
```
Username: mi
Password: mi@123
Team ID:  2
```

#### 3️⃣ Royal Challengers Bangalore (RCB)
```
Username: rcb
Password: rcb@123
Team ID:  3
```

#### 4️⃣ Kolkata Knight Riders (KKR)
```
Username: kkr
Password: kkr@123
Team ID:  4
```

#### 5️⃣ Delhi Capitals (DC)
```
Username: dc
Password: dc@123
Team ID:  5
```

#### 6️⃣ Rajasthan Royals (RR)
```
Username: rr
Password: rr@123
Team ID:  6
```

#### 7️⃣ Punjab Kings (PBKS)
```
Username: pbks
Password: pbks@123
Team ID:  7
```

#### 8️⃣ Sunrisers Hyderabad (SRH)
```
Username: srh
Password: srh@123
Team ID:  8
```

#### 9️⃣ Gujarat Titans (GT)
```
Username: gt
Password: gt@123
Team ID:  9
```

#### 🔟 Lucknow Super Giants (LSG)
```
Username: lsg
Password: lsg@123
Team ID:  10
```

---

## 🔐 Password Pattern

**All passwords follow this simple pattern:**

```
Format: <username>@123
```

**Examples:**
- `admin` → password: `admin@123`
- `csk` → password: `csk@123`
- `presenter` → password: `presenter@123`

**Why this pattern?**
✅ Easy to remember  
✅ Consistent across all users  
✅ Secure enough for internal testing  
✅ Quick to type during demos  

---

## 🧪 Testing Login

### Method 1: Web Application
1. Open `http://localhost:3000`
2. Click "Login"
3. Enter username and password from the list above
4. Click "Sign In"

### Method 2: API Testing (cURL)

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"csk","password":"csk@123"}'
```

### Method 3: API Testing (Postman)

**URL:** `POST http://localhost:8000/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "csk",
  "password": "csk@123"
}
```

**Expected Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "username": "csk",
    "role": "viewer",
    "teamId": 1,
    "teamName": "Chennai Super Kings",
    "id": "team-csk"
  }
}
```

---

## ✅ Verified Logins

The following credentials have been **tested and verified working:**

- ✅ `admin` / `admin@123`
- ✅ `presenter` / `presenter@123`
- ✅ `csk` / `csk@123` (and all other teams)

---

## 📊 User Roles & Permissions

### Admin Role
- ✅ View dashboard
- ✅ Manage users
- ✅ View analytics
- ✅ System settings
- ✅ User management
- ✅ Full data access

### Presenter Role
- ✅ Control auction
- ✅ Manage player queue
- ✅ View live bids
- ✅ Announce results
- ✅ Pause/Resume
- ✅ View auction stats

### Team/Viewer Role
- ✅ View available players
- ✅ Place bids
- ✅ Check purse balance
- ✅ View bid history
- ✅ See purchased players
- ✅ Monitor team roster

---

## 🗂️ Database Information

**Database Type:** PostgreSQL  
**Host:** ap-southeast-1.aws.neon.tech (Neon Serverless)  
**Database:** neondb  
**Table:** users  

**All 12 users are stored with:**
- ✅ Hashed passwords (bcrypt)
- ✅ Role assignments
- ✅ Team associations
- ✅ Timestamps

---

## 🚀 Quick Start Guide

### 1. Start Backend
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Frontend
```bash
npm run frontend:dev
```

### 3. Open Application
Navigate to `http://localhost:3000`

### 4. Log In
Use any credentials from the list above

---

## 📱 Credentials Quick Reference (Copy & Paste)

```
ADMIN:       admin / admin@123
PRESENTER:   presenter / presenter@123

CSK:    csk / csk@123
MI:     mi / mi@123
RCB:    rcb / rcb@123
KKR:    kkr / kkr@123
DC:     dc / dc@123
RR:     rr / rr@123
PBKS:   pbks / pbks@123
SRH:    srh / srh@123
GT:     gt / gt@123
LSG:    lsg / lsg@123
```

---

## 🔧 Modifying Credentials

### To Change a Password:

1. Edit `backend/app/models/seed.py`
2. Update the password in the `mock_users` list
3. Clear the users table:
   ```python
   from app.database import SessionLocal
   from app.models.orm import User
   db = SessionLocal()
   db.query(User).delete()
   db.commit()
   db.close()
   ```
4. Re-run seed: `python backend/verify_database.py`
5. Restart backend

### To Add More Users:

Edit `seed_users()` function in `backend/app/models/seed.py` and add:
```python
{"id": "team-xyz", "username": "xyz", "password": "xyz@123", "role": "viewer", "team_id": 11, "team_name": "New Team"}
```

---

## 🔐 Security Notes

⚠️ **For Development/Testing Only**
- These are simple passwords for easy testing
- In production, use strong, unique passwords
- Passwords are hashed in database using bcrypt
- Use environment variables for sensitive data

---

## 📞 Support & Troubleshooting

### Login Not Working?

1. **Check backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Verify database connection:**
   ```bash
   python backend/verify_database.py
   ```

3. **Check user exists in database:**
   ```python
   from app.database import SessionLocal
   from app.models.orm import User
   db = SessionLocal()
   user = db.query(User).filter(User.username == "csk").first()
   print(user)
   ```

4. **Reset credentials:**
   - Delete all users from database
   - Restart backend (will auto-seed)

---

## 📋 Checklist

- ✅ All 12 users created in database
- ✅ Passwords hashed securely
- ✅ Admin account working
- ✅ Presenter account working
- ✅ All 10 team accounts working
- ✅ Login endpoint verified (200 OK)
- ✅ JWT tokens issuing correctly
- ✅ User roles assigned
- ✅ Team associations created
- ✅ Documentation complete

---

## 🎉 Ready to Deploy

The authentication system is **production-ready** for:
- ✅ Internal testing with multiple users
- ✅ Demo presentations (10 teams simultaneously)
- ✅ Load testing (parallel logins)
- ✅ Feature validation

---

**Last Updated:** December 4, 2025  
**Status:** ✅ Active and Verified  
**Backend URL:** http://localhost:8000  
**Frontend URL:** http://localhost:3000  
