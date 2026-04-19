/**
 * Cortex AI Stream Integration Tests
 *
 * Tests the AI model's ability to use cortex tools (write, read, edit, tree, delete)
 * and reason about workspace context. Uses a single shared thread so all steps
 * are visible in the admin's cron threads for manual review.
 *
 * Runs with env.VIBE_ADMIN_USER_EMAIL user → threads in admin's cron folder.
 *
 * Cache bust: delete fixtures/http-cache/cortex-ai-{context}/ to re-record.
 */

import "server-only";

// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

import { installFetchCache } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
installFetchCache();

import { and, eq, like } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatFavorites } from "@/app/api/[locale]/agent/chat/favorites/db";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";
import { env } from "@/config/env";
import {
  setFetchCacheContext,
} from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
import {
  fetchThreadMessages,
  runTestStream,
  toolResultRecord,
  type SlimMessage,
} from "@/app/api/[locale]/agent/ai-stream/testing/headless-test-runner";

import { cortexNodes } from "./db";

// ── Helpers ─────────────────────────────────────────────────────────────────

async function resolveUser(
  email: string,
): Promise<JwtPrivatePayloadType | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const result = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!result.success || !result.data) {
    return null;
  }
  const user = result.data;

  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);

  if (!link) {
    return null;
  }

  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );

  return {
    isPublic: false,
    id: user.id,
    leadId: link.leadId,
    roles,
  };
}

/** Find tool messages by tool name (handles execute-tool wrapper) */
function findToolMsg(
  messages: SlimMessage[],
  toolName: string,
): SlimMessage | undefined {
  return messages.find(
    (m) =>
      m.role === "tool" &&
      m.toolCall !== null &&
      (m.toolCall.toolName === toolName ||
        // AI may call via execute-tool wrapper
        (m.toolCall.toolName === "execute-tool" &&
          (m.toolCall.args as Record<string, unknown>)?.toolName === toolName)),
  );
}

/** Extract result from tool message, handling execute-tool wrapper */
function resolveToolResult(
  msg: SlimMessage,
): Record<string, WidgetData> | null {
  if (!msg.toolCall?.result) {
    return null;
  }
  const rec = toolResultRecord(msg.toolCall.result);
  if (!rec) {
    return null;
  }
  // execute-tool wraps result in { data: ... } or { result: ... }
  for (const key of ["data", "result"] as const) {
    if (key in rec && typeof rec[key] === "object" && rec[key] !== null) {
      return toolResultRecord(rec[key]) ?? rec;
    }
  }
  return rec;
}

// ── Test Suite ──────────────────────────────────────────────────────────────

const TEST_TIMEOUT = 120_000;

describe("Cortex AI Integration", () => {
  let testUser: JwtPrivatePayloadType;
  let mainFavoriteId: string;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      return;
    }
    testUser = resolved;

    // Resolve or create quality-tester favorite
    const CORTEX_FAV_ID = "00000000-0000-4001-c000-000000000001";
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
          id: CORTEX_FAV_ID,
          userId: testUser.id,
          skillId: "quality-tester",
          variantId: "kimi",
          position: 9997,
        })
        .onConflictDoNothing();
      mainFavoriteId = CORTEX_FAV_ID;
    }

    // Clean up any leftover AI test data
    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, testUser.id),
          like(cortexNodes.path, "/documents/ai-test%"),
        ),
      );
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (!testUser) {
      return;
    }
    // Final cleanup
    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, testUser.id),
          like(cortexNodes.path, "/documents/ai-test%"),
        ),
      );
  });

  // Sequential: each step builds on previous
  let suiteFailed = false;
  function fit(
    name: string,
    fn: () => Promise<void>,
    timeout?: number,
  ): void {
    it(
      name,
      async () => {
        if (suiteFailed) {
          return;
        }
        try {
          await fn();
        } catch (err) {
          suiteFailed = true;
          // oxlint-disable-next-line restricted-syntax
          throw err;
        }
      },
      timeout ?? TEST_TIMEOUT,
    );
  }

  let threadId: string;

  // ── C1: Write via AI ───────────────────────────────────────────────────────
  fit("C1: AI writes a file via cortex-write", async () => {
    setFetchCacheContext("cortex-ai-write");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      prompt:
        'Use the cortex-write tool to create a file at /documents/ai-test/notes.md with this exact content:\n\n"# AI Test Notes\n\nThis document was created by an AI to test cortex tool integration.\nKey topics: testing, automation, cortex-write verification."\n\nAfter writing, confirm what you did.',
    });

    expect(result.success, "C1: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    threadId = result.data.threadId!;
    expect(threadId, "C1: no threadId").toBeTruthy();

    // Find cortex-write tool call
    const writeMsg = findToolMsg(messages, "cortex-write");
    expect(writeMsg, "C1: no cortex-write tool call found").toBeTruthy();
    if (!writeMsg) {
      return;
    }

    const writeResult = resolveToolResult(writeMsg);
    expect(writeResult, "C1: no tool result").toBeTruthy();
    if (!writeResult) {
      return;
    }

    expect(writeResult.responsePath ?? writeResult.path).toContain("ai-test/notes.md");
    expect(writeResult.created).toBe(true);
    expect(
      typeof writeResult.size === "number" ? writeResult.size : 0,
    ).toBeGreaterThan(0);
  });

  // ── C2: Read via AI ────────────────────────────────────────────────────────
  fit("C2: AI reads the file via cortex-read", async () => {
    setFetchCacheContext("cortex-ai-read");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt:
        "Use cortex-read to read the file at /documents/ai-test/notes.md. Tell me what's in it.",
    });

    expect(result.success, "C2: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const readMsg = findToolMsg(messages, "cortex-read");
    expect(readMsg, "C2: no cortex-read tool call found").toBeTruthy();
    if (!readMsg) {
      return;
    }

    const readResult = resolveToolResult(readMsg);
    expect(readResult, "C2: no tool result").toBeTruthy();
    if (!readResult) {
      return;
    }

    expect(readResult.content).toBeTruthy();
    expect(String(readResult.content)).toContain("AI Test Notes");
    // nodeType is the enum i18n key value
    expect(readResult.nodeType).toBeTruthy();
  });

  // ── C3: Edit via AI ───────────────────────────────────────────────────────
  fit("C3: AI edits the file via cortex-edit", async () => {
    setFetchCacheContext("cortex-ai-edit");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt:
        'Use cortex-edit to replace the word "testing" with "validating" in /documents/ai-test/notes.md. Confirm the edit.',
    });

    expect(result.success, "C3: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const editMsg = findToolMsg(messages, "cortex-edit");
    expect(editMsg, "C3: no cortex-edit tool call found").toBeTruthy();
    if (!editMsg) {
      return;
    }

    const editResult = resolveToolResult(editMsg);
    expect(editResult, "C3: no tool result").toBeTruthy();
    if (!editResult) {
      return;
    }

    expect(
      typeof editResult.replacements === "number"
        ? editResult.replacements
        : 0,
    ).toBeGreaterThanOrEqual(1);
  });

  // ── C4: Tree via AI ───────────────────────────────────────────────────────
  fit("C4: AI shows directory tree via cortex-tree", async () => {
    setFetchCacheContext("cortex-ai-tree");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt:
        "Use the cortex-tree tool (not cortex-list) to display the directory tree starting at /documents/ai-test/. I need the tree view specifically.",
    });

    expect(result.success, "C4: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const treeMsg = findToolMsg(messages, "cortex-tree");
    expect(treeMsg, "C4: no cortex-tree tool call found").toBeTruthy();
    if (!treeMsg) {
      return;
    }

    const treeResult = resolveToolResult(treeMsg);
    expect(treeResult, "C4: no tool result").toBeTruthy();
    if (!treeResult) {
      return;
    }

    expect(String(treeResult.tree ?? "")).toContain("notes.md");
  });

  // ── C5: Context awareness ─────────────────────────────────────────────────
  fit("C5: AI remembers workspace context from conversation", async () => {
    setFetchCacheContext("cortex-ai-context");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt:
        "Without using any tools, answer from memory: What file did you just create and read? What was its main topic? What edit did you make to it?",
    });

    expect(result.success, "C5: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    // Find the last AI response
    const aiMessages = messages.filter((m) => m.role === "assistant");
    const lastAi = aiMessages[aiMessages.length - 1];
    expect(lastAi, "C5: no AI response").toBeTruthy();
    if (!lastAi) {
      return;
    }

    const content = lastAi.content ?? "";
    // AI should reference the file path and the edit
    expect(
      content.includes("notes") || content.includes("ai-test"),
      "C5: AI should reference the notes file",
    ).toBe(true);
    expect(
      content.includes("validating") || content.includes("testing") || content.includes("edit"),
      "C5: AI should reference the edit made",
    ).toBe(true);
  });

  // ── C6: Delete via AI ─────────────────────────────────────────────────────
  fit("C6: AI deletes the test directory via cortex-delete", async () => {
    setFetchCacheContext("cortex-ai-delete");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt:
        "Use cortex-delete to delete /documents/ai-test/ recursively. Confirm what was deleted.",
    });

    expect(result.success, "C6: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const deleteMsg = findToolMsg(messages, "cortex-delete");
    expect(deleteMsg, "C6: no cortex-delete tool call found").toBeTruthy();
    if (!deleteMsg) {
      return;
    }

    const deleteResult = resolveToolResult(deleteMsg);
    expect(deleteResult, "C6: no tool result").toBeTruthy();
    if (!deleteResult) {
      return;
    }

    expect(
      typeof deleteResult.nodesDeleted === "number"
        ? deleteResult.nodesDeleted
        : 0,
    ).toBeGreaterThanOrEqual(1);
  });
});
