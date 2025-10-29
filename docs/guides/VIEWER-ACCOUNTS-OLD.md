# 🔐 Viewer Accounts - Quick Reference

## Test Credentials

All viewer accounts use the password: **`password123`**

| Username | Team | Full Name |
|----------|------|-----------|
| `csk_owner` | CSK | Chennai Super Kings |
| `dc_owner` | DC | Delhi Capitals |
| `gt_owner` | GT | Gujarat Titans |
| `kkr_owner` | KKR | Kolkata Knight Riders |
| `lsg_owner` | LSG | Lucknow Super Giants |
| `mi_owner` | MI | Mumbai Indians |
| `pbks_owner` | PBKS | Punjab Kings |
| `rr_owner` | RR | Rajasthan Royals |
| `rcb_owner` | RCB | Royal Challengers Bangalore |
| `srh_owner` | SRH | Sunrisers Hyderabad |

## Quick Test

```bash
# Login as CSK viewer
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"csk_owner","password":"password123"}'

# Use the token from response
TOKEN="<your-token-here>"

# Get CSK team details (should work)
curl -X GET http://localhost:5000/api/teams/my-team \
  -H "Authorization: Bearer $TOKEN"

# Get players (should only see CSK players)
curl -X GET http://localhost:5000/api/players \
  -H "Authorization: Bearer $TOKEN"
```

## What Each Viewer Can See

### CSK Owner (`csk_owner`)
- ✅ CSK team details
- ✅ CSK players only
- ✅ CSK financial info
- ❌ Cannot see MI, RCB, or any other team

### MI Owner (`mi_owner`)
- ✅ MI team details
- ✅ MI players only
- ✅ MI financial info
- ❌ Cannot see CSK, RCB, or any other team

*...and so on for all 10 teams*

## Access Matrix

| Endpoint | Admin | Presenter | Viewer |
|----------|-------|-----------|--------|
| `GET /api/players` | All players | All players | Own team only |
| `GET /api/teams` | All teams | All teams | Own team only |
| `GET /api/teams/:id` | Any team | Any team | Own team only |
| `GET /api/teams/my-team` | N/A | N/A | Own team ✓ |

## Notes

- All viewer accounts were created with `npm run assign-teams`
- Each viewer is automatically linked to their team via `teamId`
- Password for all: `password123` (change in production!)
- To reassign a viewer to a different team:
  ```sql
  UPDATE users SET teamId = '<new-team-id>' WHERE username = 'csk_owner';
  ```
