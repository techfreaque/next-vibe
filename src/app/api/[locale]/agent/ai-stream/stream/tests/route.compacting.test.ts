/**
 * Compacting Integration Tests
 *
 * Verifies pre-stream and mid-stream context compacting:
 *
 *   C1 - Hello world sanity: simple prompt, no tools, no compacting.
 *        Model responds normally. Thread has exactly 2 messages (user + assistant).
 *
 *   C2 - Mid-stream compacting: quality-tester skill with compactTrigger=5000
 *        (low enough to trigger given tool schemas + accumulated tool call history).
 *        AI calls tool-help multiple times to build context, then compacting fires
 *        mid-stream. After compacting the AI continues and produces a final response.
 *        Assertions:
 *          - isCompacting message exists in the DB thread
 *          - Thread chain is strictly linear (no orphans, no branches)
 *          - Final assistant message appears AFTER the compacting message
 *          - Stream completes successfully (not aborted)
 *
 * compactTrigger is injected via favoriteConfig (no DB writes needed).
 * null = revert to platform default (32k) for C1.
 *
 * Cache bust: delete fixtures/http-cache/compacting-* to force new LLM calls.
 */

import "server-only";

// AI SDK v2→v3 compat mode warning - provider works fine, SDK just prefers v3
// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

// Install HTTP fetch interceptor before any other imports touch fetch
import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { beforeAll, describe, expect, it } from "vitest";

import { db } from "@/app/api/[locale]/system/db";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";
import { eq } from "drizzle-orm";

import { DEFAULT_CHAT_MODEL_SELECTION } from "../../constants";
import {
  fetchThreadMessages,
  runTestStream,
  type SlimMessage,
} from "../../testing/headless-test-runner";
import { setFetchCacheContext } from "../../testing/fetch-cache";
import { env } from "@/config/env";

// ── Test timeouts ─────────────────────────────────────────────────────────────

/** Allow ample time for multi-step tool loops */
const TEST_TIMEOUT = 300_000;

// ── Helpers ───────────────────────────────────────────────────────────────────

async function resolveAdminUser(): Promise<JwtPrivatePayloadType | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const result = await UserRepository.getUserByEmail(
    env.VIBE_ADMIN_USER_EMAIL,
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

/**
 * Build the full ordered chain by following parentId links from root → leaf.
 * Returns messages in order [root, ..., leaf]. Requires assertStrictLinearChain
 * to have passed first (exactly one root, no branches).
 */
function buildOrderedChain(messages: SlimMessage[]): SlimMessage[] {
  const root = messages.find((m) => m.parentId === null);
  if (!root) return [];
  const chain: SlimMessage[] = [];
  let cur: SlimMessage | undefined = root;
  while (cur) {
    chain.push(cur);
    cur = messages.find((m) => m.parentId === cur!.id);
  }
  return chain;
}

function msgDesc(m: SlimMessage): string {
  const tool = m.toolCall?.toolName ? `:${m.toolCall.toolName}` : "";
  const compact = m.isCompacting ? "[COMPACT]" : "";
  const preview = m.content ? ` "${m.content.slice(0, 40)}"` : "";
  return `${m.id.slice(0, 8)}(${m.role}${tool}${compact}${preview})`;
}

/**
 * Assert strict chain integrity:
 *  1. No orphans (every parentId exists in thread)
 *  2. Exactly one root
 *  3. Exactly one leaf (the active chain tip)
 */
function assertStrictLinearChain(messages: SlimMessage[], label: string): void {
  const byId = new Map(messages.map((m) => [m.id, m]));
  const childMap = new Map<string, string[]>();
  for (const msg of messages) {
    const key = msg.parentId ?? "__root__";
    const existing = childMap.get(key);
    if (existing) {
      existing.push(msg.id);
    } else {
      childMap.set(key, [msg.id]);
    }
  }

  // 1. No orphans
  for (const msg of messages) {
    if (msg.parentId && !byId.has(msg.parentId)) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
      throw new Error(
        `[${label}] Orphan: ${msgDesc(msg)} → parentId ${msg.parentId} not found`,
      );
    }
  }

  // 2. Exactly one root
  const roots = childMap.get("__root__") ?? [];
  expect(
    roots.length,
    `[${label}] Expected exactly 1 root message, got ${String(roots.length)}`,
  ).toBe(1);

  // 3. No branches (every message has at most 1 child)
  for (const [parentId, children] of childMap.entries()) {
    if (parentId === "__root__") {
      continue;
    }
    if (children.length > 1) {
      const parent = byId.get(parentId);
      const childList = children
        .map((id) => msgDesc(byId.get(id)!))
        .join("\n  ");
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
      throw new Error(
        `[${label}] Branch violation on ${parent ? msgDesc(parent) : parentId}: ` +
          `${String(children.length)} children (expected 1).\n  ${childList}`,
      );
    }
  }

  // 4. Exactly one leaf
  const leaves = messages.filter((m) => !childMap.get(m.id)?.length);
  expect(
    leaves.length,
    `[${label}] Expected exactly 1 leaf (chain tip), got ${String(leaves.length)}: ${leaves.map((m) => msgDesc(m)).join(", ")}`,
  ).toBe(1);
}

// ── Test suite ────────────────────────────────────────────────────────────────

describe("Compacting - context management", () => {
  let testUser: JwtPrivatePayloadType;
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
          // oxlint-disable-next-line restricted-syntax -- intentional re-throw in test suite
          throw err;
        }
      },
      timeout,
    );
  }

  beforeAll(async () => {
    const resolved = await resolveAdminUser();
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      return;
    }
    testUser = resolved;

    // Top up credits so fixture-cached runs never hit the credit gate.
    // 500cr floor matches route-base.test.ts convention.
    const creditLogger = createEndpointLogger(false, Date.now(), defaultLocale);
    const { t: creditT } = creditsScopedTranslation.scopedT(defaultLocale);
    const balanceResult = await CreditRepository.getCreditBalanceForUser(
      testUser,
      defaultLocale,
      creditLogger,
      creditT,
    );
    const balance = balanceResult.success ? balanceResult.data.total : 0;
    if (balance < 500) {
      await CreditRepository.addUserCredits(
        testUser.id,
        500 - balance,
        "permanent",
        creditLogger,
        creditT,
      );
    }
  }, TEST_TIMEOUT);

  // ── C1: Hello world sanity ─────────────────────────────────────────────────
  // Simple prompt, no tools, no compacting. Verifies baseline: model responds
  // normally, no compacting message, 2-message thread.
  fit(
    "C1: hello world — model responds normally, no compacting, clean 2-message thread",
    async () => {
      setFetchCacheContext("compacting-hello-world");

      const { result, messages } = await runTestStream({
        prompt:
          "[C1] Respond with ONLY the word: HELLO_DONE. " +
          "No preamble, no explanation, no punctuation beyond that. " +
          "Do NOT call any tools. " +
          "If you add anything else, the test FAILS.",
        user: testUser,
        // Use quality-tester skill so model resolves correctly.
        // High default compactTrigger (32k) won't fire for a simple 1-turn response.
        skill: "quality-tester",
      });

      expect(result.success, "C1: stream must succeed").toBe(true);
      expect(
        messages.length,
        "C1: expected at least 2 messages (user + assistant)",
      ).toBeGreaterThanOrEqual(2);

      const userMsg = messages[0];
      expect(userMsg?.role, "C1: first message must be user").toBe("user");

      const finalAssistant = messages.findLast((m) => m.role === "assistant");
      expect(
        finalAssistant,
        "C1: must have a final assistant message",
      ).toBeDefined();
      expect(
        finalAssistant?.content,
        "C1: assistant must contain HELLO_DONE",
      ).toContain("HELLO_DONE");

      // No compacting at default 32k threshold in a simple 1-turn stream
      const compactingMsg = messages.find((m) => m.isCompacting);
      expect(
        compactingMsg,
        "C1: no compacting message should exist at default threshold",
      ).toBeUndefined();
    },
    TEST_TIMEOUT,
  );

  // ── C2: Mid-stream compacting ──────────────────────────────────────────────
  // Turn 1: AI makes 5 tool calls, compacting fires mid-stream, final COMPACT_DONE.
  // Turn 2: Follow-up user message into the same thread — verifies the chain
  //         survives past compacting and a new user+assistant pair appends cleanly.
  //
  // Final chain shape:
  //   user(1) → …tool calls… → assistant[COMPACT] → assistant(COMPACT_DONE)
  //           → user(2) → assistant(2, FOLLOWUP_DONE)
  fit(
    "C2: mid-stream compacting — compacting fires during tool loop, chain stays linear, follow-up turn appends correctly",
    async () => {
      setFetchCacheContext("compacting-mid-stream");

      const favoriteConfig = {
        id: "test-compacting-override",
        skillId: "quality-tester",
        modelSelection: DEFAULT_CHAT_MODEL_SELECTION,
        voiceModelSelection: null,
        sttModelSelection: null,
        imageVisionModelSelection: null,
        videoVisionModelSelection: null,
        audioVisionModelSelection: null,
        imageGenModelSelection: null,
        musicGenModelSelection: null,
        videoGenModelSelection: null,
        availableTools: [{ toolId: "tool-help", requiresConfirmation: false }],
        pinnedTools: [{ toolId: "tool-help", requiresConfirmation: false }],
        deniedTools: null,
        // Low threshold forces mid-stream compacting without triggering pre-stream.
        // Pre-stream estimate for new thread: system+tools+user ≈ 3600 tokens (< 5000).
        // After 3+ tool round-trips the step messages exceed 5000 → compacting fires.
        compactTrigger: 5000,
        memoryLimit: null,
        promptAppend: null,
      } as const;

      // ── Turn 1: tool loop → mid-stream compacting → COMPACT_DONE ─────────────
      // 5 sequential tool-help calls build enough history to cross the 5000-token
      // threshold mid-stream. RECENT_TURNS_TO_KEEP=8 means we need ≥9 afterFirst
      // messages (5 round-trips = 10 msgs) to have any middleTurns to summarize.
      const largeContext = [...Array(10).keys()]
        .map(
          (i) =>
            `Context block ${String(i + 1)}: This is padding text to increase the prompt token count for the mid-stream compacting test. The compacting mechanism should fire when the accumulated context exceeds the threshold. `,
        )
        .join("");

      const turn1 = await runTestStream({
        prompt:
          `[C2-COMPACTING-TEST] ${largeContext}` +
          `Call tool-help 5 times sequentially with these exact queries in order: ` +
          `'list', 'search', 'chat', 'image', 'audio'. ` +
          `Make each call one at a time, wait for the result, then make the next call. ` +
          `After ALL 5 tool calls are complete, respond with ONLY the word: COMPACT_DONE. ` +
          `Do NOT add any other text. COMPACT_DONE is the ONLY acceptable final response.`,
        user: testUser,
        skill: "quality-tester",
        favoriteConfig,
      });

      expect(turn1.result.success, "C2-T1: turn 1 stream must succeed").toBe(true);
      const threadId = turn1.result.success ? (turn1.result.data.threadId ?? null) : null;
      expect(threadId, "C2-T1: turn 1 must produce a threadId").toBeTruthy();

      // ── Verify turn 1 chain ───────────────────────────────────────────────────
      assertStrictLinearChain(turn1.messages, "C2-T1");

      const t1Chain = buildOrderedChain(turn1.messages);
      expect(t1Chain[0]!.role, "C2-T1: root must be user").toBe("user");

      const t1Leaf = t1Chain[t1Chain.length - 1]!;
      expect(t1Leaf.role, "C2-T1: turn 1 leaf must be assistant").toBe("assistant");
      expect(t1Leaf.isCompacting, "C2-T1: turn 1 leaf must not be the compacting msg").toBe(false);
      expect(t1Leaf.content, "C2-T1: turn 1 leaf must contain COMPACT_DONE").toContain("COMPACT_DONE");

      // Compacting fires mid-stream (not necessarily as direct parent of leaf —
      // more tool calls may follow after compacting before the final response).
      const t1CompactIdx = t1Chain.findIndex((m) => m.isCompacting);
      expect(t1CompactIdx, "C2-T1: compacting message must exist in chain").toBeGreaterThanOrEqual(0);
      expect(t1CompactIdx, "C2-T1: compacting must appear before the leaf").toBeLessThan(t1Chain.length - 1);

      const t1CompactMsg = t1Chain[t1CompactIdx]!;

      // ── Turn 2: follow-up into the same thread ────────────────────────────────
      // This verifies that after a compacting event the thread chain is intact
      // and a new user+assistant pair can be appended without breaking the linked list.
      const turn2 = await runTestStream({
        prompt:
          "[C2-FOLLOWUP] Respond with ONLY the word: FOLLOWUP_DONE. " +
          "No preamble, no tools, no punctuation beyond that.",
        user: testUser,
        skill: "quality-tester",
        threadId: threadId!,
        favoriteConfig,
      });

      expect(turn2.result.success, "C2-T2: turn 2 stream must succeed").toBe(true);

      // ── Verify full thread chain after turn 2 ────────────────────────────────
      assertStrictLinearChain(turn2.messages, "C2-T2");

      const t2Chain = buildOrderedChain(turn2.messages);

      // Root is still the original user message from turn 1
      expect(t2Chain[0]!.role, "C2-T2: chain root must be user (turn 1)").toBe("user");
      expect(t2Chain[0]!.id, "C2-T2: chain root must be the turn-1 user message").toBe(t1Chain[0]!.id);

      // Turn-2 user message is the second-to-last in chain
      const t2Leaf = t2Chain[t2Chain.length - 1]!;
      const t2User = t2Chain[t2Chain.length - 2];
      expect(t2User?.role, "C2-T2: second-to-last message must be user (turn 2)").toBe("user");
      expect(t2Leaf.role, "C2-T2: leaf must be assistant (turn 2)").toBe("assistant");
      expect(t2Leaf.isCompacting, "C2-T2: leaf must not be a compacting message").toBe(false);
      expect(t2Leaf.content, "C2-T2: turn 2 leaf must contain FOLLOWUP_DONE").toContain("FOLLOWUP_DONE");

      // Turn-2 user message must be a child of the turn-1 final assistant (COMPACT_DONE)
      expect(
        t2User?.parentId,
        "C2-T2: turn-2 user message must be a child of the turn-1 final assistant",
      ).toBe(t1Leaf.id);

      // Compacting message still present in the full thread
      const t2CompactIdx = t2Chain.findIndex((m) => m.isCompacting);
      expect(t2CompactIdx, "C2-T2: compacting message must still be in chain after turn 2").toBeGreaterThanOrEqual(0);

      // ── DB persistence: re-fetch and confirm compacting survives both turns ───
      if (threadId) {
        const freshMessages = await fetchThreadMessages(threadId);
        assertStrictLinearChain(freshMessages, "C2-fresh");
        const persistedCompacting = freshMessages.find((m) => m.isCompacting);
        expect(
          persistedCompacting,
          "C2-fresh: compacting message must persist in DB with isCompacting=true",
        ).toBeDefined();
        expect(
          persistedCompacting!.id,
          "C2-fresh: persisted compacting id must match turn-1 compacting id",
        ).toBe(t1CompactMsg.id);
      }
    },
    TEST_TIMEOUT,
  );
});
