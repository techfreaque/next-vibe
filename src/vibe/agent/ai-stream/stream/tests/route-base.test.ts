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
 * - HTTP fixtures: ONE fixtures-table row per run (beforeAll) maps the run's
 *   single threadId to this file's cache folder; every external call of the run
 *   records on first run and replays afterwards - same code path, no network.
 * - Claude Code fixtures (claude-code-fixture-store) for Agent SDK calls.
 *
 * Cache bust: delete src/generated/ai-fixtures/http-cache/<cachePrefix>/
 *
 * Thread layout (visible in UI):
 *   T1  → new thread + tool call (tool-help) - creates thread, tests parent chain + tool structure
 *         Gradual exploration ladder (tool-help compact platform): broad list → categories.
 *   T1a-cat   → narrow by category → tool names (step 2 of the ladder)
 *   T1a-query → broad keyword search → names list, no schemas (step 3)
 *   T1b       → detail mode: single tool full schema (step 4)
 *   T2  → image generation (gpt-5-image-mini via quality-tester skill, inline wait mode)
 *   T3  → retry + branch from T1 AI → two sibling forks: RETRY_RESPONSE + BRANCH_RESPONSE
 *   T4  → music gen (from fork branch 3b) then video gen chained AFTER music
 *   T5  → detach dispatch: AI calls the callback tool (generate_image, or
 *         cortex-write in cheap suites) with detach, gets taskId
 *   T5b → await-task: AI calls await-task with T5 taskId, gets imageUrl
 *   T5a → endLoop: read-tool(endLoop) executes inline, loop stops (no assistant follows)
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

import { and, eq, sql } from "drizzle-orm";
import {
  DefaultFolderId,
  makeHeadlessContext,
  rootlessStreamContext,
  type ToolExecutionContext,
} from "next-vibe/agent/chat/config";
import { scopedTranslation as chatScopedTranslation } from "next-vibe/agent/chat/i18n";
import {
  ContentLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "next-vibe/agent/skills/enum";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { WidgetData } from "next-vibe/core/utils/json";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { cronTasks } from "next-vibe/tasks/cron/db";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { contacts } from "@/contact/db";
import { ContactSubject } from "@/contact/enum";
import { env } from "@/env/env";

import type { ImageGenModelId } from "../../../image-generation/models";
import type { MusicGenModelId } from "../../../music-generation/models";
import type { ChatModelId } from "../../models";
import { seedFixtureThread } from "../../testing/fixture-seed";
import {
  fetchThreadMessages,
  fetchThreadMeta,
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
import { deriveLoopRunsRemote, deriveUsesRemote } from "./helpers/config";
import {
  ensureVariantFavorite,
  ensureVisualFavorite,
} from "./helpers/favorites";
import {
  assertNoMetaToolPrefix,
  assertToolMessageComplete,
  findToolMsg,
  isToolMsgFor,
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

/** Strip surrounding quotes/backticks/trailing punctuation from a parsed value
 *  so a fixed-shape reply field compares by exact equality. */
function cleanInstanceId(raw: string): string {
  return raw.trim().replace(/^["'`]+|["'`.]+$/g, "");
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

/** Read a fixture file from src/generated/ai-fixtures/media/ as a File object */
async function loadFixture(filename: string, mimeType: string): Promise<File> {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const fixturePath = join(
    import.meta.dirname,
    "..",
    "..",
    "..",
    "..",
    "..",
    "..",
    "..",
    "generated",
    "ai-fixtures",
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
    // The user's IANA timezone the whole suite simulates — a real non-UTC zone
    // so date-dependent behaviour (system-prompt "Posted:" lines, cortex recency
    // boosts, media timestamps) is exercised the way a real user experiences it.
    // Threaded into every stream (POST body) AND the fixture context, never
    // hardcoded UTC per call. max@tfq.at is Austrian → Europe/Vienna.
    const userTimezone = "Europe/Vienna";
    /** Main favorite: quality-tester__budget variant (text/tool-calling chat). */
    let mainFavoriteId: string;
    /** The chat model the budget favorite RESOLVES to (asserted, never hardcoded). */
    let budgetChatModelId: ChatModelId;
    /** The image/music-gen models the budget favorite resolves to — asserted on
     *  every media-gen tool call so the fav's model is actually used (never the
     *  platform default). Resolved via the SAME filters the stream uses. */
    let budgetImageGenModelId: ImageGenModelId | null;
    let budgetMusicGenModelId: MusicGenModelId | null;
    /** Native-image favorite: quality-tester__native-image variant (native image-output chat). */
    let nativeImageFavoriteId: string;
    /** The chat model the native-image favorite resolves to (asserted, never hardcoded). */
    let nativeImageChatModelId: ChatModelId;
    /** The image-gen model the native-image favorite resolves to (asserted, never hardcoded). */
    let nativeImageGenModelId: ImageGenModelId | null;

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
      fetchThreadTitle(tid, testUser, suiteRootFolderId);
    /**
     * Fetch a thread's title + description via the thread GET endpoint. Goes
     * through the endpoint (never the DB) so it resolves the correct instance's
     * data in cross-instance suites, exactly like getMessages/getStreamingState.
     */
    const getThreadMeta = (tid: string): ReturnType<typeof fetchThreadMeta> =>
      fetchThreadMeta(tid, testUser, suiteRootFolderId);
    /** Fetch the current streamingState for a thread via the messages endpoint. */
    async function getStreamingState(tid: string): Promise<string | undefined> {
      const msgsDef = (
        await import("next-vibe/agent/chat/threads/[threadId]/messages/definition")
      ).default;
      const result = await sendTestRequest({
        streamContext: rootlessStreamContext(),
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

      // Map the run's ONE threadId to this file's fixture folder (counter → 0)
      // on every instance the mode reaches, so the whole run records/replays
      // into one folder ordered by that row's single running counter.
      await seedFixtureThread(runThreadId, cfg.cachePrefix, usesRemote);

      // Clean up stale lead links that may have been created by browsing the app
      // or interrupted test runs. Keep only the primary lead link used by testUser.
      await db.execute(
        sql`DELETE FROM user_lead_links
            WHERE user_id = ${testUser.id} AND lead_id != ${testUser.leadId}`,
      );

      // Safety floor: 500cr before any test
      await pinBalance(testUser, 500);

      // ── Resolve the TWO skill-variant favorites ──────────────────────────
      // The suite uses exactly the two quality-tester variants that exist in the
      // skill: `budget` (text/tool-calling chat) and `native-image` (native
      // image-output chat, chat model IS the image-gen model). Each favorite is
      // REUSED if the user already has one for that variant (a runtime model
      // override survives) and only created when absent — never patched. The
      // resolved chat/image-gen model ids come from the SAME resolvers the stream
      // uses, so every `model` assertion below compares against what the favorite
      // actually resolves to, never a hardcoded literal.
      const budgetFav = await ensureVariantFavorite(
        testUser,
        "quality-tester__budget",
      );
      mainFavoriteId = budgetFav.id;
      budgetChatModelId = budgetFav.chatModelId;
      budgetImageGenModelId = budgetFav.imageGenModelId;
      budgetMusicGenModelId = budgetFav.musicGenModelId;

      // Clean slate for the shared favorite's tool config: T7a sets
      // availableTools to gate the approve tool and T7b restores it, but a run
      // that bails between them (or is killed) leaves the whitelist on the
      // favorite — which then blocks housekeeping (rename-thread →
      // not_in_whitelist) in the NEXT run's T1. Reset to null (unrestricted /
      // role based) at suite start so no prior run can poison T1. The favorite
      // is ONLY ever restricted for the duration of the T7 block.
      {
        const favByIdResetDef = (
          await import("next-vibe/agent/skills/favorites/[id]/definition")
        ).default;
        const favResetGet = await sendTestRequest({
          streamContext: rootlessStreamContext(),
          endpoint: favByIdResetDef.GET,
          urlPathParams: { id: mainFavoriteId },
          user: testUser,
        });
        await sendTestRequest({
          streamContext: rootlessStreamContext(),
          endpoint: favByIdResetDef.PATCH,
          data: {
            modelSelection: favResetGet.success
              ? favResetGet.data.modelSelection
              : null,
            availableTools: null,
          },
          urlPathParams: { id: mainFavoriteId },
          user: testUser,
        });
      }

      const nativeImageFav = await ensureVariantFavorite(
        testUser,
        "quality-tester__native-image",
      );
      nativeImageFavoriteId = nativeImageFav.id;
      nativeImageChatModelId = nativeImageFav.chatModelId;
      nativeImageGenModelId = nativeImageFav.imageGenModelId;

      // No stale local tasks may exist when a suite starts: the system
      // prompt lists pending tasks, the AI calls await-task on them, and
      // that behavior gets baked into recorded fixtures.
      await db
        .delete(cronTasks)
        .where(
          sql`(${cronTasks.id} LIKE 'local-bg-%' OR ${cronTasks.id} LIKE 'local-wu-%' OR ${cronTasks.routeId} LIKE 'resume-stream%')`,
        );

      // A LOCAL suite (no cfg.setup) runs ZERO remote code — it never touches a
      // hermes connection. Only the explicit remote suites (cfg.setup set) do any
      // remote bootstrapping. Normalizing a lingering hermes connection here made
      // a purely-local run dispatch a settings-mirror to an absent peer
      // (callToolDirect network error / "Tool Not Found"); a local test must not
      // reach the wire at all.

      // Thread folder name is DECOUPLED from the fixture cache: a suite that
      // shares another's fixtures (same cachePrefix) still lands its threads in
      // its OWN folder via threadCasePrefix. Defaults to cachePrefix.
      const threadCasePrefix = cfg.threadCasePrefix ?? cfg.cachePrefix;
      const testCaseName =
        threadCasePrefix.replace(/[^a-z0-9-]/gi, "").replace(/-+$/, "") ||
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
      // No thread/folder/cortex cleanup: prior runs are KEPT. Fixtures replay
      // deterministically regardless of accumulated state, and cortex is synced
      // (never touch it with raw SQL). Only the per-mode teardown hook runs
      // (remote-connection disconnect etc.).
      if (cfg.teardown && testUser) {
        await cfg.teardown(testUser);
      }
    });

    // ONE threadId for the WHOLE file run, mapped ONCE (beforeAll) to the file's
    // cache folder (cfg.cachePrefix, e.g. "cheap"). Every case — the sequential
    // T-tree AND the standalone incognito/credit cases — runs under this one id,
    // so all of the file's external calls record/replay into ONE folder ordered
    // by that row's single running counter. No per-case folders or threadIds.
    const usesRemote = deriveUsesRemote(cfg);
    const runThreadId = crypto.randomUUID();
    const caseFixture: ToolExecutionContext = makeHeadlessContext(
      undefined,
      runThreadId,
      userTimezone,
    );

    const runStream = makeRunStream({
      cfg,
      suiteRootFolderId,
      getMessages,
      getStreamingState,
      getTestSubFolderId: () => testSubFolderId,
      getOverrideSubFolderId: () => overrideSubFolderId,
      getCaseFixture: () => caseFixture,
      getCaseThreadId: () => runThreadId,
      timezone: userTimezone,
    });

    // ── Callback-mode dispatch spec ─────────────────────────────────────────
    // Callback-mode cases (T5*, T6*) dispatch ONE async-capable tool. Cheap
    // suites use cortex-write (cheap, REAL DB write — and it still creates a
    // REAL task row under detach/wakeUp because execute-tool's async modes
    // always do); full suites use generate_image (real media task). Prompts
    // interpolate the name/args/result wording, assertions match cbTool.name
    // and check cbTool.resultKey — with cheapMode falsy, prompts and
    // assertions are byte-identical to the original generate_image versions.
    const cbTool = cfg.cheapMode
      ? {
          name: "cortex-write",
          resultInstr: "the result has a non-empty responsePath",
          resultNoun: "a responsePath",
          resultKey: "responsePath",
        }
      : {
          name: "generate_image",
          resultInstr: "the result has a non-empty imageUrl",
          resultNoun: "an imageUrl",
          resultKey: "imageUrl",
        };
    /** Args for the callback dispatch. The case slug (e.g. 'wakeup-test') is
     *  the image prompt in full mode; in cheap mode it keys a distinct cortex
     *  path + content per case so fixture contexts and cortex nodes never
     *  collide across cases. */
    const cbArgs = (caseSlug: string): string =>
      cfg.cheapMode
        ? `path='/memories/cb-${caseSlug}' and content='${caseSlug}-payload'`
        : `prompt='${caseSlug}'`;
    /** Tool-message matcher for cbTool — direct, wrapped, or nested envelope. */
    const isCbToolMsg = (m: SlimMessage): boolean =>
      isToolMsgFor(m, cbTool.name);
    /** The result key holds a non-empty string (finished real output). */
    const cbResultOk = (res: Record<string, WidgetData> | null): boolean =>
      typeof res?.[cbTool.resultKey] === "string" &&
      res[cbTool.resultKey] !== "";

    // T7 approve-gate target: full gates generate_image itself (real media
    // task executes on approval); cheap gates cortex-write (cheap, real DB
    // write) — it can NOT be tool-help, which must stay ungated because it is
    // the parallel partner call in T7a.
    const approveTool = cfg.cheapMode
      ? {
          name: "cortex-write",
          argsInstr:
            "path='/memories/t7-approve-test' and content='T7_APPROVE_OK'",
          resultKey: "responsePath",
        }
      : {
          name: "generate_image",
          argsInstr: "prompt='approve-test'",
          resultKey: "imageUrl",
        };

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
      // T6a's wakeUp image-gen produces a real https image URL (inline result on
      // fast delivery, or the deferred revival result on slow delivery). The new
      // T6v video-gen step (after T6b) consumes it as lastFrameUrl.
      let t6aGeneratedImageUrl = "";
      let t11fOutputImageUrl: string; // Output image URL from T11f I2I, used by T11f-verify

      // ── T1: New thread + tool call (combines basic send + tool call) ──────
      // T1 does double duty: it is the thread-CREATION case (fresh thread, root
      // user message, parent chain, metadata, title, credits, transport
      // attestation) AND the ONLY tool-help feature test — its first turn drives
      // tool-help through ALL THREE output modes (category-narrow, keyword-query,
      // detail-schema) and asserts each result shape. (The former standalone T1a
      // "all modes" case is folded in here; tool-help is exercised once.)
      fit(
        "T1: new thread + tool call - thread creation, parent chain, tool-help all modes (category/query/detail), metadata",
        async () => {
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
            prompt: `[T1 thread-create+tool-help-all-modes] You are the quality gate for this entire session. From now on, across EVERY turn, if ANYTHING is off — a tool error, an empty or nonsensical result, a broken/missing URL, a wrong or unreasonable credit cost, a raw ID / internal field name / JSON blob / stack trace in anything user-facing, a confusing tool name/description/parameter, a result that contradicts what was asked, or ANY oddity you notice even if it is UNRELATED to the current instruction or is left over from a PREVIOUS turn — you MUST end your reply with FAILED: <what is off>. Do not work around it, do not stay silent, do not give it the benefit of the doubt. Over-report rather than ignore: everything off is a FAIL. Only end with STEP_OK when you have checked and NOTHING at all is off. You dont need to create any memories unless asked, other than that treat it like any other chat. This test suite is called ${cfg.cachePrefix}

Now: explore the tool catalog with ${toolInstr(cfg, "tool-help")} by making THREE calls. Issue ALL THREE IN PARALLEL in this ONE turn — emit them together in a single response (do NOT wait for one result before making the next), each NOW (do not reuse earlier results): (1) ${toolInstrWithArgs(cfg, "tool-help", "category='ai'")} to list the "ai" category's tools; (2) ${toolInstrWithArgs(cfg, "tool-help", "query='search'")} to keyword-search for search tools; (3) ${toolInstrWithArgs(cfg, "tool-help", "toolName='generate_image'")} to get one tool's full schema.${cfg.remoteInstanceId ? ` The instanceId='${cfg.remoteInstanceId}' routing above applies ONLY to these three tool-help calls that I explicitly asked you to run there — it is NOT a blanket rule. Any OTHER tool you decide to use on your own is a separate decision: route each one wherever is correct for what it does, and never carry '${cfg.remoteInstanceId}' onto a call I didn't ask to run there.` : ""} Check: the category-narrow and keyword-query calls each return a non-empty tools array whose entries have a name + description; the detail call returns generate_image with a name, a description, and a parameters schema. End your reply with STEP_OK if all looked right AND nothing else is off, or FAILED: <what was wrong> otherwise.`,
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
          // The AI message must run on EXACTLY the model the budget favorite
          // resolves to — proving the favorite's model reached the stream, not
          // just that some model was set.
          expect(
            firstAi.model,
            `T1: AI message must run on the budget favorite's resolved model (${budgetChatModelId})`,
          ).toBe(budgetChatModelId);
          expect(firstAi.isCompacting).toBe(false);

          // ── Thread title + description (rename MUST have happened) ─────────
          // The per-turn housekeeping fragment instructs the model to call
          // rename-thread this turn. By the end of T1 the thread MUST carry a
          // real, model-authored title AND description — never the placeholder
          // "New Chat" and never a null description. Fetched via the thread GET
          // endpoint (never DB) so it holds cross-instance too.
          {
            const meta = await getThreadMeta(threadId);
            const defaultTitle = chatScopedTranslation
              .scopedT(defaultLocale)
              .t("common.newChat");
            expect(
              meta.title,
              "T1: thread title must be non-null",
            ).toBeTruthy();
            expect(
              meta.title,
              "T1: thread title must not be the raw i18n key",
            ).not.toContain("common.newChat");
            // The model MUST have renamed the thread: the title is no longer the
            // placeholder default. A still-default title means rename-thread was
            // never executed this turn — a hard failure, not an accepted state.
            expect(
              meta.title,
              `T1: thread was never renamed — title is still the placeholder "${defaultTitle}". The model must call rename-thread this turn.`,
            ).not.toBe(defaultTitle);
            // description MUST be a real, concrete sentence written by the model —
            // never null, never the raw i18n key, never a trivial restatement.
            expect(
              typeof meta.description === "string" &&
                meta.description.trim().length > 0,
              "T1: thread description must be a non-empty model-authored sentence (rename-thread sets it)",
            ).toBe(true);
            expect(
              meta.description ?? "",
              "T1: thread description must not be the raw i18n key",
            ).not.toContain("common.");
          }

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

          // ── tool-help ALL THREE output modes asserted on this same turn ──────
          // The first turn drove tool-help three ways (category-narrow,
          // keyword-query, detail-schema). Locate each call by its args and check
          // its distinct result shape. This is the tool-help feature test — no
          // separate case needed.
          const t1HelpMsgs = messages.filter((m) => {
            if (m.role !== "tool") {
              return false;
            }
            const name = m.toolCall?.toolName ?? "";
            return name === "tool-help" || name === "execute-tool";
          });
          expect(
            t1HelpMsgs.length,
            "T1: expected multiple tool-help calls (category, query, detail) in the creation turn",
          ).toBeGreaterThanOrEqual(3);
          // Match a TOOL-HELP call by which arg key its OWN input carries (the
          // three modes use distinct keys: category / query / toolName). Only the
          // wrapped tool's real args (`input` in execute-tool wrapping) count —
          // NEVER the execute-tool envelope's own `toolName` field, which is
          // present on EVERY wrapped call (incl. a stray rename) and would false-
          // match. So: the wrapped tool must be tool-help, and the key must be in
          // its input.
          const t1ResultForArgs = (
            argKey: string,
          ): Record<string, WidgetData> | null => {
            const msg = t1HelpMsgs.findLast((m) => {
              const args = toolResultRecord(m.toolCall?.args) ?? {};
              // The wrapped tool: execute-tool → args.toolName; direct → the msg's
              // own toolName. Only tool-help calls are candidates.
              const wrappedTool =
                (args["toolName"] as string | undefined) ??
                m.toolCall?.toolName;
              if (wrappedTool !== "tool-help") {
                return false;
              }
              // The wrapped tool's OWN args: execute-tool nests them under `input`;
              // direct calls put them at the top level.
              const inner = toolResultRecord(args["input"]) ?? args;
              if (!(argKey in inner)) {
                return false;
              }
              // Detail mode: the model may ALSO detail-look-up other tools on
              // its own initiative (observed: rename-thread's schema before the
              // housekeeping rename) — match only the detail call the prompt
              // explicitly requested (generate_image).
              return (
                argKey !== "toolName" || inner["toolName"] === "generate_image"
              );
            });
            return resolveToolResult(msg);
          };
          const t1AssertNamesList = (
            res: Record<string, WidgetData> | null,
            label: string,
          ): void => {
            expect(res, `T1: ${label} result is null`).not.toBeNull();
            const tools = res!["tools"] as WidgetData[];
            expect(
              Array.isArray(tools) && tools.length > 0,
              `T1: ${label} must return a non-empty tools array`,
            ).toBe(true);
            const first = toolResultRecord(tools[0]);
            expect(
              first?.["name"],
              `T1: ${label} first tool missing name`,
            ).toBeTruthy();
            expect(
              first?.["description"],
              `T1: ${label} first tool missing description`,
            ).toBeTruthy();
          };
          // (1) category-narrow and (2) keyword-query → names lists.
          t1AssertNamesList(t1ResultForArgs("category"), "category-narrow");
          t1AssertNamesList(t1ResultForArgs("query"), "keyword-query");
          // (3) detail lookup → single tool with name + description (+ schema).
          const t1DetailRes = t1ResultForArgs("toolName");
          expect(t1DetailRes, "T1: detail result is null").not.toBeNull();
          const t1DetailEntry = Array.isArray(t1DetailRes!["tools"])
            ? toolResultRecord((t1DetailRes!["tools"] as WidgetData[])[0])
            : t1DetailRes;
          expect(
            t1DetailEntry,
            "T1: no tool entry in detail result",
          ).toBeDefined();
          expect(
            String(t1DetailEntry?.["name"] ?? ""),
            "T1: detail entry must carry the generate_image name",
          ).toContain("generate_image");
          expect(
            String(t1DetailEntry?.["description"] ?? "").length,
            "T1: detail entry must carry a non-empty description",
          ).toBeGreaterThan(10);

          // ── Tool chain roots at an assistant, shares its sequenceId ──
          // Multiple tool-help calls in one turn chain as siblings under a
          // single assistant: assistant → tool → tool → tool. So a given tool
          // message's DIRECT parent may be another tool. Walk up past any tool
          // ancestors to the assistant that initiated the turn and assert on
          // THAT — the direct-parent-is-assistant assumption only holds for a
          // single-tool turn (record run) and breaks on multi-tool replay.
          const findChainRootAssistant = (
            leaf: SlimMessage,
          ): SlimMessage | undefined => {
            let cur: SlimMessage | undefined = leaf;
            while (cur?.role === "tool") {
              cur = messages.find((m) => m.id === cur!.parentId);
            }
            return cur;
          };
          const toolParent = findChainRootAssistant(toolMsg);
          expect(
            toolParent?.role,
            "T1: tool chain must root at an assistant message",
          ).toBe("assistant");
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
              await import("next-vibe/remote-connection/db");
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

      // ── T-SYS: system-prompt AND tool-execution instance — ONE turn ───────
      // Both facts are proven in the SAME turn: (1) which instance built the
      // SYSTEM PROMPT (the loop's instance), and (2) which instance the TOOL
      // executes on (via self-instance-id). They differ per topology:
      //   - DIRECT (loop LOCAL, tools remote): system prompt = LOCAL (atlas),
      //     but every tool routes to the remote → self-instance-id = remote.
      //   - REMOTE-FOLDER (loop remote): both = that remote instance.
      //   - inference-provider (loop LOCAL, client pipe): both = LOCAL (atlas).
      if (cfg.assertSystemPromptFromLocal || cfg.systemPromptInstanceId) {
        fit(
          "T-SYS: system-prompt + tool-execution instance (same turn)",
          async () => {
            await pinBalance(testUser, 10);

            // LOCAL instance id (atlas) from this instance's own identity.
            const [localIdRow] = (
              await db.execute<{ instance_id: string }>(
                sql`SELECT instance_id FROM instance_identities WHERE user_id = ${testUser.id} LIMIT 1`,
              )
            ).rows;
            const localInstanceId = localIdRow?.instance_id;
            expect(
              localInstanceId,
              "T-SYS: local instance ID must resolve",
            ).toBeTruthy();

            // System-prompt instance = the instance running the LOOP:
            //   REMOTE-folder → the remote; direct/inference → LOCAL (loop here).
            const expectedSystemPromptId =
              cfg.systemPromptInstanceId ?? localInstanceId;
            // Tool-execution instance = where execute-tool runs the tool:
            //   remote for any suite with a remote target; else LOCAL.
            const expectedToolExecId =
              cfg.systemPromptInstanceId ??
              cfg.remoteInstanceId ??
              localInstanceId;

            const { result, messages } = await runStream({
              user: testUser,
              prompt:
                `[T-SYS] Two questions in this one turn:\n` +
                `1. From YOUR SYSTEM CONTEXT (not a tool), what is the instance ID that built your system prompt / runs this conversation loop?\n` +
                `2. Call ${toolInstr(cfg, "self-instance-id")} to read the instance ID the TOOL executes on.\n` +
                `Reply with EXACTLY two lines, nothing else:\n` +
                `SystemPrompt: <instance id from your context>\n` +
                `ToolExec: <instance id the self-instance-id tool returned>`,
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
            const content = stripReasoning(aiMsg?.content ?? "");
            // The reply shape is FIXED ("SystemPrompt: <id>" / "ToolExec: <id>").
            // Parse each line, strip surrounding quotes/backticks/trailing dot,
            // and compare by EXACT EQUALITY — never a loose substring match.
            const promptLine = /^\s*SystemPrompt:\s*(.+)$/im.exec(content)?.[1];
            const toolLine = /^\s*ToolExec:\s*(.+)$/im.exec(content)?.[1];
            expect(
              promptLine,
              `T-SYS: reply must have a 'SystemPrompt:' line. Got: ${content.slice(0, 200)}`,
            ).toBeDefined();
            expect(
              toolLine,
              `T-SYS: reply must have a 'ToolExec:' line. Got: ${content.slice(0, 200)}`,
            ).toBeDefined();
            expect(
              cleanInstanceId(promptLine ?? ""),
              `T-SYS: system-prompt instance (loop built the prompt) must be exactly '${String(expectedSystemPromptId)}'`,
            ).toBe(expectedSystemPromptId);
            expect(
              cleanInstanceId(toolLine ?? ""),
              `T-SYS: tool-execution instance (self-instance-id) must be exactly '${String(expectedToolExecId)}'`,
            ).toBe(expectedToolExecId);

            lastMainAiMsgId = result.data.lastAiMessageId!;
            await assertThreadIdle(threadId, testUser);
          },
          effectiveTestTimeout,
        );
      }

      // (T1a's "tool-help all modes" is now folded into T1's creation turn —
      //  tool-help's category/query/detail shaping is exercised once, on the
      //  thread-creation turn.)

      // ── T2: Image generation (inline wait) ──────────────────────────────
      fit(
        "T2: image generation (wait mode) - imageUrl, creditCost, generatedMedia",
        async () => {
          // cheapMode: replace expensive image gen with cortex-write/read.
          // Same state is set (t2BranchParentId, t2UserMsgId, lastMainAiMsgId).
          await pinBalance(testUser, 50);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          // Capture the parent of T2's user message BEFORE T2 updates lastMainAiMsgId.
          // UI retry/branch on T2's user message uses userMsg.parentId = this value.
          t2BranchParentId = lastMainAiMsgId;

          const cheapNodePath = `/memories/t2-cheap-test`;
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
            // Cross-check via the cortex-read ENDPOINT (never raw cortex SQL —
            // cortex is synced; reads/writes must go through the endpoint so
            // placement + sync stay consistent). cortex-write stores the path
            // verbatim (no `.md` auto-append), so read the exact path written.
            // The tool ran on whichever instance owns the loop; the caller's
            // own cortex is synced, so a local read reflects the write.
            const cortexReadDef = (
              await import("next-vibe/agent/cortex/read/definition")
            ).default;
            const readRes = await sendTestRequest({
              streamContext: rootlessStreamContext(),
              endpoint: cortexReadDef.GET,
              data: { path: cheapNodePath },
              user: testUser,
            });
            expect(
              readRes.success,
              `T2 cheap: cortex-read failed at ${cheapNodePath}: ${readRes.success ? "" : readRes.message}`,
            ).toBe(true);
            if (readRes.success) {
              expect(
                String(readRes.data.content ?? "").trim(),
                "T2 cheap: node content must be T2_CHEAP_OK",
              ).toBe("T2_CHEAP_OK");
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

            // ── model MUST equal the favorite's resolved image-gen model ──
            // requestDefaults fills `model` from the favorite/skill cascade; the
            // recorded call input must reflect it (never the platform default).
            // execute-tool wraps the sub-tool args under `input`; direct calls
            // put them at the top level.
            const imgArgs = toolResultRecord(toolMsg!.toolCall?.args);
            const imgModel =
              (imgArgs?.["model"] as string | undefined) ??
              (toolResultRecord(imgArgs?.["input"] as WidgetData)?.["model"] as
                | string
                | undefined);
            expect(
              imgModel,
              `T2: generate_image must run on the favorite's resolved image model (${budgetImageGenModelId}), got ${imgModel} — args: ${JSON.stringify(imgArgs)}`,
            ).toBe(budgetImageGenModelId);
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
          // retryAi must descend from retryUser with only assistant/tool
          // steps between (the model may detour through a tool call before
          // answering — that doesn't change the branch structure under test).
          const chainToUser = walkChain(retryMsgs, retryAi!.id);
          const retryUserIdx = chainToUser.indexOf(retryUser!.id);
          expect(
            retryUserIdx,
            `T3a: retryAi's ancestor chain must contain retryUser.id=${retryUser!.id}`,
          ).toBeGreaterThanOrEqual(0);
          const byIdRetry = new Map(retryMsgs.map((m) => [m.id, m]));
          for (const midId of chainToUser.slice(retryUserIdx + 1, -1)) {
            const mid = byIdRetry.get(midId);
            expect(
              mid?.role === "assistant" || mid?.role === "tool",
              `T3a: only assistant/tool steps allowed between retryUser and retryAi - got ${mid?.role} (${midId})`,
            ).toBe(true);
          }

          // Exact chain: [t1UserMsgId, ..., branchParentId, retryUser.id, ..., retryAi.id]
          const retryChain = chainToUser;
          expect(retryChain.length).toBeGreaterThanOrEqual(4);
          expect(retryChain[0]).toBe(t1UserMsgId);
          expect(retryChain[retryChain.length - 1]).toBe(branchRetryAiMsgId);
          expect(
            retryChain[retryUserIdx - 1],
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

          // branchAi must descend from branchUser (assistant/tool steps only
          // between — the model may detour through a tool call first).
          const branchChain = walkChain(branchMsgs, branchAi!.id);
          const branchUserIdx = branchChain.indexOf(branchUser!.id);
          expect(
            branchUserIdx,
            `T3b: branchAi's ancestor chain must contain branchUser.id=${branchUser!.id}`,
          ).toBeGreaterThanOrEqual(0);
          const byIdBranch = new Map(branchMsgs.map((m) => [m.id, m]));
          for (const midId of branchChain.slice(branchUserIdx + 1, -1)) {
            const mid = byIdBranch.get(midId);
            expect(
              mid?.role === "assistant" || mid?.role === "tool",
              `T3b: only assistant/tool steps allowed between branchUser and branchAi - got ${mid?.role} (${midId})`,
            ).toBe(true);
          }

          // Exact branch chain: [t1UserMsgId, ..., branchParentId, branchUser.id, ..., branchAi.id]
          // branchParentId must be immediately before branchUser
          expect(branchChain.length).toBeGreaterThanOrEqual(4);
          expect(branchChain[0]).toBe(t1UserMsgId);
          expect(branchChain[branchChain.length - 1]).toBe(branchForkAiMsgId);
          expect(
            branchChain[branchUserIdx - 1],
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

          // ── THREE chains fork from branchParentId, each a valid tree path ─────
          // The branch point has exactly three USER children — chain 1 (T2),
          // chain 2 (T3a retry), chain 3 (T3b fork). Chains 1 and 2 are single-
          // user dead-ends (one user message, no further user turns); chain 3 is
          // the active continuation (T4 media hangs off it). Every node's parentId
          // must chain back to branchParentId with NO stray/random messages.
          const branchUserChildren = branchParentAllChildren.filter(
            (m) => m.role === "user",
          );
          expect(
            branchUserChildren.length,
            `T3b: branchParentId must have EXACTLY 3 user children (T2, retry, fork) — got ${String(branchUserChildren.length)}`,
          ).toBe(3);
          const branchById = new Map(branchMsgs.map((m) => [m.id, m]));
          // Count the user messages on a chain and verify the parentId links are
          // intact all the way up to branchParentId (no orphan / cross-linked node).
          const auditChain = (
            leafId: string,
            label: string,
          ): { userCount: number } => {
            const chain = walkChain(branchMsgs, leafId);
            expect(chain[0], `${label}: chain must root at t1UserMsgId`).toBe(
              t1UserMsgId,
            );
            expect(
              chain.indexOf(branchParentId),
              `${label}: chain must pass through branchParentId`,
            ).toBeGreaterThanOrEqual(0);
            // Parent links intact: every step is the recorded parent of the next.
            for (let i = 1; i < chain.length; i++) {
              const child = branchById.get(chain[i]!);
              expect(
                child?.parentId,
                `${label}: broken parent link at ${chain[i]} — parentId must be ${chain[i - 1]}`,
              ).toBe(chain[i - 1]);
            }
            const userCount = chain.filter(
              (id) => branchById.get(id)?.role === "user",
            ).length;
            return { userCount };
          };
          // Chain 2 (retry) and chain 1 (T2) end at their AI tips. The shared
          // prefix root→branchParentId carries the T1 user AND the T-SYS user
          // (T-SYS is a real main-chain turn that runs between T1 and T2), so
          // each branch path = t1User + T-SYS user + this branch's own user = 3.
          const retryAudit = auditChain(
            branchRetryAiMsgId,
            "T3b chain-2 (retry)",
          );
          // T-SYS is a real main-chain turn (T1 → T-SYS → T2) but it only RUNS
          // in topologies that assert the system-prompt/tool-exec instance
          // (direct / remote-folder / inference — same gate as its fit()). In a
          // plain regular suite T-SYS is skipped, so it contributes no user
          // message to the shared prefix. The path user count is therefore
          //   t1 user + (T-SYS user IF it ran) + this branch's own user.
          const tSysRan = Boolean(
            cfg.assertSystemPromptFromLocal || cfg.systemPromptInstanceId,
          );
          const expectedPathUsers = tSysRan ? 3 : 2;
          expect(
            retryAudit.userCount,
            `T3b chain-2 (retry): path carries t1 user${tSysRan ? " + T-SYS user" : ""} + retry user = ${expectedPathUsers} on the path`,
          ).toBe(expectedPathUsers);
          const t2Audit = auditChain(lastMainAiMsgId, "T3b chain-1 (T2)");
          expect(
            t2Audit.userCount,
            `T3b chain-1 (T2): path carries t1 user${tSysRan ? " + T-SYS user" : ""} + t2 user = ${expectedPathUsers} on the path`,
          ).toBe(expectedPathUsers);

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
        // Cheap mode keeps the IDENTICAL two-branch structure (branchRetryAiMsgId
        // + branchForkAiMsgId continuations, full chain/parent/ordering/no-orphan
        // assertions). Only the tool changes: branch A → credits-balance,
        // branch B → favorites (two DISTINCT non-media read tools). The
        // media-field asserts (audioUrl/durationSeconds/videoUrl) are dropped in
        // cheap; the read-tool result fields are asserted instead.
        // music (~60s) + video (~120s) + revival polling (180s budget) → 6 min
        // ── Part A: Music gen from retry branch (cheap: credits-balance) ──
        await pinBalance(testUser, 50);
        const beforeMusic = await getBalance(testUser);
        const prevIdsMusic = new Set(
          (await getMessages(threadId)).map((m) => m.id),
        );

        const t4aTool = cfg.cheapMode ? "credits-balance" : "generate_music";
        const { result: musicResult, messages: musicMsgs } = await runStream({
          user: testUser,
          // Live recording: music gen polls the provider for minutes — give
          // the settle wait the media budget (fixture replays finish fast).
          settleTimeoutMs: MEDIA_SETTLE_TIMEOUT_MS,
          prompt: cfg.cheapMode
            ? `[T4a credits-balance] Call ${toolInstr(cfg, "credits-balance")} to read the wallet balance. Check that the result has a numeric total. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.`
            : `[T4a music-gen] Call ${toolInstrWithArgs(cfg, "generate_music", "prompt='upbeat electronic remix', inputMediaUrl='https://d.uguu.se/YwXTDQyH.mp3'")}. Check that the result has a non-empty audioUrl, a positive creditCost, and durationSeconds between 8 and 120. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.`,
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: branchForkAiMsgId,
        });

        expect(musicResult.success).toBe(true);
        if (!musicResult.success) {
          // oxlint-disable-next-line restricted-syntax
          throw new Error(musicResult.message ?? "unexpected failure");
        }

        const musicAdded = newMessages(musicMsgs, prevIdsMusic);

        // T4a: music user must be direct child of branchForkAiMsgId (T3b's fork).
        // T4a continues the FORK branch (3b); T4b then chains linearly AFTER
        // T4a (not a second fork off 3b). The T3a retry branch stays abandoned.
        const musicUser = musicAdded.find((m) => m.role === "user");
        expect(
          musicUser?.parentId,
          `T4a: music user parentId must be branchForkAiMsgId=${branchForkAiMsgId}`,
        ).toBe(branchForkAiMsgId);

        // Tool message - find the successful one (AI may retry on duration mismatch)
        const musicToolMsgs = musicAdded.filter((m) =>
          isToolMsgFor(m, t4aTool),
        );
        expect(musicToolMsgs.length).toBeGreaterThanOrEqual(1);
        const musicToolMsg = musicToolMsgs.find(
          (m) => resolveToolResult(m) !== null,
        );
        expect(musicToolMsg).toBeDefined();
        if (musicToolMsg) {
          assertToolMessageComplete(musicToolMsg, t4aTool, "T4a", cfg);
        }

        const musicRes = resolveToolResult(musicToolMsg);
        expect(musicRes).not.toBeNull();
        if (cfg.cheapMode) {
          // credits-balance result: numeric `total`.
          expect(
            typeof musicRes!["total"],
            "[T4a] credits-balance result must have a numeric total",
          ).toBe("number");
        } else {
          // Args: prompt must be the meaningful string passed in the test - not a parse artifact like "}"
          // In queue mode (execute-tool wrapper), prompt is nested inside input.prompt.
          // In direct mode, prompt is at the top level of args.
          const musicArgs = toolResultRecord(musicToolMsg!.toolCall?.args);
          const musicPrompt =
            (musicArgs?.["prompt"] as string | undefined) ??
            (toolResultRecord(musicArgs?.["input"] as WidgetData)?.[
              "prompt"
            ] as string | undefined);
          expect(
            typeof musicPrompt === "string" && musicPrompt.length > 3,
            `[T4a] generate_music args.prompt must be a meaningful string - got: ${JSON.stringify(musicPrompt)}`,
          ).toBe(true);

          expect(typeof musicRes!["audioUrl"]).toBe("string");
          expect(String(musicRes!["audioUrl"])).toMatch(/^https?:\/\/.+/);
          expect(typeof musicRes!["creditCost"]).toBe("number");
          expect((musicRes!["creditCost"] as number) > 0).toBe(true);
          expect(typeof musicRes!["durationSeconds"]).toBe("number");
          expect((musicRes!["durationSeconds"] as number) >= 8).toBe(true);
          expect((musicRes!["durationSeconds"] as number) <= 120).toBe(true);

          // ── model MUST equal the favorite's resolved music-gen model ──
          const musicModel =
            (musicArgs?.["model"] as string | undefined) ??
            (toolResultRecord(musicArgs?.["input"] as WidgetData)?.["model"] as
              | string
              | undefined);
          expect(
            musicModel,
            `[T4a] generate_music must run on the favorite's resolved music model (${budgetMusicGenModelId}), got ${musicModel} — args: ${JSON.stringify(musicArgs)}`,
          ).toBe(budgetMusicGenModelId);
        }

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

        // Exact chain: [t1UserMsgId, ..., branchForkAiMsgId, musicUser, ..., musicLastAi]
        // branchForkAiMsgId (T3b's fork tip) must appear BEFORE musicUser — T4a
        // hangs off the FORK branch (3b), not the retry branch (3a).
        const musicChain = walkChain(
          musicMsgs,
          musicResult.data.lastAiMessageId!,
        );
        expect(musicChain[0]).toBe(t1UserMsgId);
        expect(musicChain).toContain(t1AiMsgId);
        // T4a hangs off 3b, so the retry branch (3a) must NOT be in this chain.
        expect(
          musicChain.includes(branchRetryAiMsgId),
          `T4a: branchRetryAiMsgId (3a) must NOT be in the music chain — T4a continues the FORK branch (3b)`,
        ).toBe(false);
        const musicBranchIdx = musicChain.indexOf(branchForkAiMsgId);
        expect(
          musicBranchIdx,
          `T4a: branchForkAiMsgId must be in the music chain (it's the branch point this T4a hangs off)`,
        ).toBeGreaterThanOrEqual(0);
        // musicUser must be immediately after branchForkAiMsgId in the chain
        expect(
          musicChain[musicBranchIdx + 1],
          `T4a: musicUser must be immediately after branchForkAiMsgId in the chain`,
        ).toBe(musicUser!.id);
        assertChronologicalOrder(musicChain, musicMsgs);

        // T4a's leaf is the sole active tip and the parent T4b continues from —
        // T4b chains AFTER T4a (linear), it is NOT a second fork off 3b. So 3b
        // is NOT a branch point here (its only continuation is T4a), and T4a's
        // leaf is NOT a dead-end (T4b hangs off it).
        const t4aMusicAiMsgId = musicResult.data.lastAiMessageId!;

        // T4a: expectedLeaf = T4a music end (the current sole tip).
        assertNoOrphans(
          musicMsgs,
          new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
          {
            expectedLeafId: t4aMusicAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          },
        );
        await assertThreadIdle(threadId, testUser);
        await assertNoPendingTasks(threadId);

        const afterMusic = await getBalance(testUser);
        await assertDeductedLocal(testUser, beforeMusic, afterMusic, 0, 15);

        // ── Part B: favorites read (chains after T4a) ──
        // NOTE: video-gen was moved to the T6v step (after T6b), so it can use
        // T6a's generated image as its lastFrameUrl. T4b is now a plain read
        // step in BOTH forks: it calls `favorites` and asserts the array shape.
        await pinBalance(testUser, 400);
        const beforeVideo = await getBalance(testUser);
        const prevIdsVideo = new Set(
          (await getMessages(threadId)).map((m) => m.id),
        );

        const t4bTool = "favorites";
        const { result: videoResult, messages: videoMsgs } = await runStream({
          user: testUser,
          settleTimeoutMs: MEDIA_SETTLE_TIMEOUT_MS,
          prompt: `[T4b favorites] Call ${toolInstr(cfg, "favorites")} to list the user's favorites. Check that the result has a favorites array. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.`,
          threadId,
          favoriteId: mainFavoriteId,
          // T4b chains AFTER T4a: parent is T4a's music leaf, NOT a second fork
          // off 3b. This keeps the media flow a linear continuation.
          explicitParentMessageId: t4aMusicAiMsgId,
        });

        expect(videoResult.success).toBe(true);
        if (!videoResult.success) {
          // oxlint-disable-next-line restricted-syntax
          throw new Error(videoResult.message ?? "unexpected failure");
        }

        const videoAdded = newMessages(videoMsgs, prevIdsVideo);

        // T4b: favorites user must be a direct child of T4a's music leaf (chains
        // AFTER T4a, not a sibling fork off 3b).
        const videoUser = videoAdded.find((m) => m.role === "user");
        expect(
          videoUser?.parentId,
          `T4b: favorites user parentId must be t4aMusicAiMsgId=${t4aMusicAiMsgId} (chains after T4a, not a fork off branchForkAiMsgId=${branchForkAiMsgId})`,
        ).toBe(t4aMusicAiMsgId);

        // Tool message
        const videoToolMsg = findToolMsg(videoAdded, t4bTool, cfg);
        expect(videoToolMsg).toBeDefined();
        if (videoToolMsg) {
          assertToolMessageComplete(videoToolMsg, t4bTool, "T4b", cfg);
        }

        const videoRes = resolveToolResult(videoToolMsg);
        expect(videoRes).not.toBeNull();
        // favorites result: `favorites` array (both forks).
        expect(
          Array.isArray(videoRes!["favorites"]),
          "[T4b] favorites result must have a favorites array",
        ).toBe(true);

        // Final AI
        const videoLastAi = videoMsgs.find(
          (m) => m.id === videoResult.data.lastAiMessageId,
        );
        expect(videoLastAi).toBeDefined();
        expect(videoLastAi!.finishReason).toBe("stop");
        assertStepOk(videoLastAi!.content, "T4b");
        lastMainAiMsgId = videoResult.data.lastAiMessageId!;

        // Exact chain: [t1UserMsgId, ..., branchForkAiMsgId, musicUser, ...,
        // t4aMusicAiMsgId, videoUser, ..., videoLastAi]. T4b chains AFTER T4a,
        // so BOTH the fork tip (3b) and T4a's music leaf are ancestors, and
        // videoUser sits immediately after T4a's music leaf.
        const videoChain = walkChain(
          videoMsgs,
          videoResult.data.lastAiMessageId!,
        );
        expect(videoChain[0]).toBe(t1UserMsgId);
        // 3b (the fork this whole media flow hangs off) must be an ancestor.
        expect(
          videoChain.includes(branchForkAiMsgId),
          `T4b: branchForkAiMsgId (3b) must be an ancestor in the video chain`,
        ).toBe(true);
        // T4a's music leaf must be in the chain AND videoUser immediately after
        // it — proving T4b continues T4a linearly, not as a sibling fork.
        const t4aLeafIdx = videoChain.indexOf(t4aMusicAiMsgId);
        expect(
          t4aLeafIdx,
          `T4b: t4aMusicAiMsgId must be in the video chain (T4b chains after T4a)`,
        ).toBeGreaterThanOrEqual(0);
        expect(
          videoChain[t4aLeafIdx + 1],
          `T4b: videoUser must be immediately after t4aMusicAiMsgId (T4b chains after T4a, not a sibling of it)`,
        ).toBe(videoUser!.id);
        // fork tip must come BEFORE T4a's leaf (3b → T4a → T4b ordering).
        expect(
          videoChain.indexOf(branchForkAiMsgId),
          `T4b: branchForkAiMsgId (3b) must precede t4aMusicAiMsgId in the chain`,
        ).toBeLessThan(t4aLeafIdx);
        // the abandoned retry branch (3a) must NOT appear in this chain.
        expect(
          videoChain,
          `T4b: video chain must not contain branchRetryAiMsgId - that retry branch is abandoned`,
        ).not.toContain(branchRetryAiMsgId);
        assertChronologicalOrder(videoChain, videoMsgs);

        // T4b: lastMainAiMsgId (video leaf) is now the sole active tip. T4a's
        // music leaf is NOT a dead-end — it's an ancestor of this video tip.
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
        // T4b is a plain read tool (favorites) — only LLM tokens bill.
        await assertDeductedLocal(testUser, beforeVideo, afterVideo, 0, 400);
      }, 1_200_000);

      // ── T5: detach dispatch - AI calls cbTool(detach), gets taskId ──
      fit(
        `T5: detach dispatch - AI calls ${cbTool.name} with detach, gets taskId back`,
        async () => {
          await pinBalance(testUser, 20);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T5 detach-dispatch] Call ${toolInstrWithArgs(cfg, cbTool.name, `${cbArgs("await-task-test")} and callbackMode='detach'`)}. Check that the immediate result has a taskId string and does NOT have ${cbTool.resultNoun} (the task runs in the background). End your reply with STEP_OK and the exact taskId value like: STEP_OK taskId=<value>. Or FAILED: <reason> if anything was wrong.`,
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

          const genImgMsg = findToolMsg(added, cbTool.name, cfg);
          expect(
            genImgMsg,
            `[T5] ${cbTool.name} tool message not found`,
          ).toBeDefined();

          const genImgRes = resolveToolResult(genImgMsg);
          expect(
            genImgRes,
            `[T5] ${cbTool.name} result is null`,
          ).not.toBeNull();
          // DETACH semantics: the dispatch returns ONLY { taskId } — fire-and-forget.
          // It NEVER backfills the dispatch tool message with the result. The finished
          // task is kept in task history; the result is retrieved later via await-task
          // (T5b), which then cleans the task up. So here: taskId present, result ABSENT.
          const t5ToolCall = genImgMsg!.toolCall;
          const t5TaskIdRaw = t5ToolCall?.remoteTaskId ?? genImgRes!["taskId"];
          expect(
            typeof t5TaskIdRaw,
            `[T5] taskId missing (remoteTaskId or result.taskId): ${JSON.stringify({ remoteTaskId: t5ToolCall?.remoteTaskId, result: genImgRes })}`,
          ).toBe("string");
          expect(
            genImgRes![cbTool.resultKey],
            `[T5] detach must NOT backfill ${cbTool.resultKey} — result is { taskId } only: ${JSON.stringify(genImgRes)}`,
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
        `T5b: await-task - AI calls await-task with detach taskId, gets ${cbTool.resultKey}`,
        async () => {
          // taskId from T5 is deterministic (fixture mode), so the value the AI
          // echoes here is stable across record/replay — no fixture patching.
          await pinBalance(testUser, 20);
          const beforeWait = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          // Just name the tool + taskId — don't mention local/remote routing. The
          // instanceId in the taskId is a routing detail the model must NOT copy
          // onto its await-task call (await-task resolves the pending call from the
          // local registry); naming the remote here only tempts it to re-route. The
          // test verifies the model figures out on its own that await-task is local.
          const waitForTaskInstr = `await-task with taskId='${t5DetachTaskId}'`;
          let { result: waitResult, messages: waitMsgs } = await runStream({
            user: testUser,
            prompt: `[T5b await-task] Call ${waitForTaskInstr}. Check that the result contains ${cbTool.resultNoun} string (either directly or nested in a result field). End your reply with STEP_OK if ${cbTool.resultKey} is present, or FAILED: <reason> if anything was wrong.`,
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
          const allWftMsgs = waitAdded.filter((m) =>
            isToolMsgFor(m, "await-task"),
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
          // (A) task pending when called → backfilled with the raw tool result: { <resultKey>, ... }
          // (B) task already done → returns { status, result: { <resultKey> }, waiting }
          const resultKeyDirect =
            typeof wftRes![cbTool.resultKey] === "string"
              ? wftRes![cbTool.resultKey]
              : undefined;
          const innerResult = resultKeyDirect
            ? wftRes
            : toolResultRecord(wftRes!["result"]);
          expect(
            innerResult,
            `[T5b] Cannot find ${cbTool.resultKey}: ${JSON.stringify(wftRes)}`,
          ).not.toBeNull();
          expect(
            typeof innerResult![cbTool.resultKey],
            `[T5b] ${cbTool.resultKey} not a string, got: ${JSON.stringify(innerResult)}`,
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
      // endLoop's contract: the tool runs, its result is backfilled in-place,
      // and the loop STOPS — no further assistant turn follows. So the model
      // physically cannot "do something with the result afterwards" and cannot
      // emit a trailing verdict. The old prompt asked it to "try again after
      // the result", which is impossible under endLoop and made the model fire
      // the tool twice in one turn. New design: ONE plain endLoop call, nothing
      // done with the result, and the assertion is STRUCTURAL — the loop
      // stopped iff no assistant message sits between the endLoop tool message
      // and the next user message. Uses self-instance-id (a cheap, zero-arg,
      // deterministic read tool NOT used for any other mechanism case) instead
      // of tool-help. endLoop is orthogonal to which tool ran, so this holds
      // identically in cheap and full/media modes — a media tool would still
      // stop the loop the same way; there is never a next turn to consume the
      // result in.
      fit(
        "T5a: endLoop - tool executes inline, loop stops (no assistant after the tool)",
        async () => {
          await pinBalance(testUser, 20);
          const prevIdsEndLoop = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const endLoopTool = "self-instance-id";
          const { result: endLoopResult, messages: endLoopMsgs } =
            await runStream({
              user: testUser,
              prompt: `[T5a endLoop] Call ${toolInstrWithArgs(cfg, endLoopTool, "callbackMode='endLoop'")} EXACTLY ONCE. Do not call it again and do nothing with its result — endLoop ends the turn after the tool runs.`,
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

          // Exactly ONE tool call (endLoop stops the loop; no second call).
          // Per spec: endLoop ALWAYS backfills in-place regardless of transport
          // — no deferred message is ever created; the original tool message is
          // updated with status="completed" and the real result directly.
          const endLoopToolMsgs = endLoopAdded.filter((m) =>
            isToolMsgFor(m, endLoopTool),
          );
          expect(
            endLoopToolMsgs.length,
            `T5a: expected exactly 1 ${endLoopTool} message (endLoop stops the loop; the tool must not be called twice)`,
          ).toBe(1);

          const resultMsg = endLoopToolMsgs[0]!;
          assertToolMessageComplete(resultMsg, endLoopTool, "T5a", cfg);

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

          // ── endLoop stopped the loop: NO assistant message after the tool ──
          // The definitive endLoop proof. After the endLoop tool message there
          // must be no assistant message on this turn (the loop stopped before
          // any post-tool assistant reply). We assert directly on the messages
          // added this turn: none of them may be an assistant that chains AFTER
          // the tool message. If the loop had continued, an assistant reply (or
          // a further tool call) would sit between the tool and the next user
          // message.
          const addedIds = new Set(endLoopAdded.map((m) => m.id));
          // Walk a message's parent chain (within this turn) back toward the
          // endLoop tool message: true iff the message descends FROM the tool
          // result — i.e. the loop produced it AFTER the tool ran.
          const descendsFromTool = (m: SlimMessage): boolean => {
            let cur: SlimMessage | undefined = m;
            while (cur && addedIds.has(cur.id)) {
              if (cur.parentId === resultMsg.id) {
                return true;
              }
              cur = endLoopAdded.find((x) => x.id === cur!.parentId);
            }
            return false;
          };
          const assistantAfterTool = endLoopAdded.find(
            (m) => m.role === "assistant" && descendsFromTool(m),
          );
          expect(
            assistantAfterTool,
            `T5a: endLoop must STOP the loop — no assistant message may follow the ${endLoopTool} tool result (found ${assistantAfterTool?.id})`,
          ).toBeUndefined();

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
          // endLoop = 1 cheap read-tool call. Previous test goroutines may
          // add/remove credits concurrently, so skip the credit assertion here
          // — this is a free read tool, not a paid media gen.
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
          await pinBalance(testUser, 20);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const { result } = await runStream({
            user: testUser,
            prompt: `[T5d wait-inline] Call ${toolInstrWithArgs(cfg, cbTool.name, `${cbArgs("wait-inline-test")} and callbackMode='wait'`)}. Check that the result has ${cbTool.resultNoun} (not a taskId). End your reply with STEP_OK if ${cbTool.resultKey} is present and non-empty, or FAILED: <reason> if anything is wrong.`,
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
              const REVIVAL_POLL_INTERVAL_MS = 100;
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

          // ── At least 1 cbTool tool message (model may retry on validation errors) ──
          const imgToolMsgs = added.filter((m) => isCbToolMsg(m));
          expect(
            imgToolMsgs.length,
            `T5d: expected at least 1 ${cbTool.name} tool message`,
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
            typeof imgRes![cbTool.resultKey],
            `T5d: ${cbTool.resultKey} not a string. Result: ${JSON.stringify(imgRes)}`,
          ).toBe("string");
          expect(
            imgRes![cbTool.resultKey],
            `T5d: ${cbTool.resultKey} must be non-empty`,
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
          // Full: image gen + at least one AI turn; kimi sometimes needs an
          // extra round trip (same allowance as T1). Cheap: cortex-write is
          // ~free — only the AI turns bill (same floor as T2).
          await assertDeductedLocal(
            testUser,
            before,
            after,
            cfg.cheapMode ? 0.05 : 0.4,
            50,
          );
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
          `T6a: wakeUp phase1 - ${cbTool.name} dispatched async, AI gets taskId, stream ends naturally`,
          async () => {
            // Clean up stale wakeUp tasks from previous test runs before recording.
            // Without this, the revival stream sees dozens of stale tasks in the system
            // prompt, causing extra LLM calls that pollute the fixture counter.
            // IMPORTANT: Only delete tasks with a terminal execution status - new wakeUp
            // tasks are inserted with enabled=false initially and would be wrongly deleted.
            await db.execute(
              sql`DELETE FROM cron_tasks WHERE id LIKE 'local-wu-%' AND last_execution_status IN ('status.completed', 'status.failed', 'status.cancelled', 'status.stopped')`,
            );
            await pinBalance(testUser, 20);
            const before = await getBalance(testUser);
            wakeupMsgIds = new Set(
              (await getMessages(threadId)).map((m) => m.id),
            );
            wakeupInitialMsgIds = new Set(wakeupMsgIds);

            const { result, messages } = await runStream({
              user: testUser,
              prompt: cfg.cheapMode
                ? `[T6a wakeUp-phase1] Call ${toolInstrWithArgs(cfg, cbTool.name, `${cbArgs("wakeup-test")} and callbackMode='wakeUp'`)}. The write runs asynchronously. There are TWO phases and you judge each by what the LATEST tool result in the conversation contains: PHASE 1 (dispatch): the latest result has a taskId and NO responsePath — end your reply with STEP_OK, or FAILED: <reason> if there is a responsePath already. PHASE 2 (you are automatically revived later; a NEW deferred tool result appears containing the tool's real output): seeing a non-empty responsePath in that deferred result is CORRECT and EXPECTED — it does NOT mean the wakeUp mode misbehaved. In phase 2, confirm the deferred result contains a non-empty responsePath, then end with WAKEUP_OK. Only end with WAKEUP_FAILED: <reason> if NO responsePath appears.`
                : `[T6a wakeUp-phase1] Call ${toolInstrWithArgs(cfg, cbTool.name, `${cbArgs("wakeup-test")} and callbackMode='wakeUp'`)}. The image will be generated asynchronously. There are TWO phases and you judge each by what the LATEST tool result in the conversation contains: PHASE 1 (dispatch): the latest result has a taskId and NO image — end your reply with STEP_OK, or FAILED: <reason> if there is an image already. PHASE 2 (you are automatically revived later; a NEW deferred tool result appears containing the finished image): seeing an image URL in that deferred result is CORRECT and EXPECTED — it does NOT mean the wakeUp mode misbehaved. The URL may appear as an "imageUrl" field OR a rendered markdown image link ![...](https://...) — either counts. In phase 2, confirm an image URL (http or https) is present and non-empty, then end with WAKEUP_OK. Only end with WAKEUP_FAILED: <reason> if NO image URL appears in any form.`,
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
            const toolMsg = findToolMsg(addedNonDeferred, cbTool.name, cfg);
            expect(toolMsg).toBeDefined();
            if (toolMsg) {
              // wakeUp phase1: tool dispatched async - status is "pending" in remote, undefined in local
              assertToolMessageComplete(
                toolMsg,
                cbTool.name,
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
            t6aInlineDelivery = cbResultOk(phase1Res);
            if (t6aInlineDelivery && !cfg.cheapMode) {
              expect(
                String(phase1Res!["imageUrl"]),
                "T6a inline delivery: imageUrl must be a real URL",
              ).toMatch(/^https?:\/\/.+/);
              // Capture the generated image URL — the T6v video-gen step (after
              // T6b) consumes it as lastFrameUrl.
              t6aGeneratedImageUrl = String(phase1Res!["imageUrl"]);
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
            const REVIVAL_POLL_INTERVAL_MS = 100;
            const revivalStart = Date.now();
            let revivalLanded = t6aInlineDelivery;
            while (
              !revivalLanded &&
              Date.now() - revivalStart < REVIVAL_TIMEOUT_MS
            ) {
              const currentMsgs = await getMessages(threadId);
              const deferredExists = currentMsgs.some(
                (m) => m.toolCall?.isDeferred === true && isCbToolMsg(m),
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
              if (cfg.cheapMode) {
                expect(
                  cbResultOk(inlineRes),
                  `T6b inline: original message must hold the final ${cbTool.resultKey}. Result: ${JSON.stringify(inlineRes)}`,
                ).toBe(true);
              } else {
                expect(
                  String(inlineRes?.["imageUrl"] ?? ""),
                  "T6b inline: original message must hold the final imageUrl",
                ).toMatch(/^https?:\/\/.+/);
              }
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
            const WAKEUP_POLL_MS = 100;
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
                  resolveToolResult(m)?.[cbTool.resultKey] !== undefined &&
                  isCbToolMsg(m),
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

            // ── Per spec: exactly 2 cbTool tool messages - original + deferred ──
            // No more, no less. A 3rd message = premature revival fired with {status:"pending"}.
            // Scope to T6 branch only (messages added since the count captured before T6a).
            const t6BranchMsgs = newMessages(messages, wakeupInitialMsgIds);
            const allGenImgToolMsgs = t6BranchMsgs.filter((m) =>
              isCbToolMsg(m),
            );
            expect(
              allGenImgToolMsgs.length,
              `T6b: expected exactly 2 ${cbTool.name} tool messages (original + deferred). Got ${String(allGenImgToolMsgs.length)}: ${allGenImgToolMsgs.map((m) => `${m.id}(isDeferred=${String(m.toolCall?.isDeferred)},result=${JSON.stringify(resolveToolResult(m))?.slice(0, 80)})`).join(", ")}`,
            ).toBe(2);

            const originalToolMsg = allGenImgToolMsgs.find(
              (m) => !m.toolCall?.isDeferred,
            );
            const deferredToolMsg = allGenImgToolMsgs.find(
              (m) => m.toolCall?.isDeferred === true,
            );
            expect(
              originalToolMsg,
              `T6b: original (non-deferred) ${cbTool.name} tool message not found`,
            ).toBeDefined();
            expect(
              deferredToolMsg,
              `T6b: deferred ${cbTool.name} tool message not found`,
            ).toBeDefined();

            // ── Deferred tool message: written by resume-stream with the real result ──
            expect(
              deferredTool,
              `T6b: no deferred tool message with ${cbTool.resultKey} found`,
            ).toBeDefined();
            if (deferredTool) {
              // Use resolveToolResult to handle execute-tool wrapper (remote mode)
              const deferredRes = resolveToolResult(deferredTool);
              expect(typeof deferredRes![cbTool.resultKey]).toBe("string");
              expect(deferredRes![cbTool.resultKey]).toBeTruthy();

              // Capture the generated image URL (non-cheap: resultKey === "imageUrl")
              // — the T6v video-gen step consumes it as lastFrameUrl.
              if (!cfg.cheapMode) {
                t6aGeneratedImageUrl = String(deferredRes![cbTool.resultKey]);
              }

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
            // Original content: {taskId, status:"pending"} shape - never has the result.
            const originalToolInDb = messages.find(
              (m) => m.id === wakeupToolMsgId,
            );
            expect(
              originalToolInDb,
              "T6b: original wakeUp tool message must still exist in DB",
            ).toBeDefined();
            if (originalToolInDb) {
              const origRes = resolveToolResult(originalToolInDb);
              // Original should NOT have the result - that's in the deferred message.
              expect(
                origRes?.[cbTool.resultKey],
                `T6b: wakeUp original tool message must NOT have ${cbTool.resultKey} - result goes to deferred`,
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
            // The thread reference now lives in task_input jsonb (the dedicated
            // wake_up_thread_id column was dropped in the thread-model refactor).
            const loopRiskTasks = await db.execute<{
              id: string;
              last_execution_status: string | null;
            }>(
              sql`SELECT id, last_execution_status FROM cron_tasks
                  WHERE task_input->>'threadId' = ${threadId}
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

      // ── T6v: video gen using T6a's generated image as lastFrameUrl ──────
      // Runs AFTER T6b so T6a's wakeUp image-gen has produced a real https URL
      // (t6aGeneratedImageUrl). Chains linearly from T6b's leaf (lastMainAiMsgId).
      // The video is generated between a fixed wojak first frame and T6a's image
      // as the last frame. Cheap fork stays media-free (favorites read tool).
      fit(`T6v: video gen (firstFrame=wojak, lastFrame=T6a image) - ${cfg.cheapMode ? "favorites" : "generate_video"}`, async () => {
        const wojakUrl = "https://pngimg.com/uploads/wojak/wojak_PNG109612.png";

        if (!cfg.cheapMode) {
          // T6a must have produced a real image URL (inline or deferred).
          expect(
            t6aGeneratedImageUrl,
            "T6v: t6aGeneratedImageUrl must be captured from T6a before the video step runs",
          ).toMatch(/^https?:\/\/.+/);
        }

        // VEO_3_1 costs ~48 cr/sec * 5 sec * 1.3 markup = ~312 cr minimum.
        await pinBalance(testUser, 400);
        const beforeT6v = await getBalance(testUser);
        const prevIdsT6v = new Set(
          (await getMessages(threadId)).map((m) => m.id),
        );

        const t6vTool = cfg.cheapMode ? "favorites" : "generate_video";
        const { result: t6vResult, messages: t6vMsgs } = await runStream({
          user: testUser,
          // RECORDING-ONLY worst case: ModelsLab's poller caps at 300
          // attempts before the future_links fallback, plus upload +
          // cross-instance handoff. Replays finish in seconds.
          settleTimeoutMs: 900_000,
          prompt: cfg.cheapMode
            ? `[T6v favorites] Call ${toolInstr(cfg, "favorites")} to list the user's favorites. Check that the result has a favorites array. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.`
            : `[T6v video-gen] Generate a 'spinning cube' video that morphs from this photo ${wojakUrl} (the FIRST frame) into the image YOU generated earlier in this conversation (that earlier generated image is the LAST frame — find its URL in your own prior tool results / conversation history; do NOT reuse the first-frame photo for it). ${cfg.remoteInstanceId ? `Call execute-tool with toolName='generate_video', instanceId='${cfg.remoteInstanceId}', input containing prompt='spinning cube' and frameReferences=[{url:'${wojakUrl}',role:'first'},{url:<your earlier generated image URL>,role:'last'}].` : `Call the generate_video tool with prompt='spinning cube' and frameReferences=[{url:'${wojakUrl}',role:'first'},{url:<your earlier generated image URL>,role:'last'}].`} Check that the result has a non-empty videoUrl, a positive creditCost, and a positive durationSeconds. You must end your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong as the very last step.`,
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: lastMainAiMsgId,
        });

        expect(t6vResult.success).toBe(true);
        if (!t6vResult.success) {
          // oxlint-disable-next-line restricted-syntax
          throw new Error(t6vResult.message ?? "unexpected failure");
        }

        const t6vAdded = newMessages(t6vMsgs, prevIdsT6v);

        // Chains linearly from T6b's leaf.
        const t6vUser = t6vAdded.find((m) => m.role === "user");
        expect(
          t6vUser?.parentId,
          `T6v: user parentId must be lastMainAiMsgId=${lastMainAiMsgId} (chains after T6b)`,
        ).toBe(lastMainAiMsgId);

        const t6vToolMsg = findToolMsg(t6vAdded, t6vTool, cfg);
        expect(t6vToolMsg).toBeDefined();
        if (t6vToolMsg) {
          assertToolMessageComplete(t6vToolMsg, t6vTool, "T6v", cfg);
        }

        const t6vRes = resolveToolResult(t6vToolMsg);
        expect(t6vRes).not.toBeNull();
        if (cfg.cheapMode) {
          expect(
            Array.isArray(t6vRes!["favorites"]),
            "[T6v] favorites result must have a favorites array",
          ).toBe(true);
        } else {
          expect(typeof t6vRes!["videoUrl"]).toBe("string");
          expect(String(t6vRes!["videoUrl"])).toMatch(/^https?:\/\/.+/);
          expect(typeof t6vRes!["creditCost"]).toBe("number");
          expect((t6vRes!["creditCost"] as number) > 0).toBe(true);
          expect(typeof t6vRes!["durationSeconds"]).toBe("number");
          expect((t6vRes!["durationSeconds"] as number) > 0).toBe(true);

          // ── frameReferences arg must carry the wojak first + T6a last frame ──
          // In execute-tool (queue) mode the args nest under `input`; in
          // direct mode they sit at the top level of args.
          const t6vArgs = toolResultRecord(t6vToolMsg!.toolCall?.args);
          const t6vInput = toolResultRecord(t6vArgs?.["input"] as WidgetData);
          const rawFrameReferences =
            t6vArgs?.["frameReferences"] ?? t6vInput?.["frameReferences"];
          const frameReferences = Array.isArray(rawFrameReferences)
            ? rawFrameReferences.flatMap((entry) => {
                const rec = toolResultRecord(entry);
                return rec ? [rec] : [];
              })
            : [];
          const firstFrame = frameReferences.find(
            (f) => f["role"] === "first",
          )?.["url"];
          const lastFrame = frameReferences.find((f) => f["role"] === "last")?.[
            "url"
          ];
          expect(
            firstFrame,
            `[T6v] generate_video args.frameReferences must include the wojak URL with role 'first' — args: ${JSON.stringify(t6vArgs)}`,
          ).toBe(wojakUrl);
          // The AI must resolve the LAST frame itself: an image IT generated
          // earlier in THIS conversation (T2/T5/T6a all produced images). We do
          // NOT pin T6a's exact URL — any of our own generated-image storage URLs
          // is correct — only that it's one of OURS, role 'last', and NOT the
          // wojak first frame (i.e. it didn't reuse the first frame or invent one).
          expect(
            typeof lastFrame === "string" &&
              lastFrame.includes("/agent/chat/threads/files/") &&
              lastFrame !== wojakUrl,
            `[T6v] last frame must be an image the AI generated earlier in this conversation (our storage URL), not the wojak first frame or an invented URL — got ${String(lastFrame)}; args: ${JSON.stringify(t6vArgs)}`,
          ).toBe(true);
        }

        const t6vLastAi = t6vMsgs.find(
          (m) => m.id === t6vResult.data.lastAiMessageId,
        );
        expect(t6vLastAi).toBeDefined();
        expect(t6vLastAi!.finishReason).toBe("stop");
        assertStepOk(t6vLastAi!.content, "T6v");
        lastMainAiMsgId = t6vResult.data.lastAiMessageId!;

        assertNoOrphans(
          t6vMsgs,
          new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
          {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          },
        );
        await assertThreadIdle(threadId, testUser);
        await assertNoPendingTasks(threadId);

        const afterT6v = await getBalance(testUser);
        // Cheap read deducts only LLM tokens; real video gen deducts a media
        // charge unless it ran on a remote instance.
        await assertDeductedLocal(
          testUser,
          beforeT6v,
          afterT6v,
          cfg.cheapMode || cfg.remoteInstanceId ? 0 : 5,
          400,
        );
      }, 1_200_000);

      // ── T6c: wakeUp repeat - second full E2E wakeUp on same thread ──────
      // Verifies no stale state from T6a/T6b causes issues.
      // ── T6c: consecutive wakeUp repeats - 2nd AND 3rd wakeUp on same thread ──
      // Loops TWO more consecutive wakeUp dispatches (after T6a/T6b's first) so a
      // single case proves the full dispatch→deferred→revival E2E survives being
      // repeated with NO accumulated stale state across iterations. Each iteration
      // asserts: phase-1 dispatch OK, original+deferred pairing (N originals ⇒ N
      // deferred), deferred structure, revival WAKEUP_OK, correct leaf, no orphans,
      // idle. (Merges the former T6c "repeat" + T6d "stress" — identical code path
      // at N=2 and N=3; the loop covers both without two copies.)
      fit(
        `T6c: consecutive wakeUp repeats - two more ${cbTool.name}(wakeUp) on same thread, no stale state`,
        async () => {
          const T6C_ROUNDS = [
            { slug: "wakeup-repeat-test", label: "T6c#2" },
            { slug: "wakeup-stress-test", label: "T6c#3" },
          ];

          for (const round of T6C_ROUNDS) {
            await pinBalance(testUser, 20);
            const roundInitialIds = new Set(
              (await getMessages(threadId)).map((m) => m.id),
            );

            const { result, messages: phase1Msgs } = await runStream({
              user: testUser,
              prompt: cfg.cheapMode
                ? `[${round.label} wakeUp-repeat] Call ${toolInstrWithArgs(cfg, cbTool.name, `${cbArgs(round.slug)} and callbackMode='wakeUp'`)}. Two valid outcomes: (a) DEFERRED - you get a taskId and no responsePath yet → end with STEP_OK; OR (b) INLINE - a fast task returns the result immediately (a non-empty responsePath) → end with WAKEUP_OK. Either is correct. Only end with FAILED: <reason> if you get neither a taskId nor a responsePath. If you got a taskId (deferred), you will be revived when the write is done - on revival confirm the deferred result contains a non-empty responsePath and end with WAKEUP_OK, or WAKEUP_FAILED: <reason> if no responsePath appears.`
                : `[${round.label} wakeUp-repeat] Call ${toolInstrWithArgs(cfg, cbTool.name, `${cbArgs(round.slug)} and callbackMode='wakeUp'`)}. Two valid outcomes: (a) DEFERRED - you get a taskId and no image yet → end with STEP_OK; OR (b) INLINE - a fast task returns the image immediately (an imageUrl field or a markdown image link) → end with WAKEUP_OK. Either is correct. Only end with FAILED: <reason> if you get neither a taskId nor an image. If you got a taskId (deferred), you will be revived when the image is ready - on revival confirm the image URL (http/https, as a field or markdown link) is present and end with WAKEUP_OK, or WAKEUP_FAILED: <reason> if no image URL appears.`,
              threadId,
              favoriteId: mainFavoriteId,
              explicitParentMessageId: lastMainAiMsgId,
            });

            expect(result.success, `${round.label}: runStream failed`).toBe(
              true,
            );
            if (!result.success) {
              // oxlint-disable-next-line restricted-syntax
              throw new Error(result.message ?? "unexpected stream failure");
            }

            // Re-fetch + pull: the tool message mirrors after runStream's snapshot.
            let added = newMessages(phase1Msgs, roundInitialIds);
            let toolMsg = findToolMsg(added, cbTool.name, cfg);
            for (let i = 0; i < 20 && !toolMsg; i++) {
              added = newMessages(await getMessages(threadId), roundInitialIds);
              toolMsg = findToolMsg(added, cbTool.name, cfg);
              if (toolMsg) {
                break;
              }
              await new Promise<void>((resolve) => {
                setTimeout(resolve, 500);
              });
            }
            expect(
              toolMsg,
              `${round.label}: ${cbTool.name} tool message not found`,
            ).toBeDefined();
            // Delivery shape: deferred (taskId, pending) or inline (result now).
            const phase1Res = resolveToolResult(toolMsg);
            const inline = cbResultOk(phase1Res);

            const lastAi = await awaitFinalAssistant(
              threadId,
              result.data.lastAiMessageId!,
              getMessages,
            );
            expect(
              lastAi,
              `${round.label}: no AI response found`,
            ).toBeDefined();
            assertWakeUpPhase1Ok(lastAi?.content, round.label);
            lastMainAiMsgId = result.data.lastAiMessageId!;

            // Inline delivery (fast task): no taskId, no deferred, no revival — the
            // original message already holds the result. The wakeUp contract (tool
            // never blocks) still held; walk to the leaf and continue to next round.
            if (inline) {
              if (!cfg.cheapMode) {
                expect(
                  String(phase1Res!["imageUrl"]),
                  `${round.label} inline: imageUrl must be a real URL`,
                ).toMatch(/^https?:\/\/.+/);
              }
              await assertThreadIdle(threadId, testUser);
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
              continue;
            }

            // Queue mode: pulse to start the background task
            if (cfg.pulse) {
              await cfg.pulse(threadId);
            }

            // Poll for deferred + revival AI + idle
            const REVIVAL_TIMEOUT_MS = 120_000;
            const REVIVAL_POLL_MS = 100;
            const deadline = Date.now() + REVIVAL_TIMEOUT_MS;
            let messages: SlimMessage[] = [];
            let deferredTool: SlimMessage | undefined;
            let revivalAi: SlimMessage | undefined;
            while (Date.now() < deadline) {
              messages = await getMessages(threadId);
              const roundMsgs = newMessages(messages, roundInitialIds);
              deferredTool = roundMsgs.find(
                (m) => m.toolCall?.isDeferred === true && isCbToolMsg(m),
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

            // ── Each cbTool wakeUp call must produce original + deferred ──
            // Model may call cbTool multiple times → N originals + N deferred.
            const branchMsgs = newMessages(messages, roundInitialIds);
            const allCbToolMsgs = branchMsgs.filter((m) => isCbToolMsg(m));
            const originals = allCbToolMsgs.filter(
              (m) => !m.toolCall?.isDeferred,
            );
            const deferreds = allCbToolMsgs.filter(
              (m) => m.toolCall?.isDeferred === true,
            );
            expect(
              originals.length,
              `${round.label}: expected at least 1 original ${cbTool.name} tool msg. Got ${String(originals.length)}`,
            ).toBeGreaterThanOrEqual(1);
            expect(
              deferreds.length,
              `${round.label}: expected same number of deferred as original. Originals: ${String(originals.length)}, deferred: ${String(deferreds.length)}`,
            ).toBe(originals.length);

            // ── Deferred tool message ──
            expect(
              deferredTool,
              `${round.label}: no deferred tool found`,
            ).toBeDefined();
            if (deferredTool) {
              expect(deferredTool.toolCall?.isDeferred).toBe(true);
              expect(deferredTool.toolCall?.originalToolCallId).toBeTruthy();
            }

            // ── Revival AI ──
            expect(
              revivalAi,
              `${round.label}: no revival AI message found`,
            ).toBeDefined();
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
                  `${round.label}: revival AI visible text must contain WAKEUP_OK - got: ${revivalVisible.slice(0, 300)}`,
                ).toContain("WAKEUP_OK");
              }
            }

            // Walk to the actual leaf via child links — timestamps are unreliable
            // when branches can be created at any time. The model may have called
            // the callback tool multiple times, creating multiple deferred+revival
            // pairs in a linear chain. Start from runStream's lastAiMessageId (or the
            // deferred tool) and follow children down to the deepest node.
            messages = await getMessages(threadId);
            {
              const byId = new Map(messages.map((m) => [m.id, m]));
              const childrenOf = new Map<string, SlimMessage[]>();
              for (const m of messages) {
                if (m.parentId) {
                  const list = childrenOf.get(m.parentId) ?? [];
                  list.push(m);
                  childrenOf.set(m.parentId, list);
                }
              }
              const startId =
                result.data.lastAiMessageId ??
                deferredTool?.id ??
                lastMainAiMsgId;
              let cursor = startId ? byId.get(startId) : undefined;
              while (cursor) {
                const kids = childrenOf.get(cursor.id);
                if (!kids || kids.length === 0) {
                  break;
                }
                // Linear chain expected — exactly one child per step.
                cursor = kids[0];
              }
              if (cursor) {
                lastMainAiMsgId = cursor.id;
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
          }
        },
        // Two consecutive real media gens + revivals — needs the media budget,
        // not the default 120s (which times out mid live-recording).
        mediaTestTimeout,
      );

      // ── T7: Approve - two-phase (parallel tools + correct UI confirm flow) ─
      describe("T7: approve (two-phase)", () => {
        // Saved across T7a → T7b
        let approveToolMsgId: string;
        let approveToolParentId: string | null;

        // T7a sets the favorite's availableTools (to gate the approve tool's
        // confirmation) and T7b restores it. If a case BETWEEN them bails, the
        // whitelist would leak into the NEXT run's T1 and block housekeeping
        // (rename-thread → not_in_whitelist). Always reset it here so a failed
        // run never poisons the shared favorite. The favorite is only ever
        // restricted for the duration of this T7 block.
        afterAll(async () => {
          const favByIdDef = (
            await import("next-vibe/agent/skills/favorites/[id]/definition")
          ).default;
          const favGet = await sendTestRequest({
            streamContext: rootlessStreamContext(),
            endpoint: favByIdDef.GET,
            urlPathParams: { id: mainFavoriteId },
            user: testUser,
          });
          await sendTestRequest({
            streamContext: rootlessStreamContext(),
            endpoint: favByIdDef.PATCH,
            data: {
              modelSelection: favGet.success
                ? favGet.data.modelSelection
                : null,
              availableTools: null,
            },
            urlPathParams: { id: mainFavoriteId },
            user: testUser,
          });
        });

        fit(
          `T7a: approve phase1 - parallel tools: tool-help runs, ${approveTool.name} awaits confirmation, no assistant message after`,
          async () => {
            await pinBalance(testUser, 10);
            const before = await getBalance(testUser);
            const prevIds = new Set(
              (await getMessages(threadId)).map((m) => m.id),
            );

            // The confirmation gate lives ON the favorite (what a real user
            // configures), not as a per-call override. PATCH the approve tool
            // to requiresConfirmation=true on the main favorite for this phase.
            // The PATCH requires modelSelection, so read the current one first
            // and send it back unchanged (faithful client flow).
            const favByIdDefT7 = (
              await import("next-vibe/agent/skills/favorites/[id]/definition")
            ).default;
            // The gate applies to the TARGET tool uniformly — locally AND on
            // remote dispatch (guards.applyConfirmationGate runs in both
            // paths), so every cell gates the approve tool itself.
            const confirmToolId = approveTool.name;
            const t7FavGet = await sendTestRequest({
              streamContext: rootlessStreamContext(),
              endpoint: favByIdDefT7.GET,
              urlPathParams: { id: mainFavoriteId },
              user: testUser,
            });
            const t7ModelSelection = t7FavGet.success
              ? t7FavGet.data.modelSelection
              : null;
            // The favorite's availableTools carries the per-tool
            // requiresConfirmation flag. It is a WHITELIST — setting it to just
            // the approve tool would collapse the callable set to one tool and
            // block every other tool the turn legitimately uses (tool-help, the
            // rename-thread housekeeping the system prompt instructs, etc). So set
            // the WHOLE role/folder tool list as available, flipping ONLY the
            // approve tool's confirmation flag; T7a-restore clears it to null.
            const { getDefaultToolIdsForFolder } =
              await import("next-vibe/agent/chat/constants");
            const fullToolList = getDefaultToolIdsForFolder(
              testUser,
              suiteRootFolderId,
            ).map((toolId) => ({
              toolId,
              requiresConfirmation: toolId === confirmToolId,
            }));
            // The approve tool may not be in the folder defaults — ensure it is
            // present (with confirmation) so the gate has something to gate.
            if (!fullToolList.some((t) => t.toolId === confirmToolId)) {
              fullToolList.push({
                toolId: confirmToolId,
                requiresConfirmation: true,
              });
            }
            await sendTestRequest({
              streamContext: rootlessStreamContext(),
              endpoint: favByIdDefT7.PATCH,
              data: {
                modelSelection: t7ModelSelection,
                availableTools: fullToolList,
              },
              urlPathParams: { id: mainFavoriteId },
              user: testUser,
            });

            // Prompt: call BOTH tool-help AND the approve tool in same parallel step.
            // The approve tool requires confirmation → placeholder only, stream aborts before AI response.
            const { result, messages } = await runStream({
              user: testUser,
              prompt: `[T7a approve-phase1] In a single response, call BOTH at the same time: (1) ${toolInstr(cfg, "tool-help")} to list available tools, and (2) ${toolInstrWithArgs(cfg, approveTool.name, approveTool.argsInstr)}. The ${approveTool.name} tool requires user confirmation - it should NOT execute yet. End your reply with STEP_OK after the tool calls.`,
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

            // ── Approve tool message - has waiting_for_confirmation placeholder ──
            const approveToolMsg =
              findToolMsg(added, approveTool.name, cfg) ??
              added.find(
                (m) =>
                  m.role === "tool" &&
                  m.toolCall?.toolName === approveTool.name,
              );
            expect(
              approveToolMsg,
              `T7a: ${approveTool.name} tool message not found`,
            ).toBeDefined();
            if (approveToolMsg) {
              // APPROVE mode: tool awaits user confirmation, result is a placeholder (waiting_for_confirmation).
              // The execute-tool task itself completes (returns placeholder), so status is "completed".
              assertToolMessageComplete(
                approveToolMsg,
                approveTool.name,
                "T7a",
                cfg,
                "completed",
              );
            }
            approveToolMsgId = approveToolMsg!.id;
            approveToolParentId = approveToolMsg!.parentId;

            const toolRes = resolveToolResult(approveToolMsg);
            // Must NOT have executed - no result, must have waiting_for_confirmation
            expect(
              toolRes?.[approveTool.resultKey],
              `T7a: ${approveTool.resultKey} present - tool executed without approval (requiresConfirmation=true was ignored)`,
            ).toBeUndefined();
            expect(
              toolRes?.["status"],
              "T7a: expected waiting_for_confirmation status",
            ).toBe("waiting_for_confirmation");

            // ── tool-help ran (parallel to the approve tool) - has real result ──
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
              await import("next-vibe/agent/skills/favorites/[id]/definition")
            ).default;
            const t7bFavGet = await sendTestRequest({
              streamContext: rootlessStreamContext(),
              endpoint: favByIdDefT7b.GET,
              urlPathParams: { id: mainFavoriteId },
              user: testUser,
            });
            await sendTestRequest({
              streamContext: rootlessStreamContext(),
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
            // pending {status: pending} result. Now call pulse to execute the approved task
            // and fire the WAIT revival stream so the tool message gets the real result.
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
              `T7b: ${approveTool.name} tool message not found by approveToolMsgId=${approveToolMsgId}. All msg IDs: [${allToolMsgIds.join(", ")}]. approveToolMsgInList role=${approveToolMsgInList?.role}`,
            ).toBeDefined();

            const toolRes = resolveToolResult(toolMsg);
            const rawResult = toolMsg!.toolCall?.result;
            expect(
              toolRes,
              `T7b: tool result is null. toolCall=${JSON.stringify(toolMsg?.toolCall).slice(0, 200)}`,
            ).not.toBeNull();
            expect(
              typeof toolRes![approveTool.resultKey],
              `T7b: ${approveTool.resultKey} not a string. Full toolRes=${JSON.stringify(rawResult).slice(0, 300)}`,
            ).toBe("string");
            expect(
              toolRes![approveTool.resultKey],
              `T7b: ${approveTool.resultKey} should be truthy`,
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
            // The model may call the approve tool again as a NEW tool invocation after
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

            // ── creditCost > 0 - image was actually generated (full mode only:
            // cortex-write carries no creditCost field — the responsePath
            // presence above already proves the write executed) ──
            if (!cfg.cheapMode) {
              expect(
                toolRes!["creditCost"] as number,
                "T7b: creditCost should be > 0 after approval execution",
              ).toBeGreaterThan(0);
            }

            // The model may call additional tools (e.g. the approve tool with endLoop)
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
            // Full: model may call generate_image again after seeing the
            // approved result (e.g. kimi-k2-6 calls it with endLoop), doubling
            // the image cost. Confirmed image gen + AI turn; kimi sometimes
            // needs extra round trips (same allowance as T1). Cheap:
            // cortex-write is ~free — only the AI turns bill (T2 floor).
            await assertDeductedLocal(
              testUser,
              before,
              after,
              cfg.cheapMode ? 0.05 : 0.47,
              50,
            );
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
              return isToolMsgFor(m, "contact-form");
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
          // Cheap mode keeps the IDENTICAL parallel-batch shape (two tools in one
          // batch, same sequenceId, both results populated). Only the tools change:
          // regular = tool-help + generate_image; cheap = cortex-write +
          // chat-settings (two DISTINCT non-media tools).
          await pinBalance(testUser, 20);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          // Cheap batch pair: cortex-write (real DB write) + chat-settings (read).
          const t8CheapPath = "/memories/t8-parallel-test";
          const { result, messages } = await runStream({
            user: testUser,
            prompt: cfg.cheapMode
              ? `[T8 parallel-tools] In a single response, call BOTH at the same time: (1) ${toolInstrWithArgs(cfg, "cortex-write", `path='${t8CheapPath}' and content='T8_PARALLEL_OK'`)} to write a memory node, and (2) ${toolInstr(cfg, "chat-settings")} to read the chat settings. Check that cortex-write returned a responsePath and chat-settings returned a selectedSkill. End your reply with STEP_OK if both tools ran and returned their result shape, or FAILED: <reason> only if a tool errored or did not run.`
              : `[T8 parallel-tools] In a single response, call BOTH at the same time: (1) ${toolInstrWithArgs(cfg, "tool-help", `query='image'${cfg.remoteInstanceId ? " and callbackMode='wait'" : ""}`)} to look up tools matching 'image' (this returns a tools array, NOT categories), and (2) ${toolInstrWithArgs(cfg, "generate_image", `prompt='green square'${cfg.remoteInstanceId ? " and callbackMode='wait'" : ""}`)}. IMPORTANT: You MUST use callbackMode='wait' for both tools - do NOT use wakeUp or detach. tool-help WITH a query returns a tools array; an empty array only means no match, not a failure. Check that tool-help returned a tools array (any length) and generate_image returned an imageUrl (not a taskId). End your reply with STEP_OK if both tools ran and returned their result shape, or FAILED: <reason> only if a tool errored or did not run.`,
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

          // ── Per-tool result checks — same PARALLEL-BATCH feature, only the
          //    tool pair differs (cheap: cortex-write + chat-settings; regular:
          //    generate_image + tool-help). Both branches assert each tool's own
          //    result shape resolved through the WAIT/wakeUp effective-result path.
          const effectiveResultFor = (
            toolName: string,
          ): Record<string, WidgetData> | null => {
            const msg = findToolMsg(added, toolName, cfg);
            expect(msg, `T8: ${toolName} tool msg not found`).toBeDefined();
            if (msg) {
              assertToolMessageComplete(msg, toolName, "T8", cfg);
            }
            const orig = resolveToolResult(msg);
            const deferred = msg
              ? added.find(
                  (m) =>
                    m.role === "tool" &&
                    m.toolCall?.originalToolCallId === msg.toolCall?.toolCallId,
                )
              : undefined;
            return orig ?? resolveToolResult(deferred);
          };

          if (cfg.cheapMode) {
            const writeRes = effectiveResultFor("cortex-write");
            expect(writeRes, "T8: cortex-write result is null").not.toBeNull();
            expect(
              typeof writeRes!["responsePath"],
              "T8: cortex-write result must have a responsePath",
            ).toBe("string");
            const settingsRes = effectiveResultFor("chat-settings");
            expect(
              settingsRes,
              "T8: chat-settings result is null",
            ).not.toBeNull();
            expect(
              "selectedSkill" in settingsRes!,
              "T8: chat-settings result must have selectedSkill",
            ).toBe(true);
          } else {
            const imgRes = effectiveResultFor("generate_image");
            expect(imgRes, "T8: generate_image result is null").not.toBeNull();
            expect(typeof imgRes!["imageUrl"]).toBe("string");
            expect(imgRes!["imageUrl"], "T8: imageUrl is empty").toBeTruthy();
            const toolHelpRes = effectiveResultFor("tool-help");
            expect(toolHelpRes, "T8: tool-help result is null").not.toBeNull();
            expect(
              Array.isArray(toolHelpRes!["tools"]),
              "T8: tool-help tools is not array",
            ).toBe(true);
          }

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
          // Cheap mode's batch is two token-only tools (cortex-write +
          // chat-settings) — no media floor applies, so the cost is just the
          // turn's tokens (a small positive amount). Full mode includes a real
          // generate_image, whose media cost sets the 0.47 floor.
          await assertDeductedLocal(
            testUser,
            before,
            after,
            cfg.cheapMode ? 0.05 : 0.47,
            12,
          );
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
          // Cheap mode keeps the IDENTICAL two-turn structure (turn 1 calls a
          // real tool, turn 2 reasons about that tool's result already in
          // context). Only the tool changes: cheap → products-category-list (a
          // distinct non-media read tool with a SMALL bounded result — a handful
          // of categories, unlike leads-list which returns ~2k rows and floods
          // the follow-up turn's context).
          await pinBalance(testUser, 20);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const t9Tool = cfg.cheapMode
            ? "products-category-list"
            : "generate_image";

          // ── Turn 1: AI actually calls the tool (real tool call) ──
          const { result: genResult, messages: genMessages } = await runStream({
            user: testUser,
            prompt: cfg.cheapMode
              ? `[T9 setup] Call ${toolInstr(cfg, "products-category-list")} to list the product categories. Check that the result has a categories array. End your reply with STEP_OK once the categories are listed.`
              : `[T9 setup] Call ${toolInstrWithArgs(cfg, "generate_image", "prompt='mountain landscape at golden hour'")} to generate an image. End your reply with STEP_OK once the image is generated.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });
          expect(genResult.success, "T9 setup: tool turn must succeed").toBe(
            true,
          );
          if (!genResult.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(genResult.message ?? "unexpected failure");
          }

          const genAdded = newMessages(genMessages, prevIds);
          const toolMsg = findToolMsg(genAdded, t9Tool, cfg);
          expect(toolMsg, `T9: ${t9Tool} tool message not found`).toBeDefined();
          if (toolMsg) {
            assertToolMessageComplete(toolMsg, t9Tool, "T9a", cfg);
          }
          const toolRes = resolveToolResult(toolMsg);
          expect(toolRes).not.toBeNull();
          if (cfg.cheapMode) {
            // products-category-list result: top-level `categories` array.
            expect(
              Array.isArray(toolRes!["categories"]),
              "[T9] products-category-list result must have a categories array",
            ).toBe(true);
          } else {
            expect(typeof toolRes!["imageUrl"]).toBe("string");
            expect(String(toolRes!["imageUrl"])).toMatch(/^https?:\/\/.+/);
          }
          lastMainAiMsgId = genResult.data.lastAiMessageId!;

          // ── Turn 2: AI reports the result it sees in its prior context ──
          const beforeReport = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );
          const { result, messages } = await runStream({
            user: testUser,
            prompt: cfg.cheapMode
              ? `[T9 report] A product-category list was retrieved for you earlier in this conversation. Look at the products-category-list tool result in your context and report how many categories you can see. End your reply with STEP_OK if you can see the categories array in your context, or FAILED: <reason> if no categories result was visible.`
              : `[T9 report] An image was generated for you earlier in this conversation. Look at the generate_image tool result in your context and report the exact imageUrl you see. End your reply with STEP_OK if you can see an imageUrl starting with 'https://' or 'http://', or FAILED: <reason> if no imageUrl was visible.`,
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

          // The FINAL assistant of the turn (by lastAiMessageId) — not the first
          // one found. With the per-turn rename-thread side-action, the turn's
          // first assistant made the tool call (finishReason null, turn
          // continued); only the answer message that ENDS the turn is "stop".
          const imgAiMsg = imgMsgs.find(
            (m) => m.id === imgResult.data.lastAiMessageId,
          );
          expect(imgAiMsg).toBeDefined();
          expect(imgAiMsg!.role).toBe("assistant");
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
          // The budget variant's chat model does NOT support audio input.
          // Attaching a WAV file triggers GapFillExecutor.bridgeStt() → the
          // variant's configured audioVisionModel.
          // The gap-fill produces a text transcription/description stored as a variant.
          // The main model then receives the text description instead of the raw file.
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
        mediaTestTimeout, // four attachment turns + bridge model calls — recording needs the media budget
      );

      // ── T11: Native multimodal (Gemini 3.1 Flash Image Preview) ──────────────
      // Covers BOTH native file-part paths on the Flash image model in one case:
      //   (1) text→image (blue triangle) and
      //   (2) native image-to-image (reference photo → stylized, no tool call).
      // Both take the identical FilePartHandler contract (synthetic generate_image
      // tool msg, `file` result, creditCost 0, empty args.prompt), so the native
      // path is exercised once while both entry points stay covered. (The former
      // standalone T11g native-i2i case is now sub-turn (2) here.)
      fit(
        "T11: native image generation - file-part output for text→image AND native image-to-image, no tool call",
        async () => {
          // Cheap mode keeps the IDENTICAL chain/orphan/idle/deduction
          // assertions. The native file-part specifics (synthetic tool msg
          // with a `file` part, empty prompt, no duplicated generatedMedia,
          // lastGeneratedMediaUrl) are regular-only. In cheap mode the model
          // simply calls one distinct real read tool (companies-list) as an
          // ordinary tool turn.
          await pinBalance(testUser, 100);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          // Use nativeImageFavoriteId: Gemini 3.1 Flash Image Preview as chat model.
          // Override imageGenModelSelection to the same model so chat model == image gen model:
          // imageGenIsSameAsChatModel=true → generate_image tool removed → native file parts.
          // Turn (1): text→image.
          const { result, messages } = await runStream({
            user: testUser,
            prompt: cfg.cheapMode
              ? `[T11 companies-list] Call ${toolInstr(cfg, "companies-list")} to list the companies. Check that the result has a companies array. End your reply with STEP_OK if the tool ran, or FAILED: <reason> if anything was wrong.`
              : "[T11 native-image] Generate an image of a blue triangle. Output the image directly (no tool call needed). End your reply with STEP_OK if the image was generated, or FAILED: <reason> if generation failed.",
            threadId,
            favoriteId: cfg.cheapMode ? mainFavoriteId : nativeImageFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          const added = newMessages(messages, prevIds);

          if (cfg.cheapMode) {
            // Cheap: ordinary tool turn — assert the normal tool-message shape.
            const companiesToolMsg = findToolMsg(added, "companies-list", cfg);
            expect(
              companiesToolMsg,
              "[T11] companies-list tool message not found",
            ).toBeDefined();
            if (companiesToolMsg) {
              assertToolMessageComplete(
                companiesToolMsg,
                "companies-list",
                "T11",
                cfg,
              );
            }
            const companiesRes = resolveToolResult(companiesToolMsg);
            expect(companiesRes).not.toBeNull();
            expect(
              Array.isArray(companiesRes!["companies"]),
              "[T11] companies-list result must have a companies array",
            ).toBe(true);
            lastMainAiMsgId = result.data.lastAiMessageId ?? lastMainAiMsgId;
          } else {
            expect(result.data.lastGeneratedMediaUrl).toBeTruthy();

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

            // Native image gen: the AI turns must run on EXACTLY the model the
            // native-image favorite resolves to (the chat model IS the image
            // model here) — asserted against the resolved favorite, never a
            // hardcoded model literal.
            const aiMsgs = added.filter((m) => m.role === "assistant");
            for (const ai of aiMsgs) {
              if (ai.content && !ai.isCompacting) {
                expect(
                  ai.model,
                  `[T11] native AI turn must run on the native-image favorite's resolved model (${nativeImageChatModelId})`,
                ).toBe(nativeImageChatModelId);
              }
            }
            // The native-image variant resolves its image-gen model to the SAME
            // model as the chat model (native gen, no tool round-trip).
            expect(
              nativeImageGenModelId,
              "[T11] native-image favorite must resolve an image-gen model",
            ).toBeTruthy();

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
                    m.role === "assistant" &&
                    m.parentId === nativeImgToolMsg.id,
                )
              : undefined;
            lastMainAiMsgId =
              postToolAi?.id ??
              nativeImgToolMsg?.id ??
              result.data.lastAiMessageId ??
              lastMainAiMsgId;

            // ── Sub-turn (2): native image-to-image on the same Flash model ──
            // The model sees a reference photo URL and emits the transformed image
            // as native file parts — no tool call. Same FilePartHandler contract
            // as turn (1); this is the coverage the standalone T11g case used to
            // provide. Anti-imitation instruction: in a long flattened thread the
            // model otherwise imitates the tool-call TEXT it sees in history.
            const i2iInputUrl =
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";
            const i2iPrevIds = new Set(
              (await getMessages(threadId)).map((m) => m.id),
            );
            const { result: i2iResult, messages: i2iMessages } =
              await runStream({
                user: testUser,
                prompt: `[T11 native-i2i] Here is my photo: ${i2iInputUrl} — create a stylized cartoon version of this photo. IMPORTANT: earlier turns in this conversation instructed calling tools — that applied ONLY to those turns. For THIS turn you MUST NOT call or imitate any tool. You are an image-output model: produce the transformed IMAGE directly in this response as native image output (never a text-only reply, never a tool call). End your reply with STEP_OK if you produced the image, or FAILED: <reason>.`,
                threadId,
                favoriteId: nativeImageFavoriteId,
                explicitParentMessageId: lastMainAiMsgId,
              });
            expect(i2iResult.success, "T11 native-i2i: stream failed").toBe(
              true,
            );
            if (!i2iResult.success) {
              // oxlint-disable-next-line restricted-syntax
              throw new Error(i2iResult.message ?? "unexpected stream failure");
            }
            expect(i2iResult.data.lastGeneratedMediaUrl).toBeTruthy();

            const i2iAdded = newMessages(i2iMessages, i2iPrevIds);
            // Same native contract: synthetic generate_image tool msg with file URL + creditCost 0.
            const i2iToolMsg = i2iAdded.find(
              (m) =>
                m.role === "tool" && m.toolCall?.toolName === "generate_image",
            );
            expect(
              i2iToolMsg,
              "[T11] native image-to-image must produce a synthetic generate_image tool message",
            ).toBeDefined();
            const i2iToolRes = resolveToolResult(i2iToolMsg);
            expect(i2iToolRes).not.toBeNull();
            expect(typeof i2iToolRes!["file"]).toBe("string");
            expect(i2iToolRes!["file"]).toBeTruthy();
            expect(i2iToolRes!["creditCost"]).toBe(0);

            const i2iLeaf = [...i2iAdded]
              .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .find(
                (m) => !i2iMessages.some((other) => other.parentId === m.id),
              );
            lastMainAiMsgId = i2iLeaf?.id ?? i2iResult.data.lastAiMessageId!;
          }

          assertNoOrphans(
            await getMessages(threadId),
            new Set([t2BranchParentId, ...mediaBranchPoints].filter(Boolean)),
            {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            },
          );
          await assertThreadIdle(threadId, testUser);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser);
          // Cheap read tools deduct only LLM tokens (little/none); full mode runs
          // TWO native gens (text→image + native i2i), each billed on the chat
          // model's image-output turn.
          await assertDeductedLocal(
            testUser,
            before,
            after,
            cfg.cheapMode ? 0 : 0.8,
            60,
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
          // Cheap mode keeps the IDENTICAL chain/orphan/idle assertions. The
          // native file-part fan-out (synthetic generate_image tool messages,
          // empty prompt, sibling dead-ends, branch points, lastGeneratedMediaUrl)
          // is regular-only. In cheap mode the model calls one distinct real read
          // tool (payment-invoice-list) as an ordinary tool turn.
          await pinBalance(testUser, 200);
          const before = await getBalance(testUser);
          const prevIds = new Set(
            (await getMessages(threadId)).map((m) => m.id),
          );

          const INPUT_IMAGE_URL =
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";

          const { result, messages } = await runStream({
            user: testUser,
            prompt: cfg.cheapMode
              ? `[T11e payment-invoice-list] Call ${toolInstr(cfg, "payment-invoice-list")} to list the payment invoices. Check that the result has an invoices array. End your reply with STEP_OK if you called the tool, or FAILED: <reason>.`
              : `[T11e i2i-native] Here is my photo: ${INPUT_IMAGE_URL} — generate a stylized cartoon version of this image. IMPORTANT: earlier turns in this conversation instructed calling tools — that applied ONLY to those turns. For THIS turn you MUST NOT call or imitate any tool. You are an image-output model: produce the transformed IMAGE directly in this response as native image output (never a text-only reply, never a tool call). End your reply with STEP_OK if you produced the image, or FAILED: <reason>.`,
            threadId,
            favoriteId: cfg.cheapMode ? mainFavoriteId : nativeImageFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            settleTimeoutMs: MEDIA_SETTLE_TIMEOUT_MS,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            // oxlint-disable-next-line restricted-syntax
            throw new Error(result.message ?? "unexpected stream failure");
          }

          const added = newMessages(messages, prevIds);

          if (cfg.cheapMode) {
            // Cheap: ordinary tool turn — assert the normal tool-message shape.
            const invoiceToolMsg = findToolMsg(
              added,
              "payment-invoice-list",
              cfg,
            );
            expect(
              invoiceToolMsg,
              "[T11e] payment-invoice-list tool message not found",
            ).toBeDefined();
            if (invoiceToolMsg) {
              assertToolMessageComplete(
                invoiceToolMsg,
                "payment-invoice-list",
                "T11e",
                cfg,
              );
            }
            const invoiceRes = resolveToolResult(invoiceToolMsg);
            expect(invoiceRes).not.toBeNull();
            expect(
              Array.isArray(invoiceRes!["invoices"]),
              "[T11e] payment-invoice-list result must have an invoices array",
            ).toBe(true);
            lastMainAiMsgId = result.data.lastAiMessageId ?? lastMainAiMsgId;

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
            await assertDeductedLocal(testUser, before, after, 0, 150);
            return;
          }

          // The native image must have streamed out as a file part.
          expect(result.data.lastGeneratedMediaUrl).toBeTruthy();

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
          const t11fToolMsgs = t11fAdded.filter((m) =>
            isToolMsgFor(m, "generate_image"),
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

      // (T11g's native image-to-image on the Flash model is now sub-turn (2) of
      //  T11 — the native file-part path is exercised once, both text→image and
      //  native-i2i entry points still covered.)

      // ── T12: Error handling - invalid parent ─────────────────────────
      fit(
        "T12: invalid explicitParentMessageId - handled gracefully, no orphans",
        async () => {
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
              await import("@/credits/db");
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
            // from earlier media cases (image-vision describe on a different
            // image model) settles minutes later and can land inside this
            // window — it is a different model, never the C1 turn's own cost.
            // The chat model is whatever the budget favorite RESOLVES to (never
            // a hardcoded literal), matching what the C1 turn actually billed.
            const c1ChatModel = budgetChatModelId;
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
          const C2_POLL_MS = 100;
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
      let favoriteId: string; // budget variant (skill default model)
      let secondVariantFavoriteId: string; // native-image variant (second real variant)

      beforeAll(async () => {
        // Resolve test favorites via endpoints (reuse existing, create if absent).
        const [favsDef, favoriteCreateDef] = await Promise.all([
          import("next-vibe/agent/skills/favorites/definition").then(
            (m) => m.default.GET,
          ),
          import("next-vibe/agent/skills/favorites/create/definition").then(
            (m) => m.default.POST,
          ),
        ]);
        const favsResult = await sendTestRequest({
          streamContext: rootlessStreamContext(),
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
            streamContext: rootlessStreamContext(),
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

        const existingNative = favsList.find(
          (f) => String(f["skillId"] ?? "") === "quality-tester__native-image",
        );
        if (existingNative?.["id"]) {
          secondVariantFavoriteId = String(existingNative["id"]);
        } else {
          const r = await sendTestRequest({
            streamContext: rootlessStreamContext(),
            endpoint: favoriteCreateDef,
            data: { skillId: "quality-tester__native-image" },
            user: testUser,
          });
          expect(
            r.success,
            "F-setup: create quality-tester__native-image failed",
          ).toBe(true);
          secondVariantFavoriteId = r.success
            ? String(r.data?.["id"] ?? "")
            : "";
        }
      }, effectiveTestTimeout);

      it(
        "F1: favorite resolution - manual, model switch, media models, filters all work",
        async () => {
          const favByIdDef = (
            await import("next-vibe/agent/skills/favorites/[id]/definition")
          ).default;
          const { getBestChatModelForFavorite } =
            await import("next-vibe/agent/skills/favorites/[id]/definition");
          const { getInstanceAvailability } =
            await import("next-vibe/agent/env-availability");
          const { SkillsRepository } =
            await import("next-vibe/agent/skills/repository");
          const { parseSkillId } =
            await import("next-vibe/agent/chat/slugify");
          const logger = createEndpointLogger(false, defaultLocale);

          // Resolve a favorite's model exactly like the web client: GET the
          // favorite config via endpoint, then run the client resolver with the
          // skill variant's modelSelection as the cascade fallback.
          const resolveModelAndSkill = async (
            favId: string,
          ): Promise<{ model: string | undefined; skill: string }> => {
            const getRes = await sendTestRequest({
              streamContext: rootlessStreamContext(),
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
              streamContext: rootlessStreamContext(),
              endpoint: favByIdDef.PATCH,
              data: { modelSelection },
              urlPathParams: { id: favId },
              user: testUser,
            });
            expect(r.success, `F1: PATCH favorite ${favId} must succeed`).toBe(
              true,
            );
          };

          // Source of truth for expected models = the SKILL VARIANTS themselves,
          // never a hardcoded model literal. Read the two variants' declared
          // model selections and assert resolution matches whatever they declare.
          const { qualityTesterSkill } =
            await import("next-vibe/agent/skills/default-skills/quality-tester/skill");
          const budgetVariant = qualityTesterSkill.variants.find(
            (v) => v.id === "budget",
          );
          const nativeImageVariant = qualityTesterSkill.variants.find(
            (v) => v.id === "native-image",
          );
          expect(
            budgetVariant?.modelSelection &&
              "manualModelId" in budgetVariant.modelSelection,
            "F1: budget variant must declare a manual model",
          ).toBeTruthy();
          expect(
            nativeImageVariant?.modelSelection &&
              "manualModelId" in nativeImageVariant.modelSelection,
            "F1: native-image variant must declare a manual model",
          ).toBeTruthy();
          const budgetVariantModel = (
            budgetVariant!.modelSelection as { manualModelId: ChatModelId }
          ).manualModelId;
          const nativeImageVariantModel = (
            nativeImageVariant!.modelSelection as { manualModelId: ChatModelId }
          ).manualModelId;

          // ── Part A: Initial resolution → budget variant's declared model ──
          // The favorite carries no own modelSelection, so the cascade falls to
          // the skill's default (budget) variant's declared model.
          const resolved = await resolveModelAndSkill(favoriteId);
          expect(resolved.model).toBe(budgetVariantModel);
          expect(resolved.skill).toBe(QUALITY_TESTER_SKILL_ID);

          // ── Part B: override to the OTHER variant's model → respected ──
          // A favorite-level manual selection must win over the variant default.
          // The override target is the native-image variant's declared model —
          // still a real skill-owned model, never an arbitrary literal.
          await patchModel(favoriteId, {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: nativeImageVariantModel,
          });
          const resolvedOverride = await resolveModelAndSkill(favoriteId);
          expect(resolvedOverride.model).toBe(nativeImageVariantModel);
          expect(resolvedOverride.skill).toBe(QUALITY_TESTER_SKILL_ID);

          // Restore the pristine state: no favorite-level selection, cascade
          // falls back to the skill variant (keeps Part A valid on reruns —
          // the favorite is reused across suite runs).
          await patchModel(favoriteId, null);

          // ── Part C: Media model selections persisted (via favorites GET) ──
          const favGetResult = await sendTestRequest({
            streamContext: rootlessStreamContext(),
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

          // ── Part E: second variant (native-image) → resolves a model + skill ──
          const resolvedSecond = await resolveModelAndSkill(
            secondVariantFavoriteId,
          );
          expect(resolvedSecond.model).toBeTruthy();
          expect(resolvedSecond.skill).toBe(QUALITY_TESTER_SKILL_ID);
        },
        effectiveTestTimeout,
      );
    });
  });
}
