import { describe, expect, test } from "bun:test";

import {
  buildSnapshot,
  diffSnapshots,
  finalizeEvents,
  type RegistryFileText,
} from "./extract";

interface FixtureModel {
  key: string;
  id: string;
  name: string;
  content?: "MAINSTREAM" | "OPEN" | "UNCENSORED";
  legacy?: boolean;
  input?: number;
  output?: number;
  adminOnly?: boolean;
}

/** Registry text in the same prettier shape as models-definitions.ts. */
function registry(
  models: readonly FixtureModel[],
  successors: readonly (readonly [string, string])[] = [],
): RegistryFileText {
  const enumLines = models.map((m) => `  ${m.key} = "${m.id}",`).join("\n");
  const blocks = models
    .map((m) =>
      [
        `  [ChatModelId.${m.key}]: {`,
        `    name: "${m.name}",`,
        `    by: "lab",`,
        `    providers: [`,
        `      {`,
        `        id: ChatModelId.${m.key},`,
        `        apiProvider: ApiProvider.OPENROUTER,`,
        `        providerModel: "x/${m.id}",`,
        `        creditCost: calculateCreditCost,`,
        `        inputTokenCost: ${m.input ?? 1}, // updated: 2026-11-21 from openrouter-api`,
        `        outputTokenCost: ${m.output ?? 2},`,
        ...(m.adminOnly === true ? [`        adminOnly: true,`] : []),
        `        longContextPricing: {`,
        `          minPromptTokens: 1000,`,
        `          inputTokenCost: 99,`,
        `          outputTokenCost: 99,`,
        `        },`,
        `      },`,
        `    ],`,
        `    utilities: [${m.legacy === true ? "ModelUtility.LEGACY, " : ""}ModelUtility.CHAT],`,
        `    content: ContentLevel.${m.content ?? "MAINSTREAM"},`,
        `  },`,
      ].join("\n"),
    )
    .join("\n");
  const successorLines = successors
    .map(([from, to]) => `  [ChatModelId.${from}]: ChatModelId.${to},`)
    .join("\n");
  return {
    type: "text",
    text: [
      `export enum ChatModelId {`,
      enumLines,
      `}`,
      ``,
      `export const chatModelDefinitions: Record<ChatModelId, ModelDefinition> = {`,
      blocks,
      `};`,
      ``,
      `export const chatModelSuccessors: Partial<Record<ChatModelId, ChatModelId>> = {`,
      successorLines,
      `};`,
      ``,
    ].join("\n"),
  };
}

describe("model changelog extraction", () => {
  test("parses id, name, tier, legacy flag and top-level provider prices", () => {
    const snapshot = buildSnapshot([
      registry([
        { key: "A", id: "model-a", name: "Model A", input: 0.5, output: 3 },
        {
          key: "B",
          id: "model-b",
          name: "Model B",
          content: "UNCENSORED",
          legacy: true,
        },
      ]),
    ]);
    const a = snapshot.models.get("text:model-a");
    expect(a?.name).toBe("Model A");
    expect(a?.content).toBe("mainstream");
    expect(a?.legacy).toBe(false);
    // longContextPricing (99) must not leak into the headline price
    expect(a?.prices).toEqual({ input: 0.5, output: 3 });
    expect(snapshot.models.get("text:model-b")?.legacy).toBe(true);
    expect(snapshot.models.get("text:model-b")?.content).toBe("uncensored");
  });

  test("admin-only models are not public", () => {
    const snapshot = buildSnapshot([
      registry([{ key: "A", id: "model-a", name: "A", adminOnly: true }]),
    ]);
    expect(snapshot.models.get("text:model-a")?.isPublic).toBe(false);
  });

  test("emits added, legacy with successor, tier and repriced events", () => {
    const before = buildSnapshot([
      registry([
        { key: "OLD", id: "old", name: "Old" },
        { key: "TIERED", id: "tiered", name: "Tiered", content: "OPEN" },
        { key: "PRICED", id: "priced", name: "Priced", input: 1, output: 2 },
      ]),
    ]);
    const after = buildSnapshot([
      registry(
        [
          { key: "OLD", id: "old", name: "Old", legacy: true },
          { key: "NEW", id: "new", name: "New" },
          { key: "TIERED", id: "tiered", name: "Tiered", content: "UNCENSORED" },
          { key: "PRICED", id: "priced", name: "Priced", input: 0.5, output: 2 },
        ],
        [["OLD", "NEW"]],
      ),
    ]);
    const events = diffSnapshots(before, after, "2026-11-21", "abc1234");
    const byId = new Map(events.map((e) => [`${e.type}:${e.modelId}`, e]));
    expect(byId.get("added:new")).toBeDefined();
    expect(byId.get("legacy:old")?.successorId).toBe("new");
    expect(byId.get("legacy:old")?.successorName).toBe("New");
    expect(byId.get("tier:tiered")?.fromContent).toBe("open");
    expect(byId.get("tier:tiered")?.content).toBe("uncensored");
    expect(byId.get("repriced:priced")?.priceChanges).toEqual([
      { metric: "input", from: 1, to: 0.5 },
    ]);
    expect(events).toHaveLength(4);
  });

  test("ignores sub-1% price noise and models added already legacy", () => {
    const before = buildSnapshot([
      registry([{ key: "A", id: "a", name: "A", input: 1, output: 2 }]),
    ]);
    const after = buildSnapshot([
      registry([
        { key: "A", id: "a", name: "A", input: 1.005, output: 2 },
        { key: "L", id: "l", name: "L", legacy: true },
      ]),
    ]);
    expect(diffSnapshots(before, after, "2026-11-21", "abc")).toEqual([]);
  });

  test("finalize merges same-day repricings, drops net-zero moves, sorts newest first", () => {
    const events = finalizeEvents([
      {
        date: "2026-11-20",
        commit: "a",
        type: "repriced",
        modelId: "m",
        modelType: "text",
        name: "M",
        content: "open",
        priceChanges: [{ metric: "input", from: 1, to: 2 }],
      },
      {
        date: "2026-11-20",
        commit: "b",
        type: "repriced",
        modelId: "m",
        modelType: "text",
        name: "M",
        content: "open",
        priceChanges: [{ metric: "input", from: 2, to: 1 }],
      },
      {
        date: "2026-11-21",
        commit: "c",
        type: "added",
        modelId: "n",
        modelType: "text",
        name: "N",
        content: "open",
      },
    ]);
    expect(events).toHaveLength(1);
    expect(events[0]?.modelId).toBe("n");
  });
});
