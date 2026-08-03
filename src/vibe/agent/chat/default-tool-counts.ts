/**
 * Default Tool Counts
 *
 * Computed once at boot per role. The server picks the right count
 * for the current user and passes a single number to the frontend.
 *
 * Uses endpoints-meta (pure static data) - no full definition loading.
 */

import "server-only";

import { permissionsRegistry } from "next-vibe/core/permissions/registry";
import { UserRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";

import { endpointsMeta } from "@/generated/endpoints/meta/en";

/** Cached count - max tool count across all platforms (admin-level) */
let adminMaxAllPlatformsCount: number | null = null;

const MOCK_ID = "00000000-0000-0000-0000-000000000000";

function ensureComputed(): void {
  if (adminMaxAllPlatformsCount !== null) {
    return;
  }

  // Max across all platforms for admin - deduped by path+method
  const allPlatforms = Object.values(Platform);
  const seen = new Set<string>();
  const adminUser = {
    id: MOCK_ID,
    leadId: MOCK_ID,
    isPublic: false as const,
    roles: [UserRole.ADMIN],
  };
  for (const platform of allPlatforms) {
    for (const ep of endpointsMeta) {
      const allowedRoles = ep.allowedRoles;
      const platformAccess = permissionsRegistry.checkPlatformAccess(
        allowedRoles,
        platform,
      );
      if (!platformAccess.allowed) {
        continue;
      }
      if (adminUser.roles.some((role) => allowedRoles.includes(role))) {
        seen.add(`${ep.path.join("/")}|${ep.method}`);
      }
    }
  }
  adminMaxAllPlatformsCount = seen.size;
}

/**
 * Get the maximum tool count across ALL platforms (admin-level).
 * Deduplicates by path+method so each unique endpoint is counted once.
 * This is the real "how many things can your agent do" number.
 */
export function getMaxToolCountAllPlatforms(): number {
  ensureComputed();
  return adminMaxAllPlatformsCount!;
}
