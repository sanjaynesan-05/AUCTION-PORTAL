# Multi-Device WebSocket Test Guide

## Server Configuration

**Backend is now accessible from any device on your network!**

- **Local Access:** http://127.0.0.1:8000
- **Network Access:** http://192.168.0.103:8000
- **WebSocket URL:** ws://192.168.0.103:8000/ws/auction

## Server Settings

✅ **CORS:** Enabled for all origins (`allow_origins=["*"]`)
✅ **Host Binding:** 0.0.0.0 (all network interfaces)
✅ **Port:** 8000
✅ **WebSocket:** Enabled for multi-device connections

---

## Testing from Different Devices

### 1. Test from This Computer (Local)

```powershell
# Test API endpoint
Invoke-WebRequest -Uri http://192.168.0.103:8000/auction/state -UseBasicParsing

# Test WebSocket
cd "D:\AUCTION PORTAL\backend"
.\venv\Scripts\python.exe test_websocket_network.py
```

### 2. Test from Mobile Phone

**A. Using Browser:**
1. Connect phone to same Wi-Fi network (must be on same network)
2. Open browser and visit: `http://192.168.0.103:8000/docs`
3. Try the API endpoints from Swagger UI

**B. Using WebSocket Test Apps:**
- Install "WebSocket Test" or "Simple WebSocket Client" app
- Connect to: `ws://192.168.0.103:8000/ws/auction`
- You should receive auction state updates

### 3. Test from Another Computer/Laptop

**A. Using Browser:**
```
Open: http://192.168.0.103:8000/docs
```

**B. Using PowerShell:**
```powershell
# Test API
Invoke-WebRequest -Uri http://192.168.0.103:8000/auction/state -UseBasicParsing

# Test login
$body = @{username='admin'; password='auction123'} | ConvertTo-Json
Invoke-WebRequest -Uri http://192.168.0.103:8000/auth/login -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
```

**C. Using Python:**
```python
import websockets
import asyncio

async def test():
    async with websockets.connect("ws://192.168.0.103:8000/ws/auction") as ws:
        message = await ws.recv()
        print(f"Received: {message}")

asyncio.run(test())
```

### 4. Test from Outside Your Network (Internet)

**Requirements:**
- Router port forwarding (forward port 8000 to 192.168.0.103)
- Public IP address or Dynamic DNS
- Firewall configuration

**Setup Steps:**
1. Get your public IP: Visit https://whatismyipaddress.com/
2. Configure router port forwarding:
   - External Port: 8000
   - Internal IP: 192.168.0.103
   - Internal Port: 8000
3. Update firewall rules to allow port 8000
4. Access from internet: `http://YOUR_PUBLIC_IP:8000`

---

## Firewall Configuration

### Windows Firewall Rule (if needed)

```powershell
# Add inbound rule for port 8000
New-NetFirewallRule -DisplayName "IPL Auction Backend" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow

# Check if rule exists
Get-NetFirewallRule -DisplayName "IPL Auction Backend"
```

---

## HTML Test Pages for Different Devices

### Mobile-Friendly WebSocket Test Page

Save this as `test_mobile.html` and open on any device:

```html
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auction WebSocket Test</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f5f5f5; }
        .status { padding: 15px; margin: 10px 0; border-radius: 8px; font-weight: bold; }
        .connected { background: #d4edda; color: #155724; }
        .disconnected { background: #f8d7da; color: #721c24; }
        button { padding: 12px 24px; margin: 5px; font-size: 16px; border-radius: 5px; border: none; }
        .connect-btn { background: #007bff; color: white; }
        .disconnect-btn { background: #dc3545; color: white; }
        .log { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; max-height: 400px; overflow-y: auto; }
        .message { padding: 8px; margin: 5px 0; background: #e7f3ff; border-left: 3px solid #007bff; }
    </style>
</head>
<body>
    <h2>🔌 Auction WebSocket Test</h2>
    <div id="status" class="status disconnected">⚠️ Disconnected</div>
    
    <button class="connect-btn" onclick="connect()">Connect</button>
    <button class="disconnect-btn" onclick="disconnect()">Disconnect</button>
    
    <h3>Messages:</h3>
    <div id="log" class="log">Waiting...</div>
    
    <script>
        let ws = null;
        const WS_URL = 'ws://192.168.0.103:8000/ws/auction';
        
        function connect() {
            ws = new WebSocket(WS_URL);
            
            ws.onopen = () => {
                document.getElementById('status').className = 'status connected';
                document.getElementById('status').textContent = '✅ Connected';
                addLog('Connected to ' + WS_URL);
            };
            
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                addLog(`Status: ${data.status}, Bid: ₹${data.currentBid}L`);
            };
            
            ws.onerror = () => addLog('❌ Connection error');
            ws.onclose = () => {
                document.getElementById('status').className = 'status disconnected';
                document.getElementById('status').textContent = '⚠️ Disconnected';
                addLog('Connection closed');
            };
        }
        
        function disconnect() {
            if (ws) ws.close();
        }
        
        function addLog(msg) {
            const log = document.getElementById('log');
            const time = new Date().toLocaleTimeString();
            log.innerHTML += `<div class="message">[${time}] ${msg}</div>`;
            log.scrollTop = log.scrollHeight;
        }
        
        // Auto-connect
        window.onload = connect;
    </script>
</body>
</html>
```

---

## Network Troubleshooting

### Issue 1: Cannot Connect from Other Device

**Possible Causes:**
- ❌ Devices not on same Wi-Fi network
- ❌ Windows Firewall blocking port 8000
- ❌ Router firewall blocking connections
- ❌ Server not bound to 0.0.0.0

**Solutions:**
```powershell
# Check if server is listening on 0.0.0.0
netstat -an | findstr "8000"
# Should show: 0.0.0.0:8000

# Check firewall rule
Get-NetFirewallRule -DisplayName "IPL Auction Backend"

# Add firewall rule if missing
New-NetFirewallRule -DisplayName "IPL Auction Backend" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

### Issue 2: WebSocket Connection Refused

**Possible Causes:**
- ❌ Using `ws://127.0.0.1:8000` instead of network IP
- ❌ CORS not allowing origin
- ❌ Proxy/VPN interfering

**Solutions:**
- ✅ Use network IP: `ws://192.168.0.103:8000/ws/auction`
- ✅ CORS is set to `allow_origins=["*"]` in main.py
- ✅ Disable VPN/proxy temporarily

### Issue 3: Connection Works but No Messages

**Check:**
- Backend server is running: `http://192.168.0.103:8000/docs`
- WebSocket endpoint exists: `/ws/auction`
- Client is listening for messages (not just connecting)

---

## Security Notes

⚠️ **Important for Production:**

The current configuration (`allow_origins=["*"]` and `host=0.0.0.0`) is for **development/testing only**.

For production deployment:
1. **Restrict CORS** to specific domains
2. **Use HTTPS/WSS** (secure connections)
3. **Add rate limiting** to prevent abuse
4. **Use authentication** for WebSocket connections
5. **Set up proper firewall rules**

---

## Expected Behavior

### When WebSocket Connects:
1. Client establishes connection to `ws://192.168.0.103:8000/ws/auction`
2. Server immediately sends current auction state
3. Client receives JSON message with auction data

### When Admin Makes Changes:
1. Admin calls API endpoint (e.g., increment bid)
2. Server updates state in database
3. Server broadcasts new state to ALL connected WebSocket clients
4. ALL devices receive update simultaneously (real-time sync)

### Example Flow:
```
Device A (Admin) → POST /admin/auction/increment
Server → Updates database
Server → Broadcasts to WebSocket
Device B (Viewer) → Receives update instantly
Device C (Presenter) → Receives update instantly
Device D (Mobile) → Receives update instantly
```

---

## Quick Test Commands

### Test from Local Machine
```powershell
# API Test
Invoke-WebRequest -Uri http://192.168.0.103:8000/auction/state -UseBasicParsing

# WebSocket Test
cd "D:\AUCTION PORTAL\backend"
.\venv\Scripts\python.exe test_websocket_network.py
```

### Test from Remote Machine (PowerShell)
```powershell
# Replace with actual server IP
$serverIP = "192.168.0.103"

# Test API
Invoke-WebRequest -Uri "http://${serverIP}:8000/auction/state" -UseBasicParsing

# Test login
$body = @{username='admin'; password='auction123'} | ConvertTo-Json
Invoke-WebRequest -Uri "http://${serverIP}:8000/auth/login" -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
```

---

## Current Configuration Summary

✅ **Backend Server:** Running on 0.0.0.0:8000
✅ **Local Access:** http://127.0.0.1:8000
✅ **Network Access:** http://192.168.0.103:8000
✅ **WebSocket:** ws://192.168.0.103:8000/ws/auction
✅ **CORS:** All origins allowed
✅ **API Docs:** http://192.168.0.103:8000/docs
✅ **Multiple Connections:** Supported ✨

**Status:** Ready for multi-device testing! 🚀
