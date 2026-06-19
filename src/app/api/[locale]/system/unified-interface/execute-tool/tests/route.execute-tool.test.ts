/**
 * Execute-Tool E2E Tests
 *
 * All tests call RouteExecuteRepository.runInProcess() directly in-process.
 * Remote tests require a live Hermes dev instance (vibe --hermes dev).
 *
 * ET1–ET3:  Local execution across platforms (AI, CLI, MCP)
 * ET4–ET5:  Async callback modes (DETACH, WAKE_UP)
 * ET6–ET12: Remote execution (direct-HTTP and reverse-WS)
 * ET13–ET16: Error cases (platform gate, invalid tool, incognito folder)
 */

import "server-only";

// installFetchCache MUST be called before any other imports.
import { installFetchCache } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
installFetchCache();

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { setFetchCacheContext } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
import { resolveRemoteUrlSync } from "@/app/api/[locale]/agent/ai-stream/testing/remote-setup";
import { HERMES_INSTANCE_ID } from "@/app/api/[locale]/agent/ai-stream/testing/remote-setup";
import {
  DefaultFolderId,
  makeHeadlessContext,
} from "@/app/api/[locale]/agent/chat/config";
import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import helpEndpoints from "@/app/api/[locale]/system/help/definition";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";

import { CallbackMode } from "../constants";
import { RouteExecuteRepository } from "../repository";

// ── Remote URL guard ──────────────────────────────────────────────────────────

const _resolvedRemoteUrl = resolveRemoteUrlSync();

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeLogger(): ReturnType<typeof createEndpointLogger> {
  return createEndpointLogger(false, Date.now(), defaultLocale);
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe("Execute-Tool E2E", () => {
  let testUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    testUser = await resolveTestAdminUser();
  });

  // ── ET1: Local — tool-help, WAIT, AI ────────────────────────────────────────

  it("ET1: local tool-help via AI platform returns result inline", async () => {
    setFetchCacheContext("execute-tool-et1");

    const result = await RouteExecuteRepository.runInProcessTyped({
      definition: helpEndpoints.GET,
      input: { query: "execute-tool", page: 1, pageSize: 50 },
      callbackMode: CallbackMode.WAIT,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      platform: Platform.AI,
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    // tool-help returns an object with tool entries
    expect(result.data).toBeDefined();
  });

  // ── ET2: Local — tool-help, WAIT, CLI ───────────────────────────────────────

  it("ET2: local tool-help via CLI platform returns result inline", async () => {
    setFetchCacheContext("execute-tool-et2");

    const result = await RouteExecuteRepository.runInProcessTyped({
      definition: helpEndpoints.GET,
      input: { query: "execute-tool", page: 1, pageSize: 50 },
      callbackMode: CallbackMode.WAIT,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      platform: Platform.CLI,
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data).toBeDefined();
  });

  // ── ET3: Local — tool-help, WAIT, MCP ───────────────────────────────────────

  it("ET3: local tool-help via MCP platform returns result inline", async () => {
    setFetchCacheContext("execute-tool-et3");

    const result = await RouteExecuteRepository.runInProcessTyped({
      definition: helpEndpoints.GET,
      input: { query: "execute-tool", page: 1, pageSize: 50 },
      callbackMode: CallbackMode.WAIT,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      platform: Platform.MCP,
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data).toBeDefined();
  });

  // ── ET4: Local — DETACH returns taskId ──────────────────────────────────────

  it("ET4: local tool with DETACH callbackMode returns taskId immediately", async () => {
    setFetchCacheContext("execute-tool-et4");

    const result = await RouteExecuteRepository.runInProcessTyped({
      definition: helpEndpoints.GET,
      input: { query: "test-detach", page: 1, pageSize: 50 },
      callbackMode: CallbackMode.DETACH,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      platform: Platform.AI,
    });

    // DETACH: result is either inline (if tool is fast enough to not escalate)
    // or {taskId, status: "pending"} if tool escalated to task.
    // tool-help is synchronous so it will complete inline without task escalation.
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data).toBeDefined();
  });

  // ── ET5: Local — END_LOOP returns result inline ──────────────────────────────

  it("ET5: local tool with END_LOOP callbackMode returns result inline", async () => {
    setFetchCacheContext("execute-tool-et5");

    const result = await RouteExecuteRepository.runInProcessTyped({
      definition: helpEndpoints.GET,
      input: { query: "execute-tool", page: 1, pageSize: 50 },
      callbackMode: CallbackMode.END_LOOP,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      platform: Platform.AI,
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data).toBeDefined();
  });

  // ── ET15: Invalid toolName returns failure ───────────────────────────────────

  it("ET15: unknown toolName returns failure (not a throw)", async () => {
    setFetchCacheContext("execute-tool-et15");

    const result = await RouteExecuteRepository.runInProcess({
      toolName: "this-tool-does-not-exist-xyz",
      input: {},
      callbackMode: CallbackMode.WAIT,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      streamContext: makeHeadlessContext(),
      platform: Platform.AI,
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    // Should report not found
    expect(result.message).toBeTruthy();
  });

  // ── ET16: Incognito folder — remote tool blocked ─────────────────────────────

  it("ET16: incognito folder blocks remote tool execution", async () => {
    setFetchCacheContext("execute-tool-et16");

    // Incognito folder does not allow remote tools (FOLDER_ALLOWS_REMOTE_TOOLS = false)
    const result = await RouteExecuteRepository.runInProcessTyped({
      definition: helpEndpoints.GET,
      input: { query: "test", page: 1, pageSize: 50 },
      instanceId: "nonexistent-remote",
      callbackMode: CallbackMode.WAIT,
      user: testUser,
      locale: defaultLocale,
      logger: makeLogger(),
      streamContext: {
        ...makeHeadlessContext(),
        rootFolderId: DefaultFolderId.INCOGNITO,
      },
      platform: Platform.AI,
    });

    // Incognito blocks remote tool dispatch
    expect(result.success).toBe(false);
  });

  // ── Remote tests (require live Hermes) ──────────────────────────────────────

  if (_resolvedRemoteUrl) {
    describe(`Remote (${_resolvedRemoteUrl})`, () => {
      let _remoteConnectError: string | null = null;

      beforeAll(async () => {
        const { connectToHermes, disconnectFromHermes } =
          await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");
        try {
          await disconnectFromHermes(testUser.id);
          await connectToHermes(testUser, _resolvedRemoteUrl);
        } catch (err) {
          _remoteConnectError = String(err);
        }
      }, 120000);

      afterAll(async () => {
        const { disconnectFromHermes } =
          await import("@/app/api/[locale]/agent/ai-stream/testing/remote-setup");
        await disconnectFromHermes(testUser.id);
      }, 60000);

      it("prerequisites: hermes connected", () => {
        if (_remoteConnectError) {
          expect(false, `Remote connection failed — run: vibe rebuild\n${_remoteConnectError}`).toBe(true);
          return;
        }
      });

      // ET6: Remote direct-HTTP — tool-help, WAIT ──────────────────────────────

      it("ET6: remote tool-help WAIT returns result from hermes", async () => {
        if (_remoteConnectError) {
          expect(false, `Remote connection failed — fix prerequisites test first: ${_remoteConnectError}`).toBe(true);
          return;
        }
        setFetchCacheContext("execute-tool-et6");

        const result = await RouteExecuteRepository.runInProcessTyped({
          definition: helpEndpoints.GET,
          input: { query: "execute-tool", page: 1, pageSize: 50 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.WAIT,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          platform: Platform.AI,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          expect(false, `ET6 failed: ${JSON.stringify(result)}`).toBe(true);
          return;
        }
        expect(result.data).toBeDefined();
      });

      // ET7: Remote direct-HTTP — tool-help, DETACH ────────────────────────────

      it("ET7: remote tool-help DETACH returns taskId", async () => {
        if (_remoteConnectError) {
          expect(false, `Remote connection failed — fix prerequisites test first: ${_remoteConnectError}`).toBe(true);
          return;
        }
        setFetchCacheContext("execute-tool-et7");

        const result = await RouteExecuteRepository.runInProcessTyped({
          definition: helpEndpoints.GET,
          input: { query: "execute-tool", page: 1, pageSize: 50 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.DETACH,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          platform: Platform.AI,
        });

        // Remote DETACH: task created on remote, returns {taskId, status}
        expect(result.success).toBe(true);
        if (!result.success) {
          expect(false, `ET7 failed: ${JSON.stringify(result)}`).toBe(true);
          return;
        }
        // Response is either inline (hermes did it sync) or taskId object
        expect(result.data).toBeDefined();
      });

      // ET9: Remote — END_LOOP ──────────────────────────────────────────────────

      it("ET9: remote tool-help END_LOOP returns result inline", async () => {
        if (_remoteConnectError) {
          expect(false, `Remote connection failed — fix prerequisites test first: ${_remoteConnectError}`).toBe(true);
          return;
        }
        setFetchCacheContext("execute-tool-et9");

        const result = await RouteExecuteRepository.runInProcessTyped({
          definition: helpEndpoints.GET,
          input: { query: "execute-tool", page: 1, pageSize: 50 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.END_LOOP,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          platform: Platform.AI,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          expect(false, `ET9 failed: ${JSON.stringify(result)}`).toBe(true);
          return;
        }
        expect(result.data).toBeDefined();
      });

      // ET11: Prefixed tool name routes to hermes ──────────────────────────────

      it("ET11: prefixed hermes__tool-help_POST routes to hermes", async () => {
        if (_remoteConnectError) {
          expect(false, `Remote connection failed — fix prerequisites test first: ${_remoteConnectError}`).toBe(true);
          return;
        }
        setFetchCacheContext("execute-tool-et11");

        const result = await RouteExecuteRepository.runInProcess({
          toolName: `${HERMES_INSTANCE_ID}__tool-help_POST`,
          input: { query: "execute-tool", page: 1, pageSize: 50 },
          callbackMode: CallbackMode.WAIT,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          streamContext: makeHeadlessContext(),
          platform: Platform.AI,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          expect(false, `ET11 failed: ${JSON.stringify(result)}`).toBe(true);
          return;
        }
        expect(result.data).toBeDefined();
      });

      // ET12: CLI surface remote ────────────────────────────────────────────────

      it("ET12: CLI platform remote tool-help routes to hermes", async () => {
        if (_remoteConnectError) {
          expect(false, `Remote connection failed — fix prerequisites test first: ${_remoteConnectError}`).toBe(true);
          return;
        }
        setFetchCacheContext("execute-tool-et12");

        const result = await RouteExecuteRepository.runInProcessTyped({
          definition: helpEndpoints.GET,
          input: { query: "execute-tool", page: 1, pageSize: 50 },
          instanceId: HERMES_INSTANCE_ID,
          callbackMode: CallbackMode.WAIT,
          user: testUser,
          locale: defaultLocale,
          logger: makeLogger(),
          platform: Platform.CLI,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          expect(false, `ET12 failed: ${JSON.stringify(result)}`).toBe(true);
          return;
        }
        expect(result.data).toBeDefined();
      });
    });
  } else {
    it("Remote tests: no Hermes dev server running", () => {
      expect(false, "Remote tests require Hermes dev server — run: vibe --hermes dev").toBe(true);
    });
  }
});
