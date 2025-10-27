/**
 * MCP Tool Execute Endpoint Definition
 * Executes an MCP tool by name
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "unified-ui", "mcp", "execute"],
  aliases: ["mcp-execute", "mcp:exec", "mcp:run"],
  title: "app.api.v1.core.system.unifiedUi.mcp.execute.post.title" as const,
  description:
    "app.api.v1.core.system.unifiedUi.mcp.execute.post.description" as const,
  category: "app.api.v1.core.system.unifiedUi.mcp.execute.category" as const,
  tags: ["app.api.v1.core.system.unifiedUi.mcp.execute.tags.mcp" as const],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.fields.title" as const,
      description:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.fields.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: false },
    {
      name: requestDataField(
        {
          type: WidgetType.TEXT,
          title:
            "app.api.v1.core.system.unifiedUi.mcp.execute.post.fields.name.title" as const,
          description:
            "app.api.v1.core.system.unifiedUi.mcp.execute.post.fields.name.description" as const,
          placeholder: "core:system:db:ping",
        },
        z.string().min(1),
      ),
      arguments: requestDataField(
        {
          type: WidgetType.TEXT,
          title:
            "app.api.v1.core.system.unifiedUi.mcp.execute.post.fields.arguments.title" as const,
          description:
            "app.api.v1.core.system.unifiedUi.mcp.execute.post.fields.arguments.description" as const,
          placeholder: "{}",
        },
        z.record(z.unknown()).optional().default({}),
      ),
    },
  ),

  // Response fields
  responseFields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.response.title" as const,
      description:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.response.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      content: responseField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "type",
              label:
                "app.api.v1.core.system.unifiedUi.mcp.execute.post.response.content.type" as const,
              type: FieldDataType.TEXT,
            },
            {
              key: "text",
              label:
                "app.api.v1.core.system.unifiedUi.mcp.execute.post.response.content.text" as const,
              type: FieldDataType.TEXT,
            },
          ],
        },
        z.array(
          z.union([
            z.object({
              type: z.literal("text"),
              text: z.string(),
            }),
            z.object({
              type: z.literal("image"),
              data: z.string(),
              mimeType: z.string(),
            }),
            z.object({
              type: z.literal("resource"),
              uri: z.string(),
              mimeType: z.string().optional(),
            }),
          ]),
        ),
      ),
      isError: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.v1.core.system.unifiedUi.mcp.execute.post.response.isError" as const,
        },
        z.boolean().optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.server.title",
      description:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedUi.mcp.execute.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.unifiedUi.mcp.execute.post.success.title",
    description:
      "app.api.v1.core.system.unifiedUi.mcp.execute.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    request: {
      name: "core:system:db:ping",
      arguments: {},
    },
    responses: {
      default: {
        content: [{ type: "text" as const, text: '{"success": true}' }],
        isError: false,
      },
    },
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
