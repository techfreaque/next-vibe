"""Local, bounded admission wait during a supervised PostgreSQL switchover."""
import asyncio
import os
import sys
from pathlib import Path


class Gate:
    def __init__(self, directory, limit=128, timeout=12):
        self.marker = directory / "switchover.pause"
        self.waiters = 0
        self.limit = limit
        self.timeout = timeout

    async def handle(self, reader, writer):
        status = 503
        try:
            headers = await asyncio.wait_for(reader.readuntil(b"\r\n\r\n"), 1)
            if headers.split(b"\r\n", 1)[0] == b"GET /admit HTTP/1.1" and self.waiters < self.limit:
                self.waiters += 1
                try:
                    deadline = asyncio.get_running_loop().time() + self.timeout
                    while self.marker.exists():
                        if reader.at_eof() or asyncio.get_running_loop().time() >= deadline:
                            break
                        await asyncio.sleep(0.05)
                    else:
                        status = 204
                finally:
                    self.waiters -= 1
            result = b"204 No Content" if status == 204 else b"503 Service Unavailable"
            writer.write(b"HTTP/1.1 " + result + b"\r\nRetry-After: 1\r\nCache-Control: no-store\r\nContent-Length: 0\r\nConnection: close\r\n\r\n")
            await writer.drain()
        except (OSError, asyncio.TimeoutError, asyncio.IncompleteReadError, asyncio.LimitOverrunError):
            pass
        finally:
            writer.close()


async def serve(directory):
    gate = Gate(directory)
    path = directory / "switchover.sock"
    # Refuse to replace another running gate or a stale socket. The operator
    # moves a stale socket aside after checking for a listener.
    if path.exists():
        sys.exit("socket already exists")
    os.umask(0o077)
    server = await asyncio.start_unix_server(gate.handle, path=str(path), limit=8192)
    async with server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(serve(Path(sys.argv[1])))
