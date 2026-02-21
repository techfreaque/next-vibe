/**
 * Setup Install Definition
 * API endpoint definition for CLI global installation
 * Following migration guide: Files at level of usage, split god repositories
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../../user/user-roles/enum";

/**
 * Setup Install Endpoint Definition
 */
const { POST } = createEndpoint({
  title: "app.api.system.unifiedInterface.cli.setup.install.post.title",
  description:
    "app.api.system.unifiedInterface.cli.setup.install.post.description",
  icon: "download",
  category: "app.api.system.category",
  tags: ["app.api.system.unifiedInterface.cli.setup.install.post.title"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["install", "setup"],
  method: Methods.POST,
  path: ["system", "unified-interface", "cli", "setup", "install"],
  examples: {
    requests: {
      default: {
        force: false,
        verbose: false,
      },
      force: {
        force: true,
        verbose: false,
      },
      verbose: {
        force: false,
        verbose: true,
      },
    },
    responses: {
      default: {
        success: true,
        installed: true,
        version: "1.0.0",
        path: "/usr/local/bin/vibe",
        message:
          "app.api.system.unifiedInterface.cli.setup.install.installSuccessAt",
        output:
          "app.api.system.unifiedInterface.cli.setup.install.installSuccess",
      },
      force: {
        success: true,
        installed: true,
        version: "1.0.0",
        path: "/usr/local/bin/vibe",
        message:
          "app.api.system.unifiedInterface.cli.setup.install.installSuccessAt",
        output:
          "app.api.system.unifiedInterface.cli.setup.install.installSuccess",
      },
      verbose: {
        success: true,
        installed: true,
        version: "1.0.0",
        path: "/usr/local/bin/vibe",
        message:
          "app.api.system.unifiedInterface.cli.setup.install.installSuccessAt",
        output:
          "app.api.system.unifiedInterface.cli.setup.install.installSuccess",
      },
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.unifiedInterface.cli.setup.install.post.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.install.post.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      force: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.unifiedInterface.cli.setup.install.post.title",
        description:
          "app.api.system.unifiedInterface.cli.setup.install.post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      verbose: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.unifiedInterface.cli.setup.install.post.title",
        description:
          "app.api.system.unifiedInterface.cli.setup.install.post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.cli.setup.install.post.success.title",
        schema: z.boolean(),
      }),

      installed: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.unifiedInterface.cli.setup.install.post.title",
        schema: z.boolean(),
      }),

      version: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.cli.setup.install.post.description",
        schema: z.string().optional(),
      }),

      path: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.unifiedInterface.cli.setup.install.post.title",
        schema: z.string().optional(),
      }),

      message: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.unifiedInterface.cli.setup.install.post.title",
        schema: z.string(),
      }),

      output: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.unifiedInterface.cli.setup.install.post.title",
        schema: z.string().optional(),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.network.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.install.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.system.unifiedInterface.cli.setup.install.post.success.title",
    description:
      "app.api.system.unifiedInterface.cli.setup.install.post.success.description",
  },
});

// Export types for repository usage - following migration guide pattern
export type InstallRequestInput = typeof POST.types.RequestInput;
export type InstallRequestOutput = typeof POST.types.RequestOutput;
export type InstallResponseInput = typeof POST.types.ResponseInput;
export type InstallResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
