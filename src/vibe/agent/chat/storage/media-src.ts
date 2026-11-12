/**
 * Render-time resolution of stored media URLs (client-safe).
 *
 * Stored references are portable root-relative paths (see ./storage-url.ts);
 * legacy rows may still hold an absolute URL minted on another host (a baked
 * `http://localhost:3000`, a dev instance, the pre-move `/agent/...` route).
 * Every storage URL is rebased onto the instance that is serving the page:
 * root-relative in the browser (same origin, no SSR/hydration drift), absolute
 * on surfaces without an origin (native, CLI, MCP).
 */

import { coreClientEnv, platform } from "next-vibe/core/env-client";

import { toPortableStorageUrl } from "./storage-url";

export function resolveMediaSrc(
  url: string,
  options?: { absolute?: boolean },
): string {
  const portable = toPortableStorageUrl(url);
  if (!portable.startsWith("/")) {
    return portable;
  }
  if (!options?.absolute && !platform.isReactNative) {
    return portable;
  }
  return `${coreClientEnv.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}${portable}`;
}
