/**
 * /ws close diagnostics: the server log must name WHY a socket ended, so the
 * next browser "[WS Client] Connection lost" 1006 row can be matched to a
 * server idle cut (client stopped answering pings) vs a network drop.
 */

import { describe, expect, it } from "bun:test";

import { UserPermissionRole } from "../../identity/roles/enum";
import type { WsConnectionData } from "../core/types";
import { diagnoseWsClose, WS_IDLE_TIMEOUT_SECONDS } from "./ws-keepalive";

const NOW = 1_000_000_000;

function socketData(
  connectedAgoMs: number,
  silentForMs: number,
  pongCount: number,
): WsConnectionData {
  return {
    user: {
      isPublic: true,
      leadId: "00000000-0000-0000-0000-000000000000",
      roles: [UserPermissionRole.PUBLIC],
    },
    channels: new Set(["a", "b"]),
    connectedAt: NOW - connectedAgoMs,
    lastInboundAt: NOW - silentForMs,
    pongCount,
  };
}

describe("WS keepalive", () => {
  it("pings well inside a 60 s middlebox idle limit", () => {
    // Bun pings 16 s before idleTimeout; the wire must never be silent 60 s.
    expect(WS_IDLE_TIMEOUT_SECONDS - 16).toBeLessThan(30);
    expect(WS_IDLE_TIMEOUT_SECONDS).toBeLessThan(60);
  });

  it("reports Bun's inactivity close as idle-timeout with measurements", () => {
    const d = diagnoseWsClose(
      socketData(125_000, 40_000, 3),
      1006,
      "WebSocket timed out from inactivity",
      NOW,
    );
    expect(d.kind).toBe("idle-timeout");
    expect(d.meta).toEqual({
      code: 1006,
      reason: "WebSocket timed out from inactivity",
      connectedForMs: 125_000,
      sinceLastInboundMs: 40_000,
      pongCount: 3,
      channelCount: 2,
      isPublic: true,
      connector: false,
    });
  });

  it("treats a reasonless 1006 after a full idle window as idle-timeout", () => {
    expect(
      diagnoseWsClose(socketData(90_000, 40_500, 0), 1006, "", NOW).kind,
    ).toBe("idle-timeout");
  });

  it("reports a 1006 cut mid-window as a drop", () => {
    expect(
      diagnoseWsClose(socketData(59_500, 5_000, 2), 1006, "", NOW).kind,
    ).toBe("dropped");
  });

  it("stays quiet for normal, going-away and our own deploy closes", () => {
    for (const code of [1000, 1001, 1005, 1012]) {
      expect(
        diagnoseWsClose(socketData(10_000, 1_000, 0), code, "", NOW).kind,
      ).toBe("normal");
    }
  });
});
