/**
 * Messenger Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the messenger domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import { EVALUATOR_THRESHOLD_ALIAS } from "../analytics/evaluators/threshold/constants";
import { EMA_ALIAS } from "../analytics/indicators/ema/constants";
import { WINDOW_AVG_ALIAS } from "../analytics/indicators/window-avg/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { COMPLETE_TASK_ALIAS } from "../system/unified-interface/tasks/complete-task/constants";
import { GraphResolution } from "../system/unified-interface/vibe-sense/enum";
import type {
  GraphConfig,
  GraphSeedEntry,
} from "../system/unified-interface/vibe-sense/graph/types";
import { MESSENGER_BOUNCED_ALIAS } from "./data-sources/messenger-bounced/constants";
import { MESSENGER_CLICKED_ALIAS } from "./data-sources/messenger-clicked/constants";
import { MESSENGER_DELIVERED_ALIAS } from "./data-sources/messenger-delivered/constants";
import { MESSENGER_OPENED_ALIAS } from "./data-sources/messenger-opened/constants";
import { MESSENGER_SENT_ALIAS } from "./data-sources/messenger-sent/constants";
import { MESSENGER_TOTAL_ALIAS } from "./data-sources/messenger-total/constants";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";
const AMBER = "#ca8a04";

// ─── Messenger Delivery Funnel ──────────────────────────────────────────────

const messengerDeliveryFunnelConfig: GraphConfig = {
  nodes: {
    sent: {
      endpointPath: MESSENGER_SENT_ALIAS,
      pane: 0,
      color: BLUE,
    },
    delivered: {
      endpointPath: MESSENGER_DELIVERED_ALIAS,
      pane: 0,
      color: GREEN,
    },
    opened: {
      endpointPath: MESSENGER_OPENED_ALIAS,
      pane: 0,
      color: CYAN,
    },
    clicked: {
      endpointPath: MESSENGER_CLICKED_ALIAS,
      pane: 0,
      color: PURPLE,
    },
    bounced: {
      endpointPath: MESSENGER_BOUNCED_ALIAS,
      pane: 0,
      color: RED,
    },

    delivery_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },
    open_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: CYAN,
    },
    click_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },
    bounce_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: RED,
    },
    click_rate_w7: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 7 },
      pane: 1,
      color: PURPLE,
    },

    eval_high_bounce: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 0.1 },
      visible: false,
    },
    eval_low_open_rate: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.1 },
      visible: false,
    },

    action_notify_bounce_crisis: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Messenger bounce rate exceeded 10%. Email deliverability is degraded. Check SPF/DKIM/DMARC records, sender reputation, and recipient list quality.",
      },
    },
    action_notify_low_engagement: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Messenger open rate dropped below 10% (weekly avg). Messages are being ignored. Review subject lines, send timing, and audience segmentation.",
      },
    },
  },

  edges: [
    { from: "delivered", to: "delivery_rate", toHandle: "a" },
    { from: "sent", to: "delivery_rate", toHandle: "b" },
    { from: "opened", to: "open_rate", toHandle: "a" },
    { from: "delivered", to: "open_rate", toHandle: "b" },
    { from: "clicked", to: "click_rate", toHandle: "a" },
    { from: "opened", to: "click_rate", toHandle: "b" },
    { from: "bounced", to: "bounce_rate", toHandle: "a" },
    { from: "sent", to: "bounce_rate", toHandle: "b" },
    { from: "click_rate", to: "click_rate_w7" },
    { from: "bounce_rate", to: "eval_high_bounce" },
    { from: "open_rate", to: "eval_low_open_rate" },
    { from: "eval_high_bounce", to: "action_notify_bounce_crisis" },
    { from: "eval_low_open_rate", to: "action_notify_low_engagement" },
  ],

  positions: {
    sent: { x: 0, y: 0 },
    delivered: { x: 0, y: 120 },
    opened: { x: 0, y: 240 },
    clicked: { x: 0, y: 360 },
    bounced: { x: 0, y: 480 },
    delivery_rate: { x: 300, y: 60 },
    open_rate: { x: 300, y: 180 },
    click_rate: { x: 300, y: 300 },
    bounce_rate: { x: 300, y: 440 },
    click_rate_w7: { x: 560, y: 300 },
    eval_high_bounce: { x: 600, y: 440 },
    eval_low_open_rate: { x: 600, y: 180 },
    action_notify_bounce_crisis: { x: 900, y: 440 },
    action_notify_low_engagement: { x: 900, y: 180 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Messenger Volume Health ─────────────────────────────────────────────────

const messengerVolumeHealthConfig: GraphConfig = {
  nodes: {
    messenger_total: {
      endpointPath: MESSENGER_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    sent: {
      endpointPath: MESSENGER_SENT_ALIAS,
      pane: 0,
      color: GREEN,
    },
    delivered: {
      endpointPath: MESSENGER_DELIVERED_ALIAS,
      pane: 0,
      color: CYAN,
    },
    bounced: {
      endpointPath: MESSENGER_BOUNCED_ALIAS,
      pane: 0,
      color: RED,
    },

    total_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: BLUE,
    },

    sent_to_total_ratio: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },
    bounce_to_total_ratio: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: RED,
    },
    delivery_efficiency: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: AMBER,
    },

    eval_volume_drop: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 5 },
      visible: false,
    },
    eval_high_bounce_ratio: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 0.15 },
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
          "ALERT: Total messenger volume (7-day EMA) dropped below 5/day. Messaging pipeline may be stalled. Check queue workers, SMTP connectivity, and scheduled campaigns.",
      },
    },
    action_notify_bounce_ratio: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Bounce-to-total messenger ratio exceeded 15% today. Email infrastructure health is at risk. Review recipient lists and sender domain reputation.",
      },
    },
  },

  edges: [
    { from: "messenger_total", to: "total_ema7" },
    { from: "sent", to: "sent_to_total_ratio", toHandle: "a" },
    { from: "messenger_total", to: "sent_to_total_ratio", toHandle: "b" },
    { from: "bounced", to: "bounce_to_total_ratio", toHandle: "a" },
    { from: "messenger_total", to: "bounce_to_total_ratio", toHandle: "b" },
    { from: "delivered", to: "delivery_efficiency", toHandle: "a" },
    { from: "sent", to: "delivery_efficiency", toHandle: "b" },
    { from: "total_ema7", to: "eval_volume_drop" },
    { from: "bounce_to_total_ratio", to: "eval_high_bounce_ratio" },
    { from: "eval_volume_drop", to: "action_notify_volume_drop" },
    { from: "eval_high_bounce_ratio", to: "action_notify_bounce_ratio" },
  ],

  positions: {
    messenger_total: { x: 0, y: 0 },
    sent: { x: 0, y: 120 },
    delivered: { x: 0, y: 240 },
    bounced: { x: 0, y: 360 },
    total_ema7: { x: 300, y: 0 },
    sent_to_total_ratio: { x: 300, y: 120 },
    bounce_to_total_ratio: { x: 300, y: 240 },
    delivery_efficiency: { x: 300, y: 360 },
    eval_volume_drop: { x: 600, y: 0 },
    eval_high_bounce_ratio: { x: 600, y: 240 },
    action_notify_volume_drop: { x: 900, y: 0 },
    action_notify_bounce_ratio: { x: 900, y: 240 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "messenger-delivery-funnel",
    name: "Messenger Delivery Funnel",
    description:
      "Full email delivery funnel: sent → delivered → opened → clicked. Tracks bounce rate, open rate, and click-through with 7-day smoothing. Alerts on deliverability issues.",
    config: messengerDeliveryFunnelConfig,
  },
  {
    slug: "messenger-volume-health",
    name: "Messenger Volume Health",
    description:
      "Monitors total messenger volume, sent-to-total and bounce-to-total ratios, and delivery efficiency. Alerts on volume drops and high bounce ratios.",
    config: messengerVolumeHealthConfig,
  },
];
