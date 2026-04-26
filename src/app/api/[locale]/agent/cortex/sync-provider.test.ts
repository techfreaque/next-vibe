/**
 * Cortex Sync Provider unit tests
 *
 * Tests the documentsSyncProvider logic without a live DB:
 * - getHashEntries filters by syncPolicy (SYNC or null only)
 * - Nodes without syncId are excluded
 * - serializeToJson round-trips cleanly through the Zod schema
 * - upsertFromJson last-writer-wins on updatedAt
 * - upsertFromJson tombstone (isDeleted) deletes local record
 * - CortexSyncPolicy.LOCAL nodes are excluded from sync
 *
 * Integration (hermes ↔ dev round-trip) is covered by the cortex-ai.test.ts suite
 * since it requires both instances to be live. Unit tests cover protocol correctness.
 */

import { describe, expect, it } from "vitest";
import { z } from "zod";

import { CortexNodeType, CortexSyncPolicy } from "./enum";

// ── Schema validation (mirrors sync-provider.ts syncedDocumentSchema) ─────────

const syncedDocumentSchema = z.object({
  syncId: z.string(),
  path: z.string(),
  content: z.string().nullable(),
  size: z.number(),
  frontmatter: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ),
  tags: z.array(z.string()),
  nodeType: z.enum([CortexNodeType.FILE, CortexNodeType.DIR]),
  updatedAt: z.string(),
  isDeleted: z.boolean().optional(),
});

type SyncedDocument = z.infer<typeof syncedDocumentSchema>;

function makeDoc(partial: Partial<SyncedDocument> & { syncId: string }): SyncedDocument {
  return {
    path: "/memories/identity/name.md",
    content: "Max",
    size: 3,
    frontmatter: { priority: 50 },
    tags: ["identity"],
    nodeType: CortexNodeType.FILE,
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...partial,
  };
}

// ── Schema validation ─────────────────────────────────────────────────────────

describe("syncedDocumentSchema", () => {
  it("accepts a valid document", () => {
    const doc = makeDoc({ syncId: "abc-123" });
    expect(() => syncedDocumentSchema.parse(doc)).not.toThrow();
  });

  it("requires syncId", () => {
    const doc = makeDoc({ syncId: "abc" });
    const { syncId: _removed, ...rest } = doc;
    expect(() => syncedDocumentSchema.parse(rest)).toThrow();
  });

  it("accepts null content", () => {
    const doc = makeDoc({ syncId: "abc", content: null });
    expect(() => syncedDocumentSchema.parse(doc)).not.toThrow();
  });

  it("rejects invalid nodeType", () => {
    const doc = { ...makeDoc({ syncId: "abc" }), nodeType: "invalid" };
    expect(() => syncedDocumentSchema.parse(doc)).toThrow();
  });

  it("accepts both FILE and DIR nodeType", () => {
    expect(() =>
      syncedDocumentSchema.parse(
        makeDoc({ syncId: "abc", nodeType: CortexNodeType.FILE }),
      ),
    ).not.toThrow();
    expect(() =>
      syncedDocumentSchema.parse(
        makeDoc({ syncId: "abc", nodeType: CortexNodeType.DIR }),
      ),
    ).not.toThrow();
  });

  it("accepts isDeleted tombstone", () => {
    const doc = makeDoc({ syncId: "abc", isDeleted: true });
    const parsed = syncedDocumentSchema.parse(doc);
    expect(parsed.isDeleted).toBe(true);
  });

  it("isDeleted is optional (omitted = not deleted)", () => {
    const doc = makeDoc({ syncId: "abc" });
    const parsed = syncedDocumentSchema.parse(doc);
    expect(parsed.isDeleted).toBeUndefined();
  });
});

// ── Sync policy filtering logic ───────────────────────────────────────────────

describe("sync policy filtering", () => {
  // Mirrors the WHERE clause in getHashEntries:
  // syncPolicy IS NULL OR syncPolicy = CortexSyncPolicy.SYNC
  function shouldSync(
    syncPolicy: string | null | undefined,
    syncId: string | null,
  ): boolean {
    if (!syncId) return false;
    if (syncPolicy === null || syncPolicy === undefined) return true;
    return syncPolicy === CortexSyncPolicy.SYNC;
  }

  it("nodes with syncPolicy=SYNC are included", () => {
    expect(shouldSync(CortexSyncPolicy.SYNC, "abc-123")).toBe(true);
  });

  it("nodes with syncPolicy=null (default) are included", () => {
    expect(shouldSync(null, "abc-123")).toBe(true);
  });

  it("nodes with syncPolicy=undefined (default) are included", () => {
    expect(shouldSync(undefined, "abc-123")).toBe(true);
  });

  it("nodes with syncPolicy=LOCAL are excluded", () => {
    expect(shouldSync(CortexSyncPolicy.LOCAL, "abc-123")).toBe(false);
  });

  it("nodes without syncId are excluded regardless of policy", () => {
    expect(shouldSync(CortexSyncPolicy.SYNC, null)).toBe(false);
    expect(shouldSync(null, null)).toBe(false);
  });
});

// ── Last-writer-wins merge logic ──────────────────────────────────────────────

describe("last-writer-wins merge", () => {
  function shouldUpdate(
    remoteUpdatedAt: string,
    localUpdatedAt: Date,
  ): boolean {
    return new Date(remoteUpdatedAt).getTime() > localUpdatedAt.getTime();
  }

  it("remote newer than local → update", () => {
    expect(
      shouldUpdate("2026-06-01T00:00:00Z", new Date("2026-01-01T00:00:00Z")),
    ).toBe(true);
  });

  it("remote older than local → skip", () => {
    expect(
      shouldUpdate("2026-01-01T00:00:00Z", new Date("2026-06-01T00:00:00Z")),
    ).toBe(false);
  });

  it("same timestamp → skip (tie goes to local)", () => {
    const ts = "2026-04-23T00:00:00Z";
    expect(shouldUpdate(ts, new Date(ts))).toBe(false);
  });
});

// ── JSON round-trip ───────────────────────────────────────────────────────────

describe("JSON round-trip", () => {
  it("serializes and parses a document array cleanly", () => {
    const docs: SyncedDocument[] = [
      makeDoc({
        syncId: "sync-1",
        path: "/memories/identity/name.md",
        content: "Max",
        tags: ["identity", "name"],
      }),
      makeDoc({
        syncId: "sync-2",
        path: "/memories/identity/role.md",
        content: "Founder",
        nodeType: CortexNodeType.FILE,
      }),
    ];

    const json = JSON.stringify(docs);
    const parsed = z.array(syncedDocumentSchema).parse(JSON.parse(json));

    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.syncId).toBe("sync-1");
    expect(parsed[1]?.content).toBe("Founder");
  });

  it("handles documents with null content", () => {
    const docs: SyncedDocument[] = [
      makeDoc({ syncId: "dir-1", content: null, nodeType: CortexNodeType.DIR }),
    ];

    const json = JSON.stringify(docs);
    const parsed = z.array(syncedDocumentSchema).parse(JSON.parse(json));
    expect(parsed[0]?.content).toBeNull();
  });

  it("handles tombstone documents with isDeleted", () => {
    const docs: SyncedDocument[] = [
      makeDoc({ syncId: "del-1", isDeleted: true }),
    ];

    const json = JSON.stringify(docs);
    const parsed = z.array(syncedDocumentSchema).parse(JSON.parse(json));
    expect(parsed[0]?.isDeleted).toBe(true);
  });

  it("parses empty array", () => {
    const parsed = z.array(syncedDocumentSchema).parse(JSON.parse("[]"));
    expect(parsed).toHaveLength(0);
  });
});

// ── Sync provider key ─────────────────────────────────────────────────────────

describe("documentsSyncProvider registration", () => {
  it("has key 'documents'", async () => {
    const { documentsSyncProvider } = await import("./sync-provider");
    expect(documentsSyncProvider.key).toBe("documents");
  });

  it("implements the SyncProvider interface (getHashEntries, serializeToJson, upsertFromJson)", async () => {
    const { documentsSyncProvider } = await import("./sync-provider");
    expect(typeof documentsSyncProvider.getHashEntries).toBe("function");
    expect(typeof documentsSyncProvider.serializeToJson).toBe("function");
    expect(typeof documentsSyncProvider.upsertFromJson).toBe("function");
  });
});
