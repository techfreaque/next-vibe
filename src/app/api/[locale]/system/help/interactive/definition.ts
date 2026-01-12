/**
 * Interactive Mode Endpoint Definition
 * Provides file explorer-like navigation and form-based interface
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

import { UserRole } from "../../../user/user-roles/enum";

export const INTERACTIVE_MODE_ALIAS = "interactive" as const;

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "help", "interactive"],
  title: "app.api.system.help.interactive.post.title",
  description: "app.api.system.help.interactive.post.description",
  category: "app.api.system.help.interactive.post.category",
  tags: [
    "app.api.system.help.interactive.post.tags.system",
    "app.api.system.help.interactive.post.tags.help",
  ],
  icon: "book",
  allowedRoles: [
    UserRole.PRODUCTION_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.MCP_OFF,
  ],
  aliases: [INTERACTIVE_MODE_ALIAS, "i"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.help.interactive.post.title",
      description: "app.api.system.help.interactive.post.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      started: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.help.interactive.response.started",
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.help.interactive.errors.unauthorized.title",
      description: "app.api.system.help.interactive.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.help.interactive.errors.server.title",
      description: "app.api.system.help.interactive.errors.server.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.help.interactive.errors.unauthorized.title",
      description: "app.api.system.help.interactive.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.help.interactive.errors.unauthorized.title",
      description: "app.api.system.help.interactive.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.help.interactive.errors.server.title",
      description: "app.api.system.help.interactive.errors.server.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.help.interactive.errors.server.title",
      description: "app.api.system.help.interactive.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.help.interactive.errors.server.title",
      description: "app.api.system.help.interactive.errors.server.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.help.interactive.errors.server.title",
      description: "app.api.system.help.interactive.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.help.interactive.errors.server.title",
      description: "app.api.system.help.interactive.errors.server.description",
    },
  },

  successTypes: {
    title: "app.api.system.help.interactive.success.title",
    description: "app.api.system.help.interactive.success.description",
  },

  examples: {
    responses: {
      default: {
        started: true,
      },
    },
  },
});

export type InteractiveRequestInput = typeof POST.types.RequestInput;
export type InteractiveRequestOutput = typeof POST.types.RequestOutput;
export type InteractiveResponseInput = typeof POST.types.ResponseInput;
export type InteractiveResponseOutput = typeof POST.types.ResponseOutput;

const interactiveEndpoints = { POST };
export default interactiveEndpoints;
