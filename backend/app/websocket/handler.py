import asyncio
import json
import websockets
from app.gesture.detector import GestureDetector

detector = GestureDetector()
is_running = False

async def handler(websocket):
    global is_running
    print("Client connected")

    try:
        while True:
            try:
                message = await asyncio.wait_for(websocket.recv(), timeout=0.01)
                try:
                    data = json.loads(message)

                    if data.get("type") == "CONTROL":
                        if data.get("action") == "START":
                            is_running = True
                            print("GAME STARTED")
                        elif data.get("action") == "PAUSE":
                            is_running = False
                            print("GAME PAUSED")
                except json.JSONDecodeError:
                    print(f"Invalid JSON received: {message}")

            except asyncio.TimeoutError:
                pass

            if is_running:
                try:
                    gesture = detector.read()
                    if gesture:
                        await websocket.send(json.dumps(gesture))
                except Exception as e:
                    print(f"Error reading gesture: {e}")

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket handler error: {e}")
