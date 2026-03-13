/**
 * Referral Domain — Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the referral domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import type {
  GraphConfig,
  GraphSeedEntry,
} from "../system/unified-interface/vibe-sense/graph/types";
import { GraphResolution } from "../system/unified-interface/vibe-sense/enum";
import { REFERRALS_SIGNUPS_ALIAS } from "./data-sources/referrals-signups/constants";
import { REFERRALS_EARNINGS_VOLUME_ALIAS } from "./data-sources/referrals-earnings-volume/constants";
import { REFERRALS_CODES_CREATED_ALIAS } from "./data-sources/referrals-codes-created/constants";
import { REFERRALS_LEAD_CLICKS_ALIAS } from "./data-sources/referrals-lead-clicks/constants";
import { REFERRALS_PAYOUTS_ALIAS } from "./data-sources/referrals-payouts/constants";
import { EMA_ALIAS } from "../analytics/indicators/ema/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { EVALUATOR_THRESHOLD_ALIAS } from "../analytics/evaluators/threshold/constants";
import { COMPLETE_TASK_ALIAS } from "../system/unified-interface/tasks/complete-task/constants";

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
    lead_clicks: {
      endpointPath: REFERRALS_LEAD_CLICKS_ALIAS,
      pane: 0,
      color: BLUE,
    },
    signups: {
      endpointPath: REFERRALS_SIGNUPS_ALIAS,
      pane: 0,
      color: GREEN,
    },
    codes_created: {
      endpointPath: REFERRALS_CODES_CREATED_ALIAS,
      pane: 0,
      color: CYAN,
    },
    earnings: {
      endpointPath: REFERRALS_EARNINGS_VOLUME_ALIAS,
      pane: 0,
      color: AMBER,
    },
    payouts: {
      endpointPath: REFERRALS_PAYOUTS_ALIAS,
      pane: 0,
      color: ORANGE,
    },

    signups_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: GREEN,
    },

    click_to_signup: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },
    payout_to_earnings: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: ORANGE,
    },

    eval_low_conversion: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.05 },
      visible: false,
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
    { from: "signups", to: "signups_ema7" },
    { from: "signups", to: "click_to_signup", toHandle: "a" },
    { from: "lead_clicks", to: "click_to_signup", toHandle: "b" },
    { from: "payouts", to: "payout_to_earnings", toHandle: "a" },
    { from: "earnings", to: "payout_to_earnings", toHandle: "b" },
    { from: "click_to_signup", to: "eval_low_conversion" },
    { from: "signups_ema7", to: "eval_no_referrals" },
    { from: "eval_no_referrals", to: "action_notify_dead_referral" },
  ],

  positions: {
    lead_clicks: { x: 0, y: 0 },
    signups: { x: 0, y: 120 },
    codes_created: { x: 0, y: 240 },
    earnings: { x: 0, y: 360 },
    payouts: { x: 0, y: 480 },
    signups_ema7: { x: 300, y: 120 },
    click_to_signup: { x: 300, y: 60 },
    payout_to_earnings: { x: 300, y: 420 },
    eval_low_conversion: { x: 600, y: 60 },
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
      "Tracks referral click-to-signup conversion, earnings volume, payout ratios, and code creation. Alerts when the referral funnel stalls.",
    config: referralProgramHealthConfig,
  },
];
