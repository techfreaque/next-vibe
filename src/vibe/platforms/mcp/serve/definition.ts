/**
 * MCP Server Serve Endpoint Definition
 * Starts the MCP server for CLI integration
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/platforms/mcp/i18n";
import { objectField, responseField } from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { MCP_ALIAS } from "./constants";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "platforms", "mcp", "serve"],
  aliases: [MCP_ALIAS] as const,
  title: "serve.post.title" as const,
  titleShort: "serve.post.titleShort" as const,
  description: "serve.post.description" as const,
  icon: "plug",
  category: "devTools",
  subCategory: "interfacesMcp",
  tags: ["serve.tags.mcp" as const],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ] as const,
  timeoutMs: 0,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "serve.post.response.title" as const,
    description: "serve.post.response.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "serve.post.response.title",
        schema: z.string(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "serve.post.errors.validation.title",
      description: "serve.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "serve.post.errors.server.title",
      description: "serve.post.errors.server.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "serve.post.errors.unauthorized.title",
      description: "serve.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "serve.post.errors.unauthorized.title",
      description: "serve.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "serve.post.errors.server.title",
      description: "serve.post.errors.server.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "serve.post.errors.server.title",
      description: "serve.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "serve.post.errors.server.title",
      description: "serve.post.errors.server.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "serve.post.errors.server.title",
      description: "serve.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "serve.post.errors.server.title",
      description: "serve.post.errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "serve.post.success.title",
    description: "serve.post.success.description",
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
