/**
 * Leads Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the leads domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import { GraphResolution } from "next-vibe/dataflow/enum";
import type {
  GraphConfig,
  GraphSeedEntry,
} from "next-vibe/dataflow/graph/types";

import { EVALUATOR_THRESHOLD_ALIAS } from "../analytics/evaluators/threshold/constants";
import { WINDOW_AVG_ALIAS } from "../analytics/indicators/window-avg/constants";
import { WINDOW_SUM_ALIAS } from "../analytics/indicators/window-sum/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { LEADS_BOUNCED_ALIAS } from "./data-sources/leads-bounced/constants";
import { LEADS_EMAIL_CLICKS_ALIAS } from "./data-sources/leads-email-clicks/constants";
import { LEADS_EMAIL_OPENS_ALIAS } from "./data-sources/leads-email-opens/constants";
import { LEADS_EMAILS_SENT_ALIAS } from "./data-sources/leads-emails-sent/constants";
import { LEADS_ENGAGEMENTS_ALIAS } from "./data-sources/leads-engagements/constants";
import { LEADS_FORM_SUBMITS_ALIAS } from "./data-sources/leads-form-submits/constants";
import { LEADS_FUNNEL_STAGE_ALIAS } from "./data-sources/leads-funnel-stage/constants";
import { LeadFunnelStage } from "./data-sources/leads-funnel-stage/enum";
import { LEADS_UNSUBSCRIBED_ALIAS } from "./data-sources/leads-unsubscribed/constants";
import { LEADS_WEBSITE_VISITS_ALIAS } from "./data-sources/leads-website-visits/constants";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const ORANGE = "#ea580c";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";
const AMBER = "#ca8a04";
const PINK = "#be185d";

// ─── Lead Funnel ──────────────────────────────────────────────────────────────

/** Rolling window for stage conversion - smooths daily noise. */
const FUNNEL_RATE_WINDOW = 7;

/**
 * Leads created per day and how far that cohort got. Same numbers as the
 * Leads funnel report: bots excluded after "all leads", people counted once.
 */
const leadFunnelConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: top of the funnel ──
    all_leads: {
      endpointPath: LEADS_FUNNEL_STAGE_ALIAS,
      params: { stage: LeadFunnelStage.LEADS },
      pane: 0,
      color: AMBER,
      // Bots dwarf humans: own axis so the human lines stay readable.
      scale: "left",
    },
    humans: {
      endpointPath: LEADS_FUNNEL_STAGE_ALIAS,
      params: { stage: LeadFunnelStage.HUMANS },
      pane: 0,
      color: BLUE,
      scale: "right",
    },
    chatted: {
      endpointPath: LEADS_FUNNEL_STAGE_ALIAS,
      params: { stage: LeadFunnelStage.FIRST_CHATS },
      pane: 0,
      color: CYAN,
      scale: "right",
    },

    // ── Pane 1: accounts ──
    signed_up: {
      endpointPath: LEADS_FUNNEL_STAGE_ALIAS,
      params: { stage: LeadFunnelStage.SIGNUPS },
      pane: 1,
      color: PURPLE,
      scale: "right",
    },
    email_confirmed: {
      endpointPath: LEADS_FUNNEL_STAGE_ALIAS,
      params: { stage: LeadFunnelStage.EMAIL_CONFIRMED },
      pane: 1,
      color: PINK,
      scale: "right",
    },
    paid: {
      endpointPath: LEADS_FUNNEL_STAGE_ALIAS,
      params: { stage: LeadFunnelStage.PAYERS },
      pane: 1,
      color: GREEN,
      scale: "right",
    },

    // ── Rolling sums feeding the rates ──
    humans_7d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: FUNNEL_RATE_WINDOW },
      visible: false,
    },
    chatted_7d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: FUNNEL_RATE_WINDOW },
      visible: false,
    },
    signed_up_7d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: FUNNEL_RATE_WINDOW },
      visible: false,
    },
    paid_7d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: FUNNEL_RATE_WINDOW },
      visible: false,
    },

    // ── Pane 2: 7-day stage conversion ──
    chat_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 2,
      color: CYAN,
      scale: "right",
    },
    signup_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 2,
      color: PURPLE,
      scale: "right",
    },
    pay_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 2,
      color: GREEN,
      scale: "right",
    },
  },

  edges: [
    { from: "humans", to: "humans_7d" },
    { from: "chatted", to: "chatted_7d" },
    { from: "signed_up", to: "signed_up_7d" },
    { from: "paid", to: "paid_7d" },
    { from: "chatted_7d", to: "chat_rate", toHandle: "a" },
    { from: "humans_7d", to: "chat_rate", toHandle: "b" },
    { from: "signed_up_7d", to: "signup_rate", toHandle: "a" },
    { from: "humans_7d", to: "signup_rate", toHandle: "b" },
    { from: "paid_7d", to: "pay_rate", toHandle: "a" },
    { from: "signed_up_7d", to: "pay_rate", toHandle: "b" },
  ],

  positions: {
    all_leads: { x: 0, y: 0 },
    humans: { x: 0, y: 120 },
    chatted: { x: 0, y: 240 },
    signed_up: { x: 0, y: 360 },
    email_confirmed: { x: 0, y: 480 },
    paid: { x: 0, y: 600 },
    humans_7d: { x: 300, y: 120 },
    chatted_7d: { x: 300, y: 240 },
    signed_up_7d: { x: 300, y: 360 },
    paid_7d: { x: 300, y: 600 },
    chat_rate: { x: 600, y: 180 },
    signup_rate: { x: 600, y: 300 },
    pay_rate: { x: 600, y: 480 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Email Campaign Performance ───────────────────────────────────────────────

const emailCampaignPerformanceConfig: GraphConfig = {
  nodes: {
    emails_sent: {
      endpointPath: LEADS_EMAILS_SENT_ALIAS,
      pane: 0,
      color: BLUE,
    },
    email_opens: {
      endpointPath: LEADS_EMAIL_OPENS_ALIAS,
      pane: 0,
      color: GREEN,
    },
    email_clicks: {
      endpointPath: LEADS_EMAIL_CLICKS_ALIAS,
      pane: 0,
      color: CYAN,
    },
    leads_bounced: {
      endpointPath: LEADS_BOUNCED_ALIAS,
      pane: 0,
      color: RED,
    },
    leads_unsubscribed: {
      endpointPath: LEADS_UNSUBSCRIBED_ALIAS,
      pane: 0,
      color: ORANGE,
    },

    open_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },
    click_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: CYAN,
    },
    bounce_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: RED,
    },
    unsub_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: ORANGE,
    },
    click_rate_w7: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 7 },
      pane: 1,
      color: CYAN,
    },

    eval_bounce_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 0.08 },
      visible: false,
    },
    eval_unsub_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 0.03 },
      visible: false,
    },
    eval_low_engagement: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.02 },
      visible: false,
    },
  },

  edges: [
    { from: "email_opens", to: "open_rate", toHandle: "a" },
    { from: "emails_sent", to: "open_rate", toHandle: "b" },
    { from: "email_clicks", to: "click_rate", toHandle: "a" },
    { from: "emails_sent", to: "click_rate", toHandle: "b" },
    { from: "leads_bounced", to: "bounce_rate", toHandle: "a" },
    { from: "emails_sent", to: "bounce_rate", toHandle: "b" },
    { from: "leads_unsubscribed", to: "unsub_rate", toHandle: "a" },
    { from: "emails_sent", to: "unsub_rate", toHandle: "b" },
    { from: "click_rate", to: "click_rate_w7" },
    { from: "bounce_rate", to: "eval_bounce_spike" },
    { from: "unsub_rate", to: "eval_unsub_spike" },
    { from: "click_rate_w7", to: "eval_low_engagement" },
  ],

  positions: {
    emails_sent: { x: 0, y: 0 },
    email_opens: { x: 0, y: 120 },
    email_clicks: { x: 0, y: 240 },
    leads_bounced: { x: 0, y: 360 },
    leads_unsubscribed: { x: 0, y: 480 },
    open_rate: { x: 300, y: 60 },
    click_rate: { x: 300, y: 200 },
    bounce_rate: { x: 300, y: 340 },
    unsub_rate: { x: 300, y: 460 },
    click_rate_w7: { x: 560, y: 200 },
    eval_bounce_spike: { x: 800, y: 340 },
    eval_unsub_spike: { x: 800, y: 460 },
    eval_low_engagement: { x: 800, y: 200 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Lead Engagement ──────────────────────────────────────────────────────────

/**
 * Raw tracking events (bots included): the job of this graph is to show the
 * tracking pipeline is alive, not to count people (Lead Funnel does that).
 */
const leadEngagementConfig: GraphConfig = {
  nodes: {
    all_events: {
      endpointPath: LEADS_ENGAGEMENTS_ALIAS,
      pane: 0,
      color: BLUE,
    },
    website_visits: {
      endpointPath: LEADS_WEBSITE_VISITS_ALIAS,
      pane: 0,
      color: GREEN,
    },
    form_and_onboarding_events: {
      endpointPath: LEADS_FORM_SUBMITS_ALIAS,
      pane: 0,
      color: PURPLE,
    },
    website_visits_7d_avg: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 7 },
      pane: 0,
      color: AMBER,
    },

    eval_tracking_dead: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: "<", value: 1 },
      visible: false,
    },
  },

  edges: [
    { from: "website_visits", to: "website_visits_7d_avg" },
    { from: "website_visits", to: "eval_tracking_dead" },
  ],

  positions: {
    all_events: { x: 0, y: 0 },
    website_visits: { x: 0, y: 120 },
    form_and_onboarding_events: { x: 0, y: 240 },
    website_visits_7d_avg: { x: 300, y: 120 },
    eval_tracking_dead: { x: 600, y: 120 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "lead-funnel",
    name: "Lead Funnel",
    description:
      "Leads created per day and how far they got: human, chatted, signed up, email confirmed, paid. Bots excluded after the first line, people counted once. Matches the Leads funnel report.",
    config: leadFunnelConfig,
  },
  {
    slug: "email-campaign-performance",
    name: "Email Campaign Performance",
    description:
      "Lead campaign emails sent, opened and clicked per day, with lead bounces and unsubscribes, and open/click/bounce/unsubscribe rates per email sent. Reads zero while the campaign dispatcher is off. Alerts on bounce and unsubscribe spikes.",
    config: emailCampaignPerformanceConfig,
  },
  {
    slug: "lead-engagement-realtime",
    name: "Lead Engagement",
    description:
      "Raw tracking events per day, bots included: all lead engagements, website visit events and form/onboarding events. Alerts when a whole day records no website visit (tracking broken). For people, use Lead Funnel.",
    config: leadEngagementConfig,
  },
];
