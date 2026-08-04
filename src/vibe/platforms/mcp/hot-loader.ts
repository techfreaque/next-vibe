/**
 * MCP Hot Loader
 * Loads route handlers and endpoint definitions fresh on every call by constructing
 * import specifiers dynamically at runtime - opaque to bundler static analysis.
 * Only used by the MCP server; all other platforms use the normal cached loaders.
 */

import "server-only";

import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { getSrcDir } from "@/env/paths";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { GenericHandlerBase } from "../../core/route/handler";

/**
 * Build a cache-busted file:// URL for a generated path relative to the source root.
 *
 * The hot-paths maps store relative paths so they stay valid across checkouts;
 * the source root is re-derived here at runtime. `pathToFileURL` rather than a
 * `file://` template: on Windows the latter yields "file://C:/...", which
 * parses "C:" as the URL host and fails to import.
 */
function toFreshUrl(relPath: string): string {
  const url = pathToFileURL(join(getSrcDir(), relPath));
  url.searchParams.set("t", String(Date.now()));
  return url.href;
}

/**
 * Import a route handler fresh (cache-busted) by tool name.
 * Resolves to an absolute path at runtime so no bundler alias resolution is needed.
 */
export async function getRouteHandlerFresh(
  toolName: string,
): Promise<GenericHandlerBase | null> {
  const { routeHotPaths } = await import("@/generated/routes/hot-paths");
  const entry = routeHotPaths[toolName];
  if (!entry) {
    return null;
  }
  // Constructed at runtime - bundler cannot statically trace this
  const url = toFreshUrl(entry.relPath);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const mod = await import(/* webpackIgnore: true */ /* @vite-ignore */ url);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (mod.tools?.[entry.method] ?? null) as GenericHandlerBase | null;
}

/**
 * Import an endpoint definition fresh (cache-busted) by tool name.
 * Resolves to an absolute path at runtime so no bundler alias resolution is needed.
 */
export async function getEndpointFresh(
  toolName: string,
): Promise<CreateApiEndpointAny | null> {
  const { endpointHotPaths } = await import("@/generated/endpoints/hot-paths");
  const entry = endpointHotPaths[toolName];
  if (!entry) {
    return null;
  }
  const url = toFreshUrl(entry.relPath);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const mod = await import(/* webpackIgnore: true */ /* @vite-ignore */ url);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (mod.default?.[entry.method] ?? null) as CreateApiEndpointAny | null;
}
