/**
 * Users Domain — Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the users domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

import type {
  GraphConfig,
  GraphSeedEntry,
} from "../system/unified-interface/vibe-sense/graph/types";
import { GraphResolution } from "../system/unified-interface/vibe-sense/enum";

// ─── User Growth ──────────────────────────────────────────────────────────────

const userGrowthConfig: GraphConfig = {
  nodes: {
    users_registered: {
      type: "indicator",
      indicatorId: "users.registered",
    },
    users_active_total: {
      type: "indicator",
      indicatorId: "users.active_total",
    },
    users_banned: {
      type: "indicator",
      indicatorId: "users.banned",
    },
    leads_created: {
      type: "indicator",
      indicatorId: "leads.created",
    },
    registrations_ma7: {
      type: "indicator",
      indicatorId: "users.registered_ma7",
    },
    lead_to_user_ratio: {
      type: "transformer",
      id: "lead_to_user_ratio",
      inputs: ["users_registered", "leads_created"],
      fn: "ratio",
      args: { clampMin: 0, clampMax: 1 },
    },
    eval_slow_growth: {
      type: "evaluator",
      id: "eval_slow_growth",
      inputs: ["registrations_ma7"],
      inputCount: 1,
      evaluatorType: "threshold",
      resolution: GraphResolution.ONE_WEEK,
      args: { type: "threshold", op: "<", value: 5 },
    },
    eval_ban_spike: {
      type: "evaluator",
      id: "eval_ban_spike",
      inputs: ["users_banned"],
      inputCount: 1,
      evaluatorType: "threshold",
      resolution: GraphResolution.ONE_DAY,
      args: { type: "threshold", op: ">", value: 5 },
    },
  },

  edges: [
    { from: "users_registered", to: "lead_to_user_ratio", toHandle: "a" },
    { from: "leads_created", to: "lead_to_user_ratio", toHandle: "b" },
    { from: "registrations_ma7", to: "eval_slow_growth" },
    { from: "users_banned", to: "eval_ban_spike" },
  ],

  positions: {
    users_registered: { x: 0, y: 0 },
    users_active_total: { x: 0, y: 120 },
    users_banned: { x: 0, y: 240 },
    leads_created: { x: 0, y: 360 },
    registrations_ma7: { x: 300, y: 0 },
    lead_to_user_ratio: { x: 300, y: 240 },
    eval_slow_growth: { x: 600, y: 0 },
    eval_ban_spike: { x: 600, y: 240 },
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
];
