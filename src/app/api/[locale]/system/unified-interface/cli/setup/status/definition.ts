/**
 * Setup Status Definition
 * API endpoint definition for checking CLI installation status
 * Following migration guide: Files at level of usage, split god repositories
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../../user/user-roles/enum";

/**
 * Setup Status Endpoint Definition
 */
const { POST } = createEndpoint({
  title: "app.api.system.unifiedInterface.cli.setup.status.post.title",
  description: "app.api.system.unifiedInterface.cli.setup.status.post.description",
  icon: "terminal",
  category: "app.api.system.unifiedInterface.cli.setup.status.post.title",
  tags: ["app.api.system.unifiedInterface.cli.setup.status.post.title"],
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF, UserRole.AI_TOOL_OFF, UserRole.MCP_OFF],
  aliases: ["status", "setup:status"],
  method: Methods.POST,
  path: ["system", "setup", "status"],
  examples: {
    requests: {},
    urlPathParams: undefined,
    responses: {},
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.unifiedInterface.cli.setup.status.post.title",
      description: "app.api.system.unifiedInterface.cli.setup.status.post.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.unifiedInterface.cli.setup.status.post.response.fields.success",
        },
        z.boolean(),
      ),

      installed: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.cli.setup.status.post.response.fields.installed",
        },
        z.boolean(),
      ),

      version: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.unifiedInterface.cli.setup.status.post.response.fields.version",
        },
        z.string().optional(),
      ),

      path: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.unifiedInterface.cli.setup.status.post.response.fields.path",
        },
        z.string().optional(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.unifiedInterface.cli.setup.status.post.response.fields.message",
        },
        z.string(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.unifiedInterface.cli.setup.status.post.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.status.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.unifiedInterface.cli.setup.status.post.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.status.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.unifiedInterface.cli.setup.status.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.status.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.unifiedInterface.cli.setup.status.post.errors.network.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.status.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.unifiedInterface.cli.setup.status.post.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.status.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.unifiedInterface.cli.setup.status.post.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.status.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.unifiedInterface.cli.setup.status.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.status.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.unifiedInterface.cli.setup.status.post.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.status.post.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.unifiedInterface.cli.setup.status.post.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.status.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.unifiedInterface.cli.setup.status.post.success.title",
    description: "app.api.system.unifiedInterface.cli.setup.status.post.success.description",
  },
});

const endpoints = { POST };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type StatusRequestInput = typeof POST.types.RequestInput;
export type StatusRequestOutput = typeof POST.types.RequestOutput;
export type StatusResponseInput = typeof POST.types.ResponseInput;
export type StatusResponseOutput = typeof POST.types.ResponseOutput;
