# ⚡ CRITICAL: Fix Backend Environment Variables on Render

## 🚨 Problem Identified
Backend returns **500 error** on login because environment variables are NOT SET on Render.

## ✅ Solution: Add Environment Variables

### Step-by-Step Instructions:

1. **Go to Render Dashboard**
   - URL: https://dashboard.render.com
   - Log in with your account

2. **Select Backend Service**
   - Find: `auction-portal` (backend service)
   - Click to open it

3. **Go to Settings**
   - Click **Settings** tab
   - Scroll to **Environment**

4. **Add Each Variable**
   Click **Add Environment Variable** for each:

   | Key | Value | Purpose |
   |-----|-------|---------|
   | `ADMIN_PASSWORD` | Create strong password | Admin login |
   | `PRESENTER_PASSWORD` | Create strong password | Presenter login |
   | `TEAM_CSK_PASSWORD` | `csk@123` | Chennai Super Kings |
   | `TEAM_MI_PASSWORD` | `mi@123` | Mumbai Indians |
   | `TEAM_RCB_PASSWORD` | `rcb@123` | Royal Challengers Bangalore |
   | `TEAM_KKR_PASSWORD` | `kkr@123` | Kolkata Knight Riders |
   | `TEAM_DC_PASSWORD` | `dc@123` | Delhi Capitals |
   | `TEAM_RR_PASSWORD` | `rr@123` | Rajasthan Royals |
   | `TEAM_PBKS_PASSWORD` | `pbks@123` | Punjab Kings |
   | `TEAM_SRH_PASSWORD` | `srh@123` | Sunrisers Hyderabad |
   | `TEAM_GT_PASSWORD` | `gt@123` | Gujarat Titans |
   | `TEAM_LSG_PASSWORD` | `lsg@123` | Lucknow Super Giants |
   | `SECRET_KEY` | Create random 32-char string | JWT signing |

   **Example strong passwords:**
   - ADMIN_PASSWORD: `AuCtI0n@2025#SeCuRe`
   - PRESENTER_PASSWORD: `PreSent@2025#AuCt`
   - SECRET_KEY: Generate from: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

5. **Save Changes**
   - Click **Save** after adding all variables

6. **Restart Backend**
   - Go to **Deployments** tab
   - Find the latest deployment
   - Click **Reboot** (or wait 5 min for auto-redeploy)
   - Wait 2-3 minutes for restart

7. **Test the Fix**
   ```powershell
   $body = @{ username = "admin"; password = "YOUR_ADMIN_PASSWORD" } | ConvertTo-Json
   
   $response = Invoke-WebRequest `
     -Uri "https://auction-portal-7bds.onrender.com/auth/login" `
     -Method POST `
     -Headers @{"Content-Type"="application/json"} `
     -Body $body
   
   $response.Content | ConvertFrom-Json
   ```

   **Expected Response:**
   ```json
   {
     "access_token": "eyJ...",
     "token_type": "bearer",
     "user": {
       "id": "admin",
       "username": "admin",
       "role": "admin",
       "teamId": null,
       "teamName": null
     }
   }
   ```

---

## 🎯 Quick Verification

After adding env vars and restarting:

```bash
# Check health (should work)
curl https://auction-portal-7bds.onrender.com/health

# Check login (should work after restart)
curl -X POST https://auction-portal-7bds.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_ADMIN_PASSWORD"}'
```

---

## ✅ Expected Results

| Endpoint | Before | After |
|----------|--------|-------|
| GET /health | ✅ 200 | ✅ 200 |
| GET /players | ✅ 200 | ✅ 200 |
| GET /teams | ✅ 200 | ✅ 200 |
| POST /auth/login | ❌ 500 | ✅ 200 |
| GET /auction/state | ⏳ 401 | ✅ 200 |

---

## 🚀 After Fixing Environment Variables

1. ✅ Test all endpoints work
2. ✅ Deploy frontend to Render
3. ✅ Test full integration
4. ✅ Run end-to-end tests

---

**Time to Complete**: ~15 minutes  
**Difficulty**: Easy  
**Priority**: 🔴 CRITICAL - Must do before testing
