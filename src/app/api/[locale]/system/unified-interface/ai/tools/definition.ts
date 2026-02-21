/**
 * AI Tools List Endpoint Definition
 * Returns available AI tools for current user
 * Also serves as tool-help: AI can call this to discover available tools
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

import { AIToolsWidget } from "./widget";

export const TOOL_HELP_ALIAS = "tool-help" as const;

// AI Tool metadata schema - serializable version for API response
// Compact by default; parameters included only when requesting detail for a specific tool
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
  // Only present when detail mode (toolName param) is used
  parameters: z.record(z.string(), z.unknown()).optional(),
});

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["system", "unified-interface", "ai", "tools"],
  aliases: [TOOL_HELP_ALIAS, "ai-tools", "tools:list"],
  title: "app.api.system.unifiedInterface.ai.tools.get.title" as const,
  description:
    "app.api.system.unifiedInterface.ai.tools.get.description" as const,
  icon: "wand",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.system.unifiedInterface.ai.tools.tags.tools" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.MCP_ON,
  ] as const,

  cli: {
    firstCliArgKey: "query",
  },

  fields: customWidgetObject({
    render: AIToolsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      query: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.ai.tools.get.fields.query.label" as const,
        description:
          "app.api.system.unifiedInterface.ai.tools.get.fields.query.description" as const,
        placeholder:
          "app.api.system.unifiedInterface.ai.tools.get.fields.query.placeholder" as const,
        columns: 8,
        schema: z.string().optional(),
      }),

      category: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.ai.tools.get.fields.category.label" as const,
        description:
          "app.api.system.unifiedInterface.ai.tools.get.fields.category.description" as const,
        columns: 4,
        schema: z.string().optional(),
      }),

      toolName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.ai.tools.get.fields.toolName.label" as const,
        description:
          "app.api.system.unifiedInterface.ai.tools.get.fields.toolName.description" as const,
        columns: 4,
        schema: z.string().optional(),
      }),

      // === RESPONSE FIELDS ===
      tools: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.ai.tools.get.fields.tools.title" as const,
        schema: z.array(aiToolMetadataSchema),
      }),

      totalCount: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.ai.tools.get.fields.totalCount.title" as const,
        schema: z.number(),
      }),

      matchedCount: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.ai.tools.get.fields.matchedCount.title" as const,
        schema: z.number(),
      }),

      categories: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.ai.tools.get.fields.categories.title" as const,
        schema: z
          .array(
            z.object({
              name: z.string(),
              count: z.number(),
            }),
          )
          .optional(),
      }),

      hint: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.ai.tools.get.fields.hint.title" as const,
        schema: z.string().optional(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.network.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.unifiedInterface.ai.tools.get.errors.server.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.unsavedChanges.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.unifiedInterface.ai.tools.get.success.title",
    description:
      "app.api.system.unifiedInterface.ai.tools.get.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {},
      searchByName: {
        query: "search",
      },
      filterByCategory: {
        category: "chat",
      },
    },
    responses: {
      default: {
        tools: [],
        totalCount: 0,
        matchedCount: 0,
        categories: [{ name: "Chat", count: 95 }],
        hint: "Use query to search, category to browse, or toolName for full schema.",
      },
    },
  },
});

const toolsDefinition = { GET };

export default toolsDefinition;

// Export types as required by migration guide
export type AIToolsListRequestInput = typeof GET.types.RequestInput;
export type AIToolsListRequestOutput = typeof GET.types.RequestOutput;
export type AIToolsListResponseInput = typeof GET.types.ResponseInput;
export type AIToolsListResponseOutput = typeof GET.types.ResponseOutput;

// Inferred types for component use
export type AIToolMetadataSerialized = AIToolsListResponseOutput["tools"][0];
