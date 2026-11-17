/**
 * Eden AI v3 route encoding + response parsing.
 */

import { describe, expect, it } from "vitest";

import {
  edenAiSttJobSchema,
  edenAiSttModel,
  edenAiTtsResponseSchema,
  parseEdenAiCost,
  parseEdenAiTtsProviderModel,
} from "./eden-ai";

describe("Eden AI v3 route encoding", () => {
  it("splits a TTS route into model string, catalog key and voice", () => {
    expect(parseEdenAiTtsProviderModel("openai/tts-1:nova")).toEqual({
      model: "audio/tts/openai/tts-1",
      modelKey: "openai/tts-1",
      voice: "nova",
    });
  });

  it("leaves the voice to Eden when the route names none", () => {
    expect(parseEdenAiTtsProviderModel("amazon/neural").voice).toBeUndefined();
  });

  it("builds the async STT model string", () => {
    expect(edenAiSttModel("openai")).toBe("audio/speech_to_text_async/openai");
  });
});

describe("Eden AI v3 cost", () => {
  it("parses the decimal cost string (USD)", () => {
    expect(parseEdenAiCost("0.000570000")).toBeCloseTo(0.00057, 9);
    expect(
      parseEdenAiCost(
        "0.00023279999999999999370052516933782271735253743827342987060546875",
      ),
    ).toBeCloseTo(0.0002328, 9);
  });

  it("returns undefined for a missing or broken cost (list rate fallback)", () => {
    expect(parseEdenAiCost(undefined)).toBeUndefined();
    expect(parseEdenAiCost(null)).toBeUndefined();
    expect(parseEdenAiCost("n/a")).toBeUndefined();
  });
});

describe("Eden AI v3 response schemas", () => {
  it("reads a TTS response (live shape 2026-11-17)", () => {
    const parsed = edenAiTtsResponseSchema.parse({
      status: "success",
      cost: "0.000570000",
      provider: "openai",
      feature: "audio",
      subfeature: "tts",
      output_format: "full",
      output: { audio_resource_url: "https://cdn.example/a.mp3" },
      error: null,
      original_response: null,
    });
    expect(parsed.output?.audio_resource_url).toBe("https://cdn.example/a.mp3");
  });

  it("reads an STT job that finished inline (live shape 2026-11-17)", () => {
    const parsed = edenAiSttJobSchema.parse({
      status: "success",
      cost: "0.0002328",
      provider: "openai",
      feature: "audio",
      subfeature: "speech_to_text_async",
      output: {
        text: "Hello, this is a short migration test.",
        diarization: { total_speakers: 0, entries: [], error_message: null },
      },
      error: null,
      public_id: "70bfad53-0eac-46ce-a75c-9461b9d9ea3c",
      model: null,
      created_at: "2026-11-17T11:59:30.476491Z",
    });
    expect(parsed.output?.text).toBe("Hello, this is a short migration test.");
    expect(parsed.public_id).toBe("70bfad53-0eac-46ce-a75c-9461b9d9ea3c");
  });
});
