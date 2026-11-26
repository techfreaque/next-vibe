/**
 * Regression tests for `vibe update-model-prices --write` (2026-11-26):
 * the run rewrote every UNBOTTLED relay row (dropping supportedSizes,
 * supportedAspectRatios and allowedPassthroughParameters), reformatted and
 * re-dated unchanged settings, and wrote Seedance's 480p rate as its base.
 */

import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { VideoGenModelId } from "../../video-generation/models";
import { ApiProvider } from "../models";
import type { ProviderEntryOperation, ProviderPriceResult } from "./providers/base";
import { pickBaseResolution } from "./providers/modelslab";
import { overlayFreshPrimaryPrices, UnbottledPriceFetcher } from "./providers/unbottled";
import { applySettingsUpdate, updateUnbottledEntry } from "./repository";
import { findField, formatTsLiteral, literalsEqual } from "./source-patch";

const INDENT = "        ";
const OWNED_PRICE_FIELDS = new Set([
  "creditCost",
  "inputTokenCost",
  "outputTokenCost",
  "cacheReadTokenCost",
  "cacheWriteTokenCost",
  "cacheWrite1hTokenCost",
  "pricingTiers",
  "imageOutputTokenCost",
  "creditCostPerImage",
  "creditCostPerSecond",
  "creditCostPerClip",
  "creditCostPerCharacter",
  "pricingByResolution",
  "pricingBySize",
  "pricingByQuality",
]);

const WAN_BLOCK = `
export const models = {
  [VideoGenModelId.WAN_2_7_T2V]: {
    name: "Wan 2.7 T2V",
    providers: [
      {
        id: VideoGenModelId.WAN_2_7_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "wan2.7-t2v",
        creditCostPerSecond: 10, // updated: 2026-04-04 from modelslab.com
        supportedResolutions: ["720p", "1080p"], // updated: 2026-11-15 from modelslab.com
        minDurationSeconds: 5, // updated: 2026-04-04 from modelslab.com
        maxDurationSeconds: 15, // updated: 2026-04-04 from modelslab.com
        supportedDurations: ["5", "10", "15"], // updated: 2026-04-04 from modelslab.com
        pricingByResolution: { "720p": 10, "1080p": 15 }, // updated: 2026-11-09 from modelslab.com
        defaultDurationSeconds: 5,
      },
      {
        id: VideoGenModelId.WAN_2_7_T2V,
        apiProvider: ApiProvider.UNBOTTLED,
        providerModel: "wan-2-7-t2v",
        creditCostPerSecond: 13, // updated: 2026-11-09 from unbottled.ai
        defaultDurationSeconds: 5,
        minDurationSeconds: 2,
        maxDurationSeconds: 10,
        supportedDurations: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
        supportedResolutions: ["720p", "1080p"],
        supportedAspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
        supportedSizes: [
          "1280x720",
          "720x1280",
          "1920x1080",
          "1080x1920",
          "720x720",
          "1080x1080",
          "960x720",
          "720x960",
          "1440x1080",
          "1080x1440",
        ],
      },
    ],
  },
};
`;

const wanOp: ProviderEntryOperation = {
  action: "update",
  role: "video-gen",
  enumKey: "WAN_2_7_T2V",
  modelId: "wan-2-7-t2v",
  provider: ApiProvider.UNBOTTLED,
  providerModel: "wan-2-7-t2v",
  source: "unbottled.ai",
  creditCostPerSecond: 13,
  defaultDurationSeconds: 5,
  minDurationSeconds: 5,
  maxDurationSeconds: 15,
  supportedDurations: ["5", "10", "15"],
  supportedResolutions: ["720p", "1080p"],
};

function relayBlock(content: string): string {
  const start = content.indexOf("apiProvider: ApiProvider.UNBOTTLED");
  return content.slice(start, content.indexOf("\n      },", start));
}

describe("relay row update", () => {
  it("leaves an unchanged relay row byte for byte", () => {
    expect(updateUnbottledEntry(WAN_BLOCK, wanOp)).toEqual({
      content: WAN_BLOCK,
      changed: false,
    });
  });

  it("patches only price fields and keeps the relay row's capabilities", () => {
    const result = updateUnbottledEntry(WAN_BLOCK, {
      ...wanOp,
      creditCostPerSecond: 14,
      pricingByResolution: { "720p": 14, "1080p": 19.5 },
    });
    expect(result.changed).toBe(true);
    const before = relayBlock(WAN_BLOCK);
    const after = relayBlock(result.content);
    // Capability lines stay exactly as they were (no primary durations leak in).
    for (const line of before.split("\n")) {
      if (!line.includes("creditCostPerSecond")) {
        expect(after).toContain(line);
      }
    }
    expect(after).toMatch(/creditCostPerSecond: 14, \/\/ updated: \d{4}-\d{2}-\d{2} from unbottled\.ai/);
    expect(after).toMatch(
      /creditCostPerSecond: 14, [^\n]*\n {8}pricingByResolution: \{ "720p": 14, "1080p": 19\.5 \}, \/\/ updated: /,
    );
    expect(after).not.toContain("maxDurationSeconds: 15");
    // The primary row is untouched.
    expect(result.content.slice(0, WAN_BLOCK.indexOf("ApiProvider.UNBOTTLED"))).toBe(
      WAN_BLOCK.slice(0, WAN_BLOCK.indexOf("ApiProvider.UNBOTTLED")),
    );
  });
});

describe("settings update", () => {
  const veo = `
      {
        id: VideoGenModelId.VEO_3_1,
        apiProvider: ApiProvider.OPENROUTER,
        providerModel: "google/veo-3.1",
        creditCostPerSecond: 40, // updated: 2026-07-10 from openrouter.ai
        allowedPassthroughParameters: [
          "personGeneration",
          "aspectRatio",
          "negativePrompt",
          "conditioningScale",
          "enhancePrompt",
        ], // updated: 2026-11-09 from openrouter.ai
        pricingByResolution: { "720p": 10, "1080p": 15 }, // updated: 2026-11-09 from openrouter.ai
      },
`;
  const base = {
    apiProvider: ApiProvider.OPENROUTER,
    providerModel: "google/veo-3.1",
    source: "openrouter.ai",
  };

  it("keeps a value that only differs in formatting (and its date)", () => {
    for (const [field, tsLiteral] of [
      [
        "allowedPassthroughParameters",
        '["personGeneration","aspectRatio","negativePrompt","conditioningScale","enhancePrompt"]',
      ],
      ["pricingByResolution", '{"720p":10, "1080p":15}'],
    ] as const) {
      expect(applySettingsUpdate(veo, { ...base, field, tsLiteral })).toEqual({
        content: veo,
        changed: false,
      });
    }
  });

  it("writes a changed value in formatter style", () => {
    const result = applySettingsUpdate(veo, {
      ...base,
      field: "pricingByResolution",
      tsLiteral: '{"720p":12, "1080p":15}',
    });
    expect(result.changed).toBe(true);
    expect(result.content).toMatch(
      /\n {8}pricingByResolution: \{ "720p": 12, "1080p": 15 \}, \/\/ updated: \d{4}-\d{2}-\d{2} from openrouter\.ai\n {6}\},/,
    );
    expect(result.content).toContain('          "conditioningScale",\n');
  });
});

describe("literal helpers", () => {
  it("compares literals ignoring whitespace and trailing commas", () => {
    expect(literalsEqual('[\n  "a",\n  "b",\n]', '["a","b"]')).toBe(true);
    expect(literalsEqual("1.50", "1.5")).toBe(true);
    expect(literalsEqual('["a"]', '["b"]')).toBe(false);
  });

  it("breaks long arrays like the formatter", () => {
    expect(formatTsLiteral('["a","b"]', "        ", "supportedSizes")).toBe('["a", "b"]');
    expect(
      formatTsLiteral(
        '["1:1","4:3","3:4","16:9","9:16","3:2","2:3","21:9"]',
        "        ",
        "supportedAspectRatios",
      ),
    ).toBe('[\n          "1:1",\n          "4:3",\n          "3:4",\n          "16:9",\n          "9:16",\n          "3:2",\n          "2:3",\n          "21:9",\n        ]');
  });
});

describe("relay pricing source", () => {
  it("prices the relay from this run's fresh primary values", () => {
    const fresh: ProviderPriceResult[] = [
      {
        provider: "modelslab",
        modelsFound: 1,
        modelsUpdated: 1,
        updates: [
          {
            modelId: "wan-2-7-t2v",
            name: "Wan 2.7 T2V",
            provider: ApiProvider.MODELSLAB,
            providerModel: "wan2.7-t2v",
            field: "creditCostPerSecond",
            value: 20,
            source: "modelslab.com",
          },
          {
            modelId: "wan-2-7-t2v",
            name: "Wan 2.7 T2V",
            provider: ApiProvider.OPENROUTER,
            providerModel: "wan2.7-t2v",
            field: "creditCostPerSecond",
            value: 99,
            source: "openrouter.ai",
          },
        ],
        settingsUpdates: [
          {
            providerModel: "wan2.7-t2v",
            field: "pricingByResolution",
            tsLiteral: '{"720p":20, "1080p":30}',
            source: "modelslab.com",
          },
        ],
        failures: [],
      },
    ];
    const op = overlayFreshPrimaryPrices(
      wanOp,
      {
        id: VideoGenModelId.WAN_2_7_T2V,
        apiProvider: ApiProvider.MODELSLAB,
        providerModel: "wan2.7-t2v",
        creditCostPerSecond: 10,
        defaultDurationSeconds: 5,
      },
      fresh,
    );
    expect(op.creditCostPerSecond).toBe(26);
    expect(op.pricingByResolution).toEqual({ "720p": 26, "1080p": 39 });
  });

  it("tracks the tier the base cost tracked, not the cheapest one", () => {
    // Seedance 1.5 Pro: base_price is the 480p rate; the base field is 720p.
    const fresh = { "480p": 3, "720p": 6.24, "1080p": 13.92 };
    expect(pickBaseResolution(fresh, { "480p": 3, "720p": 6.24, "1080p": 13.92 }, 6.24)).toBe("720p");
    expect(pickBaseResolution(fresh, { "480p": 2, "1080p": 9 }, 9)).toBe("1080p");
    expect(pickBaseResolution(fresh, undefined, undefined)).toBe("720p");
    expect(pickBaseResolution({}, undefined, 5)).toBeUndefined();
  });
});

/** The UNBOTTLED row of one model block, or null. */
function relayRowOf(content: string, prefix: string, enumKey: string): string | null {
  const start = content.indexOf(`[${prefix}.${enumKey}]: {`);
  if (start < 0) {
    return null;
  }
  const end = content.indexOf("\n  },", start);
  const model = content.slice(start, end);
  const relay = model.indexOf("apiProvider: ApiProvider.UNBOTTLED");
  return relay < 0 ? null : model.slice(relay, model.indexOf("\n      },", relay));
}

describe("real definition files", () => {
  it("a relay refresh against the checked-in definitions keeps every non-price field", async () => {
    const logger = createEndpointLogger(false, defaultLocale);
    const { providerEntryOps = [] } = await new UnbottledPriceFetcher().fetch(logger);
    const files: Record<string, [string, string]> = {
      chat: ["ai-stream/models-definitions.ts", "ChatModelId"],
      "image-gen": ["image-generation/models.ts", "ImageGenModelId"],
      "music-gen": ["music-generation/models.ts", "MusicGenModelId"],
      "video-gen": ["video-generation/models.ts", "VideoGenModelId"],
      tts: ["text-to-speech/models.ts", "TtsModelId"],
      stt: ["speech-to-text/models.ts", "SttModelId"],
    };
    const agentDir = join(import.meta.dir, "../..");
    let checkedRows = 0;
    for (const [role, [path, prefix]] of Object.entries(files)) {
      const original = readFileSync(join(agentDir, path), "utf-8");
      let content = original;
      const ops = providerEntryOps.filter((op) => op.role === role && op.action === "update");
      for (const op of ops) {
        content = updateUnbottledEntry(content, op).content;
      }
      for (const op of ops) {
        const before = relayRowOf(original, prefix, op.enumKey);
        const after = relayRowOf(content, prefix, op.enumKey);
        if (before === null) {
          continue;
        }
        checkedRows++;
        const fields = [...before.matchAll(/^ {8}(\w+):/gm)].map((m) => m[1] ?? "");
        for (const field of fields) {
          if (OWNED_PRICE_FIELDS.has(field)) {
            continue;
          }
          expect({ model: op.enumKey, field, value: findField(after ?? "", INDENT, field)?.value }).toEqual({
            model: op.enumKey,
            field,
            value: findField(before, INDENT, field)?.value,
          });
        }
      }
    }
    expect(checkedRows).toBeGreaterThan(50);
  });
});
