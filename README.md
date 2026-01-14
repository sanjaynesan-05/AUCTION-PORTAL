# IPL Auction Portal - Full Stack Application

A comprehensive IPL (Indian Premier League) Auction Management System with Frontend and Backend components.

## Project Structure

```
AUCTION-PORTAL/
├── frontend/                 # React + TypeScript + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── README.md            # Frontend documentation
│   └── ...
│
├── backend/                 # Node.js + Express backend API
│   ├── src/
│   │   └── server.js        # Main server file
│   ├── config/              # Configuration files
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   ├── package.json
│   └── ...
│
└── README.md               # Project overview (this file)
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

## Features

### Frontend
- 2-Role Authentication (Admin/Presenter)
- Real-time Auction Dashboard
- Team Budget Management
- Professional UI with Tailwind CSS
- Responsive Design (Mobile & Desktop)
- Cross-tab Synchronization via localStorage

### Backend (To be implemented)
- RESTful API
- Database Integration
- User Authentication
- Auction Management Logic
- Team & Player Data Management

## Technology Stack

### Frontend
- React 18.3.1
- TypeScript 5.5.3
- Vite 7.1.9
- Tailwind CSS 3.4.1
- Lucide React (Icons)
- Framer Motion (Animations)
- React Router 7.9.4
- Zustand 5.0.8 (State Management)

### Backend (Planned)
- Node.js
- Express.js
- MongoDB/PostgreSQL
- JWT Authentication
- CORS & Security Middleware

## Development Workflow

1. Start the frontend development server
2. Start the backend API server
3. Frontend communicates with backend via API calls
4. Real-time updates via WebSockets or polling

## License

Proprietary - IPL Auction Portal
