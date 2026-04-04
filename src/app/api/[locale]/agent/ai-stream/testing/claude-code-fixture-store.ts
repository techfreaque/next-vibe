/**
 * Claude Code Fixture Store
 *
 * Provides deterministic test replay for the Claude Code provider, which uses
 * the Agent SDK's query() and does NOT go through global.fetch — so the HTTP
 * fetch cache cannot intercept it.
 *
 * Works identically to fetch-cache.ts in concept:
 *   - On first run: real Agent SDK call fires, stream parts are collected and
 *     written to fixtures/claude-code/{testCase}/{model}-{index}-res.json
 *   - On subsequent runs: fixture is replayed as a ReadableStream of the same
 *     LanguageModelV2StreamPart events, no network required.
 *
 * Context must be set before each test via setFetchCacheContext() from fetch-cache.ts.
 * The two stores share the same context variable so both are scoped to the same
 * test case automatically.
 *
 * Fixture format:
 *   {
 *     "modelId": "claude-haiku-4-5",
 *     "userPrompt": "...",
 *     "parts": [ { "type": "stream-start", ... }, { "type": "text-delta", ... }, ... ]
 *   }
 *
 * Cache bust: delete fixtures/claude-code/{testCase}/
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LanguageModelV2StreamPart } from "@ai-sdk/provider";

const CLAUDE_CODE_CACHE_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "claude-code",
);

// ── Shared context (set by fetch-cache.ts setFetchCacheContext) ───────────────

let currentTestCase = "unknown";
const callCounters = new Map<string, number>();

/** Called by fetch-cache.ts setFetchCacheContext — keeps both stores in sync */
export function setClaudeCodeFixtureContext(testCase: string): void {
  currentTestCase = slugify(testCase);
  callCounters.clear();
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface FixtureFile {
  modelId: string;
  userPrompt: string;
  parts: LanguageModelV2StreamPart[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function nextCallIndex(modelId: string): number {
  const key = slugify(modelId);
  const n = (callCounters.get(key) ?? 0) + 1;
  callCounters.set(key, n);
  return n;
}

function fixturePath(modelId: string, index: number): string {
  const stem = index === 1 ? slugify(modelId) : `${slugify(modelId)}-${index}`;
  return join(CLAUDE_CODE_CACHE_DIR, currentTestCase, `${stem}-res.json`);
}

// ── Public API ────────────────────────────────────────────────────────────────

/** True when running in test environment */
export function isTestMode(): boolean {
  return process.env.NODE_ENV === "test";
}

/**
 * Wrap a real stream-producing function with fixture replay.
 *
 * In test mode:
 *   - Cache hit  → return replayed ReadableStream from fixture
 *   - Cache miss → run producer, collect parts, write fixture, return stream
 * In non-test mode: run producer directly, no caching.
 */
export async function withClaudeCodeFixture(
  modelId: string,
  userPrompt: string,
  producer: () => Promise<ReadableStream<LanguageModelV2StreamPart>>,
): Promise<ReadableStream<LanguageModelV2StreamPart>> {
  if (!isTestMode()) {
    return producer();
  }

  mkdirSync(CLAUDE_CODE_CACHE_DIR, { recursive: true });

  const index = nextCallIndex(modelId);
  const fp = fixturePath(modelId, index);

  // ── Cache hit ────────────────────────────────────────────────────────────
  if (existsSync(fp)) {
    const fixture = JSON.parse(readFileSync(fp, "utf-8")) as FixtureFile;
    return replayFixture(fixture.parts);
  }

  // ── Cache miss — real call ───────────────────────────────────────────────
  const realStream = await producer();
  return captureAndWrite(realStream, fp, modelId, userPrompt);
}

// ── Internals ─────────────────────────────────────────────────────────────────

function replayFixture(
  parts: LanguageModelV2StreamPart[],
): ReadableStream<LanguageModelV2StreamPart> {
  return new ReadableStream<LanguageModelV2StreamPart>({
    start(controller) {
      for (const part of parts) {
        controller.enqueue(part);
      }
      controller.close();
    },
  });
}

/**
 * Wrap the real stream with a passthrough that collects all parts and writes
 * the fixture file when the stream ends (in the TransformStream flush()).
 */
function captureAndWrite(
  source: ReadableStream<LanguageModelV2StreamPart>,
  fp: string,
  modelId: string,
  userPrompt: string,
): ReadableStream<LanguageModelV2StreamPart> {
  const collected: LanguageModelV2StreamPart[] = [];

  const transform = new TransformStream<
    LanguageModelV2StreamPart,
    LanguageModelV2StreamPart
  >({
    transform(part, controller): void {
      collected.push(part);
      controller.enqueue(part);
    },
    flush(): void {
      const dir = fp.slice(0, fp.lastIndexOf("/"));
      mkdirSync(dir, { recursive: true });
      const fixture: FixtureFile = {
        modelId,
        userPrompt: userPrompt.slice(0, 500),
        parts: collected,
      };
      writeFileSync(fp, JSON.stringify(fixture, null, 2), "utf-8");
    },
  });

  return source.pipeThrough(transform);
}
