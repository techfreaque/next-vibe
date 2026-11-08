/**
 * Growth Domain - Vibe Sense Graph Seeds
 *
 * Growth Funnel: daily step counts, rolling step conversion, paying users by
 * channel type, cost per paying user, and sharp-drop alerts on conversion.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import type {
  GraphConfig,
  GraphSeedEntry,
} from "next-vibe/dataflow/graph/types";

import { EVALUATOR_DROP_ALIAS } from "../../analytics/evaluators/drop/constants";
import { WINDOW_SUM_ALIAS } from "../../analytics/indicators/window-sum/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../../analytics/transformers/ratio/constants";
import { GROWTH_CHANNEL_SPEND_ALIAS } from "./data-sources/channel-spend/constants";
import { GROWTH_FUNNEL_STEP_ALIAS } from "./data-sources/funnel-step/constants";
import { ChannelTypeFilter, FunnelStep } from "./enum";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const CYAN = "#0891b2";
const PURPLE = "#9333ea";
const AMBER = "#ca8a04";
const GREEN = "#16a34a";
const PINK = "#be185d";
const ORANGE = "#ea580c";
const RED = "#ef4444";

/** Rolling window for conversion rates - smooths daily noise. */
const CONVERSION_WINDOW = 7;
/** Rolling window for cost per paying user - spend and payments lag. */
const COST_WINDOW = 30;
/** Drop alert: fire when the 7-day conversion falls 50% below its prior 28-day average. */
const DROP_PARAMS = { window: 28, dropPct: 0.5, minBaseline: 0.001 };

const growthFunnelConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: step counts per day ──
    visits: {
      endpointPath: GROWTH_FUNNEL_STEP_ALIAS,
      params: { step: FunnelStep.VISIT },
      pane: 0,
      color: BLUE,
    },
    chats: {
      endpointPath: GROWTH_FUNNEL_STEP_ALIAS,
      params: { step: FunnelStep.CHAT },
      pane: 0,
      color: CYAN,
    },
    signups: {
      endpointPath: GROWTH_FUNNEL_STEP_ALIAS,
      params: { step: FunnelStep.SIGNUP },
      pane: 0,
      color: PURPLE,
    },
    newsletter: {
      endpointPath: GROWTH_FUNNEL_STEP_ALIAS,
      params: { step: FunnelStep.NEWSLETTER },
      pane: 0,
      color: AMBER,
    },
    paid: {
      endpointPath: GROWTH_FUNNEL_STEP_ALIAS,
      params: { step: FunnelStep.PAID },
      pane: 0,
      color: GREEN,
    },
    retained: {
      endpointPath: GROWTH_FUNNEL_STEP_ALIAS,
      params: { step: FunnelStep.RETAINED },
      pane: 0,
      color: PINK,
    },

    // ── Rolling sums feeding the conversion rates ──
    visits_7d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: CONVERSION_WINDOW },
      visible: false,
    },
    chats_7d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: CONVERSION_WINDOW },
      visible: false,
    },
    signups_7d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: CONVERSION_WINDOW },
      visible: false,
    },
    paid_7d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: CONVERSION_WINDOW },
      visible: false,
    },

    // ── Pane 1: step conversion (7-day rolling) ──
    conv_visit_chat: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: CYAN,
    },
    conv_visit_signup: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },
    conv_signup_paid: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },

    // ── Pane 2: paying users by first-touch channel type ──
    paid_campaign: {
      endpointPath: GROWTH_FUNNEL_STEP_ALIAS,
      params: {
        step: FunnelStep.PAID,
        channelType: ChannelTypeFilter.CAMPAIGN,
      },
      pane: 2,
      color: BLUE,
    },
    paid_referral: {
      endpointPath: GROWTH_FUNNEL_STEP_ALIAS,
      params: {
        step: FunnelStep.PAID,
        channelType: ChannelTypeFilter.REFERRAL,
      },
      pane: 2,
      color: GREEN,
    },
    paid_organic: {
      endpointPath: GROWTH_FUNNEL_STEP_ALIAS,
      params: {
        step: FunnelStep.PAID,
        channelType: ChannelTypeFilter.ORGANIC,
      },
      pane: 2,
      color: AMBER,
    },
    paid_direct: {
      endpointPath: GROWTH_FUNNEL_STEP_ALIAS,
      params: {
        step: FunnelStep.PAID,
        channelType: ChannelTypeFilter.DIRECT,
      },
      pane: 2,
      color: PINK,
    },

    // ── Pane 3: cost per paying user (30-day rolling, all channels) ──
    // Set `channel` on spend + paid_30d's source to judge a single channel.
    spend: {
      endpointPath: GROWTH_CHANNEL_SPEND_ALIAS,
      params: { currency: "EUR" },
      pane: 3,
      color: ORANGE,
    },
    spend_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: COST_WINDOW },
      visible: false,
    },
    paid_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: COST_WINDOW },
      visible: false,
    },
    cost_per_paid: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 3,
      color: RED,
    },

    // ── Alerts: step conversion falls sharply vs its trailing average ──
    eval_drop_visit_chat: {
      endpointPath: EVALUATOR_DROP_ALIAS,
      params: DROP_PARAMS,
      lookback: DROP_PARAMS.window,
      visible: false,
    },
    eval_drop_visit_signup: {
      endpointPath: EVALUATOR_DROP_ALIAS,
      params: DROP_PARAMS,
      lookback: DROP_PARAMS.window,
      visible: false,
    },
    eval_drop_signup_paid: {
      endpointPath: EVALUATOR_DROP_ALIAS,
      params: DROP_PARAMS,
      lookback: DROP_PARAMS.window,
      visible: false,
    },
  },

  edges: [
    { from: "visits", to: "visits_7d" },
    { from: "chats", to: "chats_7d" },
    { from: "signups", to: "signups_7d" },
    { from: "paid", to: "paid_7d" },

    { from: "chats_7d", to: "conv_visit_chat", toHandle: "a" },
    { from: "visits_7d", to: "conv_visit_chat", toHandle: "b" },
    { from: "signups_7d", to: "conv_visit_signup", toHandle: "a" },
    { from: "visits_7d", to: "conv_visit_signup", toHandle: "b" },
    { from: "paid_7d", to: "conv_signup_paid", toHandle: "a" },
    { from: "signups_7d", to: "conv_signup_paid", toHandle: "b" },

    { from: "spend", to: "spend_30d" },
    { from: "paid", to: "paid_30d" },
    { from: "spend_30d", to: "cost_per_paid", toHandle: "a" },
    { from: "paid_30d", to: "cost_per_paid", toHandle: "b" },

    { from: "conv_visit_chat", to: "eval_drop_visit_chat" },
    { from: "conv_visit_signup", to: "eval_drop_visit_signup" },
    { from: "conv_signup_paid", to: "eval_drop_signup_paid" },
  ],

  positions: {
    visits: { x: 0, y: 0 },
    chats: { x: 0, y: 120 },
    signups: { x: 0, y: 240 },
    newsletter: { x: 0, y: 360 },
    paid: { x: 0, y: 480 },
    retained: { x: 0, y: 600 },
    paid_campaign: { x: 0, y: 760 },
    paid_referral: { x: 0, y: 880 },
    paid_organic: { x: 0, y: 1000 },
    paid_direct: { x: 0, y: 1120 },
    spend: { x: 0, y: 1280 },
    visits_7d: { x: 300, y: 0 },
    chats_7d: { x: 300, y: 120 },
    signups_7d: { x: 300, y: 240 },
    paid_7d: { x: 300, y: 480 },
    spend_30d: { x: 300, y: 1280 },
    paid_30d: { x: 300, y: 1400 },
    conv_visit_chat: { x: 600, y: 60 },
    conv_visit_signup: { x: 600, y: 180 },
    conv_signup_paid: { x: 600, y: 360 },
    cost_per_paid: { x: 600, y: 1340 },
    eval_drop_visit_chat: { x: 900, y: 60 },
    eval_drop_visit_signup: { x: 900, y: 180 },
    eval_drop_signup_paid: { x: 900, y: 360 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "growth-funnel",
    name: "Growth Funnel",
    description:
      "Visit → chat → signup → newsletter → paid → renewal per day, 7-day step conversion, paying users by channel type and 30-day cost per paying user. Alerts when a step's conversion drops 50% below its 28-day average.",
    config: growthFunnelConfig,
  },
];
