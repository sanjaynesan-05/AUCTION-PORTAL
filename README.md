# 🏏 Auction Portal

A modern, real-time cricket player auction portal built with React, TypeScript, and Vite. This application provides a comprehensive platform for conducting cricket auctions with role-based access control and real-time bidding functionality.

## ✨ Features

### 🔐 Role-Based Access Control
- **Admin Panel**: Complete auction management and player administration
- **Presenter Panel**: Live auction presentation and bid management
- **Viewer Screen**: Real-time auction viewing for spectators
- **Secure Login**: Role-based authentication system

### 🏆 Auction Management
- **Player Management**: Add, remove, and manage player profiles
- **Team Management**: Track team purses and player acquisitions
- **Live Bidding**: Real-time bid placement and tracking
- **Auction Controls**: Start, pause, resume, and navigate through players
- **Bid History**: Complete transaction history and analytics

### � Real-Time Synchronization
- **Cross-Tab Communication**: Updates from presenter reflect instantly in viewer screens
- **Local Storage Sync**: Auction state persists across browser tabs and windows
- **Live Updates**: Bid changes, player navigation, and auction controls sync in real-time
- **Automatic Reconciliation**: Conflicting updates are resolved with timestamp-based priority

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand 5.0 with real-time synchronization
- **Cross-Tab Sync**: Custom sync utility using localStorage and Custom Events
- **Routing**: React Router DOM 7.9
- **Icons**: Lucide React
- **Database Ready**: Supabase integration configured
- **Linting**: ESLint 9.x with TypeScript support

## 📁 Project Structure

```
src/
├── components/
│   └── common/
│       └── RoleGuard.tsx       # Route protection component
├── context/
│   └── RoleContext.tsx         # Role-based authentication context
├── data/
│   ├── mockPlayers.ts          # Player data and interfaces
│   ├── mockTeams.ts           # Team data and interfaces
│   └── mockUsers.ts           # User authentication data
├── pages/
│   ├── AdminPanel.tsx          # Admin dashboard
│   ├── Login.tsx              # Authentication page
│   ├── PresenterPanel.tsx     # Auction presentation interface
│   ├── ViewerScreen.tsx       # Spectator view
│   └── Unauthorized.tsx       # Access denied page
├── routes/
│   └── AppRoutes.tsx          # Application routing configuration
├── hooks/
│   └── useAuctionSync.ts     # Real-time synchronization hook
├── utils/
│   └── auctionSync.ts        # Cross-tab communication utility
├── App.tsx                    # Main application component
└── main.tsx                   # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AUCTION\ PORTAL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 🔑 User Roles & Access

### Admin
- Complete auction management
- Player and team administration
- Full system access and controls

### Presenter
- Live auction presentation
- Bid management and player navigation
- Real-time auction controls

### Viewer
- Spectator mode for auction viewing
- Real-time bid updates
- Player and team information display

## 📱 Pages Overview

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| Login | `/login` | Public | Authentication portal |
| Admin Panel | `/admin` | Admin only | Complete auction management |
| Presenter Panel | `/presenter` | Presenter only | Live auction presentation |
| Viewer Screen | `/viewer` | Viewer only | Spectator interface |
| Unauthorized | `/unauthorized` | All | Access denied page |

## 🎯 Key Components

### AuctionStore (Zustand)
- **State Management**: Centralized auction state
- **Real-time Updates**: Live bid tracking and player status
- **Persistence**: Maintains auction state across components

### RoleGuard
- **Route Protection**: Enforces role-based access
- **Authentication**: Validates user permissions
- **Redirection**: Automatic routing based on roles

### Mock Data
- **Players**: 15+ professional cricket players with detailed profiles
- **Teams**: 8 IPL teams with authentic branding and purse management
- **Users**: Role-based authentication profiles

## 🔧 Configuration

### Environment Setup
The application is configured for easy deployment with:
- Vite configuration optimized for React
- Tailwind CSS with PostCSS processing
- TypeScript strict mode enabled
- ESLint with React and TypeScript rules

### Database Integration
- Supabase client configured and ready
- Mock data can be easily migrated to live database
- Authentication system prepared for Supabase integration

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first Tailwind CSS implementation
- **Modern Interface**: Clean, professional auction interface
- **Real-time Updates**: Instant bid and state synchronization
- **Accessible**: Proper semantic HTML and ARIA support

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- [x] **Real-time Cross-Tab Synchronization**: Implemented using localStorage and Custom Events
- [ ] **WebSocket Integration**: Upgrade to server-based real-time communication
- [ ] **Advanced Analytics**: Comprehensive auction statistics and reporting
- [ ] **Mobile Application**: Native apps for iOS and Android
- [ ] **Multi-Language Support**: Internationalization for global audiences
- [ ] **Advanced Bidding Strategies**: Automated bidding algorithms and predictions
- [ ] **External API Integration**: Live cricket data and player statistics
- [ ] **Video Streaming**: Integrated live video feeds during auctions
- [ ] **Advanced Team Management**: Detailed roster management and analytics

---

**Built with ❤️ for cricket auction enthusiasts**