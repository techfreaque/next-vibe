/**
 * Vibe Sense — GraphConfig Zod Schema
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

const transformerFnSchema = z.enum([
  "field_pick",
  "json_path",
  "merge",
  "window_avg",
  "window_sum",
  "window_min",
  "window_max",
  "ratio",
  "delta",
  "clamp",
  "script",
]);

const evaluatorTypeSchema = z.enum([
  "threshold",
  "crossover",
  "and",
  "or",
  "not",
  "script",
]);

// ─── Input Mapping ──────────────────────────────────────────────────────────

const staticInputMappingSchema = z.object({
  source: z.literal("static"),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
});

const nodeInputMappingSchema = z.object({
  source: z.literal("node"),
  nodeId: z.string().min(1),
  field: z.string().min(1),
});

const signalInputMappingSchema = z.object({
  source: z.literal("signal"),
  field: z.string().min(1),
});

const inputMappingValueSchema = z.discriminatedUnion("source", [
  staticInputMappingSchema,
  nodeInputMappingSchema,
  signalInputMappingSchema,
]);

const inputMappingSchema = z.record(z.string(), inputMappingValueSchema);

// ─── Arg Schemas ────────────────────────────────────────────────────────────

const argValueSchema = z.union([z.string(), z.number(), z.boolean()]);
const argsSchema = z.record(z.string(), argValueSchema);

// ─── Node Configs ───────────────────────────────────────────────────────────

const displayFields = {
  pane: z.number().int().min(0).max(10).optional(),
  color: z.string().max(50).optional(),
  visible: z.boolean().optional(),
};

const indicatorNodeSchema = z.object({
  type: z.literal("indicator"),
  indicatorId: z.string().min(1),
  ...displayFields,
});

const endpointNodeSchema = z.object({
  type: z.literal("endpoint"),
  id: z.string().min(1),
  endpointId: z.string().min(1),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  inputMapping: inputMappingSchema,
  outputField: z.string().optional(),
  resolution: resolutionSchema.optional(),
  persist: persistModeSchema.optional(),
  ...displayFields,
});

const inlineDerivedNodeSchema = z.object({
  type: z.literal("inline-derived"),
  id: z.string().min(1),
  inputs: z.array(z.string().min(1)),
  resolution: resolutionSchema,
  lookback: z.number().int().min(0).optional(),
  transformerFn: transformerFnSchema,
  transformerArgs: argsSchema.optional(),
  ...displayFields,
});

const transformerNodeSchema = z.object({
  type: z.literal("transformer"),
  id: z.string().min(1),
  inputs: z.array(z.string().min(1)),
  fn: transformerFnSchema,
  args: argsSchema.optional(),
  ...displayFields,
});

const evaluatorNodeSchema = z.object({
  type: z.literal("evaluator"),
  id: z.string().min(1),
  inputs: z.array(z.string().min(1)),
  inputCount: z.union([z.number().int().min(1), z.literal("variadic")]),
  evaluatorType: evaluatorTypeSchema,
  resolution: resolutionSchema,
  args: z
    .discriminatedUnion("type", [
      z.object({
        type: z.literal("threshold"),
        op: z.enum([">", "<", ">=", "<=", "=="]),
        value: z.number(),
      }),
      z.object({ type: z.literal("crossover") }),
      z.object({ type: z.literal("and") }),
      z.object({ type: z.literal("or") }),
      z.object({ type: z.literal("not") }),
      z.object({ type: z.literal("script"), fn: z.string().min(1) }),
    ])
    .optional(),
  ...displayFields,
});

const graphNodeSchema = z.discriminatedUnion("type", [
  indicatorNodeSchema,
  endpointNodeSchema,
  inlineDerivedNodeSchema,
  transformerNodeSchema,
  evaluatorNodeSchema,
]);

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
  trigger: triggerConfigSchema,
  chartOverrides: z
    .object({
      paneAssignments: z.record(z.string(), z.number()).optional(),
      colors: z.record(z.string(), z.string()).optional(),
      visibility: z.record(z.string(), z.boolean()).optional(),
    })
    .optional(),
});

/** Inferred GraphConfig type — single source of truth */
export type GraphConfigInferred = z.infer<typeof graphConfigSchema>;
