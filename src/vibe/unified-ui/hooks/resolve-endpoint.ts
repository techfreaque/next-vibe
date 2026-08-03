"use client";

import { PATH_SEPARATOR } from "../../core/core-utils/path";
import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { Methods } from "../../core/definition/enums";

/**
 * Resolve an endpoint definition by alias or slash-path.
 * Slash-paths must be either:
 *   - An alias (no slashes): e.g. "leads-list"
 *   - A full path with method: e.g. "leads/lead/[id]/GET"
 *   - A full path without method (legacy fallback, tries all methods)
 * Uses the generated endpoint registry (lazy import to avoid circular deps).
 */
export async function resolveEndpoint(
  toolName: string,
): Promise<CreateApiEndpointAny | null> {
  const { getEndpoint } = await import("@/generated/endpoints/endpoint");

  // Try exact alias first (single segment, no slashes)
  const direct = await getEndpoint(toolName);
  if (direct) {
    return direct;
  }

  // Slash-style path: convert "/" → PATH_SEPARATOR and strip dynamic route brackets
  // ("[id]" → "id") to match canonical alias-map keys.
  if (toolName.includes("/")) {
    const sanitized = toolName.replaceAll(/\[|\]/g, "");
    const underscored = sanitized.replaceAll("/", PATH_SEPARATOR);

    // If the last segment is an HTTP method, use it directly — no guessing.
    const lastSegment: Methods = sanitized
      .split("/")
      .at(-1)
      ?.toUpperCase() as Methods;
    if (lastSegment && Methods[lastSegment]) {
      return (await getEndpoint(underscored)) ?? null;
    }

    // Fallback: path without method — try all methods (legacy / alias-only URLs)
    for (const method of Object.values(Methods)) {
      const candidate = await getEndpoint(
        `${underscored}${PATH_SEPARATOR}${method}`,
      );
      if (candidate) {
        return candidate;
      }
    }
  }

  return null;
}
