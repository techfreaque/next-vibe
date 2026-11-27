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

import { CATEGORY_REGISTRY } from "@/generated/categories/registry";

import {
  isToolDiscoverable,
  isToolPinnedByDefault,
  mergeWebPins,
} from "../agent/chat/settings/tool-preferences";
import { getPreferredName } from "../core/core-utils/path";
import { isAdminToolConfigured } from "../core/definition/admin-availability.server";
import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";
import {
  enrichJsonSchemaFromFields,
  zodSchemaToJsonSchema,
} from "../core/definition/endpoint-to-metadata";
import type { EndpointMeta } from "../core/definition/endpoints-meta";
import { FieldUsage } from "../core/definition/enums";
import { coreClientEnv as envClient } from "../core/env-client";
import type { ToolExecutionContext } from "../core/execution-context";
import type { CountryLanguage } from "../core/i18n/core/config";
import { getLanguageFromLocale } from "../core/i18n/core/language-utils";
import type { InferJwtPayloadTypeFromRoles } from "../core/route/handler-roles";
import { type ResponseType, success } from "../core/route/response.schema";
import { parseError } from "../core/utils/parse-error";
import {
  filterUserPermissionRoles,
  PlatformMarker,
  UserPermissionRole,
  type UserPermissionRoleValue,
  type UserRoleValue,
} from "../identity/roles/enum";
import type { EndpointLogger } from "../logger/types";
import { dropEnumValues } from "../platforms/ai/tool-json-schema";
import { Platform } from "../platforms/platforms";
import { RunningTaskRegistry } from "../tasks/watchdog/registry";
import { generateSchemaForUsage } from "../unified-ui/_shared/utils";
import {
  buildAdminCatalogDestinations,
  getAdminCategoryLandings,
} from "./admin-catalog-model";
import { classifyAdminCatalog, getAdminToolRole } from "./admin-classification";
import type {
  HelpGetRequestOutput,
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
  HelpToolParameters,
} from "./definition";
import { scopedTranslation } from "./i18n";
import { narrowPublicPins, resolveAgentPins } from "./repository/agent-pins";
import {
  buildCategories,
  filterCatalogCategory,
  filterMetaForUser,
  getCatalogOverview,
  getMetaPlatforms,
  getRecordSearchTargets,
  rankWorkspaceMatches,
  resolveEffectiveUser,
  searchCatalog,
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
import { toolNavigationScope } from "./sidebar-path";

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
    unavailableModelIds: ReadonlySet<string>,
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
      // Model / voice ids no configured provider can serve are not offered.
      dropEnumValues(schema, unavailableModelIds);

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
    toolExecutionContext?: ToolExecutionContext,
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
    const isCli =
      platform === Platform.CLI || platform === Platform.CLI_PACKAGE;
    const isWebPlatform = !isCompact && !isCli;
    const userRoles = filterUserPermissionRoles(user.roles);
    // A normal workspace or category only needs metadata. Resolve live model
    // availability once if this request actually expands a parameter schema.
    let modelIds: Promise<ReadonlySet<string>> | undefined;
    const unavailableModelIds = (): Promise<ReadonlySet<string>> =>
      (modelIds ??= Promise.all([
        import("../agent/env-availability"),
        import("../agent/models/all-models"),
      ]).then(async ([environment, models]) =>
        models.getUnavailableModelIds(await environment.getEnvAvailability()),
      ));

    const effectivePageSize =
      data.pageSize ??
      (isCompact ? COMPACT_DEFAULT_PAGE_SIZE : HUMAN_DEFAULT_PAGE_SIZE);
    const currentPage = data.page ?? 1;

    const isDev = envClient.NODE_ENV !== "production";
    const currentEnv: "development" | "production" = isDev
      ? "development"
      : "production";

    // Load only the locale we need.
    // Meta is generated per language; any country variant reads its language.
    const language = getLanguageFromLocale(locale);
    const metadata: Record<
      typeof language,
      () => Promise<{ endpointsMeta: EndpointMeta[] }>
    > = {
      en: () => import("@/generated/endpoints/meta/en"),
      de: () => import("@/generated/endpoints/meta/de"),
      pl: () => import("@/generated/endpoints/meta/pl"),
      fr: () => import("@/generated/endpoints/meta/fr"),
      it: () => import("@/generated/endpoints/meta/it"),
      es: () => import("@/generated/endpoints/meta/es"),
      sk: () => import("@/generated/endpoints/meta/sk"),
    };
    const endMetadataLoad = RunningTaskRegistry.beginPhase(
      `help:metadata-import:${language}`,
    );
    const metaModule = await metadata[language]().finally(endMetadataLoad);
    let allMeta = metaModule.endpointsMeta.filter(isAdminToolConfigured);
    if (platform === Platform.AI && toolExecutionContext) {
      const { resolveAgentContext } =
        await import("../agent/skills/resolve-context");
      const context = await resolveAgentContext({
        favoriteId: toolExecutionContext.favoriteId,
        skillId: toolExecutionContext.skillId,
        rootFolderId: toolExecutionContext.rootFolderId,
        user,
        logger,
      });
      const allowed =
        context.availableTools &&
        new Set(
          context.availableTools.map(({ toolId }) => getPreferredName(toolId)),
        );
      allMeta = allMeta.filter(({ toolName }) => {
        const id = getPreferredName(toolName);
        return !context.deniedToolIds.has(id) && (!allowed || allowed.has(id));
      });
    }

    // Discovery platform - what platform context are we listing tools for?
    // Compact (AI/MCP/CRON): always the actual platform so counts/filtering match
    //   exactly what that surface exposes — including for admins inspecting it.
    // Admin web UI: CLI (broadest platform) so all tools are visible for inspection;
    //   the web platform would silently drop WEB_OFF tools, making "All" misleadingly small.
    // Non-admins on web/CLI: their actual calling platform.
    const discoveryPlatform: Platform = isCompact
      ? platform
      : isAdmin && !data.viewAsRole
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
    const permittedWebMeta = !isCompact
      ? filterMetaForUser(allMeta, Platform.NEXT_PAGE, effectiveUser)
      : [];
    const webMeta =
      isAdmin && isWebPlatform && !viewAsRole
        ? classifyAdminCatalog(permittedWebMeta, CATEGORY_REGISTRY)
        : permittedWebMeta;
    const allowedForProduction = (tool: EndpointMeta): boolean =>
      !isAdmin ||
      !data.includeProdOnly ||
      !tool.allowedRoles.includes(PlatformMarker.PRODUCTION_OFF);
    const webCatalog = webMeta.filter(allowedForProduction);

    const allAccessibleMeta =
      isAdmin && isWebPlatform
        ? [
            ...new Map(
              [...webMeta, ...filteredByPlatform].map((tool) => [
                tool.toolName,
                tool,
              ]),
            ).values(),
          ]
        : filteredByPlatform;

    // Admin platform badges - derived directly from allowedRoles in meta.
    // Web/CLI admin only: compact (AI/MCP) consumers don't get the 10-entry
    // platforms array per tool — pure token bloat for an AI tool list.
    const getToolPlatforms = (tool: EndpointMeta): Platform[] | undefined => {
      if (!isAdmin || isCompact) {
        return undefined;
      }
      return getMetaPlatforms(tool.allowedRoles);
    };

    // MCP_VISIBLE is only for the MCP server's own tools/list protocol response
    // (platforms/mcp/server/protocol-handler.ts). The help tool shows every tool
    // accessible on the requested platform — MCP_OFF tools are excluded by
    // filterMetaForUser via checkPlatformAccess, but MCP_VISIBLE is not a filter
    // here: it's a pin that controls auto-discovery, not execution access.
    let platformFilteredMeta = allAccessibleMeta.filter(allowedForProduction);
    const totalCount = platformFilteredMeta.length;

    // statsFilter: web platforms (NEXT_PAGE, NEXT_API, TRPC, FRAME, ELECTRON) default to "pinned"
    // to avoid loading all tools unnecessarily in the web UI.
    // Compact platforms (AI/MCP/CRON) and CLI default to "all" - no pinned filtering needed.
    const requestedFilter =
      data.statsFilter ??
      (isWebPlatform ? (isAdmin ? "webPinned" : "pinned") : "all");
    const statsFilter =
      viewAsRole &&
      (requestedFilter === "all" ||
        requestedFilter === "cliAllowed" ||
        requestedFilter === "mcpPinned" ||
        requestedFilter === "mcpAllowed" ||
        requestedFilter === "hidden")
        ? "web"
        : requestedFilter;

    // aiMeta: always AI-platform tools for the current user's role — independent of any
    // admin platformFilter. Used for AI pin/allowed counts and stats, and as the fallback
    // cascade base when pin resolution fails.
    const aiMeta = filterMetaForUser(allMeta, Platform.AI, effectiveUser);

    const pins =
      !isCompact && !user.isPublic
        ? await resolveAgentPins({
            allMeta,
            aiMeta,
            webMeta,
            effectiveUser,
            user,
            viewAsRole,
            statsFilter,
            isAdmin: isAdmin && !viewAsRole,
            chatContext: isWebPlatform ? data : undefined,
            logger,
          })
        : null;
    if (pins?.filteredMeta) {
      platformFilteredMeta = pins.filteredMeta.filter(allowedForProduction);
    } else if (statsFilter === "web" || statsFilter === "webPinned") {
      platformFilteredMeta = webCatalog;
    }
    if (!isCompact && (user.isPublic || !pins?.filteredMeta)) {
      platformFilteredMeta =
        (await narrowPublicPins(
          platformFilteredMeta,
          effectiveUser,
          statsFilter,
        )) ?? platformFilteredMeta;
    }

    const prefs = pins?.toolPreferences ?? {};
    const categoriesByKey = new Map(
      CATEGORY_REGISTRY.map(({ key, navigation }) => [key, navigation]),
    );
    const discoverable = (
      tools: EndpointMeta[],
      surface: "web" | "chat",
    ): EndpointMeta[] =>
      tools.filter((tool) =>
        isToolDiscoverable(tool, categoriesByKey.get(tool.category), surface),
      );
    const eligibleWeb = isWebPlatform ? discoverable(webCatalog, "web") : [];
    const hiddenWeb = eligibleWeb.filter(
      (tool) => prefs.webHidden?.[getPreferredName(tool.toolName)],
    );
    const visibleWeb = eligibleWeb.filter(
      (tool) => !prefs.webHidden?.[getPreferredName(tool.toolName)],
    );
    const chatView =
      statsFilter === "chat" ||
      statsFilter === "chatPinned" ||
      statsFilter === "chatHidden";
    const usesNavigation =
      isWebPlatform && (data.catalogNavigation || chatView);
    const eligibleChat = isWebPlatform
      ? discoverable(aiMeta.filter(allowedForProduction), "chat")
      : [];
    const hiddenChat = eligibleChat.filter(
      (tool) => prefs.chatHidden?.[getPreferredName(tool.toolName)],
    );
    const visibleChat = eligibleChat.filter(
      (tool) => !prefs.chatHidden?.[getPreferredName(tool.toolName)],
    );
    const webPinIds = new Set(
      mergeWebPins(
        pins?.legacyWebPins ??
          eligibleWeb
            .filter((tool) =>
              isToolPinnedByDefault(
                tool,
                categoriesByKey.get(tool.category),
                "web",
                effectiveUser,
              ),
            )
            .map(({ toolName }) => toolName),
        prefs.webPins,
      ),
    );
    const chatPinIds = new Set(
      visibleChat
        .filter(
          (tool) =>
            prefs.chatPins?.[getPreferredName(tool.toolName)] ??
            isToolPinnedByDefault(
              tool,
              categoriesByKey.get(tool.category),
              "chat",
              effectiveUser,
            ),
        )
        .map(({ toolName }) => getPreferredName(toolName)),
    );

    if (usesNavigation) {
      if (statsFilter === "web") {
        platformFilteredMeta = visibleWeb;
      } else if (statsFilter === "webPinned") {
        platformFilteredMeta = visibleWeb.filter((tool) =>
          webPinIds.has(getPreferredName(tool.toolName)),
        );
      } else if (statsFilter === "hidden") {
        platformFilteredMeta = hiddenWeb;
      } else if (statsFilter === "chat") {
        platformFilteredMeta = visibleChat;
      } else if (statsFilter === "chatPinned") {
        platformFilteredMeta = visibleChat.filter((tool) =>
          chatPinIds.has(getPreferredName(tool.toolName)),
        );
      } else if (statsFilter === "chatHidden") {
        platformFilteredMeta = hiddenChat;
      } else {
        platformFilteredMeta = platformFilteredMeta.filter(
          (tool) => !prefs.webHidden?.[getPreferredName(tool.toolName)],
        );
      }
    }
    const recordSearchTargets =
      isAdmin && isWebPlatform && !viewAsRole
        ? getRecordSearchTargets(CATEGORY_REGISTRY, visibleWeb)
        : undefined;
    const catalogOverview =
      isAdmin && isWebPlatform && !viewAsRole
        ? getCatalogOverview(CATEGORY_REGISTRY, visibleWeb)
        : undefined;
    const landings =
      isAdmin && isWebPlatform && !viewAsRole
        ? getAdminCategoryLandings(CATEGORY_REGISTRY, visibleWeb, locale)
        : undefined;

    const navigationMeta = isWebPlatform
      ? {
          navigationScope: toolNavigationScope({ ...data, viewAsRole }),
          navigationCategories: buildCategories(
            chatView ? visibleChat : platformFilteredMeta,
            true,
          ),
          webCategories: buildCategories(visibleWeb, true),
          navigationPins: { web: [...webPinIds], chat: [...chatPinIds] },
          aiAvailableToolIds: pins?.aiAvailableToolIds,
          adminCatalogDestinations: buildAdminCatalogDestinations(
            webCatalog,
            new Set(visibleWeb.map(({ toolName }) => toolName)),
          ),
        }
      : {};
    const adminMeta =
      isAdmin && !isCompact
        ? {
            currentPlatform: platform,
            currentEnv,
            adminCategoryLandings: landings,
          }
        : {};

    const catalogMeta = { ...navigationMeta, ...adminMeta };

    // Web-only: server-computed counts for the pinned/allowed/all filter tabs.
    // allAiToolIds: flat list of all AI-platform tool names — used by the widget when
    // materializing from null (favorite has no explicit allowlist yet).
    // skillPinnedDefault: skill's pinnedTools (null = no skill restriction → use role defaults).
    // skillAllowedDefault: skill's availableTools (null = all tools allowed).
    const statsMeta = !isCompact
      ? {
          pinnedCount: pins?.pinnedCount,
          allowedCount: pins?.allowedCount,
          webPinnedCount: isWebPlatform
            ? visibleWeb.filter((tool) =>
                webPinIds.has(getPreferredName(tool.toolName)),
              ).length
            : pins?.webPinnedCount,
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
      const matchedTool = allAccessibleMeta
        .filter(allowedForProduction)
        .find(
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
          ...catalogMeta,
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
            await unavailableModelIds(),
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
        ...catalogMeta,
        ...statsMeta,
      });
    }

    const query = data.query?.toLowerCase().trim();
    const category = data.category?.toLowerCase().trim();
    const searchWebCatalog =
      isWebPlatform && statsFilter === "webPinned" && !!query;

    // Auto-upgrade to detail mode on exact name/alias match.
    // Uses allAccessibleMeta (pre-statsFilter) so exact lookups work even for
    // tools excluded from the current stats view (e.g. AI_TOOL_OFF tools when
    // statsFilter="all" replaces platformFilteredMeta with aiMeta).
    if (query && !category && !isWebPlatform) {
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
              await unavailableModelIds(),
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
          ...catalogMeta,
          ...statsMeta,
        });
      }
    }

    let filtered = filterCatalogCategory(
      searchWebCatalog
        ? usesNavigation
          ? visibleWeb
          : webCatalog
        : platformFilteredMeta,
      category,
      data.subCategory,
      isWebPlatform &&
        (usesNavigation || statsFilter === "web" || !!data.subCategory),
    );

    if (query) {
      if (searchWebCatalog && !usesNavigation && isAdmin && !viewAsRole) {
        filtered = filtered.filter((tool) => !tool.admin?.hidden);
      }
      filtered = searchCatalog(filtered, query, (tool) => tool.toolName);
      if (
        isWebPlatform &&
        (statsFilter === "web" || searchWebCatalog) &&
        isAdmin &&
        !viewAsRole
      ) {
        filtered = rankWorkspaceMatches(filtered, query);
      }
    }

    if (usesNavigation && statsFilter === "web" && category && !query) {
      const landing = Object.entries(landings ?? {}).find(
        ([key]) => key.toLowerCase() === category,
      )?.[1];
      const promoted =
        !data.subCategory && landing
          ? new Set(
              [...landing.destinations, ...landing.actions].map(({ alias }) =>
                getPreferredName(alias),
              ),
            )
          : undefined;
      filtered = filtered.filter((tool) => {
        const role = getAdminToolRole(tool);
        const standaloneAction =
          role === "record" &&
          tool.admin?.role !== "record" &&
          !tool.path.some((segment) => segment.startsWith("["));
        return (
          (role === "destination" || role === "create" || standaloneAction) &&
          !promoted?.has(getPreferredName(tool.toolName))
        );
      });
    }

    // Web: if no filters at all (no query, no category, no toolName), return categories only.
    // This lets the sidebar start page show folders without loading every tool.
    // CLI/compact platforms skip this to preserve existing "return everything" behaviour.
    const hasFilters =
      !!(query ?? category ?? data.toolName) ||
      statsFilter === "pinned" ||
      statsFilter === "webPinned" ||
      statsFilter === "web" ||
      statsFilter === "hidden" ||
      chatView ||
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
        ...catalogMeta,
        ...statsMeta,
      });
    }

    // Sort by category (A-Z), then by tool name (A-Z) within each category
    if (!query) {
      filtered = filtered.toSorted(
        (a, b) =>
          a.category.localeCompare(b.category) ||
          a.title.localeCompare(b.title, locale),
      );
    }

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
          ...catalogMeta,
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
                  await unavailableModelIds(),
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
          ...catalogMeta,
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
          ...catalogMeta,
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
        ...catalogMeta,
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
                await unavailableModelIds(),
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
        ...catalogMeta,
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
      recordSearchTargets,
      catalogOverview,
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
      ...catalogMeta,
      ...statsMeta,
    });
  }
}
