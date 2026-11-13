import "server-only";

/**
 * Cortex Embedding Service
 * Generates text embeddings via OpenRouter (baai/bge-m3, 1024 dims, 8192-token input limit).
 * Used for semantic search across cortex nodes and chat messages.
 */
import { createHash } from "node:crypto";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import { parseError } from "next-vibe/core/utils/parse-error";

import { createFixtureFetch } from "../../ai-stream/testing/fetch-cache";
import { agentEnv } from "../../env";
import {
  chunkTextForEmbedding,
  EMBEDDING_MIN_SPLIT_CHARS,
  estimateEmbeddingTokens,
  isInputTooLongError,
  splitChunkInHalf,
} from "./chunking";

/** Embedding model used for all cortex and message embeddings */
export const EMBEDDING_MODEL = "baai/bge-m3";

/** Embedding model dimension (baai/bge-m3 native = 1024) */
export const EMBEDDING_DIMENSIONS = 1024;

/** Credits charged per embedding API call */
export const EMBEDDING_CREDIT_COST = 0.01;

/**
 * Compute a SHA-256 hash of the text that would be embedded (path + content).
 * Includes the model name — changing EMBEDDING_MODEL invalidates all hashes
 * so backfill automatically re-embeds every node (no user credit deduction).
 */
export function computeEmbeddingHash(path: string, content: string): string {
  return createHash("sha256")
    .update(`${EMBEDDING_MODEL}:${path}\n\n${content}`)
    .digest("hex");
}

interface EmbeddingResponse {
  data?: { embedding: number[]; index: number }[];
  error?: { message: string; code?: string };
}

/**
 * Generate an embedding vector for the given text.
 * Long texts are chunked by estimated tokens (bge-m3 limit: 8192) and the
 * chunk embeddings averaged.
 * Returns null if the API key is not configured or the call fails.
 */
export async function generateEmbedding(
  text: string,
  /** Fixture chain of the calling stream — undefined callers hit live fetch. */
  toolExecutionContext: ToolExecutionContext,
): Promise<number[] | null> {
  const apiKey = agentEnv.OPENROUTER_API_KEY;
  if (!apiKey) {
    return null;
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return null;
  }

  // One fixture-aware fetch per embedding call - carries the repeat counter
  // across chunked requests, so it must not be recreated per chunk.
  const fetchImpl = createFixtureFetch(toolExecutionContext);

  try {
    return await embedTextWithFetch(apiKey, trimmed, fetchImpl);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      "[cortex-embedding] Failed to generate embedding",
      parseError(error),
    );
    // In a FIXTURE run (the stream's threadId maps to a fixtures row), a failed
    // embedding is NOT benign — it means the fixture is missing or the live
    // record leg broke. Throw so the test fails loudly instead of silently
    // degrading to no-memory. Prod (no fixtures row) stays resilient → null.
    if (await isFixtureContext(toolExecutionContext)) {
      // oxlint-disable-next-line restricted-syntax -- fail the fixture run loudly
      throw error instanceof Error
        ? error
        : // eslint-disable-next-line i18next/no-literal-string
          new Error(`embedding failed in fixture run: ${String(error)}`);
    }
    return null;
  }
}

/**
 * True when the stream is running under a fixtures context (its threadId maps to
 * a fixtures row) — i.e. a test record/replay run, where a failed embedding must
 * fail the run rather than silently degrade.
 */
async function isFixtureContext(
  toolExecutionContext: ToolExecutionContext,
): Promise<boolean> {
  if (!toolExecutionContext.threadId) {
    return false;
  }
  const { readFixturePrefix } =
    await import("../../ai-stream/testing/fetch-cache");
  return (await readFixturePrefix(toolExecutionContext.threadId)) !== null;
}

/**
 * Embed already-trimmed text with an explicit fetch implementation.
 * Chunks by estimated tokens (see ./chunking), splits and retries any chunk
 * the provider still rejects as too long, then averages + L2-normalizes.
 * Exported for tests (mocked fetch); production goes through generateEmbedding.
 */
export async function embedTextWithFetch(
  apiKey: string,
  text: string,
  fetchImpl: typeof globalThis.fetch,
): Promise<number[] | null> {
  const chunks = chunkTextForEmbedding(text);

  const perChunk = await Promise.all(
    chunks.map((chunk) => embedChunk(apiKey, chunk, fetchImpl, 0)),
  );
  const valid = perChunk.flat();
  if (valid.length === 0) {
    return null;
  }

  // Single embedding: return as the provider produced it (unchanged behaviour
  // for short text).
  if (valid.length === 1) {
    return valid[0];
  }

  // Average the embeddings
  const avg = Array.from<number>({ length: EMBEDDING_DIMENSIONS }).fill(0);
  for (const emb of valid) {
    for (let i = 0; i < EMBEDDING_DIMENSIONS; i++) {
      avg[i] += (emb[i] ?? 0) / valid.length;
    }
  }

  // L2-normalize so cosine similarity works correctly with HNSW index
  const norm = Math.sqrt(avg.reduce((sum, v) => sum + v * v, 0));
  if (norm > 0) {
    for (let i = 0; i < avg.length; i++) {
      avg[i] /= norm;
    }
  }

  return avg;
}

/** Max halving depth after too-long rejections (2^4 = 16 sub-chunks). */
const MAX_SPLIT_DEPTH = 4;

/**
 * Embed one chunk. If the provider rejects it as too long (the estimate ran
 * low for unusually dense text), split it in half and embed both halves.
 * Returns zero or more embeddings (empty = this chunk failed).
 */
async function embedChunk(
  apiKey: string,
  chunk: string,
  fetchImpl: typeof globalThis.fetch,
  depth: number,
): Promise<number[][]> {
  const result = await callEmbeddingApi(apiKey, chunk, fetchImpl);
  if (result.kind === "ok") {
    return [result.embedding];
  }
  if (
    result.kind === "too-long" &&
    depth < MAX_SPLIT_DEPTH &&
    chunk.length >= EMBEDDING_MIN_SPLIT_CHARS
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `[cortex-embedding] Input too long (${chunk.length} chars, ~${estimateEmbeddingTokens(chunk)} est. tokens); splitting and retrying`,
    );
    const halves = splitChunkInHalf(chunk);
    // Sequential: keeps fixture record/replay ordinals deterministic.
    const first = await embedChunk(apiKey, halves[0], fetchImpl, depth + 1);
    const second = await embedChunk(apiKey, halves[1], fetchImpl, depth + 1);
    return [...first, ...second];
  }
  return [];
}

type EmbeddingCallResult =
  | { kind: "ok"; embedding: number[] }
  | { kind: "too-long" }
  | { kind: "failed" };

/**
 * Call the OpenRouter embeddings API for a single text chunk.
 */
async function callEmbeddingApi(
  apiKey: string,
  text: string,
  fetchImpl: typeof globalThis.fetch,
): Promise<EmbeddingCallResult> {
  const response = await fetchImpl("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://unbottled.ai",
      "X-Title": "Unbottled AI",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    // The status line alone ("400 Bad Request") never says WHY: log the
    // provider's error body and the input size so the cause is diagnosable
    // (e.g. a chunk over the model's token limit).
    const body = await response.text().catch(() => "");
    const tooLong = isInputTooLongError(response.status, body);
    // eslint-disable-next-line no-console
    console.error(
      `[cortex-embedding] API returned ${response.status}: ${response.statusText}`,
      {
        inputChars: text.length,
        estimatedTokens: estimateEmbeddingTokens(text),
        tooLong,
        body: body.slice(0, 500),
      },
    );
    return tooLong ? { kind: "too-long" } : { kind: "failed" };
  }

  const data = (await response.json()) as EmbeddingResponse;

  if (data.error) {
    const tooLong = isInputTooLongError(400, data.error.message);
    // eslint-disable-next-line no-console
    console.error(`[cortex-embedding] API error: ${data.error.message}`, {
      inputChars: text.length,
      estimatedTokens: estimateEmbeddingTokens(text),
      tooLong,
    });
    return tooLong ? { kind: "too-long" } : { kind: "failed" };
  }

  if (!data.data?.[0]?.embedding) {
    // eslint-disable-next-line no-console
    console.error("[cortex-embedding] No embedding in response");
    return { kind: "failed" };
  }

  const raw = data.data[0].embedding;

  // Truncate to EMBEDDING_DIMENSIONS via Matryoshka Representation Learning (MRL)
  return {
    kind: "ok",
    embedding:
      raw.length > EMBEDDING_DIMENSIONS
        ? raw.slice(0, EMBEDDING_DIMENSIONS)
        : raw,
  };
}
