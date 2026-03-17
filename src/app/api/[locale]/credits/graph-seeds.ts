/**
 * Credits Domain — Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the credits domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import type {
  GraphConfig,
  GraphSeedEntry,
} from "../system/unified-interface/vibe-sense/graph/types";
import { GraphResolution } from "../system/unified-interface/vibe-sense/enum";
import { CREDITS_SPENT_TOTAL_ALIAS } from "./data-sources/credits-spent-total/constants";
import { CREDITS_PURCHASED_ALIAS } from "./data-sources/credits-purchased/constants";
import { CREDITS_EXPIRED_ALIAS } from "./data-sources/credits-expired/constants";
import { CREDITS_FREE_GRANTS_ALIAS } from "./data-sources/credits-free-grants/constants";
import { CREDITS_SUBSCRIPTION_REVENUE_ALIAS } from "./data-sources/credits-subscription-revenue/constants";
import { CREDITS_EARNED_ALIAS } from "./data-sources/credits-earned/constants";
import { CREDITS_REFUNDED_ALIAS } from "./data-sources/credits-refunded/constants";
import { CREDITS_BALANCE_TOTAL_ALIAS } from "./data-sources/credits-balance-total/constants";
import { CREDITS_TRANSFER_VOLUME_ALIAS } from "./data-sources/credits-transfer-volume/constants";
import { CREDITS_SPENT_BY_USERS_ALIAS } from "./data-sources/credits-spent-by-users/constants";
import { CREDITS_SPENT_BY_LEADS_ALIAS } from "./data-sources/credits-spent-by-leads/constants";
import { CREDITS_FREE_POOL_UTILIZATION_ALIAS } from "./data-sources/credits-free-pool-utilization/constants";
import { CREDITS_TRANSACTIONS_COUNT_ALIAS } from "./data-sources/credits-transactions-count/constants";
import { CREDITS_AVG_TRANSACTION_ALIAS } from "./data-sources/credits-avg-transaction/constants";
import { CREDITS_WALLETS_TOTAL_ALIAS } from "./data-sources/credits-wallets-total/constants";
import { CREDITS_USAGE_WITH_FEATURE_ALIAS } from "./data-sources/credits-usage-with-feature/constants";
import { CREDITS_PACKS_CREATED_ALIAS } from "./data-sources/credits-packs-created/constants";
import { EMA_ALIAS } from "../analytics/indicators/ema/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { EVALUATOR_THRESHOLD_ALIAS } from "../analytics/evaluators/threshold/constants";
import { COMPLETE_TASK_ALIAS } from "../system/unified-interface/tasks/complete-task/constants";

// ─── Color palette (consistent across graphs) ──────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const ORANGE = "#ea580c";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";
const AMBER = "#ca8a04";

// ─── Credit Economy Overview ──────────────────────────────────────────────────

const creditEconomyOverviewConfig: GraphConfig = {
  nodes: {
    spent_total: {
      endpointPath: CREDITS_SPENT_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    purchased: {
      endpointPath: CREDITS_PURCHASED_ALIAS,
      pane: 0,
      color: GREEN,
    },
    expired: {
      endpointPath: CREDITS_EXPIRED_ALIAS,
      pane: 0,
      color: RED,
    },
    free_grants: {
      endpointPath: CREDITS_FREE_GRANTS_ALIAS,
      pane: 0,
      color: ORANGE,
    },
    spent_total_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: BLUE,
    },
    purchased_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: GREEN,
    },

    burn_vs_earn: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    eval_high_burn: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: ">", value: 2 },
      visible: false,
    },
    eval_no_purchases: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 1 },
      visible: false,
    },

    action_notify_high_burn: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Credit burn rate exceeded 2x purchases. Spending is outpacing revenue. Review AI cost structure immediately.",
      },
    },

    action_notify_no_purchases: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Zero credit purchases detected for 7-day EMA. Revenue has stalled. Consider win-back campaign or pricing review.",
      },
    },
  },

  edges: [
    { from: "spent_total", to: "burn_vs_earn", toHandle: "a" },
    { from: "purchased", to: "burn_vs_earn", toHandle: "b" },
    { from: "spent_total", to: "spent_total_ema7" },
    { from: "purchased", to: "purchased_ema7" },
    { from: "burn_vs_earn", to: "eval_high_burn" },
    { from: "purchased_ema7", to: "eval_no_purchases" },
    { from: "eval_high_burn", to: "action_notify_high_burn" },
    { from: "eval_no_purchases", to: "action_notify_no_purchases" },
  ],

  positions: {
    spent_total: { x: 0, y: 0 },
    purchased: { x: 0, y: 120 },
    expired: { x: 0, y: 240 },
    free_grants: { x: 0, y: 360 },
    spent_total_ema7: { x: 300, y: 0 },
    purchased_ema7: { x: 300, y: 120 },
    burn_vs_earn: { x: 300, y: 60 },
    eval_high_burn: { x: 600, y: 60 },
    eval_no_purchases: { x: 600, y: 120 },
    action_notify_high_burn: { x: 900, y: 60 },
    action_notify_no_purchases: { x: 900, y: 120 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Revenue Health ───────────────────────────────────────────────────────────

const creditRevenueHealthConfig: GraphConfig = {
  nodes: {
    purchased: {
      endpointPath: CREDITS_PURCHASED_ALIAS,
      pane: 0,
      color: GREEN,
    },
    subscription_revenue: {
      endpointPath: CREDITS_SUBSCRIPTION_REVENUE_ALIAS,
      pane: 0,
      color: BLUE,
    },
    earned: {
      endpointPath: CREDITS_EARNED_ALIAS,
      pane: 0,
      color: CYAN,
    },
    refunded: {
      endpointPath: CREDITS_REFUNDED_ALIAS,
      pane: 0,
      color: RED,
    },
    purchased_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: GREEN,
    },

    net_revenue_ratio: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },
    subscription_share: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: AMBER,
    },

    eval_purchase_drop: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 10 },
      visible: false,
    },
    eval_refund_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 0.2 },
      visible: false,
    },

    action_notify_purchase_drop: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Credit purchase volume dropped below 10/week (7-day EMA). Revenue is declining. Investigate churn and consider re-engagement actions.",
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
          "ALERT: Refund-to-purchase ratio exceeded 20% today. Possible fraud, billing issue, or product dissatisfaction. Review recent transactions.",
      },
    },
  },

  edges: [
    { from: "refunded", to: "net_revenue_ratio", toHandle: "a" },
    { from: "purchased", to: "net_revenue_ratio", toHandle: "b" },
    { from: "subscription_revenue", to: "subscription_share", toHandle: "a" },
    { from: "purchased", to: "subscription_share", toHandle: "b" },
    { from: "purchased", to: "purchased_ema7" },
    { from: "purchased_ema7", to: "eval_purchase_drop" },
    { from: "net_revenue_ratio", to: "eval_refund_spike" },
    { from: "eval_purchase_drop", to: "action_notify_purchase_drop" },
    { from: "eval_refund_spike", to: "action_notify_refund_spike" },
  ],

  positions: {
    purchased: { x: 0, y: 0 },
    subscription_revenue: { x: 0, y: 120 },
    earned: { x: 0, y: 240 },
    refunded: { x: 0, y: 360 },
    purchased_ema7: { x: 300, y: 0 },
    net_revenue_ratio: { x: 300, y: 180 },
    subscription_share: { x: 300, y: 60 },
    eval_purchase_drop: { x: 600, y: 0 },
    eval_refund_spike: { x: 600, y: 180 },
    action_notify_purchase_drop: { x: 900, y: 0 },
    action_notify_refund_spike: { x: 900, y: 180 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Free Tier vs Paid Usage ──────────────────────────────────────────────────

const creditTierUsageConfig: GraphConfig = {
  nodes: {
    spent_by_users: {
      endpointPath: CREDITS_SPENT_BY_USERS_ALIAS,
      pane: 0,
      color: BLUE,
    },
    spent_by_leads: {
      endpointPath: CREDITS_SPENT_BY_LEADS_ALIAS,
      pane: 0,
      color: ORANGE,
    },
    spent_total: {
      endpointPath: CREDITS_SPENT_TOTAL_ALIAS,
      pane: 0,
      color: GREEN,
    },
    free_grants: {
      endpointPath: CREDITS_FREE_GRANTS_ALIAS,
      pane: 0,
      color: CYAN,
    },
    free_pool_utilization: {
      endpointPath: CREDITS_FREE_POOL_UTILIZATION_ALIAS,
      pane: 1,
      color: AMBER,
    },

    user_share: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: BLUE,
    },
    lead_share: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: ORANGE,
    },

    eval_lead_dominance: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 0.6 },
      visible: false,
    },
    eval_pool_exhaustion: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 0.8 },
      visible: false,
    },
    eval_user_spend_drop: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.4 },
      visible: false,
    },

    action_notify_pool_exhaustion: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Free credit pool utilization exceeded 80%. Lead wallets are nearly depleted. Consider adjusting free tier limits or triggering re-grant cycle.",
      },
    },
  },

  edges: [
    { from: "spent_by_users", to: "user_share", toHandle: "a" },
    { from: "spent_total", to: "user_share", toHandle: "b" },
    { from: "spent_by_leads", to: "lead_share", toHandle: "a" },
    { from: "spent_total", to: "lead_share", toHandle: "b" },
    { from: "lead_share", to: "eval_lead_dominance" },
    { from: "free_pool_utilization", to: "eval_pool_exhaustion" },
    { from: "user_share", to: "eval_user_spend_drop" },
    { from: "eval_pool_exhaustion", to: "action_notify_pool_exhaustion" },
  ],

  positions: {
    spent_by_users: { x: 0, y: 0 },
    spent_by_leads: { x: 0, y: 120 },
    spent_total: { x: 0, y: 240 },
    free_grants: { x: 0, y: 360 },
    free_pool_utilization: { x: 0, y: 480 },
    user_share: { x: 300, y: 0 },
    lead_share: { x: 300, y: 120 },
    eval_lead_dominance: { x: 600, y: 120 },
    eval_pool_exhaustion: { x: 600, y: 480 },
    eval_user_spend_drop: { x: 600, y: 0 },
    action_notify_pool_exhaustion: { x: 900, y: 480 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Credit Supply Health ─────────────────────────────────────────────────────

const creditSupplyHealthConfig: GraphConfig = {
  nodes: {
    balance_total: {
      endpointPath: CREDITS_BALANCE_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    expired: {
      endpointPath: CREDITS_EXPIRED_ALIAS,
      pane: 0,
      color: RED,
    },
    free_grants: {
      endpointPath: CREDITS_FREE_GRANTS_ALIAS,
      pane: 0,
      color: ORANGE,
    },
    transfer_volume: {
      endpointPath: CREDITS_TRANSFER_VOLUME_ALIAS,
      pane: 0,
      color: CYAN,
    },
    spent_total: {
      endpointPath: CREDITS_SPENT_TOTAL_ALIAS,
      pane: 0,
      color: GREEN,
    },
    spent_total_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: GREEN,
    },

    free_grant_to_spend: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    eval_balance_drop: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: "<", value: 100 },
      visible: false,
    },
    eval_expiry_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 50 },
      visible: false,
    },
    eval_high_free_ratio: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: ">", value: 3 },
      visible: false,
    },
  },

  edges: [
    { from: "free_grants", to: "free_grant_to_spend", toHandle: "a" },
    { from: "spent_total", to: "spent_total_ema7" },
    { from: "spent_total_ema7", to: "free_grant_to_spend", toHandle: "b" },
    { from: "balance_total", to: "eval_balance_drop" },
    { from: "expired", to: "eval_expiry_spike" },
    { from: "free_grant_to_spend", to: "eval_high_free_ratio" },
  ],

  positions: {
    balance_total: { x: 0, y: 0 },
    expired: { x: 0, y: 120 },
    free_grants: { x: 0, y: 240 },
    transfer_volume: { x: 0, y: 360 },
    spent_total: { x: 0, y: 480 },
    spent_total_ema7: { x: 300, y: 480 },
    free_grant_to_spend: { x: 560, y: 300 },
    eval_balance_drop: { x: 600, y: 0 },
    eval_expiry_spike: { x: 600, y: 120 },
    eval_high_free_ratio: { x: 800, y: 300 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Credit Transaction Analytics ─────────────────────────────────────────────

const creditTransactionAnalyticsConfig: GraphConfig = {
  nodes: {
    transactions_count: {
      endpointPath: CREDITS_TRANSACTIONS_COUNT_ALIAS,
      pane: 0,
      color: BLUE,
    },
    avg_transaction: {
      endpointPath: CREDITS_AVG_TRANSACTION_ALIAS,
      pane: 0,
      color: GREEN,
    },
    wallets_total: {
      endpointPath: CREDITS_WALLETS_TOTAL_ALIAS,
      pane: 0,
      color: CYAN,
    },
    usage_with_feature: {
      endpointPath: CREDITS_USAGE_WITH_FEATURE_ALIAS,
      pane: 0,
      color: PURPLE,
    },

    transactions_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: BLUE,
    },
    avg_tx_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: GREEN,
    },

    feature_usage_share: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    eval_tx_volume_drop: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 10 },
      visible: false,
    },
    eval_avg_tx_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 1000 },
      visible: false,
    },
  },

  edges: [
    { from: "transactions_count", to: "transactions_ema7" },
    { from: "avg_transaction", to: "avg_tx_ema7" },
    { from: "usage_with_feature", to: "feature_usage_share", toHandle: "a" },
    { from: "transactions_count", to: "feature_usage_share", toHandle: "b" },
    { from: "transactions_ema7", to: "eval_tx_volume_drop" },
    { from: "avg_tx_ema7", to: "eval_avg_tx_spike" },
  ],

  positions: {
    transactions_count: { x: 0, y: 0 },
    avg_transaction: { x: 0, y: 120 },
    wallets_total: { x: 0, y: 240 },
    usage_with_feature: { x: 0, y: 360 },
    transactions_ema7: { x: 300, y: 0 },
    avg_tx_ema7: { x: 300, y: 120 },
    feature_usage_share: { x: 300, y: 360 },
    eval_tx_volume_drop: { x: 600, y: 0 },
    eval_avg_tx_spike: { x: 600, y: 120 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Pack & Supply Analytics ──────────────────────────────────────────────────

const packSupplyAnalyticsConfig: GraphConfig = {
  nodes: {
    packs_created: {
      endpointPath: CREDITS_PACKS_CREATED_ALIAS,
      pane: 0,
      color: BLUE,
    },
    purchased: {
      endpointPath: CREDITS_PURCHASED_ALIAS,
      pane: 0,
      color: GREEN,
    },
    wallets_total: {
      endpointPath: CREDITS_WALLETS_TOTAL_ALIAS,
      pane: 0,
      color: CYAN,
    },
    balance_total: {
      endpointPath: CREDITS_BALANCE_TOTAL_ALIAS,
      pane: 0,
      color: PURPLE,
    },

    packs_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: BLUE,
    },

    packs_per_wallet: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: AMBER,
    },
    purchase_per_pack: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },

    eval_no_packs: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 1 },
      visible: false,
    },
    eval_low_pack_conversion: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.1 },
      visible: false,
    },

    action_notify_no_packs: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: No new credit packs created in the past week. Pack catalog may be stale or pricing unattractive. Review pack offerings and promotion strategy.",
      },
    },
  },

  edges: [
    { from: "packs_created", to: "packs_ema7" },
    { from: "packs_created", to: "packs_per_wallet", toHandle: "a" },
    { from: "wallets_total", to: "packs_per_wallet", toHandle: "b" },
    { from: "purchased", to: "purchase_per_pack", toHandle: "a" },
    { from: "packs_created", to: "purchase_per_pack", toHandle: "b" },
    { from: "packs_ema7", to: "eval_no_packs" },
    { from: "purchase_per_pack", to: "eval_low_pack_conversion" },
    { from: "eval_no_packs", to: "action_notify_no_packs" },
  ],

  positions: {
    packs_created: { x: 0, y: 0 },
    purchased: { x: 0, y: 120 },
    wallets_total: { x: 0, y: 240 },
    balance_total: { x: 0, y: 360 },
    packs_ema7: { x: 300, y: 0 },
    packs_per_wallet: { x: 300, y: 120 },
    purchase_per_pack: { x: 300, y: 240 },
    eval_no_packs: { x: 600, y: 0 },
    eval_low_pack_conversion: { x: 600, y: 240 },
    action_notify_no_packs: { x: 900, y: 0 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "credit-economy-overview",
    name: "Credit Economy Overview",
    description:
      "Tracks total credit burn vs purchases vs expiry. Alerts when spending outpaces buying or purchases stall.",
    config: creditEconomyOverviewConfig,
  },
  {
    slug: "credit-revenue-health",
    name: "Revenue Health",
    description:
      "Tracks credit purchases, subscription revenue, refunds, and net revenue ratio. Alerts on purchase drops and refund spikes.",
    config: creditRevenueHealthConfig,
  },
  {
    slug: "credit-tier-usage",
    name: "Free vs Paid Usage",
    description:
      "Compares free lead vs paid user credit consumption. Tracks free pool utilization. Alerts on free-tier saturation and user disengagement.",
    config: creditTierUsageConfig,
  },
  {
    slug: "credit-supply-health",
    name: "Credit Supply Health",
    description:
      "Monitors total balance, expiry events, free grant volume, and transfer activity. Alerts on balance drops and expiry spikes.",
    config: creditSupplyHealthConfig,
  },
  {
    slug: "credit-transaction-analytics",
    name: "Credit Transaction Analytics",
    description:
      "Tracks transaction volume, average transaction size, wallet count, and feature-attributed usage. Alerts on volume drops and unusual transaction sizes.",
    config: creditTransactionAnalyticsConfig,
  },
  {
    slug: "pack-supply-analytics",
    name: "Pack & Supply Analytics",
    description:
      "Tracks credit pack creation velocity, packs per wallet, and purchase-per-pack conversion. Alerts when pack creation stalls or conversion drops.",
    config: packSupplyAnalyticsConfig,
  },
];
