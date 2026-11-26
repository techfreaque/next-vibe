import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import type { JSONValue } from "ai";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { agentEnv } from "../env";
import { generateWithFalAi } from "../image-generation/providers/fal-ai";
import { generateWithOpenAI } from "../image-generation/providers/openai";
import { generateWithOpenRouter } from "../image-generation/providers/openrouter";
import { generateWithReplicate } from "../image-generation/providers/replicate";
import { generateWithVenice } from "../image-generation/providers/venice";
import { edenAiTtsResponseSchema } from "../models/eden-ai";
import { generateMusicWithFalAi } from "../music-generation/providers/fal-ai";
import { generateMusicWithModelsLab } from "../music-generation/providers/modelslab";
import { generateMusicWithOpenRouter } from "../music-generation/providers/openrouter";
import { generateMusicWithReplicate } from "../music-generation/providers/replicate";
import { generateVideoWithModelsLab } from "../video-generation/providers/modelslab";
import { generateVideoWithOpenRouter } from "../video-generation/providers/openrouter";
import {
  extractHeaderRequestId,
  extractLanguageModelRequestId,
  extractModelsLabJobId,
  mergeProviderJobIds,
  normalizeProviderJobId,
} from "./provider-job-id";

const locale: CountryLanguage = "en-GLOBAL";
const logger = createEndpointLogger(false, locale);

function makeFetch(responses: Response[]): typeof globalThis.fetch {
  const queue = [...responses];
  const handler = async (): Promise<Response> =>
    queue.shift() ?? new Response("{}", { status: 500 });
  return Object.assign(handler, { preconnect: fetch.preconnect });
}

function replayJson(
  body: JSONValue,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "x-vibe-fixture-replay": "true",
      ...headers,
    },
  });
}

describe("provider-job-id helpers", () => {
  test("normalizes strings and finite numbers, drops empty values", () => {
    expect(normalizeProviderJobId("  gen-123  ")).toBe("gen-123");
    expect(normalizeProviderJobId(4284667)).toBe("4284667");
    expect(normalizeProviderJobId("   ")).toBeUndefined();
    expect(normalizeProviderJobId(null)).toBeUndefined();
    expect(normalizeProviderJobId(Number.NaN)).toBeUndefined();
  });

  test("extracts headers case-insensitively in priority order", () => {
    const headers = new Headers({
      "X-Request-Id": "req-fallback",
      "X-Generation-Id": "gen-primary",
    });
    expect(extractHeaderRequestId(headers)).toBe("gen-primary");
    expect(
      extractHeaderRequestId({ "X-Venice-Request-Id": "venice-1" }),
    ).toBe("venice-1");
  });

  test("extracts ModelsLab job ID from body id, fetch_result URL, or headers", () => {
    expect(extractModelsLabJobId(4284667)).toBe("4284667");
    expect(
      extractModelsLabJobId(
        undefined,
        "https://modelslab.com/api/v7/video-fusion/fetch/998877",
      ),
    ).toBe("998877");
    expect(
      extractModelsLabJobId(
        undefined,
        undefined,
        new Headers({ "x-request-id": "ml-hdr-1" }),
      ),
    ).toBe("ml-hdr-1");
  });

  test("extracts real language-model IDs and ignores synthetic AI SDK aitxt-* IDs", () => {
    expect(
      extractLanguageModelRequestId({
        id: "aitxt-local-fallback",
        headers: { "x-generation-id": "gen-openrouter-1" },
      }),
    ).toBe("gen-openrouter-1");
    expect(
      extractLanguageModelRequestId({
        id: "chatcmpl-venice-42",
        headers: { "x-request-id": "req-42" },
      }),
    ).toBe("chatcmpl-venice-42");
    expect(
      extractLanguageModelRequestId({
        id: "aitxt-synthetic-only",
        headers: { "x-request-id": "nano-req-9" },
      }),
    ).toBe("nano-req-9");
    expect(
      extractLanguageModelRequestId({
        id: "aitxt-synthetic-only",
      }),
    ).toBeUndefined();
  });

  test("merges and deduplicates multiple provider job IDs", () => {
    expect(mergeProviderJobIds([])).toEqual({});
    expect(mergeProviderJobIds(["gen-1", undefined, "gen-1"])).toEqual({
      providerJobId: "gen-1",
    });
    expect(mergeProviderJobIds(["gen-1", "gen-2", "gen-1"])).toEqual({
      providerJobId: "gen-1",
      providerJobIds: ["gen-1", "gen-2"],
    });
  });

  test("edenAiTtsResponseSchema preserves public_id and id fields", () => {
    const parsed = edenAiTtsResponseSchema.parse({
      status: "success",
      public_id: "eden-tts-pub-1",
      cost: "0.001",
      output: { audio_resource_url: "https://example.test/a.mp3" },
    });
    expect(parsed.public_id).toBe("eden-tts-pub-1");
  });
});

describe("media provider adapters capture providerJobId", () => {
  const savedEnv = {
    OPENROUTER_API_KEY: agentEnv.OPENROUTER_API_KEY,
    FAL_AI_API_KEY: agentEnv.FAL_AI_API_KEY,
    OPENAI_API_KEY: agentEnv.OPENAI_API_KEY,
    REPLICATE_API_TOKEN: agentEnv.REPLICATE_API_TOKEN,
    VENICE_AI_API_KEY: agentEnv.VENICE_AI_API_KEY,
    MODELSLAB_API_KEY: agentEnv.MODELSLAB_API_KEY,
  };

  beforeEach(() => {
    agentEnv.OPENROUTER_API_KEY = "test-or-key";
    agentEnv.FAL_AI_API_KEY = "test-fal-key";
    agentEnv.OPENAI_API_KEY = "test-oai-key";
    agentEnv.REPLICATE_API_TOKEN = "test-rep-key";
    agentEnv.VENICE_AI_API_KEY = "test-venice-key";
    agentEnv.MODELSLAB_API_KEY = "test-ml-key";
  });

  afterEach(() => {
    agentEnv.OPENROUTER_API_KEY = savedEnv.OPENROUTER_API_KEY;
    agentEnv.FAL_AI_API_KEY = savedEnv.FAL_AI_API_KEY;
    agentEnv.OPENAI_API_KEY = savedEnv.OPENAI_API_KEY;
    agentEnv.REPLICATE_API_TOKEN = savedEnv.REPLICATE_API_TOKEN;
    agentEnv.VENICE_AI_API_KEY = savedEnv.VENICE_AI_API_KEY;
    agentEnv.MODELSLAB_API_KEY = savedEnv.MODELSLAB_API_KEY;
  });

  test("OpenRouter image reads x-generation-id header", async () => {
    const recorded: string[] = [];
    const result = await generateWithOpenRouter({
      providerModel: "black-forest-labs/flux.2-klein",
      prompt: "cube",
      logger,
      locale,
      onProviderJobId: (id) => recorded.push(id),
      fetchImpl: makeFetch([
        replayJson(
          {
            data: [{ url: "https://example.test/img.png" }],
            usage: { cost: 0.009 },
          },
          { "x-generation-id": "gen-img-openrouter-1" },
        ),
      ]),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.providerJobId).toBe("gen-img-openrouter-1");
    }
    expect(recorded).toEqual(["gen-img-openrouter-1"]);
  });

  test("fal.ai image records request_id on submit and returns it", async () => {
    const recorded: string[] = [];
    const result = await generateWithFalAi({
      providerModel: "fal-ai/flux",
      prompt: "cube",
      size: "post.size.square1024",
      logger,
      locale,
      onProviderJobId: (id) => recorded.push(id),
      fetchImpl: makeFetch([
        replayJson({ request_id: "fal-req-img-1" }),
        replayJson({ status: "COMPLETED" }),
        replayJson({ images: [{ url: "https://example.test/fal.png" }] }),
      ]),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.providerJobId).toBe("fal-req-img-1");
    }
    expect(recorded).toEqual(["fal-req-img-1"]);
  });

  test("OpenAI image reads x-request-id header", async () => {
    const recorded: string[] = [];
    const result = await generateWithOpenAI({
      providerModel: "gpt-image-1",
      prompt: "cube",
      size: "post.size.square1024",
      quality: "post.quality.standard",
      logger,
      locale,
      onProviderJobId: (id) => recorded.push(id),
      fetchImpl: makeFetch([
        replayJson(
          { data: [{ url: "https://example.test/oai.png" }] },
          { "x-request-id": "req_openai_img_1" },
        ),
      ]),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.providerJobId).toBe("req_openai_img_1");
    }
    expect(recorded).toEqual(["req_openai_img_1"]);
  });

  test("Replicate image records prediction.id even if polling fails", async () => {
    const recorded: string[] = [];
    const result = await generateWithReplicate({
      providerModel: "owner/model",
      prompt: "cube",
      size: "post.size.square1024",
      logger,
      locale,
      onProviderJobId: (id) => recorded.push(id),
      fetchImpl: makeFetch([
        replayJson({ id: "rep-pred-fail-1", status: "starting" }),
        replayJson({
          id: "rep-pred-fail-1",
          status: "failed",
          error: "boom",
        }),
      ]),
    });
    expect(result.success).toBe(false);
    expect(recorded).toEqual(["rep-pred-fail-1"]);
  });

  test("Venice image captures id on generation and x-venice-request-id on edit", async () => {
    const genResult = await generateWithVenice({
      providerModel: "lustify-v8",
      prompt: "cube",
      size: "post.size.square1024",
      logger,
      locale,
      fetchImpl: makeFetch([
        replayJson({
          id: "venice-img-1",
          data: [{ url: "https://example.test/venice.webp" }],
        }),
      ]),
    });
    expect(genResult.success).toBe(true);
    if (genResult.success) {
      expect(genResult.data.providerJobId).toBe("venice-img-1");
    }

    const editResult = await generateWithVenice({
      providerModel: "firered-image-edit",
      prompt: "cube",
      size: "post.size.square1024",
      inputMediaUrl: "data:image/png;base64,AAAA",
      logger,
      locale,
      fetchImpl: makeFetch([
        new Response(new Uint8Array([1, 2, 3]), {
          status: 200,
          headers: {
            "content-type": "image/webp",
            "x-venice-request-id": "venice-edit-req-2",
          },
        }),
      ]),
    });
    expect(editResult.success).toBe(true);
    if (editResult.success) {
      expect(editResult.data.providerJobId).toBe("venice-edit-req-2");
    }
  });

  test("OpenRouter video captures generation_id and reports on submit", async () => {
    const recorded: string[] = [];
    const result = await generateVideoWithOpenRouter({
      providerModel: "x-ai/grok-imagine-video",
      prompt: "wave",
      logger,
      locale,
      onProviderJobId: (id) => recorded.push(id),
      fetchImpl: makeFetch([
        replayJson({
          id: "gen-vid-or-1",
          polling_url: "https://openrouter.ai/api/v1/videos/gen-vid-or-1",
          status: "pending",
        }),
        replayJson({
          id: "gen-vid-or-1",
          generation_id: "gen-vid-or-1",
          polling_url: "https://openrouter.ai/api/v1/videos/gen-vid-or-1",
          status: "completed",
          unsigned_urls: ["https://openrouter.ai/api/v1/videos/gen-vid-or-1/content"],
          usage: { cost: 0.03 },
        }),
      ]),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.providerJobId).toBe("gen-vid-or-1");
    }
    expect(recorded).toEqual(["gen-vid-or-1"]);
  });

  test("ModelsLab video captures job ID from fetch_result when id is omitted", async () => {
    const recorded: string[] = [];
    const result = await generateVideoWithModelsLab({
      providerModel: "kling-v2-5-turbo-t2v",
      prompt: "wave",
      durationSeconds: 5,
      logger,
      locale,
      onProviderJobId: (id) => recorded.push(id),
      fetchImpl: makeFetch([
        replayJson({
          status: "processing",
          fetch_result: "https://modelslab.com/api/v7/video-fusion/fetch/771234",
        }),
        replayJson({
          status: "success",
          output: ["https://example.test/clip.mp4"],
        }),
      ]),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.providerJobId).toBe("771234");
    }
    expect(recorded).toEqual(["771234"]);
  });

  test("OpenRouter, ModelsLab, fal.ai, and Replicate music adapters return providerJobId", async () => {
    const orMusic = await generateMusicWithOpenRouter({
      providerModel: "google/lyria-3-clip-preview",
      prompt: "ambient synth",
      durationSeconds: 30,
      logger,
      locale,
      fetchImpl: makeFetch([
        new Response(
          `data: ${JSON.stringify({ id: "gen-music-chunk-1", choices: [{ delta: { audio: { data: "SUQz" } } }] })}\n\ndata: [DONE]\n\n`,
          {
            status: 200,
            headers: {
              "content-type": "text/event-stream",
              "x-generation-id": "gen-music-hdr-1",
            },
          },
        ),
      ]),
    });
    expect(orMusic.success).toBe(true);
    if (orMusic.success) {
      expect(orMusic.data.providerJobId).toBe("gen-music-hdr-1");
    }

    const mlMusic = await generateMusicWithModelsLab({
      providerModel: "music-v1",
      prompt: "ambient synth",
      durationSeconds: 30,
      logger,
      locale,
      fetchImpl: makeFetch([
        replayJson({
          status: "success",
          id: 4284667,
          output: ["https://example.test/track.mp3"],
        }),
      ]),
    });
    expect(mlMusic.success).toBe(true);
    if (mlMusic.success) {
      expect(mlMusic.data.providerJobId).toBe("4284667");
    }

    const falMusic = await generateMusicWithFalAi({
      providerModel: "fal-ai/music",
      prompt: "ambient synth",
      durationSeconds: 30,
      logger,
      locale,
      fetchImpl: makeFetch([
        replayJson({ request_id: "fal-music-99" }),
        replayJson({ status: "COMPLETED" }),
        replayJson({ audio: { url: "https://example.test/fal.mp3" } }),
      ]),
    });
    expect(falMusic.success).toBe(true);
    if (falMusic.success) {
      expect(falMusic.data.providerJobId).toBe("fal-music-99");
    }

    const repMusic = await generateMusicWithReplicate({
      providerModel: "meta/musicgen",
      prompt: "ambient synth",
      durationSeconds: 30,
      logger,
      locale,
      fetchImpl: makeFetch([
        replayJson({ id: "rep-music-88", status: "starting" }),
        replayJson({
          id: "rep-music-88",
          status: "succeeded",
          output: "https://example.test/rep.mp3",
        }),
      ]),
    });
    expect(repMusic.success).toBe(true);
    if (repMusic.success) {
      expect(repMusic.data.providerJobId).toBe("rep-music-88");
    }
  });
});
