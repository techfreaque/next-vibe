/**
 * Model Catalog Scan - pure diff + report text.
 * No IO here: takes our catalog refs, upstream listings and fetched prices,
 * returns the report. Unit-tested in diff.test.ts.
 */

import { chatModelDefinitions } from "../../ai-stream/models";
import { imageGenModelDefinitions } from "../../image-generation/models";
import { musicGenModelDefinitions } from "../../music-generation/models";
import { sttModelDefinitions } from "../../speech-to-text/models";
import { ttsModelDefinitions } from "../../text-to-speech/models";
import { videoGenModelDefinitions } from "../../video-generation/models";
import { ModelUtility } from "../enum";
import type { ModelDefinition, ModelProviderConfig } from "../models";
import { ApiProvider } from "../models";
import type { PriceUpdate } from "../model-prices/providers/base";
import {
  EMAIL_SECTION_LIMIT,
  PRICE_CHANGE_SUSPECT_PERCENT,
  PRICE_CHANGE_THRESHOLD_PERCENT,
} from "./constants";
import type {
  CatalogDeprecation,
  CatalogMissingModel,
  CatalogNewModel,
  CatalogPriceChange,
  CatalogReport,
} from "./schema";
import type { UpstreamListing } from "./sources";

export type CatalogRole = "chat" | "image" | "video" | "music" | "tts" | "stt";

export interface CatalogProviderRef {
  modelId: string;
  role: CatalogRole;
  apiProvider: ApiProvider;
  providerModel: string;
  legacy: boolean;
  contextWindow: number;
  config: ModelProviderConfig;
}

/**
 * Roles each listed provider's model list actually covers. A provider entry
 * outside these roles (e.g. NanoGPT TTS voices, served from another endpoint)
 * is never reported as missing.
 */
const LISTED_ROLES: Partial<Record<ApiProvider, readonly CatalogRole[]>> = {
  [ApiProvider.OPENROUTER]: ["chat", "image", "video", "music"],
  [ApiProvider.VENICE_AI]: ["chat", "image", "video", "music", "tts", "stt"],
  [ApiProvider.NANO_GPT]: ["chat"],
};

function refsFrom(
  role: CatalogRole,
  definitions: Record<string, ModelDefinition>,
): CatalogProviderRef[] {
  const refs: CatalogProviderRef[] = [];
  for (const [modelId, def] of Object.entries(definitions)) {
    const legacy = def.utilities.includes(ModelUtility.LEGACY);
    for (const config of def.providers) {
      refs.push({
        modelId,
        role,
        apiProvider: config.apiProvider,
        providerModel: config.providerModel,
        legacy,
        contextWindow: def.contextWindow,
        config,
      });
    }
  }
  return refs;
}

/** Every provider entry across all modalities. */
export function collectCatalogRefs(): CatalogProviderRef[] {
  return [
    ...refsFrom("chat", chatModelDefinitions),
    ...refsFrom("image", imageGenModelDefinitions),
    ...refsFrom("video", videoGenModelDefinitions),
    ...refsFrom("music", musicGenModelDefinitions),
    ...refsFrom("tts", ttsModelDefinitions),
    ...refsFrom("stt", sttModelDefinitions),
  ];
}

function knownIdsByProvider(
  refs: readonly CatalogProviderRef[],
): Map<ApiProvider, Set<string>> {
  const map = new Map<ApiProvider, Set<string>>();
  for (const ref of refs) {
    const set = map.get(ref.apiProvider) ?? new Set<string>();
    set.add(ref.providerModel);
    map.set(ref.apiProvider, set);
  }
  return map;
}

/**
 * Provider-agnostic model key: "google/gemini-4.1-x" (OpenRouter, NanoGPT)
 * and "gemini-4-1-x" (Venice) collapse to the same key.
 */
export function normalizeModelKey(id: string): string {
  return (id.split("/").pop() ?? id).toLowerCase().replaceAll(/[._]/g, "-");
}

/** Upstream models created after `since` that no definition references. */
export function findNewModels(
  listings: readonly UpstreamListing[],
  refs: readonly CatalogProviderRef[],
  since: Date,
): CatalogNewModel[] {
  const known = knownIdsByProvider(refs);
  const seen = new Set<string>();
  /**
   * Normalized keys we already serve or already reported, so a mirror of the
   * same model on another provider is not repeated.
   */
  const coveredKeys = new Set(
    refs.map((r) => normalizeModelKey(r.providerModel)),
  );
  const result: CatalogNewModel[] = [];
  for (const listing of listings) {
    if (!listing.ok) {
      continue;
    }
    const knownIds = known.get(listing.apiProvider);
    for (const model of listing.models) {
      const key = `${listing.apiProvider}|${model.id}`;
      if (
        seen.has(key) ||
        knownIds?.has(model.id) ||
        model.kind === "other" ||
        !model.createdAt ||
        model.createdAt < since ||
        // Same model on another provider: only worth a row when uncensored.
        (coveredKeys.has(normalizeModelKey(model.id)) && !model.uncensored)
      ) {
        continue;
      }
      seen.add(key);
      coveredKeys.add(normalizeModelKey(model.id));
      result.push({
        source: listing.source,
        apiProvider: listing.apiProvider,
        providerModel: model.id,
        name: model.name,
        kind: model.kind,
        createdAt: model.createdAt.toISOString(),
        inputUsdPer1M: model.inputUsdPer1M,
        outputUsdPer1M: model.outputUsdPer1M,
        contextWindow: model.contextWindow,
        uncensored: model.uncensored,
      });
    }
  }
  return result.toSorted((a, b) =>
    (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );
}

/**
 * Our entries whose id is gone from the provider's list. A provider is only
 * judged when EVERY listing for it loaded, so an outage never reads as removal.
 */
export function findMissingUpstream(
  listings: readonly UpstreamListing[],
  refs: readonly CatalogProviderRef[],
): CatalogMissingModel[] {
  const idsByProvider = new Map<ApiProvider, Set<string>>();
  const failed = new Set<ApiProvider>();
  for (const listing of listings) {
    if (!listing.ok) {
      failed.add(listing.apiProvider);
      continue;
    }
    const set = idsByProvider.get(listing.apiProvider) ?? new Set<string>();
    for (const model of listing.models) {
      set.add(model.id);
    }
    idsByProvider.set(listing.apiProvider, set);
  }

  const seen = new Set<string>();
  const result: CatalogMissingModel[] = [];
  for (const ref of refs) {
    const ids = idsByProvider.get(ref.apiProvider);
    const roles = LISTED_ROLES[ref.apiProvider];
    if (
      !ids ||
      failed.has(ref.apiProvider) ||
      !roles?.includes(ref.role) ||
      ids.has(ref.providerModel)
    ) {
      continue;
    }
    const key = `${ref.apiProvider}|${ref.providerModel}|${ref.modelId}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push({
      modelId: ref.modelId,
      apiProvider: ref.apiProvider,
      providerModel: ref.providerModel,
      legacy: ref.legacy,
    });
  }
  // Current models first: those need action, legacy ones only cleanup.
  return result.toSorted((a, b) => Number(a.legacy) - Number(b.legacy));
}

/** Upstream shutdown dates for ids we still reference. */
export function findDeprecations(
  listings: readonly UpstreamListing[],
  refs: readonly CatalogProviderRef[],
): CatalogDeprecation[] {
  const expiring = new Map<string, string>();
  for (const listing of listings) {
    for (const model of listing.models) {
      if (model.expiresAt) {
        expiring.set(`${listing.apiProvider}|${model.id}`, model.expiresAt);
      }
    }
  }
  const seen = new Set<string>();
  const result: CatalogDeprecation[] = [];
  for (const ref of refs) {
    const key = `${ref.apiProvider}|${ref.providerModel}`;
    const expiresAt = expiring.get(key);
    if (!expiresAt || seen.has(`${key}|${ref.modelId}`)) {
      continue;
    }
    seen.add(`${key}|${ref.modelId}`);
    result.push({
      modelId: ref.modelId,
      apiProvider: ref.apiProvider,
      providerModel: ref.providerModel,
      expiresAt,
      legacy: ref.legacy,
    });
  }
  return result.toSorted((a, b) => a.expiresAt.localeCompare(b.expiresAt));
}

function readPriceField(
  config: ModelProviderConfig,
  field: PriceUpdate["field"],
): number | undefined {
  switch (field) {
    case "creditCost":
      return typeof config.creditCost === "number"
        ? config.creditCost
        : undefined;
    case "inputTokenCost":
      return config.inputTokenCost;
    case "outputTokenCost":
      return config.outputTokenCost;
    case "cacheReadTokenCost":
      return "cacheReadTokenCost" in config
        ? config.cacheReadTokenCost
        : undefined;
    case "cacheWriteTokenCost":
      return "cacheWriteTokenCost" in config
        ? config.cacheWriteTokenCost
        : undefined;
    case "creditCostPerImage":
      return config.creditCostPerImage;
    case "creditCostPerClip":
      return config.creditCostPerClip;
    case "creditCostPerSecond":
      return config.creditCostPerSecond;
    case "creditCostPerCharacter":
      return config.creditCostPerCharacter;
    case "contextWindow":
      return undefined;
  }
}

function changePercent(oldValue: number, newValue: number): number {
  if (oldValue === 0) {
    return newValue === 0 ? 0 : 100;
  }
  return Math.round(((newValue - oldValue) / oldValue) * 10_000) / 100;
}

/**
 * Live prices (from the price fetchers) that differ from our definitions by
 * more than the threshold. Missing fields on our side are not reported: the
 * dev-side price updater fills those in.
 */
export function findPriceChanges(
  updates: readonly PriceUpdate[],
  refs: readonly CatalogProviderRef[],
): CatalogPriceChange[] {
  const byProviderModel = new Map<string, CatalogProviderRef>();
  const byModelId = new Map<string, CatalogProviderRef>();
  for (const ref of refs) {
    byProviderModel.set(
      `${ref.apiProvider}|${ref.providerModel}|${ref.modelId}`,
      ref,
    );
    if (!byModelId.has(ref.modelId)) {
      byModelId.set(ref.modelId, ref);
    }
  }

  const seen = new Set<string>();
  const result: CatalogPriceChange[] = [];
  for (const update of updates) {
    let oldValue: number | undefined;
    let providerModel = update.providerModel ?? "";
    if (update.field === "contextWindow") {
      const ref = byModelId.get(update.modelId);
      oldValue = ref?.contextWindow;
      providerModel = ref?.providerModel ?? providerModel;
    } else {
      const ref = byProviderModel.get(
        `${update.provider}|${providerModel}|${update.modelId}`,
      );
      oldValue = ref ? readPriceField(ref.config, update.field) : undefined;
    }
    if (oldValue === undefined) {
      continue;
    }
    const percent = changePercent(oldValue, update.value);
    if (Math.abs(percent) < PRICE_CHANGE_THRESHOLD_PERCENT) {
      continue;
    }
    const key = `${update.provider}|${providerModel}|${update.modelId}|${update.field}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push({
      modelId: update.modelId,
      apiProvider: update.provider,
      providerModel,
      field: update.field,
      oldValue,
      newValue: update.value,
      changePercent: percent,
      suspect: Math.abs(percent) >= PRICE_CHANGE_SUSPECT_PERCENT,
      source: update.source,
    });
  }
  return result.toSorted(
    (a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent),
  );
}

// ── Report text (email body + CLI/AI readable output) ──────────────────────

function formatPrice(value: number | null): string {
  return value === null ? "?" : `$${value}`;
}

function capped<T>(items: readonly T[], render: (item: T) => string): string[] {
  const lines = items.slice(0, EMAIL_SECTION_LIMIT).map(render);
  if (items.length > EMAIL_SECTION_LIMIT) {
    lines.push(
      `  ... ${items.length - EMAIL_SECTION_LIMIT} more in the stored report`,
    );
  }
  return lines;
}

/**
 * Plain-text report. Internal ops mail, English only, so a coding session
 * can paste it straight into a brief.
 */
export function composeReportText(
  report: CatalogReport,
  scannedAt: Date,
): { subject: string; body: string } {
  const day = scannedAt.toISOString().slice(0, 10);
  const uncensored = report.newModels.filter((m) => m.uncensored);
  const failedSources = report.sources.filter((s) => !s.ok);
  const subject = `[unbottled] Model catalog scan ${day}: ${report.newModels.length} new, ${report.priceChanges.length} price changes, ${report.missingUpstream.length} gone`;

  const lines: string[] = [
    `Model catalog scan ${scannedAt.toISOString()}`,
    `New upstream models since ${report.newSince}. Nothing was changed automatically: a coding session reviews this and updates the definitions.`,
    "",
    `NEW MODELS (${report.newModels.length}, ${uncensored.length} look uncensored/roleplay)`,
    ...capped(
      report.newModels,
      (m) =>
        `  ${m.uncensored ? "[U] " : ""}${m.kind.padEnd(5)} ${m.apiProvider}: ${m.providerModel} (${m.name}) in ${formatPrice(m.inputUsdPer1M)} out ${formatPrice(m.outputUsdPer1M)} /1M, ctx ${m.contextWindow ?? "?"}, created ${m.createdAt?.slice(0, 10) ?? "?"}`,
    ),
    "",
    `PRICE / CONTEXT CHANGES (${report.priceChanges.length}, threshold ${PRICE_CHANGE_THRESHOLD_PERCENT}%)`,
    ...capped(
      report.priceChanges,
      (c) =>
        `  ${c.suspect ? "[suspect, check fetcher] " : ""}${c.modelId} ${c.apiProvider} ${c.providerModel} ${c.field}: ${c.oldValue} -> ${c.newValue} (${c.changePercent > 0 ? "+" : ""}${c.changePercent}%)`,
    ),
    "",
    `GONE UPSTREAM (${report.missingUpstream.length})`,
    ...capped(
      report.missingUpstream,
      (m) =>
        `  ${m.legacy ? "[legacy] " : ""}${m.modelId} ${m.apiProvider} ${m.providerModel}`,
    ),
    "",
    `SHUTDOWN DATES ANNOUNCED (${report.deprecations.length})`,
    ...capped(
      report.deprecations,
      (d) =>
        `  ${d.expiresAt} ${d.legacy ? "[legacy] " : ""}${d.modelId} ${d.apiProvider} ${d.providerModel}`,
    ),
    "",
    `SOURCES (${report.sources.length - failedSources.length}/${report.sources.length} ok)`,
    ...report.sources.map(
      (s) =>
        `  ${s.ok ? "ok  " : "FAIL"} ${s.source} ${s.ok ? `${s.modelCount} models` : (s.error ?? "")}`,
    ),
    "",
    "Full report: vibe --hermes --thea model-catalog-scan (or /admin tools, model catalog scan).",
  ];
  return { subject, body: lines.join("\n") };
}
