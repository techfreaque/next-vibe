/**
 * Users Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the users domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import { EVALUATOR_THRESHOLD_ALIAS } from "../analytics/evaluators/threshold/constants";
import { EMA_ALIAS } from "../analytics/indicators/ema/constants";
import { WINDOW_AVG_ALIAS } from "../analytics/indicators/window-avg/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { LEADS_CREATED_ALIAS } from "../leads/data-sources/leads-created/constants";
import { COMPLETE_TASK_ALIAS } from "../system/unified-interface/tasks/complete-task/constants";
import { GraphResolution } from "../system/unified-interface/vibe-sense/enum";
import type {
  GraphConfig,
  GraphSeedEntry,
} from "../system/unified-interface/vibe-sense/graph/types";
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
    users_registered: {
      endpointPath: USERS_REGISTERED_ALIAS,
      pane: 0,
      color: BLUE,
    },
    users_active_total: {
      endpointPath: USERS_ACTIVE_TOTAL_ALIAS,
      pane: 0,
      color: GREEN,
    },
    users_banned: {
      endpointPath: USERS_BANNED_ALIAS,
      pane: 0,
      color: RED,
    },
    leads_created: {
      endpointPath: LEADS_CREATED_ALIAS,
      pane: 0,
      color: CYAN,
    },
    registrations_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: BLUE,
    },

    lead_to_user_ratio: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    eval_slow_growth: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 5 },
      visible: false,
    },
    eval_ban_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 5 },
      visible: false,
    },

    action_notify_ban_spike: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: More than 5 users banned today. Possible coordinated abuse or signup fraud. Review recent ban activity and check for patterns.",
      },
    },
  },

  edges: [
    { from: "users_registered", to: "lead_to_user_ratio", toHandle: "a" },
    { from: "leads_created", to: "lead_to_user_ratio", toHandle: "b" },
    { from: "users_registered", to: "registrations_ema7" },
    { from: "registrations_ema7", to: "eval_slow_growth" },
    { from: "users_banned", to: "eval_ban_spike" },
    { from: "eval_ban_spike", to: "action_notify_ban_spike" },
  ],

  positions: {
    users_registered: { x: 0, y: 0 },
    users_active_total: { x: 0, y: 120 },
    users_banned: { x: 0, y: 240 },
    leads_created: { x: 0, y: 360 },
    registrations_ema7: { x: 300, y: 0 },
    lead_to_user_ratio: { x: 300, y: 240 },
    eval_slow_growth: { x: 600, y: 0 },
    eval_ban_spike: { x: 600, y: 240 },
    action_notify_ban_spike: { x: 900, y: 240 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── User Quality & Trust ─────────────────────────────────────────────────────

const userQualityTrustConfig: GraphConfig = {
  nodes: {
    users_active_total: {
      endpointPath: USERS_ACTIVE_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    users_email_verified: {
      endpointPath: USERS_EMAIL_VERIFIED_ALIAS,
      pane: 0,
      color: GREEN,
    },
    users_two_fa: {
      endpointPath: USERS_TWO_FA_ENABLED_ALIAS,
      pane: 0,
      color: AMBER,
    },
    users_with_stripe: {
      endpointPath: USERS_WITH_STRIPE_ALIAS,
      pane: 0,
      color: ORANGE,
    },

    email_verified_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },
    paying_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: ORANGE,
    },
    two_fa_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: AMBER,
    },

    eval_low_email_verify: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.5 },
      visible: false,
    },
  },

  edges: [
    { from: "users_email_verified", to: "email_verified_rate", toHandle: "a" },
    { from: "users_active_total", to: "email_verified_rate", toHandle: "b" },
    { from: "users_with_stripe", to: "paying_rate", toHandle: "a" },
    { from: "users_active_total", to: "paying_rate", toHandle: "b" },
    { from: "users_two_fa", to: "two_fa_rate", toHandle: "a" },
    { from: "users_active_total", to: "two_fa_rate", toHandle: "b" },
    { from: "email_verified_rate", to: "eval_low_email_verify" },
  ],

  positions: {
    users_active_total: { x: 0, y: 0 },
    users_email_verified: { x: 0, y: 120 },
    users_two_fa: { x: 0, y: 360 },
    users_with_stripe: { x: 0, y: 480 },
    email_verified_rate: { x: 300, y: 60 },
    paying_rate: { x: 300, y: 240 },
    two_fa_rate: { x: 300, y: 400 },
    eval_low_email_verify: { x: 600, y: 60 },
  },

  trigger: { type: "cron", schedule: "0 0 * * *" },
};

// ─── Security & Login Monitoring ─────────────────────────────────────────────

const securityLoginMonitoringConfig: GraphConfig = {
  nodes: {
    login_total: {
      endpointPath: USERS_LOGIN_ATTEMPTS_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    login_failed: {
      endpointPath: USERS_LOGIN_ATTEMPTS_FAILED_ALIAS,
      pane: 0,
      color: RED,
    },
    users_banned: {
      endpointPath: USERS_BANNED_ALIAS,
      pane: 0,
      color: ORANGE,
    },

    failure_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: RED,
    },
    failure_rate_w15: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 15 },
      pane: 1,
      color: RED,
    },
    failed_w15: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 15 },
      pane: 1,
      color: PURPLE,
    },

    eval_high_failure_rate: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_HOUR,
      params: { op: ">", value: 0.5 },
      visible: false,
    },
    eval_failed_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_HOUR,
      params: { op: ">", value: 100 },
      visible: false,
    },
    eval_ban_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 10 },
      visible: false,
    },

    action_notify_credential_stuffing: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "SECURITY ALERT: Sustained login failure rate >50% over 15-minute window. Possible credential stuffing or brute-force attack in progress. Check IP rate limiting and consider temporary lockdown.",
      },
    },

    action_notify_login_flood: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "SECURITY ALERT: Login attempt flood detected - >100 failed attempts per minute (15-min avg). High-volume brute-force attack. Review IP blocklist and WAF rules immediately.",
      },
    },
  },

  edges: [
    { from: "login_failed", to: "failure_rate", toHandle: "a" },
    { from: "login_total", to: "failure_rate", toHandle: "b" },
    { from: "failure_rate", to: "failure_rate_w15" },
    { from: "login_failed", to: "failed_w15" },
    { from: "failure_rate_w15", to: "eval_high_failure_rate" },
    { from: "failed_w15", to: "eval_failed_spike" },
    { from: "users_banned", to: "eval_ban_spike" },
    { from: "eval_high_failure_rate", to: "action_notify_credential_stuffing" },
    { from: "eval_failed_spike", to: "action_notify_login_flood" },
  ],

  positions: {
    login_total: { x: 0, y: 0 },
    login_failed: { x: 0, y: 120 },
    users_banned: { x: 0, y: 240 },
    failure_rate: { x: 300, y: 60 },
    failure_rate_w15: { x: 560, y: 60 },
    failed_w15: { x: 300, y: 180 },
    eval_high_failure_rate: { x: 800, y: 60 },
    eval_failed_spike: { x: 800, y: 180 },
    eval_ban_spike: { x: 600, y: 240 },
    action_notify_credential_stuffing: { x: 1060, y: 60 },
    action_notify_login_flood: { x: 1060, y: 180 },
  },

  trigger: { type: "cron", schedule: "*/15 * * * *" },
};

// ─── Marketing & Conversion Funnel ───────────────────────────────────────────

const marketingConversionFunnelConfig: GraphConfig = {
  nodes: {
    leads_created: {
      endpointPath: LEADS_CREATED_ALIAS,
      pane: 0,
      color: CYAN,
    },
    users_registered: {
      endpointPath: USERS_REGISTERED_ALIAS,
      pane: 0,
      color: BLUE,
    },
    marketing_consent: {
      endpointPath: USERS_MARKETING_CONSENT_ALIAS,
      pane: 0,
      color: GREEN,
    },
    users_with_stripe: {
      endpointPath: USERS_WITH_STRIPE_ALIAS,
      pane: 0,
      color: AMBER,
    },

    marketing_consent_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: GREEN,
    },

    lead_to_user_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: BLUE,
    },
    marketing_opt_in_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },
    user_to_paying_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: AMBER,
    },

    eval_low_conversion: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.1 },
      visible: false,
    },
    eval_low_marketing_opt_in: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.2 },
      visible: false,
    },

    action_notify_low_conversion: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Lead-to-user conversion rate dropped below 10% (weekly). Registration funnel is leaking. Review onboarding flow, sign-up friction, and landing page effectiveness.",
      },
    },
  },

  edges: [
    { from: "users_registered", to: "lead_to_user_rate", toHandle: "a" },
    { from: "leads_created", to: "lead_to_user_rate", toHandle: "b" },
    { from: "marketing_consent", to: "marketing_opt_in_rate", toHandle: "a" },
    { from: "users_registered", to: "marketing_opt_in_rate", toHandle: "b" },
    { from: "users_with_stripe", to: "user_to_paying_rate", toHandle: "a" },
    { from: "users_registered", to: "user_to_paying_rate", toHandle: "b" },
    { from: "marketing_consent", to: "marketing_consent_ema7" },
    { from: "lead_to_user_rate", to: "eval_low_conversion" },
    { from: "marketing_opt_in_rate", to: "eval_low_marketing_opt_in" },
    { from: "eval_low_conversion", to: "action_notify_low_conversion" },
  ],

  positions: {
    leads_created: { x: 0, y: 0 },
    users_registered: { x: 0, y: 120 },
    marketing_consent: { x: 0, y: 240 },
    users_with_stripe: { x: 0, y: 360 },
    marketing_consent_ema7: { x: 300, y: 240 },
    lead_to_user_rate: { x: 300, y: 60 },
    marketing_opt_in_rate: { x: 300, y: 180 },
    user_to_paying_rate: { x: 300, y: 360 },
    eval_low_conversion: { x: 600, y: 60 },
    eval_low_marketing_opt_in: { x: 600, y: 180 },
    action_notify_low_conversion: { x: 900, y: 60 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "user-growth",
    name: "User Growth",
    description:
      "Tracks user registration velocity, active user base, and lead-to-user conversion ratio.",
    config: userGrowthConfig,
  },
  {
    slug: "user-quality-trust",
    name: "User Quality & Trust",
    description:
      "Daily snapshot of user quality metrics: email verification rate, paying user rate, 2FA adoption. Alerts when verification drops.",
    config: userQualityTrustConfig,
  },
  {
    slug: "security-login-monitoring",
    name: "Security & Login Monitoring",
    description:
      "15-minute security watch: login failure rate, brute-force detection, ban spikes. Critical for early attack response.",
    config: securityLoginMonitoringConfig,
  },
  {
    slug: "marketing-conversion-funnel",
    name: "Marketing & Conversion Funnel",
    description:
      "Tracks lead-to-user conversion, marketing consent opt-in rate, and user-to-paying conversion. Alerts on low conversion and declining marketing opt-in.",
    config: marketingConversionFunnelConfig,
  },
];
