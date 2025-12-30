import asyncio
import websockets
from app.websocket.handler import handler

async def main():
    print("Backend aktif di ws://localhost:8765")
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()  # keep alive

if __name__ == "__main__":
    asyncio.run(main())
