/**
 * Which media models an API key's user can call, per /v1 media endpoint. Same
 * pools + per-user filtering the media tools use (provider key configured,
 * admin-only routes hidden); a model is servable only when the route its tool
 * actually runs on is available, so /v1/models never lists a model the call
 * would then reject.
 */

import "server-only";

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import {
  filterImageGenModels,
  getImageGenModelById,
  ImageGenModelId,
  type ImageGenModelOption,
  imageGenModelOptions,
  resolveImageGenModelSuccessor,
} from "next-vibe/agent/image-generation/models";
import {
  calculateCreditCost,
  calculateSttCreditCost,
  calculateTtsCreditCost,
  chargeForProviderCredits,
  type ModelOptionBase,
} from "next-vibe/agent/models/models";
import {
  filterMusicGenModels,
  getMusicGenModelById,
  MusicGenModelId,
  type MusicGenModelOption,
  musicGenModelOptions,
} from "next-vibe/agent/music-generation/models";
import { ModelSelectionType } from "next-vibe/agent/skills/enum";
import {
  filterSttModels,
  SttModelId,
  type SttModelOption,
} from "next-vibe/agent/speech-to-text/models";
import {
  filterTtsModels,
  TtsModelId,
  type TtsModelOption,
} from "next-vibe/agent/text-to-speech/models";
import {
  filterVideoGenModels,
  getVideoGenModelById,
  VideoGenModelId,
  type VideoGenModelOption,
  videoGenModelOptions,
} from "next-vibe/agent/video-generation/models";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";

/** What a model does on the /v1 surface (the `modality` field of /v1/models). */
export type V1Modality =
  | "chat"
  | "image"
  | "video"
  | "music"
  | "speech"
  | "transcription";

/** The /v1 paths a modality is called on. */
export const V1_MODALITY_ENDPOINTS: Record<V1Modality, readonly string[]> = {
  chat: ["/v1/chat/completions", "/v1/responses", "/v1/messages"],
  image: ["/v1/images/generations", "/v1/images/edits"],
  video: ["/v1/videos"],
  music: ["/v1/music"],
  speech: ["/v1/audio/speech"],
  transcription: ["/v1/audio/transcriptions"],
};

/** One media model as GET /v1/models reports it. */
export interface V1MediaModel {
  id: string;
  name: string;
  /** model maker (OpenAI, Black Forest Labs, ...) */
  ownedBy: string;
  modality: Exclude<V1Modality, "chat">;
  endpoints: readonly string[];
  inputs: ModelOptionBase["inputs"];
  outputs: ModelOptionBase["outputs"];
  content: ModelOptionBase["content"];
  /** listed price in credits (1 credit = $0.01); real cost x markup may differ */
  pricing: Record<string, number | null>;
}

function manual<TId extends string>(
  id: TId,
): { selectionType: typeof ModelSelectionType.MANUAL; manualModelId: TId } {
  return { selectionType: ModelSelectionType.MANUAL, manualModelId: id };
}

function enumValue<TEnum extends string>(
  values: readonly TEnum[],
  requested: string,
): TEnum | undefined {
  const lower = requested.trim().toLowerCase();
  return values.find((value) => value === requested || value === lower);
}

/** The route `indexed` runs on is among what the user may call right now. */
function routeServable<TOption extends ModelOptionBase>(
  indexed: TOption | undefined,
  available: TOption[],
): indexed is TOption {
  return (
    indexed !== undefined &&
    available.some(
      (option) =>
        option.id === indexed.id && option.apiProvider === indexed.apiProvider,
    )
  );
}

// ---------------------------------------------------------------- images

export function resolveV1ImageModel(
  requested: string,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ImageGenModelOption | undefined {
  const id = enumValue(Object.values(ImageGenModelId), stripVendor(requested));
  if (!id) {
    return undefined;
  }
  const current = resolveImageGenModelSuccessor(id);
  const indexed = getImageGenModelById(current);
  return routeServable(
    indexed,
    filterImageGenModels(manual(current), user, availability),
  )
    ? indexed
    : undefined;
}

// ---------------------------------------------------------------- videos

export function resolveV1VideoModel(
  requested: string,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): VideoGenModelOption | undefined {
  const id = enumValue(Object.values(VideoGenModelId), stripVendor(requested));
  if (!id) {
    return undefined;
  }
  const indexed = getVideoGenModelById(id);
  return routeServable(
    indexed,
    filterVideoGenModels(manual(id), user, availability),
  )
    ? indexed
    : undefined;
}

// ---------------------------------------------------------------- music

export function resolveV1MusicModel(
  requested: string,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): MusicGenModelOption | undefined {
  const id = enumValue(Object.values(MusicGenModelId), stripVendor(requested));
  if (!id) {
    return undefined;
  }
  const indexed = getMusicGenModelById(id);
  return routeServable(
    indexed,
    filterMusicGenModels(manual(id), user, availability),
  )
    ? indexed
    : undefined;
}

// ---------------------------------------------------------------- speech

/** OpenAI speech model names; with a `voice` they map to our OpenAI voices. */
const OPENAI_SPEECH_MODELS = ["tts-1", "tts-1-hd", "gpt-4o-mini-tts"];

/**
 * The voice a /v1/audio/speech request runs: our voice id in `model`
 * ("openai-nova", "kokoro-bella"), or a family + voice pair: OpenAI's
 * `model: "tts-1", voice: "nova"` -> openai-nova, `model: "kokoro",
 * voice: "bella"` -> kokoro-bella. A voice id in `voice` also works.
 * Returns the route the TTS tool will run (cheapest available provider).
 */
export function resolveV1SpeechVoice(
  model: string,
  voice: string | undefined,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): TtsModelOption | undefined {
  const ids = Object.values(TtsModelId);
  const candidates: string[] = [model];
  if (voice) {
    candidates.push(voice);
    const family = OPENAI_SPEECH_MODELS.includes(model.trim().toLowerCase())
      ? "openai"
      : stripVendor(model).toLowerCase();
    candidates.push(`${family}-${voice.trim().toLowerCase()}`);
  }
  for (const candidate of candidates) {
    const id = enumValue(ids, candidate);
    if (!id) {
      continue;
    }
    const [route] = filterTtsModels(manual(id), user, availability);
    return route?.id === id ? route : undefined;
  }
  return undefined;
}

// ---------------------------------------------------------- transcription

/** Vendor names clients send for our transcription models. */
const STT_ALIASES: Partial<Record<string, SttModelId>> = {
  "whisper-1": SttModelId.OPENAI_WHISPER,
  whisper: SttModelId.OPENAI_WHISPER,
  "gpt-4o-mini-transcribe": SttModelId.GPT4O_MINI_TRANSCRIBE,
  "nova-2": SttModelId.DEEPGRAM_NOVA_2,
};

export function resolveV1TranscriptionModel(
  requested: string,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): SttModelOption | undefined {
  const name = stripVendor(requested).toLowerCase();
  const id = enumValue(Object.values(SttModelId), name) ?? STT_ALIASES[name];
  if (!id) {
    return undefined;
  }
  const [route] = filterSttModels(manual(id), user, availability);
  return route?.id === id ? route : undefined;
}

/** "openai/whisper-1" -> "whisper-1" */
function stripVendor(requested: string): string {
  return requested.trim().replace(/^[a-z0-9-]+\//i, "");
}

// ---------------------------------------------------------------- listing

function entry(
  option: ModelOptionBase,
  modality: V1MediaModel["modality"],
  pricing: V1MediaModel["pricing"],
): V1MediaModel {
  return {
    id: option.id,
    name: option.name,
    ownedBy: option.provider,
    modality,
    endpoints: V1_MODALITY_ENDPOINTS[modality],
    inputs: option.inputs,
    outputs: option.outputs,
    content: option.content,
    pricing,
  };
}

/** Every media model this user can call right now, one entry per id. */
export function listUserMediaModels(
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): V1MediaModel[] {
  const models: V1MediaModel[] = [];
  for (const option of imageGenModelOptions) {
    if (resolveV1ImageModel(option.id, user, availability)?.id !== option.id) {
      continue;
    }
    models.push(
      entry(option, "image", {
        credits_per_image:
          option.creditCostPerImage !== undefined
            ? calculateCreditCost(option, 0, 0)
            : null,
      }),
    );
  }
  for (const option of videoGenModelOptions) {
    if (resolveV1VideoModel(option.id, user, availability)?.id !== option.id) {
      continue;
    }
    models.push(
      entry(option, "video", {
        credits_per_second: chargeForProviderCredits(
          option.creditCostPerSecond,
        ),
      }),
    );
  }
  for (const option of musicGenModelOptions) {
    if (resolveV1MusicModel(option.id, user, availability)?.id !== option.id) {
      continue;
    }
    models.push(
      entry(option, "music", {
        credits_per_clip: calculateCreditCost(option, 0, 0),
      }),
    );
  }
  for (const id of Object.values(TtsModelId)) {
    const route = resolveV1SpeechVoice(id, undefined, user, availability);
    if (route) {
      models.push(
        entry(route, "speech", {
          credits_per_1k_characters: calculateTtsCreditCost(route, 1000),
        }),
      );
    }
  }
  for (const id of Object.values(SttModelId)) {
    const route = resolveV1TranscriptionModel(id, user, availability);
    if (route) {
      models.push(
        entry(route, "transcription", {
          credits_per_minute: calculateSttCreditCost(route, 60),
        }),
      );
    }
  }
  return models;
}
