/**
 * Help Repository — per-surface PRESENTATION.
 *
 * What remains here is everything that knows about THIS build's surfaces: which
 * platforms count as compact, which locale to load meta for, and how each surface
 * words its hints. The parts that do not vary by surface live in ./repository/:
 *   - meta-filter.ts  pure enumeration (platform/role filtering, categories)
 *   - serialize.ts    pure EndpointMeta → wire shape
 *   - paging.ts       result-size thresholds
 *   - remote.ts       remote-instance discovery (needs a second instance)
 *   - agent-pins.ts   DB-backed favorites/skill pin resolution
 *
 * Uses static endpoints-meta (generated) for all listing/filtering/searching.
 * Only loads full endpoint definitions for parameter schema in detail view.
 */

import "server-only";

import { z } from "zod";

import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";
import {
  enrichJsonSchemaFromFields,
  zodSchemaToJsonSchema,
} from "../core/definition/endpoint-to-metadata";
import type { EndpointMeta } from "../core/definition/endpoints-meta";
import { FieldUsage } from "../core/definition/enums";
import { coreClientEnv as envClient } from "../core/env-client";
import type { CountryLanguage } from "../core/i18n/core/config";
import { permissionsRegistry } from "../core/permissions/registry";
import type { InferJwtPayloadTypeFromRoles } from "../core/route/handler-roles";
import { type ResponseType, success } from "../core/route/response.schema";
import { searchField, searchItems } from "../core/utils/in-memory-search";
import { parseError } from "../core/utils/parse-error";
import {
  filterUserPermissionRoles,
  PlatformMarker,
  UserPermissionRole,
  type UserPermissionRoleValue,
  type UserRoleValue,
} from "../identity/roles/enum";
import type { EndpointLogger } from "../logger/types";
import { Platform } from "../platforms/platforms";
import { generateSchemaForUsage } from "../unified-ui/_shared/utils";
import type {
  HelpGetRequestOutput,
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
  HelpToolParameters,
} from "./definition";
import { scopedTranslation } from "./i18n";
import {
  resolveAgentPins,
  resolveEffectiveUser,
} from "./repository/agent-pins";
import {
  buildCategories,
  filterMetaForUser,
  getMetaPlatforms,
} from "./repository/meta-filter";
import {
  COMPACT_CATEGORY_ONLY_THRESHOLD,
  COMPACT_DEFAULT_PAGE_SIZE,
  COMPACT_FULL_DETAIL_THRESHOLD,
  HUMAN_DEFAULT_PAGE_SIZE,
} from "./repository/paging";
import { getToolsFromRemoteInstance } from "./repository/remote";
import {
  loadEndpointForMeta,
  serializeMeta,
  serializeMetaMinimal,
} from "./repository/serialize";

export class HelpRepository {
  /** Surfaces that pay per token, so detail is rationed as the result set grows. */
  private static isCompactPlatform(platform: Platform): boolean {
    return (
      platform === Platform.AI ||
      platform === Platform.MCP ||
      platform === Platform.CRON
    );
  }

  private static getParameterSchema(
    endpoint: CreateApiEndpointAny,
    locale: CountryLanguage,
    platform: Platform,
    userRoles: readonly (typeof UserPermissionRoleValue)[],
    logger: EndpointLogger,
  ): HelpToolParameters | null {
    if (!endpoint.fields) {
      return null;
    }
    try {
      // AI/MCP consumers get the SAME schema the tools-loader exposes:
      // fields with hiddenForPlatforms[AI] are stripped. Advertising a field
      // the executor then silently drops (validation strips it, fieldDefaults
      // fill the favorite's value) sends the model into doomed retries — e.g.
      // generate_video's model param: the AI picked a valid i2v model, the
      // request ran with the favorite's t2v default and failed upstream.
      // Non-compact (human) consumers see the schema for their OWN real platform.
      const schemaPlatform = HelpRepository.isCompactPlatform(platform)
        ? Platform.AI
        : platform;
      const requestDataSchema = generateSchemaForUsage(
        endpoint.fields,
        FieldUsage.RequestData,
        userRoles,
        schemaPlatform,
      ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;
      const urlPathParamsSchema = generateSchemaForUsage(
        endpoint.fields,
        FieldUsage.RequestUrlParams,
        userRoles,
        schemaPlatform,
      ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;
      const combinedShape: Record<string, z.ZodTypeAny> = {};
      if (requestDataSchema instanceof z.ZodObject) {
        Object.assign(combinedShape, requestDataSchema.shape);
      }
      if (urlPathParamsSchema instanceof z.ZodObject) {
        Object.assign(combinedShape, urlPathParamsSchema.shape);
      }
      if (Object.keys(combinedShape).length === 0) {
        return null;
      }
      const schema = zodSchemaToJsonSchema(z.object(combinedShape));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const topLevelFields: Record<string, any> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldsObj = endpoint.fields as any;
      if (
        fieldsObj &&
        typeof fieldsObj === "object" &&
        "children" in fieldsObj
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const children = (fieldsObj as any).children;
        if (children && typeof children === "object") {
          Object.assign(topLevelFields, children);
        }
      }
      enrichJsonSchemaFromFields(schema, topLevelFields);

      if (
        locale &&
        schema &&
        typeof schema === "object" &&
        "properties" in schema
      ) {
        const props = (
          schema as {
            properties: Record<
              string,
              Record<string, string | number | boolean | null | string[]>
            >;
          }
        ).properties;
        const { t } = endpoint.scopedTranslation.scopedT(locale);
        for (const [key, prop] of Object.entries(props)) {
          if (prop && typeof prop === "object" && !prop.description) {
            const field = topLevelFields[key];
            if (
              field &&
              typeof field === "object" &&
              "description" in field &&
              typeof field.description === "string"
            ) {
              try {
                prop.description = t(field.description);
              } catch {
                /* missing translation - skip */
              }
            }
          }
        }
      }

      if (schema && "~standard" in schema) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { "~standard": _std, ...clean } = schema;
        return clean;
      }
      return schema;
    } catch (e) {
      logger.error(
        "[getParameterSchema] caught error for",
        parseError(e),
        endpoint.path,
      );
      return null;
    }
  }

  static async getTools(
    data: HelpGetRequestOutput,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    locale: CountryLanguage,
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<ResponseType<HelpGetResponseOutput>> {
    // Three distinct output paths, one definition. Each shows/requires only what
    // its surface needs:
    //   - compact (AI + MCP + CRON): token-lean, gradual detail as results shrink
    //   - cli: full per-tool detail, no web stats/pin machinery
    //   - web (everything else): rich stats, pin tabs, category-first browsing
    // Compact wins even for admin: an admin inspecting `--platform=ai` must see
    // exactly what the AI consumer receives, not the web stats view.
    const isCompact = HelpRepository.isCompactPlatform(platform);

    // Remote instance tool discovery - bypass local registry
    if (data.instanceId) {
      // The local instance's own name resolves to the local listing — callers
      // (and models) may address the instance explicitly.
      const { RemoteConnectionRepository: SelfRepo } =
        await import("../remote-connection/repository");
      const selfInstanceId = SelfRepo.deriveDefaultSelfInstanceId();
      if (data.instanceId !== selfInstanceId) {
        return getToolsFromRemoteInstance(
          data.instanceId,
          data,
          user,
          locale,
          platform,
          logger,
          isCompact,
        );
      }
    }

    const { t } = scopedTranslation.scopedT(locale);

    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    const userRoles = filterUserPermissionRoles(user.roles);

    const effectivePageSize =
      data.pageSize ??
      (isCompact ? COMPACT_DEFAULT_PAGE_SIZE : HUMAN_DEFAULT_PAGE_SIZE);
    const currentPage = data.page ?? 1;

    const isDev = envClient.NODE_ENV !== "production";
    const currentEnv: "development" | "production" = isDev
      ? "development"
      : "production";

    // Load only the locale we need.
    const localeToFile: Record<string, string> = {
      "de-DE": "de",
      "pl-PL": "pl",
    };
    const localeFile = localeToFile[locale] ?? "en";
    const metaModule = await (localeFile === "de"
      ? import("@/generated/endpoints/meta/de")
      : localeFile === "pl"
        ? import("@/generated/endpoints/meta/pl")
        : import("@/generated/endpoints/meta/en"));
    const allMeta = metaModule.endpointsMeta;

    // Discovery platform - what platform context are we listing tools for?
    // Compact (AI/MCP/CRON): always the actual platform so counts/filtering match
    //   exactly what that surface exposes — including for admins inspecting it.
    // Admin web UI: CLI (broadest platform) so all tools are visible for inspection;
    //   the web platform would silently drop WEB_OFF tools, making "All" misleadingly small.
    // Non-admins on web/CLI: their actual calling platform.
    const discoveryPlatform: Platform = isCompact
      ? platform
      : isAdmin
        ? Platform.CLI
        : platform;

    // View-as-role: admin can impersonate a lower role to see what that role sees
    const viewAsRole = isAdmin ? data.viewAsRole : undefined;
    const effectiveUser = resolveEffectiveUser(user, viewAsRole);

    // Filter meta by platform + user roles
    const filteredByPlatform = filterMetaForUser(
      allMeta,
      discoveryPlatform,
      effectiveUser,
    );

    // Admin platform badges - derived directly from allowedRoles in meta.
    // Web/CLI admin only: compact (AI/MCP) consumers don't get the 10-entry
    // platforms array per tool — pure token bloat for an AI tool list.
    const getToolPlatforms = (tool: EndpointMeta): Platform[] | undefined => {
      if (!isAdmin || isCompact) {
        return undefined;
      }
      return getMetaPlatforms(tool.allowedRoles);
    };

    // MCP tool discovery is opt-in: the list returned over MCP must agree with the MCP
    // server's own tools/list (platforms/mcp/server/protocol-handler.ts), which requires
    // MCP_VISIBLE. filterMetaForUser goes through checkPlatformAccess, where MCP
    // *execution* is opt-out — so without this narrowing the listing advertises every
    // MCP-callable tool rather than the discovery set. MCP only: the other compact
    // platforms (AI/CRON) have no opt-in marker and stay opt-out.
    // Execution stays opt-out, so allAccessibleMeta below is deliberately NOT narrowed:
    // detail lookups still resolve a non-visible tool by exact name.
    let platformFilteredMeta =
      discoveryPlatform === Platform.MCP
        ? filteredByPlatform.filter(
            (m) =>
              permissionsRegistry.checkMcpDiscoveryAccess(m.allowedRoles)
                .allowed,
          )
        : filteredByPlatform;
    // Keep an unfiltered copy for detail-mode lookups (detail should search all accessible tools,
    // not just the active pinned/allowed subset chosen for list display).
    const allAccessibleMeta = filteredByPlatform;

    // includeProdOnly: exclude PRODUCTION_OFF tools
    if (isAdmin && data.includeProdOnly) {
      platformFilteredMeta = platformFilteredMeta.filter(
        (m) => !m.allowedRoles.includes(PlatformMarker.PRODUCTION_OFF),
      );
    }

    const totalCount = platformFilteredMeta.length;

    // statsFilter: web platforms (NEXT_PAGE, NEXT_API, TRPC, FRAME, ELECTRON) default to "pinned"
    // to avoid loading all tools unnecessarily in the web UI.
    // Compact platforms (AI/MCP/CRON) and CLI default to "all" - no pinned filtering needed.
    const isWebPlatform =
      !isCompact &&
      platform !== Platform.CLI &&
      platform !== Platform.CLI_PACKAGE;
    const statsFilter =
      data.statsFilter ??
      (isWebPlatform ? (isAdmin ? "webPinned" : "pinned") : "all");

    // aiMeta: always AI-platform tools for the current user's role — independent of any
    // admin platformFilter. Used for AI pin/allowed counts and stats, and as the fallback
    // cascade base when pin resolution fails.
    const aiMeta = filterMetaForUser(allMeta, Platform.AI, effectiveUser);

    const pins =
      !isCompact && !user.isPublic
        ? await resolveAgentPins({
            allMeta,
            aiMeta,
            effectiveUser,
            user,
            viewAsRole,
            statsFilter,
            isAdmin,
            logger,
          })
        : null;
    if (pins?.filteredMeta) {
      platformFilteredMeta = pins.filteredMeta;
    }

    // Admin web/CLI debug fields. Excluded from compact (AI/MCP) output — a tool
    // list returned to an agent shouldn't carry server env/platform debug noise.
    const adminMeta =
      isAdmin && !isCompact
        ? {
            currentPlatform: platform,
            currentEnv,
          }
        : {};

    // Web-only: server-computed counts for the pinned/allowed/all filter tabs.
    // allAiToolIds: flat list of all AI-platform tool names — used by the widget when
    // materializing from null (favorite has no explicit allowlist yet).
    // skillPinnedDefault: skill's pinnedTools (null = no skill restriction → use role defaults).
    // skillAllowedDefault: skill's availableTools (null = all tools allowed).
    const statsMeta = !isCompact
      ? {
          pinnedCount: pins?.pinnedCount,
          allowedCount: pins?.allowedCount,
          webPinnedCount: pins?.webPinnedCount,
          ...(isAdmin && {
            cliAllowedCount: pins?.cliAllowedCount,
            mcpPinnedCount: pins?.mcpPinnedCount,
            mcpAllowedCount: pins?.mcpAllowedCount,
          }),
          allAiToolIds: (pins?.aiMetaForStats ?? aiMeta).map((m) => m.toolName),
          skillPinnedDefault: pins?.pinnedBase?.map((e) => e.toolId) ?? null,
          skillAllowedDefault: pins?.cascadeBase?.map((e) => e.toolId) ?? null,
        }
      : {};

    // Detail mode - single tool with full parameter schema
    if (data.toolName) {
      const needle = data.toolName.toLowerCase().trim();
      // Use allAccessibleMeta (pre-statsFilter) so detail lookups work for any accessible tool,
      // not just the ones currently pinned/allowed in the active list view.
      const matchedTool = allAccessibleMeta.find(
        (m) =>
          m.toolName.toLowerCase() === needle ||
          (m.aliases.length > 0 && m.aliases[0].toLowerCase() === needle) ||
          m.aliases.some((a) => a.toLowerCase() === needle),
      );
      if (!matchedTool) {
        return success({
          tools: [] satisfies HelpToolMetadataSerialized[],
          totalCount,
          matchedCount: 0,
          hint: t("get.hints.toolNotFound", { name: data.toolName }),
          ...adminMeta,
          ...statsMeta,
        });
      }
      const endpoint = await loadEndpointForMeta(matchedTool);
      const parameters = endpoint
        ? (HelpRepository.getParameterSchema(
            endpoint,
            locale,
            platform,
            userRoles,
            logger,
          ) ?? undefined)
        : undefined;
      const callAs = matchedTool.toolName;
      return success({
        tools: [
          serializeMeta(
            matchedTool,
            parameters,
            true,
            getToolPlatforms(matchedTool),
            isCompact,
          ),
        ],
        totalCount,
        matchedCount: 1,
        hint: t("get.hints.detailMode", {
          name: callAs,
          aliases:
            matchedTool.aliases.length > 0
              ? t("get.hints.detailModeAliases", {
                  aliases: matchedTool.aliases.join(", "),
                })
              : "",
        }),
        ...adminMeta,
        ...statsMeta,
      });
    }

    const query = data.query?.toLowerCase().trim();
    const category = data.category?.toLowerCase().trim();

    // Auto-upgrade to detail mode on exact name/alias match.
    // Uses allAccessibleMeta (pre-statsFilter) so exact lookups work even for
    // tools excluded from the current stats view (e.g. AI_TOOL_OFF tools when
    // statsFilter="all" replaces platformFilteredMeta with aiMeta).
    if (query && !category) {
      const exactMatch = allAccessibleMeta.find(
        (m) =>
          m.toolName.toLowerCase() === query ||
          m.aliases.some((a) => a.toLowerCase() === query),
      );
      if (exactMatch) {
        const endpoint = await loadEndpointForMeta(exactMatch);
        const parameters = endpoint
          ? (HelpRepository.getParameterSchema(
              endpoint,
              locale,
              platform,
              userRoles,
              logger,
            ) ?? undefined)
          : undefined;
        const callAs = exactMatch.toolName;
        return success({
          tools: [
            serializeMeta(
              exactMatch,
              parameters,
              true,
              getToolPlatforms(exactMatch),
              isCompact,
            ),
          ],
          totalCount,
          matchedCount: 1,
          hint: t("get.hints.detailMode", {
            name: callAs,
            aliases:
              exactMatch.aliases.length > 0
                ? t("get.hints.detailModeAliases", {
                    aliases: exactMatch.aliases.join(", "),
                  })
                : "",
          }),
          ...adminMeta,
          ...statsMeta,
        });
      }
    }

    let filtered = platformFilteredMeta;

    if (query) {
      filtered = searchItems(filtered, {
        query,
        fields: [
          searchField((m) => m.toolName, 1.0),
          searchField((m) => m.aliases, 0.8),
          searchField((m) => m.description, 0.3),
          searchField((m) => m.tags, 0.2),
          searchField((m) => m.category, 0.1),
        ],
      });
    }

    if (category) {
      // category field accepts both parent category key (e.g. "ai") and subCategory name (e.g. "Search").
      // Match against category first; if no tools match, try subCategory fallback.
      const byCat = filtered.filter((m) =>
        m.category?.toLowerCase().includes(category),
      );
      filtered =
        byCat.length > 0
          ? byCat
          : filtered.filter((m) =>
              (m.subCategory ?? m.category)?.toLowerCase().includes(category),
            );
    }

    // Web: if no filters at all (no query, no category, no toolName), return categories only.
    // This lets the sidebar start page show folders without loading every tool.
    // CLI/compact platforms skip this to preserve existing "return everything" behaviour.
    const isCli =
      platform === Platform.CLI || platform === Platform.CLI_PACKAGE;
    const hasFilters =
      !!(query ?? category ?? data.toolName) ||
      statsFilter === "pinned" ||
      statsFilter === "webPinned" ||
      statsFilter === "allowed" ||
      statsFilter === "all" ||
      statsFilter === "cliAllowed" ||
      statsFilter === "mcpPinned" ||
      statsFilter === "mcpAllowed";

    // Categories always reflect the active filtered set (statsFilter + query + category).
    // Computed from `filtered` so counts stay aligned regardless of which view is active.
    const categories = buildCategories(filtered);

    // When every matched tool shares one category, that category is constant —
    // for compact (AI/MCP) drop it from each tool AND from the (single-entry)
    // categories array. The hint still names the filter context.
    const singleCategory = isCompact && categories.length === 1;

    if (!hasFilters && !isCompact && !isCli) {
      return success({
        tools: [] satisfies HelpToolMetadataSerialized[],
        totalCount,
        matchedCount: 0,
        categories,
        ...adminMeta,
        ...statsMeta,
      });
    }

    // Sort by category (A-Z), then by tool name (A-Z) within each category
    filtered.sort((a, b) => {
      const catCmp = a.category.localeCompare(b.category);
      if (catCmp !== 0) {
        return catCmp;
      }
      return a.toolName.localeCompare(b.toolName);
    });

    const matchedCount = filtered.length;
    const totalPages = Math.ceil(matchedCount / effectivePageSize);
    const safePage = Math.min(currentPage, Math.max(1, totalPages));
    const offset = (safePage - 1) * effectivePageSize;
    const pageSlice = filtered.slice(offset, offset + effectivePageSize);

    if (isCompact) {
      if (matchedCount === 0) {
        return success({
          tools: [] satisfies HelpToolMetadataSerialized[],
          totalCount,
          matchedCount,
          categories,
          hint: t("get.hints.noToolsMatched"),
          ...adminMeta,
        });
      }
      if (matchedCount <= COMPACT_FULL_DETAIL_THRESHOLD) {
        const tools: HelpToolMetadataSerialized[] = await Promise.all(
          pageSlice.map(async (m) => {
            const endpoint = await loadEndpointForMeta(m);
            const parameters = endpoint
              ? (HelpRepository.getParameterSchema(
                  endpoint,
                  locale,
                  platform,
                  userRoles,
                  logger,
                ) ?? undefined)
              : undefined;
            return serializeMeta(
              m,
              parameters,
              true,
              getToolPlatforms(m),
              true, // compact=true (we're inside isCompact block)
              singleCategory,
            );
          }),
        );
        return success({
          tools,
          totalCount,
          matchedCount,
          hint: t("get.hints.compactFullSchema", { count: matchedCount }),
          ...adminMeta,
        });
      }
      // Above COMPACT_CATEGORY_ONLY_THRESHOLD: return only categories, no tool names (saves tokens)
      if (matchedCount > COMPACT_CATEGORY_ONLY_THRESHOLD) {
        return success({
          tools: [] satisfies HelpToolMetadataSerialized[],
          totalCount,
          matchedCount,
          categories,
          hint: t("get.hints.compactCategoryOnly", {
            matched: matchedCount,
            categories: categories.length,
            listThreshold: COMPACT_CATEGORY_ONLY_THRESHOLD,
            detailThreshold: COMPACT_FULL_DETAIL_THRESHOLD,
          }),
          ...adminMeta,
        });
      }
      // Between COMPACT_FULL_DETAIL_THRESHOLD and COMPACT_CATEGORY_ONLY_THRESHOLD: show tool names
      const paginationHint =
        totalPages > 1
          ? t("get.hints.pagination", {
              page: safePage,
              total: totalPages,
              next: safePage + 1,
            })
          : "";
      return success({
        tools: pageSlice.map((m) =>
          serializeMetaMinimal(
            m,
            getToolPlatforms(m),
            true, // compact=true
            singleCategory,
          ),
        ),
        totalCount,
        matchedCount,
        // Drop the categories array when it would just echo the single category
        // the caller already filtered by.
        ...(singleCategory ? {} : { categories }),
        hint: t("get.hints.compactList", {
          matched: matchedCount,
          detailThreshold: COMPACT_FULL_DETAIL_THRESHOLD,
          pagination: paginationHint,
        }),
        // Pagination metadata only when it carries signal (more than one page).
        ...(totalPages > 1
          ? { currentPage: safePage, effectivePageSize, totalPages }
          : {}),
        ...adminMeta,
      });
    }

    // CLI only: auto-upgrade to full detail when result set is small enough.
    // Web skips this — parameter schemas are only needed for CLI/AI/MCP consumers.
    if (isCli && matchedCount <= COMPACT_FULL_DETAIL_THRESHOLD) {
      const tools: HelpToolMetadataSerialized[] = await Promise.all(
        pageSlice.map(async (m) => {
          const endpoint = await loadEndpointForMeta(m);
          const parameters = endpoint
            ? (HelpRepository.getParameterSchema(
                endpoint,
                locale,
                platform,
                userRoles,
                logger,
              ) ?? undefined)
            : undefined;
          return serializeMeta(m, parameters, true, getToolPlatforms(m));
        }),
      );
      return success({
        tools,
        totalCount,
        matchedCount,
        hint:
          matchedCount === 0
            ? t("get.hints.noToolsMatched")
            : t("get.hints.cliFullDetail", { count: matchedCount }),
        ...adminMeta,
        ...statsMeta,
      });
    }

    return success({
      tools: pageSlice.map((m) =>
        serializeMeta(m, undefined, false, getToolPlatforms(m), isCompact),
      ),
      totalCount,
      matchedCount,
      categories,
      hint:
        totalPages > 1
          ? t("get.hints.cliList", {
              page: safePage,
              total: totalPages,
              matched: matchedCount,
            })
          : t("get.hints.cliListSingle", { matched: matchedCount }),
      currentPage: safePage,
      effectivePageSize,
      totalPages,
      ...adminMeta,
      ...statsMeta,
    });
  }
}
