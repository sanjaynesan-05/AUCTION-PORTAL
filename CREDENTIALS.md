# 🔐 IPL Auction Portal - Complete Credentials Guide

## System Overview
This document contains all credentials and configuration needed to run the IPL Auction Portal with full functionality.

---

## 📋 Frontend Credentials (React + TypeScript)

All credentials are stored in `src/data/mockUsers.ts` and use client-side authentication for this frontend-only version.

### 1️⃣ Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Admin
- **Access**: Full system control, player management, auction administration
- **Dashboard**: AdminPanel with player search, filtering, and export

### 2️⃣ Presenter Account
- **Username**: `presenter`
- **Password**: `presenter123`
- **Role**: Presenter
- **Access**: Live auction management and control
- **Dashboard**: PresenterPanel with real-time bidding controls

### 3️⃣ Team Viewer Accounts (10 IPL Teams)

#### CSK - Chennai Super Kings
- **Username**: `csk_viewer`
- **Password**: `csk@2024`
- **Team ID**: 1
- **Access**: View CSK team auction activity

#### MI - Mumbai Indians
- **Username**: `mi_viewer`
- **Password**: `mi@2024`
- **Team ID**: 2
- **Access**: View MI team auction activity

#### RCB - Royal Challengers Bangalore
- **Username**: `rcb_viewer`
- **Password**: `rcb@2024`
- **Team ID**: 3
- **Access**: View RCB team auction activity

#### KKR - Kolkata Knight Riders
- **Username**: `kkr_viewer`
- **Password**: `kkr@2024`
- **Team ID**: 4
- **Access**: View KKR team auction activity

#### DC - Delhi Capitals
- **Username**: `dc_viewer`
- **Password**: `dc@2024`
- **Team ID**: 5
- **Access**: View DC team auction activity

#### RR - Rajasthan Royals
- **Username**: `rr_viewer`
- **Password**: `rr@2024`
- **Team ID**: 6
- **Access**: View RR team auction activity

#### PBKS - Punjab Kings
- **Username**: `pbks_viewer`
- **Password**: `pbks@2024`
- **Team ID**: 7
- **Access**: View PBKS team auction activity

#### SRH - Sunrisers Hyderabad
- **Username**: `srh_viewer`
- **Password**: `srh@2024`
- **Team ID**: 8
- **Access**: View SRH team auction activity

#### GT - Gujarat Titans
- **Username**: `gt_viewer`
- **Password**: `gt@2024`
- **Team ID**: 9
- **Access**: View GT team auction activity

#### LSG - Lucknow Super Giants
- **Username**: `lsg_viewer`
- **Password**: `lsg@2024`
- **Team ID**: 10
- **Access**: View LSG team auction activity

---

## 🎯 Quick Login Reference Table

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Admin** | `admin` | `admin123` | Full Control |
| **Presenter** | `presenter` | `presenter123` | Auction Management |
| **CSK Viewer** | `csk_viewer` | `csk@2024` | Team Specific |
| **MI Viewer** | `mi_viewer` | `mi@2024` | Team Specific |
| **RCB Viewer** | `rcb_viewer` | `rcb@2024` | Team Specific |
| **KKR Viewer** | `kkr_viewer` | `kkr@2024` | Team Specific |
| **DC Viewer** | `dc_viewer` | `dc@2024` | Team Specific |
| **RR Viewer** | `rr_viewer` | `rr@2024` | Team Specific |
| **PBKS Viewer** | `pbks_viewer` | `pbks@2024` | Team Specific |
| **SRH Viewer** | `srh_viewer` | `srh@2024` | Team Specific |
| **GT Viewer** | `gt_viewer` | `gt@2024` | Team Specific |
| **LSG Viewer** | `lsg_viewer` | `lsg@2024` | Team Specific |

---

## 🚀 Getting Started

### Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Frontend will be available at:
```
http://localhost:5173
```

---

## ✨ Features Available with These Credentials

### Admin Features (admin / admin123)
- 👥 Player Management - Add, edit, delete players
- 🔍 Player Search & Filter - Advanced search capabilities
- 📊 Player Analytics - View player statistics
- 📥 Import/Export - Export player data
- 🎯 Auction Administration - Manage auction state
- 📋 Full System Control

### Presenter Features (presenter / presenter123)
- 🎤 Live Auction Control - Start, pause, resume auctions
- ➕ Player Navigation - Next/Previous player navigation
- 💰 Bid Management - Real-time bidding controls
- 📊 Auction Analytics - View bid history and statistics
- 🏆 Team Purse Tracking - Monitor team budgets
- ⚡ Real-time Updates - Instant synchronization across tabs

### Viewer Features (Team-Specific)
- 👀 Live Auction View - Watch auction in real-time
- 📊 Team Dashboard - View team-specific information
- 💰 Budget Tracking - See team purse and spending
- 📈 Bid History - View all bids on current player
- 🔄 Real-time Sync - Updates sync instantly across tabs
- 🎯 Team Analytics - View team performance metrics

---

## 🔧 Configuration

### Environment Variables
Currently using client-side mock authentication. No backend environment variables needed for this version.

### Supported Browsers
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

### System Requirements
- Node.js 18+
- npm or yarn
- Modern web browser

---

## 📡 Real-Time Features

All these credentials enable access to:
- ✅ Cross-tab synchronization
- ✅ Real-time auction updates
- ✅ Instant state persistence
- ✅ Live purse tracking
- ✅ Synchronized bid history

---

## 🛡️ Security Notes

- All passwords are hardcoded for development/demo purposes
- For production, implement proper backend authentication
- Use HTTPS in production
- Implement JWT tokens or OAuth2 for real deployment
- Store passwords securely in backend database

---

## 📞 Support

For issues or questions about these credentials, refer to:
- Frontend code: `src/data/mockUsers.ts`
- Login component: `src/pages/Login.tsx`
- Authentication context: `src/context/RoleContext.tsx`

---

**Last Updated**: January 7, 2026
**Status**: ✅ Ready for Development
**Version**: 1.0.0
