/**
 * Help Repository
 * One class, all platforms:
 *  - Tool discovery / search / detail (AI, MCP, CLI, Web)
 *  - CLI interactive terminal explorer (--interactive flag)
 *
 * Uses static endpoints-meta (generated) for all listing/filtering/searching.
 * Only loads full endpoint definitions for parameter schema in detail view.
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import {
  enrichJsonSchemaFromFields,
  zodSchemaToJsonSchema,
} from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/endpoint-to-metadata";
import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import {
  UserPermissionRole,
  type UserRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CliRequestData } from "../unified-interface/cli/runtime/parsing";
import type { CliCompatiblePlatform } from "../unified-interface/cli/runtime/route-executor";
import { generateSchemaForUsage } from "../unified-interface/shared/field/utils";
import type { CreateApiEndpointAny } from "../unified-interface/shared/types/endpoint-base";
import { FieldUsage } from "../unified-interface/shared/types/enums";
import { Platform } from "../unified-interface/shared/types/platform";
import type { HelpGetRequestOutput, HelpGetResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

// ─── Types ─────────────────────────────────────────────────────────────────

type ToolItem = HelpGetResponseOutput["tools"][number];

interface EndpointMeta {
  toolName: string;
  method: string;
  path: string[];
  allowedRoles: string[];
  aliases: string[];
  title: string;
  description: string;
  icon: string;
  category: string;
  tags: string[];
  credits?: number;
  requiresConfirmation?: boolean;
  examples?: {
    inputs?: Record<string, CliRequestData>;
    responses?: Record<string, CliRequestData>;
  };
}

/** Map user-facing platform filter to internal Platform enum */
type PlatformFilterValue = "cli" | "mcp" | "ai" | "web" | "all";

function mapFilterToPlatform(filter: PlatformFilterValue): Platform | "all" {
  switch (filter) {
    case "cli":
      return Platform.CLI;
    case "mcp":
      return Platform.MCP;
    case "ai":
      return Platform.AI;
    case "web":
      return Platform.TRPC;
    case "all":
      return "all";
  }
}

// ─── Platform/role filtering on static meta ──────────────────────────────────

const ROLE_CLI_OFF = "enums.userRole.cliOff";
const ROLE_WEB_OFF = "enums.userRole.webOff";
const ROLE_AI_TOOL_OFF = "enums.userRole.aiToolOff";
const ROLE_MCP_OFF = "enums.userRole.mcpOff";
const ROLE_MCP_VISIBLE = "enums.userRole.mcpVisible";
const ROLE_PRODUCTION_OFF = "enums.userRole.productionOff";
const ROLE_CLI_AUTH_BYPASS = "enums.userRole.cliAuthBypass";
const ROLE_SKILL_OFF = "enums.userRole.skillOff";
const ROLE_PUBLIC = "enums.userRole.public";

function checkPlatformAccess(roles: string[], platform: Platform): boolean {
  if (
    envClient.NODE_ENV === "production" &&
    !envClient.NEXT_PUBLIC_LOCAL_MODE &&
    roles.includes(ROLE_PRODUCTION_OFF)
  ) {
    return false;
  }
  switch (platform) {
    case Platform.CLI:
      return !roles.includes(ROLE_CLI_OFF);
    case Platform.MCP:
      return !roles.includes(ROLE_MCP_OFF) && !roles.includes(ROLE_CLI_OFF);
    case Platform.AI:
    case Platform.CRON:
      return !roles.includes(ROLE_AI_TOOL_OFF) && !roles.includes(ROLE_WEB_OFF);
    case Platform.REMOTE_SKILL:
      return !roles.includes(ROLE_SKILL_OFF);
    case Platform.CLI_PACKAGE:
      return (
        !roles.includes(ROLE_CLI_OFF) && roles.includes(ROLE_CLI_AUTH_BYPASS)
      );
    case Platform.NEXT_PAGE:
    case Platform.NEXT_API:
    case Platform.TRPC:
    case Platform.ELECTRON:
    case Platform.FRAME:
      return !roles.includes(ROLE_WEB_OFF);
    default:
      return true;
  }
}

function checkUserAccess(
  roles: string[],
  userRoles: string[],
  isPublic: boolean,
): boolean {
  const permRoles = roles.filter(
    (r) =>
      !r.endsWith("Off") &&
      !r.endsWith("Bypass") &&
      r !== ROLE_MCP_VISIBLE &&
      r !== ROLE_SKILL_OFF,
  );
  if (permRoles.length === 0) {
    return false;
  }
  if (permRoles.includes(ROLE_PUBLIC)) {
    return true;
  }
  if (isPublic) {
    return false;
  }
  return permRoles.some((r) => userRoles.includes(r));
}

function filterMetaForUser(
  meta: EndpointMeta[],
  platform: Platform,
  userRoles: string[],
  isPublic: boolean,
): EndpointMeta[] {
  return meta.filter((m) => {
    const platformOk = checkPlatformAccess(m.allowedRoles, platform);
    if (!platformOk) {
      return false;
    }
    return checkUserAccess(m.allowedRoles, userRoles, isPublic);
  });
}

// ─── Platform badge helpers (admin only) ─────────────────────────────────────

function getMetaPlatforms(roles: string[]): string[] {
  const out = new Set<string>();
  if (!roles.includes(ROLE_CLI_OFF)) {
    out.add("cli");
  }
  if (!roles.includes(ROLE_MCP_OFF) && !roles.includes(ROLE_CLI_OFF)) {
    out.add("mcp");
  }
  if (!roles.includes(ROLE_AI_TOOL_OFF) && !roles.includes(ROLE_WEB_OFF)) {
    out.add("ai");
  }
  if (!roles.includes(ROLE_WEB_OFF)) {
    out.add("web");
  }
  return [...out].toSorted();
}

// ─── Constants ──────────────────────────────────────────────────────────────

const COMPACT_DEFAULT_PAGE_SIZE = 25;
const HUMAN_DEFAULT_PAGE_SIZE = 500;
/** If a filtered result set is ≤ this many tools, auto-upgrade to full detail (params + examples) */
const COMPACT_FULL_DETAIL_THRESHOLD = 5;

// ─── Tool serialization helpers ──────────────────────────────────────────────

function isCompactPlatform(platform: Platform): boolean {
  return platform === Platform.AI || platform === Platform.MCP;
}

function getParameterSchema(
  endpoint: CreateApiEndpointAny,
  locale: CountryLanguage,
): ToolItem["parameters"] | null {
  if (!endpoint.fields) {
    return null;
  }
  try {
    const requestDataSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestData,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;
    const urlPathParamsSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestUrlParams,
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
    if (fieldsObj && typeof fieldsObj === "object" && "children" in fieldsObj) {
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
              /* missing translation — skip */
            }
          }
        }
      }
    }

    if (schema && "~standard" in schema) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { "~standard": _std, ...clean } = schema as Record<
        string,
        ToolItem["parameters"]
      >;
      return clean as ToolItem["parameters"];
    }
    return schema;
  } catch {
    return null;
  }
}

function serializeMeta(
  tool: EndpointMeta,
  parameters?: ToolItem["parameters"],
  includeExamples = false,
  platforms?: string[],
): ToolItem {
  return {
    name: tool.toolName,
    title: tool.title,
    id: tool.toolName,
    tags: tool.tags,
    method: tool.method,
    description: tool.description,
    category: tool.category,
    aliases: tool.aliases.length > 0 ? tool.aliases : undefined,
    requiresConfirmation: tool.requiresConfirmation,
    credits: tool.credits,
    platforms,
    parameters,
    examples: includeExamples ? tool.examples : undefined,
  };
}

function serializeMetaMinimal(
  tool: EndpointMeta,
  platforms?: string[],
): ToolItem {
  return {
    name: tool.toolName,
    title: tool.title,
    id: tool.toolName,
    tags: tool.tags,
    description: tool.description,
    category: tool.category,
    aliases: tool.aliases.length > 0 ? tool.aliases : undefined,
    credits: tool.credits,
    platforms,
  };
}

function buildMetaSearchIndex(tool: EndpointMeta): string {
  return [
    tool.title,
    tool.description,
    tool.category,
    ...tool.tags,
    tool.toolName,
    ...tool.aliases,
  ]
    .join(" ")
    .toLowerCase();
}

/** Lazy-load the full endpoint definition for parameter schema (detail view only) */
async function loadEndpointForMeta(
  tool: EndpointMeta,
): Promise<CreateApiEndpointAny | null> {
  const { getEndpoint } =
    await import("@/app/api/[locale]/system/generated/endpoint");
  return getEndpoint(tool.toolName);
}

export class HelpRepository {
  /**
   * Start interactive CLI session — Ink-based route navigator.
   */
  static async startInteractive(
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]> | undefined,
    locale: CountryLanguage,
    platform: CliCompatiblePlatform,
  ): Promise<ResponseType<{ started: boolean }>> {
    if (!user) {
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("interactive.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    const { startInteractiveHelp } = await import("./interactive.cli");
    await startInteractiveHelp(user, locale, platform);
    return success({ started: true });
  }

  static async getToolsFromRemoteInstance(
    instanceId: string,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    locale: CountryLanguage,
  ): Promise<ResponseType<HelpGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    if (user.isPublic) {
      return fail({
        message: t("get.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    const { getCapabilities } =
      await import("@/app/api/[locale]/user/remote-connection/repository");
    const capabilities = await getCapabilities(user.id, instanceId);
    if (!capabilities) {
      return success({
        tools: [],
        totalCount: 0,
        matchedCount: 0,
        hint: `No capability snapshot for instance "${instanceId}". Connect the instance and wait for a sync pulse.`,
      });
    }

    const tools: ToolItem[] = capabilities.map((cap) => {
      const prefixedId = `${instanceId}__${cap.toolName}`;
      return {
        name: prefixedId,
        title: cap.title,
        id: prefixedId,
        description: cap.description,
        category: t("category"),
        tags: [],
        executionMode: "via-execute-route" as const,
        instanceId,
      };
    });

    return success({
      tools,
      totalCount: tools.length,
      matchedCount: tools.length,
      hint: `${tools.length} tools from remote instance "${instanceId}". Use prefixed ID directly: execute-tool toolName="${instanceId}__<name>".`,
    });
  }

  static async getTools(
    data: HelpGetRequestOutput,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    locale: CountryLanguage,
    platform: Platform,
  ): Promise<ResponseType<HelpGetResponseOutput>> {
    // Remote instance tool discovery — bypass local registry
    if (data.instanceId) {
      return HelpRepository.getToolsFromRemoteInstance(
        data.instanceId,
        user,
        locale,
      );
    }

    const isCompact = isCompactPlatform(platform);
    const effectivePageSize =
      data.pageSize ??
      (isCompact ? COMPACT_DEFAULT_PAGE_SIZE : HUMAN_DEFAULT_PAGE_SIZE);
    const currentPage = data.page ?? 1;

    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

    const isDev = envClient.NODE_ENV !== "production";
    const currentEnv: "development" | "production" = isDev
      ? "development"
      : "production";

    // Load the pre-translated static meta for this locale
    const metaModule = await import(
      `@/app/api/[locale]/system/generated/endpoints-meta/${locale === "de-DE" ? "de" : locale === "pl-PL" ? "pl" : "en"}`
    );
    const allMeta: EndpointMeta[] = metaModule.endpointsMeta;

    // Discovery platform
    // When called from MCP, use CLI semantics for listing (opt-out, not MCP_VISIBLE opt-in).
    // MCP_VISIBLE only controls which tools appear as native MCP server tools — not what
    // help/execute can discover. execute-tool can call any MCP-accessible endpoint.
    let discoveryPlatform: Platform;
    const platformFilter = isAdmin ? data.platform : undefined;

    if (platformFilter) {
      const mapped = mapFilterToPlatform(platformFilter as PlatformFilterValue);
      discoveryPlatform = mapped === "all" ? Platform.CLI : mapped;
    } else if (!isAdmin && platform === Platform.NEXT_API) {
      // Non-admin users on the web tools page see AI-relevant tools
      discoveryPlatform = Platform.AI;
    } else {
      discoveryPlatform = Platform.CLI;
    }

    const userRoles = user.isPublic ? [ROLE_PUBLIC] : [...user.roles];

    // Filter meta by platform + user roles
    const filteredByPlatform = filterMetaForUser(
      allMeta,
      discoveryPlatform,
      userRoles,
      user.isPublic,
    );

    // Admin platform badges — derived directly from allowedRoles in meta
    const getToolPlatforms = (tool: EndpointMeta): string[] | undefined => {
      if (!isAdmin) {
        return undefined;
      }
      return getMetaPlatforms(tool.allowedRoles);
    };

    // When admin filters by a specific platform (not "all"), additionally filter
    let platformFilteredMeta = filteredByPlatform;
    if (platformFilter && platformFilter !== "all") {
      platformFilteredMeta = filteredByPlatform.filter((m) =>
        getMetaPlatforms(m.allowedRoles).includes(platformFilter),
      );
    }

    // includeProdOnly: exclude PRODUCTION_OFF tools
    if (isAdmin && data.includeProdOnly) {
      platformFilteredMeta = platformFilteredMeta.filter(
        (m) => !m.allowedRoles.includes(ROLE_PRODUCTION_OFF),
      );
    }

    const totalCount = platformFilteredMeta.length;

    const categoryMap = new Map<string, number>();
    for (const tool of platformFilteredMeta) {
      categoryMap.set(tool.category, (categoryMap.get(tool.category) ?? 0) + 1);
    }
    const categories = [...categoryMap.entries()]
      .toSorted((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));

    const adminMeta = isAdmin
      ? {
          currentPlatform: platformFilter ?? platform,
          currentEnv,
          isAdmin: true as const,
        }
      : {};

    // Detail mode — single tool with full parameter schema
    if (data.toolName) {
      const needle = data.toolName.toLowerCase().trim();
      const matchedTool = platformFilteredMeta.find(
        (m) =>
          m.toolName.toLowerCase() === needle ||
          (m.aliases.length > 0 && m.aliases[0].toLowerCase() === needle) ||
          m.aliases.some((a) => a.toLowerCase() === needle),
      );
      if (!matchedTool) {
        return success({
          tools: [] satisfies ToolItem[],
          totalCount,
          matchedCount: 0,
          categories,
          hint: `Tool "${data.toolName}" not found. Use query to search by keyword.`,
          ...adminMeta,
        });
      }
      const endpoint = await loadEndpointForMeta(matchedTool);
      const parameters = endpoint
        ? (getParameterSchema(endpoint, locale) ?? undefined)
        : undefined;
      const callAs = matchedTool.toolName;
      return success({
        tools: [
          serializeMeta(
            matchedTool,
            parameters,
            true,
            getToolPlatforms(matchedTool),
          ),
        ],
        totalCount,
        matchedCount: 1,
        hint: `Call as: execute-tool toolName="${callAs}"${matchedTool.aliases.length > 0 ? ` (aliases: ${matchedTool.aliases.join(", ")})` : ""}. CLI: vibe ${callAs} [--field=value].`,
        ...adminMeta,
      });
    }

    const query = data.query?.toLowerCase().trim();
    const category = data.category?.toLowerCase().trim();

    // Build search index once
    const searchIndexMap = new Map<string, string>();
    for (const m of platformFilteredMeta) {
      searchIndexMap.set(m.toolName, buildMetaSearchIndex(m));
    }

    // Auto-upgrade to detail mode on exact name/alias match
    if (query && !category) {
      const exactMatch = platformFilteredMeta.find(
        (m) =>
          m.toolName.toLowerCase() === query ||
          m.aliases.some((a) => a.toLowerCase() === query),
      );
      if (exactMatch) {
        const endpoint = await loadEndpointForMeta(exactMatch);
        const parameters = endpoint
          ? (getParameterSchema(endpoint, locale) ?? undefined)
          : undefined;
        const callAs = exactMatch.toolName;
        return success({
          tools: [
            serializeMeta(
              exactMatch,
              parameters,
              true,
              getToolPlatforms(exactMatch),
            ),
          ],
          totalCount,
          matchedCount: 1,
          hint: `Call as: execute-tool toolName="${callAs}"${exactMatch.aliases.length > 0 ? ` (aliases: ${exactMatch.aliases.join(", ")})` : ""}. CLI: vibe ${callAs} [--field=value].`,
          ...adminMeta,
        });
      }
    }

    let filtered = platformFilteredMeta;

    if (query) {
      filtered = filtered.filter((m) => {
        if (
          m.toolName.toLowerCase().includes(query) ||
          m.aliases.some((a) => a.toLowerCase().includes(query)) ||
          m.description.toLowerCase().includes(query) ||
          m.tags.some((t) => t.toLowerCase().includes(query))
        ) {
          return true;
        }
        return searchIndexMap.get(m.toolName)?.includes(query) ?? false;
      });
    }

    if (category) {
      filtered = filtered.filter((m) =>
        m.category?.toLowerCase().includes(category),
      );
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
      if (matchedCount <= COMPACT_FULL_DETAIL_THRESHOLD) {
        const tools: ToolItem[] = await Promise.all(
          pageSlice.map(async (m) => {
            const endpoint = await loadEndpointForMeta(m);
            const parameters = endpoint
              ? (getParameterSchema(endpoint, locale) ?? undefined)
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
              ? `No tools matched. Try a broader query or call without params to see all categories.`
              : `Showing full detail for ${matchedCount} tool${matchedCount === 1 ? "" : "s"}. To call a tool: execute-tool toolName="<name>" (use the name field). CLI: vibe <name> [--field=value].`,
          ...adminMeta,
        });
      }
      const paginationHint =
        totalPages > 1
          ? ` Page ${safePage}/${totalPages} — use page= to navigate.`
          : "";
      return success({
        tools: pageSlice.map((m) =>
          serializeMetaMinimal(m, getToolPlatforms(m)),
        ),
        totalCount,
        matchedCount,
        categories,
        hint: `${matchedCount} tools matched. Use toolName="<name>" for full schema + examples (name is the preferred call name). To call: execute-tool toolName="<name>".${paginationHint}`,
        currentPage: safePage,
        effectivePageSize,
        totalPages,
        ...adminMeta,
      });
    }

    return success({
      tools: pageSlice.map((m) =>
        serializeMeta(m, undefined, false, getToolPlatforms(m)),
      ),
      totalCount,
      matchedCount,
      categories,
      hint:
        totalPages > 1
          ? `Page ${safePage}/${totalPages} — ${matchedCount} tools match.`
          : undefined,
      currentPage: safePage,
      effectivePageSize,
      totalPages,
      ...adminMeta,
    });
  }
}
