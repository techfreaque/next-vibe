/**
 * HTTP Fetch Cache - SSE-aware, named-file design
 *
 * Record/replay for external HTTP calls, keyed by an EXPLICIT fixture context
 * and matched by REQUEST CONTENT — zero global or process state. Every call
 * site that talks to an external service (AI providers, media generation, TTS/
 * STT, embeddings) receives the context down the execution chain
 * (ToolExecutionContext.fixtureContext) and binds it once via
 * `createFixtureFetch(context)`.
 *
 * Caches every call as two files:
 *   src/generated/ai-fixtures/http-cache/{cachePrefix}/{N}-{instance}-{model}-req.json
 *   src/generated/ai-fixtures/http-cache/{cachePrefix}/{N}-{instance}-{model}-res.json
 * where {N} is a zero-padded ORDINAL from the run's single counter (stored on
 * the counter thread's stream_context, atomically bumped per call). Match is
 * ORDER-driven, not content-hashed: the Nth external call replays file N. One
 * folder per test file; {instance} (atlas/hermes) disambiguates cross-instance
 * calls.
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

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { WidgetData } from "next-vibe/core/utils/json";

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
 * TEMPORARY DEBUG SWITCH: when true, any fixture-cache MISS (a live fetch
 * about to happen inside a fixture context) and any AI/media call WITHOUT a
 * fixture context during a bun test run CRASH loudly instead of silently
 * going live. Flip to false to allow a recording pass.
 */
export const CRASH_ON_FIXTURE_MISS = true;

// ── Context ────────────────────────────────────────────────────────────────────

/**
 * The ONE value that flows the execution chain (ToolExecutionContext.
 * fixtureContext, the tool-execute-request wire payload, revival records).
 * There is no process or global replay state anywhere: fixture matching is
 * ordinal-addressed (see bumpFixtureCounter): the run's single counter, stored
 * on the counter thread's stream_context, orders the recordings.
 */
export interface FixtureContext {
  /** Fixture directory name (= test file cache prefix). One folder per file;
   *  stable across runs so recordings are reused. */
  name: string;
  /**
   * Throw on cache miss instead of fetching live — proves a run is fully
   * fixture-driven with zero network access. Travels the chain like `name`,
   * so a strict test is strict on the receiving instance too.
   */
  strict?: boolean;
  /**
   * Localhost ports treated as external (intercepted) — for remote-mode tests
   * where the "remote" provider is a localhost server.
   */
  interceptLocalhostPorts?: number[];
}

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

function slugify(s: string): string {
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

/** Returns true for external URLs we should intercept */
function isExternal(url: string, interceptPorts?: number[]): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return false;
    }
    const h = u.hostname;
    if (
      h !== "localhost" &&
      h !== "127.0.0.1" &&
      h !== "::1" &&
      !h.endsWith(".local")
    ) {
      return true;
    }
    // Also intercept specific localhost ports opted-in via the context
    // (remote-mode tests where the "remote" provider is a localhost server).
    if (!interceptPorts?.length) {
      return false;
    }
    const port = parseInt(
      u.port || (u.protocol === "https:" ? "443" : "80"),
      10,
    );
    return interceptPorts.includes(port);
  } catch {
    return false;
  }
}

/**
 * Content-addressed fixture key: sha256 of method + url + normalized body
 * (JSON bodies are key-sorted first). The same request maps to the same
 * fixture file in ANY process or instance — replay needs no shared ordering
 * state at all. Only literally-identical repeats (poll loops, SDK retries)
 * are disambiguated, by a per-fetch-instance repeat counter (see
 * createFixtureFetch) that lives and dies with one execution chain.
 */
function requestHash(url: string, method: string, bodyStr: string): string {
  let normBody = bodyStr;
  if (bodyStr) {
    try {
      normBody = JSON.stringify(
        sortJsonKeys(JSON.parse(bodyStr) as WidgetData),
      );
    } catch {
      normBody = bodyStr;
    }
  }
  return createHash("sha256")
    .update(`${method} ${url}\n${normalizeVolatile(normBody)}`)
    .digest("hex")
    .slice(0, 8);
}

/**
 * File stem = `<ordinal>-<instance>-<model>`. The ordinal (zero-padded so files
 * sort in call order) is the authoritative match key; instance (atlas/hermes)
 * disambiguates which dev server made the call in cross-instance runs; model is
 * human-readable context.
 */
function normalizeVolatile(text: string): string {
  return (
    text
      // UUIDs
      .replace(
        /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
        "<uuid>",
      )
      // ISO dates/timestamps (2026-07-07T01:17:05.888Z / 2026-07-07 01:17)
      .replace(
        /\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?/g,
        "<ts>",
      )
      // Prose dates with clock ("Jul 7, 01:17" / "Jul 7, 2026")
      .replace(
        /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}(, \d{4})?(,? \d{2}:\d{2}(:\d{2})?)?/g,
        "<date>",
      )
      // Bare dates without a time part ("Current Date: 2026-07-07") — the ISO
      // rule above only matches datetime. Without this, every midnight
      // invalidates every recording.
      .replace(/\b\d{4}-\d{2}-\d{2}\b/g, "<d>")
      // Bare clock times
      .replace(/\b\d{2}:\d{2}:\d{2}\b/g, "<time>")
      // Provider-generated tool-call ids ("call_af1fadecef28..."). NOT caught
      // by the hex rule below: "_" is a word character, so \b never matches
      // between "call_" and the hex tail.
      .replace(/call_[a-zA-Z0-9]+/g, "<callid>")
      // Long hex ids (message/context/task fragments, >=8 hex chars)
      .replace(/\b[0-9a-f]{8,}\b/gi, "<hex>")
  );
}

/** Recursively sort object keys so hashing is insensitive to key order. */
function sortJsonKeys(value: WidgetData): WidgetData {
  if (Array.isArray(value)) {
    return value.map(sortJsonKeys);
  }
  if (value !== null && typeof value === "object" && !(value instanceof Date)) {
    const out: Record<string, WidgetData> = {};
    for (const key of Object.keys(value).toSorted()) {
      out[key] = sortJsonKeys(value[key]);
    }
    return out;
  }
  return value;
}

function cacheDir(testCase: string): string {
  return join(HTTP_CACHE_DIR, testCase);
}

function fileStem(modelName: string, index: number): string {
  return index === 1 ? modelName : `${modelName}-${index}`;
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
function isPassthroughUrl(url: string, interceptPorts?: number[]): boolean {
  return (
    !isExternal(url, interceptPorts) ||
    url.includes("/agent/ai-stream/stream") ||
    url.includes("/ws/broadcast") ||
    url.includes("/system/execute-tool")
  );
}

/**
 * Record/replay fetch for ONE explicit fixture context and ONE execution
 * chain. The per-call ordinal comes from the run's single counter (atomic
 * read-and-bump on the counter thread's stream_context), so the Nth external
 * call of the whole run maps to file N — order-driven, no content hashing.
 */
async function engineFetch(
  fixtureContext: FixtureContext,
  repeats: Map<string, number>,
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  logger: EndpointLogger,
): Promise<Response> {
  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- the record/replay engine's live leg
  const originalFetch = fetch;
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  if (isPassthroughUrl(url, fixtureContext.interceptLocalhostPorts)) {
    return originalFetch(input, init);
  }

  const dir = slugify(fixtureContext.name);

  {
    let bodyStr = "";
    if (init?.body) {
      bodyStr =
        typeof init.body === "string"
          ? init.body
          : init.body instanceof URLSearchParams
            ? init.body.toString()
            : JSON.stringify(init.body);
    }

    const modelName = deriveModelName(url, bodyStr);
    const hash = requestHash(url, init?.method ?? "GET", bodyStr);
    const testCaseDir = cacheDir(dir);
    const repeatKey = `${modelName}-${hash}`;
    const repeatIndex = (repeats.get(repeatKey) ?? 0) + 1;
    repeats.set(repeatKey, repeatIndex);
    const stem = fileStem(repeatKey, repeatIndex);
    const rp = join(testCaseDir, `${stem}-res.json`);

    // ── Cache hit ────────────────────────────────────────────────────────────
    if (existsSync(rp)) {
      logger.debug("[FetchCache] HIT", {
        rp: rp.split("/").slice(-3).join("/"),
        model: modelName,
        index: repeatIndex,
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
      index: repeatIndex,
    });

    // ── Cache miss ────────────────────────────────────────────────────────────
    if (CRASH_ON_FIXTURE_MISS) {
      // oxlint-disable-next-line restricted-syntax -- temporary debug crash on any uncached fetch
      throw new Error(
        // eslint-disable-next-line i18next/no-literal-string
        `[FetchCache CRASH_ON_FIXTURE_MISS] cache miss for ${init?.method ?? "GET"} ${url}\n  context: ${dir}\n  expected: ${stem}-res.json`,
      );
    }
    if (fixtureContext.strict) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw to fail test on uncached fetch
      throw new Error(
        // eslint-disable-next-line i18next/no-literal-string
        `[FetchCache STRICT] No fixture for external URL: ${url} (context: ${dir}, expected: ${stem}-res.json)`,
      );
    }

    // Live-fetch watchdog + stall retry: 5-minute TOTAL budget (long LLM/
    // compacting streams are legitimate) plus a 45s IDLE budget until the
    // FIRST body chunk and 30s between subsequent chunks — provider
    // connections occasionally open and then stall without ever sending a
    // token; without the idle abort such a recording burns the whole test
    // timeout as a silent hang (observed repeatedly: empty assistant row,
    // thread stuck streaming). Pre-first-chunk stalls are retried once on a
    // fresh connection (nothing was delivered, so a retry is transparent);
    // mid-stream stalls can only abort — the caller already consumed chunks.
    let watchdog = makeLiveFetchWatchdog();
    let real: Response;
    let firstChunk: Uint8Array | undefined;
    let bodyReader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    let isStreamResponse = false;
    let bufferedBody: Uint8Array | undefined;
    for (let attempt = 0; ; attempt++) {
      try {
        real = await originalFetch(input, {
          ...init,
          signal: watchdog.signal,
        });
        isStreamResponse = (real.headers.get("content-type") ?? "").includes(
          "event-stream",
        );
        if (isStreamResponse && real.body) {
          // Read the first chunk under the watchdog: a connection that opens
          // and never sends is indistinguishable from a slow model otherwise.
          bodyReader = real.body.getReader();
          watchdog.touchIdle(45_000);
          const first = await bodyReader.read();
          firstChunk = first.done ? undefined : first.value;
        } else {
          // Non-streaming (JSON/binary): buffer INSIDE the retry loop — a
          // body that stalls after headers is just as retryable as one that
          // never sends headers (nothing reached the caller yet).
          bufferedBody = new Uint8Array(await real.arrayBuffer());
          watchdog.clear();
        }
        break;
      } catch (liveErr) {
        watchdog.clear();
        const msg = liveErr instanceof Error ? liveErr.message : "";
        const isStall =
          /idle timeout/.test(msg) ||
          (liveErr instanceof Error &&
            liveErr.name === "AbortError" &&
            /idle timeout/.test(String(liveErr.cause ?? "")));
        if (attempt === 0 && isStall) {
          logger.warn(
            "[FetchCache] live fetch stalled before first chunk - retrying once",
            { url },
          );
          watchdog = makeLiveFetchWatchdog();
          continue;
        }
        // oxlint-disable-next-line restricted-syntax -- rethrow: fetch contract is throw-on-network-error
        throw liveErr;
      }
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
 * Bind a fixture context into a standalone fetch implementation — THE entry
 * into the fixture engine. AI providers receive it via their `fetch` option;
 * media-gen/TTS/STT/embedding call sites create one per execution from
 * `streamContext.fixtureContext` and use it for their external calls.
 *
 * Each instance carries its own repeat counter for literally-identical
 * requests (poll loops, SDK retries), scoped to the execution chain that
 * created it. Without a context this is the plain live fetch — the presence
 * of an explicit fixtureContext on the chain IS the switch; there is no env
 * flag and no mode.
 */
export function createFixtureFetch(
  fixtureContext: FixtureContext | undefined,
  logger: EndpointLogger = createEndpointLogger(false, defaultLocale),
): typeof globalThis.fetch {
  if (!fixtureContext) {
    if (CRASH_ON_FIXTURE_MISS && process.env.NODE_ENV === "test") {
      // oxlint-disable-next-line restricted-syntax -- temporary debug crash: AI/media call without fixture context in a test run
      throw new Error(
        // eslint-disable-next-line i18next/no-literal-string
        "[FetchCache CRASH_ON_FIXTURE_MISS] createFixtureFetch called WITHOUT a fixtureContext during a test run - this AI/media call would go live",
      );
    }
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- live fetch for AI/media call sites outside fixture mode
    return fetch;
  }
  const repeats = new Map<string, number>();
  // Bun's fetch type carries a `preconnect` member — satisfy it by borrowing
  // the real one (a pure DNS/TLS warm-up; irrelevant to record/replay).
  const bound = Object.assign(
    (input: RequestInfo | URL, init?: RequestInit): Promise<Response> =>
      engineFetch(fixtureContext, repeats, input, init, logger),
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- borrowing the live fetch's preconnect
    { preconnect: fetch.preconnect.bind(fetch) },
  );
  return bound;
}
