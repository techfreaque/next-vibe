/**
 * Vibe Sense — Graph Types
 *
 * A Graph is a stored DAG config connecting nodes.
 * All nodes are endpoint nodes — dispatched via RouteExecutionExecutor.
 */

import type { Resolution } from "../shared/fields";
import type { GraphConfigInferred } from "./schema";

// ─── Unified Node Config ──────────────────────────────────────────────────────

/**
 * Every node in the graph is an endpoint node.
 * Derived from the Zod schema (single source of truth).
 *
 * The engine dispatches via RouteExecutionExecutor.executeGenericHandler()
 * using the endpoint's tool name derived from endpointPath + method.
 *
 * Data sources, indicators, transformers, evaluators — all the same shape.
 * The distinction is conveyed by endpointPath category prefix:
 *   - "credits/data-sources/..." → data source
 *   - ".../indicators/ema"       → indicator
 *   - ".../transformers/ratio"   → transformer
 *   - ".../evaluators/threshold" → evaluator
 *
 * Series data flows through edges. Static parameters go in `params`.
 * If shapes don't match, use a transformer node in between.
 */

// ─── Graph Config ─────────────────────────────────────────────────────────────

/** A connection between two nodes in the graph */
export interface GraphEdge {
  /** Source node id */
  from: string;
  /** Target node id */
  to: string;
  /** For multi-output nodes, which output handle */
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
