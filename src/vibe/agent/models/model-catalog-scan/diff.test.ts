/**
 * Model catalog scan diff - pure tests (no network, no DB).
 */

import { describe, expect, it } from "vitest";

import { ChatModelId } from "../../ai-stream/models";
import { ApiProvider, calculateCreditCost } from "../models";
import type { CatalogProviderRef } from "./diff";
import {
  collectCatalogRefs,
  composeReportText,
  findDeprecations,
  findMissingUpstream,
  findNewModels,
  findObservedCostGaps,
  findPriceChanges,
  isUnderPriced,
  type ObservedCostSample,
} from "./diff";
import type { UpstreamListing, UpstreamModel } from "./sources";

function upstream(
  id: string,
  overrides: Partial<UpstreamModel> = {},
): UpstreamModel {
  return {
    id,
    name: id,
    kind: "chat",
    createdAt: new Date("2026-11-10T00:00:00Z"),
    inputUsdPer1M: 1,
    outputUsdPer1M: 2,
    contextWindow: 1000,
    expiresAt: null,
    uncensored: false,
    ...overrides,
  };
}

function ref(
  providerModel: string,
  overrides: Partial<CatalogProviderRef> = {},
): CatalogProviderRef {
  return {
    modelId: `ours-${providerModel}`,
    role: "chat",
    apiProvider: ApiProvider.OPENROUTER,
    providerModel,
    legacy: false,
    contextWindow: 1000,
    config: {
      id: ChatModelId.GLM_5_3,
      apiProvider: ApiProvider.OPENROUTER,
      providerModel,
      creditCost: calculateCreditCost,
      inputTokenCost: 1,
      outputTokenCost: 2,
    },
    ...overrides,
  };
}

const since = new Date("2026-11-07T00:00:00Z");

describe("findNewModels", () => {
  it("reports only unknown ids created after the cutoff, deduped", () => {
    const listings: UpstreamListing[] = [
      {
        source: "openrouter",
        apiProvider: ApiProvider.OPENROUTER,
        ok: true,
        error: null,
        models: [
          upstream("known-model"),
          upstream("new/model"),
          upstream("old/model", { createdAt: new Date("2026-10-01T00:00:00Z") }),
          upstream("undated/model", { createdAt: null }),
        ],
      },
      {
        source: "openrouter-images",
        apiProvider: ApiProvider.OPENROUTER,
        ok: true,
        error: null,
        models: [
          upstream("new/model", { kind: "image" }),
          upstream("router/decider", { kind: "other" }),
        ],
      },
      {
        source: "nano-gpt",
        apiProvider: ApiProvider.NANO_GPT,
        ok: true,
        error: null,
        models: [
          // mirror of an OpenRouter model: skipped
          upstream("new/model"),
          // mirror, but uncensored: kept
          upstream("new/model-abliterated", { uncensored: true }),
          // a model we serve on OpenRouter, mirrored under another prefix
          upstream("other-host/known.model"),
        ],
      },
      {
        source: "venice",
        apiProvider: ApiProvider.VENICE_AI,
        ok: true,
        error: null,
        // Venice spelling of new/model: skipped as a mirror
        models: [upstream("model")],
      },
    ];
    const result = findNewModels(listings, [ref("known-model")], since);
    expect(result.map((m) => m.providerModel)).toEqual([
      "new/model",
      "new/model-abliterated",
    ]);
    expect(result[0]?.source).toBe("openrouter");
  });

  it("skips failed listings", () => {
    const result = findNewModels(
      [
        {
          source: "venice",
          apiProvider: ApiProvider.VENICE_AI,
          ok: false,
          error: "down",
          models: [upstream("x")],
        },
      ],
      [],
      since,
    );
    expect(result).toEqual([]);
  });
});

describe("findMissingUpstream", () => {
  it("flags ids gone from a fully loaded provider, current models first", () => {
    const listings: UpstreamListing[] = [
      {
        source: "openrouter",
        apiProvider: ApiProvider.OPENROUTER,
        ok: true,
        error: null,
        models: [upstream("still/here")],
      },
    ];
    const result = findMissingUpstream(listings, [
      ref("still/here"),
      ref("gone/legacy", { legacy: true }),
      ref("gone/current"),
      // NanoGPT is not listed in this run: never judged
      ref("nano/model", { apiProvider: ApiProvider.NANO_GPT }),
    ]);
    expect(result.map((m) => m.providerModel)).toEqual([
      "gone/current",
      "gone/legacy",
    ]);
  });

  it("never judges a provider with a failed listing", () => {
    const listings: UpstreamListing[] = [
      {
        source: "openrouter",
        apiProvider: ApiProvider.OPENROUTER,
        ok: true,
        error: null,
        models: [],
      },
      {
        source: "openrouter-videos",
        apiProvider: ApiProvider.OPENROUTER,
        ok: false,
        error: "503",
        models: [],
      },
    ];
    expect(findMissingUpstream(listings, [ref("gone/model")])).toEqual([]);
  });

  it("ignores roles the provider list does not cover", () => {
    const listings: UpstreamListing[] = [
      {
        source: "nano-gpt",
        apiProvider: ApiProvider.NANO_GPT,
        ok: true,
        error: null,
        models: [],
      },
    ];
    expect(
      findMissingUpstream(listings, [
        ref("Kokoro-82m:af_bella", {
          apiProvider: ApiProvider.NANO_GPT,
          role: "tts",
        }),
      ]),
    ).toEqual([]);
  });
});

describe("findDeprecations", () => {
  it("returns shutdown dates only for ids we reference", () => {
    const listings: UpstreamListing[] = [
      {
        source: "openrouter",
        apiProvider: ApiProvider.OPENROUTER,
        ok: true,
        error: null,
        models: [
          upstream("ours/expiring", { expiresAt: "2026-12-01" }),
          upstream("theirs/expiring", { expiresAt: "2026-11-20" }),
        ],
      },
    ];
    const result = findDeprecations(listings, [ref("ours/expiring")]);
    expect(result).toHaveLength(1);
    expect(result[0]?.expiresAt).toBe("2026-12-01");
  });
});

describe("findPriceChanges", () => {
  it("reports drift above the threshold and ignores tiny or unknown fields", () => {
    const refs = [ref("a/model"), ref("b/model")];
    const result = findPriceChanges(
      [
        {
          modelId: "ours-a/model",
          name: "A",
          provider: ApiProvider.OPENROUTER,
          field: "inputTokenCost",
          value: 1.5,
          source: "openrouter-api",
          providerModel: "a/model",
        },
        {
          modelId: "ours-b/model",
          name: "B",
          provider: ApiProvider.OPENROUTER,
          field: "outputTokenCost",
          value: 2.001,
          source: "openrouter-api",
          providerModel: "b/model",
        },
        {
          modelId: "ours-b/model",
          name: "B",
          provider: ApiProvider.OPENROUTER,
          field: "cacheReadTokenCost",
          value: 0.1,
          source: "openrouter-api",
          providerModel: "b/model",
        },
        {
          modelId: "ours-a/model",
          name: "A",
          provider: ApiProvider.OPENROUTER,
          field: "contextWindow",
          value: 2000,
          source: "openrouter-api",
          enumKey: "A",
        },
      ],
      refs,
    );
    expect(
      result.map((c) => [c.providerModel, c.field, c.changePercent, c.suspect]),
    ).toEqual([
      ["a/model", "contextWindow", 100, false],
      ["a/model", "inputTokenCost", 50, false],
    ]);
  });
});

describe("catalog + report text", () => {
  it("collects refs from every modality", () => {
    const refs = collectCatalogRefs();
    const roles = new Set(refs.map((r) => r.role));
    expect(roles.has("chat")).toBe(true);
    expect(roles.has("image")).toBe(true);
    expect(roles.has("video")).toBe(true);
    expect(refs.every((r) => r.providerModel.length > 0)).toBe(true);
  });

  it("composes a subject with the counts and no em dashes", () => {
    const text = composeReportText(
      {
        newSince: "2026-11-07T00:00:00.000Z",
        newModels: [],
        priceChanges: [],
        missingUpstream: [],
        deprecations: [],
        sources: [{ source: "openrouter", ok: true, modelCount: 1, error: null }],
      },
      new Date("2026-11-13T06:40:00Z"),
    );
    expect(text.subject).toContain("2026-11-13");
    expect(text.subject).toContain("0 new");
    expect(text.body).not.toContain("—");
  });
});

describe("findObservedCostGaps", () => {
  // Listed $1 in / $2 out per 1M. 100k prompt + 50k completion = $0.2 listed.
  const refs = [ref("a/model"), ref("b/model")];

  /** A turn charged `ratio` x listed, as the stored credit charge. */
  function turn(
    modelId: string,
    ratio: number,
    overrides: Partial<ObservedCostSample> = {},
  ): ObservedCostSample {
    const listedUsd = 0.2;
    return {
      modelId,
      promptTokens: 100_000,
      completionTokens: 50_000,
      cachedInputTokens: 0,
      cacheWriteTokens: 0,
      // observed USD = (credits - 0.1) * 0.01 / 1.3
      creditCost: (listedUsd * ratio * 1.3) / 0.01 + 0.1,
      ...overrides,
    };
  }

  it("reports a model whose turns cost more than its listed price", () => {
    const samples = [
      ...Array.from({ length: 12 }, () => turn("ours-a/model", 2.4)),
      ...Array.from({ length: 12 }, () => turn("ours-b/model", 1)),
    ];
    const result = findObservedCostGaps(samples, refs);
    expect(result).toHaveLength(1);
    expect(result[0]?.modelId).toBe("ours-a/model");
    expect(result[0]?.medianRatio).toBe(2.4);
    expect(result[0]?.samples).toBe(12);
  });

  it("needs enough samples and ignores multi-step and tiny turns", () => {
    const samples = [
      ...Array.from({ length: 9 }, () => turn("ours-a/model", 3)),
      // Cached above the last step's prompt: a multi-step turn.
      ...Array.from({ length: 5 }, () =>
        turn("ours-a/model", 3, { cachedInputTokens: 200_000 }),
      ),
      ...Array.from({ length: 5 }, () =>
        turn("ours-a/model", 3, { creditCost: 0.3 }),
      ),
    ];
    expect(findObservedCostGaps(samples, refs)).toEqual([]);
  });

  it("skips relay-only and flat-priced models", () => {
    const relay = ref("relay/model", {
      apiProvider: ApiProvider.UNBOTTLED,
      config: {
        id: ChatModelId.GLM_5_3,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "relay/model",
        creditCost: calculateCreditCost,
        inputTokenCost: 1,
        outputTokenCost: 2,
      },
    });
    const flat = ref("flat/model", {
      config: {
        id: ChatModelId.GLM_5_3,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "flat/model",
        creditCost: 5,
      },
    });
    const samples = [
      ...Array.from({ length: 12 }, () => turn("ours-relay/model", 3)),
      ...Array.from({ length: 12 }, () => turn("ours-flat/model", 3)),
    ];
    expect(findObservedCostGaps(samples, [relay, flat])).toEqual([]);
  });
});

describe("under-priced markers", () => {
  it("flags a live price above the listed one", () => {
    const change = {
      modelId: "m",
      apiProvider: "openrouter",
      providerModel: "a/model",
      field: "inputTokenCost",
      oldValue: 1.25,
      newValue: 3,
      changePercent: 140,
      suspect: false,
      source: "nano-gpt-api",
    };
    expect(isUnderPriced(change)).toBe(true);
    expect(isUnderPriced({ ...change, oldValue: 3, newValue: 1.25 })).toBe(
      false,
    );
    expect(
      isUnderPriced({ ...change, field: "contextWindow", newValue: 9 }),
    ).toBe(false);

    const text = composeReportText(
      {
        newSince: "2026-11-07T00:00:00.000Z",
        newModels: [],
        priceChanges: [change],
        missingUpstream: [],
        deprecations: [],
        observedCostGaps: [
          {
            modelId: "g",
            apiProvider: "nano-gpt",
            providerModel: "z/g",
            samples: 20,
            medianRatio: 2.4,
            listedUsd: 1,
            observedUsd: 2.4,
          },
        ],
        sources: [],
      },
      new Date("2026-11-25T06:40:00Z"),
    );
    expect(text.subject).toContain("2 UNDER-PRICED");
    expect(text.body).toContain("[UNDER-PRICED, listed below live] m");
    expect(text.body).toContain("LISTED BELOW OBSERVED COST (1");
    expect(text.body).toContain("2.4x the listed price");
  });
});
