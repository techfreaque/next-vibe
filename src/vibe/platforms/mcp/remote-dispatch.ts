/**
 * MCP remote-instance dispatch.
 *
 * The two places an MCP tool call can leave this process: an explicitly prefixed
 * tool name, and a routing rule that claims the call for another instance. Both
 * are pulled out of the registry because they are the only parts of MCP execution
 * that depend on `remote-connection`, which not every build ships — a vendored
 * copy without it omits this module and the two guarded call sites in
 * `registry.ts`, leaving the local path byte-identical.
 *
 * The heavy dependencies stay behind `await import(...)` exactly as they were in
 * the registry: this module is reached on every tool call, and eagerly pulling
 * `execute-tool` or `remote-connection` in would move that cost onto calls that
 * never go remote.
 */

import "server-only";

import { makeHeadlessContext } from "../../core/execution-context";
import type { ResponseType } from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../platforms";
import type { MCPExecutionContext } from "./types";

/**
 * Result of a prefixed-name dispatch.
 *
 * `failed` is kept distinct from a failed `ResponseType` so the caller can
 * reproduce the registry's original error envelope for this branch, which
 * reports `toolName` rather than the full result.
 */
export type PrefixedDispatchOutcome =
  | { readonly kind: "result"; readonly result: ResponseType<WidgetData> }
  | { readonly kind: "failed"; readonly message: string };

/**
 * Run a prefixed tool name (e.g. `hermes__tool-help_POST`) on the instance its
 * prefix names, via the unified execute-tool repository rather than the local
 * handler.
 *
 * The caller checks the `__` predicate before calling, and does so BEFORE the
 * local visibility check — the prefix means the remote instance authorizes the
 * call, so the local tool list is not consulted.
 */
export async function dispatchPrefixedToolName(
  context: MCPExecutionContext,
  logger: EndpointLogger,
): Promise<PrefixedDispatchOutcome> {
  const { RouteExecuteRepository } =
    await import("../../execute-tool/repository");
  const result = await RouteExecuteRepository.runInProcess({
    toolName: context.toolName,
    input: context.data as Record<string, WidgetData>,
    callbackMode: "wait",
    user: context.user,
    locale: context.locale,
    logger,
    // no user context — UTC (dates not user-facing here)
    toolExecutionContext: makeHeadlessContext(context.signal, undefined, "UTC"),
    platform: Platform.MCP,
  });
  if (!result.success) {
    return { kind: "failed", message: result.message };
  }
  return { kind: "result", result };
}

/**
 * Route a plain tool name to a remote instance when this user's connection rules
 * claim it. Returns `null` when the call stays local.
 *
 * Same logic as the CLI remote leg — when a target is found the call goes through
 * `runInProcess` with its `instanceId`, so direct-http and reverse-ws transports
 * are handled uniformly. Hot-reload is deliberately not applied: remote execution
 * uses the remote's own module cache.
 */
export async function dispatchRoutedTool(
  context: MCPExecutionContext,
  logger: EndpointLogger,
  toolExecutionContext: ReturnType<typeof makeHeadlessContext>,
): Promise<ResponseType<WidgetData> | null> {
  const userId =
    !context.user.isPublic && "id" in context.user
      ? context.user.id
      : undefined;
  if (!userId) {
    return null;
  }
  const { ExecuteToolRouting } =
    await import("../../remote-connection/routing");
  const target = await ExecuteToolRouting.resolveTarget({
    userId,
    locale: context.locale,
    logger,
  });
  if (!target) {
    return null;
  }
  const { RouteExecuteRepository } =
    await import("../../execute-tool/repository");
  return await RouteExecuteRepository.runInProcess({
    toolName: context.toolName,
    input: context.data as Record<string, WidgetData>,
    instanceId: target.instanceId,
    callbackMode: "wait",
    user: context.user,
    locale: context.locale,
    logger,
    toolExecutionContext,
    platform: Platform.MCP,
  });
}
