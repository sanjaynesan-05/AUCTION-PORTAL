# 🔐 VIEWER RESTRICTION - QUICK START GUIDE

## ⚡ Quick Test (3 Steps)

### Step 1: Start Server
```bash
cd backend
npm start
```
> Keep this terminal open

### Step 2: Test CSK Viewer (New Terminal)
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"csk_owner\",\"password\":\"password123\"}"

# Copy the token from response, then:
# Get my team (should return CSK)
curl -X GET http://localhost:5000/api/teams/my-team -H "Authorization: Bearer YOUR_TOKEN"

# Get players (should only show CSK players)
curl -X GET http://localhost:5000/api/players -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 3: Verify Restriction
```bash
# Login as MI viewer
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"mi_owner\",\"password\":\"password123\"}"

# Get players with MI token (should only show MI players, NOT CSK)
curl -X GET http://localhost:5000/api/players -H "Authorization: Bearer MI_TOKEN"
```

---

## 📦 What Was Implemented

✅ **Database**: Added `teamId` column to users table  
✅ **Model**: User-Team association created  
✅ **API**: Filtered endpoints for viewers  
✅ **JWT**: Token includes teamId  
✅ **Data**: 10 viewer accounts created  
✅ **Tests**: Automated test script ready  

---

## 🔑 Test Accounts (All use password: `password123`)

| Username | Team |
|----------|------|
| csk_owner | Chennai Super Kings |
| mi_owner | Mumbai Indians |
| rcb_owner | Royal Challengers Bangalore |
| kkr_owner | Kolkata Knight Riders |
| dc_owner | Delhi Capitals |
| pbks_owner | Punjab Kings |
| rr_owner | Rajasthan Royals |
| srh_owner | Sunrisers Hyderabad |
| gt_owner | Gujarat Titans |
| lsg_owner | Lucknow Super Giants |

---

## 🛡️ Security Features

✅ Viewers see ONLY their team's players  
✅ Viewers access ONLY their team's data  
✅ 403 Forbidden when accessing other teams  
✅ Server-side filtering (not just UI)  

---

## 📊 API Behavior

### Admin/Presenter (No Change)
```
GET /api/players → All 100+ players
GET /api/teams → All 10 teams
GET /api/teams/:id → Any team
```

### Viewer (NEW Restrictions)
```
GET /api/players → Only their team's players
GET /api/teams → Only their team (1 team)
GET /api/teams/:id → Only their team (403 for others)
GET /api/teams/my-team → Their team with full squad
```

---

## 🐛 Troubleshooting

**Error: "Invalid credentials"**
→ Check password is `password123` (not `team123`)

**Error: "Invalid token"**
→ Restart the server (npm start)

**Server won't start (EADDRINUSE)**
→ Kill port 5000: `Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force`

**Test script fails**
→ Make sure server is running first

---

## 📖 Full Documentation

- `VIEWER-FEATURE-SUMMARY.md` - Complete implementation details
- `VIEWER-TEAM-RESTRICTION.md` - Feature overview
- `VIEWER-ACCOUNTS.md` - Account reference

---

**Status**: ✅ Complete & Ready for Testing  
**Password**: `password123` (all viewers)  
**Next**: Restart server → Test with viewer accounts
