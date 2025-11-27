/**
 * MCP Tool Execute Endpoint Definition
 * Executes an MCP tool by name
 */

import { z } from "zod";

import { createEndpoint } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/create';
import {
  objectField,
  requestDataField,
  responseArrayField,
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

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "unified-interface", "mcp", "execute"],
  aliases: ["mcp-execute", "mcp:exec", "mcp:run"],
  title:
    "app.api.v1.core.system.unifiedInterface.mcp.execute.post.title" as const,
  description:
    "app.api.v1.core.system.unifiedInterface.mcp.execute.post.description" as const,
  category:
    "app.api.v1.core.system.unifiedInterface.mcp.execute.category" as const,
  tags: [
    "app.api.v1.core.system.unifiedInterface.mcp.execute.tags.mcp" as const,
  ],
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
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.fields.title" as const,
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.fields.description" as const,
      layoutType: LayoutType.GRID, columns: 12,
    },
    { request: "data", response: true },
    {
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.unifiedInterface.mcp.execute.post.fields.name.title" as const,
          description:
            "app.api.v1.core.system.unifiedInterface.mcp.execute.post.fields.name.description" as const,
          placeholder:
            "app.api.v1.core.system.unifiedInterface.mcp.execute.post.fields.name.placeholder" as const,
        },
        z.string().min(1),
      ),
      arguments: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label:
            "app.api.v1.core.system.unifiedInterface.mcp.execute.post.fields.arguments.title" as const,
          description:
            "app.api.v1.core.system.unifiedInterface.mcp.execute.post.fields.arguments.description" as const,
          placeholder:
            "app.api.v1.core.system.unifiedInterface.mcp.execute.post.fields.arguments.placeholder" as const,
        },
        z.record(z.string(), z.unknown()).optional().default({}),
      ),
      content: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "type",
              label:
                "app.api.v1.core.system.unifiedInterface.mcp.execute.post.response.result.content.type" as const,
            },
            {
              key: "text",
              label:
                "app.api.v1.core.system.unifiedInterface.mcp.execute.post.response.result.content.text" as const,
            },
          ],
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.VERTICAL,
          },
          { response: true },
          {
            type: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.unifiedInterface.mcp.execute.post.response.result.content.type" as const,
              },
              z.literal("text"),
            ),
            text: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.unifiedInterface.mcp.execute.post.response.result.content.text" as const,
              },
              z.string(),
            ),
          },
        ),
      ),
      isError: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.v1.core.system.unifiedInterface.mcp.execute.post.response.result.isError" as const,
        },
        z.boolean(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.server.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedInterface.mcp.execute.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.v1.core.system.unifiedInterface.mcp.execute.post.success.title",
    description:
      "app.api.v1.core.system.unifiedInterface.mcp.execute.post.success.description",
  },

  examples: {
    requests: {
      default: {
        name: "core:system:db:ping",
        arguments: {},
      },
    },
    responses: {
      default: {
        content: [{ type: "text" as const, text: '{"success": true}' }],
        isError: false,
      },
    },
    urlPathParams: undefined,
  },
});

const executeDefinition = { POST };

export { POST };

export default executeDefinition;

// Export types
export type MCPExecuteRequestInput = typeof POST.types.RequestInput;
export type MCPExecuteRequestOutput = typeof POST.types.RequestOutput;
export type MCPExecuteResponseInput = typeof POST.types.ResponseInput;
export type MCPExecuteResponseOutput = typeof POST.types.ResponseOutput;
