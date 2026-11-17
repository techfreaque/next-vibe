/**
 * ElevenLabs route encoding.
 *
 * An ElevenLabs route's `providerModel` is `<model_id>:<voice_id>`, the same
 * "model:voice" shape NanoGPT routes use, so one voice can be offered on
 * several ElevenLabs models, each at its own per-character price.
 * Models (https://elevenlabs.io/docs/models, prices https://elevenlabs.io/pricing/api):
 * - eleven_v4: flagship quality, $0.08 per 1K characters
 * - eleven_v4_turbo: real-time variant (~100 ms), $0.04 per 1K characters
 */

export const ElevenLabsTtsModel = {
  V4: "eleven_v4",
  V4_TURBO: "eleven_v4_turbo",
} as const;

export type ElevenLabsTtsModel =
  (typeof ElevenLabsTtsModel)[keyof typeof ElevenLabsTtsModel];

/** Model used for a bare voice id (routes written before the model prefix). */
export const DEFAULT_ELEVENLABS_TTS_MODEL: ElevenLabsTtsModel =
  ElevenLabsTtsModel.V4;

export function elevenLabsProviderModel(
  model: ElevenLabsTtsModel,
  voiceId: string,
): string {
  return `${model}:${voiceId}`;
}

export function parseElevenLabsProviderModel(providerModel: string): {
  modelId: string;
  voiceId: string;
} {
  const separator = providerModel.indexOf(":");
  if (separator === -1) {
    return { modelId: DEFAULT_ELEVENLABS_TTS_MODEL, voiceId: providerModel };
  }
  return {
    modelId: providerModel.slice(0, separator),
    voiceId: providerModel.slice(separator + 1),
  };
}
