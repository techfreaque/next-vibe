/**
 * Vibe Sense — Graph Types
 *
 * A Graph is a stored DAG config connecting nodes.
 * Versioned with branching — edits never mutate, always branch.
 */

import type { PersistMode, Resolution } from "../indicators/types";
import type { GraphConfigInferred } from "./schema";

// ─── Input Mapping ───────────────────────────────────────────────────────────

/** Static hardcoded value */
export interface StaticInputMapping {
  source: "static";
  value: string | number | boolean | null;
}

/** Value from an upstream node's output */
export interface NodeInputMapping {
  source: "node";
  nodeId: string;
  field: string;
}

/** Value from the gating evaluator's signal metadata */
export interface SignalInputMapping {
  source: "signal";
  field: string;
}

export type InputMappingValue =
  | StaticInputMapping
  | NodeInputMapping
  | SignalInputMapping;

/** Maps endpoint input fields to their data sources */
export type InputMapping = Record<string, InputMappingValue>;

// ─── Node Configs ─────────────────────────────────────────────────────────────

/** Reference to a registered source or derived indicator */
export interface IndicatorNodeConfig {
  type: "indicator";
  indicatorId: string;
  /** Optional pane assignment override for chart display */
  pane?: number;
  color?: string;
  visible?: boolean;
}

/**
 * Endpoint node — calls any next-vibe endpoint.
 * As a source (no upstream edges): called with static inputs on each cron tick.
 * As a sink (after evaluator): called only when signal fires.
 */
export interface EndpointNodeConfig {
  type: "endpoint";
  id: string;
  /** Route ID from the endpoint registry (e.g. "leads.stats") */
  endpointId: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  /** Maps endpoint input fields to static values, upstream outputs, or signal meta */
  inputMapping: InputMapping;
  /** Which response field to extract for downstream. Omit to pass full response. */
  outputField?: string;
  /** Sampling resolution when used as a source with cron */
  resolution?: Resolution;
  /** Persist extracted value as time series datapoint */
  persist?: PersistMode;
  pane?: number;
  color?: string;
  visible?: boolean;
}

/**
 * Inline derived node — anonymous, graph-local, not globally registered.
 * Useful for one-off compositions.
 */
export interface InlineDerivedNodeConfig {
  type: "inline-derived";
  /** Node id unique within this graph */
  id: string;
  inputs: string[]; // node ids within this graph
  resolution: Resolution;
  lookback?: number;
  /** Transformer function name from built-in library */
  transformerFn: TransformerFn;
  transformerArgs?: Record<string, string | number | boolean>;
  pane?: number;
  color?: string;
  visible?: boolean;
}

/** Built-in transformer functions */
export type TransformerFn =
  | "field_pick"
  | "json_path"
  | "merge"
  | "window_avg"
  | "window_sum"
  | "window_min"
  | "window_max"
  | "ratio"
  | "delta"
  | "clamp"
  | "script";

export interface TransformerNodeConfig {
  type: "transformer";
  id: string;
  inputs: string[]; // node ids within this graph
  fn: TransformerFn;
  args?: Record<string, string | number | boolean>;
  pane?: number;
  color?: string;
  visible?: boolean;
}

/** Evaluator — produces boolean Signal from series inputs */
export type EvaluatorType =
  | "threshold"
  | "crossover"
  | "and"
  | "or"
  | "not"
  | "script";

export interface EvaluatorNodeConfig {
  type: "evaluator";
  id: string;
  /** Series node ids that feed this evaluator */
  inputs: string[];
  /** Number of inputs this evaluator accepts. "variadic" = unlimited */
  inputCount: number | "variadic";
  evaluatorType: EvaluatorType;
  resolution: Resolution;
  args?: EvaluatorArgs;
  pane?: number;
  visible?: boolean;
}

export type EvaluatorArgs =
  | { type: "threshold"; op: ">" | "<" | ">=" | "<=" | "=="; value: number }
  | { type: "crossover" }
  | { type: "and" | "or" | "not" }
  | { type: "script"; fn: string };

export type GraphNodeConfig =
  | IndicatorNodeConfig
  | EndpointNodeConfig
  | InlineDerivedNodeConfig
  | TransformerNodeConfig
  | EvaluatorNodeConfig;

// ─── Graph Config ─────────────────────────────────────────────────────────────

/** A connection between two nodes in the graph */
export interface GraphEdge {
  /** Source node id */
  from: string;
  /** Target node id */
  to: string;
  /** For multi-value nodes, which output handle */
  fromHandle?: string;
  /** Which input slot on the target */
  toHandle?: string;
}

/** Layout position for the builder UI */
export interface NodePosition {
  x: number;
  y: number;
}

/** Trigger configuration for scheduled execution */
export type TriggerConfig =
  | { type: "cron"; schedule: string }
  | { type: "manual" };

/** The full graph config stored in the DB — derived from graphConfigSchema */
export type { GraphConfigInferred as GraphConfig } from "./schema";

// ─── Graph Ownership ──────────────────────────────────────────────────────────

export type GraphOwnerType = "system" | "admin" | "user";

// ─── Backtest ─────────────────────────────────────────────────────────────────

export type BacktestActionMode = "simulate" | "execute";

export interface BacktestConfig {
  graphId: string;
  graphVersionId: string;
  range: { from: Date; to: Date };
  resolution: Resolution;
  actionMode: BacktestActionMode;
}

// ─── Graph Seeds ───────────────────────────────────────────────────────────────

/** Entry for a colocated graph seed (exported from graph-seeds.ts files) */
export interface GraphSeedEntry {
  slug: string;
  name: string;
  description: string;
  config: GraphConfigInferred;
}
