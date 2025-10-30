# 🔧 Auction Analytics - Technical Implementation Guide

## 📊 **Database Schema Updates**

### **1. Auction Sessions Table**
```javascript
// backend/models/AuctionSession.model.js
const { DataTypes } = require('sequelize');

const AuctionSession = sequelize.define('AuctionSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('planned', 'active', 'completed', 'cancelled'),
    defaultValue: 'planned',
  },
  totalBudget: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  totalSpent: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
}, {
  timestamps: true,
});
```

### **2. Auction Events Table**
```javascript
// backend/models/AuctionEvent.model.js
const AuctionEvent = sequelize.define('AuctionEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  auctionSessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'auction_sessions',
      key: 'id',
    },
  },
  eventType: {
    type: DataTypes.ENUM('bid', 'sold', 'unsold', 'auction_start', 'auction_pause', 'auction_resume'),
    allowNull: false,
  },
  playerId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'players',
      key: 'id',
    },
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'teams',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  bidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  finalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: true,
});
```

---

## 🚀 **Backend API Implementation**

### **Analytics Controller**
```javascript
// backend/controllers/analytics.controller.js
const { AuctionSession, AuctionEvent, Player, Team, User } = require('../models');

class AnalyticsController {

  // Get auction overview metrics
  async getOverview(req, res) {
    try {
      const { sessionId } = req.query;

      const metrics = await this.calculateOverviewMetrics(sessionId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get player analytics
  async getPlayerAnalytics(req, res) {
    try {
      const { sessionId, role, nationality } = req.query;

      const analytics = await this.calculatePlayerAnalytics({ sessionId, role, nationality });
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get team analytics
  async getTeamAnalytics(req, res) {
    try {
      const { sessionId, teamId } = req.query;

      const analytics = await this.calculateTeamAnalytics(sessionId, teamId);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Calculate overview metrics
  async calculateOverviewMetrics(sessionId) {
    const whereClause = sessionId ? { auctionSessionId: sessionId } : {};

    const [totalRevenue, totalPlayersSold, avgPrice, eventCount] = await Promise.all([
      AuctionEvent.sum('finalPrice', { where: { ...whereClause, eventType: 'sold' } }),
      AuctionEvent.count({ where: { ...whereClause, eventType: 'sold' } }),
      AuctionEvent.findAll({
        where: { ...whereClause, eventType: 'sold' },
        attributes: [[sequelize.fn('AVG', sequelize.col('finalPrice')), 'avgPrice']],
        raw: true,
      }),
      AuctionEvent.count({ where: whereClause }),
    ]);

    return {
      totalRevenue: totalRevenue || 0,
      totalPlayersSold,
      averagePlayerPrice: avgPrice[0]?.avgPrice || 0,
      totalEvents: eventCount,
      biddingActivity: eventCount / 60, // bids per minute (assuming 1 hour auction)
    };
  }

  // Calculate player analytics
  async calculatePlayerAnalytics(filters) {
    const whereClause = {};
    if (filters.sessionId) whereClause.auctionSessionId = filters.sessionId;

    const soldPlayers = await AuctionEvent.findAll({
      where: { ...whereClause, eventType: 'sold' },
      include: [{
        model: Player,
        attributes: ['name', 'role', 'nationality', 'age'],
      }],
      order: [['finalPrice', 'DESC']],
    });

    // Group by role
    const priceByRole = {};
    soldPlayers.forEach(event => {
      const role = event.Player.role;
      if (!priceByRole[role]) priceByRole[role] = [];
      priceByRole[role].push(event.finalPrice);
    });

    // Calculate averages
    const avgPriceByRole = {};
    Object.keys(priceByRole).forEach(role => {
      const prices = priceByRole[role];
      avgPriceByRole[role] = prices.reduce((a, b) => a + b, 0) / prices.length;
    });

    return {
      priceByRole: avgPriceByRole,
      topExpensivePlayers: soldPlayers.slice(0, 10).map(event => ({
        name: event.Player.name,
        role: event.Player.role,
        price: event.finalPrice,
        team: event.teamId,
      })),
      totalSold: soldPlayers.length,
    };
  }

  // Calculate team analytics
  async calculateTeamAnalytics(sessionId, teamId) {
    const whereClause = { eventType: 'sold' };
    if (sessionId) whereClause.auctionSessionId = sessionId;
    if (teamId) whereClause.teamId = teamId;

    const teamPurchases = await AuctionEvent.findAll({
      where: whereClause,
      include: [{
        model: Player,
        attributes: ['role'],
      }],
    });

    const spendingByRole = {};
    let totalSpent = 0;

    teamPurchases.forEach(event => {
      const role = event.Player.role;
      spendingByRole[role] = (spendingByRole[role] || 0) + event.finalPrice;
      totalSpent += event.finalPrice;
    });

    return {
      totalSpent,
      playersAcquired: teamPurchases.length,
      spendingByRole,
      averagePrice: totalSpent / teamPurchases.length,
    };
  }
}

module.exports = new AnalyticsController();
```

### **Analytics Routes**
```javascript
// backend/routes/analytics.routes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All analytics routes require authentication
router.use(authenticateToken);

// Overview metrics
router.get('/overview', analyticsController.getOverview);

// Player analytics
router.get('/players', analyticsController.getPlayerAnalytics);

// Team analytics
router.get('/teams', analyticsController.getTeamAnalytics);

// Auction sessions
router.get('/sessions', analyticsController.getAuctionSessions);

module.exports = router;
```

---

## 🎨 **Frontend Analytics Components**

### **Analytics Dashboard**
```typescript
// frontend/src/pages/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import RevenueChart from '../components/analytics/RevenueChart';
import PlayerPriceChart from '../components/analytics/PlayerPriceChart';
import TeamComparisonChart from '../components/analytics/TeamComparisonChart';
import RealTimeMetrics from '../components/analytics/RealTimeMetrics';

const AnalyticsDashboard: React.FC = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const [overview, players, teams] = await Promise.all([
        apiService.get('/analytics/overview'),
        apiService.get('/analytics/players'),
        apiService.get('/analytics/teams'),
      ]);

      setOverviewData(overview.data);
      setPlayerData(players.data);
      setTeamData(teams.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="analytics-dashboard p-6">
      <h1 className="text-3xl font-bold mb-6">Auction Analytics</h1>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Revenue"
          value={`₹${overviewData.totalRevenue.toLocaleString()}`}
          icon="💰"
        />
        <MetricCard
          title="Players Sold"
          value={overviewData.totalPlayersSold}
          icon="🏏"
        />
        <MetricCard
          title="Avg Player Price"
          value={`₹${overviewData.averagePlayerPrice.toLocaleString()}`}
          icon="📊"
        />
        <MetricCard
          title="Bidding Activity"
          value={`${overviewData.biddingActivity.toFixed(1)} bids/min`}
          icon="⚡"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueChart data={overviewData.revenueTrend} />
        <PlayerPriceChart data={playerData.priceByRole} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamComparisonChart data={teamData.spendingComparison} />
        <RealTimeMetrics data={overviewData.realTime} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
```

### **Chart Components**
```typescript
// frontend/src/components/analytics/RevenueChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';

interface RevenueChartProps {
  data: Array<{ time: string; revenue: number }>;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.time),
    datasets: [{
      label: 'Auction Revenue',
      data: data.map(d => d.revenue),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Auction Revenue Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `₹${value.toLocaleString()}`,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default RevenueChart;
```

---

## 📄 **Reporting System**

### **Report Generator**
```typescript
// frontend/src/services/report.service.ts
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export class ReportService {

  async generatePDFReport(data: any, reportType: string): Promise<Blob> {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text(`${reportType} Report`, 20, 30);

    // Add date
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 50);

    // Add metrics
    let yPosition = 70;
    Object.entries(data).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 20, yPosition);
      yPosition += 20;
    });

    return doc.output('blob');
  }

  async generateExcelReport(data: any, reportType: string): Promise<Blob> {
    const workbook = XLSX.utils.book_new();

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet([data]);

    XLSX.utils.book_append_sheet(workbook, worksheet, reportType);

    return XLSX.write(workbook, { type: 'blob', bookType: 'xlsx' });
  }

  async downloadReport(data: any, reportType: string, format: 'pdf' | 'excel'): Promise<void> {
    let blob: Blob;
    let filename: string;

    if (format === 'pdf') {
      blob = await this.generatePDFReport(data, reportType);
      filename = `${reportType.toLowerCase()}-report.pdf`;
    } else {
      blob = await this.generateExcelReport(data, reportType);
      filename = `${reportType.toLowerCase()}-report.xlsx`;
    }

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const reportService = new ReportService();
```

---

## 🔄 **Real-time Analytics Integration**

### **WebSocket Analytics Events**
```typescript
// frontend/src/store/useAnalyticsStore.ts
import { create } from 'zustand';
import { wsService } from '../services/websocket.service';

interface AnalyticsState {
  realTimeMetrics: {
    currentRevenue: number;
    activeBidders: number;
    playersRemaining: number;
    averageBidTime: number;
  };
  updateMetrics: (metrics: Partial<AnalyticsState['realTimeMetrics']>) => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  realTimeMetrics: {
    currentRevenue: 0,
    activeBidders: 0,
    playersRemaining: 193,
    averageBidTime: 0,
  },

  updateMetrics: (metrics) => set((state) => ({
    realTimeMetrics: { ...state.realTimeMetrics, ...metrics },
  })),

  connectWebSocket: () => {
    wsService.connect();

    // Listen for analytics updates
    wsService.on('analytics-update', (data) => {
      get().updateMetrics(data);
    });

    wsService.on('player-sold', (data) => {
      get().updateMetrics({
        currentRevenue: get().realTimeMetrics.currentRevenue + data.finalPrice,
        playersRemaining: get().realTimeMetrics.playersRemaining - 1,
      });
    });
  },

  disconnectWebSocket: () => {
    wsService.disconnect();
  },
}));
```

---

## 📊 **Implementation Priority**

### **Phase 1: Core Analytics (Week 1-2)**
1. Database schema updates
2. Basic analytics APIs
3. Simple dashboard with key metrics
4. Chart.js integration

### **Phase 2: Advanced Analytics (Week 3-4)**
1. Player and team analytics
2. Real-time metrics
3. WebSocket integration
4. Enhanced visualizations

### **Phase 3: Reporting (Week 5-6)**
1. PDF/Excel export
2. Custom report generation
3. Historical data analysis
4. Dashboard customization

This technical plan provides a solid foundation for implementing comprehensive auction analytics with real-time updates, beautiful visualizations, and professional reporting capabilities.