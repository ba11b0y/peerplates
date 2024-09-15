from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Set
from bson import ObjectId
from db import client  # Assuming you have a db.py file with your MongoDB client

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_matches: Dict[str, Set[str]] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.user_matches[user_id] = set()

        # Fetch matches for the user
        db = client.get_database("peerplates")
        dishes_collection = db.dishes
        matches = dishes_collection.find({
            "$or": [
                {"seller_id": ObjectId(user_id)},
                {"matched_buyer_id": ObjectId(user_id)}
            ]
        })

        for match in matches:
            if str(match['seller_id']) == user_id:
                self.user_matches[user_id].add(str(match['matched_buyer_id']))
            else:
                self.user_matches[user_id].add(str(match['seller_id']))

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in self.user_matches:
            del self.user_matches[user_id]

    async def send_personal_message(self, sender_id: str, recipient_id: str, message: str):
        if recipient_id in self.active_connections:
            await self.active_connections[recipient_id].send_text(f"{sender_id}: {message}")

    async def broadcast_to_matches(self, sender_id: str, message: str):
        if sender_id in self.user_matches:
            for match_id in self.user_matches[sender_id]:
                if match_id in self.active_connections:
                    await self.active_connections[match_id].send_text(f"{sender_id}: {message}")

manager = ConnectionManager()

async def chat_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast_to_matches(user_id, data)
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        for match_id in manager.user_matches.get(user_id, []):
            if match_id in manager.active_connections:
                await manager.active_connections[match_id].send_text(f"User {user_id} has disconnected.")

# You can add more chat-related functions here if needed