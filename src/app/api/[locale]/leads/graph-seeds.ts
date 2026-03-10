/**
 * Leads Domain — Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the leads domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

import type {
  GraphConfig,
  GraphSeedEntry,
} from "../system/unified-interface/vibe-sense/graph/types";
import { GraphResolution } from "../system/unified-interface/vibe-sense/enum";

// ─── Lead Funnel ──────────────────────────────────────────────────────────────

const leadFunnelConfig: GraphConfig = {
  nodes: {
    leads_created: {
      type: "indicator",
      indicatorId: "leads.created",
    },
    leads_converted: {
      type: "indicator",
      indicatorId: "leads.converted",
    },
    leads_bounced: {
      type: "indicator",
      indicatorId: "leads.bounced",
    },
    leads_engagements: {
      type: "indicator",
      indicatorId: "leads.engagements",
    },
    emails_sent: {
      type: "indicator",
      indicatorId: "leads.emails_sent",
    },
    leads_created_ma7: {
      type: "indicator",
      indicatorId: "leads.created_ma7",
    },
    conversion_rate: {
      type: "transformer",
      id: "conversion_rate",
      inputs: ["leads_converted", "leads_created"],
      fn: "ratio",
      args: { clampMin: 0, clampMax: 1 },
    },
    bounce_rate: {
      type: "transformer",
      id: "bounce_rate",
      inputs: ["leads_bounced", "emails_sent"],
      fn: "ratio",
      args: { clampMin: 0, clampMax: 1 },
    },
    eval_lead_drop: {
      type: "evaluator",
      id: "eval_lead_drop",
      inputs: ["leads_created_ma7"],
      inputCount: 1,
      evaluatorType: "threshold",
      resolution: GraphResolution.ONE_WEEK,
      args: { type: "threshold", op: "<", value: 0.7 },
    },
    eval_bounce_spike: {
      type: "evaluator",
      id: "eval_bounce_spike",
      inputs: ["bounce_rate"],
      inputCount: 1,
      evaluatorType: "threshold",
      resolution: GraphResolution.ONE_DAY,
      args: { type: "threshold", op: ">", value: 0.1 },
    },
  },

  edges: [
    { from: "leads_converted", to: "conversion_rate", toHandle: "a" },
    { from: "leads_created", to: "conversion_rate", toHandle: "b" },
    { from: "leads_bounced", to: "bounce_rate", toHandle: "a" },
    { from: "emails_sent", to: "bounce_rate", toHandle: "b" },
    { from: "leads_created_ma7", to: "eval_lead_drop" },
    { from: "bounce_rate", to: "eval_bounce_spike" },
  ],

  positions: {
    leads_created: { x: 0, y: 0 },
    leads_converted: { x: 0, y: 120 },
    leads_bounced: { x: 0, y: 240 },
    leads_engagements: { x: 0, y: 360 },
    emails_sent: { x: 0, y: 480 },
    leads_created_ma7: { x: 300, y: 0 },
    conversion_rate: { x: 300, y: 120 },
    bounce_rate: { x: 300, y: 360 },
    eval_lead_drop: { x: 600, y: 0 },
    eval_bounce_spike: { x: 600, y: 360 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Campaign Performance ─────────────────────────────────────────────────────

const campaignPerformanceConfig: GraphConfig = {
  nodes: {
    emails_sent: {
      type: "indicator",
      indicatorId: "leads.emails_sent",
    },
    engagements: {
      type: "indicator",
      indicatorId: "leads.engagements",
    },
    bounced: {
      type: "indicator",
      indicatorId: "leads.bounced",
    },
    engagement_rate: {
      type: "transformer",
      id: "engagement_rate",
      inputs: ["engagements", "emails_sent"],
      fn: "ratio",
      args: { clampMin: 0, clampMax: 10 },
    },
    bounce_rate: {
      type: "transformer",
      id: "bounce_rate",
      inputs: ["bounced", "emails_sent"],
      fn: "ratio",
      args: { clampMin: 0, clampMax: 1 },
    },
    engagement_rate_w7: {
      type: "transformer",
      id: "engagement_rate_w7",
      inputs: ["engagement_rate"],
      fn: "window_avg",
      args: { periods: 7 },
    },
    eval_engagement_drop: {
      type: "evaluator",
      id: "eval_engagement_drop",
      inputs: ["engagement_rate_w7"],
      inputCount: 1,
      evaluatorType: "threshold",
      resolution: GraphResolution.ONE_WEEK,
      args: { type: "threshold", op: "<", value: 0.05 },
    },
    eval_bounce_spike: {
      type: "evaluator",
      id: "eval_bounce_spike",
      inputs: ["bounce_rate"],
      inputCount: 1,
      evaluatorType: "threshold",
      resolution: GraphResolution.ONE_DAY,
      args: { type: "threshold", op: ">", value: 0.08 },
    },
  },

  edges: [
    { from: "engagements", to: "engagement_rate", toHandle: "a" },
    { from: "emails_sent", to: "engagement_rate", toHandle: "b" },
    { from: "bounced", to: "bounce_rate", toHandle: "a" },
    { from: "emails_sent", to: "bounce_rate", toHandle: "b" },
    { from: "engagement_rate", to: "engagement_rate_w7" },
    { from: "engagement_rate_w7", to: "eval_engagement_drop" },
    { from: "bounce_rate", to: "eval_bounce_spike" },
  ],

  positions: {
    emails_sent: { x: 0, y: 0 },
    engagements: { x: 0, y: 120 },
    bounced: { x: 0, y: 240 },
    engagement_rate: { x: 300, y: 60 },
    bounce_rate: { x: 300, y: 200 },
    engagement_rate_w7: { x: 550, y: 60 },
    eval_engagement_drop: { x: 800, y: 60 },
    eval_bounce_spike: { x: 800, y: 200 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "lead-funnel",
    name: "Lead Funnel",
    description:
      "Tracks lead acquisition, email engagement, and conversion rates over time.",
    config: leadFunnelConfig,
  },
  {
    slug: "campaign-performance",
    name: "Campaign Performance",
    description:
      "Tracks email campaign delivery, engagement rates, bounce rates, and alerts on performance degradation.",
    config: campaignPerformanceConfig,
  },
];
