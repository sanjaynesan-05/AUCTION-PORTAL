#!/bin/bash
# IPL Auction Portal - Quick Start Guide

echo "=================================================="
echo "🏏 IPL AUCTION PORTAL - QUICK START"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "Step 1: Starting Backend..."
echo "================================"
cd backend
echo "✓ Activating virtual environment..."
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    .\venv\Scripts\Activate.ps1
    .\venv\Scripts\python.exe src/main.py &
else
    # Unix/Mac
    source venv/bin/activate
    python src/main.py &
fi

BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID)"
echo "  📍 API: http://localhost:8000"
echo "  📚 Docs: http://localhost:8000/docs"
echo ""

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
sleep 5

echo "Step 2: Starting Frontend..."
echo "================================"
cd ../frontend
echo "✓ Installing dependencies..."
npm install > /dev/null 2>&1 || npm ci > /dev/null 2>&1

echo "✓ Starting dev server..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    npm run dev &
else
    npm run dev &
fi

FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID)"
echo "  🌐 App: http://localhost:5173"
echo ""

echo "=================================================="
echo "✅ SYSTEM STARTED!"
echo "=================================================="
echo ""
echo "📱 Open in browser:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "🛑 To stop:"
echo "   Press Ctrl+C in both terminal windows"
echo ""
echo "📝 Verify system:"
echo "   python verify_system.py"
echo ""
echo "=================================================="
wait $BACKEND_PID $FRONTEND_PID
