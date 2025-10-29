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
- **Express.js 4.21.2** - Web application framework
- **SQLite 3** - Lightweight file-based database (zero configuration!)
- **Sequelize 6.37.7** - ORM for database operations
- **Socket.io 4.8.1** - Real-time bidirectional communication
- **JWT 9.0.2** - JSON Web Tokens for authentication
- **bcryptjs 2.4.3** - Password hashing
- **Helmet 8.1.0** - Security headers
- **Express Rate Limit 8.2.0** - DDoS protection
- **Express Validator 7.3.0** - Input validation
- **Winston 3.18.3** - Structured logging
- **Morgan 1.10.1** - HTTP request logging
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **dotenv 16.6.1** - Environment variable management

### Features

✅ RESTful API with Express.js  
✅ SQLite database with Sequelize ORM (no server installation needed!)  
✅ Real-time updates with Socket.io  
✅ JWT-based authentication  
✅ Role-based access control (Admin, Presenter, Viewer)  
✅ Password encryption with bcrypt  
✅ Security headers with Helmet  
✅ Rate limiting for DDoS protection  
✅ Input validation on all endpoints  
✅ Structured logging with Winston  
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

#### 2. npm (comes with Node.js)

```powershell
npm --version
# Should output: 8.x.x or higher
```

**That's it!** SQLite is included as a package - no database server installation needed! 🎉

### Optional Tools

- **DB Browser for SQLite** - GUI for SQLite database viewing ([Download](https://sqlitebrowser.org/))
- **Postman** - API testing tool ([Download](https://www.postman.com/))
- **DBeaver** - Universal database tool (supports SQLite & PostgreSQL)

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
# - express (Web framework)
# - sqlite3 (Database)
# - sequelize (ORM)
# - socket.io (Real-time)
# - jsonwebtoken (Auth)
# - bcryptjs (Password hashing)
# - helmet (Security headers)
# - express-rate-limit (Rate limiting)
# - express-validator (Input validation)
# - winston (Logging)
# - morgan (HTTP logging)
# - cors (CORS support)
# - dotenv (Environment variables)
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
# ├── dotenv@16.6.1
# ├── express@4.21.2
# ├── express-rate-limit@8.2.0
# ├── express-validator@7.3.0
# ├── helmet@8.1.0
# ├── jsonwebtoken@9.0.2
# ├── morgan@1.10.1
# ├── nodemon@3.1.10
# ├── sequelize@6.37.7
# ├── socket.io@4.8.1
# ├── sqlite3@5.x.x
# └── winston@3.18.3
```

---

## 🗄️ Database Setup

### SQLite - Zero Configuration! 🎉

**Good news:** SQLite requires no database server installation! It's a file-based database that's automatically created when you run the application.

### Step 1: Configure Environment

The `.env` file is already configured for SQLite:

```properties
# SQLite Database (File-based, no installation needed!)
DB_TYPE=sqlite

# JWT Secret Key
JWT_SECRET=your-secret-key-change-this-in-production-12345

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# Client URL (Frontend)
CLIENT_URL=http://localhost:5173

# Logging
LOG_LEVEL=info
```

### Step 2: Initialize Database

```powershell
# Create database, tables, and seed initial data
npm run init-db
```

**This will:**
- ✅ Create `database.sqlite` file in the backend folder
- ✅ Create all tables (Users, Teams, Players)
- ✅ Add admin user (username: `admin`, password: `admin123`)
- ✅ Add 10 IPL teams
- ✅ Add sample players

**Expected output:**
```
✅ Database models synchronized
✅ Tables created successfully
✅ Admin user created (username: admin, password: admin123)
✅ Sample teams created
✅ Sample players created
✅ Database initialization complete!
```

### Database File Location

The SQLite database is created at:
```
backend/database.sqlite
```

This single file contains all your data:
- Users (authentication)
- Teams (10 IPL teams)
- Players (auction participants)

### Database Operations

#### Reset Database
```powershell
# Delete database file
Remove-Item backend/database.sqlite

# Recreate from scratch
npm run init-db
```

#### Backup Database
```powershell
# Simply copy the file
Copy-Item backend/database.sqlite backup/database-backup.sqlite
```

#### View Database Contents
```powershell
# Install SQLite command line (optional)
winget install SQLite.SQLite

# Open database
sqlite3 backend/database.sqlite

# Show tables
.tables

# Query data
SELECT * FROM users;
SELECT * FROM teams;
SELECT * FROM players;

# Exit
.quit
```

### Database Schema

The initialization creates three main tables:

#### **Users Table**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

#### **Teams Table**
```sql
CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  shortName VARCHAR(5) UNIQUE NOT NULL,
  purse DECIMAL(10,2) NOT NULL DEFAULT 12000,
  logo TEXT DEFAULT '',
  color VARCHAR(7) NOT NULL DEFAULT '#000000',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

#### **Players Table**
```sql
CREATE TABLE players (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role TEXT NOT NULL,
  basePrice DECIMAL(10,2) NOT NULL DEFAULT 0,
  sold TINYINT(1) DEFAULT 0,
  teamId TEXT REFERENCES teams(id) ON DELETE SET NULL,
  price DECIMAL(10,2) DEFAULT NULL,
  nationality VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  battingStyle VARCHAR(255) DEFAULT '',
  bowlingStyle VARCHAR(255) DEFAULT '',
  image TEXT DEFAULT '',
  stats TEXT DEFAULT '{"matches":0,"runs":0,"wickets":0}',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
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
│   ├── authMiddleware.js     # JWT verification
│   ├── rateLimiter.js        # Rate limiting
│   └── validator.js          # Input validation
│
├── utils/                     # Utility functions
│   └── logger.js             # Winston logger
│
├── logs/                      # Log files
│   ├── error.log             # Error logs
│   └── combined.log          # All logs
│
├── docs/                      # Documentation
│   └── BACKEND.md            # API reference
│
├── database.js                # SQLite connection
├── database.sqlite            # SQLite database file (auto-created)
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
const path = require('path');
require('dotenv').config();

// SQLite configuration - no server needed!
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  define: {
    freezeTableName: false,
    timestamps: true,
  },
});

module.exports = { sequelize };
```

#### **server.postgres.js** - Main Server

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./database');
const logger = require('./utils/logger');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth.routes');
const playerRoutes = require('./routes/players.routes');
const teamRoutes = require('./routes/teams.routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Security & Logging Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined', { stream: logger.stream }));
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  // Socket event handlers here
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.error('❌ Server startup error:', error);
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
# 4. Check logs in terminal or backend/logs/
```

### Environment Variables

```env
# .env file
DB_TYPE=sqlite
JWT_SECRET=your_secret_key_change_in_production
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
LOG_LEVEL=info
```

> **💡 Tip:** For production with PostgreSQL, add `DB_TYPE=postgres` and `DATABASE_URL=postgresql://user:pass@host:5432/dbname`

### Logging

The backend now includes two types of logging:

**1. Winston Logger (Structured Logs)**
```javascript
// backend/utils/logger.js
// Logs to files: backend/logs/error.log and backend/logs/combined.log
// Automatically rotates files at 5MB
```

**2. Morgan Logger (HTTP Requests)**
```javascript
// HTTP request logs in development
// Example: GET /api/players 200 25ms
```

### Database Operations

**SQLite Commands:**
```powershell
# Reset database
npm run init-db

# View database with SQLite CLI
sqlite3 backend/database.sqlite

# Inside SQLite CLI:
.tables                          # Show all tables
SELECT * FROM users;             # View all users
SELECT * FROM players;           # View all players
SELECT * FROM teams;             # View all teams

# View players with teams (JOIN)
SELECT p.name, p.role, p.base_price, t.name as team 
FROM players p 
LEFT JOIN teams t ON p."teamId" = t.id;

# Check team purses
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

# Optional: Add PostgreSQL for high-traffic production
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_production_secret
heroku config:set NODE_ENV=production
heroku config:set DB_TYPE=sqlite    # or postgres if using PostgreSQL addon

# Deploy
git push heroku main

# Initialize database
heroku run npm run init-db

# View logs
heroku logs --tail
```

> **💡 Note:** SQLite works great on Heroku for small to medium traffic. For high-traffic applications, add PostgreSQL addon.

### Deploy to Railway

```bash
# Connect GitHub repo
# Railway auto-detects Node.js
# Optional: Add PostgreSQL plugin for production scale
# Set environment variables in Railway dashboard
# Railway auto-deploys on push
```

### Deploy to AWS EC2

```bash
# 1. Launch EC2 instance
# 2. Install Node.js
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

**For SQLite (Simple Production):**
```env
DB_TYPE=sqlite
JWT_SECRET=use_strong_secret_here_min_32_chars
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
LOG_LEVEL=warn
```

**For PostgreSQL (High-Traffic Production):**
```env
DB_TYPE=postgres
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=use_strong_secret_here_min_32_chars
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
LOG_LEVEL=warn
```

### Database Backup

**SQLite (Simple):**
```bash
# Backup - just copy the file
cp backend/database.sqlite backup-$(date +%Y%m%d).sqlite

# Restore
cp backup-YYYYMMDD.sqlite backend/database.sqlite
npm start
```

**PostgreSQL (If using in production):**
```bash
# Backup
pg_dump -U postgres -d auction_portal > backup.sql

# Restore
psql -U postgres -d auction_portal < backup.sql
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to database

**For SQLite:**
```powershell
# Ensure database file exists
ls backend/database.sqlite

# If missing, reinitialize
cd backend
npm run init-db

# Check file permissions (should be readable/writable)
```

**For PostgreSQL (if using in production):**
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
# SQLite: Drop database and recreate
cd backend
rm database.sqlite
npm run init-db

# PostgreSQL (if using): Drop and recreate schema
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

### Issue: Database locked (SQLite)

```powershell
# Close all connections to database
# Stop backend server
# Delete lock files
cd backend
rm database.sqlite-shm database.sqlite-wal

# Restart server
npm start
```

---

## 📚 Additional Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Socket.io Documentation](https://socket.io/docs/)
- [JWT Documentation](https://jwt.io/)

### Tools
- [DB Browser for SQLite](https://sqlitebrowser.org/) - GUI for SQLite
- [Postman](https://www.postman.com/) - API testing
- [Winston Logger](https://github.com/winstonjs/winston) - Logging

### Best Practices
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Backend setup complete! Happy coding! 🚀**

Last Updated: October 29, 2025
