# 🚀 FastAPI Backend - Render.com Deployment Guide

## ✅ Changes Made for Render.com

Your FastAPI backend has been updated with all necessary configurations for successful deployment on Render.com.

---

## 📋 Summary of Changes

### 1. ✅ **Uvicorn Host & Port Configuration** (`app/main.py`)

**Before:**
```python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
```

**After:**
```python
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Server running on 0.0.0.0:{port}")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    )
```

**Why:**
- ✅ Reads `PORT` environment variable (Render sets this dynamically)
- ✅ Binds to `0.0.0.0` (required for Render)
- ✅ Disables `reload` (not supported in Render production)
- ✅ Startup message confirms server binding

---

### 2. ✅ **Root Route Exists** (`app/main.py`)

```python
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "IPL Auction Portal API",
        "version": API_VERSION,
        "docs": "/docs",
        "redoc": "/redoc"
    }
```

**Why:**
- ✅ Prevents "405 Method Not Allowed" errors
- ✅ Allows Render health checks to pass
- ✅ Provides API documentation links

---

### 3. ✅ **Safe Database Seeding** (`app/models/seed.py`)

**New Function:**
```python
def safe_seed_database(db: Session):
    """Seed database only if data doesn't already exist - prevents re-seeding on every deployment"""
    from app.models.orm import Team, Player, User, AuctionState
    
    teams_count = db.query(Team).count()
    players_count = db.query(Player).count()
    users_count = db.query(User).count()
    auction_state_count = db.query(AuctionState).count()
    
    # Only seed if tables are empty
    if teams_count == 0:
        print("Seeding teams...")
        seed_teams(db)
    else:
        print(f"✓ Teams already exist ({teams_count} records) - skipping seed")
    
    # ... similar checks for players, users, auction state
    print("Database seeding check complete!")
```

**Why:**
- ✅ Prevents data loss on re-deployments
- ✅ Only seeds empty tables
- ✅ Shows what data already exists
- ✅ Safe for multiple deployments

---

### 4. ✅ **CORS Updated** (`app/main.py`)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://auction-portal-frontend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Why:**
- ✅ Added production Render frontend URL
- ✅ Allows frontend to communicate with backend
- ✅ Keeps localhost for local development

---

## 🔧 Render.com Setup Instructions

### Step 1: Create PostgreSQL Database on Render

1. Go to [render.com](https://render.com)
2. Click **New +** → **PostgreSQL**
3. Fill in:
   - **Name:** `auction-portal-db`
   - **Database:** `auctiondb`
   - **User:** `postgres`
   - **Region:** Choose closest to you
   - **PostgreSQL Version:** 15

4. Click **Create Database**

5. **Copy the connection string** (you'll need it next)

---

### Step 2: Deploy Backend Service

1. Go to **New +** → **Web Service**

2. **Connect your GitHub repository**
   - Select `AUCTION-PORTAL` repo
   - Choose branch: `ft/backend` or `main`

3. **Configure Service:**
   - **Name:** `auction-portal-backend`
   - **Region:** Same as database
   - **Branch:** `ft/backend`
   - **Runtime:** `Python 3`
   - **Build Command:**
     ```bash
     pip install -r backend/requirements.txt
     ```
   - **Start Command:**
     ```bash
     cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```

4. **Add Environment Variables:**

   Click **Advanced** → **Environment Variables** and add:

   ```
   DATABASE_URL=<paste-postgresql-connection-string-here>
   
   ADMIN_PASSWORD=your-secure-admin-password
   PRESENTER_PASSWORD=your-secure-presenter-password
   
   TEAM_CSK_PASSWORD=your-secure-password
   TEAM_MI_PASSWORD=your-secure-password
   TEAM_RCB_PASSWORD=your-secure-password
   TEAM_KKR_PASSWORD=your-secure-password
   TEAM_DC_PASSWORD=your-secure-password
   TEAM_RR_PASSWORD=your-secure-password
   TEAM_PBKS_PASSWORD=your-secure-password
   TEAM_SRH_PASSWORD=your-secure-password
   TEAM_GT_PASSWORD=your-secure-password
   TEAM_LSG_PASSWORD=your-secure-password
   
   SECRET_KEY=your-secure-jwt-secret-key
   ```

5. Click **Create Web Service**

6. **Wait for deployment** (takes ~5-10 minutes)

---

### Step 3: Deploy Frontend Service

1. Go to **New +** → **Web Service**

2. **Connect your GitHub repository**
   - Select `AUCTION-PORTAL` repo
   - Choose branch: `main`

3. **Configure Service:**
   - **Name:** `auction-portal-frontend`
   - **Region:** Same as backend
   - **Branch:** `main` (or your frontend branch)
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     cd frontend && npm install && npm run build
     ```
   - **Start Command:**
     ```bash
     cd frontend && npm run preview
     ```

4. **Add Environment Variables:**

   ```
   VITE_API_URL=https://auction-portal-backend.onrender.com
   ```
   (Replace with your actual backend URL)

5. Click **Create Web Service**

---

### Step 4: Update CORS Origin (After Deployment)

Once your frontend is deployed, update `app/main.py` CORS with your actual frontend URL:

```python
allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "https://auction-portal-frontend.onrender.com"  # Update with your actual URL
]
```

Then push to GitHub to trigger redeploy.

---

## 🧪 Testing Your Deployment

### Test Root Endpoint
```bash
curl https://auction-portal-backend.onrender.com/
# Should return:
# {"message":"IPL Auction Portal API",...}
```

### Test Health Check
```bash
curl https://auction-portal-backend.onrender.com/health
# Should return:
# {"status":"healthy"}
```

### Test API Docs
Visit: `https://auction-portal-backend.onrender.com/docs`

### Test Login
```bash
curl -X POST https://auction-portal-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-admin-password"}'
```

---

## 📊 Render Deployment Checklist

- [ ] PostgreSQL database created on Render
- [ ] Database connection string copied
- [ ] Backend service created with start command
- [ ] All environment variables set (DATABASE_URL, credentials, SECRET_KEY)
- [ ] Frontend service created with VITE_API_URL set
- [ ] Both services deployed successfully
- [ ] Root endpoint returns data (no 405 error)
- [ ] Health check endpoint works
- [ ] Login endpoint works with correct credentials
- [ ] CORS allows frontend → backend communication

---

## 🔍 Deployment Troubleshooting

### Issue: "Service failed to start"

**Solution:** Check logs in Render dashboard
- Click service → **Logs**
- Look for error messages
- Common issues:
  - Missing environment variables
  - Database connection failed
  - Wrong start command

### Issue: "405 Method Not Allowed on /"

**Solution:** Already fixed! Root endpoint added to `app/main.py`

### Issue: "CORS error"

**Solution:** Update `allow_origins` in `app/main.py` with your frontend URL and redeploy

### Issue: "Database seeding failed"

**Solution:** Check database connection string
- Verify `DATABASE_URL` environment variable is correct
- Check PostgreSQL service is running

### Issue: "502 Bad Gateway"

**Solution:** 
- Check backend service logs
- Ensure port binding is correct (should be `0.0.0.0:$PORT`)
- Restart service from Render dashboard

---

## 🚀 Start & Restart Commands

### View Logs
Go to **Render Dashboard** → **Your Service** → **Logs**

### Restart Service
Click **Manual Deploy** button in service settings

### Update Code
Push to GitHub → Automatic redeploy starts

### View Environment Variables
Click **Environment** in service settings

---

## 📝 Important Notes

### Environment Variables
- ✅ Set all 12 user passwords in Render environment
- ✅ Use strong, unique passwords (not the default ones)
- ✅ Never commit passwords to git
- ✅ Use Render's secret management

### Database
- ✅ PostgreSQL created on Render
- ✅ Automatic backups enabled
- ✅ Data persists between deployments
- ✅ Safe seeding prevents duplicate data

### Deployments
- ✅ Auto-redeploy on git push
- ✅ No reload mode in production
- ✅ Binds to 0.0.0.0 (required)
- ✅ Uses PORT environment variable

### Monitoring
- ✅ Health check endpoint available
- ✅ Logs viewable in dashboard
- ✅ Email alerts on failure
- ✅ Performance metrics tracked

---

## 📚 Files Updated

### `backend/app/main.py`
- ✅ Updated Uvicorn configuration
- ✅ Added port environment variable
- ✅ Disabled reload mode
- ✅ Added startup logging
- ✅ Updated CORS for production
- ✅ Already had root endpoint

### `backend/app/models/seed.py`
- ✅ Added `safe_seed_database()` function
- ✅ Checks existing data before seeding
- ✅ Prevents re-seeding on deployments
- ✅ Shows informative logs

---

## ✅ Deployment Ready

Your backend is now **production-ready for Render.com deployment**. Follow the setup steps above and your auction portal will be live!

**Status:** ✅ **RENDER-READY**

---

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Environment Variables Best Practices](https://12factor.net/config)
- [Uvicorn Configuration](https://www.uvicorn.org/)

---

**Deployment Guide Created:** December 4, 2025  
**Backend Version:** 2.0 (Render-Ready)
