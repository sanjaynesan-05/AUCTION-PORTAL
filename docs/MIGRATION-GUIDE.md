# 🔄 Project Restructuring - Migration Guide

## Overview

The IPL Auction Portal has been reorganized into a clean, professional structure with **separate frontend and backend folders**. This document guides you through the changes and how to work with the new structure.

## 🎯 What Changed?

### Before (Old Structure)
```
AUCTION-PORTAL/
├── src/              # Frontend source
├── public/           # Frontend assets
├── server/           # Backend (MongoDB)
├── index.html        # Frontend entry
├── vite.config.ts    # Frontend config
├── package.json      # Frontend dependencies
└── (config files mixed at root)
```

### After (New Structure)
```
AUCTION-PORTAL/
├── frontend/         # Complete React app
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/          # Complete Node.js API (PostgreSQL)
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.postgres.js
│   └── package.json
│
├── docs/             # All documentation
├── scripts/          # Setup & utility scripts
└── README.md         # Main documentation
```

## ✅ Key Benefits

1. **Clear Separation** - Frontend and backend are completely isolated
2. **Independent Development** - Work on either side without interference
3. **Better Organization** - All files logically grouped
4. **Easier Deployment** - Deploy frontend and backend separately
5. **Scalability** - Add features without cluttering root directory
6. **Team Collaboration** - Frontend and backend developers can work independently

## 📋 Migration Checklist

### For Developers Currently Working on This Project

- [x] ✅ Frontend files moved to `frontend/` directory
- [x] ✅ Backend files moved to `backend/` directory
- [x] ✅ Documentation organized in `docs/` folder
- [x] ✅ Utility scripts in `scripts/` folder
- [x] ✅ Separate `package.json` for frontend and backend
- [x] ✅ Updated README.md with new structure
- [x] ✅ Created installation scripts

### What You Need to Do

#### 1. Update Your Local Environment

```powershell
# 1. Pull the latest changes (if using Git)
git pull origin main

# 2. Remove old node_modules from root
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force

# 3. Install dependencies for both frontend and backend
.\scripts\install-all.ps1
```

#### 2. Update Your IDE Settings

**VS Code:**
- Open the root folder (`AUCTION-PORTAL`)
- The workspace will automatically detect both frontend and backend
- Install recommended extensions for both TypeScript and Node.js

**Terminal Shortcuts:**
```powershell
# Open two terminals - one for each:
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend
cd backend
npm run dev
```

#### 3. Update Your Scripts/Commands

| Old Command | New Command |
|------------|-------------|
| `npm run dev` (from root) | `cd frontend && npm run dev` |
| `npm run server` | `cd backend && npm start` |
| `cd server && npm install` | `cd backend && npm install` |
| `npm run build` | `cd frontend && npm run build` |

**Or use the new convenience scripts:**
```powershell
# Install everything
.\scripts\install-all.ps1

# Start both servers
.\scripts\start-all.ps1
```

#### 4. Update Import Paths (if needed)

If you have any absolute imports or path aliases, ensure they're updated:

**Frontend (`vite.config.ts`):**
```typescript
// Already configured correctly
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  }
}
```

**Backend:**
No changes needed - all imports are relative.

## 🚀 How to Start Development

### Quick Start (Recommended)

```powershell
# One-command setup
.\scripts\install-all.ps1
.\scripts\setup-postgresql.ps1
cd backend && npm run init-db
.\scripts\start-all.ps1
```

### Manual Start

```powershell
# Terminal 1 - Backend
cd backend
npm install
npm run init-db  # First time only
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## 📦 Package Management

### Installing New Packages

**Frontend Dependencies:**
```powershell
cd frontend
npm install <package-name>
```

**Backend Dependencies:**
```powershell
cd backend
npm install <package-name>
```

### Updating Dependencies

```powershell
# Update frontend
cd frontend
npm update

# Update backend
cd backend
npm update
```

## 🔧 Development Workflow

### Frontend Development
1. Navigate to `frontend/` directory
2. Run `npm run dev` for development server
3. Edit files in `frontend/src/`
4. Build with `npm run build` for production

### Backend Development
1. Navigate to `backend/` directory
2. Run `npm run dev` for development server with auto-reload
3. Edit files in `backend/models/`, `backend/routes/`, etc.
4. Test with `npm test` (when tests are added)

### Full-Stack Development
1. Use `.\scripts\start-all.ps1` to start both servers
2. Frontend will be on `http://localhost:5173`
3. Backend will be on `http://localhost:5000`
4. Both will auto-reload on file changes

## 🗂️ File Locations Reference

### Configuration Files

| File | Old Location | New Location |
|------|-------------|--------------|
| Frontend Config | Root | `frontend/vite.config.ts` |
| Tailwind Config | Root | `frontend/tailwind.config.js` |
| TypeScript Config | Root | `frontend/tsconfig.json` |
| Backend Config | `server/.env` | `backend/.env` |
| Backend Package | `server/package.json` | `backend/package.json` |

### Source Files

| File Type | Old Location | New Location |
|-----------|-------------|--------------|
| React Components | `src/components/` | `frontend/src/components/` |
| React Pages | `src/pages/` | `frontend/src/pages/` |
| Backend Models | `server/models/` | `backend/models/` |
| Backend Routes | `server/routes/` | `backend/routes/` |
| API Server | `server/server.postgres.js` | `backend/server.postgres.js` |

### Documentation

| File | Old Location | New Location |
|------|-------------|--------------|
| Backend API Docs | `server/BACKEND.md` | `backend/docs/BACKEND.md` |
| PostgreSQL Setup | Root | `docs/POSTGRESQL-SETUP.md` |
| Quick Start | Root | `docs/QUICKSTART-POSTGRESQL.md` |
| Project Structure | N/A | `docs/PROJECT-STRUCTURE.md` |

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```powershell
# Reinstall dependencies
cd frontend
Remove-Item node_modules -Recurse -Force
npm install

cd ../backend
Remove-Item node_modules -Recurse -Force
npm install
```

### Issue: Backend can't connect to database

**Solution:**
```powershell
# Check your backend/.env file
cd backend
cat .env

# Should contain:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/auction_portal
# JWT_SECRET=your_secret_key
# PORT=5000

# Reinitialize if needed
npm run init-db
```

### Issue: Port already in use

**Solution:**
```powershell
# Find and kill the process using the port
# For port 5000 (backend):
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# For port 5173 (frontend):
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Issue: Old import paths not working

**Solution:**
If you have any custom code with absolute imports:
- Update them to be relative to the new structure
- Or update path aliases in `vite.config.ts` or `tsconfig.json`

## 📝 Git Considerations

### If You Have Uncommitted Changes

```powershell
# Stash your changes before pulling
git stash

# Pull the new structure
git pull origin main

# Reapply your changes
git stash pop

# Resolve any conflicts
```

### Updating .gitignore

The new `.gitignore` at root level handles both frontend and backend:
```
node_modules/
*/node_modules/
frontend/node_modules/
backend/node_modules/
.env
backend/.env
frontend/.env
dist/
frontend/dist/
```

## 🎓 Best Practices

1. **Always work from root directory** when using scripts
2. **Use separate terminals** for frontend and backend development
3. **Keep dependencies separate** - don't install backend packages in frontend and vice versa
4. **Use the scripts** - They handle paths and setup automatically
5. **Update documentation** - Keep README.md and docs up to date

## 📚 Additional Resources

- [Main README](../README.md) - Complete project documentation
- [Project Structure](./PROJECT-STRUCTURE.md) - Detailed structure documentation
- [Backend API Docs](../backend/docs/BACKEND.md) - API reference
- [PostgreSQL Setup](./POSTGRESQL-SETUP.md) - Database setup guide

## 🆘 Getting Help

If you encounter issues after restructuring:

1. Check this migration guide
2. Review [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md)
3. Run `.\scripts\install-all.ps1` to reset dependencies
4. Check the troubleshooting section above
5. Review the main [README.md](../README.md)

## ✅ Verification Steps

After migration, verify everything works:

```powershell
# 1. Check installations
cd frontend
npm list --depth=0

cd ../backend
npm list --depth=0

# 2. Test backend
cd backend
npm start
# Visit http://localhost:5000/api/health

# 3. Test frontend
cd ../frontend
npm run dev
# Visit http://localhost:5173

# 4. Test full integration
cd ..
.\scripts\start-all.ps1
# Test login with admin/admin123
```

---

**Migration completed successfully! 🎉**

Your project is now organized with a clean, professional structure that's easier to maintain, scale, and deploy.

**Last Updated:** October 29, 2025
