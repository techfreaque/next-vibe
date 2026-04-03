/**
 * HTTP Fetch Cache — SSE-aware, named-file design
 *
 * Intercepts global.fetch for external HTTP calls in tests.
 * Caches every call as two files:
 *   fixtures/http-cache/{testCase}/{model}-req.json  — full request (url, headers, body)
 *   fixtures/http-cache/{testCase}/{model}-res.json  — full response (human-readable)
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

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { JsonValue } from "@/app/api/[locale]/system/unified-interface/shared/utils/error-types";

const HTTP_CACHE_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "http-cache",
);

// ── Context ────────────────────────────────────────────────────────────────────

let currentTestCase = "unknown";

/** Call this at the top of each test to scope cache files to that test. */
export function setFetchCacheContext(testCase: string): void {
  currentTestCase = slugify(testCase);
  callCounters.clear();
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface ReqFile {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: JsonValue;
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
      body: JsonValue;
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
function parseBodyForStorage(bodyStr: string): JsonValue {
  if (!bodyStr) {
    return "";
  }
  try {
    return JSON.parse(bodyStr) as JsonValue;
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

/** Re-encode SSE events array back to wire format */
function sseEventsToBytes(events: string[]): Uint8Array {
  const wire = `${events.map((e) => `${e}\n`).join("\n")}\n`;
  return new TextEncoder().encode(wire);
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
  let bytes: Uint8Array;
  if (cached.type === "sse") {
    bytes = sseEventsToBytes(cached.events);
  } else if (cached.type === "json") {
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
      body: JSON.parse(text) as JsonValue,
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
      const cached = JSON.parse(readFileSync(rp, "utf-8")) as ResFile;
      return replayFromCache(cached);
    }

    // ── Cache miss — real request ────────────────────────────────────────────
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
      // Cache is written in flush() — after the caller has fully consumed the
      // stream — so the file is always complete before the test ends.
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
