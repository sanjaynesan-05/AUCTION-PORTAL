"""
WebSocket Test - Network Access Version
Tests WebSocket connection using network IP for multi-device testing
"""
import asyncio
import websockets
import json
from datetime import datetime

# Use network IP for multi-device access
SERVER_IP = "192.168.0.103"  # Your network IP
WS_URL = f"ws://{SERVER_IP}:8000/ws/auction"

# Colors for terminal
class Colors:
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

async def test_websocket():
    print(f"{Colors.CYAN}{Colors.BOLD}{'='*70}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}IPL Auction - Network WebSocket Test{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'='*70}{Colors.END}\n")
    
    print(f"{Colors.BLUE}🌐 Server IP: {SERVER_IP}{Colors.END}")
    print(f"{Colors.BLUE}🔌 WebSocket URL: {WS_URL}{Colors.END}\n")
    
    print(f"{Colors.YELLOW}ℹ️  This test uses network IP - accessible from other devices{Colors.END}")
    print(f"{Colors.YELLOW}ℹ️  Other devices on the same network can connect to this URL{Colors.END}\n")
    
    print(f"{Colors.CYAN}Connecting to WebSocket...{Colors.END}")
    
    try:
        async with websockets.connect(WS_URL) as websocket:
            print(f"{Colors.GREEN}✅ Connected successfully!{Colors.END}")
            print(f"{Colors.GREEN}📡 Listening for auction updates (Press Ctrl+C to stop)...{Colors.END}\n")
            print(f"{Colors.CYAN}{'-'*70}{Colors.END}\n")
            
            message_count = 0
            
            async for message in websocket:
                message_count += 1
                timestamp = datetime.now().strftime("%H:%M:%S")
                
                print(f"{Colors.BOLD}[{timestamp}] 📥 Message #{message_count}:{Colors.END}")
                
                try:
                    data = json.loads(message)
                    
                    # Display auction state
                    status = data.get('status', 'IDLE')
                    status_color = Colors.GREEN if status == 'LIVE' else Colors.YELLOW if status == 'SOLD' else Colors.BLUE
                    print(f"  {status_color}Status:{Colors.END} {status}")
                    print(f"  💰 Current Bid: ₹{data.get('currentBid', 0)}L")
                    
                    # Display player info
                    player = data.get('currentPlayer')
                    if player:
                        print(f"\n  {Colors.BOLD}👤 Player:{Colors.END}")
                        print(f"     Name: {player.get('name')}")
                        print(f"     Role: {player.get('role')}")
                        print(f"     Base Price: ₹{player.get('basePrice', 0)}L")
                        print(f"     Status: {player.get('status')}")
                        
                        if player.get('soldPrice'):
                            print(f"     {Colors.GREEN}Sold Price: ₹{player.get('soldPrice')}L{Colors.END}")
                    else:
                        print(f"  👤 Player: None")
                    
                    # Display team info
                    team = data.get('winningTeam')
                    if team:
                        print(f"\n  {Colors.BOLD}🏆 Winning Team:{Colors.END}")
                        print(f"     {team.get('name')}")
                    else:
                        print(f"  🏆 Winning Team: None")
                    
                    print(f"\n{Colors.CYAN}{'-'*70}{Colors.END}\n")
                    
                except json.JSONDecodeError:
                    print(f"  {Colors.RED}Failed to parse message{Colors.END}")
                    print(f"  Raw: {message}")
                    print(f"\n{Colors.CYAN}{'-'*70}{Colors.END}\n")
    
    except websockets.exceptions.WebSocketException as e:
        print(f"\n{Colors.RED}❌ WebSocket Error: {e}{Colors.END}")
        print(f"\n{Colors.YELLOW}Troubleshooting:{Colors.END}")
        print(f"  1. Check if backend server is running on {SERVER_IP}:8000")
        print(f"  2. Verify you're on the same network")
        print(f"  3. Check Windows Firewall allows port 8000")
        print(f"  4. Try: netstat -an | findstr 8000")
    
    except ConnectionRefusedError:
        print(f"\n{Colors.RED}❌ Connection Refused{Colors.END}")
        print(f"\n{Colors.YELLOW}Possible issues:{Colors.END}")
        print(f"  1. Backend server not running")
        print(f"  2. Server not bound to 0.0.0.0 (check uvicorn --host 0.0.0.0)")
        print(f"  3. Firewall blocking connections")
    
    except Exception as e:
        print(f"\n{Colors.RED}❌ Error: {e}{Colors.END}")

if __name__ == "__main__":
    try:
        asyncio.run(test_websocket())
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}⏹️  Test stopped by user{Colors.END}")
        print(f"\n{Colors.GREEN}✅ WebSocket test completed{Colors.END}")
    finally:
        print(f"\n{Colors.CYAN}{'='*70}{Colors.END}")
        print(f"{Colors.CYAN}Test finished - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{Colors.END}")
        print(f"{Colors.CYAN}{'='*70}{Colors.END}")
