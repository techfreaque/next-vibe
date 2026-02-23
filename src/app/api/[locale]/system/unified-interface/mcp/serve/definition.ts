/**
 * MCP Server Serve Endpoint Definition
 * Starts the MCP server for CLI integration
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "mcp", "serve"],
  aliases: ["mcp", "mcp:serve", "mcp:start", "start-mcp"],
  title: "serve.post.title" as const,
  description: "serve.post.description" as const,
  icon: "plug",
  category: "serve.category" as const,
  tags: ["serve.tags.mcp" as const],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ] as const,

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "serve.post.response.title" as const,
    description: "serve.post.response.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      status: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "serve.post.response.title",
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
