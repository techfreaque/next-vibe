/**
 * Tool ENUMERATION over generated endpoint meta.
 *
 * Pure: no locale, no database, no agent context, no remote instance. Everything
 * here is a function of `EndpointMeta[]` plus the caller's platform and roles,
 * which is exactly the half a fork can take verbatim — the surfaces differ in how
 * they PRESENT a tool list, not in which tools a platform/role may enumerate.
 */

import type { EndpointMeta } from "../../core/definition/endpoints-meta";
import { permissionsRegistry } from "../../core/permissions/registry";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { UserRoleValue } from "../../identity/roles/enum";
import { Platform } from "../../platforms/platforms";

/**
 * Listing must agree with execution, so both go through permissionsRegistry.
 * This used to be a local re-implementation of checkPlatformAccess/hasEndpointPermission
 * over string[] roles, and had drifted: it missed WEB_OFF for Platform.AI, blocked
 * Platform.CRON on AI_TOOL_OFF instead of WEB_OFF, ignored NEXT_PUBLIC_VIBE_MODE and
 * allowedClientRoles, and detected markers by string suffix. The generated meta now
 * carries typed UserRoleValue[], so the registry's own API takes it directly.
 */
export function filterMetaForUser(
  meta: EndpointMeta[],
  platform: Platform,
  user: JwtPayloadType,
): EndpointMeta[] {
  return meta.filter(
    (m) =>
      permissionsRegistry.checkPlatformAccess(m.allowedRoles, platform)
        .allowed &&
      // Meta carries no allowedClientRoles: client-route fallback is a web-render
      // concern and never widens what a tool listing may show.
      permissionsRegistry.checkRolePermission(
        m.allowedRoles,
        undefined,
        user,
        platform,
      ),
  );
}

export function getMetaPlatforms(roles: readonly UserRoleValue[]): Platform[] {
  return Object.values(Platform).filter(
    (p) => permissionsRegistry.checkPlatformAccess(roles, p).allowed,
  );
}

/** Check if a tool matches any id in a set (by toolName or alias). */
export function inSet(m: EndpointMeta, ids: Set<string>): boolean {
  return ids.has(m.toolName) || m.aliases.some((a) => ids.has(a));
}

export function buildCategories(meta: EndpointMeta[]): Array<{
  name: string;
  count: number;
  subCategories?: Array<{ name: string; count: number }>;
}> {
  const categoryMap = new Map<string, Map<string, number>>();
  for (const tool of meta) {
    const cat = tool.category;
    const sub = tool.subCategory ?? cat;
    const subMap = categoryMap.get(cat) ?? new Map<string, number>();
    subMap.set(sub, (subMap.get(sub) ?? 0) + 1);
    categoryMap.set(cat, subMap);
  }
  return [...categoryMap.entries()]
    .toSorted((a, b) => a[0].localeCompare(b[0]))
    .map(([name, subMap]) => {
      const subCategories = [...subMap.entries()]
        .toSorted((a, b) => a[0].localeCompare(b[0]))
        .map(([subName, count]) => ({ name: subName, count }));
      const count = subCategories.reduce((n, s) => n + s.count, 0);
      return {
        name,
        count,
        ...(subCategories.length > 1 && { subCategories }),
      };
    });
}
