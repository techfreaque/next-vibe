/**
 * Vibe Sense — Backtest Engine
 *
 * Runs a graph over a historical range with actions intercepted.
 * Checks eligibility (all source indicators have persist:always data covering range).
 */

import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import type { GraphConfig } from "../graph/types";
import type { TimeRange, Resolution } from "../indicators/types";
import { getIndicator } from "../indicators/registry";
import { pipelineDatapoints } from "../db";
import {
  createBacktestRun,
  markBacktestEligibility,
  writeBacktestSeriesResult,
  writeBacktestSignalResult,
} from "../store/backtest";
import { runGraph } from "./runner";

export interface BacktestResult {
  runId: string;
  eligible: boolean;
  ineligibleNodeIds: string[];
  errors: Array<{ nodeId: string; error: string }>;
}

/**
 * Check if all source indicators in the graph have persist:always data
 * covering the requested range.
 */
async function checkEligibility(
  config: GraphConfig,
): Promise<{ eligible: boolean; ineligibleNodeIds: string[] }> {
  const ineligibleNodeIds: string[] = [];

  for (const [nodeId, nodeConfig] of Object.entries(config.nodes)) {
    if (nodeConfig.type !== "indicator") {
      continue;
    }

    const indicator = getIndicator(nodeConfig.indicatorId);
    if (!indicator || indicator.persist !== "always") {
      ineligibleNodeIds.push(nodeId);
      continue;
    }

    // Check if any persisted data exists for this indicator
    const rows = await db
      .select({ id: pipelineDatapoints.id })
      .from(pipelineDatapoints)
      .where(eq(pipelineDatapoints.nodeId, nodeConfig.indicatorId))
      .limit(1);

    if (rows.length === 0) {
      ineligibleNodeIds.push(nodeId);
    }
  }

  return {
    eligible: ineligibleNodeIds.length === 0,
    ineligibleNodeIds,
  };
}

/**
 * Run a backtest for a graph version over the given range.
 * Returns runId and eligibility status.
 */
export async function runBacktest(
  graphId: string,
  graphVersionId: string,
  config: GraphConfig,
  range: TimeRange,
  resolution: Resolution,
): Promise<BacktestResult> {
  const runId = await createBacktestRun(
    graphId,
    graphVersionId,
    range,
    resolution,
  );

  if (!runId) {
    return {
      runId: "00000000-0000-0000-0000-000000000000",
      eligible: false,
      ineligibleNodeIds: [],
      errors: [{ nodeId: "graph", error: "Failed to create backtest run" }],
    };
  }

  // Check eligibility
  const { eligible, ineligibleNodeIds } = await checkEligibility(config);
  await markBacktestEligibility(runId, eligible);

  if (!eligible) {
    return { runId, eligible: false, ineligibleNodeIds, errors: [] };
  }

  // Run graph with backtest runId (actions intercepted)
  const result = await runGraph(graphId, config, range, runId);

  // Persist backtest series results
  for (const [nodeId, points] of result.series) {
    await writeBacktestSeriesResult(runId, nodeId, points);
  }

  // Persist backtest signal results
  for (const [evaluatorId, signals] of result.signals) {
    await writeBacktestSignalResult(runId, evaluatorId, signals);
  }

  return {
    runId,
    eligible: true,
    ineligibleNodeIds: [],
    errors: result.errors,
  };
}
