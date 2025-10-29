# 🎯 Quick Reference Card

## 🚀 Start Application
```powershell
.\start-servers.ps1
```
Opens 2 windows: Backend (port 5000) + Frontend (port 5173)

## 🔑 Login Credentials

```
Admin:     admin / admin123
Presenter: presenter / presenter123
Viewers:   csk_owner, mi_owner, rcb_owner, etc. / password123
```

## 🌐 URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api

## 📝 Common Tasks

### First Time Setup
```powershell
.\setup.ps1
```

### Start Servers
```powershell
.\start-servers.ps1
```

### Restart Backend
```powershell
cd backend
npm start
```

### Restart Frontend  
```powershell
cd frontend
npm run dev
```

### Reset Database
```powershell
cd backend
rm database.sqlite
npm run init-db
node create-presenter.js
```

### View Logs
- Backend: Check backend terminal window
- Frontend: Check frontend terminal window
- Browser: F12 → Console tab

## ✅ Verify Working

1. **Backend Running**: http://localhost:5000
2. **Frontend Running**: http://localhost:5173
3. **Login Works**: Try admin/admin123
4. **Console Clean**: No errors in F12 console

## 📖 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Full setup guide
- [CREDENTIALS.md](CREDENTIALS.md) - All login accounts
- [INTEGRATION-COMPLETE.md](INTEGRATION-COMPLETE.md) - Technical details
- [docs/](docs/) - Complete documentation

## 🆘 Troubleshooting

### Can't login?
```powershell
cd backend
node create-presenter.js
npm run init-db
```

### Port already in use?
```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### Database errors?
```powershell
cd backend
rm database.sqlite
npm run init-db
```

### Frontend won't start?
```powershell
cd frontend
rm -r node_modules
npm install
npm run dev
```

---

**Quick Help**: Check QUICKSTART.md for detailed instructions
