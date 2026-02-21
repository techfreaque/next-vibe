/**
 * MCP Server Serve Endpoint Definition
 * Starts the MCP server for CLI integration
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "unified-interface", "mcp", "serve"],
  aliases: ["mcp", "mcp:serve", "mcp:start", "start-mcp"],
  title: "app.api.system.unifiedInterface.mcp.serve.post.title" as const,
  description:
    "app.api.system.unifiedInterface.mcp.serve.post.description" as const,
  icon: "plug",
  category: "app.api.system.category" as const,
  tags: ["app.api.system.unifiedInterface.mcp.serve.tags.mcp" as const],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.unifiedInterface.mcp.serve.post.response.title" as const,
      description:
        "app.api.system.unifiedInterface.mcp.serve.post.response.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      status: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.mcp.serve.post.response.title",
        schema: z.string(),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.server.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.server.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.server.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.mcp.serve.post.errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.unifiedInterface.mcp.serve.post.success.title",
    description:
      "app.api.system.unifiedInterface.mcp.serve.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        status: "MCP server started",
      },
    },
  },
});

const serveDefinition = { POST };

export default serveDefinition;

// Export types
export type MCPServeRequestInput = typeof POST.types.RequestInput;
export type MCPServeRequestOutput = typeof POST.types.RequestOutput;
export type MCPServeResponseInput = typeof POST.types.ResponseInput;
export type MCPServeResponseOutput = typeof POST.types.ResponseOutput;
