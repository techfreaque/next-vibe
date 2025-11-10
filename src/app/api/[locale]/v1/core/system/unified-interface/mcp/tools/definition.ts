/**
 * MCP Tools List Endpoint Definition
 * Returns available MCP tools for current user
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "unified-interface", "mcp", "tools"],
  aliases: ["mcp-tools", "mcp:tools", "tools:mcp"],
  title: "app.api.v1.core.system.unifiedInterface.mcp.tools.get.title" as const,
  description:
    "app.api.v1.core.system.unifiedInterface.mcp.tools.get.description" as const,
  category:
    "app.api.v1.core.system.unifiedInterface.mcp.tools.category" as const,
  tags: ["app.api.v1.core.system.unifiedInterface.mcp.tools.tags.mcp" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.response.title" as const,
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.response.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      tools: responseField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "name",
              label:
                "app.api.v1.core.system.unifiedInterface.mcp.tools.get.fields.name" as const,
              type: FieldDataType.TEXT,
            },
            {
              key: "description",
              label:
                "app.api.v1.core.system.unifiedInterface.mcp.tools.get.fields.description" as const,
              type: FieldDataType.TEXT,
            },
            {
              key: "inputSchema",
              label:
                "app.api.v1.core.system.unifiedInterface.mcp.tools.get.fields.inputSchema" as const,
              type: FieldDataType.TEXT,
            },
          ],
        },
        z.array(
          z.object({
            name: z.string(),
            description: z.string(),
            inputSchema: z.object({
              type: z.literal("object"),
              properties: z.record(z.string(), z.unknown()).optional(),
              required: z.array(z.string()).optional(),
              additionalProperties: z.boolean().optional(),
            }),
          }),
        ),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.server.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.unknown.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.tools.get.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.v1.core.system.unifiedInterface.mcp.tools.get.success.title",
    description:
      "app.api.v1.core.system.unifiedInterface.mcp.tools.get.success.description",
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        tools: [],
      },
    },
  },
});

const toolsDefinition = { GET };

export { GET };

export default toolsDefinition;

// Export types
export type MCPToolsListRequestInput = typeof GET.types.RequestInput;
export type MCPToolsListRequestOutput = typeof GET.types.RequestOutput;
export type MCPToolsListResponseInput = typeof GET.types.ResponseInput;
export type MCPToolsListResponseOutput = typeof GET.types.ResponseOutput;
