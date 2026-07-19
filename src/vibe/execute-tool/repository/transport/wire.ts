/**
 * Wire shaping — caller-side fieldDefaults resolution and File marshalling
 * for the JSON wire (both legs share these).
 */
import "server-only";

import type { WidgetData } from "next-vibe/core/utils/json";

import type { RouteExecuteContext } from "../types";

/**
 * Resolve the target tool's declared requestDefaults with the CALLER's context
 * and inject the patch into the outgoing input BEFORE dispatch. Unlike
 * fieldDefaults (which only fills absent fields), requestDefaults always wins —
 * it replaces any AI-provided value so server-authoritative values (e.g. the
 * active favorite's model for a platform-hidden field) cannot be overridden by
 * stale AI example params.
 *
 * Locally these same resolvers run inside the route handler (createGenericHandler)
 * before validation; the receiving peer lacks the caller's skill/favorite context,
 * so context-dependent defaults must resolve HERE before dispatch — same resolvers,
 * same context, either way ("transport is invisible", no per-tool shortcuts).
 */
export async function resolveCallerRequestDefaults(params: {
  ctx: RouteExecuteContext;
  toolName: string;
  input: Record<string, WidgetData> | null;
}): Promise<Record<string, WidgetData> | null> {
  const { ctx, toolName } = params;
  const { getRouteHandler } = await import("@/generated/routes/handlers");
  const handler = await getRouteHandler(toolName);
  const requestDefaults = handler?.requestDefaults;
  if (!requestDefaults) {
    return params.input;
  }
  const defaultsCtx = {
    user: ctx.user,
    locale: ctx.locale,
    platform: ctx.platform,
    toolExecutionContext: ctx.toolExecutionContext,
  };
  const patch = await requestDefaults(defaultsCtx, {
    requestData: params.input ?? {},
    urlPathParams: {},
  });
  if (!patch || Object.keys(patch).length === 0) {
    return params.input;
  }
  const merged = { ...params.input, ...patch } as Record<string, WidgetData>;
  ctx.logger.debug(
    "[RouteExecute] Pre-resolved caller request defaults for remote dispatch",
    { toolName, fields: Object.keys(patch) },
  );
  return merged;
}

/**
 * Resolve the target tool's declared fieldDefaults with the CALLER's context
 * and inject any resolved values into the outgoing input. Locally these same
 * resolvers run inside the route handler (createGenericHandler); the receiving
 * peer lacks the caller's skill/favorite context, so context-dependent
 * defaults must resolve HERE before dispatch — same resolvers, same context,
 * uniformly for EVERY tool ("transport is invisible", no per-tool shortcuts).
 */
export async function resolveCallerFieldDefaults(params: {
  ctx: RouteExecuteContext;
  toolName: string;
  input: Record<string, WidgetData> | null;
}): Promise<Record<string, WidgetData> | null> {
  const { ctx, toolName } = params;
  const { getRouteHandler } = await import("@/generated/routes/handlers");
  const handler = await getRouteHandler(toolName);
  const fieldDefaults = handler?.fieldDefaults;
  if (!fieldDefaults) {
    return params.input;
  }
  let input = params.input;
  for (const [field, resolver] of Object.entries(fieldDefaults)) {
    if (!resolver || input?.[field] !== undefined) {
      continue;
    }
    const value = await resolver({
      user: ctx.user,
      locale: ctx.locale,
      platform: ctx.platform,
      toolExecutionContext: ctx.toolExecutionContext,
    });
    if (value !== undefined) {
      input = { ...input, [field]: value };
      ctx.logger.debug(
        "[RouteExecute] Pre-resolved caller field default for remote dispatch",
        { toolName, field },
      );
    }
  }
  return input;
}

/**
 * Recursively convert File instances inside a wire payload to the base64
 * object shape ({ filename, mimeType, data }) that endpoint file-field
 * schemas accept as the JSON alternative. Files stringify to {} on the wire —
 * without this, every cross-instance call carrying an attachment fails
 * validation on the receiving side.
 */
export async function marshalFilesForWire(
  input: Record<string, WidgetData> | null,
): Promise<Record<string, WidgetData> | null> {
  if (input === null) {
    return null;
  }
  const marshalValue = async (value: WidgetData): Promise<WidgetData> => {
    if (value instanceof File) {
      return {
        filename: value.name,
        mimeType: value.type,
        data: Buffer.from(await value.arrayBuffer()).toString("base64"),
      };
    }
    if (Array.isArray(value)) {
      return Promise.all(value.map((item) => marshalValue(item)));
    }
    if (
      value !== null &&
      typeof value === "object" &&
      !(value instanceof Date)
    ) {
      const out: Record<string, WidgetData> = {};
      for (const [k, v] of Object.entries(value)) {
        out[k] = await marshalValue(v);
      }
      return out;
    }
    return value;
  };
  const result: Record<string, WidgetData> = {};
  for (const [key, value] of Object.entries(input)) {
    result[key] = await marshalValue(value);
  }
  return result;
}
