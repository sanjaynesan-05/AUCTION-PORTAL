# Backend Setup Guide - IPL Auction Portal

## Quick Start

### Windows (PowerShell)

1. **Navigate to backend folder:**
   ```powershell
   cd backend
   ```

2. **Run the startup script:**
   ```powershell
   .\run.ps1
   ```

3. **Or manually:**
   ```powershell
   # Activate virtual environment
   .\venv\Scripts\Activate.ps1
   
   # Install dependencies (first time only)
   pip install -r requirements.txt
   
   # Run the server
   python src/main.py
   ```

### Windows (Command Prompt)

```batch
cd backend
run.bat
```

### macOS/Linux

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python src/main.py
```

## Virtual Environment Management

### View Virtual Environment Info
```bash
python -m venv --version
pip --version
pip list
```

### Add New Dependencies
```bash
pip install package_name
pip freeze > requirements.txt
```

### Remove Dependencies
```bash
pip uninstall package_name
pip freeze > requirements.txt
```

### Reinstall from requirements.txt
```bash
pip install -r requirements.txt --force-reinstall
```

### Deactivate Virtual Environment
```bash
# Windows
deactivate

# macOS/Linux
deactivate
```

## Database Setup (NEON)

### Step 1: Create NEON Account
- Go to [https://neon.tech](https://neon.tech)
- Sign up for free account
- Create new PostgreSQL database

### Step 2: Get Connection String
1. Go to NEON Console
2. Select your project
3. Click "CONNECTION STRING" tab
4. Copy the full connection string

### Step 3: Update .env File
```env
DATABASE_URL=postgresql://user:password@ep-xxxxx.region.aws.neon.tech/auction_portal?sslmode=require
```

### Step 4: Initialize Database
```python
from config.database import init_db
init_db()
```

## Server Testing

### Health Check
```bash
curl http://localhost:8000/api/health
```

### API Documentation
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Test Server is Running
```bash
python -c "import requests; print(requests.get('http://localhost:8000/api/health').json())"
```

## Common Commands

### Install all requirements
```bash
pip install -r requirements.txt
```

### Check installed packages
```bash
pip list
```

### Run in development mode (with auto-reload)
```bash
uvicorn src.main:app --reload
```

### Run in production mode
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

### Run tests
```bash
pytest
```

### Check Python version
```bash
python --version
```

## Troubleshooting

### Virtual Environment Issues
```bash
# Remove old virtual environment
rm -r venv  # macOS/Linux
rmdir /s venv  # Windows

# Create new one
python -m venv venv
```

### Database Connection Failed
- Check `.env` file exists and has correct DATABASE_URL
- Verify NEON project is active
- Check if IP is whitelisted in NEON console
- Try connecting with psql: `psql "your_connection_string"`

### Port 8000 Already in Use
```bash
# Change port in .env
PORT=8001

# Or use uvicorn directly
uvicorn src.main:app --port 8001
```

### Missing Dependencies
```bash
pip install -r requirements.txt --force-reinstall
```

## Project Structure

```
backend/
├── src/
│   └── main.py                 # FastAPI app entry point
├── config/
│   ├── database.py             # PostgreSQL + SQLAlchemy setup
│   └── __init__.py
├── models/
│   ├── models.py               # Database models (User, Team, Player, etc.)
│   └── __init__.py
├── routes/
│   ├── __init__.py
│   └── (auth.py, players.py, teams.py, auction.py - to be created)
├── controllers/
│   ├── __init__.py
│   └── (auth.py, players.py, teams.py, auction.py - to be created)
├── middleware/
│   └── __init__.py
├── utils/
│   └── __init__.py
├── venv/                       # Virtual environment folder
├── .env                        # Environment variables (update this!)
├── .env.example                # Example environment file
├── .gitignore                  # Git ignore rules
├── requirements.txt            # Python dependencies
├── README.md                   # Backend documentation
├── run.bat                     # Windows startup script
├── run.ps1                     # PowerShell startup script
└── SETUP.md                    # This file
```

## Environment Variables (.env)

```env
# Server
PORT=8000
ENVIRONMENT=development

# Database (NEON PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-xxxxx.region.aws.neon.tech/auction_portal?sslmode=require

# JWT
JWT_SECRET=your_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=INFO
SQL_ECHO=False
```

## Next Steps

1. ✅ Backend structure created
2. ✅ Virtual environment set up
3. ✅ Dependencies installed
4. ✅ FastAPI server ready
5. ⏳ Update DATABASE_URL in .env with your NEON credentials
6. ⏳ Implement API routes
7. ⏳ Create authentication system
8. ⏳ Test with frontend

## Support

For issues:
1. Check `.env` file configuration
2. Verify NEON database connection
3. Check Python version (3.8+)
4. Review FastAPI documentation
5. Check error logs in console

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [NEON Cloud Database](https://neon.tech)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Pydantic Validation](https://docs.pydantic.dev/)
- [Uvicorn Server](https://www.uvicorn.org/)
