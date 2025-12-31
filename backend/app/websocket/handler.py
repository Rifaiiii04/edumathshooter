import asyncio
import json
import websockets
from app.gesture.detector import GestureDetector

detector = GestureDetector()
is_running = False

async def handler(websocket):
    global is_running
    print("Client connected")
    print("Kamera sedang diakses...")

    try:
        while True:
            try:
                message = await asyncio.wait_for(websocket.recv(), timeout=0.01)
                try:
                    data = json.loads(message)

                    if data.get("type") == "CONTROL":
                        if data.get("action") == "START":
                            is_running = True
                            print("GAME STARTED - Gesture detection aktif")
                        elif data.get("action") == "PAUSE":
                            is_running = False
                            print("GAME PAUSED")
                except json.JSONDecodeError:
                    print(f"Invalid JSON received: {message}")

            except asyncio.TimeoutError:
                pass

            try:
                gesture = detector.read()
                if gesture is None:
                    print("Warning: Kamera gagal membaca frame")
                    continue
                
                if is_running:
                    await websocket.send(json.dumps(gesture))
                elif gesture.get("x") is not None or gesture.get("y") is not None:
                    await websocket.send(json.dumps(gesture))
            except Exception as e:
                print(f"Error reading gesture: {e}")
                import traceback
                traceback.print_exc()

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket handler error: {e}")
        import traceback
        traceback.print_exc()
