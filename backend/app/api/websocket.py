from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import List
import json
import asyncio
from app.database import SessionLocal, get_db
from app.models.orm import AuctionState as AuctionStateORM, Player as PlayerORM

router = APIRouter()


class ConnectionManager:
    """Manage WebSocket connections and broadcasting"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        """Remove a disconnected WebSocket"""
        self.active_connections.remove(websocket)
        print(f"Client disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting: {e}")
                disconnected.append(connection)
        
        # Remove failed connections
        for conn in disconnected:
            if conn in self.active_connections:
                self.active_connections.remove(conn)

    async def broadcast_auction_update(self):
        """Broadcast current auction state to all clients"""
        db = SessionLocal()
        try:
            state = db.query(AuctionStateORM).first()
            if state:
                current_player = None
                if state.current_player_id:
                    player = db.query(PlayerORM).filter(PlayerORM.id == state.current_player_id).first()
                    if player:
                        current_player = {
                            "id": player.id,
                            "name": player.name,
                            "role": player.role,
                            "basePrice": player.base_price,
                            "sold": player.sold,
                            "teamId": player.team_id,
                            "price": player.price,
                            "nationality": player.nationality,
                            "age": player.age,
                            "battingStyle": player.batting_style,
                            "bowlingStyle": player.bowling_style,
                            "image": player.image,
                            "stats": player.stats
                        }
                
                message = {
                    "type": "auction_state_update",
                    "data": {
                        "currentIndex": state.current_index,
                        "currentPlayer": current_player,
                        "auctionStarted": state.auction_started,
                        "auctionPaused": state.auction_paused,
                        "currentBid": state.current_bid,
                        "currentBidder": state.current_bidder_id,
                        "bidHistory": [],
                        "lastUpdate": int(state.last_update.timestamp() * 1000) if state.last_update else 0
                    }
                }
                
                await self.broadcast(message)
        finally:
            db.close()


# Global connection manager
manager = ConnectionManager()


@router.websocket("/ws/auction")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time auction updates
    
    Maintains persistent connection and broadcasts:
    - Auction state changes (player, bid, status)
    - Real-time updates for all connected clients
    """
    await manager.connect(websocket)
    
    try:
        # Send initial state immediately
        await manager.broadcast_auction_update()
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle ping/pong for keep-alive
            if message.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
            
            # Handle state refresh requests
            elif message.get("type") == "refresh":
                await manager.broadcast_auction_update()
            
            # Handle custom messages
            elif message.get("type") == "message":
                response = {
                    "type": "message_response",
                    "data": message.get("data"),
                    "timestamp": int(asyncio.get_event_loop().time())
                }
                await manager.broadcast(response)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("Client disconnected normally")
    except Exception as e:
        print(f"WebSocket error: {e}")
        if websocket in manager.active_connections:
            manager.disconnect(websocket)


async def broadcast_auction_state():
    """
    Helper function to broadcast auction state
    Call this after any auction state modification
    """
    await manager.broadcast_auction_update()
