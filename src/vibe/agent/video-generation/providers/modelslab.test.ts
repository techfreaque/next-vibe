import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { defaultLocale } from "../../../core/i18n/core/config";
import { createEndpointLogger } from "../../../logger/server";
import { agentEnv } from "../../env";
import { ApiProvider } from "../../models/models";
import { videoGenModelDefinitions } from "../models";
import {
  buildModelsLabVideoRequest,
  generateVideoWithModelsLab,
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
      initImage: IMAGE,
    });
    expect(fhd.ok && fhd.body).toEqual({
      model_id: "ltx-2-3-pro-i2v",
      prompt: "p",
      duration: "6",
      init_image: IMAGE,
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

  test("v7 refuses an unstaged data URI (prod 11-27: init_image(s) must be a valid URL)", () => {
    expect(
      buildModelsLabVideoRequest({
        providerModel: "ltx-2-3-pro-i2v",
        prompt: "p",
        durationSeconds: 6,
        initImage: "data:image/png;base64,AAAA",
      }),
    ).toEqual({ ok: false, reason: "imageNotStaged" });
  });

  test("Sora without a requested ratio still sends the 16:9 size (prod 11-27)", () => {
    const sora = buildModelsLabVideoRequest({
      providerModel: "sora-2-pro-t2v",
      prompt: "p",
      durationSeconds: 4,
    });
    expect(sora.ok && sora.body.aspect_ratio).toBe("1280x720");
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

describe("generateVideoWithModelsLab init_image rejections", () => {
  const rejection = "The init_image is invalid. Make sure the image is a JPG or PNG.";
  // No network: the HEAD probe and the submit both answer from here.
  const fetchImpl: typeof globalThis.fetch = Object.assign(
    async (_input: RequestInfo | URL, init?: RequestInit): Promise<Response> =>
      init?.method === "HEAD"
        ? new Response(null, { status: 200 })
        : Response.json({ status: "error", message: rejection }),
    { preconnect: (): void => undefined },
  );

  async function run(providerModel: string): Promise<string | undefined> {
    const result = await generateVideoWithModelsLab({
      providerModel,
      prompt: "waves",
      durationSeconds: 5,
      logger: createEndpointLogger(false, defaultLocale),
      locale: defaultLocale,
      inputImageUrl: IMAGE,
      fetchImpl,
    });
    return result.success ? undefined : result.message;
  }

  test("an image-to-video model shows the provider's reason (prod 11-26 grok-i2v / kling i2v)", async () => {
    const message = await run("kling-v2-5-turbo-i2v");
    expect(message).toContain(rejection);
    expect(message).not.toContain("does not support image-to-video");
  });

  test("a text-to-video model still gets the drop-the-model hint", async () => {
    expect(await run("kling-v2-5-turbo-t2v")).toContain(
      "does not support image-to-video",
    );
  });
});

describe("generateVideoWithModelsLab staging and submit failures", () => {
  let originalKey: typeof agentEnv.MODELSLAB_API_KEY;
  beforeEach(() => {
    originalKey = agentEnv.MODELSLAB_API_KEY;
    agentEnv.MODELSLAB_API_KEY = "local-provider-fixture";
  });
  afterEach(() => {
    agentEnv.MODELSLAB_API_KEY = originalKey;
  });

  function fetchFrom(
    handler: (url: string, init?: RequestInit) => Response,
    calls: string[],
  ): typeof globalThis.fetch {
    return Object.assign(
      async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = String(input);
        calls.push(url);
        return handler(url, init);
      },
      { preconnect: (): void => undefined },
    );
  }

  test("an inline image is staged through base64_to_url before the v7 submit", async () => {
    const calls: string[] = [];
    let submitted: Record<string, string> | undefined;
    const fetchImpl = fetchFrom((url, init) => {
      if (url.endsWith("/v6/base64_to_url")) {
        return Response.json({
          status: "success",
          output: ["https://pub.modelslab.example/temp/a.png"],
        });
      }
      submitted = JSON.parse(String(init?.body)) as Record<string, string>;
      return Response.json({
        status: "success",
        output: ["https://cdn.modelslab.example/v.mp4"],
      });
    }, calls);
    const result = await generateVideoWithModelsLab({
      providerModel: "ltx-2-3-pro-i2v",
      prompt: "waves",
      durationSeconds: 6,
      logger: createEndpointLogger(false, defaultLocale),
      locale: defaultLocale,
      inputImageUrl: "data:image/png;base64,AAAA",
      fetchImpl,
    });
    expect(result.success).toBe(true);
    expect(calls[0]).toBe("https://modelslab.com/api/v6/base64_to_url");
    expect(submitted?.init_image).toBe(
      "https://pub.modelslab.example/temp/a.png",
    );
    expect(submitted?.base64).toBeUndefined();
  });

  test("a failed staging upload stops before the paid submit", async () => {
    const calls: string[] = [];
    const fetchImpl = fetchFrom(
      () => Response.json({ status: "error", message: "bad" }, { status: 400 }),
      calls,
    );
    const result = await generateVideoWithModelsLab({
      providerModel: "ltx-2-3-pro-i2v",
      prompt: "waves",
      durationSeconds: 6,
      logger: createEndpointLogger(false, defaultLocale),
      locale: defaultLocale,
      inputImageUrl: "data:image/png;base64,AAAA",
      fetchImpl,
    });
    expect(result.success).toBe(false);
    expect(calls).toEqual(["https://modelslab.com/api/v6/base64_to_url"]);
  });

  test("a discontinued model reads as retired, not as a raw JSON body", async () => {
    const fetchImpl = fetchFrom(
      () =>
        Response.json(
          {
            status: "error",
            code: "provider_error",
            message:
              "The model 'kling-v2-1-master' has been discontinued and is no longer available.",
          },
          { status: 404 },
        ),
      [],
    );
    const result = await generateVideoWithModelsLab({
      providerModel: "kling-v2-1-master-t2v",
      prompt: "waves",
      durationSeconds: 5,
      logger: createEndpointLogger(false, defaultLocale),
      locale: defaultLocale,
      fetchImpl,
    });
    expect(result.success).toBe(false);
    expect(result.success ? "" : result.message).toContain(
      "kling-v2-1-master-t2v",
    );
    expect(result.success ? "" : result.message).not.toContain("{");
  });
});
