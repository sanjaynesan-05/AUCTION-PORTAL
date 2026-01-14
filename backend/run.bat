@echo off
REM Activation script for backend development

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Check if dependencies are installed
pip show fastapi > nul
if %errorlevel% neq 0 (
    echo Installing dependencies...
    pip install -r requirements.txt
)

REM Run the server
echo.
echo ========================================
echo 🚀 IPL Auction Portal Backend
echo ========================================
echo.
echo FastAPI Server starting...
echo Access API docs at: http://localhost:8000/docs
echo.
python src/main.py

pause
