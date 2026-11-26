"""Bounded check-host TCP witness for the HA watchdog. Prints one verdict."""
import json
import re
import sys
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen


def request(path, timeout):
    url = "https://check-host.net/" + path
    headers = {"Accept": "application/json", "User-Agent": "unbottled-ha/1.0 (operations: hi@unbottled.ai)"}
    with urlopen(Request(url, headers=headers), timeout=timeout) as response:
        return json.load(response)


def classify(nodes, results):
    if not isinstance(results, dict):
        return "unknown"
    votes = set()
    for name, items in results.items():
        if isinstance(items, list) and any(isinstance(item, dict) and "time" in item for item in items):
            return "up"
        if name in nodes and isinstance(items, list) and len(items) == 1 and isinstance(items[0], dict):
            error = items[0].get("error")
            if isinstance(error, str) and error.lower() in ("connection timed out", "connection refused", "timed out"):
                votes.add(name)
    if votes == set(nodes) == set(results):
        networks = {node[4] for node in nodes.values()
                    if isinstance(node, list) and len(node) > 4 and isinstance(node[4], str)
                    and re.fullmatch(r"AS[1-9][0-9]*", node[4])}
        if len(networks) >= 3:
            return "down"
    return "unknown"


def witness(target, fetch=request, clock=time.monotonic, sleep=time.sleep):
    deadline = clock() + 24
    try:
        job = fetch("check-tcp?" + urlencode({"host": target + ":443", "max_nodes": 4}), 5)
        if not isinstance(job, dict) or job.get("ok") != 1:
            return "unknown"
        token, nodes = job.get("request_id"), job.get("nodes")
        if not isinstance(token, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", token) or not isinstance(nodes, dict):
            return "unknown"
        while (remaining := deadline - clock()) > 0:
            verdict = classify(nodes, fetch("check-result/" + token, min(4, remaining)))
            if verdict != "unknown":
                return verdict
            sleep(max(0, min(2, deadline - clock())))
    except (OSError, ValueError, TypeError):
        pass
    return "unknown"


if __name__ == "__main__":
    print(witness(sys.argv[1]))
