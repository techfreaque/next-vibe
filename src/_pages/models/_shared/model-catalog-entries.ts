/**
 * Catalog entries for the shared model catalog (public /models + the pricing
 * widget). One flat, serialisable row per model across every role (chat, voice,
 * image, music, video). Pure + server-safe.
 *
 * Guards: a model only appears when at least one visible provider can actually
 * be sold (`isProviderSellable` - never a 0-priced / unpriced model) and the
 * model is not auto-disabled by the price updater.
 */

import { chatModelDefinitions } from "next-vibe/agent/ai-stream/models";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { imageGenModelDefinitions } from "next-vibe/agent/image-generation/models";
import { ModelUtility } from "next-vibe/agent/models/enum";
import {
  type AnyModelId,
  getProviderPrice,
  isApiProviderAvailable,
  isProviderSellable,
  type ModelDefinition,
  type ModelProviderConfig,
  modelProviders,
} from "next-vibe/agent/models/models";
import { musicGenModelDefinitions } from "next-vibe/agent/music-generation/models";
import type { ContentLevelValue } from "next-vibe/agent/skills/enum";
import { sttModelDefinitions } from "next-vibe/agent/speech-to-text/models";
import { ttsModelDefinitions } from "next-vibe/agent/text-to-speech/models";
import { videoGenModelDefinitions } from "next-vibe/agent/video-generation/models";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";

import {
  formatTokenCount,
  isModelPageAlias,
  PUBLIC_CHAT_MODEL_IDS,
  toModelSlug,
} from "./model-facts";

/** Catalog tabs, in display order. Keys match the pricing widget's. */
export const CATALOG_TYPE_ORDER = [
  "text",
  "tts",
  "stt",
  "image",
  "audio",
  "video",
] as const;
export type CatalogType = (typeof CATALOG_TYPE_ORDER)[number];

export interface CatalogEntry {
  /** Unique within its type */
  key: string;
  /** Model id used for the credit display (first visible provider) */
  modelId: AnyModelId;
  type: CatalogType;
  name: string;
  icon: IconKey;
  labId: string;
  labName: string;
  labIcon: IconKey;
  content: typeof ContentLevelValue;
  isLegacy: boolean;
  /** Cheapest visible provider price, for ordering inside a group */
  sortPrice: number;
  /** Language-neutral fact line, e.g. "200K context" (chat only) */
  meta: string | null;
  /** Slug of the public /models/<slug> page; null when not publicly visible */
  slug: string | null;
}

export const CATALOG_DEFINITIONS: Record<
  CatalogType,
  Record<string, ModelDefinition>
> = {
  text: chatModelDefinitions,
  tts: ttsModelDefinitions,
  stt: sttModelDefinitions,
  image: imageGenModelDefinitions,
  audio: musicGenModelDefinitions,
  video: videoGenModelDefinitions,
};

export interface CatalogEntryOptions {
  /** Admins also see admin-only providers */
  isAdmin?: boolean;
  /** When given, only providers whose API key is configured count */
  availability?: AgentEnvAvailability;
}

export function visibleProviders(
  def: ModelDefinition,
  options: CatalogEntryOptions,
): ModelProviderConfig[] {
  return def.providers.filter(
    (provider) =>
      (options.isAdmin === true || provider.adminOnly !== true) &&
      isProviderSellable(def, provider) &&
      (options.availability === undefined ||
        isApiProviderAvailable(provider.apiProvider, options.availability)),
  );
}

/** URL slug for a model-definition key (the model id), same rule as chat. */
export function toDefinitionSlug(defKey: string): string {
  return toModelSlug(defKey);
}

export function listCatalogEntries(
  type: CatalogType,
  options: CatalogEntryOptions = {},
): CatalogEntry[] {
  const entries: CatalogEntry[] = [];
  for (const [defKey, def] of Object.entries(CATALOG_DEFINITIONS[type])) {
    if (def.enabled === false && def.enabledWithoutPrice !== true) {
      continue;
    }
    // A duplicate route of another model (e.g. claude-code-haiku of Claude
    // Haiku 5.5) is one model, one row. Admins still see the raw entries.
    if (
      type === "text" &&
      options.isAdmin !== true &&
      isModelPageAlias(defKey)
    ) {
      continue;
    }
    const providers = visibleProviders(def, options);
    const first = providers.toSorted(
      (a, b) => getProviderPrice(a) - getProviderPrice(b),
    )[0];
    if (first === undefined) {
      continue;
    }
    const lab = modelProviders[def.by];
    const publicChatId =
      type === "text"
        ? PUBLIC_CHAT_MODEL_IDS.find((id) => id === first.id)
        : undefined;
    entries.push({
      key: `${type}:${defKey}`,
      modelId: first.id,
      type,
      name: def.name,
      icon: def.icon,
      labId: def.by,
      labName: lab?.name ?? def.by,
      labIcon: lab?.icon ?? def.icon,
      content: def.content,
      isLegacy: def.utilities.includes(ModelUtility.LEGACY),
      sortPrice: getProviderPrice(first),
      meta:
        type === "text" && def.contextWindow > 0
          ? formatTokenCount(def.contextWindow)
          : null,
      slug:
        type === "text"
          ? publicChatId === undefined
            ? null
            : toModelSlug(publicChatId)
          : visibleProviders(def, {}).length > 0
            ? toDefinitionSlug(defKey)
            : null,
    });
  }
  return entries;
}

/** Entries for every type that has at least one model. */
export function listAllCatalogEntries(
  options: CatalogEntryOptions = {},
): Partial<Record<CatalogType, CatalogEntry[]>> {
  const result: Partial<Record<CatalogType, CatalogEntry[]>> = {};
  for (const type of CATALOG_TYPE_ORDER) {
    const entries = listCatalogEntries(type, options);
    if (entries.length > 0) {
      result[type] = entries;
    }
  }
  return result;
}

/** Media (non-chat) catalog types, counted separately from chat models. */
export interface CatalogMediaModelCounts {
  image: number;
  video: number;
  music: number;
  voice: number;
}

/**
 * Offered image/video/music/voice models, per modality. Same visibility rule
 * as the catalog rows. Chat models are never mixed in: the public chat figure
 * is `getAvailableChatModelCount` (all-models.ts).
 */
export function getCatalogMediaModelCounts(
  availability: AgentEnvAvailability,
): CatalogMediaModelCounts {
  const count = (type: CatalogType): number =>
    listCatalogEntries(type, { availability }).length;
  return {
    image: count("image"),
    video: count("video"),
    music: count("audio"),
    voice: count("tts") + count("stt"),
  };
}
