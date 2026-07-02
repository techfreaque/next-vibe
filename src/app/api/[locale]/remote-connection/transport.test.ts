/**
 * RemoteTransport routing logic unit tests
 *
 * Tests the routing priority logic in isolation, without a live DB.
 * The priority ordering is:
 * 0. forceSystemProvider = true  (admin override — beats everything)
 * 1. explicit instanceId
 * 2. REMOTE root folder → instance subfolder (deterministic, tested in DB tests)
 * 3. null → run locally
 *
 * We test the matching logic directly by simulating the same conditions
 * that resolveTarget() evaluates — no DB connection needed.
 */

import { describe, expect, it } from "vitest";

// ─── Mirror the internal resolution logic from transport.ts ──────────────────

interface MockRow {
  instanceId: string;
  token: string;
  forceSystemProvider: boolean;
}

function resolveByPriority(
  rows: MockRow[],
  params: {
    instanceId?: string;
  },
): MockRow | null {
  const activeRows = rows.filter((r) => r.token);
  if (activeRows.length === 0) {return null;}

  // 0. forceSystemProvider — admin override, beats all per-user routing
  const forcedMatch = activeRows.find((r) => r.forceSystemProvider);
  if (forcedMatch) {return forcedMatch;}

  // 1. Explicit instanceId override
  if (params.instanceId) {
    return activeRows.find((r) => r.instanceId === params.instanceId) ?? null;
  }

  // 2. REMOTE root folder lookup is tested in DB-layer tests (route.transport.test.ts)

  return null;
}

function makeRow(
  instanceId: string,
  forceSystemProvider = false,
): MockRow {
  return {
    instanceId,
    token: "tok",
    forceSystemProvider,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("resolveTarget routing priority", () => {
  it("returns null when no rows exist", () => {
    expect(resolveByPriority([], {})).toBeNull();
  });

  it("returns null when all tokens are empty", () => {
    const row = makeRow("A");
    row.token = "";
    expect(resolveByPriority([row], {})).toBeNull();
  });

  it("priority 1: explicit instanceId matches correct row", () => {
    const rowA = makeRow("A");
    const rowB = makeRow("B");
    const result = resolveByPriority([rowA, rowB], { instanceId: "B" });
    expect(result?.instanceId).toBe("B");
  });

  it("priority 1: explicit instanceId not found returns null", () => {
    const result = resolveByPriority([makeRow("A")], { instanceId: "missing" });
    expect(result).toBeNull();
  });

  it("returns null when no instanceId and no forceSystemProvider", () => {
    const result = resolveByPriority([makeRow("A"), makeRow("B")], {});
    expect(result).toBeNull();
  });

  it("priority 0: forceSystemProvider beats explicit instanceId", () => {
    const forcedRow = makeRow("forced", true);
    const targetRow = makeRow("target");
    const result = resolveByPriority([targetRow, forcedRow], {
      instanceId: "target",
    });
    expect(
      result?.instanceId,
      `forceSystemProvider row should win over explicit instanceId="target" — got instanceId=${result?.instanceId ?? "null"}`,
    ).toBe("forced");
  });

  it("priority 0: forceSystemProvider wins when no other match", () => {
    const forcedRow = makeRow("forced", true);
    const normalRow = makeRow("normal");
    const result = resolveByPriority([normalRow, forcedRow], {});
    expect(result?.instanceId).toBe("forced");
  });

  it("explicit instanceId pointing to row with empty token → returns null", () => {
    const row = makeRow("A");
    row.token = "";
    const result = resolveByPriority([row], { instanceId: "A" });
    expect(result).toBeNull();
  });
});

// ─── ToolSourceSchema validation ─────────────────────────────────────────────

describe("ToolSourceSchema", () => {
  it("accepts valid values", async () => {
    const { ToolSourceSchema } = await import(
      "./db"
    );
    expect(ToolSourceSchema.parse("local")).toBe("local");
    expect(ToolSourceSchema.parse("remote")).toBe("remote");
    expect(ToolSourceSchema.parse("both")).toBe("both");
  });

  it("rejects unknown values", async () => {
    const { ToolSourceSchema } = await import(
      "./db"
    );
    expect(() => ToolSourceSchema.parse("cloud")).toThrow();
  });
});
