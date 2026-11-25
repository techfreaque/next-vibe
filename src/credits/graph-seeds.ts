/**
 * Credits Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the credits domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import { GraphResolution } from "next-vibe/dataflow/enum";
import type {
  GraphConfig,
  GraphSeedEntry,
} from "next-vibe/dataflow/graph/types";
import { COMPLETE_TASK_ALIAS } from "next-vibe/execute-tool/complete/constants";

import { EVALUATOR_THRESHOLD_ALIAS } from "../analytics/evaluators/threshold/constants";
import { EMA_ALIAS } from "../analytics/indicators/ema/constants";
import { WINDOW_SUM_ALIAS } from "../analytics/indicators/window-sum/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { FINANCE_SERIES_ALIAS } from "../finance/constants";
import { FinanceMetric } from "../finance/enum";
import { PAYMENTS_REVENUE_ALIAS } from "../payment/data-sources/payments-revenue/constants";
import {
  RevenueSeriesKind,
  type RevenueSeriesKindValue,
} from "../payment/data-sources/payments-revenue/enum";
import { CREDITS_BALANCE_TOTAL_ALIAS } from "./data-sources/credits-balance-total/constants";
import { CREDITS_EARNED_ALIAS } from "./data-sources/credits-earned/constants";
import { CREDITS_EXPIRED_ALIAS } from "./data-sources/credits-expired/constants";
import { CREDITS_FARMING_BLOCKED_ALIAS } from "./data-sources/credits-farming-blocked/constants";
import { CREDITS_FREE_GRANTS_ALIAS } from "./data-sources/credits-free-grants/constants";
import { CREDITS_FREE_POOL_UTILIZATION_ALIAS } from "./data-sources/credits-free-pool-utilization/constants";
import { CREDITS_FREE_TIER_SPEND_ALIAS } from "./data-sources/credits-free-tier-spend/constants";
import { CREDITS_PURCHASED_ALIAS } from "./data-sources/credits-purchased/constants";
import {
  CreditIssueKind,
  type CreditIssueKindValue,
} from "./data-sources/credits-purchased/enum";
import { CREDITS_SPENT_BY_MODEL_ALIAS } from "./data-sources/credits-spent-by-model/constants";
import {
  ModelSpendGroup,
  type ModelSpendGroupValue,
} from "./data-sources/credits-spent-by-model/enum";
import { CREDITS_SPENT_BY_SOURCE_ALIAS } from "./data-sources/credits-spent-by-source/constants";
import type { UsageSourceValue } from "./data-sources/credits-spent-by-source/enum";
import { UsageSource } from "./data-sources/credits-spent-by-source/enum";
import { CREDITS_SPENT_TOTAL_ALIAS } from "./data-sources/credits-spent-total/constants";

// ─── Color palette (consistent across graphs) ──────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const ORANGE = "#ea580c";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";
const AMBER = "#ca8a04";
const SLATE = "#64748b";
const PINK = "#db2777";
const TEAL = "#0d9488";

// ─── Credit Economy Overview ──────────────────────────────────────────────────
// Credits in vs credits out, in CREDITS (money: Revenue Health / Finance).
// Free allowance grants live in Free vs Paid Usage (they dwarf this scale).

const creditIssued = (
  kind: typeof CreditIssueKindValue,
  color: string,
): GraphConfig["nodes"][string] => ({
  endpointPath: CREDITS_PURCHASED_ALIAS,
  params: { kind },
  pane: 0,
  color,
  scale: "right",
});

const creditEconomyOverviewConfig: GraphConfig = {
  nodes: {
    // Pane 0 = credit flows per bucket (credits)
    pack_credits_sold: creditIssued(CreditIssueKind.PACKS, GREEN),
    subscription_credits_issued: creditIssued(
      CreditIssueKind.SUBSCRIPTIONS,
      BLUE,
    ),
    gifted_credits_admin: creditIssued(CreditIssueKind.GIFTED, PURPLE),
    referral_credits_earned: {
      endpointPath: CREDITS_EARNED_ALIAS,
      pane: 0,
      color: CYAN,
      scale: "right",
    },
    credits_spent_all: {
      endpointPath: CREDITS_SPENT_TOTAL_ALIAS,
      pane: 0,
      color: RED,
      scale: "right",
    },
    credits_spent_all_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: ORANGE,
      scale: "right",
    },
    credits_expired: {
      endpointPath: CREDITS_EXPIRED_ALIAS,
      pane: 0,
      color: SLATE,
      scale: "right",
    },

    // Pane 1 = stock: unspent credits in user wallets (credits)
    outstanding_user_credits: {
      endpointPath: CREDITS_BALANCE_TOTAL_ALIAS,
      pane: 1,
      color: AMBER,
      scale: "right",
    },

    // Alert input: paid credits (packs + subscriptions) per week
    paid_credits_issued: {
      endpointPath: CREDITS_PURCHASED_ALIAS,
      params: { kind: CreditIssueKind.PAID },
      visible: false,
    },
    eval_no_paid_credits: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 1 },
      visible: false,
    },
    action_notify_no_paid_credits: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: No paid credits issued this week (no pack sold, no subscription credited). Check checkout health and subscription renewals.",
      },
    },
  },

  edges: [
    { from: "credits_spent_all", to: "credits_spent_all_ema7" },
    { from: "paid_credits_issued", to: "eval_no_paid_credits" },
    { from: "eval_no_paid_credits", to: "action_notify_no_paid_credits" },
  ],

  positions: {
    pack_credits_sold: { x: 0, y: 0 },
    subscription_credits_issued: { x: 0, y: 120 },
    gifted_credits_admin: { x: 0, y: 240 },
    referral_credits_earned: { x: 0, y: 360 },
    credits_spent_all: { x: 0, y: 480 },
    credits_expired: { x: 0, y: 600 },
    outstanding_user_credits: { x: 0, y: 720 },
    paid_credits_issued: { x: 0, y: 840 },
    credits_spent_all_ema7: { x: 300, y: 480 },
    eval_no_paid_credits: { x: 300, y: 840 },
    action_notify_no_paid_credits: { x: 600, y: 840 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Revenue Health ───────────────────────────────────────────────────────────
// Money view of the credit economy, in USD: what was sold (by product) vs what
// paid credits earned when consumed. Cash by processor, refunds, provider cost
// and margins: Finance. Totals, payment counts, failures: Revenue & Payments.

const salesUsd = (
  kind: typeof RevenueSeriesKindValue,
  pane: number,
  color: string,
  visible = true,
): GraphConfig["nodes"][string] => ({
  endpointPath: PAYMENTS_REVENUE_ALIAS,
  params: { kind },
  pane,
  color,
  scale: "right",
  visible,
});

const sum30 = (color: string, pane: number): GraphConfig["nodes"][string] => ({
  endpointPath: WINDOW_SUM_ALIAS,
  params: { size: 30 },
  pane,
  color,
  scale: "right",
});

const creditRevenueHealthConfig: GraphConfig = {
  nodes: {
    // Pane 0 = USD per day
    subscription_sales_usd: salesUsd(RevenueSeriesKind.SUBSCRIPTION, 0, BLUE),
    pack_sales_usd: salesUsd(RevenueSeriesKind.PACK, 0, GREEN),
    paid_credit_earnings_usd: {
      endpointPath: FINANCE_SERIES_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { metric: FinanceMetric.EARNED },
      pane: 0,
      color: AMBER,
      scale: "right",
    },
    all_sales_usd: salesUsd(RevenueSeriesKind.ALL, 0, SLATE, false),

    // Pane 1 = USD, trailing 30 days (no single-day noise)
    sales_usd_30d: sum30(GREEN, 1),
    paid_credit_earnings_usd_30d: sum30(AMBER, 1),
    subscription_sales_usd_30d: sum30(BLUE, 1),

    // Pane 2 = shares over the trailing 30 days (0..1, >1 = earning down prepaid balances)
    recurring_share_30d: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 2,
      color: BLUE,
      scale: "right",
    },
    earnings_to_sales_30d: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 2,
      color: AMBER,
      scale: "right",
    },
  },

  edges: [
    { from: "all_sales_usd", to: "sales_usd_30d" },
    { from: "paid_credit_earnings_usd", to: "paid_credit_earnings_usd_30d" },
    { from: "subscription_sales_usd", to: "subscription_sales_usd_30d" },
    {
      from: "subscription_sales_usd_30d",
      to: "recurring_share_30d",
      toHandle: "a",
    },
    { from: "sales_usd_30d", to: "recurring_share_30d", toHandle: "b" },
    {
      from: "paid_credit_earnings_usd_30d",
      to: "earnings_to_sales_30d",
      toHandle: "a",
    },
    { from: "sales_usd_30d", to: "earnings_to_sales_30d", toHandle: "b" },
  ],

  positions: {
    subscription_sales_usd: { x: 0, y: 0 },
    pack_sales_usd: { x: 0, y: 120 },
    paid_credit_earnings_usd: { x: 0, y: 240 },
    all_sales_usd: { x: 0, y: 360 },
    subscription_sales_usd_30d: { x: 300, y: 0 },
    paid_credit_earnings_usd_30d: { x: 300, y: 240 },
    sales_usd_30d: { x: 300, y: 360 },
    recurring_share_30d: { x: 600, y: 120 },
    earnings_to_sales_30d: { x: 600, y: 300 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Free Tier vs Paid Usage ──────────────────────────────────────────────────

/** One pane-0 node per usage source; the sources add up to all_spend_total. */
const spendBySource = (
  source: typeof UsageSourceValue,
  color: string,
): GraphConfig["nodes"][string] => ({
  endpointPath: CREDITS_SPENT_BY_SOURCE_ALIAS,
  params: { source },
  pane: 0,
  color,
});

const creditTierUsageConfig: GraphConfig = {
  nodes: {
    // Pane 0 = ALL spend split by who spent it and which credits paid
    spend_public: spendBySource(UsageSource.PUBLIC, ORANGE),
    spend_users_free: spendBySource(UsageSource.USERS_FREE, CYAN),
    spend_paid: spendBySource(UsageSource.PAID, BLUE),
    spend_gifted: spendBySource(UsageSource.GIFTED, PURPLE),
    spend_internal: spendBySource(UsageSource.INTERNAL, AMBER),
    spend_unattributed: spendBySource(UsageSource.UNATTRIBUTED, SLATE),
    all_spend_total: {
      endpointPath: CREDITS_SPENT_TOTAL_ALIAS,
      pane: 0,
      color: GREEN,
    },
    // Pane 1 = free-tier only (same axis as the public daily cap, local-midnight days)
    free_tier_spend_cap_axis: {
      endpointPath: CREDITS_FREE_TIER_SPEND_ALIAS,
      pane: 1,
      color: RED,
    },
    free_grants_issued: {
      endpointPath: CREDITS_FREE_GRANTS_ALIAS,
      pane: 1,
      color: CYAN,
    },
    // Pane 2 = free allowance used month-to-date (0..1)
    free_allowance_used_mtd: {
      endpointPath: CREDITS_FREE_POOL_UTILIZATION_ALIAS,
      pane: 2,
      color: AMBER,
    },

    // Pane 3 = share of all spend
    paid_share: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 3,
      color: BLUE,
    },
    public_share: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 3,
      color: ORANGE,
    },

    eval_public_dominance: {
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
    eval_paid_share_drop: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.1 },
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
    { from: "spend_paid", to: "paid_share", toHandle: "a" },
    { from: "all_spend_total", to: "paid_share", toHandle: "b" },
    { from: "spend_public", to: "public_share", toHandle: "a" },
    { from: "all_spend_total", to: "public_share", toHandle: "b" },
    { from: "public_share", to: "eval_public_dominance" },
    { from: "free_allowance_used_mtd", to: "eval_pool_exhaustion" },
    { from: "paid_share", to: "eval_paid_share_drop" },
    { from: "eval_pool_exhaustion", to: "action_notify_pool_exhaustion" },
  ],

  positions: {
    spend_public: { x: 0, y: 0 },
    spend_users_free: { x: 0, y: 120 },
    spend_paid: { x: 0, y: 240 },
    spend_gifted: { x: 0, y: 360 },
    spend_internal: { x: 0, y: 480 },
    spend_unattributed: { x: 0, y: 600 },
    all_spend_total: { x: 0, y: 720 },
    free_tier_spend_cap_axis: { x: 0, y: 840 },
    free_grants_issued: { x: 0, y: 960 },
    free_allowance_used_mtd: { x: 0, y: 1080 },
    paid_share: { x: 300, y: 240 },
    public_share: { x: 300, y: 0 },
    eval_public_dominance: { x: 600, y: 0 },
    eval_paid_share_drop: { x: 600, y: 240 },
    eval_pool_exhaustion: { x: 600, y: 1080 },
    action_notify_pool_exhaustion: { x: 900, y: 1080 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── AI Spend by Model ────────────────────────────────────────────────────────
// Where credits go, by model family. Credits, every spender (groups add up to
// all spend). Provider cost and margin per provider: Finance.

const spendByModel = (
  group: typeof ModelSpendGroupValue,
  pane: number,
  color: string,
): GraphConfig["nodes"][string] => ({
  endpointPath: CREDITS_SPENT_BY_MODEL_ALIAS,
  params: { group },
  pane,
  color,
  scale: "right",
});

const MODEL_SPEND_NODES: ReadonlyArray<
  [string, typeof ModelSpendGroupValue, number, string]
> = [
  // Pane 0 = chat models by maker
  ["chat_uncensored_lm", ModelSpendGroup.UNCENSORED_AI, 0, RED],
  ["chat_glm_zai", ModelSpendGroup.ZAI, 0, BLUE],
  ["chat_kimi_moonshot", ModelSpendGroup.MOONSHOT, 0, GREEN],
  ["chat_deepseek", ModelSpendGroup.DEEPSEEK, 0, CYAN],
  ["chat_venice", ModelSpendGroup.VENICE, 0, ORANGE],
  ["chat_grok_xai", ModelSpendGroup.XAI, 0, SLATE],
  ["chat_claude_anthropic", ModelSpendGroup.ANTHROPIC, 0, AMBER],
  ["chat_gpt_openai", ModelSpendGroup.OPENAI, 0, PURPLE],
  ["chat_gemini_google", ModelSpendGroup.GOOGLE, 0, PINK],
  ["chat_other", ModelSpendGroup.OTHER_CHAT, 0, TEAL],
  // Pane 1 = media, voice and tools
  ["image_generation", ModelSpendGroup.IMAGE, 1, PURPLE],
  ["video_generation", ModelSpendGroup.VIDEO, 1, RED],
  ["music_generation", ModelSpendGroup.MUSIC, 1, GREEN],
  ["voice_tts_stt", ModelSpendGroup.VOICE, 1, CYAN],
  ["tools_search_fetch_memory", ModelSpendGroup.TOOLS, 1, AMBER],
  ["unattributed", ModelSpendGroup.UNATTRIBUTED, 1, SLATE],
];

const aiSpendByModelConfig: GraphConfig = {
  nodes: Object.fromEntries(
    MODEL_SPEND_NODES.map(([id, group, pane, color]) => [
      id,
      spendByModel(group, pane, color),
    ]),
  ),
  edges: [],
  positions: Object.fromEntries(
    MODEL_SPEND_NODES.map(([id], index) => [id, { x: 0, y: index * 120 }]),
  ),
  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Free Credit Farming ─────────────────────────────────────────────────────

const freeCreditFarmingConfig: GraphConfig = {
  nodes: {
    farming_blocked: {
      endpointPath: CREDITS_FARMING_BLOCKED_ALIAS,
      pane: 0,
      color: RED,
    },
    farming_blocked_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: AMBER,
    },

    eval_farming_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 25 },
      visible: false,
    },

    action_notify_farming_spike: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: More than 25 free-credit farming attempts blocked today. Someone is farming. Run anti-farming-report to see the subnets and email domains behind it.",
      },
    },
  },

  edges: [
    { from: "farming_blocked", to: "farming_blocked_ema7" },
    { from: "farming_blocked", to: "eval_farming_spike" },
    { from: "eval_farming_spike", to: "action_notify_farming_spike" },
  ],

  positions: {
    farming_blocked: { x: 0, y: 0 },
    farming_blocked_ema7: { x: 300, y: 120 },
    eval_farming_spike: { x: 300, y: 0 },
    action_notify_farming_spike: { x: 600, y: 0 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "credit-economy-overview",
    name: "Credit Economy",
    description:
      "Credits in vs credits out, in credits (not money). Pane 0: pack credits sold, subscription credits issued, gifted admin credits, referral credits earned, all credits spent (+7-day EMA), credits expired. Pane 1: unspent credits in signed-in user wallets. Alerts when a week passes without paid credits. Free allowance grants: Free vs Paid Usage.",
    config: creditEconomyOverviewConfig,
  },
  {
    slug: "credit-revenue-health",
    name: "Revenue Health",
    description:
      "Money side of the credit economy, in USD (approx., static FX; admin accounts excluded). Pane 0: subscription and pack sales per day, and what paid credits earned when consumed. Pane 1: the same over a trailing 30 days. Pane 2: recurring share of sales and earnings-to-sales ratio over 30 days. Cash by processor, refunds, provider cost and margins: Finance. Payment counts and failures: Revenue & Payments.",
    config: creditRevenueHealthConfig,
  },
  {
    slug: "credit-tier-usage",
    name: "Free vs Paid Usage",
    description:
      "Pane 0: ALL spend split by source of the credits spent: public (guests on the free allowance), users free (signed-in free credits + referral credits), paid (subscription + purchased packs), gifted (admin grants: testers, creators, goodwill), internal (admin accounts), unattributed (historic pack debits with no derivable bucket); the sources add up to all spend. Pane 1: free-tier spend (mirrors the public cap, server-local midnight days) and free grants issued. Pane 2: free allowance used month-to-date (0-1). Pane 3: paid and public share of all spend. Alerts on free-tier saturation.",
    config: creditTierUsageConfig,
  },
  {
    slug: "ai-spend-by-model",
    name: "AI Spend by Model",
    description:
      "Credits spent per day by model family, every spender included so the groups add up to all spend. Pane 0: chat models by maker (Uncensored LM, GLM, Kimi, DeepSeek, Venice, Grok, Claude, GPT, Gemini, other). Pane 1: image, video, music, voice, tools (search, fetch, memory), unattributed. In credits; provider cost and margin per provider: Finance.",
    config: aiSpendByModelConfig,
  },
  {
    slug: "free-credit-farming",
    name: "Free Credit Farming",
    description:
      "Blocked free-credit farming attempts per day (subnet budget full, duplicate or disposable email) with a 7-day EMA. Alerts when more than 25 attempts are blocked in a day.",
    config: freeCreditFarmingConfig,
  },
];
