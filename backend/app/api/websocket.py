from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
import json
import asyncio
from app.database import SessionLocal
from app.models.orm import AuctionState as AuctionStateORM, Player as PlayerORM, Team as TeamORM, PlayerStatus, AuctionStatus

router = APIRouter()


class ConnectionManager:
    """
    Manage WebSocket connections for broadcast-only updates
    Clients cannot send messages - WebSocket is one-way (server -> clients)
    """
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"✓ WebSocket client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        """Remove a disconnected WebSocket"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"✗ WebSocket client disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        """
        Broadcast message to all connected clients
        Thread-safe broadcasting with automatic cleanup of dead connections
        """
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting to client: {e}")
                disconnected.append(connection)
        
        # Clean up failed connections
        for conn in disconnected:
            self.disconnect(conn)

    async def broadcast_auction_update(self, db: Session = None):
        """
        Broadcast current auction state to all clients
        Called automatically when admin makes changes
        """
        if db is None:
            db = SessionLocal()
            should_close = True
        else:
            should_close = False
            
        try:
            state = db.query(AuctionStateORM).filter(AuctionStateORM.id == 1).first()
            if not state:
                return
            
            # Build player data
            current_player = None
            if state.current_player_id:
                player = db.query(PlayerORM).filter(PlayerORM.id == state.current_player_id).first()
                if player:
                    current_player = {
                        "id": player.id,
                        "name": player.name,
                        "role": player.role,
                        "basePrice": player.base_price,
                        "status": player.status.value,
                        "soldPrice": player.sold_price,
                        "soldToTeamId": player.sold_to_team_id,
                        "nationality": player.nationality,
                        "age": player.age,
                        "battingStyle": player.batting_style,
                        "bowlingStyle": player.bowling_style,
                        "image": player.image,
                        "stats": player.stats
                    }
            
            # Build winning team data
            winning_team = None
            if state.winning_team_id:
                team = db.query(TeamORM).filter(TeamORM.id == state.winning_team_id).first()
                if team:
                    winning_team = {
                        "id": team.id,
                        "name": team.name,
                        "color": team.color
                    }
            
            # Build message payload
            message = {
                "type": "auction_state_update",
                "data": {
                    "currentPlayer": current_player,
                    "status": state.status.value,
                    "currentBid": state.current_bid,
                    "winningTeam": winning_team,
                    "lastUpdate": int(state.last_update.timestamp() * 1000) if state.last_update else 0
                }
            }
            
            await self.broadcast(message)
            print(f"📡 Broadcasted auction update to {len(self.active_connections)} clients")
            
        finally:
            if should_close:
                db.close()


# Global connection manager
manager = ConnectionManager()


@router.websocket("/ws/auction")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time auction updates
    
    BROADCAST-ONLY: Server pushes updates, clients cannot send messages
    Maintains persistent connection for instant updates across all devices
    """
    await manager.connect(websocket)
    
    try:
        # Send initial state immediately on connection
        await manager.broadcast_auction_update()
        
        # Keep connection alive - ignore all client messages
        # This is broadcast-only, clients cannot send updates
        while True:
            try:
                # Receive and discard any client messages (keep-alive, etc)
                data = await websocket.receive_text()
                # Optionally handle ping/pong for connection health
                try:
                    message = json.loads(data)
                    if message.get("type") == "ping":
                        await websocket.send_json({"type": "pong"})
                except json.JSONDecodeError:
                    pass  # Ignore invalid JSON
            except WebSocketDisconnect:
                break
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        manager.disconnect(websocket)

            
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
