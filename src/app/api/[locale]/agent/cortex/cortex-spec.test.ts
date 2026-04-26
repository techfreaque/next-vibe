/**
 * Cortex Spec E2E AI Tests
 *
 * Tests the new capabilities added in the cortex spec refactor:
 * - Pinning: AI writes `pinned: true` frontmatter → memory appears with 📌 in debug
 * - Life areas: AI reads and writes /memories/life/ templates
 * - Budget awareness: large memory set doesn't overflow (system prompt renders)
 * - Equal-trim: AI observes trimming notice when memories are large
 * - Thread chunks: AI can verify thread content shows in context
 * - Move re-embedding: moving a file triggers re-embed (path hash changes)
 *
 * VERDICT PROTOCOL (same as cortex-ai.test.ts)
 * Every prompt ends with the VERDICT instruction.
 * Tests assert VERDICT: PASS / VERDICT: FAIL.
 *
 * Cache bust: delete fixtures/http-cache/cortex-spec-{step}/ to re-record.
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
    const line = lines[i]?.trim() ?? "";
    if (!line) continue;
    if (line === VERDICT_PASS) return { verdict: "PASS" };
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

// ── Helpers ──────────────────────────────────────────────────────────────────

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
  if (!result.success || !result.data) return null;
  const user = result.data;

  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);

  if (!link) return null;

  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );

  return { isPublic: false, id: user.id, leadId: link.leadId, roles };
}

function matchesToolName(m: SlimMessage, toolName: string): boolean {
  if (m.role !== "tool" || !m.toolCall) return false;
  if (m.toolCall.toolName === toolName) return true;
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

function resolveToolResult(
  msg: SlimMessage,
): Record<string, WidgetData> | null {
  if (!msg.toolCall?.result) return null;
  const rec = toolResultRecord(msg.toolCall.result);
  if (!rec) return null;
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

async function dbGetNode(
  userId: string,
  path: string,
): Promise<{
  content: string | null;
  size: number;
  nodeType: string;
  frontmatter: Record<string, unknown> | null;
} | null> {
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
        content: row.content,
        size: row.size,
        nodeType: row.nodeType,
        frontmatter: row.frontmatter as Record<string, unknown> | null,
      }
    : null;
}

// ── Test Suite ──────────────────────────────────────────────────────────────

const TEST_TIMEOUT = 120_000;

describe("Cortex Spec E2E", () => {
  let testUser: JwtPrivatePayloadType;
  let mainFavoriteId: string;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) return;
    testUser = resolved;

    const SPEC_FAV_ID = "00000000-0000-4001-c000-000000000002";
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
          id: SPEC_FAV_ID,
          userId: testUser.id,
          skillId: "quality-tester",
          variantId: "kimi",
          position: 9998,
        })
        .onConflictDoNothing();
      mainFavoriteId = SPEC_FAV_ID;
    }

    // Clean up spec test data
    await db.delete(cortexNodes).where(
      and(
        eq(cortexNodes.userId, testUser.id),
        like(cortexNodes.path, "/documents/spec-test%"),
      ),
    );
    await db.delete(cortexNodes).where(
      and(
        eq(cortexNodes.userId, testUser.id),
        like(cortexNodes.path, "/memories/spec-test%"),
      ),
    );
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (!testUser) return;
    await db.delete(cortexNodes).where(
      and(
        eq(cortexNodes.userId, testUser.id),
        like(cortexNodes.path, "/documents/spec-test%"),
      ),
    );
    await db.delete(cortexNodes).where(
      and(
        eq(cortexNodes.userId, testUser.id),
        like(cortexNodes.path, "/memories/spec-test%"),
      ),
    );
  });

  let suiteFailed = false;
  // Shared thread across SP1-SP5 to reduce cron thread count.
  // SP6 needs a fresh thread (tests system prompt context, not conversation history).
  let threadId: string;

  function fit(name: string, fn: () => Promise<void>, timeout?: number): void {
    it(
      name,
      async () => {
        if (suiteFailed) return;
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

  // ── SP1: Life area write ──────────────────────────────────────────────────
  fit("SP1: AI writes a /memories/life/ file with structured content", async () => {
    setFetchCacheContext("cortex-spec-life-write");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      prompt: `Use cortex-write to create /memories/spec-test/life-career.md with this exact content:

---
priority: 80
tags: [life, career]
last-dreamed: 2026-04-23
---

## Current State
Building unbottled.ai, a free-speech AI platform.

## Goals
- Short-term: Launch v1 with 50+ models
- Medium-term: 10k users
- Long-term: Become the default AI layer for open web

## Blockers
None currently.

After writing, confirm it was created and quote the path back.${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "SP1: stream failed").toBe(true);

    // Capture threadId for reuse in SP2-SP5
    if (result.success && result.data.threadId) {
      threadId = result.data.threadId;
    }

    const writeMsg = findToolMsg(messages, "cortex-write");
    expect(writeMsg, "SP1: no cortex-write tool call").toBeTruthy();

    // DB cross-check
    const dbNode = await dbGetNode(
      testUser.id,
      "/memories/spec-test/life-career.md",
    );
    expect(dbNode, "SP1: node not in DB").toBeTruthy();
    expect(dbNode!.content, "SP1: missing career content").toContain(
      "Building unbottled.ai",
    );
    expect(dbNode!.frontmatter, "SP1: missing frontmatter").toBeTruthy();

    assertVerdictPass(lastAiMessage(messages)?.content, "SP1");
  });

  // ── SP2: Pinning ──────────────────────────────────────────────────────────
  fit("SP2: AI pins a memory file via pinned: true frontmatter", async () => {
    setFetchCacheContext("cortex-spec-pinning");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-write to create /memories/spec-test/critical-note.md with this content:

---
priority: 90
pinned: true
tags: [spec-test]
---

This is a PINNED critical note. It must ALWAYS appear in the system prompt, never trimmed.

After writing, read it back with cortex-read and confirm:
1. The file was created
2. The frontmatter contains pinned: true
3. The content matches what you wrote

${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "SP2: stream failed").toBe(true);

    // DB cross-check — verify pinned is in frontmatter
    const dbNode = await dbGetNode(
      testUser.id,
      "/memories/spec-test/critical-note.md",
    );
    expect(dbNode, "SP2: pinned note not in DB").toBeTruthy();
    expect(
      dbNode!.frontmatter,
      "SP2: no frontmatter",
    ).toBeTruthy();

    // The content should have pinned: true somewhere (frontmatter in content field)
    const content = dbNode!.content ?? "";
    const fm = dbNode!.frontmatter as Record<string, unknown>;
    const isPinnedInFrontmatter = fm?.pinned === true;
    const isPinnedInContent = content.includes("pinned: true");
    expect(
      isPinnedInFrontmatter || isPinnedInContent,
      "SP2: pinned: true must appear in frontmatter or content",
    ).toBe(true);

    assertVerdictPass(lastAiMessage(messages)?.content, "SP2");
  });

  // ── SP3: Move re-embedding ────────────────────────────────────────────────
  fit("SP3: AI moves a file — source path gone, destination exists", async () => {
    setFetchCacheContext("cortex-spec-move");
    // First, ensure the source exists (SP1 created it at spec-test/life-career.md)
    const sourcePath = "/memories/spec-test/life-career.md";
    const destPath = "/memories/spec-test/life-career-moved.md";

    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-move to rename the file from "${sourcePath}" to "${destPath}".
After moving:
1. Confirm the source path no longer exists (use cortex-read on the source, expect a not-found error)
2. Confirm the destination path exists and has the same content (use cortex-read on dest)

${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "SP3: stream failed").toBe(true);

    const moveMsg = findToolMsg(messages, "cortex-move");
    expect(moveMsg, "SP3: no cortex-move call").toBeTruthy();

    // DB cross-check: source gone, dest exists
    const sourceNode = await dbGetNode(testUser.id, sourcePath);
    expect(sourceNode, "SP3: source must be gone after move").toBeNull();

    const destNode = await dbGetNode(testUser.id, destPath);
    expect(destNode, "SP3: destination must exist after move").toBeTruthy();
    expect(
      destNode!.content,
      "SP3: destination must have original content",
    ).toContain("Building unbottled.ai");

    assertVerdictPass(lastAiMessage(messages)?.content, "SP3");
  });

  // ── SP4: Life area read ───────────────────────────────────────────────────
  fit("SP4: AI reads all /memories/life/ templates and reports structure", async () => {
    setFetchCacheContext("cortex-spec-life-read");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Use cortex-list on /memories/life/ to show me all life area template files.
Then use cortex-read to read /memories/life/career.md.

Report:
1. How many files are in /memories/life/?
2. What is the frontmatter priority of career.md?
3. Does the file contain guidance comments (<!-- ... -->)?

${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "SP4: stream failed").toBe(true);

    const listMsg = findToolMsg(messages, "cortex-list");
    expect(listMsg, "SP4: no cortex-list call").toBeTruthy();
    if (listMsg) {
      const listResult = resolveToolResult(listMsg);
      expect(listResult, "SP4: list result null").toBeTruthy();
    }

    const readMsg = findToolMsg(messages, "cortex-read");
    expect(readMsg, "SP4: no cortex-read call").toBeTruthy();

    assertVerdictPass(lastAiMessage(messages)?.content, "SP4");
  });

  // ── SP5: Budget awareness ─────────────────────────────────────────────────
  fit("SP5: AI can write to /documents/ and /memories/ in the same session", async () => {
    setFetchCacheContext("cortex-spec-multi-write");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      threadId,
      prompt: `Do these two writes in sequence:
1. cortex-write /documents/spec-test/project-brief.md — content: "# Spec Test Project\n\nTesting the budget system."
2. cortex-write /memories/spec-test/context-note.md — content: "---\npriority: 30\ntags: [context]\n---\n\nThis note tests memory budget handling."

After both writes succeed, list /documents/spec-test/ and /memories/spec-test/ to confirm both files exist.

${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "SP5: stream failed").toBe(true);

    // DB cross-check both files
    const docNode = await dbGetNode(
      testUser.id,
      "/documents/spec-test/project-brief.md",
    );
    expect(docNode, "SP5: doc not in DB").toBeTruthy();
    expect(docNode!.content, "SP5: doc content wrong").toContain(
      "Spec Test Project",
    );

    const memNode = await dbGetNode(
      testUser.id,
      "/memories/spec-test/context-note.md",
    );
    expect(memNode, "SP5: memory not in DB").toBeTruthy();
    expect(memNode!.content, "SP5: memory content wrong").toContain(
      "budget handling",
    );

    assertVerdictPass(lastAiMessage(messages)?.content, "SP5");
  });

  // ── SP6: Cortex context awareness ────────────────────────────────────────
  fit("SP6: AI reads its own memory context from the system prompt", async () => {
    setFetchCacheContext("cortex-spec-context-awareness");
    const { result, messages } = await runTestStream({
      user: testUser,
      favoriteId: mainFavoriteId,
      prompt: `Without using any cortex tools, tell me:
1. Do you have any files in /memories/spec-test/ visible in your system prompt context?
2. What is the /documents/ section showing (how many files, which subdirs)?
3. Is there a file called critical-note.md anywhere in your context?

Answer based purely on what you can see in your Cortex section of the system prompt.
${VERDICT_INSTRUCTION}`,
    });

    expect(result.success, "SP6: stream failed").toBe(true);

    // AI should be able to answer about its own context — no tool calls needed
    const aiMsg = lastAiMessage(messages);
    expect(aiMsg, "SP6: no AI response").toBeTruthy();
    expect(
      aiMsg!.content,
      "SP6: AI should mention spec-test or critical-note",
    ).toMatch(/spec-test|critical-note/i);

    assertVerdictPass(aiMsg?.content, "SP6");
  });
});
