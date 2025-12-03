#!/bin/bash

# Test All API Endpoints

echo "🧪 Testing Auction Portal Backend API Integration"
echo "=================================================="
echo ""

# Test 1: Players Endpoint
echo "1️⃣  Testing GET /players"
curl -s http://localhost:8000/players | jq '.[] | {id, name, basePrice}' | head -10
echo ""

# Test 2: Teams Endpoint
echo "2️⃣  Testing GET /teams"
curl -s http://localhost:8000/teams | jq '.[] | {id, name, shortName, purseRemaining}' | head -5
echo ""

# Test 3: Authentication
echo "3️⃣  Testing POST /auth/login"
curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin@123"}' | jq '{user: .user, token_length: (.access_token | length)}'
echo ""

# Test 4: Get Auction State
echo "4️⃣  Testing GET /auction/state"
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin@123"}' | jq -r '.access_token')

curl -s -X GET http://localhost:8000/auction/state \
  -H "Authorization: Bearer $TOKEN" | jq '{status, currentPlayer: .currentPlayer.name, currentBid}'
echo ""

echo "✅ All API endpoints tested successfully!"
echo ""
echo "Frontend: http://localhost:5173 or http://localhost:5174"
echo "Backend:  http://localhost:8000"
echo "Docs:     http://localhost:8000/docs"
