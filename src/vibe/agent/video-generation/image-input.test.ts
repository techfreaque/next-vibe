import { describe, expect, test } from "bun:test";

import { ApiProvider } from "../models/models";
import {
  deriveVideoModelInputs,
  getVideoGenModelById,
  resolveVideoClipSeconds,
  resolveVideoGenRouteForImageInput,
  videoGenModelDefinitions,
  VideoGenModelId,
  videoRouteReportsImage,
} from "./models";

const I2V_MODELS = [
  VideoGenModelId.WAN_2_6_I2V,
  VideoGenModelId.WAN_2_6_I2V_FLASH,
  VideoGenModelId.KLING_V2_5_TURBO_I2V,
  VideoGenModelId.KLING_V2_1_MASTER_I2V,
  VideoGenModelId.LTX_2_3_PRO_I2V,
  VideoGenModelId.HAILUO_2_3_I2V,
  VideoGenModelId.HAILUO_2_3_FAST_I2V,
  VideoGenModelId.GROK_I2V,
  VideoGenModelId.OMNIHUMAN_1_5,
];

const T2V_ONLY_MODELS = [
  VideoGenModelId.KLING_V2_5_TURBO_T2V,
  VideoGenModelId.KLING_V2_1_MASTER_T2V,
  VideoGenModelId.LTX_2_PRO_T2V,
  VideoGenModelId.SORA_2,
];

describe("video model inputs", () => {
  test("stored inputs match what the provider routes report", () => {
    for (const def of Object.values(videoGenModelDefinitions)) {
      expect(def.inputs).toEqual(deriveVideoModelInputs(def));
    }
  });

  test("image-to-video models take an image", () => {
    for (const id of I2V_MODELS) {
      expect(videoGenModelDefinitions[id].inputs).toContain("image");
    }
  });

  test("text-to-video-only models do not", () => {
    for (const id of T2V_ONLY_MODELS) {
      expect(videoGenModelDefinitions[id].inputs).toEqual(["text"]);
    }
  });

  test("fresh provider data overrides the stored route value", () => {
    const def = videoGenModelDefinitions[VideoGenModelId.LTX_2_PRO_T2V];
    expect(
      deriveVideoModelInputs(def, new Map([["ltx-2-pro-t2v", true]])),
    ).toEqual(["text", "image"]);
    const i2v = videoGenModelDefinitions[VideoGenModelId.LTX_2_3_PRO_I2V];
    expect(
      deriveVideoModelInputs(i2v, new Map([["ltx-2-3-pro-i2v", false]])),
    ).toEqual(["text"]);
  });

  test("video editors list the footage (and audio) they take", () => {
    expect(videoGenModelDefinitions[VideoGenModelId.GEN4_ALEPH].inputs).toEqual(
      ["text", "video"],
    );
    expect(videoGenModelDefinitions[VideoGenModelId.LIPSYNC_2].inputs).toEqual([
      "text",
      "video",
      "audio",
    ]);
  });

  test("UNBOTTLED routes never count as provider evidence", () => {
    for (const def of Object.values(videoGenModelDefinitions)) {
      for (const p of def.providers) {
        if (p.apiProvider === ApiProvider.UNBOTTLED) {
          expect(videoRouteReportsImage(p)).toBe(false);
        }
      }
    }
  });
});

describe("image-to-video capability guard", () => {
  test("accepts an image on i2v models (route kept)", () => {
    for (const id of I2V_MODELS) {
      const option = getVideoGenModelById(id);
      if (!option) {
        continue;
      }
      const route = resolveVideoGenRouteForImageInput(option);
      expect(route?.id).toBe(id);
      expect(route?.inputs).toContain("image");
    }
  });

  test("rejects t2v-only routes: the image never reaches them", () => {
    for (const id of T2V_ONLY_MODELS) {
      const option = getVideoGenModelById(id);
      if (!option) {
        continue;
      }
      expect(option.inputs).not.toContain("image");
      const route = resolveVideoGenRouteForImageInput(option);
      expect(route).not.toBe(option);
      expect(route?.id).not.toBe(id);
      expect(route?.inputs).toContain("image");
    }
  });

  test("a model with mixed routes moves to its image-capable route", () => {
    // Grok T2V: the cheapest route (ModelsLab t2v) is text-only, OpenRouter
    // takes a first frame. Same model, different route.
    const option = getVideoGenModelById(VideoGenModelId.GROK_T2V);
    if (!option) {
      return;
    }
    expect(videoGenModelDefinitions[VideoGenModelId.GROK_T2V].inputs).toContain(
      "image",
    );
    if (option.apiProvider === ApiProvider.MODELSLAB) {
      expect(option.inputs).not.toContain("image");
    }
    const route = resolveVideoGenRouteForImageInput(option);
    expect(route?.id).toBe(VideoGenModelId.GROK_T2V);
    expect(route?.inputs).toContain("image");
    expect(route?.apiProvider).toBe(ApiProvider.OPENROUTER);
  });
});

describe("video resolution pricing", () => {
  // Billing looks the price up by the requested resolution string
  // (repository.ts), so a key the route does not offer, or one spelled in
  // another case ("4k" vs "4K"), silently bills the base rate.
  test("every priced resolution is an offered one, and vice versa", () => {
    for (const def of Object.values(videoGenModelDefinitions)) {
      for (const p of def.providers) {
        if (
          p.creditCostPerSecond === undefined ||
          p.defaultDurationSeconds === undefined ||
          !p.pricingByResolution
        ) {
          continue;
        }
        const offered = p.supportedResolutions ?? [];
        const priced = Object.keys(p.pricingByResolution);
        const label = `${p.id}/${p.apiProvider}`;
        expect({ label, priced: priced.toSorted() }).toEqual({
          label,
          priced: [...offered].toSorted(),
        });
      }
    }
  });
});

describe("video duration bounds", () => {
  test("every route's min/max bounds cover all of its supportedDurations", () => {
    for (const def of Object.values(videoGenModelDefinitions)) {
      for (const p of def.providers) {
        if (
          p.creditCostPerSecond === undefined ||
          p.defaultDurationSeconds === undefined ||
          !p.supportedDurations ||
          p.supportedDurations.length === 0
        ) {
          continue;
        }
        const durations = p.supportedDurations.map(Number);
        const minSupported = Math.min(...durations);
        const maxSupported = Math.max(...durations);
        const label = `${p.id}/${p.apiProvider}`;
        if (p.minDurationSeconds !== undefined) {
          expect(
            { label, min: p.minDurationSeconds },
            `${label} minDurationSeconds exceeds smallest supported duration`,
          ).toEqual({
            label,
            min: Math.min(p.minDurationSeconds, minSupported),
          });
        }
        if (p.maxDurationSeconds !== undefined) {
          expect(
            { label, max: p.maxDurationSeconds },
            `${label} maxDurationSeconds cuts off largest supported duration`,
          ).toEqual({
            label,
            max: Math.max(p.maxDurationSeconds, maxSupported),
          });
        }
      }
    }
  });

  test("Kling V2.5 Turbo I2V allows both 5s and 10s clips", () => {
    const def = videoGenModelDefinitions[VideoGenModelId.KLING_V2_5_TURBO_I2V];
    for (const p of def.providers) {
      if (
        p.creditCostPerSecond === undefined ||
        p.defaultDurationSeconds === undefined
      ) {
        expect.unreachable("Kling V2.5 Turbo I2V provider must be video-based");
        continue;
      }
      expect(p.minDurationSeconds).toBe(5);
      expect(p.maxDurationSeconds).toBe(10);
      expect(p.supportedDurations).toEqual(["5", "10"]);
      expect(resolveVideoClipSeconds(p, 5)).toBe(5);
      expect(resolveVideoClipSeconds(p, 10)).toBe(10);
    }
  });
});
