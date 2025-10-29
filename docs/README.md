# 📚 Documentation Index

Complete documentation for the IPL Auction Portal.

## 🚀 Getting Started

Perfect for first-time users and quick setup.

- **[Quick Start Guide](setup/QUICK-START.md)** - Get running in 5 minutes
- **[Backend Setup](setup/BACKEND-SETUP.md)** - Complete backend installation
- **[Frontend Setup](setup/FRONTEND-SETUP.md)** - Frontend configuration

## 🎯 Core Features

Learn about the main features and how they work.

- **[Viewer Team Restrictions](features/VIEWER-RESTRICTIONS.md)** - Team-based data isolation
- **[Role-Based Access Control](features/RBAC.md)** - Permission system and roles
- **[Auction Data Flow](features/AUCTION-FLOW.md)** - How auction data is managed

## 📡 API Documentation

Reference guides for developers.

- **[REST API Reference](api/REST-API.md)** - Complete HTTP API documentation
- **[WebSocket Events](api/WEBSOCKET-EVENTS.md)** - Real-time event reference

## 📖 User Guides

Step-by-step guides for common tasks.

- **[Test Accounts](guides/TEST-ACCOUNTS.md)** - All test credentials
- **[Testing Guide](guides/TESTING.md)** - How to test the application
- **[Deployment Guide](guides/DEPLOYMENT.md)** - Production deployment

## 📁 Documentation Structure

```
docs/
├── README.md                          # This file (documentation index)
│
├── setup/                             # Setup & Installation
│   ├── QUICK-START.md                # 5-minute quick start
│   ├── BACKEND-SETUP.md              # Detailed backend setup
│   ├── FRONTEND-SETUP.md             # Frontend configuration
│   └── INSTALL-POSTGRESQL.md         # PostgreSQL installation (legacy)
│
├── features/                          # Feature Documentation
│   ├── VIEWER-RESTRICTIONS.md        # Team-based filtering
│   ├── RBAC.md                       # Role permissions
│   ├── AUCTION-FLOW.md               # Data flow & synchronization
│   └── VIEWER-IMPLEMENTATION.md      # Implementation details
│
├── api/                               # API Reference
│   ├── REST-API.md                   # HTTP endpoints
│   └── WEBSOCKET-EVENTS.md           # Real-time events
│
├── guides/                            # User Guides
│   ├── TEST-ACCOUNTS.md              # Test credentials
│   ├── TESTING.md                    # Testing instructions
│   ├── DEPLOYMENT.md                 # Production deployment
│   └── VIEWER-QUICK-TEST.md          # Quick viewer test
│
└── MASTER-GUIDE-OLD.md               # Legacy comprehensive guide
```

## 🔍 Find What You Need

### I want to...

#### ...set up the project
→ Start with [Quick Start Guide](setup/QUICK-START.md)

#### ...understand viewer restrictions
→ Read [Viewer Team Restrictions](features/VIEWER-RESTRICTIONS.md)

#### ...know what each role can do
→ Check [RBAC Permissions](features/RBAC.md)

#### ...integrate with the API
→ See [REST API Reference](api/REST-API.md)

#### ...test the application
→ Follow [Testing Guide](guides/TESTING.md)

#### ...deploy to production
→ Use [Deployment Guide](guides/DEPLOYMENT.md)

#### ...get test login credentials
→ View [Test Accounts](guides/TEST-ACCOUNTS.md)

## 📊 Documentation by Role

### For Developers
1. [Quick Start](setup/QUICK-START.md)
2. [Backend Setup](setup/BACKEND-SETUP.md)
3. [Frontend Setup](setup/FRONTEND-SETUP.md)
4. [REST API](api/REST-API.md)
5. [WebSocket Events](api/WEBSOCKET-EVENTS.md)
6. [Testing Guide](guides/TESTING.md)

### For System Administrators
1. [Backend Setup](setup/BACKEND-SETUP.md)
2. [Deployment Guide](guides/DEPLOYMENT.md)
3. [RBAC Permissions](features/RBAC.md)
4. [Test Accounts](guides/TEST-ACCOUNTS.md)

### For Product Managers
1. [Quick Start](setup/QUICK-START.md)
2. [Viewer Restrictions](features/VIEWER-RESTRICTIONS.md)
3. [RBAC Permissions](features/RBAC.md)
4. [Auction Flow](features/AUCTION-FLOW.md)

### For QA Engineers
1. [Test Accounts](guides/TEST-ACCOUNTS.md)
2. [Testing Guide](guides/TESTING.md)
3. [RBAC Permissions](features/RBAC.md)
4. [REST API](api/REST-API.md)

## 🆘 Common Questions

### Setup Questions

**Q: How do I start the application?**  
A: Follow the [Quick Start Guide](setup/QUICK-START.md)

**Q: What are the system requirements?**  
A: Node.js 16+, npm. See [Backend Setup](setup/BACKEND-SETUP.md)

**Q: How do I initialize the database?**  
A: Run `cd backend && npm run init-db`. Details in [Backend Setup](setup/BACKEND-SETUP.md)

### Feature Questions

**Q: Can viewers see other teams' data?**  
A: No! Each viewer only sees their own team. See [Viewer Restrictions](features/VIEWER-RESTRICTIONS.md)

**Q: Who can place bids?**  
A: Only viewers (team owners) can place bids. See [RBAC Permissions](features/RBAC.md)

**Q: How does real-time synchronization work?**  
A: Via WebSocket (Socket.io). See [Auction Flow](features/AUCTION-FLOW.md)

### Testing Questions

**Q: What are the test login credentials?**  
A: See complete list in [Test Accounts](guides/TEST-ACCOUNTS.md)

**Q: How do I test viewer restrictions?**  
A: Follow [Testing Guide](guides/TESTING.md) or [Viewer Quick Test](guides/VIEWER-QUICK-TEST.md)

**Q: How do I test the API?**  
A: Use Postman/curl with examples from [REST API Reference](api/REST-API.md)

## 🔗 External Resources

- **GitHub Repository**: [sanjaynesan-05/AUCTION-PORTAL](https://github.com/sanjaynesan-05/AUCTION-PORTAL)
- **React Documentation**: [react.dev](https://react.dev)
- **Socket.io Documentation**: [socket.io/docs](https://socket.io/docs)
- **Sequelize Documentation**: [sequelize.org](https://sequelize.org)

## 📝 Contributing to Documentation

Found an error or want to improve the docs?

1. Fork the repository
2. Edit the markdown files in the `docs/` folder
3. Submit a pull request

### Documentation Standards

- Use clear, concise language
- Include code examples where helpful
- Add terminal commands with expected output
- Keep file names descriptive (kebab-case.md)
- Use proper markdown formatting

## 📞 Need Help?

- **Issues**: Open an issue on [GitHub](https://github.com/sanjaynesan-05/AUCTION-PORTAL/issues)
- **Email**: your-email@example.com
- **Discussions**: Use GitHub Discussions for questions

## 📅 Last Updated

**Date**: January 30, 2025  
**Version**: 1.0.0  
**Status**: ✅ Complete

---

**[Back to Main README](../README.md)**
