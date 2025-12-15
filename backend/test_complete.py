"""
IPL Auction Backend - Complete Integration Test
Tests all endpoints and verifies WebSocket broadcasts
"""
import asyncio
import websockets
import requests
import json
from datetime import datetime
import time

BASE_URL = "http://127.0.0.1:8000"
WS_URL = "ws://127.0.0.1:8000/ws/auction"

# Colors for terminal output
class Colors:
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}{text}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}❌ {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.YELLOW}ℹ️  {text}{Colors.END}")

# Test Results Tracker
results = {
    "public_endpoints": 0,
    "auth_endpoints": 0,
    "admin_endpoints": 0,
    "websocket": 0,
    "total": 0,
    "passed": 0,
    "failed": 0
}

def test_endpoint(name, method, url, **kwargs):
    """Test an API endpoint"""
    try:
        if method == "GET":
            response = requests.get(url, **kwargs)
        elif method == "POST":
            response = requests.post(url, **kwargs)
        
        results["total"] += 1
        if response.status_code in [200, 201]:
            results["passed"] += 1
            print_success(f"{name}: {response.status_code} OK")
            return response.json() if response.content else None
        else:
            results["failed"] += 1
            print_error(f"{name}: {response.status_code} - {response.text[:100]}")
            return None
    except Exception as e:
        results["failed"] += 1
        results["total"] += 1
        print_error(f"{name}: {str(e)}")
        return None

def test_public_endpoints():
    """Test public endpoints (no authentication)"""
    print_header("1. Testing Public Endpoints")
    
    # Test GET /auction/state
    print_info("GET /auction/state")
    state = test_endpoint("Auction State", "GET", f"{BASE_URL}/auction/state")
    if state:
        print(f"   Status: {state.get('status')}, Bid: ₹{state.get('currentBid')}L")
        results["public_endpoints"] += 1
    
    # Test GET /auction/players
    print_info("GET /auction/players")
    players = test_endpoint("Players List", "GET", f"{BASE_URL}/auction/players")
    if players:
        print(f"   Players: {len(players)}")
        results["public_endpoints"] += 1
    
    # Test GET /auction/teams
    print_info("GET /auction/teams")
    teams = test_endpoint("Teams List", "GET", f"{BASE_URL}/auction/teams")
    if teams:
        print(f"   Teams: {len(teams)}")
        results["public_endpoints"] += 1
    
    # Test GET /auction/players/pending
    print_info("GET /auction/players/pending")
    pending = test_endpoint("Pending Players", "GET", f"{BASE_URL}/auction/players/pending")
    if pending:
        print(f"   Pending: {len(pending)}")
        results["public_endpoints"] += 1
    
    return teams, pending

def test_authentication():
    """Test authentication endpoints"""
    print_header("2. Testing Authentication")
    
    # Test POST /auth/login
    print_info("POST /auth/login")
    login_data = {"username": "admin", "password": "auction123"}
    response = test_endpoint("Login", "POST", f"{BASE_URL}/auth/login", json=login_data)
    
    if response:
        token = response.get("access_token")
        user = response.get("user")
        print(f"   User: {user.get('username')}, Role: {user.get('role')}")
        print(f"   Token: {token[:30]}...")
        results["auth_endpoints"] += 1
        
        # Test GET /auth/me
        print_info("GET /auth/me")
        headers = {"Authorization": f"Bearer {token}"}
        me = test_endpoint("Get Current User", "GET", f"{BASE_URL}/auth/me", headers=headers)
        if me:
            print(f"   Verified: {me.get('username')}")
            results["auth_endpoints"] += 1
        
        return token
    return None

def test_admin_endpoints(token, player_id, team_id):
    """Test admin endpoints"""
    print_header("3. Testing Admin Endpoints")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Select player
    print_info(f"POST /admin/auction/select-player (ID: {player_id})")
    data = test_endpoint("Select Player", "POST", 
                        f"{BASE_URL}/admin/auction/select-player",
                        headers=headers, json={"player_id": player_id})
    if data:
        print(f"   Selected: {data.get('player', {}).get('name')}")
        results["admin_endpoints"] += 1
    
    time.sleep(0.5)
    
    # Start auction
    print_info("POST /admin/auction/start")
    data = test_endpoint("Start Auction", "POST",
                        f"{BASE_URL}/admin/auction/start",
                        headers=headers, json={})
    if data:
        print(f"   Status: {data.get('status')}, Bid: ₹{data.get('current_bid')}L")
        results["admin_endpoints"] += 1
    
    time.sleep(0.5)
    
    # Increment bid
    print_info("POST /admin/auction/increment")
    data = test_endpoint("Increment Bid", "POST",
                        f"{BASE_URL}/admin/auction/increment",
                        headers=headers, json={"amount": 20})
    if data:
        print(f"   New Bid: ₹{data.get('current_bid')}L")
        results["admin_endpoints"] += 1
    
    time.sleep(0.5)
    
    # End auction
    print_info(f"POST /admin/auction/end (Team ID: {team_id})")
    data = test_endpoint("End Auction", "POST",
                        f"{BASE_URL}/admin/auction/end",
                        headers=headers, json={"team_id": team_id})
    if data:
        player = data.get('player', {})
        print(f"   Sold: {player.get('name')} to {player.get('team')} for ₹{player.get('sold_price')}L")
        results["admin_endpoints"] += 1
    
    time.sleep(0.5)
    
    # Next player
    print_info("POST /admin/auction/next")
    data = test_endpoint("Next Player", "POST",
                        f"{BASE_URL}/admin/auction/next",
                        headers=headers, json={})
    if data:
        next_player = data.get('next_available', {})
        print(f"   Next: {next_player.get('name')}")
        results["admin_endpoints"] += 1

async def test_websocket():
    """Test WebSocket connection and broadcasts"""
    print_header("4. Testing WebSocket")
    
    print_info("Connecting to WebSocket...")
    try:
        async with websockets.connect(WS_URL) as websocket:
            print_success("Connected to WebSocket")
            results["websocket"] += 1
            results["total"] += 1
            results["passed"] += 1
            
            print_info("Waiting for initial state broadcast...")
            try:
                message = await asyncio.wait_for(websocket.recv(), timeout=3)
                data = json.loads(message)
                print_success("Received initial state")
                print(f"   Status: {data.get('status')}, Bid: ₹{data.get('currentBid')}L")
                
                player = data.get('currentPlayer')
                if player:
                    print(f"   Player: {player.get('name')}")
                
            except asyncio.TimeoutError:
                print_error("Timeout waiting for message")
                results["failed"] += 1
                results["total"] += 1
    
    except Exception as e:
        print_error(f"WebSocket connection failed: {str(e)}")
        results["failed"] += 1
        results["total"] += 1

def print_summary():
    """Print test summary"""
    print_header("Test Summary")
    
    print(f"Public Endpoints:    {Colors.GREEN}{results['public_endpoints']}/4{Colors.END}")
    print(f"Auth Endpoints:      {Colors.GREEN}{results['auth_endpoints']}/2{Colors.END}")
    print(f"Admin Endpoints:     {Colors.GREEN}{results['admin_endpoints']}/5{Colors.END}")
    print(f"WebSocket Tests:     {Colors.GREEN}{results['websocket']}/1{Colors.END}")
    print(f"\n{Colors.BOLD}Total Tests:{Colors.END}")
    print(f"  Passed:  {Colors.GREEN}{results['passed']}{Colors.END}")
    print(f"  Failed:  {Colors.RED}{results['failed']}{Colors.END}")
    print(f"  Total:   {results['total']}")
    
    success_rate = (results['passed'] / results['total'] * 100) if results['total'] > 0 else 0
    print(f"\n{Colors.BOLD}Success Rate: {Colors.GREEN}{success_rate:.1f}%{Colors.END}")
    
    if results['failed'] == 0:
        print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 ALL TESTS PASSED! 🎉{Colors.END}")
    else:
        print(f"\n{Colors.YELLOW}⚠️  Some tests failed. Check output above.{Colors.END}")

async def main():
    """Run all tests"""
    print_header("IPL Auction Backend - Integration Tests")
    print(f"Backend URL: {BASE_URL}")
    print(f"WebSocket URL: {WS_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test public endpoints
    teams, pending_players = test_public_endpoints()
    
    # Test authentication
    token = test_authentication()
    if not token:
        print_error("Authentication failed. Cannot test admin endpoints.")
        print_summary()
        return
    
    # Get teams for admin tests
    teams = requests.get(f"{BASE_URL}/auction/teams").json()
    pending = requests.get(f"{BASE_URL}/auction/players/pending").json()
    
    if pending and teams:
        # Test admin endpoints
        test_admin_endpoints(token, pending[0]['id'], teams[0]['id'])
    
    # Test WebSocket
    await test_websocket()
    
    # Print summary
    print_summary()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}⏹️  Tests interrupted by user{Colors.END}")
    except Exception as e:
        print(f"\n\n{Colors.RED}❌ Error: {str(e)}{Colors.END}")
