# 🏏 IPL Auction Portal - Master Guide

**Complete Documentation for Project Setup, Architecture, and Deployment**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Project Structure](#project-structure)
5. [Technology Stack](#technology-stack)
6. [Development Workflow](#development-workflow)
7. [Deployment Guide](#deployment-guide)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [Additional Resources](#additional-resources)

---

## 📖 Project Overview

### What is IPL Auction Portal?

The IPL Auction Portal is a **comprehensive real-time auction management system** designed for IPL cricket player auctions. It provides a professional platform for managing live auctions with role-based access control, real-time synchronization, and stunning modern UI.

### Key Features

#### 🔐 Authentication & Authorization
- **Role-Based Access Control**: Admin, Presenter, and Viewer roles
- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: bcrypt password hashing
- **Protected Routes**: Role-specific access to features

#### 🏆 Auction Management
- **Live Player Auctions**: Real-time bidding interface
- **Team Management**: Manage all 10 IPL teams with authentic branding
- **Player Database**: Comprehensive player profiles with statistics
- **Purse Tracking**: Dynamic budget management with visual indicators
- **Auction Controls**: Start, pause, resume, navigate, and manage sales

#### 📡 Real-Time Features
- **Socket.io Integration**: Bidirectional real-time communication
- **Live Updates**: Instant synchronization across all connected clients
- **Multi-User Support**: Simultaneous presenter and viewer experiences
- **Cross-Tab Sync**: Updates sync across browser tabs

#### 📊 Team Features
- **Complete IPL Roster**: All 10 current IPL teams
- **Official Branding**: Authentic team logos, colors, and styling
- **Team Analytics**: Purse status with progress bars and statistics
- **Player Tracking**: Individual team rosters with spending analysis

### Who is it for?

- **Auction Organizers**: Manage and control live auctions
- **Team Representatives**: View and track auction progress
- **Viewers**: Watch live auction proceedings
- **Developers**: Learn full-stack development with modern technologies

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Admin Panel  │  │ Presenter    │  │ Viewer       │      │
│  │              │  │ Panel        │  │ Screen       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  React Components + TypeScript + Tailwind CSS               │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      APPLICATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Express.js REST API + Socket.io Server                     │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Routes  │  │ Player       │  │ Team         │      │
│  │              │  │ Routes       │  │ Routes       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌────────────────────────────────────────────────┐         │
│  │         JWT Authentication Middleware           │         │
│  └────────────────────────────────────────────────┘         │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ SQL Queries
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                        DATA LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  PostgreSQL Database (via Sequelize ORM)                    │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Users Table  │  │ Players      │  │ Teams        │      │
│  │              │  │ Table        │  │ Table        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → React Component → API Call → Express Route → 
Sequelize Model → PostgreSQL → Response → Update UI
                    │
                    └──→ Socket.io Event → Broadcast → All Clients
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'presenter', 'viewer') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Teams Table
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  short_name VARCHAR(10) UNIQUE NOT NULL,
  purse DECIMAL(10,2) DEFAULT 12000.00,
  color VARCHAR(7) NOT NULL,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Players Table
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  sold BOOLEAN DEFAULT FALSE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  price DECIMAL(10,2),
  nationality VARCHAR(100) DEFAULT 'India',
  age INTEGER,
  stats JSONB,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Installation Steps

#### Method 1: Automated Setup (Recommended)

```powershell
# 1. Clone the repository
git clone https://github.com/sanjaynesan-05/AUCTION-PORTAL.git
cd AUCTION-PORTAL

# 2. Install all dependencies (frontend + backend)
.\scripts\install-all.ps1

# 3. Setup PostgreSQL database
.\scripts\setup-postgresql.ps1

# 4. Initialize database with seed data
cd backend
npm run init-db
cd ..

# 5. Start both servers
.\scripts\start-all.ps1
```

#### Method 2: Manual Setup

**Backend Setup:**
```powershell
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
New-Item .env -ItemType File

# 4. Add environment variables to .env:
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/auction_portal
# JWT_SECRET=your_super_secret_jwt_key_change_this
# PORT=5000
# NODE_ENV=development

# 5. Initialize database
npm run init-db

# 6. Start backend server
npm run dev
```

**Frontend Setup:**
```powershell
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Method 3: Docker Setup

```powershell
# Start PostgreSQL in Docker
docker run --name auction-postgres `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=auction_portal `
  -p 5432:5432 -d postgres:15

# Then follow Manual Setup steps for backend and frontend
```

### Access the Application

After setup, access:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

### Default Credentials

```
Username: admin
Password: admin123
Role: Admin (full access)
```

---

## 📁 Project Structure

### Overview

```
AUCTION-PORTAL/
│
├── frontend/              # React + TypeScript frontend
├── backend/               # Node.js + Express backend
├── docs/                  # Documentation
├── scripts/               # Utility scripts
├── .gitignore            # Git ignore rules
└── README.md             # Project overview
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Common components
│   │   │   └── RoleGuard.tsx
│   │   ├── TVBroadcastPlayer.tsx
│   │   ├── Loading.tsx
│   │   ├── LiveUpdatesFooter.tsx
│   │   ├── FloatingTeamPurse.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── pages/            # Page components
│   │   ├── AdminPanel.tsx
│   │   ├── PresenterPanel.tsx
│   │   ├── ViewerScreen.tsx
│   │   ├── Login.tsx
│   │   └── Unauthorized.tsx
│   │
│   ├── context/          # React Context
│   │   └── RoleContext.tsx
│   │
│   ├── store/            # State management
│   │   └── useAuctionStore.ts
│   │
│   ├── routes/           # Routing
│   │   └── AppRoutes.tsx
│   │
│   ├── hooks/            # Custom hooks
│   │   └── useAuctionSync.ts
│   │
│   ├── utils/            # Utilities
│   │   └── auctionSync.ts
│   │
│   ├── data/             # Mock data
│   │   ├── mockPlayers.ts
│   │   ├── mockTeams.ts
│   │   └── mockUsers.ts
│   │
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
│
├── public/               # Static assets
│   ├── manifest.json
│   └── sw.js
│
├── index.html            # HTML entry
├── vite.config.ts        # Vite config
├── tailwind.config.js    # Tailwind CSS
├── tsconfig.json         # TypeScript
└── package.json          # Dependencies
```

### Backend Structure

```
backend/
├── models/               # Database models
│   ├── User.model.js    # User model
│   ├── Player.model.js  # Player model
│   ├── Team.model.js    # Team model
│   └── index.js         # Model associations
│
├── routes/              # API routes
│   ├── auth.routes.js   # Authentication
│   ├── players.routes.js # Players CRUD
│   └── teams.routes.js  # Teams CRUD
│
├── middleware/          # Express middleware
│   └── authMiddleware.js # JWT auth
│
├── docs/                # Backend docs
│   └── BACKEND.md       # API reference
│
├── database.js          # PostgreSQL connection
├── server.postgres.js   # Main server
├── init-database.js     # DB initialization
├── .env                 # Environment variables
└── package.json         # Dependencies
```

---

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.5.3 | Type safety |
| **Vite** | 7.1.9 | Build tool & dev server |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS |
| **Zustand** | 5.0.8 | State management |
| **React Router** | 7.9.4 | Client-side routing |
| **Framer Motion** | 12.23.24 | Animations |
| **Lucide React** | 0.344.0 | Icon library |
| **Socket.io Client** | Latest | Real-time communication |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 16+ | JavaScript runtime |
| **Express.js** | 4.18.2 | Web framework |
| **PostgreSQL** | 15+ | Relational database |
| **Sequelize** | 6.35.2 | ORM for PostgreSQL |
| **Socket.io** | 4.6.0 | Real-time server |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **CORS** | 2.8.5 | Cross-origin requests |
| **dotenv** | 16.3.1 | Environment variables |

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **Nodemon** - Auto-restart server

---

## 💻 Development Workflow

### Starting Development

#### Option 1: Start Everything
```powershell
.\scripts\start-all.ps1
```

#### Option 2: Start Individually
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Available Scripts

#### Frontend Scripts
```powershell
cd frontend

npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint code
npm run typecheck  # Check TypeScript types
```

#### Backend Scripts
```powershell
cd backend

npm start          # Start production server
npm run dev        # Start with auto-reload
npm run init-db    # Initialize/reset database
```

### Development Best Practices

#### 1. Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Follow naming conventions
- Write reusable utility functions

#### 2. State Management
- Use Zustand for global state
- Use React Context for theme/auth
- Keep state close to where it's used
- Avoid prop drilling

#### 3. API Development
- Follow REST conventions
- Use proper HTTP status codes
- Validate all inputs
- Handle errors gracefully

#### 4. Database Operations
- Use Sequelize models
- Write migrations for schema changes
- Use transactions for critical operations
- Index frequently queried columns

#### 5. Real-Time Features
- Use Socket.io for live updates
- Handle connection errors
- Implement reconnection logic
- Optimize event frequency

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

---

## 🚢 Deployment Guide

### Frontend Deployment

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

#### Option 2: Netlify
```bash
# Build
cd frontend
npm run build

# Deploy dist/ folder to Netlify
```

#### Option 3: Static Hosting
```bash
# Build
cd frontend
npm run build

# Upload dist/ folder to any static host
```

### Backend Deployment

#### Option 1: Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create auction-portal-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### Option 2: Railway
```bash
# Connect GitHub repo to Railway
# Railway auto-deploys on push
# Add PostgreSQL plugin
# Set environment variables in Railway dashboard
```

#### Option 3: AWS/Azure/GCP
- Use EC2/App Service/Compute Engine
- Install Node.js and PostgreSQL
- Clone repository
- Install dependencies
- Start with PM2 for process management

### Environment Variables

#### Production Frontend (.env.production)
```env
VITE_API_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-api-domain.com
```

#### Production Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your_production_secret_key
PORT=5000
NODE_ENV=production
```

### Database Migration

```bash
# Backup production database
pg_dump -U postgres -d auction_portal > backup.sql

# Restore on new server
psql -U postgres -d auction_portal < backup.sql
```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# Start service
Start-Service postgresql-x64-15

# Or check Docker container
docker ps -a
docker start auction-postgres
```

#### Issue 2: Port Already in Use
```
Error: Port 5000 is already in use
```

**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or use different port in .env
```

#### Issue 3: Module Not Found
```
Error: Cannot find module 'express'
```

**Solution:**
```powershell
# Reinstall dependencies
cd backend
Remove-Item node_modules -Recurse -Force
npm install
```

#### Issue 4: JWT Authentication Failed
```
Error: Invalid token
```

**Solution:**
- Check JWT_SECRET matches in .env
- Token may have expired (login again)
- Check Authorization header format

#### Issue 5: Database Initialization Failed
```
Error: relation "users" does not exist
```

**Solution:**
```powershell
cd backend
npm run init-db
```

### Performance Issues

#### Slow API Responses
- Add database indexes
- Use connection pooling
- Implement caching
- Optimize queries

#### Slow Frontend Loading
- Code splitting
- Lazy loading components
- Optimize images
- Use production build

---

## ✅ Best Practices

### Security
- ✅ Use environment variables for secrets
- ✅ Validate all user inputs
- ✅ Use parameterized queries
- ✅ Implement rate limiting
- ✅ Use HTTPS in production
- ✅ Keep dependencies updated

### Code Quality
- ✅ Write clean, readable code
- ✅ Use meaningful variable names
- ✅ Add comments for complex logic
- ✅ Follow consistent formatting
- ✅ Remove console.logs in production
- ✅ Handle errors properly

### Testing
- ✅ Write unit tests
- ✅ Test API endpoints
- ✅ Test edge cases
- ✅ Test error handling
- ✅ Use TypeScript for type checking

### Documentation
- ✅ Document API endpoints
- ✅ Add code comments
- ✅ Keep README updated
- ✅ Document setup process
- ✅ Document deployment steps

---

## 📚 Additional Resources

### Documentation
- [Frontend Setup Guide](./FRONTEND-SETUP.md)
- [Backend Setup Guide](./BACKEND-SETUP.md)
- [Backend API Reference](../backend/docs/BACKEND.md)

### External Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Sequelize Documentation](https://sequelize.org/)
- [Socket.io Documentation](https://socket.io/docs/)

### Tutorials
- [React Tutorial](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review [Frontend Setup Guide](./FRONTEND-SETUP.md)
3. Review [Backend Setup Guide](./BACKEND-SETUP.md)
4. Check [Troubleshooting](#troubleshooting) section
5. Open an issue on GitHub

---

**Happy Coding! 🎉**

Last Updated: October 29, 2025
