# 🚀 Quick Start: Auction Analytics - Phase 1

## 🎯 **Goal**: Implement basic auction analytics dashboard in 2 days

---

## 📋 **Day 1: Database & Backend Setup**

### **Step 1: Create Auction Events Table**
```bash
# Create migration for auction events
cd backend
node -e "
const { sequelize } = require('./database');
const { DataTypes } = require('sequelize');

const AuctionEvent = sequelize.define('AuctionEvent', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  eventType: { type: DataTypes.ENUM('bid', 'sold', 'unsold'), allowNull: false },
  playerId: { type: DataTypes.UUID, allowNull: true },
  teamId: { type: DataTypes.UUID, allowNull: true },
  userId: { type: DataTypes.UUID, allowNull: true },
  bidAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  finalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

AuctionEvent.sync({ alter: true }).then(() => {
  console.log('✅ AuctionEvent table created');
  process.exit(0);
});
"
```

### **Step 2: Create Analytics Controller**
```javascript
// backend/controllers/analytics.controller.js
const { AuctionEvent, Player, Team } = require('../models');

class AnalyticsController {
  async getOverview(req, res) {
    try {
      const [totalRevenue, totalPlayersSold] = await Promise.all([
        AuctionEvent.sum('finalPrice', { where: { eventType: 'sold' } }),
        AuctionEvent.count({ where: { eventType: 'sold' } }),
      ]);

      res.json({
        totalRevenue: totalRevenue || 0,
        totalPlayersSold,
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AnalyticsController();
```

### **Step 3: Add Analytics Routes**
```javascript
// backend/routes/analytics.routes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);
router.get('/overview', analyticsController.getOverview);

module.exports = router;
```

### **Step 4: Register Routes in Server**
```javascript
// Add to backend/server.js
const analyticsRoutes = require('./routes/analytics.routes');

// Add this line with other routes
app.use('/api/analytics', analyticsRoutes);
```

---

## 🎨 **Day 2: Frontend Analytics Dashboard**

### **Step 1: Install Chart Library**
```bash
cd frontend
npm install chart.js react-chartjs-2
```

### **Step 2: Create Analytics Page**
```typescript
// frontend/src/pages/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalPlayersSold: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await apiService.get('/analytics/overview');
      setData(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading analytics...</div>;

  return (
    <div className="analytics-dashboard p-6">
      <h1 className="text-3xl font-bold mb-6">Auction Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            ₹{data.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Players Sold</h3>
          <p className="text-3xl font-bold text-blue-600">
            {data.totalPlayersSold}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
```

### **Step 3: Add Route to App**
```typescript
// frontend/src/routes/AppRoutes.tsx
import AnalyticsDashboard from '../pages/AnalyticsDashboard';

// Add to routes array
{
  path: '/analytics',
  element: <AnalyticsDashboard />,
  roles: ['admin', 'presenter'],
},
```

### **Step 4: Add Navigation Link**
```typescript
// Add to AdminPanel or navigation component
<Link to="/analytics" className="nav-link">
  📊 Analytics
</Link>
```

---

## 🧪 **Testing the Analytics**

### **Step 1: Start Servers**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### **Step 2: Test Analytics Page**
1. Login as admin
2. Navigate to `/analytics`
3. Verify metrics display correctly

### **Step 3: Add Sample Auction Data**
```bash
# Create sample auction events
cd backend
node -e "
const { AuctionEvent, Player, Team } = require('./models');

(async () => {
  // Get some players and teams
  const players = await Player.findAll({ limit: 5 });
  const teams = await Team.findAll({ limit: 2 });

  // Create sample sold events
  for (let i = 0; i < 3; i++) {
    await AuctionEvent.create({
      eventType: 'sold',
      playerId: players[i].id,
      teamId: teams[0].id,
      finalPrice: (i + 1) * 1000000, // 1, 2, 3 crore
    });
  }

  console.log('✅ Sample auction data created');
  process.exit(0);
})();
"
```

---

## 🎉 **Success Criteria**

✅ **Backend**: Analytics API returns revenue and player count  
✅ **Frontend**: Analytics dashboard displays metrics  
✅ **Data**: Sample auction events created and reflected in analytics  
✅ **Navigation**: Analytics page accessible from admin panel  

---

## 🚀 **Next Steps**

After completing Phase 1, you can extend with:
- **Charts**: Add revenue trend charts
- **Filters**: Date range and team filters  
- **Real-time**: Live auction metrics updates
- **Reports**: PDF/Excel export functionality

This quick start gets you a working analytics foundation in just 2 days! 🎯