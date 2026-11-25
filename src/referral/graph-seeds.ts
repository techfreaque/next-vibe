/**
 * Referral Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the referral domain.
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
import { REFERRALS_CODES_CREATED_ALIAS } from "./data-sources/referrals-codes-created/constants";
import { REFERRALS_CONVERSION_RATE_ALIAS } from "./data-sources/referrals-conversion-rate/constants";
import { REFERRALS_EARNINGS_VOLUME_ALIAS } from "./data-sources/referrals-earnings-volume/constants";
import { REFERRALS_LEAD_CLICKS_ALIAS } from "./data-sources/referrals-lead-clicks/constants";
import { REFERRALS_PAYOUTS_ALIAS } from "./data-sources/referrals-payouts/constants";
import { REFERRALS_SIGNUPS_ALIAS } from "./data-sources/referrals-signups/constants";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const ORANGE = "#ea580c";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";
const AMBER = "#ca8a04";

// ─── Referral Program Health ────────────────────────────────────────────────

const referralProgramHealthConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: counts per day ──
    referral_link_visits: {
      endpointPath: REFERRALS_LEAD_CLICKS_ALIAS,
      pane: 0,
      color: BLUE,
    },
    referral_signups: {
      endpointPath: REFERRALS_SIGNUPS_ALIAS,
      pane: 0,
      color: GREEN,
    },
    codes_created: {
      endpointPath: REFERRALS_CODES_CREATED_ALIAS,
      pane: 0,
      color: CYAN,
    },
    payout_requests: {
      endpointPath: REFERRALS_PAYOUTS_ALIAS,
      pane: 0,
      color: ORANGE,
    },
    referral_signups_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: GREEN,
    },

    // ── Pane 1: % of first referral visits (by visit day) that signed up ──
    visit_to_signup_pct: {
      endpointPath: REFERRALS_CONVERSION_RATE_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    // ── Pane 2: commissions earned, USD ──
    commissions_usd: {
      endpointPath: REFERRALS_EARNINGS_VOLUME_ALIAS,
      pane: 2,
      color: AMBER,
    },

    eval_no_referrals: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 1 },
      visible: false,
    },

    action_notify_dead_referral: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Zero referral signups for the past week. Referral program is inactive. Consider increasing incentives or promoting referral codes.",
      },
    },
  },

  edges: [
    { from: "referral_signups", to: "referral_signups_ema7" },
    { from: "referral_signups", to: "eval_no_referrals" },
    { from: "eval_no_referrals", to: "action_notify_dead_referral" },
  ],

  positions: {
    referral_link_visits: { x: 0, y: 0 },
    referral_signups: { x: 0, y: 120 },
    codes_created: { x: 0, y: 240 },
    payout_requests: { x: 0, y: 360 },
    visit_to_signup_pct: { x: 0, y: 480 },
    commissions_usd: { x: 0, y: 600 },
    referral_signups_ema7: { x: 300, y: 120 },
    eval_no_referrals: { x: 600, y: 120 },
    action_notify_dead_referral: { x: 900, y: 120 },
  },

  trigger: { type: "cron", schedule: "0 0 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "referral-program-health",
    name: "Referral Program Health",
    description:
      "Referral and creator links per day: visits on a referral link, signups credited to a code, codes created and payout requests; the share of first referral visits that signed up (by visit day, recent days still filling in); commissions earned in USD. Alerts after a week with no referral signup.",
    config: referralProgramHealthConfig,
  },
];
