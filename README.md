# 🏏 IPL Auction Portal# 🏏 IPL Auction Portal 2025



A comprehensive real-time auction management system for IPL cricket player auctions, built with React, TypeScript, and PostgreSQL.A professional, real-time cricket player auction portal built with React, TypeScript, and Vite. This comprehensive application provides an authentic IPL auction experience with role-based access control, real-time synchronization, and stunning modern UI design.



## 📁 Project Structure## ✨ Features



```### 🔐 Advanced Authentication System

AUCTION-PORTAL/- **Tabbed Login Interface**: Modern Sign In and Quick Access tabs

├── frontend/                 # React + TypeScript + Vite frontend- **Role-Based Access**: Admin, Presenter, and Team Viewer accounts

│   ├── src/- **Secure Navigation**: Automatic role-based dashboard routing

│   │   ├── components/      # Reusable UI components- **Quick Team Access**: Instant login for all 10 IPL teams

│   │   ├── pages/          # Page components (Admin, Presenter, Viewer)

│   │   ├── context/        # React context providers### 🏆 Complete Auction Management

│   │   ├── store/          # Zustand state management- **Live Player Auctions**: Real-time bidding with professional controls

│   │   ├── routes/         # React Router configuration- **Team Management**: Track all 10 IPL teams with authentic branding

│   │   ├── data/           # Mock data and constants- **Player Database**: 20+ professional cricketers with detailed profiles

│   │   ├── hooks/          # Custom React hooks- **Purse Tracking**: Dynamic budget management with visual indicators

│   │   └── utils/          # Utility functions- **Auction Controls**: Start, pause, resume, navigate, and manage sales

│   ├── public/             # Static assets

│   ├── index.html          # Entry HTML file### 📡 Real-Time Synchronization

│   ├── vite.config.ts      # Vite configuration- **Cross-Tab Communication**: Updates sync instantly across all browser tabs

│   ├── tailwind.config.js  # Tailwind CSS configuration- **Local Storage Persistence**: Auction state maintained across sessions

│   ├── tsconfig.json       # TypeScript configuration- **Live Updates**: Bid changes, player navigation sync in real-time

│   └── package.json        # Frontend dependencies- **Multi-User Support**: Simultaneous presenter and viewer experiences

│

├── backend/                 # Node.js + Express + PostgreSQL backend### 📊 Enhanced Team Features

│   ├── models/             # Sequelize database models- **Complete IPL Roster**: All 10 current IPL teams (CSK, MI, RCB, KKR, DC, RR, PBKS, SRH, GT, LSG)

│   │   ├── User.model.js   # User authentication model- **Official Branding**: Authentic team logos, colors, and styling

│   │   ├── Player.model.js # Player data model- **Team Analytics**: Enhanced purse status with progress bars and statistics

│   │   ├── Team.model.js   # Team data model- **Player Tracking**: Individual team rosters with spending analysis

│   │   └── index.js        # Model associations- **Live Leaderboards**: Real-time team rankings and purse status

│   ├── routes/             # Express API routes

│   │   ├── auth.routes.js  # Authentication endpoints## 🛠️ Tech Stack

│   │   ├── players.routes.js # Player CRUD operations

│   │   └── teams.routes.js # Team CRUD operations- **Frontend**: React 18.3.1 with TypeScript 5.5.3

│   ├── middleware/         # Express middleware- **Build Tool**: Vite 7.1.9 with fast HMR and optimized bundling

│   │   └── authMiddleware.js # JWT authentication- **Styling**: Tailwind CSS 3.4.1 with PostCSS and Autoprefixer

│   ├── docs/               # Backend documentation- **State Management**: Zustand 5.0.8 with persistent real-time synchronization

│   │   └── BACKEND.md      # API documentation- **Cross-Tab Sync**: Custom localStorage-based sync with Custom Events API

│   ├── database.js         # PostgreSQL connection (Sequelize)- **Routing**: React Router DOM 7.9.4 with role-based navigation

│   ├── server.postgres.js  # Main server file with Socket.io- **Icons**: Lucide React 0.344.0 with 1000+ professional icons

│   ├── init-database.js    # Database initialization script- **Database Ready**: Supabase 2.57.4 integration prepared

│   ├── .env                # Environment variables- **Development**: ESLint 9.9.1, TypeScript ESLint 8.3.0, React Hooks linting

│   └── package.json        # Backend dependencies

│## 📁 Project Structure

├── docs/                    # Project documentation

│   ├── POSTGRESQL-SETUP.md      # PostgreSQL setup guide```

│   ├── MIGRATION-SUMMARY.md     # MongoDB to PostgreSQL migrationAUCTION PORTAL/

│   ├── QUICKSTART-POSTGRESQL.md # Quick start guide├── public/                     # Static assets and favicon

│   └── SETUP.md                 # General setup instructions├── src/

││   ├── components/

├── scripts/                 # Utility scripts│   │   └── common/

│   ├── install-all.ps1     # Install all dependencies│   │       └── RoleGuard.tsx   # Route protection & access control

│   ├── start-all.ps1       # Start frontend and backend│   ├── context/

│   ├── setup-postgresql.ps1 # PostgreSQL setup automation│   │   └── RoleContext.tsx     # Authentication state management

│   └── test-backend.ps1    # Backend testing script│   ├── data/

││   │   ├── mockPlayers.ts      # 20+ professional cricket players

├── .gitignore              # Git ignore rules│   │   ├── mockTeams.ts        # All 10 IPL teams with official branding

└── README.md               # This file│   │   └── mockUsers.ts        # Role-based user accounts

```│   ├── hooks/

│   │   └── useAuctionSync.ts   # Real-time auction synchronization

## 🚀 Quick Start│   ├── pages/

│   │   ├── AdminPanel.tsx      # Admin dashboard with player management

### Prerequisites│   │   ├── EnhancedAdminPanel.tsx    # Enhanced admin interface

│   │   ├── Login.tsx           # Modern tabbed authentication

- **Node.js** (v16 or higher)│   │   ├── PresenterPanel.tsx  # Live auction presentation

- **PostgreSQL** (v15 or higher) or Docker│   │   ├── EnhancedPresenterPanel.tsx # Enhanced presenter interface

- **npm** or **yarn**│   │   ├── ViewerScreen.tsx    # Spectator auction view

│   │   ├── EnhancedViewerScreen.tsx  # Enhanced viewer interface

### Option 1: Automated Setup (Recommended)│   │   └── Unauthorized.tsx    # Access denied page

│   ├── routes/

```powershell│   │   └── AppRoutes.tsx       # Role-based routing configuration

# 1. Clone the repository│   ├── store/

git clone <repository-url>│   │   └── useAuctionStore.ts  # Zustand state management

cd AUCTION-PORTAL│   ├── App.tsx                 # Main application wrapper

│   ├── index.css              # Global styles & animations

# 2. Run the automated installation script│   ├── main.tsx               # Application entry point

.\scripts\install-all.ps1│   └── vite-env.d.ts          # Vite environment types

├── index.html                  # HTML template

# 3. Setup PostgreSQL database├── package.json               # Dependencies & scripts

.\setup-postgresql.ps1├── tailwind.config.js         # Tailwind CSS configuration

├── postcss.config.js          # PostCSS configuration

# 4. Start the application├── vite.config.ts             # Vite build configuration

.\scripts\start-all.ps1├── tsconfig.json              # TypeScript configuration

```├── tsconfig.app.json          # App-specific TypeScript config

├── tsconfig.node.json         # Node-specific TypeScript config

The application will be available at:└── eslint.config.js           # ESLint configuration

- **Frontend:** http://localhost:5173```

- **Backend API:** http://localhost:5000

## 🚀 Getting Started

### Option 2: Manual Setup

### Prerequisites

#### Backend Setup- Node.js 18+ 

- npm or yarn package manager

```powershell

# 1. Navigate to backend directory### Installation

cd backend

1. **Clone the repository**

# 2. Install dependencies   ```bash

npm install   git clone <repository-url>

   cd AUCTION\ PORTAL

# 3. Create .env file   ```

# Copy .env.example to .env and configure:

# DATABASE_URL=postgresql://postgres:password@localhost:5432/auction_portal2. **Install dependencies**

# JWT_SECRET=your_secret_key   ```bash

# PORT=5000   npm install

   ```

# 4. Initialize database (creates tables and seeds data)

npm run init-db3. **Start development server**

   ```bash

# 5. Start backend server   npm run dev

npm start   ```

# or for development with auto-reload:

npm run dev4. **Open in browser**

```   Navigate to `http://localhost:5173`



#### Frontend Setup### Available Scripts



```powershell- `npm run dev` - Start Vite development server with HMR at `http://localhost:5173`

# 1. Navigate to frontend directory (from root)- `npm run build` - Build optimized production bundle in `dist/`

cd frontend- `npm run preview` - Preview production build locally

- `npm run lint` - Run ESLint with TypeScript and React rules

# 2. Install dependencies- `npm run typecheck` - Run TypeScript compiler type checking

npm install

## 🔑 Authentication & User Roles

# 3. Start development server

npm run dev### 🎯 Login Methods

# or- **Traditional Login**: Username/password authentication

npm start- **Quick Access**: One-click role-based login buttons

```- **Team Viewers**: Instant access for all 10 IPL team accounts



### Option 3: Docker Setup### 👑 Admin Access

- **Credentials**: `admin` / `admin123`

```powershell- **Features**: Complete auction management, player administration, team controls

# 1. Start PostgreSQL container- **Dashboard**: `/admin` - Full system oversight and configuration

docker run --name auction-postgres `

  -e POSTGRES_PASSWORD=password `### 🎙️ Presenter Access  

  -e POSTGRES_DB=auction_portal `- **Credentials**: `presenter` / `presenter123`

  -p 5432:5432 -d postgres:15- **Features**: Live auction presentation, bid management, player navigation

- **Dashboard**: `/presenter` - Professional auction control interface

# 2. Follow manual setup steps for backend and frontend

```### 👥 Team Viewer Access

**All 10 IPL Teams Available:**

## 👤 Default Credentials- **CSK**: `csk_viewer` / `csk@2024`

- **MI**: `mi_viewer` / `mi@2024` 

After running `npm run init-db`, you can login with:- **RCB**: `rcb_viewer` / `rcb@2024`

- **KKR**: `kkr_viewer` / `kkr@2024`

- **Username:** `admin`- **DC**: `dc_viewer` / `dc@2024`

- **Password:** `admin123`- **RR**: `rr_viewer` / `rr@2024`

- **Role:** Admin (full access)- **PBKS**: `pbks_viewer` / `pbks@2024`

- **SRH**: `srh_viewer` / `srh@2024`

## 🎯 Features- **GT**: `gt_viewer` / `gt@2024`

- **LSG**: `lsg_viewer` / `lsg@2024`

### Admin Panel

- ✅ User management (create, edit, delete users)**Features**: Real-time auction viewing, team-specific dashboards, bid tracking

- ✅ Player management (add, edit, delete players)

- ✅ Team management (create, manage teams)## 📱 Pages Overview

- ✅ Auction control (start, pause, reset)

- ✅ Real-time auction monitoring| Page | Route | Access | Description |

|------|-------|--------|-------------|

### Presenter Panel| Login | `/login` | Public | Authentication portal |

- ✅ Live auction control| Admin Panel | `/admin` | Admin only | Complete auction management |

- ✅ Player bidding interface| Presenter Panel | `/presenter` | Presenter only | Live auction presentation |

- ✅ Mark players as sold/unsold| Viewer Screen | `/viewer` | Viewer only | Spectator interface |

- ✅ Real-time team purse tracking| Unauthorized | `/unauthorized` | All | Access denied page |

- ✅ Player details display

## 🎯 Key Components

### Viewer Screen

- ✅ Live auction updates### AuctionStore (Zustand)

- ✅ Current player on auction- **State Management**: Centralized auction state

- ✅ Team purse display- **Real-time Updates**: Live bid tracking and player status

- ✅ Sold players list- **Persistence**: Maintains auction state across components

- ✅ TV broadcast-style interface

### RoleGuard

### Technical Features- **Route Protection**: Enforces role-based access

- ✅ Real-time updates using Socket.io- **Authentication**: Validates user permissions

- ✅ JWT-based authentication- **Redirection**: Automatic routing based on roles

- ✅ Role-based access control (Admin, Presenter, Viewer)

- ✅ PostgreSQL database with Sequelize ORM### Mock Data

- ✅ Responsive design with Tailwind CSS- **Players**: 20+ professional cricket players with authentic profiles and statistics

- ✅ Type-safe with TypeScript- **Teams**: Complete 10 IPL teams with official logos, colors, and branding

- **Users**: Comprehensive role-based authentication system with team-specific accounts

## 🛠️ Technology Stack

## 🔧 Configuration

### Frontend

- **React 18** - UI library### Environment Setup

- **TypeScript** - Type safetyThe application is configured for easy deployment with:

- **Vite** - Build tool- Vite configuration optimized for React

- **Tailwind CSS** - Styling- Tailwind CSS with PostCSS processing

- **Zustand** - State management- TypeScript strict mode enabled

- **React Router** - Routing- ESLint with React and TypeScript rules

- **Framer Motion** - Animations

- **Lucide React** - Icons### Database Integration

- **Socket.io Client** - Real-time communication- Supabase client configured and ready

- Mock data can be easily migrated to live database

### Backend- Authentication system prepared for Supabase integration

- **Node.js** - Runtime

- **Express.js** - Web framework## 🎨 UI/UX Features

- **PostgreSQL** - Database

- **Sequelize** - ORM### 🎯 Modern Design System

- **Socket.io** - Real-time bidirectional communication- **Professional IPL Branding**: Authentic team colors, official logos, and styling

- **JWT** - Authentication- **Glassmorphism Effects**: Premium backdrop blur and transparency layers

- **bcrypt** - Password hashing- **Gradient Overlays**: Dynamic color schemes matching team identities

- **CORS** - Cross-origin resource sharing- **Responsive Grid Layouts**: Mobile-first design with Tailwind breakpoints



## 📚 Documentation### ⚡ Interactive Elements

- **Smooth Animations**: CSS transitions and hover effects throughout

- **[Backend API Documentation](./backend/docs/BACKEND.md)** - Complete API reference- **Real-time Status Indicators**: Live auction status with pulsing animations

- **[PostgreSQL Setup Guide](./docs/POSTGRESQL-SETUP.md)** - Detailed database setup- **Enhanced Team Cards**: Hover scaling, color theming, and progress bars

- **[Quick Start Guide](./docs/QUICKSTART-POSTGRESQL.md)** - 5-minute setup- **Tabbed Navigation**: Modern login interface with Sign In and Quick Access

- **[Migration Summary](./docs/MIGRATION-SUMMARY.md)** - MongoDB to PostgreSQL migration- **Micro-interactions**: Button hover states, loading spinners, and visual feedback



## 🔧 Development### 📱 Enhanced Responsiveness

- **Mobile Navigation**: Touch-friendly elements and optimized layouts

### Backend Development- **Tablet Optimization**: Grid adjustments for medium screen sizes  

- **Desktop Experience**: Full-featured interface with advanced controls

```powershell- **Cross-browser Support**: Tested across modern browsers with consistent styling

cd backend

npm run dev  # Starts server with nodemon (auto-reload)### 🎯 Accessibility & Performance

```- **Semantic HTML**: Proper heading hierarchy and ARIA attributes

- **Keyboard Navigation**: Full keyboard accessibility support

### Frontend Development- **High Contrast**: Professional dark theme with optimal color ratios

- **Fast Loading**: Optimized assets and efficient component rendering

```powershell

cd frontend## 🚀 Deployment

npm run dev  # Starts Vite dev server with HMR

```### Build for Production

```bash

### Building for Productionnpm run build

```

```powershell

# Build frontend### Preview Production Build

cd frontend```bash

npm run buildnpm run preview

```

# Build creates optimized files in frontend/dist/

# Serve with any static file server or configure backend to serve themThe built files will be in the `dist/` directory, ready for deployment to any static hosting service.

```

## 🤝 Contributing

## 🧪 Testing

1. Fork the repository

```powershell2. Create a feature branch (`git checkout -b feature/amazing-feature`)

# Test backend API3. Commit your changes (`git commit -m 'Add amazing feature'`)

cd backend4. Push to the branch (`git push origin feature/amazing-feature`)

npm test5. Open a Pull Request



# Test backend endpoints## 📄 License

.\scripts\test-backend.ps1

This project is licensed under the MIT License - see the LICENSE file for details.

# Type checking (frontend)

cd frontend## 🔮 Roadmap & Future Enhancements

npm run typecheck

```### ✅ Completed Features

- [x] **Real-time Cross-Tab Synchronization**: Implemented with localStorage and Custom Events

## 📦 Available Scripts- [x] **Complete IPL Team Integration**: All 10 teams with official branding

- [x] **Professional UI Redesign**: Modern glassmorphism effects and animations  

### Backend Scripts- [x] **Enhanced Authentication**: Tabbed login with quick access for all roles

- `npm start` - Start production server- [x] **Advanced Team Analytics**: Interactive purse tracking with progress indicators

- `npm run dev` - Start development server with auto-reload- [x] **Mobile Responsive Design**: Touch-friendly interface across all devices

- `npm run init-db` - Initialize database and seed data- [x] **Enhanced Presenter Panel**: Professional auction management interface



### Frontend Scripts### 🚀 Planned Improvements

- `npm start` or `npm run dev` - Start development server- [ ] **WebSocket Integration**: Server-based real-time communication for multi-user sessions

- `npm run build` - Build for production- [ ] **Advanced Analytics Dashboard**: Comprehensive auction statistics and performance metrics

- `npm run preview` - Preview production build- [ ] **Player Performance API**: Integration with live cricket statistics and rankings

- `npm run lint` - Run ESLint- [ ] **Auction History**: Complete transaction logs and historical data analysis

- `npm run typecheck` - Check TypeScript types- [ ] **Advanced Bidding Features**: Automated bidding strategies and AI predictions

- [ ] **Video Integration**: Live streaming capabilities during auction sessions

## 🔒 Environment Variables- [ ] **Mobile Applications**: Native iOS and Android apps with push notifications

- [ ] **Multi-Language Support**: Internationalization for global cricket audiences

### Backend (.env)

```env### 🎯 Technical Enhancements

DATABASE_URL=postgresql://postgres:password@localhost:5432/auction_portal- [ ] **Database Integration**: Full Supabase backend with real-time subscriptions

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production- [ ] **Authentication Upgrade**: OAuth integration with Google, Facebook, Twitter

PORT=5000- [ ] **Advanced Caching**: Redis integration for improved performance

NODE_ENV=development- [ ] **Testing Suite**: Comprehensive unit, integration, and E2E testing

```- [ ] **CI/CD Pipeline**: Automated testing and deployment workflows

- [ ] **Performance Monitoring**: Real-time analytics and error tracking

## 🐛 Troubleshooting

## 📊 Project Statistics

### PostgreSQL Connection Issues

```powershell- **Total Files**: 30+ TypeScript/React components

# Check if PostgreSQL is running- **Team Coverage**: All 10 current IPL teams with authentic branding

Get-Service postgresql*- **Player Database**: 20+ professional cricketers with detailed profiles  

- **Authentication**: 13 pre-configured user accounts across all roles

# Start PostgreSQL service- **UI Components**: 15+ page layouts with modern design system

Start-Service postgresql-x64-15- **Real-time Features**: Cross-tab synchronization and live auction updates

```

## 🌟 Key Highlights

### Port Already in Use

```powershell- **Professional Grade**: Enterprise-level React application architecture

# Check what's using port 5000 (backend)- **IPL Official**: Authentic team logos, colors, and branding throughout

netstat -ano | findstr :5000- **Real-time Sync**: Advanced cross-tab communication without server dependency

- **Mobile Ready**: Fully responsive design tested on all device sizes

# Check what's using port 5173 (frontend)- **Type Safe**: Complete TypeScript implementation with strict type checking

netstat -ano | findstr :5173- **Performance Optimized**: Vite build system with fast HMR and efficient bundling

```

---

### Module Not Found Errors

```powershell**Built with ❤️ for cricket auction enthusiasts | IPL Auction Portal 2025**
# Reinstall dependencies
cd backend
Remove-Item node_modules -Recurse -Force
npm install

cd ../frontend
Remove-Item node_modules -Recurse -Force
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Sanjay Nesan** - Initial work

## 🙏 Acknowledgments

- React and Vite communities
- Socket.io documentation
- PostgreSQL and Sequelize teams
- Tailwind CSS framework

---

**Made with ❤️ for IPL Auction Management**
