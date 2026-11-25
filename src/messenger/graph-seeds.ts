/**
 * Messenger Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the messenger domain.
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
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { MESSENGER_BOUNCED_ALIAS } from "./data-sources/messenger-bounced/constants";
import { MESSENGER_SENT_ALIAS } from "./data-sources/messenger-sent/constants";
import { SentMessageTypeFilter } from "./data-sources/messenger-sent/enum";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";
const AMBER = "#ca8a04";

// ─── Email Sending ────────────────────────────────────────────────────────────

const emailSendingConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: messages sent per day, by type ──
    sent_all: {
      endpointPath: MESSENGER_SENT_ALIAS,
      pane: 0,
      color: BLUE,
    },
    sent_system: {
      endpointPath: MESSENGER_SENT_ALIAS,
      params: { messageType: SentMessageTypeFilter.SYSTEM },
      pane: 0,
      color: CYAN,
    },
    sent_marketing: {
      endpointPath: MESSENGER_SENT_ALIAS,
      params: { messageType: SentMessageTypeFilter.MARKETING },
      pane: 0,
      color: PURPLE,
    },
    sent_lead_campaign: {
      endpointPath: MESSENGER_SENT_ALIAS,
      params: { messageType: SentMessageTypeFilter.LEAD_CAMPAIGN },
      pane: 0,
      color: AMBER,
    },
    bounced: {
      endpointPath: MESSENGER_BOUNCED_ALIAS,
      pane: 0,
      color: RED,
    },
    sent_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: GREEN,
    },

    // ── Pane 1: bounces per message sent ──
    bounce_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: RED,
    },

    eval_volume_drop: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 5 },
      visible: false,
    },
    eval_high_bounce: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 0.1 },
      visible: false,
    },

    action_notify_volume_drop: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Sent email volume (7-day EMA) dropped below 5/day. Sending may be stalled. Check SMTP accounts, the send queue and the scheduled jobs.",
      },
    },
    action_notify_bounce_crisis: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Email bounce rate exceeded 10% today. Deliverability is degraded. Check SPF/DKIM/DMARC, sender reputation and recipient list quality.",
      },
    },
  },

  edges: [
    { from: "sent_all", to: "sent_ema7" },
    { from: "bounced", to: "bounce_rate", toHandle: "a" },
    { from: "sent_all", to: "bounce_rate", toHandle: "b" },
    { from: "sent_ema7", to: "eval_volume_drop" },
    { from: "bounce_rate", to: "eval_high_bounce" },
    { from: "eval_volume_drop", to: "action_notify_volume_drop" },
    { from: "eval_high_bounce", to: "action_notify_bounce_crisis" },
  ],

  positions: {
    sent_all: { x: 0, y: 0 },
    sent_system: { x: 0, y: 120 },
    sent_marketing: { x: 0, y: 240 },
    sent_lead_campaign: { x: 0, y: 360 },
    bounced: { x: 0, y: 480 },
    sent_ema7: { x: 300, y: 0 },
    bounce_rate: { x: 300, y: 480 },
    eval_volume_drop: { x: 600, y: 0 },
    eval_high_bounce: { x: 600, y: 480 },
    action_notify_volume_drop: { x: 900, y: 0 },
    action_notify_bounce_crisis: { x: 900, y: 480 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "messenger-volume-health",
    name: "Email Sending",
    description:
      "Emails the platform sent per day, split by type (system, marketing, lead campaign), with bounces and bounce rate. Delivery, open and click events are not recorded for these emails, so they are not shown. Alerts when sending stalls or bounces pass 10%.",
    config: emailSendingConfig,
  },
];
