/**
 * Subscription Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the subscription domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import type {
  GraphConfig,
  GraphSeedEntry,
} from "next-vibe/dataflow/graph/types";
import { COMPLETE_TASK_ALIAS } from "next-vibe/execute-tool/complete/constants";

import { EVALUATOR_THRESHOLD_ALIAS } from "../analytics/evaluators/threshold/constants";
import { WINDOW_SUM_ALIAS } from "../analytics/indicators/window-sum/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { SUBSCRIPTIONS_ACTIVE_ALIAS } from "./data-sources/subscriptions-active/constants";
import { SUBSCRIPTIONS_CANCELLED_ALIAS } from "./data-sources/subscriptions-cancelled/constants";
import { SUBSCRIPTIONS_CHURNED_ALIAS } from "./data-sources/subscriptions-churned/constants";
import { SUBSCRIPTIONS_MRR_ALIAS } from "./data-sources/subscriptions-mrr/constants";
import { SUBSCRIPTIONS_NEW_ALIAS } from "./data-sources/subscriptions-new/constants";
import { SUBSCRIPTIONS_PAYMENT_FAILED_ALIAS } from "./data-sources/subscriptions-payment-failed/constants";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const ORANGE = "#ea580c";

/** A few subscription events per month: trends and alerts use 30 days. */
const MONTH = 30;

// ─── Subscription Lifecycle ─────────────────────────────────────────────────
// Counts only, admin accounts and incomplete checkouts excluded. A
// cancellation is the request; churn is the day access actually ended.

const subscriptionLifecycleConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: daily events ──
    new_subscriptions: {
      endpointPath: SUBSCRIPTIONS_NEW_ALIAS,
      pane: 0,
      color: GREEN,
    },
    cancellations: {
      endpointPath: SUBSCRIPTIONS_CANCELLED_ALIAS,
      pane: 0,
      color: ORANGE,
    },
    churned: {
      endpointPath: SUBSCRIPTIONS_CHURNED_ALIAS,
      pane: 0,
      color: RED,
    },

    // ── Pane 1: rolling 30-day totals ──
    new_subscriptions_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: MONTH },
      pane: 1,
      color: GREEN,
    },
    cancellations_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: MONTH },
      pane: 1,
      color: ORANGE,
    },
    churned_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: MONTH },
      pane: 1,
      color: RED,
    },

    churned_per_new_30d: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      visible: false,
    },
    eval_churn_exceeds_new: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      params: { op: ">", value: 1 },
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
          "ALERT: More subscriptions ended than started over the last 30 days. The subscriber base is shrinking. Check cancellation reasons and failed renewals.",
      },
    },
  },

  edges: [
    { from: "new_subscriptions", to: "new_subscriptions_30d" },
    { from: "cancellations", to: "cancellations_30d" },
    { from: "churned", to: "churned_30d" },
    { from: "churned_30d", to: "churned_per_new_30d", toHandle: "a" },
    { from: "new_subscriptions_30d", to: "churned_per_new_30d", toHandle: "b" },
    { from: "churned_per_new_30d", to: "eval_churn_exceeds_new" },
    { from: "eval_churn_exceeds_new", to: "action_notify_churn_crisis" },
  ],

  positions: {
    new_subscriptions: { x: 0, y: 0 },
    cancellations: { x: 0, y: 120 },
    churned: { x: 0, y: 240 },
    new_subscriptions_30d: { x: 300, y: 0 },
    cancellations_30d: { x: 300, y: 120 },
    churned_30d: { x: 300, y: 240 },
    churned_per_new_30d: { x: 560, y: 120 },
    eval_churn_exceeds_new: { x: 800, y: 120 },
    action_notify_churn_crisis: { x: 1060, y: 120 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Subscription Health ────────────────────────────────────────────────────
// Snapshot of the paying base at the end of each day plus failed renewals.

const subscriptionHealthConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: active subscriptions (count) ──
    active_subscriptions: {
      endpointPath: SUBSCRIPTIONS_ACTIVE_ALIAS,
      pane: 0,
      color: BLUE,
    },

    // ── Pane 1: MRR (USD) ──
    mrr_usd: {
      endpointPath: SUBSCRIPTIONS_MRR_ALIAS,
      pane: 1,
      color: GREEN,
    },

    // ── Pane 2: failed renewal charges (count) ──
    failed_renewals: {
      endpointPath: SUBSCRIPTIONS_PAYMENT_FAILED_ALIAS,
      pane: 2,
      color: RED,
    },
    failed_renewals_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: MONTH },
      pane: 2,
      color: ORANGE,
    },

    // ── Pane 3: failed renewals in 30 days per active subscription (0..1) ──
    failed_renewal_rate_30d: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 3,
      color: RED,
    },

    eval_high_renewal_failure: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      params: { op: ">", value: 0.1 },
      visible: false,
    },
    action_notify_renewal_failures: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Failed renewal charges in the last 30 days exceed 10% of active subscriptions. Check Stripe dunning, expired cards and the renewal webhook.",
      },
    },
  },

  edges: [
    { from: "failed_renewals", to: "failed_renewals_30d" },
    {
      from: "failed_renewals_30d",
      to: "failed_renewal_rate_30d",
      toHandle: "a",
    },
    {
      from: "active_subscriptions",
      to: "failed_renewal_rate_30d",
      toHandle: "b",
    },
    { from: "failed_renewal_rate_30d", to: "eval_high_renewal_failure" },
    { from: "eval_high_renewal_failure", to: "action_notify_renewal_failures" },
  ],

  positions: {
    active_subscriptions: { x: 0, y: 0 },
    mrr_usd: { x: 0, y: 120 },
    failed_renewals: { x: 0, y: 240 },
    failed_renewals_30d: { x: 300, y: 240 },
    failed_renewal_rate_30d: { x: 560, y: 120 },
    eval_high_renewal_failure: { x: 800, y: 120 },
    action_notify_renewal_failures: { x: 1060, y: 120 },
  },

  trigger: { type: "cron", schedule: "0 0 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "subscription-lifecycle",
    name: "Subscription Lifecycle",
    description:
      "Subscriptions started, cancellations requested and subscriptions that actually ended, per day and as rolling 30-day totals. Admin accounts and incomplete checkouts excluded. Alerts when more subscriptions ended than started over 30 days.",
    config: subscriptionLifecycleConfig,
  },
  {
    slug: "subscription-health",
    name: "Subscription Health",
    description:
      "Active subscriptions and MRR (approx. USD, yearly plans as 1/12) at the end of each day, plus failed renewal charges and their 30-day rate per active subscription. Admin accounts excluded. Alerts when failed renewals pass 10% of the base.",
    config: subscriptionHealthConfig,
  },
];
