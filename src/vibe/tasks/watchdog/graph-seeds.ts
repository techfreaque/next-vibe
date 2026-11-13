/**
 * Task Watchdog - Vibe Sense Graph Seeds
 *
 * "Task Health": daily tasks started / completed / failed / watchdog-cancelled,
 * average and 95th percentile duration, daily credit spend by tasks, incident
 * counts by type. Alerts: completions drop sharply vs the trailing average,
 * the failure rate spikes, or any incident opens.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import { GraphResolution } from "next-vibe/dataflow/enum";
import type {
  GraphConfig,
  GraphSeedEntry,
} from "next-vibe/dataflow/graph/types";
import { COMPLETE_TASK_ALIAS } from "next-vibe/execute-tool/complete/constants";

import { EVALUATOR_DROP_ALIAS } from "@/analytics/evaluators/drop/constants";
import { EVALUATOR_THRESHOLD_ALIAS } from "@/analytics/evaluators/threshold/constants";
import { TRANSFORMER_RATIO_ALIAS } from "@/analytics/transformers/ratio/constants";

import { TASK_HEALTH_DATA_SOURCE_ALIAS } from "./constants";
import { TaskHealthMetric, TaskIncidentTypeFilter } from "./enum";

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const AMBER = "#ca8a04";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";
const ORANGE = "#ea580c";
const PINK = "#be185d";

/** Drop alert: completions fall 50% below the prior 14-day average. */
const DROP_PARAMS = { window: 14, dropPct: 0.5, minBaseline: 1 };
/** Spike alert: more than 30% of started tasks failed in a day. */
const FAILURE_RATE_LIMIT = 0.3;

const taskHealthConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: runs per day ──
    started: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { metric: TaskHealthMetric.STARTED },
      pane: 0,
      color: BLUE,
    },
    completed: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { metric: TaskHealthMetric.COMPLETED },
      pane: 0,
      color: GREEN,
    },
    failed: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { metric: TaskHealthMetric.FAILED },
      pane: 0,
      color: RED,
    },
    watchdog_cancelled: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { metric: TaskHealthMetric.WATCHDOG_CANCELLED },
      pane: 0,
      color: AMBER,
    },

    // ── Pane 1: duration (seconds) ──
    avg_duration: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { metric: TaskHealthMetric.AVG_DURATION },
      pane: 1,
      color: CYAN,
    },
    p95_duration: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { metric: TaskHealthMetric.P95_DURATION },
      pane: 1,
      color: PURPLE,
    },

    // ── Pane 2: credits spent by tasks per day ──
    credit_spend: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { metric: TaskHealthMetric.CREDIT_SPEND },
      pane: 2,
      color: ORANGE,
    },

    // ── Pane 3: incidents by type ──
    incidents_total: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: {
        metric: TaskHealthMetric.INCIDENTS,
        incidentType: TaskIncidentTypeFilter.ALL,
      },
      pane: 3,
      color: RED,
    },
    incidents_timeout: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: {
        metric: TaskHealthMetric.INCIDENTS,
        incidentType: TaskIncidentTypeFilter.TIMEOUT,
      },
      pane: 3,
      color: AMBER,
    },
    incidents_loop: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: {
        metric: TaskHealthMetric.INCIDENTS,
        incidentType: TaskIncidentTypeFilter.LOOP,
      },
      pane: 3,
      color: PURPLE,
    },
    incidents_budget: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: {
        metric: TaskHealthMetric.INCIDENTS,
        incidentType: TaskIncidentTypeFilter.BUDGET,
      },
      pane: 3,
      color: ORANGE,
    },
    incidents_retry: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: {
        metric: TaskHealthMetric.INCIDENTS,
        incidentType: TaskIncidentTypeFilter.TRANSIENT_RETRY_EXHAUSTED,
      },
      pane: 3,
      color: CYAN,
    },
    incidents_watchdog: {
      endpointPath: TASK_HEALTH_DATA_SOURCE_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: {
        metric: TaskHealthMetric.INCIDENTS,
        incidentType: TaskIncidentTypeFilter.WATCHDOG_CANCEL,
      },
      pane: 3,
      color: PINK,
    },

    // ── Failure rate feeding the spike alert ──
    failure_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      pane: 4,
      color: RED,
    },

    // ── Alerts ──
    eval_drop_completed: {
      endpointPath: EVALUATOR_DROP_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: DROP_PARAMS,
      lookback: DROP_PARAMS.window,
      visible: false,
    },
    eval_failure_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: FAILURE_RATE_LIMIT },
      visible: false,
    },
    eval_incident_open: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">=", value: 1 },
      visible: false,
    },

    action_notify_drop: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Completed background tasks dropped 50% below the 14-day average. Check Task Health for stuck or disabled tasks.",
      },
    },
    action_notify_failure_spike: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: More than 30% of background task runs failed today. Check Task Health for the shared cause.",
      },
    },
    action_notify_incident: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: The task watchdog opened an incident (timeout, loop, budget cap or exhausted retries). Open Task Health to review and resolve.",
      },
    },
  },

  edges: [
    { from: "failed", to: "failure_rate", toHandle: "a" },
    { from: "started", to: "failure_rate", toHandle: "b" },

    { from: "completed", to: "eval_drop_completed" },
    { from: "failure_rate", to: "eval_failure_spike" },
    { from: "incidents_total", to: "eval_incident_open" },

    { from: "eval_drop_completed", to: "action_notify_drop" },
    { from: "eval_failure_spike", to: "action_notify_failure_spike" },
    { from: "eval_incident_open", to: "action_notify_incident" },
  ],

  positions: {
    started: { x: 0, y: 0 },
    completed: { x: 0, y: 120 },
    failed: { x: 0, y: 240 },
    watchdog_cancelled: { x: 0, y: 360 },
    avg_duration: { x: 0, y: 520 },
    p95_duration: { x: 0, y: 640 },
    credit_spend: { x: 0, y: 800 },
    incidents_total: { x: 0, y: 960 },
    incidents_timeout: { x: 0, y: 1080 },
    incidents_loop: { x: 0, y: 1200 },
    incidents_budget: { x: 0, y: 1320 },
    incidents_retry: { x: 0, y: 1440 },
    incidents_watchdog: { x: 0, y: 1560 },
    failure_rate: { x: 300, y: 300 },
    eval_drop_completed: { x: 600, y: 120 },
    eval_failure_spike: { x: 600, y: 300 },
    eval_incident_open: { x: 600, y: 960 },
    action_notify_drop: { x: 900, y: 120 },
    action_notify_failure_spike: { x: 900, y: 300 },
    action_notify_incident: { x: 900, y: 960 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "task-health",
    name: "Task Health",
    description:
      "Background tasks per day: started, completed, failed, watchdog-cancelled, duration (average and 95th percentile), credit spend and incidents by type. Alerts on a completion drop, a failure-rate spike or any new incident.",
    config: taskHealthConfig,
  },
];
