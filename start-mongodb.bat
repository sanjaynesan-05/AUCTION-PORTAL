@echo off
echo ============================================
echo    IPL Auction Portal - MongoDB Setup
echo ============================================
echo.

echo Checking MongoDB installation...
where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ MongoDB is not installed or not in PATH
    echo.
    echo Please install MongoDB:
    echo 1. Download from: https://www.mongodb.com/try/download/community
    echo 2. Install and add to PATH
    echo 3. Or use MongoDB Atlas (cloud)
    echo.
    pause
    exit /b 1
)

echo ✅ MongoDB found in PATH
echo.

echo Starting MongoDB...
echo Note: This will start MongoDB in the foreground.
echo Press Ctrl+C to stop MongoDB when done.
echo.

mongod --dbpath "C:\data\db" --logpath "C:\data\log\mongod.log"

echo.
echo MongoDB stopped.
pause