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

import type { GraphConfig } from "../graph/types";
import type { DataPoint, TimeRange } from "../indicators/types";
import { resolveExecutionOrder } from "./walker";
import { executeNode, type ExecutionContext } from "./executor";
import type { SignalEvent } from "../store/signals";
import { completeRun, createRun } from "../store/runs";

export interface GraphRunResult {
  series: Map<string, DataPoint[]>;
  signals: Map<string, SignalEvent[]>;
  errors: Array<{ nodeId: string; error: string }>;
  runId: string | null;
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
  options?: { readOnly?: boolean },
): Promise<GraphRunResult> {
  const readOnly = options?.readOnly ?? false;

  // Create execution run record (skip for backtests and readOnly data renders)
  let runId: string | null = null;
  if (!backtestRunId && !readOnly) {
    try {
      runId = await createRun(graphId, graphId);
    } catch {
      // Non-fatal — run tracking failure shouldn't block execution
    }
  }

  const ctx: ExecutionContext = {
    requestedRange: range,
    graphId,
    graphNodes: config.nodes,
    graphEdges: config.edges,
    resolvedSeries: new Map(),
    resolvedSignals: new Map(),
    backtestRunId,
    readOnly,
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
    };
  }

  // Execute nodes in order
  let nodeCount = 0;
  for (const nodeId of executionOrder) {
    const nodeConfig = config.nodes[nodeId];
    if (!nodeConfig) {
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
  };
}
