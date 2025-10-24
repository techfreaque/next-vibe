/**
 * Setup Uninstall Definition
 * API endpoint definition for CLI global uninstallation
 * Following migration guide: Files at level of usage, split god repositories
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

import { UserRole } from "../../../../../user/user-roles/enum";

/**
 * Setup Uninstall Endpoint Definition
 */
const { POST } = createEndpoint({
  title: "app.api.v1.core.system.cli.setup.uninstall.post.title",
  description: "app.api.v1.core.system.cli.setup.uninstall.post.description",
  category: "app.api.v1.core.system.cli.setup.uninstall.post.title",
  tags: ["app.api.v1.core.system.cli.setup.uninstall.post.title"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["uninstall", "setup:uninstall"],
  method: Methods.POST,
  path: ["v1", "core", "system", "setup", "uninstall"],
  examples: {
    requests: {},
    urlPathVariables: undefined,
    responses: {},
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.cli.setup.uninstall.post.title",
      description:
        "app.api.v1.core.system.cli.setup.uninstall.post.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.cli.setup.uninstall.post.title",
          description:
            "app.api.v1.core.system.cli.setup.uninstall.post.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.cli.setup.uninstall.post.success.title",
        },
        z.boolean(),
      ),

      installed: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.cli.setup.uninstall.post.title",
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.cli.setup.uninstall.post.success.description",
        },
        z.string(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.cli.setup.uninstall.post.title",
        },
        z.string().optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.validation.title",
      description:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.server.title",
      description:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.network.title",
      description:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.cli.setup.uninstall.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.cli.setup.uninstall.post.success.title",
    description:
      "app.api.v1.core.system.cli.setup.uninstall.post.success.description",
  },
});

const endpoints = { POST };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type UninstallRequestInput = typeof POST.types.RequestInput;
export type UninstallRequestOutput = typeof POST.types.RequestOutput;
export type UninstallResponseInput = typeof POST.types.ResponseInput;
export type UninstallResponseOutput = typeof POST.types.ResponseOutput;
