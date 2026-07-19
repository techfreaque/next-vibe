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

import type { ToolExecutionContext } from "../../chat/config";
import {
  cacheDir,
  fileStem,
  FIXTURE_STRICT,
  readAndBumpFixture,
  resolveInstanceName,
  slugify,
} from "./fetch-cache";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PartsFixtureFile {
  type: "parts";
  modelId: string;
  parts: LanguageModelV2StreamPart[];
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Wrap a real stream-producing function with fixture replay, routed through the
 * SAME ordinal engine as the HTTP fetch cache. Without a fixture prefix on the
 * stream's thread the producer runs directly.
 */
export async function withClaudeCodeFixture(
  toolExecutionContext: ToolExecutionContext | undefined,
  modelId: string,
  producer: () => Promise<ReadableStream<LanguageModelV2StreamPart>>,
): Promise<ReadableStream<LanguageModelV2StreamPart>> {
  const threadId = toolExecutionContext?.threadId;
  // No thread → not a fixture run. Read prefix + bump the run's single ordinal
  // in one round-trip (same counter the HTTP engine bumps). No prefix → live.
  const fx = threadId ? await readAndBumpFixture(threadId) : null;
  if (!fx) {
    return producer();
  }

  const instance = await resolveInstanceName();
  const stem = fileStem(instance, slugify(modelId), fx.ordinal);
  const fp = join(cacheDir(slugify(fx.prefix)), `${stem}-res.json`);

  // ── Cache hit ────────────────────────────────────────────────────────────
  if (existsSync(fp)) {
    const fixture = JSON.parse(readFileSync(fp, "utf-8")) as PartsFixtureFile;
    return replayFixture(fixture.parts);
  }

  if (FIXTURE_STRICT) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw to fail test on uncached agent call
    throw new Error(
      // eslint-disable-next-line i18next/no-literal-string
      `[ClaudeCodeFixture STRICT] No fixture for ${modelId} (context: ${slugify(fx.prefix)}, expected: ${stem}-res.json)`,
    );
  }

  // ── Cache miss - real call ───────────────────────────────────────────────
  const realStream = await producer();
  return captureAndWrite(realStream, fp, modelId);
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
      const fixture: PartsFixtureFile = {
        type: "parts",
        modelId,
        parts: collected,
      };
      writeFileSync(fp, JSON.stringify(fixture, null, 2), "utf-8");
    },
  });

  return source.pipeThrough(transform);
}
