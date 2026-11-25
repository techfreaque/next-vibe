/**
 * /ws close diagnostics: the server log must name WHY a socket ended, so the
 * next browser "[WS Client] Connection lost" 1006 row can be matched to a
 * server idle cut (client stopped answering pings) vs a network drop.
 */

import { describe, expect, it } from "bun:test";

import { UserPermissionRole } from "../../identity/roles/enum";
import type { WsConnectionData } from "../core/types";
import {
  diagnoseWsClose,
  WS_HEARTBEAT_TIMEOUT_CODE,
  WS_HEARTBEAT_TIMEOUT_REASON,
  WS_IDLE_TIMEOUT_SECONDS,
  WS_PING_INTERVAL_MS,
} from "./ws-keepalive";

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
    requestId: "ws-test-123",
    lastInboundAt: NOW - silentForMs,
    pongCount,
  };
}

describe("WS keepalive", () => {
  it("pings well inside a 60 s middlebox idle limit", () => {
    expect(WS_PING_INTERVAL_MS).toBeLessThan(30_000);
    expect(WS_IDLE_TIMEOUT_SECONDS * 1000).toBeGreaterThan(3 * WS_PING_INTERVAL_MS);
  });

  it("reports Bun's inactivity close as idle-timeout with measurements", () => {
    const d = diagnoseWsClose(
      {
        ...socketData(125_000, 75_000, 3),
        lastPongAt: NOW - 80_000,
        lastPingAt: NOW - 10_000,
        pingCount: 6,
        lastPingBackpressured: false,
        lastInboundFrame: "subscribe",
      },
      1006,
      "WebSocket timed out from inactivity",
      NOW,
    );
    expect(d.kind).toBe("idle-timeout");
    expect(d.meta).toEqual({
      requestId: "ws-test-123",
      code: 1006,
      reason: "WebSocket timed out from inactivity",
      idleEvidence: "bun-close-reason",
      connectedForMs: 125_000,
      sinceLastInboundMs: 75_000,
      pongCount: 3,
      pingCount: 6,
      lastPingAgeMs: 10_000,
      lastPingBackpressured: false,
      lastPongAgeMs: 80_000,
      idleTimeoutMs: WS_IDLE_TIMEOUT_SECONDS * 1000,
      inboundActivity: "answered-ping",
      lastInboundFrame: "subscribe",
      channelCount: 2,
      isPublic: true,
      connector: false,
    });
  });

  it("treats a reasonless 1006 after a full idle window as idle-timeout", () => {
    const d = diagnoseWsClose(socketData(90_000, 40_500, 0), 1006, "", NOW);
    expect(d.kind).toBe("idle-timeout");
    expect(d.meta.idleEvidence).toBe("silent-window");
    expect(d.meta.inboundActivity).toBe("application-traffic");
  });

  it("identifies an explicit heartbeat close", () => {
    const d = diagnoseWsClose(
      socketData(90_000, 80_000, 2),
      WS_HEARTBEAT_TIMEOUT_CODE,
      WS_HEARTBEAT_TIMEOUT_REASON,
      NOW,
    );
    expect(d.kind).toBe("idle-timeout");
    expect(d.meta.idleEvidence).toBe("heartbeat-timeout");
  });

  it("identifies a socket that never sent application frames or a pong", () => {
    const d = diagnoseWsClose(socketData(40_000, 40_000, 0), 1006, "", NOW);
    expect(d.meta.inboundActivity).toBe("silent");
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
