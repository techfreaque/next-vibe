// oxlint-disable oxlint-plugin-restricted/restricted-syntax
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

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import creditsDefinition from "@/app/api/[locale]/credits/definition";

import { buildUserWsChannel } from "./channel";
import { createEndpointEmitter } from "./emitter";
import {
  clearLocalBroadcast,
  type LocalBroadcastTarget,
  registerLocalBroadcast,
} from "./local-broadcast";

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
});
