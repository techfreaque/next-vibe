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
 * Tests use the real quality-tester__kimi favorite (created in beforeAll if absent).
 * C1/C2 temporarily patch compactTrigger=5000 on the fav and restore null after.
 * This lets the user override the fav via the UI — the test only changes compactTrigger.
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

import { Platform } from "next-vibe/core/definition/platform";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { RouteExecuteRepository } from "next-vibe/execute-tool/repository";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { env } from "@/config/env";

import { setFetchCacheContext } from "../../testing/fetch-cache";
import {
  fetchThreadMessages,
  getOrCreateFolder,
  resolveUser,
  runTestStream,
  type SlimMessage,
} from "../../testing/headless-test-runner";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Temporarily set compactTrigger on a favorite. Returns an async function that
 * restores the original value (whatever was there before the patch).
 * Usage: const restore = await withFavCompactTrigger(favId, user, 5000);
 * try { ... } finally { await restore(); }
 */
async function withFavCompactTrigger(
  favoriteId: string,
  user: JwtPrivatePayloadType,
  value: number,
): Promise<() => Promise<void>> {
  const userId = "id" in user ? String(user.id) : "";
  const { resolveFavoriteConfig } =
    await import("@/app/api/[locale]/agent/skills/favorites/repository");
  const patchDef =
    await import("@/app/api/[locale]/agent/skills/favorites/[id]/definition").then(
      (m) => m.default.PATCH,
    );

  // Read original value before patching
  const original = await resolveFavoriteConfig(favoriteId, userId);
  const originalCompactTrigger = original?.compactTrigger ?? null;

  await RouteExecuteRepository.runInProcessTyped({
    definition: patchDef,
    input: { compactTrigger: value, modelSelection: null },
    urlPathParams: { id: favoriteId },
    user,
    locale: defaultLocale,
    platform: Platform.AI,
  });

  return async () => {
    await RouteExecuteRepository.runInProcessTyped({
      definition: patchDef,
      input: { compactTrigger: originalCompactTrigger, modelSelection: null },
      urlPathParams: { id: favoriteId },
      user,
      locale: defaultLocale,
      platform: Platform.AI,
    });
  };
}

// ── Test timeouts ─────────────────────────────────────────────────────────────

/** Allow ample time for multi-step tool loops */
const TEST_TIMEOUT = 300_000;

/**
 * Build the full ordered chain by following parentId links from root → leaf.
 * Returns messages in order [root, ..., leaf]. Requires assertStrictLinearChain
 * to have passed first (exactly one root, no branches).
 */
function buildOrderedChain(messages: SlimMessage[]): SlimMessage[] {
  const root = messages.find((m) => m.parentId === null);
  if (!root) {
    return [];
  }
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
  let compactingFolderId: string;
  let mainFavoriteId: string;
  let suiteFailed = false;

  function fit(name: string, fn: () => Promise<void>, timeout?: number): void {
    it(
      name,
      async () => {
        if (suiteFailed) {
          expect(
            false,
            `[${name}] Previous test in suite failed — aborting dependent tests`,
          ).toBe(true);
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
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`);
    }
    testUser = resolved;

    // Create BACKGROUND/tests/compacting subfolder for this suite.
    const testsParentId = await getOrCreateFolder(
      testUser,
      DefaultFolderId.BACKGROUND,
      "tests",
    );
    compactingFolderId = await getOrCreateFolder(
      testUser,
      DefaultFolderId.BACKGROUND,
      "compacting",
      testsParentId,
    );

    // ── Resolve quality-tester__kimi favorite ──
    // Use existing fav if present (respects user overrides). Create only if absent.
    const [favsDef, favoriteCreateDef] = await Promise.all([
      import("@/app/api/[locale]/agent/skills/favorites/definition").then(
        (m) => m.default.GET,
      ),
      import("@/app/api/[locale]/agent/skills/favorites/create/definition").then(
        (m) => m.default.POST,
      ),
    ]);
    const favsResult = await RouteExecuteRepository.runInProcessTyped({
      definition: favsDef,
      input: { pageSize: 500 },
      user: testUser,
      locale: defaultLocale,
      platform: Platform.AI,
    });
    const favsList =
      favsResult.success && Array.isArray(favsResult.data?.["favorites"])
        ? (favsResult.data["favorites"] as Array<{
            id: string;
            skillId: string;
            [key: string]: string | number | boolean | null | undefined;
          }>)
        : [];
    const existingMain = favsList.find((f) =>
      String(f["skillId"] ?? "").startsWith("quality-tester__"),
    );
    if (existingMain?.["id"]) {
      mainFavoriteId = String(existingMain["id"]);
    } else {
      const createResult = await RouteExecuteRepository.runInProcessTyped({
        definition: favoriteCreateDef,
        input: { skillId: "quality-tester__kimi" },
        user: testUser,
        locale: defaultLocale,
        platform: Platform.AI,
      });
      expect(
        createResult.success,
        `Failed to create quality-tester__kimi fav: ${!createResult.success ? createResult.message : ""}`,
      ).toBe(true);
      if (!createResult.success) {
        // oxlint-disable-next-line restricted-syntax
        throw new Error(
          `Failed to create quality-tester__kimi favorite: ${createResult.message}`,
        );
      }
      const favId = createResult.data?.["id"];
      if (!favId) {
        // oxlint-disable-next-line restricted-syntax
        throw new Error(
          "quality-tester__kimi favorite created but id is missing",
        );
      }
      mainFavoriteId = String(favId);
    }

    // Top up credits so fixture-cached runs never hit the credit gate.
    // 500cr floor matches route-base.test.ts convention.
    const creditLogger = createEndpointLogger(false, defaultLocale);
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

  // ── C1: Mid-stream compacting — large initial context, fires after 5 tools ─
  // Single stream. The user message contains enough filler context that the
  // accumulated token count crosses compactTrigger=5_000 after 5 tool call
  // round-trips. This is the "initial-context-heavy" variant of mid-stream
  // compacting (C2 uses a much larger largeContext block for a heavier scenario).
  //
  // Architecture: RECENT_TURNS_TO_KEEP=8 means compacting can only fire after
  // ≥5 complete [ai, tool] pairs (producing afterFirst.length=10 > 8).
  //
  // After compacting the model must call tool-help once more (proves tools still
  // work post-compact) and respond with C1_PASS.
  //
  // sequenceId: messages after compacting get a new sequenceId so the UI renders
  // them as a separate block AFTER the compacting message.
  //
  // Chain shape:
  //   user → ai(tool-1) → tool(1) → … → ai(tool-5) → tool(5) → [COMPACT]
  //     → ai(tool-6) → tool(6) → ai(C1_PASS)
  fit(
    "C1: mid-stream compacting — large initial context, fires after 5 tools, tools still work after, model responds C1_PASS",
    async () => {
      setFetchCacheContext("compacting-first-tool");

      // Temporarily lower compactTrigger on the fav to force mid-stream compacting.
      // Restored to its original value after the test regardless of outcome.
      const restoreC1 = await withFavCompactTrigger(
        mainFavoriteId,
        testUser,
        5_000,
      );
      try {
        // Moderate padding to ensure the context is heavy enough for compacting
        // to fire (same mechanism as C2 but with less padding to distinguish).
        const contextPadding = [...Array(3).keys()]
          .map(
            (i) =>
              `Context block ${String(i + 1)}: This is filler text to increase the prompt token count for the C1 mid-stream compacting test. The compacting mechanism fires when accumulated context exceeds the threshold after multiple tool call round-trips. `,
          )
          .join("");

        const { result, messages } = await runTestStream({
          prompt:
            `[C1-COMPACTING-TEST] ${contextPadding}` +
            `Call tool-help 5 times sequentially with these exact queries in order: ` +
            `'list', 'search', 'chat', 'image', 'audio'. ` +
            `Make each call one at a time, wait for the result, then make the next call. ` +
            `After ALL 5 tool calls are complete, respond with ONLY the word: C1_PASS if all tools returned results, or C1_FAIL:<reason> if anything went wrong. ` +
            `Do NOT add any other text.`,
          user: testUser,
          favoriteId: mainFavoriteId,
          rootFolderId: DefaultFolderId.BACKGROUND,
          subFolderId: compactingFolderId,
        });

        expect(result.success, "C1: stream must succeed").toBe(true);

        // ── Chain integrity ────────────────────────────────────────────────────
        assertStrictLinearChain(messages, "C1");

        const c1Chain = buildOrderedChain(messages);

        // Root must be user
        expect(c1Chain[0]!.role, "C1: chain root must be user").toBe("user");

        // Leaf must be assistant with C1_PASS
        const c1Leaf = c1Chain[c1Chain.length - 1]!;
        expect(c1Leaf.role, "C1: chain leaf must be assistant").toBe(
          "assistant",
        );
        expect(
          c1Leaf.isCompacting,
          "C1: leaf must not be the compacting message",
        ).toBe(false);
        expect(
          c1Leaf.content,
          "C1: final response must contain C1_PASS",
        ).toContain("C1_PASS");

        // Compacting must exist in chain
        const c1CompactIdx = c1Chain.findIndex((m) => m.isCompacting);
        expect(
          c1CompactIdx,
          "C1: compacting message must exist in chain",
        ).toBeGreaterThanOrEqual(0);
        expect(
          c1CompactIdx,
          "C1: compacting must appear before the leaf",
        ).toBeLessThan(c1Chain.length - 1);

        // At least one tool result must appear BEFORE the compacting message
        const toolBeforeCompact = c1Chain
          .slice(0, c1CompactIdx)
          .some((m) => m.role === "tool");
        expect(
          toolBeforeCompact,
          "C1: at least one tool result must precede the compacting message",
        ).toBe(true);

        // At least one tool result must appear AFTER the compacting message (tools still work)
        const toolAfterCompact = c1Chain
          .slice(c1CompactIdx + 1)
          .some((m) => m.role === "tool");
        expect(
          toolAfterCompact,
          "C1: at least one tool result must follow the compacting message (tools still work after compact)",
        ).toBe(true);

        // ── sequenceId separation ──────────────────────────────────────────────
        // Messages after compacting must have a different sequenceId than messages
        // before compacting. Without this, the UI renders pre- and post-compact
        // messages as one block sorted before the compacting message.
        const preCompactAssistant = c1Chain
          .slice(0, c1CompactIdx)
          .findLast((m) => m.role === "assistant");
        expect(
          preCompactAssistant,
          "C1: must have an assistant message before compacting",
        ).toBeDefined();
        expect(
          c1Leaf.sequenceId,
          "C1: post-compact assistant must have a sequenceId",
        ).toBeTruthy();
        expect(
          c1Leaf.sequenceId,
          "C1: post-compact assistant must have a DIFFERENT sequenceId than pre-compact assistant",
        ).not.toBe(preCompactAssistant!.sequenceId);

        // ── createdAt monotonicity ─────────────────────────────────────────────
        for (let i = 1; i < c1Chain.length; i++) {
          expect(
            c1Chain[i]!.createdAt.getTime(),
            `C1: chain[${String(i)}] createdAt must be >= chain[${String(i - 1)}] createdAt (UI sort order broken)`,
          ).toBeGreaterThanOrEqual(c1Chain[i - 1]!.createdAt.getTime());
        }
      } finally {
        await restoreC1();
      }
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

      // Temporarily lower compactTrigger on the fav to force mid-stream compacting.
      // Restored to its original value after the test regardless of outcome.
      const restoreC2 = await withFavCompactTrigger(
        mainFavoriteId,
        testUser,
        5_000,
      );
      try {
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
          favoriteId: mainFavoriteId,
          rootFolderId: DefaultFolderId.BACKGROUND,
          subFolderId: compactingFolderId,
        });

        expect(turn1.result.success, "C2-T1: turn 1 stream must succeed").toBe(
          true,
        );
        const threadId = turn1.result.success
          ? (turn1.result.data.threadId ?? null)
          : null;
        expect(threadId, "C2-T1: turn 1 must produce a threadId").toBeTruthy();

        // ── Verify turn 1 chain ───────────────────────────────────────────────────
        assertStrictLinearChain(turn1.messages, "C2-T1");

        const t1Chain = buildOrderedChain(turn1.messages);
        expect(t1Chain[0]!.role, "C2-T1: root must be user").toBe("user");

        const t1Leaf = t1Chain[t1Chain.length - 1]!;
        expect(t1Leaf.role, "C2-T1: turn 1 leaf must be assistant").toBe(
          "assistant",
        );
        expect(
          t1Leaf.isCompacting,
          "C2-T1: turn 1 leaf must not be the compacting msg",
        ).toBe(false);
        expect(
          t1Leaf.content,
          "C2-T1: turn 1 leaf must contain COMPACT_DONE",
        ).toContain("COMPACT_DONE");

        // Compacting fires mid-stream (not necessarily as direct parent of leaf —
        // more tool calls may follow after compacting before the final response).
        const t1CompactIdx = t1Chain.findIndex((m) => m.isCompacting);
        expect(
          t1CompactIdx,
          "C2-T1: compacting message must exist in chain",
        ).toBeGreaterThanOrEqual(0);
        expect(
          t1CompactIdx,
          "C2-T1: compacting must appear before the leaf",
        ).toBeLessThan(t1Chain.length - 1);

        const t1CompactMsg = t1Chain[t1CompactIdx]!;

        // ── Turn 2: follow-up into the same thread ────────────────────────────────
        // This verifies that after a compacting event the thread chain is intact
        // and a new user+assistant pair can be appended without breaking the linked list.
        const turn2 = await runTestStream({
          prompt:
            "[C2-FOLLOWUP] Respond with ONLY the word: FOLLOWUP_DONE. " +
            "No preamble, no tools, no punctuation beyond that.",
          user: testUser,
          favoriteId: mainFavoriteId,
          threadId: threadId!,
        });

        expect(turn2.result.success, "C2-T2: turn 2 stream must succeed").toBe(
          true,
        );

        // ── Verify full thread chain after turn 2 ────────────────────────────────
        assertStrictLinearChain(turn2.messages, "C2-T2");

        const t2Chain = buildOrderedChain(turn2.messages);

        // Root is still the original user message from turn 1
        expect(
          t2Chain[0]!.role,
          "C2-T2: chain root must be user (turn 1)",
        ).toBe("user");
        expect(
          t2Chain[0]!.id,
          "C2-T2: chain root must be the turn-1 user message",
        ).toBe(t1Chain[0]!.id);

        // Turn-2 user message is the second-to-last in chain
        const t2Leaf = t2Chain[t2Chain.length - 1]!;
        const t2User = t2Chain[t2Chain.length - 2];
        expect(
          t2User?.role,
          "C2-T2: second-to-last message must be user (turn 2)",
        ).toBe("user");
        expect(t2Leaf.role, "C2-T2: leaf must be assistant (turn 2)").toBe(
          "assistant",
        );
        expect(
          t2Leaf.isCompacting,
          "C2-T2: leaf must not be a compacting message",
        ).toBe(false);
        expect(
          t2Leaf.content,
          "C2-T2: turn 2 leaf must contain FOLLOWUP_DONE",
        ).toContain("FOLLOWUP_DONE");

        // Turn-2 user message must be a child of the turn-1 final assistant (COMPACT_DONE)
        expect(
          t2User?.parentId,
          "C2-T2: turn-2 user message must be a child of the turn-1 final assistant",
        ).toBe(t1Leaf.id);

        // Compacting message still present in the full thread
        const t2CompactIdx = t2Chain.findIndex((m) => m.isCompacting);
        expect(
          t2CompactIdx,
          "C2-T2: compacting message must still be in chain after turn 2",
        ).toBeGreaterThanOrEqual(0);

        // ── createdAt monotonicity ─────────────────────────────────────────────
        // UI sorts messages by createdAt; chain order must match parentId order.
        for (let i = 1; i < t2Chain.length; i++) {
          expect(
            t2Chain[i]!.createdAt.getTime(),
            `C2-T2: chain[${String(i)}] createdAt must be >= chain[${String(i - 1)}] createdAt (UI sort order broken)`,
          ).toBeGreaterThanOrEqual(t2Chain[i - 1]!.createdAt.getTime());
        }

        // ── sequenceId separation ──────────────────────────────────────────────
        // turn-2 assistant (ai2) must have a DIFFERENT sequenceId than turn-1 assistant
        // messages so that the UI renders them as separate blocks with the turn-2 user
        // message visually in between (not buried inside the turn-1 block).
        const t1AssistantMsg = t1Chain.find((m) => m.role === "assistant");
        expect(
          t1AssistantMsg,
          "C2-T2: turn-1 must have an assistant message",
        ).toBeDefined();
        expect(
          t2Leaf.sequenceId,
          "C2-T2: turn-2 assistant must have a sequenceId",
        ).toBeTruthy();
        expect(
          t2Leaf.sequenceId,
          "C2-T2: turn-2 assistant must have a DIFFERENT sequenceId than turn-1 assistant (otherwise UI renders them as one block)",
        ).not.toBe(t1AssistantMsg!.sequenceId);

        // ── DB persistence: re-fetch and confirm compacting survives both turns ───
        if (threadId) {
          const freshMessages = await fetchThreadMessages(threadId, testUser);
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

          // ── Compacting quality assertions (all compacting messages in thread) ──
          const allCompacting = freshMessages.filter((m) => m.isCompacting);
          expect(
            allCompacting.length,
            "C2-quality: thread must have at least one compacting message",
          ).toBeGreaterThanOrEqual(1);

          for (const cm of allCompacting) {
            // Content must be a meaningful summary: ≥500 chars (~125 tokens minimum)
            expect(
              (cm.content ?? "").length,
              `C2-quality: compacting msg ${cm.id} content must be ≥500 chars (meaningful summary, not empty or stub)`,
            ).toBeGreaterThanOrEqual(500);

            // Input tokens must be reasonable — sanity guard against runaway context
            expect(
              cm.promptTokens,
              `C2-quality: compacting msg ${cm.id} must have promptTokens recorded`,
            ).not.toBeNull();
            expect(
              cm.promptTokens!,
              `C2-quality: compacting msg ${cm.id} input tokens must be ≤50k`,
            ).toBeLessThanOrEqual(50_000);
          }
        }
      } finally {
        await restoreC2();
      }
    },
    TEST_TIMEOUT,
  );
});
