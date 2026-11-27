import { describe, expect, test } from "bun:test";

import {
  IMAGE_VISION_FALLBACK_MODEL_IDS,
  VIDEO_VISION_FALLBACK_MODEL_IDS,
} from "../../constants";
import {
  ImageVisionModelId,
  imageVisionModelOptions,
  VideoVisionModelId,
  videoVisionModelOptions,
} from "../../vision-models";
import {
  IMAGE_CONTENT_REFUSAL_FALLBACK_IDS,
  maxBridgeModels,
  modelFamily,
  pickBridgeFallback,
  VIDEO_CONTENT_REFUSAL_FALLBACK_IDS,
} from "./vision-fallback";

function videoModel(id: VideoVisionModelId): (typeof videoVisionModelOptions)[number] {
  const model = videoVisionModelOptions.find((m) => m.id === id);
  if (!model) {
    throw new Error(`fixture model ${id} missing`);
  }
  return model;
}

describe("pickBridgeFallback", () => {
  test("a Gemini video refusal skips Gemini and the Alibaba-inspected Qwen", () => {
    const refusedModel = videoModel(VideoVisionModelId.GEMINI_3_5_FLASH_LITE);
    const next = pickBridgeFallback({
      pool: videoVisionModelOptions,
      priority: VIDEO_VISION_FALLBACK_MODEL_IDS,
      contentRefusalPriority: VIDEO_CONTENT_REFUSAL_FALLBACK_IDS,
      tried: [refusedModel],
      refused: [refusedModel],
      failureClass: "content-refusal",
    });
    expect(next).not.toBeNull();
    expect(modelFamily(next?.id ?? "")).not.toBe("gemini");
    expect(modelFamily(next?.id ?? "")).not.toBe("qwen");
    expect(next?.id).toBe(VideoVisionModelId.MIMO_V2_6_FLASH);
  });

  test("the third model after two refusals is still outside both refusing families", () => {
    const gemini = videoModel(VideoVisionModelId.GEMINI_3_5_FLASH_LITE);
    const mimo = videoModel(VideoVisionModelId.MIMO_V2_6_FLASH);
    const next = pickBridgeFallback({
      pool: videoVisionModelOptions,
      priority: VIDEO_VISION_FALLBACK_MODEL_IDS,
      contentRefusalPriority: VIDEO_CONTENT_REFUSAL_FALLBACK_IDS,
      tried: [gemini, mimo],
      refused: [gemini, mimo],
      failureClass: "content-refusal",
    });
    expect(next?.id).toBe(VideoVisionModelId.GLM_5_3_FLASH);
  });

  test("a provider error keeps the base priority order", () => {
    const failed = videoModel(VideoVisionModelId.GEMINI_3_5_FLASH_LITE);
    const next = pickBridgeFallback({
      pool: videoVisionModelOptions,
      priority: VIDEO_VISION_FALLBACK_MODEL_IDS,
      contentRefusalPriority: VIDEO_CONTENT_REFUSAL_FALLBACK_IDS,
      tried: [failed],
      refused: [],
      failureClass: "provider-error",
    });
    expect(next?.id).toBe(VIDEO_VISION_FALLBACK_MODEL_IDS[0]);
  });

  test("an image refusal goes to an uncensored model of another family", () => {
    const refusedModel = imageVisionModelOptions.find(
      (m) => m.id === ImageVisionModelId.GEMINI_3_5_FLASH_LITE,
    );
    expect(refusedModel).toBeDefined();
    if (!refusedModel) {
      return;
    }
    const next = pickBridgeFallback({
      pool: imageVisionModelOptions,
      priority: IMAGE_VISION_FALLBACK_MODEL_IDS,
      contentRefusalPriority: IMAGE_CONTENT_REFUSAL_FALLBACK_IDS,
      tried: [refusedModel],
      refused: [refusedModel],
      failureClass: "content-refusal",
    });
    expect(next?.content).toBe(
      imageVisionModelOptions.find(
        (m) => m.id === ImageVisionModelId.GLM_5_3_FLASH_UNCENSORED,
      )?.content,
    );
    expect(modelFamily(next?.id ?? "")).not.toBe("gemini");
  });

  test("returns null when every candidate was tried", () => {
    const pool = [videoModel(VideoVisionModelId.QWEN_3_8_FLASH)];
    expect(
      pickBridgeFallback({
        pool,
        priority: VIDEO_VISION_FALLBACK_MODEL_IDS,
        contentRefusalPriority: VIDEO_CONTENT_REFUSAL_FALLBACK_IDS,
        tried: pool,
        refused: [],
        failureClass: "provider-error",
      }),
    ).toBeNull();
  });
});

describe("maxBridgeModels", () => {
  test("a refusal earns one more model than a provider error", () => {
    expect(maxBridgeModels(["provider-error"])).toBe(2);
    expect(maxBridgeModels(["content-refusal"])).toBe(3);
  });
});
