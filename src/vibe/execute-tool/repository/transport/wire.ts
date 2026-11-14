/**
 * Wire shaping — caller-side fieldDefaults resolution and File marshalling
 * for the JSON wire (both legs share these).
 */
import "server-only";

import { repairEnumShorthands } from "../../../core/route/enum-shorthand-repair";
import type { WidgetData } from "../../../core/utils/json";
import { filterUserPermissionRoles } from "../../../identity/roles/enum";
import { isAgentPlatform, isCliPlatform } from "../../../platforms/platforms";
import { collectServerDefaults } from "../../../unified-ui/_shared/utils";
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
  // Definition-level `serverDefault`s (e.g. rename-thread's threadId from the
  // active stream) resolve the same way: the peer has no access to this
  // execution's stream context, so they must be filled in before dispatch.
  const { getEndpoint } = await import("@/generated/endpoints/endpoint");
  const endpoint = await getEndpoint(toolName);
  const definitionDefaults = endpoint
    ? collectServerDefaults(
        endpoint.fields,
        filterUserPermissionRoles(ctx.user.roles),
        ctx.platform,
      )
    : {};
  const fieldDefaults = { ...definitionDefaults, ...handler?.fieldDefaults };
  if (Object.keys(fieldDefaults).length === 0) {
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
 * Repair enum shorthands ("active" for "statusFilter.active") against the
 * target tool's schemas with the CALLER's platform, BEFORE dispatch. Locally
 * the request validator does this for lenient (CLI/agent) callers; the peer
 * receives the call over HTTP as a machine caller and validates strictly, so
 * without this the same CLI/AI call succeeds locally and 400s remotely.
 * Same repair, same leniency rule, either way.
 */
export async function repairCallerEnumShorthands(params: {
  ctx: RouteExecuteContext;
  toolName: string;
  input: Record<string, WidgetData> | null;
}): Promise<Record<string, WidgetData> | null> {
  const { ctx, toolName, input } = params;
  if (
    input === null ||
    !(isAgentPlatform(ctx.platform) || isCliPlatform(ctx.platform))
  ) {
    return input;
  }
  const { getEndpoint } = await import("@/generated/endpoints/endpoint");
  const endpoint = await getEndpoint(toolName);
  if (!endpoint) {
    return input;
  }
  let current: Record<string, WidgetData> = input;
  const repairedFields: string[] = [];
  for (const schema of [
    endpoint.requestSchema,
    endpoint.requestUrlPathParamsSchema,
  ]) {
    const result = repairEnumShorthands(current, schema);
    if (result.repaired.length > 0 && isWireRecord(result.data)) {
      current = result.data;
      repairedFields.push(...result.repaired);
    }
  }
  if (repairedFields.length > 0) {
    ctx.logger.debug(
      "[RouteExecute] Repaired enum shorthand for remote dispatch",
      { toolName, fields: repairedFields.join(", ") },
    );
  }
  return current;
}

function isWireRecord(value: WidgetData): value is Record<string, WidgetData> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof File)
  );
}

async function marshalWireValue(value: WidgetData): Promise<WidgetData> {
  if (value instanceof File) {
    return {
      filename: value.name,
      mimeType: value.type,
      data: Buffer.from(await value.arrayBuffer()).toString("base64"),
    };
  }
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => marshalWireValue(item)));
  }
  if (value !== null && typeof value === "object" && !(value instanceof Date)) {
    const entries = await Promise.all(
      Object.entries(value).map(async ([key, entryValue]) => [
        key,
        await marshalWireValue(entryValue),
      ]),
    );
    return Object.fromEntries(entries) as WidgetData;
  }
  return value;
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
  return (await marshalWireValue(input)) as Record<string, WidgetData>;
}
