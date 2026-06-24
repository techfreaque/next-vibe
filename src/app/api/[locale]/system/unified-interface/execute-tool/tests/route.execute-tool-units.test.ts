// oxlint-disable oxlint-plugin-restricted/restricted-syntax
/**
 * Execute-Tool Unit Tests
 *
 * Covers: confirmation gate, wakeup-confirm Case A/B race detection,
 * remote-revival utilities, and regression guards verifying the single
 * execution path invariant.
 *
 * ET-GATE-*    : requiresConfirmation gate in local-execute
 * ET-WKCONF-*  : detectWakeUpConfirmRace (wakeup-confirm.ts)
 * ET-REVIVAL-* : resolveRevivalTarget (remote-revival.ts)
 * ET-REGRESSION-*: single-path invariant guards (source-level)
 */

import "server-only";

import { installFetchCache } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
installFetchCache();

import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  DefaultFolderId,
  makeHeadlessContext,
} from "@/app/api/[locale]/agent/chat/config";
import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import {
  ChatMessageRole,
  ThreadStreamingState,
} from "@/app/api/[locale]/agent/chat/enum";
import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/logger/server";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";

import { CallbackMode } from "../constants";
import { resolveRevivalTarget } from "../handlers/remote-revival";
import { detectWakeUpConfirmRace } from "../handlers/wakeup-confirm";
import { RouteExecuteRepository } from "../repository";

function makeLogger(): ReturnType<typeof createEndpointLogger> {
  return createEndpointLogger(false, Date.now(), defaultLocale);
}

describe("Execute-Tool Units", () => {
  let testUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    testUser = await resolveTestAdminUser();
  });

  // ════════════════════════════════════════════════════════════════════════════
  // CONFIRMATION GATE
  // ════════════════════════════════════════════════════════════════════════════

  describe("Confirmation Gate (ET-GATE-*)", () => {
    it("ET-GATE-BLOCKS: requiresConfirmation returns placeholder and sets bridge flag", async () => {
      const streamContext = {
        ...makeHeadlessContext(),
        confirmationOverrides: [
          { toolId: "tool-help", requiresConfirmation: true },
        ],
        stepHasToolsAwaitingConfirmation: false as boolean | undefined,
      };

      const result = await RouteExecuteRepository.runInProcess({
        toolName: "tool-help",
        input: { query: "test", page: 1, pageSize: 5 },
        callbackMode: CallbackMode.WAIT,
        user: testUser,
        locale: defaultLocale,
        logger: makeLogger(),
        streamContext,
        platform: Platform.AI,
      });

      expect(
        result.success,
        `ET-GATE-BLOCKS failed: ${JSON.stringify(result)}`,
      ).toBe(true);
      if (!result.success) {
        throw new Error(result.message);
      }

      // runInProcess returns flat WidgetData — the placeholder status is in the data
      const data = result.data as Record<string, unknown>;
      const status =
        data.status ??
        (data.result as Record<string, unknown> | undefined)?.status;
      expect(status, "Expected waiting_for_confirmation placeholder").toBe(
        "waiting_for_confirmation",
      );

      expect(
        streamContext.stepHasToolsAwaitingConfirmation,
        "Bridge flag must be set on streamContext",
      ).toBe(true);
    });

    it("ET-GATE-CONFIRMED: isConfirmedReExecution bypasses gate and executes tool", async () => {
      const streamContext = {
        ...makeHeadlessContext(),
        confirmationOverrides: [
          { toolId: "tool-help", requiresConfirmation: true },
        ],
        isConfirmedReExecution: true,
        stepHasToolsAwaitingConfirmation: false as boolean | undefined,
      };

      const result = await RouteExecuteRepository.runInProcess({
        toolName: "tool-help",
        input: { query: "test", page: 1, pageSize: 5 },
        callbackMode: CallbackMode.WAIT,
        user: testUser,
        locale: defaultLocale,
        logger: makeLogger(),
        streamContext,
        platform: Platform.AI,
      });

      expect(
        result.success,
        `ET-GATE-CONFIRMED failed: ${JSON.stringify(result)}`,
      ).toBe(true);
      if (!result.success) {
        throw new Error(result.message);
      }

      const data = result.data as Record<string, unknown>;
      const status =
        data.status ??
        (data.result as Record<string, unknown> | undefined)?.status;
      expect(
        status,
        "Confirmed re-execution must not return waiting_for_confirmation",
      ).not.toBe("waiting_for_confirmation");
      expect(
        streamContext.stepHasToolsAwaitingConfirmation,
        "Bridge flag must NOT be set for confirmed re-execution",
      ).toBe(false);
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // WAKEUP-CONFIRM RACE DETECTION
  // ════════════════════════════════════════════════════════════════════════════

  describe("detectWakeUpConfirmRace (ET-WKCONF-*)", () => {
    let testThreadId: string;
    let sequenceId: string;
    let toolMessageId: string;
    let toolMessageCreatedAt: Date;

    beforeAll(async () => {
      // Create a real thread (chatMessages has FK to chatThreads); let DB generate UUID
      const [thread] = await db
        .insert(chatThreads)
        .values({
          title: "wkconf test thread",
          rootFolderId: DefaultFolderId.PRIVATE,
          userId: testUser.id,
          streamingState: ThreadStreamingState.IDLE,
        })
        .returning({ id: chatThreads.id });
      testThreadId = thread.id;

      // Insert tool message for tests to reference; DB generates sequenceId UUID via returning
      const [msg] = await db
        .insert(chatMessages)
        .values({
          threadId: testThreadId,
          role: ChatMessageRole.TOOL,
          metadata: {
            toolCall: {
              toolName: "generate_image",
              toolCallId: "tc-wkconf",
              args: {},
              waitingForConfirmation: true,
              isConfirmed: false,
            },
          },
          isAI: true,
        })
        .returning({
          id: chatMessages.id,
          createdAt: chatMessages.createdAt,
          sequenceId: chatMessages.sequenceId,
        });
      toolMessageId = msg.id;
      toolMessageCreatedAt = msg.createdAt;
      // sequenceId defaults to null unless explicitly set; use the message's own ID as sequenceId
      sequenceId = msg.sequenceId ?? msg.id;

      // Backfill sequenceId to a proper UUID so queries work correctly
      if (!msg.sequenceId) {
        await db
          .update(chatMessages)
          .set({ sequenceId: msg.id })
          .where(eq(chatMessages.id, msg.id));
        sequenceId = msg.id;
      }
    });

    afterAll(async () => {
      await db.delete(chatThreads).where(eq(chatThreads.id, testThreadId));
    });

    it("ET-WKCONF-CASE-A: newer sequence message → returns case-a", async () => {
      // Insert a newer ASSISTANT message with a different sequenceId (must be a real UUID)
      const [newer] = await db
        .insert(chatMessages)
        .values({
          threadId: testThreadId,
          role: ChatMessageRole.ASSISTANT,
          sequenceId: crypto.randomUUID(),
          metadata: {},
          isAI: true,
        })
        .returning({ id: chatMessages.id });

      try {
        const result = await detectWakeUpConfirmRace({
          toolMessage: {
            id: toolMessageId,
            threadId: testThreadId,
            parentId: null,
            model: null,
            skill: null,
            sequenceId,
            createdAt: toolMessageCreatedAt,
            metadata: {
              toolCall: {
                toolName: "generate_image",
                toolCallId: "tc-wkconf",
                args: {},
              },
            },
          },
          toolCall: {
            toolName: "generate_image",
            toolCallId: "tc-wkconf",
            args: {},
          },
          toolMessageId,
          pendingTaskId: undefined,
          user: testUser,
          logger: makeLogger(),
        });

        expect(result.kind).toBe("case-a");
      } finally {
        await db.delete(chatMessages).where(eq(chatMessages.id, newer.id));
      }
    });

    it("ET-WKCONF-CASE-B: no newer sequence → returns case-b, clears waitingForConfirmation", async () => {
      const result = await detectWakeUpConfirmRace({
        toolMessage: {
          id: toolMessageId,
          threadId: testThreadId,
          parentId: null,
          model: null,
          skill: null,
          sequenceId,
          createdAt: toolMessageCreatedAt,
          metadata: {
            toolCall: {
              toolName: "generate_image",
              toolCallId: "tc-wkconf",
              args: {},
              waitingForConfirmation: true,
              isConfirmed: false,
            },
          },
        },
        toolCall: {
          toolName: "generate_image",
          toolCallId: "tc-wkconf",
          args: {},
          waitingForConfirmation: true,
          isConfirmed: false,
        },
        toolMessageId,
        pendingTaskId: undefined,
        user: testUser,
        logger: makeLogger(),
      });

      expect(result.kind).toBe("case-b");
      if (result.kind !== "case-b") {
        throw new Error("expected case-b");
      }
      expect(result.wakeUpPending).toBe(true);

      // DB must have waitingForConfirmation cleared
      const [updated] = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(eq(chatMessages.id, toolMessageId))
        .limit(1);
      const tc = (updated.metadata as Record<string, Record<string, unknown>>)
        ?.toolCall;
      expect(tc?.waitingForConfirmation).toBe(false);
      expect(tc?.isConfirmed).toBe(true);
    });

    it("ET-WKCONF-CASE-B-TASK: case-b with pendingTaskId backfills wakeUpToolMessageId on cron task", async () => {
      const taskId = `test-task-wkconf-${Date.now()}`;
      await db.insert(cronTasks).values({
        id: taskId,
        shortId: taskId,
        routeId: "generate_image_POST",
        displayName: "test wkconf task",
        category: TaskCategory.SYSTEM,
        schedule: "* * * * *",
        priority: CronTaskPriority.MEDIUM,
        runOnce: true,
        enabled: false,
        hidden: true,
        userId: testUser.id,
      });

      try {
        const result = await detectWakeUpConfirmRace({
          toolMessage: {
            id: toolMessageId,
            threadId: testThreadId,
            parentId: null,
            model: null,
            skill: null,
            sequenceId,
            createdAt: toolMessageCreatedAt,
            metadata: {},
          },
          toolCall: {
            toolName: "generate_image",
            toolCallId: "tc-wkconf2",
            args: {},
          },
          toolMessageId,
          pendingTaskId: taskId,
          user: testUser,
          logger: makeLogger(),
        });

        expect(result.kind).toBe("case-b");

        const [task] = await db
          .select({ wakeUpToolMessageId: cronTasks.wakeUpToolMessageId })
          .from(cronTasks)
          .where(eq(cronTasks.id, taskId))
          .limit(1);
        expect(task?.wakeUpToolMessageId).toBe(toolMessageId);
      } finally {
        await db.delete(cronTasks).where(eq(cronTasks.id, taskId));
      }
    });

    it("ET-WKCONF-ERROR-EXCLUDED: ERROR role messages don't count as newer sequence", async () => {
      // ERROR messages must be excluded from newerSequenceMessage check
      const [errMsg] = await db
        .insert(chatMessages)
        .values({
          threadId: testThreadId,
          role: ChatMessageRole.ERROR,
          sequenceId: crypto.randomUUID(),
          metadata: {},
          isAI: false,
          errorMessage: "test error",
        })
        .returning({ id: chatMessages.id });

      try {
        const result = await detectWakeUpConfirmRace({
          toolMessage: {
            id: toolMessageId,
            threadId: testThreadId,
            parentId: null,
            model: null,
            skill: null,
            sequenceId,
            createdAt: toolMessageCreatedAt,
            metadata: {},
          },
          toolCall: {
            toolName: "generate_image",
            toolCallId: "tc-wkconf3",
            args: {},
          },
          toolMessageId,
          pendingTaskId: undefined,
          user: testUser,
          logger: makeLogger(),
        });

        // ERROR message must NOT cause case-a
        expect(result.kind).toBe("case-b");
      } finally {
        await db.delete(chatMessages).where(eq(chatMessages.id, errMsg.id));
      }
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // REMOTE REVIVAL UTILITIES
  // ════════════════════════════════════════════════════════════════════════════

  describe("resolveRevivalTarget (ET-REVIVAL-*)", () => {
    const baseFallback = {
      toolMessageId: "msg-fallback",
      threadId: "thread-fallback",
      callbackMode: CallbackMode.WAKE_UP,
      modelId: null,
      skillId: null,
      favoriteId: null,
      leafMessageId: null,
      subAgentDepth: 0,
    } as const;

    const baseRevival = {
      toolMessageId: "msg-revival",
      threadId: "thread-revival",
      callbackMode: CallbackMode.WAIT,
      modelId: null,
      skillId: null,
      favoriteId: null,
      leafMessageId: null,
      subAgentDepth: 0,
      userId: "user-1",
    } as const;

    it("ET-REVIVAL-PREFERS-WAITER: revival target beats fallback", () => {
      const result = resolveRevivalTarget({
        revival: baseRevival,
        fallback: baseFallback,
      });

      expect(result).not.toBeNull();
      expect(result?.toolMessageId).toBe("msg-revival");
      expect(result?.threadId).toBe("thread-revival");
      expect(result?.callbackMode).toBe(CallbackMode.WAIT);
    });

    it("ET-REVIVAL-USES-FALLBACK: no revival → returns fallback", () => {
      const result = resolveRevivalTarget({
        revival: null,
        fallback: baseFallback,
      });

      expect(result).not.toBeNull();
      expect(result?.toolMessageId).toBe("msg-fallback");
      expect(result?.callbackMode).toBe(CallbackMode.WAKE_UP);
    });

    it("ET-REVIVAL-NULL: both absent → null", () => {
      const result = resolveRevivalTarget({
        revival: null,
        fallback: null,
      });

      expect(result).toBeNull();
    });

    it("ET-REVIVAL-NON-WAIT-NORMALIZED: non-WAIT revival callbackMode → WAKE_UP", () => {
      const result = resolveRevivalTarget({
        revival: { ...baseRevival, callbackMode: CallbackMode.DETACH },
        fallback: null,
      });

      // resolveRevivalTarget normalizes: non-WAIT → WAKE_UP
      expect(result?.callbackMode).toBe(CallbackMode.WAKE_UP);
    });
  });

  describe("Single-path invariant guards (ET-REGRESSION-*)", () => {
    it("ET-REGRESSION-ERROR-HANDLER: tool-error-handler uses runInProcess, not executeGenericHandler directly", async () => {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const handlerPath = path.resolve(
        import.meta.dirname,
        "../../../../agent/ai-stream/repository/handlers/tool-error-handler.ts",
      );
      const src = fs.readFileSync(handlerPath, "utf8");
      expect(src).toContain("RouteExecuteRepository.runInProcess");
      expect(src).not.toMatch(/RouteExecutionExecutor\.executeGenericHandler/);
    });

    it("ET-REGRESSION-TOOLS-LOADER: tools-loader has no direct executeGenericHandler call", async () => {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const loaderPath = path.resolve(
        import.meta.dirname,
        "../../ai/tools-loader.ts",
      );
      const src = fs.readFileSync(loaderPath, "utf8");
      expect(src).toContain("RouteExecuteRepository.execute");
      expect(src).not.toMatch(/RouteExecutionExecutor\.executeGenericHandler/);
    });
  });
});
