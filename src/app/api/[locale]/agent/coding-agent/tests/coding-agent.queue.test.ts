/**
 * Coding Agent Integration - Cloud-Only Transport (UNAVAILABLE path)
 *
 * Tests that transportMode='cloud-only' returns an immediate UNAVAILABLE error —
 * no cron task is created, no 'waiting' state is entered.
 *
 * Cloud-only is the passive inbound mode: the remote instance has no token that
 * can be dialled. Tool dispatch is not supported → execute-tool fails immediately
 * with EXTERNAL_SERVICE_ERROR. The AI receives the error inline and proceeds.
 *
 * This verifies the fail-fast contract: no task queue fallback, no retry.
 */

import "server-only";

import { installFetchCache } from "../../ai-stream/testing/fetch-cache";
installFetchCache();

import { and, eq, sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { chatFavorites } from "@/app/api/[locale]/agent/skills/favorites/db";
import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { db } from "@/app/api/[locale]/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import { setFetchCacheContext } from "../../ai-stream/testing/fetch-cache";
import {
  getOrCreateFolder,
  runTestStream,
  toolResultRecord,
} from "../../ai-stream/testing/headless-test-runner";
import {
  closeProdDb,
  connectToHermes,
  disconnectFromHermes,
  resolveProdUserId,
  resolveRemoteUrlSync,
  unregisterDevFromHermes,
} from "../../ai-stream/testing/remote-setup";

const HERMES_INSTANCE_ID = "hermes";
/** instanceId used by hermes to refer to atlas */
const ATLAS_INSTANCE_ID = "atlas";
/** Local dev server URL (hermes, vibe --hermes dev) */
const LOCAL_DEV_URL = "http://localhost:3002";
const TEST_TIMEOUT = 120_000;

describe(
  "Coding Agent Integration - Cloud-Only (UNAVAILABLE: no task queue fallback)",
  () => {
    let testUser: JwtPrivatePayloadType;
    let mainFavoriteId: string;
    let testSubFolderId: string;
    let _prodUserId: string | null = null;
    let setupError: string | null = null;

    const _remoteUrl = resolveRemoteUrlSync();

    beforeAll(async () => {
      if (!_remoteUrl) {
        setupError = "hermes not running — start: vibe --hermes dev → http://localhost:3002";
        return;
      }

      testUser = await resolveTestAdminUser();

      // Favorite for model resolution
      const MAIN_FAVORITE_ID = "00000000-0000-4001-a000-000000000002";
      const [existingFav] = await db
        .select({ id: chatFavorites.id })
        .from(chatFavorites)
        .where(
          and(
            eq(chatFavorites.userId, testUser.id),
            eq(chatFavorites.skillId, "quality-tester"),
          ),
        )
        .orderBy(chatFavorites.position)
        .limit(1);

      if (existingFav) {
        mainFavoriteId = existingFav.id;
      } else {
        await db
          .insert(chatFavorites)
          .values({
            id: MAIN_FAVORITE_ID,
            userId: testUser.id,
            skillId: "quality-tester",
            variantId: "kimi",
            position: 9997,
          })
          .onConflictDoNothing();
        mainFavoriteId = MAIN_FAVORITE_ID;
      }

      const testsParentId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.BACKGROUND,
        "tests",
      );
      testSubFolderId = await getOrCreateFolder(
        testUser,
        DefaultFolderId.BACKGROUND,
        "ca-cloud-only",
        testsParentId,
      );

      try {
        // Idempotent cleanup before setup
        await disconnectFromHermes(testUser.id);
        // Connect to Hermes and register atlas
        await connectToHermes(testUser, LOCAL_DEV_URL);

        _prodUserId = await resolveProdUserId();

        // Force cloud-only: no outbound dialling, execute-tool returns UNAVAILABLE immediately
        await db
          .update(remoteConnections)
          .set({ transportMode: "cloud-only" })
          .where(
            and(
              eq(remoteConnections.userId, testUser.id),
              eq(remoteConnections.instanceId, HERMES_INSTANCE_ID),
            ),
          );
      } catch (err) {
        setupError = String(err);
      }
    }, TEST_TIMEOUT);

    afterAll(async () => {
      if (!testUser) {
        return;
      }

      // Reset transportMode on hermes before disconnecting (best-effort)
      if (testUser) {
        try {
          const { sendTestRequest } =
            await import("@/app/api/[locale]/system/check/testing/testing-suite/send-test-request");
          const connByIdDef = (
            await import("@/app/api/[locale]/remote-connection/[instanceId]/definition")
          ).default;
          await sendTestRequest({
            endpoint: connByIdDef.PATCH,
            data: { transportMode: "cloud-only" },
            urlPathParams: { instanceId: ATLAS_INSTANCE_ID },
            user: testUser,
            instanceId: HERMES_INSTANCE_ID,
          });
        } catch {
          /* best-effort */
        }
      }

      const tasks: Promise<void>[] = [disconnectFromHermes(testUser.id)];
      if (_prodUserId) {
        tasks.push(unregisterDevFromHermes(_prodUserId));
      }
      await Promise.all(tasks);
      await closeProdDb();
    }, TEST_TIMEOUT);

    // ── CO1: cloud-only execute-tool fails immediately ──────────────────────────

    it(
      "CO1: execute-tool(coding-agent) with cloud-only returns UNAVAILABLE inline — AI continues, thread stays idle",
      async () => {
        if (!_remoteUrl) {
          expect(
            false,
            "CO1 skipped: hermes not running — start: vibe --hermes dev → http://localhost:3002",
          ).toBe(true);
          return;
        }
        if (setupError) {
          expect(
            false,
            `CO1 skipped: setup failed — ${setupError}`,
          ).toBe(true);
          return;
        }

        setFetchCacheContext("ca-cloud-only-co1");

        const { result, messages } = await runTestStream({
          user: testUser,
          favoriteId: mainFavoriteId,
          rootFolderId: DefaultFolderId.BACKGROUND,
          subFolderId: testSubFolderId,
          prompt:
            `[CO1] Call execute-tool with toolName='coding-agent', instanceId='${HERMES_INSTANCE_ID}', ` +
            `prompt='echo hello-co1', interactiveMode=false, callbackMode='wait'. ` +
            `Report back exactly what happened — did the tool succeed or fail? What error did you receive?`,
        });

        expect(result.success, "CO1: stream must succeed (AI completed)").toBe(true);
        if (!result.success) {
          return;
        }

        const threadId = result.data.threadId!;
        expect(threadId, "CO1: must create thread").toBeTruthy();

        // Thread must be idle — cloud-only never enters 'waiting'
        const [thread] = await db
          .select({ streamingState: chatThreads.streamingState })
          .from(chatThreads)
          .where(eq(chatThreads.id, threadId));
        expect(
          thread?.streamingState,
          "CO1: thread must be idle — no queue wait with cloud-only",
        ).toBe("idle");

        // No cron tasks should exist for this thread
        const pending = await db.execute<{ id: string }>(
          sql`SELECT id FROM cron_tasks
              WHERE wake_up_thread_id = ${threadId}
                AND enabled = true
                AND (last_execution_status IS NULL
                     OR last_execution_status NOT IN ('completed', 'cancelled', 'failed', 'stopped'))`,
        );
        expect(
          pending.rows.length,
          `CO1: no pending cron tasks must exist — cloud-only is fail-fast (found ${String(pending.rows.length)})`,
        ).toBe(0);

        // The execute-tool message must exist and must have FAILED (result null, error set)
        const toolMsg = messages.findLast(
          (m) =>
            m.role === "tool" &&
            m.toolCall?.toolName === "execute-tool" &&
            m.toolCall?.isDeferred !== true &&
            toolResultRecord(m.toolCall?.args)?.["toolName"] === "coding-agent",
        );
        expect(
          toolMsg,
          "CO1: execute-tool(coding-agent) message must exist in thread",
        ).toBeDefined();

        const res = toolResultRecord(toolMsg?.toolCall?.result);
        expect(
          res,
          "CO1: result must be null — cloud-only returns UNAVAILABLE (no outbound dial)",
        ).toBeNull();

        // status must be "failed" (set by tool-result-handler for effectiveIsError)
        expect(
          toolMsg?.toolCall?.status,
          "CO1: toolCall.status must be 'failed' for cloud-only UNAVAILABLE",
        ).toBe("failed");

        // Query DB directly for the error details (not exposed in SlimMessage)
        if (toolMsg?.id) {
          const [dbMsg] = await db
            .select({ metadata: chatMessages.metadata })
            .from(chatMessages)
            .where(eq(chatMessages.id, toolMsg.id));
          const toolCallMeta = (dbMsg?.metadata as { toolCall?: { error?: { errorType?: { errorKey?: string } | string } } } | undefined)?.toolCall;
          expect(
            toolCallMeta?.error,
            "CO1: DB metadata must have error set for cloud-only failure",
          ).toBeDefined();
          const errorKey = typeof toolCallMeta?.error?.errorType === "object"
            ? toolCallMeta.error.errorType?.errorKey
            : toolCallMeta?.error?.errorType;
          expect(
            errorKey,
            "CO1: error.errorType must be EXTERNAL_SERVICE_ERROR",
          ).toContain("external_service");
        }

        // AI must have responded after receiving the error
        const lastAi = [...messages].toReversed().find((m) => m.role === "assistant");
        expect(
          lastAi?.content,
          "CO1: AI must have responded after receiving the UNAVAILABLE error",
        ).toBeTruthy();
      },
      TEST_TIMEOUT,
    );

    // ── CO2: no deferred child created for cloud-only failure ───────────────────

    it(
      "CO2: cloud-only UNAVAILABLE creates no deferred child message",
      async () => {
        if (!_remoteUrl || setupError) {
          expect(
            false,
            setupError
              ? `CO2 skipped: setup failed — ${setupError}`
              : "CO2 skipped: hermes not running",
          ).toBe(true);
          return;
        }

        setFetchCacheContext("ca-cloud-only-co2");

        const { result, messages } = await runTestStream({
          user: testUser,
          favoriteId: mainFavoriteId,
          rootFolderId: DefaultFolderId.BACKGROUND,
          subFolderId: testSubFolderId,
          prompt:
            `[CO2] Call execute-tool with toolName='coding-agent', instanceId='${HERMES_INSTANCE_ID}', ` +
            `prompt='echo hello-co2', interactiveMode=false, callbackMode='wait'. ` +
            `The tool will fail immediately. Report the error you received.`,
        });

        expect(result.success, "CO2: stream must succeed").toBe(true);
        if (!result.success) {
          return;
        }

        const toolMsg = messages.findLast(
          (m) =>
            m.role === "tool" &&
            m.toolCall?.toolName === "execute-tool" &&
            m.toolCall?.isDeferred !== true &&
            toolResultRecord(m.toolCall?.args)?.["toolName"] === "coding-agent",
        );
        expect(toolMsg, "CO2: execute-tool message must exist").toBeDefined();

        // No deferred child should be created — cloud-only is fail-fast
        const deferred = messages.find(
          (m) =>
            m.role === "tool" &&
            m.toolCall?.isDeferred === true &&
            m.toolCall.originalToolCallId === toolMsg?.toolCall?.toolCallId,
        );
        expect(
          deferred,
          "CO2: cloud-only UNAVAILABLE must not create a deferred child",
        ).toBeUndefined();

        // Confirm error path via status (SlimMessage exposes status but not error directly)
        const res = toolResultRecord(toolMsg?.toolCall?.result);
        expect(res, "CO2: result must be null for cloud-only failure").toBeNull();
        expect(
          toolMsg?.toolCall?.status,
          "CO2: toolCall.status must be 'failed' for cloud-only UNAVAILABLE",
        ).toBe("failed");
      },
      TEST_TIMEOUT,
    );
  },
);
