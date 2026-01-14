@echo off
REM IPL Auction Portal - Quick Start (Windows)

cls
echo ====================================
echo 🏏 IPL AUCTION PORTAL - QUICK START
echo ====================================
echo.

REM Check if we're in the right directory
if not exist "frontend" (
    echo ❌ Error: Run this from the project root directory
    pause
    exit /b 1
)

if not exist "backend" (
    echo ❌ Error: Run this from the project root directory
    pause
    exit /b 1
)

echo Step 1: Checking Backend Setup...
echo ====================================
cd backend

if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

echo ✓ Backend ready
echo.

echo Step 2: Starting Backend Server...
echo ====================================
echo Starting FastAPI server on port 8000...
echo 📍 API: http://localhost:8000
echo 📚 Docs: http://localhost:8000/docs
echo.
echo (Backend window will open. Keep it running.)
echo.
pause

start cmd /k "cd backend && .\venv\Scripts\Activate.ps1 && .\venv\Scripts\python.exe src/main.py"

timeout /t 5 /nobreak

echo.
echo Step 3: Starting Frontend Server...
echo ====================================
cd ..
cd frontend

echo Checking npm...
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm not found! Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Installing dependencies (first time only)...
call npm install >nul 2>&1

echo Starting Vite dev server on port 5173...
echo 🌐 App: http://localhost:5173
echo.

start cmd /k "npm run dev"

echo.
echo ====================================
echo ✅ SYSTEM STARTED!
echo ====================================
echo.
echo 📱 Open in your browser:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo 🛑 To stop:
echo    Close both command windows
echo.
echo 📝 To verify system is working:
echo    In project root, run:
echo    python.exe verify_system.py
echo.
echo ====================================
pause
