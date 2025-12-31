import asyncio
import websockets
from app.websocket.handler import handler

async def main():
    print("=" * 50)
    print("Math Shooter Backend")
    print("=" * 50)
    print("Backend aktif di ws://localhost:8765")
    print("Menunggu koneksi client...")
    print("=" * 50)
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
