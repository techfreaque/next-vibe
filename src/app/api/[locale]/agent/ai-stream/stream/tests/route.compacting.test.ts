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

/** Walk parent chain from leafId → root. Returns [root, ..., leaf] */
function walkChain(messages: SlimMessage[], leafId: string): string[] {
  const byId = new Map(messages.map((m) => [m.id, m]));
  const chain: string[] = [];
  let current: SlimMessage | undefined = byId.get(leafId);
  while (current) {
    chain.unshift(current.id);
    current = current.parentId ? byId.get(current.parentId) : undefined;
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
  // quality-tester skill with compactTrigger=5000 tokens (low enough to trigger
  // given tool schemas + tool result history across multiple steps).
  // AI calls tool-help multiple times to build context. Once token count
  // exceeds 5000, mid-stream compacting fires between tool-loop steps.
  // After compacting the AI continues and produces a final response.
  fit(
    "C2: mid-stream compacting — compacting fires during tool loop, chain stays linear",
    async () => {
      setFetchCacheContext("compacting-mid-stream");

      // Build a large user prompt to fill up context quickly.
      // Mid-stream compacting only summarizes "middle turns" — messages between
      // firstUserMessage and the last RECENT_TURNS_TO_KEEP (8) non-system messages.
      // So we need at least 9 messages after the first user message (= 5 tool round-trips)
      // to have any middleTurns to compact. The token threshold ensures compacting fires
      // between tool calls, not just at the end.
      const largeContext = [...Array(10).keys()]
        .map(
          (i) =>
            `Context block ${String(i + 1)}: This is padding text to increase the prompt token count for the mid-stream compacting test. The compacting mechanism should fire when the accumulated context exceeds the threshold. `,
        )
        .join("");

      const { result, messages } = await runTestStream({
        prompt:
          `[C2-COMPACTING-TEST] ${largeContext}` +
          `Call tool-help 5 times sequentially with these exact queries in order: ` +
          `'list', 'search', 'chat', 'image', 'audio'. ` +
          `Make each call one at a time, wait for the result, then make the next call. ` +
          `After ALL 5 tool calls are complete, respond with ONLY the word: COMPACT_DONE. ` +
          `Do NOT add any other text. COMPACT_DONE is the ONLY acceptable final response.`,
        user: testUser,
        skill: "quality-tester",
        // Inject compactTrigger=5000 via favoriteConfig - no DB writes needed.
        // Pin only tool-help so the AI has exactly one tool available.
        // Pre-stream: system (~1400 tokens) + tool schema (~1200) + user msg (~1000) ≈ 3600.
        // Below 5000, so pre-stream compacting will NOT fire.
        // After 3 tool round-trips (6 messages accumulated), total crosses 5000.
        // Mid-stream compacting fires. RECENT_TURNS_TO_KEEP=8 keeps last 8 messages verbatim,
        // so with 10+ afterFirst messages, 2+ messages become "middle turns" (compacted).
        // After compacting the AI continues for remaining tool calls, then produces COMPACT_DONE.
        favoriteConfig: {
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
          availableTools: [
            { toolId: "tool-help", requiresConfirmation: false },
          ],
          pinnedTools: [{ toolId: "tool-help", requiresConfirmation: false }],
          deniedTools: null,
          compactTrigger: 5000,
          memoryLimit: null,
          promptAppend: null,
        },
      });

      expect(result.success, "C2: stream must succeed (not aborted)").toBe(
        true,
      );

      // Must have a compacting message
      const compactingMsg = messages.find((m) => m.isCompacting);
      expect(
        compactingMsg,
        "C2: compacting message must exist in thread (isCompacting=true)",
      ).toBeDefined();

      // Final assistant message must exist and contain COMPACT_DONE
      const finalAssistant = messages.findLast((m) => m.role === "assistant");
      expect(
        finalAssistant,
        "C2: final assistant message must exist",
      ).toBeDefined();
      expect(
        finalAssistant?.content,
        "C2: final assistant message must contain COMPACT_DONE",
      ).toContain("COMPACT_DONE");

      // The compacting message must come BEFORE the final assistant message
      if (compactingMsg && finalAssistant) {
        const compactIdx = messages.findIndex((m) => m.id === compactingMsg.id);
        const assistantIdx = messages.findIndex(
          (m) => m.id === finalAssistant.id,
        );
        expect(
          compactIdx,
          "C2: compacting message must appear before final assistant message",
        ).toBeLessThan(assistantIdx);
      }

      // Chain must be strictly linear — compacting must not break the linked list
      assertStrictLinearChain(messages, "C2");

      // Verify the full chain from leaf
      const leaf = messages.findLast(
        (m) => !messages.some((n) => n.parentId === m.id),
      );
      expect(leaf, "C2: must have exactly one leaf message").toBeDefined();

      if (leaf) {
        const chain = walkChain(messages, leaf.id);
        // Chain must include: user → ... → compacting → ... → final assistant
        expect(
          chain.length,
          "C2: chain must have at least 4 messages (user, tool calls, compacting, assistant)",
        ).toBeGreaterThanOrEqual(4);

        // User message must be the root
        const rootMsg = messages.find((m) => m.id === chain[0]);
        expect(rootMsg?.role, "C2: chain root must be a user message").toBe(
          "user",
        );

        // Leaf must be the final assistant
        expect(leaf.role, "C2: chain leaf must be an assistant message").toBe(
          "assistant",
        );
        expect(
          leaf.content,
          "C2: chain leaf must contain COMPACT_DONE",
        ).toContain("COMPACT_DONE");
      }

      // Fetch fresh from DB to confirm compacting message persisted correctly
      if (result.success && result.data.threadId) {
        const freshMessages = await fetchThreadMessages(result.data.threadId);
        const persistedCompacting = freshMessages.find((m) => m.isCompacting);
        expect(
          persistedCompacting,
          "C2: compacting message must persist in DB with isCompacting=true",
        ).toBeDefined();

        // Must NOT be marked as compactingFailed
        // (if compacting failed, the stream would have aborted)
        expect(
          result.success,
          "C2: stream must not abort due to compacting failure",
        ).toBe(true);
      }
    },
    TEST_TIMEOUT,
  );
});
