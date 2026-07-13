import "server-only";

/**
 * Cortex Embedding Service
 * Generates text embeddings via OpenRouter (baai/bge-m3, 3072 dims).
 * Used for semantic search across cortex nodes and chat messages.
 */
import { createHash } from "node:crypto";

import { createFixtureFetch } from "next-vibe/agent/ai-stream/testing/fetch-cache";
import { agentEnv } from "next-vibe/agent/env";
import { parseError } from "next-vibe/core/utils/parse-error";

import type { ToolExecutionContext } from "../../chat/config";

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
 * For long texts, chunks and averages embeddings.
 * Returns null if the API key is not configured or the call fails.
 */
export async function generateEmbedding(
  text: string,
  /** Fixture chain of the calling stream — undefined callers hit live fetch. */
  streamContext: ToolExecutionContext,
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
  const fetchImpl = createFixtureFetch(streamContext);

  // Model context is 8192 tokens. Chars-per-token varies by content (code,
  // non-Latin text, etc. run denser than ~4:1), so this stays well under the
  // limit rather than assuming a fixed ratio - a chunk landing even 1 token
  // over gets rejected outright by the API.
  const maxCharsPerChunk = 20000;

  try {
    // Short text - single call
    if (trimmed.length <= maxCharsPerChunk) {
      return callEmbeddingApi(apiKey, trimmed, fetchImpl);
    }

    // Long text - chunk and average
    const chunks: string[] = [];
    for (let i = 0; i < trimmed.length; i += maxCharsPerChunk) {
      chunks.push(trimmed.slice(i, i + maxCharsPerChunk));
    }

    const embeddings = await Promise.all(
      chunks.map((chunk) => callEmbeddingApi(apiKey, chunk, fetchImpl)),
    );

    // Filter out any failed chunks
    const valid = embeddings.filter((e): e is number[] => e !== null);
    if (valid.length === 0) {
      return null;
    }

    // Average the embeddings
    const avg = Array.from<number>({ length: EMBEDDING_DIMENSIONS }).fill(0);
    for (const emb of valid) {
      for (let i = 0; i < EMBEDDING_DIMENSIONS; i++) {
        avg[i] += emb[i] / valid.length;
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
    if (await isFixtureContext(streamContext)) {
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
  streamContext: ToolExecutionContext,
): Promise<boolean> {
  if (!streamContext.threadId) {
    return false;
  }
  const { readFixturePrefix } =
    await import("next-vibe/agent/ai-stream/testing/fetch-cache");
  return (await readFixturePrefix(streamContext.threadId)) !== null;
}

/**
 * Call the OpenRouter embeddings API for a single text chunk.
 */
async function callEmbeddingApi(
  apiKey: string,
  text: string,
  fetchImpl: typeof globalThis.fetch,
): Promise<number[] | null> {
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
    // eslint-disable-next-line no-console
    console.error(
      `[cortex-embedding] API returned ${response.status}: ${response.statusText}`,
    );
    return null;
  }

  const data = (await response.json()) as EmbeddingResponse;

  if (data.error) {
    // eslint-disable-next-line no-console
    console.error(`[cortex-embedding] API error: ${data.error.message}`);
    return null;
  }

  if (!data.data?.[0]?.embedding) {
    // eslint-disable-next-line no-console
    console.error("[cortex-embedding] No embedding in response");
    return null;
  }

  const raw = data.data[0].embedding;

  // Truncate to EMBEDDING_DIMENSIONS via Matryoshka Representation Learning (MRL)
  return raw.length > EMBEDDING_DIMENSIONS
    ? raw.slice(0, EMBEDDING_DIMENSIONS)
    : raw;
}
