import asyncio
import websockets
import json
from datetime import datetime

async def test_websocket():
    uri = "ws://127.0.0.1:8000/ws/auction"
    print(f"🔌 Connecting to {uri}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected successfully!")
            print("📡 Listening for messages (Press Ctrl+C to stop)...\n")
            
            # Listen for messages
            message_count = 0
            async for message in websocket:
                message_count += 1
                timestamp = datetime.now().strftime("%H:%M:%S")
                print(f"[{timestamp}] 📥 Message #{message_count}:")
                
                try:
                    data = json.loads(message)
                    print(f"  Status: {data.get('status', 'N/A')}")
                    print(f"  Current Bid: ₹{data.get('currentBid', 0)}L")
                    
                    if data.get('currentPlayer'):
                        player = data['currentPlayer']
                        print(f"  Player: {player.get('name')} ({player.get('role')})")
                        print(f"  Base Price: ₹{player.get('basePrice', 0)}L")
                        print(f"  Status: {player.get('status')}")
                        if player.get('soldPrice'):
                            print(f"  Sold Price: ₹{player.get('soldPrice')}L")
                    else:
                        print("  Player: None")
                    
                    if data.get('winningTeam'):
                        team = data['winningTeam']
                        print(f"  Winning Team: {team.get('name')}")
                    else:
                        print("  Winning Team: None")
                    
                    print("-" * 50)
                    
                except json.JSONDecodeError:
                    print(f"  Raw message: {message}")
                    print("-" * 50)
                
    except websockets.exceptions.ConnectionClosed as e:
        print(f"\n🔌 Connection closed: {e}")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("IPL Auction WebSocket Test")
    print("=" * 60)
    print()
    
    try:
        asyncio.run(test_websocket())
    except KeyboardInterrupt:
        print("\n\n⏹️  Test stopped by user")
    finally:
        print("\n" + "=" * 60)
        print("Test completed!")
        print("=" * 60)
