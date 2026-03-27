/**
 * Vibe Sense - Graph Scheduler
 *
 * Reads all active graphs with cron triggers and executes them.
 * Called by the vibe-sense-graph-runner cron task.
 *
 * Each graph's trigger.schedule is checked against the current time
 * to determine if it should run. The task itself runs frequently (every 5 min);
 * individual graph schedules are respected by checking lastRunAt + schedule.
 */

import "server-only";

import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatDuration,
  formatSense,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

import { maybeColorize, semantic } from "../../shared/logger/colors";
import { pipelineGraphs } from "../db";
import { RunStatus } from "../enum";
import { getLatestRun } from "../store/runs";
import { runGraph } from "./runner";

export interface SchedulerResult {
  graphsChecked: number;
  graphsExecuted: number;
  errors: Array<{ graphId: string; slug: string; error: string }>;
}

/**
 * Run all due cron-triggered graphs.
 * Called by the cron task on a fixed schedule (e.g. every 5 minutes).
 * Each graph's own cron schedule determines if it actually executes.
 */
export async function runDueGraphs(
  logger: EndpointLogger,
): Promise<SchedulerResult> {
  // Find all active, non-archived graphs with cron triggers
  const graphs = await db
    .select({
      id: pipelineGraphs.id,
      slug: pipelineGraphs.slug,
      config: pipelineGraphs.config,
    })
    .from(pipelineGraphs)
    .where(
      and(eq(pipelineGraphs.isActive, true), isNull(pipelineGraphs.archivedAt)),
    );

  // Filter to cron-triggered graphs
  const scheduledGraphs = graphs.filter((g) => {
    return g.config.trigger.type === "cron";
  });

  let executed = 0;
  const errors: SchedulerResult["errors"] = [];
  const startTime = Date.now();
  const ran: string[] = [];

  for (const graph of scheduledGraphs) {
    try {
      const { config } = graph;
      if (config.trigger.type !== "cron") {
        continue;
      }
      const lastRun = await getLatestRun(graph.id);

      const isDue = checkIfDue(lastRun, config.trigger.schedule);

      if (!isDue) {
        continue;
      }

      // Determine range: from lastRunAt to now
      const now = new Date();
      const from = lastRun?.finishedAt ?? lastRun?.startedAt ?? dayAgo(now);

      logger.debug(`[sense] Running graph ${graph.slug} (${graph.id})`);
      await runGraph(graph.id, config, { from, to: now });
      ran.push(graph.slug);
      executed++;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      errors.push({ graphId: graph.id, slug: graph.slug, error: msg });
      logger.error(formatSense(`Graph ${graph.slug} failed: ${msg}`, "❌"));
    }
  }

  if (executed > 0 || errors.length > 0) {
    const duration = Date.now() - startTime;
    if (errors.length > 0) {
      logger.info(
        `📊 ${maybeColorize(`${semantic.sense}Executed ${executed} graphs with ${errors.length} errors in ${formatDuration(duration)}`, semantic.sense)}`,
      );
    }
    logger.info(
      `📊 ${maybeColorize(`${semantic.sense}Executed ${executed} graphs in ${formatDuration(duration)}`, semantic.sense)}`,
    );
  }

  return {
    graphsChecked: scheduledGraphs.length,
    graphsExecuted: executed,
    errors,
  };
}

/**
 * Check if a graph is due to run based on its cron schedule and last run.
 */
function checkIfDue(
  lastRun: { startedAt: Date; status: string } | null,
  schedule: string,
): boolean {
  // Never run before - always due
  if (!lastRun) {
    return true;
  }

  // If last run is still running, skip
  if (lastRun.status === RunStatus.RUNNING) {
    return false;
  }

  // Parse cron schedule to get minimum interval
  const intervalMs = cronToMinIntervalMs(schedule);
  const elapsed = Date.now() - lastRun.startedAt.getTime();

  return elapsed >= intervalMs;
}

/**
 * Parse a cron schedule string to approximate minimum interval in ms.
 * Handles: every-N-minutes, every-N-hours, comma-separated hours,
 * specific day-of-week, specific day-of-month, and fixed-time daily.
 */
function cronToMinIntervalMs(schedule: string): number {
  const MINUTE_MS = 60 * 1000;
  const HOUR_MS = 60 * MINUTE_MS;
  const DAY_MS = 24 * HOUR_MS;

  const parts = schedule.trim().split(/\s+/);

  // 6-part cron: second minute hour dayOfMonth month dayOfWeek
  // 5-part cron: minute hour dayOfMonth month dayOfWeek
  const offset = parts.length === 6 ? 1 : 0;
  const minute = parts[0 + offset] ?? "*";
  const hour = parts[1 + offset] ?? "*";
  const dayOfMonth = parts[2 + offset] ?? "*";
  const dayOfWeek = parts[4 + offset] ?? "*";

  // Every N minutes: "*/N * * * *"
  if (minute.startsWith("*/")) {
    const n = parseInt(minute.slice(2), 10);
    if (!isNaN(n) && n > 0) {
      return n * MINUTE_MS;
    }
  }

  // Every N hours: "0 */N * * *"
  if (hour.startsWith("*/")) {
    const n = parseInt(hour.slice(2), 10);
    if (!isNaN(n) && n > 0) {
      return n * HOUR_MS;
    }
  }

  // Specific day-of-month: "0 0 1 * *" = monthly
  if (dayOfMonth !== "*" && /^\d+$/.test(dayOfMonth)) {
    return 28 * DAY_MS; // Approximate minimum month
  }

  // Specific day-of-week: "0 0 * * 1" = weekly
  if (dayOfWeek !== "*" && dayOfWeek !== "?") {
    return 7 * DAY_MS;
  }

  // Comma-separated hours: "0 6,18 * * *" = multiple times per day
  if (hour.includes(",")) {
    const hours = hour
      .split(",")
      .map((h) => parseInt(h, 10))
      .filter((h) => !isNaN(h));
    if (hours.length >= 2) {
      // Compute minimum gap between listed hours
      hours.sort((a, b) => a - b);
      let minGap = 24;
      for (let i = 1; i < hours.length; i++) {
        const hCurr = hours[i];
        const hPrev = hours[i - 1];
        if (hCurr !== undefined && hPrev !== undefined) {
          minGap = Math.min(minGap, hCurr - hPrev);
        }
      }
      return minGap * HOUR_MS;
    }
  }

  // Fixed hour: "0 6 * * *" = daily
  if (/^\d+$/.test(hour) && /^\d+$/.test(minute)) {
    return DAY_MS;
  }

  // Default: 1 hour
  return HOUR_MS;
}

function dayAgo(now: Date): Date {
  return new Date(now.getTime() - 24 * 60 * 60 * 1000);
}
