/**
 * Vibe Sense — Node Executor
 *
 * Executes a single node given its resolved inputs.
 * The engine owns range arithmetic — indicators are passive.
 */

import "server-only";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { RouteExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";

import type {
  EndpointNodeConfig,
  GraphEdge,
  GraphNodeConfig,
  InputMappingValue,
} from "../graph/types";
import { GraphResolution } from "../enum";
import type { DataPoint, TimeRange, Resolution } from "../indicators/types";
import { getIndicator, getInputIds, getLookback } from "../indicators/registry";
import {
  isDerivedIndicator,
  isMultiValueIndicator,
  isSourceIndicator,
} from "../indicators/types";
import {
  accumulateLookback,
  extendRangeByLookback,
  needsScaleUp,
  scaleUpSeries,
  trimSeries,
} from "../indicators/range";
import { writeDatapoints, readDatapoints } from "../store/datapoints";
import { writeSignals } from "../store/signals";
import { getCached, setCached } from "../store/cache";
import { clampTransform } from "../transformers/clamp";
import { deltaTransform } from "../transformers/delta";
import { fieldPickTransform } from "../transformers/field-pick";
import { jsonPathTransform } from "../transformers/json-path";
import { mergeTransform } from "../transformers/merge";
import { ratioTransform } from "../transformers/ratio";
import { scriptTransform } from "../transformers/script";
import { windowTransform } from "../transformers/window";
import { thresholdEvaluate } from "../evaluators/threshold";
import { crossoverEvaluate } from "../evaluators/crossover";
import { andEvaluate, notEvaluate, orEvaluate } from "../evaluators/and";
import { scriptEvaluate } from "../evaluators/script";
import type { SignalEvent } from "../store/signals";

// ─── System Constants (endpoint dispatch) ────────────────────────────────────

const VIBE_SENSE_SYSTEM_USER: JwtPayloadType = {
  id: "system-vibe-sense",
  leadId: "system-vibe-sense-lead",
  isPublic: false,
  roles: [UserPermissionRole.ADMIN],
};

const VIBE_SENSE_STREAM_CONTEXT: ToolExecutionContext = {
  rootFolderId: DefaultFolderId.CRON,
  threadId: undefined,
  aiMessageId: undefined,
  characterId: undefined,
  modelId: undefined,
  headless: undefined,
  currentToolMessageId: undefined,
  waitingForRemoteResult: undefined,
  favoriteId: undefined,
  abortSignal: undefined,
};

// ─── Execution Context ────────────────────────────────────────────────────────

export interface ExecutionContext {
  /** The requested display range (before lookback extension) */
  requestedRange: TimeRange;
  /** Graph this execution belongs to */
  graphId: string;
  /** All graph node configs — used for resolution lookup */
  graphNodes: Record<string, GraphNodeConfig>;
  /** All graph edges — used for gating checks */
  graphEdges: GraphEdge[];
  /** Resolved series keyed by nodeId */
  resolvedSeries: Map<string, DataPoint[]>;
  /** Resolved signals keyed by nodeId */
  resolvedSignals: Map<string, SignalEvent[]>;
  /** Backtest run id — if set, actions are intercepted */
  backtestRunId?: string;
  /** Read-only mode — skip DB writes and endpoint calls (for data rendering) */
  readOnly?: boolean;
}

// ─── Execute Node ─────────────────────────────────────────────────────────────

/**
 * Execute a single node. Populates ctx.resolvedSeries / ctx.resolvedSignals.
 * All inputs must already be resolved (topological order enforced by walker).
 */
export async function executeNode(
  nodeId: string,
  nodeConfig: GraphNodeConfig,
  ctx: ExecutionContext,
): Promise<void> {
  switch (nodeConfig.type) {
    case "indicator":
      await executeIndicatorNode(nodeId, nodeConfig.indicatorId, ctx);
      break;
    case "inline-derived":
      await executeInlineDerivedNode(nodeId, nodeConfig, ctx);
      break;
    case "transformer":
      await executeTransformerNode(nodeId, nodeConfig, ctx);
      break;
    case "evaluator":
      await executeEvaluatorNode(nodeId, nodeConfig, ctx);
      break;
    case "endpoint":
      await executeEndpointNode(nodeId, nodeConfig, ctx);
      break;
  }
}

// ─── Indicator Node ───────────────────────────────────────────────────────────

async function executeIndicatorNode(
  nodeId: string,
  indicatorId: string,
  ctx: ExecutionContext,
): Promise<void> {
  const indicator = getIndicator(indicatorId);
  if (!indicator) {
    // Indicator not registered — skip node silently, caller handles missing series
    return;
  }

  const { requestedRange, graphId } = ctx;

  // Check persist: "always" — read from DB first
  if (indicator.persist === "always") {
    const stored = await readDatapoints(indicatorId, graphId, requestedRange);
    if (stored.length > 0) {
      ctx.resolvedSeries.set(nodeId, stored);
      return;
    }
  }

  // Check snapshot cache
  if (indicator.persist === "snapshot") {
    const cached = await getCached(
      indicatorId,
      requestedRange,
      indicator.resolution,
    );
    if (cached !== null) {
      ctx.resolvedSeries.set(nodeId, cached);
      return;
    }
  }

  // Compute total lookback needed by downstream derived nodes
  // For source indicators, lookback comes from their downstream consumers
  // We extend range to cover what derived nodes need
  const totalLookback = accumulateLookback(
    [indicatorId],
    getLookback,
    getInputIds,
  );
  const fetchRange = extendRangeByLookback(
    requestedRange,
    totalLookback,
    indicator.resolution,
  );

  // Pull data
  let points: DataPoint[];
  if (isSourceIndicator(indicator)) {
    const raw = await indicator.query(fetchRange);
    points = raw;
  } else if (isDerivedIndicator(indicator)) {
    // Derived indicator — resolve inputs and call derive()
    const inputSeries = indicator.inputs.map((inputId) => ({
      nodeId: inputId,
      resolution: indicator.resolution,
      points: ctx.resolvedSeries.get(inputId) ?? [],
    }));
    points = await Promise.resolve(indicator.derive(inputSeries));
  } else if (isMultiValueIndicator(indicator)) {
    // Multi-value: caller should use field-pick — return empty for direct access
    points = [];
  } else {
    points = [];
  }

  // Persist if needed (skip in readOnly mode — data endpoint)
  if (!ctx.readOnly) {
    if (indicator.persist === "always") {
      await writeDatapoints(indicatorId, graphId, points);
    } else if (indicator.persist === "snapshot") {
      await setCached(
        indicatorId,
        requestedRange,
        indicator.resolution,
        trimSeries(points, requestedRange),
      );
    }
  }

  // Trim to requested range for downstream consumption
  ctx.resolvedSeries.set(nodeId, trimSeries(points, requestedRange));
}

// ─── Inline Derived Node ──────────────────────────────────────────────────────

async function executeInlineDerivedNode(
  nodeId: string,
  nodeConfig: Extract<GraphNodeConfig, { type: "inline-derived" }>,
  ctx: ExecutionContext,
): Promise<void> {
  const inputSeries = resolveInputSeries(
    nodeConfig.inputs,
    nodeConfig.resolution,
    ctx,
  );

  const points = applyTransformerFn(
    nodeConfig.transformerFn,
    inputSeries,
    nodeConfig.transformerArgs ?? {},
  );

  ctx.resolvedSeries.set(nodeId, points);
}

// ─── Transformer Node ─────────────────────────────────────────────────────────

async function executeTransformerNode(
  nodeId: string,
  nodeConfig: Extract<GraphNodeConfig, { type: "transformer" }>,
  ctx: ExecutionContext,
): Promise<void> {
  const inputSeries = resolveInputSeriesRaw(nodeConfig.inputs, ctx);

  const points = applyTransformerFn(
    nodeConfig.fn,
    inputSeries,
    nodeConfig.args ?? {},
  );

  ctx.resolvedSeries.set(nodeId, points);
}

function applyTransformerFn(
  fn: string,
  inputs: DataPoint[][],
  args: Record<string, string | number | boolean>,
): DataPoint[] {
  const [a = [], b = []] = inputs;

  switch (fn) {
    case "merge":
      return mergeTransform(a, b);
    case "ratio":
      return ratioTransform(a, b);
    case "delta":
      return deltaTransform(a);
    case "clamp":
      return clampTransform(
        a,
        typeof args["min"] === "number" ? args["min"] : -Infinity,
        typeof args["max"] === "number" ? args["max"] : Infinity,
      );
    case "window_avg":
      return windowTransform(
        a,
        typeof args["size"] === "number" ? args["size"] : 7,
        "avg",
      );
    case "window_sum":
      return windowTransform(
        a,
        typeof args["size"] === "number" ? args["size"] : 7,
        "sum",
      );
    case "window_min":
      return windowTransform(
        a,
        typeof args["size"] === "number" ? args["size"] : 7,
        "min",
      );
    case "window_max":
      return windowTransform(
        a,
        typeof args["size"] === "number" ? args["size"] : 7,
        "max",
      );
    case "field_pick": {
      // field_pick expects a MultiValueTimeSeries keyed by field name.
      // When wired through resolvedSeries (flat DataPoint[]), we wrap
      // the first input as the "default" field so fieldPickTransform works.
      const fieldName =
        typeof args["field"] === "string" ? args["field"] : "default";
      return fieldPickTransform(
        {
          [fieldName]: {
            nodeId: "",
            resolution: GraphResolution.ONE_DAY,
            points: a,
          },
        },
        fieldName,
      );
    }
    case "json_path": {
      const path = typeof args["path"] === "string" ? args["path"] : "";
      return jsonPathTransform(a, path);
    }
    case "script": {
      const scriptFn = typeof args["fn"] === "string" ? args["fn"] : "";
      return scriptTransform(inputs, scriptFn);
    }
    default:
      return a;
  }
}

// ─── Evaluator Node ───────────────────────────────────────────────────────────

async function executeEvaluatorNode(
  nodeId: string,
  nodeConfig: Extract<GraphNodeConfig, { type: "evaluator" }>,
  ctx: ExecutionContext,
): Promise<void> {
  const { graphId, backtestRunId } = ctx;
  const inputIds = nodeConfig.inputs;

  // Scale all inputs up to evaluator resolution
  const scaledInputs = inputIds.map((inputId) => {
    const series = ctx.resolvedSeries.get(inputId) ?? [];
    const sourceRes = getSeriesResolution(inputId, ctx.graphNodes);
    if (sourceRes && needsScaleUp(sourceRes, nodeConfig.resolution)) {
      return scaleUpSeries(series, sourceRes, nodeConfig.resolution);
    }
    return series;
  });

  const args = nodeConfig.args;
  let signals: SignalEvent[] = [];

  switch (nodeConfig.evaluatorType) {
    case "threshold": {
      const threshArgs = args as
        | {
            type: "threshold";
            op: ">" | "<" | ">=" | "<=" | "==";
            value: number;
          }
        | undefined;
      const op = threshArgs?.op ?? ">";
      const value = threshArgs?.value ?? 0;
      signals = thresholdEvaluate(scaledInputs[0] ?? [], op, value);
      break;
    }
    case "crossover": {
      signals = crossoverEvaluate(scaledInputs[0] ?? [], scaledInputs[1] ?? []);
      break;
    }
    case "and": {
      // Convert series to signal groups — treat value > 0 as fired
      const signalGroups = scaledInputs.map((series) =>
        series.map((p) => ({ timestamp: p.timestamp, fired: p.value > 0 })),
      );
      signals = andEvaluate(signalGroups);
      break;
    }
    case "or": {
      const signalGroups = scaledInputs.map((series) =>
        series.map((p) => ({ timestamp: p.timestamp, fired: p.value > 0 })),
      );
      signals = orEvaluate(signalGroups);
      break;
    }
    case "not": {
      const baseSignals = (scaledInputs[0] ?? []).map((p) => ({
        timestamp: p.timestamp,
        fired: p.value > 0,
      }));
      signals = notEvaluate(baseSignals);
      break;
    }
    case "script": {
      const scriptArgs = args as { type: "script"; fn: string } | undefined;
      const scriptFn = scriptArgs?.fn ?? "";
      signals = scriptEvaluate(scaledInputs, scriptFn);
      break;
    }
    default:
      signals = [];
  }

  // Persist signals (audit trail) — unless backtest or readOnly
  if (!backtestRunId && !ctx.readOnly) {
    await writeSignals(nodeId, graphId, signals);
  }

  ctx.resolvedSignals.set(nodeId, signals);
}

// ─── Endpoint Node ────────────────────────────────────────────────────────────

/**
 * Execute an endpoint node.
 *
 * As a source (no upstream evaluator gating): called to fetch data.
 * As a sink (after evaluator): called only when upstream signal fires.
 *
 * Input mapping resolves each field from static values, upstream node outputs,
 * or signal metadata. The response can be extracted via outputField and piped
 * downstream as a data series.
 */
async function executeEndpointNode(
  nodeId: string,
  nodeConfig: EndpointNodeConfig,
  ctx: ExecutionContext,
): Promise<void> {
  const { backtestRunId, graphId, readOnly } = ctx;

  // ReadOnly mode — skip endpoint calls entirely (data rendering)
  if (readOnly) {
    return;
  }

  // Check if this node is gated by an upstream evaluator
  const isGated = isNodeGatedByEvaluator(nodeId, ctx);
  if (isGated) {
    // Find the gating evaluator's signals
    const gatingSignals = findGatingSignals(nodeId, ctx);
    const firedSignals = gatingSignals.filter((s) => s.fired);

    if (firedSignals.length === 0) {
      return; // Gate closed — skip execution
    }

    if (backtestRunId) {
      return; // Backtest mode — record but don't execute
    }
  }

  // Resolve input mapping
  const resolvedInput = resolveInputMapping(nodeConfig.inputMapping, ctx);

  // Call the endpoint internally via RouteExecutionExecutor
  const responseValue = await callEndpoint(
    nodeConfig.endpointId,
    nodeConfig.method,
    resolvedInput,
  );

  if (responseValue === null) {
    return;
  }

  // Extract output field if specified
  let outputValue: number | null = null;
  if (nodeConfig.outputField) {
    const extracted = responseValue[nodeConfig.outputField];
    if (typeof extracted === "number") {
      outputValue = extracted;
    } else if (typeof extracted === "string") {
      const parsed = parseFloat(extracted);
      if (!isNaN(parsed)) {
        outputValue = parsed;
      }
    }
  }

  if (outputValue !== null) {
    // Use the end of the requested range as timestamp (not wall-clock)
    // so cron executions with historical ranges produce correctly-timed data
    const point: DataPoint = {
      timestamp: ctx.requestedRange.to,
      value: outputValue,
    };

    ctx.resolvedSeries.set(nodeId, [point]);

    // Persist if configured
    if (nodeConfig.persist === "always") {
      await writeDatapoints(nodeId, graphId, [point]);
    }
  }
}

/**
 * Check if a node is downstream of an evaluator (gated).
 */
function isNodeGatedByEvaluator(
  targetNodeId: string,
  ctx: ExecutionContext,
): boolean {
  // Check if any evaluator has an edge leading to this node
  for (const edge of ctx.graphEdges) {
    if (edge.to === targetNodeId) {
      const sourceConfig = ctx.graphNodes[edge.from];
      if (sourceConfig?.type === "evaluator") {
        return true;
      }
    }
  }
  return false;
}

/**
 * Find the gating evaluator's signals for a node.
 */
function findGatingSignals(
  targetNodeId: string,
  ctx: ExecutionContext,
): SignalEvent[] {
  // Find evaluator nodes that directly connect to this node
  for (const edge of ctx.graphEdges) {
    if (edge.to === targetNodeId) {
      const signals = ctx.resolvedSignals.get(edge.from);
      if (signals && signals.length > 0) {
        return signals;
      }
    }
  }
  return [];
}

/**
 * Resolve input mapping values from static, upstream node output, or signal meta.
 */
type MappedValue = string | number | boolean | null | Date;

function resolveInputMapping(
  mapping: Record<string, InputMappingValue>,
  ctx: ExecutionContext,
): Record<string, MappedValue> {
  const result: Record<string, MappedValue> = {};

  for (const [fieldName, source] of Object.entries(mapping)) {
    switch (source.source) {
      case "static":
        result[fieldName] = source.value;
        break;
      case "node": {
        const nodeSeries = ctx.resolvedSeries.get(source.nodeId);
        if (nodeSeries && nodeSeries.length > 0) {
          // Get the latest value from the series
          const latest = nodeSeries[nodeSeries.length - 1];
          if (latest) {
            if (source.field === "value") {
              result[fieldName] = latest.value;
            } else if (source.field === "timestamp") {
              result[fieldName] = latest.timestamp.toISOString();
            } else if (latest.meta) {
              result[fieldName] = latest.meta[source.field] ?? null;
            }
          }
        }
        break;
      }
      case "signal": {
        // Find the first fired signal from any evaluator
        for (const signals of ctx.resolvedSignals.values()) {
          const fired = signals.find((s) => s.fired);
          if (fired?.meta) {
            result[fieldName] = fired.meta[source.field] ?? null;
            break;
          }
        }
        break;
      }
    }
  }

  return result;
}

/**
 * Call a next-vibe endpoint internally via RouteExecutionExecutor.
 * Uses the same dispatch path as MCP/CLI/cron — no HTTP round-trip.
 */
async function callEndpoint(
  endpointId: string,
  method: string,
  input: Record<string, MappedValue>,
): Promise<Record<string, string | number | null> | null> {
  const toolName = `${endpointId}_${method}`;
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);

  // Coerce MappedValue → string | number | boolean | null for the executor
  const data: Record<string, string | number | boolean | null> = {};
  for (const [key, val] of Object.entries(input)) {
    if (val instanceof Date) {
      data[key] = val.toISOString();
    } else {
      data[key] = val;
    }
  }

  const result = await RouteExecutionExecutor.executeGenericHandler<
    Record<string, string | number | null>
  >({
    toolName,
    data,
    user: VIBE_SENSE_SYSTEM_USER,
    locale: defaultLocale,
    logger,
    platform: Platform.MCP,
    streamContext: VIBE_SENSE_STREAM_CONTEXT,
  });

  if (result.success) {
    return result.data;
  }

  logger.error(`[vibe-sense] Endpoint call failed: ${toolName}`, {
    error: result.message,
  });
  return null;
}

// ─── Input Resolution Helpers ─────────────────────────────────────────────────

function resolveInputSeries(
  inputIds: string[],
  targetResolution: Resolution,
  ctx: ExecutionContext,
): DataPoint[][] {
  return inputIds.map((id) => {
    const series = ctx.resolvedSeries.get(id) ?? [];
    const sourceRes = getSeriesResolution(id, ctx.graphNodes);
    if (sourceRes && needsScaleUp(sourceRes, targetResolution)) {
      return scaleUpSeries(series, sourceRes, targetResolution);
    }
    return series;
  });
}

function resolveInputSeriesRaw(
  inputIds: string[],
  ctx: ExecutionContext,
): DataPoint[][] {
  return inputIds.map((id) => ctx.resolvedSeries.get(id) ?? []);
}

function getSeriesResolution(
  nodeId: string,
  graphNodes?: Record<string, GraphNodeConfig>,
): Resolution | null {
  // Check registry first (for indicator nodes referenced by indicatorId)
  const indicator = getIndicator(nodeId);
  if (indicator?.resolution) {
    return indicator.resolution;
  }
  // Fall back to graph config for inline-derived / transformer / evaluator nodes
  if (graphNodes) {
    const nodeConfig = graphNodes[nodeId];
    if (nodeConfig && "resolution" in nodeConfig && nodeConfig.resolution) {
      return nodeConfig.resolution;
    }
  }
  return null;
}
