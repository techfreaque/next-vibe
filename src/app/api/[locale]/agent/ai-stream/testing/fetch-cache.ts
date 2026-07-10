/**
 * HTTP Fetch Cache - SSE-aware, named-file design
 *
 * Record/replay for external HTTP calls, keyed by an EXPLICIT fixture context
 * and matched by REQUEST CONTENT — zero global or process state. Every call
 * site that talks to an external service (AI providers, media generation, TTS/
 * STT, embeddings) receives the context down the execution chain
 * (ToolExecutionContext.streamContext) and binds it once via
 * `createFixtureFetch(context)`.
 *
 * Caches every call as two files:
 *   src/generated/ai-fixtures/http-cache/{cachePrefix}/{N}-{instance}-{model}-req.json
 *   src/generated/ai-fixtures/http-cache/{cachePrefix}/{N}-{instance}-{model}-res.json
 * where {N} is a zero-padded ORDINAL from the run's single counter (stored on
 * the fixtures table, atomically bumped per call). Match is ORDER-driven, not
 * content-hashed: the Nth external call replays file N. One folder per test
 * file; {instance} (atlas/hermes) disambiguates cross-instance calls.
 *
 * EXCEPTION — embeddings are CONTENT-ADDRESSED (`emb-{sha256(body)}-res.json`)
 * and do NOT consume the shared ordinal: they fire both on-path and
 * fire-and-forget, so their count/order varies per run. Ordinal-keying made
 * them miss → go live → burn the idle watchdog AND drift the counter for the
 * AI calls. Hashing the body makes the same text always hit, order-independent.
 *
 * DETERMINISTIC PARALLEL FAN-OUT — gap-fill fires several modality-bridge model
 * calls concurrently (Promise.all, kept for prod/dev throughput). Promise.all
 * preserves RESULT order but not fetch-FIRING order, so racing bumps would
 * assign ordinals non-deterministically. The gap-fill layer therefore RESERVES
 * each bridge call's ordinal synchronously in a stable order BEFORE the
 * fan-out (reserveFixtureOrdinals) and pins it on streamContext.fixtureOrdinal
 * so the racing fetches replay the same file every run.
 *
 * Response file formats:
 *   SSE streams  → { type: "sse",    events: ["data: {...}", "data: [DONE]"], ... }
 *   JSON/binary  → { type: "json",   body: <parsed object>, ... }
 *   Other text   → { type: "text",   body: "...", ... }
 *
 * On cache hit, the stored data is replayed as a ReadableStream so the AI SDK
 * receives exactly the same wire bytes as on the live run, plus the
 * x-vibe-fixture-replay marker header.
 *
 * Only external URLs are intercepted (http/https with non-localhost host).
 * Internal calls (DB, WS, localhost) pass through unmodified.
 *
 * SSE streams are captured via TransformStream: live bytes flow to caller
 * immediately; cache file is written in flush() once the stream closes.
 *
 * Cache bust: delete src/generated/ai-fixtures/http-cache/{testCase}/
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { WidgetData } from "next-vibe/core/utils/json";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";

import { createEndpointLogger } from "../../../system/logger/server";
import type { EndpointLogger } from "../../../system/logger/types";

export const HTTP_CACHE_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "..",
  "..",
  "..",
  "generated",
  "ai-fixtures",
  "http-cache",
);

/**
 * The ONE fixture switch.
 *
 * `true`  → REPLAY-ONLY: a cache miss on an ORDINAL (conversational) call
 *           throws instead of going live. This proves every conversational AI
 *           call site routes through the engine — a missed path would go live
 *           and this catches it. CONTENT-ADDRESSED calls (embeddings + modality
 *           bridges) are exempt: keyed by input hash, a miss just means a new
 *           input, so they re-record silently.
 * `false` → RECORD: a miss falls through to a live fetch and records the file.
 *
 * Flip to `false` for a recording pass, back to `true` to enforce replay.
 */
export const FIXTURE_STRICT = true;

// ── Context ────────────────────────────────────────────────────────────────────

/**
 * The ONE value that flows the execution chain (ToolExecutionContext.
 * streamContext, the tool-execute-request wire payload, revival records).
 * There is no process or global replay state anywhere: fixture matching is
 * ordinal-addressed (see bumpFixtureCounter): the run's single counter, stored
 * in the fixtures table, orders the recordings.
 */

/**
 * Marker header on replayed responses. Poll loops read it (see
 * agent/shared/poll-delay.ts) to collapse their sleeps — a replayed 49-poll
 * recording must not sleep real wall-clock time.
 */
export const FIXTURE_REPLAY_HEADER = "x-vibe-fixture-replay";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ReqFile {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: WidgetData;
}

type ResFile =
  | {
      type: "sse";
      url: string;
      status: number;
      headers: Record<string, string>;
      events: string[];
    }
  | {
      type: "json";
      url: string;
      status: number;
      headers: Record<string, string>;
      body: WidgetData;
    }
  | {
      type: "text";
      url: string;
      status: number;
      headers: Record<string, string>;
      body: string;
    }
  | {
      type: "binary";
      url: string;
      status: number;
      headers: Record<string, string>;
      body: string; // base64-encoded
    };

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Normalize an embedding request body so the SAME semantic content hashes
 * identically across runs. The embedded text carries auto-added per-message
 * context metadata whose tokens vary every run:
 *   - `ID:<8-hex shortId>` — a fresh random id per message.
 *   - `Posted:<Mon D, HH:MM>` — a wall-clock timestamp.
 * Both are replaced with a fixed placeholder before hashing (content-addressing
 * only; the real request body sent to the provider is untouched).
 */
export function normalizeEmbeddingBodyForHash(bodyStr: string): string {
  return (
    bodyStr
      .replace(/ID:[0-9a-f]{6,}/g, "ID:X")
      .replace(/Posted:[^|\]\\"]+/g, "Posted:X")
      // Per-run UUIDs (thread/message/file ids embedded in cortex document paths
      // and titles, e.g. `.../tool-catalog-deep-dive-<uuid>.md`) vary every run.
      .replace(
        /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
        "UUID",
      )
      // ISO-8601 timestamps embedded in synced content / tool results (e.g. a
      // memory's `updatedAt`, a rendered cortex node's captured time) are fresh
      // every run. The cortex system-prompt embeds this text, so an unstripped
      // timestamp drifted the hash → strict cache miss every run. Match with or
      // without milliseconds and trailing Z/offset.
      .replace(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?/g,
        "TIMESTAMP",
      )
  );
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Derive a human-readable name from the request.
 * Priority: body "model" field → last meaningful URL path segments.
 */
function deriveModelName(url: string, bodyStr: string): string {
  if (bodyStr) {
    try {
      const parsed = JSON.parse(bodyStr) as { model?: string };
      if (typeof parsed.model === "string" && parsed.model) {
        return slugify(parsed.model);
      }
    } catch {
      // not JSON
    }
  }
  try {
    const u = new URL(url);
    const noise = new Set([
      "v1",
      "v2",
      "v3",
      "v4",
      "v5",
      "v6",
      "api",
      "chat",
      "completions",
    ]);
    const parts = u.pathname.split("/").filter((p) => p && !noise.has(p));
    const slug = parts.slice(-2).join("-");
    if (slug) {
      return slugify(`${u.hostname.split(".")[0]}-${slug}`);
    }
    return slugify(u.hostname.split(".")[0] ?? "request");
  } catch {
    return "request";
  }
}

/** Returns true for external URLs we should intercept. Localhost is NEVER
 *  intercepted — it's the DB, WS proxy, and cross-instance dev servers, all of
 *  which must talk live. Only external (real provider) hosts are recorded. */
function isExternal(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return false;
    }
    const h = u.hostname;
    return (
      h !== "localhost" &&
      h !== "127.0.0.1" &&
      h !== "::1" &&
      !h.endsWith(".local")
    );
  } catch {
    return false;
  }
}

export function cacheDir(testCase: string): string {
  return join(HTTP_CACHE_DIR, testCase);
}

/**
 * File stem = `<ordinal>-<instance>-<model>`. The ordinal (zero-padded so files
 * sort in call order) is the authoritative match key; instance (atlas/hermes)
 * disambiguates which dev server made the call in cross-instance runs; model is
 * human-readable context.
 */
export function fileStem(
  instance: string,
  modelName: string,
  ordinal: number,
): string {
  const n = String(ordinal).padStart(4, "0");
  return `${n}-${instance}-${modelName}`;
}

/** Resolve THIS instance's short name (atlas / hermes) for the fixture stem. */
export async function resolveInstanceName(): Promise<string> {
  try {
    const { RemoteConnectionRepository } =
      await import("@/app/api/[locale]/remote-connection/repository");
    return slugify(RemoteConnectionRepository.deriveDefaultSelfInstanceId());
  } catch {
    return "atlas";
  }
}

/**
 * Atomically read the run's fixture folder AND bump its ordinal in ONE round
 * trip, keyed by threadId. Returns null when there's no fixtures row (not a
 * fixture run — go live). Race-free (tests are sequential), decoupled from the
 * thread row.
 */
/**
 * Resolve the fixture-scope threadId for a stream by walking its thread
 * lineage: if `threadId` has a fixtures row it IS the scope; otherwise follow
 * the parent chain up until a thread WITH a fixtures row is found. The first
 * hop can come from IN-CONTEXT `parentThreadId` (an INCOGNITO sub-stream has no
 * DB row to read a parent from); deeper hops read `chatThreads.parent_thread_id`.
 * A sub-stream/sub-agent (image-gen LLM path, ai-run child) thus records into —
 * and shares the single counter of — its spawning run's root thread, so the
 * one-counter-per-folder invariant holds without reusing the parent's threadId
 * for stream identity. Returns null when no ancestor is a fixture run (prod).
 * Bounded depth guards against a cycle. Called ONCE per bound fetch.
 */
async function resolveFixtureRootThreadId(
  threadId: string,
  contextParentThreadId: string | undefined,
): Promise<string | null> {
  const { db } = await import("next-vibe/database");
  const { fixtures } = await import("./fixtures.db");
  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
  const { eq } = await import("drizzle-orm");
  let current: string | null = threadId;
  const seen = new Set<string>();
  for (let depth = 0; current && depth < 16; depth++) {
    if (seen.has(current)) {
      return null;
    }
    seen.add(current);
    const [fx] = await db
      .select({ threadId: fixtures.threadId })
      .from(fixtures)
      .where(eq(fixtures.threadId, current))
      .limit(1);
    if (fx) {
      return current;
    }
    // First hop: prefer the in-context parent (incognito sub-stream has no row).
    if (depth === 0 && contextParentThreadId) {
      current = contextParentThreadId;
      continue;
    }
    const [thread] = await db
      .select({ parentThreadId: chatThreads.parentThreadId })
      .from(chatThreads)
      .where(eq(chatThreads.id, current))
      .limit(1);
    current = thread?.parentThreadId ?? null;
  }
  return null;
}

export async function readAndBumpFixture(
  threadId: string,
): Promise<{ prefix: string; ordinal: number } | null> {
  const { db } = await import("next-vibe/database");
  const { fixtures } = await import("./fixtures.db");
  const { eq, sql } = await import("drizzle-orm");
  const [row] = await db
    .update(fixtures)
    .set({ counter: sql`${fixtures.counter} + 1` })
    .where(eq(fixtures.threadId, threadId))
    .returning({ prefix: fixtures.prefix, ordinal: fixtures.counter });
  if (!row?.prefix) {
    return null;
  }
  return { prefix: row.prefix, ordinal: row.ordinal };
}

/**
 * Reserve `count` fixture ordinals up-front, in order, for a DETERMINISTIC
 * PARALLEL FAN-OUT (gap-fill). The caller bumps the shared counter `count`
 * times SEQUENTIALLY here — before firing its concurrent bridge fetches — then
 * pins one reserved ordinal per fetch via streamContext.fixtureOrdinal. This
 * moves the ordinal ASSIGNMENT out of the racing fetches (which would otherwise
 * bump in nondeterministic resolution order) while the model calls themselves
 * still run in parallel.
 *
 * Returns [] when this is not a fixture run (no fixtures row) — prod/dev live
 * runs then take the normal live-fetch path, unaffected.
 */
export async function reserveFixtureOrdinals(
  threadId: string,
  count: number,
): Promise<number[]> {
  const ordinals: number[] = [];
  for (let i = 0; i < count; i++) {
    const fx = await readAndBumpFixture(threadId);
    if (!fx) {
      // No fixtures row → not a fixture run. Nothing reserved; caller fires live.
      return [];
    }
    ordinals.push(fx.ordinal);
  }
  return ordinals;
}

/**
 * Non-bumping read of a run's fixture prefix by threadId (the claude-code store
 * bumps via readAndBumpFixture; this is for callers that only need the folder).
 * Returns null when there's no fixtures row (not a fixture run).
 */
export async function readFixturePrefix(
  threadId: string,
): Promise<string | null> {
  const { db } = await import("next-vibe/database");
  const { fixtures } = await import("./fixtures.db");
  const { eq } = await import("drizzle-orm");
  const [row] = await db
    .select({ prefix: fixtures.prefix })
    .from(fixtures)
    .where(eq(fixtures.threadId, threadId))
    .limit(1);
  return row?.prefix ?? null;
}

function headersToRecord(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((v, k) => {
    out[k] = k === "authorization" || k === "x-api-key" ? "[redacted]" : v;
  });
  return out;
}

function sanitiseRequestHeaders(
  headers: RequestInit["headers"],
): Record<string, string> {
  if (!headers) {
    return {};
  }
  const entries =
    headers instanceof Headers
      ? [...headers.entries()]
      : Object.entries(headers as Record<string, string>);
  const out: Record<string, string> = {};
  for (const [k, v] of entries) {
    const lk = k.toLowerCase();
    out[k] =
      lk === "authorization" || lk === "x-api-key"
        ? "[redacted]"
        : (v as string);
  }
  return out;
}

/** Parse request body for human-readable storage */
function parseBodyForStorage(bodyStr: string): WidgetData {
  if (!bodyStr) {
    return "";
  }
  try {
    return JSON.parse(bodyStr) as WidgetData;
  } catch {
    return bodyStr;
  }
}

/** Parse SSE bytes into individual event lines (the "data: ..." lines) */
function parseSseEvents(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0);
}

/** Wrap raw bytes as a ReadableStream so the AI SDK SSE parser gets a proper stream */
function bytesToStream(bytes: Uint8Array): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });
}

/**
 * Wrap SSE events as a pull-based ReadableStream, yielding one event per pull.
 * Each pull requires an async tick, which prevents the AI SDK from consuming
 * the entire fixture burst synchronously before the for-await loop in
 * stream-execution-handler processes pending tool results.
 * Without this, in cached-fixture mode all SSE steps (F2, F3, F4 …) fire in
 * one synchronous chain and waitingForRemoteResult can be set by F4 before
 * tool-help:1's tool-result event is processed.
 */
function sseEventsToTickingStream(
  events: string[],
): ReadableStream<Uint8Array> {
  let index = 0;
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    pull(controller): Promise<void> {
      return new Promise<void>((resolve) => {
        // Yield to the macrotask queue between events so the consumer's
        // for-await loop gets a chance to run between SSE chunks.
        setTimeout(() => {
          if (index >= events.length) {
            controller.close();
          } else {
            // Emit one SSE event (with its trailing newlines, matching wire format)
            const line = events[index++];
            // Each event is followed by \n (and events are separated by \n)
            controller.enqueue(encoder.encode(`${line}\n\n`));
            // Close immediately after the last event so the AI SDK doesn't need
            // to call pull() one more time (it may stop pulling after data: [DONE])
            if (index >= events.length) {
              controller.close();
            }
          }
          resolve();
        }, 0);
      });
    },
  });
}

// ── Cache hit replay ───────────────────────────────────────────────────────────

function replayFromCache(cached: ResFile): Response {
  const patched = cached;
  // Replayed responses carry the marker header so consumers (poll loops) can
  // tell replay from live in-band — no global flag.
  const replayHeaders = {
    ...patched.headers,
    [FIXTURE_REPLAY_HEADER]: "true",
  };
  // SSE responses use a pull-based ticking stream to simulate async delivery.
  // This prevents the fixture-replay burst from letting a later LLM step (F3/F4)
  // set waitingForRemoteResult before the for-await loop processes earlier
  // tool-result events (e.g. tool-help:1).
  if (patched.type === "sse") {
    return new Response(sseEventsToTickingStream(patched.events), {
      status: patched.status,
      headers: replayHeaders,
    });
  }
  let bytes: Uint8Array;
  if (patched.type === "json") {
    bytes = new TextEncoder().encode(JSON.stringify(patched.body));
  } else if (patched.type === "binary") {
    bytes = Uint8Array.from(Buffer.from(patched.body, "base64"));
  } else {
    bytes = new TextEncoder().encode(patched.body);
  }
  return new Response(bytesToStream(bytes), {
    status: patched.status,
    headers: replayHeaders,
  });
}

// ── Cache miss write ───────────────────────────────────────────────────────────

/** Content types that must be stored as base64 to avoid binary corruption */
function isBinaryContentType(contentType: string): boolean {
  return (
    contentType.startsWith("audio/") ||
    contentType.startsWith("video/") ||
    contentType.startsWith("image/") ||
    contentType.includes("octet-stream")
  );
}

function buildResFile(
  url: string,
  status: number,
  headers: Record<string, string>,
  bytes: Uint8Array,
): ResFile {
  const contentType = headers["content-type"] ?? "";
  if (contentType.includes("event-stream")) {
    const text = new TextDecoder().decode(bytes);
    return { type: "sse", url, status, headers, events: parseSseEvents(text) };
  }
  // Binary content (audio, video, images) must be stored as base64
  // to avoid corruption from TextDecoder replacing invalid UTF-8 with U+FFFD
  if (isBinaryContentType(contentType)) {
    return {
      type: "binary",
      url,
      status,
      headers,
      body: Buffer.from(bytes).toString("base64"),
    };
  }
  const text = new TextDecoder().decode(bytes);
  try {
    return {
      type: "json",
      url,
      status,
      headers,
      body: JSON.parse(text) as WidgetData,
    };
  } catch {
    return { type: "text", url, status, headers, body: text };
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

/**
 * True for calls the record/replay engine must NEVER intercept — relay
 * control-plane calls are side-effectful and must always reach the live server:
 *   ai-stream/stream (with tools+instanceId) — starts a remote AI loop, returns a fresh responseThreadId
 *   ws/broadcast                              — delivers tool results to the remote AI loop
 *   system/execute-tool                       — the EVENT-protocol transport: every
 *                                               tool-execute-request/result rides a
 *                                               bridge POST to the peer's execute-tool
 *                                               endpoint; replaying one from fixtures
 *                                               means the relay never reaches the peer.
 * Caching any would break the relay: stale responseThreadId → dead WS channel;
 * cached broadcast/bridge POST → dispatch or result never delivered → remote hang.
 */
function isPassthroughUrl(url: string): boolean {
  return (
    !isExternal(url) ||
    url.includes("/agent/ai-stream/stream") ||
    url.includes("/ws/broadcast") ||
    url.includes("/system/execute-tool")
  );
}

/**
 * Record/replay fetch bound to ONE threadId. The fixture prefix + ordinal are
 * read from the fixtures table (DB, one round-trip) — there is NO
 * FixtureContext object on the chain. The Nth external call of the whole run
 * maps to file `<N>-<instance>-<model>`; order-driven, no content hashing. If
 * the thread has no fixture prefix, this is not a fixture run → live fetch.
 */
async function engineFetch(
  streamThreadId: string,
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  logger: EndpointLogger,
  /**
   * Pre-reserved ordinal for a deterministic parallel-fan-out call (gap-fill
   * bridge). When set, the fetch uses it verbatim instead of bumping the shared
   * counter — see the addressing block. Undefined for normal ordinal calls.
   */
  pinnedOrdinal: number | undefined,
  /** In-context spawning thread for a sub-stream (lineage walk first hop). */
  contextParentThreadId: string | undefined,
): Promise<Response> {
  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- the record/replay engine's live leg
  const originalFetch = fetch;
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  if (isPassthroughUrl(url)) {
    return originalFetch(input, init);
  }

  // Resolve the fixture SCOPE once: the stream's own thread if it's a fixture
  // run, else walk lineage (context parent → chatThreads.parent_thread_id) to
  // the spawning run's root thread. A sub-stream (image-gen LLM path, ai-run
  // child) thus records into + shares the counter of its run's root folder. No
  // ancestor is a fixture run → not a fixture run → live fetch.
  const threadId =
    (await resolveFixtureRootThreadId(streamThreadId, contextParentThreadId)) ??
    streamThreadId;

  let bodyStr = "";
  if (init?.body) {
    bodyStr =
      typeof init.body === "string"
        ? init.body
        : init.body instanceof URLSearchParams
          ? init.body.toString()
          : JSON.stringify(init.body);
  }

  // ── Ordinal vs content-addressing ──────────────────────────────────────────
  // ORDINAL (default): conversational chat/agent turns — AND compacting and
  // media-gen (submit + poll), which are ordinary external calls the stream makes
  // in sequence. Their body depends on the PRIOR turn's response, so identity =
  // position in the call sequence (the shared per-thread counter orders them).
  //
  // CONTENT-ADDRESSED (hash of body, OFF the shared ordinal): calls whose body
  // is a PURE FUNCTION of their own input, fired fire-and-forget with a
  // run-to-run-varying count/interleaving. Keeping them off the ordinal means
  // they can't desync the conversational chain. Detected from the request
  // alone (no markers): Embeddings (URL).
  const isEmbeddingCall = /\/embeddings\b/.test(url);
  const isContentAddressed = isEmbeddingCall;

  // Resolve the run's fixture folder + stem:
  //   - Content-addressed (embeddings): body hash, no ordinal bump.
  //   - PINNED ordinal: a parallel-fan-out call (gap-fill bridge) whose ordinal
  //     was reserved synchronously by the caller BEFORE the concurrent fetches
  //     fired. Use it verbatim (no bump) so racing fetches never compete for
  //     the counter and each replays the same file regardless of which promise
  //     settles first -- keeps gap-fill parallel in prod/dev yet deterministic
  //     under fixtures (the T10e banana-vs-music desync).
  //   - Otherwise: the shared ordinal (read + bump).
  let prefix: string;
  let ordinalStem: string;
  if (isContentAddressed) {
    const p = await readFixturePrefix(threadId);
    if (!p) {
      return originalFetch(input, init);
    }
    prefix = p;
    // Content-address embeddings by a NORMALIZED body: the embedded text carries
    // per-message context metadata that is VOLATILE across runs — the auto-added
    // `[Context: ID:<shortId> | ... | Posted:<timestamp>]` line has a fresh random
    // shortId and a wall-clock timestamp every run. Hashing the raw body made the
    // SAME semantic content miss every time → the call went LIVE and stalled the
    // run on the fetch watchdog. Strip those volatile tokens before hashing so
    // identical content always resolves to the same fixture.
    const bodyHash = createHash("sha256")
      .update(normalizeEmbeddingBodyForHash(bodyStr))
      .digest("hex")
      .slice(0, 16);
    ordinalStem = `emb-${bodyHash}`;
  } else if (pinnedOrdinal !== undefined) {
    const p = await readFixturePrefix(threadId);
    if (!p) {
      return originalFetch(input, init);
    }
    prefix = p;
    const modelName = deriveModelName(url, bodyStr);
    const instanceName = await resolveInstanceName();
    ordinalStem = fileStem(instanceName, modelName, pinnedOrdinal);
  } else {
    const fx = await readAndBumpFixture(threadId);
    if (!fx) {
      return originalFetch(input, init);
    }
    prefix = fx.prefix;
    const modelName = deriveModelName(url, bodyStr);
    const instanceName = await resolveInstanceName();
    ordinalStem = fileStem(instanceName, modelName, fx.ordinal);
  }

  const dir = slugify(prefix);

  {
    const modelName = deriveModelName(url, bodyStr);
    const testCaseDir = cacheDir(dir);
    const stem = ordinalStem;
    const rp = join(testCaseDir, `${stem}-res.json`);

    // ── Cache hit ────────────────────────────────────────────────────────────
    if (existsSync(rp)) {
      logger.debug("[FetchCache] HIT", {
        rp: rp.split("/").slice(-3).join("/"),
        model: modelName,
        stem,
      });
      const cached = JSON.parse(readFileSync(rp, "utf-8")) as ResFile;
      // SSE responses use sseEventsToTickingStream (pull-based, one event per
      // macrotask tick) - see replayFromCache. Non-SSE responses still need one
      // yield so the caller's await-fetch itself is truly async.
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
      return replayFromCache(cached);
    }
    logger.debug("[FetchCache] MISS", {
      rp: rp.split("/").slice(-3).join("/"),
      model: modelName,
      stem,
    });

    // ── Cache miss ────────────────────────────────────────────────────────────
    // REPLAY-ONLY (FIXTURE_STRICT): a miss on ANY external call — AI model,
    // media-gen bridge (pinned-ordinal) OR embedding (content-addressed) —
    // throws. There are NO exemptions: an unrecorded or drifted call site MUST
    // fail loudly instead of silently going live and burning wall-clock. This
    // holds on BOTH instances (atlas + hermes) since each runs this same engine.
    // Recording passes (FIXTURE_STRICT=false) fall through and record every miss.
    if (FIXTURE_STRICT) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw to fail test on uncached fetch
      throw new Error(
        // eslint-disable-next-line i18next/no-literal-string
        `[FetchCache STRICT] cache miss for ${init?.method ?? "GET"} ${url}\n  context: ${dir}\n  expected: ${stem}-res.json`,
      );
    }

    // Live-fetch watchdog: an IDLE budget until the FIRST body chunk (provider
    // connections occasionally open then stall without sending a token; without
    // the idle abort such a recording burns the whole test timeout as a silent
    // hang) and 30s between subsequent chunks. A stall aborts ONCE — no retry
    // (a retry just stacks another idle budget and blows the settle timeout).
    const watchdog = makeLiveFetchWatchdog();
    let real: Response;
    let firstChunk: Uint8Array | undefined;
    let bodyReader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    let isStreamResponse = false;
    let bufferedBody: Uint8Array | undefined;
    try {
      real = await originalFetch(input, { ...init, signal: watchdog.signal });
      isStreamResponse = (real.headers.get("content-type") ?? "").includes(
        "event-stream",
      );
      if (isStreamResponse && real.body) {
        // Read the first chunk under the watchdog: a connection that opens and
        // never sends is indistinguishable from a slow model otherwise.
        bodyReader = real.body.getReader();
        watchdog.touchIdle(45_000);
        const first = await bodyReader.read();
        firstChunk = first.done ? undefined : first.value;
      } else {
        // Non-streaming (JSON/binary): buffer under the watchdog.
        bufferedBody = new Uint8Array(await real.arrayBuffer());
        watchdog.clear();
      }
    } catch (liveErr) {
      watchdog.clear();
      // oxlint-disable-next-line restricted-syntax -- rethrow: fetch contract is throw-on-network-error
      throw liveErr;
    }
    watchdog.touchIdle(30_000);
    const responseHeaders = headersToRecord(real.headers);

    mkdirSync(testCaseDir, { recursive: true });

    // Write req file (full body, human-readable)
    const reqEntry: ReqFile = {
      url,
      method: init?.method ?? "GET",
      headers: sanitiseRequestHeaders(init?.headers),
      body: parseBodyForStorage(bodyStr),
    };
    writeFileSync(
      join(testCaseDir, `${stem}-req.json`),
      JSON.stringify(reqEntry, null, 2),
      "utf-8",
    );

    // Only treat true SSE responses as streaming. chunked transfer-encoding
    // with non-SSE content types (e.g. application/json from embedding APIs)
    // should be buffered directly.
    if (isStreamResponse && bodyReader) {
      // TransformStream: pass chunks through to caller AND collect them.
      // Cache is written in flush() - after the caller has fully consumed the
      // stream - so the file is always complete before the test ends.
      // Also written in cancel() so endLoop (which aborts early) still persists.
      const chunks: Uint8Array[] = [];
      let written = false;
      const writeCache = (): void => {
        if (written) {
          return;
        }
        written = true;
        const total = chunks.reduce((n, c) => n + c.length, 0);
        const merged = new Uint8Array(total);
        let offset = 0;
        for (const c of chunks) {
          merged.set(c, offset);
          offset += c.length;
        }
        const resEntry = buildResFile(
          url,
          real.status,
          responseHeaders,
          merged,
        );
        writeFileSync(rp, JSON.stringify(resEntry, null, 2), "utf-8");
      };
      // Pump the reader (first chunk already read) through to the caller,
      // recording every chunk. The watchdog aborts the underlying fetch on a
      // mid-stream stall, which errors this stream and unblocks the consumer.
      const reader = bodyReader;
      const initialChunk = firstChunk;
      const wd = watchdog;
      const outStream = new ReadableStream<Uint8Array>({
        async start(controller): Promise<void> {
          try {
            if (initialChunk) {
              chunks.push(initialChunk);
              controller.enqueue(initialChunk);
            }
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }
              wd.touchIdle(30_000);
              chunks.push(value);
              controller.enqueue(value);
            }
            wd.clear();
            writeCache();
            controller.close();
          } catch (pumpErr) {
            wd.clear();
            controller.error(pumpErr);
          }
        },
        cancel(reason): void {
          wd.clear();
          void reader.cancel(reason);
        },
      });

      return new Response(outStream, {
        status: real.status,
        headers: responseHeaders,
      });
    }

    // Non-streaming: body already buffered inside the retry loop.
    watchdog.clear();
    const bytes = bufferedBody ?? new Uint8Array(0);
    const resEntry = buildResFile(url, real.status, responseHeaders, bytes);
    writeFileSync(rp, JSON.stringify(resEntry, null, 2), "utf-8");

    return new Response(bytesToStream(bytes), {
      status: real.status,
      headers: responseHeaders,
    });
  }
}

/**
 * Watchdog for LIVE recording fetches: 5-min total budget + idle budget
 * (45s to first body chunk, 30s between chunks — callers touchIdle()).
 * See the cache-miss branch for the stall/retry rationale.
 */
function makeLiveFetchWatchdog(): {
  signal: AbortSignal;
  touchIdle: (ms: number) => void;
  clear: () => void;
} {
  const ctl = new AbortController();
  const totalTimer = setTimeout(() => {
    ctl.abort(new Error("fixture live-fetch total timeout (300s)"));
  }, 300_000);
  let idleTimer = setTimeout(() => {
    ctl.abort(new Error("fixture live-fetch idle timeout"));
  }, 45_000);
  return {
    signal: ctl.signal,
    touchIdle: (ms: number): void => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        ctl.abort(new Error("fixture live-fetch idle timeout"));
      }, ms);
    },
    clear: (): void => {
      clearTimeout(totalTimer);
      clearTimeout(idleTimer);
    },
  };
}

/**
 * True only in dev/test — prod never touches the fixture engine (no DB lookup,
 * no interception). The switch is the environment, not an ambient flag.
 */
function fixturesEnabled(): boolean {
  const env = process.env.NODE_ENV;
  return env === "development" || env === "test";
}

/**
 * Bind a fixture-aware fetch to a stream context — THE entry into the engine.
 * Every AI/media/embedding/TTS/STT call site already has the ToolExecutionContext
 * (or one) and passes it here; the engine uses `streamContext` as the
 * fixture scope, reading the thread's prefix + bumping its ordinal from the DB
 * per fetch. In prod (or with no context/threadId) this is the plain live
 * fetch — zero overhead.
 */
export function createFixtureFetch(
  streamContext: ToolExecutionContext | undefined,
  logger: EndpointLogger = createEndpointLogger(false, defaultLocale),
): typeof globalThis.fetch {
  const threadId = streamContext?.threadId;
  if (!threadId || !fixturesEnabled()) {
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- live fetch outside dev/test or with no thread scope
    return fetch;
  }
  // A parallel-fan-out caller (gap-fill) binds a per-call context carrying a
  // pre-reserved ordinal; the racing fetch uses it verbatim (no counter race).
  const pinnedOrdinal = streamContext?.fixtureOrdinal;
  // Sub-stream lineage: the engine walks this → parent → root to find the run's
  // fixture folder (incognito sub-streams have no DB row, so the first hop is
  // in-context).
  const contextParentThreadId = streamContext?.parentThreadId;
  // Bun's fetch type carries a `preconnect` member — satisfy it by borrowing
  // the real one (a pure DNS/TLS warm-up; irrelevant to record/replay).
  const bound = Object.assign(
    (input: RequestInfo | URL, init?: RequestInit): Promise<Response> =>
      engineFetch(
        threadId,
        input,
        init,
        logger,
        pinnedOrdinal,
        contextParentThreadId,
      ),
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- borrowing the live fetch's preconnect
    { preconnect: fetch.preconnect.bind(fetch) },
  );
  return bound;
}
