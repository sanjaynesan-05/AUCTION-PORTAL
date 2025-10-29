# 🔐 Test Accounts Reference

Complete list of all test accounts for the IPL Auction Portal.

## 👤 Admin Account

Full system access with all permissions.

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `admin123` |
| **Role** | Admin |
| **Access** | All features |

**Capabilities**:
- View all users, teams, and players
- Create/edit/delete users and players
- Assign teams to viewers
- Access audit logs
- Cannot place bids

---

## 🎤 Presenter Account

Auction host with control over the auction flow.

| Field | Value |
|-------|-------|
| **Username** | `presenter` |
| **Password** | `presenter123` |
| **Role** | Presenter |
| **Access** | Auction control |

**Capabilities**:
- Start/pause/resume/end auctions
- Navigate through players
- Mark players as sold/unsold
- View all teams and players
- Cannot place bids

---

## 👥 Viewer Accounts (Team Owners)

Each viewer represents a team owner and can only see their own team's data.

### Password for All Viewers
```
password123
```

### IPL Team Accounts

| Username | Team | Short Name | Can See |
|----------|------|------------|---------|
| `csk_owner` | Chennai Super Kings | CSK | CSK data only |
| `mi_owner` | Mumbai Indians | MI | MI data only |
| `rcb_owner` | Royal Challengers Bangalore | RCB | RCB data only |
| `kkr_owner` | Kolkata Knight Riders | KKR | KKR data only |
| `dc_owner` | Delhi Capitals | DC | DC data only |
| `pbks_owner` | Punjab Kings | PBKS | PBKS data only |
| `rr_owner` | Rajasthan Royals | RR | RR data only |
| `srh_owner` | Sunrisers Hyderabad | SRH | SRH data only |
| `gt_owner` | Gujarat Titans | GT | GT data only |
| `lsg_owner` | Lucknow Super Giants | LSG | LSG data only |

**Capabilities**:
- Place bids on players
- View their own team's roster
- See their team's purse and spending
- Cannot see other teams' data
- Cannot control auction

---

## 🧪 Testing Scenarios

### Scenario 1: Admin Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Expected**: Success, token with role "admin"

### Scenario 2: Presenter Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "presenter",
  "password": "presenter123"
}
```

**Expected**: Success, token with role "presenter"

### Scenario 3: CSK Viewer Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "csk_owner",
  "password": "password123"
}
```

**Expected**: Success, token with role "viewer" and teamId for CSK

### Scenario 4: Viewer Restrictions Test
```bash
# Login as CSK viewer
# GET /api/players → Should only see CSK players
# GET /api/teams → Should only see CSK team
# GET /api/teams/mi-uuid → Should fail with 403
```

---

## 🔄 Quick Access Codes (Frontend)

For rapid testing in the frontend login screen:

### Admin
```
Username: admin
Password: admin123
```

### Presenter
```
Username: presenter
Password: presenter123
```

### CSK Team Owner
```
Username: csk_owner
Password: password123
```

### MI Team Owner
```
Username: mi_owner
Password: password123
```

---

## 🔧 Creating New Accounts

### Via Database Script
```bash
cd backend
npm run assign-teams  # Creates all 10 viewer accounts
```

### Via API (Admin Only)
```bash
POST http://localhost:5000/api/auth/register
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "username": "new_team_owner",
  "password": "securepass123",
  "role": "viewer",
  "teamId": "team-uuid"
}
```

---

## 🛡️ Security Notes

### Production Checklist

- [ ] Change all default passwords
- [ ] Use strong passwords (min 12 chars, mixed case, numbers, symbols)
- [ ] Enable 2FA for admin accounts
- [ ] Rotate JWT secret regularly
- [ ] Implement password reset flow
- [ ] Add account lockout after failed attempts
- [ ] Enable audit logging for all account actions

### Password Requirements (Current)

- Minimum 6 characters (increase to 12 in production)
- No special requirements (add in production)
- Hashed with bcryptjs (10 salt rounds)
- Stored securely in database

---

## 📊 Account Statistics

| Role | Count | Purpose |
|------|-------|---------|
| Admin | 1 | System management |
| Presenter | 1 | Auction control |
| Viewer | 10 | Team owners (one per IPL team) |
| **Total** | **12** | All test accounts |

---

## 🔗 Related Documentation

- [Quick Start Guide](../setup/QUICK-START.md) - Getting started
- [RBAC Permissions](../features/RBAC.md) - Role permissions
- [Viewer Restrictions](../features/VIEWER-RESTRICTIONS.md) - Team filtering
- [Testing Guide](TESTING.md) - Testing instructions

---

## ⚠️ Important Reminders

1. **Default Passwords**: All accounts use simple passwords for testing. Change in production!
2. **Viewer Accounts**: Each viewer is linked to a specific team via `teamId`
3. **Admin Cannot Bid**: Admins have full access but cannot place bids (conflict of interest)
4. **Presenter Cannot Bid**: Presenters control the auction but cannot place bids
5. **Viewers See Only Their Team**: CSK viewers cannot see MI's data and vice versa

---

**Last Updated**: January 29, 2025  
**Default Password for Viewers**: `password123`  
**Status**: ✅ Ready for Testing
