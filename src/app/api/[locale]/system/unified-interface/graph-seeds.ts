/**
 * System Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for system health monitoring.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import { EVALUATOR_THRESHOLD_ALIAS } from "../../analytics/evaluators/threshold/constants";
import { EMA_ALIAS } from "../../analytics/indicators/ema/constants";
import { WINDOW_AVG_ALIAS } from "../../analytics/indicators/window-avg/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../../analytics/transformers/ratio/constants";
import { CRON_EXECUTIONS_FAILED_ALIAS } from "./data-sources/cron-executions-failed/constants";
import { CRON_EXECUTIONS_SUCCEEDED_ALIAS } from "./data-sources/cron-executions-succeeded/constants";
import { CRON_EXECUTIONS_TOTAL_ALIAS } from "./data-sources/cron-executions-total/constants";
import { ERROR_LOGS_ERRORS_ALIAS } from "./data-sources/error-logs-errors/constants";
import { ERROR_LOGS_TOTAL_ALIAS } from "./data-sources/error-logs-total/constants";
import { ERROR_LOGS_WARNINGS_ALIAS } from "./data-sources/error-logs-warnings/constants";
import { COMPLETE_TASK_ALIAS } from "./tasks/complete-task/constants";
import { GraphResolution } from "./vibe-sense/enum";
import type { GraphConfig, GraphSeedEntry } from "./vibe-sense/graph/types";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const ORANGE = "#ea580c";
const PURPLE = "#9333ea";
const AMBER = "#ca8a04";

// ─── Cron & Task Reliability ────────────────────────────────────────────────

const cronReliabilityConfig: GraphConfig = {
  nodes: {
    cron_total: {
      endpointPath: CRON_EXECUTIONS_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    cron_succeeded: {
      endpointPath: CRON_EXECUTIONS_SUCCEEDED_ALIAS,
      pane: 0,
      color: GREEN,
    },
    cron_failed: {
      endpointPath: CRON_EXECUTIONS_FAILED_ALIAS,
      pane: 0,
      color: RED,
    },

    failure_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: RED,
    },
    failure_rate_w12: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 12 },
      pane: 1,
      color: RED,
    },
    cron_failed_ema: {
      endpointPath: EMA_ALIAS,
      params: { period: 12 },
      pane: 0,
      color: RED,
    },

    eval_high_failure_rate: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_HOUR,
      params: { op: ">", value: 0.2 },
      visible: false,
    },
    eval_no_executions: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_HOUR,
      params: { op: "<", value: 1 },
      visible: false,
    },

    action_notify_cron_failures: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Cron task failure rate exceeded 20% (12-hour window avg). Background jobs are degraded. Check task logs, database connectivity, and system resources.",
      },
    },
    action_notify_cron_stopped: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: No cron executions detected in the past hour. Task scheduler may be down. Check process manager, container health, and system logs immediately.",
      },
    },
  },

  edges: [
    { from: "cron_failed", to: "failure_rate", toHandle: "a" },
    { from: "cron_total", to: "failure_rate", toHandle: "b" },
    { from: "failure_rate", to: "failure_rate_w12" },
    { from: "cron_failed", to: "cron_failed_ema" },
    { from: "failure_rate_w12", to: "eval_high_failure_rate" },
    { from: "cron_total", to: "eval_no_executions" },
    { from: "eval_high_failure_rate", to: "action_notify_cron_failures" },
    { from: "eval_no_executions", to: "action_notify_cron_stopped" },
  ],

  positions: {
    cron_total: { x: 0, y: 0 },
    cron_succeeded: { x: 0, y: 120 },
    cron_failed: { x: 0, y: 240 },
    failure_rate: { x: 300, y: 120 },
    failure_rate_w12: { x: 560, y: 120 },
    cron_failed_ema: { x: 300, y: 240 },
    eval_high_failure_rate: { x: 800, y: 120 },
    eval_no_executions: { x: 600, y: 0 },
    action_notify_cron_failures: { x: 1060, y: 120 },
    action_notify_cron_stopped: { x: 900, y: 0 },
  },

  trigger: { type: "cron", schedule: "*/15 * * * *" },
};

// ─── Error Log Monitoring ───────────────────────────────────────────────────

const errorLogMonitoringConfig: GraphConfig = {
  nodes: {
    errors_total: {
      endpointPath: ERROR_LOGS_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    errors_errors: {
      endpointPath: ERROR_LOGS_ERRORS_ALIAS,
      pane: 0,
      color: RED,
    },
    errors_warnings: {
      endpointPath: ERROR_LOGS_WARNINGS_ALIAS,
      pane: 0,
      color: ORANGE,
    },

    errors_ema: {
      endpointPath: EMA_ALIAS,
      params: { period: 12 },
      pane: 0,
      color: RED,
    },
    warnings_ema: {
      endpointPath: EMA_ALIAS,
      params: { period: 12 },
      pane: 0,
      color: ORANGE,
    },

    error_ratio: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    eval_error_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_HOUR,
      params: { op: ">", value: 50 },
      visible: false,
    },
    eval_warning_flood: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_HOUR,
      params: { op: ">", value: 200 },
      visible: false,
    },

    action_notify_error_spike: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Error log volume exceeded 50 errors/hour (12-period EMA). Application stability is degraded. Review error logs for new exceptions and deploy hotfix if needed.",
      },
    },
  },

  edges: [
    { from: "errors_errors", to: "errors_ema" },
    { from: "errors_warnings", to: "warnings_ema" },
    { from: "errors_errors", to: "error_ratio", toHandle: "a" },
    { from: "errors_total", to: "error_ratio", toHandle: "b" },
    { from: "errors_ema", to: "eval_error_spike" },
    { from: "warnings_ema", to: "eval_warning_flood" },
    { from: "eval_error_spike", to: "action_notify_error_spike" },
  ],

  positions: {
    errors_total: { x: 0, y: 0 },
    errors_errors: { x: 0, y: 120 },
    errors_warnings: { x: 0, y: 240 },
    errors_ema: { x: 300, y: 120 },
    warnings_ema: { x: 300, y: 240 },
    error_ratio: { x: 300, y: 60 },
    eval_error_spike: { x: 600, y: 120 },
    eval_warning_flood: { x: 600, y: 240 },
    action_notify_error_spike: { x: 900, y: 120 },
  },

  trigger: { type: "cron", schedule: "*/15 * * * *" },
};

// ─── Platform Health Overview ─────────────────────────────────────────────────

const platformHealthOverviewConfig: GraphConfig = {
  nodes: {
    cron_total: {
      endpointPath: CRON_EXECUTIONS_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    cron_failed: {
      endpointPath: CRON_EXECUTIONS_FAILED_ALIAS,
      pane: 0,
      color: RED,
    },
    cron_succeeded: {
      endpointPath: CRON_EXECUTIONS_SUCCEEDED_ALIAS,
      pane: 0,
      color: GREEN,
    },
    errors_total: {
      endpointPath: ERROR_LOGS_TOTAL_ALIAS,
      pane: 0,
      color: ORANGE,
    },
    errors_errors: {
      endpointPath: ERROR_LOGS_ERRORS_ALIAS,
      pane: 0,
      color: RED,
    },
    errors_warnings: {
      endpointPath: ERROR_LOGS_WARNINGS_ALIAS,
      pane: 0,
      color: AMBER,
    },

    cron_success_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },
    error_severity_ratio: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    cron_success_w12: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 12 },
      pane: 1,
      color: GREEN,
    },
    errors_ema: {
      endpointPath: EMA_ALIAS,
      params: { period: 12 },
      pane: 0,
      color: ORANGE,
    },

    eval_platform_degraded: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_HOUR,
      params: { op: "<", value: 0.7 },
      visible: false,
    },
    eval_error_storm: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_HOUR,
      params: { op: ">", value: 100 },
      visible: false,
    },

    action_notify_platform_degraded: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "CRITICAL: Platform health degraded - cron success rate dropped below 70% (12-period window). Combined with error volume, system stability is at risk. Check infrastructure, database, and external service dependencies.",
      },
    },
    action_notify_error_storm: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "CRITICAL: Error storm detected - over 100 errors/hour (EMA). Platform is experiencing widespread failures. Initiate incident response and check all service endpoints.",
      },
    },
  },

  edges: [
    { from: "cron_succeeded", to: "cron_success_rate", toHandle: "a" },
    { from: "cron_total", to: "cron_success_rate", toHandle: "b" },
    { from: "errors_errors", to: "error_severity_ratio", toHandle: "a" },
    { from: "errors_total", to: "error_severity_ratio", toHandle: "b" },
    { from: "cron_success_rate", to: "cron_success_w12" },
    { from: "errors_total", to: "errors_ema" },
    { from: "cron_success_w12", to: "eval_platform_degraded" },
    { from: "errors_ema", to: "eval_error_storm" },
    { from: "eval_platform_degraded", to: "action_notify_platform_degraded" },
    { from: "eval_error_storm", to: "action_notify_error_storm" },
  ],

  positions: {
    cron_total: { x: 0, y: 0 },
    cron_failed: { x: 0, y: 120 },
    cron_succeeded: { x: 0, y: 240 },
    errors_total: { x: 0, y: 360 },
    errors_errors: { x: 0, y: 480 },
    errors_warnings: { x: 0, y: 600 },
    cron_success_rate: { x: 300, y: 120 },
    error_severity_ratio: { x: 300, y: 420 },
    cron_success_w12: { x: 560, y: 120 },
    errors_ema: { x: 300, y: 360 },
    eval_platform_degraded: { x: 800, y: 120 },
    eval_error_storm: { x: 600, y: 360 },
    action_notify_platform_degraded: { x: 1060, y: 120 },
    action_notify_error_storm: { x: 900, y: 360 },
  },

  trigger: { type: "cron", schedule: "*/15 * * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "cron-reliability",
    name: "Cron & Task Reliability",
    description:
      "15-minute monitoring of cron task execution health: success/failure rates, failure EMA, and scheduler uptime. Alerts on failure spikes and scheduler downtime.",
    config: cronReliabilityConfig,
  },
  {
    slug: "error-log-monitoring",
    name: "Error Log Monitoring",
    description:
      "15-minute error log analysis: error vs warning volumes, error-to-total ratio, and EMA smoothing. Alerts on error spikes and warning floods.",
    config: errorLogMonitoringConfig,
  },
  {
    slug: "platform-health-overview",
    name: "Platform Health Overview",
    description:
      "Unified view of cron success rate and error volume with smoothing. Combines task reliability and error monitoring into a single health dashboard. Alerts on platform degradation and error storms.",
    config: platformHealthOverviewConfig,
  },
];
