/**
 * Subscription Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the subscription domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import { EVALUATOR_THRESHOLD_ALIAS } from "../analytics/evaluators/threshold/constants";
import { EMA_ALIAS } from "../analytics/indicators/ema/constants";
import { WINDOW_AVG_ALIAS } from "../analytics/indicators/window-avg/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { COMPLETE_TASK_ALIAS } from "../system/unified-interface/tasks/complete-task/constants";
import { GraphResolution } from "../system/unified-interface/vibe-sense/enum";
import type {
  GraphConfig,
  GraphSeedEntry,
} from "../system/unified-interface/vibe-sense/graph/types";
import { SUBSCRIPTIONS_ACTIVE_ALIAS } from "./data-sources/subscriptions-active/constants";
import { SUBSCRIPTIONS_CANCELLED_ALIAS } from "./data-sources/subscriptions-cancelled/constants";
import { SUBSCRIPTIONS_CHURNED_ALIAS } from "./data-sources/subscriptions-churned/constants";
import { SUBSCRIPTIONS_NEW_ALIAS } from "./data-sources/subscriptions-new/constants";
import { SUBSCRIPTIONS_PAYMENT_FAILED_ALIAS } from "./data-sources/subscriptions-payment-failed/constants";
import { SUBSCRIPTIONS_TRIALING_ALIAS } from "./data-sources/subscriptions-trialing/constants";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const ORANGE = "#ea580c";
const PURPLE = "#9333ea";

// ─── Subscription Lifecycle ─────────────────────────────────────────────────

const subscriptionLifecycleConfig: GraphConfig = {
  nodes: {
    subs_new: {
      endpointPath: SUBSCRIPTIONS_NEW_ALIAS,
      pane: 0,
      color: GREEN,
    },
    subs_cancelled: {
      endpointPath: SUBSCRIPTIONS_CANCELLED_ALIAS,
      pane: 0,
      color: RED,
    },
    subs_churned: {
      endpointPath: SUBSCRIPTIONS_CHURNED_ALIAS,
      pane: 0,
      color: ORANGE,
    },
    subs_trialing: {
      endpointPath: SUBSCRIPTIONS_TRIALING_ALIAS,
      pane: 0,
      color: PURPLE,
    },

    new_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: GREEN,
    },
    cancelled_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: RED,
    },

    churn_vs_new: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    eval_churn_exceeds_new: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: ">", value: 1 },
      visible: false,
    },
    eval_no_new_subs: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: "<", value: 1 },
      visible: false,
    },

    action_notify_churn_crisis: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Churn-to-new subscription ratio exceeded 1.0 over 7 days. More subscribers are leaving than joining. Investigate cancellation reasons and consider retention campaigns.",
      },
    },
  },

  edges: [
    { from: "subs_new", to: "new_ema7" },
    { from: "subs_cancelled", to: "cancelled_ema7" },
    { from: "subs_churned", to: "churn_vs_new", toHandle: "a" },
    { from: "subs_new", to: "churn_vs_new", toHandle: "b" },
    { from: "churn_vs_new", to: "eval_churn_exceeds_new" },
    { from: "new_ema7", to: "eval_no_new_subs" },
    { from: "eval_churn_exceeds_new", to: "action_notify_churn_crisis" },
  ],

  positions: {
    subs_new: { x: 0, y: 0 },
    subs_cancelled: { x: 0, y: 120 },
    subs_churned: { x: 0, y: 240 },
    subs_trialing: { x: 0, y: 360 },
    new_ema7: { x: 300, y: 0 },
    cancelled_ema7: { x: 300, y: 120 },
    churn_vs_new: { x: 300, y: 240 },
    eval_churn_exceeds_new: { x: 600, y: 240 },
    eval_no_new_subs: { x: 600, y: 0 },
    action_notify_churn_crisis: { x: 900, y: 240 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Subscription Health ────────────────────────────────────────────────────

const subscriptionHealthConfig: GraphConfig = {
  nodes: {
    subs_active: {
      endpointPath: SUBSCRIPTIONS_ACTIVE_ALIAS,
      pane: 0,
      color: BLUE,
    },
    subs_trialing: {
      endpointPath: SUBSCRIPTIONS_TRIALING_ALIAS,
      pane: 0,
      color: PURPLE,
    },
    subs_payment_failed: {
      endpointPath: SUBSCRIPTIONS_PAYMENT_FAILED_ALIAS,
      pane: 0,
      color: RED,
    },
    subs_new: {
      endpointPath: SUBSCRIPTIONS_NEW_ALIAS,
      pane: 0,
      color: GREEN,
    },

    trial_to_active: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },
    payment_fail_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: RED,
    },
    payment_fail_w7: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 7 },
      pane: 1,
      color: RED,
    },

    eval_high_payment_failure: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: ">", value: 0.1 },
      visible: false,
    },

    action_notify_payment_failures: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Subscription payment failure rate exceeded 10% (7-day avg). Possible billing system issue, expired cards, or payment provider problems. Review failed payment logs.",
      },
    },
  },

  edges: [
    { from: "subs_trialing", to: "trial_to_active", toHandle: "a" },
    { from: "subs_active", to: "trial_to_active", toHandle: "b" },
    { from: "subs_payment_failed", to: "payment_fail_rate", toHandle: "a" },
    { from: "subs_active", to: "payment_fail_rate", toHandle: "b" },
    { from: "payment_fail_rate", to: "payment_fail_w7" },
    { from: "payment_fail_w7", to: "eval_high_payment_failure" },
    { from: "eval_high_payment_failure", to: "action_notify_payment_failures" },
  ],

  positions: {
    subs_active: { x: 0, y: 0 },
    subs_trialing: { x: 0, y: 120 },
    subs_payment_failed: { x: 0, y: 240 },
    subs_new: { x: 0, y: 360 },
    trial_to_active: { x: 300, y: 60 },
    payment_fail_rate: { x: 300, y: 240 },
    payment_fail_w7: { x: 560, y: 240 },
    eval_high_payment_failure: { x: 800, y: 240 },
    action_notify_payment_failures: { x: 1060, y: 240 },
  },

  trigger: { type: "cron", schedule: "0 0 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "subscription-lifecycle",
    name: "Subscription Lifecycle",
    description:
      "Tracks new subscriptions vs cancellations vs churn. 7-day EMA smoothing with churn ratio. Alerts when churn exceeds new signups.",
    config: subscriptionLifecycleConfig,
  },
  {
    slug: "subscription-health",
    name: "Subscription Health",
    description:
      "Daily snapshot of active subscriptions, trial-to-active conversion, and payment failure rates. Alerts on payment system degradation.",
    config: subscriptionHealthConfig,
  },
];
