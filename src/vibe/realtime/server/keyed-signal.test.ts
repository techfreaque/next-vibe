/**
 * KeyedRemoteSignal `ready` / `lost` on the cross-process path.
 *
 * Regression (2026-11-25): `vibe --hermes --thea <tool>` with Hermes dev down
 * blocked forever. The CLI's result subscription could never reach the local
 * hub, nothing reported it, and the WAIT sat on a day-long inline timeout.
 * `lost` now resolves as soon as the hub is unreachable so waiters fail fast.
 */

import { coreClientEnv } from "next-vibe/core/env-client";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import executeDefinition from "../../execute-tool/definition";
import { serverSystemEnv } from "../../platforms/web/env";
import { WS_SIDECAR_OFFSET } from "../../platforms/web/proxy";
import { getLocalBroadcast } from "../core/local-broadcast";
import { KeyedRemoteSignal, type KeyedSignalLoss } from "./keyed-signal";

const logger = createEndpointLogger(false, defaultLocale);
const publicUser: JwtPayloadType = {
  isPublic: true,
  leadId: "00000000-0000-4000-8000-0000000000d1",
  roles: [UserPermissionRole.PUBLIC],
};

const ref = {
  endpoint: executeDefinition.POST,
  eventName: "tool-execute-result",
  key: "keyed-signal-test",
};

/** A port nothing listens on: bind, read, release. */
function freePort(): number {
  const server = Bun.serve({ port: 0, fetch: () => new Response("x") });
  const port = server.port ?? 0;
  void server.stop(true);
  return port;
}

/** The app-URL port whose derived hub port is `hubPort`. */
function appPortFor(hubPort: number): number {
  return serverSystemEnv.VIBE_DISABLE_PROXY
    ? hubPort - WS_SIDECAR_OFFSET
    : hubPort;
}

function within<T>(promise: Promise<T>, ms: number): Promise<T | "timeout"> {
  return Promise.race([
    promise,
    new Promise<"timeout">((resolve) => {
      setTimeout(() => resolve("timeout"), ms);
    }),
  ]);
}

describe("KeyedRemoteSignal cross-process ready/lost", () => {
  const originalAppUrl = coreClientEnv.NEXT_PUBLIC_APP_URL;
  beforeEach(() => {
    // The cross-process path only runs outside the hub process.
    expect(getLocalBroadcast()).toBeNull();
  });
  afterEach(() => {
    coreClientEnv.NEXT_PUBLIC_APP_URL = originalAppUrl;
  });

  it("reports hub-unreachable fast when nothing listens on the hub port", async () => {
    const hubPort = freePort();
    coreClientEnv.NEXT_PUBLIC_APP_URL = `http://127.0.0.1:${String(appPortFor(hubPort))}`;
    const sub = KeyedRemoteSignal.subscribe({
      ref,
      user: publicUser,
      parse: () => null,
      logger,
    });
    const startedAt = Date.now();
    const loss = await within(sub.lost, 3000);
    sub.cancel();
    expect(loss).not.toBe("timeout");
    const typed = loss as KeyedSignalLoss;
    expect(typed.reason).toBe("hub-unreachable");
    expect(typed.hubUrl).toBe(`ws://127.0.0.1:${String(hubPort)}/ws`);
    expect(Date.now() - startedAt).toBeLessThan(3000);
    expect(await within(sub.ready, 50)).toBe("timeout");
  });

  it("resolves ready (and never lost) when the hub accepts the socket", async () => {
    const frames: string[] = [];
    const hub = Bun.serve({
      port: 0,
      fetch(req, server) {
        return server.upgrade(req)
          ? undefined
          : new Response("no", { status: 400 });
      },
      websocket: {
        message(_ws, msg) {
          frames.push(String(msg));
        },
      },
    });
    try {
      coreClientEnv.NEXT_PUBLIC_APP_URL = `http://127.0.0.1:${String(appPortFor(hub.port ?? 0))}`;
      const sub = KeyedRemoteSignal.subscribe({
        ref,
        user: publicUser,
        parse: () => null,
        logger,
      });
      expect(await within(sub.ready, 3000)).toBeUndefined();
      expect(await within(sub.lost, 100)).toBe("timeout");
      sub.cancel();
      expect(frames.some((f) => f.includes('"subscribe"'))).toBe(true);
    } finally {
      void hub.stop(true);
    }
  });

  it("never reports lost after cancel", async () => {
    coreClientEnv.NEXT_PUBLIC_APP_URL = `http://127.0.0.1:${String(appPortFor(freePort()))}`;
    const sub = KeyedRemoteSignal.subscribe({
      ref,
      user: publicUser,
      parse: () => null,
      logger,
    });
    sub.cancel();
    expect(await within(sub.lost, 300)).toBe("timeout");
  });
});
