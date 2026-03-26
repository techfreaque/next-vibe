/**
 * MCP Hot Loader
 * Loads route handlers and endpoint definitions fresh on every call by constructing
 * import specifiers dynamically at runtime — opaque to bundler static analysis.
 * Only used by the MCP server; all other platforms use the normal cached loaders.
 */

import "server-only";

import type { CreateApiEndpointAny } from "../shared/types/endpoint-base";
import type { GenericHandlerBase } from "../shared/endpoints/route/handler";

/**
 * Import a route handler fresh (cache-busted) by tool name.
 * Uses absolute filesystem paths so no bundler alias resolution is needed at runtime.
 */
export async function getRouteHandlerFresh(
  toolName: string,
): Promise<GenericHandlerBase | null> {
  const { routeHotPaths } =
    await import("@/app/api/[locale]/system/generated/route-hot-paths");
  const entry = routeHotPaths[toolName];
  if (!entry) {
    return null;
  }
  // Construct file:// URL at runtime — bundler cannot statically trace this
  const url = `file://${entry.absPath}?t=${Date.now()}`;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const mod = await import(/* @vite-ignore */ url);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (mod.tools?.[entry.method] ?? null) as GenericHandlerBase | null;
}

/**
 * Import an endpoint definition fresh (cache-busted) by tool name.
 * Uses absolute filesystem paths so no bundler alias resolution is needed at runtime.
 */
export async function getEndpointFresh(
  toolName: string,
): Promise<CreateApiEndpointAny | null> {
  const { endpointHotPaths } =
    await import("@/app/api/[locale]/system/generated/endpoint-hot-paths");
  const entry = endpointHotPaths[toolName];
  if (!entry) {
    return null;
  }
  const url = `file://${entry.absPath}?t=${Date.now()}`;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const mod = await import(/* @vite-ignore */ url);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (mod.default?.[entry.method] ?? null) as CreateApiEndpointAny | null;
}
