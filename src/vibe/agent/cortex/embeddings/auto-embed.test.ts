/**
 * Embedding auto-embed unit tests
 *
 * Tests:
 * - computeEmbeddingHash produces consistent SHA-256 hashes
 * - Same content produces same hash (skip signal)
 * - Different content produces different hash (re-embed signal)
 * - Path change alone produces different hash (move invalidation)
 * - queueEmbedding fires non-blocking (setTimeout 0)
 *
 * Note: embedNode itself is async and calls DB + API - those paths are covered
 * by integration tests (cortex-ai.test.ts). Here we test the hash math and
 * the public surface (computeEmbeddingHash) which is the skip gate.
 */

import { describe, expect, it, vi } from "vitest";

import { computeEmbeddingHash } from "./service";

// ── Hash determinism ──────────────────────────────────────────────────────────

describe("computeEmbeddingHash", () => {
  it("is deterministic - same input produces same hash", () => {
    const h1 = computeEmbeddingHash("/memories/identity/name.md", "Max");
    const h2 = computeEmbeddingHash("/memories/identity/name.md", "Max");
    expect(h1).toBe(h2);
  });

  it("produces a 64-char hex string (SHA-256)", () => {
    const hash = computeEmbeddingHash("/some/path.md", "content");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("same path + different content → different hash", () => {
    const h1 = computeEmbeddingHash("/path.md", "version 1");
    const h2 = computeEmbeddingHash("/path.md", "version 2");
    expect(h1).not.toBe(h2);
  });

  it("different path + same content → different hash", () => {
    const h1 = computeEmbeddingHash("/memories/a.md", "same content");
    const h2 = computeEmbeddingHash("/memories/b.md", "same content");
    expect(h1).not.toBe(h2);
  });

  it("path change on move invalidates embedding (path affects hash)", () => {
    const originalPath = "/documents/projects/auth.md";
    const movedPath = "/documents/archive/auth.md";
    const content = "Authentication design notes";

    const hashBefore = computeEmbeddingHash(originalPath, content);
    const hashAfter = computeEmbeddingHash(movedPath, content);

    expect(hashBefore).not.toBe(hashAfter);
  });

  it("embeds path + newline + content combined", () => {
    // The embedded text is `${path}\n\n${content}` - verify by checking
    // that path-only and content-only both affect the result
    const pathHash = computeEmbeddingHash("/path.md", "");
    const contentHash = computeEmbeddingHash("", "content");
    const combinedHash = computeEmbeddingHash("/path.md", "content");

    expect(combinedHash).not.toBe(pathHash);
    expect(combinedHash).not.toBe(contentHash);
    expect(pathHash).not.toBe(contentHash);
  });

  it("empty path and empty content still produces a valid hash", () => {
    const hash = computeEmbeddingHash("", "");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

// ── queueEmbedding non-blocking ───────────────────────────────────────────────

describe("queueEmbedding fires non-blocking", () => {
  it("calls setTimeout with 0 delay (fire-and-forget)", async () => {
    // We can't easily mock DB in unit tests, but we can verify the fire-and-forget
    // pattern by checking that queueEmbedding returns void synchronously.
    // The actual embedNode async is best-effort (see integration tests).

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");

    // Lazy import to avoid server-only boundary issues in test runner
    const { queueEmbedding } = await import("./auto-embed");

    queueEmbedding("test-id", "/memories/test.md", "test content");

    // Should have scheduled a callback with 0 delay
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 0);

    setTimeoutSpy.mockRestore();
  });
});
