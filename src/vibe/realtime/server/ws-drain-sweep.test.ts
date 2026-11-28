import { describe, expect, it } from "bun:test";

import {
  classifyWsClient,
  closeSockets,
  terminateStragglers,
  type SweepSocket,
} from "./ws-drain-sweep";

function makeSocket(
  opts: { ignoresClose: boolean; selfHub?: boolean; userAgent?: string },
  open: Set<SweepSocket>,
): SweepSocket & { closeCalls: number; terminated: boolean } {
  const ws = {
    data: {
      connectedAt: 1000,
      selfHub: opts.selfHub,
      userAgent: opts.userAgent,
    },
    closeCalls: 0,
    terminated: false,
    close(): void {
      ws.closeCalls += 1;
      if (!opts.ignoresClose) {
        open.delete(ws);
      }
    },
    terminate(): void {
      ws.terminated = true;
      open.delete(ws);
    },
  };
  open.add(ws);
  return ws;
}

describe("ws drain sweep", () => {
  it("terminates a client that ignores close frames and reaches zero", () => {
    const open = new Set<SweepSocket>();
    const good = makeSocket({ ignoresClose: false }, open);
    const stuck = makeSocket(
      { ignoresClose: true, userAgent: "Mozilla/5.0 Chrome/120" },
      open,
    );
    const hub = makeSocket({ ignoresClose: true, selfHub: true }, open);

    const swept = closeSockets(open, 1012, "server-draining", true);
    expect(swept).toHaveLength(2);
    expect(good.closeCalls).toBe(1);
    expect(hub.closeCalls).toBe(0);
    expect(open.size).toBe(2);

    const result = terminateStragglers(swept, open, 6000, (ws) => {
      open.delete(ws);
    });
    expect(result.forced).toBe(1);
    expect(result.byClass).toEqual({ browser: 1 });
    expect(result.oldestAgeMs).toBe(5000);
    expect(stuck.terminated).toBe(true);
    expect(good.terminated).toBe(false);
    // Only the kept self-hub socket remains.
    expect([...open]).toEqual([hub]);
  });

  it("forces nothing when every client closed", () => {
    const open = new Set<SweepSocket>();
    makeSocket({ ignoresClose: false }, open);
    const swept = closeSockets(open, 1012, "x", true);
    const result = terminateStragglers(swept, open, 2000, () => {});
    expect(result.forced).toBe(0);
  });

  it("classifies clients", () => {
    expect(classifyWsClient({ connectorInstanceId: "a" })).toBe("connector");
    expect(classifyWsClient({ userAgent: "curl/8" })).toBe("bot");
    expect(classifyWsClient({})).toBe("unknown");
  });
});
