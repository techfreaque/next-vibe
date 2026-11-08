/**
 * Facts for the public /models/<slug> pages of non-chat models (image, video,
 * music, text-to-voice, voice-to-text). Pure + static, built from the same
 * definitions and sellability guards as the catalog, so every catalog row has
 * a real page behind it.
 */

import { IMAGE_GEN_ALIAS } from "next-vibe/agent/image-generation/constants";
import { ModelUtility, type Modality } from "next-vibe/agent/models/enum";
import {
  type AnyModelId,
  apiProviderDisplayNames,
  getProviderPrice,
  modelProviders,
} from "next-vibe/agent/models/models";
import { MUSIC_GEN_ALIAS } from "next-vibe/agent/music-generation/constants";
import type {
  ContentLevelValue,
  IntelligenceLevelValue,
} from "next-vibe/agent/skills/enum";
import { TRANSCRIBE_AUDIO_ALIAS } from "next-vibe/agent/speech-to-text/constants";
import { TEXT_TO_SPEECH_ALIAS } from "next-vibe/agent/text-to-speech/constants";
import { VIDEO_GEN_ALIAS } from "next-vibe/agent/video-generation/constants";
import type { AgentTranslationKey } from "next-vibe/agent/i18n";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";

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

/** Generation tool page per media type: /{locale}/tools/<alias>. */
const TOOL_ALIAS: Record<MediaType, string> = {
  image: IMAGE_GEN_ALIAS,
  video: VIDEO_GEN_ALIAS,
  audio: MUSIC_GEN_ALIAS,
  tts: TEXT_TO_SPEECH_ALIAS,
  stt: TRANSCRIBE_AUDIO_ALIAS,
};

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
  /** Alias of the generation tool page for this model type */
  toolAlias: string;
}

function buildAll(): MediaModelFacts[] {
  const result: MediaModelFacts[] = [];
  for (const type of MEDIA_TYPES) {
    for (const entry of listCatalogEntries(type)) {
      if (entry.slug === null) {
        continue;
      }
      const defKey = entry.key.slice(type.length + 1);
      const def = CATALOG_DEFINITIONS[type][defKey];
      if (def === undefined) {
        continue;
      }
      const providers: string[] = [];
      for (const provider of visibleProviders(def, {}).toSorted(
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
        toolAlias: TOOL_ALIAS[type],
      });
    }
  }
  return result;
}

let cache: MediaModelFacts[] | null = null;

/** Facts for every publicly visible media/voice model. */
export function listMediaFacts(): MediaModelFacts[] {
  cache ??= buildAll();
  return cache;
}

/** Resolve a URL segment to a media/voice model. */
export function findMediaFacts(segment: string): MediaModelFacts | null {
  const decoded = decodeURIComponent(segment).toLowerCase();
  const normalized = decoded.replaceAll(/[._]+/g, "-");
  return (
    listMediaFacts().find(
      (facts) => facts.slug === decoded || facts.slug === normalized,
    ) ?? null
  );
}

/** Form field of each generation tool that holds the model/voice selection. */
const TOOL_MODEL_PARAM: Record<MediaType, string> = {
  image: "model",
  video: "model",
  audio: "model",
  tts: "voiceId",
  stt: "modelId",
};

/** Tool page link with this model preselected (tool page seeds ?<field>=<value> into the form). */
export function toolHref(locale: string, facts: MediaModelFacts): string {
  const param = TOOL_MODEL_PARAM[facts.type];
  return `/${locale}/tools/${facts.toolAlias}?${param}=${encodeURIComponent(facts.modelId)}`;
}
