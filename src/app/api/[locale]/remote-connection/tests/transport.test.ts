/**
 * RemoteTransport routing logic unit tests
 *
 * Tests the routing rule priority logic in isolation, without a live DB.
 * The priority ordering is:
 * 0. forceSystemProvider = true  (admin override — beats everything)
 * 1. explicit instanceId
 * 2. routingRules.folderIds contains folderId
 * 3. routingRules.handlesModelProviders contains modelProvider
 * 4. routingRules.isDefault = true
 * 5. null → run locally
 *
 * We test the matching logic directly by simulating the same conditions
 * that resolveTarget() evaluates — no DB connection needed.
 */

import { describe, expect, it } from "vitest";

import type { RoutingRules } from "@/app/api/[locale]/remote-connection/db";

// ─── Mirror the internal resolution logic from transport.ts ──────────────────
// This tests the routing rule evaluation in isolation.

interface MockRow {
  instanceId: string;
  token: string;
  routingRules: RoutingRules | null;
  forceSystemProvider: boolean;
}

function resolveByPriority(
  rows: MockRow[],
  params: {
    instanceId?: string;
    folderId?: string;
    modelProvider?: string;
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

  // 2. folderIds match
  if (params.folderId) {
    const match = activeRows.find((r) => {
      return r.routingRules?.folderIds?.includes(params.folderId!);
    });
    if (match) {return match;}
  }

  // 3. handlesModelProviders match
  if (params.modelProvider) {
    const match = activeRows.find((r) => {
      return r.routingRules?.handlesModelProviders?.includes(params.modelProvider!);
    });
    if (match) {return match;}
  }

  // 4. isDefault = true
  const defaultMatch = activeRows.find((r) => r.routingRules?.isDefault === true);
  if (defaultMatch) {return defaultMatch;}

  return null;
}

function makeRow(
  instanceId: string,
  rules?: Partial<RoutingRules> | null,
  forceSystemProvider = false,
): MockRow {
  return {
    instanceId,
    token: "tok",
    routingRules: rules !== null
      ? {
          folderIds: rules?.folderIds ?? [],
          handlesModelProviders: rules?.handlesModelProviders ?? [],
          isDefault: rules?.isDefault ?? false,
        }
      : null,
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

  it("priority 1: explicit instanceId wins over folderIds match", () => {
    const folderRow = makeRow("folder", { folderIds: ["support"] });
    const targetRow = makeRow("target");
    const result = resolveByPriority([folderRow, targetRow], {
      instanceId: "target",
      folderId: "support",
    });
    expect(result?.instanceId).toBe("target");
  });

  it("priority 1: explicit instanceId wins over isDefault", () => {
    const defaultRow = makeRow("default", { isDefault: true });
    const targetRow = makeRow("target");
    const result = resolveByPriority([defaultRow, targetRow], {
      instanceId: "target",
    });
    expect(result?.instanceId).toBe("target");
  });

  it("priority 1: explicit instanceId not found returns null", () => {
    const result = resolveByPriority([makeRow("A")], { instanceId: "missing" });
    expect(result).toBeNull();
  });

  it("priority 2: folderIds match wins over handlesModelProviders", () => {
    const folderRow = makeRow("folder", { folderIds: ["support"] });
    const modelRow = makeRow("model", { handlesModelProviders: ["UNBOTTLED"] });
    const result = resolveByPriority([folderRow, modelRow], {
      folderId: "support",
      modelProvider: "UNBOTTLED",
    });
    expect(result?.instanceId).toBe("folder");
  });

  it("priority 2: folderIds match wins over isDefault", () => {
    const folderRow = makeRow("folder", { folderIds: ["support"] });
    const defaultRow = makeRow("default", { isDefault: true });
    const result = resolveByPriority([defaultRow, folderRow], {
      folderId: "support",
    });
    expect(result?.instanceId).toBe("folder");
  });

  it("priority 2: no folderId provided — folderIds row skipped", () => {
    const folderRow = makeRow("folder", { folderIds: ["support"] });
    const defaultRow = makeRow("default", { isDefault: true });
    const result = resolveByPriority([folderRow, defaultRow], {});
    expect(result?.instanceId).toBe("default");
  });

  it("priority 3: handlesModelProviders wins over isDefault", () => {
    const modelRow = makeRow("model", { handlesModelProviders: ["UNBOTTLED"] });
    const defaultRow = makeRow("default", { isDefault: true });
    const result = resolveByPriority([defaultRow, modelRow], {
      modelProvider: "UNBOTTLED",
    });
    expect(result?.instanceId).toBe("model");
  });

  it("priority 3: no modelProvider provided — model row skipped", () => {
    const modelRow = makeRow("model", { handlesModelProviders: ["UNBOTTLED"] });
    const defaultRow = makeRow("default", { isDefault: true });
    const result = resolveByPriority([modelRow, defaultRow], {});
    expect(result?.instanceId).toBe("default");
  });

  it("priority 4: isDefault fallback when nothing else matches", () => {
    const defaultRow = makeRow("default", { isDefault: true });
    const otherRow = makeRow("other", { folderIds: ["other-folder"] });
    const result = resolveByPriority([otherRow, defaultRow], {});
    expect(result?.instanceId).toBe("default");
  });

  it("priority 0: forceSystemProvider beats explicit instanceId", () => {
    const forcedRow = makeRow("forced", null, true);
    const targetRow = makeRow("target");
    const result = resolveByPriority([targetRow, forcedRow], {
      instanceId: "target",
    });
    expect(result?.instanceId,
      `forceSystemProvider row should win over explicit instanceId="target" — got instanceId=${result?.instanceId ?? "null"}`
    ).toBe("forced");
  });

  it("priority 0: forceSystemProvider beats folderIds match", () => {
    const forcedRow = makeRow("forced", null, true);
    const folderRow = makeRow("folder", { folderIds: ["support"] });
    const result = resolveByPriority([folderRow, forcedRow], {
      folderId: "support",
    });
    expect(result?.instanceId,
      `forceSystemProvider row should win over folderIds match — got instanceId=${result?.instanceId ?? "null"}`
    ).toBe("forced");
  });

  it("priority 0: forceSystemProvider beats isDefault", () => {
    const forcedRow = makeRow("forced", null, true);
    const defaultRow = makeRow("default", { isDefault: true });
    const result = resolveByPriority([defaultRow, forcedRow], {});
    expect(result?.instanceId,
      `forceSystemProvider row should win over isDefault — got instanceId=${result?.instanceId ?? "null"}`
    ).toBe("forced");
  });

  it("returns null when no rule matches and no default or system provider", () => {
    const row = makeRow("A", { folderIds: ["private"] });
    const result = resolveByPriority([row], { folderId: "support" });
    expect(result).toBeNull();
  });

  it("first row wins among equal priority (folderIds)", () => {
    const rowA = makeRow("A", { folderIds: ["support"] });
    const rowB = makeRow("B", { folderIds: ["support"] });
    const result = resolveByPriority([rowA, rowB], { folderId: "support" });
    expect(result?.instanceId).toBe("A");
  });

  it("multiple folderIds per connection: any match wins", () => {
    const row = makeRow("A", { folderIds: ["team", "support", "archive"] });
    const result = resolveByPriority([row], { folderId: "support" });
    expect(result?.instanceId).toBe("A");
  });

  it("multiple handlesModelProviders: any match wins", () => {
    const row = makeRow("A", { handlesModelProviders: ["OPENAI", "UNBOTTLED", "ANTHROPIC"] });
    const result = resolveByPriority([row], { modelProvider: "UNBOTTLED" });
    expect(result?.instanceId).toBe("A");
  });

  it("two rows both have folderIds match → first in array order wins", () => {
    const rowA = makeRow("A", { folderIds: ["support"] });
    const rowB = makeRow("B", { folderIds: ["support"] });
    const result = resolveByPriority([rowA, rowB], { folderId: "support" });
    expect(result?.instanceId).toBe("A");
  });

  it("forceSystemProvider=true with routingRules present — still wins at priority 0 regardless", () => {
    const forcedRow = makeRow("forced", { folderIds: ["other"], isDefault: false }, true);
    const noMatchRow = makeRow("normal", { folderIds: ["different"] });
    const result = resolveByPriority([noMatchRow, forcedRow], { folderId: "support" });
    expect(result?.instanceId,
      `forceSystemProvider row should win regardless of routing rule mismatch — got instanceId=${result?.instanceId ?? "null"}`
    ).toBe("forced");
  });

  it("row with empty string token → not selected even if routing rules match", () => {
    const row = makeRow("A", { folderIds: ["support"] });
    row.token = "";
    const result = resolveByPriority([row], { folderId: "support" });
    expect(result).toBeNull();
  });

  it("explicit instanceId pointing to row with empty token → returns null", () => {
    const row = makeRow("A");
    row.token = "";
    const result = resolveByPriority([row], { instanceId: "A" });
    expect(result).toBeNull();
  });
});

// ─── RoutingRulesSchema validation ───────────────────────────────────────────

describe("RoutingRulesSchema", () => {
  it("parses a complete routing rules object", async () => {
    const { RoutingRulesSchema } = await import(
      "@/app/api/[locale]/remote-connection/db"
    );
    const parsed = RoutingRulesSchema.parse({
      folderIds: ["support", "team"],
      handlesModelProviders: ["UNBOTTLED"],
      isDefault: true,
    });
    expect(parsed.folderIds).toEqual(["support", "team"]);
    expect(parsed.handlesModelProviders).toEqual(["UNBOTTLED"]);
    expect(parsed.isDefault).toBe(true);
  });

  it("applies defaults for missing fields", async () => {
    const { RoutingRulesSchema } = await import(
      "@/app/api/[locale]/remote-connection/db"
    );
    const parsed = RoutingRulesSchema.parse({});
    expect(parsed.folderIds).toEqual([]);
    expect(parsed.handlesModelProviders).toEqual([]);
    expect(parsed.isDefault).toBe(false);
  });

  it("rejects non-array folderIds", async () => {
    const { RoutingRulesSchema } = await import(
      "@/app/api/[locale]/remote-connection/db"
    );
    expect(() => RoutingRulesSchema.parse({ folderIds: "support" })).toThrow();
  });

  it("parse({}) produces canonical defaults", async () => {
    const { RoutingRulesSchema } = await import(
      "@/app/api/[locale]/remote-connection/db"
    );
    const parsed = RoutingRulesSchema.parse({});
    expect(parsed).toEqual({ folderIds: [], handlesModelProviders: [], isDefault: false });
  });

  it("strips unknown keys and keeps valid fields", async () => {
    const { RoutingRulesSchema } = await import(
      "@/app/api/[locale]/remote-connection/db"
    );
    const parsed = RoutingRulesSchema.parse({ unknownKey: "x", folderIds: ["a"] });
    expect(parsed.folderIds).toEqual(["a"]);
    expect(Object.prototype.hasOwnProperty.call(parsed, "unknownKey")).toBe(false);
  });
});

// ─── ToolSourceSchema validation ─────────────────────────────────────────────

describe("ToolSourceSchema", () => {
  it("accepts valid values", async () => {
    const { ToolSourceSchema } = await import(
      "@/app/api/[locale]/remote-connection/db"
    );
    expect(ToolSourceSchema.parse("local")).toBe("local");
    expect(ToolSourceSchema.parse("remote")).toBe("remote");
    expect(ToolSourceSchema.parse("both")).toBe("both");
  });

  it("rejects unknown values", async () => {
    const { ToolSourceSchema } = await import(
      "@/app/api/[locale]/remote-connection/db"
    );
    expect(() => ToolSourceSchema.parse("cloud")).toThrow();
  });
});
