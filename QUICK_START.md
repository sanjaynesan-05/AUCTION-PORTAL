# 🚀 IPL Auction Portal - Quick Start Card

## ✅ System Status
- **Frontend Server**: http://localhost:5173/
- **Status**: ✅ Running & Ready
- **Mode**: Development (Vite with HMR enabled)

---

## 🔐 Login Credentials - Copy & Paste Ready

### Admin Access
```
Username: admin
Password: admin123
```

### Presenter Access
```
Username: presenter
Password: presenter123
```

### Team Viewer - CSK (Chennai Super Kings)
```
Username: csk_viewer
Password: csk@2024
```

### Team Viewer - MI (Mumbai Indians)
```
Username: mi_viewer
Password: mi@2024
```

### Team Viewer - RCB (Royal Challengers Bangalore)
```
Username: rcb_viewer
Password: rcb@2024
```

### Team Viewer - KKR (Kolkata Knight Riders)
```
Username: kkr_viewer
Password: kkr@2024
```

### Team Viewer - DC (Delhi Capitals)
```
Username: dc_viewer
Password: dc@2024
```

### Team Viewer - RR (Rajasthan Royals)
```
Username: rr_viewer
Password: rr@2024
```

### Team Viewer - PBKS (Punjab Kings)
```
Username: pbks_viewer
Password: pbks@2024
```

### Team Viewer - SRH (Sunrisers Hyderabad)
```
Username: srh_viewer
Password: srh@2024
```

### Team Viewer - GT (Gujarat Titans)
```
Username: gt_viewer
Password: gt@2024
```

### Team Viewer - LSG (Lucknow Super Giants)
```
Username: lsg_viewer
Password: lsg@2024
```

---

## 🎯 Features by Role

### 👑 Admin Features (admin / admin123)
✅ Player Management (Add, Edit, Delete)
✅ Advanced Search & Filter
✅ Player Export (CSV)
✅ Full System Control
✅ Auction Administration
✅ Analytics Dashboard

### 🎤 Presenter Features (presenter / presenter123)
✅ Live Auction Control
✅ Player Navigation
✅ Real-time Bidding
✅ Bid History Tracking
✅ Team Purse Monitoring
✅ Auction State Management

### 👀 Viewer Features (Any Team)
✅ Live Auction Viewing
✅ Team Dashboard
✅ Purse Tracking
✅ Bid History
✅ Real-time Updates
✅ Team Analytics

---

## 🧪 Testing Scenarios

### Scenario 1: Admin Player Management
1. Go to http://localhost:5173/
2. Login as: **admin** / **admin123**
3. Try:
   - Search for a player
   - Apply filters
   - Edit a player
   - Export player list

### Scenario 2: Live Auction
1. **Tab 1**: Login as **presenter** / **presenter123**
2. Start auction and bid on players
3. **Tab 2**: Login as **csk_viewer** / **csk@2024**
4. Watch real-time updates without refresh (cross-tab sync!)

### Scenario 3: Multi-Tab Synchronization
1. **Tab 1**: presenter / presenter123
2. **Tab 2**: csk_viewer / csk@2024
3. **Tab 3**: mi_viewer / mi@2024
4. Make changes in Tab 1
5. See instant updates in Tabs 2 & 3

### Scenario 4: Team Competition
1. **Tab 1**: CSK Viewer - Monitor CSK budget
2. **Tab 2**: MI Viewer - Monitor MI budget
3. **Tab 3**: Presenter - Place bids
4. Watch both teams respond in real-time

---

## ⚡ Quick Links

| Access | URL | Notes |
|--------|-----|-------|
| **Home** | http://localhost:5173/ | Login page |
| **Admin** | http://localhost:5173/admin | After login as admin |
| **Presenter** | http://localhost:5173/presenter | After login as presenter |
| **Viewer** | http://localhost:5173/viewer | After login as team viewer |

---

## 🛠️ Technical Stack

- **Framework**: React 18.3.1 + TypeScript 5.5.3
- **Build Tool**: Vite 7.1.9
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: Zustand 5.0.8
- **Routing**: React Router 7.9.4
- **Icons**: Lucide React

---

## 📱 Responsive Design

Works perfectly on:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Mobile (320px+)

---

## 🔧 Troubleshooting

### "Can't connect to server"
→ Make sure the dev server is running: `npm run dev`
→ Check the terminal shows: "VITE v7.1.9 ready"

### "Invalid credentials"
→ Check username and password are correct (case-sensitive)
→ Use copy-paste from this card

### "Page stays blank"
→ Try refreshing (F5)
→ Clear browser cache (Ctrl+Shift+Delete)
→ Check browser console (F12) for errors

### "Changes not syncing between tabs"
→ Make sure localStorage is enabled
→ Check browser console for errors
→ Refresh all tabs

---

## 🎨 Key Features Working

✅ Multi-role authentication
✅ Role-based access control
✅ Real-time cross-tab synchronization
✅ Responsive modern UI
✅ Player management
✅ Team management
✅ Auction management
✅ Bid tracking
✅ Purse tracking
✅ Data export
✅ Error handling
✅ Loading states

---

## 💡 Pro Tips

1. **Use Quick Access**: Click "Quick Access" tab to instantly login to any team
2. **Test Sync**: Open 3 tabs - changes appear instantly in all of them
3. **Export Data**: Login as Admin and use export button for player CSV
4. **Check Console**: Press F12 to see detailed logs
5. **Check Network**: Monitor API calls in DevTools Network tab

---

## 📞 Support Resources

- **Frontend Code**: `src/pages/Login.tsx` - Authentication logic
- **User Data**: `src/data/mockUsers.ts` - All credentials
- **Team Data**: `src/data/mockTeams.ts` - Team information
- **State Store**: `src/store/useAuctionStore.ts` - Auction state
- **Auth Context**: `src/context/RoleContext.tsx` - User context

---

**Last Updated**: January 7, 2026
**Version**: 1.0.0
**Status**: ✅ All Systems Operational

---

## 🎯 Next Steps

1. ✅ Server running on http://localhost:5173/
2. ✅ Pick a credential from above
3. ✅ Test the features
4. ✅ Open multiple tabs for sync testing
5. ✅ Enjoy the auction! 🏆

**Everything is ready to go!** 🚀
