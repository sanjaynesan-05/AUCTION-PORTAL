# 🚀 Render Deployment & Frontend-Backend Integration Guide

## 📋 Current Status

✅ **Backend**: Deployed to `https://auction-portal-7bds.onrender.com`
✅ **Frontend**: Built and ready for deployment
✅ **Environment**: Configured for production

---

## ⚠️ CRITICAL: Environment Variables Setup

**ISSUE FOUND**: Backend environment variables are not set on Render. This causes login to fail with a 500 error.

### Required Environment Variables on Render

Add these to your Render backend service under **Environment**:

```
ADMIN_PASSWORD=your-secure-admin-password
PRESENTER_PASSWORD=your-secure-presenter-password
TEAM_CSK_PASSWORD=csk@123
TEAM_MI_PASSWORD=mi@123
TEAM_RCB_PASSWORD=rcb@123
TEAM_KKR_PASSWORD=kkr@123
TEAM_DC_PASSWORD=dc@123
TEAM_RR_PASSWORD=rr@123
TEAM_PBKS_PASSWORD=pbks@123
TEAM_SRH_PASSWORD=srh@123
TEAM_GT_PASSWORD=gt@123
TEAM_LSG_PASSWORD=lsg@123
SECRET_KEY=your-secure-jwt-secret-key
DATABASE_URL=[Already set - don't change]
```

---

## 🔧 How to Fix the 500 Error

### Step 1: Log into Render Dashboard
1. Go to https://dashboard.render.com
2. Find your backend service: `auction-portal`

### Step 2: Add Environment Variables
1. Click on the backend service
2. Go to **Settings** → **Environment**
3. Click **Add Environment Variable** for each variable above
4. Click **Save**

### Step 3: Restart the Backend
1. Go to **Deployments** tab
2. Click **Reboot** or wait for auto-redeploy
3. Wait 2-3 minutes for restart

### Step 4: Test the Fix
```bash
# Test login with admin
curl -X POST https://auction-portal-7bds.onrender.com/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"your-secure-admin-password"}'
```

---

## 📊 Current Test Results

### ✅ Working Endpoints:
- `GET /` → Returns API info ✅
- `GET /health` → Returns `{"status":"healthy"}` ✅
- `GET /players` → Returns 53 players ✅
- `GET /teams` → Returns 10 teams ✅
- `GET /docs` → Swagger API docs ✅

### ❌ Broken Endpoint:
- `POST /auth/login` → Returns 500 error ❌
  - **Cause**: Environment variables not set
  - **Fix**: Follow steps above

### ⏳ Auction Endpoints:
- `GET /auction/state` → Returns empty/null (not tested with auth yet)
- Other auction endpoints pending auth fix

---

## 🎨 Frontend Configuration

### Updated Files:
✅ `frontend/.env.production` - Updated with Render backend URL

**Content:**
```env
VITE_API_URL=https://auction-portal-7bds.onrender.com
VITE_WS_URL=wss://auction-portal-7bds.onrender.com
```

### Backend CORS Configuration:
✅ Already configured to accept frontend requests from:
- `https://auction-portal-frontend.onrender.com`
- `http://localhost:5173`
- `http://localhost:3000`

---

## 🚀 Frontend Deployment Steps

### Option 1: Deploy to Render (Recommended)

1. **Create Frontend Service on Render**:
   - Go to https://dashboard.render.com
   - Click **New +** → **Web Service**
   - Connect your GitHub repository
   - Name: `auction-portal-frontend`

2. **Configure Service**:
   - **Environment**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run preview`
   - **Root Directory**: `frontend`

3. **Add Environment Variables**:
   ```
   VITE_API_URL=https://auction-portal-7bds.onrender.com
   VITE_WS_URL=wss://auction-portal-7bds.onrender.com
   NODE_ENV=production
   ```

4. **Deploy**: Click **Create Web Service**
   - Wait 5-10 minutes for build and deploy

5. **Update Backend CORS**:
   Once frontend is deployed, add its URL to backend CORS in `backend/app/main.py`:
   ```python
   allow_origins=[
       "http://localhost:5173",
       "http://localhost:3000",
       "https://auction-portal-frontend.onrender.com",  # Your actual frontend URL
   ]
   ```

### Option 2: Deploy to Vercel

1. **Create Vercel Project**:
   - Go to https://vercel.com
   - Import your repository
   - Select `frontend` directory

2. **Environment Variables**:
   - Add same variables as above

3. **Deploy**: Vercel will auto-deploy

---

## 🧪 Testing Checklist

### After Backend Environment Variables are Set:

- [ ] Test health check: `GET /health` → 200 ✅
- [ ] Test login with admin: `POST /auth/login` → 200 ✅
- [ ] Test login with team (e.g., csk): `POST /auth/login` → 200 ✅
- [ ] Test get players: `GET /players` → 200 ✅
- [ ] Test get teams: `GET /teams` → 200 ✅
- [ ] Test get auction state: `GET /auction/state` → 200 ✅

### After Frontend is Deployed:

- [ ] Open frontend URL in browser
- [ ] Test login page loads
- [ ] Test login with admin credentials
- [ ] Test quick login buttons
- [ ] Verify navigation to dashboard works
- [ ] Test player list loads
- [ ] Test team list loads
- [ ] Test auction features (start, bid, etc.)

---

## 🔗 Important URLs

| Service | URL | Status |
|---------|-----|--------|
| Backend API | https://auction-portal-7bds.onrender.com | ✅ Running |
| API Swagger Docs | https://auction-portal-7bds.onrender.com/docs | ✅ Available |
| Frontend (TBD) | https://auction-portal-frontend.onrender.com | ⏳ Deploy |

---

## 📝 Default Test Credentials

Once environment variables are set, use these to login:

### Admin Account
```
Username: admin
Password: [Your ADMIN_PASSWORD value]
```

### Presenter Account
```
Username: presenter
Password: [Your PRESENTER_PASSWORD value]
```

### Team Accounts (Example - CSK)
```
Username: csk
Password: csk@123
Role: Viewer
Team: Chennai Super Kings
```

All 10 teams follow this pattern:
- CSK, MI, RCB, KKR, DC, RR, PBKS, SRH, GT, LSG

---

## 🛠️ Troubleshooting

### Issue: "Cannot POST /auth/login"
**Cause**: Environment variables not set
**Fix**: Add all required env vars and restart backend

### Issue: "CORS error" in frontend
**Cause**: Frontend URL not in CORS allow_origins
**Fix**: Update backend/app/main.py and redeploy

### Issue: "Invalid credentials"
**Cause**: Wrong password for user
**Fix**: Check exact password from environment variables

### Issue: "Connection refused"
**Cause**: Backend not running or URL incorrect
**Fix**: Check Render dashboard → Backend service status

### Issue: "WebSocket connection failed"
**Cause**: WS URL not configured in frontend
**Fix**: Ensure VITE_WS_URL is set in .env.production

---

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│         Browser                         │
│  https://auction-portal-frontend...com  │
└──────────────────┬──────────────────────┘
                   │ API Calls
                   ▼
┌─────────────────────────────────────────┐
│      Frontend (React + Vite)            │
│    https://...frontend.onrender.com     │
└──────────────────┬──────────────────────┘
                   │ HTTP/WebSocket
                   ▼
┌─────────────────────────────────────────┐
│     Backend (FastAPI + Uvicorn)         │
│ https://auction-portal-7bds.onrender.com│
└──────────────────┬──────────────────────┘
                   │ SQL
                   ▼
┌─────────────────────────────────────────┐
│    PostgreSQL Database (Render)         │
│  ap-southeast-1.aws.neon.tech           │
└─────────────────────────────────────────┘
```

---

## ✅ Next Steps

1. **IMMEDIATELY**: Add environment variables to Render backend
2. **IMMEDIATELY**: Restart backend service
3. **Test**: Verify login works with new credentials
4. **Deploy**: Deploy frontend to Render/Vercel
5. **Test**: Full end-to-end testing

---

## 📞 Support

### Files to Reference:
- Backend config: `backend/app/config.py`
- Backend main: `backend/app/main.py`
- Frontend config: `frontend/.env.production`
- Credentials doc: `docs/credentials/LOGIN_CREDENTIALS_SUMMARY.md`

### Quick Commands:

Test backend health:
```bash
curl https://auction-portal-7bds.onrender.com/health
```

Test backend API docs:
```
https://auction-portal-7bds.onrender.com/docs
```

---

**Status**: 🟡 Ready for integration (pending env vars fix)  
**Last Updated**: December 4, 2025  
**Backend URL**: https://auction-portal-7bds.onrender.com  
**Frontend URL**: [Pending deployment]
