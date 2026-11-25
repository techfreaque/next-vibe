/**
 * Users Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the users domain.
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
import { WINDOW_AVG_ALIAS } from "../analytics/indicators/window-avg/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { USERS_ACTIVE_TOTAL_ALIAS } from "./data-sources/users-active-total/constants";
import { USERS_BANNED_ALIAS } from "./data-sources/users-banned/constants";
import { USERS_EMAIL_VERIFIED_ALIAS } from "./data-sources/users-email-verified/constants";
import { USERS_LOGIN_ATTEMPTS_FAILED_ALIAS } from "./data-sources/users-login-attempts-failed/constants";
import { USERS_LOGIN_ATTEMPTS_TOTAL_ALIAS } from "./data-sources/users-login-attempts-total/constants";
import { USERS_MARKETING_CONSENT_ALIAS } from "./data-sources/users-marketing-consent/constants";
import { USERS_REGISTERED_ALIAS } from "./data-sources/users-registered/constants";
import { USERS_TWO_FA_ENABLED_ALIAS } from "./data-sources/users-two-fa-enabled/constants";
import { USERS_WITH_STRIPE_ALIAS } from "./data-sources/users-with-stripe/constants";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const ORANGE = "#ea580c";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";
const AMBER = "#ca8a04";

// ─── User Growth ──────────────────────────────────────────────────────────────

const userGrowthConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: signups per day ──
    signups: {
      endpointPath: USERS_REGISTERED_ALIAS,
      pane: 0,
      color: BLUE,
    },
    signups_email_confirmed: {
      endpointPath: USERS_REGISTERED_ALIAS,
      params: { emailConfirmedOnly: true },
      pane: 0,
      color: GREEN,
    },
    signups_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: CYAN,
    },

    // ── Pane 1: total accounts that can sign in ──
    accounts_active: {
      endpointPath: USERS_ACTIVE_TOTAL_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    // ── Pane 2: share of each signup day that confirmed its email ──
    email_confirmed_share: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 2,
      color: GREEN,
    },

    eval_slow_growth: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 5 },
      visible: false,
    },
    eval_low_email_confirm: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.8 },
      visible: false,
    },
  },

  edges: [
    { from: "signups", to: "signups_ema7" },
    {
      from: "signups_email_confirmed",
      to: "email_confirmed_share",
      toHandle: "a",
    },
    { from: "signups", to: "email_confirmed_share", toHandle: "b" },
    { from: "signups_ema7", to: "eval_slow_growth" },
    { from: "email_confirmed_share", to: "eval_low_email_confirm" },
  ],

  positions: {
    signups: { x: 0, y: 0 },
    signups_email_confirmed: { x: 0, y: 120 },
    accounts_active: { x: 0, y: 240 },
    signups_ema7: { x: 300, y: 0 },
    email_confirmed_share: { x: 300, y: 120 },
    eval_slow_growth: { x: 600, y: 0 },
    eval_low_email_confirm: { x: 600, y: 120 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── User Quality & Trust ─────────────────────────────────────────────────────

/** Cumulative account base: every series counts accounts created up to the bar. */
const userQualityTrustConfig: GraphConfig = {
  nodes: {
    accounts_active: {
      endpointPath: USERS_ACTIVE_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    accounts_email_confirmed: {
      endpointPath: USERS_EMAIL_VERIFIED_ALIAS,
      pane: 0,
      color: GREEN,
    },
    accounts_marketing_opt_in: {
      endpointPath: USERS_MARKETING_CONSENT_ALIAS,
      pane: 0,
      color: CYAN,
    },
    accounts_with_stripe_customer: {
      endpointPath: USERS_WITH_STRIPE_ALIAS,
      pane: 0,
      color: ORANGE,
    },
    accounts_2fa: {
      endpointPath: USERS_TWO_FA_ENABLED_ALIAS,
      pane: 0,
      color: AMBER,
    },

    email_confirmed_share: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },
    marketing_opt_in_share: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: CYAN,
    },
    stripe_customer_share: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: ORANGE,
    },
    two_fa_share: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: AMBER,
    },
  },

  edges: [
    {
      from: "accounts_email_confirmed",
      to: "email_confirmed_share",
      toHandle: "a",
    },
    { from: "accounts_active", to: "email_confirmed_share", toHandle: "b" },
    {
      from: "accounts_marketing_opt_in",
      to: "marketing_opt_in_share",
      toHandle: "a",
    },
    { from: "accounts_active", to: "marketing_opt_in_share", toHandle: "b" },
    {
      from: "accounts_with_stripe_customer",
      to: "stripe_customer_share",
      toHandle: "a",
    },
    { from: "accounts_active", to: "stripe_customer_share", toHandle: "b" },
    { from: "accounts_2fa", to: "two_fa_share", toHandle: "a" },
    { from: "accounts_active", to: "two_fa_share", toHandle: "b" },
  ],

  positions: {
    accounts_active: { x: 0, y: 0 },
    accounts_email_confirmed: { x: 0, y: 120 },
    accounts_marketing_opt_in: { x: 0, y: 240 },
    accounts_with_stripe_customer: { x: 0, y: 360 },
    accounts_2fa: { x: 0, y: 480 },
    email_confirmed_share: { x: 300, y: 60 },
    marketing_opt_in_share: { x: 300, y: 180 },
    stripe_customer_share: { x: 300, y: 300 },
    two_fa_share: { x: 300, y: 420 },
  },

  trigger: { type: "cron", schedule: "0 0 * * *" },
};

// ─── Security & Login Monitoring ─────────────────────────────────────────────

/** Failed logins in one hour that count as an attack, not typos (normal: ~1/h). */
const FAILED_LOGINS_PER_HOUR_ALERT = 30;

const securityLoginMonitoringConfig: GraphConfig = {
  nodes: {
    login_attempts: {
      endpointPath: USERS_LOGIN_ATTEMPTS_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    login_failed: {
      endpointPath: USERS_LOGIN_ATTEMPTS_FAILED_ALIAS,
      pane: 0,
      color: RED,
    },
    banned_accounts_updated: {
      endpointPath: USERS_BANNED_ALIAS,
      pane: 0,
      color: ORANGE,
    },

    failure_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: RED,
    },
    failure_rate_7_bar_avg: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 7 },
      pane: 1,
      color: PURPLE,
    },

    // Absolute volume, not the failure rate: with a handful of logins a day,
    // one typo is a 100% failure rate.
    eval_failed_flood: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_HOUR,
      params: { op: ">", value: FAILED_LOGINS_PER_HOUR_ALERT },
      visible: false,
    },
    eval_ban_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 10 },
      visible: false,
    },

    action_notify_login_flood: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary: `SECURITY ALERT: more than ${FAILED_LOGINS_PER_HOUR_ALERT} failed logins in one hour. Possible brute-force or credential stuffing. Check login_attempts by IP and the rate limits.`,
      },
    },
  },

  edges: [
    { from: "login_failed", to: "failure_rate", toHandle: "a" },
    { from: "login_attempts", to: "failure_rate", toHandle: "b" },
    { from: "failure_rate", to: "failure_rate_7_bar_avg" },
    { from: "login_failed", to: "eval_failed_flood" },
    { from: "banned_accounts_updated", to: "eval_ban_spike" },
    { from: "eval_failed_flood", to: "action_notify_login_flood" },
  ],

  positions: {
    login_attempts: { x: 0, y: 0 },
    login_failed: { x: 0, y: 120 },
    banned_accounts_updated: { x: 0, y: 240 },
    failure_rate: { x: 300, y: 60 },
    failure_rate_7_bar_avg: { x: 560, y: 60 },
    eval_failed_flood: { x: 300, y: 180 },
    eval_ban_spike: { x: 300, y: 300 },
    action_notify_login_flood: { x: 600, y: 180 },
  },

  trigger: { type: "cron", schedule: "*/15 * * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "user-growth",
    name: "User Growth",
    description:
      "Signups per day and how many confirmed their email, the 7-day signup trend and the total of active accounts. Alerts when weekly signups average under 5 a day or under 80% of a week's signups confirm their email.",
    config: userGrowthConfig,
  },
  {
    slug: "user-quality-trust",
    name: "User Quality & Trust",
    description:
      "Account base over time (cumulative): active accounts and how many have a confirmed email, marketing opt-in, a Stripe customer record (started a card checkout, not necessarily paid) and 2FA, plus each as a share of active accounts.",
    config: userQualityTrustConfig,
  },
  {
    slug: "security-login-monitoring",
    name: "Security & Login Monitoring",
    description:
      "Login attempts and failures, failure rate, and banned accounts (counted on the day the banned account was last updated). Checked every 15 minutes: alerts on more than 30 failed logins in an hour and on more than 10 banned accounts in a day.",
    config: securityLoginMonitoringConfig,
  },
];
