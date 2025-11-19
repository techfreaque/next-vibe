/**
 * Setup Install Definition
 * API endpoint definition for CLI global installation
 * Following migration guide: Files at level of usage, split god repositories
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../../user/user-roles/enum";

/**
 * Setup Install Endpoint Definition
 */
const { POST } = createEndpoint({
  title: "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.title",
  description:
    "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.description",
  category:
    "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.title",
  tags: [
    "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.title",
  ],
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF, UserRole.AI_TOOL_OFF],
  aliases: ["install", "setup"],
  method: Methods.POST,
  path: ["v1", "core", "system", "setup", "install"],
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
          "app.api.v1.core.system.unifiedInterface.cli.setup.install.installSuccessAt",
        output:
          "app.api.v1.core.system.unifiedInterface.cli.setup.install.installSuccess",
      },
      force: {
        success: true,
        installed: true,
        version: "1.0.0",
        path: "/usr/local/bin/vibe",
        message:
          "app.api.v1.core.system.unifiedInterface.cli.setup.install.installSuccessAt",
        output:
          "app.api.v1.core.system.unifiedInterface.cli.setup.install.installSuccess",
      },
      verbose: {
        success: true,
        installed: true,
        version: "1.0.0",
        path: "/usr/local/bin/vibe",
        message:
          "app.api.v1.core.system.unifiedInterface.cli.setup.install.installSuccessAt",
        output:
          "app.api.v1.core.system.unifiedInterface.cli.setup.install.installSuccess",
      },
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.title",
      description:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.title",
          description:
            "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.title",
          description:
            "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.success.title",
        },
        z.boolean(),
      ),

      installed: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.title",
        },
        z.boolean(),
      ),

      version: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.description",
        },
        z.string().optional(),
      ),

      path: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.title",
        },
        z.string().optional(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.title",
        },
        z.string(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.title",
        },
        z.string().optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.server.title",
      description:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.success.title",
    description:
      "app.api.v1.core.system.unifiedInterface.cli.setup.install.post.success.description",
  },
});

// Export types for repository usage - following migration guide pattern
export type InstallRequestInput = typeof POST.types.RequestInput;
export type InstallRequestOutput = typeof POST.types.RequestOutput;
export type InstallResponseInput = typeof POST.types.ResponseInput;
export type InstallResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
