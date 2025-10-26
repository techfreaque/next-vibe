/**
 * Setup Update Definition
 * API endpoint definition for CLI update (uninstall + reinstall)
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
 * Setup Update Endpoint Definition
 */
const { POST } = createEndpoint({
  title: "app.api.v1.core.system.cli.setup.update.post.title",
  description: "app.api.v1.core.system.cli.setup.update.post.description",
  category: "app.api.v1.core.system.cli.setup.update.post.title",
  tags: ["app.api.v1.core.system.cli.setup.update.post.title"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["update", "setup:update"],
  method: Methods.POST,
  path: ["v1", "core", "system", "setup", "update"],
  examples: {
    requests: {},
    urlPathParams: undefined,
    responses: {},
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.cli.setup.update.post.title",
      description: "app.api.v1.core.system.cli.setup.update.post.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.cli.setup.update.post.title",
          description:
            "app.api.v1.core.system.cli.setup.update.post.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.cli.setup.update.post.success.title",
        },
        z.boolean(),
      ),

      installed: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.cli.setup.update.post.title",
        },
        z.boolean(),
      ),

      version: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.cli.setup.update.post.description",
        },
        z.string().optional(),
      ),

      path: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.cli.setup.update.post.title",
        },
        z.string().optional(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.cli.setup.update.post.success.description",
        },
        z.string(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.cli.setup.update.post.title",
        },
        z.string().optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.cli.setup.update.post.errors.validation.title",
      description:
        "app.api.v1.core.system.cli.setup.update.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.cli.setup.update.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.cli.setup.update.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.cli.setup.update.post.errors.server.title",
      description:
        "app.api.v1.core.system.cli.setup.update.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.cli.setup.update.post.errors.network.title",
      description:
        "app.api.v1.core.system.cli.setup.update.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.cli.setup.update.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.cli.setup.update.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.cli.setup.update.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.cli.setup.update.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.cli.setup.update.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.cli.setup.update.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.cli.setup.update.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.cli.setup.update.post.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.cli.setup.update.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.cli.setup.update.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.cli.setup.update.post.success.title",
    description:
      "app.api.v1.core.system.cli.setup.update.post.success.description",
  },
});

const endpoints = { POST };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type UpdateRequestInput = typeof POST.types.RequestInput;
export type UpdateRequestOutput = typeof POST.types.RequestOutput;
export type UpdateResponseInput = typeof POST.types.ResponseInput;
export type UpdateResponseOutput = typeof POST.types.ResponseOutput;
