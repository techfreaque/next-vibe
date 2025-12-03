/**
 * Setup Update Definition
 * API endpoint definition for CLI update (uninstall + reinstall)
 * Following migration guide: Files at level of usage, split god repositories
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../../user/user-roles/enum";

/**
 * Setup Update Endpoint Definition
 */
const { POST } = createEndpoint({
  title: "app.api.system.unifiedInterface.cli.setup.update.post.title",
  description:
    "app.api.system.unifiedInterface.cli.setup.update.post.description",
  category: "app.api.system.unifiedInterface.cli.setup.update.post.title",
  tags: ["app.api.system.unifiedInterface.cli.setup.update.post.title"],
  allowedRoles: [UserRole.ADMIN],
  aliases: ["update", "setup:update"],
  method: Methods.POST,
  path: ["system", "setup", "update"],
  examples: {
    requests: {},
    urlPathParams: undefined,
    responses: {},
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.unifiedInterface.cli.setup.update.post.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.update.post.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.unifiedInterface.cli.setup.update.post.title",
          description:
            "app.api.system.unifiedInterface.cli.setup.update.post.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.cli.setup.update.post.success.title",
        },
        z.boolean(),
      ),

      installed: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.cli.setup.update.post.title",
        },
        z.boolean(),
      ),

      version: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.cli.setup.update.post.description",
        },
        z.string().optional(),
      ),

      path: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.cli.setup.update.post.title",
        },
        z.string().optional(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.cli.setup.update.post.success.description",
        },
        z.string(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.cli.setup.update.post.title",
        },
        z.string().optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.network.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.cli.setup.update.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.system.unifiedInterface.cli.setup.update.post.success.title",
    description:
      "app.api.system.unifiedInterface.cli.setup.update.post.success.description",
  },
});

const endpoints = { POST };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type UpdateRequestInput = typeof POST.types.RequestInput;
export type UpdateRequestOutput = typeof POST.types.RequestOutput;
export type UpdateResponseInput = typeof POST.types.ResponseInput;
export type UpdateResponseOutput = typeof POST.types.ResponseOutput;
