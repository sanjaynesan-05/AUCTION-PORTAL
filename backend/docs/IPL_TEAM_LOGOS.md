# IPL Team Logos Configuration

## ✅ All IPL Teams Now Using Official Logos

All 10 IPL teams in the auction portal are now configured with their official team logos from Wikipedia.

### Teams and Their Logos:

1. **Chennai Super Kings (CSK)**
   - Color: #FDB913 (Yellow)
   - Logo: https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/1200px-Chennai_Super_Kings_Logo.svg.png

2. **Mumbai Indians (MI)**
   - Color: #004BA0 (Blue)
   - Logo: https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/1200px-Mumbai_Indians_Logo.svg.png

3. **Royal Challengers Bangalore (RCB)**
   - Color: #EC1C24 (Red)
   - Logo: https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Royal_Challengers_Bangalore_2020.svg/1200px-Royal_Challengers_Bangalore_2020.svg.png

4. **Kolkata Knight Riders (KKR)**
   - Color: #3A225D (Purple)
   - Logo: https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Kolkata_Knight_Riders_Logo.svg/1200px-Kolkata_Knight_Riders_Logo.svg.png

5. **Delhi Capitals (DC)**
   - Color: #004C93 (Dark Blue)
   - Logo: https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Delhi_Capitals_Logo.svg/1200px-Delhi_Capitals_Logo.svg.png

6. **Rajasthan Royals (RR)**
   - Color: #254AA5 (Royal Blue)
   - Logo: https://upload.wikimedia.org/wikipedia/en/thumb/6/60/Rajasthan_Royals_Logo.svg/1200px-Rajasthan_Royals_Logo.svg.png

7. **Punjab Kings (PBKS)**
   - Color: #DD1F2D (Red)
   - Logo: https://upload.wikimedia.org/wikipedia/en/thumb/f/f0/Punjab_Kings_Logo.svg/1200px-Punjab_Kings_Logo.svg.png

8. **Sunrisers Hyderabad (SRH)**
   - Color: #FF822A (Orange)
   - Logo: https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Sunrisers_Hyderabad.svg/1200px-Sunrisers_Hyderabad.svg.png

9. **Gujarat Titans (GT)**
   - Color: #1C2A3A (Dark Navy)
   - Logo: https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Gujarat_Titans_Logo.svg/1200px-Gujarat_Titans_Logo.svg.png

10. **Lucknow Super Giants (LSG)**
    - Color: #D4AF37 (Gold)
    - Logo: https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Lucknow_Super_Giants_Logo.svg/1200px-Lucknow_Super_Giants_Logo.svg.png

## Implementation Details

### Database Configuration
- All team logos are stored in the SQLite database in the `teams` table
- The `logo` field contains the full Wikipedia URL to the official IPL team logo
- Logos are high-resolution SVG images (1200px) from Wikipedia

### Frontend Display
- All components that display teams use the `team.logo` property
- Logos are displayed in:
  - Admin Panel (dashboard and team cards)
  - Presenter Panel (bidding interface)
  - Viewer Screen (team display)
  - Enhanced panels (all variations)
  - TV Broadcast Player
  - Floating Team Purse component

### Fallback Mechanism
- All logo `<img>` tags include an `onError` handler
- If a logo fails to load, it automatically falls back to a generated avatar:
  ```tsx
  onError={(e) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${team.shortName}&background=${team.color.slice(1)}&color=fff&size=32`;
  }}
  ```

### Files Updated
1. **backend/init-database.js** - Added logo URLs to team creation
2. **backend/scripts/update-team-logos.js** - Script to update existing team logos
3. **backend/scripts/check-logos.js** - Script to verify team logos

## How to Verify

1. **Check Database:**
   ```bash
   cd backend
   node scripts/check-logos.js
   ```

2. **View in Application:**
   - Log in to Admin Panel (admin/admin123)
   - View team cards in the dashboard
   - Start an auction to see logos in presenter/viewer screens

## Notes
- Logos are loaded from Wikipedia's CDN for reliability
- All logos are official IPL team logos in SVG format
- High resolution (1200px) ensures quality display on all screens
- Logos automatically scale to appropriate sizes in different components
