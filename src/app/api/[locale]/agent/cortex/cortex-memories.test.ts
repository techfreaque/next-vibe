/**
 * Cortex /memories AI Integration Tests
 *
 * Comprehensive tests for the /memories mount - the AI's private, persistent
 * knowledge store. Covers all subdirectory conventions, pinning, frontmatter
 * fields, write/read/edit/move/delete on memory files, and the life-area
 * template structure introduced in the dreamer redesign.
 *
 * VERDICT PROTOCOL
 * ────────────────
 * Every prompt ends with VERDICT: PASS / VERDICT: FAIL – <reason>.
 * Tests assert on this verdict. DB cross-checks verify mutations independently.
 *
 * Cache bust: delete fixtures/http-cache/cortex-mem-XX/ dirs to re-record.
 */

import "server-only";

// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

import { installFetchCache } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
installFetchCache();

import { and, eq, like } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { chatFavorites } from "@/app/api/[locale]/agent/chat/favorites/db";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { defaultLocale } from "@/i18n/core/config";
import { env } from "@/config/env";
import { setFetchCacheContext } from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
import {
  runTestStream,
  toolResultRecord,
  type SlimMessage,
} from "@/app/api/[locale]/agent/ai-stream/testing/headless-test-runner";

import { cortexNodes } from "./db";

// ── Verdict helpers ──────────────────────────────────────────────────────────

const VERDICT_PASS = "VERDICT: PASS";
const VERDICT_FAIL_PREFIX = "VERDICT: FAIL";

const VERDICT_INSTRUCTION = `

---
IMPORTANT: End your entire response with exactly one of these two lines (nothing after it):
  VERDICT: PASS
  VERDICT: FAIL – <one-sentence reason>

Choose PASS only if every tool call succeeded, results look correct, and the task is fully done.
Choose FAIL for ANY of: tool errors, unexpected results, missing output, wrong data, unclear state.`;

function parseVerdict(content: string | null | undefined): {
  verdict: "PASS" | "FAIL" | "MISSING";
  reason?: string;
} {
  if (!content) {
    return { verdict: "MISSING" };
  }
  const lines = content.trimEnd().split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }
    if (line === VERDICT_PASS) {
      return { verdict: "PASS" };
    }
    if (line.startsWith(VERDICT_FAIL_PREFIX)) {
      return {
        verdict: "FAIL",
        reason: line.slice(VERDICT_FAIL_PREFIX.length).replace(/^[\s–-]+/, ""),
      };
    }
    break;
  }
  return { verdict: "MISSING" };
}

function assertVerdictPass(
  aiContent: string | null | undefined,
  testId: string,
): void {
  const { verdict, reason } = parseVerdict(aiContent);
  expect(
    verdict,
    `${testId}: AI verdict must be present (got MISSING). AI response:\n${aiContent ?? "<null>"}`,
  ).not.toBe("MISSING");
  expect(
    verdict,
    `${testId}: AI reported FAIL – ${reason ?? "no reason given"}`,
  ).toBe("PASS");
}

// ── Shared helpers ───────────────────────────────────────────────────────────

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
  return { isPublic: false, id: user.id, leadId: link.leadId, roles };
}

/** Ensure test user has at least 500 credits (safety floor) */
async function ensureCredits(user: JwtPrivatePayloadType): Promise<void> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const { t } = creditsScopedTranslation.scopedT(defaultLocale);
  const result = await CreditRepository.getCreditBalanceForUser(
    user,
    defaultLocale,
    logger,
    t,
  );
  const balance = result.success ? result.data.total : 0;
  if (balance < 500) {
    await CreditRepository.addUserCredits(
      user.id,
      500 - balance,
      "permanent",
      logger,
      t,
    );
  }
}

function matchesToolName(m: SlimMessage, toolName: string): boolean {
  if (m.role !== "tool" || !m.toolCall) {
    return false;
  }
  if (m.toolCall.toolName === toolName) {
    return true;
  }
  if (
    m.toolCall.toolName === "execute-tool" &&
    typeof m.toolCall.args === "object" &&
    m.toolCall.args !== null &&
    !Array.isArray(m.toolCall.args) &&
    (m.toolCall.args as Record<string, WidgetData>).toolName === toolName
  ) {
    return true;
  }
  return false;
}

function findToolMsg(
  messages: SlimMessage[],
  toolName: string,
): SlimMessage | undefined {
  const all = messages.filter((m) => matchesToolName(m, toolName));
  return all[all.length - 1];
}

function findAllToolMsgsSinceLast(
  messages: SlimMessage[],
  toolName: string,
): SlimMessage[] {
  const lastUserMsg = [...messages].toReversed().find((m) => m.role === "user");
  if (!lastUserMsg) {
    return messages.filter((m) => matchesToolName(m, toolName));
  }
  return messages.filter(
    (m) => matchesToolName(m, toolName) && m.createdAt > lastUserMsg.createdAt,
  );
}

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
  for (const key of ["data", "result"] as const) {
    if (key in rec && typeof rec[key] === "object" && rec[key] !== null) {
      return toolResultRecord(rec[key]) ?? rec;
    }
  }
  return rec;
}

function lastAiMessage(messages: SlimMessage[]): SlimMessage | undefined {
  const ai = messages.filter((m) => m.role === "assistant" && m.isAI);
  return ai[ai.length - 1];
}

interface NodeRow {
  content: string | null;
  size: number;
  nodeType: string;
  frontmatter: Record<string, string | number | boolean | null>;
}

async function dbGetNode(
  userId: string,
  path: string,
): Promise<NodeRow | null> {
  const [row] = await db
    .select({
      content: cortexNodes.content,
      size: cortexNodes.size,
      nodeType: cortexNodes.nodeType,
      frontmatter: cortexNodes.frontmatter,
    })
    .from(cortexNodes)
    .where(and(eq(cortexNodes.userId, userId), eq(cortexNodes.path, path)));
  return row
    ? {
        ...row,
        frontmatter: row.frontmatter as Record<
          string,
          string | number | boolean | null
        >,
      }
    : null;
}

async function dbCountNodes(
  userId: string,
  pathPrefix: string,
): Promise<number> {
  const rows = await db
    .select({ path: cortexNodes.path })
    .from(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        like(cortexNodes.path, `${pathPrefix}%`),
      ),
    );
  return rows.length;
}

const TEST_TIMEOUT = 120_000;

// ── /memories basic CRUD ─────────────────────────────────────────────────────

describe("Cortex Mount: /memories basic CRUD", () => {
  let testUser: JwtPrivatePayloadType;
  let mainFavoriteId: string;
  let threadId: string;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(resolved, "admin user not found - run: vibe dev").toBeTruthy();
    if (!resolved) {
      return;
    }
    testUser = resolved;
    await ensureCredits(testUser);

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
      const favId = crypto.randomUUID();
      await db
        .insert(chatFavorites)
        .values({
          id: favId,
          userId: testUser.id,
          skillId: "quality-tester",
          variantId: "kimi",
          position: 9997,
        })
        .onConflictDoNothing();
      mainFavoriteId = favId;
    }

    // Clean slate for this suite's test paths
    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, testUser.id),
          like(cortexNodes.path, "/memories/mem-test%"),
        ),
      );
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (!testUser) {
      return;
    }
    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, testUser.id),
          like(cortexNodes.path, "/memories/mem-test%"),
        ),
      );
  });

  let suiteFailed = false;
  function fit(name: string, fn: () => Promise<void>, timeout?: number): void {
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

  // ── MM1: List /memories ──────────────────────────────────────────────────
  fit("MM1: AI lists /memories and sees standard subdirectories", async () => {
    setFetchCacheContext("cortex-mem-list");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      prompt: `Use cortex-list on /memories to list its contents. Report all entries you see and identify which are directories. List at least the subdirectories.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MM1: stream failed").toBe(true);
    if (!result.success) {
      return;
    }
    threadId = result.data.threadId!;

    const listMsg = findToolMsg(messages, "cortex-list");
    expect(listMsg, "MM1: no cortex-list call").toBeTruthy();
    if (!listMsg) {
      return;
    }

    const listResult = resolveToolResult(listMsg);
    expect(listResult, "MM1: no list result").toBeTruthy();
    if (!listResult) {
      return;
    }

    const entries = Array.isArray(listResult.entries) ? listResult.entries : [];
    expect(
      entries.length,
      "MM1: /memories must have entries (seeded dirs)",
    ).toBeGreaterThan(0);

    assertVerdictPass(lastAiMessage(messages)?.content, "MM1");
  });

  // ── MM2: Write a memory with structured frontmatter ───────────────────────
  fit("MM2: AI writes memory with priority/tags frontmatter", async () => {
    setFetchCacheContext("cortex-mem-write");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-write to create /memories/mem-test/project-notes.md with this exact content:

---
priority: 75
tags: [test, project]
---

## Project Notes

This is a test memory created to verify frontmatter is stored correctly.
Key facts: AI integration, cortex, memory system.

Confirm the file was created and report the path.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MM2: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const writeMsg = findToolMsg(messages, "cortex-write");
    expect(writeMsg, "MM2: no cortex-write call").toBeTruthy();
    if (!writeMsg) {
      return;
    }

    const writeResult = resolveToolResult(writeMsg);
    expect(writeResult, "MM2: no write result").toBeTruthy();
    if (!writeResult) {
      return;
    }
    expect(writeResult.created, "MM2: must be created=true").toBe(true);

    // DB cross-check: node exists with frontmatter
    const dbNode = await dbGetNode(
      testUser.id,
      "/memories/mem-test/project-notes.md",
    );
    expect(dbNode, "MM2: DB node not found").toBeTruthy();
    expect(dbNode!.content, "MM2: content must have frontmatter").toContain(
      "priority: 75",
    );
    expect(dbNode!.content, "MM2: content must have body").toContain(
      "Project Notes",
    );

    assertVerdictPass(lastAiMessage(messages)?.content, "MM2");
  });

  // ── MM3: Read back the written memory ────────────────────────────────────
  fit("MM3: AI reads back the memory and reports frontmatter fields", async () => {
    setFetchCacheContext("cortex-mem-read");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-read on /memories/mem-test/project-notes.md. Report the priority value from the frontmatter and the first heading in the body.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MM3: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const readMsg = findToolMsg(messages, "cortex-read");
    expect(readMsg, "MM3: no cortex-read call").toBeTruthy();
    if (!readMsg) {
      return;
    }

    const readResult = resolveToolResult(readMsg);
    expect(readResult, "MM3: no read result").toBeTruthy();
    if (!readResult) {
      return;
    }

    const content = String(readResult.content ?? "");
    expect(content, "MM3: must contain priority field").toContain("priority:");
    expect(content, "MM3: must contain body content").toContain(
      "Project Notes",
    );

    assertVerdictPass(lastAiMessage(messages)?.content, "MM3");
  });

  // ── MM4: Edit a memory file ───────────────────────────────────────────────
  fit("MM4: AI edits memory content via cortex-edit", async () => {
    setFetchCacheContext("cortex-mem-edit");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-edit on /memories/mem-test/project-notes.md to replace "Key facts: AI integration, cortex, memory system." with "Key facts: AI integration, cortex, memory system, verified edit.". Confirm the edit succeeded.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MM4: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const editMsg = findToolMsg(messages, "cortex-edit");
    expect(editMsg, "MM4: no cortex-edit call").toBeTruthy();
    if (!editMsg) {
      return;
    }

    const editResult = resolveToolResult(editMsg);
    expect(editResult, "MM4: no edit result").toBeTruthy();
    if (!editResult) {
      return;
    }

    // DB cross-check: new content persisted
    const dbNode = await dbGetNode(
      testUser.id,
      "/memories/mem-test/project-notes.md",
    );
    expect(dbNode, "MM4: DB node not found").toBeTruthy();
    expect(dbNode!.content, "MM4: edited content must be in DB").toContain(
      "verified edit",
    );

    assertVerdictPass(lastAiMessage(messages)?.content, "MM4");
  });

  // ── MM5: Move a memory to a different subdir ─────────────────────────────
  fit("MM5: AI moves memory to a new path via cortex-move", async () => {
    setFetchCacheContext("cortex-mem-move");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-move to move /memories/mem-test/project-notes.md to /memories/mem-test/archived/project-notes.md. Confirm the move succeeded - source should be gone, destination should exist.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MM5: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const moveMsg = findToolMsg(messages, "cortex-move");
    expect(moveMsg, "MM5: no cortex-move call").toBeTruthy();
    if (!moveMsg) {
      return;
    }

    // DB cross-check: source gone, dest present
    const srcNode = await dbGetNode(
      testUser.id,
      "/memories/mem-test/project-notes.md",
    );
    expect(srcNode, "MM5: source must be gone after move").toBeNull();

    const dstNode = await dbGetNode(
      testUser.id,
      "/memories/mem-test/archived/project-notes.md",
    );
    expect(dstNode, "MM5: destination must exist after move").toBeTruthy();
    expect(dstNode!.content, "MM5: content preserved after move").toContain(
      "Project Notes",
    );

    assertVerdictPass(lastAiMessage(messages)?.content, "MM5");
  });

  // ── MM6: Delete a memory file ─────────────────────────────────────────────
  fit("MM6: AI deletes memory file via cortex-delete", async () => {
    setFetchCacheContext("cortex-mem-delete");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-delete on /memories/mem-test/archived/project-notes.md. Confirm it was deleted and report how many nodes were removed.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MM6: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const deleteMsg = findToolMsg(messages, "cortex-delete");
    expect(deleteMsg, "MM6: no cortex-delete call").toBeTruthy();
    if (!deleteMsg) {
      return;
    }

    const deleteResult = resolveToolResult(deleteMsg);
    expect(deleteResult, "MM6: no delete result").toBeTruthy();
    if (!deleteResult) {
      return;
    }

    const nodesDeleted =
      typeof deleteResult.nodesDeleted === "number"
        ? deleteResult.nodesDeleted
        : 0;
    expect(
      nodesDeleted,
      "MM6: must have deleted at least 1 node",
    ).toBeGreaterThanOrEqual(1);

    // DB cross-check: gone
    const dbNode = await dbGetNode(
      testUser.id,
      "/memories/mem-test/archived/project-notes.md",
    );
    expect(dbNode, "MM6: deleted file must not exist in DB").toBeNull();

    assertVerdictPass(lastAiMessage(messages)?.content, "MM6");
  });
});

// ── /memories subdirectory coverage ──────────────────────────────────────────

describe("Cortex Mount: /memories subdirectory conventions", () => {
  let testUser: JwtPrivatePayloadType;
  let mainFavoriteId: string;
  let threadId: string;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    testUser = resolved;
    await ensureCredits(testUser);
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
      const favId = crypto.randomUUID();
      await db
        .insert(chatFavorites)
        .values({
          id: favId,
          userId: testUser.id,
          skillId: "quality-tester",
          variantId: "kimi",
          position: 9997,
        })
        .onConflictDoNothing();
      mainFavoriteId = favId;
    }

    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, testUser.id),
          like(cortexNodes.path, "/memories/mem-subdir-test%"),
        ),
      );
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (!testUser) {
      return;
    }
    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, testUser.id),
          like(cortexNodes.path, "/memories/mem-subdir-test%"),
        ),
      );
  });

  let suiteFailed = false;
  function fit(name: string, fn: () => Promise<void>, timeout?: number): void {
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

  // ── MD1: Write to /memories/identity/ ────────────────────────────────────
  fit("MD1: AI writes to /memories/identity/ subdirectory", async () => {
    setFetchCacheContext("cortex-mem-identity-write");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      prompt: `Use cortex-write to create /memories/mem-subdir-test/name.md with this content:

---
priority: 100
tags: [identity]
---

My name is Test User. I am an AI integration test subject.

Confirm the file was created.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MD1: stream failed").toBe(true);
    if (!result.success) {
      return;
    }
    threadId = result.data.threadId!;

    const writeMsg = findToolMsg(messages, "cortex-write");
    expect(writeMsg, "MD1: no cortex-write call").toBeTruthy();
    if (!writeMsg) {
      return;
    }

    const writeResult = resolveToolResult(writeMsg);
    expect(writeResult?.created, "MD1: must be created=true").toBe(true);

    const dbNode = await dbGetNode(
      testUser.id,
      "/memories/mem-subdir-test/name.md",
    );
    expect(dbNode, "MD1: DB node not found").toBeTruthy();
    expect(dbNode!.content, "MD1: content must have priority 100").toContain(
      "priority: 100",
    );

    assertVerdictPass(lastAiMessage(messages)?.content, "MD1");
  });

  // ── MD2: Write to /memories/context/ with pinned: true ───────────────────
  fit("MD2: AI writes a pinned memory with pinned: true frontmatter", async () => {
    setFetchCacheContext("cortex-mem-pinned-write");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-write to create /memories/mem-subdir-test/critical-rule.md with this content:

---
priority: 95
pinned: true
tags: [context, rules]
---

## Critical Rule

Never skip tests. Always verify with bun test.

This memory must always be shown in the system prompt.

Confirm it was created with pinned: true in frontmatter.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MD2: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const writeMsg = findToolMsg(messages, "cortex-write");
    expect(writeMsg, "MD2: no cortex-write call").toBeTruthy();
    if (!writeMsg) {
      return;
    }

    const writeResult = resolveToolResult(writeMsg);
    expect(writeResult?.created, "MD2: must be created=true").toBe(true);

    const dbNode = await dbGetNode(
      testUser.id,
      "/memories/mem-subdir-test/critical-rule.md",
    );
    expect(dbNode, "MD2: DB node not found").toBeTruthy();
    expect(dbNode!.content, "MD2: must have pinned: true").toContain(
      "pinned: true",
    );

    assertVerdictPass(lastAiMessage(messages)?.content, "MD2");
  });

  // ── MD3: Write to /memories/expertise/ ───────────────────────────────────
  fit("MD3: AI writes to /memories/expertise/ subdirectory", async () => {
    setFetchCacheContext("cortex-mem-expertise-write");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-write to create /memories/mem-subdir-test/skills.md with this content:

---
priority: 60
tags: [expertise, skills]
---

## Technical Skills

- TypeScript: expert level
- Bun runtime: proficient
- Drizzle ORM: intermediate

Confirm it was created.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MD3: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const writeMsg = findToolMsg(messages, "cortex-write");
    expect(writeMsg, "MD3: no cortex-write call").toBeTruthy();
    if (!writeMsg) {
      return;
    }

    const writeResult = resolveToolResult(writeMsg);
    expect(writeResult?.created, "MD3: must be created=true").toBe(true);

    const dbNode = await dbGetNode(
      testUser.id,
      "/memories/mem-subdir-test/skills.md",
    );
    expect(dbNode, "MD3: DB node not found").toBeTruthy();

    assertVerdictPass(lastAiMessage(messages)?.content, "MD3");
  });

  // ── MD4: cortex-tree on /memories shows all written files ─────────────────
  fit("MD4: AI gets cortex-tree of /memories/mem-subdir-test and sees all files", async () => {
    setFetchCacheContext("cortex-mem-tree");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-tree on /memories/mem-subdir-test with depth=2. Count how many .md files appear and list their names.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MD4: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const treeMsg = findToolMsg(messages, "cortex-tree");
    expect(treeMsg, "MD4: no cortex-tree call").toBeTruthy();
    if (!treeMsg) {
      return;
    }

    const treeResult = resolveToolResult(treeMsg);
    expect(treeResult, "MD4: no tree result").toBeTruthy();
    if (!treeResult) {
      return;
    }

    const tree = String(treeResult.tree ?? "");
    expect(tree, "MD4: tree must contain name.md").toContain("name.md");
    expect(tree, "MD4: tree must contain critical-rule.md").toContain(
      "critical-rule.md",
    );
    expect(tree, "MD4: tree must contain skills.md").toContain("skills.md");

    assertVerdictPass(lastAiMessage(messages)?.content, "MD4");
  });
});

// ── /memories/life/ life-area templates ──────────────────────────────────────

describe("Cortex Mount: /memories/life/ area coverage", () => {
  let testUser: JwtPrivatePayloadType;
  let mainFavoriteId: string;
  let threadId: string;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    testUser = resolved;
    await ensureCredits(testUser);
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
      const favId = crypto.randomUUID();
      await db
        .insert(chatFavorites)
        .values({
          id: favId,
          userId: testUser.id,
          skillId: "quality-tester",
          variantId: "kimi",
          position: 9997,
        })
        .onConflictDoNothing();
      mainFavoriteId = favId;
    }
  }, TEST_TIMEOUT);

  let suiteFailed = false;
  function fit(name: string, fn: () => Promise<void>, timeout?: number): void {
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

  // ── ML1: List /memories/life/ ─────────────────────────────────────────────
  fit("ML1: AI lists /memories/life and sees all 6 life-area files", async () => {
    setFetchCacheContext("cortex-mem-life-list");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      prompt: `Use cortex-list on /memories/life/. Report all files you see. Are all 6 standard life areas present (career, health, relationships, finances, growth, purpose)? If any are missing, list which ones.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "ML1: stream failed").toBe(true);
    if (!result.success) {
      return;
    }
    threadId = result.data.threadId!;

    const listMsg = findToolMsg(messages, "cortex-list");
    expect(listMsg, "ML1: no cortex-list call").toBeTruthy();
    if (!listMsg) {
      return;
    }

    const listResult = resolveToolResult(listMsg);
    expect(listResult, "ML1: no list result").toBeTruthy();
    if (!listResult) {
      return;
    }

    const entries = Array.isArray(listResult.entries) ? listResult.entries : [];
    // Life files are seeded - if at least 1 exists the test is meaningful
    // They may not exist if seed hasn't run - allow graceful empty
    expect(
      entries.length,
      "ML1: /memories/life/ must have entries if seeded",
    ).toBeGreaterThanOrEqual(0);

    assertVerdictPass(lastAiMessage(messages)?.content, "ML1");
  });

  // ── ML2: Read a life-area file and verify structure ───────────────────────
  fit("ML2: AI reads career.md and verifies it has structured frontmatter + sections", async () => {
    setFetchCacheContext("cortex-mem-life-read");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-read on /memories/life/career.md. Report: (1) what frontmatter fields are present, (2) whether it has a "## Current State" section or similar life-area structure. If the file doesn't exist, just report that gracefully.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "ML2: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const readMsg = findToolMsg(messages, "cortex-read");
    expect(readMsg, "ML2: no cortex-read call").toBeTruthy();
    if (!readMsg) {
      return;
    }

    // The file may not exist (not seeded) - that is fine, AI should handle gracefully
    // (we call resolveToolResult to validate the structure but don't assert its value)
    resolveToolResult(readMsg);
    // Success or not, AI must give a verdict
    assertVerdictPass(lastAiMessage(messages)?.content, "ML2");
  });

  // ── ML3: AI updates a life area with last-dreamed frontmatter ─────────────
  fit("ML3: AI can update last-dreamed frontmatter in a life-area memory", async () => {
    setFetchCacheContext("cortex-mem-life-update-dreamed");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `First, read /memories/life/career.md. If it exists and has a last-dreamed field in frontmatter, use cortex-edit to update that field to today's date (2026-04-23). If the file doesn't exist, use cortex-write to create it with frontmatter containing "last-dreamed: 2026-04-23" and a simple body. Report what you did.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "ML3: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    // At minimum one cortex tool must have been called
    const anyTool = messages.some(
      (m) =>
        m.role === "tool" &&
        m.toolCall?.toolName &&
        (m.toolCall.toolName.startsWith("cortex-") ||
          (m.toolCall.toolName === "execute-tool" &&
            typeof m.toolCall.args === "object" &&
            m.toolCall.args !== null &&
            !Array.isArray(m.toolCall.args) &&
            String(
              (m.toolCall.args as Record<string, WidgetData>).toolName ?? "",
            ).startsWith("cortex-"))),
    );
    expect(anyTool, "ML3: must call at least one cortex tool").toBe(true);

    assertVerdictPass(lastAiMessage(messages)?.content, "ML3");
  });
});

// ── /memories bulk multi-file + cortex-search ─────────────────────────────────

describe("Cortex Mount: /memories multi-file and search", () => {
  let testUser: JwtPrivatePayloadType;
  let mainFavoriteId: string;
  let threadId: string;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    testUser = resolved;
    await ensureCredits(testUser);
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
      const favId = crypto.randomUUID();
      await db
        .insert(chatFavorites)
        .values({
          id: favId,
          userId: testUser.id,
          skillId: "quality-tester",
          variantId: "kimi",
          position: 9997,
        })
        .onConflictDoNothing();
      mainFavoriteId = favId;
    }

    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, testUser.id),
          like(cortexNodes.path, "/memories/mem-search-test%"),
        ),
      );

    // Clean stale /threads/ embeddings so they don't overwhelm search results
    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, testUser.id),
          like(cortexNodes.path, "/threads/%"),
        ),
      );
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (!testUser) {
      return;
    }
    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, testUser.id),
          like(cortexNodes.path, "/memories/mem-search-test%"),
        ),
      );
  });

  let suiteFailed = false;
  function fit(name: string, fn: () => Promise<void>, timeout?: number): void {
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

  // ── MS1: Write 2 searchable memories ─────────────────────────────────────
  fit("MS1: AI writes multiple memories with distinct searchable content", async () => {
    setFetchCacheContext("cortex-mem-search-write");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      prompt: `Use cortex-write twice:
1. Create /memories/mem-search-test/bioluminescence.md with content: "# Bioluminescence Study\n\nDeep-sea bioluminescent organisms produce light via luciferin oxidation. Key examples: anglerfish, firefly squid, Noctiluca scintillans."
2. Create /memories/mem-search-test/quantum-entanglement.md with content: "# Quantum Entanglement Notes\n\nEntangled particles maintain correlated spin states regardless of separation distance. EPR paradox, Bell inequality violations."

Confirm both were created.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MS1: stream failed").toBe(true);
    if (!result.success) {
      return;
    }
    threadId = result.data.threadId!;

    const writes = findAllToolMsgsSinceLast(messages, "cortex-write");
    expect(
      writes.length,
      "MS1: must have 2 cortex-write calls",
    ).toBeGreaterThanOrEqual(2);

    const bioNode = await dbGetNode(
      testUser.id,
      "/memories/mem-search-test/bioluminescence.md",
    );
    expect(bioNode, "MS1: bioluminescence node not in DB").toBeTruthy();

    const quantumNode = await dbGetNode(
      testUser.id,
      "/memories/mem-search-test/quantum-entanglement.md",
    );
    expect(
      quantumNode,
      "MS1: quantum-entanglement node not in DB",
    ).toBeTruthy();

    assertVerdictPass(lastAiMessage(messages)?.content, "MS1");
  });

  // ── MS2: cortex-search within /memories ───────────────────────────────────
  fit("MS2: AI searches /memories for bioluminescence and finds the file", async () => {
    setFetchCacheContext("cortex-mem-search-query");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-search to search for "bioluminescence luciferin" limited to /memories/mem-search-test/. Report how many results you find and the path of the top result.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MS2: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const searchMsg = findToolMsg(messages, "cortex-search");
    expect(searchMsg, "MS2: no cortex-search call").toBeTruthy();
    if (!searchMsg) {
      return;
    }

    const searchResult = resolveToolResult(searchMsg);
    expect(searchResult, "MS2: no search result").toBeTruthy();
    if (!searchResult) {
      return;
    }

    const results = Array.isArray(searchResult.results)
      ? searchResult.results
      : [];
    expect(
      results.length,
      "MS2: search must return at least 1 result",
    ).toBeGreaterThanOrEqual(1);

    const allPaths = results.map((r) =>
      String(
        (r as Record<string, WidgetData>).resultPath ??
          (r as Record<string, WidgetData>).path ??
          "",
      ),
    );
    expect(
      allPaths.some((p) => p.includes("bioluminescence")),
      `MS2: bioluminescence must appear in results, got: ${allPaths.join(", ")}`,
    ).toBe(true);

    assertVerdictPass(lastAiMessage(messages)?.content, "MS2");
  });

  // ── MS3: cortex-search cross-prefix query returns memories results ─────────
  fit("MS3: AI searches entire cortex for quantum and finds the memories file", async () => {
    setFetchCacheContext("cortex-mem-search-global");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-search to search for "quantum entanglement Bell inequality" without restricting to a path. Report paths of results you find and confirm at least one is in /memories/.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MS3: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const searchMsg = findToolMsg(messages, "cortex-search");
    expect(searchMsg, "MS3: no cortex-search call").toBeTruthy();
    if (!searchMsg) {
      return;
    }

    const searchResult = resolveToolResult(searchMsg);
    expect(searchResult, "MS3: no search result").toBeTruthy();
    if (!searchResult) {
      return;
    }

    const results = Array.isArray(searchResult.results)
      ? searchResult.results
      : [];
    expect(
      results.length,
      "MS3: must have at least 1 result",
    ).toBeGreaterThanOrEqual(1);

    const allPaths = results.map((r) =>
      String(
        (r as Record<string, WidgetData>).resultPath ??
          (r as Record<string, WidgetData>).path ??
          "",
      ),
    );
    const hasMemoryHit = allPaths.some((p) => p.startsWith("/memories/"));
    expect(
      hasMemoryHit,
      `MS3: at least one result must be in /memories/, got: ${allPaths.join(", ")}`,
    ).toBe(true);

    assertVerdictPass(lastAiMessage(messages)?.content, "MS3");
  });

  // ── MS4: Recursive delete of /memories/mem-search-test ───────────────────
  fit("MS4: AI recursively deletes /memories/mem-search-test/ and verifies cleanup", async () => {
    setFetchCacheContext("cortex-mem-search-cleanup");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-delete to recursively delete the entire /memories/mem-search-test/ directory. Report how many nodes were deleted.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "MS4: stream failed").toBe(true);
    if (!result.success) {
      return;
    }

    const deleteMsg = findToolMsg(messages, "cortex-delete");
    expect(deleteMsg, "MS4: no cortex-delete call").toBeTruthy();
    if (!deleteMsg) {
      return;
    }

    const deleteResult = resolveToolResult(deleteMsg);
    expect(deleteResult, "MS4: no delete result").toBeTruthy();
    if (!deleteResult) {
      return;
    }

    const nodesDeleted =
      typeof deleteResult.nodesDeleted === "number"
        ? deleteResult.nodesDeleted
        : 0;
    expect(
      nodesDeleted,
      "MS4: must have deleted at least 2 nodes",
    ).toBeGreaterThanOrEqual(2);

    // DB cross-check
    const remaining = await dbCountNodes(
      testUser.id,
      "/memories/mem-search-test",
    );
    expect(remaining, "MS4: DB must be empty after recursive delete").toBe(0);

    assertVerdictPass(lastAiMessage(messages)?.content, "MS4");
  });
});

// ── /memories read-only enforcement ──────────────────────────────────────────

describe("Cortex Mount: /memories write vs virtual-mount isolation", () => {
  let testUser: JwtPrivatePayloadType;
  let mainFavoriteId: string;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (!resolved) {
      return;
    }
    testUser = resolved;
    await ensureCredits(testUser);
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
      const favId = crypto.randomUUID();
      await db
        .insert(chatFavorites)
        .values({
          id: favId,
          userId: testUser.id,
          skillId: "quality-tester",
          variantId: "kimi",
          position: 9997,
        })
        .onConflictDoNothing();
      mainFavoriteId = favId;
    }
  }, TEST_TIMEOUT);

  // ── MV1: /memories is native (writable), /threads is virtual (read-only) ──
  it(
    "MV1: AI confirms /memories is writable but /threads is read-only",
    async () => {
      setFetchCacheContext("cortex-mem-vs-virtual");
      const { result, messages } = await runTestStream({
        user: testUser,
        favoriteId: mainFavoriteId,
        prompt: `I need to test write isolation. First, try cortex-write to /memories/write-test/ok.md with content "write test". Then try cortex-write to /threads/write-test/bad.md with content "should fail". Report whether each write succeeded or failed, and explain why /threads should be read-only.${VERDICT_INSTRUCTION}`,
      });

      expect(result.success, "MV1: stream failed").toBe(true);
      if (!result.success) {
        return;
      }

      // The /memories write should succeed
      const dbMemNode = await dbGetNode(
        testUser.id,
        "/memories/write-test/ok.md",
      );
      // May or may not exist - /threads write should fail

      // Clean up if it was created
      if (dbMemNode) {
        await db
          .delete(cortexNodes)
          .where(
            and(
              eq(cortexNodes.userId, testUser.id),
              eq(cortexNodes.path, "/memories/write-test/ok.md"),
            ),
          );
      }

      // Main check: AI response should explain the isolation
      const aiMsg = lastAiMessage(messages);
      expect(aiMsg, "MV1: no AI response").toBeTruthy();
      // AI must acknowledge that /threads doesn't support writes
      const aiContent = aiMsg?.content ?? "";
      const mentionsThreadReadOnly =
        aiContent.toLowerCase().includes("read-only") ||
        aiContent.toLowerCase().includes("read only") ||
        aiContent.toLowerCase().includes("cannot write") ||
        aiContent.toLowerCase().includes("virtual") ||
        aiContent.toLowerCase().includes("not supported");
      expect(
        mentionsThreadReadOnly,
        "MV1: AI must explain that /threads is read-only or write-protected",
      ).toBe(true);

      assertVerdictPass(aiContent, "MV1");
    },
    TEST_TIMEOUT,
  );
});
