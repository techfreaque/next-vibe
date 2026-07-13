/**
 * AI Stream Integration - Cross-Instance Cortex Access (direct-http)
 *
 * Asserts end-to-end: one instance can access another's cortex via the remote
 * connection, execute cortex tools, and receive results back.
 *
 * Two scenarios:
 *
 *   A. Private chat root folder (DefaultFolderId.PRIVATE):
 *      AI is asked to call hermes's cortex-list tool via execute-tool.
 *      The AI runs locally (atlas), tools run on hermes via direct-http.
 *      Verifies: execute-tool dispatches to hermes, cortex-list returns a result.
 *
 *   B. Remote folder (DefaultFolderId.REMOTE, instance subfolder):
 *      Thread lives in the hermes instance subfolder (REMOTE-folder routing, deterministic).
 *      The folder stamps loop_instance_id at creation — the AI loop runs on hermes; cortex tools are hermes-local.
 *      Verifies: routing via REMOTE folder ancestry, AI on hermes can read/write its own cortex.
 *
 * Folder hierarchy per run:
 *   - BACKGROUND root → "e2e-cortex-remote" folder → thread per run (shared across same file)
 *   - PRIVATE root   → "e2e-cortex-remote" folder → thread per run (scenario A)
 *   - REMOTE root    → hermes → tests → cortex-remote → thread per run (scenario B)
 *
 * Each scenario reuses a single shared thread across its test steps (branching for context).
 *
 * Setup mirrors route.direct.test.ts:
 *   1. connectToHermes → registers atlas on hermes, syncs capabilities
 *   2. transportMode='direct-http' (set by connectToHermes for E2E tests)
 *   4. For scenario B: create REMOTE subfolder for hermes (routing is deterministic — no DB rule needed)
 *
 * Requirements:
 *   - vibe --hermes dev --fixture-mode running on port 3002 (hermes)
 *   - VIBE_ADMIN_USER_EMAIL + VIBE_ADMIN_USER_PASSWORD in .env
 */

import "server-only";

import { Platform } from "next-vibe/core/definition/platform";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { RouteExecuteRepository } from "next-vibe/execute-tool/repository";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  DefaultFolderId,
  makeHeadlessContext,
} from "@/app/api/[locale]/agent/chat/config";
import { env } from "@/config/env";

import { seedCaseThread } from "../../testing/fixture-seed";
import {
  fetchThreadMessages,
  getOrCreateFolder,
  runTestStream,
  toolResultRecord,
} from "../../testing/headless-test-runner";
import {
  connectToHermes,
  disconnectFromHermes,
  failSuitePrerequisites,
  HERMES_INSTANCE_ID,
  isHermesInFixtureMode,
  resolveDevUser,
  resolveProdUserId,
  resolveRemoteUrlSync,
  unregisterDevFromHermes,
} from "../../testing/remote-setup";
import { createQualityTesterFavorite } from "./helpers/favorites";

// ── Constants ─────────────────────────────────────────────────────────────────

/** Cache prefix — all fetch cache entries for this test file use this prefix */
const CACHE_PREFIX = "cortex-remote-";

/** Test folder name under each root (keeps threads out of the global root) */
const TEST_FOLDER_NAME = "cortex-remote";

/** Test case subfolder name under REMOTE/hermes/tests/ for scenario B */
const REMOTE_TEST_CASE_NAME = "cortex-remote";

const TEST_TIMEOUT = 120_000;

// ── Shared state ──────────────────────────────────────────────────────────────

let testUser: JwtPrivatePayloadType;
let _prodUserId: string | null = null;

/** Deterministic quality-tester favorite (created fresh in beforeAll) */
let mainFavoriteId: string;

/** Subfolder under PRIVATE root for scenario A threads */
let privateTestFolderId: string;
/** Instance subfolder for hermes under REMOTE root (REMOTE/hermes) */
let remoteHermesInstanceFolderId: string;
/** Test case subfolder for scenario B threads (REMOTE/hermes/tests/cortex-remote) */
let remoteHermesFolderId: string;

// ── Setup ─────────────────────────────────────────────────────────────────────

const _resolvedRemoteUrl = resolveRemoteUrlSync();
const _isFixtureMode = isHermesInFixtureMode();

if (!_resolvedRemoteUrl) {
  failSuitePrerequisites(
    "AI Stream - Cross-Instance Cortex",
    "remote server not running — start: vibe --hermes dev --fixture-mode  → http://localhost:3002",
  );
} else if (!_isFixtureMode) {
  failSuitePrerequisites(
    "AI Stream - Cross-Instance Cortex",
    "hermes is running but not in fixture mode — restart: vibe --hermes dev --fixture-mode",
  );
} else {
  describe("AI Stream Integration - Cross-Instance Cortex (direct-http)", () => {
    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `${env.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
      ).toBeTruthy();
      if (!resolved) {
        // oxlint-disable-next-line restricted-syntax
        throw new Error(
          `${env.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
        );
      }
      testUser = resolved;

      // ── Connect to hermes ──
      await disconnectFromHermes(testUser.id);
      await connectToHermes(testUser, _resolvedRemoteUrl);
      _prodUserId = await resolveProdUserId();

      // ── Deterministic model selection (same favorite as all other suites) ──
      mainFavoriteId = await createQualityTesterFavorite(testUser);

      // ── Create test folders ──
      // Scenario A: PRIVATE root → tests → cortex-remote
      const privateTestsParentId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.PRIVATE,
        "tests",
      );
      privateTestFolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.PRIVATE,
        TEST_FOLDER_NAME,
        privateTestsParentId,
      );

      // Scenario B: REMOTE root → hermes/tests/cortex-remote (nested test case subfolder)
      // connectToHermes() already created REMOTE/hermes and set isDefault=true on the
      // connection — streams in any REMOTE subfolder route to hermes automatically.
      remoteHermesInstanceFolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.REMOTE,
        HERMES_INSTANCE_ID,
      );
      const remoteTestsParentId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.REMOTE,
        "tests",
        remoteHermesInstanceFolderId,
      );
      remoteHermesFolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.REMOTE,
        REMOTE_TEST_CASE_NAME,
        remoteTestsParentId,
      );
    }, TEST_TIMEOUT);

    afterAll(async () => {
      const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
      if (_prodUserId) {
        tasks.push(unregisterDevFromHermes(_prodUserId));
      }
      await Promise.all(tasks);
      _prodUserId = null;
    });

    // ── Scenario A: Private folder — execute-tool to hermes cortex ────────────

    describe("Scenario A — Private folder: AI calls hermes cortex via execute-tool", () => {
      /** Thread shared across all steps in this scenario (created on first step) */
      let sharedThreadId: string | undefined;

      it(
        "A1: AI calls hermes cortex-list via execute-tool and gets a result back",
        async () => {
          const { threadId: fixtureThreadId, streamContext: fixtureCtx } =
            await seedCaseThread(`${CACHE_PREFIX}a1`, true);

          const { result, messages } = await runTestStream({
            prompt:
              "Use execute-tool with toolName='cortex-list' and instanceId='hermes' " +
              "to list the root cortex directory on hermes. " +
              "Report the result as JSON, then end with STEP_OK.",
            user: testUser,
            favoriteId: mainFavoriteId,
            rootFolderId: DefaultFolderId.PRIVATE,
            subFolderId: privateTestFolderId,
            threadId: fixtureThreadId,
            streamContext: fixtureCtx,
          });

          expect(
            result.success,
            `Stream failed: ${result.success ? "" : result.message}`,
          ).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(
              `Stream failed: ${result.message ?? "unexpected failure"}`,
            );
          }

          sharedThreadId = result.data.threadId;

          // Verify the thread was created
          expect(sharedThreadId, "threadId must be set").toBeTruthy();

          // Verify an execute-tool call was made to hermes
          const toolMsg = messages.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.toolName === "execute-tool" &&
              toolResultRecord(m.toolCall.args)?.["toolName"] === "cortex-list",
          );
          expect(
            toolMsg,
            "Expected execute-tool call for cortex-list on hermes",
          ).toBeTruthy();

          // Verify the instanceId in execute-tool args points to hermes
          const args = toolResultRecord(toolMsg?.toolCall?.args);
          expect(
            args?.["instanceId"],
            "execute-tool must route to hermes instance",
          ).toBe(HERMES_INSTANCE_ID);

          // Verify a result was returned (not null)
          expect(
            toolMsg?.toolCall?.result,
            "cortex-list must return a result",
          ).toBeTruthy();

          // Verify the AI confirmed success
          const lastAi = [...messages]
            .toReversed()
            .find((m) => m.role === "assistant");
          expect(lastAi?.content, "AI must produce a response").toBeTruthy();
          expect(
            lastAi?.content?.includes("STEP_OK"),
            `AI must confirm STEP_OK. Got: ${lastAi?.content?.slice(0, 200)}`,
          ).toBe(true);
        },
        TEST_TIMEOUT,
      );

      it(
        "A2: AI writes to hermes cortex via execute-tool and reads it back",
        async () => {
          expect(
            sharedThreadId,
            "A1 must create thread before A2",
          ).toBeTruthy();
          if (!sharedThreadId) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(
              "sharedThreadId not set — prior step must have failed",
            );
          }

          const testContent = `e2e-test-content-${Date.now()}`;

          const { result, messages } = await runTestStream({
            prompt:
              `Use execute-tool with toolName='cortex-write' and instanceId='hermes' ` +
              `to write a file at path '/documents/e2e-test/remote-cortex-test.md' with content '${testContent}' ` +
              `on hermes. Then use execute-tool with toolName='cortex-read' and instanceId='hermes' ` +
              `to read it back and confirm the content matches. End with STEP_OK if both succeeded.`,
            user: testUser,
            favoriteId: mainFavoriteId,
            rootFolderId: DefaultFolderId.PRIVATE,
            subFolderId: privateTestFolderId,
            threadId: sharedThreadId,
            streamContext: makeHeadlessContext(undefined, sharedThreadId, /* no user context — UTC (dates not user-facing here) */ "UTC"),
          });

          expect(
            result.success,
            `Stream failed: ${result.success ? "" : result.message}`,
          ).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(
              `Stream failed: ${result.message ?? "unexpected failure"}`,
            );
          }

          // Verify write call
          const writeMsg = messages.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.toolName === "execute-tool" &&
              toolResultRecord(m.toolCall.args)?.["toolName"] ===
                "cortex-write",
          );
          expect(
            writeMsg,
            "Expected execute-tool call for cortex-write",
          ).toBeTruthy();

          // Verify read call
          const readMsg = messages.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.toolName === "execute-tool" &&
              toolResultRecord(m.toolCall.args)?.["toolName"] === "cortex-read",
          );
          expect(
            readMsg,
            "Expected execute-tool call for cortex-read",
          ).toBeTruthy();

          // Verify AI confirmed success
          const lastAi = [...messages]
            .toReversed()
            .find((m) => m.role === "assistant");
          expect(
            lastAi?.content?.includes("STEP_OK"),
            `AI must confirm STEP_OK. Got: ${lastAi?.content?.slice(0, 200)}`,
          ).toBe(true);
        },
        TEST_TIMEOUT,
      );
    });

    // ── Scenario B: Remote folder — AI loop on hermes, hermes reads its own cortex

    describe("Scenario B — Remote folder: AI loop on hermes reads hermes cortex directly", () => {
      /** Thread shared across all steps in this scenario */
      let sharedThreadId: string | undefined;

      it(
        "B1: AI loop runs on hermes via folder routing, reads hermes cortex natively",
        async () => {
          const { threadId: fixtureThreadId, streamContext: fixtureCtx } =
            await seedCaseThread(`${CACHE_PREFIX}b1`, true);

          // Stream into REMOTE/hermes/tests/cortex-remote.
          // REMOTE-folder routing: folder ancestry resolves to hermes connection deterministically.
          // The REMOTE folder stamped loop_instance_id=hermes at thread
          // creation → hermes runs the AI loop with its own tools.
          // On hermes, cortex tools are native (no execute-tool wrapper needed).
          const { result, messages } = await runTestStream({
            prompt:
              "List the root cortex directory using the cortex-list tool. " +
              "Report the result as JSON. End with STEP_OK.",
            user: testUser,
            favoriteId: mainFavoriteId,
            rootFolderId: DefaultFolderId.REMOTE,
            subFolderId: remoteHermesFolderId,
            threadId: fixtureThreadId,
            streamContext: fixtureCtx,
          });

          expect(
            result.success,
            `Stream failed: ${result.success ? "" : result.message}`,
          ).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(
              `Stream failed: ${result.message ?? "unexpected failure"}`,
            );
          }

          sharedThreadId = result.data.threadId;
          expect(sharedThreadId, "threadId must be set").toBeTruthy();

          // Remote-folder thread: the loop runs on hermes.
          // Hermes uses its own tools natively — cortex-list should appear as a direct
          // tool call (no execute-tool wrapper) since hermes calls its own cortex.
          const cortexMsg = messages.find(
            (m) =>
              m.role === "tool" &&
              (m.toolCall?.toolName === "cortex-list" ||
                toolResultRecord(m.toolCall?.args)?.["toolName"] ===
                  "cortex-list"),
          );
          expect(
            cortexMsg,
            "Expected cortex-list tool call (direct or via execute-tool)",
          ).toBeTruthy();

          expect(
            cortexMsg?.toolCall?.result,
            "cortex-list must return a result",
          ).toBeTruthy();

          const lastAi = [...messages]
            .toReversed()
            .find((m) => m.role === "assistant");
          expect(
            lastAi?.content?.includes("STEP_OK"),
            `AI must confirm STEP_OK. Got: ${lastAi?.content?.slice(0, 200)}`,
          ).toBe(true);
        },
        TEST_TIMEOUT,
      );

      it(
        "B2: Thread created in REMOTE folder is stored in local DB (caller keeps its copy)",
        async () => {
          expect(
            sharedThreadId,
            "B1 must create thread before B2",
          ).toBeTruthy();
          if (!sharedThreadId) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(
              "sharedThreadId not set — prior step must have failed",
            );
          }

          // Verify the thread exists locally (the caller owns its copy)
          const threadDef =
            await import("@/app/api/[locale]/agent/chat/threads/[threadId]/definition");
          const localThreadResult =
            await RouteExecuteRepository.runInProcessTyped({
              definition: threadDef.default.GET,
              input: { rootFolderId: DefaultFolderId.REMOTE },
              urlPathParams: { threadId: sharedThreadId },
              user: testUser,
              locale: defaultLocale,
              platform: Platform.AI,
              logger: createEndpointLogger(false, defaultLocale),
            });

          expect(
            localThreadResult.success,
            `Thread ${sharedThreadId} must exist in local DB (caller copy): ${!localThreadResult.success ? localThreadResult.message : ""}`,
          ).toBeTruthy();

          const localThreadRow = localThreadResult.success
            ? localThreadResult.data
            : null;
          expect(
            localThreadRow?.["rootFolderId"],
            "Thread must be in REMOTE root folder",
          ).toBe(DefaultFolderId.REMOTE);

          // Verify messages are mirrored locally
          const localMessages = await fetchThreadMessages(
            sharedThreadId,
            testUser,
          );
          expect(
            localMessages.length,
            "Thread must have messages mirrored locally",
          ).toBeGreaterThan(0);

          const logger = createEndpointLogger(false, defaultLocale);
          logger.info("B2 thread mirror verified", {
            threadId: sharedThreadId,
            messageCount: localMessages.length,
          });
        },
        TEST_TIMEOUT,
      );
    });
  });
}
