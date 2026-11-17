/**
 * Facts for the public /models/<slug> pages of non-chat models (image, video,
 * music, text-to-voice, voice-to-text). Pure + static, built from the same
 * definitions and sellability guards as the catalog, so every catalog row has
 * a real page behind it.
 */

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import type { AgentTranslationKey } from "next-vibe/agent/i18n";
import { imageGenModelOptions } from "next-vibe/agent/image-generation/models";
import { type Modality, ModelUtility } from "next-vibe/agent/models/enum";
import {
  type AnyModelId,
  type AnyModelOption,
  apiProviderDisplayNames,
  getModelPrice,
  getProviderPrice,
  modelProviders,
  PRICE_REFERENCE_STT_SECONDS,
  PRICE_REFERENCE_TTS_CHARS,
} from "next-vibe/agent/models/models";
import { musicGenModelOptions } from "next-vibe/agent/music-generation/models";
import type {
  ContentLevelValue,
  IntelligenceLevelValue,
} from "next-vibe/agent/skills/enum";
import { sttModelOptions } from "next-vibe/agent/speech-to-text/models";
import { ttsModelOptions } from "next-vibe/agent/text-to-speech/models";
import { videoGenModelOptions } from "next-vibe/agent/video-generation/models";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";

import {
  createHref,
  type CreateKind,
} from "@/_pages/create/_shared/create-kinds";

import {
  CATALOG_DEFINITIONS,
  type CatalogType,
  listCatalogEntries,
  toDefinitionSlug,
  visibleProviders,
} from "./model-catalog-entries";

export type MediaType = Exclude<CatalogType, "text">;

export const MEDIA_TYPES: readonly MediaType[] = [
  "image",
  "video",
  "audio",
  "tts",
  "stt",
];

/**
 * What one priced use is: an image, a music clip, a video clip of `amount`
 * seconds, `amount` characters of speech, or `amount` seconds of audio.
 */
export interface MediaPrice {
  credits: number;
  unit: MediaType;
  /** Seconds (video clip, transcribed audio) or characters (speech); null for image/music. */
  amount: number | null;
}

/**
 * The same option and reference size ModelCreditDisplay prices, so the static
 * numbers (FAQ, meta, JSON-LD) match the live price row on the page.
 */
function findMediaOption(
  type: MediaType,
  modelId: AnyModelId,
): AnyModelOption | undefined {
  switch (type) {
    case "image":
      return imageGenModelOptions.find((option) => option.id === modelId);
    case "video":
      return videoGenModelOptions.find((option) => option.id === modelId);
    case "audio":
      return musicGenModelOptions.find((option) => option.id === modelId);
    case "tts":
      return ttsModelOptions.find((option) => option.id === modelId);
    case "stt":
      return sttModelOptions.find((option) => option.id === modelId);
  }
}

function mediaPrice(type: MediaType, modelId: AnyModelId): MediaPrice | null {
  const option = findMediaOption(type, modelId);
  if (option === undefined) {
    return null;
  }
  const credits = getModelPrice(option);
  if (!(credits > 0)) {
    return null;
  }
  switch (type) {
    case "video":
      return {
        credits,
        unit: type,
        amount:
          "defaultDurationSeconds" in option &&
          typeof option.defaultDurationSeconds === "number"
            ? option.defaultDurationSeconds
            : null,
      };
    case "tts":
      return { credits, unit: type, amount: PRICE_REFERENCE_TTS_CHARS };
    case "stt":
      return { credits, unit: type, amount: PRICE_REFERENCE_STT_SECONDS };
    case "image":
    case "audio":
      return { credits, unit: type, amount: null };
  }
}

export interface MediaModelFacts {
  type: MediaType;
  modelId: AnyModelId;
  slug: string;
  name: string;
  icon: IconKey;
  labName: string;
  description: AgentTranslationKey;
  content: typeof ContentLevelValue;
  intelligence: typeof IntelligenceLevelValue;
  inputs: Modality[];
  outputs: Modality[];
  /** Public API providers serving this model (display names, cheapest first). */
  providers: string[];
  isLegacy: boolean;
  /** Price of one reference use; null when the registry has no sellable price. */
  price: MediaPrice | null;
}

function buildAll(availability: AgentEnvAvailability): MediaModelFacts[] {
  const result: MediaModelFacts[] = [];
  for (const type of MEDIA_TYPES) {
    for (const entry of listCatalogEntries(type, { availability })) {
      if (entry.slug === null) {
        continue;
      }
      const defKey = entry.key.slice(type.length + 1);
      const def = CATALOG_DEFINITIONS[type][defKey];
      if (def === undefined) {
        continue;
      }
      const providers: string[] = [];
      for (const provider of visibleProviders(def, { availability }).toSorted(
        (a, b) => getProviderPrice(a) - getProviderPrice(b),
      )) {
        const label = apiProviderDisplayNames[provider.apiProvider];
        if (!providers.includes(label)) {
          providers.push(label);
        }
      }
      result.push({
        type,
        modelId: entry.modelId,
        slug: toDefinitionSlug(defKey),
        name: def.name,
        icon: def.icon,
        labName: modelProviders[def.by]?.name ?? def.by,
        description: def.description,
        content: def.content,
        intelligence: def.intelligence,
        inputs: def.inputs,
        outputs: def.outputs,
        providers,
        isLegacy: def.utilities.includes(ModelUtility.LEGACY),
        price: mediaPrice(type, entry.modelId),
      });
    }
  }
  return result;
}

/** Keyed by the availability flags: one entry per configuration, in practice one. */
const cache = new Map<string, MediaModelFacts[]>();

/**
 * Facts for every publicly visible media/voice model whose provider key is
 * configured on this instance (no key, no page / row / sitemap entry).
 */
export function listMediaFacts(
  availability: AgentEnvAvailability,
): MediaModelFacts[] {
  const key = JSON.stringify(availability);
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const built = buildAll(availability);
  cache.set(key, built);
  return built;
}

/** Resolve a URL segment to an available media/voice model. */
export function findMediaFacts(
  segment: string,
  availability: AgentEnvAvailability,
): MediaModelFacts | null {
  const decoded = decodeURIComponent(segment).toLowerCase();
  const normalized = decoded.replaceAll(/[._]+/g, "-");
  return (
    listMediaFacts(availability).find(
      (facts) => facts.slug === decoded || facts.slug === normalized,
    ) ?? null
  );
}

/** Create page of each media type (never the internal /tools pages). */
const CREATE_KIND_BY_MEDIA: Record<MediaType, CreateKind> = {
  image: "image",
  video: "video",
  audio: "music",
  tts: "speech",
  stt: "transcribe",
};

/** Create page link with this model preselected (?model= / ?voiceId= / ?modelId=). */
export function createPageHref(locale: string, facts: MediaModelFacts): string {
  return createHref(locale, CREATE_KIND_BY_MEDIA[facts.type], facts.modelId);
}
