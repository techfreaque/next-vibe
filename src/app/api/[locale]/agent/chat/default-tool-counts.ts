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
import { DEFAULT_TOOL_IDS } from "./constants";

/** Cached counts per role key */
let publicCount: number | null = null;
let customerCount: number | null = null;
let adminCount: number | null = null;

function ensureComputed(): void {
  if (publicCount !== null) {
    return;
  }

  publicCount = definitionsRegistry.getEndpointsForUser(Platform.AI, {
    isPublic: true as const,
    leadId: "00000000-0000-0000-0000-000000000000",
    roles: [UserRole.PUBLIC],
  }).length;

  customerCount = definitionsRegistry.getEndpointsForUser(Platform.AI, {
    id: "00000000-0000-0000-0000-000000000000",
    leadId: "00000000-0000-0000-0000-000000000000",
    isPublic: false as const,
    roles: [UserRole.CUSTOMER],
  }).length;

  adminCount = definitionsRegistry.getEndpointsForUser(Platform.AI, {
    id: "00000000-0000-0000-0000-000000000000",
    leadId: "00000000-0000-0000-0000-000000000000",
    isPublic: false as const,
    roles: [UserRole.ADMIN],
  }).length;
}

/**
 * Get the default active tool count for this user's role.
 * Returns a single number — the count of DEFAULT_TOOL_IDS (core 8).
 */
export function getDefaultActiveToolCount(): number {
  return DEFAULT_TOOL_IDS.length;
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
