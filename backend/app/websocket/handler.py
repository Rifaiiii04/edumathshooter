import asyncio
import json
import websockets
from gesture.detector import GestureDetector

detector = GestureDetector()

async def handler(websocket):
    print("🧠 Client connected")

    try:
        while True:
            data = detector.read()
            if data:
                await websocket.send(json.dumps(data))
            await asyncio.sleep(1 / 60)  # 60 FPS
    except websockets.ConnectionClosed:
        print("🔌 Client disconnected")

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8765):
        print("🚀 WebSocket running on ws://localhost:8765")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
