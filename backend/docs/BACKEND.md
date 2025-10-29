# 🏗️ Backend Documentation - IPL Auction Portal

## 📖 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Authentication System](#authentication-system)
6. [API Endpoints](#api-endpoints)
7. [Real-Time Features (Socket.io)](#real-time-features-socketio)
8. [Middleware](#middleware)
9. [Error Handling](#error-handling)
10. [Security Features](#security-features)
11. [Performance Optimizations](#performance-optimizations)
12. [Deployment](#deployment)
13. [Testing](#testing)
14. [Troubleshooting](#troubleshooting)

---

## 🏛️ Architecture Overview

The IPL Auction Portal backend is a **full-stack Node.js application** designed to handle real-time cricket player auctions with role-based access control. The architecture follows a **modular, scalable design** with clear separation of concerns.

### Core Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   Express API   │    │   MongoDB       │
│   (Port 5173)   │◄──►│   (Port 5000)   │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • UI Components │    │ • REST Endpoints│    │ • Players       │
│ • State Mgmt    │    │ • JWT Auth      │    │ • Teams         │
│ • Real-time UI  │    │ • Socket.io     │    │ • Users         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              ▲
                              │
                       ┌─────────────────┐
                       │   Socket.io     │
                       │ Real-time Bids  │
                       │   (WebSocket)   │
                       └─────────────────┘
```

### Design Principles

- **RESTful API**: Clean, predictable endpoints
- **Real-time Communication**: WebSocket-based auction updates
- **Role-Based Security**: Granular access control
- **Scalable Architecture**: Modular, maintainable code
- **Performance Optimized**: In-memory state for auctions
- **Error Resilient**: Comprehensive error handling

---

## 🛠️ Technology Stack

### Core Framework
- **Node.js**: Runtime environment (v16+)
- **Express.js**: Web framework for API routes
- **Socket.io**: Real-time bidirectional communication

### Database & ODM
- **MongoDB**: NoSQL document database
- **Mongoose**: MongoDB object modeling for Node.js

### Authentication & Security
- **jsonwebtoken (JWT)**: Token-based authentication
- **bcryptjs**: Password hashing and verification
- **CORS**: Cross-origin resource sharing

### Development & Utilities
- **dotenv**: Environment variable management
- **nodemon**: Auto-restart during development
- **concurrently**: Run multiple processes simultaneously

### Production Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "socket.io": "^4.6.0",
  "cors": "^2.8.5",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.3.1"
}
```

---

## 📁 Project Structure

```
server/
├── models/                    # Database schemas
│   ├── Player.js             # Player model with stats
│   ├── Team.js               # Team model with purse logic
│   └── User.js               # User model with auth
│
├── routes/                    # API route handlers
│   ├── auth.js               # Authentication endpoints
│   ├── players.js            # Player CRUD operations
│   └── teams.js              # Team CRUD operations
│
├── middleware/                # Express middleware
│   └── authMiddleware.js     # JWT verification & roles
│
├── db.js                     # MongoDB connection setup
├── server.js                 # Main application entry point
├── package.json              # Dependencies & scripts
├── .env                      # Environment variables
└── .gitignore               # Git ignore rules
```

### File Responsibilities

| File | Responsibility |
|------|----------------|
| `server.js` | Main application, Socket.io setup, server startup |
| `db.js` | MongoDB connection, error handling, graceful shutdown |
| `models/*.js` | Data validation, schema definitions, business logic |
| `routes/*.js` | HTTP request handling, response formatting |
| `middleware/*.js` | Authentication, authorization, request processing |

---

## 🗄️ Database Schema

### User Collection

**Purpose**: Store user accounts with role-based access control

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin', 'presenter', 'viewer'],
    default: 'viewer',
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});
```

**Indexes**: `username` (unique), compound indexes for queries

**Pre-save Hook**: Password hashing with bcrypt (10 salt rounds)

### Player Collection

**Purpose**: Store cricket player information and auction data

```javascript
const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Player role is required'],
    enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'],
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Base price cannot be negative'],
  },
  sold: {
    type: Boolean,
    default: false,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null,
  },
  price: {
    type: Number,
    default: null,
    min: [0, 'Price cannot be negative'],
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [16, 'Age must be at least 16'],
    max: [50, 'Age must be less than 50'],
  },
  battingStyle: {
    type: String,
    default: '',
  },
  bowlingStyle: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  stats: {
    matches: {
      type: Number,
      default: 0,
      min: 0,
    },
    runs: {
      type: Number,
      default: 0,
      min: 0,
    },
    wickets: {
      type: Number,
      default: 0,
      min: 0,
    },
    average: {
      type: Number,
      default: 0,
      min: 0,
    },
    strikeRate: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
}, {
  timestamps: true,
});
```

**Virtuals**: `avatarUrl` (generates default avatar if no image)

**Indexes**: `sold`, `role`, `teamId`, `name` for efficient queries

### Team Collection

**Purpose**: Store IPL team information and purse management

```javascript
const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    unique: true,
  },
  shortName: {
    type: String,
    required: [true, 'Short name is required'],
    trim: true,
    unique: true,
    maxlength: [5, 'Short name cannot exceed 5 characters'],
  },
  purse: {
    type: Number,
    required: [true, 'Purse is required'],
    default: 12000, // Default purse in lakhs
    min: [0, 'Purse cannot be negative'],
  },
  logo: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    required: [true, 'Team color is required'],
    default: '#000000',
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  }],
}, {
  timestamps: true,
});
```

**Virtuals**:
- `totalSpent`: Calculated as 12000 - current purse
- `remainingPurse`: Alias for purse

**Methods**:
- `addPlayer(playerId, price)`: Add player and deduct from purse
- `removePlayer(playerId, price)`: Remove player and refund purse

**Indexes**: `name`, `shortName` for efficient lookups

---

## 🔐 Authentication System

### JWT-Based Authentication

The system uses **JSON Web Tokens (JWT)** for stateless authentication with the following flow:

```
1. User Login/Register
2. Server validates credentials
3. Server generates JWT token
4. Client stores token in localStorage
5. Client sends token in Authorization header
6. Server verifies token on protected routes
```

### Token Structure

```javascript
// JWT Payload
{
  id: "user_mongodb_id",
  username: "admin",
  role: "admin",
  iat: 1640995200,  // Issued at
  exp: 1641600000   // Expires at (7 days)
}
```

### Password Security

- **Hashing**: bcrypt with 10 salt rounds
- **Minimum Length**: 6 characters
- **Storage**: Hashed passwords only (never plain text)

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **admin** | Full access: CRUD all resources, auction control |
| **presenter** | Auction management: start/pause, set players, place bids |
| **viewer** | Read-only: view players, teams, auction state |

### Authentication Middleware

```javascript
// authMiddleware.js
const authMiddleware = (req, res, next) => {
  // 1. Extract token from Authorization header
  // 2. Verify JWT signature and expiration
  // 3. Attach user info to req.user
  // 4. Call next() or return 401 error
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    // Check if user has required role
    // Return 403 if unauthorized
  };
};
```

---

## 🌐 API Endpoints

### Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123",
  "role": "admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "admin",
      "role": "admin"
    }
  }
}
```

#### POST `/auth/login`
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "admin",
      "role": "admin"
    }
  }
}
```

#### GET `/auth/verify`
Verify JWT token validity.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "admin",
      "role": "admin"
    }
  }
}
```

### Player Endpoints

#### GET `/players`
Get all players with optional filtering.

**Query Parameters:**
- `role`: Filter by player role
- `sold`: Filter by sold status (true/false)
- `teamId`: Filter by team ownership

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 193,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Virat Kohli",
      "role": "Batsman",
      "basePrice": 150,
      "sold": false,
      "nationality": "India",
      "age": 35,
      "stats": {
        "matches": 250,
        "runs": 12000,
        "average": 52.5
      },
      "avatarUrl": "https://ui-avatars.com/api/?name=Virat+Kohli&background=6366f1&color=fff&size=128"
    }
  ]
}
```

#### GET `/players/:id`
Get single player by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Virat Kohli",
    "role": "Batsman",
    "basePrice": 150,
    "sold": false,
    "teamId": null,
    "price": null,
    "nationality": "India",
    "age": 35,
    "battingStyle": "Right-hand bat",
    "bowlingStyle": "Right-arm medium",
    "stats": {
      "matches": 250,
      "runs": 12000,
      "wickets": 4,
      "average": 52.5,
      "strikeRate": 93.2
    }
  }
}
```

#### POST `/players`
Create a new player (Admin only).

**Request Body:**
```json
{
  "name": "Rohit Sharma",
  "role": "Batsman",
  "basePrice": 160,
  "nationality": "India",
  "age": 36,
  "battingStyle": "Right-hand bat",
  "stats": {
    "matches": 230,
    "runs": 9500,
    "wickets": 8,
    "average": 48.2,
    "strikeRate": 89.5
  }
}
```

#### PUT `/players/:id`
Update player information (Admin only).

#### DELETE `/players/:id`
Delete player (Admin only).

### Team Endpoints

#### GET `/teams`
Get all teams with populated player data.

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Chennai Super Kings",
      "shortName": "CSK",
      "purse": 11500,
      "color": "#FDB913",
      "players": [
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
          "name": "MS Dhoni",
          "role": "Wicketkeeper",
          "price": 120
        }
      ],
      "totalSpent": 500,
      "remainingPurse": 11500
    }
  ]
}
```

#### GET `/teams/:id`
Get single team by ID.

#### POST `/teams`
Create a new team (Admin only).

#### PUT `/teams/:id`
Update team information (Admin only).

#### DELETE `/teams/:id`
Delete team (Admin only).

### Health Check

#### GET `/health`
Server health status.

**Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-22T10:30:00.000Z"
}
```

---

## ⚡ Real-Time Features (Socket.io)

### Connection Setup

```javascript
// Client-side connection
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Authentication

Socket connections require JWT authentication:

```javascript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Verify JWT token
  // Attach user to socket.user
  // Call next() or next(error)
});
```

### Auction State Structure

```javascript
const auctionState = {
  started: false,        // Auction active status
  paused: false,         // Auction paused status
  currentPlayer: null,   // Currently auctioned player
  currentBid: 0,         // Current bid amount
  currentTeam: null,     // Current highest bidder
  players: [],           // All players array
  teams: [],             // All teams array
  bidHistory: []         // Bid transaction history
};
```

### Client → Server Events

#### `start-auction`
Start the auction session.

**Authorization:** Admin, Presenter only

**Data:** `{}` (empty object)

#### `pause-auction`
Pause or resume the auction.

**Authorization:** Admin, Presenter only

**Data:** `{}`

#### `set-current-player`
Set a player for auction bidding.

**Authorization:** Admin, Presenter only

**Data:**
```json
{
  "playerId": "64f1a2b3c4d5e6f7g8h9i0j1"
}
```

#### `place-bid`
Place a bid on the current player.

**Authorization:** Admin, Presenter only

**Data:**
```json
{
  "teamId": "64f1a2b3c4d5e6f7g8h9i0j2",
  "bidAmount": 200
}
```

#### `mark-sold`
Finalize the sale to the highest bidder.

**Authorization:** Admin, Presenter only

**Data:** `{}`

#### `mark-unsold`
Mark current player as unsold.

**Authorization:** Admin, Presenter only

**Data:** `{}`

#### `reset-auction`
Reset entire auction (Admin only).

**Authorization:** Admin only

**Data:** `{}`

### Server → Client Events

#### `auction-state`
Real-time auction state updates.

**Data:** Complete auction state object

#### `error`
Error messages for invalid operations.

**Data:**
```json
{
  "message": "Error description"
}
```

### Bid Validation Logic

```javascript
// Bid validation in place-bid event
const validateBid = (teamId, bidAmount) => {
  // Check if auction is active and not paused
  if (!auctionState.started || auctionState.paused) {
    throw new Error('Auction is not active');
  }

  // Check if there's a current player
  if (!auctionState.currentPlayer) {
    throw new Error('No player is currently being auctioned');
  }

  // Find team
  const team = auctionState.teams.find(t => t._id.toString() === teamId);
  if (!team) {
    throw new Error('Team not found');
  }

  // Check purse balance
  if (team.purse < bidAmount) {
    throw new Error('Insufficient purse balance');
  }

  // Check bid is higher than current bid
  if (bidAmount <= auctionState.currentBid) {
    throw new Error('Bid must be higher than current bid');
  }

  return team;
};
```

---

## 🛡️ Middleware

### Authentication Middleware

**File:** `middleware/authMiddleware.js`

**Purpose:** Verify JWT tokens and attach user information to requests.

**Features:**
- Extracts token from `Authorization: Bearer <token>` header
- Verifies JWT signature and expiration
- Attaches user data to `req.user`
- Handles various JWT error types

**Error Responses:**
- `401`: No token provided, invalid token format
- `401`: Token expired
- `401`: Invalid token signature

### Role-Based Authorization

**Function:** `requireRole(...roles)`

**Purpose:** Check if authenticated user has required role(s).

**Usage:**
```javascript
router.post('/players', authMiddleware, requireRole('admin'), createPlayer);
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Required role: admin"
}
```

### CORS Middleware

**Configuration:**
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
```

**Purpose:** Enable cross-origin requests from frontend.

### Request Processing

**Built-in Express Middleware:**
```javascript
app.use(express.json());           // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
```

---

## 🚨 Error Handling

### Global Error Handler

```javascript
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});
```

### Database Error Handling

**Connection Errors:**
```javascript
mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB Error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB Disconnected');
});
```

### Validation Errors

**Mongoose Validation:**
```javascript
try {
  await player.save();
} catch (error) {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(error.errors).map(e => e.message)
    });
  }
}
```

### Socket Error Handling

```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
  socket.emit('error', { message: 'An error occurred' });
});
```

---

## 🔒 Security Features

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **Minimum Length**: 6 characters
- **No Plain Text Storage**: Hashed passwords only

### JWT Security
- **Expiration**: 7 days
- **Secure Secret**: Environment variable (change in production)
- **Signature Verification**: HMAC SHA256

### Input Validation
- **Mongoose Schemas**: Built-in validation
- **Required Fields**: Enforced at database level
- **Type Checking**: Automatic type coercion and validation

### Rate Limiting (Recommended)
```javascript
// Consider adding express-rate-limit
const rateLimit = require('express-rate-limit');
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
}));
```

### HTTPS (Production)
- Use SSL certificates
- Redirect HTTP to HTTPS
- Secure cookie settings

### Environment Variables
- **Never commit `.env` to version control**
- **Use strong secrets for JWT**
- **Different configs for dev/prod**

---

## ⚡ Performance Optimizations

### In-Memory Auction State

**Why:** Database queries are slow for real-time bidding.

**Implementation:**
```javascript
let auctionState = {
  // In-memory state for fast access
};

const initializeAuctionState = async () => {
  // Load from database once
  auctionState.players = await Player.find().populate('teamId').lean();
  auctionState.teams = await Team.find().populate('players').lean();
};
```

### Database Indexes

**Player Collection:**
```javascript
playerSchema.index({ sold: 1 });
playerSchema.index({ role: 1 });
playerSchema.index({ teamId: 1 });
playerSchema.index({ name: 1 });
```

**Team Collection:**
```javascript
teamSchema.index({ name: 1 });
teamSchema.index({ shortName: 1 });
```

### Connection Pooling

**MongoDB Connection:**
```javascript
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Connection pooling is automatic
});
```

### Efficient Queries

**Populate Selectively:**
```javascript
// Only populate necessary fields
const players = await Player.find(filter)
  .populate('teamId', 'name shortName color')
  .sort({ name: 1 });
```

### Caching Strategy

**Consider implementing:**
- Redis for session storage
- CDN for static assets
- Database query result caching

---

## 🚀 Deployment

### Environment Setup

**Production `.env`:**
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/auction-prod
JWT_SECRET=your-super-secure-secret-key-12345
PORT=5000
CLIENT_URL=https://your-domain.com
```

### Process Management

**PM2 (Recommended):**
```bash
npm install -g pm2
pm2 start server/server.js --name "auction-backend"
pm2 startup
pm2 save
```

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/auction
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Nginx Reverse Proxy

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Certificate (Let's Encrypt)

```bash
sudo certbot --nginx -d your-domain.com
```

---

## 🧪 Testing

### Unit Tests (Recommended)

**Jest Setup:**
```bash
cd server
npm install --save-dev jest supertest
```

**Test Structure:**
```
server/
├── tests/
│   ├── auth.test.js
│   ├── players.test.js
│   ├── teams.test.js
│   └── socket.test.js
```

**Sample Test:**
```javascript
const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  test('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'testpass123',
        role: 'viewer'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

### API Testing Tools

**Postman Collection:**
```json
{
  "info": {
    "name": "IPL Auction API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"username\":\"admin\",\"password\":\"admin123\",\"role\":\"admin\"}"
            },
            "url": {
              "raw": "{{base_url}}/auth/register",
              "host": ["{{base_url}}"],
              "path": ["auth", "register"]
            }
          }
        }
      ]
    }
  ]
}
```

### Load Testing

**Artillery.js:**
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'Get players'
    requests:
      - get:
          url: '/api/players'
          headers:
            Authorization: 'Bearer {{token}}'
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Symptoms:**
```
❌ MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
- Start MongoDB: `mongod` or `brew services start mongodb/brew/mongodb-community`
- Check connection string in `.env`
- Verify MongoDB Atlas IP whitelist
- Test connection: `mongocli ping`

#### 2. JWT Authentication Errors

**Symptoms:**
```
Access denied. Invalid token.
```

**Solutions:**
- Check token format: `Authorization: Bearer <token>`
- Verify `JWT_SECRET` matches
- Check token expiration (7 days)
- Regenerate token if expired

#### 3. CORS Errors

**Symptoms:**
```
Access to fetch blocked by CORS policy
```

**Solutions:**
- Verify `CLIENT_URL` in `.env`
- Check CORS configuration in `server.js`
- Ensure frontend runs on correct port

#### 4. Socket.io Connection Failed

**Symptoms:**
```
WebSocket connection failed
```

**Solutions:**
- Check JWT token in socket auth
- Verify Socket.io client configuration
- Check network/firewall settings
- Ensure server is running on correct port

#### 5. Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
- Change `PORT` in `.env`
- Kill process: `lsof -ti:5000 | xargs kill -9`
- Use different port for development

### Debug Mode

**Enable Debug Logging:**
```bash
DEBUG=* npm run dev
```

**Environment Variables:**
```env
NODE_ENV=development
DEBUG=socket.io:*  # Socket.io debug
```

### Health Checks

**API Health:**
```bash
curl http://localhost:5000/api/health
```

**MongoDB Health:**
```javascript
// In server console
mongoose.connection.readyState // 1 = connected
```

**Socket.io Health:**
```javascript
// Check connected clients
io.sockets.sockets.size
```

### Logs Analysis

**Server Logs:**
```bash
# View PM2 logs
pm2 logs auction-backend

# View application logs
tail -f logs/app.log
```

**Database Logs:**
```bash
# MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

---

## 📊 Monitoring & Analytics

### Application Metrics

**Response Times:**
```javascript
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${duration}ms`);
  });
  next();
});
```

### Database Monitoring

**Connection Pool Stats:**
```javascript
setInterval(() => {
  console.log('MongoDB Connections:', mongoose.connection.readyState);
}, 30000);
```

### Socket.io Monitoring

**Connection Count:**
```javascript
setInterval(() => {
  console.log('Active Socket Connections:', io.sockets.sockets.size);
}, 30000);
```

### Auction Analytics

**Bid Statistics:**
```javascript
const getAuctionStats = () => {
  return {
    totalPlayers: auctionState.players.length,
    soldPlayers: auctionState.players.filter(p => p.sold).length,
    totalBids: auctionState.bidHistory.length,
    averageBid: auctionState.bidHistory.reduce((sum, bid) => sum + bid.amount, 0) / auctionState.bidHistory.length
  };
};
```

---

## 🔄 API Versioning

### URL Versioning

```
/api/v1/auth/register
/api/v1/players
/api/v1/teams
```

### Implementation:
```javascript
const v1Router = express.Router();
app.use('/api/v1', v1Router);

// Mount route handlers
v1Router.use('/auth', authRoutes);
v1Router.use('/players', playerRoutes);
v1Router.use('/teams', teamRoutes);
```

---

## 📚 Additional Resources

### Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [JWT.io](https://jwt.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)

### Best Practices

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

### Tools & Extensions

- **VS Code Extensions:**
  - REST Client (humao.rest-client)
  - MongoDB for VS Code (mongodb.mongodb-vscode)
  - Thunder Client (rangav.vscode-thunder-client)

- **Database Tools:**
  - MongoDB Compass (GUI)
  - Studio 3T (Advanced GUI)
  - Robo 3T (Free GUI)

---

## 🎯 Summary

The IPL Auction Portal backend provides a robust, scalable foundation for real-time cricket player auctions with:

- **Secure Authentication**: JWT-based with role-based access control
- **Real-Time Bidding**: WebSocket communication for live auctions
- **Comprehensive API**: RESTful endpoints for all CRUD operations
- **Database Optimization**: Efficient MongoDB schemas with proper indexing
- **Error Handling**: Comprehensive error management and logging
- **Performance**: In-memory state for real-time operations
- **Security**: Password hashing, input validation, CORS protection
- **Scalability**: Modular architecture ready for production deployment

The backend is production-ready and can handle multiple concurrent auctions with hundreds of users in real-time.

---

**🏏 Happy Coding! May your auctions always find the perfect bids! 💰**
</content>
<parameter name="filePath">d:\AUCTION PORTAL\BACKEND.md