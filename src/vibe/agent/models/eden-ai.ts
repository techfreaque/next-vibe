/**
 * Eden AI API v3 (expert models): endpoints, route encoding, response schemas.
 *
 * API v2 (`/v2/audio/...`, `/v2/info/provider_subfeatures`) shuts down on
 * 2026-12-31. v3 routes every expert feature through one endpoint keyed by a
 * model string `feature/subfeature/provider[/model]`:
 * - TTS (sync):  POST /v3/universal-ai        model `audio/tts/<provider>/<model>`
 * - STT (async): POST /v3/upload (multipart) → file_id, then
 *                POST /v3/universal-ai/async  model `audio/speech_to_text_async/<provider>`
 *                GET  /v3/universal-ai/async/{public_id} until status != processing
 * - Pricing:     GET  /v3/info/{feature}/{subfeature} (public, no auth)
 * Every response carries `cost`: what Eden charged us in USD, as a decimal STRING.
 * Docs: https://www.edenai.co/docs/v3/expert-models/features/audio/tts.md
 *       https://www.edenai.co/docs/v3/expert-models/features/audio/speech-to-text-async.md
 */

import { z } from "zod";

const EDEN_AI_V3_BASE_URL = "https://api.edenai.run/v3";

export const EDEN_AI_URLS = {
  universalAi: `${EDEN_AI_V3_BASE_URL}/universal-ai`,
  universalAiAsync: `${EDEN_AI_V3_BASE_URL}/universal-ai/async`,
  upload: `${EDEN_AI_V3_BASE_URL}/upload`,
  ttsInfo: `${EDEN_AI_V3_BASE_URL}/info/audio/tts`,
  sttInfo: `${EDEN_AI_V3_BASE_URL}/info/audio/speech_to_text_async`,
} as const;

/** Model string prefixes (`feature/subfeature/`). */
export const EDEN_AI_TTS_MODEL_PREFIX = "audio/tts/";
export const EDEN_AI_STT_MODEL_PREFIX = "audio/speech_to_text_async/";

/**
 * An Eden AI TTS route's `providerModel` is `<provider>/<model>:<voice>`
 * (e.g. `openai/tts-1:nova`), the same "model:voice" shape NanoGPT and
 * ElevenLabs routes use. Voice is optional (Eden then uses the model default).
 */
export function parseEdenAiTtsProviderModel(providerModel: string): {
  /** Full v3 model string, e.g. `audio/tts/openai/tts-1`. */
  model: string;
  /** `<provider>/<model>` part, the key the v3 pricing catalog uses. */
  modelKey: string;
  voice: string | undefined;
} {
  const separator = providerModel.indexOf(":");
  const modelKey =
    separator === -1 ? providerModel : providerModel.slice(0, separator);
  const voice =
    separator === -1 ? undefined : providerModel.slice(separator + 1);
  return {
    model: `${EDEN_AI_TTS_MODEL_PREFIX}${modelKey}`,
    modelKey,
    voice: voice || undefined,
  };
}

/** STT `providerModel` is `<provider>[/<model>]` (e.g. `openai`). */
export function edenAiSttModel(providerModel: string): string {
  return `${EDEN_AI_STT_MODEL_PREFIX}${providerModel}`;
}

/**
 * Eden AI reports cost as a decimal string ("0.000570000"). Returns USD, or
 * undefined when missing/unparseable so billing falls back to the list rate.
 */
export function parseEdenAiCost(
  cost: string | number | null | undefined,
): number | undefined {
  if (cost === null || cost === undefined) {
    return undefined;
  }
  const value = typeof cost === "number" ? cost : Number.parseFloat(cost);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
}

const edenAiErrorSchema = z
  .looseObject({
    message: z.string().nullish(),
    type: z.string().nullish(),
  })
  .nullish();

const edenAiCostSchema = z.union([z.string(), z.number()]).nullish();

/** POST /v3/universal-ai response for `audio/tts/*`. */
export const edenAiTtsResponseSchema = z.looseObject({
  status: z.string(),
  cost: edenAiCostSchema,
  provider: z.string().nullish(),
  output: z
    .looseObject({ audio_resource_url: z.string().nullish() })
    .nullish(),
  error: edenAiErrorSchema,
});

/** POST /v3/upload response. `metadata.duration` (seconds) for audio. */
export const edenAiUploadResponseSchema = z.looseObject({
  file_id: z.string(),
  metadata: z
    .looseObject({ duration: z.number().nullish() })
    .nullish(),
});

/** POST + GET /v3/universal-ai/async response for `audio/speech_to_text_async/*`. */
export const edenAiSttJobSchema = z.looseObject({
  status: z.string(),
  cost: edenAiCostSchema,
  public_id: z.string().nullish(),
  provider: z.string().nullish(),
  output: z
    .looseObject({
      text: z.string().nullish(),
      diarization: z
        .looseObject({
          entries: z
            .array(
              z.looseObject({
                end_time: z.union([z.string(), z.number()]).nullish(),
                confidence: z.number().nullish(),
              }),
            )
            .nullish(),
        })
        .nullish(),
    })
    .nullish(),
  error: edenAiErrorSchema,
});

export type EdenAiSttJob = z.infer<typeof edenAiSttJobSchema>;

/** GET /v3/info/{feature}/{subfeature} response (only the parts we read). */
export const edenAiInfoSchema = z.looseObject({
  models: z.array(z.looseObject({})),
});

export const edenAiInfoModelSchema = z.object({
  model: z.string(),
  pricing: z.object({
    price: z.union([z.number(), z.string()]),
    price_unit_quantity: z.number(),
    price_unit_type: z.string(),
  }),
});

/** Human-readable message from an Eden AI error object. */
export function edenAiErrorMessage(
  error: z.infer<typeof edenAiErrorSchema>,
): string | undefined {
  return error?.message ?? error?.type ?? undefined;
}
