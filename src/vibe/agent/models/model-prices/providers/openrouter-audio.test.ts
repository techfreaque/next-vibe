import { describe, expect, it, spyOn } from "bun:test";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { SttModelId, sttModelOptions } from "../../../speech-to-text/models";
import { TtsModelId, ttsModelOptions } from "../../../text-to-speech/models";
import { ContentLevel } from "../../../skills/enum";
import { CommercialUse, CommercialUseReason } from "../../commercial-use/enum";
import { ApiProvider } from "../../models";
import { OpenRouterAudioPriceFetcher } from "./openrouter-audio";

const qwenTtsId = "qwen/qwen3-tts-1.7b";
const orpheusId = "canopylabs/orpheus-3b-0.1-ft";
const parakeetId = "nvidia/parakeet-tdt-0.6b-v3";
const nemotronId = "nvidia/nemotron-3.5-transcribe";

function endpoint(prompt: string, completion = "0", status = 0) {
  return { status, pricing: { prompt, completion, discount: 0 } };
}

function catalog(id: string, modality: string, endpoints: ReturnType<typeof endpoint>[]): Response {
  return Response.json({
    data: {
      id,
      architecture: { output_modalities: [modality] },
      endpoints,
    },
  });
}

describe("OpenRouter speech model prices", () => {
  it("matches voice variants and reserves the highest active route's flat tariff", async () => {
    const transport = spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(catalog(qwenTtsId, "speech", [endpoint("0.00002")]))
      .mockResolvedValueOnce(
        catalog(orpheusId, "speech", [
          endpoint("0.000007"),
          endpoint("0.000015"),
          endpoint("1", "0", -2),
        ]),
      )
      .mockResolvedValueOnce(
        catalog(parakeetId, "transcription", [endpoint("0.0000166667"), endpoint("0.000025")]),
      )
      .mockResolvedValueOnce(
        catalog(nemotronId, "transcription", [endpoint("0.0000166667"), endpoint("0.0000333")]),
      );
    try {
      const result = await new OpenRouterAudioPriceFetcher().fetch(
        createEndpointLogger(false, defaultLocale),
      );
      expect(result.failures).toEqual([]);
      const resolved = [
        ...ttsModelOptions.filter((row) => row.apiProvider === ApiProvider.OPENROUTER),
        ...sttModelOptions.filter((row) => row.apiProvider === ApiProvider.OPENROUTER),
      ];
      expect(result.updates).toHaveLength(resolved.length);
      for (const row of resolved) {
        const update = result.updates.find((price) => price.modelId === row.id);
        expect(update?.providerModel).toBe(row.providerModel);
        expect(update?.value).toBe(row.creditCostPerCharacter ?? row.creditCostPerSecond);
        expect(row.content).toBe(ContentLevel.OPEN);
        expect(row.commercialUse).toEqual({
          status: CommercialUse.ALLOWED,
          reason: CommercialUseReason.OPEN_LICENSE,
        });
      }
      expect(result.updates).toContainEqual(
        expect.objectContaining({
          modelId: TtsModelId.ORPHEUS_TARA,
          field: "creditCostPerCharacter",
          value: 0.0015,
        }),
      );
      expect(result.updates).toContainEqual(
        expect.objectContaining({
          modelId: SttModelId.PARAKEET_TDT_V3,
          field: "creditCostPerSecond",
          value: 0.0025,
        }),
      );
    } finally {
      transport.mockRestore();
    }
  });

  it("reports incompatible and unavailable quotes without overwriting prices", async () => {
    const transport = spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(catalog(qwenTtsId, "speech", [endpoint("0.00002", "0.00001")]))
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(catalog(parakeetId, "transcription", []))
      .mockResolvedValueOnce(new Response(null, { status: 404 }));
    try {
      const result = await new OpenRouterAudioPriceFetcher().fetch(
        createEndpointLogger(false, defaultLocale),
      );
      expect(result.updates).toEqual([]);
      expect(result.failures).toHaveLength(4);
      expect(result.failedApiProviders).toEqual([ApiProvider.OPENROUTER]);
      expect(result.error).toContain("503");
    } finally {
      transport.mockRestore();
    }
  });
});
