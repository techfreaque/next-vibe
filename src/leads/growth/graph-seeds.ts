/**
 * Growth Domain - Vibe Sense Graph Seeds
 *
 * Acquisition by Source: human visits, signups and payers per source type.
 * Spend & Cost per Payer: paid spend in USD against signups and payers.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import type {
  GraphConfig,
  GraphSeedEntry,
} from "next-vibe/dataflow/graph/types";

import { WINDOW_SUM_ALIAS } from "../../analytics/indicators/window-sum/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../../analytics/transformers/ratio/constants";
import { AcquisitionMetric, AcquisitionSource } from "./acquisition";
import { GROWTH_ACQUISITION_ALIAS } from "./data-sources/acquisition/constants";
import { GROWTH_CHANNEL_SPEND_ALIAS } from "./data-sources/channel-spend/constants";
import { GROWTH_FUNNEL_STEP_ALIAS } from "./data-sources/funnel-step/constants";
import { FunnelStep } from "./enum";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const CYAN = "#0891b2";
const PURPLE = "#9333ea";
const AMBER = "#ca8a04";
const GREEN = "#16a34a";
const PINK = "#be185d";
const ORANGE = "#ea580c";
const RED = "#ef4444";

/** Rolling window for cost per signup / paying user: spend and payments lag. */
const COST_WINDOW = 30;

// ─── Acquisition by Source ────────────────────────────────────────────────────

type GraphNode = GraphConfig["nodes"][string];

/** Source types in display order, with the node id suffix and color. */
const acquisitionSources = [
  { id: "search", sourceType: AcquisitionSource.SEARCH, color: GREEN },
  { id: "referrer", sourceType: AcquisitionSource.REFERRER, color: BLUE },
  { id: "utm_campaign", sourceType: AcquisitionSource.CAMPAIGN, color: CYAN },
  { id: "creator_code", sourceType: AcquisitionSource.CREATOR, color: PURPLE },
  { id: "referral_code", sourceType: AcquisitionSource.REFERRAL, color: AMBER },
  { id: "direct", sourceType: AcquisitionSource.DIRECT, color: PINK },
  {
    id: "unattributed",
    sourceType: AcquisitionSource.UNATTRIBUTED,
    color: ORANGE,
  },
];

/** One pane per metric, one series per source type. */
const acquisitionPanes = [
  { prefix: "human_visits", metric: AcquisitionMetric.VISITS, pane: 0 },
  { prefix: "signups", metric: AcquisitionMetric.SIGNUPS, pane: 1 },
  { prefix: "payers", metric: AcquisitionMetric.PAYERS, pane: 2 },
];

const acquisitionNodes = acquisitionPanes.flatMap(({ prefix, metric, pane }) =>
  acquisitionSources
    // Every visit has an observed source; "unattributed" only exists for
    // accounts whose lead never recorded one.
    .filter(
      ({ sourceType }) =>
        metric !== AcquisitionMetric.VISITS ||
        sourceType !== AcquisitionSource.UNATTRIBUTED,
    )
    .map(({ id, sourceType, color }, index) => {
      const node: GraphNode = {
        endpointPath: GROWTH_ACQUISITION_ALIAS,
        params: {
          metric,
          sourceType,
          excludeBots: metric === AcquisitionMetric.VISITS,
        },
        pane,
        color,
      };
      return { nodeId: `${prefix}_${id}`, x: pane * 320, y: index * 120, node };
    }),
);

const acquisitionConfig: GraphConfig = {
  nodes: Object.fromEntries(
    acquisitionNodes.map(({ nodeId, node }) => [nodeId, node]),
  ),
  positions: Object.fromEntries(
    acquisitionNodes.map(({ nodeId, x, y }) => [nodeId, { x, y }]),
  ),
  edges: [],
  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Spend & Cost per Payer ───────────────────────────────────────────────────

const spendConfig: GraphConfig = {
  nodes: {
    // ── Pane 0: what the money bought ──
    signups: {
      endpointPath: GROWTH_ACQUISITION_ALIAS,
      params: { metric: AcquisitionMetric.SIGNUPS },
      pane: 0,
      color: PURPLE,
    },
    new_payers: {
      endpointPath: GROWTH_ACQUISITION_ALIAS,
      params: { metric: AcquisitionMetric.PAYERS },
      pane: 0,
      color: GREEN,
    },
    renewals: {
      endpointPath: GROWTH_FUNNEL_STEP_ALIAS,
      params: { step: FunnelStep.RETAINED },
      pane: 0,
      color: PINK,
    },

    // ── Pane 1: paid marketing spend, all currencies in USD ──
    spend_usd: {
      endpointPath: GROWTH_CHANNEL_SPEND_ALIAS,
      params: { convertToUsd: true },
      pane: 1,
      color: ORANGE,
    },

    // ── Rolling sums feeding the cost ratios ──
    spend_usd_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: COST_WINDOW },
      visible: false,
    },
    signups_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: COST_WINDOW },
      visible: false,
    },
    new_payers_30d: {
      endpointPath: WINDOW_SUM_ALIAS,
      params: { size: COST_WINDOW },
      visible: false,
    },

    // ── Pane 2: 30-day cost per signup / paying user (USD) ──
    usd_per_signup_30d: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 2,
      color: PURPLE,
    },
    usd_per_payer_30d: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 2,
      color: RED,
    },
  },

  edges: [
    { from: "spend_usd", to: "spend_usd_30d" },
    { from: "signups", to: "signups_30d" },
    { from: "new_payers", to: "new_payers_30d" },
    { from: "spend_usd_30d", to: "usd_per_signup_30d", toHandle: "a" },
    { from: "signups_30d", to: "usd_per_signup_30d", toHandle: "b" },
    { from: "spend_usd_30d", to: "usd_per_payer_30d", toHandle: "a" },
    { from: "new_payers_30d", to: "usd_per_payer_30d", toHandle: "b" },
  ],

  positions: {
    signups: { x: 0, y: 0 },
    new_payers: { x: 0, y: 120 },
    renewals: { x: 0, y: 240 },
    spend_usd: { x: 0, y: 360 },
    spend_usd_30d: { x: 300, y: 360 },
    signups_30d: { x: 300, y: 0 },
    new_payers_30d: { x: 300, y: 120 },
    usd_per_signup_30d: { x: 600, y: 60 },
    usd_per_payer_30d: { x: 600, y: 240 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "lead-acquisition",
    name: "Acquisition by Source",
    description:
      "Where people come from, per day: human visits (bots and crawlers removed), signups and first-time payers by source type (search, external referrer, UTM campaign, creator code, referral code, direct). Per-code and per-campaign numbers: Lead acquisition report.",
    config: acquisitionConfig,
  },
  {
    slug: "growth-funnel",
    name: "Spend & Cost per Payer",
    description:
      "Paid marketing spend per day (all currencies in USD, each entry spread over its period) against signups, first-time payers and second-month renewals, with 30-day USD cost per signup and per paying user.",
    config: spendConfig,
  },
];
