/**
 * Vibe Sense - GraphConfig Zod Schema
 *
 * Runtime validation for graph configs.
 * Used by create/edit endpoints to reject invalid configurations
 * before they reach the engine.
 */

import { z } from "zod";

import { GraphResolutionDB } from "../enum";

// ─── Enums ──────────────────────────────────────────────────────────────────

const resolutionSchema = z.enum(GraphResolutionDB);

const persistModeSchema = z.enum(["always", "never", "snapshot"]);

// ─── Display Fields ──────────────────────────────────────────────────────────

const displayFields = {
  pane: z.number().int().min(0).max(10).nullable().optional(),
  color: z.string().max(50).optional(),
  visible: z.boolean().optional(),
  scale: z.enum(["left", "right"]).optional(),
};

// ─── Unified Node Config ─────────────────────────────────────────────────────

const graphNodeSchema = z.object({
  /** Alias or dot-joined path identifying the endpoint */
  endpointPath: z.string().min(1).optional(),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]).optional(),
  resolution: resolutionSchema.optional(),
  lookback: z.number().int().min(0).optional(),
  /** Static parameter values (period, op, value, stdDev, etc.) */
  params: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()]),
    )
    .optional(),
  outputField: z.string().optional(),
  persist: persistModeSchema.optional(),
  ...displayFields,
});

// ─── Graph Edges ────────────────────────────────────────────────────────────

const graphEdgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  fromHandle: z.string().optional(),
  toHandle: z.string().optional(),
});

// ─── Trigger Config ─────────────────────────────────────────────────────────

const triggerConfigSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("cron"), schedule: z.string().min(5) }),
  z.object({ type: z.literal("manual") }),
]);

// ─── Position ───────────────────────────────────────────────────────────────

const nodePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// ─── Full GraphConfig ───────────────────────────────────────────────────────

export const graphConfigSchema = z.object({
  nodes: z.record(z.string(), graphNodeSchema),
  edges: z.array(graphEdgeSchema),
  positions: z.record(z.string(), nodePositionSchema).optional(),
  resolution: resolutionSchema.optional(),
  trigger: triggerConfigSchema,
});

/** Inferred GraphConfig type - single source of truth */
export type GraphConfigInferred = z.infer<typeof graphConfigSchema>;
export type GraphNodeConfig = GraphConfigInferred["nodes"][string];
