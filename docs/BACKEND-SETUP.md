# 🔧 Backend Setup Guide - IPL Auction Portal

**Complete guide for setting up, developing, and deploying the Node.js backend**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Database Setup](#database-setup)
5. [Project Structure](#project-structure)
6. [Configuration](#configuration)
7. [Database Models](#database-models)
8. [API Routes](#api-routes)
9. [Authentication](#authentication)
10. [Socket.io Integration](#socketio-integration)
11. [Development](#development)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Troubleshooting](#troubleshooting)

---

## 📖 Overview

### Technology Stack

- **Node.js** (v16+) - JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **PostgreSQL 15+** - Relational database
- **Sequelize 6.35.2** - ORM for PostgreSQL
- **Socket.io 4.6.0** - Real-time bidirectional communication
- **JWT 9.0.2** - JSON Web Tokens for authentication
- **bcryptjs 2.4.3** - Password hashing
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **dotenv 16.3.1** - Environment variable management

### Features

✅ RESTful API with Express.js  
✅ PostgreSQL database with Sequelize ORM  
✅ Real-time updates with Socket.io  
✅ JWT-based authentication  
✅ Role-based access control  
✅ Password encryption with bcrypt  
✅ CORS enabled for frontend  
✅ Environment-based configuration  

---

## 🔧 Prerequisites

### Required Software

#### 1. Node.js (v16 or higher)

```powershell
# Check if installed
node --version
# Should output: v16.x.x or higher

# If not installed, download from:
# https://nodejs.org/
```

#### 2. PostgreSQL (v15 or higher)

**Option A: Native Installation**

```powershell
# Download from: https://www.postgresql.org/download/

# Verify installation
psql --version
# Should output: psql (PostgreSQL) 15.x
```

**Option B: Docker**

```powershell
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name auction-postgres `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=auction_portal `
  -p 5432:5432 -d postgres:15

# Verify
docker ps
```

#### 3. npm (comes with Node.js)

```powershell
npm --version
# Should output: 8.x.x or higher
```

### Optional Tools

- **pgAdmin** - GUI for PostgreSQL management
- **Postman** - API testing tool
- **DBeaver** - Universal database tool

---

## 📥 Installation

### Step 1: Navigate to Backend Directory

```powershell
cd "d:\AUCTION PORTAL\backend"
```

### Step 2: Install Dependencies

```powershell
# Install all dependencies
npm install

# This will install:
# - express
# - pg (PostgreSQL driver)
# - sequelize
# - socket.io
# - jsonwebtoken
# - bcryptjs
# - cors
# - dotenv
# - nodemon (dev dependency)
```

### Step 3: Verify Installation

```powershell
# Check installed packages
npm list --depth=0

# Expected output:
# auction-portal-backend@1.0.0
# ├── bcryptjs@2.4.3
# ├── cors@2.8.5
# ├── dotenv@16.3.1
# ├── express@4.18.2
# ├── jsonwebtoken@9.0.2
# ├── pg@8.11.3
# ├── sequelize@6.35.2
# ├── socket.io@4.6.0
# └── nodemon@3.0.2
```

---

## 🗄️ Database Setup

### Option 1: Using Setup Script (Recommended)

```powershell
# Run automated setup
cd ..
.\scripts\setup-postgresql.ps1

# This script will:
# 1. Check PostgreSQL installation
# 2. Test database connection
# 3. Create auction_portal database
# 4. Update .env file
# 5. Provide next steps
```

### Option 2: Manual Setup

#### Step 1: Start PostgreSQL

```powershell
# Check if PostgreSQL service is running
Get-Service postgresql*

# Start service if not running
Start-Service postgresql-x64-15

# Or if using Docker
docker start auction-postgres
```

#### Step 2: Create Database

```powershell
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE auction_portal;

# Verify
\l

# Exit
\q
```

#### Step 3: Create .env File

```powershell
cd backend

# Create .env file
New-Item .env -ItemType File

# Add content to .env (edit with notepad or VS Code)
```

Add the following to `.env`:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/auction_portal

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional
CORS_ORIGIN=http://localhost:5173
```

#### Step 4: Initialize Database

```powershell
# Run database initialization
npm run init-db

# This will:
# 1. Create all tables (users, players, teams)
# 2. Seed default data
# 3. Create admin user (admin/admin123)
```

### Database Schema

The initialization creates three main tables:

#### **Users Table**
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

#### **Teams Table**
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

#### **Players Table**
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

### Verify Database Setup

```powershell
# Connect to database
psql -U postgres -d auction_portal

# Check tables
\dt

# Check data
SELECT * FROM users;
SELECT * FROM teams;
SELECT * FROM players LIMIT 5;

# Exit
\q
```

---

## 📁 Project Structure

### Directory Layout

```
backend/
│
├── models/                    # Sequelize models
│   ├── User.model.js         # User model
│   ├── Player.model.js       # Player model
│   ├── Team.model.js         # Team model
│   └── index.js              # Model associations
│
├── routes/                    # Express routes
│   ├── auth.routes.js        # Auth endpoints
│   ├── players.routes.js     # Player CRUD
│   └── teams.routes.js       # Team CRUD
│
├── middleware/                # Express middleware
│   └── authMiddleware.js     # JWT verification
│
├── docs/                      # Documentation
│   └── BACKEND.md            # API reference
│
├── database.js                # PostgreSQL connection
├── server.postgres.js         # Main server file
├── init-database.js           # DB initialization
├── .env                       # Environment variables
├── .gitignore                # Git ignore
├── package.json               # Dependencies
└── package-lock.json          # Lock file
```

### Key Files Explained

#### **database.js** - Database Connection

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
```

#### **server.postgres.js** - Main Server

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const sequelize = require('./database');

// Import routes
const authRoutes = require('./routes/auth.routes');
const playerRoutes = require('./routes/players.routes');
const teamRoutes = require('./routes/teams.routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  // Socket event handlers here
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected successfully');
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
});
```

---

## 🗂️ Database Models

### User Model (`models/User.model.js`)

```javascript
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 50],
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'presenter', 'viewer'),
    allowNull: false,
    defaultValue: 'viewer',
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  },
});

// Instance method to verify password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
```

### Player Model (`models/Player.model.js`)

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper']],
    },
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'base_price',
  },
  sold: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'team_id',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  nationality: {
    type: DataTypes.STRING,
    defaultValue: 'India',
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  stats: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'image_url',
  },
}, {
  tableName: 'players',
  timestamps: true,
  underscored: true,
});

module.exports = Player;
```

### Team Model (`models/Team.model.js`)

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  shortName: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: false,
    field: 'short_name',
  },
  purse: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 12000.00,
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: false,
    validate: {
      is: /^#[0-9A-F]{6}$/i,
    },
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'logo_url',
  },
}, {
  tableName: 'teams',
  timestamps: true,
  underscored: true,
});

// Instance method to add player
Team.prototype.addPlayerToTeam = async function(player, price) {
  if (this.purse >= price) {
    this.purse -= price;
    await this.save();
    return true;
  }
  return false;
};

module.exports = Team;
```

### Model Associations (`models/index.js`)

```javascript
const User = require('./User.model');
const Player = require('./Player.model');
const Team = require('./Team.model');

// Define relationships
Team.hasMany(Player, {
  foreignKey: 'teamId',
  as: 'players',
  onDelete: 'SET NULL',
});

Player.belongsTo(Team, {
  foreignKey: 'teamId',
  as: 'team',
});

module.exports = {
  User,
  Player,
  Team,
};
```

---

## 🛣️ API Routes

### Authentication Routes (`routes/auth.routes.js`)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    // Create user
    const user = await User.create({ username, password, role });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
```

### Player Routes (`routes/players.routes.js`)

```javascript
const express = require('express');
const { Player, Team } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all players
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { sold, role } = req.query;
    
    let where = {};
    if (sold !== undefined) where.sold = sold === 'true';
    if (role) where.role = role;

    const players = await Player.findAll({
      where,
      include: [{ model: Team, as: 'team' }],
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      count: players.length,
      players,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get player by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id, {
      include: [{ model: Team, as: 'team' }],
    });

    if (!player) {
      return res.status(404).json({ 
        success: false, 
        message: 'Player not found' 
      });
    }

    res.json({
      success: true,
      player,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Create player (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Player created successfully',
      player,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update player (admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        message: 'Player not found' 
      });
    }

    await player.update(req.body);
    res.json({
      success: true,
      message: 'Player updated successfully',
      player,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Delete player (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        message: 'Player not found' 
      });
    }

    await player.destroy();
    res.json({
      success: true,
      message: 'Player deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
```

### Team Routes (`routes/teams.routes.js`)

```javascript
const express = require('express');
const { Team, Player } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all teams
router.get('/', authenticateToken, async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [{
        model: Player,
        as: 'players',
        required: false,
      }],
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get team by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [{
        model: Player,
        as: 'players',
        required: false,
      }],
    });

    if (!team) {
      return res.status(404).json({ 
        success: false, 
        message: 'Team not found' 
      });
    }

    res.json({
      success: true,
      team,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Create team (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update team (admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    
    if (!team) {
      return res.status(404).json({ 
        success: false, 
        message: 'Team not found' 
      });
    }

    await team.update(req.body);
    res.json({
      success: true,
      message: 'Team updated successfully',
      team,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
```

---

## 🔐 Authentication

### JWT Middleware (`middleware/authMiddleware.js`)

```javascript
const jwt = require('jsonwebtoken');

// Authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

// Authorize specific roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};
```

### Usage in Routes

```javascript
// Public route
router.get('/public', (req, res) => {
  res.json({ message: 'Public endpoint' });
});

// Protected route (any authenticated user)
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected endpoint', user: req.user });
});

// Admin-only route
router.post('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Admin endpoint' });
});

// Multiple roles
router.get('/presenter', authenticateToken, authorizeRoles('admin', 'presenter'), (req, res) => {
  res.json({ message: 'Presenter endpoint' });
});
```

---

## ⚡ Socket.io Integration

### Socket Server Setup

```javascript
// In server.postgres.js
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Authentication middleware for Socket.io
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  });
});

// Socket connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id, 'Role:', socket.userRole);

  // Join auction room
  socket.on('joinAuction', ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room ${roomId}`);
  });

  // Player update event
  socket.on('playerUpdate', async (data) => {
    try {
      const { playerId, teamId, price } = data;
      
      // Update player in database
      const player = await Player.findByPk(playerId);
      if (player) {
        await player.update({ sold: true, teamId, price });
        
        // Broadcast to all clients
        io.emit('playerUpdated', {
          player: await Player.findByPk(playerId, {
            include: [{ model: Team, as: 'team' }],
          }),
        });
      }
    } catch (error) {
      console.error('Error updating player:', error);
      socket.emit('error', { message: 'Failed to update player' });
    }
  });

  // Auction state change
  socket.on('auctionStateChange', (data) => {
    io.emit('auctionStateChanged', data);
  });

  // Disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
```

### Socket Events

#### Client → Server Events
- `joinAuction` - Join a specific auction room
- `playerUpdate` - Update player status (sold, team, price)
- `auctionStateChange` - Change auction state (active, paused)
- `bidPlaced` - Place a bid on current player

#### Server → Client Events
- `playerUpdated` - Player data updated
- `auctionStateChanged` - Auction state changed
- `bidReceived` - New bid received
- `error` - Error occurred

---

## 💻 Development

### Starting Development Server

```powershell
# Start with auto-reload
npm run dev

# Or start normally
npm start
```

### Development Workflow

```powershell
# 1. Make code changes
# 2. Nodemon automatically restarts server
# 3. Test with Postman or frontend
# 4. Check logs in terminal
```

### Environment Variables

```env
# .env file
DATABASE_URL=postgresql://postgres:password@localhost:5432/auction_portal
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Logging

```javascript
// Enable SQL logging in database.js
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log, // Enable to see SQL queries
});

// Add custom logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Database Operations

```powershell
# Reset database
npm run init-db

# Check database connection
psql -U postgres -d auction_portal

# View all users
SELECT * FROM users;

# View all players with teams
SELECT p.name, p.role, t.name as team 
FROM players p 
LEFT JOIN teams t ON p.team_id = t.id;

# Check purse remaining
SELECT name, purse FROM teams ORDER BY purse DESC;
```

---

## 🧪 Testing

### Manual API Testing with curl

```powershell
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin123"}'

# Get players (with token)
curl http://localhost:5000/api/players `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create player (admin only)
curl -X POST http://localhost:5000/api/players `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN_HERE" `
  -d '{"name":"New Player","role":"Batsman","basePrice":200}'
```

### Using Postman

1. Create a new collection "IPL Auction API"
2. Add requests for each endpoint
3. Use environment variables for:
   - `baseUrl`: http://localhost:5000
   - `token`: JWT token from login
4. Test all CRUD operations

### Automated Testing Script

```powershell
# Use provided test script
.\scripts\test-backend.ps1

# This tests:
# - Health endpoint
# - User registration
# - Login
# - Get players
# - Get teams
```

---

## 🚀 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create auction-portal-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_production_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Initialize database
heroku run npm run init-db

# View logs
heroku logs --tail
```

### Deploy to Railway

```bash
# Connect GitHub repo
# Railway auto-detects Node.js
# Add PostgreSQL plugin in Railway dashboard
# Set environment variables
# Railway auto-deploys on push
```

### Deploy to AWS EC2

```bash
# 1. Launch EC2 instance
# 2. Install Node.js and PostgreSQL
# 3. Clone repository
# 4. Install dependencies
npm install

# 5. Create .env file with production values
# 6. Initialize database
npm run init-db

# 7. Install PM2
npm install -g pm2

# 8. Start with PM2
pm2 start server.postgres.js --name auction-api

# 9. Configure PM2 to start on boot
pm2 startup
pm2 save
```

### Production Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=use_strong_secret_here
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Database Backup

```bash
# Backup
pg_dump -U postgres -d auction_portal > backup.sql

# Restore
psql -U postgres -d auction_portal < backup.sql
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to PostgreSQL

```powershell
# Check if service is running
Get-Service postgresql*

# Start service
Start-Service postgresql-x64-15

# Check port 5432
netstat -ano | findstr :5432

# Test connection
psql -U postgres
```

### Issue: JWT errors

```javascript
// Check JWT_SECRET is set
console.log(process.env.JWT_SECRET);

// Verify token format
// Should be: Bearer <token>

// Check token expiration
const decoded = jwt.decode(token);
console.log(decoded.exp); // Unix timestamp
```

### Issue: CORS errors

```javascript
// Enable CORS for specific origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Or allow all origins (development only)
app.use(cors());
```

### Issue: Sequelize sync errors

```powershell
# Drop all tables and recreate
npm run init-db

# Or manually
psql -U postgres -d auction_portal
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
\q

npm run init-db
```

### Issue: Port already in use

```powershell
# Find process
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or use different port
# Change PORT in .env
```

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Socket.io Documentation](https://socket.io/docs/)
- [JWT Documentation](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Backend setup complete! Happy coding! 🚀**

Last Updated: October 29, 2025
