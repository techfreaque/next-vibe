/**
 * Model Changelog - shared event types. The generated history file
 * (history.generated.ts) and the public /models/changelog page both use these.
 */

/** Same keys as the public catalog tabs (CatalogType). */
export type ModelChangelogModelType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "tts"
  | "stt";

export type ModelChangelogContent = "mainstream" | "open" | "uncensored";

export type ModelChangelogEventType =
  | "added"
  | "legacy"
  | "restored"
  | "repriced"
  | "tier"
  | "removed";

/** Price unit a change applies to, mirroring the provider config fields. */
export type ModelChangelogPriceMetric =
  | "input"
  | "output"
  | "image"
  | "second"
  | "clip"
  | "character"
  | "fixed";

export interface ModelChangelogPriceChange {
  metric: ModelChangelogPriceMetric;
  /** Cheapest public provider price before (provider units) */
  from: number;
  /** Cheapest public provider price after (provider units) */
  to: number;
}

export interface ModelChangelogEvent {
  /** Commit date the change landed in the model registry (YYYY-MM-DD) */
  date: string;
  /** Short commit sha */
  commit: string;
  type: ModelChangelogEventType;
  modelId: string;
  modelType: ModelChangelogModelType;
  /** Model name at the time of the change */
  name: string;
  /** Content tier after the change */
  content: ModelChangelogContent;
  /** tier: content tier before the change */
  fromContent?: ModelChangelogContent;
  /** legacy: the model that replaces it */
  successorId?: string;
  successorName?: string;
  /** repriced: per-metric moves */
  priceChanges?: ModelChangelogPriceChange[];
}
