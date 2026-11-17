/**
 * TTS / STT billing: every voice and transcription route bills its OWN
 * provider rate x the standard markup (rounded up to 0.1 credit), never the
 * old flat Polly / Whisper constants. Real provider costs win when reported.
 */

import { describe, expect, it } from "vitest";

import { ApiProvider } from "../models/models";
import sttEndpoints from "../speech-to-text/definition";
import sttHotkeyEndpoints from "../speech-to-text/hotkey/definition";
import { calculateSttCharge, SttModelId, sttModelOptions } from "../speech-to-text/models";
import ttsEndpoints from "./definition";
import {
  calculateTtsCharge,
  estimateReadAloudCredits,
  TtsChargeMeter,
  TtsModelId,
  ttsModelOptions,
} from "./models";

function ttsRate(id: TtsModelId, apiProvider: ApiProvider): { creditCostPerCharacter: number } {
  const option = ttsModelOptions.find((o) => o.id === id && o.apiProvider === apiProvider);
  expect(option, `${apiProvider} route for ${id}`).toBeDefined();
  return { creditCostPerCharacter: option?.creditCostPerCharacter ?? Number.NaN };
}

function sttRate(id: SttModelId, apiProvider: ApiProvider): { creditCostPerSecond: number } {
  const option = sttModelOptions.find((o) => o.id === id && o.apiProvider === apiProvider);
  expect(option, `${apiProvider} route for ${id}`).toBeDefined();
  return { creditCostPerSecond: option?.creditCostPerSecond ?? Number.NaN };
}

describe("TTS charge per voice", () => {
  it("bills an ElevenLabs voice at its own rate (10.4 credits per 1k chars)", () => {
    const rate = ttsRate(TtsModelId.ELEVENLABS_RACHEL, ApiProvider.ELEVENLABS);
    expect(rate.creditCostPerCharacter).toBe(0.008);
    expect(calculateTtsCharge(rate, 1000, undefined)).toBe(10.4);
  });

  it("bills the same ElevenLabs voice on v4 Turbo at half the v4 rate", () => {
    const v4 = ttsModelOptions.find(
      (o) => o.id === TtsModelId.ELEVENLABS_RACHEL && o.apiProvider === ApiProvider.ELEVENLABS,
    );
    const turbo = ttsModelOptions.find(
      (o) => o.id === TtsModelId.ELEVENLABS_RACHEL_TURBO && o.apiProvider === ApiProvider.ELEVENLABS,
    );
    expect(v4?.providerModel).toBe("eleven_v4:21m00Tcm4TlvDq8ikWAM");
    expect(turbo?.providerModel).toBe("eleven_v4_turbo:21m00Tcm4TlvDq8ikWAM");
    const rate = ttsRate(TtsModelId.ELEVENLABS_RACHEL_TURBO, ApiProvider.ELEVENLABS);
    expect(rate.creditCostPerCharacter).toBe(0.004);
    expect(calculateTtsCharge(rate, 1000, undefined)).toBe(5.2);
  });

  it("bills a cheap Kokoro voice at its own rate, rounded up to 0.1", () => {
    const rate = ttsRate(TtsModelId.KOKORO_BELLA, ApiProvider.NANO_GPT);
    // 1000 x 0.00017 x 1.3 = 0.221 -> 0.3
    expect(calculateTtsCharge(rate, 1000, undefined)).toBe(0.3);
  });

  it("bills the default OpenAI voice at its own rate", () => {
    const rate = ttsRate(TtsModelId.OPENAI_NOVA, ApiProvider.OPENAI_TTS);
    // 1000 x 0.0015 x 1.3 = 1.95 -> 2
    expect(calculateTtsCharge(rate, 1000, undefined)).toBe(2);
  });

  it("prefers the provider's real cost (Eden AI) over the list rate", () => {
    const rate = ttsRate(TtsModelId.OPENAI_NOVA, ApiProvider.EDEN_AI_TTS);
    // $0.016 reported -> 1.6 credits x 1.3 = 2.08 -> 2.1
    expect(calculateTtsCharge(rate, 1000, 0.016)).toBe(2.1);
    // Zero / missing cost falls back to the rate: 1000 x 0.0016 x 1.3 = 2.08 -> 2.1
    expect(calculateTtsCharge(rate, 1000, 0)).toBe(2.1);
  });

  it("never bills zero characters", () => {
    const rate = ttsRate(TtsModelId.OPENAI_NOVA, ApiProvider.OPENAI_TTS);
    expect(calculateTtsCharge(rate, 0, undefined)).toBe(0);
  });
});

describe("streamed TTS (call mode) bills the total once, not per chunk", () => {
  it("sums to the single-request charge, no per-chunk round-up and no double charge", () => {
    const rate = ttsRate(TtsModelId.KOKORO_BELLA, ApiProvider.NANO_GPT);
    const meter = new TtsChargeMeter();
    let deducted = 0;
    // 20 chunks of 50 chars = 1000 chars
    for (let i = 0; i < 20; i++) {
      deducted += meter.addChunk(rate, 50, undefined);
    }
    expect(Math.round(deducted * 10) / 10).toBe(calculateTtsCharge(rate, 1000, undefined));
    expect(meter.total).toBe(0.3);
  });

  it("mixes real-cost and rate chunks", () => {
    const rate = ttsRate(TtsModelId.OPENAI_NOVA, ApiProvider.EDEN_AI_TTS);
    const meter = new TtsChargeMeter();
    // 0.8 credits real + 500 x 0.0016 = 0.8 -> 1.6 x 1.3 = 2.08 -> 2.1
    const a = meter.addChunk(rate, 500, 0.008);
    const b = meter.addChunk(rate, 500, undefined);
    expect(Math.round((a + b) * 10) / 10).toBe(2.1);
  });
});

describe("read-aloud price hint", () => {
  it("prices each player chunk at the voice's rate", () => {
    const sentence = "This sentence is exactly long enough to matter here. ";
    const text = sentence.repeat(40);
    const eleven = estimateReadAloudCredits(text, TtsModelId.ELEVENLABS_RACHEL);
    const kokoro = estimateReadAloudCredits(text, TtsModelId.KOKORO_BELLA);
    expect(eleven).toBeGreaterThan(kokoro * 20);
    expect(estimateReadAloudCredits("", TtsModelId.OPENAI_NOVA)).toBe(0);
  });
});

describe("STT charge per model", () => {
  it("bills Whisper (OpenAI) 60 s at its own rate", () => {
    const rate = sttRate(SttModelId.OPENAI_WHISPER, ApiProvider.OPENAI_STT);
    // 60 x 0.01 x 1.3 = 0.78 -> 0.8
    expect(calculateSttCharge(rate, [{ duration: 60, providerCostUsd: undefined }]).credits).toBe(0.8);
  });

  it("bills Whisper Large V3 (NanoGPT) at its cheap rate, not the flat Whisper rate", () => {
    const rate = sttRate(SttModelId.WHISPER_LARGE_V3, ApiProvider.NANO_GPT);
    // 60 x 0.000825 x 1.3 = 0.064 -> 0.1 (was 0.78)
    expect(calculateSttCharge(rate, [{ duration: 60, providerCostUsd: undefined }]).credits).toBe(0.1);
  });

  it("bills Nemotron ASR above its upstream cost", () => {
    const rate = sttRate(SttModelId.NEMOTRON_ASR, ApiProvider.NANO_GPT);
    // 60 x 0.02267 x 1.3 = 1.768 -> 1.8 (upstream 1.36; was billed 0.78)
    const { credits } = calculateSttCharge(rate, [{ duration: 60, providerCostUsd: undefined }]);
    expect(credits).toBe(1.8);
    expect(credits).toBeGreaterThan(60 * rate.creditCostPerSecond);
  });

  it("prefers the provider's real cost (NanoGPT usage.cost, Eden AI cost)", () => {
    const rate = sttRate(SttModelId.WHISPER_LARGE_V3, ApiProvider.NANO_GPT);
    // $0.001 reported -> 0.1 credits x 1.3 = 0.13 -> 0.2
    const charge = calculateSttCharge(rate, [{ duration: 30, providerCostUsd: 0.001 }]);
    expect(charge.credits).toBe(0.2);
    expect(charge.providerCostChunks).toBe(1);
  });

  it("adds chunks once and charges a 1 s minimum when the provider reports nothing", () => {
    const rate = sttRate(SttModelId.OPENAI_WHISPER, ApiProvider.OPENAI_STT);
    const charge = calculateSttCharge(rate, [
      { duration: 30, providerCostUsd: undefined },
      { duration: 30, providerCostUsd: undefined },
      { duration: 0, providerCostUsd: undefined },
    ]);
    // (60 + 1) x 0.01 x 1.3 = 0.793 -> 0.8
    expect(charge.credits).toBe(0.8);
    expect(charge.minimumChunks).toBe(1);
  });
});

describe("no double charge", () => {
  it("TTS, STT and the STT hotkey carry no endpoint-level credits on top of the per-model charge", () => {
    expect(ttsEndpoints.POST.credits).toBeUndefined();
    expect(sttEndpoints.POST.credits).toBeUndefined();
    expect(sttHotkeyEndpoints.POST.credits).toBeUndefined();
  });
});
