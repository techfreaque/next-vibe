/**
 * Vibe Sense - Graph Runner
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

import { GraphResolution, RunStatus } from "../enum";
import type { GraphNodeConfig } from "../graph/schema";
import type { GraphConfig } from "../graph/types";
import type { DataPoint, Resolution, TimeRange } from "../shared/fields";
import { RESOLUTION_MS } from "../shared/fields";
import { completeRun, createRun } from "../store/runs";
import type { SignalEvent } from "../store/signals";
import { executeNode, type ExecutionContext } from "./executor";
import { getSinkReachableNodeIds, resolveExecutionOrder } from "./walker";

// ─── Lookback Pre-Pass ────────────────────────────────────────────────────────

/**
 * Infer the lookback periods a node needs from its params (period, size)
 * or explicit lookback config.
 */
function inferLookback(node: GraphNodeConfig): number {
  if (node.lookback && node.lookback > 0) {
    return node.lookback;
  }
  const p = node.params;
  if (!p) {
    return 0;
  }
  // EMA uses "period", window-avg/min/max/sum uses "size"
  const val = p["period"] ?? p["size"];
  if (typeof val === "number" && val > 0) {
    return val;
  }
  return 0;
}

/**
 * Walk the graph backwards and compute extended fetch ranges for each node.
 * Nodes that feed into indicators/transformers with lookback requirements
 * get their range extended so upstream data includes warm-up periods.
 */
function computeNodeRanges(
  config: GraphConfig,
  requestedRange: TimeRange,
  graphResolution?: Resolution,
): Map<string, TimeRange> {
  const result = new Map<string, TimeRange>();
  const resolution = graphResolution ?? GraphResolution.ONE_DAY;
  const periodMs = RESOLUTION_MS[resolution];

  // Build reverse adjacency: child → parents
  const reverseAdj = new Map<string, string[]>();
  for (const nodeId of Object.keys(config.nodes)) {
    reverseAdj.set(nodeId, []);
  }
  for (const edge of config.edges) {
    reverseAdj.get(edge.to)?.push(edge.from);
  }

  // For each node with a lookback, propagate extended range to its ancestors
  // Use max lookback when multiple paths converge
  const extraPeriods = new Map<string, number>();

  for (const [nodeId, nodeConfig] of Object.entries(config.nodes)) {
    const lb = inferLookback(nodeConfig);
    if (lb <= 0) {
      continue;
    }
    // BFS backwards - extend all ancestors by this node's lookback
    const queue = reverseAdj.get(nodeId) ?? [];
    const visited = new Set<string>();
    for (const parentId of queue) {
      if (visited.has(parentId)) {
        continue;
      }
      visited.add(parentId);
      const current = extraPeriods.get(parentId) ?? 0;
      extraPeriods.set(parentId, Math.max(current, lb));
      // Also propagate further upstream
      for (const grandparent of reverseAdj.get(parentId) ?? []) {
        if (!visited.has(grandparent)) {
          queue.push(grandparent);
        }
      }
    }
  }

  // Convert extra periods into extended ranges
  for (const [nodeId, periods] of extraPeriods) {
    const nodeConfig = config.nodes[nodeId];
    const nodeResolution = nodeConfig?.resolution ?? resolution;
    const nodePeriodMs = RESOLUTION_MS[nodeResolution] ?? periodMs;
    result.set(nodeId, {
      from: new Date(requestedRange.from.getTime() - periods * nodePeriodMs),
      to: requestedRange.to,
    });
  }

  return result;
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
      // Non-fatal - run tracking failure shouldn't block execution
    }
  }

  // Pre-compute extended fetch ranges for source nodes based on downstream lookbacks
  const graphResolution = options?.displayResolution ?? config.resolution;
  const nodeRanges = computeNodeRanges(config, range, graphResolution);

  const ctx: ExecutionContext = {
    requestedRange: range,
    nodeRanges,
    graphId,
    graphNodes: config.nodes,
    graphEdges: config.edges,
    resolvedSeries: new Map(),
    resolvedSignals: new Map(),
    nodeResolutions: new Map(),
    graphResolution,
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
      await completeRun(runId, RunStatus.FAILED, 1, 0).catch(() => undefined);
    }
    return {
      series: ctx.resolvedSeries,
      signals: ctx.resolvedSignals,
      errors: [
        {
          nodeId: "graph",
          error: `Cycle detected - nodes involved: ${cycleNodes.join(", ")}`,
        },
      ],
      runId,
      skippedChartOnly: 0,
    };
  }

  // In scheduled cron mode (not readOnly, not backtest), skip chart-only nodes.
  // Chart-only nodes have no path to any evaluator or endpoint sink - they exist
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
      // Continue with remaining nodes - partial results are useful
    }
  }

  // skippedChartOnly is tracked for debugging but not surfaced as errors

  // Complete the run record
  if (runId) {
    const status = errors.length > 0 ? RunStatus.FAILED : RunStatus.COMPLETED;
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
