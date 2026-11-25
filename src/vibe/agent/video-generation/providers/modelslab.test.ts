import { describe, expect, test } from "bun:test";

import { ApiProvider } from "../../models/models";
import { videoGenModelDefinitions } from "../models";
import {
  buildModelsLabVideoRequest,
  MODELSLAB_VIDEO_MODELS,
} from "./modelslab";

const V7 = "https://modelslab.com/api/v7/video-fusion";
const IMAGE = "https://example.com/frame.jpg";

describe("buildModelsLabVideoRequest", () => {
  test("every ModelsLab video route in models.ts has a v7 spec", () => {
    // A providerModel without a spec falls back to the legacy v6 route, which
    // ignores unknown model_ids and caps clips at 25 frames (~1.56 s).
    const missing: string[] = [];
    for (const def of Object.values(videoGenModelDefinitions)) {
      for (const provider of def.providers) {
        if (
          provider.apiProvider === ApiProvider.MODELSLAB &&
          !MODELSLAB_VIDEO_MODELS[provider.providerModel]
        ) {
          missing.push(provider.providerModel);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  test("Kling V2.5 Turbo T2V sends seconds + aspect ratio on v7 text-to-video", () => {
    const request = buildModelsLabVideoRequest({
      providerModel: "kling-v2-5-turbo-t2v",
      prompt: "a cat",
      durationSeconds: 5,
      aspectRatio: "9:16",
    });
    expect(request).toEqual({
      ok: true,
      endpoint: `${V7}/text-to-video`,
      body: {
        model_id: "kling-v2-5-turbo-t2v",
        prompt: "a cat",
        duration: "5",
        aspect_ratio: "9:16",
      },
    });
  });

  test("Kling V2.5 Turbo I2V uses ModelsLab's model_id casing and init_image", () => {
    const request = buildModelsLabVideoRequest({
      providerModel: "kling-v2-5-turbo-i2v",
      prompt: "wave",
      durationSeconds: 10,
      aspectRatio: "9:16",
      initImage: IMAGE,
    });
    expect(request).toEqual({
      ok: true,
      endpoint: `${V7}/image-to-video`,
      body: {
        model_id: "Kling-V2-5-Turbo-i2v",
        prompt: "wave",
        duration: "10",
        init_image: IMAGE,
      },
    });
  });

  test("LTX 2.3 Pro I2V maps resolution labels and defaults to the billed FHD tier", () => {
    const fhd = buildModelsLabVideoRequest({
      providerModel: "ltx-2-3-pro-i2v",
      prompt: "p",
      durationSeconds: 6,
      initImage: "data:image/png;base64,AAAA",
    });
    expect(fhd.ok && fhd.body).toEqual({
      model_id: "ltx-2-3-pro-i2v",
      prompt: "p",
      duration: "6",
      init_image: "data:image/png;base64,AAAA",
      base64: true,
      resolution: "1920x1080",
    });
    const fourK = buildModelsLabVideoRequest({
      providerModel: "ltx-2-3-pro-i2v",
      prompt: "p",
      durationSeconds: 8,
      resolution: "4K",
      initImage: IMAGE,
    });
    expect(fourK.ok && fourK.body.resolution).toBe("3840x2160");
    expect(fourK.ok && fourK.body.duration).toBe("8");
  });

  test("never sends num_frames for hosted models", () => {
    for (const providerModel of Object.keys(MODELSLAB_VIDEO_MODELS)) {
      const request = buildModelsLabVideoRequest({
        providerModel,
        prompt: "p",
        durationSeconds: 6,
        initImage: IMAGE,
      });
      if (request.ok) {
        expect(request.endpoint.startsWith(V7)).toBe(true);
        expect(request.body.num_frames).toBeUndefined();
        expect(request.body.duration).toBe("6");
      }
    }
  });

  test("Sora gets a WxH size, Grok its own model_id", () => {
    const sora = buildModelsLabVideoRequest({
      providerModel: "sora-2",
      prompt: "p",
      durationSeconds: 4,
      aspectRatio: "16:9",
    });
    expect(sora.ok && sora.body.aspect_ratio).toBe("1280x720");
    const grok = buildModelsLabVideoRequest({
      providerModel: "grok-t2v",
      prompt: "p",
      durationSeconds: 6,
      resolution: "720p",
    });
    expect(grok.ok && grok.body.model_id).toBe("grok-imagine-video-t2v");
    expect(grok.ok && grok.body.resolution).toBe("720P");
  });

  test("image-to-video without an image fails before submitting", () => {
    expect(
      buildModelsLabVideoRequest({
        providerModel: "ltx-2-3-pro-i2v",
        prompt: "p",
        durationSeconds: 6,
      }),
    ).toEqual({ ok: false, reason: "imageRequired" });
  });

  test("video-editing models are refused (no init_video support)", () => {
    expect(
      buildModelsLabVideoRequest({
        providerModel: "lipsync-2",
        prompt: "p",
        durationSeconds: 5,
      }),
    ).toEqual({ ok: false, reason: "unsupportedInput" });
  });

  test("unknown open models keep the legacy v6 frame-based route", () => {
    const request = buildModelsLabVideoRequest({
      providerModel: "wan2.2",
      prompt: "p",
      durationSeconds: 3,
    });
    expect(request.ok && request.endpoint).toBe(
      "https://modelslab.com/api/v6/video/text2video_ultra",
    );
    expect(request.ok && request.body.num_frames).toBe(24);
  });
});
