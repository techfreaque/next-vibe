import { describe, expect, test } from "bun:test";

import { ApiProvider } from "../models/models";
import {
  deriveVideoModelInputs,
  getVideoGenModelById,
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
