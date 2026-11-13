/**
 * Token-safe embedding chunking + too-long retry tests.
 *
 * - estimateEmbeddingTokens stays conservative for non-Latin text
 * - chunkTextForEmbedding keeps every chunk within budget, loses no text,
 *   never splits a surrogate pair
 * - embedTextWithFetch splits and retries a chunk the provider rejects as
 *   too long (mocked fetch, no network)
 */

import { describe, expect, it } from "vitest";

import {
  chunkTextForEmbedding,
  EMBEDDING_CHUNK_TOKEN_BUDGET,
  EMBEDDING_MODEL_MAX_TOKENS,
  estimateEmbeddingTokens,
  isInputTooLongError,
  splitChunkInHalf,
} from "./chunking";
import { EMBEDDING_DIMENSIONS, embedTextWithFetch } from "./service";

const CJK = "数据库连接池在高并发场景下需要仔细调优以避免资源耗尽。";
const CYRILLIC = "Подключение к базе данных требует тщательной настройки. ";

function longText(unit: string, chars: number): string {
  return unit.repeat(Math.ceil(chars / unit.length)).slice(0, chars);
}

function unitEmbedding(seed: number): number[] {
  return Array.from({ length: EMBEDDING_DIMENSIONS }, (_, i) =>
    i === seed % EMBEDDING_DIMENSIONS ? 1 : 0,
  );
}

interface MockCall {
  input: string;
}

function parseInput(init: RequestInit | undefined): string {
  const body = typeof init?.body === "string" ? init.body : "{}";
  const parsed: { input?: string } = JSON.parse(body);
  return parsed.input ?? "";
}

/**
 * Mock OpenRouter: rejects inputs whose REAL token count (simulated as
 * 1 token per char, i.e. worse than our estimate for Cyrillic) exceeds the
 * model limit, like bge-m3 does.
 */
function createMockFetch(realTokensPerChar: number): {
  fetchImpl: typeof globalThis.fetch;
  calls: MockCall[];
} {
  const calls: MockCall[] = [];
  const handler = async (
    _input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const input = parseInput(init);
    calls.push({ input });
    if (input.length * realTokensPerChar > EMBEDDING_MODEL_MAX_TOKENS) {
      return Response.json(
        {
          error: {
            message: `Input length ${Math.ceil(input.length * realTokensPerChar)} exceeds maximum context length of 8192 tokens`,
          },
        },
        { status: 400, statusText: "Bad Request" },
      );
    }
    return Response.json({
      data: [{ embedding: unitEmbedding(calls.length), index: 0 }],
    });
  };
  const fetchImpl = Object.assign(handler, { preconnect: fetch.preconnect });
  return { fetchImpl, calls };
}

describe("estimateEmbeddingTokens", () => {
  it("counts CJK as ~1 token per char", () => {
    expect(estimateEmbeddingTokens(CJK)).toBe(CJK.length);
  });

  it("counts Cyrillic as ~1 token per 2 chars (ASCII spaces at 1/3)", () => {
    const est = estimateEmbeddingTokens(CYRILLIC);
    expect(est).toBeGreaterThanOrEqual(CYRILLIC.length * 0.45);
    expect(est).toBeLessThanOrEqual(CYRILLIC.length);
  });

  it("counts ASCII as ~1 token per 3 chars", () => {
    expect(estimateEmbeddingTokens("a".repeat(3000))).toBeLessThanOrEqual(1001);
    expect(estimateEmbeddingTokens("a".repeat(3000))).toBeGreaterThanOrEqual(1000);
  });
});

describe("chunkTextForEmbedding", () => {
  it("returns short text unchanged as one chunk", () => {
    expect(chunkTextForEmbedding("hello world")).toEqual(["hello world"]);
  });

  it("keeps every chunk of 20k-char CJK text within the token budget", () => {
    const text = longText(CJK, 20_000);
    const chunks = chunkTextForEmbedding(text);
    // The old fixed 20k-char chunk would have been ~20k tokens (> 8192).
    expect(chunks.length).toBeGreaterThanOrEqual(4);
    for (const chunk of chunks) {
      expect(estimateEmbeddingTokens(chunk)).toBeLessThanOrEqual(
        EMBEDDING_CHUNK_TOKEN_BUDGET,
      );
    }
    expect(chunks.join("")).toBe(text);
  });

  it("prefers whitespace boundaries and loses no text", () => {
    const text = longText(CYRILLIC, 60_000);
    const chunks = chunkTextForEmbedding(text);
    expect(chunks.join("")).toBe(text);
    for (const chunk of chunks.slice(0, -1)) {
      expect(chunk.endsWith(" ")).toBe(true);
    }
  });

  it("never splits a surrogate pair (emoji)", () => {
    const text = "😀".repeat(15_000);
    const chunks = chunkTextForEmbedding(text);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      const first = chunk.charCodeAt(0);
      expect(first >= 0xdc00 && first <= 0xdfff).toBe(false);
    }
    expect(chunks.join("")).toBe(text);
  });
});

describe("splitChunkInHalf / isInputTooLongError", () => {
  it("splits into two non-empty halves covering the text", () => {
    const text = longText(CYRILLIC, 1000);
    const [a, b] = splitChunkInHalf(text);
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
    expect(a + b).toBe(text);
  });

  it("detects too-long errors", () => {
    expect(
      isInputTooLongError(400, "maximum context length is 8192 tokens"),
    ).toBe(true);
    expect(isInputTooLongError(413, "")).toBe(true);
    expect(isInputTooLongError(400, "invalid model")).toBe(false);
    expect(isInputTooLongError(500, "token limit")).toBe(false);
  });
});

describe("embedTextWithFetch", () => {
  it("embeds long CJK text in token-safe chunks without any 400", async () => {
    const { fetchImpl, calls } = createMockFetch(1);
    const result = await embedTextWithFetch(
      "test-key",
      longText(CJK, 20_000),
      fetchImpl,
    );
    expect(result).not.toBeNull();
    expect(result?.length).toBe(EMBEDDING_DIMENSIONS);
    for (const call of calls) {
      expect(call.input.length).toBeLessThanOrEqual(EMBEDDING_MODEL_MAX_TOKENS);
    }
    // Averaged + L2-normalized
    const norm = Math.sqrt((result ?? []).reduce((s, v) => s + v * v, 0));
    expect(norm).toBeCloseTo(1, 5);
  });

  it("splits and retries when the provider rejects a chunk as too long", async () => {
    // Real tokenizer 1 token/char for Cyrillic: our 1/2 estimate runs low,
    // so first-pass chunks (~12k chars) get a 400 and must be halved.
    const { fetchImpl, calls } = createMockFetch(1);
    const text = longText(CYRILLIC, 30_000);
    const result = await embedTextWithFetch("test-key", text, fetchImpl);
    expect(result).not.toBeNull();
    const rejected = calls.filter(
      (c) => c.input.length > EMBEDDING_MODEL_MAX_TOKENS,
    );
    const accepted = calls.filter(
      (c) => c.input.length <= EMBEDDING_MODEL_MAX_TOKENS,
    );
    expect(rejected.length).toBeGreaterThan(0);
    // Every rejected chunk's text is covered by accepted sub-chunks.
    expect(accepted.map((c) => c.input).join("").length).toBe(text.length);
  });

  it("returns null when every call fails for a non-length reason", async () => {
    const handler = async (): Promise<Response> =>
      Response.json(
        { error: { message: "invalid api key" } },
        { status: 401, statusText: "Unauthorized" },
      );
    const fetchImpl = Object.assign(handler, { preconnect: fetch.preconnect });
    expect(
      await embedTextWithFetch("bad", longText(CJK, 20_000), fetchImpl),
    ).toBeNull();
  });
});
