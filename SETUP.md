# 🚀 Backend Setup Guide - IPL Auction Portal

This guide will help you set up and run the complete Node.js backend for the IPL Auction Portal.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community) OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **npm** or **yarn** package manager
- **Git** (optional)

## 🛠️ Installation Steps

### Step 1: Install Backend Dependencies

Navigate to the server directory and install all required packages:

```powershell
cd server
npm install
```

This will install:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **socket.io** - Real-time communication
- **cors** - Cross-origin resource sharing
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **nodemon** - Auto-restart during development

### Step 2: Install Root Dependencies

Go back to root and install concurrently:

```powershell
cd ..
npm install
```

### Step 3: Start MongoDB

**Option A: Using the provided script (Recommended)**

For Windows PowerShell:
```powershell
.\start-mongodb.ps1
```

For Windows Command Prompt:
```cmd
start-mongodb.bat
```

**Option B: Manual MongoDB Start**

1. Open a new terminal/command prompt
2. Create data directory: `mkdir C:\data\db`
3. Start MongoDB: `mongod --dbpath "C:\data\db"`

**Option C: MongoDB Atlas (Cloud)**
- No local installation needed
- Update `MONGO_URI` in `server/.env` with your Atlas connection string

### Step 4: Test Backend Connection

Run the test script to verify everything is working:

```powershell
.\test-backend.ps1
```

This will check if the backend is running and provide next steps.

### Step 4: Configure Environment Variables

Edit `server/.env` file with your configuration:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/auction-portal
# OR for Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/auction-portal

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-key-change-this-in-production-12345

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

⚠️ **IMPORTANT**: Change `JWT_SECRET` to a strong random string in production!

## 🚀 Running the Application

### Method 1: Run Both Frontend & Backend Together (Recommended)

From the root directory:

```powershell
npm start
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

### Method 2: Run Backend Only

```powershell
cd server
npm run dev
```

Server will start with nodemon (auto-restart on file changes)

### Method 3: Production Mode

```powershell
cd server
npm start
```

## 🔐 Initial Setup - Create Users

### Create Admin User

Open PowerShell and run:

```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"admin123\",\"role\":\"admin\"}'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "username": "admin",
      "role": "admin"
    }
  }
}
```

### Create Presenter User

```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"presenter\",\"password\":\"present123\",\"role\":\"presenter\"}'
```

### Create Viewer User

```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"viewer\",\"password\":\"view123\",\"role\":\"viewer\"}'
```

## 📡 Testing the API

### Health Check

```powershell
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Login

```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"admin123\"}'
```

**Save the token from response!**

### Get All Players (Protected Route)

```powershell
curl http://localhost:5000/api/players `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🏗️ Database Schema Overview

### User Collection
```javascript
{
  username: String (unique),
  password: String (hashed),
  role: String (admin/presenter/viewer),
  createdAt: Date,
  updatedAt: Date
}
```

### Player Collection
```javascript
{
  name: String,
  role: String (Batsman/Bowler/All-rounder/Wicketkeeper),
  basePrice: Number,
  sold: Boolean,
  teamId: ObjectId (ref: Team),
  price: Number,
  nationality: String,
  age: Number,
  battingStyle: String,
  bowlingStyle: String,
  image: String,
  stats: {
    matches: Number,
    runs: Number,
    wickets: Number,
    average: Number,
    strikeRate: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Team Collection
```javascript
{
  name: String,
  shortName: String,
  purse: Number (default: 12000),
  logo: String,
  color: String,
  players: [ObjectId] (ref: Player),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 API Endpoints Reference

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/verify` | Verify JWT token |

### Players (Protected)
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/players` | Get all players | Any authenticated |
| GET | `/api/players/:id` | Get single player | Any authenticated |
| POST | `/api/players` | Create player | Admin |
| PUT | `/api/players/:id` | Update player | Admin |
| DELETE | `/api/players/:id` | Delete player | Admin |

### Teams (Protected)
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/teams` | Get all teams | Any authenticated |
| GET | `/api/teams/:id` | Get single team | Any authenticated |
| POST | `/api/teams` | Create team | Admin |
| PUT | `/api/teams/:id` | Update team | Admin |
| DELETE | `/api/teams/:id` | Delete team | Admin |

## 🔌 Socket.io Events

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'your-jwt-token' }
});
```

### Events (Admin/Presenter Only)
- `start-auction` - Start the auction
- `pause-auction` - Pause/resume auction
- `set-current-player` - Set player for bidding
- `place-bid` - Place bid with teamId and amount
- `mark-sold` - Finalize sale to highest bidder
- `mark-unsold` - Mark player as unsold
- `reset-auction` - Reset entire auction (Admin only)

### Events (All Users Receive)
- `auction-state` - Real-time auction state updates
- `error` - Error messages

## 📊 Sample Data Creation

### Create a Team

```powershell
$token = "YOUR_JWT_TOKEN"
curl -X POST http://localhost:5000/api/teams `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Chennai Super Kings\",\"shortName\":\"CSK\",\"purse\":12000,\"color\":\"#FDB913\"}'
```

### Create a Player

```powershell
$token = "YOUR_JWT_TOKEN"
curl -X POST http://localhost:5000/api/players `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"MS Dhoni\",\"role\":\"Wicketkeeper\",\"basePrice\":200,\"nationality\":\"India\",\"age\":42,\"battingStyle\":\"Right-hand bat\",\"stats\":{\"matches\":250,\"runs\":5000,\"average\":38.5,\"strikeRate\":135.2}}'
```

## 🐛 Troubleshooting

### Issue: MongoDB Connection Failed

**Error:**
```
❌ MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. Check if MongoDB is running: `mongod` or `net start MongoDB`
2. Verify `MONGO_URI` in `.env`
3. For Atlas, check IP whitelist and credentials

### Issue: Port 5000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
Change `PORT` in `server/.env` to another port (e.g., 5001)

### Issue: JWT Authentication Failed

**Error:**
```
Access denied. Invalid token.
```

**Solutions:**
1. Check token format: `Authorization: Bearer <token>`
2. Verify token hasn't expired (7 day expiry)
3. Ensure `JWT_SECRET` matches across requests

### Issue: CORS Error from Frontend

**Error:**
```
Access to fetch blocked by CORS policy
```

**Solutions:**
1. Verify `CLIENT_URL` in `server/.env` matches frontend URL
2. Check CORS configuration in `server/server.js`
3. Ensure frontend is running on http://localhost:5173

## 📚 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/auction-portal` | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `PORT` | Server port | `5000` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` | No |

## 🔒 Security Best Practices

1. **Change JWT_SECRET**: Use a strong random string (min 32 characters)
2. **Password Requirements**: Minimum 6 characters (increase for production)
3. **HTTPS in Production**: Use SSL certificates
4. **Environment Variables**: Never commit `.env` to version control
5. **Rate Limiting**: Consider adding rate limiting middleware
6. **Input Validation**: All inputs are validated via Mongoose schemas

## 📝 Next Steps

1. ✅ Install dependencies
2. ✅ Configure MongoDB
3. ✅ Update `.env` file
4. ✅ Start the server
5. ✅ Create users (admin, presenter, viewer)
6. ✅ Test API endpoints
7. ✅ Run frontend with `npm start`
8. 🎯 Start building your auction!

## 🐛 Troubleshooting

### Issue: Duplicate Schema Index Warnings

**Symptoms:**
```
[Mongoose] Warning: Duplicate schema index on {"name":1} found.
[Mongoose] Warning: Duplicate schema index on {"shortName":1} found.
[Mongoose] Warning: Duplicate schema index on {"username":1} found.
```

**Solution:** ✅ **Fixed** - Removed duplicate index definitions in model files.

### Issue: Deprecated MongoDB Options

**Symptoms:**
```
[MongoDB Driver] Warning: useNewUrlParser is a deprecated option
[MongoDB Driver] Warning: useUnifiedTopology is a deprecated option
```

**Solution:** ✅ **Fixed** - Removed deprecated options from database connection.

### Issue: MongoDB Connection Timeout

**Symptoms:**
```
❌ Failed to initialize auction state: MongooseError: Operation `players.find()` buffering timed out after 10000ms
```

**Solutions:**
1. **Start MongoDB** using the provided scripts:
   ```powershell
   .\start-mongodb.ps1
   ```
2. **Check MongoDB status:**
   ```powershell
   net start | findstr MongoDB
   ```
3. **Verify connection string** in `server/.env`
4. **Use MongoDB Atlas** if local installation fails

### Issue: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Change port in `server/.env`: `PORT=5001`
2. Kill process on port 5000:
   ```powershell
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

### Issue: CORS Errors

**Symptoms:**
```
Access to fetch blocked by CORS policy
```

**Solutions:**
1. Verify `CLIENT_URL` in `server/.env` matches frontend URL
2. Check CORS configuration in `server/server.js`
3. Ensure frontend runs on correct port (5173)

## 🆘 Need Help?

- Check server logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure MongoDB is accessible
- Test with simple curl commands first
- Check network connectivity and firewall settings

---

**Happy Coding! 🏏💰**
