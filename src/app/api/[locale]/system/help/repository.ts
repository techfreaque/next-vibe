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
  PlatformMarker,
  UserPermissionRole,
  type UserRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CliRequestData } from "@/app/api/[locale]/system/unified-interface/cli/runtime/cli-request-data";
import type { CliCompatiblePlatform } from "../unified-interface/cli/runtime/route-executor";
import { generateSchemaForUsage } from "../unified-interface/shared/field/utils";
import type { CreateApiEndpointAny } from "../unified-interface/shared/types/endpoint-base";
import { FieldUsage } from "../unified-interface/shared/types/enums";
import { Platform } from "../unified-interface/shared/types/platform";

import type {
  HelpGetRequestOutput,
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
  HelpToolParameters,
} from "./definition";
import { scopedTranslation } from "./i18n";

// ─── Types ─────────────────────────────────────────────────────────────────

interface HelpInteractiveResult {
  started: boolean;
}

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

export class HelpRepository {
  // ─── Platform/role filtering on static meta ────────────────────────────────

  private static readonly COMPACT_DEFAULT_PAGE_SIZE = 25;
  private static readonly HUMAN_DEFAULT_PAGE_SIZE = 500;
  /** If a filtered result set is ≤ this many tools, auto-upgrade to full detail (params + examples) */
  private static readonly COMPACT_FULL_DETAIL_THRESHOLD = 5;

  private static mapFilterToPlatform(
    filter: Platform | "all",
  ): Platform | "all" {
    switch (filter) {
      case "all":
        return "all";
      default:
        return filter;
    }
  }

  private static checkPlatformAccess(
    roles: string[],
    platform: Platform,
  ): boolean {
    if (
      envClient.NODE_ENV === "production" &&
      !envClient.NEXT_PUBLIC_LOCAL_MODE &&
      roles.includes(PlatformMarker.PRODUCTION_OFF)
    ) {
      return false;
    }
    switch (platform) {
      case Platform.CLI:
        // CLI_OFF opts out of CLI (and MCP by extension)
        return !roles.includes(PlatformMarker.CLI_OFF);
      case Platform.MCP:
        // MCP requires CLI-accessible + not MCP-specifically-off
        return (
          !roles.includes(PlatformMarker.CLI_OFF) &&
          !roles.includes(PlatformMarker.MCP_OFF)
        );
      case Platform.CLI_PACKAGE:
        // Public CLI tools: must be CLI-accessible + have auth bypass marker
        return (
          !roles.includes(PlatformMarker.CLI_OFF) &&
          roles.includes(PlatformMarker.CLI_AUTH_BYPASS)
        );
      case Platform.AI:
        // AI tool: not opted out of AI tools specifically
        return !roles.includes(PlatformMarker.AI_TOOL_OFF);
      case Platform.CRON:
        // Cron jobs: same as AI tool (server-side invocation)
        return !roles.includes(PlatformMarker.AI_TOOL_OFF);
      case Platform.REMOTE_SKILL:
        // Skills: not opted out of skills
        return !roles.includes(PlatformMarker.SKILL_OFF);
      case Platform.NEXT_PAGE:
      case Platform.NEXT_API:
      case Platform.TRPC:
      case Platform.ELECTRON:
      case Platform.FRAME:
        // All web surfaces: not opted out of web
        return !roles.includes(PlatformMarker.WEB_OFF);
      default:
        return true;
    }
  }

  private static checkUserAccess(
    roles: string[],
    userRoles: string[],
    isPublic: boolean,
  ): boolean {
    const permRoles = roles.filter(
      (r) =>
        !r.endsWith("Off") &&
        !r.endsWith("Bypass") &&
        r !== PlatformMarker.MCP_VISIBLE &&
        r !== PlatformMarker.SKILL_OFF,
    );
    if (permRoles.length === 0) {
      return false;
    }
    if (permRoles.includes(UserPermissionRole.PUBLIC)) {
      return true;
    }
    if (isPublic) {
      return false;
    }
    return permRoles.some((r) => userRoles.includes(r));
  }

  private static filterMetaForUser(
    meta: EndpointMeta[],
    platform: Platform,
    userRoles: string[],
    isPublic: boolean,
  ): EndpointMeta[] {
    return meta.filter((m) => {
      const platformOk = HelpRepository.checkPlatformAccess(
        m.allowedRoles,
        platform,
      );
      if (!platformOk) {
        return false;
      }
      return HelpRepository.checkUserAccess(
        m.allowedRoles,
        userRoles,
        isPublic,
      );
    });
  }

  private static getMetaPlatforms(roles: string[]): Platform[] {
    return (Object.values(Platform) as Platform[]).filter((p) =>
      HelpRepository.checkPlatformAccess(roles, p),
    );
  }

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
  ): HelpToolParameters | null {
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
    } catch {
      return null;
    }
  }

  private static serializeMeta(
    tool: EndpointMeta,
    parameters?: HelpToolParameters,
    includeExamples = false,
    platforms?: Platform[],
  ): HelpToolMetadataSerialized {
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

  private static serializeMetaMinimal(
    tool: EndpointMeta,
    platforms?: Platform[],
  ): HelpToolMetadataSerialized {
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

  private static buildMetaSearchIndex(tool: EndpointMeta): string {
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
  private static async loadEndpointForMeta(
    tool: EndpointMeta,
  ): Promise<CreateApiEndpointAny | null> {
    const { getEndpoint } =
      await import("@/app/api/[locale]/system/generated/endpoint");
    return getEndpoint(tool.toolName);
  }
  /**
   * Start interactive CLI session - Ink-based route navigator.
   */
  static async startInteractive(
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]> | undefined,
    locale: CountryLanguage,
    platform: CliCompatiblePlatform,
  ): Promise<ResponseType<HelpInteractiveResult>> {
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

  /**
   * Extract a simple JSON-Schema-like parameters object from a capability's
   * serialized `fields.children`. Used as a fast path to show parameter
   * descriptions without a remote HTTP call when the snapshot is fresh.
   * Returns null if the fields structure is missing or unreadable.
   */
  private static extractParametersFromCapabilityFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: Record<string, any> | null | undefined,
  ): HelpToolParameters | null {
    if (!fields || typeof fields !== "object") {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const children: Record<string, any> =
      typeof fields.children === "object" && fields.children
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (fields.children as Record<string, any>)
        : {};
    const properties: Record<
      string,
      { type?: string; description?: string; format?: string }
    > = {};
    const required: string[] = [];

    for (const [key, field] of Object.entries(children)) {
      if (!field || typeof field !== "object") {
        continue;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const f = field as Record<string, any>;
      // Skip response-only and non-form fields
      if (f.usage && !f.usage.request) {
        continue;
      }
      if (f.type && f.type !== "form_field") {
        continue;
      }

      const description =
        typeof f.description === "string" ? f.description : undefined;
      // Map fieldType → JSON schema type
      const fieldType: string =
        typeof f.fieldType === "string" ? f.fieldType : "";
      let type = "string";
      if (
        fieldType === "number" ||
        fieldType === "integer" ||
        fieldType === "float"
      ) {
        type = fieldType === "float" ? "number" : fieldType;
      } else if (fieldType === "boolean" || fieldType === "toggle") {
        type = "boolean";
      } else if (fieldType === "array" || fieldType === "multi_select") {
        type = "array";
      } else if (fieldType === "json" || fieldType === "object") {
        type = "object";
      }

      properties[key] = { type, ...(description ? { description } : {}) };

      // Check if required: schema has no optional/default wrapper
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const schema = f.schema as Record<string, any> | undefined;
      if (schema) {
        const outerType: string =
          typeof schema.type === "string" ? schema.type : "";
        if (outerType !== "optional" && outerType !== "pipe") {
          // Non-optional, non-piped (transform) → treat as required
          required.push(key);
        }
        // Pipe: check the inner type
        if (outerType === "pipe") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const inner = schema.in as Record<string, any> | undefined;
          const innerType: string =
            inner && typeof inner.type === "string" ? inner.type : "";
          if (innerType !== "optional") {
            required.push(key);
          }
        }
      }
    }

    if (Object.keys(properties).length === 0) {
      return null;
    }
    return {
      type: "object",
      properties,
      ...(required.length > 0 ? { required } : {}),
    };
  }

  /**
   * Fetch full tool schemas from the remote help endpoint for a small set of tools.
   * Falls back to the capability snapshot's fields if the remote is unreachable.
   */
  private static async fetchRemoteToolSchemas(params: {
    remoteUrl: string;
    token: string;
    leadId: string | null;
    toolNames: string[];
    locale: CountryLanguage;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    capabilitiesByName: Map<string, any>;
  }): Promise<Map<string, HelpToolParameters | undefined>> {
    const { remoteUrl, token, leadId, toolNames, locale, capabilitiesByName } =
      params;
    const result = new Map<string, HelpToolParameters | undefined>();

    for (const toolName of toolNames) {
      try {
        const helpUrl = `${remoteUrl}/api/${locale}/system/help?toolName=${encodeURIComponent(toolName)}`;
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
        };
        if (leadId) {
          headers.Cookie = `lead_id=${leadId}`;
        }
        const resp = await fetch(helpUrl, {
          method: "GET",
          headers,
          signal: AbortSignal.timeout(8000),
        });
        if (resp.ok) {
          const body = (await resp.json()) as {
            success?: boolean;
            data?: HelpGetResponseOutput;
          };
          if (body.success && body.data?.tools?.[0]?.parameters) {
            result.set(toolName, body.data.tools[0].parameters);
            continue;
          }
        }
      } catch {
        // Fallthrough to snapshot extraction
      }
      // Fallback: extract from capability snapshot fields
      const cap = capabilitiesByName.get(toolName);
      if (cap?.fields) {
        const extracted = HelpRepository.extractParametersFromCapabilityFields(
          cap.fields,
        );
        result.set(toolName, extracted ?? undefined);
      }
    }

    return result;
  }

  static async getToolsFromRemoteInstance(
    instanceId: string,
    data: HelpGetRequestOutput,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    locale: CountryLanguage,
    platform: Platform,
  ): Promise<ResponseType<HelpGetResponseOutput>> {
    const query = data.query;
    const currentPage = data.page ?? 1;
    const { t } = scopedTranslation.scopedT(locale);
    const { RemoteConnectionRepository } =
      await import("@/app/api/[locale]/user/remote-connection/repository");

    // Try user-scoped lookup first, fall back to any-user lookup for CLI/system users
    // whose userId doesn't own the connection.
    const conn = user.isPublic
      ? await RemoteConnectionRepository.getConnectionAnyUser(instanceId)
      : ((await RemoteConnectionRepository.getConnectionForInstance(
          user.id,
          instanceId,
        )) ??
        (await RemoteConnectionRepository.getConnectionAnyUser(instanceId)));

    const capabilities = conn?.capabilities ?? null;

    if (!capabilities) {
      return success({
        tools: [],
        totalCount: 0,
        matchedCount: 0,
        hint: `No capability snapshot for instance "${instanceId}". Connect the instance and wait for a sync pulse.`,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const capabilitiesByName = new Map<string, any>(
      capabilities.map((cap) => [cap.toolName, cap]),
    );

    const allTools: HelpToolMetadataSerialized[] = capabilities.map((cap) => {
      const prefixedId = `${instanceId}__${cap.toolName}`;
      return {
        name: prefixedId,
        title: cap.title,
        id: prefixedId,
        description: cap.description,
        category: cap.category ?? t("category"),
        tags: cap.tags ?? [],
        // Keep aliases bare (no prefix) - CLI calls them with the prefix anyway
        aliases: cap.aliases,
        executionMode: "via-execute-route" as const,
        instanceId,
      };
    });

    // Apply query filter if provided - also match bare tool name (without instanceId prefix)
    const lowerQuery = query?.toLowerCase();
    const filtered = lowerQuery
      ? allTools.filter((tool) => {
          if (
            tool.name.toLowerCase().includes(lowerQuery) ||
            tool.title.toLowerCase().includes(lowerQuery) ||
            tool.description.toLowerCase().includes(lowerQuery) ||
            tool.category.toLowerCase().includes(lowerQuery) ||
            tool.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
            tool.aliases?.some((a) => a.toLowerCase().includes(lowerQuery))
          ) {
            return true;
          }
          // Also match bare name without instanceId prefix
          const bareName = tool.name.slice(instanceId.length + 2);
          return bareName.toLowerCase().includes(lowerQuery);
        })
      : allTools;

    const matchedCount = filtered.length;
    const totalCount = allTools.length;

    const isCompact = HelpRepository.isCompactPlatform(platform);
    const effectivePageSize =
      data.pageSize ??
      (isCompact
        ? HelpRepository.COMPACT_DEFAULT_PAGE_SIZE
        : HelpRepository.HUMAN_DEFAULT_PAGE_SIZE);
    const totalPages = Math.ceil(matchedCount / effectivePageSize);
    const safePage = Math.min(currentPage, Math.max(1, totalPages));
    const offset = (safePage - 1) * effectivePageSize;
    const pageSlice = filtered.slice(offset, offset + effectivePageSize);

    // Auto-upgrade to full detail for small result sets (same threshold as local tools)
    if (
      matchedCount > 0 &&
      matchedCount <= HelpRepository.COMPACT_FULL_DETAIL_THRESHOLD
    ) {
      // conn.token is already decrypted by getConnectionForInstance / getConnectionAnyUser
      const schemaMap =
        conn?.token && conn.remoteUrl
          ? await HelpRepository.fetchRemoteToolSchemas({
              remoteUrl: conn.remoteUrl,
              token: conn.token,
              leadId: conn.leadId ?? null,
              toolNames: pageSlice.map((tool) =>
                tool.name.slice(instanceId.length + 2),
              ),
              locale,
              capabilitiesByName,
            })
          : new Map<string, HelpToolParameters | undefined>();

      const tools: HelpToolMetadataSerialized[] = pageSlice.map((tool) => {
        const bareName = tool.name.slice(instanceId.length + 2);
        const cap = capabilitiesByName.get(bareName);
        const parameters =
          schemaMap.get(bareName) ??
          (cap?.fields
            ? (HelpRepository.extractParametersFromCapabilityFields(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cap.fields as Record<string, any>,
              ) ?? undefined)
            : undefined);
        return {
          ...tool,
          parameters,
          examples: cap?.examples,
        };
      });

      return success({
        tools,
        totalCount,
        matchedCount,
        hint: isCompact
          ? `Full schema for ${matchedCount} tool${matchedCount === 1 ? "" : "s"} from "${instanceId}". Call via: execute-tool toolName="${instanceId}__<name>" input={...}.`
          : `Showing full detail for ${matchedCount} tool${matchedCount === 1 ? "" : "s"} from "${instanceId}". CLI: vibe ${instanceId}__<name> [--field=value].`,
      });
    }

    const paginationHint =
      totalPages > 1
        ? ` Page ${safePage}/${totalPages} - pass page= to continue.`
        : "";
    return success({
      tools: pageSlice,
      totalCount,
      matchedCount,
      hint: `${matchedCount} of ${totalCount} tools from remote instance "${instanceId}". Narrow search to ≤${HelpRepository.COMPACT_FULL_DETAIL_THRESHOLD} results for full schemas, or pass toolName= for a specific tool.${paginationHint}`,
    });
  }

  static async getTools(
    data: HelpGetRequestOutput,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    locale: CountryLanguage,
    platform: Platform,
  ): Promise<ResponseType<HelpGetResponseOutput>> {
    // Remote instance tool discovery - bypass local registry
    if (data.instanceId) {
      return HelpRepository.getToolsFromRemoteInstance(
        data.instanceId,
        data,
        user,
        locale,
        platform,
      );
    }

    const isCompact = HelpRepository.isCompactPlatform(platform);
    const effectivePageSize =
      data.pageSize ??
      (isCompact
        ? HelpRepository.COMPACT_DEFAULT_PAGE_SIZE
        : HelpRepository.HUMAN_DEFAULT_PAGE_SIZE);
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

    // Discovery platform - what platform context are we listing tools for?
    // Admin can override with data.platform filter; non-admins get their actual platform.
    // MCP uses CLI semantics (opt-out, not MCP_VISIBLE opt-in) - execute-tool reaches all CLI tools.
    const platformFilter = isAdmin ? data.platform : undefined;
    let discoveryPlatform: Platform;

    if (platformFilter) {
      const mapped = HelpRepository.mapFilterToPlatform(platformFilter);
      discoveryPlatform = mapped === "all" ? Platform.CLI : mapped;
    } else {
      // Use actual calling platform - each platform has its own correct access rules
      discoveryPlatform = platform;
    }

    const userRoles = user.isPublic
      ? [UserPermissionRole.PUBLIC]
      : [...user.roles];

    // Filter meta by platform + user roles
    const filteredByPlatform = HelpRepository.filterMetaForUser(
      allMeta,
      discoveryPlatform,
      userRoles,
      user.isPublic,
    );

    // Admin platform badges - derived directly from allowedRoles in meta
    const getToolPlatforms = (tool: EndpointMeta): Platform[] | undefined => {
      if (!isAdmin) {
        return undefined;
      }
      return HelpRepository.getMetaPlatforms(tool.allowedRoles);
    };

    // When admin filters by a specific platform, additionally filter
    let platformFilteredMeta = filteredByPlatform;
    if (platformFilter) {
      platformFilteredMeta = filteredByPlatform.filter((m) =>
        HelpRepository.getMetaPlatforms(m.allowedRoles).includes(
          platformFilter,
        ),
      );
    }

    // includeProdOnly: exclude PRODUCTION_OFF tools
    if (isAdmin && data.includeProdOnly) {
      platformFilteredMeta = platformFilteredMeta.filter(
        (m) => !m.allowedRoles.includes(PlatformMarker.PRODUCTION_OFF),
      );
    }

    const totalCount = platformFilteredMeta.length;

    // Build category counts from the FULL set (before statsFilter narrows the list)
    const categoryMap = new Map<string, number>();
    for (const tool of platformFilteredMeta) {
      categoryMap.set(tool.category, (categoryMap.get(tool.category) ?? 0) + 1);
    }
    const categories = [...categoryMap.entries()]
      .toSorted((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));

    // statsFilter: web/human platforms can filter by pinned or allowed tools.
    // null in DB = user has default settings (never stored when default).
    // Direct DB query - compact platforms (AI/MCP/CRON) skip this entirely.
    const statsFilter = data.statsFilter ?? "pinned";
    // Server-side counts for the stats filter buttons (web only)
    let pinnedCount: number | undefined;
    let allowedCount: number | undefined;
    if (!isCompact && !user.isPublic) {
      try {
        const { getDefaultToolIdsForUser } =
          await import("@/app/api/[locale]/agent/chat/constants");

        const { db } = await import("@/app/api/[locale]/system/db");
        const { chatSettings } =
          await import("@/app/api/[locale]/agent/chat/settings/db");
        const { eq } = await import("drizzle-orm");
        const rows = await db
          .select({
            availableTools: chatSettings.availableTools,
            pinnedTools: chatSettings.pinnedTools,
          })
          .from(chatSettings)
          .where(eq(chatSettings.userId, user.id))
          .limit(1);

        const row = rows[0]; // undefined = no settings row = all defaults
        const dbPinned = row?.pinnedTools ?? null;
        const dbAllowed = row?.availableTools ?? null;

        // Always build both ID sets for accurate counts on all filter tabs
        const pinnedIds: Set<string> =
          dbPinned !== null
            ? new Set(dbPinned.map((t: { toolId: string }) => t.toolId))
            : new Set(getDefaultToolIdsForUser(user));

        pinnedCount = platformFilteredMeta.filter(
          (m) =>
            pinnedIds.has(m.toolName) ||
            m.aliases.some((a) => pinnedIds.has(a)),
        ).length;

        // null allowed = all tools allowed (totalCount)
        const dbAllowedIds =
          dbAllowed !== null
            ? new Set(dbAllowed.map((t: { toolId: string }) => t.toolId))
            : null;

        allowedCount =
          dbAllowedIds !== null
            ? platformFilteredMeta.filter(
                (m) =>
                  dbAllowedIds.has(m.toolName) ||
                  m.aliases.some((a) => dbAllowedIds.has(a)),
              ).length
            : totalCount;

        // Apply the active filter to narrow platformFilteredMeta
        if (statsFilter === "pinned") {
          platformFilteredMeta = platformFilteredMeta.filter(
            (m) =>
              pinnedIds.has(m.toolName) ||
              m.aliases.some((a) => pinnedIds.has(a)),
          );
        } else if (statsFilter === "allowed" && dbAllowedIds !== null) {
          platformFilteredMeta = platformFilteredMeta.filter(
            (m) =>
              dbAllowedIds.has(m.toolName) ||
              m.aliases.some((a) => dbAllowedIds.has(a)),
          );
        }
      } catch {
        // Settings fetch failed - fall through with unfiltered list
      }
    }

    const adminMeta = isAdmin
      ? {
          currentPlatform: platformFilter ?? platform,
          currentEnv,
        }
      : {};

    // Web-only: server-computed counts for the pinned/allowed/all filter tabs
    const statsMeta = !isCompact
      ? {
          pinnedCount,
          allowedCount,
        }
      : {};

    // Detail mode - single tool with full parameter schema
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
          tools: [] satisfies HelpToolMetadataSerialized[],
          totalCount,
          matchedCount: 0,
          categories,
          hint: `Tool "${data.toolName}" not found. Use query to search by keyword.`,
          ...adminMeta,
          ...statsMeta,
        });
      }
      const endpoint = await HelpRepository.loadEndpointForMeta(matchedTool);
      const parameters = endpoint
        ? (HelpRepository.getParameterSchema(endpoint, locale) ?? undefined)
        : undefined;
      const callAs = matchedTool.toolName;
      return success({
        tools: [
          HelpRepository.serializeMeta(
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
        ...statsMeta,
      });
    }

    const query = data.query?.toLowerCase().trim();
    const category = data.category?.toLowerCase().trim();

    // Build search index once
    const searchIndexMap = new Map<string, string>();
    for (const m of platformFilteredMeta) {
      searchIndexMap.set(m.toolName, HelpRepository.buildMetaSearchIndex(m));
    }

    // Auto-upgrade to detail mode on exact name/alias match
    if (query && !category) {
      const exactMatch = platformFilteredMeta.find(
        (m) =>
          m.toolName.toLowerCase() === query ||
          m.aliases.some((a) => a.toLowerCase() === query),
      );
      if (exactMatch) {
        const endpoint = await HelpRepository.loadEndpointForMeta(exactMatch);
        const parameters = endpoint
          ? (HelpRepository.getParameterSchema(endpoint, locale) ?? undefined)
          : undefined;
        const callAs = exactMatch.toolName;
        return success({
          tools: [
            HelpRepository.serializeMeta(
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
          ...statsMeta,
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
      if (matchedCount <= HelpRepository.COMPACT_FULL_DETAIL_THRESHOLD) {
        const tools: HelpToolMetadataSerialized[] = await Promise.all(
          pageSlice.map(async (m) => {
            const endpoint = await HelpRepository.loadEndpointForMeta(m);
            const parameters = endpoint
              ? (HelpRepository.getParameterSchema(endpoint, locale) ??
                undefined)
              : undefined;
            return HelpRepository.serializeMeta(
              m,
              parameters,
              true,
              getToolPlatforms(m),
            );
          }),
        );
        return success({
          tools,
          totalCount,
          matchedCount,
          hint:
            matchedCount === 0
              ? `No tools matched. Try a broader query or call without params to see all categories.`
              : `Full schema for ${matchedCount} tool${matchedCount === 1 ? "" : "s"}. Call via: execute-tool toolName="<name>" input={...}. Narrow query further for fewer results.`,
          ...adminMeta,
        });
      }
      const paginationHint =
        totalPages > 1
          ? ` Page ${safePage}/${totalPages} - pass page=${safePage + 1} to continue.`
          : "";
      return success({
        tools: pageSlice.map((m) =>
          HelpRepository.serializeMetaMinimal(m, getToolPlatforms(m)),
        ),
        totalCount,
        matchedCount,
        categories,
        hint: `${matchedCount} tools - showing names only. Narrow your search to ≤5 results to auto-expand full schemas, or pass toolName="<name>" for detail on one tool. To call any tool: execute-tool toolName="<name>".${paginationHint}`,
        currentPage: safePage,
        effectivePageSize,
        totalPages,
        ...adminMeta,
      });
    }

    // CLI/web: auto-upgrade to full detail when result set is small enough
    if (matchedCount <= HelpRepository.COMPACT_FULL_DETAIL_THRESHOLD) {
      const tools: HelpToolMetadataSerialized[] = await Promise.all(
        pageSlice.map(async (m) => {
          const endpoint = await HelpRepository.loadEndpointForMeta(m);
          const parameters = endpoint
            ? (HelpRepository.getParameterSchema(endpoint, locale) ?? undefined)
            : undefined;
          return HelpRepository.serializeMeta(
            m,
            parameters,
            true,
            getToolPlatforms(m),
          );
        }),
      );
      return success({
        tools,
        totalCount,
        matchedCount,
        hint:
          matchedCount === 0
            ? `No tools matched. Try a broader query or call without params to see all categories.`
            : `Showing full detail for ${matchedCount} tool${matchedCount === 1 ? "" : "s"}. CLI: vibe <name> [--field=value].`,
        ...adminMeta,
        ...statsMeta,
      });
    }

    return success({
      tools: pageSlice.map((m) =>
        HelpRepository.serializeMeta(m, undefined, false, getToolPlatforms(m)),
      ),
      totalCount,
      matchedCount,
      categories,
      hint:
        totalPages > 1
          ? `Page ${safePage}/${totalPages} - ${matchedCount} tools match. Use vibe help <name> for full details.`
          : `${matchedCount} tools matched. Use vibe help <name> for full details.`,
      currentPage: safePage,
      effectivePageSize,
      totalPages,
      ...adminMeta,
      ...statsMeta,
    });
  }
}
