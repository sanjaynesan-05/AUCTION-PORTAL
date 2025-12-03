# ⚡ Quick Start Guide

**Get the IPL Auction Portal running in 3 steps!**

---

## 🚀 Start in 60 Seconds

### 1. Install Frontend Dependencies (30 seconds)
```bash
cd frontend
npm install
```

### 2. Activate Backend (10 seconds)
```bash
cd ../backend
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# source venv/bin/activate   # macOS/Linux
```

### 3. Start Everything (20 seconds)
```bash
cd ..
npm run dev
```

**Wait 10 seconds for startup...**

---

## 🌐 Access Points (After Startup)

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | React app |
| **Backend** | http://localhost:8000 | API server |
| **API Docs** | http://localhost:8000/docs | Swagger UI |
| **WebSocket** | ws://localhost:8000/ws/auction | Real-time updates |

---

## 🔑 Test Accounts

```
Admin Access:
  Username: admin
  Password: admin123

Presenter Access:
  Username: presenter
  Password: presenter123

CSK Team Viewer:
  Username: csk_viewer
  Password: csk@2024
```

---

## ✅ Verify Setup

1. **Frontend loads:** http://localhost:5173 shows login page ✓
2. **Backend running:** http://localhost:8000/health returns `{"status":"ok"}` ✓
3. **API docs available:** http://localhost:8000/docs shows Swagger UI ✓
4. **Can login:** Enter admin/admin123 and see dashboard ✓

---

## 🧪 Run Tests

```bash
cd backend
pytest tests/test_api.py -v
```

**Expected:** 24/24 tests passing ✅

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `frontend/src/services/apiClient.ts` | API communication |
| `frontend/.env.development` | Frontend config |
| `backend/.env` | Backend config |
| `backend/app/main.py` | FastAPI app |
| `backend/tests/test_api.py` | Test suite |

---

## 🛑 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts or main.py
# Then restart: npm run dev
```

### Backend Not Responding
```bash
# Check backend is running
curl http://localhost:8000/health

# If not, manually start:
cd backend
python -m uvicorn app.main:app --reload
```

### Frontend Can't Reach API
```bash
# Check Vite proxy in frontend/vite.config.ts
# Verify backend URL matches

# Clear browser cache:
# Press F12 → Network tab → Disable cache
```

### Tests Failing
```bash
# Delete test database and rerun
cd backend
rm test_auction.db
pytest tests/test_api.py -v
```

---

## 📚 Full Documentation

- **Setup Guide:** See `README.md`
- **Integration Details:** See `INTEGRATION_GUIDE.md`
- **Technical Specs:** See `BACKEND_ANALYSIS.md`
- **Completion Status:** See `PROJECT_SUMMARY.md`

---

## 🎯 Next Steps

1. ✅ Verify all 3 services running
2. ✅ Login with test account
3. ✅ Test creating a player
4. ✅ Watch real-time updates
5. 📖 Read full documentation
6. 🚀 Deploy to production

---

## 💡 Pro Tips

- Use `npm run backend:test` to run tests from root
- Use `npm run frontend:dev` to start only frontend
- Use `npm run backend:dev` to start only backend
- Check browser console (F12) for API error details
- WebSocket automatically reconnects on disconnect
- JWT token stored in localStorage, survives page refresh

---

**Ready? Run:** `npm run dev`

**Questions? Check:** `INTEGRATION_GUIDE.md`

**Issues? See:** Troubleshooting section above

---

Last Updated: December 3, 2025
