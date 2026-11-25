/**
 * Payment Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the payment domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import type {
  GraphConfig,
  GraphSeedEntry,
} from "next-vibe/dataflow/graph/types";
import { COMPLETE_TASK_ALIAS } from "next-vibe/execute-tool/complete/constants";

import { EVALUATOR_THRESHOLD_ALIAS } from "../analytics/evaluators/threshold/constants";
import { EMA_ALIAS } from "../analytics/indicators/ema/constants";
import { WINDOW_SUM_ALIAS } from "../analytics/indicators/window-sum/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { PAYMENTS_CHECKOUTS_ALIAS } from "./data-sources/payments-checkouts/constants";
import { CheckoutOutcome } from "./data-sources/payments-checkouts/enum";
import { PAYMENTS_COUNT_ALIAS } from "./data-sources/payments-count/constants";
import { PAYMENTS_DISPUTES_COUNT_ALIAS } from "./data-sources/payments-disputes-count/constants";
import { PAYMENTS_NEW_CUSTOMERS_ALIAS } from "./data-sources/payments-new-customers/constants";
import { PAYMENTS_REFUND_COUNT_ALIAS } from "./data-sources/payments-refund-count/constants";
import { PAYMENTS_REFUND_VOLUME_ALIAS } from "./data-sources/payments-refund-volume/constants";
import { PAYMENTS_REVENUE_ALIAS } from "./data-sources/payments-revenue/constants";
import {
  RevenueSeriesKind,
  RevenueSeriesProvider,
} from "./data-sources/payments-revenue/enum";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const ORANGE = "#ea580c";
const PURPLE = "#9333ea";
const AMBER = "#d97706";
const SLATE = "#64748b";

/** Payments are a few per week: rates and alerts use rolling windows. */
const WEEK = 7;
const MONTH = 30;

// ─── Revenue & Payments ─────────────────────────────────────────────────────
// All money is approx. USD (static FX), admin accounts excluded. Same
// definitions as the admin Revenue report. Renewals before 2026-11 are only
// partly in the local ledger; the Finance graph has the Stripe-API cash view.

const revenuePaymentsConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: total revenue (USD) ──
    revenue_usd: {
      endpointPath: PAYMENTS_REVENUE_ALIAS,
      params: {
        kind: RevenueSeriesKind.ALL,
        provider: RevenueSeriesProvider.ALL,
      },
      pane: 0,
      color: GREEN,
    },
    revenue_usd_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: WEEK },
      pane: 0,
      color: SLATE,
    },

    // ── Pane 1: revenue by what was bought (USD) ──
    packs_usd: {
      endpointPath: PAYMENTS_REVENUE_ALIAS,
      params: {
        kind: RevenueSeriesKind.PACK,
        provider: RevenueSeriesProvider.ALL,
      },
      pane: 1,
      color: AMBER,
    },
    new_subscriptions_usd: {
      endpointPath: PAYMENTS_REVENUE_ALIAS,
      params: {
        kind: RevenueSeriesKind.NEW_SUBSCRIPTION,
        provider: RevenueSeriesProvider.ALL,
      },
      pane: 1,
      color: BLUE,
    },
    renewals_usd: {
      endpointPath: PAYMENTS_REVENUE_ALIAS,
      params: {
        kind: RevenueSeriesKind.RENEWAL,
        provider: RevenueSeriesProvider.ALL,
      },
      pane: 1,
      color: PURPLE,
    },

    // ── Pane 2: revenue by processor (USD) ──
    stripe_usd: {
      endpointPath: PAYMENTS_REVENUE_ALIAS,
      params: {
        kind: RevenueSeriesKind.ALL,
        provider: RevenueSeriesProvider.STRIPE,
      },
      pane: 2,
      color: BLUE,
    },
    nowpayments_usd: {
      endpointPath: PAYMENTS_REVENUE_ALIAS,
      params: {
        kind: RevenueSeriesKind.ALL,
        provider: RevenueSeriesProvider.NOWPAYMENTS,
      },
      pane: 2,
      color: ORANGE,
    },

    // ── Pane 3: people and checkouts (counts) ──
    new_paying_customers: {
      endpointPath: PAYMENTS_NEW_CUSTOMERS_ALIAS,
      pane: 3,
      color: GREEN,
    },
    checkouts_started: {
      endpointPath: PAYMENTS_CHECKOUTS_ALIAS,
      params: { outcome: CheckoutOutcome.STARTED },
      pane: 3,
      color: SLATE,
    },
    checkouts_paid: {
      endpointPath: PAYMENTS_CHECKOUTS_ALIAS,
      params: { outcome: CheckoutOutcome.PAID },
      pane: 3,
      color: BLUE,
    },
    checkouts_abandoned: {
      endpointPath: PAYMENTS_CHECKOUTS_ALIAS,
      params: { outcome: CheckoutOutcome.ABANDONED },
      pane: 3,
      color: RED,
    },

    // ── Rolling sums feeding the rate and the alert ──
    revenue_usd_7d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: WEEK },
      visible: false,
    },
    checkouts_started_7d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: WEEK },
      visible: false,
    },
    checkouts_paid_7d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: WEEK },
      visible: false,
    },

    // ── Pane 4: share of checkouts that got paid (7 days, 0..1) ──
    checkout_paid_rate_7d: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 4,
      color: BLUE,
    },

    eval_no_revenue_7d: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      params: { op: "<", value: 1 },
      visible: false,
    },
    action_notify_no_revenue: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: No payment collected in the last 7 days (revenue < $1). Check checkout, Stripe and NOWPayments webhooks, and the pricing pages.",
      },
    },
  },

  edges: [
    { from: "revenue_usd", to: "revenue_usd_ema7" },
    { from: "revenue_usd", to: "revenue_usd_7d" },
    { from: "checkouts_started", to: "checkouts_started_7d" },
    { from: "checkouts_paid", to: "checkouts_paid_7d" },
    { from: "checkouts_paid_7d", to: "checkout_paid_rate_7d", toHandle: "a" },
    {
      from: "checkouts_started_7d",
      to: "checkout_paid_rate_7d",
      toHandle: "b",
    },
    { from: "revenue_usd_7d", to: "eval_no_revenue_7d" },
    { from: "eval_no_revenue_7d", to: "action_notify_no_revenue" },
  ],

  positions: {
    revenue_usd: { x: 0, y: 0 },
    packs_usd: { x: 0, y: 120 },
    new_subscriptions_usd: { x: 0, y: 240 },
    renewals_usd: { x: 0, y: 360 },
    stripe_usd: { x: 0, y: 480 },
    nowpayments_usd: { x: 0, y: 600 },
    new_paying_customers: { x: 0, y: 720 },
    checkouts_started: { x: 0, y: 840 },
    checkouts_paid: { x: 0, y: 960 },
    checkouts_abandoned: { x: 0, y: 1080 },
    revenue_usd_ema7: { x: 300, y: 0 },
    revenue_usd_7d: { x: 300, y: 120 },
    checkouts_started_7d: { x: 300, y: 840 },
    checkouts_paid_7d: { x: 300, y: 960 },
    checkout_paid_rate_7d: { x: 560, y: 900 },
    eval_no_revenue_7d: { x: 560, y: 120 },
    action_notify_no_revenue: { x: 820, y: 120 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Refunds & Disputes ─────────────────────────────────────────────────────
// Money in approx. USD, admin accounts excluded. Rates over 30 days: refunds
// and disputes are rare, a daily ratio would be all zeros and spikes.

const refundsDisputesConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: money (USD) ──
    revenue_usd: {
      endpointPath: PAYMENTS_REVENUE_ALIAS,
      params: {
        kind: RevenueSeriesKind.ALL,
        provider: RevenueSeriesProvider.ALL,
      },
      pane: 0,
      color: GREEN,
    },
    refunds_usd: {
      endpointPath: PAYMENTS_REFUND_VOLUME_ALIAS,
      pane: 0,
      color: RED,
    },

    // ── Pane 1: counts ──
    paid_payments: {
      endpointPath: PAYMENTS_COUNT_ALIAS,
      pane: 1,
      color: BLUE,
    },
    refunds: {
      endpointPath: PAYMENTS_REFUND_COUNT_ALIAS,
      pane: 1,
      color: ORANGE,
    },
    disputes: {
      endpointPath: PAYMENTS_DISPUTES_COUNT_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    // ── 30-day sums feeding the rates ──
    revenue_usd_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: MONTH },
      visible: false,
    },
    refunds_usd_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: MONTH },
      visible: false,
    },
    paid_payments_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: MONTH },
      visible: false,
    },
    disputes_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: MONTH },
      visible: false,
    },

    // ── Pane 2: rates over 30 days (0..1) ──
    refund_rate_30d: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 2,
      color: RED,
    },
    dispute_rate_30d: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 2,
      color: PURPLE,
    },

    eval_refund_rate: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      params: { op: ">", value: 0.15 },
      visible: false,
    },
    eval_new_dispute: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      params: { op: ">=", value: 1 },
      visible: false,
    },

    action_notify_refund_rate: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Refunds exceeded 15% of revenue over the last 30 days (USD). Review refunded payments for billing errors, fraud or product issues.",
      },
    },
    action_notify_dispute: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: A new payment dispute (chargeback) was opened. Submit evidence in the Stripe dashboard before the due date; repeated disputes risk processor penalties.",
      },
    },
  },

  edges: [
    { from: "revenue_usd", to: "revenue_usd_30d" },
    { from: "refunds_usd", to: "refunds_usd_30d" },
    { from: "paid_payments", to: "paid_payments_30d" },
    { from: "disputes", to: "disputes_30d" },
    { from: "refunds_usd_30d", to: "refund_rate_30d", toHandle: "a" },
    { from: "revenue_usd_30d", to: "refund_rate_30d", toHandle: "b" },
    { from: "disputes_30d", to: "dispute_rate_30d", toHandle: "a" },
    { from: "paid_payments_30d", to: "dispute_rate_30d", toHandle: "b" },
    { from: "refund_rate_30d", to: "eval_refund_rate" },
    { from: "disputes", to: "eval_new_dispute" },
    { from: "eval_refund_rate", to: "action_notify_refund_rate" },
    { from: "eval_new_dispute", to: "action_notify_dispute" },
  ],

  positions: {
    revenue_usd: { x: 0, y: 0 },
    refunds_usd: { x: 0, y: 120 },
    paid_payments: { x: 0, y: 240 },
    refunds: { x: 0, y: 360 },
    disputes: { x: 0, y: 480 },
    revenue_usd_30d: { x: 300, y: 0 },
    refunds_usd_30d: { x: 300, y: 120 },
    paid_payments_30d: { x: 300, y: 240 },
    disputes_30d: { x: 300, y: 480 },
    refund_rate_30d: { x: 560, y: 60 },
    dispute_rate_30d: { x: 560, y: 360 },
    eval_refund_rate: { x: 800, y: 60 },
    eval_new_dispute: { x: 800, y: 480 },
    action_notify_refund_rate: { x: 1060, y: 60 },
    action_notify_dispute: { x: 1060, y: 480 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "revenue-payments",
    name: "Revenue & Payments",
    description:
      "Money collected in approx. USD (EUR and PLN at static rates, admin accounts excluded): total with 7-day trend, split by credit packs vs new subscriptions vs renewals and by Stripe vs NOWPayments. Below: new paying customers, checkouts started/paid/abandoned, and the 7-day share of checkouts that got paid. Alerts when no payment came in for 7 days.",
    config: revenuePaymentsConfig,
  },
  {
    slug: "refunds-disputes",
    name: "Refunds & Disputes",
    description:
      "Refunds (USD) against revenue (USD), refund and dispute counts against paid payments, and 30-day refund rate (refund USD / revenue USD) and dispute rate (disputes / paid payments). Admin accounts excluded. Alerts on a refund rate above 15% and on every new dispute.",
    config: refundsDisputesConfig,
  },
];
