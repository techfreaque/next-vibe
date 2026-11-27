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
import { searchField, searchItems } from "../../core/utils/in-memory-search";
import type { JwtPayloadType } from "../../identity/auth/types";
import {
  UserPermissionRole,
  type UserRoleValue,
} from "../../identity/roles/enum";
import { Platform } from "../../platforms/platforms";
import { getAdminToolRole } from "../admin-classification";
import type { HelpGetRequestOutput } from "../definition";

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

export function resolveEffectiveUser(
  user: JwtPayloadType,
  viewAsRole: HelpGetRequestOutput["viewAsRole"],
): JwtPayloadType {
  if (user.isPublic || viewAsRole === UserPermissionRole.PUBLIC) {
    return {
      leadId: user.leadId,
      roles: [UserPermissionRole.PUBLIC],
      isPublic: true,
    };
  }
  return viewAsRole ? { ...user, roles: [viewAsRole] } : user;
}

/** Check if a tool matches any id in a set (by toolName or alias). */
export function inSet(m: EndpointMeta, ids: Set<string>): boolean {
  return ids.has(m.toolName) || m.aliases.some((a) => ids.has(a));
}

export function getRecordSearchTargets(
  categories: readonly { recordSearch?: { alias: string; field: string } }[],
  webCatalog: EndpointMeta[],
): { alias: string; field: string; label: string }[] {
  const seenTargets = new Set<string>();
  return categories.flatMap(({ recordSearch }) => {
    if (!recordSearch) {
      return [];
    }
    const key = `${recordSearch.alias}:${recordSearch.field}`;
    if (seenTargets.has(key)) {
      return [];
    }
    seenTargets.add(key);
    const endpoint = webCatalog.find(
      (tool) =>
        tool.method === "GET" &&
        (tool.toolName === recordSearch.alias ||
          tool.aliases.includes(recordSearch.alias)),
    );
    return endpoint
      ? [{ ...recordSearch, label: endpoint.titleShort || endpoint.title }]
      : [];
  });
}

/** Alias of the catalog-root overview report the viewer may open (lowest category order wins). */
export function getCatalogOverview(
  categories: readonly { order: number; catalogOverview?: string }[],
  webCatalog: EndpointMeta[],
): string | undefined {
  const candidates = categories
    .filter(
      (category): category is { order: number; catalogOverview: string } =>
        typeof category.catalogOverview === "string",
    )
    .toSorted((a, b) => a.order - b.order);
  for (const { catalogOverview } of candidates) {
    const endpoint = webCatalog.find(
      (tool) =>
        tool.method === "GET" &&
        (tool.toolName === catalogOverview ||
          tool.aliases.includes(catalogOverview)),
    );
    if (endpoint) {
      return catalogOverview;
    }
  }
  return undefined;
}

/** Prefer directly usable lists and create forms for a business term.
 * Exact aliases and named actions keep their direct lookup behavior.
 */
export function rankWorkspaceMatches(
  ranked: EndpointMeta[],
  query: string,
): EndpointMeta[] {
  const normalized = query.trim().toLowerCase();
  const terms = normalized.split(/\s+/u);
  const priority = (tool: EndpointMeta): number => {
    if (
      [tool.toolName, ...tool.aliases].some(
        (name) => name.toLowerCase() === normalized,
      )
    ) {
      return 0;
    }
    const titles = [tool.titleShort, tool.title].map(
      (title) => title?.toLowerCase() ?? "",
    );
    if (terms.length > 1 && titles.includes(normalized)) {
      return 0;
    }
    if (!titles.some((title) => terms.every((term) => title.includes(term)))) {
      return 4;
    }
    const role = getAdminToolRole(tool);
    if (role === "destination") {
      return 1;
    }
    return role === "create" ? 2 : 3;
  };
  return ranked
    .map((tool) => ({ tool, rank: priority(tool) }))
    .toSorted((a, b) => a.rank - b.rank)
    .map(({ tool }) => tool);
}

interface CatalogMetadata {
  category?: string;
  subCategory?: string;
}

export function searchCatalog<
  TTool extends CatalogMetadata & {
    title?: string;
    titleShort?: string;
    aliases?: string[];
    description: string;
    tags?: string[];
  },
>(tools: TTool[], query: string, getName: (tool: TTool) => string): TTool[] {
  const ranked = searchItems(tools, {
    query,
    requireAllTerms: true,
    fields: [
      searchField(getName, 1),
      searchField((tool) => tool.aliases ?? [], 0.9),
      searchField((tool) => tool.title ?? "", 0.9),
      searchField((tool) => tool.titleShort ?? "", 0.7),
      searchField((tool) => tool.description, 0.3),
      searchField((tool) => tool.tags ?? [], 0.2),
      searchField((tool) => tool.category ?? "", 0.1),
    ],
  });
  const normalized = query.trim().toLowerCase();
  const exact = (tool: TTool): boolean =>
    [tool.titleShort, tool.title, getName(tool), ...(tool.aliases ?? [])].some(
      (text) => text?.toLowerCase() === normalized,
    );
  return ranked.toSorted(
    (left, right) => Number(exact(right)) - Number(exact(left)),
  );
}

export function filterCatalogCategory<TTool extends CatalogMetadata>(
  tools: TTool[],
  category: string | undefined,
  subCategory: string | undefined,
  exactCategory: boolean,
): TTool[] {
  const parent = category?.trim().toLowerCase();
  const child = subCategory?.trim().toLowerCase();
  let filtered = tools;
  if (parent) {
    if (exactCategory) {
      filtered = tools.filter(
        (tool) => tool.category?.toLowerCase() === parent,
      );
    } else {
      const byParent = tools.filter((tool) =>
        tool.category?.toLowerCase().includes(parent),
      );
      filtered =
        byParent.length > 0
          ? byParent
          : tools.filter((tool) =>
              (tool.subCategory ?? tool.category)
                ?.toLowerCase()
                .includes(parent),
            );
    }
  }
  return child
    ? filtered.filter(
        (tool) => (tool.subCategory ?? tool.category)?.toLowerCase() === child,
      )
    : filtered;
}

export function buildCategories(
  meta: CatalogMetadata[],
  includeSingleSubCategory = false,
): Array<{
  name: string;
  count: number;
  subCategories?: Array<{ name: string; count: number }>;
}> {
  const categoryMap = new Map<string, Map<string, number>>();
  for (const tool of meta) {
    const cat = tool.category;
    if (!cat) {
      continue;
    }
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
        ...((subCategories.length > 1 || includeSingleSubCategory) && {
          subCategories,
        }),
      };
    });
}
