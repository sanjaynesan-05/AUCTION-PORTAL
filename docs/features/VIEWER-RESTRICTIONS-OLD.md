# 🔐 Viewer Team Restriction Feature

## Overview

Viewers (team owners) can now **only see their own team's data**:
- ✅ View only players they bought
- ✅ See only their team's squad
- ✅ View their team statistics
- ✅ Cannot see other teams' data

---

## 🗄️ Database Changes

### User Model - Added `teamId` Field

```javascript
// backend/models/User.model.js

teamId: {
  type: DataTypes.UUID,
  allowNull: true,
  defaultValue: null,
  references: {
    model: 'teams',
    key: 'id',
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
}
```

**Purpose:** Links each viewer account to a specific team.

---

## 🛠️ Migration Steps

### Step 1: Update Database Schema

Run this SQL command to add the `teamId` column to existing users table:

```sql
-- For SQLite
ALTER TABLE users ADD COLUMN teamId TEXT;

-- For PostgreSQL
ALTER TABLE users ADD COLUMN "teamId" UUID;
ALTER TABLE users ADD CONSTRAINT fk_user_team 
  FOREIGN KEY ("teamId") REFERENCES teams(id) 
  ON DELETE SET NULL ON UPDATE CASCADE;
```

**Or use Sequelize migration:**

```javascript
// Run this in node console or create a migration file
const { sequelize } = require('./backend/database');

await sequelize.queryInterface.addColumn('users', 'teamId', {
  type: Sequelize.UUID,
  allowNull: true,
  references: {
    model: 'teams',
    key: 'id',
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
});
```

### Step 2: Assign Teams to Viewers

**Option A: Via Database**
```sql
-- Get team IDs first
SELECT id, name, shortName FROM teams;

-- Assign viewers to teams
UPDATE users 
SET teamId = 'csk-team-uuid' 
WHERE username = 'csk_owner' AND role = 'viewer';

UPDATE users 
SET teamId = 'mi-team-uuid' 
WHERE username = 'mi_owner' AND role = 'viewer';
```

**Option B: Create API endpoint (Recommended)**
```javascript
// Admin can assign teams to viewers via API
// PUT /api/users/:id/assign-team
// Body: { teamId: "uuid" }
```

### Step 3: Create Viewer Accounts for Each Team

```javascript
// Example: Creating viewers for all teams

// 1. Get all teams
const teams = await Team.findAll();

// 2. Create a viewer for each team
for (const team of teams) {
  await User.create({
    username: `${team.shortName.toLowerCase()}_owner`,
    password: 'password123', // Change this!
    role: 'viewer',
    teamId: team.id
  });
}

// Result:
// csk_owner -> Chennai Super Kings
// mi_owner -> Mumbai Indians
// rcb_owner -> Royal Challengers Bangalore
// etc.
```

---

## 📡 API Changes

### 1. **GET /api/players** (Modified)

**Admin/Presenter:** See all players
**Viewer:** See only their team's SOLD players

```javascript
// Request from viewer (CSK owner)
GET /api/players
Authorization: Bearer <viewer-jwt-token>

// Response
{
  "success": true,
  "count": 15,
  "teamRestricted": true,  // Indicates filtered by team
  "data": [
    {
      "id": "uuid-1",
      "name": "MS Dhoni",
      "role": "Wicketkeeper",
      "basePrice": "20000000",
      "sold": true,
      "teamId": "csk-uuid",
      "price": "12000000",  // What they paid
      "team": {
        "id": "csk-uuid",
        "name": "Chennai Super Kings",
        "shortName": "CSK",
        "color": "#FDB913"
      }
    },
    // ... only CSK players
  ]
}
```

---

### 2. **GET /api/teams** (Modified)

**Admin/Presenter:** See all teams
**Viewer:** See only their own team

```javascript
// Request from viewer (CSK owner)
GET /api/teams
Authorization: Bearer <viewer-jwt-token>

// Response
{
  "success": true,
  "count": 1,
  "teamRestricted": true,  // Filtered
  "data": [
    {
      "id": "csk-uuid",
      "name": "Chennai Super Kings",
      "shortName": "CSK",
      "purse": "5500000000",
      "color": "#FDB913",
      "logo": "...",
      "players": [
        // Only CSK players
      ]
    }
  ]
}
```

---

### 3. **GET /api/teams/my-team** (NEW!)

Special endpoint for viewers to get detailed team statistics.

```javascript
// Request from viewer
GET /api/teams/my-team
Authorization: Bearer <viewer-jwt-token>

// Response
{
  "success": true,
  "data": {
    "id": "csk-uuid",
    "name": "Chennai Super Kings",
    "shortName": "CSK",
    "purse": "5500000000",
    "color": "#FDB913",
    "logo": "...",
    "players": [
      {
        "id": "uuid-1",
        "name": "MS Dhoni",
        "role": "Wicketkeeper",
        "price": "12000000",
        "basePrice": "20000000",
        "nationality": "India",
        "age": 42
      },
      {
        "id": "uuid-2",
        "name": "Ravindra Jadeja",
        "role": "All-rounder",
        "price": "16000000",
        "basePrice": "11000000",
        "nationality": "India",
        "age": 34
      }
      // ... all CSK players
    ],
    "statistics": {
      "remainingPurse": 5500000000,     // ₹55 Cr left
      "totalSpent": 6500000000,         // ₹65 Cr spent
      "initialPurse": 12000000000,      // ₹120 Cr initial
      "playersCount": 15,               // 15 players bought
      "averagePrice": 433333333.33,     // Avg ₹4.33 Cr per player
      "purseUsedPercentage": "54.17"    // 54.17% budget used
    }
  }
}
```

---

## 🎨 Frontend Implementation

### 1. **Viewer Dashboard Component**

```javascript
// ViewerDashboard.jsx

import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';

function ViewerDashboard() {
  const { user } = useAuth();
  const [myTeam, setMyTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTeam();
  }, []);

  const fetchMyTeam = async () => {
    try {
      const response = await fetch('/api/teams/my-team', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMyTeam(data.data);
    } catch (error) {
      console.error('Failed to fetch team:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!myTeam) {
    return (
      <div className="alert alert-warning">
        You are not assigned to any team. Please contact the administrator.
      </div>
    );
  }

  return (
    <div className="viewer-dashboard">
      <h1>My Team: {myTeam.name}</h1>
      
      {/* Team Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Remaining Purse</h3>
          <p className="stat-value">
            ₹{(myTeam.statistics.remainingPurse / 10000000).toFixed(2)} Cr
          </p>
        </div>
        
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p className="stat-value">
            ₹{(myTeam.statistics.totalSpent / 10000000).toFixed(2)} Cr
          </p>
        </div>
        
        <div className="stat-card">
          <h3>Players Bought</h3>
          <p className="stat-value">{myTeam.statistics.playersCount}</p>
        </div>
        
        <div className="stat-card">
          <h3>Budget Used</h3>
          <p className="stat-value">{myTeam.statistics.purseUsedPercentage}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="budget-progress">
        <div 
          className="progress-bar" 
          style={{ 
            width: `${myTeam.statistics.purseUsedPercentage}%`,
            backgroundColor: myTeam.color 
          }}
        ></div>
      </div>

      {/* Squad List */}
      <div className="squad-section">
        <h2>My Squad ({myTeam.statistics.playersCount})</h2>
        
        <table className="squad-table">
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Role</th>
              <th>Base Price</th>
              <th>Bought For</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            {myTeam.players.map(player => (
              <tr key={player.id}>
                <td>
                  <strong>{player.name}</strong>
                  <br />
                  <small>{player.nationality}, {player.age} yrs</small>
                </td>
                <td>{player.role}</td>
                <td>₹{(player.basePrice / 10000000).toFixed(2)} Cr</td>
                <td>
                  <strong style={{ color: myTeam.color }}>
                    ₹{(player.price / 10000000).toFixed(2)} Cr
                  </strong>
                </td>
                <td>
                  <span className={player.price > player.basePrice ? 'text-red' : 'text-green'}>
                    {player.price > player.basePrice ? '+' : ''}
                    ₹{((player.price - player.basePrice) / 10000000).toFixed(2)} Cr
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewerDashboard;
```

---

### 2. **Role-Based Routing**

```javascript
// AppRoutes.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AdminPanel from './pages/AdminPanel';
import PresenterPanel from './pages/PresenterPanel';
import ViewerDashboard from './pages/ViewerDashboard';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Routes>
      {/* Admin Routes */}
      {user.role === 'admin' && (
        <Route path="/admin" element={<AdminPanel />} />
      )}

      {/* Presenter Routes */}
      {user.role === 'presenter' && (
        <Route path="/presenter" element={<PresenterPanel />} />
      )}

      {/* Viewer Routes - Only see their team */}
      {user.role === 'viewer' && (
        <Route path="/my-team" element={<ViewerDashboard />} />
      )}

      {/* Default redirect based on role */}
      <Route 
        path="/" 
        element={
          user.role === 'admin' ? <Navigate to="/admin" /> :
          user.role === 'presenter' ? <Navigate to="/presenter" /> :
          <Navigate to="/my-team" />
        } 
      />
    </Routes>
  );
}
```

---

### 3. **WebSocket Bid Placement (Viewer)**

```javascript
// BidButton.jsx - Viewer places bid for their team

import socket from './services/socket';
import { useAuth } from './context/AuthContext';

function BidButton({ bidAmount }) {
  const { user } = useAuth();

  const handlePlaceBid = () => {
    if (user.role !== 'viewer' || !user.teamId) {
      alert('Only team owners can place bids!');
      return;
    }

    // Place bid for viewer's team
    socket.emit('place-bid', {
      teamId: user.teamId,  // Auto-use viewer's team
      bidAmount: bidAmount
    });
  };

  return (
    <button 
      onClick={handlePlaceBid}
      className="bid-button"
      disabled={user.role !== 'viewer'}
    >
      💰 Bid ₹{(bidAmount / 10000000).toFixed(2)} Cr
    </button>
  );
}
```

---

## 🔒 Security Features

### 1. **Automatic Team Filtering**
```javascript
// Viewers CANNOT bypass team restriction
// Even if they try to fetch other teams' data

GET /api/players?teamId=other-team-uuid
// ❌ Ignored! Still returns only their team's players

GET /api/teams/other-team-uuid
// ❌ 403 Forbidden (unless admin/presenter)
```

### 2. **JWT Token Enhancement**
```javascript
// Token now includes teamId
{
  "id": "user-uuid",
  "username": "csk_owner",
  "role": "viewer",
  "teamId": "csk-uuid"  // ✨ New field
}
```

### 3. **Middleware Protection**
```javascript
// All viewer requests automatically filtered
if (req.user.role === 'viewer') {
  where.teamId = req.user.teamId;  // Force team filter
  where.sold = true;                // Only sold players
}
```

---

## 📋 Testing

### Test Viewer Restrictions

```bash
# 1. Create a viewer for CSK
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "csk_owner",
    "password": "password123",
    "role": "viewer"
  }'

# 2. Assign team to viewer (via database or admin API)
# UPDATE users SET teamId = 'csk-uuid' WHERE username = 'csk_owner';

# 3. Login as viewer
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "csk_owner",
    "password": "password123"
  }'

# 4. Get viewer's team data
curl http://localhost:5000/api/teams/my-team \
  -H "Authorization: Bearer <viewer-token>"

# 5. Get players (will only show CSK players)
curl http://localhost:5000/api/players \
  -H "Authorization: Bearer <viewer-token>"

# ✅ Should only return CSK data!
```

---

## 🚀 Deployment Checklist

- [ ] Run database migration to add `teamId` column
- [ ] Create viewer accounts for each team
- [ ] Assign `teamId` to each viewer
- [ ] Update JWT token generation to include `teamId`
- [ ] Test API restrictions with viewer tokens
- [ ] Update frontend to show role-based dashboards
- [ ] Test WebSocket bid placement for viewers
- [ ] Update documentation

---

## 📊 Summary

### What Changed:

| Feature | Admin/Presenter | Viewer |
|---------|-----------------|--------|
| **View Players** | All players | Only their team's sold players |
| **View Teams** | All teams | Only their own team |
| **Team Statistics** | All teams' stats | Only their team's stats |
| **Place Bids** | ❌ Cannot | ✅ Can (for their team only) |
| **Control Auction** | ✅ Can | ❌ Cannot |

### Benefits:

1. **🔒 Data Privacy** - Viewers can't spy on other teams
2. **🎯 Focused View** - Only see relevant data (their team)
3. **⚡ Better Performance** - Smaller data payloads
4. **👥 Multi-Team Support** - Multiple viewers can work simultaneously
5. **🏆 Fair Competition** - No information advantage

---

**Your auction system now supports team-restricted viewer access!** 🎉

Each team owner (viewer) can only see and manage their own team's data, making the auction fair and secure.

---

*Last Updated: October 30, 2025*
