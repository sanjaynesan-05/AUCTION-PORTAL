# 🎨 Frontend Setup Guide - IPL Auction Portal

**Complete guide for setting up, developing, and deploying the React frontend**

> **⚡ Quick Note:** The backend uses **SQLite** database (file-based, zero configuration). No database server installation needed! Just install dependencies and start coding.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Project Structure](#project-structure)
5. [Configuration](#configuration)
6. [Development](#development)
7. [Components Guide](#components-guide)
8. [State Management](#state-management)
9. [Routing](#routing)
10. [Styling](#styling)
11. [API Integration](#api-integration)
12. [Real-Time Features](#real-time-features)
13. [Building for Production](#building-for-production)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)

---

## 📖 Overview

### Technology Stack

- **React 18.3.1** - UI library with hooks and concurrent features
- **TypeScript 5.5.3** - Static type checking
- **Vite 7.1.9** - Fast build tool with HMR
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Zustand 5.0.8** - Lightweight state management
- **React Router DOM 7.9.4** - Client-side routing
- **Framer Motion 12.23.24** - Animation library
- **Socket.io Client** - Real-time bidirectional communication
- **Lucide React 0.344.0** - Beautiful icon library

### Features

✅ Modern React with TypeScript  
✅ Fast development with Vite HMR  
✅ Responsive design with Tailwind CSS  
✅ Real-time updates with Socket.io  
✅ Role-based access control  
✅ Smooth animations with Framer Motion  
✅ Type-safe API calls  

---

## 🔧 Prerequisites

### Required Software

1. **Node.js** (v16 or higher)
   ```powershell
   # Check version
   node --version
   # Should output: v16.x.x or higher
   ```

2. **npm** (comes with Node.js)
   ```powershell
   # Check version
   npm --version
   # Should output: 8.x.x or higher
   ```

3. **Code Editor** (VS Code recommended)
   - Download from: https://code.visualstudio.com/

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "christian-kohler.path-intellisense"
  ]
}
```

---

## 📥 Installation

### Step 1: Navigate to Frontend Directory

```powershell
cd d:\AUCTION PORTAL\frontend
```

### Step 2: Install Dependencies

```powershell
# Using npm
npm install

# Or using yarn
yarn install
```

### Step 3: Verify Installation

```powershell
# Check if node_modules folder was created
ls node_modules

# Verify package.json scripts
npm run
```

### Expected Output

```
Available scripts:
  dev        - vite
  build      - vite build
  lint       - eslint .
  preview    - vite preview
  typecheck  - tsc --noEmit -p tsconfig.app.json
  start      - vite
```

---

## 📁 Project Structure

### Directory Layout

```
frontend/
│
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/
│   │   │   └── RoleGuard.tsx
│   │   ├── TVBroadcastPlayer.tsx
│   │   ├── Loading.tsx
│   │   ├── LiveUpdatesFooter.tsx
│   │   ├── FloatingTeamPurse.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── pages/              # Page components
│   │   ├── AdminPanel.tsx
│   │   ├── PresenterPanel.tsx
│   │   ├── ViewerScreen.tsx
│   │   ├── Login.tsx
│   │   └── Unauthorized.tsx
│   │
│   ├── context/            # React Context
│   │   └── RoleContext.tsx
│   │
│   ├── store/              # Zustand stores
│   │   └── useAuctionStore.ts
│   │
│   ├── routes/             # Route configuration
│   │   └── AppRoutes.tsx
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── useAuctionSync.ts
│   │
│   ├── utils/              # Utility functions
│   │   └── auctionSync.ts
│   │
│   ├── data/               # Mock/seed data
│   │   ├── mockPlayers.ts
│   │   ├── mockTeams.ts
│   │   └── mockUsers.ts
│   │
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Application entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # Vite TypeScript definitions
│
├── public/                 # Static assets
│   ├── manifest.json
│   └── sw.js
│
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── eslint.config.js        # ESLint rules
├── tsconfig.json           # TypeScript base config
├── tsconfig.app.json       # TypeScript app config
├── tsconfig.node.json      # TypeScript Node config
├── package.json            # Dependencies & scripts
└── package-lock.json       # Dependency lock file
```

### Key Files Explained

#### **main.tsx** - Entry Point
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### **App.tsx** - Root Component
```typescript
import { BrowserRouter } from 'react-router-dom'
import { RoleProvider } from './context/RoleContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <AppRoutes />
      </RoleProvider>
    </BrowserRouter>
  )
}
```

---

## ⚙️ Configuration

### Vite Configuration (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
    },
  },
})
```

**Key Settings:**
- **Port**: 5173 (default Vite port)
- **Proxy**: Forwards `/api` and `/socket.io` to backend
- **Alias**: Use `@/` for imports from `src/`

### Tailwind Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // IPL team colors
        csk: '#FFFF00',
        mi: '#004BA0',
        rcb: '#EC1C24',
        // ... more colors
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 💻 Development

### Starting Development Server

```powershell
# Start with npm
npm run dev

# Or with yarn
yarn dev

# Or simply
npm start
```

### Development URL

```
http://localhost:5173
```

### Hot Module Replacement (HMR)

Vite provides instant HMR:
- Edit any file in `src/`
- Changes reflect immediately
- State is preserved
- No full page reload needed

### Development Workflow

```powershell
# 1. Start backend first
cd d:\AUCTION PORTAL\backend
npm run dev

# 2. Start frontend in new terminal
cd d:\AUCTION PORTAL\frontend
npm run dev

# 3. Open browser
# Navigate to http://localhost:5173
```

### Available Scripts

```powershell
# Development server with HMR
npm run dev

# Type checking without building
npm run typecheck

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🧩 Components Guide

### Component Structure

#### Basic Component Template

```typescript
// src/components/MyComponent.tsx
import React from 'react'

interface MyComponentProps {
  title: string
  onAction?: () => void
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Action
        </button>
      )}
    </div>
  )
}

export default MyComponent
```

### Common Components

#### **RoleGuard** - Protected Routes

```typescript
// src/components/common/RoleGuard.tsx
import { Navigate } from 'react-router-dom'
import { useRole } from '@/context/RoleContext'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { role } = useRole()

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
```

#### **Loading** - Loading Spinner

```typescript
// src/components/Loading.tsx
export const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
    </div>
  )
}
```

#### **ErrorBoundary** - Error Handling

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Something went wrong
            </h1>
            <p className="mt-2 text-gray-600">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

### Page Components

#### **AdminPanel** - Admin Dashboard

Located in `src/pages/AdminPanel.tsx`
- User management
- Player management
- Team management
- Auction controls

#### **PresenterPanel** - Auction Control

Located in `src/pages/PresenterPanel.tsx`
- Live auction interface
- Player bidding controls
- Mark sold/unsold
- Navigation controls

#### **ViewerScreen** - Public View

Located in `src/pages/ViewerScreen.tsx`
- Live auction display
- Current player info
- Team purse status
- TV broadcast style

#### **Login** - Authentication

Located in `src/pages/Login.tsx`
- Username/password login
- Role-based redirect
- JWT token storage

---

## 🗂️ State Management

### Zustand Store

#### Auction Store (`src/store/useAuctionStore.ts`)

```typescript
import { create } from 'zustand'

interface Player {
  id: string
  name: string
  role: string
  basePrice: number
  sold: boolean
  price?: number
  teamId?: string
}

interface AuctionState {
  players: Player[]
  currentPlayerIndex: number
  isAuctionActive: boolean
  setPlayers: (players: Player[]) => void
  nextPlayer: () => void
  prevPlayer: () => void
  markSold: (playerId: string, teamId: string, price: number) => void
  startAuction: () => void
  pauseAuction: () => void
}

export const useAuctionStore = create<AuctionState>((set) => ({
  players: [],
  currentPlayerIndex: 0,
  isAuctionActive: false,

  setPlayers: (players) => set({ players }),

  nextPlayer: () => set((state) => ({
    currentPlayerIndex: Math.min(
      state.currentPlayerIndex + 1,
      state.players.length - 1
    )
  })),

  prevPlayer: () => set((state) => ({
    currentPlayerIndex: Math.max(state.currentPlayerIndex - 1, 0)
  })),

  markSold: (playerId, teamId, price) => set((state) => ({
    players: state.players.map((player) =>
      player.id === playerId
        ? { ...player, sold: true, teamId, price }
        : player
    )
  })),

  startAuction: () => set({ isAuctionActive: true }),
  pauseAuction: () => set({ isAuctionActive: false }),
}))
```

#### Using the Store

```typescript
import { useAuctionStore } from '@/store/useAuctionStore'

function MyComponent() {
  const players = useAuctionStore((state) => state.players)
  const setPlayers = useAuctionStore((state) => state.setPlayers)
  const nextPlayer = useAuctionStore((state) => state.nextPlayer)

  // Use the state and actions
  return (
    <div>
      <p>Total Players: {players.length}</p>
      <button onClick={nextPlayer}>Next Player</button>
    </div>
  )
}
```

### React Context

#### Role Context (`src/context/RoleContext.tsx`)

```typescript
import React, { createContext, useContext, useState } from 'react'

interface RoleContextType {
  role: string | null
  setRole: (role: string) => void
  clearRole: () => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [role, setRoleState] = useState<string | null>(
    localStorage.getItem('userRole')
  )

  const setRole = (newRole: string) => {
    localStorage.setItem('userRole', newRole)
    setRoleState(newRole)
  }

  const clearRole = () => {
    localStorage.removeItem('userRole')
    setRoleState(null)
  }

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within RoleProvider')
  }
  return context
}
```

---

## 🛣️ Routing

### Route Configuration (`src/routes/AppRoutes.tsx`)

```typescript
import { Routes, Route, Navigate } from 'react-router-dom'
import { RoleGuard } from '@/components/common/RoleGuard'
import Login from '@/pages/Login'
import AdminPanel from '@/pages/AdminPanel'
import PresenterPanel from '@/pages/PresenterPanel'
import ViewerScreen from '@/pages/ViewerScreen'
import Unauthorized from '@/pages/Unauthorized'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      <Route
        path="/admin"
        element={
          <RoleGuard allowedRoles={['admin']}>
            <AdminPanel />
          </RoleGuard>
        }
      />
      
      <Route
        path="/presenter"
        element={
          <RoleGuard allowedRoles={['admin', 'presenter']}>
            <PresenterPanel />
          </RoleGuard>
        }
      />
      
      <Route path="/viewer" element={<ViewerScreen />} />
      
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
```

### Navigation

```typescript
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()

  const goToAdmin = () => {
    navigate('/admin')
  }

  return <button onClick={goToAdmin}>Go to Admin</button>
}
```

---

## 🎨 Styling

### Tailwind CSS Classes

#### Common Utilities

```tsx
// Layout
<div className="flex items-center justify-between">
<div className="grid grid-cols-3 gap-4">
<div className="container mx-auto px-4">

// Spacing
<div className="p-4 m-2">           // padding & margin
<div className="mt-4 mb-6 mx-auto"> // margin top, bottom, x-axis

// Typography
<h1 className="text-3xl font-bold text-gray-900">
<p className="text-sm text-gray-600 leading-relaxed">

// Colors
<div className="bg-blue-500 text-white">
<div className="bg-gradient-to-r from-blue-500 to-purple-600">

// Borders & Shadows
<div className="border-2 border-gray-300 rounded-lg shadow-lg">

// Responsive Design
<div className="hidden md:block">      // Hidden on mobile, visible on tablet+
<div className="text-sm md:text-base"> // Responsive text size
```

#### Custom Colors (Team Colors)

```tsx
// IPL Team Colors (defined in tailwind.config.js)
<div className="bg-[#FFFF00] text-black">    {/* CSK Yellow */}
<div className="bg-[#004BA0] text-white">    {/* MI Blue */}
<div className="bg-[#EC1C24] text-white">    {/* RCB Red */}
```

### CSS Modules (Optional)

```tsx
// MyComponent.module.css
.container {
  @apply flex items-center justify-center;
  background: linear-gradient(to right, #667eea, #764ba2);
}

// MyComponent.tsx
import styles from './MyComponent.module.css'

function MyComponent() {
  return <div className={styles.container}>Content</div>
}
```

### Global Styles (`src/index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition;
  }
}
```

---

## 🔌 API Integration

### API Service

```typescript
// src/services/api.ts
const API_URL = 'http://localhost:5000/api'

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    return response.json()
  },

  // Players
  getPlayers: async (token: string) => {
    const response = await fetch(`${API_URL}/players`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return response.json()
  },

  createPlayer: async (token: string, playerData: any) => {
    const response = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(playerData),
    })
    return response.json()
  },

  // Teams
  getTeams: async (token: string) => {
    const response = await fetch(`${API_URL}/teams`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return response.json()
  },
}
```

### Using API in Components

```typescript
import { useEffect, useState } from 'react'
import { api } from '@/services/api'

function PlayerList() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem('token')
        const data = await api.getPlayers(token!)
        setPlayers(data.players)
      } catch (error) {
        console.error('Error fetching players:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {players.map((player) => (
        <div key={player.id}>{player.name}</div>
      ))}
    </div>
  )
}
```

---

## ⚡ Real-Time Features

### Socket.io Integration

```typescript
// src/services/socket.ts
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectSocket = (token: string) => {
  socket = io('http://localhost:5000', {
    auth: { token },
  })

  socket.on('connect', () => {
    console.log('Socket connected')
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket
```

### Using Socket in Components

```typescript
import { useEffect } from 'react'
import { connectSocket, disconnectSocket, getSocket } from '@/services/socket'
import { useAuctionStore } from '@/store/useAuctionStore'

function AuctionComponent() {
  const setPlayers = useAuctionStore((state) => state.setPlayers)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const socket = connectSocket(token!)

    // Listen for events
    socket.on('playerUpdate', (data) => {
      setPlayers(data.players)
    })

    socket.on('auctionStateChange', (data) => {
      console.log('Auction state changed:', data)
    })

    // Emit events
    socket.emit('joinAuction', { roomId: 'main' })

    return () => {
      disconnectSocket()
    }
  }, [])

  return <div>Auction Component</div>
}
```

---

## 🏗️ Building for Production

### Build Command

```powershell
npm run build
```

### Build Output

```
frontend/dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── index.html
```

### Build Optimization

Vite automatically:
- ✅ Minifies JavaScript and CSS
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Asset optimization
- ✅ Source maps for debugging

### Preview Production Build

```powershell
npm run preview
```

Access at: `http://localhost:4173`

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Production deployment
vercel --prod
```

### Deploy to Netlify

```bash
# Build
npm run build

# Drag and drop dist/ folder to Netlify
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

### Environment Variables

Create `.env.production`:
```env
VITE_API_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-api-domain.com
```

---

## 🐛 Troubleshooting

### Issue: Module not found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5173 already in use

```powershell
# Kill process on port
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

### Issue: TypeScript errors

```bash
# Check types
npm run typecheck

# Restart VS Code TypeScript server
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### Issue: Tailwind classes not working

```bash
# Rebuild Tailwind
npm run build

# Check content paths in tailwind.config.js
```

### Issue: API calls failing

- Check backend is running on port 5000
- Check proxy configuration in vite.config.ts
- Verify API_URL in your code
- Check browser console for CORS errors

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [React Router Guide](https://reactrouter.com/)

---

**Frontend setup complete! Happy coding! 🎉**

Last Updated: October 29, 2025
