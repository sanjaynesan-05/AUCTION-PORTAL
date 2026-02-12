from typing import List, Dict, Any
from fastapi import WebSocket, WebSocketDisconnect
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, type: str, data: Dict[str, Any]):
        message = json.dumps({"type": type, "payload": data}, default=str)
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                # Handle dead connection separately or just log
                pass

manager = ConnectionManager()
