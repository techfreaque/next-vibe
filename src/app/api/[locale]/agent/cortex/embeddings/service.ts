import "server-only";

/**
 * Cortex Embedding Service
 * Generates text embeddings via OpenRouter (qwen/qwen3-embedding-8b, 3072 dims).
 * Used for semantic search across cortex nodes.
 */

import { createHash } from "node:crypto";

import { parseError } from "next-vibe/shared/utils/parse-error";

import { agentEnv } from "@/app/api/[locale]/agent/env";

/** Embedding model dimension */
export const EMBEDDING_DIMENSIONS = 3072;

/** Credits charged per embedding API call */
export const EMBEDDING_CREDIT_COST = 0.1;

/**
 * Compute a SHA-256 hash of the text that would be embedded.
 * Used to skip redundant embedding API calls when content hasn't changed.
 */
export function computeEmbeddingHash(path: string, content: string): string {
  return createHash("sha256").update(`${path}\n\n${content}`).digest("hex");
}

/** Max tokens per embedding request (~8k tokens ≈ 32k chars) */
const MAX_CHARS_PER_CHUNK = 32000;

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
): Promise<number[] | null> {
  const apiKey = agentEnv.OPENROUTER_API_KEY;
  if (!apiKey) {
    return null;
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return null;
  }

  try {
    // Short text — single call
    if (trimmed.length <= MAX_CHARS_PER_CHUNK) {
      return callEmbeddingApi(apiKey, trimmed);
    }

    // Long text — chunk and average
    const chunks: string[] = [];
    for (let i = 0; i < trimmed.length; i += MAX_CHARS_PER_CHUNK) {
      chunks.push(trimmed.slice(i, i + MAX_CHARS_PER_CHUNK));
    }

    const embeddings = await Promise.all(
      chunks.map((chunk) => callEmbeddingApi(apiKey, chunk)),
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
    return null;
  }
}

/**
 * Call the OpenRouter embeddings API for a single text chunk.
 */
async function callEmbeddingApi(
  apiKey: string,
  text: string,
): Promise<number[] | null> {
  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "qwen/qwen3-embedding-8b",
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
