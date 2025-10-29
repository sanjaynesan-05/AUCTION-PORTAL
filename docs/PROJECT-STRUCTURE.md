# 📁 Project Structure - IPL Auction Portal

## Overview
This document provides a detailed overview of the project's file structure and organization.

## Root Directory Structure

```
AUCTION-PORTAL/
│
├── frontend/              # React + TypeScript frontend application
├── backend/               # Node.js + Express + PostgreSQL backend
├── docs/                  # Project documentation
├── scripts/               # Utility scripts for setup and running
├── server/                # [DEPRECATED] Old MongoDB backend (kept for reference)
│
├── .gitignore            # Git ignore rules
├── README.md             # Main project documentation
└── .git/                 # Git repository
```

## Frontend Structure (`/frontend`)

```
frontend/
│
├── src/                           # Source code
│   ├── components/               # Reusable React components
│   │   ├── common/              # Common components (RoleGuard, etc.)
│   │   ├── TVBroadcastPlayer.tsx
│   │   ├── Loading.tsx
│   │   ├── LiveUpdatesFooter.tsx
│   │   ├── FloatingTeamPurse.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── pages/                   # Page components
│   │   ├── AdminPanel.tsx       # Admin dashboard
│   │   ├── PresenterPanel.tsx   # Auction presenter interface
│   │   ├── ViewerScreen.tsx     # Viewer/Team screen
│   │   ├── Login.tsx            # Login page
│   │   ├── Unauthorized.tsx     # 403 page
│   │   ├── EnhancedAdminPanel.tsx
│   │   ├── EnhancedPresenterPanel.tsx
│   │   ├── EnhancedViewerScreen.tsx
│   │   ├── OldLogin.tsx         # Legacy login
│   │   └── OldPresenterPanel.tsx # Legacy presenter
│   │
│   ├── context/                 # React Context API
│   │   └── RoleContext.tsx      # Role-based access context
│   │
│   ├── store/                   # State management
│   │   └── useAuctionStore.ts   # Zustand store for auction state
│   │
│   ├── routes/                  # Routing configuration
│   │   └── AppRoutes.tsx        # React Router setup
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── useAuctionSync.ts    # Real-time sync hook
│   │
│   ├── utils/                   # Utility functions
│   │   └── auctionSync.ts       # Auction synchronization utilities
│   │
│   ├── data/                    # Mock/seed data
│   │   ├── mockPlayers.ts       # Sample player data
│   │   ├── mockTeams.ts         # Sample team data
│   │   └── mockUsers.ts         # Sample user data
│   │
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Application entry point
│   ├── index.css                # Global styles
│   └── vite-env.d.ts           # Vite type definitions
│
├── public/                      # Static assets
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker
│
├── index.html                  # HTML entry point
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── eslint.config.js           # ESLint configuration
├── tsconfig.json              # TypeScript configuration (base)
├── tsconfig.app.json          # TypeScript configuration (app)
├── tsconfig.node.json         # TypeScript configuration (Node)
├── package.json               # Frontend dependencies & scripts
└── package-lock.json          # Locked dependency versions
```

## Backend Structure (`/backend`)

```
backend/
│
├── models/                     # Sequelize ORM models
│   ├── User.model.js          # User authentication model
│   ├── Player.model.js        # Player data model
│   ├── Team.model.js          # Team data model
│   ├── index.js               # Model associations & exports
│   ├── User.js                # [OLD] Mongoose User model
│   ├── Player.js              # [OLD] Mongoose Player model
│   └── Team.js                # [OLD] Mongoose Team model
│
├── routes/                    # Express API routes
│   ├── auth.routes.js        # Authentication endpoints (PostgreSQL)
│   ├── players.routes.js     # Player CRUD endpoints (PostgreSQL)
│   ├── teams.routes.js       # Team CRUD endpoints (PostgreSQL)
│   ├── auth.js               # [OLD] Auth routes (MongoDB)
│   ├── players.js            # [OLD] Player routes (MongoDB)
│   └── teams.js              # [OLD] Team routes (MongoDB)
│
├── middleware/                # Express middleware
│   └── authMiddleware.js     # JWT authentication middleware
│
├── docs/                      # Backend documentation
│   └── BACKEND.md            # Complete API documentation
│
├── database.js               # PostgreSQL connection (Sequelize)
├── db.js                     # [OLD] MongoDB connection (Mongoose)
├── server.postgres.js        # Main server file (PostgreSQL + Socket.io)
├── server.js                 # [OLD] MongoDB server
├── init-database.js          # Database initialization & seeding
│
├── .env                      # Environment variables
├── .gitignore               # Backend-specific gitignore
├── package.json             # Backend dependencies & scripts
└── package-lock.json        # Locked dependency versions
```

## Documentation Structure (`/docs`)

```
docs/
├── POSTGRESQL-SETUP.md          # Complete PostgreSQL setup guide
├── MIGRATION-SUMMARY.md         # MongoDB to PostgreSQL migration
├── QUICKSTART-POSTGRESQL.md     # Quick start guide (5 minutes)
└── SETUP.md                     # General setup instructions
```

## Scripts Structure (`/scripts`)

```
scripts/
├── install-all.ps1             # Install all dependencies (frontend + backend)
├── start-all.ps1               # Start both servers concurrently
├── setup-postgresql.ps1        # Automated PostgreSQL setup
└── test-backend.ps1            # Backend API testing script
```

## Deprecated Structure (`/server`) - For Reference Only

The `/server` directory contains the old MongoDB-based backend. It's kept for reference and rollback purposes but is no longer actively used. The new PostgreSQL backend is in `/backend`.

## Key Files

### Configuration Files

- **Root Level:**
  - `README.md` - Main project documentation
  - `.gitignore` - Git ignore patterns

- **Frontend:**
  - `vite.config.ts` - Vite bundler configuration
  - `tailwind.config.js` - Tailwind CSS utilities
  - `tsconfig.json` - TypeScript compiler options
  - `eslint.config.js` - Linting rules
  - `package.json` - Dependencies and scripts

- **Backend:**
  - `.env` - Environment variables (DATABASE_URL, JWT_SECRET, PORT)
  - `package.json` - Dependencies and scripts
  - `database.js` - Database connection configuration
  - `init-database.js` - Database setup script

### Entry Points

- **Frontend:** `frontend/src/main.tsx` → `frontend/index.html`
- **Backend:** `backend/server.postgres.js`

## Data Flow

```
User Request
    ↓
Frontend (React) ←→ Socket.io ←→ Backend (Express)
    ↓                                ↓
Local State (Zustand)         PostgreSQL DB (Sequelize)
    ↓                                ↓
Components Render              Data Persistence
```

## Module Organization

### Frontend Modules

1. **UI Layer** - Components, Pages
2. **State Management** - Zustand Store, React Context
3. **Routing** - React Router
4. **Real-time** - Socket.io Client, Custom Hooks
5. **Utilities** - Helper functions

### Backend Modules

1. **API Layer** - Express Routes
2. **Business Logic** - Route Handlers
3. **Data Access** - Sequelize Models
4. **Authentication** - JWT Middleware
5. **Real-time** - Socket.io Server

## File Naming Conventions

- **Components:** `PascalCase.tsx` (e.g., `AdminPanel.tsx`)
- **Hooks:** `useCamelCase.ts` (e.g., `useAuctionSync.ts`)
- **Utils:** `camelCase.ts` (e.g., `auctionSync.ts`)
- **Models:** `PascalCase.model.js` (e.g., `User.model.js`)
- **Routes:** `camelCase.routes.js` (e.g., `auth.routes.js`)
- **Config:** `lowercase.config.js` (e.g., `vite.config.ts`)

## Environment-Specific Files

### Development
- Frontend runs on `http://localhost:5173` (Vite dev server)
- Backend runs on `http://localhost:5000` (Express + Nodemon)
- PostgreSQL on `localhost:5432`

### Production
- Frontend: Build with `npm run build` → Deploy static files from `frontend/dist/`
- Backend: Run with `npm start` → Node.js production server
- PostgreSQL: Production database server

## Dependencies Summary

### Frontend Main Dependencies
- React 18.3.1
- TypeScript 5.5.3
- Vite 7.1.9
- Tailwind CSS 3.4.1
- Zustand 5.0.8
- React Router DOM 7.9.4
- Socket.io Client
- Framer Motion 12.23.24

### Backend Main Dependencies
- Express 4.18.2
- PostgreSQL (pg) 8.11.3
- Sequelize 6.35.2
- Socket.io 4.6.0
- JWT + bcrypt
- CORS, dotenv

## Quick Reference

### Important Commands

```powershell
# Install everything
.\scripts\install-all.ps1

# Setup database
.\scripts\setup-postgresql.ps1
cd backend && npm run init-db

# Start development
.\scripts\start-all.ps1

# Or start individually:
cd frontend && npm run dev
cd backend && npm run dev

# Build for production
cd frontend && npm run build
```

### Important URLs

- Frontend Dev: http://localhost:5173
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health
- Socket.io: ws://localhost:5000

### Default Credentials

- Username: `admin`
- Password: `admin123`
- Role: Admin

---

**Last Updated:** October 29, 2025
