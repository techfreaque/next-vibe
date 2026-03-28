/**
 * Help Endpoint Definition
 * One endpoint for all platforms - tool discovery, CLI help, interactive mode.
 *
 * Platforms:
 *   Web   - full widget: search, categories, enable/disable toggles
 *   AI    - compact tool list with pagination (low token usage)
 *   MCP   - same as AI
 *   CLI   - response mode (default) or interactive mode (--interactive flag)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  UserPermissionRole,
  UserRole,
} from "@/app/api/[locale]/user/user-roles/enum";

import { cliRequestDataSchema } from "@/app/api/[locale]/system/unified-interface/cli/runtime/cli-request-data";
import { lazyCliWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-cli-widget";
import { Platform } from "../unified-interface/shared/types/platform";
import { TOOL_HELP_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const HelpToolsWidget = lazyCliWidget(() =>
  import("./widget").then((m) => ({ default: m.HelpToolsWidget })),
);

// Serializable tool metadata returned in response
const aiToolMetadataSchema = z.object({
  // Always present - `name` is the preferred call name (use this in execute-tool toolName param)
  name: z.string(),
  title: z.string(),
  description: z.string(),
  /** Internal technical ID (e.g. "system_server_rebuild_POST"). Use `name` to call tools, not this. Omitted for compact platforms (AI/MCP). */
  id: z.string().optional(),
  tags: z.array(z.string()).optional(),
  // Present in list mode with query/category
  method: z.string().optional(),
  category: z.string(),
  aliases: z.array(z.string()).optional(),
  // Only present in detail mode (toolName param)
  requiresConfirmation: z.boolean().optional(),
  /** Credit cost - only present when > 0 */
  credits: z.number().optional(),
  /** Platforms this tool is available on (admin only) */
  platforms: z.array(z.enum(Platform)).optional(),
  parameters: z.record(z.string(), z.unknown()).optional(),
  examples: z
    .object({
      inputs: z.record(z.string(), cliRequestDataSchema).optional(),
      responses: z.record(z.string(), cliRequestDataSchema).optional(),
    })
    .optional(),
  /** Remote instance this tool belongs to (only present for remote tools) */
  instanceId: z.string().optional(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "help"],
  aliases: [
    TOOL_HELP_ALIAS,
    "help",
    "h",
    "ai-tools",
    "tools:list",
    "list",
    "ls",
  ],
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "help-circle",
  category: "endpointCategories.system",
  tags: ["get.tags.tools" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.MCP_VISIBLE,
    UserRole.CLI_AUTH_BYPASS,
  ] as const,

  allowedLocalModeRoles: [] as const,

  cli: {
    firstCliArgKey: "query",
  },

  fields: customWidgetObject({
    render: HelpToolsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      query: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.query.label" as const,
        description: "get.fields.query.description" as const,
        placeholder: "get.fields.query.placeholder" as const,
        columns: 8,
        schema: z.string().optional(),
      }),

      category: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.category.label" as const,
        description: "get.fields.category.description" as const,
        columns: 4,
        schema: z.string().optional(),
      }),

      toolName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.toolName.label" as const,
        description: "get.fields.toolName.description" as const,
        columns: 4,
        schema: z.string().optional(),
      }),

      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.page.label" as const,
        description: "get.fields.page.description" as const,
        columns: 3,
        schema: z
          .number()
          .int()
          .optional()
          .transform((v) => (v && v >= 1 ? v : undefined)),
      }),

      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.pageSize.label" as const,
        description: "get.fields.pageSize.description" as const,
        columns: 3,
        schema: z
          .number()
          .int()
          .max(500)
          .optional()
          .transform((v) => (v && v >= 1 ? v : undefined)),
      }),

      platform: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.platform.label" as const,
        description: "get.fields.platform.description" as const,
        columns: 3,
        schema: z.enum(Platform).optional(),
        userRoles: [UserRole.ADMIN],
        visibleFor: [UserPermissionRole.ADMIN],
        hiddenForPlatforms: [
          Platform.AI,
          Platform.MCP,
          Platform.CRON,
          Platform.REMOTE_SKILL,
        ],
      }),

      includeProdOnly: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.includeProdOnly.label" as const,
        description: "get.fields.includeProdOnly.description" as const,
        columns: 3,
        schema: z.boolean().optional(),
        userRoles: [UserRole.ADMIN],
        visibleFor: [UserPermissionRole.ADMIN],
        hiddenForPlatforms: [
          Platform.AI,
          Platform.MCP,
          Platform.CRON,
          Platform.REMOTE_SKILL,
        ],
      }),

      instanceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.instanceId.label" as const,
        description: "get.fields.instanceId.description" as const,
        columns: 4,
        schema: z.string().optional(),
        userRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
      }),

      statsFilter: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.statsFilter.label" as const,
        description: "get.fields.statsFilter.description" as const,
        columns: 4,
        schema: z.enum(["all", "pinned", "allowed"]).optional(),
        hiddenForPlatforms: [
          Platform.AI,
          Platform.MCP,
          Platform.CRON,
          Platform.REMOTE_SKILL,
        ],
      }),

      // === RESPONSE FIELDS ===
      tools: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.tools.title" as const,
        schema: z.array(aiToolMetadataSchema),
      }),

      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.totalCount.title" as const,
        schema: z.number(),
      }),

      matchedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.matchedCount.title" as const,
        schema: z.number(),
      }),

      categories: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.categories.title" as const,
        schema: z
          .array(z.object({ name: z.string(), count: z.number() }))
          .optional(),
      }),

      hint: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.hint.title" as const,
        schema: z.string().optional(),
      }),

      currentPlatform: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.platform.label" as const,
        schema: z.string().optional(),
        userRoles: [UserRole.ADMIN],
      }),

      currentEnv: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.platform.label" as const,
        schema: z.enum(["development", "production"]).optional(),
        userRoles: [UserRole.ADMIN],
      }),

      pinnedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.pinnedCount.title" as const,
        schema: z.number().optional(),
      }),

      allowedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.allowedCount.title" as const,
        schema: z.number().optional(),
      }),

      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.currentPage.title" as const,
        schema: z.number().optional(),
      }),

      effectivePageSize: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.effectivePageSize.title" as const,
        schema: z.number().optional(),
      }),

      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.totalPages.title" as const,
        schema: z.number().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      default: {},
      searchByName: { query: "search" },
      filterByCategory: { category: "chat", page: 1, pageSize: 50 },
      toolDetail: { toolName: "agent_search_brave_GET" },
    },
    responses: {
      default: {
        tools: [],
        totalCount: 85,
        matchedCount: 0,
        categories: [
          { name: "Chat", count: 42 },
          { name: "System", count: 18 },
        ],
        hint: "No params = list all tools + categories. Use query to search, category to filter, toolName to get full parameter schema.",
        currentPage: 1,
        effectivePageSize: 200,
        totalPages: 1,
      },
      searchResult: {
        tools: [
          {
            name: "Brave Search",
            title: "Brave Search",
            method: "GET",
            description: "Search the web using Brave Search API",
            category: "Search",
            tags: ["search", "web"],
            id: "agent_search_brave_GET",
            aliases: ["web-search"],
          },
        ],
        totalCount: 85,
        matchedCount: 1,
        currentPage: 1,
        effectivePageSize: 25,
        totalPages: 1,
      },
    },
  },
});

const endpoints = { GET } as const;
export default endpoints;

export type HelpGetRequestInput = typeof GET.types.RequestInput;
export type HelpGetRequestOutput = typeof GET.types.RequestOutput;
export type HelpGetResponseInput = typeof GET.types.ResponseInput;
export type HelpGetResponseOutput = typeof GET.types.ResponseOutput;
export type HelpToolMetadataSerialized = HelpGetResponseOutput["tools"][0];
export type HelpToolParameters = HelpToolMetadataSerialized["parameters"];
