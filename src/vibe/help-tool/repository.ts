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

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import {
  enrichJsonSchemaFromFields,
  zodSchemaToJsonSchema,
} from "next-vibe/core/definition/endpoint-to-metadata";
import { FieldUsage } from "next-vibe/core/definition/enums";
import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { InferJwtPayloadTypeFromRoles } from "next-vibe/core/route/handler";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import {
  searchField,
  searchItems,
} from "next-vibe/core/utils/in-memory-search";
import type { WidgetData } from "next-vibe/core/utils/json";
import { scopedTranslation } from "next-vibe/help-tool/i18n";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import {
  PlatformMarker,
  UserPermissionRole,
  type UserRoleValue,
} from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { CliCompatiblePlatform } from "next-vibe/platforms/cli/runtime/route-executor";
import { generateSchemaForUsage } from "next-vibe/unified-ui/_shared/utils";
import type { IconKey } from "next-vibe/unified-ui/form-fields/icon-field/icons";
import { z } from "zod";

import { envClient } from "@/env/env-client";

import type {
  HelpGetRequestOutput,
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
  HelpToolParameters,
} from "./definition";

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
  titleShort: string;
  description: string;
  icon: IconKey;
  category: string;
  subCategory: string;
  tags: string[];
  credits?: number;
  requiresConfirmation?: boolean;
  examples?: {
    inputs?: Record<string, Record<string, WidgetData>>;
    responses?: Record<string, Record<string, WidgetData>>;
  };
}

export class HelpRepository {
  // ─── Platform/role filtering on static meta ────────────────────────────────

  private static readonly COMPACT_DEFAULT_PAGE_SIZE = 100;
  private static readonly HUMAN_DEFAULT_PAGE_SIZE = 800;
  /** If a filtered result set is ≤ this many tools, auto-upgrade to full detail (params + examples) */
  private static readonly COMPACT_FULL_DETAIL_THRESHOLD = 5;
  /** For AI/MCP: if matchedCount exceeds this, return only categories (no tool names) to save tokens */
  private static readonly COMPACT_CATEGORY_ONLY_THRESHOLD = 100;

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
    platform?: Platform,
  ): boolean {
    // CLI_AUTH_BYPASS means the endpoint opted into CLI access without auth —
    // only bypass role check when actually on the CLI_PACKAGE platform.
    if (
      platform === Platform.CLI_PACKAGE &&
      roles.includes(PlatformMarker.CLI_AUTH_BYPASS)
    ) {
      return true;
    }
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
        platform,
      );
    });
  }

  private static getMetaPlatforms(roles: string[]): Platform[] {
    return (Object.values(Platform) as Platform[]).filter((p) =>
      HelpRepository.checkPlatformAccess(roles, p),
    );
  }

  /** Check if a tool matches any id in a set (by toolName or alias). */
  private static inSet(m: EndpointMeta, ids: Set<string>): boolean {
    return ids.has(m.toolName) || m.aliases.some((a) => ids.has(a));
  }

  private static buildCategories(meta: EndpointMeta[]): Array<{
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
      const schemaPlatform = HelpRepository.isCompactPlatform(platform)
        ? Platform.AI
        : undefined;
      const requestDataSchema = generateSchemaForUsage(
        endpoint.fields,
        FieldUsage.RequestData,
        undefined,
        schemaPlatform,
      ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;
      const urlPathParamsSchema = generateSchemaForUsage(
        endpoint.fields,
        FieldUsage.RequestUrlParams,
        undefined,
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
    } catch {
      return null;
    }
  }

  private static normLabel(s: string): string {
    return s.toLowerCase().replace(/[\s_-]+/g, "");
  }

  /** Case/space-insensitive equality — used to drop name fields that just echo. */
  private static sameLabel(a: string, b: string): boolean {
    return HelpRepository.normLabel(a) === HelpRepository.normLabel(b);
  }

  /**
   * Compact name fields. AI/MCP need ONE call name plus a human label —
   * not name + title + titleShort + alias all saying the same thing.
   *   - title: dropped when it just echoes the call name
   *   - titleShort: dropped entirely — `title` already labels the tool; the
   *     short variant is pure UI decoration an agent never needs
   *   - aliases: first alias only, dropped when it echoes name/title
   * Web/CLI keep every field (humans skim labels; full alias list aids discovery).
   */
  private static nameFields(
    tool: EndpointMeta,
    compact: boolean,
  ): Pick<
    HelpToolMetadataSerialized,
    "name" | "title" | "titleShort" | "aliases"
  > {
    const name = tool.toolName;
    if (!compact) {
      return {
        name,
        title: tool.title,
        titleShort: tool.titleShort,
        aliases: tool.aliases.length > 0 ? tool.aliases : undefined,
      };
    }
    const includeTitle = !HelpRepository.sameLabel(tool.title, name);
    const firstAlias = tool.aliases[0];
    const includeAlias =
      firstAlias !== undefined &&
      !HelpRepository.sameLabel(firstAlias, name) &&
      !HelpRepository.sameLabel(firstAlias, tool.title);
    return {
      name,
      ...(includeTitle && { title: tool.title }),
      ...(includeAlias && { aliases: [firstAlias] }),
    };
  }

  private static serializeMeta(
    tool: EndpointMeta,
    parameters?: HelpToolParameters,
    includeExamples = false,
    platforms?: Platform[],
    compact = false,
    omitCategory = false,
  ): HelpToolMetadataSerialized {
    return {
      ...HelpRepository.nameFields(tool, compact),
      // id is redundant with name - omit for compact platforms (AI/MCP) to save tokens
      ...(!compact && { id: tool.toolName }),
      // tags are low-signal for AI tool selection - omit for compact platforms
      ...(!compact && { tags: tool.tags }),
      // method is irrelevant for AI (calls via execute-tool) - omit for compact platforms
      ...(!compact && { method: tool.method }),
      description: tool.description,
      // category: omit on compact when every returned tool shares it (the caller
      // filtered by category, so repeating it per-tool is constant noise).
      ...(omitCategory ? {} : { category: tool.category }),
      // subCategory/icon are display-only — an AI/MCP caller can't render an icon
      // and groups by category already. Web/CLI keep them for the UI.
      ...(!compact && tool.subCategory && { subCategory: tool.subCategory }),
      ...(!compact && tool.icon && { icon: tool.icon }),
      // requiresConfirmation/credits: only emit when they actually carry signal
      // (true / >0). On web/CLI the widget reads them regardless, so keep the
      // explicit value there.
      ...(compact
        ? tool.requiresConfirmation
          ? { requiresConfirmation: true }
          : {}
        : { requiresConfirmation: tool.requiresConfirmation }),
      ...(compact
        ? tool.credits && tool.credits > 0
          ? { credits: tool.credits }
          : {}
        : { credits: tool.credits }),
      platforms,
      parameters,
      // Examples must AGREE with the schema the caller sees. On compact
      // platforms (AI/MCP) `parameters` has AI-hidden fields (e.g. media-gen
      // model/size/quality) stripped, so raw examples that still show those
      // fields make the model report a bogus "schema is missing X" mismatch.
      // Filter each example's inputs to the keys the AI-facing schema advertises.
      examples: includeExamples
        ? compact
          ? HelpRepository.filterExamplesToSchema(tool.examples, parameters)
          : tool.examples
        : undefined,
    };
  }

  /**
   * Keep only the example INPUT keys that exist in the (already platform-
   * filtered) parameters schema, so the AI-facing example never references a
   * field the AI-facing schema hid. Responses are left untouched (output shape).
   */
  private static filterExamplesToSchema(
    examples: EndpointMeta["examples"],
    parameters: HelpToolParameters | undefined,
  ): EndpointMeta["examples"] {
    if (!examples?.inputs || !parameters) {
      return examples;
    }
    // `parameters` is a JSON schema object (Record<string, WidgetData>); its
    // `properties` sub-object lists the AI-visible field names.
    const propsValue = parameters["properties"];
    if (
      propsValue === null ||
      typeof propsValue !== "object" ||
      Array.isArray(propsValue)
    ) {
      return examples;
    }
    const allowed = new Set(Object.keys(propsValue));
    const filteredInputs: Record<string, Record<string, WidgetData>> = {};
    for (const [name, input] of Object.entries(examples.inputs)) {
      const kept: Record<string, WidgetData> = {};
      for (const [key, value] of Object.entries(input)) {
        if (allowed.has(key)) {
          kept[key] = value;
        }
      }
      filteredInputs[name] = kept;
    }
    return { ...examples, inputs: filteredInputs };
  }

  private static serializeMetaMinimal(
    tool: EndpointMeta,
    platforms?: Platform[],
    compact = false,
    omitCategory = false,
  ): HelpToolMetadataSerialized {
    return {
      ...HelpRepository.nameFields(tool, compact),
      // id is redundant with name - omit for compact platforms
      ...(!compact && { id: tool.toolName }),
      // tags are low-signal for AI tool selection - omit for compact platforms
      ...(!compact && { tags: tool.tags }),
      description: tool.description,
      // category: omit on compact when every returned tool shares it.
      ...(omitCategory ? {} : { category: tool.category }),
      // subCategory/icon are display-only — omit for compact (AI/MCP) consumers.
      ...(!compact && tool.subCategory && { subCategory: tool.subCategory }),
      ...(!compact && tool.icon && { icon: tool.icon }),
      ...(compact
        ? tool.credits && tool.credits > 0
          ? { credits: tool.credits }
          : {}
        : { credits: tool.credits }),
      platforms,
    };
  }

  /** Lazy-load the full endpoint definition for parameter schema (detail view only) */
  private static async loadEndpointForMeta(
    tool: EndpointMeta,
  ): Promise<CreateApiEndpointAny | null> {
    const { getEndpoint } = await import("@/generated/endpoints/endpoint");
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
    instanceId: string;
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>;
    toolNames: string[];
    locale: CountryLanguage;
    logger: EndpointLogger;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    capabilitiesByName: Map<string, any>;
  }): Promise<Map<string, HelpToolParameters | undefined>> {
    const { instanceId, user, toolNames, locale, logger, capabilitiesByName } =
      params;
    const result = new Map<string, HelpToolParameters | undefined>();

    const { RouteExecuteRepository } =
      await import("next-vibe/execute-tool/repository");
    const helpDef = (await import("./definition")).default;

    for (const toolName of toolNames) {
      // Ask the remote's own help endpoint for full detail, routed by instanceId
      // through the unified typed path (no raw cross-instance HTTP here).
      const remote = await RouteExecuteRepository.runInProcessTyped({
        definition: helpDef.GET,
        input: { toolName, page: 1, pageSize: 1 },
        instanceId,
        user,
        locale,
        logger,
      });
      if (remote.success && remote.data?.tools?.[0]?.parameters) {
        result.set(toolName, remote.data.tools[0].parameters);
        continue;
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

  private static async getToolsFromRemoteInstance(
    instanceId: string,
    data: HelpGetRequestOutput,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    locale: CountryLanguage,
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<ResponseType<HelpGetResponseOutput>> {
    const query = data.query;
    const currentPage = data.page ?? 1;
    const { t } = scopedTranslation.scopedT(locale);
    const { RemoteConnectionRepository } =
      await import("next-vibe/remote-connection/repository");

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
      logger.error("Failed to get tools from remote", {
        instanceId,
        userId: user.id,
      });
      return success({
        tools: [],
        totalCount: 0,
        matchedCount: 0,
        hint: t("get.hints.noCapabilitySnapshot", { instanceId }),
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
        titleShort: cap.titleShort ?? cap.title,
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
            tool.title?.toLowerCase().includes(lowerQuery) ||
            tool.description.toLowerCase().includes(lowerQuery) ||
            tool.category?.toLowerCase().includes(lowerQuery) ||
            tool.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
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
      const schemaMap =
        conn?.token && conn.remoteUrl
          ? await HelpRepository.fetchRemoteToolSchemas({
              instanceId,
              user,
              toolNames: pageSlice.map((tool) =>
                tool.name.slice(instanceId.length + 2),
              ),
              locale,
              logger,
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
          // Same schema/example consistency as the local path: strip example
          // input keys the (platform-filtered) parameters schema doesn't advertise.
          examples: HelpRepository.filterExamplesToSchema(
            cap?.examples,
            parameters,
          ),
        };
      });

      return success({
        tools,
        totalCount,
        matchedCount,
        hint: t("get.hints.remoteFullSchema", {
          count: matchedCount,
          instanceId,
        }),
      });
    }

    const paginationHint =
      totalPages > 1
        ? t("get.hints.pagination", {
            page: safePage,
            total: totalPages,
            next: safePage + 1,
          })
        : "";
    return success({
      tools: pageSlice,
      totalCount,
      matchedCount,
      hint: t("get.hints.remoteList", {
        matched: matchedCount,
        total: totalCount,
        instanceId,
        detailThreshold: HelpRepository.COMPACT_FULL_DETAIL_THRESHOLD,
        pagination: paginationHint,
      }),
    });
  }

  static async getTools(
    data: HelpGetRequestOutput,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    locale: CountryLanguage,
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<ResponseType<HelpGetResponseOutput>> {
    logger.debug("[HelpTool] PROBE getTools entry", {
      instanceId: data.instanceId ?? null,
      platform,
    });
    // Remote instance tool discovery - bypass local registry
    if (data.instanceId) {
      // The local instance's own name resolves to the local listing — callers
      // (and models) may address the instance explicitly.
      const { RemoteConnectionRepository: SelfRepo } =
        await import("next-vibe/remote-connection/repository");
      const selfInstanceId = SelfRepo.deriveDefaultSelfInstanceId();
      if (data.instanceId !== selfInstanceId) {
        return HelpRepository.getToolsFromRemoteInstance(
          data.instanceId,
          data,
          user,
          locale,
          platform,
          logger,
        );
      }
    }

    const { t } = scopedTranslation.scopedT(locale);

    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

    // Three distinct output paths, one definition. Each shows/requires only what
    // its surface needs:
    //   - compact (AI + MCP + CRON): token-lean, gradual detail as results shrink
    //   - cli: full per-tool detail, no web stats/pin machinery
    //   - web (everything else): rich stats, pin tabs, category-first browsing
    // Compact wins even for admin: an admin inspecting `--platform=ai` must see
    // exactly what the AI consumer receives, not the web stats view.
    const isCompact = HelpRepository.isCompactPlatform(platform);
    const effectivePageSize =
      data.pageSize ??
      (isCompact
        ? HelpRepository.COMPACT_DEFAULT_PAGE_SIZE
        : HelpRepository.HUMAN_DEFAULT_PAGE_SIZE);
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
    logger.debug("[HelpTool] PROBE importing meta module", { localeFile });
    const metaModule = await (localeFile === "de"
      ? import("@/generated/endpoints/meta/de")
      : localeFile === "pl"
        ? import("@/generated/endpoints/meta/pl")
        : import("@/generated/endpoints/meta/en"));
    logger.debug("[HelpTool] PROBE meta module imported", { localeFile });
    const allMeta = metaModule.endpointsMeta as EndpointMeta[];
    logger.debug("[HelpTool] PROBE meta parsed", { count: allMeta.length });

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
    const isPublicView =
      viewAsRole === UserPermissionRole.PUBLIC || user.isPublic;
    const userRoles = viewAsRole
      ? [viewAsRole]
      : user.isPublic
        ? [UserPermissionRole.PUBLIC]
        : [...user.roles];

    // Filter meta by platform + user roles
    const filteredByPlatform = HelpRepository.filterMetaForUser(
      allMeta,
      discoveryPlatform,
      userRoles,
      isPublicView,
    );

    // Admin platform badges - derived directly from allowedRoles in meta.
    // Web/CLI admin only: compact (AI/MCP) consumers don't get the 10-entry
    // platforms array per tool — pure token bloat for an AI tool list.
    const getToolPlatforms = (tool: EndpointMeta): Platform[] | undefined => {
      if (!isAdmin || isCompact) {
        return undefined;
      }
      return HelpRepository.getMetaPlatforms(tool.allowedRoles);
    };

    let platformFilteredMeta = filteredByPlatform;
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
    // Server-side counts for the stats filter buttons (web only)
    let pinnedCount: number | undefined;
    let allowedCount: number | undefined;
    let webPinnedCount: number | undefined;
    let cliAllowedCount: number | undefined;
    let mcpPinnedCount: number | undefined;
    let mcpAllowedCount: number | undefined;
    // aiMeta: always AI-platform tools for the current user's role — independent of any
    // admin platformFilter. Used for AI pin/allowed counts and stats.
    let aiMetaForStats: EndpointMeta[] = HelpRepository.filterMetaForUser(
      allMeta,
      Platform.AI,
      userRoles,
      isPublicView,
    );
    // Hoisted so statsMeta (outside the try block) can reference them.
    let cascadeBase: Array<{
      toolId: string;
      requiresConfirmation: boolean;
    }> | null = null;
    let pinnedBase: Array<{
      toolId: string;
      requiresConfirmation: boolean;
    }> | null = null;
    if (!isCompact && !user.isPublic) {
      try {
        const { getDefaultToolIdsForUser, getDefaultWebPinnedIdsForUser } =
          await import("next-vibe/agent/chat/constants");

        logger.debug("[HelpTool] PROBE chat constants imported", {});
        const { db } = await import("next-vibe/database");
        logger.debug("[HelpTool] PROBE db imported", {});
        const { chatSettings } =
          await import("next-vibe/agent/chat/settings/db");
        const { DefaultFolderId } = await import("next-vibe/agent/chat/config");
        const { eq } = await import("drizzle-orm");

        // webPinnedTools: per-user sidebar bookmarks (independent of AI pinnedTools)
        // availableTools: AI-allowed tools from the active favorite
        // pinnedTools: AI-pinned tools (always in context) from the active favorite
        let dbWebPinned: string[] | null = null;
        let dbPinned: Array<{ toolId: string }> | null = null;

        logger.debug("[HelpTool] PROBE loading settings row", {});
        const [settingsRow] = await db
          .select({
            activeFavoriteId: chatSettings.activeFavoriteId,
            webPinnedTools: chatSettings.webPinnedTools,
          })
          .from(chatSettings)
          .where(eq(chatSettings.userId, user.id))
          .limit(1);

        if (settingsRow) {
          dbWebPinned = settingsRow.webPinnedTools ?? null;
        }

        if (settingsRow?.activeFavoriteId) {
          const { resolveAgentContext } =
            await import("next-vibe/agent/skills/resolve-context");
          // Central cascade (favorite → skill → NO_SKILL/role defaults). The
          // help tool only needs the effective PINNED list + the pre-union
          // skill bases (cascadeBase/pinnedBase) for its toggle-off materialize.
          const resolved = await resolveAgentContext({
            favoriteId: settingsRow.activeFavoriteId,
            skillId: undefined,
            user,
            rootFolderId: DefaultFolderId.PRIVATE,
            logger,
          });
          dbPinned = resolved.pinnedTools;
          cascadeBase = resolved.cascadeBase;
          pinnedBase = resolved.pinnedBase;
        }

        // When viewing as a different role, use that role's defaults for pins
        const effectiveUser: JwtPayloadType = viewAsRole
          ? isPublicView
            ? {
                leadId: user.leadId,
                roles: [UserPermissionRole.PUBLIC] as const,
                isPublic: true as const,
              }
            : {
                id: user.isPublic ? "" : user.id,
                leadId: user.leadId,
                roles: [viewAsRole] as [typeof viewAsRole],
                isPublic: false as const,
              }
          : user;

        // aiMetaForStats already computed above (hoisted for statsMeta access).
        const aiMeta = aiMetaForStats;

        // Web sidebar pinned: from webPinnedTools on settings (null = use defaults)
        const webPinnedIds: Set<string> =
          dbWebPinned !== null && !viewAsRole
            ? new Set(dbWebPinned)
            : new Set(getDefaultWebPinnedIdsForUser(effectiveUser));

        // AI pinned: from favorite's pinnedTools (null = use system defaults)
        const aiPinnedIds: Set<string> =
          dbPinned !== null && !viewAsRole
            ? new Set(dbPinned.map((entry) => entry.toolId))
            : new Set(getDefaultToolIdsForUser(effectiveUser));

        // cascadeBaseIds: the set the client should materialize from when toggling a tool off.
        // = skill's allowed list, or null = full AI platform.
        const cascadeBaseIds: Set<string> | null =
          cascadeBase !== null && !viewAsRole
            ? new Set(
                cascadeBase
                  .map((entry) => entry.toolId)
                  .filter((id) =>
                    aiMeta.some(
                      (m) =>
                        m.toolName === id || m.aliases.some((a) => a === id),
                    ),
                  ),
              )
            : null;

        const { inSet } = HelpRepository;

        // AI counts
        pinnedCount = aiMeta.filter((m) => inSet(m, aiPinnedIds)).length;
        webPinnedCount = aiMeta.filter((m) => inSet(m, webPinnedIds)).length;
        // allowed = all AI-platform tools (platform capability, not user/skill restriction)
        allowedCount = aiMeta.length;

        // CLI/MCP meta — computed once, reused for both counts and filter application.
        // Admin-only: non-admins never see CLI/MCP-specific breakdowns.
        let cliMetaCached: EndpointMeta[] | null = null;
        let mcpMetaCached: EndpointMeta[] | null = null;
        const getCliMeta = (): EndpointMeta[] => {
          cliMetaCached ??= HelpRepository.filterMetaForUser(
            allMeta,
            Platform.CLI,
            userRoles,
            isPublicView,
          );
          return cliMetaCached;
        };
        const getMcpMeta = (): EndpointMeta[] => {
          mcpMetaCached ??= HelpRepository.filterMetaForUser(
            allMeta,
            Platform.MCP,
            userRoles,
            isPublicView,
          );
          return mcpMetaCached;
        };

        if (isAdmin) {
          const cliMeta = getCliMeta();
          const mcpMeta = getMcpMeta();
          cliAllowedCount = cliMeta.length;
          // MCP: pinned = tools with MCP_VISIBLE (discovery list); allowed = all MCP-callable tools
          mcpPinnedCount = mcpMeta.filter((m) =>
            m.allowedRoles.includes(PlatformMarker.MCP_VISIBLE),
          ).length;
          mcpAllowedCount = mcpMeta.length;
        }

        // allAiToolIds: the cascade base the client uses when materializing from null.
        aiMetaForStats =
          cascadeBaseIds !== null
            ? aiMeta.filter((m) => inSet(m, cascadeBaseIds))
            : aiMeta;

        // Apply the active statsFilter to narrow the tool list returned to the client.
        // Web admin: "all" = AI platform tools; "webPinned" = web-platform tools filtered to pinned.
        if (statsFilter === "pinned") {
          platformFilteredMeta = aiMeta.filter((m) => inSet(m, aiPinnedIds));
        } else if (statsFilter === "webPinned") {
          // Web sidebar pins: base set = web-platform tools (not AI), filtered to pinned IDs.
          const webMeta = HelpRepository.filterMetaForUser(
            allMeta,
            Platform.NEXT_PAGE,
            userRoles,
            isPublicView,
          );
          platformFilteredMeta = webMeta.filter((m) => inSet(m, webPinnedIds));
        } else if (statsFilter === "allowed" || statsFilter === "all") {
          // "allowed" and "all" both show the full AI-platform tool set.
          platformFilteredMeta = aiMeta;
        } else if (statsFilter === "cliAllowed" && isAdmin) {
          platformFilteredMeta = getCliMeta();
        } else if (statsFilter === "mcpPinned" && isAdmin) {
          platformFilteredMeta = getMcpMeta().filter((m) =>
            m.allowedRoles.includes(PlatformMarker.MCP_VISIBLE),
          );
        } else if (statsFilter === "mcpAllowed" && isAdmin) {
          platformFilteredMeta = getMcpMeta();
        }
      } catch {
        // Favorite fetch failed - fall through with unfiltered list
      }
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
          pinnedCount,
          allowedCount,
          webPinnedCount,
          ...(isAdmin && {
            cliAllowedCount,
            mcpPinnedCount,
            mcpAllowedCount,
          }),
          allAiToolIds: aiMetaForStats.map((m) => m.toolName),
          skillPinnedDefault: pinnedBase?.map((e) => e.toolId) ?? null,
          skillAllowedDefault: cascadeBase?.map((e) => e.toolId) ?? null,
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
      const endpoint = await HelpRepository.loadEndpointForMeta(matchedTool);
      const parameters = endpoint
        ? (HelpRepository.getParameterSchema(endpoint, locale, platform) ??
          undefined)
        : undefined;
      const callAs = matchedTool.toolName;
      return success({
        tools: [
          HelpRepository.serializeMeta(
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
        const endpoint = await HelpRepository.loadEndpointForMeta(exactMatch);
        const parameters = endpoint
          ? (HelpRepository.getParameterSchema(endpoint, locale, platform) ??
            undefined)
          : undefined;
        const callAs = exactMatch.toolName;
        return success({
          tools: [
            HelpRepository.serializeMeta(
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
    const categories = HelpRepository.buildCategories(filtered);

    // When every matched tool shares one category, that category is constant —
    // for compact (AI/MCP) drop it from each tool AND from the (single-entry)
    // categories array. The hint still names the filter context.
    const singleCategory = isCompact && categories.length === 1;

    if (!hasFilters && !HelpRepository.isCompactPlatform(platform) && !isCli) {
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
      if (matchedCount <= HelpRepository.COMPACT_FULL_DETAIL_THRESHOLD) {
        const tools: HelpToolMetadataSerialized[] = await Promise.all(
          pageSlice.map(async (m) => {
            const endpoint = await HelpRepository.loadEndpointForMeta(m);
            const parameters = endpoint
              ? (HelpRepository.getParameterSchema(
                  endpoint,
                  locale,
                  platform,
                ) ?? undefined)
              : undefined;
            return HelpRepository.serializeMeta(
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
      if (matchedCount > HelpRepository.COMPACT_CATEGORY_ONLY_THRESHOLD) {
        return success({
          tools: [] satisfies HelpToolMetadataSerialized[],
          totalCount,
          matchedCount,
          categories,
          hint: t("get.hints.compactCategoryOnly", {
            matched: matchedCount,
            categories: categories.length,
            listThreshold: HelpRepository.COMPACT_CATEGORY_ONLY_THRESHOLD,
            detailThreshold: HelpRepository.COMPACT_FULL_DETAIL_THRESHOLD,
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
          HelpRepository.serializeMetaMinimal(
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
          detailThreshold: HelpRepository.COMPACT_FULL_DETAIL_THRESHOLD,
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
    if (isCli && matchedCount <= HelpRepository.COMPACT_FULL_DETAIL_THRESHOLD) {
      const tools: HelpToolMetadataSerialized[] = await Promise.all(
        pageSlice.map(async (m) => {
          const endpoint = await HelpRepository.loadEndpointForMeta(m);
          const parameters = endpoint
            ? (HelpRepository.getParameterSchema(endpoint, locale, platform) ??
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
            ? t("get.hints.noToolsMatched")
            : t("get.hints.cliFullDetail", { count: matchedCount }),
        ...adminMeta,
        ...statsMeta,
      });
    }

    logger.debug("[HelpTool] PROBE list return (categories fallback)", {});
    return success({
      tools: pageSlice.map((m) =>
        HelpRepository.serializeMeta(
          m,
          undefined,
          false,
          getToolPlatforms(m),
          isCompact,
        ),
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
