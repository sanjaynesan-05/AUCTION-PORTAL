# IPL Auction Portal - Frontend

React + TypeScript + Vite + Tailwind CSS

## Directory Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React context (authentication, roles)
│   ├── services/           # API client and utilities
│   ├── data/               # Mock data
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── .env.development        # Development environment variables
└── .env.production         # Production environment variables
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# or
yarn install
```

### Development

```bash
# From root directory - runs both frontend and backend
npm run dev

# Or run frontend only
npm run frontend:dev
```

The frontend will start at `http://localhost:5173` and proxy API requests to `http://localhost:8000`

### Build

```bash
npm run frontend:build
```

### Environment Variables

Create `.env.development` for development:
```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

Create `.env.production` for production:
```
VITE_API_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-api-domain.com
```

## Features

### Pages
- **Login** - User authentication
- **Admin Panel** - Admin controls and monitoring
- **Presenter Panel** - Live auction presentation
- **Viewer Screen** - Live auction viewing

### Components
- **ErrorBoundary** - Error handling
- **FloatingTeamPurse** - Team purse display
- **LiveUpdatesFooter** - Real-time updates
- **TVBroadcastPlayer** - Live video broadcast
- **RoleGuard** - Role-based access control

### Authentication
- JWT token-based authentication
- Role-based access control (Admin, Presenter, Viewer)
- Secure token storage in localStorage

### Real-Time Updates
- WebSocket connection for live auction updates
- Real-time player bid tracking
- Live team purse updates

## API Integration

All API endpoints are configured in `src/services/apiClient.ts`:

- **Authentication** - `/auth/login`, `/auth/logout`
- **Players** - `/players`, `/players/{id}`
- **Teams** - `/teams`, `/teams/{id}`
- **Auction** - `/auction/state`, `/auction/bid`, etc.
- **WebSocket** - `/ws/auction`

## Scripts

```bash
npm run frontend:dev       # Start frontend dev server
npm run frontend:build     # Build for production
npm run frontend:preview   # Preview production build
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
