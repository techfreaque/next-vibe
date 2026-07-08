/**
 * Claude Code Fixture Store
 *
 * Deterministic test replay for the Claude Code provider, which uses the
 * Agent SDK's query() and does NOT go through fetch — so the HTTP fixture
 * engine cannot intercept it.
 *
 * Uses the SAME fixture engine as the HTTP path (fetch-cache.ts): the run's
 * single ordinal counter in the fixtures table, the SAME cache folder
 * (the run's prefix), and the SAME `<NNNN>-<instance>-<model>` file stem. The
 * Nth external call of the run — HTTP or Agent-SDK — maps to file N; matching
 * is order-driven, never content-hashed.
 *
 *   - Thread has a fixture prefix + fixture exists → replayed as a
 *     ReadableStream of the recorded LanguageModelV2StreamPart events.
 *   - Thread has a fixture prefix + no fixture     → real Agent SDK call, parts
 *     collected and written on stream end (unless STRICT).
 *   - Thread has no fixture prefix                 → producer runs directly.
 *
 * Fixture file (same folder + stem as HTTP fixtures, distinct `parts` type):
 *   src/generated/ai-fixtures/http-cache/{prefix}/{NNNN}-{instance}-{model}-res.json
 *   { "type": "parts", "modelId": "...", "parts": [ ... ] }
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { LanguageModelV2StreamPart } from "@ai-sdk/provider";

import { FIXTURE_STRICT, type FixtureContext } from "./fetch-cache";

const CLAUDE_CODE_CACHE_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "..",
  "..",
  "..",
  "generated",
  "ai-fixtures",
  "claude-code",
);

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

function fixturePath(
  contextName: string,
  modelId: string,
  userPrompt: string,
): string {
  const hash = createHash("sha256")
    .update(`${modelId}\n${userPrompt}`)
    .digest("hex")
    .slice(0, 8);
  return join(
    CLAUDE_CODE_CACHE_DIR,
    slugify(contextName),
    `${slugify(modelId)}-${hash}-res.json`,
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Wrap a real stream-producing function with fixture replay, routed through the
 * SAME ordinal engine as the HTTP fetch cache. Without a fixture prefix on the
 * stream's thread the producer runs directly.
 */
export async function withClaudeCodeFixture(
  fixtureContext: FixtureContext | undefined,
  modelId: string,
  userPrompt: string,
  producer: () => Promise<ReadableStream<LanguageModelV2StreamPart>>,
): Promise<ReadableStream<LanguageModelV2StreamPart>> {
  if (!fixtureContext) {
    return producer();
  }

  const fp = fixturePath(fixtureContext.name, modelId, userPrompt);

  // ── Cache hit ────────────────────────────────────────────────────────────
  if (existsSync(fp)) {
    const fixture = JSON.parse(readFileSync(fp, "utf-8")) as FixtureFile;
    return replayFixture(fixture.parts);
  }

  if (fixtureContext.strict) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw to fail test on uncached agent call
    throw new Error(
      // eslint-disable-next-line i18next/no-literal-string
      `[ClaudeCodeFixture STRICT] No fixture for ${modelId} (context: ${fixtureContext.name}, expected: ${fp})`,
    );
  }

  // ── Cache miss - real call ───────────────────────────────────────────────
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
