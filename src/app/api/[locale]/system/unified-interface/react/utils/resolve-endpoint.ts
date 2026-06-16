"use client";

import { PATH_SEPARATOR } from "../../shared/utils/path";
import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";

/**
 * Resolve an endpoint definition by alias or slash-path.
 * Uses the generated endpoint registry (lazy import to avoid circular deps).
 */
export async function resolveEndpoint(
  toolName: string,
): Promise<CreateApiEndpointAny | null> {
  const { getEndpoint } =
    await import("@/app/api/[locale]/system/generated/endpoint");
  // Try exact alias first
  const direct = await getEndpoint(toolName);
  if (direct) {
    return direct;
  }
  // Slash-style path: try underscore form with common HTTP methods
  if (toolName.includes("/")) {
    const underscored = toolName.replace(/\//g, "_");
    for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE"] as const) {
      const candidate = await getEndpoint(`${underscored}_${method}`);
      if (candidate) {
        return candidate;
      }
    }
  }
  return null;
}

