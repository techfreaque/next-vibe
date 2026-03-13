/**
 * Payment Domain — Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the payment domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import type {
  GraphConfig,
  GraphSeedEntry,
} from "../system/unified-interface/vibe-sense/graph/types";
import { GraphResolution } from "../system/unified-interface/vibe-sense/enum";
import { PAYMENTS_REVENUE_ALIAS } from "./data-sources/payments-revenue/constants";
import { PAYMENTS_COUNT_ALIAS } from "./data-sources/payments-count/constants";
import { PAYMENTS_FAILED_ALIAS } from "./data-sources/payments-failed/constants";
import { PAYMENTS_REFUND_VOLUME_ALIAS } from "./data-sources/payments-refund-volume/constants";
import { PAYMENTS_REFUND_COUNT_ALIAS } from "./data-sources/payments-refund-count/constants";
import { PAYMENTS_DISPUTES_COUNT_ALIAS } from "./data-sources/payments-disputes-count/constants";
import { PAYMENTS_INVOICES_PAID_ALIAS } from "./data-sources/payments-invoices-paid/constants";
import { PAYMENTS_METHODS_ADDED_ALIAS } from "./data-sources/payments-methods-added/constants";
import { EMA_ALIAS } from "../analytics/indicators/ema/constants";
import { WINDOW_AVG_ALIAS } from "../analytics/indicators/window-avg/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { EVALUATOR_THRESHOLD_ALIAS } from "../analytics/evaluators/threshold/constants";
import { COMPLETE_TASK_ALIAS } from "../system/unified-interface/tasks/complete-task/constants";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const ORANGE = "#ea580c";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";

// ─── Revenue & Payments ─────────────────────────────────────────────────────

const revenuePaymentsConfig: GraphConfig = {
  nodes: {
    revenue: {
      endpointPath: PAYMENTS_REVENUE_ALIAS,
      pane: 0,
      color: GREEN,
    },
    payments_count: {
      endpointPath: PAYMENTS_COUNT_ALIAS,
      pane: 0,
      color: BLUE,
    },
    payments_failed: {
      endpointPath: PAYMENTS_FAILED_ALIAS,
      pane: 0,
      color: RED,
    },
    invoices_paid: {
      endpointPath: PAYMENTS_INVOICES_PAID_ALIAS,
      pane: 0,
      color: CYAN,
    },

    revenue_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: GREEN,
    },

    failure_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: RED,
    },
    failure_rate_w7: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 7 },
      pane: 1,
      color: RED,
    },

    eval_revenue_drop: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 100 },
      visible: false,
    },
    eval_high_failure_rate: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 0.15 },
      visible: false,
    },

    action_notify_revenue_drop: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Weekly revenue (7-day EMA) dropped below threshold. Revenue trend is declining. Investigate pricing, conversion, and payment funnel.",
      },
    },
    action_notify_payment_failures: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Payment failure rate exceeded 15% today. Possible payment gateway issue or card decline spike. Check Stripe dashboard and error logs.",
      },
    },
  },

  edges: [
    { from: "revenue", to: "revenue_ema7" },
    { from: "payments_failed", to: "failure_rate", toHandle: "a" },
    { from: "payments_count", to: "failure_rate", toHandle: "b" },
    { from: "failure_rate", to: "failure_rate_w7" },
    { from: "revenue_ema7", to: "eval_revenue_drop" },
    { from: "failure_rate_w7", to: "eval_high_failure_rate" },
    { from: "eval_revenue_drop", to: "action_notify_revenue_drop" },
    { from: "eval_high_failure_rate", to: "action_notify_payment_failures" },
  ],

  positions: {
    revenue: { x: 0, y: 0 },
    payments_count: { x: 0, y: 120 },
    payments_failed: { x: 0, y: 240 },
    invoices_paid: { x: 0, y: 360 },
    revenue_ema7: { x: 300, y: 0 },
    failure_rate: { x: 300, y: 180 },
    failure_rate_w7: { x: 560, y: 180 },
    eval_revenue_drop: { x: 600, y: 0 },
    eval_high_failure_rate: { x: 800, y: 180 },
    action_notify_revenue_drop: { x: 900, y: 0 },
    action_notify_payment_failures: { x: 1060, y: 180 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Refunds & Disputes ─────────────────────────────────────────────────────

const refundsDisputesConfig: GraphConfig = {
  nodes: {
    refund_volume: {
      endpointPath: PAYMENTS_REFUND_VOLUME_ALIAS,
      pane: 0,
      color: RED,
    },
    refund_count: {
      endpointPath: PAYMENTS_REFUND_COUNT_ALIAS,
      pane: 0,
      color: ORANGE,
    },
    disputes: {
      endpointPath: PAYMENTS_DISPUTES_COUNT_ALIAS,
      pane: 0,
      color: PURPLE,
    },
    revenue: {
      endpointPath: PAYMENTS_REVENUE_ALIAS,
      pane: 0,
      color: GREEN,
    },
    methods_added: {
      endpointPath: PAYMENTS_METHODS_ADDED_ALIAS,
      pane: 0,
      color: CYAN,
    },

    refund_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: RED,
    },
    dispute_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },
    refund_rate_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 1,
      color: RED,
    },

    eval_refund_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 0.15 },
      visible: false,
    },
    eval_dispute_threshold: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: ">", value: 5 },
      visible: false,
    },

    action_notify_refund_crisis: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Refund-to-revenue ratio exceeded 15% (7-day EMA). Significant revenue leakage. Review product quality, billing errors, and fraud patterns.",
      },
    },
    action_notify_disputes: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Payment disputes exceeded 5/week. High chargeback rate risks payment processor penalties. Review transactions and improve fraud prevention.",
      },
    },
  },

  edges: [
    { from: "refund_volume", to: "refund_rate", toHandle: "a" },
    { from: "revenue", to: "refund_rate", toHandle: "b" },
    { from: "disputes", to: "dispute_rate", toHandle: "a" },
    { from: "revenue", to: "dispute_rate", toHandle: "b" },
    { from: "refund_rate", to: "refund_rate_ema7" },
    { from: "refund_rate_ema7", to: "eval_refund_spike" },
    { from: "disputes", to: "eval_dispute_threshold" },
    { from: "eval_refund_spike", to: "action_notify_refund_crisis" },
    { from: "eval_dispute_threshold", to: "action_notify_disputes" },
  ],

  positions: {
    refund_volume: { x: 0, y: 0 },
    refund_count: { x: 0, y: 120 },
    disputes: { x: 0, y: 240 },
    revenue: { x: 0, y: 360 },
    methods_added: { x: 0, y: 480 },
    refund_rate: { x: 300, y: 180 },
    dispute_rate: { x: 300, y: 240 },
    refund_rate_ema7: { x: 560, y: 180 },
    eval_refund_spike: { x: 800, y: 180 },
    eval_dispute_threshold: { x: 600, y: 240 },
    action_notify_refund_crisis: { x: 1060, y: 180 },
    action_notify_disputes: { x: 900, y: 240 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "revenue-payments",
    name: "Revenue & Payments",
    description:
      "Tracks payment revenue, transaction counts, and failure rates with 7-day smoothing. Alerts on revenue drops and payment gateway issues.",
    config: revenuePaymentsConfig,
  },
  {
    slug: "refunds-disputes",
    name: "Refunds & Disputes",
    description:
      "Monitors refund volumes, dispute counts, and their ratios to revenue. Alerts on refund spikes and chargeback thresholds.",
    config: refundsDisputesConfig,
  },
];
