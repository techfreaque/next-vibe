/**
 * Finance - Vibe Sense Graph Seeds
 *
 * "Finance": cash flow (Stripe, NOWPayments, refunds) kept apart from the
 * AI economics: provider cost per registry provider from our own usage
 * records (parts add up to the total), credits consumed and what they earned
 * at their real paid price, AI margin and paid usage margin, end-of-day
 * provider balances. Signals: paid usage margin below the floor, cash drop,
 * refund spike.
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
import {
  COST_PROVIDER_KEYS,
  costProviderNodeSuffix,
  UNATTRIBUTED_PROVIDER,
} from "./cost-providers";
import {
  FinanceMetric,
  ProviderFilter,
  type ProviderFilterValue,
} from "./enum";

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const AMBER = "#ca8a04";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";
const ORANGE = "#ea580c";
const PINK = "#be185d";
const SLATE = "#64748b";
const TEAL = "#0d9488";
const LIME = "#65a30d";
const INDIGO = "#4f46e5";

/** Cycled for per-provider series so each provider keeps one color. */
const PROVIDER_COLORS = [
  PURPLE,
  CYAN,
  ORANGE,
  TEAL,
  PINK,
  AMBER,
  LIME,
  INDIGO,
  BLUE,
  GREEN,
];

/** Revenue drop: net cash 50% below the prior 14-day average. */
const DROP_PARAMS = { window: 14, dropPct: 0.5, minBaseline: 1 };

const day = GraphResolution.ONE_DAY;

const PANE = {
  cash: 0,
  cost: 1,
  consumption: 2,
  marginUsd: 3,
  marginPct: 4,
  balanceUsd: 5,
  balanceCredits: 6,
  reconcile: 7,
  refundShare: 8,
} as const;

/** Providers whose balance is reported in their own credits, not dollars. */
const CREDIT_BALANCE_FILTERS: readonly (typeof ProviderFilterValue)[] = [
  ProviderFilter.GAB,
  ProviderFilter.FREEDOM_GPT,
  ProviderFilter.UNCENSORED_AI,
];
/** Providers with a USD balance reading (uncensored.ai reports both). */
const USD_BALANCE_FILTERS: readonly (typeof ProviderFilterValue)[] = [
  ProviderFilter.OPENROUTER,
  ProviderFilter.NANO_GPT,
  ProviderFilter.VENICE,
  ProviderFilter.UNCENSORED_AI,
  ProviderFilter.MODELSLAB,
  ProviderFilter.EDEN_AI,
];

const filterKey = (filter: typeof ProviderFilterValue): string =>
  (
    Object.entries(ProviderFilter).find(([, v]) => v === filter)?.[0] ?? "x"
  ).toLowerCase();

const nodes: GraphConfig["nodes"] = {
  // ── Pane 0: CASH FLOW (money received; lumpy by nature, never netted
  // against daily provider cost) ──
  cash_in_stripe: {
    endpointPath: FINANCE_SERIES_ALIAS,
    resolution: day,
    params: { metric: FinanceMetric.STRIPE_REVENUE },
    pane: PANE.cash,
    color: BLUE,
  },
  cash_in_nowpayments: {
    endpointPath: FINANCE_SERIES_ALIAS,
    resolution: day,
    params: { metric: FinanceMetric.NOWPAYMENTS_REVENUE },
    pane: PANE.cash,
    color: AMBER,
  },
  cash_net_after_refunds: {
    endpointPath: FINANCE_SERIES_ALIAS,
    resolution: day,
    params: { metric: FinanceMetric.NET_REVENUE },
    pane: PANE.cash,
    color: GREEN,
  },
  cash_refunded: {
    endpointPath: FINANCE_SERIES_ALIAS,
    resolution: day,
    params: { metric: FinanceMetric.REFUNDS },
    pane: PANE.cash,
    color: RED,
  },
};

// ── Pane 1: provider cost from our own usage records, one series per
// registry provider + unattributed; the parts add up to cost_total ──
COST_PROVIDER_KEYS.forEach((key, i) => {
  nodes[`cost_${costProviderNodeSuffix(key)}`] = {
    endpointPath: FINANCE_SERIES_ALIAS,
    resolution: day,
    params: { metric: FinanceMetric.PROVIDER_COST, costProvider: key },
    pane: PANE.cost,
    color:
      key === UNATTRIBUTED_PROVIDER
        ? SLATE
        : (PROVIDER_COLORS[i % PROVIDER_COLORS.length] ?? SLATE),
  };
});
nodes.cost_total = {
  endpointPath: FINANCE_SERIES_ALIAS,
  resolution: day,
  params: { metric: FinanceMetric.COST_TOTAL },
  pane: PANE.cost,
  color: RED,
};

// ── Pane 2: what was consumed, and what it earned ──
nodes.consumed_at_list_price = {
  endpointPath: FINANCE_SERIES_ALIAS,
  resolution: day,
  params: { metric: FinanceMetric.CONSUMED_LIST },
  pane: PANE.consumption,
  color: SLATE,
};
nodes.earned_from_paid_credits = {
  endpointPath: FINANCE_SERIES_ALIAS,
  resolution: day,
  params: { metric: FinanceMetric.EARNED },
  pane: PANE.consumption,
  color: GREEN,
};
nodes.free_credits_at_list_price = {
  endpointPath: FINANCE_SERIES_ALIAS,
  resolution: day,
  params: { metric: FinanceMetric.FREE_LIST },
  pane: PANE.consumption,
  color: AMBER,
};

// ── Panes 3-4: AI margin = earned - provider cost (all usage, incl. free
// and flat plans); paid usage margin = earned - cost of paid usage ──
nodes.ai_margin_usd = {
  endpointPath: FINANCE_SERIES_ALIAS,
  resolution: day,
  params: { metric: FinanceMetric.AI_MARGIN_USD },
  pane: PANE.marginUsd,
  color: BLUE,
};
nodes.paid_usage_margin_usd = {
  endpointPath: FINANCE_SERIES_ALIAS,
  resolution: day,
  params: { metric: FinanceMetric.PAID_MARGIN_USD },
  pane: PANE.marginUsd,
  color: GREEN,
};
nodes.ai_margin_pct = {
  endpointPath: FINANCE_SERIES_ALIAS,
  resolution: day,
  params: { metric: FinanceMetric.AI_MARGIN_PCT },
  pane: PANE.marginPct,
  color: PINK,
};
nodes.paid_usage_margin_pct = {
  endpointPath: FINANCE_SERIES_ALIAS,
  resolution: day,
  params: { metric: FinanceMetric.PAID_MARGIN_PCT },
  pane: PANE.marginPct,
  color: TEAL,
};

// ── Panes 5-6: balance at the end of each day ──
USD_BALANCE_FILTERS.forEach((filter, i) => {
  nodes[`balance_usd_${filterKey(filter)}`] = {
    endpointPath: FINANCE_SERIES_ALIAS,
    resolution: day,
    params: { metric: FinanceMetric.PROVIDER_BALANCE, provider: filter },
    pane: PANE.balanceUsd,
    color: PROVIDER_COLORS[i % PROVIDER_COLORS.length] ?? SLATE,
  };
});
CREDIT_BALANCE_FILTERS.forEach((filter, i) => {
  nodes[`balance_credits_${filterKey(filter)}`] = {
    endpointPath: FINANCE_SERIES_ALIAS,
    resolution: day,
    params: {
      metric: FinanceMetric.PROVIDER_BALANCE_NATIVE,
      provider: filter,
    },
    pane: PANE.balanceCredits,
    color: PROVIDER_COLORS[(i + 3) % PROVIDER_COLORS.length] ?? SLATE,
  };
});

// ── Pane 7: reconciliation, spend the providers' own balance readings show
// (OpenRouter, NanoGPT, Venice, uncensored.ai, FreedomGPT, Gab plan) ──
nodes.provider_reported_spend = {
  endpointPath: FINANCE_SERIES_ALIAS,
  resolution: day,
  params: { metric: FinanceMetric.UPSTREAM_COST },
  pane: PANE.reconcile,
  color: SLATE,
};

Object.assign(nodes, {
  // ── Refund share feeding the spike signal ──
  refund_share: {
    endpointPath: TRANSFORMER_RATIO_ALIAS,
    resolution: day,
    pane: PANE.refundShare,
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
        "ALERT: Paid usage margin fell below the floor: provider cost of paid credits is eating what users paid for them. Open Finance to review provider cost and pricing.",
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
        "ALERT: Net cash in dropped 50% below the 14-day average. Check Stripe and NOWPayments, checkout health and cancellations.",
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
} satisfies GraphConfig["nodes"]);

const positions: GraphConfig["positions"] = {};
Object.keys(nodes).forEach((key, i) => {
  positions[key] = key.startsWith("eval_")
    ? { x: 600, y: i * 120 }
    : key.startsWith("action_")
      ? { x: 900, y: i * 120 }
      : key === "refund_share"
        ? { x: 300, y: i * 120 }
        : { x: 0, y: i * 120 };
});

const financeConfig: GraphConfig = {
  nodes,
  edges: [
    { from: "cash_refunded", to: "refund_share", toHandle: "a" },
    { from: "cash_in_stripe", to: "refund_share", toHandle: "b" },

    { from: "paid_usage_margin_pct", to: "eval_margin_floor" },
    { from: "cash_net_after_refunds", to: "eval_revenue_drop" },
    { from: "refund_share", to: "eval_refund_spike" },

    { from: "eval_margin_floor", to: "action_notify_margin" },
    { from: "eval_revenue_drop", to: "action_notify_revenue_drop" },
    { from: "eval_refund_spike", to: "action_notify_refund_spike" },
  ],

  positions,

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "finance",
    name: "Finance",
    description:
      "Cash flow (Stripe, NOWPayments, refunds) separate from AI economics: provider cost per provider from our own usage records, credits consumed and what they earned at their real paid price, AI margin and paid usage margin, end-of-day provider balances. Signals on paid usage margin below the floor, a cash drop or a refund spike.",
    config: financeConfig,
  },
];
