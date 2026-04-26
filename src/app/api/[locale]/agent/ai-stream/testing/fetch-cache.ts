/**
 * HTTP Fetch Cache - SSE-aware, named-file design
 *
 * Intercepts global.fetch for external HTTP calls in tests.
 * Caches every call as two files:
 *   fixtures/http-cache/{testCase}/{model}-req.json  - full request (url, headers, body)
 *   fixtures/http-cache/{testCase}/{model}-res.json  - full response (human-readable)
 *
 * Response file formats:
 *   SSE streams  → { type: "sse",    events: ["data: {...}", "data: [DONE]"], ... }
 *   JSON/binary  → { type: "json",   body: <parsed object>, ... }
 *   Other text   → { type: "text",   body: "...", ... }
 *
 * Multiple calls to the same model within one test get counter suffixes:
 *   {model}-req.json, {model}-2-req.json, {model}-3-req.json, ...
 *
 * On cache hit, the stored data is replayed as a ReadableStream so the AI SDK
 * receives exactly the same wire bytes as on the live run.
 *
 * Only external URLs are intercepted (http/https with non-localhost host).
 * Internal calls (DB, WS, localhost) pass through unmodified.
 *
 * SSE streams are captured via TransformStream: live bytes flow to caller
 * immediately; cache file is written in flush() once the stream closes.
 *
 * Set context before each test: setFetchCacheContext("test-case-name")
 * Cache bust: delete fixtures/http-cache/{testCase}/
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { setClaudeCodeFixtureContext } from "./claude-code-fixture-store";

// Optional WS fixture context sync - registered by ws-fixture.ts via registerWsContextHook()
let wsContextHook: ((testCase: string) => void) | null = null;

/** Register a hook to sync WS fixture context when setFetchCacheContext is called. */
export function registerWsContextHook(hook: (testCase: string) => void): void {
  wsContextHook = hook;
}

export const HTTP_CACHE_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "http-cache",
);

// ── Context ────────────────────────────────────────────────────────────────────

let currentTestCase = "unknown";
let strictMode = false;

/** Call this at the top of each test to scope cache files to that test. */
export function setFetchCacheContext(testCase: string): void {
  currentTestCase = slugify(testCase);
  callCounters.clear();
  // Keep Claude Code fixture store in sync - it doesn't use fetch so needs its own context
  setClaudeCodeFixtureContext(testCase);
  // Keep WS fixture store in sync (registered by ws-fixture.ts when installed)
  wsContextHook?.(testCase);
  // eslint-disable-next-line no-console
  console.log(`[FetchCache] context set: ${currentTestCase}`);
}

/**
 * When strict mode is enabled, any external fetch that has no cached fixture
 * will throw instead of making a real network request. Use this to prove
 * that a test suite runs entirely from fixtures with zero network access.
 */
let wsStrictHook: ((strict: boolean) => void) | null = null;

/** Register a hook to sync WS strict mode when setFetchCacheStrictMode is called. */
export function registerWsStrictHook(hook: (strict: boolean) => void): void {
  wsStrictHook = hook;
}

export function setFetchCacheStrictMode(strict: boolean): void {
  strictMode = strict;
  wsStrictHook?.(strict);
}

/**
 * Patch SSE streaming response files where a dynamic value (e.g. taskId) is
 * split across multiple `tool_calls[].function.arguments` chunks.
 *
 * Strategy: collect all argument chunks from SSE events in order, concatenate
 * them, do the string replacement, then redistribute the new characters back
 * into the same chunk boundaries (same number of chunks, each chunk gets the
 * same character count as before, overflow/underflow is absorbed by the last
 * chunk).
 *
 * Returns the patched file content string, or null if oldStr wasn't found
 * in the concatenated arguments.
 */
function patchSseToolCallArguments(
  fileContent: string,
  oldStr: string,
  newStr: string,
): string | null {
  const parsed = JSON.parse(fileContent) as ResFile & {
    events: string[];
  };
  if (parsed.type !== "sse" || !Array.isArray(parsed.events)) {
    return null;
  }

  // For each tool_call index, collect argument chunks with their event indices
  interface ChunkInfo {
    eventIdx: number;
    toolIdx: number;
    text: string;
  }
  const toolChunks = new Map<number, ChunkInfo[]>();

  for (let i = 0; i < parsed.events.length; i++) {
    const evt = parsed.events[i]!;
    const dataPrefix = "data: ";
    if (typeof evt !== "string" || !evt.startsWith(dataPrefix)) {
      continue;
    }
    const jsonStr = evt.slice(dataPrefix.length);
    if (jsonStr === "[DONE]") {
      continue;
    }

    let data: {
      choices?: Array<{
        delta?: {
          tool_calls?: Array<{
            index: number;
            function?: { arguments?: string };
          }>;
        };
      }>;
    };
    try {
      data = JSON.parse(jsonStr) as typeof data;
    } catch {
      continue;
    }

    const tcs = data.choices?.[0]?.delta?.tool_calls;
    if (!tcs) {
      continue;
    }

    for (const tc of tcs) {
      const args = tc.function?.arguments;
      if (args === undefined) {
        continue;
      }
      const idx = tc.index;
      if (!toolChunks.has(idx)) {
        toolChunks.set(idx, []);
      }
      toolChunks.get(idx)!.push({ eventIdx: i, toolIdx: idx, text: args });
    }
  }

  // For each tool_call index, check if concatenated args contain oldStr
  let anyPatched = false;
  for (const [toolIdx, chunks] of toolChunks) {
    const fullArgs = chunks.map((c) => c.text).join("");
    if (!fullArgs.includes(oldStr)) {
      continue;
    }

    const patchedArgs = fullArgs.replaceAll(oldStr, newStr);
    anyPatched = true;

    // Redistribute patchedArgs back into same chunk boundaries
    let offset = 0;
    for (let ci = 0; ci < chunks.length; ci++) {
      const chunk = chunks[ci]!;
      const isLast = ci === chunks.length - 1;
      const chunkLen = isLast ? patchedArgs.length - offset : chunk.text.length;
      const newText = patchedArgs.slice(offset, offset + chunkLen);
      offset += chunkLen;

      // Update the event in-place
      const evt = parsed.events[chunk.eventIdx]!;
      const jsonStr = (evt as string).slice("data: ".length);
      interface SseChunkData {
        choices: Array<{
          delta: {
            tool_calls: Array<{
              index: number;
              function?: { arguments?: string };
            }>;
          };
        }>;
      }
      const data = JSON.parse(jsonStr) as SseChunkData;
      const tc = data.choices[0]!.delta.tool_calls.find(
        (t) => t.index === toolIdx,
      );
      if (tc?.function) {
        tc.function.arguments = newText;
      }
      parsed.events[chunk.eventIdx] = `data: ${JSON.stringify(data)}`;
    }
  }

  if (!anyPatched) {
    return null;
  }
  return JSON.stringify(parsed, null, 2);
}

/**
 * Patch all fixture files in a named context directory, replacing every
 * occurrence of `oldStr` with `newStr`. Use this to update dynamic values
 * (e.g. taskIds) in recorded fixtures before replaying them in a subsequent
 * test step that depends on a value produced by the previous step.
 *
 * Call with the TARGET context name (not necessarily the current context).
 * Safe to call when the directory doesn't exist yet (no-op).
 */
/**
 * Normalize fixture files by replacing all occurrences of strings matching `pattern`
 * with `placeholder`. Handles both plain JSON files and SSE response files.
 *
 * Use this at the start of a test that creates a live ID (e.g. taskId), to reset stale
 * IDs left by a previous failed run that didn't reach its end-of-test normalization step.
 *
 * Example:
 *   normalizeFetchCacheFixtures("callback-wait-step2", /local-bg-\d+-\w+/g, "T5B_TASK_ID_PLACEHOLDER")
 */
export function normalizeFetchCacheFixtures(
  contextName: string,
  pattern: RegExp,
  placeholder: string,
): void {
  const dir = cacheDir(slugify(contextName));
  if (!existsSync(dir)) {
    return;
  }
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const fp = join(dir, file);
    if (!existsSync(fp)) {
      continue;
    }
    const content = readFileSync(fp, "utf-8");

    // Determine file type before deciding how to match
    let parsedType: string | undefined;
    try {
      parsedType = (JSON.parse(content) as { type?: string }).type;
    } catch {
      parsedType = undefined;
    }

    if (parsedType !== "sse") {
      // Plain files (req files, non-SSE responses): quick content check + direct replace
      pattern.lastIndex = 0;
      if (!pattern.test(content)) {
        pattern.lastIndex = 0;
        continue;
      }
      pattern.lastIndex = 0;
      writeFileSync(fp, content.replace(pattern, placeholder), "utf-8");
      continue;
    }

    // SSE res files: the value may be split across argument chunks so a plain
    // regex on `content` won't find it. Reconstruct full tool argument strings
    // from the parsed events, apply the pattern there, then use
    // patchSseToolCallArguments for each discovered match.
    const globalPattern = pattern.global
      ? pattern
      : new RegExp(pattern.source, `${pattern.flags}g`);

    // Reconstruct concatenated tool args from SSE events
    const sseMatches = new Set<string>();
    try {
      const parsed = JSON.parse(content) as { type: string; events?: string[] };
      if (Array.isArray(parsed.events)) {
        const toolArgs = new Map<number, string>();
        for (const evt of parsed.events) {
          if (typeof evt !== "string" || !evt.startsWith("data: ")) {
            continue;
          }
          const raw = evt.slice(6);
          if (raw === "[DONE]") {
            continue;
          }
          try {
            const d = JSON.parse(raw) as {
              choices?: Array<{
                delta?: {
                  tool_calls?: Array<{
                    index: number;
                    function?: { arguments?: string };
                  }>;
                };
              }>;
            };
            for (const tc of d.choices?.[0]?.delta?.tool_calls ?? []) {
              const args = tc.function?.arguments;
              if (args !== undefined) {
                toolArgs.set(tc.index, (toolArgs.get(tc.index) ?? "") + args);
              }
            }
          } catch {
            // ignore
          }
        }
        for (const full of toolArgs.values()) {
          globalPattern.lastIndex = 0;
          for (const m of full.matchAll(globalPattern)) {
            sseMatches.add(m[0]);
          }
        }
      }
    } catch {
      // ignore parse errors
    }

    // Also search plain content (catches non-fragmented occurrences)
    globalPattern.lastIndex = 0;
    for (const m of content.matchAll(globalPattern)) {
      sseMatches.add(m[0]);
    }

    let current = content;
    for (const match of sseMatches) {
      if (match === placeholder) {
        continue;
      }
      const result = patchSseToolCallArguments(current, match, placeholder);
      if (result !== null) {
        current = result;
      } else {
        // Not in tool args - try plain replace (e.g. in text content)
        globalPattern.lastIndex = 0;
        const replaced = current.replace(globalPattern, placeholder);
        if (replaced !== current) {
          current = replaced;
        }
      }
    }
    if (current !== content) {
      writeFileSync(fp, current, "utf-8");
    }
  }
}

export function patchFetchCacheFixtures(
  contextName: string,
  oldStr: string,
  newStr: string,
): void {
  const dir = cacheDir(slugify(contextName));
  if (!existsSync(dir)) {
    return;
  }
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const fp = join(dir, file);
    if (!existsSync(fp)) {
      continue; // may have been deleted by SSE cleanup in a previous iteration
    }
    const content = readFileSync(fp, "utf-8");
    if (content.includes(oldStr)) {
      // Contiguous match (req files, non-SSE responses)
      writeFileSync(fp, content.replaceAll(oldStr, newStr), "utf-8");
    } else if (
      file.endsWith("-res.json") &&
      content.includes('"type": "sse"')
    ) {
      // SSE streaming responses: the value may be split across argument chunks.
      // Reconstruct tool_calls arguments from SSE events, do the replacement,
      // then re-split into the same chunk pattern.
      const patched = patchSseToolCallArguments(content, oldStr, newStr);
      if (patched !== null) {
        writeFileSync(fp, patched, "utf-8");
      }
    }
  }
}

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
function isExternal(url: string): boolean {
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
    // Also intercept specific localhost ports opted-in via addLocalhostPort()
    const port = parseInt(
      u.port || (u.protocol === "https:" ? "443" : "80"),
      10,
    );
    return localhostPorts.has(port);
  } catch {
    return false;
  }
}

/** Localhost ports that should also be intercepted (opt-in for remote server calls) */
const localhostPorts = new Set<number>();

/**
 * Opt-in a specific localhost port for fetch caching.
 * Use this in remote-mode tests where the "remote" server is localhost:PORT.
 * Example: addLocalhostPort(3001) intercepts calls to localhost:3001.
 * Call clearLocalhostPorts() in test teardown.
 */
export function addLocalhostPort(port: number): void {
  localhostPorts.add(port);
}

/** Remove all opted-in localhost ports */
export function clearLocalhostPorts(): void {
  localhostPorts.clear();
}

const callCounters = new Map<string, number>();

function nextCallIndex(modelName: string): number {
  const n = (callCounters.get(modelName) ?? 0) + 1;
  callCounters.set(modelName, n);
  return n;
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

async function drainStream(
  stream: ReadableStream<Uint8Array>,
): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }
  return merged;
}

// ── Cache hit replay ───────────────────────────────────────────────────────────

function replayFromCache(cached: ResFile): Response {
  // SSE responses use a pull-based ticking stream to simulate async delivery.
  // This prevents the fixture-replay burst from letting a later LLM step (F3/F4)
  // set waitingForRemoteResult before the for-await loop processes earlier
  // tool-result events (e.g. tool-help:1).
  if (cached.type === "sse") {
    return new Response(sseEventsToTickingStream(cached.events), {
      status: cached.status,
      headers: cached.headers,
    });
  }
  let bytes: Uint8Array;
  if (cached.type === "json") {
    bytes = new TextEncoder().encode(JSON.stringify(cached.body));
  } else if (cached.type === "binary") {
    bytes = Uint8Array.from(Buffer.from(cached.body, "base64"));
  } else {
    bytes = new TextEncoder().encode(cached.body);
  }
  return new Response(bytesToStream(bytes), {
    status: cached.status,
    headers: cached.headers,
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

let installed = false;

export function installFetchCache(): void {
  if (installed) {
    return;
  }
  installed = true;
  mkdirSync(HTTP_CACHE_DIR, { recursive: true });

  const originalFetch = global.fetch;

  global.fetch = (async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    // Pass through non-external calls (localhost, DB, WS, etc.)
    if (!isExternal(url)) {
      return originalFetch(input, init);
    }

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
    const testCaseDir = cacheDir(currentTestCase);
    const callIndex = nextCallIndex(modelName);
    const stem = fileStem(modelName, callIndex);
    const rp = join(testCaseDir, `${stem}-res.json`);

    // ── Cache hit ────────────────────────────────────────────────────────────
    if (existsSync(rp)) {
      // eslint-disable-next-line no-console
      console.log("[FetchCache] HIT", {
        rp: rp.split("/").slice(-3).join("/"),
        model: modelName,
        index: callIndex,
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
    // eslint-disable-next-line no-console
    console.log("[FetchCache] MISS", {
      rp: rp.split("/").slice(-3).join("/"),
      model: modelName,
      index: callIndex,
    });

    // ── Cache miss ────────────────────────────────────────────────────────────
    if (strictMode) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw to fail test on uncached fetch
      throw new Error(
        // eslint-disable-next-line i18next/no-literal-string
        `[FetchCache STRICT] No fixture for external URL: ${url} (context: ${currentTestCase})`,
      );
    }

    const real = await originalFetch(input, init);
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

    const isStream =
      (responseHeaders["content-type"] ?? "").includes("event-stream") ||
      (responseHeaders["transfer-encoding"] ?? "") === "chunked";

    if (isStream && real.body) {
      // TransformStream: pass chunks through to caller AND collect them.
      // Cache is written in flush() - after the caller has fully consumed the
      // stream - so the file is always complete before the test ends.
      const chunks: Uint8Array[] = [];
      const transform = new TransformStream<Uint8Array, Uint8Array>({
        transform(chunk, controller): void {
          chunks.push(chunk);
          controller.enqueue(chunk);
        },
        flush(): void {
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
        },
      });

      return new Response(real.body.pipeThrough(transform), {
        status: real.status,
        headers: responseHeaders,
      });
    }

    // Non-streaming: drain, build human-readable entry, return stream
    const bytes = await drainStream(real.clone().body!);
    const resEntry = buildResFile(url, real.status, responseHeaders, bytes);
    writeFileSync(rp, JSON.stringify(resEntry, null, 2), "utf-8");

    return new Response(bytesToStream(bytes), {
      status: real.status,
      headers: responseHeaders,
    });
  }) as typeof globalThis.fetch;
}
