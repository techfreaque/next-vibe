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
  const { RouteExecuteRepository } =
    await import("@/app/api/[locale]/system/unified-interface/execute-tool/repository");
  const { CallbackMode } =
    await import("@/app/api/[locale]/system/unified-interface/execute-tool/constants");
  const { createEndpointLogger } =
    await import("@/app/api/[locale]/system/logger/server");
  const { makeHeadlessContext } =
    await import("@/app/api/[locale]/agent/chat/config");
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
    // ── REB-LOCAL-REMOTE-EVENT ────────────────────────────────────────────────
    // One generic remote-event carries any route's relayed event. The bridge
    // dispatches it to the target route's onRemoteEvent and returns received:true.

    it("REB-LOCAL-REMOTE-EVENT: local remote-event returns received: true", async () => {
      setFetchCacheContext("reb-local-remote-event");

      const result = await sendTestRequest({
        endpoint: endpoints.POST,
        data: {
          eventName: "remote-event",
          leadId: testUser.leadId,
          payload: {
            originInstanceId: "hermes",
            domain: "cache",
            endpointPath: ["remote-connection", "remote-event-bridge"],
            endpointMethod: "POST",
            urlPathParams: {},
            endpointEventName: "update",
            endpointPayload: {},
          },
        },
        user: testUser,
      });

      expect(
        result.success,
        `REB-LOCAL-REMOTE-EVENT failed: ${JSON.stringify(result)}`,
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

    it("REB-LOCAL-ECHO-DROP: self-origin remote-event is silently dropped, received: true", async () => {
      setFetchCacheContext("reb-local-echo-drop");

      const { RemoteConnectionRepository } =
        await import("@/app/api/[locale]/remote-connection/repository");
      const selfInstanceId =
        await RemoteConnectionRepository.getLocalInstanceId(testUser.id);

      const result = await sendTestRequest({
        endpoint: endpoints.POST,
        data: {
          eventName: "remote-event",
          leadId: testUser.leadId,
          payload: {
            originInstanceId: selfInstanceId,
            domain: "cache",
            endpointPath: ["test"],
            endpointMethod: "GET",
            urlPathParams: {},
            endpointEventName: "update",
            endpointPayload: {},
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

    it("REB-LOCAL-INVALID-PAYLOAD: handleRemoteEvent with invalid payload does not throw", async () => {
      const { createEndpointLogger } =
        await import("@/app/api/[locale]/system/logger/server");
      const logger = createEndpointLogger(false, Date.now(), "en-US");

      // Empty payload: missing the required endpointPath/endpointMethod/
      // endpointEventName fields → handler takes the early-return guard path.
      await expect(
        RemoteEventBridgeRepository.handleRemoteEvent({}, testUser.id, logger),
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
          throw new Error(
            `Skipped — fix prerequisites test first: ${_remoteConnectError}`,
          );
        }
      }

      // ── REB-DIRECT-REMOTE-EVENT ───────────────────────────────────────────

      it("REB-DIRECT-REMOTE-EVENT: remote-event routed to hermes via direct-http returns received: true", async () => {
        requireDirectHttp();
        setFetchCacheContext("reb-direct-remote-event");

        const result = await routeBridgeToHermes(testUser, "remote-event", {
          originInstanceId: "atlas",
          domain: "cache",
          endpointPath: ["test"],
          endpointMethod: "GET",
          urlPathParams: {},
          endpointEventName: "update",
          endpointPayload: {},
        });

        expect(
          result.success,
          `REB-DIRECT-REMOTE-EVENT failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          throw new Error(result.message);
        }
        const data = result.data as Record<string, unknown>;
        expect(data.received, "hermes bridge must return received: true").toBe(
          true,
        );
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
          throw new Error(
            `Skipped — fix prerequisites test first: ${_remoteConnectError}`,
          );
        }
      }

      // ── REB-WS-REMOTE-EVENT ───────────────────────────────────────────────

      it("REB-WS-REMOTE-EVENT: remote-event routed to hermes via reverse-WS returns received: true", async () => {
        requireReverseWs();
        setFetchCacheContext("reb-ws-remote-event");

        const result = await routeBridgeToHermes(testUser, "remote-event", {
          originInstanceId: "atlas",
          domain: "cache",
          endpointPath: ["test"],
          endpointMethod: "GET",
          urlPathParams: {},
          endpointEventName: "update",
          endpointPayload: {},
        });

        expect(
          result.success,
          `REB-WS-REMOTE-EVENT failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          throw new Error(result.message);
        }
        const data = result.data as Record<string, unknown>;
        expect(
          data.received,
          "hermes bridge via WS must return received: true",
        ).toBe(true);
      }, 60_000);

      // ── REB-WS-UNKNOWN-EVENT ──────────────────────────────────────────────
      // Unknown eventName on hermes bridge must still return received: true.

      it("REB-WS-UNKNOWN-EVENT: unknown eventName routed to hermes via reverse-WS returns received: true", async () => {
        requireReverseWs();
        setFetchCacheContext("reb-ws-unknown-event");

        const result = await routeBridgeToHermes(
          testUser,
          "totally-unknown-event",
          {
            leadId: testUser.leadId,
          },
        );

        expect(
          result.success,
          `REB-WS-UNKNOWN-EVENT failed: ${JSON.stringify(result)}`,
        ).toBe(true);
        if (!result.success) {
          throw new Error(result.message);
        }
        const data = result.data as Record<string, unknown>;
        expect(
          data.received,
          "hermes bridge unknown event must return received: true",
        ).toBe(true);
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
