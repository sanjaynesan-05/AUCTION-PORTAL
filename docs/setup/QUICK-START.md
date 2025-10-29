# ⚡ Quick Start Guide

Get the IPL Auction Portal running in 5 minutes!

## 🎯 Prerequisites

- **Node.js** 16.0.0 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

## 📥 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/sanjaynesan-05/AUCTION-PORTAL.git
cd AUCTION-PORTAL
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run init-db
npm start
```

✅ Backend running at http://localhost:5000

### 3. Setup Frontend (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at http://localhost:5173

## 🔐 Login

Open http://localhost:5173 and login with:

### Admin Account
- Username: `admin`
- Password: `admin123`

### Presenter Account
- Username: `presenter`
- Password: `presenter123`

### Viewer Accounts (Team Owners)
- CSK Owner: `csk_owner` / `password123`
- MI Owner: `mi_owner` / `password123`
- RCB Owner: `rcb_owner` / `password123`

[See all test accounts](../guides/TEST-ACCOUNTS.md)

## 🧪 Verify Installation

### Test Backend API
```bash
curl http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test WebSocket
```bash
cd backend
node test-websocket.js
```

## 🎯 What's Next?

1. **Admin**: Manage players, teams, and users
2. **Presenter**: Start and control auctions
3. **Viewer**: View your team's squad and place bids

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Database Issues
```bash
cd backend
npm run init-db  # Reinitialize database
```

### Module Not Found
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learn More

- [Backend Setup Guide](BACKEND-SETUP.md) - Detailed backend configuration
- [Frontend Setup Guide](FRONTEND-SETUP.md) - Frontend configuration
- [Testing Guide](../guides/TESTING.md) - Testing instructions
- [API Reference](../api/REST-API.md) - Complete API documentation

---

Need help? Check the [main documentation](../MASTER-GUIDE.md) or open an issue on GitHub.
