/**
 * Vibe Sense - Graph Types
 *
 * A Graph is a stored DAG config connecting nodes.
 * All nodes are endpoint nodes - dispatched via RouteExecutionExecutor.
 */

import type { BacktestActionModeType } from "../enum";
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
 * Data sources, indicators, transformers, evaluators - all the same shape.
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

/** The full graph config stored in the DB - derived from graphConfigSchema */
export type GraphConfig = GraphConfigInferred;

export interface BacktestConfig {
  graphId: string;
  graphVersionId: string;
  range: { from: Date; to: Date };
  resolution: Resolution;
  actionMode: BacktestActionModeType;
}

// ─── Graph Seeds ───────────────────────────────────────────────────────────────

/** Entry for a colocated graph seed (exported from graph-seeds.ts files) */
export interface GraphSeedEntry {
  slug: string;
  name: string;
  description: string;
  config: GraphConfigInferred;
}

// ─── Graph Repository Shapes ──────────────────────────────────────────────────

/** Summary of a stored graph row (shared across list/get responses) */
export interface GraphSummary {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  ownerType: string;
  ownerId: string | null;
  parentVersionId: string | null;
  isActive: boolean;
  createdAt: string;
}

/** Time-series data payload for a graph (used by data + get endpoints) */
export interface GraphDataPayload {
  series: Array<{
    nodeId: string;
    points: Array<{ timestamp: string; value: number }>;
  }>;
  signals: Array<{
    nodeId: string;
    events: Array<{ timestamp: string; fired: boolean }>;
  }>;
}

// ─── Repository Return Types ───────────────────────────────────────────────────

/** Return type for listGraphs */
export interface GraphListResult {
  graphs: GraphSummary[];
}

/** Return type for createGraph */
export interface GraphCreateResult {
  id: string;
}

/** Return type for editGraph (branch) */
export interface GraphEditResult {
  newId: string;
}

/** Return type for promoteGraph */
export interface GraphPromoteResult {
  promotedId: string;
}

/** Return type for archiveGraph */
export interface GraphArchiveResult {
  archivedId: string;
}

/** Return type for deleteGraph */
export interface GraphDeleteResult {
  deletedId: string;
}
