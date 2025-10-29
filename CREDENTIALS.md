# 🔑 IPL Auction Portal - Login Credentials

**Quick Reference Guide for All User Accounts**

---

## 🎯 Quick Access

| Role | Username | Password | What You Can Do |
|------|----------|----------|-----------------|
| **Admin** | `admin` | `admin123` | Full system control |
| **Presenter** | `presenter` | `presenter123` | Control the auction |
| **CSK Owner** | `csk_owner` | `password123` | View CSK team only |
| **MI Owner** | `mi_owner` | `password123` | View MI team only |
| **RCB Owner** | `rcb_owner` | `password123` | View RCB team only |
| *(more below)* | *(see team table)* | `password123` | *(team-specific)* |

---

## 👤 1. ADMIN ACCOUNT

**Full System Administrator**

```
Username: admin
Password: admin123
Role:     Admin
```

### ✅ What Admin Can Do:
- ✅ View all users, teams, and players
- ✅ Create, edit, and delete users
- ✅ Create, edit, and delete players
- ✅ Assign teams to viewer accounts
- ✅ Access audit logs and system settings
- ✅ View all teams' data (no restrictions)
- ❌ Cannot place bids during auction
- ❌ Cannot control auction flow

### 🔐 Login Example:
```bash
# Web Login
URL: http://localhost:5173/login
Username: admin
Password: admin123

# API Login (curl)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🎤 2. PRESENTER ACCOUNT

**Auction Host / Auctioneer**

```
Username: presenter
Password: presenter123
Role:     Presenter
```

### ✅ What Presenter Can Do:
- ✅ Start, pause, resume, and end auctions
- ✅ Navigate through player list (next/previous)
- ✅ Mark players as SOLD or UNSOLD
- ✅ View all teams and their purses
- ✅ See all players and their statuses
- ✅ Control the entire auction flow
- ❌ Cannot place bids
- ❌ Cannot edit users or players

### 🔐 Login Example:
```bash
# Web Login
URL: http://localhost:5173/login
Username: presenter
Password: presenter123

# API Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"presenter","password":"presenter123"}'
```

---

## 👥 3. VIEWER ACCOUNTS (TEAM OWNERS)

**10 IPL Team Owner Accounts**

> **⚠️ IMPORTANT**: All viewers use the same password: `password123`

### 🏏 All Team Accounts

| # | Team Name | Short Code | Username | Password | Color Code |
|---|-----------|------------|----------|----------|------------|
| 1 | **Chennai Super Kings** | CSK | `csk_owner` | `password123` | 🟡 Yellow |
| 2 | **Mumbai Indians** | MI | `mi_owner` | `password123` | 🔵 Blue |
| 3 | **Royal Challengers Bangalore** | RCB | `rcb_owner` | `password123` | 🔴 Red |
| 4 | **Kolkata Knight Riders** | KKR | `kkr_owner` | `password123` | 🟣 Purple |
| 5 | **Delhi Capitals** | DC | `dc_owner` | `password123` | 🔵 Blue |
| 6 | **Punjab Kings** | PBKS | `pbks_owner` | `password123` | 🔴 Red |
| 7 | **Rajasthan Royals** | RR | `rr_owner` | `password123` | 💙 Pink/Blue |
| 8 | **Sunrisers Hyderabad** | SRH | `srh_owner` | `password123` | 🟠 Orange |
| 9 | **Gujarat Titans** | GT | `gt_owner` | `password123` | ⚫ Navy |
| 10 | **Lucknow Super Giants** | LSG | `lsg_owner` | `password123` | 🟡 Gold |

### ✅ What Each Viewer (Team Owner) Can Do:
- ✅ Place bids on players during auction
- ✅ View their **OWN team's** roster only
- ✅ See their team's remaining purse
- ✅ See their team's total spending
- ✅ Watch auction progress in real-time
- ❌ **CANNOT see other teams' data** (isolated)
- ❌ Cannot control auction flow
- ❌ Cannot edit players or teams

### 🔐 Login Example (CSK Owner):
```bash
# Web Login
URL: http://localhost:5173/login
Username: csk_owner
Password: password123

# API Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"csk_owner","password":"password123"}'
```

---

## 🧪 TESTING SCENARIOS

### Test 1: Admin Login & Full Access
```bash
1. Login as: admin / admin123
2. Navigate to Admin Panel
3. You should see:
   - All 10 teams
   - All users (admin, presenter, viewers)
   - All players
   - System settings
```

### Test 2: Presenter Login & Auction Control
```bash
1. Login as: presenter / presenter123
2. Navigate to Presenter Panel
3. You should see:
   - Start Auction button
   - Player list (all unsold players)
   - All team names and purses
   - Auction control buttons
```

### Test 3: Viewer Login & Team Isolation
```bash
1. Login as: csk_owner / password123
2. Navigate to Viewer Screen
3. You should ONLY see:
   - CSK team name
   - CSK purse
   - CSK players (if any bought)
   - Auction broadcast
4. You should NOT see:
   - Other teams' data
   - Other teams' purses
   - Other teams' players
```

### Test 4: Multi-Viewer Auction
```bash
# Terminal 1: Presenter
Login: presenter / presenter123
Action: Start auction, reveal player

# Terminal 2: CSK Viewer
Login: csk_owner / password123
Action: Place bid: 100 lakhs

# Terminal 3: MI Viewer
Login: mi_owner / password123
Action: Place bid: 120 lakhs

# Terminal 1: Presenter
Action: Mark player as SOLD to MI
```

---

## 🔄 HOW TO CREATE ACCOUNTS

### Create Admin & Presenter (Initial Setup)
```bash
cd backend
npm run init-db
```
✅ Creates: `admin` and default data

### Create All Viewer Accounts
```bash
cd backend
node scripts/assign-teams-to-viewers.js
```
✅ Creates: All 10 team owner accounts (csk_owner, mi_owner, etc.)

### Manually Create Presenter Account
```bash
cd backend
node -e "
const { User } = require('./models');
(async () => {
  await User.create({
    username: 'presenter',
    password: 'presenter123',
    role: 'presenter'
  });
  console.log('✅ Presenter created');
  process.exit(0);
})();
"
```

---

## 📊 ACCOUNT SUMMARY

| Account Type | Count | Default Password | Access Level |
|--------------|-------|------------------|--------------|
| Admin | 1 | `admin123` | 🔴 Full System |
| Presenter | 1 | `presenter123` | 🟡 Auction Control |
| Viewers (Teams) | 10 | `password123` | 🟢 Team-Specific |
| **TOTAL** | **12** | - | - |

---

## 🚨 SECURITY NOTES

### ⚠️ Production Deployment
**DO NOT use these default passwords in production!**

Before deploying to production:

1. **Change Admin Password**
   ```sql
   UPDATE users SET password = '$hashed_password' WHERE username = 'admin';
   ```

2. **Change Presenter Password**
   ```sql
   UPDATE users SET password = '$hashed_password' WHERE username = 'presenter';
   ```

3. **Force Password Reset for Viewers**
   - Implement password change on first login
   - Use strong password policy (min 8 chars, uppercase, numbers)

4. **Enable Additional Security**
   - Enable rate limiting on login endpoint
   - Add CAPTCHA after failed login attempts
   - Use HTTPS/SSL for all connections
   - Implement JWT token expiration

### 🔒 Password Best Practices
- **Development**: Use simple passwords (current setup)
- **Testing**: Use default passwords for QA
- **Staging**: Use environment-specific passwords
- **Production**: Use strong, unique passwords + 2FA

---

## 🔗 RELATED DOCUMENTATION

- **Setup Guide**: [docs/setup/QUICK-START.md](docs/setup/QUICK-START.md)
- **RBAC Permissions**: [docs/features/RBAC.md](docs/features/RBAC.md)
- **Viewer Restrictions**: [docs/features/VIEWER-RESTRICTIONS.md](docs/features/VIEWER-RESTRICTIONS.md)
- **API Documentation**: [docs/api/REST-API.md](docs/api/REST-API.md)
- **Testing Guide**: [docs/guides/TESTING.md](docs/guides/TESTING.md)

---

## 📞 TROUBLESHOOTING

### Cannot Login as Admin
```bash
# Re-initialize database
cd backend
npm run init-db
```

### Cannot Login as Presenter
```bash
# Manually create presenter account
cd backend
node -e "const { User } = require('./models'); (async () => { await User.create({ username: 'presenter', password: 'presenter123', role: 'presenter' }); process.exit(0); })();"
```

### Viewer Not Assigned to Team
```bash
# Run team assignment script
cd backend
node scripts/assign-teams-to-viewers.js
```

### Forgot Password (Development)
```bash
# Check database for all users
cd backend
node -e "const { User } = require('./models'); (async () => { const users = await User.findAll(); users.forEach(u => console.log(u.username, u.role)); process.exit(0); })();"
```

---

**Last Updated**: October 30, 2025  
**Version**: 1.0  
**Status**: ✅ All 12 accounts documented

---

## 📋 QUICK COPY-PASTE

### Admin Login
```
Username: admin
Password: admin123
```

### Presenter Login
```
Username: presenter
Password: presenter123
```

### Team Owner Logins (All use same password)
```
CSK:  csk_owner  / password123
MI:   mi_owner   / password123
RCB:  rcb_owner  / password123
KKR:  kkr_owner  / password123
DC:   dc_owner   / password123
PBKS: pbks_owner / password123
RR:   rr_owner   / password123
SRH:  srh_owner  / password123
GT:   gt_owner   / password123
LSG:  lsg_owner  / password123
```

---

**🎉 Happy Bidding! 🏏**
