/**
 * System Domain - Vibe Sense Graph Seeds
 *
 * "Error Log Monitoring": error and warning volume per day (occurrences from
 * the per-day counter, not error_logs rows, which are one per error class),
 * error classes seen and new per day, and the open (unresolved) backlog
 * recorded on every run. Cron / background task health lives in the
 * "task-health" graph (src/vibe/tasks/watchdog/graph-seeds.ts).
 *
 * Retired (archived by the seeder): "cron-reliability" (duplicate of
 * task-health, counted timeouts as non-failures) and "platform-health-overview"
 * (copy of both graphs).
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import { EVALUATOR_THRESHOLD_ALIAS } from "@/analytics/evaluators/threshold/constants";

import { COMPLETE_TASK_ALIAS } from "../execute-tool/complete/constants";
import { ERROR_LOGS_SERIES_ALIAS } from "../logger/error-monitor/data-sources/error-logs-series/constants";
import {
  ErrorLogsLevelFilter,
  ErrorLogsMetric,
} from "../logger/error-monitor/data-sources/error-logs-series/enum";
import { GraphResolution } from "./enum";
import type { GraphConfig, GraphSeedEntry } from "./graph/types";

// ─── Color palette ──────────────────────────────────────────────────────────

const RED = "#ef4444";
const ORANGE = "#ea580c";
const PURPLE = "#9333ea";
const AMBER = "#ca8a04";

/** Error occurrences per day that count as a spike (normal: ~350-450). */
const ERROR_SPIKE_PER_DAY = 1500;
/** Unresolved error classes that mean the error-log sweep is falling behind. */
const OPEN_BACKLOG_LIMIT = 100;

const DAY = GraphResolution.ONE_DAY;

// ─── Error Log Monitoring ───────────────────────────────────────────────────

const errorLogMonitoringConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: occurrences per day ──
    error_occurrences: {
      endpointPath: ERROR_LOGS_SERIES_ALIAS,
      resolution: DAY,
      params: {
        metric: ErrorLogsMetric.OCCURRENCES,
        level: ErrorLogsLevelFilter.ERROR,
      },
      pane: 0,
      color: RED,
    },
    warning_occurrences: {
      endpointPath: ERROR_LOGS_SERIES_ALIAS,
      resolution: DAY,
      params: {
        metric: ErrorLogsMetric.OCCURRENCES,
        level: ErrorLogsLevelFilter.WARN,
      },
      pane: 0,
      color: ORANGE,
    },

    // ── Pane 1: error classes (fingerprints) seen and new per day ──
    error_classes_seen: {
      endpointPath: ERROR_LOGS_SERIES_ALIAS,
      resolution: DAY,
      params: {
        metric: ErrorLogsMetric.DISTINCT,
        level: ErrorLogsLevelFilter.ERROR,
      },
      pane: 1,
      color: RED,
    },
    warning_classes_seen: {
      endpointPath: ERROR_LOGS_SERIES_ALIAS,
      resolution: DAY,
      params: {
        metric: ErrorLogsMetric.DISTINCT,
        level: ErrorLogsLevelFilter.WARN,
      },
      pane: 1,
      color: ORANGE,
    },
    new_classes: {
      endpointPath: ERROR_LOGS_SERIES_ALIAS,
      resolution: DAY,
      params: {
        metric: ErrorLogsMetric.NEW,
        level: ErrorLogsLevelFilter.ALL,
      },
      pane: 1,
      color: PURPLE,
    },

    // ── Pane 2: open backlog, persisted on every run (history builds up) ──
    open_errors: {
      endpointPath: ERROR_LOGS_SERIES_ALIAS,
      resolution: DAY,
      persist: "always",
      params: {
        metric: ErrorLogsMetric.OPEN_BACKLOG,
        level: ErrorLogsLevelFilter.ERROR,
      },
      pane: 2,
      color: RED,
    },
    open_warnings: {
      endpointPath: ERROR_LOGS_SERIES_ALIAS,
      resolution: DAY,
      persist: "always",
      params: {
        metric: ErrorLogsMetric.OPEN_BACKLOG,
        level: ErrorLogsLevelFilter.WARN,
      },
      pane: 2,
      color: AMBER,
    },
    open_total: {
      endpointPath: ERROR_LOGS_SERIES_ALIAS,
      resolution: DAY,
      persist: "always",
      params: {
        metric: ErrorLogsMetric.OPEN_BACKLOG,
        level: ErrorLogsLevelFilter.ALL,
      },
      visible: false,
    },

    // ── Alerts ──
    eval_error_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: DAY,
      params: { op: ">", value: ERROR_SPIKE_PER_DAY },
      visible: false,
    },
    eval_backlog: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: DAY,
      params: { op: ">", value: OPEN_BACKLOG_LIMIT },
      visible: false,
    },

    action_notify_error_spike: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary: `ALERT: More than ${String(ERROR_SPIKE_PER_DAY)} error occurrences in one day (normal is a few hundred). Open the error monitor, sort by occurrences and fix the top class.`,
      },
    },
    action_notify_backlog: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary: `ALERT: More than ${String(OPEN_BACKLOG_LIMIT)} unresolved error log classes. The error-log sweep is falling behind: triage and resolve.`,
      },
    },
  },

  edges: [
    { from: "error_occurrences", to: "eval_error_spike" },
    { from: "open_total", to: "eval_backlog" },
    { from: "eval_error_spike", to: "action_notify_error_spike" },
    { from: "eval_backlog", to: "action_notify_backlog" },
  ],

  positions: {
    error_occurrences: { x: 0, y: 0 },
    warning_occurrences: { x: 0, y: 120 },
    error_classes_seen: { x: 0, y: 280 },
    warning_classes_seen: { x: 0, y: 400 },
    new_classes: { x: 0, y: 520 },
    open_errors: { x: 0, y: 680 },
    open_warnings: { x: 0, y: 800 },
    open_total: { x: 0, y: 920 },
    eval_error_spike: { x: 300, y: 0 },
    eval_backlog: { x: 300, y: 920 },
    action_notify_error_spike: { x: 600, y: 0 },
    action_notify_backlog: { x: 600, y: 920 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "error-log-monitoring",
    name: "Error Log Monitoring",
    description:
      "Errors and warnings per day: occurrences, error classes seen, new classes, and the unresolved backlog (recorded on every run). Daily history starts 2026-11-22. Alerts on an error spike or a backlog above 100.",
    config: errorLogMonitoringConfig,
  },
];
