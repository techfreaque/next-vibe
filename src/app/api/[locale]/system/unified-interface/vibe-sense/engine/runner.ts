/**
 * Vibe Sense — Graph Runner
 *
 * Orchestrates full graph execution:
 * - Creates a pipeline_runs record
 * - Resolves execution order via walker
 * - Executes nodes in topological order
 * - Completes the run record with status/counts
 * - Returns all resolved series and signals
 */

import "server-only";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { defaultLocale } from "@/i18n/core/config";

import type { GraphConfig } from "../graph/types";
import type { DataPoint, Resolution, TimeRange } from "../shared/fields";
import { resolveExecutionOrder, getSinkReachableNodeIds } from "./walker";
import { executeNode, type ExecutionContext } from "./executor";
import type { SignalEvent } from "../store/signals";
import { completeRun, createRun } from "../store/runs";

// ─── Lookback Pre-Pass ────────────────────────────────────────────────────────

/**
 * Walk the graph and compute the extended fetch range for each source node.
 * Without registry, returns an empty Map (no lookback pre-pass).
 */
function computeNodeRanges(): Map<string, TimeRange> {
  return new Map();
}

export interface GraphRunResult {
  series: Map<string, DataPoint[]>;
  signals: Map<string, SignalEvent[]>;
  errors: Array<{ nodeId: string; error: string }>;
  runId: string | null;
  /** Number of chart-only nodes skipped during cron mode */
  skippedChartOnly: number;
}

/**
 * Execute a full graph for the given range.
 *
 * @param graphId - DB id of the graph (for persist/signal writes)
 * @param config - Graph DAG config
 * @param range - Requested time range
 * @param backtestRunId - If provided, actions are intercepted (not executed)
 */
export async function runGraph(
  graphId: string,
  config: GraphConfig,
  range: TimeRange,
  backtestRunId?: string,
  options?: { readOnly?: boolean; displayResolution?: Resolution },
): Promise<GraphRunResult> {
  const readOnly = options?.readOnly ?? false;
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);

  // Create execution run record (skip for backtests and readOnly data renders)
  let runId: string | null = null;
  if (!backtestRunId && !readOnly) {
    try {
      runId = await createRun(graphId, graphId);
    } catch {
      // Non-fatal — run tracking failure shouldn't block execution
    }
  }

  // Pre-compute extended fetch ranges for source nodes based on downstream lookbacks
  const nodeRanges = computeNodeRanges();

  const ctx: ExecutionContext = {
    requestedRange: range,
    nodeRanges,
    graphId,
    graphNodes: config.nodes,
    graphEdges: config.edges,
    resolvedSeries: new Map(),
    resolvedSignals: new Map(),
    nodeResolutions: new Map(),
    graphResolution: options?.displayResolution ?? config.resolution,
    logger,
    backtestRunId,
    readOnly,
    displayResolution: options?.displayResolution,
  };

  const errors: Array<{ nodeId: string; error: string }> = [];

  // Get topological execution order
  const { order: executionOrder, cycleNodes } = resolveExecutionOrder(config);

  if (cycleNodes.length > 0) {
    if (runId) {
      await completeRun(runId, "failed", 1, 0).catch(() => undefined);
    }
    return {
      series: ctx.resolvedSeries,
      signals: ctx.resolvedSignals,
      errors: [
        {
          nodeId: "graph",
          error: `Cycle detected — nodes involved: ${cycleNodes.join(", ")}`,
        },
      ],
      runId,
      skippedChartOnly: 0,
    };
  }

  // In scheduled cron mode (not readOnly, not backtest), skip chart-only nodes.
  // Chart-only nodes have no path to any evaluator or endpoint sink — they exist
  // purely for on-demand charting and will be computed when readOnly: true.
  // This avoids unnecessary DB queries on every cron tick for display-only data.
  const isCronMode = !readOnly && !backtestRunId;
  const sinkReachable = isCronMode ? getSinkReachableNodeIds(config) : null;

  // Execute nodes in order
  let nodeCount = 0;
  let skippedChartOnly = 0;
  for (const nodeId of executionOrder) {
    const nodeConfig = config.nodes[nodeId];
    if (!nodeConfig) {
      continue;
    }

    // Skip chart-only nodes during cron runs
    if (sinkReachable !== null && !sinkReachable.has(nodeId)) {
      skippedChartOnly++;
      continue;
    }

    try {
      await executeNode(nodeId, nodeConfig, ctx);
      nodeCount++;
    } catch (err) {
      errors.push({ nodeId, error: String(err) });
      // Continue with remaining nodes — partial results are useful
    }
  }

  // skippedChartOnly is tracked for debugging but not surfaced as errors

  // Complete the run record
  if (runId) {
    const status = errors.length > 0 ? "failed" : "completed";
    await completeRun(runId, status, errors.length, nodeCount).catch(
      () => undefined,
    );
  }

  return {
    series: ctx.resolvedSeries,
    signals: ctx.resolvedSignals,
    errors,
    runId,
    skippedChartOnly,
  };
}
