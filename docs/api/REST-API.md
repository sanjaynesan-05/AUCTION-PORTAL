# 📡 REST API Reference

Complete HTTP API documentation for the IPL Auction Portal.

## 🔐 Authentication

All endpoints (except login/register) require JWT authentication.

### Authorization Header
```
Authorization: Bearer <jwt-token>
```

### Token Format
```javascript
{
  id: "user-uuid",
  username: "username",
  role: "admin" | "presenter" | "viewer",
  teamId: "team-uuid" | null,  // For viewers only
  exp: 1234567890  // Expiration timestamp
}
```

---

## 🔑 Authentication Endpoints

### POST /api/auth/login
Login and receive JWT token.

**Request:**
```json
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid",
      "username": "admin",
      "role": "admin"
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing username/password
- `401` - Invalid credentials
- `500` - Server error

---

### POST /api/auth/register
Register a new user (admin only).

**Request:**
```json
POST /api/auth/register
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "username": "new_user",
  "password": "password123",
  "role": "viewer",
  "teamId": "team-uuid"  // Optional, for viewers
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "new-user-uuid",
      "username": "new_user",
      "role": "viewer"
    }
  }
}
```

**Status Codes:**
- `201` - Created
- `400` - Validation error
- `401` - Not authenticated
- `403` - Not authorized (not admin)

---

### GET /api/auth/verify
Verify JWT token validity.

**Request:**
```
GET /api/auth/verify
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "username": "admin",
    "role": "admin"
  }
}
```

---

## 👥 Player Endpoints

### GET /api/players
Get all players (filtered by role).

**Permissions:**
- Admin/Presenter: All players
- Viewer: Only their team's players

**Request:**
```
GET /api/players
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status: `available`, `sold`, `unsold`
- `role` - Filter by player role: `Batsman`, `Bowler`, etc.
- `teamId` - Filter by team (admin/presenter only)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "player-uuid",
      "name": "MS Dhoni",
      "role": "WK-Batsman",
      "basePrice": 200,
      "soldPrice": 200,
      "status": "sold",
      "teamId": "csk-uuid",
      "nationality": "India",
      "age": 42,
      "battingStyle": "Right-hand bat",
      "bowlingStyle": null,
      "team": {
        "id": "csk-uuid",
        "name": "Chennai Super Kings",
        "shortName": "CSK",
        "color": "#FFFF00"
      }
    }
  ]
}
```

---

### GET /api/players/:id
Get specific player details.

**Request:**
```
GET /api/players/player-uuid
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "player-uuid",
    "name": "MS Dhoni",
    "role": "WK-Batsman",
    "basePrice": 200,
    "soldPrice": 200,
    "status": "sold",
    "teamId": "csk-uuid",
    "stats": {
      "matches": 234,
      "runs": 5082,
      "average": 39.4
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `403` - Forbidden (viewer accessing other team's player)
- `404` - Player not found

---

### POST /api/players
Create a new player (admin only).

**Request:**
```json
POST /api/players
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Virat Kohli",
  "role": "Batsman",
  "basePrice": 200,
  "nationality": "India",
  "age": 36,
  "battingStyle": "Right-hand bat",
  "stats": {
    "matches": 223,
    "runs": 7263,
    "average": 49.4
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Player created successfully.",
  "data": {
    "id": "new-player-uuid",
    "name": "Virat Kohli",
    "role": "Batsman",
    "basePrice": 200,
    "status": "available"
  }
}
```

---

### PUT /api/players/:id
Update player details (admin only).

**Request:**
```json
PUT /api/players/player-uuid
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "soldPrice": 180,
  "teamId": "rcb-uuid",
  "status": "sold"
}
```

---

### DELETE /api/players/:id
Delete a player (admin only).

**Request:**
```
DELETE /api/players/player-uuid
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Player deleted successfully."
}
```

---

## 🏆 Team Endpoints

### GET /api/teams
Get all teams (filtered by role).

**Permissions:**
- Admin/Presenter: All teams
- Viewer: Only their team

**Request:**
```
GET /api/teams
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "csk-uuid",
      "name": "Chennai Super Kings",
      "shortName": "CSK",
      "purse": 200,
      "logo": "csk.png",
      "color": "#FFFF00",
      "totalPlayers": 18,
      "purseSpent": 800
    }
  ]
}
```

---

### GET /api/teams/:id
Get specific team details.

**Permissions:**
- Admin/Presenter: Any team
- Viewer: Only their team (403 for others)

**Request:**
```
GET /api/teams/team-uuid
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "csk-uuid",
    "name": "Chennai Super Kings",
    "shortName": "CSK",
    "purse": 200,
    "purseSpent": 800,
    "purseRemaining": 200,
    "totalPlayers": 18,
    "players": [
      {
        "id": "player-uuid",
        "name": "MS Dhoni",
        "role": "WK-Batsman",
        "soldPrice": 200
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `403` - Forbidden (viewer accessing other team)
- `404` - Team not found

---

### GET /api/teams/my-team
Get viewer's own team (viewers only).

**Request:**
```
GET /api/teams/my-team
Authorization: Bearer <viewer-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "csk-uuid",
    "name": "Chennai Super Kings",
    "shortName": "CSK",
    "purse": 200,
    "purseSpent": 800,
    "purseRemaining": 200,
    "totalPlayers": 18,
    "players": [
      {
        "id": "player-uuid",
        "name": "MS Dhoni",
        "role": "WK-Batsman",
        "soldPrice": 200,
        "status": "sold"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `403` - Not a viewer or no team assigned
- `404` - Team not found

---

### PUT /api/teams/:id
Update team details (admin only).

**Request:**
```json
PUT /api/teams/team-uuid
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "purse": 1000,
  "logo": "new-logo.png"
}
```

---

## 🔒 Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful.",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (dev mode only)"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    "Username is required",
    "Password must be at least 6 characters"
  ]
}
```

---

## 📊 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT request |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

---

## 🛡️ Security Features

### Rate Limiting
Authentication endpoints are rate-limited:
- **Limit**: 5 requests per 15 minutes per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

### CORS
Allowed origins:
- `http://localhost:5173` (frontend dev)
- `http://localhost:3000` (alternative)
- Production domain (configure in .env)

### Input Validation
All inputs are validated and sanitized using Express Validator.

---

## 🧪 Testing with curl

### Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get All Players (as Admin)
```bash
curl -X GET http://localhost:5000/api/players \
  -H "Authorization: Bearer <admin-token>"
```

### Get My Team (as Viewer)
```bash
curl -X GET http://localhost:5000/api/teams/my-team \
  -H "Authorization: Bearer <viewer-token>"
```

---

## 🔗 Related Documentation

- [WebSocket Events](WEBSOCKET-EVENTS.md) - Real-time API
- [RBAC Permissions](../features/RBAC.md) - Role permissions
- [Test Accounts](../guides/TEST-ACCOUNTS.md) - Test credentials
- [Testing Guide](../guides/TESTING.md) - Testing instructions

---

**Base URL**: `http://localhost:5000/api`  
**Last Updated**: January 30, 2025  
**API Version**: 1.0.0
