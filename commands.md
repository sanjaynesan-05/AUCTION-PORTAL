# Running the IPL Auction Portal

### 1. Frontend
From the root directory (`d:\AUCTION-PORTAL`):
```powershell
npm run dev
```

### 2. Backend
From the root directory:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```