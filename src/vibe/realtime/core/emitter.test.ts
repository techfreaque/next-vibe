// oxlint-disable oxlint-plugin-restricted/no-unknown, oxlint-plugin-restricted/no-throw
/**
 * createEndpointEmitter — unit tests for the v2 delivery model.
 *
 * EMIT-KIND-*     : the ChannelKind decides the delivery channel
 *                   (user → user/{id}/{ws-channel}, resource → the shared
 *                   ws-channel).
 * EMIT-PRESENCE-* : when the proxy is in-process, delivery is skipped for a
 *                   channel with zero local subscribers.
 * EMIT-RESULT-*   : every emit returns { delivered, relayed, dropped }.
 *
 * The proxy's socket registry is stubbed via registerLocalBroadcast so the test
 * asserts the channel + presence decision without a live proxy or DB.
 */

import "server-only";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { defaultLocale } from "../../core/i18n/core/config";
import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import { createEndpointLogger } from "../../logger/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import cortexDeleteDefinition from "@/vibe/agent/cortex/delete/definition";
import creditsDefinition from "@/credits/definition";

import { buildUserWsChannel } from "./channel";
import { createEndpointEmitter } from "./emitter";
import {
  clearLocalBroadcast,
  type LocalBroadcastTarget,
  registerLocalBroadcast,
} from "./local-broadcast";
import type { RemoteEventRelayPayload } from "./relay-hook";
import { clearRemoteRelay, registerRemoteRelay } from "./relay-hook";

const USER_ID = "11111111-1111-1111-1111-111111111111";
const user: JwtPrivatePayloadType = {
  id: USER_ID,
  leadId: USER_ID,
  isPublic: false,
  roles: [],
};

function makeLogger(): ReturnType<typeof createEndpointLogger> {
  return createEndpointLogger(false, defaultLocale);
}

const broadcastToAll = vi.fn();
let channelSize = 1;

function installBroadcast(): void {
  const target: LocalBroadcastTarget = {
    broadcastToAll,
    broadcastBatch: vi.fn(),
    getChannelSize: () => channelSize,
    closeConnectorSocket: vi.fn(),
  };
  registerLocalBroadcast(target);
}

describe("createEndpointEmitter (v2 delivery)", () => {
  beforeEach(() => {
    broadcastToAll.mockClear();
    channelSize = 1;
    installBroadcast();
  });

  afterEach(() => {
    clearLocalBroadcast();
    // Registration is module-global — leaking it would let a relay test decide
    // the `relayed` result of every test that runs after it.
    clearRemoteRelay();
  });

  it("EMIT-KIND-USER: a scope:user endpoint delivers on its user-scoped ws-channel", () => {
    const emit = createEndpointEmitter(
      creditsDefinition.GET,
      makeLogger(),
      user,
      {},
    );
    const result = emit("credits-balance-updated", {
      responseData: {
        total: 10,
        expiring: 0,
        permanent: 10,
        earned: 0,
        free: 0,
        expiresAt: null,
        capacity: 100,
      },
    });

    expect(broadcastToAll).toHaveBeenCalledTimes(1);
    const [channel, event] = broadcastToAll.mock.calls[0] as [string, string];
    // Erased view: credits GET has no url params (UrlVariablesOutput is never),
    // matching the emitter's own erasure.
    const creditsEndpoint: CreateApiEndpointAny = creditsDefinition.GET;
    expect(channel).toBe(
      buildUserWsChannel(creditsEndpoint, USER_ID, {}, undefined, makeLogger()),
    );
    expect(event).toBe("__event__");
    expect(result).toEqual({ delivered: true, relayed: false, dropped: false });
  });

  it("EMIT-KIND-RESOURCE: a binding kindOverride:'resource' delivers on the shared ws-channel", () => {
    const emit = createEndpointEmitter(
      creditsDefinition.GET,
      makeLogger(),
      user,
      {
        kindOverride: "resource",
      },
    );
    const result = emit("credits-balance-updated", {
      responseData: {
        total: 10,
        expiring: 0,
        permanent: 10,
        earned: 0,
        free: 0,
        expiresAt: null,
        capacity: 100,
      },
    });

    expect(broadcastToAll).toHaveBeenCalledTimes(1);
    const [channel] = broadcastToAll.mock.calls[0] as [string];
    // resource kind → the shared ws-channel (path-based), NOT the user-scoped one.
    expect(channel.startsWith("user/")).toBe(false);
    expect(channel.startsWith("ws-")).toBe(true);
    expect(result.delivered).toBe(true);
  });

  it("EMIT-PRESENCE-EMPTY: zero local subscribers → local delivery skipped, dropped", () => {
    channelSize = 0;
    const emit = createEndpointEmitter(
      creditsDefinition.GET,
      makeLogger(),
      user,
      {},
    );
    const result = emit("credits-balance-updated", {
      responseData: {
        total: 1,
        expiring: 0,
        permanent: 1,
        earned: 0,
        free: 0,
        expiresAt: null,
        capacity: 100,
      },
    });

    expect(broadcastToAll).not.toHaveBeenCalled();
    // credits-balance-updated is not a remoteEvent → neither delivered nor relayed.
    expect(result).toEqual({ delivered: false, relayed: false, dropped: true });
  });

  // EMIT-RELAY-*: the emitter reaches the cross-instance bridge through the
  // relay-hook registration, never by importing it. Regression guard for the
  // crash these tests were written after: the emitter used to
  // `void import("…/remote-event-bridge/repository").then(…)` with no `.catch`,
  // so on an install with no database (CLI/MCP) a single `remoteEvent: true`
  // declaration produced an unhandled rejection and took the process down.

  it("EMIT-RELAY-UNREGISTERED: a remoteEvent with no bridge registered drops instead of crashing", () => {
    clearRemoteRelay();
    const emit = createEndpointEmitter(
      cortexDeleteDefinition.DELETE,
      makeLogger(),
      user,
      {},
    );

    // Must not throw, and must not schedule a rejecting promise.
    const result = emit("node-deleted", {
      requestData: { path: "/documents/notes/old.md", recursive: false },
    });

    expect(result.relayed).toBe(false);
  });

  it("EMIT-RELAY-REGISTERED: a remoteEvent is handed to the registered bridge", () => {
    const relay = vi.fn();
    registerRemoteRelay(relay);
    const emit = createEndpointEmitter(
      cortexDeleteDefinition.DELETE,
      makeLogger(),
      user,
      {},
    );

    const result = emit("node-deleted", {
      requestData: { path: "/documents/notes/old.md", recursive: false },
    });

    expect(relay).toHaveBeenCalledTimes(1);
    const [payload] = relay.mock.calls[0] as [RemoteEventRelayPayload];
    expect(payload.userId).toBe(USER_ID);
    expect(payload.syncDomain).toBe("documents");
    expect(payload.envelope.eventName).toBe("node-deleted");
    expect(result.relayed).toBe(true);
  });
});
