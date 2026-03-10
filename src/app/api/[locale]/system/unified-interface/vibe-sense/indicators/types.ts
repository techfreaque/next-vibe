/**
 * Vibe Sense — Indicator Types
 *
 * Core type definitions for the dataflow engine.
 * All indicators are pull-only — the engine always passes a TimeRange.
 */

// ─── Time Primitives ──────────────────────────────────────────────────────────

import { GraphResolution, GraphResolutionDB } from "../enum";

export { GraphResolutionDB as ResolutionValues };

export type Resolution = (typeof GraphResolutionDB)[number];

export const RESOLUTION_MS: Record<Resolution, number> = {
  [GraphResolution.ONE_MINUTE]: 60_000,
  [GraphResolution.THREE_MINUTES]: 180_000,
  [GraphResolution.FIVE_MINUTES]: 300_000,
  [GraphResolution.FIFTEEN_MINUTES]: 900_000,
  [GraphResolution.THIRTY_MINUTES]: 1_800_000,
  [GraphResolution.ONE_HOUR]: 3_600_000,
  [GraphResolution.FOUR_HOURS]: 14_400_000,
  [GraphResolution.ONE_DAY]: 86_400_000,
  [GraphResolution.ONE_WEEK]: 604_800_000,
  [GraphResolution.ONE_MONTH]: 2_592_000_000,
};

/** A time range passed to every indicator query */
export interface TimeRange {
  from: Date;
  to: Date;
}

// ─── Time Series ──────────────────────────────────────────────────────────────

/** A single data point in a time series */
export interface DataPoint {
  timestamp: Date;
  value: number;
  meta?: Record<string, string | number | boolean | null>;
}

/** A named time series — the fundamental unit of data in Vibe Sense */
export interface TimeSeries {
  nodeId: string;
  resolution: Resolution;
  points: DataPoint[];
}

/**
 * A multi-value time series — node produces multiple named series.
 * Each output key maps to an independent TimeSeries.
 */
export type MultiValueTimeSeries = Record<string, TimeSeries>;

/** Output handle definition for multi-value nodes */
export interface OutputHandle {
  type: "TimeSeries";
  description?: string;
}

// ─── Persist Mode ─────────────────────────────────────────────────────────────

/**
 * Controls whether a node's output is written to the time-series store.
 * - always: written on every execution
 * - never: computed on-the-fly at read time from nearest persisted ancestor
 * - snapshot: cached with TTL, re-computed on expiry
 */
export type PersistMode = "always" | "never" | "snapshot";

// ─── Retention Policy ─────────────────────────────────────────────────────────

export interface RetentionPolicy {
  /** Maximum number of rows to keep per node */
  maxRows?: number;
  /** Maximum age in days before rows are pruned */
  maxAgeDays?: number;
}

// ─── Source Indicator ─────────────────────────────────────────────────────────

/**
 * Source Indicator — owns raw time series data.
 * Queried by the engine with an explicit TimeRange.
 * Single-value variant.
 */
export interface Indicator {
  /** Globally unique dot-namespaced id, e.g. "leads.created" */
  id: string;
  /** Human-readable description for registry/Thea discoverability */
  description?: string;
  resolution: Resolution;
  persist: PersistMode;
  retention?: RetentionPolicy;
  /**
   * Pull query — engine calls this with an extended range (accounting for
   * downstream lookbacks). Returns data for that range.
   */
  query: (range: TimeRange) => Promise<DataPoint[]> | DataPoint[];
}

/**
 * Multi-value source indicator — produces several named series per query.
 * Each key in `outputs` becomes a separate TimeSeries connection in the builder.
 */
export interface MultiValueIndicator {
  id: string;
  description?: string;
  resolution: Resolution;
  persist: PersistMode;
  retention?: RetentionPolicy;
  outputs: Record<string, OutputHandle>;
  query: (
    range: TimeRange,
  ) => Promise<MultiValueTimeSeries> | MultiValueTimeSeries;
}

// ─── Derived Indicator ────────────────────────────────────────────────────────

/**
 * Derived Indicator — computed from one or more other indicators/derived nodes.
 * Carries semantic meaning (e.g. moving_average, rsi).
 * Registered globally, deduplicated across graphs by the engine.
 */
export interface DerivedIndicator {
  id: string;
  description?: string;
  /** IDs of input nodes — resolved by registry at registration time */
  inputs: string[];
  resolution: Resolution;
  persist: PersistMode;
  retention?: RetentionPolicy;
  /**
   * Number of additional periods needed before the requested range start.
   * Engine extends the fetch range upstream by this amount automatically.
   * Example: MA(7) needs lookback: 7
   */
  lookback?: number;
  /** Pure computation — receives trimmed input series, returns output series */
  derive: (inputs: TimeSeries[]) => DataPoint[] | Promise<DataPoint[]>;
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type AnyIndicator = Indicator | MultiValueIndicator | DerivedIndicator;

export function isMultiValueIndicator(
  indicator: AnyIndicator,
): indicator is MultiValueIndicator {
  return "outputs" in indicator && !("inputs" in indicator);
}

export function isDerivedIndicator(
  indicator: AnyIndicator,
): indicator is DerivedIndicator {
  return "inputs" in indicator && "derive" in indicator;
}

export function isSourceIndicator(
  indicator: AnyIndicator,
): indicator is Indicator {
  return (
    "query" in indicator &&
    !("inputs" in indicator) &&
    !("outputs" in indicator)
  );
}

// ─── Registry Entry ───────────────────────────────────────────────────────────

/** What the registry exposes per indicator (for builder UI and Thea) */
export interface IndicatorMeta {
  id: string;
  domain: string;
  description?: string;
  resolution: Resolution;
  persist: PersistMode;
  lookback?: number;
  /** For derived nodes — ids of input indicators */
  inputs?: string[];
  /** For multi-value nodes — named output handles */
  outputs?: Record<string, OutputHandle>;
  /** true if node is derived (computed from inputs) */
  isDerived: boolean;
  /** true if node has multiple named outputs */
  isMultiValue: boolean;
}
