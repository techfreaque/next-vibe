/**
 * Facts for the public /models/<slug> pages of non-chat models (image, video,
 * music, text-to-voice, voice-to-text). Pure + static, built from the same
 * definitions and sellability guards as the catalog, so every catalog row has
 * a real page behind it.
 */

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import type { AgentTranslationKey } from "next-vibe/agent/i18n";
import type { CommercialUseInfo } from "next-vibe/agent/models/commercial-use/enum";
import { type Modality, ModelUtility } from "next-vibe/agent/models/enum";
import {
  type AnyModelId,
  apiProviderDisplayNames,
  getModelPrice,
  getProviderPrice,
  type ModelProviderConfig,
  modelProviders,
  PRICE_REFERENCE_STT_SECONDS,
  PRICE_REFERENCE_TTS_CHARS,
} from "next-vibe/agent/models/models";
import type {
  ContentLevelValue,
  IntelligenceLevelValue,
} from "next-vibe/agent/skills/enum";
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
  provider: string;
  unit: MediaType;
  /** Seconds (video clip, transcribed audio) or characters (speech); null for image/music. */
  amount: number | null;
}

function mediaPrice(
  type: MediaType,
  config: ModelProviderConfig,
): MediaPrice | null {
  const credits = getModelPrice(config);
  if (!(credits > 0)) {
    return null;
  }
  const base = {
    credits,
    provider: apiProviderDisplayNames[config.apiProvider],
    unit: type,
  };
  let amount: number | null = null;
  switch (type) {
    case "video":
      amount =
        "defaultDurationSeconds" in config
          ? (config.defaultDurationSeconds ?? null)
          : null;
      break;
    case "tts":
      amount = PRICE_REFERENCE_TTS_CHARS;
      break;
    case "stt":
      amount = PRICE_REFERENCE_STT_SECONDS;
      break;
  }
  return { ...base, amount };
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
  /** Commercial use of outputs per license + provider terms; null when not researched. */
  commercialUse: CommercialUseInfo | null;
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
      const configs = visibleProviders(def, { availability }).toSorted(
        (a, b) => getProviderPrice(a) - getProviderPrice(b),
      );
      const first = configs[0];
      if (first === undefined) {
        continue;
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
        providers: [
          ...new Set(
            configs.map(
              ({ apiProvider }) => apiProviderDisplayNames[apiProvider],
            ),
          ),
        ],
        isLegacy: def.utilities.includes(ModelUtility.LEGACY),
        commercialUse: def.commercialUse ?? null,
        price: mediaPrice(type, first),
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
