/**
 * Default Tool Counts
 *
 * Computed once at boot per role. The server picks the right count
 * for the current user and passes a single number to the frontend.
 */

import "server-only";

import { definitionsRegistry } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definitions/registry";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import type { JwtPayloadType } from "../../user/auth/types";
import { getDefaultToolIds } from "./constants";

/** Cached counts per role key */
let publicCount: number | null = null;
let customerCount: number | null = null;
let adminCount: number | null = null;
let adminMaxAllPlatformsCount: number | null = null;

const MOCK_ID = "00000000-0000-0000-0000-000000000000";

function ensureComputed(): void {
  if (publicCount !== null) {
    return;
  }

  publicCount = definitionsRegistry.getEndpointsForUser(Platform.AI, {
    isPublic: true as const,
    leadId: MOCK_ID,
    roles: [UserRole.PUBLIC],
  }).length;

  customerCount = definitionsRegistry.getEndpointsForUser(Platform.AI, {
    id: MOCK_ID,
    leadId: MOCK_ID,
    isPublic: false as const,
    roles: [UserRole.CUSTOMER],
  }).length;

  adminCount = definitionsRegistry.getEndpointsForUser(Platform.AI, {
    id: MOCK_ID,
    leadId: MOCK_ID,
    isPublic: false as const,
    roles: [UserRole.ADMIN],
  }).length;

  // Max across all platforms for admin — used for marketing copy
  const allPlatforms = Object.values(Platform);
  const seen = new Set<string>();
  const adminUser = {
    id: MOCK_ID,
    leadId: MOCK_ID,
    isPublic: false as const,
    roles: [UserRole.ADMIN],
  };
  for (const platform of allPlatforms) {
    const eps = definitionsRegistry.getEndpointsForUser(platform, adminUser);
    for (const ep of eps) {
      seen.add(`${ep.path.join("/")}|${ep.method}`);
    }
  }
  adminMaxAllPlatformsCount = seen.size;
}

/**
 * Get the default active tool count for this user's role.
 * Returns a single number — the count of DEFAULT_TOOL_IDS (core 8).
 */
export function getDefaultActiveToolCount(): number {
  return getDefaultToolIds().length;
}

/**
 * Get the total available tool count for this user's role.
 * Computed once at boot, cached forever.
 */
export function getTotalToolCount(user: JwtPayloadType): number {
  ensureComputed();

  if (user.isPublic) {
    return publicCount!;
  }
  if (user.roles.includes(UserRole.ADMIN)) {
    return adminCount!;
  }
  return customerCount!;
}

/**
 * Get the maximum tool count (admin-level, AI platform).
 * Represents the full platform capability regardless of user role.
 * Useful for marketing/landing pages that show total platform tools.
 */
export function getMaxToolCount(): number {
  ensureComputed();
  return adminCount!;
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
