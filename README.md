# 🏏 IPL Auction Portal 2025

A professional, real-time cricket player auction portal built with React, TypeScript, and PostgreSQL. This comprehensive application provides an authentic IPL auction experience with role-based access control, real-time synchronization, and stunning modern UI design.

## ✨ Features

### 🔐 Advanced Authentication System
- **Tabbed Login Interface**: Modern Sign In and Quick Access tabs
- **Role-Based Access**: Admin, Presenter, and Team Viewer accounts
- **Secure Navigation**: Automatic role-based dashboard routing
- **Quick Team Access**: Instant login for all 10 IPL teams

### 🏆 Complete Auction Management
- **Live Player Auctions**: Real-time bidding with professional controls
- **Team Management**: Track all 10 IPL teams with authentic branding
- **Player Database**: 20+ professional cricketers with detailed profiles
- **Purse Tracking**: Dynamic budget management with visual indicators
- **Auction Controls**: Start, pause, resume, navigate, and manage sales

### 📡 Real-Time Synchronization
- **Cross-Tab Communication**: Updates sync instantly across all browser tabs
- **Local Storage Persistence**: Auction state maintained across sessions
- **Live Updates**: Bid changes, player navigation sync in real-time
- **Multi-User Support**: Simultaneous presenter and viewer experiences

### 📊 Enhanced Team Features
- **Complete IPL Roster**: All 10 current IPL teams (CSK, MI, RCB, KKR, DC, RR, PBKS, SRH, GT, LSG)
- **Official Branding**: Authentic team logos, colors, and styling
- **Team Analytics**: Enhanced purse status with progress bars and statistics
- **Player Tracking**: Individual team rosters with spending analysis
- **Live Leaderboards**: Real-time team rankings and purse status

### 🎨 Modern UI/UX Design
- **Gradient Overlays**: Dynamic color schemes on login and team cards
- **Smooth Animations**: CSS transitions and hover effects throughout
- **Real-time Status Indicators**: Live auction status with pulsing animations
- **Enhanced Team Cards**: Hover scaling, color theming, and progress bars
- **Micro-interactions**: Button hover states, loading spinners, and visual feedback
- **Mobile Responsive**: Optimized layouts for all screen sizes

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript 5.5.3
- **Build Tool**: Vite 7.1.9 with fast HMR and optimized bundling
- **Styling**: Tailwind CSS 3.4.1 with PostCSS and Autoprefixer
- **State Management**: Zustand 5.0.8 with persistent real-time synchronization
- **Routing**: React Router DOM 7.9.4 with role-based navigation
- **Icons**: Lucide React 0.344.0 with 1000+ professional icons
- **Real-Time**: Socket.io Client 4.6.0

### Backend
- **Runtime**: Node.js 16+ with Express 4.18.2
- **Database**: PostgreSQL 15+ with Sequelize ORM 6.35.2
- **Authentication**: JWT (jsonwebtoken 9.0.2) with bcryptjs 2.4.3
- **Real-Time**: Socket.io 4.6.0 for WebSocket connections
- **Environment**: dotenv 16.3.1 for configuration
- **Security**: CORS enabled with helmet middleware

## 📁 Project Structure

```
AUCTION-PORTAL/
├── frontend/                 # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── common/      # Shared components (RoleGuard, etc.)
│   │   ├── pages/          # Page components (Admin, Presenter, Viewer)
│   │   ├── context/        # React context providers (RoleContext)
│   │   ├── store/          # Zustand state management
│   │   ├── routes/         # React Router configuration
│   │   └── data/           # Mock data and constants
│   ├── public/             # Static assets
│   ├── vite.config.ts      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── tsconfig.json       # TypeScript configuration
│   └── package.json        # Frontend dependencies
│
├── backend/                 # Node.js + Express + PostgreSQL backend
│   ├── models/             # Sequelize database models
│   │   ├── User.model.js   # User authentication model
│   │   ├── Player.model.js # Player data model
│   │   ├── Team.model.js   # Team data model
│   │   └── index.js        # Model associations
│   ├── routes/             # Express API routes
│   │   ├── auth.routes.js  # Authentication endpoints
│   │   ├── players.routes.js # Player CRUD operations
│   │   └── teams.routes.js # Team CRUD operations
│   ├── middleware/         # Express middleware
│   │   └── authMiddleware.js # JWT authentication
│   ├── docs/               # Backend documentation
│   │   └── BACKEND.md      # Complete API reference
│   ├── database.js         # PostgreSQL connection (Sequelize)
│   ├── server.postgres.js  # Main server file with Socket.io
│   ├── init-database.js    # Database initialization script
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
│
├── docs/                    # Project documentation
│   ├── MASTER-GUIDE.md      # Complete project documentation
│   ├── FRONTEND-SETUP.md    # Frontend setup and development guide
│   └── BACKEND-SETUP.md     # Backend setup and API development guide
│
├── scripts/                 # Utility scripts
│   ├── install-all.ps1      # Install dependencies for both frontend and backend
│   ├── start-all.ps1        # Start both servers simultaneously
│   ├── setup-postgresql.ps1 # PostgreSQL database setup automation
│   └── test-backend.ps1     # Backend API testing script
│
├── .vscode/                 # VS Code configuration
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ (18+ recommended)
- **PostgreSQL** 15+ installed and running
- **npm** or **yarn** package manager

### Option 1: Automated Setup (Recommended)

```powershell
# Install all dependencies
.\scripts\install-all.ps1

# Setup PostgreSQL database
.\scripts\setup-postgresql.ps1

# Start both frontend and backend
.\scripts\start-all.ps1
```

### Option 2: Manual Setup

#### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# DB_NAME=auction_db
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_PORT=5432
# JWT_SECRET=your_jwt_secret_key
# PORT=5000

# Initialize database
node init-database.js

# Start backend server
npm start
```

Backend will run on: http://localhost:5000

#### 2. Frontend Setup

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: http://localhost:5173

### Default Login Credentials

#### Admin Account
- **Email**: `admin@auction.com`
- **Password**: `admin123`

#### Presenter Account
- **Email**: `presenter@auction.com`
- **Password**: `presenter123`

#### Team Viewer Accounts (Quick Access)
All teams use password: `team123`
- Chennai Super Kings (CSK)
- Mumbai Indians (MI)
- Royal Challengers Bangalore (RCB)
- Kolkata Knight Riders (KKR)
- Delhi Capitals (DC)
- Rajasthan Royals (RR)
- Punjab Kings (PBKS)
- Sunrisers Hyderabad (SRH)
- Gujarat Titans (GT)
- Lucknow Super Giants (LSG)

## 📚 Documentation

### Main Guides
- **[Master Guide](./docs/MASTER-GUIDE.md)** - Complete project documentation, architecture, and deployment
- **[Frontend Setup Guide](./docs/FRONTEND-SETUP.md)** - React + TypeScript + Vite frontend setup and development
- **[Backend Setup Guide](./docs/BACKEND-SETUP.md)** - Node.js + Express + PostgreSQL backend setup and API development

### Additional Documentation
- **[Backend API Reference](./backend/docs/BACKEND.md)** - Complete API endpoint documentation

## 🔧 Development

### Frontend Development

```bash
cd frontend

# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development

```bash
cd backend

# Start server with nodemon (auto-reload)
npm run dev

# Start production server
npm start

# Initialize/reset database
node init-database.js

# Test API endpoints
npm test
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start Vite dev server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm start` - Start Express server
- `npm run dev` - Start with nodemon (development)
- `npm test` - Run API tests

**PowerShell Scripts:**
- `.\scripts\install-all.ps1` - Install all dependencies
- `.\scripts\start-all.ps1` - Start both servers
- `.\scripts\setup-postgresql.ps1` - Setup PostgreSQL
- `.\scripts\test-backend.ps1` - Test backend API

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE Users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'presenter', 'team') NOT NULL,
  teamId UUID REFERENCES Teams(id),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Teams Table
```sql
CREATE TABLE Teams (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  shortName VARCHAR(10) UNIQUE NOT NULL,
  logo VARCHAR(500),
  primaryColor VARCHAR(7),
  secondaryColor VARCHAR(7),
  totalPurse DECIMAL(10,2) DEFAULT 100.00,
  remainingPurse DECIMAL(10,2) DEFAULT 100.00,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Players Table
```sql
CREATE TABLE Players (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role ENUM('Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper') NOT NULL,
  basePrice DECIMAL(10,2) NOT NULL,
  nationality VARCHAR(100),
  imageUrl VARCHAR(500),
  stats JSONB,
  teamId UUID REFERENCES Teams(id),
  soldPrice DECIMAL(10,2),
  status ENUM('available', 'sold', 'unsold') DEFAULT 'available',
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create new player (Admin only)
- `PUT /api/players/:id` - Update player (Admin only)
- `DELETE /api/players/:id` - Delete player (Admin only)

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team (Admin only)
- `PUT /api/teams/:id` - Update team (Admin only)
- `DELETE /api/teams/:id` - Delete team (Admin only)

For complete API documentation, see [Backend API Documentation](./backend/docs/BACKEND.md)

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Backend Deployment (Heroku/Railway)

**Heroku:**
```bash
cd backend
heroku create auction-portal-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

**Railway:**
```bash
# Connect GitHub repository to Railway
# Add PostgreSQL database plugin
# Configure environment variables
# Deploy automatically on push
```

For detailed deployment instructions, see [Master Guide - Deployment](./docs/MASTER-GUIDE.md#-deployment-guide)

## 🐛 Troubleshooting

### Frontend Issues

**Issue**: `Cannot find module 'vite'`
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Port 5173 already in use
```bash
# Kill the process using port 5173
npx kill-port 5173
npm run dev
```

### Backend Issues

**Issue**: Database connection failed
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Verify .env configuration
cat backend/.env

# Reinitialize database
cd backend
node init-database.js
```

**Issue**: `Port 5000 is already in use`
```bash
# Change PORT in backend/.env or kill process
npx kill-port 5000
npm start
```

For more troubleshooting solutions, see [Master Guide - Troubleshooting](./docs/MASTER-GUIDE.md#-troubleshooting)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript and ESLint conventions
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

**IPL Auction Portal Team**
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + PostgreSQL
- Real-Time: Socket.io + LocalStorage Sync

## 🙏 Acknowledgments

- IPL teams for branding inspiration
- Lucide React for beautiful icons
- Tailwind CSS for utility-first styling
- Socket.io for real-time communication
- PostgreSQL for reliable data storage

## 📞 Support

For issues, questions, or suggestions:
- Create an issue in the GitHub repository
- Check the [Troubleshooting Guide](./docs/MASTER-GUIDE.md#-troubleshooting)
- Review the [Documentation](./docs/MASTER-GUIDE.md)

---

**Built with ❤️ for cricket fans and auction enthusiasts**
