/**
 * Finance - Vibe Sense Graph Seeds
 *
 * "Finance": daily revenue by processor, net revenue vs upstream cost,
 * gross margin % trend, upstream spend per provider, provider balances.
 * Signals: margin below the floor, revenue drop, refund spike.
 * Mail + error-log alerts come from the ingest itself (deduplicated); the graph
 * actions only mark the signal in Vibe Sense.
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

import { FINANCE_CONFIG } from "./config";
import { FINANCE_SERIES_ALIAS } from "./constants";
import { FinanceMetric, ProviderFilter } from "./enum";

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const AMBER = "#ca8a04";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";
const ORANGE = "#ea580c";
const PINK = "#be185d";

/** Revenue drop: net revenue 50% below the prior 14-day average. */
const DROP_PARAMS = { window: 14, dropPct: 0.5, minBaseline: 1 };

const day = GraphResolution.ONE_DAY;

const financeConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: revenue per day ──
    stripe_revenue: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: { metric: FinanceMetric.STRIPE_REVENUE },
      pane: 0,
      color: BLUE,
    },
    nowpayments_revenue: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: { metric: FinanceMetric.NOWPAYMENTS_REVENUE },
      pane: 0,
      color: AMBER,
    },
    net_revenue: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: { metric: FinanceMetric.NET_REVENUE },
      pane: 0,
      color: GREEN,
    },
    refunds: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: { metric: FinanceMetric.REFUNDS },
      pane: 0,
      color: RED,
    },

    // ── Pane 1: upstream spend by provider ──
    spend_openrouter: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: {
        metric: FinanceMetric.PROVIDER_SPEND,
        provider: ProviderFilter.OPENROUTER,
      },
      pane: 1,
      color: PURPLE,
    },
    spend_nano_gpt: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: {
        metric: FinanceMetric.PROVIDER_SPEND,
        provider: ProviderFilter.NANO_GPT,
      },
      pane: 1,
      color: CYAN,
    },
    spend_venice: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: {
        metric: FinanceMetric.PROVIDER_SPEND,
        provider: ProviderFilter.VENICE,
      },
      pane: 1,
      color: ORANGE,
    },
    spend_total: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: { metric: FinanceMetric.UPSTREAM_COST },
      pane: 1,
      color: RED,
    },
    billed: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: { metric: FinanceMetric.INTERNAL_BILLED },
      pane: 1,
      color: GREEN,
    },

    // ── Pane 2: gross margin ──
    margin_usd: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: { metric: FinanceMetric.GROSS_MARGIN_USD },
      pane: 2,
      color: BLUE,
    },
    margin_pct: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: { metric: FinanceMetric.GROSS_MARGIN_PCT },
      pane: 3,
      color: PINK,
    },

    // ── Pane 4: provider balances remaining ──
    balance_openrouter: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: {
        metric: FinanceMetric.PROVIDER_BALANCE,
        provider: ProviderFilter.OPENROUTER,
      },
      pane: 4,
      color: PURPLE,
    },
    balance_nano_gpt: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: {
        metric: FinanceMetric.PROVIDER_BALANCE,
        provider: ProviderFilter.NANO_GPT,
      },
      pane: 4,
      color: CYAN,
    },
    balance_venice: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: day,
      params: {
        metric: FinanceMetric.PROVIDER_BALANCE,
        provider: ProviderFilter.VENICE,
      },
      pane: 4,
      color: ORANGE,
    },

    // ── Refund share feeding the spike signal ──
    refund_share: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      resolution: day,
      pane: 5,
      color: RED,
    },

    // ── Signals ──
    eval_margin_floor: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: day,
      params: {
        op: "<",
        value: FINANCE_CONFIG.thresholdDefaults.marginFloorPct,
      },
      visible: false,
    },
    eval_revenue_drop: {
      endpointPath: EVALUATOR_DROP_ALIAS,
      resolution: day,
      params: DROP_PARAMS,
      lookback: DROP_PARAMS.window,
      visible: false,
    },
    eval_refund_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: day,
      params: {
        op: ">",
        value: FINANCE_CONFIG.thresholdDefaults.refundRatePct / 100,
      },
      visible: false,
    },

    action_notify_margin: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Daily gross margin fell below the floor. Upstream cost is eating revenue. Open Finance to review provider spend and pricing.",
      },
    },
    action_notify_revenue_drop: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Net revenue dropped 50% below the 14-day average. Check Stripe and NOWPayments, checkout health and cancellations.",
      },
    },
    action_notify_refund_spike: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Refunds exceeded the allowed share of Stripe revenue today. Possible fraud or billing issue.",
      },
    },
  },

  edges: [
    { from: "refunds", to: "refund_share", toHandle: "a" },
    { from: "stripe_revenue", to: "refund_share", toHandle: "b" },

    { from: "margin_pct", to: "eval_margin_floor" },
    { from: "net_revenue", to: "eval_revenue_drop" },
    { from: "refund_share", to: "eval_refund_spike" },

    { from: "eval_margin_floor", to: "action_notify_margin" },
    { from: "eval_revenue_drop", to: "action_notify_revenue_drop" },
    { from: "eval_refund_spike", to: "action_notify_refund_spike" },
  ],

  positions: {
    stripe_revenue: { x: 0, y: 0 },
    nowpayments_revenue: { x: 0, y: 120 },
    net_revenue: { x: 0, y: 240 },
    refunds: { x: 0, y: 360 },
    spend_openrouter: { x: 0, y: 520 },
    spend_nano_gpt: { x: 0, y: 640 },
    spend_venice: { x: 0, y: 760 },
    spend_total: { x: 0, y: 880 },
    billed: { x: 0, y: 1000 },
    margin_usd: { x: 0, y: 1160 },
    margin_pct: { x: 0, y: 1280 },
    balance_openrouter: { x: 0, y: 1440 },
    balance_nano_gpt: { x: 0, y: 1560 },
    balance_venice: { x: 0, y: 1680 },
    refund_share: { x: 300, y: 360 },
    eval_margin_floor: { x: 600, y: 1280 },
    eval_revenue_drop: { x: 600, y: 240 },
    eval_refund_spike: { x: 600, y: 360 },
    action_notify_margin: { x: 900, y: 1280 },
    action_notify_revenue_drop: { x: 900, y: 240 },
    action_notify_refund_spike: { x: 900, y: 360 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "finance",
    name: "Finance",
    description:
      "Real revenue (Stripe, NOWPayments) against real upstream cost: daily revenue, spend per provider, gross margin and its trend, provider balances. Signals on margin below the floor, a revenue drop or a refund spike.",
    config: financeConfig,
  },
];
