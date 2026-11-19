"""Call tool-help over MCP stdio. Pass the server command and arguments after this file."""

import json
import signal
import subprocess
import sys


def request(server, number, method, params):
    server.stdin.write(json.dumps({
        "jsonrpc": "2.0", "id": number, "method": method, "params": params
    }) + "\n")
    server.stdin.flush()
    for line in server.stdout:
        response = json.loads(line)
        if response.get("id") == number:
            if "error" in response:
                sys.exit("MCP returned an error for " + method)
            return response["result"]
    sys.exit("MCP closed before answering " + method)


def timeout(signum, frame):
    sys.exit("MCP proof timed out")


if __name__ == "__main__":
    signal.signal(signal.SIGALRM, timeout)
    signal.alarm(60)
    with subprocess.Popen(
        sys.argv[1:], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True
    ) as server:
        try:
            request(server, 1, "initialize", {
                "protocolVersion": "2024-11-05", "capabilities": {},
                "clientInfo": {"name": "flowstacks-proof", "version": "1"}
            })
            server.stdin.write('{"jsonrpc":"2.0","method":"notifications/initialized"}\n')
            result = request(server, 2, "tools/call", {
                "name": "tool-help", "arguments": {"query": "brave"}
            })
            matches = [entry["text"] for entry in result["content"] if entry["type"] == "text"]
            if result.get("isError") or not any("brave-search" in item for item in matches):
                sys.exit("Tool directory did not return brave-search")
            print("MCP tool-help returned brave-search")
        finally:
            server.stdin.close()
            server.terminate()
