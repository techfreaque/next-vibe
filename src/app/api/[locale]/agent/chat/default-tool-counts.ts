/**
 * Default Tool Counts
 *
 * Computed once at boot per role. The server picks the right count
 * for the current user and passes a single number to the frontend.
 *
 * Uses endpoints-meta (pure static data) — no full definition loading.
 */

import "server-only";

import { endpointsMeta } from "@/app/api/[locale]/system/generated/endpoints-meta/en";
import { permissionsRegistry } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/permissions/registry";
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

function countForPlatformAndUser(
  platform: Platform,
  user: JwtPayloadType,
): number {
  return endpointsMeta.filter((ep) => {
    const allowedRoles = ep.allowedRoles as Parameters<
      typeof permissionsRegistry.checkPlatformAccess
    >[0];
    const platformAccess = permissionsRegistry.checkPlatformAccess(
      allowedRoles,
      platform,
    );
    if (!platformAccess.allowed) {
      return false;
    }
    if (user.isPublic) {
      return allowedRoles.includes(UserRole.PUBLIC);
    }
    return user.roles.some((role) => allowedRoles.includes(role));
  }).length;
}

function ensureComputed(): void {
  if (publicCount !== null) {
    return;
  }

  publicCount = countForPlatformAndUser(Platform.AI, {
    isPublic: true as const,
    leadId: MOCK_ID,
    roles: [UserRole.PUBLIC],
  });

  customerCount = countForPlatformAndUser(Platform.AI, {
    id: MOCK_ID,
    leadId: MOCK_ID,
    isPublic: false as const,
    roles: [UserRole.CUSTOMER],
  });

  adminCount = countForPlatformAndUser(Platform.AI, {
    id: MOCK_ID,
    leadId: MOCK_ID,
    isPublic: false as const,
    roles: [UserRole.ADMIN],
  });

  // Max across all platforms for admin — deduped by path+method
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
      const allowedRoles = ep.allowedRoles as Parameters<
        typeof permissionsRegistry.checkPlatformAccess
      >[0];
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
