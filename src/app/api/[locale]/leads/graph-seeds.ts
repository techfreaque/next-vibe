/**
 * Leads Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the leads domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import { EVALUATOR_THRESHOLD_ALIAS } from "../analytics/evaluators/threshold/constants";
import { EMA_ALIAS } from "../analytics/indicators/ema/constants";
import { WINDOW_AVG_ALIAS } from "../analytics/indicators/window-avg/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../analytics/transformers/ratio/constants";
import { GraphResolution } from "../system/unified-interface/vibe-sense/enum";
import type {
  GraphConfig,
  GraphSeedEntry,
} from "../system/unified-interface/vibe-sense/graph/types";
import { LEADS_ACTIVE_ALIAS } from "./data-sources/leads-active/constants";
import { LEADS_BOUNCED_ALIAS } from "./data-sources/leads-bounced/constants";
import { LEADS_CAMPAIGN_RUNNING_ALIAS } from "./data-sources/leads-campaign-running/constants";
import { LEADS_CONVERTED_ALIAS } from "./data-sources/leads-converted/constants";
import { LEADS_CREATED_ALIAS } from "./data-sources/leads-created/constants";
import { LEADS_EMAIL_CLICKS_ALIAS } from "./data-sources/leads-email-clicks/constants";
import { LEADS_EMAIL_OPENS_ALIAS } from "./data-sources/leads-email-opens/constants";
import { LEADS_EMAILS_SENT_ALIAS } from "./data-sources/leads-emails-sent/constants";
import { LEADS_ENGAGEMENTS_ALIAS } from "./data-sources/leads-engagements/constants";
import { LEADS_FORM_SUBMITS_ALIAS } from "./data-sources/leads-form-submits/constants";
import { LEADS_IN_CONTACT_ALIAS } from "./data-sources/leads-in-contact/constants";
import { LEADS_NEWSLETTER_SUBSCRIBERS_ALIAS } from "./data-sources/leads-newsletter-subscribers/constants";
import { LEADS_UNSUBSCRIBED_ALIAS } from "./data-sources/leads-unsubscribed/constants";
import { LEADS_WEBSITE_USERS_ALIAS } from "./data-sources/leads-website-users/constants";
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

// ─── Lead Acquisition Funnel ──────────────────────────────────────────────────

const leadAcquisitionFunnelConfig: GraphConfig = {
  nodes: {
    leads_created: {
      endpointPath: LEADS_CREATED_ALIAS,
      pane: 0,
      color: BLUE,
    },
    leads_converted: {
      endpointPath: LEADS_CONVERTED_ALIAS,
      pane: 0,
      color: GREEN,
    },
    leads_bounced: {
      endpointPath: LEADS_BOUNCED_ALIAS,
      pane: 0,
      color: RED,
    },
    leads_active: {
      endpointPath: LEADS_ACTIVE_ALIAS,
      pane: 0,
      color: CYAN,
    },
    leads_created_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: BLUE,
    },

    conversion_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    eval_lead_drop: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.7 },
      visible: false,
    },
    eval_zero_leads: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: "<", value: 1 },
      visible: false,
    },
    eval_low_conversion: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.05 },
      visible: false,
    },
  },

  edges: [
    { from: "leads_converted", to: "conversion_rate", toHandle: "a" },
    { from: "leads_created", to: "conversion_rate", toHandle: "b" },
    { from: "leads_created", to: "leads_created_ema7" },
    { from: "leads_created_ema7", to: "eval_lead_drop" },
    { from: "leads_created", to: "eval_zero_leads" },
    { from: "conversion_rate", to: "eval_low_conversion" },
  ],

  positions: {
    leads_created: { x: 0, y: 0 },
    leads_converted: { x: 0, y: 120 },
    leads_bounced: { x: 0, y: 240 },
    leads_active: { x: 0, y: 360 },
    leads_created_ema7: { x: 300, y: 0 },
    conversion_rate: { x: 300, y: 120 },
    eval_lead_drop: { x: 600, y: 0 },
    eval_zero_leads: { x: 600, y: 120 },
    eval_low_conversion: { x: 600, y: 240 },
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

// ─── Lead Pipeline Status ─────────────────────────────────────────────────────

const leadPipelineStatusConfig: GraphConfig = {
  nodes: {
    leads_active: {
      endpointPath: LEADS_ACTIVE_ALIAS,
      pane: 0,
      color: BLUE,
    },
    leads_campaign_running: {
      endpointPath: LEADS_CAMPAIGN_RUNNING_ALIAS,
      pane: 0,
      color: GREEN,
    },
    leads_newsletter_subscribers: {
      endpointPath: LEADS_NEWSLETTER_SUBSCRIBERS_ALIAS,
      pane: 0,
      color: PURPLE,
    },
    leads_website_users: {
      endpointPath: LEADS_WEBSITE_USERS_ALIAS,
      pane: 0,
      color: CYAN,
    },
    leads_in_contact: {
      endpointPath: LEADS_IN_CONTACT_ALIAS,
      pane: 0,
      color: AMBER,
    },

    campaign_coverage: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },
    subscriber_depth: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    eval_low_campaign_coverage: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.3 },
      visible: false,
    },
    eval_active_leads_drop: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 10 },
      visible: false,
    },
  },

  edges: [
    { from: "leads_campaign_running", to: "campaign_coverage", toHandle: "a" },
    { from: "leads_active", to: "campaign_coverage", toHandle: "b" },
    {
      from: "leads_newsletter_subscribers",
      to: "subscriber_depth",
      toHandle: "a",
    },
    { from: "leads_active", to: "subscriber_depth", toHandle: "b" },
    { from: "campaign_coverage", to: "eval_low_campaign_coverage" },
    { from: "leads_active", to: "eval_active_leads_drop" },
  ],

  positions: {
    leads_active: { x: 0, y: 0 },
    leads_campaign_running: { x: 0, y: 120 },
    leads_newsletter_subscribers: { x: 0, y: 240 },
    leads_website_users: { x: 0, y: 360 },
    leads_in_contact: { x: 0, y: 480 },
    campaign_coverage: { x: 300, y: 60 },
    subscriber_depth: { x: 300, y: 200 },
    eval_low_campaign_coverage: { x: 600, y: 60 },
    eval_active_leads_drop: { x: 600, y: 200 },
  },

  trigger: { type: "cron", schedule: "0 0 * * *" },
};

// ─── Lead Engagement Real-Time ────────────────────────────────────────────────

const leadEngagementRealTimeConfig: GraphConfig = {
  nodes: {
    engagements: {
      endpointPath: LEADS_ENGAGEMENTS_ALIAS,
      pane: 0,
      color: BLUE,
    },
    website_visits: {
      endpointPath: LEADS_WEBSITE_VISITS_ALIAS,
      pane: 0,
      color: GREEN,
    },
    form_submits: {
      endpointPath: LEADS_FORM_SUBMITS_ALIAS,
      pane: 0,
      color: PURPLE,
    },
    email_opens: {
      endpointPath: LEADS_EMAIL_OPENS_ALIAS,
      pane: 0,
      color: CYAN,
    },
    email_clicks: {
      endpointPath: LEADS_EMAIL_CLICKS_ALIAS,
      pane: 0,
      color: PINK,
    },

    engagement_velocity: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 60 },
      pane: 1,
      color: AMBER,
    },

    eval_engagement_spike: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_HOUR,
      params: { op: ">", value: 50 },
      visible: false,
    },
    eval_engagement_dead: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: "<", value: 1 },
      visible: false,
    },
  },

  edges: [
    { from: "engagements", to: "engagement_velocity" },
    { from: "engagement_velocity", to: "eval_engagement_spike" },
    { from: "engagement_velocity", to: "eval_engagement_dead" },
  ],

  positions: {
    engagements: { x: 0, y: 0 },
    website_visits: { x: 0, y: 120 },
    form_submits: { x: 0, y: 240 },
    email_opens: { x: 0, y: 360 },
    email_clicks: { x: 0, y: 480 },
    engagement_velocity: { x: 300, y: 0 },
    eval_engagement_spike: { x: 600, y: 0 },
    eval_engagement_dead: { x: 600, y: 120 },
  },

  trigger: { type: "cron", schedule: "*/15 * * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "lead-acquisition-funnel",
    name: "Lead Acquisition Funnel",
    description:
      "Tracks lead creation velocity, conversion rates, and acquisition health. Alerts on volume drops and conversion collapses.",
    config: leadAcquisitionFunnelConfig,
  },
  {
    slug: "email-campaign-performance",
    name: "Email Campaign Performance",
    description:
      "Monitors open rates, click rates, bounce rates, and unsubscribe rates across all campaigns. Alerts on bounce spikes and engagement drops.",
    config: emailCampaignPerformanceConfig,
  },
  {
    slug: "lead-pipeline-status",
    name: "Lead Pipeline Status",
    description:
      "Daily snapshot of lead pipeline health: active leads, campaign coverage, newsletter subscribers, and website users.",
    config: leadPipelineStatusConfig,
  },
  {
    slug: "lead-engagement-realtime",
    name: "Lead Engagement Real-Time",
    description:
      "15-minute engagement tracking: website visits, form submits, email interactions. Alerts on spikes and dead periods.",
    config: leadEngagementRealTimeConfig,
  },
];
