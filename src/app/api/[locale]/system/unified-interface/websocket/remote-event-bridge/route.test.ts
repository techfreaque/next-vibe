// oxlint-disable oxlint-plugin-restricted/restricted-syntax
/**
 * Remote Event Bridge Tests
 *
 * REB-LOCAL-*  : Local — calls endpoint on Atlas itself, no Hermes needed
 * REB-DIRECT-* : HTTP direct — routes POST to hermes via direct-http transport (connectToHermes)
 * REB-WS-*     : Reverse-WS  — routes POST to hermes via reverse-WS transport (connectToHermesLocalAi)
 *
 * "HTTP direct" and "reverse-WS" are transport modes for Atlas→Hermes routing.
 * Both use runInProcessTyped({ instanceId: HERMES_INSTANCE_ID }) — same bridge endpoint,
 * different wire transport underneath.
 */

import "server-only";

import { installFetchCache } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
installFetchCache();

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { setFetchCacheContext } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
import {
  connectToHermes,
  connectToHermesLocalAi,
  disconnectFromHermes,
  disconnectFromHermesLocalAi,
  HERMES_INSTANCE_ID,
  resolveRemoteUrlSync,
} from "@/app/api/[locale]/agent/ai-stream/testing/remote-setup";
import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import type { RemoteEventBridgeResponseOutput } from "./definition";
import endpoints from "./definition";
import { RemoteEventBridgeRepository } from "./repository";

// ── Remote URL guard ──────────────────────────────────────────────────────────

const _resolvedRemoteUrl = resolveRemoteUrlSync();

// ── Helpers ───────────────────────────────────────────────────────────────────

async function routeBridgeToHermes(
  testUser: JwtPrivatePayloadType,
  eventName: string,
  payload: WidgetData,
): Promise<ResponseType<RemoteEventBridgeResponseOutput>> {
  const { RouteExecuteRepository } = await import(
    "@/app/api/[locale]/system/unified-interface/execute-tool/repository"
  );
  const { CallbackMode } = await import(
    "@/app/api/[locale]/system/unified-interface/execute-tool/constants"
  );
  const { createEndpointLogger } = await import(
    "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger"
  );
  const { makeHeadlessContext } = await import("@/app/api/[locale]/agent/chat/config");
  const { defaultLocale } = await import("@/i18n/core/config");

  return RouteExecuteRepository.runInProcessTyped({
    definition: endpoints.POST,
    instanceId: HERMES_INSTANCE_ID,
    callbackMode: CallbackMode.WAIT,
    user: testUser,
    locale: defaultLocale,
    logger: createEndpointLogger(false, Date.now(), defaultLocale),
    streamContext: makeHeadlessContext(),
    input: {
      eventName,
      leadId: testUser.leadId,
      originInstanceId: "atlas",
      payload,
    },
  });
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe("Remote Event Bridge", () => {
  let testUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    testUser = await resolveTestAdminUser();
  });

  // ════════════════════════════════════════════════════════════════════════════
  // LOCAL UNIT TESTS — no Hermes required
  // Calls Atlas's own bridge endpoint + repository methods directly.
  // ════════════════════════════════════════════════════════════════════════════

  describe("Local", () => {
    // ── REB-LOCAL-ENDPOINT-EVENT ──────────────────────────────────────────────

    it("REB-LOCAL-ENDPOINT-EVENT: local endpoint-event returns received: true", async () => {
      setFetchCacheContext("reb-local-endpoint-event");

      const result = await sendTestRequest({
        endpoint: endpoints.POST,
        data: {
          eventName: "endpoint-event",
          leadId: testUser.leadId,
          originInstanceId: "hermes",
          payload: {
            leadId: testUser.leadId,
            originInstanceId: "hermes",
            pathChannel: "path/channel",
            endpointPath: ["remote-connection", "remote-event-bridge"],
            endpointMethod: "POST",
            urlPathParams: {},
            eventName: "update",
            payload: {},
          },
        },
        user: testUser,
      });

      expect(
        result.success,
        `REB-LOCAL-ENDPOINT-EVENT failed: ${JSON.stringify(result)}`,
      ).toBe(true);
      if (!result.success) {
        throw new Error(result.message);
      }
      expect(result.data.received).toBe(true);
    });

    // ── REB-LOCAL-SYNC-EVENT ──────────────────────────────────────────────────

    it("REB-LOCAL-SYNC-EVENT: local sync-event returns received: true", async () => {
      setFetchCacheContext("reb-local-sync-event");

      const result = await sendTestRequest({
        endpoint: endpoints.POST,
        data: {
          eventName: "sync-event",
          leadId: testUser.leadId,
          originInstanceId: "hermes",
          payload: {
            leadId: testUser.leadId,
            syncPayloads: {},
          },
        },
        user: testUser,
      });

      expect(
        result.success,
        `REB-LOCAL-SYNC-EVENT failed: ${JSON.stringify(result)}`,
      ).toBe(true);
      if (!result.success) {
        throw new Error(result.message);
      }
      expect(result.data.received).toBe(true);
    });

    // ── REB-LOCAL-LIVE-MESSAGE-EVENT ──────────────────────────────────────────

    it("REB-LOCAL-LIVE-MESSAGE-EVENT: local live-message-event returns received: true", async () => {
      setFetchCacheContext("reb-local-live-message-event");

      const result = await sendTestRequest({
        endpoint: endpoints.POST,
        data: {
          eventName: "live-message-event",
          leadId: testUser.leadId,
          originInstanceId: "hermes",
          payload: {
            leadId: testUser.leadId,
            threadId: "nonexistent-thread-id",
            originInstanceId: "hermes",
            eventName: "chunk",
            data: { text: "hello" },
          },
        },
        user: testUser,
      });

      expect(
        result.success,
        `REB-LOCAL-LIVE-MESSAGE-EVENT failed: ${JSON.stringify(result)}`,
      ).toBe(true);
      if (!result.success) {
        throw new Error(result.message);
      }
      expect(result.data.received).toBe(true);
    });

    // ── REB-LOCAL-UNKNOWN ─────────────────────────────────────────────────────
    // Unknown eventName must still return received: true (graceful ignore).

    it("REB-LOCAL-UNKNOWN: unknown eventName is ignored gracefully, received: true", async () => {
      setFetchCacheContext("reb-local-unknown");

      const result = await sendTestRequest({
        endpoint: endpoints.POST,
        data: {
          eventName: "totally-unknown-event",
          leadId: testUser.leadId,
          originInstanceId: "hermes",
          payload: {},
        },
        user: testUser,
      });

      expect(
        result.success,
        `REB-LOCAL-UNKNOWN failed: ${JSON.stringify(result)}`,
      ).toBe(true);
      if (!result.success) {
        throw new Error(result.message);
      }
      expect(result.data.received).toBe(true);
    });

    // ── REB-LOCAL-ECHO-DROP ───────────────────────────────────────────────────
    // Echo prevention: self-originating events silently dropped, still returns success.

    it("REB-LOCAL-ECHO-DROP: self-origin endpoint-event is silently dropped, received: true", async () => {
      setFetchCacheContext("reb-local-echo-drop");

      const { RemoteConnectionRepository } = await import(
        "@/app/api/[locale]/remote-connection/repository"
      );
      const selfInstanceId = RemoteConnectionRepository.deriveDefaultSelfInstanceId();

      const result = await sendTestRequest({
        endpoint: endpoints.POST,
        data: {
          eventName: "endpoint-event",
          leadId: testUser.leadId,
          originInstanceId: selfInstanceId,
          payload: {
            leadId: testUser.leadId,
            originInstanceId: selfInstanceId,
            pathChannel: "path/channel",
            endpointPath: ["test"],
            endpointMethod: "GET",
            urlPathParams: {},
            eventName: "update",
            payload: {},
          },
        },
        user: testUser,
      });

      expect(
        result.success,
        `REB-LOCAL-ECHO-DROP failed: ${JSON.stringify(result)}`,
      ).toBe(true);
      if (!result.success) {
        throw new Error(result.message);
      }
      expect(result.data.received).toBe(true);
    });

    // ── REB-LOCAL-INVALID-PAYLOAD ─────────────────────────────────────────────

    it("REB-LOCAL-INVALID-PAYLOAD: handleEndpointEvent with invalid payload does not throw", async () => {
      const { createEndpointLogger } = await import(
        "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger"
      );
      const logger = createEndpointLogger(false, Date.now(), "en-US");

      await expect(
        RemoteEventBridgeRepository.handleEndpointEvent(
          { not: "valid" },
          testUser.id,
          logger,
        ),
      ).resolves.toBeUndefined();
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // HTTP DIRECT TO HERMES — requires live Hermes dev instance
  // transportMode = 'direct-http': Atlas POSTs directly to hermes's HTTP endpoint.
  // Uses connectToHermes() which sets transportMode='direct-http'.
  // ════════════════════════════════════════════════════════════════════════════

  if (_resolvedRemoteUrl) {
    describe(`HTTP direct → hermes @ ${_resolvedRemoteUrl}`, () => {
      let _remoteConnectError: string | null = null;

      beforeAll(async () => {
        try {
          await disconnectFromHermes(testUser.id);
          await connectToHermes(testUser, _resolvedRemoteUrl);
        } catch (err) {
          _remoteConnectError = String(err);
        }
      }, 120_000);

      afterAll(async () => {
        await disconnectFromHermes(testUser.id);
      }, 60_000);

      it("prerequisites: hermes connected via direct-http", () => {
        if (_remoteConnectError) {
          throw new Error(
            `Direct-HTTP connection failed — run: vibe --hermes dev\n${_remoteConnectError}`,
          );
        }
      });

      function requireDirectHttp(): void {
        if (_remoteConnectError) {
          throw new Error(`Skipped — fix prerequisites test first: ${_remoteConnectError}`);
        }
      }

      // ── REB-DIRECT-SYNC-EVENT ─────────────────────────────────────────────

      it("REB-DIRECT-SYNC-EVENT: sync-event routed to hermes via direct-http returns received: true", async () => {
        requireDirectHttp();
        setFetchCacheContext("reb-direct-sync-event");

        const result = await routeBridgeToHermes(testUser, "sync-event", {
          leadId: testUser.leadId,
          syncPayloads: {},
        });

        expect(
          result.success,
          `REB-DIRECT-SYNC-EVENT failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          throw new Error(result.message);
        }
        const data = result.data as Record<string, unknown>;
        expect(data.received, "hermes bridge must return received: true").toBe(true);
      }, 60_000);

      // ── REB-DIRECT-ENDPOINT-EVENT ─────────────────────────────────────────

      it("REB-DIRECT-ENDPOINT-EVENT: endpoint-event routed to hermes via direct-http returns received: true", async () => {
        requireDirectHttp();
        setFetchCacheContext("reb-direct-endpoint-event");

        const result = await routeBridgeToHermes(testUser, "endpoint-event", {
          leadId: testUser.leadId,
          originInstanceId: "atlas",
          pathChannel: "path/channel",
          endpointPath: ["test"],
          endpointMethod: "GET",
          urlPathParams: {},
          eventName: "update",
          payload: {},
        });

        expect(
          result.success,
          `REB-DIRECT-ENDPOINT-EVENT failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          throw new Error(result.message);
        }
        const data = result.data as Record<string, unknown>;
        expect(data.received, "hermes bridge must return received: true").toBe(true);
      }, 60_000);

      // ── REB-DIRECT-LIVE-MESSAGE-EVENT ─────────────────────────────────────

      it("REB-DIRECT-LIVE-MESSAGE-EVENT: live-message-event routed to hermes via direct-http returns received: true", async () => {
        requireDirectHttp();
        setFetchCacheContext("reb-direct-live-message-event");

        const result = await routeBridgeToHermes(testUser, "live-message-event", {
          leadId: testUser.leadId,
          threadId: "nonexistent-thread-id",
          originInstanceId: "atlas",
          eventName: "chunk",
          data: { text: "hello" },
        });

        expect(
          result.success,
          `REB-DIRECT-LIVE-MESSAGE-EVENT failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          throw new Error(result.message);
        }
        const data = result.data as Record<string, unknown>;
        expect(data.received, "hermes bridge must return received: true").toBe(true);
      }, 60_000);
    });
  } else {
    describe("HTTP direct", () => {
      it("REB-DIRECT-*: Hermes not running — direct-http tests skipped (run: vibe --hermes dev)", () => {
        expect(true).toBe(true);
      });
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // REVERSE-WS TO HERMES — requires live Hermes dev instance
  // transportMode = 'reverse-ws': Atlas sends event over the hub channel;
  // hermes receives via onRemoteEvent["sync-event"] etc. on its own bridge.
  // Uses connectToHermesLocalAi() which sets transportMode='reverse-ws'.
  // ════════════════════════════════════════════════════════════════════════════

  if (_resolvedRemoteUrl) {
    describe(`Reverse-WS → hermes @ ${_resolvedRemoteUrl}`, () => {
      let _remoteConnectError: string | null = null;

      beforeAll(async () => {
        try {
          await disconnectFromHermes(testUser.id);
          await connectToHermesLocalAi(testUser, _resolvedRemoteUrl);
        } catch (err) {
          _remoteConnectError = String(err);
        }
      }, 120_000);

      afterAll(async () => {
        await disconnectFromHermesLocalAi(testUser, _resolvedRemoteUrl);
      }, 60_000);

      it("prerequisites: hermes connected via reverse-WS", () => {
        if (_remoteConnectError) {
          throw new Error(
            `Reverse-WS connection failed — run: vibe --hermes dev\n${_remoteConnectError}`,
          );
        }
      });

      function requireReverseWs(): void {
        if (_remoteConnectError) {
          throw new Error(`Skipped — fix prerequisites test first: ${_remoteConnectError}`);
        }
      }

      // ── REB-WS-SYNC-EVENT ─────────────────────────────────────────────────

      it("REB-WS-SYNC-EVENT: sync-event routed to hermes via reverse-WS returns received: true", async () => {
        requireReverseWs();
        setFetchCacheContext("reb-ws-sync-event");

        const result = await routeBridgeToHermes(testUser, "sync-event", {
          leadId: testUser.leadId,
          syncPayloads: {},
        });

        expect(
          result.success,
          `REB-WS-SYNC-EVENT failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          throw new Error(result.message);
        }
        const data = result.data as Record<string, unknown>;
        expect(data.received, "hermes bridge via WS must return received: true").toBe(true);
      }, 60_000);

      // ── REB-WS-ENDPOINT-EVENT ─────────────────────────────────────────────

      it("REB-WS-ENDPOINT-EVENT: endpoint-event routed to hermes via reverse-WS returns received: true", async () => {
        requireReverseWs();
        setFetchCacheContext("reb-ws-endpoint-event");

        const result = await routeBridgeToHermes(testUser, "endpoint-event", {
          leadId: testUser.leadId,
          originInstanceId: "atlas",
          pathChannel: "path/channel",
          endpointPath: ["test"],
          endpointMethod: "GET",
          urlPathParams: {},
          eventName: "update",
          payload: {},
        });

        expect(
          result.success,
          `REB-WS-ENDPOINT-EVENT failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          throw new Error(result.message);
        }
        const data = result.data as Record<string, unknown>;
        expect(data.received, "hermes bridge via WS must return received: true").toBe(true);
      }, 60_000);

      // ── REB-WS-LIVE-MESSAGE-EVENT ─────────────────────────────────────────

      it("REB-WS-LIVE-MESSAGE-EVENT: live-message-event routed to hermes via reverse-WS returns received: true", async () => {
        requireReverseWs();
        setFetchCacheContext("reb-ws-live-message-event");

        const result = await routeBridgeToHermes(testUser, "live-message-event", {
          leadId: testUser.leadId,
          threadId: "nonexistent-thread-id",
          originInstanceId: "atlas",
          eventName: "chunk",
          data: { text: "hello" },
        });

        expect(
          result.success,
          `REB-WS-LIVE-MESSAGE-EVENT failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          throw new Error(result.message);
        }
        const data = result.data as Record<string, unknown>;
        expect(data.received, "hermes bridge via WS must return received: true").toBe(true);
      }, 60_000);

      // ── REB-WS-UNKNOWN-EVENT ──────────────────────────────────────────────
      // Unknown eventName on hermes bridge must still return received: true.

      it("REB-WS-UNKNOWN-EVENT: unknown eventName routed to hermes via reverse-WS returns received: true", async () => {
        requireReverseWs();
        setFetchCacheContext("reb-ws-unknown-event");

        const result = await routeBridgeToHermes(testUser, "totally-unknown-event", {
          leadId: testUser.leadId,
        });

        expect(
          result.success,
          `REB-WS-UNKNOWN-EVENT failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          throw new Error(result.message);
        }
        const data = result.data as Record<string, unknown>;
        expect(data.received, "hermes bridge unknown event must return received: true").toBe(true);
      }, 60_000);
    });
  } else {
    describe("Reverse-WS", () => {
      it("REB-WS-*: Hermes not running — reverse-WS tests skipped (run: vibe --hermes dev)", () => {
        expect(true).toBe(true);
      });
    });
  }
});
