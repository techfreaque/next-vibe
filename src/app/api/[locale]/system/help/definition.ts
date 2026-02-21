/**
 * Help Endpoint Definition
 * One endpoint for all platforms — tool discovery, CLI help, interactive mode.
 *
 * Platforms:
 *   Web   — full widget: search, categories, enable/disable toggles
 *   AI    — compact tool list with pagination (low token usage)
 *   MCP   — same as AI
 *   CLI   — response mode (default) or interactive mode (--interactive flag)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { TOOL_HELP_ALIAS } from "./constants";
import { HelpToolsWidget } from "./widget";

// Serializable tool metadata returned in response
const aiToolMetadataSchema = z.object({
  name: z.string(),
  method: z.string(),
  description: z.string(),
  category: z.string().optional(),
  tags: z.array(z.string()),
  toolName: z.string(),
  allowedRoles: z.array(z.string()).readonly(),
  aliases: z.array(z.string()).optional(),
  requiresConfirmation: z.boolean().optional(),
  // Only present in detail mode (toolName param)
  parameters: z.record(z.string(), z.unknown()).optional(),
});

const { GET } = createEndpoint({
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
  title: "app.api.system.help.get.title" as const,
  description: "app.api.system.help.get.description" as const,
  icon: "help-circle",
  category: "app.api.system.category" as const,
  tags: ["app.api.system.help.get.tags.tools" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.MCP_ON,
    UserRole.CLI_AUTH_BYPASS,
  ] as const,

  cli: {
    firstCliArgKey: "query",
  },

  fields: customWidgetObject({
    render: HelpToolsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      query: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.help.get.fields.query.label" as const,
        description:
          "app.api.system.help.get.fields.query.description" as const,
        placeholder:
          "app.api.system.help.get.fields.query.placeholder" as const,
        columns: 8,
        schema: z.string().optional(),
      }),

      category: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.help.get.fields.category.label" as const,
        description:
          "app.api.system.help.get.fields.category.description" as const,
        columns: 4,
        schema: z.string().optional(),
      }),

      toolName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.help.get.fields.toolName.label" as const,
        description:
          "app.api.system.help.get.fields.toolName.description" as const,
        columns: 4,
        schema: z.string().optional(),
      }),

      page: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.system.help.get.fields.page.label" as const,
        description: "app.api.system.help.get.fields.page.description" as const,
        columns: 3,
        schema: z
          .number()
          .int()
          .optional()
          .transform((v) => (v && v >= 1 ? v : undefined)),
      }),

      pageSize: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.system.help.get.fields.pageSize.label" as const,
        description:
          "app.api.system.help.get.fields.pageSize.description" as const,
        columns: 3,
        schema: z
          .number()
          .int()
          .max(500)
          .optional()
          .transform((v) => (v && v >= 1 ? v : undefined)),
      }),

      // === RESPONSE FIELDS ===
      tools: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.help.get.fields.tools.title" as const,
        schema: z.array(aiToolMetadataSchema),
      }),

      totalCount: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.help.get.fields.totalCount.title" as const,
        schema: z.number(),
      }),

      matchedCount: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.help.get.fields.matchedCount.title" as const,
        schema: z.number(),
      }),

      categories: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.help.get.fields.categories.title" as const,
        schema: z
          .array(z.object({ name: z.string(), count: z.number() }))
          .optional(),
      }),

      hint: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.help.get.fields.hint.title" as const,
        schema: z.string().optional(),
      }),

      currentPage: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.help.get.fields.currentPage.title" as const,
        schema: z.number().optional(),
      }),

      effectivePageSize: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.help.get.fields.effectivePageSize.title" as const,
        schema: z.number().optional(),
      }),

      totalPages: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.help.get.fields.totalPages.title" as const,
        schema: z.number().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.help.get.errors.validation.title" as const,
      description:
        "app.api.system.help.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.help.get.errors.network.title" as const,
      description:
        "app.api.system.help.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.help.get.errors.unauthorized.title" as const,
      description:
        "app.api.system.help.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.help.get.errors.forbidden.title" as const,
      description:
        "app.api.system.help.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.help.get.errors.notFound.title" as const,
      description:
        "app.api.system.help.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.help.get.errors.server.title" as const,
      description: "app.api.system.help.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.help.get.errors.unknown.title" as const,
      description:
        "app.api.system.help.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.help.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.system.help.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.help.get.errors.conflict.title" as const,
      description:
        "app.api.system.help.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.system.help.get.success.title" as const,
    description: "app.api.system.help.get.success.description" as const,
  },

  examples: {
    requests: {
      default: {},
      searchByName: { query: "search", page: 1 },
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
            method: "GET",
            description: "Search the web using Brave Search API",
            category: "Search",
            tags: ["search", "web"],
            toolName: "agent_search_brave_GET",
            allowedRoles: ["CUSTOMER", "ADMIN"],
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
