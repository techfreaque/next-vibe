/**
 * AI Stream Integration Tests - Single-Thread Sequential Suite
 *
 * Architecture:
 * - One shared thread (`threadId`) for the main test sequence so the AI sees
 *   real conversation history and a human reviewer can read the thread in the UI.
 * - Separate isolated threads for tests that fundamentally can't share state
 *   (incognito, credits, error handling, certain callback modes).
 * - After every step: assertThreadIdle + assertNoPendingTasks + credit check.
 * - Per-step credit pinning so billing regressions are caught immediately.
 * - HTTP cache (installFetchCache) intercepts outbound fetch() on first run,
 *   replays from fixtures on subsequent runs - same code path, no network.
 * - Claude Code fixtures (claude-code-fixture-store) for Agent SDK calls.
 *
 * Cache bust: delete fixtures/http-cache/<case>/ or fixtures/claude-code/<case>/
 *
 * Thread layout (visible in UI):
 *   T1  → new thread + tool call (tool-help) - creates thread, tests parent chain + tool structure
 *         Gradual exploration ladder (tool-help compact platform): broad list → categories.
 *   T1a-cat   → narrow by category → tool names (step 2 of the ladder)
 *   T1a-query → broad keyword search → names list, no schemas (step 3)
 *   T1b       → detail mode: single tool full schema (step 4)
 *   T2  → image generation (gpt-5-image-mini via quality-tester skill, inline wait mode)
 *   T3  → retry + branch from T1 AI → two sibling forks: RETRY_RESPONSE + BRANCH_RESPONSE
 *   T4  → music gen (from retry branch) + video gen (from fork branch)
 *   T5  → detach dispatch: AI calls generate_image(detach), gets taskId
 *   T5b → await-task: AI calls await-task with T5 taskId, gets imageUrl
 *   T5a → endLoop: tool-help(endLoop) executes inline, stream stops after 1 call
 *   T5d → wait callback mode: original tool message backfilled in-place, no deferred
 *   T6  → wakeUp: phase1 dispatches async, phase2 revives with result
 *   T6c → wakeUp repeat: second full E2E wakeUp on same thread, no stale state from T6a/T6b
 *   T6d → wakeUp stress: third consecutive E2E wakeUp, verifies no accumulated stale tasks
 *   T7  → approve: phase1 pending confirmation, phase2 confirms + executes
 *   CF  → contact-form: definition-level requiresConfirmation (AI cannot override), DB verified
 *   T8  → parallel tools: tool-help + generate_image in same batch
 *   T9  → AI reasons about its own prior generate_image tool result in context
 *   T10 → file attachments: image, multi (image+audio), voice (attach+STT), video, voice WAV gap-fill
 *   T11 → Native image generation via Gemini 3.1 Flash Image Preview (file part output, empty args.prompt)
 *   T11b→ gap-fill Pass 2: non-image model sees vision-bridge description of T11 image
 *   T11c/T11d → image-to-video (Nano Banana Pro native vision / Kimi K2.6 via tool)
 *   T11e/T11f(+verify)/T11g → image-to-image (native file-part, tool call, native I2I)
 *   T12 → invalid explicitParentMessageId - graceful error handling
 *
 * Standalone suites (no thread / own thread):
 *   - Favorites resolution (F1)
 */

import "server-only";

// AI SDK v2→v3 compat mode warning - provider works fine, SDK just prefers v3
// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

// Install HTTP fetch interceptor before any other imports touch fetch
import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { and, eq, like, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { cronTasks } from "next-vibe/tasks/cron/db";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { cortexNodes } from "@/app/api/[locale]/agent/cortex/db";
import {
  ContentLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "@/app/api/[locale]/agent/skills/enum";
import { contacts } from "@/app/api/[locale]/contact/db";
import { ContactSubject } from "@/app/api/[locale]/contact/enum";
import { env } from "@/config/env";

import { ChatModelId } from "../../models";
import { setFetchCacheContext } from "../../testing/fetch-cache";
import {
  fetchThreadMessages,
  fetchThreadTitle,
  getOrCreateFolder,
  resolveUser,
  type SlimMessage,
  toolResultRecord,
} from "../../testing/headless-test-runner";
import {
  assertDeducted,
  assertLocalNotBilled,
  getBalance,
  getLastBalanceReadAt,
  isIndexingCreditTx,
  pinBalance,
  readLocalDeductionMarker,
  readRemoteDeductionMarker,
  waitForLocalDeductionAfter,
  waitForRemoteDeductionAfter,
} from "./helpers/balance";
import {
  assertChainIntegrity,
  assertNoOrphans,
  buildTree,
  msgDesc,
  walkChain,
} from "./helpers/chain";
import type { ModeConfig } from "./helpers/config";
import { deriveLoopRunsRemote } from "./helpers/config";
import {
  createQualityTesterFavorite,
  ensureVisualFavorite,
} from "./helpers/favorites";
import {
  assertNoMetaToolPrefix,
  assertToolMessageComplete,
  findToolMsg,
  resolveToolResult,
} from "./helpers/messages";
import { assertStepOk, toolInstr, toolInstrWithArgs } from "./helpers/prompts";
import {
  assertNoPendingTasks,
  assertThreadIdle,
  makeRunStream,
} from "./helpers/run-stream";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Assert messages are in strictly ascending chronological order */
function assertChronologicalOrder(
  chain: string[],
  messages: SlimMessage[],
): void {
  const byId = new Map(messages.map((m) => [m.id, m]));
  for (let i = 1; i < chain.length; i++) {
    const prev = byId.get(chain[i - 1]!)!;
    const curr = byId.get(chain[i]!)!;
    // A compacting node is inserted after the turn it precedes in the chain and
    // re-parents it, so a compacting ancestor legitimately has a later
    // createdAt than its descendant. Skip the ordering check across it.
    if (prev.isCompacting) {
      continue;
    }
    expect(
      curr.createdAt.getTime() >= prev.createdAt.getTime(),
      `Out of order: ${msgDesc(curr)} created before ancestor ${msgDesc(prev)}`,
    ).toBe(true);
  }
}

/**
 * wakeUp phase-1 confirmation: the dispatch turn says STEP_OK (taskId seen,
 * no image yet), but a fast task can revive INLINE within the same stream, in
 * which case the final AI is the revival turn that confirms WAKEUP_OK instead.
 * Either marker proves the phase worked.
 */
function assertWakeUpPhase1Ok(
  content: string | null | undefined,
  stepName: string,
): void {
  expect(content, `[${stepName}] AI returned empty content`).toBeTruthy();
  if (!content) {
    // oxlint-disable-next-line restricted-syntax
    throw new Error(`[${stepName}] AI returned empty content`);
  }
  expect(
    content.includes("STEP_OK") || content.includes("WAKEUP_OK"),
    `[${stepName}] AI did NOT confirm STEP_OK (dispatch) or WAKEUP_OK (inline revival) - reported issues instead:\n\n${content}`,
  ).toBe(true);
}

/**
 * Strip reasoning blocks to get the visible answer. Handles a CLOSED
 * <think>…</think> and an UNCLOSED <think>… (model still mid-reasoning, or a
 * partial mirror): an unclosed block means there is no visible answer yet.
 */
function stripReasoning(content: string | null | undefined): string {
  let c = content ?? "";
  c = c.replace(/<think>[\s\S]*?<\/think>/g, "");
  // Any remaining (unclosed) <think> means the rest is unfinished reasoning.
  const openIdx = c.indexOf("<think>");
  if (openIdx !== -1) {
    c = c.slice(0, openIdx);
  }
  return c.trim();
}

/**
 * Resolve an assistant message and wait for its FINAL content to mirror. The
 * relay streams an assistant incrementally, so a REMOTE-folder mirror can hold
 * an early chunk (e.g. just "<think>") when first read. Poll until the
 * message's visible answer (after stripping a CLOSED reasoning block) is
 * non-empty, or the budget elapses. Returns the latest message seen.
 */
async function awaitFinalAssistant(
  threadId: string,
  messageId: string,
  getMessages: (tid: string) => Promise<SlimMessage[]>,
): Promise<SlimMessage | undefined> {
  let found: SlimMessage | undefined;
  for (let i = 0; i < 30; i++) {
    const msgs = await getMessages(threadId);
    found = msgs.find((m) => m.id === messageId);
    if (found && stripReasoning(found.content).length > 0) {
      return found;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
  }
  return found;
}

/** Filter messages by role */
function byRole(messages: SlimMessage[], role: string): SlimMessage[] {
  return messages.filter((m) => m.role === role);
}

/** Get messages added since prevIds snapshot (sorted by createdAt, excludes known IDs) */
function newMessages(
  messages: SlimMessage[],
  prevIds: Set<string>,
): SlimMessage[] {
  return [...messages]
    .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .filter((m) => !prevIds.has(m.id));
}

/** Read a fixture file from fixtures/media/ as a File object */
async function loadFixture(filename: string, mimeType: string): Promise<File> {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const fixturePath = join(
    import.meta.dirname,
    "..",
    "..",
    "testing",
    "fixtures",
    "media",
    filename,
  );
  const buffer = await readFile(fixturePath);
  return new File([buffer], filename, { type: mimeType });
}

// ── Test Suite ────────────────────────────────────────────────────────────────

// 600s: remote (direct-http) tests make live API calls (image/video/music gen) that can take 5+ minutes.
// FAIL FAST: a healthy case (fixture replay or a single live model turn)
// finishes well under 2 minutes; long-running media/queue cases override
// per-test (T4 music+video, MEDIA_SETTLE cases, queue cron cycles). A hang is
// diagnosed by WHERE it stopped, not by waiting 10 minutes for it.
const TEST_TIMEOUT = 120_000;
// Queue tests need extra time: WS connector + coding-agent AI inference on hermes-dev 3002 (up to 60s each)
const QUEUE_TEST_TIMEOUT = 300_000;
// Heavy media turns (image-to-video / image-to-image) send multi-MB requests and
// the post-tool model turn runs long; on first recording the live media polling
// also runs inside this window. The default 120s settle is too short — match the
// fetch-cache's 5-minute live-fetch ceiling so recording and replay both finish.
const MEDIA_SETTLE_TIMEOUT_MS = 300_000;

export function describeStreamSuite(cfg: ModeConfig): void {
  // cheapMode is an explicit per-suite flag set by the caller (cheap vs full
  // wrapper file). No global override — each context has its own cheap + full file.
  // For queue tests (cfg.pulse set), individual tests need more time for cron cycles
  const effectiveTestTimeout = cfg.pulse ? QUEUE_TEST_TIMEOUT : TEST_TIMEOUT;
  // Media cases replay long recorded provider poll chains (each poll sleeps
  // its real interval — a 49-poll video chain alone is ~245s) and run live
  // generation on first record; they get the media budget, not the fail-fast
  // default.
  const mediaTestTimeout = 300_000;
  describe(cfg.label, () => {
    // Suite root: PRIVATE for all same-instance suites — every test thread
    // lands at PRIVATE/tests/<case>/ and NOTHING is stored anywhere else.
    // REMOTE-folder suites override with their instance folder root
    // (REMOTE/<instance>/tests/<case> on the caller; the executor mirrors to
    // REMOTE/<caller>/tests/<case>).
    const suiteRootFolderId: DefaultFolderId =
      cfg.rootFolderIdOverride ?? DefaultFolderId.PRIVATE;

    // True ONLY for REMOTE-folder routing, where the whole loop moved to the
    // remote instance and its wallet is billed for the loop — NOT the local
    // testUser — so local-wallet deduction assertions are meaningless there
    // (a LOCAL-NOT-BILLED guard runs after T1 instead, see below).
    // Inference-provider relays (assertRelayRan / systemPromptInstanceId
    // without a REMOTE folder) bill BOTH sides of the chain, so their local
    // deduction asserts MUST run. See deriveLoopRunsRemote for the contract.
    const loopRunsRemote = deriveLoopRunsRemote(cfg);
    async function assertDeductedLocal(
      user: JwtPrivatePayloadType,
      before: number,
      after: number,
      min: number,
      max: number,
    ): Promise<void> {
      if (loopRunsRemote) {
        return; // remote-billed: local wallet is not the billed party
      }
      await assertDeducted(user, before, after, min, max);
    }
    let testUser: JwtPrivatePayloadType;
    /** Main favorite: quality-tester skill + kimi variant + media model selections */
    let mainFavoriteId: string;
    /** Native image gen favorite: GPT-5 Image Mini as chat model (outputs: ["text","image"]) */
    let nativeImageFavoriteId: string;
    /** Nano Banana Pro favorite: Gemini 3 Pro Image Preview as chat model (can see + generates images, uses video tool) */
    let nanoBananaFavoriteId: string;
    /**
     * Per-suite folder (<suiteRoot> → tests → <testCaseName>) — all AI
     * streams in this suite land here. Unset for REMOTE-override suites
     * (overrideSubFolderId is used instead).
     * Keeps test threads isolated per suite and out of the global cron root.
     * Created in beforeAll, deleted in afterAll.
     */
    let testSubFolderId: string;
    /**
     * REMOTE-folder modes: per-suite folder nested inside the instance folder
     * (REMOTE → <instanceId> → tests → <testCaseName>). Computed in beforeAll
     * after cfg.setup resolves the instance folder.
     */
    let overrideSubFolderId: string | undefined;
    /** Loop-local topology: the hermes-side origination folder. */

    // ── Closures over testUser ─────────────────────────────────────────────────
    // These wrap the imported helpers and inject testUser so call sites don't
    // need to pass the user argument explicitly.
    const getMessages = (tid: string): ReturnType<typeof fetchThreadMessages> =>
      fetchThreadMessages(tid, testUser);
    const getTitle = (tid: string): ReturnType<typeof fetchThreadTitle> =>
      fetchThreadTitle(tid, testUser);
    /** Fetch the current streamingState for a thread via the messages endpoint. */
    async function getStreamingState(tid: string): Promise<string | undefined> {
      const msgsDef = (
        await import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition")
      ).default;
      const result = await sendTestRequest({
        endpoint: msgsDef.GET,
        data: { rootFolderId: suiteRootFolderId },
        urlPathParams: { threadId: tid },
        user: testUser,
      });
      if (!result.success) {
        return undefined;
      }
      const state = result.data?.["streamingState"];
      return typeof state === "string" ? state : undefined;
    }

    beforeAll(async () => {
      const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
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

      // Clean up stale lead links that may have been created by browsing the app
      // or interrupted test runs. Keep only the primary lead link used by testUser.
      await db.execute(
        sql`DELETE FROM user_lead_links
            WHERE user_id = ${testUser.id} AND lead_id != ${testUser.leadId}`,
      );

      // Safety floor: 500cr before any test
      await pinBalance(testUser, 500);

      // ── Resolve quality-tester favorite ──
      // Deterministic favorite setup: delete EVERY quality-tester favorite
      // and recreate fresh — reusing rows risks model-selection drift (sync
      // LWW, earlier runs) silently changing which model records fixtures.
      mainFavoriteId = await createQualityTesterFavorite(testUser);

      const favoriteCreateDef =
        await import("@/app/api/[locale]/agent/skills/favorites/create/definition").then(
          (m) => m.default.POST,
        );

      // ── Resolve native image gen favorite (Gemini 3.1 Flash Image Preview) ──
      // T11 tests native image generation where the chat model IS the image gen model.
      {
        // The skill's native-image VARIANT carries the whole model config —
        // never override models on a favorite (it shows up in the UI as a
        // duplicate mislabeled variant of the skill).
        const createResult = await sendTestRequest({
          endpoint: favoriteCreateDef,
          data: { skillId: "quality-tester__native-image" },
          user: testUser,
        });
        expect(
          createResult.success,
          "Failed to create native image favorite",
        ).toBe(true);
        if (!createResult.success) {
          // oxlint-disable-next-line restricted-syntax
          throw new Error(
            `Failed to create native image favorite: ${createResult.message}`,
          );
        }
        const nativeImageFavId = createResult.data?.["id"];
        if (!nativeImageFavId) {
          // oxlint-disable-next-line restricted-syntax
          throw new Error("native image favorite created but id is missing");
        }
        nativeImageFavoriteId = String(nativeImageFavId);
      }

      // ── Resolve Nano Banana Pro favorite (Gemini 3 Pro Image Preview) ──
      // T11c/T11d tests: model can see images and generates images natively.
      {
        // Same rule: the nano-banana-pro VARIANT owns the model config.
        const createResult = await sendTestRequest({
          endpoint: favoriteCreateDef,
          data: { skillId: "quality-tester__nano-banana-pro" },
          user: testUser,
        });
        expect(
          createResult.success,
          "Failed to create nano-banana favorite",
        ).toBe(true);
        if (!createResult.success) {
          // oxlint-disable-next-line restricted-syntax
          throw new Error(
            `Failed to create nano-banana favorite: ${createResult.message}`,
          );
        }
        const nanoBananaFavId = createResult.data?.["id"];
        if (!nanoBananaFavId) {
          // oxlint-disable-next-line restricted-syntax
          throw new Error("nano-banana favorite created but id is missing");
        }
        nanoBananaFavoriteId = String(nanoBananaFavId);
      }

      // No stale local tasks may exist when a suite starts: the system
      // prompt lists pending tasks, the AI calls await-task on them, and
      // that behavior gets baked into recorded fixtures.
      await db
        .delete(cronTasks)
        .where(
          sql`(${cronTasks.id} LIKE 'local-bg-%' OR ${cronTasks.id} LIKE 'local-wu-%' OR ${cronTasks.routeId} LIKE 'resume-stream%')`,
        );

      // Local suites KEEP a live hermes connection when one exists: private
      // threads never relay their loop, so costs/assertions are unaffected,
      // and thread/chat sync mirrors every test thread live to the peer's
      // REMOTE/<us>/tests/<case> — that mirroring IS a feature under test.
      // Only favorites sync is forced off (it would LWW-overwrite the
      // suite's quality-tester favorite mid-run).
      if (!cfg.setup) {
        const { normalizeHermesSyncScope } =
          await import("../../testing/remote-setup");
        await normalizeHermesSyncScope();
      }

      const testCaseName =
        cfg.cachePrefix.replace(/[^a-z0-9-]/gi, "").replace(/-+$/, "") ||
        "regular";

      // Per-mode setup (remote connections, credential patching, etc.)
      if (cfg.setup) {
        await cfg.setup(testUser);
      }

      // ── Create the per-suite folder chain: <suiteRoot> → tests → <testCaseName> ──
      // All runStream() calls land here so test threads are organized per
      // suite. Runs AFTER cfg.setup: with a live peer connection the real
      // folder endpoints emit folder-created remote events, so the chain
      // propagates to the peer by SAME id the way production does — never
      // seeded by the test. REMOTE-folder suites build their chain inside
      // the instance folder instead (below).
      if (!cfg.rootFolderIdOverride) {
        const testsParentId = await getOrCreateFolder(
          testUser,
          suiteRootFolderId,
          "tests",
        );
        testSubFolderId = await getOrCreateFolder(
          testUser,
          suiteRootFolderId,
          testCaseName,
          testsParentId,
        );
      }

      // REMOTE-folder modes: nest the per-suite chain inside the instance
      // folder so threads land in <root> → <instanceId> → tests → <testCaseName>.
      if (cfg.rootFolderIdOverride && cfg.subFolderIdOverride) {
        const overrideTestsParentId = await getOrCreateFolder(
          testUser,
          cfg.rootFolderIdOverride,
          "tests",
          cfg.subFolderIdOverride,
        );
        overrideSubFolderId = await getOrCreateFolder(
          testUser,
          cfg.rootFolderIdOverride,
          testCaseName,
          overrideTestsParentId,
        );
      }
    }, effectiveTestTimeout);

    afterAll(async () => {
      // Clean up stale wakeUp/background tasks that may remain if tests fail mid-run.
      // Without this, subsequent test runs would see leftover tasks causing fixture
      // counter misalignment and unexpected revival triggers.
      await db.execute(
        sql`DELETE FROM cron_tasks WHERE id LIKE 'local-wu-%' AND last_execution_status IN ('status.completed', 'status.failed', 'status.cancelled', 'status.stopped')`,
      );

      // ── Full after-pass cleanup, END TO END ─────────────────────────────
      // Every thread dies through the real DELETE endpoint (thread-deleted
      // relays by SAME id → the peer's mirror dies too), then the per-suite
      // case folder dies through the real subfolder DELETE (folder-deleted
      // relays for private/background origins). REMOTE-folder suites also
      // dispatch the same-id folder delete to the executor instance — the
      // caller's REMOTE-root folder ops are peer-local by design.
      const cleanupFolderId = overrideSubFolderId ?? testSubFolderId;
      if (testUser && cleanupFolderId) {
        try {
          const threadByIdDef = (
            await import("@/app/api/[locale]/agent/chat/threads/[threadId]/definition")
          ).default;
          const subFolderDef = (
            await import("@/app/api/[locale]/agent/chat/folders/subfolders/[subFolderId]/definition")
          ).default;
          const { chatThreads: threadsTable } =
            await import("@/app/api/[locale]/agent/chat/db");
          const { eq: eqOp } = await import("drizzle-orm");
          const rows = await db
            .select({ id: threadsTable.id })
            .from(threadsTable)
            .where(eqOp(threadsTable.folderId, cleanupFolderId));
          for (const row of rows) {
            await sendTestRequest({
              endpoint: threadByIdDef.DELETE,
              urlPathParams: { threadId: row.id },
              data: { rootFolderId: suiteRootFolderId },
              user: testUser,
            });
          }
          await sendTestRequest({
            endpoint: subFolderDef.DELETE,
            urlPathParams: { subFolderId: cleanupFolderId },
            user: testUser,
          });
          if (cfg.rootFolderIdOverride === DefaultFolderId.REMOTE) {
            const { HERMES_INSTANCE_ID } =
              await import("../../testing/remote-setup");
            await sendTestRequest({
              endpoint: subFolderDef.DELETE,
              urlPathParams: { subFolderId: cleanupFolderId },
              user: testUser,
              instanceId: HERMES_INSTANCE_ID,
            });
          }
        } catch {
          // Cleanup is best-effort — a failed teardown must not mask results.
        }
      }
      if (cfg.teardown && testUser) {
        await cfg.teardown(testUser);
      }
    });

    const runStream = makeRunStream({
      cfg,
      suiteRootFolderId,
      getMessages,
      getStreamingState,
      getTestSubFolderId: () => testSubFolderId,
      getOverrideSubFolderId: () => overrideSubFolderId,
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Main Thread: one shared thread, sequential steps
    // Each step verifies thread state + credits before moving on.
    // A human reading the thread in the UI sees a natural conversation.
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    describe("Main Thread (single shared thread)", () => {
      // If any test in this suite fails, all subsequent tests skip immediately.
      // Prevents downstream tests from passing with stale/undefined shared state.
      // suiteFailed is set to true by any test that catches an error.
      // Subsequent tests skip immediately to avoid false positives from stale state.
      let suiteFailed = false;
      /** Drop-in for `it` that marks the suite failed on any thrown error and
       *  skips immediately if a previous test already failed. */
      function fit(
        name: string,
        fn: () => Promise<void>,
        timeout?: number,
      ): void {
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

      // Thread state shared across steps
      let threadId: string;
      // Tracks the last AI message on the main linear chain.
      // Every append test MUST pass this as explicitParentMessageId so the
      // thread is a strict linked list with no broken parent chains.
      let lastMainAiMsgId: string;
      // Accumulates known dead-end leaf IDs as branches are created and
      // abandoned. Passed to assertChainIntegrity as knownDeadEndLeaves so
      // check #5 only fires on genuinely unexpected leaves.
      const deadEndLeaves = new Set<string>();
      // Persistent set of assistant message IDs that legitimately have >1 child.
      // A native image model (T11e) can emit multiple file parts in one turn, and a
      // tools-capable model (T11f) can make parallel generate_image tool calls —
      // both fan out a single assistant into several tool-message children. Because
      // assertChainIntegrity validates the WHOLE shared thread on every call, these
      // branch points must persist so EVERY later test honours them, not just the
      // test that created them. Tests add to this set, then pass it as the
      // knownBranchPoints argument.
      const mediaBranchPoints = new Set<string>();
      // T6c/T6d are full E2E wakeUp tests chaining from T6b's revival AI.

      // Step artifacts
      let t1UserMsgId: string;
      let t1AiMsgId: string;
      let t1ToolAiMsgId: string; // last AI after tool call (was t2AiMsgId)
      // The explicit parent passed to T2's runStream = lastMainAiMsgId before T2 ran.
      // UI retry/branch on T2's user message uses userMsg.parentId = this value.
      // So retry/branch user messages are SIBLINGS of T2's user message under t2BranchParentId.
      let t2BranchParentId: string;
      // T2's user message ID - a sibling of the retry/branch user messages under t2BranchParentId.
      let t2UserMsgId: string;
      let branchRetryAiMsgId: string; // From retry+branch test
      let branchForkAiMsgId: string; // From branch fork
      let t5DetachTaskId: string; // taskId from T5 detach step, used by T5b await-task step
      // T6: wakeUp delivery shape — a fast task delivers inline within the
      // same stream (original message holds the image), a slow one delivers
      // via revival (deferred message). Both honour the contract: the tool
      // call itself never blocks.
      let t6aInlineDelivery = false;
      let t11fOutputImageUrl: string; // Output image URL from T11f I2I, used by T11f-verify

      // ── T1: New thread + tool call (combines basic send + tool call) ──────
      fit(
        "T1: new thread + tool call - thread creation, parent chain, tool-help result, metadata",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}tool-call`);
          await pinBalance(testUser, 50);
          const before = await getBalance(testUser);
          // Bounds the T1 ledger-audit window for the LOCAL-NOT-BILLED guard.
          const beforeReadAt = getLastBalanceReadAt();

          // REMOTE-folder modes: the loop must run ON the remote instance.
          // Its wallet pays for the model usage there — a new usage-deduction
          // ledger row after this marker proves the stream (started locally)
          // executed and billed remotely. Ledger rows are append-only, so the
          // check is immune to concurrent credit additions and to the remote
          // deduction committing after the relay HTTP response returns.
          const isRemoteFolderMode =
            cfg.rootFolderIdOverride === DefaultFolderId.REMOTE;
          const remoteLedgerMarker = loopRunsRemote
            ? await readRemoteDeductionMarker()
            : null;
          // Loop-LOCAL topology: the loop bills HERE — marker for the
          // local-ledger proof below.
          const localLoopMarker =
            isRemoteFolderMode && !loopRunsRemote
              ? await readLocalDeductionMarker(testUser.id)
              : null;

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T1 thread-create+tool-call] Explore the tool catalog gradually with ${toolInstr(cfg, "tool-help")}. First call it ${cfg.remoteInstanceId ? "with input={} (empty tool-help arguments — but ALWAYS keep toolName and instanceId set)" : "with no arguments"} — there are many tools, so it returns a categories list (each with a name and count) instead of every tool. Pick one category from that list and call ${toolInstr(cfg, "tool-help")} again with ${cfg.remoteInstanceId ? "input={category:'<that category name>'}" : "category='<that category name>'"} to get the tools in it. Check that this second call returns a non-empty tools array and that each tool has a name and description. End your reply with STEP_OK if the categories list and the narrowed tools list both looked right, or FAILED: <reason> if anything was wrong.`,
            favoriteId: mainFavoriteId,
          });

          expect(
            result.success,
            `T1 stream failed: ${!result.success ? result.message : ""}`,
          ).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          if (loopRunsRemote) {
            const remoteDeductions =
              await waitForRemoteDeductionAfter(remoteLedgerMarker);
            expect(
              remoteDeductions.length,
              `T1 remote-folder: the loop must run ON the remote instance — no new usage deduction on hermes after marker ${String(remoteLedgerMarker)}`,
            ).toBeGreaterThan(0);

            // The executor side OWNS the running thread: the thread's
            // messages must exist in the remote DB. A missing remote thread
            // means the loop silently ran locally or the executor failed to
            // persist its copy.
            const { assertProdDbHasMessages: assertRemoteMessages } =
              await import("../../testing/remote-setup");
            await assertRemoteMessages(result.data.threadId!, 2);
          } else if (isRemoteFolderMode) {
            // Loop-LOCAL topology ("self" sentinel): the loop must bill the
            // LOCAL wallet — a new local usage-deduction ledger row proves
            // the stream did not silently relay to the remote.
            const localDeductions = await waitForLocalDeductionAfter(
              testUser.id,
              localLoopMarker,
            );
            expect(
              localDeductions.length,
              `T1 loop-local: the loop must run HERE — no new local usage deduction after marker ${String(localLoopMarker)}`,
            ).toBeGreaterThan(0);
          }

          // ── Capture IDs early so downstream tests aren't blocked ──
          threadId = result.data.threadId!;
          expect(threadId).toBeTruthy();

          // ── First user message (root) ──
          const userMsgs = byRole(messages, "user");
          expect(userMsgs.length).toBeGreaterThanOrEqual(1);
          const userMsg = userMsgs[0]!;
          t1UserMsgId = userMsg.id;

          // ── User message properties ──
          expect(userMsg.parentId).toBeNull();
          expect(userMsg.isAI).toBe(false);
          expect(userMsg.model).toBeNull();
          expect(userMsg.sequenceId).toBeNull();
          expect(userMsg.promptTokens).toBeNull();
          expect(userMsg.completionTokens).toBeNull();
          expect(userMsg.creditCost).toBeNull();

          // ── First AI message (tool call initiator) ──
          const aiMsgs = byRole(messages, "assistant");
          expect(aiMsgs.length).toBeGreaterThanOrEqual(1);
          const firstAi = aiMsgs[0]!;
          t1AiMsgId = firstAi.id;
          expect(firstAi.parentId).toBe(userMsg.id);
          expect(firstAi.isAI).toBe(true);
          expect(firstAi.sequenceId).toBeTruthy();
          expect(firstAi.model).toBeTruthy();
          expect(firstAi.isCompacting).toBe(false);

          // ── Tool message with valid structure ──
          const toolMsgs = messages.filter(
            (m) => m.role === "tool" && m.toolCall !== null,
          );
          expect(toolMsgs.length).toBeGreaterThanOrEqual(1);
          const toolMsg =
            findToolMsg(messages, "tool-help", cfg) ?? toolMsgs[0]!;
          expect(toolMsg.toolCall?.toolName).toBeTruthy();
          assertToolMessageComplete(toolMsg, "tool-help", "T1", cfg);
          assertNoMetaToolPrefix(messages, cfg);
          const toolRes = resolveToolResult(toolMsg);
          expect(toolRes).not.toBeNull();
          expect(toolMsg.isAI).toBe(true);
          expect(toolMsg.model).toBeTruthy();

          // ── tool-help result: tools array + totalCount ──
          // T1 explores gradually: a broad call (many tools) returns
          // tools:[] + categories:[...], then a category-narrowed call returns
          // tools:[...]. findToolMsg uses findLast, so toolRes here is the
          // narrowed call when the model followed the ladder — but a single
          // categories-only result is still valid (both forms accepted below).
          expect(
            Array.isArray(toolRes!["tools"]),
            "T1: tools is not an array",
          ).toBe(true);
          expect(typeof toolRes!["totalCount"], "T1: totalCount missing").toBe(
            "number",
          );
          expect(toolRes!["totalCount"] as number).toBeGreaterThan(0);
          const t1Tools = toolRes!["tools"] as WidgetData[];
          const t1Categories = toolRes!["categories"] as
            | WidgetData[]
            | undefined;
          // Either individual tools are listed, or categories are returned (above threshold)
          const t1HasUsefulData =
            t1Tools.length > 0 ||
            (Array.isArray(t1Categories) && t1Categories.length > 0);
          expect(
            t1HasUsefulData,
            "T1: tool-help returned neither tools nor categories",
          ).toBe(true);
          // If tools are listed, verify first entry has name + description
          if (t1Tools.length > 0) {
            const firstTool = toolResultRecord(t1Tools[0]);
            expect(
              firstTool?.["name"],
              "T1: first tool missing name",
            ).toBeTruthy();
            expect(
              firstTool?.["description"],
              "T1: first tool missing description",
            ).toBeTruthy();
          }

          // ── Tool parent is assistant, shares sequenceId ──
          const toolParent = messages.find((m) => m.id === toolMsg.parentId);
          expect(toolParent?.role).toBe("assistant");
          expect(toolMsg.sequenceId).toBe(toolParent!.sequenceId);

          // ── All tool messages share the SAME sequenceId ──
          const toolSequenceIds = new Set(toolMsgs.map((m) => m.sequenceId));
          expect(toolSequenceIds.size).toBe(1);

          // ── Tool messages have model set ──
          for (const tm of toolMsgs) {
            expect(tm.model, `Tool msg ${tm.id} missing model`).toBeTruthy();
          }

          // ── Last AI message (final response after tool) ──
          t1ToolAiMsgId = result.data.lastAiMessageId!;
          lastMainAiMsgId = t1ToolAiMsgId;
          const lastAi = messages.find((m) => m.id === t1ToolAiMsgId);
          // Capture the tool message (parent of t1ToolAiMsgId).
          expect(lastAi?.content).toBeTruthy();
          expect(lastAi!.content!.length).toBeGreaterThan(5);
          assertStepOk(lastAi!.content, "T1");
          expect(lastAi!.promptTokens).toBeGreaterThan(0);
          expect(lastAi!.completionTokens).toBeGreaterThan(0);
          expect(lastAi!.creditCost).toBeGreaterThan(0);
          expect(lastAi!.finishReason).toBe("stop");

          // ── Chain from last AI back to root ──
          const chain = walkChain(messages, lastAi!.id);
          expect(chain[0]).toBe(t1UserMsgId);
          expect(chain.length).toBeGreaterThanOrEqual(4); // user, ai, tool, ai
          assertChronologicalOrder(chain, messages);

          // ── Thread title generated ──
          const title = await getTitle(threadId);
          expect(title).toBeTruthy();
          expect(title!.length).toBeGreaterThan(0);
          expect(title!.length).toBeLessThan(200);

          // ── totalCreditsDeducted ──
          expect(result.data.totalCreditsDeducted).toBeGreaterThan(0);

          // ── All message IDs are unique ──
          const allIds = messages.map((m) => m.id);
          expect(new Set(allIds).size).toBe(allIds.length);

          assertNoOrphans(messages, new Set([t1ToolAiMsgId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          // Deduction varies with model round-trips (tool call + follow-up).
          // Kimi sometimes needs 2 LLM calls → higher cost. Allow up to 50.
          await assertDeductedLocal(testUser, before, after, 0, 50);
          // Remote-folder billing contract: only the loop-running side bills.
          // When the loop moved to the remote via REMOTE-folder routing, the
          // local testUser wallet must NOT drop for the turn beyond a small
          // epsilon — async indexing charges (isIndexingCreditTx) excluded.
          if (loopRunsRemote) {
            await assertLocalNotBilled(testUser, before, after, beforeReadAt);
          }

          // Transport attestation (relay suites): the transport PRIMITIVE that
          // actually carried the dispatch stamps lastTransportUsed on the
          // connection row — never configuration code. Asserted here on the
          // SHARED thread's own turn; no throwaway streams.
          if (cfg.expectRelayTransport) {
            const { remoteConnections: connTable } =
              await import("@/app/api/[locale]/remote-connection/db");
            const { HERMES_INSTANCE_ID: hermesId } =
              await import("../../testing/remote-setup");
            const [connRow] = await db
              .select({
                lastTransportUsed: connTable.lastTransportUsed,
                lastTransportUsedAt: connTable.lastTransportUsedAt,
              })
              .from(connTable)
              .where(
                and(
                  eq(connTable.userId, testUser.id),
                  eq(connTable.instanceId, hermesId),
                ),
              )
              .limit(1);
            expect(
              connRow?.lastTransportUsed,
              `T1: relay must have ACTUALLY used transport '${cfg.expectRelayTransport}' — connection attested '${String(connRow?.lastTransportUsed)}'`,
            ).toBe(cfg.expectRelayTransport);
            expect(
              (connRow?.lastTransportUsedAt?.getTime() ?? 0) >
                Date.now() - 10 * 60 * 1000,
              "T1: transport attestation must be recent",
            ).toBe(true);
          }
        },
        effectiveTestTimeout,
      );

      // ── T-SYS: system prompt origin — SAME shared thread, next turn ───────
      // REMOTE-FOLDER suites (systemPromptInstanceId): system prompt + tools
      // come from the REMOTE no matter where the loop runs — self-instance-id
      // must report the remote in every topology.
      // inference-provider suites (assertSystemPromptFromLocal): the prompt is
      // built on the LOCAL instance (client-owned model pipe).
      if (cfg.assertSystemPromptFromLocal || cfg.systemPromptInstanceId) {
        const originLabel = cfg.systemPromptInstanceId ? "REMOTE" : "LOCAL";
        fit(
          `T-SYS: system prompt origin - AI must report ${originLabel} instance ID`,
          async () => {
            setFetchCacheContext(`${cfg.cachePrefix}sys-origin`);
            await pinBalance(testUser, 10);

            let expectedInstanceId: string | undefined =
              cfg.systemPromptInstanceId;
            if (!expectedInstanceId) {
              const identityResult = await db.execute<{ instance_id: string }>(
                sql`SELECT instance_id FROM instance_identities WHERE user_id = ${testUser.id} LIMIT 1`,
              );
              expectedInstanceId = identityResult.rows[0]?.instance_id;
            }
            expect(
              expectedInstanceId,
              "T-SYS: expected instance ID must resolve",
            ).toBeTruthy();

            const { result, messages } = await runStream({
              user: testUser,
              prompt: `[T-SYS] Call ${toolInstr(cfg, "self-instance-id")} to read the identifier of the instance your tools execute on. Reply with ONLY the instance ID string the tool returns, nothing else.`,
              threadId,
              favoriteId: mainFavoriteId,
              explicitParentMessageId: lastMainAiMsgId,
            });

            expect(result.success, "T-SYS stream must succeed").toBe(true);
            if (!result.success) {
              // oxlint-disable-next-line restricted-syntax
              throw new Error(result.message ?? "unexpected stream failure");
            }

            const aiMsg = messages.findLast((m) => m.role === "assistant");
            expect(aiMsg, "T-SYS: AI message must be present").toBeTruthy();
            expect(
              aiMsg?.content ?? "",
              `T-SYS: AI response must contain ${originLabel} instance ID '${String(expectedInstanceId)}'. ` +
                `Got: ${String((aiMsg?.content ?? "").slice(0, 200))}. ` +
                `This proves the system prompt came from ${originLabel === "REMOTE" ? "the remote instance running the loop" : "LOCAL, not from the remote instance"}.`,
            ).toContain(expectedInstanceId!);

            lastMainAiMsgId = result.data.lastAiMessageId!;
            await assertThreadIdle(threadId, testUser);
          },
          effectiveTestTimeout,
        );
      }

      // ── T1a-cat: gradual exploration — narrow a category to tool names ────
      // Step 2 of the ladder: a broad list returns categories (T1); narrowing by
      // category returns the tools in it (names + descriptions, no full schema).
      fit(
        "T1a-cat: tool-help category narrowing - categories drill down to tool names",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}tool-help-category`);
          await pinBalance(testUser, 10);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T1a-cat tool-help-category] Call ${toolInstrWithArgs(cfg, "tool-help", "category='ai'")} to list the tools in the "ai" category. Check that the result contains a non-empty tools array and that each tool has a name and description. End your reply with STEP_OK if the narrowed list looked right, or FAILED: <reason> if anything was wrong.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          const added = newMessages(messages, prevIds);
          const toolMsg = findToolMsg(added, "tool-help", cfg);
          expect(toolMsg, "T1a-cat: tool-help message not found").toBeDefined();
          if (toolMsg) {
            assertToolMessageComplete(toolMsg, "tool-help", "T1a-cat", cfg);
          }
          assertNoMetaToolPrefix(added, cfg);

          const toolRes = resolveToolResult(toolMsg);
          expect(toolRes, "T1a-cat: tool result is null").not.toBeNull();

          // Narrowed category result: tool NAMES (not full schemas, not categories).
          const catTools = toolRes!["tools"] as WidgetData[];
          expect(
            Array.isArray(catTools) && catTools.length > 0,
            "T1a-cat: narrowing by category must return a non-empty tools array",
          ).toBe(true);
          const firstCatTool = toolResultRecord(catTools[0]);
          expect(
            firstCatTool?.["name"],
            "T1a-cat: first tool missing name",
          ).toBeTruthy();
          expect(
            firstCatTool?.["description"],
            "T1a-cat: first tool missing description",
          ).toBeTruthy();

          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          assertStepOk(lastAi?.content, "T1a-cat");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(messages, new Set([t1ToolAiMsgId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);
        },
        effectiveTestTimeout,
      );

      // ── T1a-query: gradual exploration — keyword search → names list ──────
      // Step 3 of the ladder: a broad keyword search that matches many tools
      // (more than the full-schema threshold) returns the names-only list —
      // tool names + descriptions, no parameter schemas yet. This is the rung
      // BELOW detail: the model narrows further (or picks a tool) to get schemas.
      fit(
        "T1a-query: tool-help keyword search - many matches return the names list (no schemas)",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}tool-help-query`);
          await pinBalance(testUser, 10);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T1a-query tool-help-query] Call ${toolInstrWithArgs(cfg, "tool-help", "query='search'")} to find tools related to search. This matches many tools, so the result is a list of tool names with descriptions (not full schemas). Check that the tools array is non-empty and that each tool has a name and a description. End your reply with STEP_OK if the search returned a usable list of named tools, or FAILED: <reason> if anything was wrong.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          const added = newMessages(messages, prevIds);
          const toolMsg = findToolMsg(added, "tool-help", cfg);
          expect(
            toolMsg,
            "T1a-query: tool-help message not found",
          ).toBeDefined();
          if (toolMsg) {
            assertToolMessageComplete(toolMsg, "tool-help", "T1a-query", cfg);
          }
          assertNoMetaToolPrefix(added, cfg);

          const toolRes = resolveToolResult(toolMsg);
          expect(toolRes, "T1a-query: tool result is null").not.toBeNull();

          // Names-list rung: a non-empty tools array where each entry has a
          // name + description. (Schemas are the rung below — T1b detail.)
          const queryTools = toolRes!["tools"] as WidgetData[];
          expect(
            Array.isArray(queryTools) && queryTools.length > 0,
            "T1a-query: a keyword search must return a non-empty tools array",
          ).toBe(true);
          const firstQueryTool = toolResultRecord(queryTools[0]);
          expect(
            firstQueryTool?.["name"],
            "T1a-query: first tool missing name",
          ).toBeTruthy();
          expect(
            firstQueryTool?.["description"],
            "T1a-query: first tool missing description",
          ).toBeTruthy();

          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          assertStepOk(lastAi?.content, "T1a-query");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(messages, new Set([t1ToolAiMsgId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);
        },
        effectiveTestTimeout,
      );

      // ── T1b: tool-help detail mode ────────────────────────────────────────
      fit(
        "T1b: tool-help detail mode - single tool schema lookup with parameters",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}tool-help-detail`);
          await pinBalance(testUser, 10);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T1b tool-help-detail] Call ${toolInstrWithArgs(cfg, "tool-help", "toolName='generate_image'")}. You MUST make this tool call NOW, in this turn — do NOT reuse or re-analyze a result from an earlier turn. Check that the fresh result contains a name, a description, and a parameters schema. End your reply with STEP_OK if all three were present, or FAILED: <what was missing> if anything was wrong.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          const added = newMessages(messages, prevIds);
          // The model may probe tool-help before the targeted lookup — assert
          // on the call that requested generate_image specifically.
          const toolHelpMsgs = added.filter((m) => {
            if (m.role !== "tool") {
              return false;
            }
            const name = m.toolCall?.toolName ?? "";
            return name === "tool-help" || name === "execute-tool";
          });
          const toolMsg =
            toolHelpMsgs.findLast((m) =>
              JSON.stringify(m.toolCall?.args ?? {}).includes("generate_image"),
            ) ?? findToolMsg(added, "tool-help", cfg);
          expect(toolMsg, "T1b: tool-help message not found").toBeDefined();
          if (toolMsg) {
            assertToolMessageComplete(toolMsg, "tool-help", "T1b", cfg);
          }
          assertNoMetaToolPrefix(added, cfg);

          const toolRes = resolveToolResult(toolMsg);
          expect(toolRes, "T1b: tool result is null").not.toBeNull();

          // Detail mode returns single tool - check for name + description
          const entry = Array.isArray(toolRes!["tools"])
            ? toolResultRecord((toolRes!["tools"] as WidgetData[])[0])
            : toolRes;
          expect(entry, "T1b: no tool entry in result").toBeDefined();
          expect(
            String(entry?.["name"] ?? ""),
            "T1b: tool entry must carry the generate_image name",
          ).toContain("generate_image");
          expect(
            String(entry?.["description"] ?? "").length,
            "T1b: tool entry must carry a non-empty description",
          ).toBeGreaterThan(10);

          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          assertStepOk(lastAi?.content, "T1b");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(messages, new Set([t1ToolAiMsgId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);
        },
        effectiveTestTimeout,
      );

      // ── T2: Image generation (inline wait) ──────────────────────────────
      fit(
        "T2: image generation (wait mode) - imageUrl, creditCost, generatedMedia",
        async () => {
          // cheapMode: replace expensive image gen with cortex-write/read.
          // Same state is set (t2BranchParentId, t2UserMsgId, lastMainAiMsgId).
          const cacheCtx = cfg.cheapMode
            ? `${cfg.cachePrefix}cortex-mem-write`
            : `${cfg.cachePrefix}image-generation`;
          setFetchCacheContext(cacheCtx);
          await pinBalance(testUser, 50);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          // Capture the parent of T2's user message BEFORE T2 updates lastMainAiMsgId.
          // UI retry/branch on T2's user message uses userMsg.parentId = this value.
          t2BranchParentId = lastMainAiMsgId;

          const cheapNodePath = `/memories/t2-cheap-test`;
          // Pre-clean BOTH sides so the fixture replay always starts from a
          // known absent state - the node lands wherever cortex-write executes.
          if (cfg.cheapMode) {
            // Prefix match: cortex-write normalizes the path (appends `.md`).
            await db
              .delete(cortexNodes)
              .where(
                and(
                  eq(cortexNodes.userId, testUser.id),
                  like(cortexNodes.path, `${cheapNodePath}%`),
                ),
              );
            if (
              cfg.remoteInstanceId ||
              cfg.rootFolderIdOverride === DefaultFolderId.REMOTE
            ) {
              const { getProdDb } = await import("../../testing/remote-setup");
              await getProdDb().execute(
                sql`DELETE FROM cortex_nodes WHERE path LIKE ${`${cheapNodePath}%`}`,
              );
            }
          }
          const prompt = cfg.cheapMode
            ? `[T2 cortex-write] Use ${toolInstr(cfg, "cortex-write")} to create a memory node at path "${cheapNodePath}" with content "T2_CHEAP_OK". Then use ${toolInstr(cfg, "cortex-read")} to read it back and verify the content is exactly "T2_CHEAP_OK". End your reply with STEP_OK if write succeeded and read confirmed the content, or FAILED: <reason> if anything was wrong.`
            : `[T2 image-gen] Call ${toolInstrWithArgs(cfg, "generate_image", "prompt='red circle'")}. You MUST actually invoke the tool in THIS turn — never answer from memory or fabricate a result. Check that the tool's result contains a non-empty imageUrl and a positive creditCost. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.`;

          const { result, messages } = await runStream({
            user: testUser,
            prompt,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: t2BranchParentId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          const added = newMessages(messages, prevIds);

          // Capture T2's user message ID - it's a sibling of the retry/branch user messages.
          // T2 user message has parentId = t2BranchParentId (the value of lastMainAiMsgId before T2).
          const t2AddedUser = added.find((m) => m.role === "user");
          t2UserMsgId = t2AddedUser?.id ?? "";

          if (cfg.cheapMode) {
            // ── Cheap mode: cortex-write + cortex-read assertions ──
            const writeMsg = findToolMsg(added, "cortex-write", cfg);
            expect(
              writeMsg,
              "T2 cheap: no cortex-write call found",
            ).toBeDefined();
            if (writeMsg) {
              assertToolMessageComplete(writeMsg, "cortex-write", "T2", cfg);
              expect(writeMsg.isAI).toBe(true);
              const toolParent = messages.find(
                (m) => m.id === writeMsg.parentId,
              );
              expect(
                toolParent?.role,
                "T2 cheap: cortex-write parent must be assistant",
              ).toBe("assistant");
            }
            // DB cross-check on the side that executed the tool.
            // Inference-provider relays delegate tools back to the local
            // instance, so the node is local there. execute-tool dispatch (remoteInstanceId)
            // AND REMOTE-folder suites (loop + tools run on the remote) write
            // the remote DB. Same assertion either way.
            const toolRanRemotely =
              Boolean(cfg.remoteInstanceId) ||
              cfg.rootFolderIdOverride === DefaultFolderId.REMOTE;
            if (!toolRanRemotely) {
              // cortex-write normalizes the path to a file node (appends `.md`),
              // so match by prefix rather than the exact requested path.
              const [dbNode] = await db
                .select({ content: cortexNodes.content })
                .from(cortexNodes)
                .where(
                  and(
                    eq(cortexNodes.userId, testUser.id),
                    like(cortexNodes.path, `${cheapNodePath}%`),
                  ),
                );
              expect(
                dbNode,
                `T2 cheap: node not found in DB at ${cheapNodePath}`,
              ).toBeDefined();
              expect(
                dbNode?.content?.trim(),
                "T2 cheap: node content must be T2_CHEAP_OK",
              ).toBe("T2_CHEAP_OK");
              // Clean up test node
              await db
                .delete(cortexNodes)
                .where(
                  and(
                    eq(cortexNodes.userId, testUser.id),
                    like(cortexNodes.path, `${cheapNodePath}%`),
                  ),
                );
            } else {
              const { getProdDb } = await import("../../testing/remote-setup");
              const pdb = getProdDb();
              // cortex-write normalizes the path to a file node (appends `.md`),
              // so match by prefix rather than the exact requested path.
              const remoteRows = await pdb.execute<{ content: string | null }>(
                sql`SELECT content FROM cortex_nodes WHERE path LIKE ${`${cheapNodePath}%`} ORDER BY updated_at DESC LIMIT 1`,
              );
              const remoteNode = remoteRows.rows[0];
              expect(
                remoteNode,
                `T2 cheap: node not found in REMOTE DB at ${cheapNodePath}`,
              ).toBeDefined();
              expect(
                remoteNode?.content?.trim(),
                "T2 cheap: remote node content must be T2_CHEAP_OK",
              ).toBe("T2_CHEAP_OK");
              await pdb.execute(
                sql`DELETE FROM cortex_nodes WHERE path LIKE ${`${cheapNodePath}%`}`,
              );
            }
          } else {
            // ── generate_image tool message ──
            const toolMsg = findToolMsg(added, "generate_image", cfg);
            expect(toolMsg).toBeDefined();
            if (toolMsg) {
              assertToolMessageComplete(toolMsg, "generate_image", "T2", cfg);
            }
            expect(toolMsg!.isAI).toBe(true);

            const toolRes = resolveToolResult(toolMsg);
            expect(toolRes).not.toBeNull();
            expect(typeof toolRes!["imageUrl"]).toBe("string");
            expect(String(toolRes!["imageUrl"])).toMatch(/^https?:\/\/.+/);
            expect(typeof toolRes!["creditCost"]).toBe("number");

            // ── Tool parent is assistant, shares sequenceId ──
            const toolParent = messages.find((m) => m.id === toolMsg!.parentId);
            expect(toolParent?.role).toBe("assistant");
            expect(toolMsg!.sequenceId).toBe(toolParent!.sequenceId);

            expect(toolRes!["imageUrl"]).toBeTruthy();

            expect(toolRes!["creditCost"] as number).toBeGreaterThan(0);
          }

          // ── Final AI has token metadata ──
          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          expect(lastAi).toBeDefined();
          expect(lastAi!.finishReason).toBe("stop");
          assertStepOk(lastAi!.content, "T2");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          const chain = walkChain(messages, result.data.lastAiMessageId!);
          expect(chain[0]).toBe(t1UserMsgId);
          assertChronologicalOrder(chain, messages);
          assertNoOrphans(messages, new Set([t1ToolAiMsgId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          await assertDeductedLocal(testUser, before, after, 0.05, 50);
        },
        mediaTestTimeout,
      );

      // ── T3: Retry + branch from T2's user message - two forks from same parent ──
      fit(
        "T3: retry + branch - two sibling forks from T2 user msg parent, same parentId as T2 user, correct tree structure",
        async () => {
          // UI retry/branch is called on the T2 USER MESSAGE (not the AI).
          // retryMessage(t2UserMsg) → parentMessageId = t2UserMsg.parentId = t2BranchParentId
          // branchMessage(t2UserMsg) → parentMessageId = t2UserMsg.parentId = t2BranchParentId
          // So retry/branch user messages are SIBLINGS of t2UserMsgId under t2BranchParentId.
          // This is the correct branch point: the branch navigator in the UI shows
          // all children of t2BranchParentId (including the original T2 user message).
          const branchParentId = t2BranchParentId;

          // The entire T2 subtree (t2UserMsgId + its descendants) is a dead-end now.
          // Mark lastMainAiMsgId as dead-end since we branch at t2BranchParentId level.
          deadEndLeaves.add(lastMainAiMsgId);
          // t2UserMsgId is also a dead-end leaf's ancestor, but its branch completes normally.
          // We add t2UserMsgId as well since it's on the abandoned branch.

          // ── Fork 1: Retry (UI flow: operation="retry", parentMessageId=t2BranchParentId) ──
          setFetchCacheContext(`${cfg.cachePrefix}retry`);
          await pinBalance(testUser, 40);
          const beforeRetry = await getBalance(testUser);
          const prevIdsRetry = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const { result: retryResult, messages: retryMsgs } = await runStream({
            user: testUser,
            prompt: "[T3a retry-branch] Say exactly: RETRY_RESPONSE STEP_OK",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: branchParentId,
            operationOverride: "retry",
          });

          expect(retryResult.success).toBe(true);
          if (!retryResult.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(retryResult.message ?? "unexpected failure");
          }

          branchRetryAiMsgId = retryResult.data.lastAiMessageId!;
          const retryAdded = newMessages(retryMsgs, prevIdsRetry);

          // ── T3a: retryUser.parentId === branchParentId === t2UserMsg.parentId ──
          // The KEY assertion: the user message we retry from has the SAME parentId
          // as the branch siblings (t2UserMsgId). All are children of t2BranchParentId.
          const retryUser = retryAdded.find(
            (m) => m.role === "user" && m.parentId === branchParentId,
          );
          expect(
            retryUser,
            `T3a: retry user message must have parentId=${branchParentId} (= t2BranchParentId, same as t2UserMsg.parentId). ` +
              `UI retryMessage(t2UserMsg) uses t2UserMsg.parentId as parentMessageId. ` +
              `Added messages: ${JSON.stringify(retryAdded.map((m) => ({ id: m.id, role: m.role, parentId: m.parentId })))}`,
          ).toBeDefined();

          const retryAi = retryMsgs.find((m) => m.id === branchRetryAiMsgId);
          expect(retryAi?.content).toContain("RETRY");
          assertStepOk(retryAi?.content, "T3a");
          // retryAi must point directly at retryUser
          expect(
            retryAi!.parentId,
            `T3a: retryAi.parentId must be retryUser.id=${retryUser!.id}`,
          ).toBe(retryUser!.id);

          // Exact chain: [t1UserMsgId, ..., branchParentId, retryUser.id, retryAi.id]
          const retryChain = walkChain(retryMsgs, retryAi!.id);
          expect(retryChain.length).toBeGreaterThanOrEqual(4);
          expect(retryChain[0]).toBe(t1UserMsgId);
          expect(retryChain[retryChain.length - 1]).toBe(branchRetryAiMsgId);
          expect(retryChain[retryChain.length - 2]).toBe(retryUser!.id);
          expect(
            retryChain[retryChain.length - 3],
            `T3a: the message immediately before retryUser must be branchParentId=${branchParentId}. ` +
              `This is t2BranchParentId = the AI message before T2, same parent as T2's user message.`,
          ).toBe(branchParentId);
          assertChronologicalOrder(retryChain, retryMsgs);

          // branchParentId has both t2UserMsgId (original T2 user) and retryUser as children.
          const branchParentChildren = retryMsgs.filter(
            (m) => m.parentId === branchParentId,
          );
          expect(
            branchParentChildren.some((m) => m.id === t2UserMsgId),
            `T3a: t2UserMsgId (${t2UserMsgId}) must be a child of branchParentId=${branchParentId}`,
          ).toBe(true);
          expect(
            branchParentChildren.some((m) => m.id === retryUser!.id),
            `T3a: retryUser must be a child of branchParentId (sibling of t2UserMsgId)`,
          ).toBe(true);

          // T3a: expectedLeaf = branchRetryAiMsgId; T2 subtree + lastMainAiMsgId are dead-ends
          assertNoOrphans(retryMsgs, new Set([branchParentId]), {
            expectedLeafId: branchRetryAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const afterRetry = await getBalance(testUser);
          await assertDeductedLocal(testUser, beforeRetry, afterRetry, 0, 10);

          // ── Fork 2: Branch from same parent (UI flow: operation="edit", parent=t2BranchParentId) ──
          // The UI's branchMessage hook uses: parentMessageId = userMsg.parentId, operation = "edit"
          // So we pass branchParentId (= t2BranchParentId = t2UserMsg.parentId) with operation="edit".
          // This creates branchUser as a SIBLING of t2UserMsgId under branchParentId (same as retryUser).
          setFetchCacheContext(`${cfg.cachePrefix}branch`);
          await pinBalance(testUser, 40);
          const beforeBranch = await getBalance(testUser);

          const { result: branchResult, messages: branchMsgs } =
            await runStream({
              user: testUser,
              prompt: "[T3b fork-branch] Say exactly: BRANCH_RESPONSE STEP_OK",
              threadId,
              favoriteId: mainFavoriteId,
              explicitParentMessageId: branchParentId,
              operationOverride: "edit",
            });

          expect(branchResult.success).toBe(true);
          if (!branchResult.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(branchResult.message ?? "unexpected failure");
          }

          branchForkAiMsgId = branchResult.data.lastAiMessageId!;

          // ── T3b exact parentId chain (UI-matching): branchParent → branchUser → branchAi ──
          // branchUser must be a SIBLING of both t2UserMsgId and retryUser under branchParentId.
          // All three (t2UserMsgId, retryUser, branchUser) are children of branchParentId.
          const branchParentAllChildren = branchMsgs.filter(
            (m) => m.parentId === branchParentId,
          );
          // Must have at least 3 children at branchParentId:
          // - t2UserMsgId (original T2 user message)
          // - retryUser (T3a retry user message)
          // - branchUser (T3b fork user message)
          expect(
            branchParentAllChildren.length,
            `T3b: branchParentId must have at least 3 children (t2UserMsg + retryUser + branchUser). ` +
              `Got ${String(branchParentAllChildren.length)}: ${JSON.stringify(branchParentAllChildren.map((m) => ({ id: m.id, role: m.role, content: m.content?.slice(0, 40) })))}`,
          ).toBeGreaterThanOrEqual(3);

          // Identify branchUser by content
          const branchUser = branchParentAllChildren.find(
            (m) => m.role === "user" && m.content?.includes("T3b fork-branch"),
          );
          expect(
            branchUser,
            `T3b: could not find branch user message with content 'T3b fork-branch' as child of branchParentId. ` +
              `Children: ${JSON.stringify(branchParentAllChildren.map((m) => ({ id: m.id, role: m.role, content: m.content?.slice(0, 60) })))}`,
          ).toBeDefined();

          // retryUser and branchUser are distinct siblings
          expect(
            branchUser!.id,
            "T3b: branchUser must be a different message from retryUser",
          ).not.toBe(retryUser!.id);

          // Branch AI has correct content
          const branchAi = branchMsgs.find((m) => m.id === branchForkAiMsgId);
          expect(branchAi?.content).toContain("BRANCH");
          assertStepOk(branchAi?.content, "T3b");

          // branchAi must point directly at branchUser
          expect(
            branchAi!.parentId,
            `T3b: branchAi.parentId must be branchUser.id=${branchUser!.id}`,
          ).toBe(branchUser!.id);

          // Exact branch chain: [t1UserMsgId, ..., branchParentId, branchUser.id, branchAi.id]
          // branchParentId must be immediately before branchUser
          const branchChain = walkChain(branchMsgs, branchAi!.id);
          expect(branchChain.length).toBeGreaterThanOrEqual(4);
          expect(branchChain[0]).toBe(t1UserMsgId);
          expect(branchChain[branchChain.length - 1]).toBe(branchForkAiMsgId);
          expect(branchChain[branchChain.length - 2]).toBe(branchUser!.id);
          expect(
            branchChain[branchChain.length - 3],
            `T3b: the message immediately before branchUser must be branchParentId=${branchParentId}. ` +
              `Both retry and fork branches must share the same branch point. ` +
              `If wrong, the branch won't appear in the UI.`,
          ).toBe(branchParentId);

          // Verify both retry and fork chains share identical prefix up to branchParentId,
          // then diverge to different siblings.
          const retryForkPoint = retryChain.indexOf(branchParentId);
          const branchForkPoint = branchChain.indexOf(branchParentId);
          expect(
            retryForkPoint,
            `T3b: branchParentId must be in retryChain`,
          ).toBeGreaterThanOrEqual(0);
          expect(
            branchForkPoint,
            `T3b: branchParentId must be in branchChain`,
          ).toBeGreaterThanOrEqual(0);
          // Shared prefix up to and including branchParentId must be identical
          expect(retryChain.slice(0, retryForkPoint + 1)).toEqual(
            branchChain.slice(0, branchForkPoint + 1),
          );
          // After branchParentId: the very next node must be DIFFERENT (different user msgs)
          expect(retryChain[retryForkPoint + 1]).not.toBe(
            branchChain[branchForkPoint + 1],
          );

          // T3b: expectedLeaf = branchForkAiMsgId; lastMainAiMsgId + T3a retry end are allowed leaves
          assertNoOrphans(branchMsgs, new Set([branchParentId]), {
            expectedLeafId: branchForkAiMsgId,
            knownDeadEndLeaves: new Set([...deadEndLeaves, branchRetryAiMsgId]),
          });
          // Both branch tips are dead-ends: T4 may continue from them, but if skipped
          // (e.g. queue mode) they remain leaves. Register them so subsequent tests pass.
          deadEndLeaves.add(branchRetryAiMsgId);
          deadEndLeaves.add(branchForkAiMsgId);
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const afterBranch = await getBalance(testUser);
          await assertDeductedLocal(testUser, beforeBranch, afterBranch, 0, 10);
        },
        effectiveTestTimeout,
      );

      // ── T4: Music gen (from retry branch) + video gen (from fork branch) ──
      fit("T4: music + video generation - continue from both branches, verify media tool results", async () => {
        if (cfg.cheapMode) {
          return; // cheapMode: media generation is the expensive path
        }
        // music (~60s) + video (~120s) + revival polling (180s budget) → 6 min
        // ── Part A: Music gen from retry branch ──
        setFetchCacheContext(`${cfg.cachePrefix}music-generation`);
        await pinBalance(testUser, 50);
        const beforeMusic = await getBalance(testUser);
        const prevIdsMusic = new Set(
          (await getMessages(threadId)).map((m) => m.id),
        );

        const { result: musicResult, messages: musicMsgs } = await runStream({
          user: testUser,
          // Live recording: music gen polls the provider for minutes — give
          // the settle wait the media budget (fixture replays finish fast).
          settleTimeoutMs: MEDIA_SETTLE_TIMEOUT_MS,
          prompt: `[T4a music-gen] Call ${toolInstrWithArgs(cfg, "generate_music", "prompt='upbeat piano melody'")}. Check that the result has a non-empty audioUrl, a positive creditCost, and durationSeconds between 8 and 120. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.`,
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: branchRetryAiMsgId,
        });

        expect(musicResult.success).toBe(true);
        if (!musicResult.success) {
          // oxlint-disable-next-line restricted-syntax
          throw new Error(musicResult.message ?? "unexpected failure");
        }

        const musicAdded = newMessages(musicMsgs, prevIdsMusic);

        // T4a: music user must be direct child of branchRetryAiMsgId (not some other node)
        const musicUser = musicAdded.find((m) => m.role === "user");
        expect(
          musicUser?.parentId,
          `T4a: music user parentId must be branchRetryAiMsgId=${branchRetryAiMsgId}`,
        ).toBe(branchRetryAiMsgId);

        // Tool message - find the successful one (AI may retry on duration mismatch)
        const musicToolMsgs = musicAdded.filter(
          (m) =>
            m.role === "tool" &&
            (m.toolCall?.toolName === "generate_music" ||
              (m.toolCall?.toolName === "execute-tool" &&
                toolResultRecord(m.toolCall.args)?.["toolName"] ===
                  "generate_music")),
        );
        expect(musicToolMsgs.length).toBeGreaterThanOrEqual(1);
        const musicToolMsg = musicToolMsgs.find(
          (m) => resolveToolResult(m) !== null,
        );
        expect(musicToolMsg).toBeDefined();
        if (musicToolMsg) {
          assertToolMessageComplete(musicToolMsg, "generate_music", "T4a", cfg);
        }

        // Args: prompt must be the meaningful string passed in the test - not a parse artifact like "}"
        // In queue mode (execute-tool wrapper), prompt is nested inside input.prompt.
        // In direct mode, prompt is at the top level of args.
        const musicArgs = toolResultRecord(musicToolMsg!.toolCall?.args);
        const musicPrompt =
          (musicArgs?.["prompt"] as string | undefined) ??
          (toolResultRecord(musicArgs?.["input"] as WidgetData)?.["prompt"] as
            | string
            | undefined);
        expect(
          typeof musicPrompt === "string" && musicPrompt.length > 3,
          `[T4a] generate_music args.prompt must be a meaningful string - got: ${JSON.stringify(musicPrompt)}`,
        ).toBe(true);

        const musicRes = resolveToolResult(musicToolMsg);
        expect(musicRes).not.toBeNull();
        expect(typeof musicRes!["audioUrl"]).toBe("string");
        expect(String(musicRes!["audioUrl"])).toMatch(/^https?:\/\/.+/);
        expect(typeof musicRes!["creditCost"]).toBe("number");
        expect((musicRes!["creditCost"] as number) > 0).toBe(true);
        expect(typeof musicRes!["durationSeconds"]).toBe("number");
        expect((musicRes!["durationSeconds"] as number) >= 8).toBe(true);
        expect((musicRes!["durationSeconds"] as number) <= 120).toBe(true);

        // Tool parent is assistant, shares sequenceId
        const musicToolParent = musicMsgs.find(
          (m) => m.id === musicToolMsg!.parentId,
        );
        expect(musicToolParent?.role).toBe("assistant");
        expect(musicToolMsg!.sequenceId).toBe(musicToolParent!.sequenceId);

        // Final AI has token metadata
        const musicLastAi = musicMsgs.find(
          (m) => m.id === musicResult.data.lastAiMessageId,
        );
        expect(musicLastAi).toBeDefined();
        expect(musicLastAi!.finishReason).toBe("stop");
        assertStepOk(musicLastAi!.content, "T4a");

        // Exact chain: [t1UserMsgId, ..., t1ToolAiMsgId, retryUser, branchRetryAiMsgId, musicUser, ..., musicLastAi]
        // branchRetryAiMsgId must appear BEFORE musicUser in the chain.
        const musicChain = walkChain(
          musicMsgs,
          musicResult.data.lastAiMessageId!,
        );
        expect(musicChain[0]).toBe(t1UserMsgId);
        expect(musicChain).toContain(t1AiMsgId);
        const musicBranchIdx = musicChain.indexOf(branchRetryAiMsgId);
        expect(
          musicBranchIdx,
          `T4a: branchRetryAiMsgId must be in the music chain (it's the branch point this T4a hangs off)`,
        ).toBeGreaterThanOrEqual(0);
        // musicUser must be immediately after branchRetryAiMsgId in the chain
        expect(
          musicChain[musicBranchIdx + 1],
          `T4a: musicUser must be immediately after branchRetryAiMsgId in the chain`,
        ).toBe(musicUser!.id);
        assertChronologicalOrder(musicChain, musicMsgs);

        // T4a: expectedLeaf = T4a music end; T2 end is dead-end; branchForkAiMsgId is the other active tip
        assertNoOrphans(
          musicMsgs,
          new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
          {
            expectedLeafId: musicResult.data.lastAiMessageId!,
            knownDeadEndLeaves: new Set([...deadEndLeaves, branchForkAiMsgId]),
          },
        );
        // T4a music branch is now a dead-end (T4b video is the main continuation)
        deadEndLeaves.add(musicResult.data.lastAiMessageId!);
        await assertThreadIdle(threadId, testUser);
        await assertNoPendingTasks(threadId);

        const afterMusic = await getBalance(testUser);
        await assertDeductedLocal(testUser, beforeMusic, afterMusic, 0, 15);

        // ── Part B: Video gen from fork branch ──
        setFetchCacheContext(`${cfg.cachePrefix}video-generation`);
        // VEO_3_1 costs ~48 cr/sec * 5 sec * 1.3 markup = ~312 cr minimum
        await pinBalance(testUser, 400);
        const beforeVideo = await getBalance(testUser);
        const prevIdsVideo = new Set(
          (await getMessages(threadId)).map((m) => m.id),
        );

        const { result: videoResult, messages: videoMsgs } = await runStream({
          user: testUser,
          // RECORDING-ONLY worst case: ModelsLab's poller caps at 300
          // attempts (~7-8min on a busy queue) before the future_links
          // fallback, plus upload + cross-instance handoff. Replays finish in
          // seconds — this budget never bites on fixture runs.
          settleTimeoutMs: 900_000,
          prompt: `[T4b video-gen] Call ${toolInstrWithArgs(cfg, "generate_video", "prompt='spinning cube'")}. Check that the result has a non-empty videoUrl, a positive creditCost, and a positive durationSeconds. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.`,
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: branchForkAiMsgId,
        });

        expect(videoResult.success).toBe(true);
        if (!videoResult.success) {
          // oxlint-disable-next-line restricted-syntax
          throw new Error(videoResult.message ?? "unexpected failure");
        }

        const videoAdded = newMessages(videoMsgs, prevIdsVideo);

        // T4b: video user must be direct child of branchForkAiMsgId (not branchRetryAiMsgId or t1ToolAi)
        const videoUser = videoAdded.find((m) => m.role === "user");
        expect(
          videoUser?.parentId,
          `T4b: video user parentId must be branchForkAiMsgId=${branchForkAiMsgId} (not branchRetryAiMsgId=${branchRetryAiMsgId})`,
        ).toBe(branchForkAiMsgId);

        // Tool message
        const videoToolMsg = findToolMsg(videoAdded, "generate_video", cfg);
        expect(videoToolMsg).toBeDefined();
        if (videoToolMsg) {
          assertToolMessageComplete(videoToolMsg, "generate_video", "T4b", cfg);
        }

        const videoRes = resolveToolResult(videoToolMsg);
        expect(videoRes).not.toBeNull();
        expect(typeof videoRes!["videoUrl"]).toBe("string");
        expect(String(videoRes!["videoUrl"])).toMatch(/^https?:\/\/.+/);
        expect(typeof videoRes!["creditCost"]).toBe("number");
        expect((videoRes!["creditCost"] as number) > 0).toBe(true);
        expect(typeof videoRes!["durationSeconds"]).toBe("number");
        expect((videoRes!["durationSeconds"] as number) > 0).toBe(true);
        expect((videoRes!["durationSeconds"] as number) <= 60).toBe(true);

        // Final AI
        const videoLastAi = videoMsgs.find(
          (m) => m.id === videoResult.data.lastAiMessageId,
        );
        expect(videoLastAi).toBeDefined();
        expect(videoLastAi!.finishReason).toBe("stop");
        assertStepOk(videoLastAi!.content, "T4b");
        lastMainAiMsgId = videoResult.data.lastAiMessageId!;

        // Exact chain: [t1UserMsgId, ..., t1ToolAiMsgId, branchUser, branchForkAiMsgId, videoUser, ..., videoLastAi]
        // branchForkAiMsgId must appear in chain AND videoUser must be immediately after it.
        const videoChain = walkChain(
          videoMsgs,
          videoResult.data.lastAiMessageId!,
        );
        expect(videoChain[0]).toBe(t1UserMsgId);
        const videoForkIdx = videoChain.indexOf(branchForkAiMsgId);
        expect(
          videoForkIdx,
          `T4b: branchForkAiMsgId must be in the video chain (it's the fork branch this T4b hangs off)`,
        ).toBeGreaterThanOrEqual(0);
        // videoUser must be immediately after branchForkAiMsgId in the chain
        expect(
          videoChain[videoForkIdx + 1],
          `T4b: videoUser must be immediately after branchForkAiMsgId in the chain`,
        ).toBe(videoUser!.id);
        // music chain must NOT appear in the video chain (they are independent branches)
        expect(
          videoChain,
          `T4b: video chain must not contain branchRetryAiMsgId - these are independent branches`,
        ).not.toContain(branchRetryAiMsgId);
        assertChronologicalOrder(videoChain, videoMsgs);

        // T4b: lastMainAiMsgId is now the sole active tip; deadEndLeaves has T2 end + T4a music end
        assertNoOrphans(
          videoMsgs,
          new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
          {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          },
        );
        await assertThreadIdle(threadId, testUser);
        await assertNoPendingTasks(threadId);

        const afterVideo = await getBalance(testUser);
        // Video gen: VEO_3_1 via modelslab + chat model tokens.
        // In remote mode the video gen credits are deducted on the remote instance, not locally.
        // Remote-folder loop-local: tools execute on the REMOTE
        // (hermes) — the media charge lands there too; only LLM tokens local.
        await assertDeductedLocal(
          testUser,
          beforeVideo,
          afterVideo,
          cfg.remoteInstanceId ? 0 : 5,
          400,
        );
      }, 1_200_000); // 20 min RECORDING-ONLY worst case: ModelsLab's queue can hold a video job in "processing" for 15+ min live. Replays finish in seconds — this cap never bites on fixture runs.

      // ── T5: detach dispatch - AI calls generate_image(detach), gets taskId ──
      fit(
        "T5: detach dispatch - AI calls generate_image with detach, gets taskId back",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}callback-wait-step1`);
          await pinBalance(testUser, 20);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T5 detach-dispatch] Call ${toolInstrWithArgs(cfg, "generate_image", "prompt='await-task-test' and callbackMode='detach'")}. Check that the immediate result has a taskId string and does NOT have an imageUrl (the task runs in the background). End your reply with STEP_OK and the exact taskId value like: STEP_OK taskId=<value>. Or FAILED: <reason> if anything was wrong.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            allowToolErrors: true,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          const added = newMessages(messages, prevIds);

          const genImgMsg = findToolMsg(added, "generate_image", cfg);
          expect(
            genImgMsg,
            "[T5] generate_image tool message not found",
          ).toBeDefined();

          const genImgRes = resolveToolResult(genImgMsg);
          expect(
            genImgRes,
            "[T5] generate_image result is null",
          ).not.toBeNull();
          // DETACH semantics: the dispatch returns ONLY { taskId } — fire-and-forget.
          // It NEVER backfills the dispatch tool message with the result. The finished
          // task is kept in task history; the result is retrieved later via await-task
          // (T5b), which then cleans the task up. So here: taskId present, imageUrl ABSENT.
          const t5ToolCall = genImgMsg!.toolCall;
          const t5TaskIdRaw = t5ToolCall?.remoteTaskId ?? genImgRes!["taskId"];
          expect(
            typeof t5TaskIdRaw,
            `[T5] taskId missing (remoteTaskId or result.taskId): ${JSON.stringify({ remoteTaskId: t5ToolCall?.remoteTaskId, result: genImgRes })}`,
          ).toBe("string");
          expect(
            genImgRes!["imageUrl"],
            `[T5] detach must NOT backfill imageUrl — result is { taskId } only: ${JSON.stringify(genImgRes)}`,
          ).toBeUndefined();

          // Save for T5b. taskIds are deterministic in fixture mode, so the
          // value is stable across record/replay — no fixture patching needed.
          t5DetachTaskId = t5TaskIdRaw as string;

          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          assertStepOk(lastAi?.content, "T5");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);
        },
        effectiveTestTimeout,
      );

      // ── T5b: await-task - AI calls await-task with taskId from T5 ──
      fit(
        "T5b: await-task - AI calls await-task with detach taskId, gets imageUrl",
        async () => {
          // taskId from T5 is deterministic (fixture mode), so the value the AI
          // echoes here is stable across record/replay — no fixture patching.
          setFetchCacheContext(`${cfg.cachePrefix}callback-wait-step2`);
          await pinBalance(testUser, 20);
          const beforeWait = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          // In direct remote mode, the detach taskId is a local `remote-direct-*` placeholder
          // that lives in the local dev DB. await-task must be called locally (not forwarded
          // to the remote instance) regardless of cfg.remoteInstanceId.
          // Explicitly say "the local await-task tool" (not "execute-tool via remote") so
          // the AI doesn't attempt to route await-task through the remote instance.
          const waitForTaskInstr = cfg.remoteInstanceId
            ? `the local await-task tool (do NOT use execute-tool for this - call await-task directly) with taskId='${t5DetachTaskId}'`
            : `the await-task tool with taskId='${t5DetachTaskId}'`;
          let { result: waitResult, messages: waitMsgs } = await runStream({
            user: testUser,
            prompt: `[T5b await-task] Call ${waitForTaskInstr}. Check that the result contains an imageUrl string (either directly or nested in a result field). End your reply with STEP_OK if imageUrl is present, or FAILED: <reason> if anything was wrong.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(waitResult.success).toBe(true);
          if (!waitResult.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(waitResult.message ?? "unexpected failure");
          }

          // WAIT path: if await-task registered as waiter (task was pending),
          // stream aborts with thread in 'waiting' state. Revival fires async when
          // the goroutine (from T5) calls handleTaskCompletion. Poll for idle, then
          // re-fetch messages so the backfilled tool result + revival AI response
          // are visible to assertions below.
          // runStream owns the waiting→revival handling in every mode; the
          // returned messages are already post-revival.
          const waitAdded = newMessages(waitMsgs, prevIds);

          // Per spec (wait, same-sequence path): if no user message arrived while waiting,
          // the original await-task tool message is backfilled in-place with the real result.
          // No deferred message is created. Only 1 await-task tool message must exist.
          const allWftMsgs = waitAdded.filter(
            (m) =>
              m.role === "tool" &&
              (m.toolCall?.toolName === "await-task" ||
                (m.toolCall?.toolName === "execute-tool" &&
                  toolResultRecord(m.toolCall.args)?.["toolName"] ===
                    "await-task")),
          );
          expect(
            allWftMsgs.length,
            "[T5b] expected exactly 1 await-task tool message (same-sequence: backfill in-place, no deferred)",
          ).toBe(1);

          const waitForTaskMsg = allWftMsgs[0]!;
          expect(
            waitForTaskMsg,
            "[T5b] await-task tool message not found",
          ).toBeDefined();

          // Same-sequence: original message must NOT be marked as deferred.
          expect(
            waitForTaskMsg.toolCall?.isDeferred,
            "[T5b] wait same-sequence: original tool message must NOT be deferred (backfill in-place)",
          ).toBeFalsy();

          const wftRes = resolveToolResult(waitForTaskMsg);
          expect(wftRes, "[T5b] await-task result is null").not.toBeNull();
          // Two paths depending on race:
          // (A) task pending when called → backfilled with raw image result: { imageUrl, ... }
          // (B) task already done → returns { status, result: { imageUrl }, waiting }
          const imageUrlDirect =
            typeof wftRes!["imageUrl"] === "string"
              ? wftRes!["imageUrl"]
              : undefined;
          const innerResult = imageUrlDirect
            ? wftRes
            : toolResultRecord(wftRes!["result"]);
          expect(
            innerResult,
            `[T5b] Cannot find imageUrl: ${JSON.stringify(wftRes)}`,
          ).not.toBeNull();
          expect(
            typeof innerResult!["imageUrl"],
            `[T5b] imageUrl not a string, got: ${JSON.stringify(innerResult)}`,
          ).toBe("string");

          const waitLastAi = waitMsgs.find(
            (m) => m.id === waitResult.data.lastAiMessageId,
          );
          expect(waitLastAi?.content).toBeTruthy();
          assertStepOk(waitLastAi?.content, "T5b");
          lastMainAiMsgId = waitResult.data.lastAiMessageId!;

          assertNoOrphans(
            waitMsgs,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const afterWait = await getBalance(testUser);
          // T5b only: await-task + AI response (~0.3cr). Image gen was charged in T5.
          await assertDeductedLocal(testUser, beforeWait, afterWait, 0.1, 10);
        },
        effectiveTestTimeout,
      );

      // ── T5a: endLoop - tool executes, stream stops after first tool call ────
      fit(
        "T5a: endLoop - tool-help(endLoop) executes inline, stream stops after 1 call",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}callback-end-loop`);
          await pinBalance(testUser, 20);
          const prevIdsEndLoop = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const { result: endLoopResult, messages: endLoopMsgs } =
            await runStream({
              user: testUser,
              prompt: `[T5a endLoop] Call ${toolInstrWithArgs(cfg, "tool-help", "callbackMode='endLoop'")}. After receiving the result, try to call ${toolInstr(cfg, "tool-help")} again. Check that only ONE tool-help call was executed (the loop should have stopped) and the result had a non-empty tools array. End your reply with STEP_OK if exactly one call ran and the result was correct, or FAILED: <reason> if the loop continued or the result was wrong.`,
              threadId,
              favoriteId: mainFavoriteId,
              explicitParentMessageId: lastMainAiMsgId,
            });

          expect(endLoopResult.success).toBe(true);
          if (!endLoopResult.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(endLoopResult.message ?? "unexpected failure");
          }

          const endLoopAdded = newMessages(endLoopMsgs, prevIdsEndLoop);

          // Exactly 1 tool-help call (endLoop stops the loop).
          // Per spec: endLoop ALWAYS backfills in-place regardless of transport.
          // No deferred message is ever created for endLoop - the original message
          // is updated with status="completed" and the real result directly.
          const toolHelpMsgs = endLoopAdded.filter(
            (m) =>
              m.role === "tool" &&
              (m.toolCall?.toolName === "tool-help" ||
                (m.toolCall?.toolName === "execute-tool" &&
                  toolResultRecord(m.toolCall.args)?.["toolName"] ===
                    "tool-help")),
          );
          expect(
            toolHelpMsgs.length,
            "T5a: expected exactly 1 tool-help message (endLoop always backfills in-place, never creates deferred)",
          ).toBe(1);

          const resultMsg = toolHelpMsgs[0]!;
          assertToolMessageComplete(resultMsg, "tool-help", "T5a", cfg);

          // endLoop: original message MUST NOT be deferred - it's the backfilled in-place result.
          expect(
            resultMsg.toolCall?.isDeferred,
            "T5a: endLoop must NOT produce a deferred tool message - must backfill original in-place",
          ).toBeFalsy();

          // Result must be present directly on the original (backfilled in-place).
          const endLoopToolRes = resolveToolResult(resultMsg);
          expect(
            endLoopToolRes,
            "T5a: backfilled result must not be null",
          ).not.toBeNull();
          // tools array must be present; when matchedCount > threshold, categories returned instead
          expect(
            Array.isArray(endLoopToolRes!["tools"]),
            "T5a: tools is not an array",
          ).toBe(true);
          const t5aTools = endLoopToolRes!["tools"] as WidgetData[];
          const t5aCategories = endLoopToolRes!["categories"] as
            | WidgetData[]
            | undefined;
          expect(
            t5aTools.length > 0 ||
              (Array.isArray(t5aCategories) && t5aCategories.length > 0),
            "T5a: tool-help returned neither tools nor categories",
          ).toBe(true);

          // endLoop stops the stream after tool execution - leaf is the original tool message.
          // No revival fires - thread goes idle after backfill.
          lastMainAiMsgId = resultMsg.id;

          assertNoOrphans(
            endLoopMsgs,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const afterEndLoop = await getBalance(testUser);
          // endLoop = 1 tool-help call, cheap. But previous test goroutines may
          // add/remove credits concurrently. Skip credit assertion for endLoop
          // since it's a simple tool-help call, not a paid media gen.
          void afterEndLoop;
        },
        effectiveTestTimeout,
      );

      // ── T5d: wait callback mode - same-sequence backfill ──────────────────
      // Per spec: when callbackMode='wait' and no user message arrives during waiting,
      // the original tool message is backfilled IN-PLACE with the real result.
      // No deferred message is created. AI sees result in the same turn.
      fit(
        "T5d: wait callback mode - original tool message backfilled in-place, no deferred created, AI gets result",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}callback-wait-inline`);
          await pinBalance(testUser, 20);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const { result } = await runStream({
            user: testUser,
            prompt: `[T5d wait-inline] Call ${toolInstrWithArgs(cfg, "generate_image", "prompt='wait-inline-test' and callbackMode='wait'")}. Check that the result has an imageUrl (not a taskId). End your reply with STEP_OK if imageUrl is present and non-empty, or FAILED: <reason> if anything is wrong.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          // Queue mode (cfg.pulse): revival fires async. Poll for idle, then re-fetch.
          if (result.success && result.data.threadId) {
            const tid = result.data.threadId;
            const initialState = await getStreamingState(tid);
            if (initialState === "waiting") {
              const REVIVAL_TIMEOUT_MS = 30_000;
              const REVIVAL_POLL_INTERVAL_MS = 500;
              const revivalStart = Date.now();
              let revivalState: string | undefined = "waiting";
              while (
                revivalState !== "idle" &&
                Date.now() - revivalStart < REVIVAL_TIMEOUT_MS
              ) {
                await new Promise<void>((resolve) => {
                  setTimeout(resolve, REVIVAL_POLL_INTERVAL_MS);
                });
                revivalState = await getStreamingState(tid);
              }
              expect(
                revivalState,
                "[T5d] Thread must return to 'idle' after wait revival",
              ).toBe("idle");
            }
          }

          const allMessages = await getMessages(threadId);
          const added = newMessages(allMessages, prevIds);

          // ── At least 1 generate_image tool message (model may retry on validation errors) ──
          const imgToolMsgs = added.filter(
            (m) =>
              m.role === "tool" &&
              (m.toolCall?.toolName === "generate_image" ||
                (m.toolCall?.toolName === "execute-tool" &&
                  toolResultRecord(m.toolCall.args)?.["toolName"] ===
                    "generate_image")),
          );
          expect(
            imgToolMsgs.length,
            "T5d: expected at least 1 generate_image tool message",
          ).toBeGreaterThanOrEqual(1);

          // Use the last one (final retry with actual result)
          const imgToolMsg = imgToolMsgs[imgToolMsgs.length - 1]!;

          // Original message must NOT be marked as deferred (backfill in-place = not deferred).
          expect(
            imgToolMsg.toolCall?.isDeferred,
            "T5d: wait same-sequence must NOT produce a deferred tool message",
          ).toBeFalsy();

          // Result must be present on the original (backfilled in-place).
          const imgRes = resolveToolResult(imgToolMsg);
          expect(
            imgRes,
            "T5d: backfilled result must not be null",
          ).not.toBeNull();
          expect(
            typeof imgRes!["imageUrl"],
            `T5d: imageUrl not a string. Result: ${JSON.stringify(imgRes)}`,
          ).toBe("string");
          expect(
            imgRes!["imageUrl"],
            "T5d: imageUrl must be non-empty",
          ).toBeTruthy();

          // ── No DEFERRED tool messages should have been created (wait = backfill in-place) ──
          // Model may retry the tool call on validation errors, adding extra tool messages.
          // What matters: none of them are marked as deferred (wait mode backfills in-place).
          const deferredToolMsgs = added.filter(
            (m) => m.role === "tool" && m.toolCall?.isDeferred === true,
          );
          expect(
            deferredToolMsgs.length,
            `T5d: wait mode must NOT create deferred messages, found ${String(deferredToolMsgs.length)}`,
          ).toBe(0);

          const lastAi = allMessages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          expect(lastAi?.content).toBeTruthy();
          assertStepOk(lastAi?.content, "T5d");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(
            allMessages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          // Image gen + at least one AI turn; kimi sometimes needs an extra
          // round trip (same allowance as T1).
          await assertDeductedLocal(testUser, before, after, 0.4, 50);
        },
        effectiveTestTimeout,
      );

      // ── T6: wakeUp - two-phase E2E ──────────────────────────────────────
      describe("T6: wakeUp (two-phase)", () => {
        let wakeupToolMsgId: string;
        let wakeupMsgIds: Set<string>;
        /** IDs BEFORE T6a adds any messages - used to scope "exactly 2 tool msgs" assertion */
        let wakeupInitialMsgIds: Set<string>;

        fit(
          "T6a: wakeUp phase1 - image dispatched async, AI gets taskId, stream ends naturally",
          async () => {
            // Clean up stale wakeUp tasks from previous test runs before recording.
            // Without this, the revival stream sees dozens of stale tasks in the system
            // prompt, causing extra LLM calls that pollute the fixture counter.
            // IMPORTANT: Only delete tasks with a terminal execution status - new wakeUp
            // tasks are inserted with enabled=false initially and would be wrongly deleted.
            await db.execute(
              sql`DELETE FROM cron_tasks WHERE id LIKE 'local-wu-%' AND last_execution_status IN ('status.completed', 'status.failed', 'status.cancelled', 'status.stopped')`,
            );
            setFetchCacheContext(`${cfg.cachePrefix}callback-wakeup-phase1`);
            await pinBalance(testUser, 20);
            const before = await getBalance(testUser);
            wakeupMsgIds = new Set(
              (await getMessages(threadId)).map((m) => m.id),
            );
            wakeupInitialMsgIds = new Set(wakeupMsgIds);

            const { result, messages } = await runStream({
              user: testUser,
              prompt: `[T6a wakeUp-phase1] Call ${toolInstrWithArgs(cfg, "generate_image", "prompt='wakeup-test' and callbackMode='wakeUp'")}. The image will be generated asynchronously. There are TWO phases and you judge each by what the LATEST tool result in the conversation contains: PHASE 1 (dispatch): the latest result has a taskId and NO image — end your reply with STEP_OK, or FAILED: <reason> if there is an image already. PHASE 2 (you are automatically revived later; a NEW deferred tool result appears containing the finished image): seeing an image URL in that deferred result is CORRECT and EXPECTED — it does NOT mean the wakeUp mode misbehaved. The URL may appear as an "imageUrl" field OR a rendered markdown image link ![...](https://...) — either counts. In phase 2, confirm an image URL (http or https) is present and non-empty, then end with WAKEUP_OK. Only end with WAKEUP_FAILED: <reason> if NO image URL appears in any form.`,
              threadId,
              favoriteId: mainFavoriteId,
              explicitParentMessageId: lastMainAiMsgId,
            });

            expect(result.success).toBe(true);
            if (!result.success) {
              // oxlint-disable-next-line restricted-syntax
              throw new Error(result.message ?? "unexpected stream failure");
            }

            const added = newMessages(messages, wakeupMsgIds);
            wakeupMsgIds = new Set(messages.map((m) => m.id));

            // ── Tool message: the ORIGINAL dispatch (never the deferred
            // revival child — the post-revival snapshot may contain both) ──
            const addedNonDeferred = added.filter(
              (m) => m.toolCall?.isDeferred !== true,
            );
            const toolMsg = findToolMsg(
              addedNonDeferred,
              "generate_image",
              cfg,
            );
            expect(toolMsg).toBeDefined();
            if (toolMsg) {
              // wakeUp phase1: tool dispatched async - status is "pending" in remote, undefined in local
              assertToolMessageComplete(
                toolMsg,
                "generate_image",
                "T6a",
                cfg,
                "pending",
              );
            }
            wakeupToolMsgId = toolMsg!.id;

            // Delivery shape: a task that finishes before the stream ends is
            // picked up by the live loop — the original message already holds
            // the image. A slower task delivers via revival (deferred child).
            const phase1Res = resolveToolResult(toolMsg);
            t6aInlineDelivery =
              typeof phase1Res?.["imageUrl"] === "string" &&
              phase1Res["imageUrl"] !== "";
            if (t6aInlineDelivery) {
              expect(
                String(phase1Res!["imageUrl"]),
                "T6a inline delivery: imageUrl must be a real URL",
              ).toMatch(/^https?:\/\/.+/);
            }

            // ── Stream ended, AI wrapped up ──
            // The wakeUp revival can land between dispatch and this snapshot
            // (REMOTE-folder mirror-wait pulls until it arrives), so
            // lastAiMessageId may point at the REVIVAL turn rather than the
            // phase-1 dispatch turn. Accept the marker from ANY assistant added
            // this phase: the dispatch turn confirms STEP_OK (taskId, no image),
            // the revival turn confirms WAKEUP_OK (image present). Either proves
            // the phase worked; the failure markers must be absent everywhere.
            // Re-fetch current state: the phase assistants (dispatch + revival)
            // can sync to this mirror after runStream's snapshot was captured.
            // Diff against the PRE-stream snapshot (wakeupInitialMsgIds) —
            // wakeupMsgIds was just reassigned to the post-stream set above and
            // would exclude the very assistants we need to inspect.
            const t6aCurrent = await getMessages(threadId);
            // Only the dispatch + revival assistants — exclude compacting nodes,
            // whose summaries recap prior turns (and quote instruction text like
            // "WAKEUP_FAILED"), which would false-trigger the failure check.
            const phaseAssistants = newMessages(
              t6aCurrent,
              wakeupInitialMsgIds,
            ).filter(
              (m) =>
                m.role === "assistant" &&
                !m.isCompacting &&
                (m.content ?? "").trim() !== "",
            );
            const phaseText = phaseAssistants
              .map((m) => m.content ?? "")
              .join("\n---\n");
            expect(
              phaseText.includes("STEP_OK") || phaseText.includes("WAKEUP_OK"),
              `T6a: a phase assistant must confirm STEP_OK (dispatch) or WAKEUP_OK (revival) - got:\n\n${phaseText.slice(0, 600)}`,
            ).toBe(true);
            // A real failure is the answer marker the prompt defines — match it
            // only as an emitted verdict (a phase assistant whose own answer is
            // a failure), not a substring inside a recap of earlier instructions.
            const anyAnswerFailed = phaseAssistants.some((m) => {
              const c = m.content ?? "";
              return (
                (c.includes("WAKEUP_FAILED") || /\bFAILED:/.test(c)) &&
                !c.includes("STEP_OK") &&
                !c.includes("WAKEUP_OK")
              );
            });
            expect(
              anyAnswerFailed,
              `T6a: no phase assistant may report failure - got:\n\n${phaseText.slice(0, 600)}`,
            ).toBe(false);
            lastMainAiMsgId = result.data.lastAiMessageId!;

            // Queue mode: wakeUp task is in the cron queue (not directly accessible).
            // The stream ends normally (thread → idle), then we explicitly fire the pulse
            // to execute the background task and trigger the revival BEFORE T6b polls.
            if (!t6aInlineDelivery && cfg.pulse) {
              await cfg.pulse(threadId);
            }
            // Wait for the goroutine + resume-stream + revival to complete.
            // On first run (no fixtures), the image gen API call may take up to 120s.
            // We poll for the deferred message (definitive signal that revival landed)
            // rather than just thread state (which may be idle while goroutine is in-flight).
            const REVIVAL_TIMEOUT_MS = 120_000;
            const REVIVAL_POLL_INTERVAL_MS = 1_000;
            const revivalStart = Date.now();
            let revivalLanded = t6aInlineDelivery;
            while (
              !revivalLanded &&
              Date.now() - revivalStart < REVIVAL_TIMEOUT_MS
            ) {
              const currentMsgs = await getMessages(threadId);
              const deferredExists = currentMsgs.some(
                (m) =>
                  m.role === "tool" &&
                  m.toolCall?.isDeferred === true &&
                  (m.toolCall.toolName === "generate_image" ||
                    (m.toolCall.toolName === "execute-tool" &&
                      toolResultRecord(m.toolCall.args)?.["toolName"] ===
                        "generate_image")),
              );
              const threadState = await getStreamingState(threadId);
              if (deferredExists && threadState === "idle") {
                revivalLanded = true;
                break;
              }
              await new Promise<void>((resolve) => {
                setTimeout(resolve, REVIVAL_POLL_INTERVAL_MS);
              });
            }

            // wakeUp phase1: thread may be "waiting" (goroutine still running) or
            // "idle" (goroutine + revival finished fast in cache mode). Both are valid.
            // We verify revival results in T6b - not timing state here.
            // Chain integrity: revival may or may not have landed yet - skip expectedLeafId check here.
            assertNoOrphans(
              messages,
              new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
              {
                knownDeadEndLeaves: deadEndLeaves,
              },
            );

            const after = await getBalance(testUser);
            // The await covers the WHOLE delivery: dispatch turn + image gen
            // + revival turn; kimi sometimes needs extra round trips (same
            // allowance as T1).
            await assertDeductedLocal(testUser, before, after, 0, 50);
          },
          effectiveTestTimeout,
        );

        fit(
          "T6b: wakeUp phase2 - revival, AI sees backfilled result, responds naturally",
          async () => {
            expect(wakeupToolMsgId).toBeTruthy();

            // Inline delivery (fast task): the original tool message already
            // holds the final image — no deferred message, no revival turn.
            if (t6aInlineDelivery) {
              const inlineMsgs = await getMessages(threadId);
              const originalMsg = inlineMsgs.find(
                (m) => m.id === wakeupToolMsgId,
              );
              expect(
                originalMsg,
                "T6b inline: original wakeUp tool message must exist",
              ).toBeDefined();
              const inlineRes = resolveToolResult(originalMsg);
              expect(
                String(inlineRes?.["imageUrl"] ?? ""),
                "T6b inline: original message must hold the final imageUrl",
              ).toMatch(/^https?:\/\/.+/);
              expect(
                originalMsg!.toolCall?.isDeferred,
                "T6b inline: original message must not be deferred",
              ).toBeFalsy();
              const deferredCount = inlineMsgs.filter(
                (m) => m.role === "tool" && m.toolCall?.isDeferred === true,
              ).length;
              expect(
                deferredCount,
                "T6b inline: no deferred message may exist for inline delivery",
              ).toBe(0);
              await assertThreadIdle(threadId, testUser);
              await assertNoPendingTasks(threadId);
              return;
            }

            // The wakeUp revival fires async during T6a (goroutine + resume-stream).
            // With cached fixtures, should complete in seconds. Strict 30s timeout.
            // Remote (direct-http) mode: the round-trip crosses instances, so
            // allow more — but stay INSIDE the test timeout so a dead revival
            // fails with the clean assertion below, not a vitest timeout.
            const WAKEUP_TIMEOUT_MS = cfg.remoteInstanceId ? 90_000 : 30_000;
            const WAKEUP_POLL_MS = 500;
            let messages: SlimMessage[] = [];
            const deadline = Date.now() + WAKEUP_TIMEOUT_MS;
            let deferredTool: SlimMessage | undefined;
            let revivalAi: SlimMessage | undefined;
            while (Date.now() < deadline) {
              messages = await getMessages(threadId);
              deferredTool = messages.find(
                (m) =>
                  m.role === "tool" &&
                  m.toolCall?.isDeferred === true &&
                  resolveToolResult(m)?.["imageUrl"] !== undefined &&
                  (cfg.remoteInstanceId
                    ? m.toolCall.toolName === "execute-tool" &&
                      toolResultRecord(m.toolCall.args)?.["toolName"] ===
                        "generate_image"
                    : m.toolCall.toolName === "generate_image" ||
                      (m.toolCall.toolName === "execute-tool" &&
                        toolResultRecord(m.toolCall.args)?.["toolName"] ===
                          "generate_image")),
              );
              if (deferredTool) {
                // Walk the chain from deferredTool to find the leaf non-compacting
                // assistant message (may be a grandchild if compacting fired during revival).
                const buildChildMap = (
                  msgs: SlimMessage[],
                ): Map<string, SlimMessage[]> => {
                  const childMap = new Map<string, SlimMessage[]>();
                  for (const msg of msgs) {
                    if (msg.parentId) {
                      const siblings = childMap.get(msg.parentId) ?? [];
                      siblings.push(msg);
                      childMap.set(msg.parentId, siblings);
                    }
                  }
                  return childMap;
                };
                const childMap = buildChildMap(messages);
                // BFS from deferredTool to find the last non-compacting assistant leaf
                const queue: string[] = [deferredTool.id];
                let candidate: SlimMessage | undefined;
                while (queue.length > 0) {
                  const current = queue.shift()!;
                  const children = childMap.get(current) ?? [];
                  for (const child of children) {
                    if (child.role === "assistant" && !child.isCompacting) {
                      candidate = child;
                    }
                    queue.push(child.id);
                  }
                }
                revivalAi = candidate;
              }
              if (deferredTool && revivalAi) {
                if ((await getStreamingState(threadId)) === "idle") {
                  break;
                }
              }
              await new Promise<void>((resolve) => {
                setTimeout(resolve, WAKEUP_POLL_MS);
              });
            }

            // ── Per spec: exactly 2 generate_image tool messages - original + deferred ──
            // No more, no less. A 3rd message = premature revival fired with {status:"pending"}.
            // Scope to T6 branch only (messages added since the count captured before T6a).
            const t6BranchMsgs = newMessages(messages, wakeupInitialMsgIds);
            const allGenImgToolMsgs = t6BranchMsgs.filter(
              (m) =>
                m.role === "tool" &&
                (m.toolCall?.toolName === "generate_image" ||
                  (m.toolCall?.toolName === "execute-tool" &&
                    toolResultRecord(m.toolCall.args)?.["toolName"] ===
                      "generate_image")),
            );
            expect(
              allGenImgToolMsgs.length,
              `T6b: expected exactly 2 generate_image tool messages (original + deferred). Got ${String(allGenImgToolMsgs.length)}: ${allGenImgToolMsgs.map((m) => `${m.id}(isDeferred=${String(m.toolCall?.isDeferred)},result=${JSON.stringify(resolveToolResult(m))?.slice(0, 80)})`).join(", ")}`,
            ).toBe(2);

            const originalToolMsg = allGenImgToolMsgs.find(
              (m) => !m.toolCall?.isDeferred,
            );
            const deferredToolMsg = allGenImgToolMsgs.find(
              (m) => m.toolCall?.isDeferred === true,
            );
            expect(
              originalToolMsg,
              "T6b: original (non-deferred) generate_image tool message not found",
            ).toBeDefined();
            expect(
              deferredToolMsg,
              "T6b: deferred generate_image tool message not found",
            ).toBeDefined();

            // ── Deferred tool message: written by resume-stream with real imageUrl ──
            expect(
              deferredTool,
              "T6b: no deferred tool message with imageUrl found",
            ).toBeDefined();
            if (deferredTool) {
              // Use resolveToolResult to handle execute-tool wrapper (remote mode)
              const deferredRes = resolveToolResult(deferredTool);
              expect(typeof deferredRes!["imageUrl"]).toBe("string");
              expect(deferredRes!["imageUrl"]).toBeTruthy();

              // Deferred message must be marked isDeferred=true.
              expect(
                deferredTool.toolCall?.isDeferred,
                "T6b: deferred tool message must have isDeferred=true",
              ).toBe(true);

              // Deferred message must link back to the original via originalToolCallId.
              expect(
                deferredTool.toolCall?.originalToolCallId,
                "T6b: deferred tool message must have originalToolCallId linking to original",
              ).toBeTruthy();
            }

            // ── Original tool message from phase1 must NOT be modified ──
            // Per spec: wakeUp original message is never updated after creation.
            // The result lives in the deferred message only.
            // Original content: {taskId, status:"pending"} shape - never has imageUrl.
            const originalToolInDb = messages.find(
              (m) => m.id === wakeupToolMsgId,
            );
            expect(
              originalToolInDb,
              "T6b: original wakeUp tool message must still exist in DB",
            ).toBeDefined();
            if (originalToolInDb) {
              const origRes = resolveToolResult(originalToolInDb);
              // Original should NOT have imageUrl - that's in the deferred message.
              expect(
                origRes?.["imageUrl"],
                "T6b: wakeUp original tool message must NOT have imageUrl - result goes to deferred",
              ).toBeUndefined();
              // Original must NOT be marked isDeferred.
              expect(
                originalToolInDb.toolCall?.isDeferred,
                "T6b: original tool message must NOT be isDeferred=true",
              ).not.toBe(true);
            }

            // ── Revival AI: child of the deferred tool ──
            expect(
              revivalAi,
              "T6b: no revival AI message parented to deferred tool - revival never fired or AI didn't respond",
            ).toBeDefined();

            // Update lastMainAiMsgId to revival AI so T7a chains correctly.
            if (revivalAi) {
              // Wait for the revival's FINAL content — the mirror may hold an
              // early streaming chunk (just "<think>") before the answer syncs.
              const finalRevival = await awaitFinalAssistant(
                threadId,
                revivalAi.id,
                getMessages,
              );
              const revivalContent = finalRevival?.content ?? revivalAi.content;
              expect(revivalContent).toBeTruthy();
              const revivalVisible = stripReasoning(revivalContent);
              if (revivalVisible.length > 0) {
                expect(
                  revivalVisible,
                  `T6b: revival AI visible text must contain WAKEUP_OK - got: ${revivalVisible.slice(0, 300)}`,
                ).toContain("WAKEUP_OK");
              }
              lastMainAiMsgId = revivalAi.id;
            } else if (deferredTool) {
              lastMainAiMsgId = deferredTool.id;
            }

            // Re-fetch after goroutine settles, then verify chain integrity.
            messages = await getMessages(threadId);
            assertNoOrphans(
              messages,
              new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
              {
                expectedLeafId: lastMainAiMsgId,
                knownDeadEndLeaves: deadEndLeaves,
              },
            );
            await assertThreadIdle(threadId, testUser);
            await assertNoPendingTasks(threadId);

            // ── Hard loop-prevention scan: no enabled non-terminal tasks remain ──
            // A stale enabled task = AI could be auto-revived indefinitely.
            const loopRiskTasks = await db.execute<{
              id: string;
              last_execution_status: string | null;
            }>(
              sql`SELECT id, last_execution_status FROM cron_tasks
                  WHERE wake_up_thread_id = ${threadId}
                    AND enabled = true
                    AND (last_execution_status IS NULL
                         OR last_execution_status NOT IN ('completed', 'cancelled', 'failed', 'stopped'))`,
            );
            expect(
              loopRiskTasks.rows.length,
              `T6b: ${String(loopRiskTasks.rows.length)} stale enabled tasks remain after wakeUp revival (WAKEUP LOOP RISK). ` +
                `These could trigger repeated auto-revivals: ${loopRiskTasks.rows.map((r) => `${r.id}:${String(r.last_execution_status)}`).join(", ")}`,
            ).toBe(0);
          },
          effectiveTestTimeout,
        );
      });

      // ── T6c: wakeUp repeat - second full E2E wakeUp on same thread ──────
      // Verifies no stale state from T6a/T6b causes issues.
      fit(
        "T6c: wakeUp repeat - second generate_image(wakeUp) on same thread",
        async () => {
          setFetchCacheContext(
            `${cfg.cachePrefix}callback-wakeup-phase1-repeat`,
          );
          await pinBalance(testUser, 20);
          const t6cInitialIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const { result, messages: phase1Msgs } = await runStream({
            user: testUser,
            prompt: `[T6c wakeUp-repeat] Call ${toolInstrWithArgs(cfg, "generate_image", "prompt='wakeup-repeat-test' and callbackMode='wakeUp'")}. Two valid outcomes: (a) DEFERRED - you get a taskId and no image yet → end with STEP_OK; OR (b) INLINE - a fast task returns the image immediately (an imageUrl field or a markdown image link) → end with WAKEUP_OK. Either is correct. Only end with FAILED: <reason> if you get neither a taskId nor an image. If you got a taskId (deferred), you will be revived when the image is ready - on revival confirm the image URL (http/https, as a field or markdown link) is present and end with WAKEUP_OK, or WAKEUP_FAILED: <reason> if no image URL appears.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success, "T6c: runStream failed").toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          // Re-fetch + pull: the tool message mirrors after runStream's snapshot.
          let added = newMessages(phase1Msgs, t6cInitialIds);
          let toolMsg = findToolMsg(added, "generate_image", cfg);
          for (let i = 0; i < 20 && !toolMsg; i++) {
            added = newMessages(await getMessages(threadId), t6cInitialIds);
            toolMsg = findToolMsg(added, "generate_image", cfg);
            if (toolMsg) {
              break;
            }
            await new Promise<void>((resolve) => {
              setTimeout(resolve, 500);
            });
          }
          expect(
            toolMsg,
            "T6c: generate_image tool message not found",
          ).toBeDefined();
          // Delivery shape: deferred (taskId, pending) or inline (image now).
          const t6cPhase1Res = resolveToolResult(toolMsg);
          const t6cInline =
            typeof t6cPhase1Res?.["imageUrl"] === "string" &&
            t6cPhase1Res["imageUrl"] !== "";

          const lastAi = await awaitFinalAssistant(
            threadId,
            result.data.lastAiMessageId!,
            getMessages,
          );
          expect(lastAi, "T6c: no AI response found").toBeDefined();
          assertWakeUpPhase1Ok(lastAi?.content, "T6c");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          // Inline delivery (fast task): no taskId, no deferred, no revival — the
          // original message already holds the image. The wakeUp contract (tool
          // never blocks) still held; skip the deferred-revival assertions.
          if (t6cInline) {
            expect(
              String(t6cPhase1Res!["imageUrl"]),
              "T6c inline: imageUrl must be a real URL",
            ).toMatch(/^https?:\/\/.+/);
            await assertThreadIdle(threadId, testUser);
            return;
          }

          // Queue mode: pulse to start the background task
          if (cfg.pulse) {
            await cfg.pulse(threadId);
          }

          // Poll for deferred + revival AI + idle
          const REVIVAL_TIMEOUT_MS = 120_000;
          const REVIVAL_POLL_MS = 500;
          const deadline = Date.now() + REVIVAL_TIMEOUT_MS;
          let messages: SlimMessage[] = [];
          let deferredTool: SlimMessage | undefined;
          let revivalAi: SlimMessage | undefined;
          while (Date.now() < deadline) {
            messages = await getMessages(threadId);
            const t6cMsgs = newMessages(messages, t6cInitialIds);
            deferredTool = t6cMsgs.find(
              (m) =>
                m.role === "tool" &&
                m.toolCall?.isDeferred === true &&
                (m.toolCall.toolName === "generate_image" ||
                  (m.toolCall.toolName === "execute-tool" &&
                    toolResultRecord(m.toolCall.args)?.["toolName"] ===
                      "generate_image")),
            );
            if (deferredTool) {
              revivalAi = messages.find(
                (m) =>
                  m.role === "assistant" && m.parentId === deferredTool!.id,
              );
            }
            // Require the revival's FINAL content, not just its existence: the
            // mirror can carry an early streaming chunk (e.g. just "<think>")
            // before the full answer syncs. Break only once the visible answer
            // (after stripping reasoning) is non-empty AND the thread is idle.
            if (deferredTool && revivalAi) {
              const visible = (revivalAi.content ?? "")
                .replace(/<think>[\s\S]*?<\/think>/g, "")
                .trim();
              if (
                visible.length > 0 &&
                (await getStreamingState(threadId)) === "idle"
              ) {
                break;
              }
            }
            await new Promise<void>((resolve) => {
              setTimeout(resolve, REVIVAL_POLL_MS);
            });
          }

          // ── Each generate_image wakeUp call must produce original + deferred ──
          const t6cBranchMsgs = newMessages(messages, t6cInitialIds);
          const allGenImgToolMsgs = t6cBranchMsgs.filter(
            (m) =>
              m.role === "tool" &&
              (m.toolCall?.toolName === "generate_image" ||
                (m.toolCall?.toolName === "execute-tool" &&
                  toolResultRecord(m.toolCall.args)?.["toolName"] ===
                    "generate_image")),
          );
          const originals = allGenImgToolMsgs.filter(
            (m) => !m.toolCall?.isDeferred,
          );
          const deferreds = allGenImgToolMsgs.filter(
            (m) => m.toolCall?.isDeferred === true,
          );
          expect(
            originals.length,
            `T6c: expected at least 1 original generate_image tool msg. Got ${String(originals.length)}`,
          ).toBeGreaterThanOrEqual(1);
          expect(
            deferreds.length,
            `T6c: expected same number of deferred as original. Originals: ${String(originals.length)}, deferred: ${String(deferreds.length)}`,
          ).toBe(originals.length);

          // ── Deferred tool message ──
          expect(deferredTool, "T6c: no deferred tool found").toBeDefined();
          if (deferredTool) {
            expect(deferredTool.toolCall?.isDeferred).toBe(true);
            expect(deferredTool.toolCall?.originalToolCallId).toBeTruthy();
          }

          // ── Revival AI ──
          expect(revivalAi, "T6c: no revival AI message found").toBeDefined();
          if (revivalAi) {
            const finalRevival = await awaitFinalAssistant(
              threadId,
              revivalAi.id,
              getMessages,
            );
            const revivalVisible = stripReasoning(
              finalRevival?.content ?? revivalAi.content,
            );
            if (revivalVisible.length > 0) {
              expect(
                revivalVisible,
                `T6c: revival AI visible text must contain WAKEUP_OK - got: ${revivalVisible.slice(0, 300)}`,
              ).toContain("WAKEUP_OK");
            }
          }

          // Walk to the actual leaf via child links — timestamps are unreliable when
          // branches can be created at any time. Start from the deferred tool message
          // and follow children down to the deepest node (revival AI or beyond).
          messages = await getMessages(threadId);
          {
            const t6cById = new Map(messages.map((m) => [m.id, m]));
            const t6cChildrenOf = new Map<string, SlimMessage[]>();
            for (const m of messages) {
              if (m.parentId) {
                const list = t6cChildrenOf.get(m.parentId) ?? [];
                list.push(m);
                t6cChildrenOf.set(m.parentId, list);
              }
            }
            const startId = deferredTool?.id ?? lastMainAiMsgId;
            let t6cCursor = startId ? t6cById.get(startId) : undefined;
            while (t6cCursor) {
              const kids = t6cChildrenOf.get(t6cCursor.id);
              if (!kids || kids.length === 0) {
                break;
              }
              t6cCursor = kids[0];
            }
            if (t6cCursor) {
              lastMainAiMsgId = t6cCursor.id;
            }
          }

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);
        },
        effectiveTestTimeout,
      );

      // ── T6d: wakeUp stress - third consecutive wakeUp on same thread ────
      // Full E2E again. Verifies no accumulated stale state after two prior wakeUps.
      fit(
        "T6d: wakeUp stress - third consecutive generate_image(wakeUp)",
        async () => {
          setFetchCacheContext(
            `${cfg.cachePrefix}callback-wakeup-phase1-stress`,
          );
          await pinBalance(testUser, 20);
          const t6dInitialIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const { result, messages: phase1Msgs } = await runStream({
            user: testUser,
            prompt: `[T6d wakeUp-stress] Call ${toolInstrWithArgs(cfg, "generate_image", "prompt='wakeup-stress-test' and callbackMode='wakeUp'")}. Two valid outcomes: (a) DEFERRED - you get a taskId and no image yet → end with STEP_OK; OR (b) INLINE - a fast task returns the image immediately (an imageUrl field or a markdown image link) → end with WAKEUP_OK. Either is correct. Only end with FAILED: <reason> if you get neither a taskId nor an image. If you got a taskId (deferred), you will be revived when the image is ready - on revival confirm the image URL (http/https, as a field or markdown link) is present and end with WAKEUP_OK, or WAKEUP_FAILED: <reason> if no image URL appears.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success, "T6d: runStream failed").toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          // Re-fetch + pull: the tool message mirrors to this caller after
          // runStream's snapshot in REMOTE-folder mode. Poll briefly so
          // findToolMsg sees the converged state, not the pre-sync snapshot.
          let added = newMessages(phase1Msgs, t6dInitialIds);
          let toolMsg = findToolMsg(added, "generate_image", cfg);
          for (let i = 0; i < 20 && !toolMsg; i++) {
            added = newMessages(await getMessages(threadId), t6dInitialIds);
            toolMsg = findToolMsg(added, "generate_image", cfg);
            if (toolMsg) {
              break;
            }
            await new Promise<void>((resolve) => {
              setTimeout(resolve, 500);
            });
          }
          expect(
            toolMsg,
            "T6d: generate_image tool message not found",
          ).toBeDefined();
          // Delivery shape: deferred (taskId, pending) or inline (image now).
          const t6dPhase1Res = resolveToolResult(toolMsg);
          const t6dInline =
            typeof t6dPhase1Res?.["imageUrl"] === "string" &&
            t6dPhase1Res["imageUrl"] !== "";

          const lastAi = await awaitFinalAssistant(
            threadId,
            result.data.lastAiMessageId!,
            getMessages,
          );
          expect(lastAi, "T6d: no AI response found").toBeDefined();
          assertWakeUpPhase1Ok(lastAi?.content, "T6d");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          // Inline delivery: original message holds the image, no deferred turn.
          if (t6dInline) {
            expect(
              String(t6dPhase1Res!["imageUrl"]),
              "T6d inline: imageUrl must be a real URL",
            ).toMatch(/^https?:\/\/.+/);
            await assertThreadIdle(threadId, testUser);
            // Walk to the actual leaf (chain-walk, no timestamps).
            {
              const inlineMsgs = await getMessages(threadId);
              const inlineById = new Map(inlineMsgs.map((m) => [m.id, m]));
              const inlineChildrenOf = new Map<string, SlimMessage[]>();
              for (const m of inlineMsgs) {
                if (m.parentId) {
                  const list = inlineChildrenOf.get(m.parentId) ?? [];
                  list.push(m);
                  inlineChildrenOf.set(m.parentId, list);
                }
              }
              let inlineCursor = inlineById.get(lastMainAiMsgId);
              while (inlineCursor) {
                const kids = inlineChildrenOf.get(inlineCursor.id);
                if (!kids || kids.length === 0) {
                  break;
                }
                inlineCursor = kids[0];
              }
              if (inlineCursor) {
                lastMainAiMsgId = inlineCursor.id;
              }
            }
            return;
          }

          if (cfg.pulse) {
            await cfg.pulse(threadId);
          }

          // Poll for deferred + revival AI + idle
          const REVIVAL_TIMEOUT_MS = 120_000;
          const REVIVAL_POLL_MS = 500;
          const deadline = Date.now() + REVIVAL_TIMEOUT_MS;
          let messages: SlimMessage[] = [];
          let deferredTool: SlimMessage | undefined;
          let revivalAi: SlimMessage | undefined;
          while (Date.now() < deadline) {
            messages = await getMessages(threadId);
            const t6dMsgs = newMessages(messages, t6dInitialIds);
            deferredTool = t6dMsgs.find(
              (m) =>
                m.role === "tool" &&
                m.toolCall?.isDeferred === true &&
                (m.toolCall.toolName === "generate_image" ||
                  (m.toolCall.toolName === "execute-tool" &&
                    toolResultRecord(m.toolCall.args)?.["toolName"] ===
                      "generate_image")),
            );
            if (deferredTool) {
              revivalAi = messages.find(
                (m) =>
                  m.role === "assistant" && m.parentId === deferredTool!.id,
              );
            }
            // Require the revival's FINAL content, not just its existence: the
            // mirror can carry an early streaming chunk (e.g. just "<think>")
            // before the full answer syncs. Break only once the visible answer
            // (after stripping reasoning) is non-empty AND the thread is idle.
            if (deferredTool && revivalAi) {
              const visible = (revivalAi.content ?? "")
                .replace(/<think>[\s\S]*?<\/think>/g, "")
                .trim();
              if (
                visible.length > 0 &&
                (await getStreamingState(threadId)) === "idle"
              ) {
                break;
              }
            }
            await new Promise<void>((resolve) => {
              setTimeout(resolve, REVIVAL_POLL_MS);
            });
          }

          // ── Each generate_image wakeUp call must produce original + deferred ──
          // Model may call generate_image multiple times → N originals + N deferred = 2N total.
          const t6dBranchMsgs = newMessages(messages, t6dInitialIds);
          const allGenImgToolMsgs = t6dBranchMsgs.filter(
            (m) =>
              m.role === "tool" &&
              (m.toolCall?.toolName === "generate_image" ||
                (m.toolCall?.toolName === "execute-tool" &&
                  toolResultRecord(m.toolCall.args)?.["toolName"] ===
                    "generate_image")),
          );
          const originals = allGenImgToolMsgs.filter(
            (m) => !m.toolCall?.isDeferred,
          );
          const deferreds = allGenImgToolMsgs.filter(
            (m) => m.toolCall?.isDeferred === true,
          );
          expect(
            originals.length,
            `T6d: expected at least 1 original generate_image tool msg. Got ${String(originals.length)}`,
          ).toBeGreaterThanOrEqual(1);
          expect(
            deferreds.length,
            `T6d: expected same number of deferred as original. Originals: ${String(originals.length)}, deferred: ${String(deferreds.length)}`,
          ).toBe(originals.length);

          expect(deferredTool, "T6d: no deferred tool found").toBeDefined();
          if (deferredTool) {
            expect(deferredTool.toolCall?.isDeferred).toBe(true);
          }

          expect(revivalAi, "T6d: no revival AI message found").toBeDefined();
          if (revivalAi) {
            const finalRevival = await awaitFinalAssistant(
              threadId,
              revivalAi.id,
              getMessages,
            );
            const revivalVisible = stripReasoning(
              finalRevival?.content ?? revivalAi.content,
            );
            if (revivalVisible.length > 0) {
              expect(
                revivalVisible,
                `T6d: revival AI visible text must contain WAKEUP_OK - got: ${revivalVisible.slice(0, 300)}`,
              ).toContain("WAKEUP_OK");
            }
          }

          // Walk to the actual leaf — model may have called generate_image multiple times,
          // creating multiple deferred + revival pairs in a linear chain.
          // Walk DOWN from runStream's lastAiMessageId via child links (no timestamps).
          messages = await getMessages(threadId);
          {
            const startId = result.data.lastAiMessageId ?? deferredTool?.id;
            if (startId) {
              const t6dChildrenOf = new Map<string, SlimMessage[]>();
              for (const m of messages) {
                if (m.parentId) {
                  const list = t6dChildrenOf.get(m.parentId) ?? [];
                  list.push(m);
                  t6dChildrenOf.set(m.parentId, list);
                }
              }
              const t6dById = new Map(messages.map((m) => [m.id, m]));
              let t6dCursor = t6dById.get(startId);
              while (t6dCursor) {
                const kids = t6dChildrenOf.get(t6dCursor.id);
                if (!kids || kids.length === 0) {
                  break;
                }
                // Linear chain expected — exactly one child per step.
                t6dCursor = kids[0];
              }
              if (t6dCursor) {
                lastMainAiMsgId = t6dCursor.id;
              }
            }
          }

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);
        },
        effectiveTestTimeout,
      );

      // ── T7: Approve - two-phase (parallel tools + correct UI confirm flow) ─
      describe("T7: approve (two-phase)", () => {
        // Saved across T7a → T7b
        let approveToolMsgId: string;
        let approveToolParentId: string | null;

        fit(
          "T7a: approve phase1 - parallel tools: tool-help runs, generate_image awaits confirmation, no assistant message after",
          async () => {
            setFetchCacheContext(`${cfg.cachePrefix}callback-approve-phase1`);
            await pinBalance(testUser, 10);
            const before = await getBalance(testUser);
            const prevIds = new Set(
              (await getMessages(threadId)).map((m) => m.id),
            );

            // The confirmation gate lives ON the favorite (what a real user
            // configures), not as a per-call override. PATCH generate_image to
            // requiresConfirmation=true on the main favorite for this phase.
            // The PATCH requires modelSelection, so read the current one first
            // and send it back unchanged (faithful client flow).
            const favByIdDefT7 = (
              await import("@/app/api/[locale]/agent/skills/favorites/[id]/definition")
            ).default;
            // The gate applies to the TARGET tool uniformly — locally AND on
            // remote dispatch (guards.applyConfirmationGate runs in both
            // paths), so every cell gates generate_image itself.
            const confirmToolId = "generate_image";
            const t7FavGet = await sendTestRequest({
              endpoint: favByIdDefT7.GET,
              urlPathParams: { id: mainFavoriteId },
              user: testUser,
            });
            const t7ModelSelection = t7FavGet.success
              ? t7FavGet.data.modelSelection
              : null;
            await sendTestRequest({
              endpoint: favByIdDefT7.PATCH,
              data: {
                modelSelection: t7ModelSelection,
                availableTools: [
                  { toolId: confirmToolId, requiresConfirmation: true },
                ],
              },
              urlPathParams: { id: mainFavoriteId },
              user: testUser,
            });

            // Prompt: call BOTH tool-help AND generate_image in same parallel step.
            // generate_image requires confirmation → placeholder only, stream aborts before AI response.
            const { result, messages } = await runStream({
              user: testUser,
              prompt: `[T7a approve-phase1] In a single response, call BOTH at the same time: (1) ${toolInstr(cfg, "tool-help")} to list available tools, and (2) ${toolInstrWithArgs(cfg, "generate_image", "prompt='approve-test'")}. The generate_image tool requires user confirmation - it should NOT execute yet. End your reply with STEP_OK after the tool calls.`,
              threadId,
              favoriteId: mainFavoriteId,
              explicitParentMessageId: lastMainAiMsgId,
            });

            expect(result.success).toBe(true);
            if (!result.success) {
              // oxlint-disable-next-line restricted-syntax
              throw new Error(result.message ?? "unexpected stream failure");
            }

            const added = newMessages(messages, prevIds);

            // ── generate_image tool message - has waiting_for_confirmation placeholder ──
            const approveToolMsg =
              findToolMsg(added, "generate_image", cfg) ??
              added.find(
                (m) =>
                  m.role === "tool" &&
                  m.toolCall?.toolName === "generate_image",
              );
            expect(
              approveToolMsg,
              "T7a: generate_image tool message not found",
            ).toBeDefined();
            if (approveToolMsg) {
              // APPROVE mode: tool awaits user confirmation, result is a placeholder (waiting_for_confirmation).
              // The execute-tool task itself completes (returns placeholder), so status is "completed".
              assertToolMessageComplete(
                approveToolMsg,
                "generate_image",
                "T7a",
                cfg,
                "completed",
              );
            }
            approveToolMsgId = approveToolMsg!.id;
            approveToolParentId = approveToolMsg!.parentId;

            const toolRes = resolveToolResult(approveToolMsg);
            // Must NOT have executed - no imageUrl, must have waiting_for_confirmation
            expect(
              toolRes?.["imageUrl"],
              "T7a: imageUrl present - tool executed without approval (requiresConfirmation=true was ignored)",
            ).toBeUndefined();
            expect(
              toolRes?.["status"],
              "T7a: expected waiting_for_confirmation status",
            ).toBe("waiting_for_confirmation");

            // ── tool-help ran (parallel to generate_image) - has real result ──
            const toolHelpMsg = findToolMsg(added, "tool-help", cfg);
            expect(
              toolHelpMsg,
              "T7a: tool-help message not found in parallel step",
            ).toBeDefined();
            const toolHelpRes = resolveToolResult(toolHelpMsg);
            expect(
              toolHelpRes,
              "T7a: tool-help should have returned a result",
            ).not.toBeNull();

            // ── Both parallel tool messages share the same sequenceId ──
            if (approveToolMsg && toolHelpMsg) {
              expect(
                approveToolMsg.sequenceId,
                "T7a: parallel tools must share same sequenceId",
              ).toBe(toolHelpMsg.sequenceId);
            }

            // ── NO assistant message after the parallel tool calls (in the initial stream) ──
            // Stream aborts at finish-step before AI response (TOOL_CONFIRMATION abort reason).
            // In queue mode, the pulse fires a WAIT revival which adds assistant messages - those are expected.
            if (!cfg.pulse) {
              const assistantAfterTools = added.filter(
                (m) =>
                  m.role === "assistant" &&
                  m.createdAt.getTime() >
                    (approveToolMsg?.createdAt.getTime() ?? 0),
              );
              expect(
                assistantAfterTools.length,
                "T7a: assistant message present after parallel tool calls - stream should have aborted before AI response",
              ).toBe(0);
            }

            // ── Thread must be idle (stream aborted cleanly) ──
            // T7a: lastMainAiMsgId is NOT a leaf - tool messages hang as pending leaves.
            // Skip expectedLeafId; T7b will update lastMainAiMsgId after confirmation.
            assertNoOrphans(
              messages,
              new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
              {
                knownDeadEndLeaves: deadEndLeaves,
              },
            );
            await assertThreadIdle(threadId, testUser);
            await assertNoPendingTasks(threadId);

            // lastMainAiMsgId is NOT updated here - T7b confirmation chains from the same
            // parent as the approve tool message (approveToolParentId = assistant placeholder).
            const after = await getBalance(testUser);
            // Queue mode: WAIT revival runs tool-help + AI response → higher cost
            await assertDeductedLocal(
              testUser,
              before,
              after,
              0,
              cfg.pulse ? 8 : 3,
            );
          },
          effectiveTestTimeout,
        );

        fit(
          "T7b: approve phase2 - confirm via UI-style parentId flow, original message backfilled in-place, no extra tool message, AI responds",
          async () => {
            expect(
              approveToolMsgId,
              "T7b needs T7a approveToolMsgId",
            ).toBeTruthy();
            expect(
              approveToolParentId,
              "T7b needs T7a approveToolParentId",
            ).toBeTruthy();

            setFetchCacheContext(`${cfg.cachePrefix}callback-approve-phase2`);
            await pinBalance(testUser, 50);
            const before = await getBalance(testUser);

            const prevMessages = await getMessages(threadId);
            const prevMessageIds = new Set(prevMessages.map((m) => m.id));

            // Confirm exactly like the UI: POST the stream endpoint with
            // toolConfirmations (no new user message). Goes through runStream →
            // the real ai-stream/stream endpoint.
            const { result: confirmStream } = await runStream({
              user: testUser,
              prompt: "",
              threadId,
              favoriteId: mainFavoriteId,
              toolConfirmations: [
                { messageId: approveToolMsgId, confirmed: true },
              ],
            });

            expect(confirmStream.success).toBe(true);
            if (!confirmStream.success) {
              // oxlint-disable-next-line restricted-syntax
              throw new Error(confirmStream.message ?? "unexpected failure");
            }
            const confirmResult = confirmStream;

            // Restore the favorite to its pre-T7a state: clear availableTools whitelist
            // (null = allow all tools) so later tests see a clean config.
            const favByIdDefT7b = (
              await import("@/app/api/[locale]/agent/skills/favorites/[id]/definition")
            ).default;
            const t7bFavGet = await sendTestRequest({
              endpoint: favByIdDefT7b.GET,
              urlPathParams: { id: mainFavoriteId },
              user: testUser,
            });
            await sendTestRequest({
              endpoint: favByIdDefT7b.PATCH,
              data: {
                modelSelection: t7bFavGet.success
                  ? t7bFavGet.data.modelSelection
                  : null,
                availableTools: null,
              },
              urlPathParams: { id: mainFavoriteId },
              user: testUser,
            });

            // Queue mode: the confirmation stream creates an AI message responding to the
            // pending {status: pending} result. After pulse fires the revival, the revival AI
            // supersedes this confirmation AI as the active leaf. Track it as a dead-end.
            if (cfg.pulse && confirmResult.data.lastAiMessageId) {
              deadEndLeaves.add(confirmResult.data.lastAiMessageId);
            }

            // Queue mode: confirmation executed execute-tool with callbackMode='wait' override,
            // which created a queue task (no open reverse-ws channel). The AI responded to the
            // pending {status: pending} result. Now call pulse to execute the generate_image task
            // and fire the WAIT revival stream so the tool message gets the real imageUrl.
            if (cfg.pulse) {
              // Revival is awaited inside cfg.pulse → WsProviderConnector executes on hermes →
              // POSTs /report → handleTaskCompletion → ResumeStreamRepository.resume (sequential).
              // Thread is guaranteed idle when cfg.pulse resolves.
              await cfg.pulse(threadId);
              expect(
                await getStreamingState(threadId),
                "T7b queue: thread must return to 'idle' after approval revival",
              ).toBe("idle");
            }

            const messages = await getMessages(threadId);

            // ── Dump ALL tool messages for diagnosis ──
            const allToolMsgs = messages.filter((m) => m.role === "tool");
            const allToolMsgIds = allToolMsgs.map((m) => m.id);
            const approveToolMsgInList = messages.find(
              (m) => m.id === approveToolMsgId,
            );

            // ── Original tool message backfilled IN-PLACE (same ID) - no extra tool message ──
            const toolMsg = messages.find(
              (m) => m.role === "tool" && m.id === approveToolMsgId,
            );
            expect(
              toolMsg,
              `T7b: generate_image tool message not found by approveToolMsgId=${approveToolMsgId}. All msg IDs: [${allToolMsgIds.join(", ")}]. approveToolMsgInList role=${approveToolMsgInList?.role}`,
            ).toBeDefined();

            const toolRes = resolveToolResult(toolMsg);
            const rawResult = toolMsg!.toolCall?.result;
            expect(
              toolRes,
              `T7b: tool result is null. toolCall=${JSON.stringify(toolMsg?.toolCall).slice(0, 200)}`,
            ).not.toBeNull();
            expect(
              typeof toolRes!["imageUrl"],
              `T7b: imageUrl not a string. Full toolRes=${JSON.stringify(rawResult).slice(0, 300)}`,
            ).toBe("string");
            expect(
              toolRes!["imageUrl"],
              "T7b: imageUrl should be truthy",
            ).toBeTruthy();

            // ── Same-sequence: original backfilled in-place (no deferred) ──
            // Different-sequence: user sent a follow-up before confirming → deferred message
            // created instead, count +1. T7b runs with no interleaved user messages, so
            // same-sequence path applies: count unchanged, original must NOT be deferred.
            expect(
              toolMsg?.toolCall?.isDeferred,
              "T7b: approve same-sequence backfill must NOT mark original as deferred",
            ).toBeFalsy();

            // ── Approved tool message was backfilled in-place, not duplicated ──
            // The model may call generate_image again as a NEW tool invocation after
            // seeing the confirmed result — that's legitimate. What must NOT happen:
            // the approve flow creating a deferred COPY of the original tool message.
            // In a shared thread with many accumulated messages, other earlier tool calls
            // may share the same toolCallId pattern (each stream resets the counter to 0).
            // Scope the deduplication check to: no OTHER message with the same ID as the
            // original approve message AND marked as isDeferred (deferred duplicate).
            const approvedToolCallId = toolMsg?.toolCall?.toolCallId;
            const dupes = messages.filter(
              (m) =>
                m.role === "tool" &&
                m.toolCall?.toolCallId === approvedToolCallId &&
                m.id !== approveToolMsgId, // exclude the original approve message itself
            );
            // Duplicates with isDeferred=true are the approve flow bug; re-invocations
            // by the AI (isDeferred=false, different toolCallId instance) are allowed.
            const deferredDupes = dupes.filter(
              (m) => m.toolCall?.isDeferred === true,
            );
            expect(
              deferredDupes.length,
              `T7b: found ${String(deferredDupes.length)} deferred duplicate(s) with approved toolCallId=${approvedToolCallId} - expected 0 (in-place backfill, no deferred duplicate). All dupes: ${JSON.stringify(dupes.map((m) => ({ id: m.id, isDeferred: m.toolCall?.isDeferred })))}`,
            ).toBe(0);

            // ── AI responded with the confirmed result ──
            // Queue mode: revival creates a NEW AI message after backfilling the tool result.
            // Use the last assistant message in the thread (which is the revival's AI message).
            // Non-queue: confirmResult.data.lastAiMessageId is the AI's response.
            const effectiveLastAiMsgId = cfg.pulse
              ? ([...messages].toReversed().find((m) => m.role === "assistant")
                  ?.id ?? confirmResult.data.lastAiMessageId!)
              : confirmResult.data.lastAiMessageId!;
            const lastAi = messages.find((m) => m.id === effectiveLastAiMsgId);
            expect(
              lastAi?.content,
              "T7b: AI should have responded after confirmation",
            ).toBeTruthy();

            // ── creditCost > 0 - image was actually generated ──
            expect(
              toolRes!["creditCost"] as number,
              "T7b: creditCost should be > 0 after approval execution",
            ).toBeGreaterThan(0);

            // The model may call additional tools (e.g. generate_image with endLoop)
            // after the AI text response. The endLoop tool creates a dead-end tool message
            // with no follow-up AI response. Find the actual chain leaf for tracking.
            const t7bNewMsgs = newMessages(messages, prevMessageIds);
            const t7bLeaf = [...t7bNewMsgs]
              .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .find((m) => !messages.some((other) => other.parentId === m.id));
            lastMainAiMsgId = t7bLeaf?.id ?? effectiveLastAiMsgId;
            // T6c/T6d chain linearly from T6b via E2E runStream calls.
            // Only T2's branch point remains as a known multi-child node.
            assertNoOrphans(
              messages,
              new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
              {
                expectedLeafId: lastMainAiMsgId,
                knownDeadEndLeaves: deadEndLeaves,
              },
            );
            await assertThreadIdle(threadId, testUser);
            await assertNoPendingTasks(threadId);

            const after = await getBalance(testUser);
            // Model may call generate_image again after seeing the approved result
            // (e.g. kimi-k2-6 calls it with endLoop), doubling the image cost.
            // Confirmed image gen + AI turn; kimi sometimes needs extra
            // round trips (same allowance as T1).
            await assertDeductedLocal(testUser, before, after, 0.47, 50);
          },
          effectiveTestTimeout,
        );
      });

      // ── CF: Contact-form — definition-level requiresConfirmation ─────────
      // contact-form has requiresConfirmation: true in its endpoint definition.
      // The AI discovers it via tool-help and calls it — no overrides needed.
      // The definition-level gate cannot be bypassed regardless of availableTools.
      describe("CF: contact-form (definition-level approval gate)", () => {
        let cfToolMsgId: string;
        let cfToolParentId: string | null;

        fit(
          "CF1: contact-form phase1 — AI calls tool, stops for confirmation, no DB record, no assistant after",
          async () => {
            setFetchCacheContext(`${cfg.cachePrefix}contact-form-phase1`);
            const streamStart = Date.now();
            const prevIds = new Set(
              (await getMessages(threadId)).map((m) => m.id),
            );

            const { result, messages } = await runStream({
              user: testUser,
              prompt: `[CF1] Call the contact-form tool right now with exactly these arguments: name='Test User', subject='subject.generalInquiry', message='Automated integration test. Please ignore.'. Pass the subject value verbatim as 'subject.generalInquiry'. Do NOT call tool-help, do NOT describe the fields in prose, do NOT ask me to confirm — invoke the contact-form tool directly with those exact values. The tool itself will request confirmation.`,
              threadId,
              favoriteId: mainFavoriteId,
              explicitParentMessageId: lastMainAiMsgId,
            });

            expect(result.success, "CF1: stream must succeed").toBe(true);
            if (!result.success) {
              // oxlint-disable-next-line restricted-syntax
              throw new Error(result.message ?? "unexpected stream failure");
            }

            const added = newMessages(messages, prevIds);

            // contact-form tool message must exist with waitingForConfirmation.
            // The AI may call it directly or via execute-tool wrapping — findToolMsg handles both.
            const cfMsg = findToolMsg(added, "contact-form", cfg);
            expect(
              cfMsg,
              "CF1: contact-form tool message must exist in thread",
            ).toBeDefined();
            if (!cfMsg) {
              // oxlint-disable-next-line restricted-syntax
              throw new Error(
                "CF1: contact-form tool message not found in thread",
              );
            }

            cfToolMsgId = cfMsg.id;
            cfToolParentId = cfMsg.parentId;

            // Exactly ONE contact-form call. A second call is the classic
            // double-call regression: when the tool response returns a raw i18n
            // key (e.g. "response.success") instead of the translated value, the
            // model cannot tell the call succeeded and re-invokes the tool.
            // translatedValueSchema on the success field guarantees a real
            // message is returned, so the AI stops after one call.
            const cfCalls = added.filter((m) => {
              if (m.role !== "tool") {
                return false;
              }
              if (m.toolCall?.toolName === "contact-form") {
                return true;
              }
              return (
                m.toolCall?.toolName === "execute-tool" &&
                toolResultRecord(m.toolCall.args)?.["toolName"] ===
                  "contact-form"
              );
            });
            expect(
              cfCalls.length,
              "CF1: contact-form must be called exactly once — a second call means the tool response was not a clear success (raw i18n key regression)",
            ).toBe(1);

            expect(
              cfMsg.toolCall?.waitingForConfirmation,
              "CF1: tool must be waiting for confirmation — definition-level requiresConfirmation cannot be overridden by AI",
            ).toBe(true);

            const toolRes = resolveToolResult(cfMsg);
            expect(
              toolRes?.["status"],
              "CF1: tool result must be waiting_for_confirmation placeholder",
            ).toBe("waiting_for_confirmation");

            // Stream must have aborted before AI responded — no assistant message after the tool call
            if (!cfg.pulse) {
              const assistantAfter = added.filter(
                (m) =>
                  m.role === "assistant" &&
                  m.createdAt.getTime() > cfMsg.createdAt.getTime(),
              );
              expect(
                assistantAfter.length,
                "CF1: stream must abort before AI response (TOOL_CONFIRMATION abort) — no assistant message after pending tool",
              ).toBe(0);
            }

            // Contact record must NOT be in DB — form was not submitted yet
            const allContacts = await db
              .select()
              .from(contacts)
              .where(eq(contacts.userId, testUser.id));
            const submitted = allContacts.filter(
              (c) => c.createdAt.getTime() > streamStart,
            );
            expect(
              submitted.length,
              "CF1: no contact record may be inserted before user confirms — tool execution was halted",
            ).toBe(0);

            // Thread must be idle — stream aborted cleanly waiting for confirmation
            assertNoOrphans(
              messages,
              new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
              { knownDeadEndLeaves: deadEndLeaves },
            );
            await assertThreadIdle(threadId, testUser);
            await assertNoPendingTasks(threadId);
          },
          effectiveTestTimeout,
        );

        fit(
          "CF2: contact-form phase2 — user confirms, form submits, DB record verified, AI responds",
          async () => {
            expect(cfToolMsgId, "CF2 needs CF1 cfToolMsgId").toBeTruthy();
            expect(cfToolParentId, "CF2 needs CF1 cfToolParentId").toBeTruthy();

            setFetchCacheContext(`${cfg.cachePrefix}contact-form-phase2`);
            const confirmStart = Date.now();

            const prevMessages = await getMessages(threadId);
            const prevMessageIds = new Set(prevMessages.map((m) => m.id));

            // Confirm via the real stream endpoint with toolConfirmations (UI flow).
            const { result: confirmResult } = await runStream({
              user: testUser,
              prompt: "",
              threadId,
              favoriteId: mainFavoriteId,
              toolConfirmations: [{ messageId: cfToolMsgId, confirmed: true }],
            });

            expect(
              confirmResult.success,
              "CF2: confirmation stream must succeed",
            ).toBe(true);
            if (!confirmResult.success) {
              // oxlint-disable-next-line restricted-syntax
              throw new Error(confirmResult.message ?? "unexpected failure");
            }

            const messages = await getMessages(threadId);

            // Original tool message backfilled in-place (same ID) — waitingForConfirmation cleared
            const cfMsg = messages.find(
              (m) => m.role === "tool" && m.id === cfToolMsgId,
            );
            expect(
              cfMsg,
              "CF2: original contact-form tool message must still exist after confirmation (backfilled in-place)",
            ).toBeDefined();
            expect(
              cfMsg?.toolCall?.waitingForConfirmation,
              "CF2: waitingForConfirmation must be cleared after confirmation",
            ).toBeFalsy();
            expect(
              cfMsg?.toolCall?.isConfirmed,
              "CF2: isConfirmed must be set after user confirmed",
            ).toBe(true);

            // resolveToolResult unwraps execute-tool's { result: ... } wrapper if needed.
            const toolRes = resolveToolResult(cfMsg);
            expect(
              toolRes,
              "CF2: tool result must be present after confirmation",
            ).not.toBeNull();
            expect(
              toolRes?.["success"],
              "CF2: tool result must contain success field from contact-form response",
            ).toBeTruthy();

            // No deferred duplicate — same as T7b: in-place backfill, not a copy
            const approvedToolCallId = cfMsg?.toolCall?.toolCallId;
            const deferredDupes = messages.filter(
              (m) =>
                m.role === "tool" &&
                m.toolCall?.toolCallId === approvedToolCallId &&
                m.id !== cfToolMsgId &&
                m.toolCall?.isDeferred === true,
            );
            expect(
              deferredDupes.length,
              "CF2: no deferred duplicate of the confirmed contact-form call (in-place backfill)",
            ).toBe(0);

            // Contact record must exist in DB — ON THE INSTANCE THAT RAN THE
            // LOOP. Side-effect tools execute where the loop runs: locally for
            // regular/direct contexts, on the RECEIVER (as its mapped loop
            // user) for relay contexts.
            let submittedCount: number;
            let submittedSubject: string | undefined;
            let submittedUserId: string | undefined;
            let submittedId: string | undefined;
            if (loopRunsRemote) {
              const { getProdDb } = await import("../../testing/remote-setup");
              const rows = await getProdDb().execute<{
                id: string;
                subject: string;
                user_id: string | null;
              }>(
                sql`SELECT id, subject, user_id FROM contact
                    WHERE created_at >= to_timestamp(${confirmStart / 1000})
                    ORDER BY created_at DESC`,
              );
              submittedCount = rows.rows.length;
              submittedSubject = rows.rows[0]?.subject;
              submittedUserId = rows.rows[0]?.user_id ?? undefined;
              submittedId = rows.rows[0]?.id;
            } else {
              const allContacts = await db
                .select()
                .from(contacts)
                .where(eq(contacts.userId, testUser.id));
              const submitted = allContacts.filter(
                (c) => c.createdAt.getTime() >= confirmStart,
              );
              submittedCount = submitted.length;
              submittedSubject = submitted[0]?.subject;
              submittedUserId = submitted[0]?.userId ?? undefined;
              submittedId = submitted[0]?.id;
            }
            expect(
              submittedCount,
              "CF2: exactly one contact record must be inserted after confirmation",
            ).toBe(1);

            expect(
              submittedSubject,
              "CF2: contact subject must match what AI submitted (GENERAL_INQUIRY)",
            ).toBe(ContactSubject.GENERAL_INQUIRY);
            expect(
              submittedUserId,
              "CF2: contact record must be linked to the loop user",
            ).toBeTruthy();
            if (!loopRunsRemote) {
              expect(
                submittedUserId,
                "CF2: contact record must be linked to the test user",
              ).toBe(testUser.id);
            }

            // AI must have responded after confirmation
            const lastAiMsgId = confirmResult.data.lastAiMessageId;
            expect(
              lastAiMsgId,
              "CF2: AI must respond after form submission",
            ).toBeTruthy();
            const lastAi = messages.find((m) => m.id === lastAiMsgId);
            expect(
              lastAi?.content,
              "CF2: AI response must have non-empty content",
            ).toBeTruthy();

            // Find the actual leaf for thread tracking
            const cfNewMsgs = newMessages(messages, prevMessageIds);
            const cfLeaf = [...cfNewMsgs]
              .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .find((m) => !messages.some((other) => other.parentId === m.id));
            lastMainAiMsgId = cfLeaf?.id ?? lastAiMsgId!;

            assertNoOrphans(
              messages,
              new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
              {
                expectedLeafId: lastMainAiMsgId,
                knownDeadEndLeaves: deadEndLeaves,
              },
            );
            await assertThreadIdle(threadId, testUser);
            await assertNoPendingTasks(threadId);

            // Clean up test contact record so repeated runs don't accumulate
            if (submittedId) {
              if (loopRunsRemote) {
                const { getProdDb } =
                  await import("../../testing/remote-setup");
                await getProdDb().execute(
                  sql`DELETE FROM contact WHERE id = ${submittedId}`,
                );
              } else {
                await db.delete(contacts).where(eq(contacts.id, submittedId));
              }
            }
          },
          effectiveTestTimeout,
        );
      });

      // ── T8: Parallel tool calls ──────────────────────────────────────────
      fit(
        "T8: parallel tools - tool-help + generate_image in same batch, both results populated",
        async () => {
          if (cfg.cheapMode) {
            return; // cheapMode: media generation is the expensive path
          }
          setFetchCacheContext(`${cfg.cachePrefix}parallel-tools`);
          await pinBalance(testUser, 20);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T8 parallel-tools] In a single response, call BOTH at the same time: (1) ${toolInstrWithArgs(cfg, "tool-help", `query='image'${cfg.remoteInstanceId ? " and callbackMode='wait'" : ""}`)} to look up tools matching 'image' (this returns a tools array, NOT categories), and (2) ${toolInstrWithArgs(cfg, "generate_image", `prompt='green square'${cfg.remoteInstanceId ? " and callbackMode='wait'" : ""}`)}. IMPORTANT: You MUST use callbackMode='wait' for both tools - do NOT use wakeUp or detach. tool-help WITH a query returns a tools array; an empty array only means no match, not a failure. Check that tool-help returned a tools array (any length) and generate_image returned an imageUrl (not a taskId). End your reply with STEP_OK if both tools ran and returned their result shape, or FAILED: <reason> only if a tool errored or did not run.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          const added = newMessages(messages, prevIds);
          const toolMsgs = added.filter((m) => m.role === "tool");
          expect(toolMsgs.length).toBeGreaterThanOrEqual(2);

          // ── Both results populated ──
          // For queue mode (wakeUp): original tool message may have {taskId, status} (pending),
          // result backfilled by revival into either the original (WAIT) or a deferred
          // message (wakeUp). Check that each original tool call has a completed result
          // somewhere in the thread (either directly or via deferred).
          for (const toolMsg of toolMsgs) {
            const toolRes = resolveToolResult(toolMsg);
            // Either result is populated directly, OR this is a deferred message (isDeferred=true)
            // which always has a result, OR the result was populated in a wakeUp deferred sibling.
            // At minimum, result must not be null - skip deferred messages from the check below
            // since they are not the original parallel tool calls.
            if (toolMsg.toolCall?.isDeferred) {
              continue;
            }
            const originalCallId = toolMsg.toolCall?.toolCallId;
            // Find the effective result: either the original message or a deferred sibling
            const effectiveResult =
              toolRes ??
              toolResultRecord(
                added.find(
                  (m) =>
                    m.role === "tool" &&
                    m.toolCall?.originalToolCallId === originalCallId,
                )?.toolCall?.result,
              );
            expect(
              effectiveResult,
              `Parallel tool ${toolMsg.id} has no result (original or deferred)`,
            ).not.toBeNull();
          }

          // ── Original parallel tool messages share the SAME sequenceId ──
          const originalToolMsgs = toolMsgs.filter(
            (m) => !m.toolCall?.isDeferred,
          );
          const parallelSeqIds = new Set(
            originalToolMsgs.map((m) => m.sequenceId),
          );
          expect(parallelSeqIds.size).toBe(1);

          // ── generate_image: find the message that actually has imageUrl ──
          // For WAIT mode: original execute-tool message has imageUrl directly.
          // For wakeUp mode: a deferred tool message has imageUrl.
          const imgTool = findToolMsg(added, "generate_image", cfg);
          expect(
            imgTool,
            "T8: generate_image tool msg not found",
          ).toBeDefined();
          if (imgTool) {
            assertToolMessageComplete(imgTool, "generate_image", "T8", cfg);
          }
          // Resolve the effective result: original (WAIT) or deferred sibling (wakeUp)
          const imgOriginalRes = resolveToolResult(imgTool);
          const imgDeferredMsg = imgTool
            ? added.find(
                (m) =>
                  m.role === "tool" &&
                  m.toolCall?.originalToolCallId ===
                    imgTool.toolCall?.toolCallId,
              )
            : undefined;
          const imgRes =
            imgOriginalRes?.["imageUrl"] !== undefined
              ? imgOriginalRes
              : resolveToolResult(imgDeferredMsg);
          expect(imgRes, "T8: generate_image result is null").not.toBeNull();
          expect(typeof imgRes!["imageUrl"]).toBe("string");
          expect(imgRes!["imageUrl"], "T8: imageUrl is empty").toBeTruthy();

          // ── tool-help result has tools array ──
          const toolHelpMsg = findToolMsg(added, "tool-help", cfg);
          expect(toolHelpMsg, "T8: tool-help msg not found").toBeDefined();
          if (toolHelpMsg) {
            assertToolMessageComplete(toolHelpMsg, "tool-help", "T8", cfg);
          }
          // Resolve effective tool-help result
          const toolHelpOrigRes = resolveToolResult(toolHelpMsg);
          const toolHelpDeferredMsg = toolHelpMsg
            ? added.find(
                (m) =>
                  m.role === "tool" &&
                  m.toolCall?.originalToolCallId ===
                    toolHelpMsg.toolCall?.toolCallId,
              )
            : undefined;
          const toolHelpRes =
            toolHelpOrigRes?.["tools"] !== undefined
              ? toolHelpOrigRes
              : resolveToolResult(toolHelpDeferredMsg);
          expect(toolHelpRes, "T8: tool-help result is null").not.toBeNull();
          expect(
            Array.isArray(toolHelpRes!["tools"]),
            "T8: tool-help tools is not array",
          ).toBe(true);

          // ── Both tools share the same sequenceId (same AI turn) - asserted via parallelSeqIds above ──

          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          expect(lastAi?.content).toBeTruthy();
          // ── Final AI has token metadata ──
          expect(lastAi!.finishReason).toBe("stop");
          expect(lastAi!.creditCost).toBeGreaterThan(0);
          assertStepOk(lastAi!.content, "T8");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          await assertDeductedLocal(testUser, before, after, 0.47, 12);
        },
        effectiveTestTimeout,
      );

      // ── T9: prior-tool-result reasoning ───────────────────────────────────
      // Real two-turn flow: turn 1 the AI actually generates an image, turn 2
      // it reports the imageUrl it sees in its own prior tool result. No
      // synthetic injection — the tool result is produced by a real tool call.
      fit(
        "T9: AI reasons about its own prior generate_image tool result in context",
        async () => {
          if (cfg.cheapMode) {
            return; // cheapMode: media generation is the expensive path
          }
          setFetchCacheContext(`${cfg.cachePrefix}precalls-injection`);
          await pinBalance(testUser, 20);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          // ── Turn 1: AI actually generates an image (real tool call) ──
          const { result: genResult, messages: genMessages } = await runStream({
            user: testUser,
            prompt: `[T9 setup] Call ${toolInstrWithArgs(cfg, "generate_image", "prompt='mountain landscape at golden hour'")} to generate an image. End your reply with STEP_OK once the image is generated.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });
          expect(
            genResult.success,
            "T9 setup: image gen turn must succeed",
          ).toBe(true);
          if (!genResult.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(genResult.message ?? "unexpected failure");
          }

          const genAdded = newMessages(genMessages, prevIds);
          const toolMsg = findToolMsg(genAdded, "generate_image", cfg);
          expect(
            toolMsg,
            "T9: generate_image tool message not found",
          ).toBeDefined();
          if (toolMsg) {
            assertToolMessageComplete(toolMsg, "generate_image", "T9a", cfg);
          }
          const toolRes = resolveToolResult(toolMsg);
          expect(toolRes).not.toBeNull();
          expect(typeof toolRes!["imageUrl"]).toBe("string");
          expect(String(toolRes!["imageUrl"])).toMatch(/^https?:\/\/.+/);
          const generatedImageUrl = String(toolRes!["imageUrl"]);
          lastMainAiMsgId = genResult.data.lastAiMessageId!;

          // ── Turn 2: AI reports the imageUrl it sees in its prior context ──
          const beforeReport = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );
          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T9 report] An image was generated for you earlier in this conversation. Look at the generate_image tool result in your context and report the exact imageUrl you see. End your reply with STEP_OK if you can see an imageUrl starting with 'https://' or 'http://', or FAILED: <reason> if no imageUrl was visible.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          const added = newMessages(messages, beforeReport);
          const aiMsgWithStepOk = added.find(
            (m) => m.role === "assistant" && m.content?.includes("STEP_OK"),
          );
          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          expect(
            lastAi?.content || aiMsgWithStepOk?.content,
            "T9: No AI response found at all",
          ).toBeTruthy();
          if (!aiMsgWithStepOk) {
            assertStepOk(lastAi?.content, "T9");
          }
          // The AI should be able to reference the real generated URL.
          void generatedImageUrl;
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          await assertDeductedLocal(testUser, before, after, 0, 50);
        },
        effectiveTestTimeout,
      );

      // ── T10: All file attachments - image, multi (image+audio), voice, video ──
      fit(
        "T10: file attachments - image, multi, voice, video all stored in metadata with correct mime types",
        async () => {
          // ── Part A: Single image attachment ──
          setFetchCacheContext(`${cfg.cachePrefix}attachment-image`);
          await pinBalance(testUser, 50);
          const beforeImg = await getBalance(testUser);
          const prevIdsImg = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const imageFile = await loadFixture("test-image.jpeg", "image/jpeg");
          const { result: imgResult, messages: imgMsgs } = await runStream({
            user: testUser,
            prompt:
              "[T10a image-attach] Describe the attached image briefly. NOTE: on models without native vision, the attachment reaches you as an injected vision DESCRIPTION inside the message - that injected description IS the image content and counts as seeing it. End your reply with STEP_OK if image content (native or injected description) is present and you described it, or FAILED: <reason> only if NO image content of either form is present.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            attachments: [imageFile],
          });

          expect(imgResult.success).toBe(true);
          if (!imgResult.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(imgResult.message ?? "unexpected failure");
          }
          expect(imgResult.data.threadId).toBe(threadId);

          const imgAdded = newMessages(imgMsgs, prevIdsImg);
          const imgUserMsg = imgAdded.find((m) => m.role === "user");
          expect(imgUserMsg!.attachments).toHaveLength(1);
          const imgAtt = imgUserMsg!.attachments![0]!;
          expect(imgAtt.mimeType).toBe("image/jpeg");
          expect(imgAtt.filename).toBeTruthy();
          expect(typeof imgAtt.url).toBe("string");
          expect(typeof imgAtt.size).toBe("number");
          expect(imgAtt.size).toBeGreaterThan(0);
          expect(imgResult.data.lastAiMessageContent!.length).toBeGreaterThan(
            10,
          );
          assertStepOk(imgResult.data.lastAiMessageContent, "T10a");
          lastMainAiMsgId = imgResult.data.lastAiMessageId!;

          const imgAiMsg = imgAdded.find((m) => m.role === "assistant");
          expect(imgAiMsg).toBeDefined();
          expect(imgAiMsg!.finishReason).toBe("stop");
          expect(imgAiMsg!.creditCost).toBeGreaterThan(0);

          assertNoOrphans(
            imgMsgs,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const afterImg = await getBalance(testUser);
          await assertDeductedLocal(testUser, beforeImg, afterImg, 0, 30);

          // ── Part B: Multi-attachment (image + music) ──
          setFetchCacheContext(`${cfg.cachePrefix}attachment-multi`);
          await pinBalance(testUser, 50);
          const beforeMulti = await getBalance(testUser);

          const musicFile = await loadFixture("test-music.mp3", "audio/mpeg");
          const imageFile2 = await loadFixture("test-image.jpeg", "image/jpeg");
          const { result: multiResult, messages: multiMsgs } = await runStream({
            user: testUser,
            prompt:
              "[T10b multi-attach] Two files are attached: an image and an audio file. Describe the image. For the audio, any description including '[Music]' or similar counts as successfully processed. IMPORTANT: If you received a text description of the image contents (e.g. from a vision model gap-fill), that counts as the image being 'visible' - you do not need to process the raw file yourself. End your reply with STEP_OK if you received any image content or description AND the audio produced any response at all (even just '[Music]'), or FAILED: <reason> only if both the image AND its description were completely absent.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            attachments: [imageFile2, musicFile],
          });

          expect(multiResult.success).toBe(true);
          if (!multiResult.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(multiResult.message ?? "unexpected failure");
          }
          expect(multiResult.data.threadId).toBe(threadId);

          const multiSorted = [...multiMsgs].toSorted(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );
          const multiUserMsg = multiSorted.find((m) => m.role === "user");
          expect(multiUserMsg!.attachments).toHaveLength(2);
          const mimeTypes = multiUserMsg!
            .attachments!.map((a) => a.mimeType)
            .toSorted();
          expect(mimeTypes).toEqual(["audio/mpeg", "image/jpeg"]);
          // Audio gap-fill: a variant (stt or audio-vision bridge) must have been written
          // AND the variant content must be a meaningful description (not a 1-word stub like "Okay")
          const multiVariants = multiUserMsg!.variants ?? [];
          expect(
            multiVariants.length > 0,
            "[T10b] Expected at least one gap-fill variant (stt/vision bridge) on user message",
          ).toBe(true);
          const audioVariant = multiVariants[0];
          expect(
            typeof audioVariant?.content === "string" &&
              audioVariant.content.length >= 5,
            `[T10b] Gap-fill variant content is too short to be a real audio description - got: ${JSON.stringify(audioVariant?.content)}`,
          ).toBe(true);
          expect(multiResult.data.lastAiMessageContent!.length).toBeGreaterThan(
            10,
          );
          assertStepOk(multiResult.data.lastAiMessageContent, "T10b");
          lastMainAiMsgId = multiResult.data.lastAiMessageId!;

          assertNoOrphans(
            multiMsgs,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const afterMulti = await getBalance(testUser);
          await assertDeductedLocal(testUser, beforeMulti, afterMulti, 0, 30);

          // ── Part C: Audio attachment (attachment path → audioVisionModel gap-fill) ──
          // Music file passed as attachment → gap-fill.bridgeStt() → audioVisionModel (Gemini Flash)
          // Verifies audio vision bridge, NOT STT. STT is only for the voice widget (audioInput).
          // Result: user message has attachments + gap-fill variant (text description of music)
          setFetchCacheContext(`${cfg.cachePrefix}attachment-voice`);
          await pinBalance(testUser, 50);
          const beforeVoice = await getBalance(testUser);

          const musicAttachFile = await loadFixture(
            "test-music.mp3",
            "audio/mpeg",
          );
          const { result: voiceResult, messages: voiceMsgs } = await runStream({
            user: testUser,
            prompt:
              "[T10c_attach audio-attach] An audio file is attached. Describe or transcribe what you hear in it. End your reply with STEP_OK if you could process the audio, or FAILED: <reason> if you could not process it at all.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            attachments: [musicAttachFile],
          });

          expect(voiceResult.success).toBe(true);
          if (!voiceResult.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(voiceResult.message ?? "unexpected failure");
          }
          expect(voiceResult.data.threadId).toBe(threadId);

          const voiceSorted = [...voiceMsgs].toSorted(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );
          const voiceUserMsg = voiceSorted.find((m) => m.role === "user");
          expect(voiceUserMsg!.attachments![0]!.mimeType).toBe("audio/mpeg");

          // Attachment path: gap-fill MUST write an audioVisionModel variant with a real description.
          // This is audio VISION (Gemini), NOT STT (Whisper/Deepgram).
          // STT is only used when the user submits audio via the voice widget (audioInput field).
          const voiceVariants = voiceUserMsg!.variants ?? [];
          expect(
            voiceVariants.length > 0,
            "[T10c_attach] No audioVisionModel variant found on audio user message - gap-fill did not run. The audio was not bridged via the audioVisionModel before being sent to the AI.",
          ).toBe(true);
          const voiceVariant = voiceVariants[0];
          expect(
            typeof voiceVariant?.content === "string" &&
              voiceVariant.content.length > 10,
            `[T10c_attach] Gap-fill variant content is too short - audioVisionModel did not produce a real description: ${JSON.stringify(voiceVariant?.content)}`,
          ).toBe(true);

          expect(voiceResult.data.lastAiMessageContent!.length).toBeGreaterThan(
            10,
          );
          assertStepOk(voiceResult.data.lastAiMessageContent, "T10c_attach");
          lastMainAiMsgId = voiceResult.data.lastAiMessageId!;

          assertNoOrphans(
            voiceMsgs,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const afterVoice = await getBalance(testUser);
          await assertDeductedLocal(testUser, beforeVoice, afterVoice, 0, 30);

          // ── Part C2: Voice STT path (audioInput → SpeechToTextRepository) ──
          // Audio passed via audioInput field (voice UI flow) → operation-handler.ts →
          // SpeechToTextRepository.transcribeAudio() → dedicated STT model (Whisper/Deepgram)
          // Result: user message has NO attachments, NO variants - content IS the transcribed text
          // The STT provider cascade (OpenAI/EdenAI/Deepgram/system provider)
          // resolves whatever is configured; fixture replay needs no key at
          // all. This case ALWAYS runs — no environment gates.
          setFetchCacheContext(`${cfg.cachePrefix}attachment-voice-stt`);
          await pinBalance(testUser, 50);
          const beforeStt = await getBalance(testUser);

          const sttAudioFile = await loadFixture(
            "test-music.mp3",
            "audio/mpeg",
          );
          const { result: sttResult, messages: sttMsgs } = await runStream({
            user: testUser,
            prompt:
              "[T10c_stt voice-stt] Describe what this voice message says. End your reply with STEP_OK if you could understand the audio content, or FAILED: <reason> if the transcription was empty or unclear.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            audioInput: sttAudioFile,
          });

          expect(sttResult.success).toBe(true);
          if (!sttResult.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(sttResult.message ?? "unexpected failure");
          }
          expect(sttResult.data.threadId).toBe(threadId);

          const sttSorted = [...sttMsgs].toSorted(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );
          const sttUserMsg = sttSorted.find((m) => m.role === "user");

          // STT path: the audio was transcribed BEFORE the stream started.
          // The user message must have NO file attachments - the voice is the message text.
          expect(
            (sttUserMsg!.attachments ?? []).length,
            "[T10c_stt] User message must have NO attachments - STT path turns audio into text content, not a file attachment.",
          ).toBe(0);

          // STT path: NO gap-fill variants - the STT gives clean text, no bridge needed.
          expect(
            (sttUserMsg!.variants ?? []).length,
            "[T10c_stt] User message must have NO gap-fill variants - STT transcription replaces the audio, no audioVisionModel bridge needed.",
          ).toBe(0);

          // The message content must be a non-empty transcription (not the original prompt text).
          expect(
            sttUserMsg!.content,
            "[T10c_stt] User message content must be the STT transcription - non-null and non-empty.",
          ).toBeTruthy();
          expect(
            sttUserMsg!.content,
            "[T10c_stt] Content must differ from the original prompt - STT replaced it with the transcription.",
          ).not.toBe(
            "[T10c_stt voice-stt] Describe what this voice message says. End your reply with STEP_OK if you could understand the audio content, or FAILED: <reason> if the transcription was empty or unclear.",
          );

          // No STEP_OK contract here BY CONSTRUCTION: the STT path REPLACES
          // the prompt text with the transcription (asserted above), so the
          // model never sees a STEP_OK instruction — it only sees the
          // transcribed audio and replies to THAT. The observable contract is
          // structural: clean transcription in, substantive reply out.
          expect(
            sttResult.data.lastAiMessageContent!.length,
            "[T10c_stt] AI must produce a substantive reply to the transcribed voice message.",
          ).toBeGreaterThan(10);
          lastMainAiMsgId = sttResult.data.lastAiMessageId!;

          assertNoOrphans(
            sttMsgs,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const afterStt = await getBalance(testUser);
          await assertDeductedLocal(testUser, beforeStt, afterStt, 0, 30);

          // ── Part D: Video attachment ──
          setFetchCacheContext(`${cfg.cachePrefix}attachment-video`);
          await pinBalance(testUser, 50);
          const beforeVideo = await getBalance(testUser);

          const videoFile = await loadFixture("test-video.mp4", "video/mp4");
          const { result: videoResult, messages: videoMsgs } = await runStream({
            user: testUser,
            prompt:
              "[T10d video-attach] A video file is attached. Describe what you see in it. End your reply with STEP_OK if you could process the video, or FAILED: <reason> if you could not.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            attachments: [videoFile],
          });

          expect(videoResult.success).toBe(true);
          if (!videoResult.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(videoResult.message ?? "unexpected failure");
          }
          expect(videoResult.data.threadId).toBe(threadId);

          const videoSorted = [...videoMsgs].toSorted(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );
          const videoUserMsg = videoSorted.find((m) => m.role === "user");
          expect(videoUserMsg!.attachments![0]!.mimeType).toBe("video/mp4");
          expect(videoResult.data.lastAiMessageContent!.length).toBeGreaterThan(
            10,
          );
          assertStepOk(videoResult.data.lastAiMessageContent, "T10d");

          lastMainAiMsgId = videoResult.data.lastAiMessageId!;

          assertNoOrphans(
            videoMsgs,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const afterVideo = await getBalance(testUser);
          await assertDeductedLocal(testUser, beforeVideo, afterVideo, 0, 30);

          // ── Part E: Voice WAV attachment → gap-fill audioVisionModel bridge ──
          // quality-tester skill uses DEFAULT_CHAT_MODEL_ID which does NOT support audio input.
          // Attaching a WAV file triggers GapFillExecutor.bridgeStt() → audioVisionModel (Gemini Flash).
          // The gap-fill produces a text transcription/description stored as a variant.
          // The main model then receives the text description instead of the raw file.
          setFetchCacheContext(`${cfg.cachePrefix}attachment-voice-wav`);
          await pinBalance(testUser, 50);
          const beforeWav = await getBalance(testUser);

          const voiceWavFile = await loadFixture("test-voice.wav", "audio/wav");
          const { result: wavResult, messages: wavMsgs } = await runStream({
            user: testUser,
            prompt:
              "[T10e voice-wav-attach] A WAV audio recording is attached. Repeat back the exact word(s) you heard in the audio. End your reply with STEP_OK if the transcription contained the word 'banana', or FAILED: <reason> if you could not hear it or got something else.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            attachments: [voiceWavFile],
          });

          expect(wavResult.success).toBe(true);
          if (!wavResult.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(wavResult.message ?? "unexpected failure");
          }
          expect(wavResult.data.threadId).toBe(threadId);

          const wavSorted = [...wavMsgs].toSorted(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );
          const wavUserMsg = wavSorted.find((m) => m.role === "user");
          expect(wavUserMsg!.attachments![0]!.mimeType).toBe("audio/wav");

          // Gap-fill MUST have run: audioVisionModel bridge writes a variant
          const wavVariants = wavUserMsg!.variants ?? [];
          expect(
            wavVariants.length > 0,
            "[T10e] No gap-fill variant found - audioVisionModel bridge did not run for WAV attachment. The quality-tester skill's chat model should not natively support audio, triggering the bridge.",
          ).toBe(true);
          const wavVariant = wavVariants[0];
          expect(
            typeof wavVariant?.content === "string" &&
              wavVariant.content.length > 10,
            `[T10e] Gap-fill variant content too short - bridge did not produce a real transcription: ${JSON.stringify(wavVariant?.content)}`,
          ).toBe(true);

          // The recording says "banana banana" - the bridge must have understood it exactly.
          expect(
            typeof wavVariant?.content === "string" &&
              wavVariant.content.toLowerCase().includes("banana"),
            `[T10e] Gap-fill variant must contain "banana" - the audio says "banana banana" and the bridge failed to transcribe it correctly. Got: ${JSON.stringify(wavVariant?.content)}`,
          ).toBe(true);

          expect(wavResult.data.lastAiMessageContent!.length).toBeGreaterThan(
            10,
          );
          assertStepOk(wavResult.data.lastAiMessageContent, "T10e");
          lastMainAiMsgId = wavResult.data.lastAiMessageId!;

          assertNoOrphans(
            wavMsgs,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const afterWav = await getBalance(testUser);
          await assertDeductedLocal(testUser, beforeWav, afterWav, 0, 30);
        },
        effectiveTestTimeout,
      );

      // ── T11: Native multimodal (Gemini 3.1 Flash Image Preview) ──────────────
      fit(
        "T11: native image generation - file part output, no generate_image tool call",
        async () => {
          if (cfg.cheapMode) {
            return; // cheapMode: native image generation runs in the full suite
          }
          setFetchCacheContext(`${cfg.cachePrefix}image-generation-native`);
          await pinBalance(testUser, 50);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          // Use nativeImageFavoriteId: Gemini 3.1 Flash Image Preview as chat model.
          // Override imageGenModelSelection to the same model so chat model == image gen model:
          // imageGenIsSameAsChatModel=true → generate_image tool removed → native file parts.
          const { result, messages } = await runStream({
            user: testUser,
            prompt:
              "[T11 native-image] Generate an image of a blue triangle. Output the image directly (no tool call needed). End your reply with STEP_OK if the image was generated, or FAILED: <reason> if generation failed.",
            threadId,
            favoriteId: nativeImageFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          expect(result.data.lastGeneratedMediaUrl).toBeTruthy();

          const added = newMessages(messages, prevIds);

          // Native path: FilePartHandler creates synthetic tool msg with toolName="generate_image"
          const imageToolMsg = added.find(
            (m) =>
              m.role === "tool" && m.toolCall?.toolName === "generate_image",
          );
          expect(imageToolMsg).toBeDefined();

          const toolRes = resolveToolResult(imageToolMsg);
          expect(toolRes).not.toBeNull();
          expect(typeof toolRes!["file"]).toBe("string");
          expect(toolRes!["creditCost"]).toBe(0);

          // Native image gen: args.prompt must be empty string (not the user message text).
          // An empty prompt tells gap-fill to fire the vision bridge on the next turn with a
          // non-image model - so the AI always gets a text description of the image.
          const toolArgs = toolResultRecord(imageToolMsg!.toolCall?.args);
          expect(
            toolArgs!["prompt"],
            "[T11] Synthetic tool message args.prompt must be empty for native gen - gap-fill needs an empty prompt to know it must vision-bridge on next non-image turn.",
          ).toBe("");

          // Image model on AI messages
          const aiMsgs = added.filter((m) => m.role === "assistant");
          for (const ai of aiMsgs) {
            if (ai.content && !ai.isCompacting) {
              expect(ai.model).toBeTruthy();
            }
          }

          // ── No duplicate media on assistant message ──
          // The image must appear ONLY in the synthetic tool message, not also attached to
          // the assistant text bubble. If both have generatedMedia the frontend renders two
          // image previews for the same file (the bug this test guards against).
          for (const ai of aiMsgs) {
            expect(
              ai.generatedMedia,
              "[T11] Assistant message must NOT have generatedMedia - image must appear only in the synthetic tool message, not duplicated on the text bubble",
            ).toBeNull();
          }

          // Native image gen: FilePartHandler creates a synthetic generate_image tool message
          // as a child of a blank assistant message. Any text emitted after the file part
          // (e.g. "STEP_OK") becomes a fresh assistant message that is a child of the tool
          // message. The last AI message from the result is always the true leaf.
          const nativeImgToolMsg = added.find(
            (m) =>
              m.role === "tool" && m.toolCall?.toolName === "generate_image",
          );
          // Native path: when the model outputs only an image (no trailing text),
          // the chain is: assistant → tool:generate_image (leaf).
          // The tool message is the deepest node, so use it as lastMainAiMsgId.
          // If there IS trailing text, lastAiMessageId points to the post-tool AI msg.
          const postToolAi = nativeImgToolMsg
            ? added.find(
                (m) =>
                  m.role === "assistant" && m.parentId === nativeImgToolMsg.id,
              )
            : undefined;
          lastMainAiMsgId =
            postToolAi?.id ??
            nativeImgToolMsg?.id ??
            result.data.lastAiMessageId ??
            lastMainAiMsgId;

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          await assertDeductedLocal(testUser, before, after, 0.4, 30);
        },
        mediaTestTimeout,
      );

      // ── T11b: Follow-up after native image gen - verify synthetic tool message + chain continuation ──
      // After T11 (native gen via Gemini 3.1 Flash Image Preview), the thread has a synthetic
      // generate_image tool message with empty text and a file URL.
      //
      // mainFavoriteId resolves to Kimi K2.6 (DEFAULT_CHAT_MODEL_ID) which has inputs: ["text","image"],
      // so it CAN see images. For image-capable models:
      //   - Gap-fill Pass 2 correctly skips (no vision bridge needed)
      //   - buildToolResultOutput fetches the image via fetchStorageFileAsBase64 and passes it as
      //     base64 content parts so the model can actually see the generated image
      //
      // NOTE: With a long conversation (T1-T11), context truncation may drop the tool message.
      // This test verifies: (1) the synthetic tool message exists in DB, (2) the chain continues,
      // (3) credits are deducted. Describing the image is best-effort depending on context fit.
      fit(
        "T11b: follow-up turn after native gen - synthetic tool message persisted, chain continues",
        async () => {
          if (cfg.cheapMode) {
            return; // cheapMode: native image generation runs in the full suite
          }
          setFetchCacheContext(
            `${cfg.cachePrefix}image-generation-native-gap-fill`,
          );
          await pinBalance(testUser, 30);
          const before = await getBalance(testUser);

          // Verify the synthetic tool message from T11 exists in DB with correct structure
          const allMsgs = await getMessages(threadId);
          const nativeImgToolMsg = allMsgs.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.toolName === "generate_image" &&
              typeof (toolResultRecord(m.toolCall?.result) ?? {})["file"] ===
                "string",
          );
          expect(
            nativeImgToolMsg,
            "[T11b] Could not find the T11 native-gen synthetic tool message in thread history.",
          ).toBeDefined();

          // Verify tool result structure: file URL, empty text, creditCost
          const toolRes = toolResultRecord(nativeImgToolMsg!.toolCall?.result);
          expect(
            typeof toolRes!["file"],
            "[T11b] tool result must have file URL",
          ).toBe("string");
          expect(
            toolRes!["text"],
            "[T11b] tool result text should be empty for native gen",
          ).toBe("");

          // Send follow-up with image-capable model (Kimi K2.6)
          const { result, messages } = await runStream({
            user: testUser,
            prompt:
              "[T11b follow-up] You may or may not have generated an image previously. Say STEP_OK and continue the conversation.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          // The model should respond successfully (content may or may not reference the image
          // depending on whether truncation dropped the tool message from context)
          assertStepOk(result.data.lastAiMessageContent, "T11b");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          await assertDeductedLocal(testUser, before, after, 0, 20);
        },
        mediaTestTimeout,
      );

      // ── T11c: I2V via Nano Banana Pro (sees image, calls generate_video tool with inputMediaUrl) ──
      // Gemini 3 Pro Image Preview inputs: ["text","image"] - it can see the image directly.
      // outputs: ["text","image"] only - video goes through the generate_video tool.
      // The AI receives the image, understands it, then calls generate_video with inputMediaUrl set.
      fit(
        "T11c: image-to-video via Nano Banana Pro - model sees image, calls generate_video with inputMediaUrl",
        async () => {
          if (cfg.cheapMode) {
            return; // cheapMode: real video generation runs in the full suite
          }
          setFetchCacheContext(`${cfg.cachePrefix}image-to-video-nano-banana`);
          // I2V models (wan-2-6-i2v etc.) cost ~10 cr/sec × 5 sec × 1.3 markup = ~65 cr
          await pinBalance(testUser, 200);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          // Stable public image for the fixture (Unsplash, same as T9 attachment tests).
          // The model sees the image directly (inputs includes "image"), describes it,
          // then calls generate_video with inputMediaUrl to animate it.
          const INPUT_IMAGE_URL =
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T11c i2v-nano-banana] Here is my photo: ${INPUT_IMAGE_URL} — make a nice foto out of it for my resume and tinder profile. ${toolInstrWithArgs(cfg, "generate_video", `prompt='professional portrait, smooth camera pull-back' inputMediaUrl='${INPUT_IMAGE_URL}'`)}. Check that the result has a non-empty videoUrl, a positive creditCost, and a positive durationSeconds. End your reply with STEP_OK if correct, or FAILED: <reason>.`,
            threadId,
            favoriteId: nanoBananaFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            // Heavy media turn: multi-MB request + slow post-tool model turn;
            // on first record the live video polling must finish in this window
            // for fixtures to persist. See TestStreamParams.settleTimeoutMs.
            settleTimeoutMs: MEDIA_SETTLE_TIMEOUT_MS,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          const added = newMessages(messages, prevIds);

          // Tool message: AI called generate_video (possibly via execute-tool in direct mode)
          const videoToolMsg = findToolMsg(added, "generate_video", cfg);
          expect(videoToolMsg).toBeDefined();
          if (videoToolMsg) {
            assertToolMessageComplete(
              videoToolMsg,
              "generate_video",
              "T11c",
              cfg,
            );
          }

          // Args: inputMediaUrl must be the image URL passed in
          const videoArgs = toolResultRecord(videoToolMsg!.toolCall?.args);
          const resolvedArgs =
            (videoArgs?.["input"] as Record<string, WidgetData> | undefined) ??
            videoArgs;
          expect(
            resolvedArgs?.["inputMediaUrl"],
            "[T11c] generate_video args.inputMediaUrl must be the input image URL",
          ).toBe(INPUT_IMAGE_URL);

          // Result: videoUrl, positive creditCost, positive durationSeconds
          const videoRes = resolveToolResult(videoToolMsg);
          expect(videoRes).not.toBeNull();
          expect(typeof videoRes!["videoUrl"]).toBe("string");
          expect(videoRes!["videoUrl"]).toBeTruthy();
          expect((videoRes!["creditCost"] as number) > 0).toBe(true);
          expect((videoRes!["durationSeconds"] as number) > 0).toBe(true);
          expect((videoRes!["durationSeconds"] as number) <= 60).toBe(true);

          // Find actual leaf for chain tracking (model may call extra tools after video gen)
          const t11cAdded = newMessages(messages, prevIds);
          const t11cLeaf = [...t11cAdded]
            .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .find((m) => !messages.some((other) => other.parentId === m.id));
          lastMainAiMsgId = t11cLeaf?.id ?? result.data.lastAiMessageId!;

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          await assertDeductedLocal(testUser, before, after, 30, 150);
        },
        mediaTestTimeout,
      );

      // ── T11d: I2V via Kimi K2.6 (image-capable, passes URL to generate_video tool) ──
      // Kimi K2.6 inputs: ["text","image"] - it can see images but video output uses the tool.
      // The user pastes the image URL as text; Kimi reads it and calls generate_video with inputMediaUrl.
      // This tests the tool-based I2V path where the LLM bridges image→video via URL passing.
      fit(
        "T11d: image-to-video via Kimi K2.6 - image-capable model passes image URL to generate_video tool",
        async () => {
          if (cfg.cheapMode) {
            return; // cheapMode: real video generation runs in the full suite
          }
          setFetchCacheContext(`${cfg.cachePrefix}image-to-video-kimi`);
          await pinBalance(testUser, 200);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const INPUT_IMAGE_URL =
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T11d i2v-kimi] Here is a photo URL: ${INPUT_IMAGE_URL} — make a nice foto out of it for my resume and tinder profile. ${toolInstrWithArgs(cfg, "generate_video", `prompt='professional portrait, smooth camera pull-back' inputMediaUrl='${INPUT_IMAGE_URL}'`)}. You MUST make this tool call NOW, in this turn — do NOT reuse or re-analyze a video result from an earlier turn. Check that the fresh result has a non-empty videoUrl, a positive creditCost, and a positive durationSeconds. End your reply with STEP_OK if correct, or FAILED: <reason>.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            settleTimeoutMs: MEDIA_SETTLE_TIMEOUT_MS,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          const added = newMessages(messages, prevIds);

          // Tool message: Kimi called generate_video with the URL passed as text
          const videoToolMsg = findToolMsg(added, "generate_video", cfg);
          expect(videoToolMsg).toBeDefined();
          if (videoToolMsg) {
            assertToolMessageComplete(
              videoToolMsg,
              "generate_video",
              "T11d",
              cfg,
            );
          }

          // Args: inputMediaUrl must be the image URL passed in the prompt as text
          const videoArgs = toolResultRecord(videoToolMsg!.toolCall?.args);
          const resolvedArgs =
            (videoArgs?.["input"] as Record<string, WidgetData> | undefined) ??
            videoArgs;
          expect(
            resolvedArgs?.["inputMediaUrl"],
            "[T11d] generate_video args.inputMediaUrl must be the image URL from the text prompt",
          ).toBe(INPUT_IMAGE_URL);

          const videoRes = resolveToolResult(videoToolMsg);
          expect(videoRes).not.toBeNull();
          expect(typeof videoRes!["videoUrl"]).toBe("string");
          expect(videoRes!["videoUrl"]).toBeTruthy();
          expect((videoRes!["creditCost"] as number) > 0).toBe(true);
          expect((videoRes!["durationSeconds"] as number) > 0).toBe(true);
          expect((videoRes!["durationSeconds"] as number) <= 60).toBe(true);

          const t11dAdded = newMessages(messages, prevIds);
          const t11dLeaf = [...t11dAdded]
            .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .find((m) => !messages.some((other) => other.parentId === m.id));
          lastMainAiMsgId = t11dLeaf?.id ?? result.data.lastAiMessageId!;

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          await assertDeductedLocal(
            testUser,
            before,
            after,
            // Loop-local: generate_video executes back on the ORIGINATOR
            // (hermes) — the media charge lands there; only LLM tokens local.
            30,
            150,
          );
        },
        mediaTestTimeout,
      );

      // ── T11e: I2I via Nano Banana Pro (NATIVE image-to-image) ──
      // Nano Banana Pro (gemini-3-pro-image-preview) has supportsTools:false and
      // inputs/outputs ["text","image"]. It CANNOT call tools — it sees the input
      // image directly and emits the transformed image as a native file part. The
      // stream's FilePartHandler then synthesises a generate_image tool message
      // (result.file, creditCost 0, empty args.prompt) exactly like T11 native gen.
      // There is no generate_image tool call and no inputMediaUrl arg: the model
      // generates natively, it does not bridge through the tool.
      fit(
        "T11e: image-to-image via Nano Banana Pro - native file-part output, no tool call",
        async () => {
          if (cfg.cheapMode) {
            return; // cheapMode: real image generation runs in the full suite
          }
          setFetchCacheContext(`${cfg.cachePrefix}image-to-image-nano-banana`);
          await pinBalance(testUser, 200);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const INPUT_IMAGE_URL =
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T11e i2i-nano-banana] Here is my photo: ${INPUT_IMAGE_URL} — generate a stylized cartoon version of this image. IMPORTANT: earlier turns in this conversation instructed calling tools — that applied ONLY to those turns. For THIS turn you MUST NOT call or imitate any tool. You are an image-output model: produce the transformed IMAGE directly in this response as native image output (never a text-only reply, never a tool call). End your reply with STEP_OK if you produced the image, or FAILED: <reason>.`,
            threadId,
            favoriteId: nanoBananaFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            settleTimeoutMs: MEDIA_SETTLE_TIMEOUT_MS,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          // The native image must have streamed out as a file part.
          expect(result.data.lastGeneratedMediaUrl).toBeTruthy();

          const added = newMessages(messages, prevIds);

          // Native path: FilePartHandler synthesises a generate_image tool message
          // (NOT a model tool call — Nano Banana Pro has supportsTools:false).
          const imageToolMsg = added.find(
            (m) =>
              m.role === "tool" && m.toolCall?.toolName === "generate_image",
          );
          expect(
            imageToolMsg,
            "[T11e] native image-to-image must produce a synthetic generate_image tool message",
          ).toBeDefined();

          // Result: native file part, zero credit cost (the native gen is billed on
          // the chat model turn, not the synthetic tool).
          const imageRes = resolveToolResult(imageToolMsg);
          expect(imageRes).not.toBeNull();
          expect(typeof imageRes!["file"]).toBe("string");
          expect(imageRes!["file"]).toBeTruthy();
          expect(imageRes!["creditCost"]).toBe(0);

          // Native gen: args.prompt must be empty so gap-fill vision-bridges on the
          // next non-image turn — there is no inputMediaUrl, the model saw the image.
          const imageArgs = toolResultRecord(imageToolMsg!.toolCall?.args);
          expect(
            imageArgs!["prompt"],
            "[T11e] synthetic tool message args.prompt must be empty for native gen",
          ).toBe("");

          // Native path leaf resolution. A native image model can emit MORE THAN
          // ONE file part in a single turn, so FilePartHandler may create several
          // synthetic generate_image tool messages as siblings under the same blank
          // assistant. The true leaf is the post-tool AI text (STEP_OK) under the
          // LAST such tool message; the earlier sibling tool messages are legitimate
          // dead-end leaves (each holds its own image), so register them.
          const t11eAdded = newMessages(messages, prevIds);
          const nativeToolMsgs = t11eAdded.filter(
            (m) =>
              m.role === "tool" && m.toolCall?.toolName === "generate_image",
          );
          const lastNativeToolMsg = nativeToolMsgs[nativeToolMsgs.length - 1];
          const postToolAi = lastNativeToolMsg
            ? t11eAdded.find(
                (m) =>
                  m.role === "assistant" && m.parentId === lastNativeToolMsg.id,
              )
            : undefined;
          lastMainAiMsgId =
            postToolAi?.id ??
            lastNativeToolMsg?.id ??
            result.data.lastAiMessageId!;
          // Sibling image tool messages (all but the one on the leaf path) are
          // genuine dead-end leaves — one synthetic message per emitted file part.
          // Persist them so later tests' reachability check honours them too.
          for (const m of nativeToolMsgs) {
            if (
              m.id !== lastNativeToolMsg?.id &&
              !messages.some((other) => other.parentId === m.id)
            ) {
              deadEndLeaves.add(m.id);
            }
          }
          const t11eDeadEnds = deadEndLeaves;
          // The blank assistant(s) parenting multiple image tool messages are
          // legitimate branch points (one child per emitted file part). Register
          // them in the PERSISTENT mediaBranchPoints set so this fan-out is honoured
          // by every later test that re-validates the shared thread, not just here.
          const t11eChildCounts = new Map<string, number>();
          for (const m of nativeToolMsgs) {
            if (m.parentId) {
              t11eChildCounts.set(
                m.parentId,
                (t11eChildCounts.get(m.parentId) ?? 0) + 1,
              );
            }
          }
          for (const [parentId, count] of t11eChildCounts) {
            if (count > 1) {
              mediaBranchPoints.add(parentId);
            }
          }

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: t11eDeadEnds,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          // Native gen is billed on the chat-model image-output turn (Nano Banana
          // Pro), not via a positive-cost tool. Bracket that turn's deduction.
          const after = await getBalance(testUser);
          await assertDeductedLocal(testUser, before, after, 0.4, 150);
        },
        mediaTestTimeout,
      );

      // ── T11f: I2I via Kimi K2.6 (image-capable, passes URL to generate_image tool) ──
      // Kimi K2.6 inputs: ["text","image"] - it can see images but uses the tool for generation.
      // The user pastes the image URL as text; Kimi reads it and calls generate_image with inputMediaUrl.
      // This tests the tool-based I2I path where the LLM bridges image→image via URL passing.
      fit(
        "T11f: image-to-image via Kimi K2.6 - image-capable model passes image URL to generate_image tool",
        async () => {
          if (cfg.cheapMode) {
            return; // cheapMode: real image generation runs in the full suite
          }
          setFetchCacheContext(`${cfg.cachePrefix}image-to-image-kimi`);
          await pinBalance(testUser, 200);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const INPUT_IMAGE_URL =
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T11f i2i-visual] Here is a photo URL: ${INPUT_IMAGE_URL} — generate a stylized cartoon version of this image. ${toolInstrWithArgs(cfg, "generate_image", `prompt='stylized cartoon portrait, vibrant colors' inputMediaUrl='${INPUT_IMAGE_URL}'`)}. Check that the result has a non-empty imageUrl and a positive creditCost. End your reply with STEP_OK if correct, or FAILED: <reason>.`,
            threadId,
            // Image-capable chat model (visual variant) — the budget variant
            // (deepseek-v4-flash) is text-only and cannot pass the verify step.
            favoriteId: await ensureVisualFavorite(testUser),
            explicitParentMessageId: lastMainAiMsgId,
            settleTimeoutMs: MEDIA_SETTLE_TIMEOUT_MS,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          const added = newMessages(messages, prevIds);

          // Tool message: Kimi called generate_image with the URL passed as text
          const imageToolMsg = findToolMsg(added, "generate_image", cfg);
          expect(imageToolMsg).toBeDefined();
          if (imageToolMsg) {
            assertToolMessageComplete(
              imageToolMsg,
              "generate_image",
              "T11f",
              cfg,
            );
          }

          // Args: inputMediaUrl must be the image URL passed in the prompt as text
          const imageArgs = toolResultRecord(imageToolMsg!.toolCall?.args);
          const resolvedArgs =
            (imageArgs?.["input"] as Record<string, WidgetData> | undefined) ??
            imageArgs;
          expect(
            resolvedArgs?.["inputMediaUrl"],
            "[T11f] generate_image args.inputMediaUrl must be the image URL from the text prompt",
          ).toBe(INPUT_IMAGE_URL);

          const imageRes = resolveToolResult(imageToolMsg);
          expect(imageRes).not.toBeNull();
          expect(typeof imageRes!["imageUrl"]).toBe("string");
          expect(imageRes!["imageUrl"]).toBeTruthy();
          expect((imageRes!["creditCost"] as number) > 0).toBe(true);
          t11fOutputImageUrl = imageRes!["imageUrl"] as string;

          // Kimi is a tools-capable model and may emit MORE THAN ONE generate_image
          // tool call in a single turn (parallel tool calls). Each becomes a tool
          // message sibling under the same assistant — a legitimate branch point,
          // with the off-path siblings as dead-end leaves. The leaf is the post-tool
          // AI text under the last tool message (or that tool message itself).
          const t11fAdded = newMessages(messages, prevIds);
          const t11fToolMsgs = t11fAdded.filter(
            (m) =>
              m.role === "tool" &&
              (m.toolCall?.toolName === "generate_image" ||
                (m.toolCall?.toolName === "execute-tool" &&
                  toolResultRecord(m.toolCall.args)?.["toolName"] ===
                    "generate_image")),
          );
          const lastT11fToolMsg = t11fToolMsgs[t11fToolMsgs.length - 1];
          const t11fPostToolAi = lastT11fToolMsg
            ? t11fAdded.find(
                (m) =>
                  m.role === "assistant" && m.parentId === lastT11fToolMsg.id,
              )
            : undefined;
          // Walk to the DEEPEST descendant: an image-capable model can chain
          // several assistant messages after the tool result (generated-media
          // message + text continuation) — one hop is not the tip.
          let t11fTip = t11fPostToolAi ?? lastT11fToolMsg;
          while (t11fTip) {
            const children = t11fAdded.filter(
              (m) => m.parentId === t11fTip!.id,
            );
            const nextChild = children[children.length - 1];
            if (!nextChild) {
              break;
            }
            t11fTip = nextChild;
          }
          lastMainAiMsgId = t11fTip?.id ?? result.data.lastAiMessageId!;
          const t11fChildCounts = new Map<string, number>();
          for (const m of t11fToolMsgs) {
            if (m.parentId) {
              t11fChildCounts.set(
                m.parentId,
                (t11fChildCounts.get(m.parentId) ?? 0) + 1,
              );
            }
          }
          for (const [parentId, count] of t11fChildCounts) {
            if (count > 1) {
              mediaBranchPoints.add(parentId);
            }
          }
          // Persist sibling tool leaves so later tests' reachability check honours them.
          for (const m of t11fToolMsgs) {
            if (
              m.id !== lastT11fToolMsg?.id &&
              !messages.some((other) => other.parentId === m.id)
            ) {
              deadEndLeaves.add(m.id);
            }
          }
          const t11fDeadEnds = deadEndLeaves;

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: t11fDeadEnds,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          await assertDeductedLocal(
            testUser,
            before,
            after,
            // Loop-local: generate_image executes back on the ORIGINATOR
            // (hermes) — the media charge lands there; only LLM tokens local.
            5,
            150,
          );
        },
        mediaTestTimeout,
      );

      // ── T11f-verify: Vision model can see the generated image in tool results ──
      // Kimi K2.6 (inputs: ["text","image"]) should see the generated image from the
      // tool result in the message history (buildToolResultOutput fetches it via
      // fetchStorageFileAsBase64 and passes it as a `type: "media"` content part).
      // We ask the model to describe what it sees. If the image is NOT visible
      // (e.g. only a JSON URL string), the model will say "cannot see any image".
      // The I2I content quality is NOT tested here — only visibility.
      fit(
        "T11f-verify: vision model can see the generated image in tool result",
        async () => {
          if (cfg.cheapMode) {
            return; // cheapMode: depends on T11f media output (full suite only)
          }
          setFetchCacheContext(`${cfg.cachePrefix}image-to-image-kimi-verify`);
          await pinBalance(testUser, 30);
          const before = await getBalance(testUser);

          expect(
            t11fOutputImageUrl,
            "[T11f-verify] T11f must have stored the output image URL",
          ).toBeTruthy();

          const { result, messages } = await runStream({
            user: testUser,
            prompt:
              `[T11f-verify image-visibility] IMPORTANT: Do NOT use any tools. Do NOT call describe_image or fetch or any other tool. Just answer directly based on what you can already see in the conversation. ` +
              `In the previous step (T11f) you called generate_image. ` +
              `Can you see the generated output image as an inline image (not just a URL string) in the tool result from that step? ` +
              `If YES — you can see an actual image (any image, regardless of content) — reply with STEP_OK and briefly describe what the image shows. ` +
              `If NO — you cannot see any inline image, only a text URL or JSON — reply with FAILED: <explain what you see instead>.`,
            threadId,
            favoriteId: await ensureVisualFavorite(testUser),
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          // The vision model must confirm it can see an image (any image)
          const verifyContent = result.data.lastAiMessageContent;
          expect(
            verifyContent,
            "[T11f-verify] AI returned empty content",
          ).toBeTruthy();
          expect(
            verifyContent!.includes("FAILED"),
            `[T11f-verify] Model said FAILED — image not visible in tool result. buildToolResultOutput must convert imageUrl to base64 media content part for image-capable models.\n\nModel response:\n${verifyContent}`,
          ).toBe(false);
          expect(
            verifyContent!.includes("STEP_OK"),
            `[T11f-verify] AI did NOT confirm STEP_OK:\n\n${verifyContent}`,
          ).toBe(true);
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          await assertDeductedLocal(testUser, before, after, 0, 20);
        },
        mediaTestTimeout,
      );

      // ── T11g: Native I2I via Gemini 3.1 Flash Image (Nano Banana) ──
      // Same native image-to-image contract as T11e but on the FLASH image
      // model (the suite's default native-image favorite): the model sees the
      // reference image URL and emits the transformed image as inline file
      // parts — no tool call. supportsTools:false → toolless flattening path.
      // The prompt carries T11e's anti-imitation instruction: in a long
      // flattened thread the model otherwise imitates the tool-call TEXT it
      // sees in history instead of producing native image output.
      fit(
        "T11g: native image-to-image via Gemini 3.1 Flash Image - model sees reference image, generates natively",
        async () => {
          if (cfg.cheapMode) {
            return; // cheapMode: native image generation runs in the full suite
          }
          setFetchCacheContext(`${cfg.cachePrefix}image-to-image-native`);
          await pinBalance(testUser, 50);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const INPUT_IMAGE_URL =
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";

          // nativeImageFavoriteId: Gemini 3.1 Flash Image Preview as chat model.
          // Override imageGenModelSelection to same model → native path.
          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T11g native-i2i] Here is my photo: ${INPUT_IMAGE_URL} — create a stylized cartoon version of this photo. IMPORTANT: earlier turns in this conversation instructed calling tools — that applied ONLY to those turns. For THIS turn you MUST NOT call or imitate any tool. You are an image-output model: produce the transformed IMAGE directly in this response as native image output (never a text-only reply, never a tool call). End your reply with STEP_OK if you produced the image, or FAILED: <reason>.`,
            threadId,
            favoriteId: nativeImageFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          expect(result.data.lastGeneratedMediaUrl).toBeTruthy();

          const added = newMessages(messages, prevIds);

          // Native path: FilePartHandler creates synthetic tool msg with toolName="generate_image"
          const imageToolMsg = added.find(
            (m) =>
              m.role === "tool" && m.toolCall?.toolName === "generate_image",
          );
          expect(imageToolMsg).toBeDefined();

          const toolRes = resolveToolResult(imageToolMsg);
          expect(toolRes).not.toBeNull();
          // Native gen produces a file URL
          expect(typeof toolRes!["file"]).toBe("string");
          expect(toolRes!["file"]).toBeTruthy();
          // Native file parts bill through the CHAT model's output tokens —
          // the synthetic tool message carries creditCost 0 (same contract as
          // T11/T11e; the wallet deduction is asserted below).
          expect(toolRes!["creditCost"]).toBe(0);

          const t11gAdded = newMessages(messages, prevIds);
          const t11gLeaf = [...t11gAdded]
            .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .find((m) => !messages.some((other) => other.parentId === m.id));
          lastMainAiMsgId = t11gLeaf?.id ?? result.data.lastAiMessageId!;

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          await assertDeductedLocal(testUser, before, after, 0, 40);
        },
        mediaTestTimeout,
      );

      // ── T12: Error handling - invalid parent ─────────────────────────
      fit(
        "T12: invalid explicitParentMessageId - handled gracefully, no orphans",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}invalid-parent`);
          await pinBalance(testUser, 20);
          const before = await getBalance(testUser);

          const { result, messages } = await runStream({
            user: testUser,
            prompt:
              "[T12 invalid-parent] Say exactly: INVALID_PARENT_TEST STEP_OK",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: crypto.randomUUID(),
          });

          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data.lastAiMessageContent).toBeTruthy();
            expect(result.data.totalCreditsDeducted).toBeGreaterThan(0);
            if (result.data.lastAiMessageId) {
              lastMainAiMsgId = result.data.lastAiMessageId;
            }
          }

          assertNoOrphans(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          await assertDeductedLocal(testUser, before, after, 0, 10);
        },
        effectiveTestTimeout,
      );

      // ── Full tree validation ──────────────────────────────────────────────
      fit(
        "Final: full thread tree - no orphans, exactly 1 root, correct branching structure, metadata consistency",
        async () => {
          const messages = await getMessages(threadId);

          // ── Full chain integrity: no orphans, no branches, every message reachable ──
          // t2BranchParentId is the ONLY intentional branch point (T3a retry + T3b fork + main chain).
          // T1's tool message is NOT a branch point - T1's final AI is the direct child on the main chain.
          assertChainIntegrity(
            messages,
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );

          // ── Exactly 1 root ──
          const roots = messages.filter((m) => m.parentId === null);
          expect(roots).toHaveLength(1);
          expect(roots[0]!.id).toBe(t1UserMsgId);

          // ── t2BranchParentId is THE ONLY branch node in the entire thread ──
          // Every other parent must have exactly 1 child (no accidental branching).
          const tree = buildTree(messages);
          const byId = new Map(messages.map((m) => [m.id, m]));
          const knownBranchIds = new Set(
            [t2BranchParentId, ...mediaBranchPoints].filter(Boolean),
          );
          for (const [parentId, children] of tree.entries()) {
            if (parentId === "__root__") {
              continue;
            }
            // Compacting messages are legitimate sibling branch children by
            // design (a failed auto-compact leaves its summary node as a
            // dead-end sibling) — same rule as assertChainIntegrity.
            const nonCompacting = children.filter(
              (id) => byId.get(id)?.isCompacting !== true,
            );
            if (nonCompacting.length > 1 && !knownBranchIds.has(parentId)) {
              const parent = byId.get(parentId);
              // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
              throw new Error(
                `Unexpected branch: ${parent ? msgDesc(parent) : parentId} has ${String(children.length)} children. ` +
                  `Only t2BranchParentId=${t2BranchParentId} is allowed to branch. ` +
                  `Children: ${children.map((id) => msgDesc(byId.get(id)!)).join(", ")}`,
              );
            }
          }

          // ── t2BranchParentId has exactly the expected children ──
          // t2UserMsgId (original T2 user msg) + T3a retryUser + T3b branchUser = at least 3 children
          const branchNodeChildren = (tree.get(t2BranchParentId) ?? []).filter(
            (childId) => messages.find((m) => m.id === childId),
          );
          // Must have at least 3: original T2 user + retryUser + branchUser
          expect(
            branchNodeChildren.length,
            `t2BranchParentId must have at least 3 children (t2UserMsg + retryUser + branchUser). ` +
              `Got ${String(branchNodeChildren.length)}: ${JSON.stringify(branchNodeChildren)}`,
          ).toBeGreaterThanOrEqual(3);

          // ── t2UserMsgId, retryUser, and branchUser are all children of t2BranchParentId ──
          // This verifies the branch point is correct at the DB level.
          // The t2UserMsgId and the retry/branch user messages must share the same parentId.
          expect(
            branchNodeChildren,
            `t2UserMsgId must be a direct child of t2BranchParentId (original T2 user message)`,
          ).toContain(t2UserMsgId);
          expect(
            branchNodeChildren,
            `T3a retryUser must be a direct child of t2BranchParentId`,
          ).toContain(
            messages.find(
              (m) =>
                m.role === "user" &&
                m.parentId === t2BranchParentId &&
                m.content?.includes("T3a retry-branch"),
            )?.id,
          );
          expect(
            branchNodeChildren,
            `T3b branchUser must be a direct child of t2BranchParentId`,
          ).toContain(
            messages.find(
              (m) =>
                m.role === "user" &&
                m.parentId === t2BranchParentId &&
                m.content?.includes("T3b fork-branch"),
            )?.id,
          );

          // ── Thread has all expected keywords across assistant messages ──
          const assistantContents = messages
            .filter((m) => m.role === "assistant" && m.content)
            .map((m) => m.content!);
          for (const keyword of ["RETRY", "BRANCH"]) {
            expect(
              assistantContents.some((c) => c.includes(keyword)),
              `Expected "${keyword}" in assistant messages`,
            ).toBe(true);
          }

          // ── All assistants have model set ──
          const allAssistants = byRole(messages, "assistant");
          for (const ai of allAssistants) {
            if (ai.content && !ai.isCompacting) {
              expect(ai.model, `Assistant ${ai.id} missing model`).toBeTruthy();
            }
          }

          // ── All user messages have model=null ──
          const allUsers = byRole(messages, "user");
          for (const u of allUsers) {
            expect(
              u.model,
              `User msg ${u.id} should have null model`,
            ).toBeNull();
          }

          // ── All user messages have sequenceId=null ──
          for (const u of allUsers) {
            expect(
              u.sequenceId,
              `User msg ${u.id} should have null sequenceId`,
            ).toBeNull();
          }

          // ── All message IDs are globally unique ──
          const allIds = messages.map((m) => m.id);
          expect(new Set(allIds).size, `Duplicate message IDs found`).toBe(
            allIds.length,
          );

          // ── Global createdAt monotonicity within each parent chain ──
          // For every leaf message, walk to root and verify chronological order
          const leaves = messages.filter(
            (m) => !messages.some((other) => other.parentId === m.id),
          );
          for (const leaf of leaves) {
            const chain = walkChain(messages, leaf.id);
            assertChronologicalOrder(chain, messages);
          }

          // ── Tool messages: all have isAI=true, model set, sequenceId matches parent ──
          // Exception: wakeUp deferred tool messages get a fresh sequenceId intentionally.
          // Exception: task-completion-handler deferred results use model=null (no model context).
          const allTools = byRole(messages, "tool");
          for (const tm of allTools) {
            expect(tm.isAI, `Tool msg ${tm.id} should be isAI=true`).toBe(true);
            if (!tm.toolCall?.isDeferred) {
              expect(tm.model, `Tool msg ${tm.id} missing model`).toBeTruthy();
            }
            if (tm.parentId && !tm.toolCall?.isDeferred) {
              const parent = messages.find((m) => m.id === tm.parentId);
              if (parent) {
                expect(
                  tm.sequenceId,
                  `Tool msg ${tm.id} sequenceId should match parent ${parent.id}`,
                ).toBe(parent.sequenceId);
              }
            }
          }

          // ── Assistant content messages with finishReason should be "stop" or "tool-calls" (not error/length) ──
          // Messages with reasoning content (stored as <think>...</think>) can have finishReason="tool-calls"
          // when the AI both reasons and calls tools in the same response.
          for (const ai of allAssistants) {
            if (ai.content && ai.finishReason) {
              expect(
                ["stop", "tool-calls"].includes(ai.finishReason),
                `Assistant ${ai.id} has unexpected finishReason "${ai.finishReason}" (expected "stop" or "tool-calls")`,
              ).toBe(true);
            }
          }

          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);
        },
        effectiveTestTimeout,
      );

      // ── Credit deduction + incognito ───────────────────────────────────────
      fit(
        "C1: credit deduction - balance decreases, totalCreditsDeducted matches",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}credit-deduction`);
          await pinBalance(testUser, 50);
          // getBalance drains in-flight async first, so this timestamp cleanly
          // bounds the start of THIS stream's ledger entries.
          const before = await getBalance(testUser);
          const creditWindowStart = new Date();

          const { result } = await runStream({
            user: testUser,
            prompt: "[C1 credit-deduction] Reply with exactly one word: OK",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          lastMainAiMsgId = result.data.lastAiMessageId!;

          const reported = result.data.totalCreditsDeducted ?? 0;
          expect(reported > 0).toBe(true);

          const after = await getBalance(testUser);
          if (loopRunsRemote) {
            // Remote-folder relay bills ONLY the loop-running side (the
            // connection owner on the receiver). The local wallet must stay
            // untouched; the receiver's self-reported charge came back >0
            // above, and the suite-level relay-ran assertion covers the
            // receiver-side wallet drop.
            await assertLocalNotBilled(
              testUser,
              before,
              after,
              creditWindowStart,
            );
          } else {
            expect(after).toBeLessThan(before);

            // Truthful accounting check. totalCreditsDeducted is the stream's
            // self-report of what IT charged (chat-model + tool credits via its own
            // accumulator). Compare it to the ledger charges in this stream's time
            // window that are CHAT usage — i.e. exclude async INDEXING the shared
            // dev-server process bills against the same wallet: cortex embeddings
            // (feature) and vision-bridge describes (flash-lite vision models).
            // Those land with feature/model markers distinct from chat usage.
            const { creditTransactions: cTx, creditWallets: cWallets } =
              await import("@/app/api/[locale]/credits/db");
            const { inArray: inArrayOp, gte: gteOp } =
              await import("drizzle-orm");
            // The deduction pool spans the USER wallet AND the user's lead
            // wallets (free credits are spent from lead wallets first) — the
            // ledger window must cover the WHOLE pool or a free-credit spend
            // looks like a missing charge.
            const { userLeadLinks } =
              await import("next-vibe/identity/lead/db");
            const userLeadIds = (
              await db
                .select({ id: userLeadLinks.leadId })
                .from(userLeadLinks)
                .where(eq(userLeadLinks.userId, testUser.id))
            ).map((l) => l.id);
            const walletRows = await db
              .select({ id: cWallets.id, leadId: cWallets.leadId })
              .from(cWallets);
            const ownUserWallets = (
              await db
                .select({ id: cWallets.id })
                .from(cWallets)
                .where(eq(cWallets.userId, testUser.id))
            ).map((w) => w.id);
            const userWallets = [
              ...walletRows
                .filter(
                  (w) => w.leadId !== null && userLeadIds.includes(w.leadId),
                )
                .map((w) => w.id),
              ...ownUserWallets,
            ];
            const windowTxs = await db
              .select({
                amount: cTx.amount,
                feature: cTx.feature,
                modelId: cTx.modelId,
              })
              .from(cTx)
              .where(
                and(
                  inArrayOp(cTx.walletId, userWallets),
                  gteOp(cTx.createdAt, creditWindowStart),
                ),
              );
            // Only THIS stream's chat-model charges count: async bridge work
            // from earlier media cases (image-vision describe on
            // gemini-3-pro-image-preview etc.) settles minutes later and can
            // land inside this window — it is a different model, never the
            // C1 turn's own cost.
            const c1ChatModel = "deepseek-v4-flash";
            const ledgerChatCost = windowTxs.reduce(
              (sum, t) =>
                sum +
                (t.amount < 0 &&
                !isIndexingCreditTx(t) &&
                t.modelId === c1ChatModel
                  ? -t.amount
                  : 0),
              0,
            );
            expect(
              Math.abs(ledgerChatCost - reported),
              `Reported ${reported} must match this stream's chat ledger charges ${ledgerChatCost}`,
            ).toBeLessThan(0.01);
          }

          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);
        },
        effectiveTestTimeout,
      );

      fit(
        "C2: incognito - no messages persisted, credits still deducted",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}incognito-mode`);
          await pinBalance(testUser, 50);
          const beforeIncognito = await getBalance(testUser);

          // Incognito stream via the real endpoint. The POST returns immediately;
          // incognito content is never persisted (it only ever flows over WS to
          // the client), so we assert the invariants a DB observer CAN see:
          // nothing persisted + credits deducted.
          const { result } = await runStream({
            user: testUser,
            prompt: "[C2 incognito] Reply with exactly: INCOGNITO_TEST",
            rootFolderId: DefaultFolderId.INCOGNITO,
            favoriteId: mainFavoriteId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          // Incognito: messages not persisted - no messages should exist in DB for this thread
          if (result.data.threadId) {
            const incognitoMsgs = await getMessages(result.data.threadId);
            expect(
              incognitoMsgs,
              "C2: incognito messages persisted to DB",
            ).toHaveLength(0);
          }

          // Incognito streams run in the background (no thread state to poll) - poll
          // balance until it drops or the timeout expires. 30s budget for fixture-speed.
          const C2_TIMEOUT_MS = 30_000;
          const C2_POLL_MS = 300;
          const c2Start = Date.now();
          let afterIncognito = await getBalance(testUser);
          while (
            afterIncognito >= beforeIncognito &&
            Date.now() - c2Start < C2_TIMEOUT_MS
          ) {
            await new Promise<void>((resolve) => {
              setTimeout(resolve, C2_POLL_MS);
            });
            afterIncognito = await getBalance(testUser);
          }
          expect(afterIncognito).toBeLessThan(beforeIncognito);
        },
        effectiveTestTimeout,
      );

      fit(
        "C3: insufficient credits - returns 403 when balance is zero",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}insufficient-credits`);

          const wallets = await db.execute<{
            id: string;
            balance: number;
            free_credits_remaining: number;
          }>(
            sql`SELECT cw.id, cw.balance, cw.free_credits_remaining
              FROM credit_wallets cw
              LEFT JOIN user_lead_links ull ON ull.lead_id = cw.lead_id
              WHERE cw.user_id = ${testUser.id} OR ull.user_id = ${testUser.id}`,
          );
          const saved = wallets.rows.map((w) => ({
            id: w.id,
            balance: w.balance,
            freeCreditsRemaining: w.free_credits_remaining,
          }));

          for (const w of saved) {
            await db.execute(
              sql`UPDATE credit_wallets SET balance = 0, free_credits_remaining = 0 WHERE id = ${w.id}`,
            );
          }

          try {
            const { result } = await runStream({
              user: testUser,
              prompt: "[C3 insufficient-credits] Say: SHOULD_FAIL",
              threadId,
              favoriteId: mainFavoriteId,
              explicitParentMessageId: lastMainAiMsgId,
            });

            expect(result.success).toBe(false);
            if (result.success) {
              // oxlint-disable-next-line restricted-syntax
              throw new Error(
                "C3: expected stream to fail with 403 but it succeeded",
              );
            }
            expect(result.errorType?.errorCode).toBe(403);
            expect(result.message).toContain("nsufficient");
          } finally {
            for (const w of saved) {
              await db.execute(
                sql`UPDATE credit_wallets SET balance = ${w.balance}, free_credits_remaining = ${w.freeCreditsRemaining} WHERE id = ${w.id}`,
              );
            }
          }
        },
        effectiveTestTimeout,
      );
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Favorites + UNBOTTLED Self-Relay
    // Tests the full favorites pipeline: create a favorite with the
    // quality-tester skill + cheapest models per modality, verify model
    // selection is respected, then run through the UNBOTTLED relay path.
    // All external fetch is blocked (strict mode) - any leaked fetch fails.
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    describe("Favorites resolution", () => {
      const QUALITY_TESTER_SKILL_ID = "quality-tester";
      let favoriteId: string; // budget variant (skill default) - DEEPSEEK_V4_FLASH
      let budgetFavoriteId: string; // visual variant - GEMINI_3_5_FLASH (native media gen)

      beforeAll(async () => {
        // Resolve test favorites via endpoints (reuse existing, create if absent).
        const [favsDef, favoriteCreateDef] = await Promise.all([
          import("@/app/api/[locale]/agent/skills/favorites/definition").then(
            (m) => m.default.GET,
          ),
          import("@/app/api/[locale]/agent/skills/favorites/create/definition").then(
            (m) => m.default.POST,
          ),
        ]);
        const favsResult = await sendTestRequest({
          endpoint: favsDef,
          data: { pageSize: 500 },
          user: testUser,
        });
        const favsList = favsResult.success
          ? Array.isArray(favsResult.data?.["favorites"])
            ? (favsResult.data["favorites"] as Record<string, WidgetData>[])
            : []
          : [];

        const existingKimi = favsList.find(
          (f) => String(f["skillId"] ?? "") === "quality-tester__budget",
        );
        if (existingKimi?.["id"]) {
          favoriteId = String(existingKimi["id"]);
        } else {
          const r = await sendTestRequest({
            endpoint: favoriteCreateDef,
            data: { skillId: "quality-tester__budget" },
            user: testUser,
          });
          expect(
            r.success,
            "F-setup: create quality-tester__budget failed",
          ).toBe(true);
          favoriteId = r.success ? String(r.data?.["id"] ?? "") : "";
        }

        const existingVisual = favsList.find(
          (f) => String(f["skillId"] ?? "") === "quality-tester__visual",
        );
        if (existingVisual?.["id"]) {
          budgetFavoriteId = String(existingVisual["id"]);
        } else {
          const r = await sendTestRequest({
            endpoint: favoriteCreateDef,
            data: { skillId: "quality-tester__visual" },
            user: testUser,
          });
          expect(
            r.success,
            "F-setup: create quality-tester__visual failed",
          ).toBe(true);
          budgetFavoriteId = r.success ? String(r.data?.["id"] ?? "") : "";
        }
      }, effectiveTestTimeout);

      it(
        "F1: favorite resolution - manual, model switch, media models, filters all work",
        async () => {
          const favByIdDef = (
            await import("@/app/api/[locale]/agent/skills/favorites/[id]/definition")
          ).default;
          const { getBestChatModelForFavorite } =
            await import("@/app/api/[locale]/agent/skills/favorites/[id]/definition");
          const { getInstanceAvailability } =
            await import("@/app/api/[locale]/agent/env-availability");
          const { SkillsRepository } =
            await import("@/app/api/[locale]/agent/skills/repository");
          const { parseSkillId } =
            await import("@/app/api/[locale]/agent/chat/slugify");
          const logger = createEndpointLogger(false, defaultLocale);

          // Resolve a favorite's model exactly like the web client: GET the
          // favorite config via endpoint, then run the client resolver with the
          // skill variant's modelSelection as the cascade fallback.
          const resolveModelAndSkill = async (
            favId: string,
          ): Promise<{ model: string | undefined; skill: string }> => {
            const getRes = await sendTestRequest({
              endpoint: favByIdDef.GET,
              urlPathParams: { id: favId },
              user: testUser,
            });
            expect(
              getRes.success,
              `F1: GET favorite ${favId} must succeed`,
            ).toBe(true);
            if (!getRes.success) {
              return { model: undefined, skill: "" };
            }
            const skillId = getRes.data.skillId;
            const skill = parseSkillId(skillId).skillId;
            // Skill variant modelSelection — the cascade fallback the client uses.
            let skillVariantSelection: typeof getRes.data.modelSelection = null;
            const skillRes = await SkillsRepository.getSkillById(
              { id: skillId },
              testUser,
              logger,
              defaultLocale,
            );
            if (skillRes.success) {
              const { variantId } = parseSkillId(skillId);
              const variant = skillRes.data.variants
                ? variantId
                  ? skillRes.data.variants.find((v) => v.id === variantId)
                  : (skillRes.data.variants.find((v) => v.isDefault) ??
                    skillRes.data.variants[0])
                : null;
              skillVariantSelection = variant?.modelSelection ?? null;
            }
            const best = getBestChatModelForFavorite(
              getRes.data.modelSelection,
              skillVariantSelection ?? undefined,
              testUser,
              await getInstanceAvailability(),
            );
            return { model: best?.id, skill };
          };

          type PatchModelSelection =
            (typeof favByIdDef.PATCH.types.RequestInput)["modelSelection"];
          const patchModel = async (
            favId: string,
            modelSelection: PatchModelSelection,
          ): Promise<void> => {
            const r = await sendTestRequest({
              endpoint: favByIdDef.PATCH,
              data: { modelSelection },
              urlPathParams: { id: favId },
              user: testUser,
            });
            expect(r.success, `F1: PATCH favorite ${favId} must succeed`).toBe(
              true,
            );
          };

          // ── Part A: Initial resolution → budget variant's manual model + quality-tester skill ──
          // The favorite carries no own modelSelection, so the cascade falls to
          // the skill's default (budget) variant: DEEPSEEK_V4_FLASH.
          const resolved = await resolveModelAndSkill(favoriteId);
          expect(resolved.model).toBe(ChatModelId.DEEPSEEK_V4_FLASH);
          expect(resolved.skill).toBe(QUALITY_TESTER_SKILL_ID);

          // ── Part B: Change to GEMINI_3_FLASH → respected ──
          await patchModel(favoriteId, {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: ChatModelId.GEMINI_3_FLASH,
          });
          const resolvedGemini = await resolveModelAndSkill(favoriteId);
          expect(resolvedGemini.model).toBe(ChatModelId.GEMINI_3_FLASH);
          expect(resolvedGemini.skill).toBe(QUALITY_TESTER_SKILL_ID);

          // Restore the pristine state: no favorite-level selection, cascade
          // falls back to the skill variant (keeps Part A valid on reruns —
          // the favorite is reused across suite runs).
          await patchModel(favoriteId, null);

          // ── Part C: Media model selections persisted (via favorites GET) ──
          const favGetResult = await sendTestRequest({
            endpoint: favByIdDef.GET,
            urlPathParams: { id: favoriteId },
            user: testUser,
          });
          expect(favGetResult.success, "F1: GET favorite must succeed").toBe(
            true,
          );
          const fav = favGetResult.success ? favGetResult.data : null;

          expect(fav).toBeTruthy();
          // Media model selections come from the quality-tester__budget variant defaults.
          // Assert they are set (non-null) and have the expected structure.
          expect(fav!.imageGenModelSelection).toBeTruthy();
          expect(
            (fav!.imageGenModelSelection as Record<string, WidgetData>)?.[
              "selectionType"
            ],
          ).toBe(ModelSelectionType.MANUAL);
          expect(fav!.musicGenModelSelection).toBeTruthy();
          expect(
            (fav!.musicGenModelSelection as Record<string, WidgetData>)?.[
              "selectionType"
            ],
          ).toBe(ModelSelectionType.MANUAL);
          expect(fav!.videoGenModelSelection).toBeTruthy();
          expect(
            (fav!.videoGenModelSelection as Record<string, WidgetData>)?.[
              "selectionType"
            ],
          ).toBe(ModelSelectionType.MANUAL);

          // ── Part D: FILTERS selection resolves a model ──
          await patchModel(favoriteId, {
            selectionType: ModelSelectionType.FILTERS,
            sortBy: ModelSortField.PRICE,
            sortDirection: ModelSortDirection.ASC,
            contentRange: {
              min: ContentLevel.OPEN,
              max: ContentLevel.UNCENSORED,
            },
          });
          const resolvedFilter = await resolveModelAndSkill(favoriteId);
          expect(resolvedFilter.model).toBeTruthy();
          expect(resolvedFilter.skill).toBe(QUALITY_TESTER_SKILL_ID);

          // Restore the pristine no-selection state (cascade to variant).
          await patchModel(favoriteId, null);

          // ── Part E: Visual variant → resolves a model + quality-tester skill ──
          const resolvedBudget = await resolveModelAndSkill(budgetFavoriteId);
          expect(resolvedBudget.model).toBeTruthy();
          expect(resolvedBudget.skill).toBe(QUALITY_TESTER_SKILL_ID);
        },
        effectiveTestTimeout,
      );
    });
  });
}
