/**
 * Vibe Sense - Node Executor
 *
 * All nodes are endpoint nodes dispatched via RouteExecutionExecutor.
 * No switch on node type - single execution path for everything.
 */

import "server-only";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { RouteExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import type { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";

import { GraphResolution } from "../enum";
import type { GraphNodeConfig } from "../graph/schema";
import type { GraphEdge } from "../graph/types";
import {
  DataPointSchema,
  type DataPoint,
  type Resolution,
  type SignalEvent,
  type TimeRange,
} from "../shared/fields";
import { needsScaleUp, scaleUpSeries } from "../shared/range";
import { readDatapoints, writeDatapoints } from "../store/datapoints";
import { writeSignals } from "../store/signals";

// ─── System Constants ─────────────────────────────────────────────────────────

const VIBE_SENSE_SYSTEM_USER: JwtPayloadType = {
  id: "system-vibe-sense",
  leadId: "system-vibe-sense-lead",
  isPublic: false,
  roles: [UserPermissionRole.ADMIN],
};

const VIBE_SENSE_ABORT_CONTROLLER = new AbortController();

const VIBE_SENSE_STREAM_CONTEXT: ToolExecutionContext = {
  rootFolderId: DefaultFolderId.CRON,
  threadId: undefined,
  aiMessageId: undefined,
  skillId: undefined,
  headless: undefined,
  subAgentDepth: 0,
  currentToolMessageId: undefined,
  callerToolCallId: undefined,
  pendingToolMessages: undefined,
  pendingTimeoutMs: undefined,
  leafMessageId: undefined,
  waitingForRemoteResult: undefined,
  favoriteId: undefined,
  abortSignal: VIBE_SENSE_ABORT_CONTROLLER.signal,
  callerCallbackMode: undefined,
  onEscalatedTaskCancel: undefined,
  escalateToTask: undefined,
  isRevival: undefined,

  providerOverride: undefined,
};

// ─── Execution Context ────────────────────────────────────────────────────────

export interface ExecutionContext {
  requestedRange: TimeRange;
  nodeRanges: Map<string, TimeRange>;
  logger: ReturnType<typeof createEndpointLogger>;
  graphId: string;
  graphNodes: Record<string, GraphNodeConfig>;
  graphEdges: GraphEdge[];
  /**
   * Resolved output series. Keyed by "nodeId" for the default output field,
   * or "nodeId:fieldName" for named output fields (multi-output nodes).
   */
  resolvedSeries: Map<string, DataPoint[]>;
  resolvedSignals: Map<string, SignalEvent[]>;
  nodeResolutions: Map<string, Resolution>;
  graphResolution?: Resolution;
  backtestRunId?: string;
  readOnly?: boolean;
  displayResolution?: Resolution;
}

// ─── Execute Node ─────────────────────────────────────────────────────────────

/**
 * Execute a single node. All nodes dispatch via their endpoint alias.
 * Populates ctx.resolvedSeries / ctx.resolvedSignals.
 */
export async function executeNode(
  nodeId: string,
  nodeConfig: GraphNodeConfig,
  ctx: ExecutionContext,
): Promise<void> {
  const { requestedRange, graphId, readOnly } = ctx;
  const resolution =
    nodeConfig.resolution ?? ctx.graphResolution ?? GraphResolution.ONE_DAY;

  ctx.nodeResolutions.set(nodeId, resolution);

  // Gated nodes (downstream of a signal): only run when signal fired
  if (isGatedByEvaluator(nodeId, ctx)) {
    if (readOnly) {
      return;
    }
    const fired = findGatingSignals(nodeId, ctx).filter((s) => s.fired);
    if (fired.length === 0) {
      return;
    }
    if (ctx.backtestRunId) {
      return;
    }
  }

  // ReadOnly + cached: serve from store when available
  const fetchRange = ctx.nodeRanges.get(nodeId) ?? requestedRange;
  if (readOnly && nodeConfig.persist === "always") {
    const stored = await readDatapoints(nodeId, graphId, requestedRange);
    if (stored.length > 0) {
      ctx.resolvedSeries.set(nodeId, maybeScaleUp(stored, resolution, ctx));
      return;
    }
  }

  // Build inputs: standard fields + params + edge-wired series
  const inputs: Record<string, MappedValue> = {
    range: { from: fetchRange.from, to: fetchRange.to },
    resolution,
    lookback: nodeConfig.lookback ?? 0,
    ...(nodeConfig.params ?? {}),
  };

  // Wire upstream series via edge handles (fromHandle → toHandle)
  const incomingEdges = ctx.graphEdges.filter((e) => e.to === nodeId);
  for (const edge of incomingEdges) {
    const fromField = edge.fromHandle ?? "result";
    const toField = edge.toHandle ?? "source";
    const seriesKey =
      fromField === "result" ? edge.from : `${edge.from}:${fromField}`;
    const upstream = ctx.resolvedSeries.get(seriesKey);
    if (upstream) {
      inputs[toField] = upstream;
    }
  }

  // If this node expects upstream series (has incoming edges) but none resolved,
  // skip execution - calling the endpoint with missing source would fail validation.
  if (incomingEdges.length > 0 && !("source" in inputs)) {
    const hasAnyInput = incomingEdges.some((e) => {
      const toField = e.toHandle ?? "source";
      return toField in inputs;
    });
    if (!hasAnyInput) {
      return;
    }
  }

  if (!nodeConfig.endpointPath) {
    ctx.logger.debug("[vibe-sense] Node has no endpointPath, skipping", {
      nodeId,
      graphId,
    });
    return;
  }
  const response = await callEndpoint(
    nodeConfig.endpointPath,
    inputs,
    nodeId,
    ctx.logger,
  );
  if (response === null) {
    return;
  }

  // Extract result series from response
  const outputField = nodeConfig.outputField ?? "result";
  const raw = response[outputField];
  const points: DataPoint[] = Array.isArray(raw)
    ? raw.flatMap((item) => {
        const parsed = DataPointSchema.safeParse(item);
        return parsed.success ? [parsed.data] : [];
      })
    : [];

  // Extract signals if response has them
  const rawSignals = response["signals"];
  if (Array.isArray(rawSignals)) {
    const signals: SignalEvent[] = rawSignals.flatMap((item) => {
      if (
        item !== null &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        "timestamp" in item &&
        "fired" in item
      ) {
        const ts = item.timestamp;
        const f = item.fired;
        const signal: SignalEvent = {
          timestamp: ts instanceof Date ? ts : new Date(String(ts)),
          fired: Boolean(f),
        };
        if (
          "meta" in item &&
          item.meta !== null &&
          typeof item.meta === "object" &&
          !Array.isArray(item.meta)
        ) {
          signal.meta = item.meta as Record<
            string,
            string | number | boolean | null
          >;
        }
        return [signal];
      }
      return [];
    });
    if (!ctx.backtestRunId && !readOnly) {
      await writeSignals(nodeId, graphId, signals);
    }
    ctx.resolvedSignals.set(nodeId, signals);
  }

  if (points.length > 0) {
    const persist = nodeConfig.persist ?? "always";
    if (!readOnly && persist === "always") {
      await writeDatapoints(nodeId, graphId, points);
    }
    // Store the full (extended) series in resolvedSeries so downstream nodes
    // (indicators, transformers) see warm-up data even when requestedRange is
    // shorter than one resolution period (e.g. 6h cron with 1d resolution).
    // Trimming to requestedRange is only needed for display/UI, not pipeline use.
    ctx.resolvedSeries.set(nodeId, maybeScaleUp(points, resolution, ctx));
  } else if (nodeConfig.outputField !== undefined) {
    // Scalar output - store single datapoint at range end
    const scalar = response[nodeConfig.outputField];
    const numVal =
      typeof scalar === "number"
        ? scalar
        : typeof scalar === "string"
          ? parseFloat(scalar)
          : NaN;
    if (!isNaN(numVal)) {
      const point: DataPoint = { timestamp: requestedRange.to, value: numVal };
      ctx.resolvedSeries.set(nodeId, [point]);
      if (!readOnly && nodeConfig.persist === "always") {
        await writeDatapoints(nodeId, graphId, [point]);
      }
    }
  }

  // Store named output fields for multi-output nodes (e.g. bollinger: upper, middle, lower)
  // Any response field that parses as a TimeSeries gets stored as "nodeId:fieldName"
  for (const [fieldName, fieldValue] of Object.entries(response)) {
    if (
      fieldName === outputField ||
      fieldName === "signals" ||
      fieldName === "meta"
    ) {
      continue;
    }
    if (!Array.isArray(fieldValue)) {
      continue;
    }
    const parsed = fieldValue.flatMap((item) => {
      const r = DataPointSchema.safeParse(item);
      return r.success ? [r.data] : [];
    });
    if (parsed.length > 0) {
      ctx.resolvedSeries.set(
        `${nodeId}:${fieldName}`,
        maybeScaleUp(parsed, resolution, ctx),
      );
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maybeScaleUp(
  series: DataPoint[],
  nodeResolution: Resolution,
  ctx: ExecutionContext,
): DataPoint[] {
  if (
    ctx.readOnly &&
    ctx.displayResolution &&
    needsScaleUp(nodeResolution, ctx.displayResolution)
  ) {
    return scaleUpSeries(series, nodeResolution, ctx.displayResolution);
  }
  return series;
}

function isGatedByEvaluator(
  targetNodeId: string,
  ctx: ExecutionContext,
): boolean {
  return ctx.graphEdges.some((e) => {
    if (e.to !== targetNodeId) {
      return false;
    }
    const src = ctx.graphNodes[e.from];
    if (!src) {
      return false;
    }
    // Evaluator endpoints have path containing "evaluators"
    return (src.endpointPath ?? "").includes("evaluator");
  });
}

function findGatingSignals(
  targetNodeId: string,
  ctx: ExecutionContext,
): SignalEvent[] {
  for (const edge of ctx.graphEdges) {
    if (edge.to !== targetNodeId) {
      continue;
    }
    const signals = ctx.resolvedSignals.get(edge.from);
    if (signals && signals.length > 0) {
      return signals;
    }
  }
  return [];
}

// ─── Types ───────────────────────────────────────────────────────────────────

type MappedScalar = string | number | boolean | null | Date;
type MappedValue = MappedScalar | DataPoint[] | Record<string, MappedScalar>;

// ─── Endpoint Dispatch ────────────────────────────────────────────────────────

async function callEndpoint(
  endpointId: string,
  input: Record<string, MappedValue>,
  nodeId: string,
  logger: ReturnType<typeof createEndpointLogger>,
): Promise<Record<string, WidgetData> | null> {
  const toolName = endpointId;

  const data: Record<string, WidgetData> = {};
  for (const [k, v] of Object.entries(input)) {
    data[k] = coerce(v);
  }

  const result = await RouteExecutionExecutor.executeGenericHandler<
    Record<string, WidgetData>
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
    errorDetail: result.messageParams,
    nodeId,
    inputKeys: Object.keys(data),
  });
  return null;
}

function coerce(val: MappedValue): WidgetData {
  if (val instanceof Date) {
    return val.toISOString();
  }
  if (Array.isArray(val)) {
    return val.map(
      (dp): WidgetData => ({
        timestamp:
          dp.timestamp instanceof Date
            ? dp.timestamp.toISOString()
            : String(dp.timestamp),
        value: dp.value,
        ...(dp.meta ? { meta: dp.meta } : {}),
      }),
    );
  }
  if (val !== null && typeof val === "object") {
    const out: Record<string, WidgetData> = {};
    for (const [k, v] of Object.entries(val)) {
      out[k] = v instanceof Date ? v.toISOString() : v;
    }
    return out;
  }
  return val as WidgetData;
}
