/**
 * Newsletter Domain — Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the newsletter domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import type {
  GraphConfig,
  GraphSeedEntry,
} from "../system/unified-interface/vibe-sense/graph/types";
import { GraphResolution } from "../system/unified-interface/vibe-sense/enum";
import { NEWSLETTER_SUBSCRIPTIONS_NEW_ALIAS } from "./data-sources/newsletter-subscriptions-new/constants";
import { NEWSLETTER_UNSUBSCRIBES_ALIAS } from "./data-sources/newsletter-unsubscribes/constants";
import { NEWSLETTER_EVENTS_TOTAL_ALIAS } from "./data-sources/newsletter-events-total/constants";
import { NEWSLETTER_CAMPAIGNS_SENT_ALIAS } from "./data-sources/newsletter-campaigns-sent/constants";
import { EMA_ALIAS } from "../analytics/indicators/ema/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { EVALUATOR_THRESHOLD_ALIAS } from "../analytics/evaluators/threshold/constants";
import { COMPLETE_TASK_ALIAS } from "../system/unified-interface/tasks/complete-task/constants";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const ORANGE = "#ea580c";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";

// ─── Newsletter Engagement ──────────────────────────────────────────────────

const newsletterEngagementConfig: GraphConfig = {
  nodes: {
    subscriptions_new: {
      endpointPath: NEWSLETTER_SUBSCRIPTIONS_NEW_ALIAS,
      pane: 0,
      color: GREEN,
    },
    unsubscribes: {
      endpointPath: NEWSLETTER_UNSUBSCRIBES_ALIAS,
      pane: 0,
      color: RED,
    },
    events_total: {
      endpointPath: NEWSLETTER_EVENTS_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    campaigns_sent: {
      endpointPath: NEWSLETTER_CAMPAIGNS_SENT_ALIAS,
      pane: 0,
      color: CYAN,
    },

    subs_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: GREEN,
    },
    unsubs_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: RED,
    },

    churn_ratio: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },
    events_per_campaign: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: ORANGE,
    },

    eval_net_negative: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: ">", value: 1 },
      visible: false,
    },
    eval_no_campaigns: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 1 },
      visible: false,
    },

    action_notify_subscriber_loss: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Newsletter unsubscribes exceeded new subscriptions over the past week. Subscriber base is shrinking. Review content quality, send frequency, and audience targeting.",
      },
    },
  },

  edges: [
    { from: "subscriptions_new", to: "subs_ema7" },
    { from: "unsubscribes", to: "unsubs_ema7" },
    { from: "unsubs_ema7", to: "churn_ratio", toHandle: "a" },
    { from: "subs_ema7", to: "churn_ratio", toHandle: "b" },
    { from: "events_total", to: "events_per_campaign", toHandle: "a" },
    { from: "campaigns_sent", to: "events_per_campaign", toHandle: "b" },
    { from: "churn_ratio", to: "eval_net_negative" },
    { from: "campaigns_sent", to: "eval_no_campaigns" },
    { from: "eval_net_negative", to: "action_notify_subscriber_loss" },
  ],

  positions: {
    subscriptions_new: { x: 0, y: 0 },
    unsubscribes: { x: 0, y: 120 },
    events_total: { x: 0, y: 240 },
    campaigns_sent: { x: 0, y: 360 },
    subs_ema7: { x: 300, y: 0 },
    unsubs_ema7: { x: 300, y: 120 },
    churn_ratio: { x: 560, y: 60 },
    events_per_campaign: { x: 300, y: 300 },
    eval_net_negative: { x: 800, y: 60 },
    eval_no_campaigns: { x: 600, y: 360 },
    action_notify_subscriber_loss: { x: 1060, y: 60 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "newsletter-engagement",
    name: "Newsletter Engagement",
    description:
      "Tracks newsletter subscriber growth vs churn, campaign send frequency, and events per campaign. Alerts when unsubscribes exceed new subscriptions.",
    config: newsletterEngagementConfig,
  },
];
