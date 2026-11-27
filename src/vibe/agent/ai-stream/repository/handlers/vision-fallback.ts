/**
 * Fallback order for the modality bridges (vision / video / audio).
 *
 * Two failure classes need different next models:
 * - provider error (connect timeout, 5xx, attempt deadline): the content is
 *   fine, the route is not. Take the next model of the base priority list,
 *   preferring one served by a different API provider (prod 2026-11-26: a
 *   NanoGPT connect-timeout outage failed every NanoGPT-routed model alike).
 * - content refusal (provider moderation, content filter, refusal reply): the
 *   same payload to a model with the same or stricter filter is refused again.
 *   Prod 2026-11-27: Gemini 3.5 Flash Lite refused a video ("sexually
 *   explicit"), the fallback Qwen 3.8 Flash was rejected by Alibaba's input
 *   inspection (data_inspection_failed) and the user got no description.
 *   Take the least filtered model (content level) first, skip the model
 *   family that refused unless the candidate is a less filtered variant of
 *   it, and put families with a known upstream input moderation layer last.
 */

import { ContentLevelDB, type ContentLevelValue } from "../../../skills/enum";
import {
  AudioVisionModelId,
  ImageVisionModelId,
  VideoVisionModelId,
} from "../../vision-models";

export type BridgeFailureClass = "content-refusal" | "provider-error";

/** The fields of a bridge model option this module reads. */
export interface BridgeFallbackCandidate {
  id: string;
  apiProvider: string;
  content: typeof ContentLevelValue;
}

/**
 * Model families whose upstream inspects the INPUT before the model runs, so
 * a less strict model of another family is always tried before them on a
 * content refusal. qwen: Alibaba data_inspection_failed (prod 2026-11-27).
 * gemini: Google safety blocks and refusal replies (prod 2026-11-25..27).
 */
const STRICT_INPUT_MODERATION_FAMILIES: ReadonlySet<string> = new Set([
  "qwen",
  "gemini",
]);

/**
 * Extra candidates for a content refusal, ahead of the base fallback list.
 * Video and audio have no uncensored model our transports can send those
 * modalities to, so these are "open" content-level models outside the strict
 * families. Image's base list is already uncensored-first.
 */
export const VIDEO_CONTENT_REFUSAL_FALLBACK_IDS: readonly VideoVisionModelId[] =
  [
    VideoVisionModelId.MIMO_V2_6_FLASH,
    VideoVisionModelId.GLM_5_3_FLASH,
    VideoVisionModelId.MINIMAX_M3_1_FLASH,
  ];

export const IMAGE_CONTENT_REFUSAL_FALLBACK_IDS: readonly ImageVisionModelId[] =
  [
    ImageVisionModelId.GLM_5_3_FLASH_UNCENSORED,
    ImageVisionModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
    ImageVisionModelId.GEMMA_4_UNCENSORED,
  ];

export const AUDIO_CONTENT_REFUSAL_FALLBACK_IDS: readonly AudioVisionModelId[] =
  [AudioVisionModelId.MIMO_V2_6_FLASH];

/** Bridges run at most this many models for one attachment. */
export function maxBridgeModels(
  failureClasses: readonly BridgeFailureClass[],
): number {
  // A refusal is decided by the filter, not by luck: one more, less filtered
  // model is worth it. A provider outage gets one other route.
  return failureClasses.includes("content-refusal") ? 3 : 2;
}

/** Model family: the id up to its first dash ("gemini-3.5-flash" -> "gemini"). */
export function modelFamily(id: string): string {
  return id.split("-")[0]?.toLowerCase() ?? id;
}

function contentRank(candidate: BridgeFallbackCandidate): number {
  const rank = ContentLevelDB.indexOf(candidate.content);
  return rank === -1 ? 0 : rank;
}

/**
 * Next bridge model after the models in `tried` failed, or null when no
 * candidate is left. `refused` holds the tried models that refused on
 * content (a subset of `tried`).
 */
export function pickBridgeFallback<T extends BridgeFallbackCandidate>(params: {
  pool: readonly T[];
  priority: readonly string[];
  contentRefusalPriority: readonly string[];
  tried: readonly BridgeFallbackCandidate[];
  refused: readonly BridgeFallbackCandidate[];
  failureClass: BridgeFailureClass;
}): T | null {
  const { pool, priority, contentRefusalPriority, tried, refused } = params;
  const triedIds = new Set(tried.map((m) => m.id));
  const isRefusal = params.failureClass === "content-refusal";
  const order = isRefusal
    ? [...new Set([...contentRefusalPriority, ...priority])]
    : [...priority];

  const candidates: T[] = [];
  for (const id of order) {
    if (triedIds.has(id)) {
      continue;
    }
    const option = pool.find((m) => m.id === id);
    if (option) {
      candidates.push(option);
    }
  }

  if (!isRefusal) {
    const failedProviders = new Set(tried.map((m) => m.apiProvider));
    const otherRoute = candidates.find(
      (m) => !failedProviders.has(m.apiProvider),
    );
    return otherRoute ?? candidates[0] ?? null;
  }

  const refusedRankByFamily = new Map<string, number>();
  for (const model of refused) {
    const family = modelFamily(model.id);
    refusedRankByFamily.set(
      family,
      Math.max(refusedRankByFamily.get(family) ?? 0, contentRank(model)),
    );
  }
  const eligible = candidates.filter((m) => {
    const refusedRank = refusedRankByFamily.get(modelFamily(m.id));
    return refusedRank === undefined || contentRank(m) > refusedRank;
  });
  const strict = (m: T): number =>
    STRICT_INPUT_MODERATION_FAMILIES.has(modelFamily(m.id)) ? 1 : 0;
  const ranked = eligible
    .map((m, index) => ({ m, index }))
    .toSorted(
      (a, b) =>
        contentRank(b.m) - contentRank(a.m) ||
        strict(a.m) - strict(b.m) ||
        a.index - b.index,
    );
  return ranked[0]?.m ?? null;
}
