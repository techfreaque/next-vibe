/**
 * Setup Uninstall Definition
 * API endpoint definition for CLI global uninstallation
 * Following migration guide: Files at level of usage, split god repositories
 */

import { translatedValueSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/platforms/cli/setup/uninstall/i18n";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

/**
 * Setup Uninstall Endpoint Definition
 */
const { POST } = createEndpoint({
  scopedTranslation,
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "package",
  category: "devTools",
  subCategory: "interfacesCli",
  tags: ["post.title"],
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF, UserRole.AI_TOOL_OFF],
  aliases: ["uninstall", "setup:uninstall"],
  method: Methods.POST,
  path: ["vibe", "platforms", "cli", "setup", "uninstall"],
  examples: {
    requests: {
      default: {
        verbose: false,
      },
      verbose: {
        verbose: true,
      },
    },
    responses: {
      default: {
        success: true,
        installed: true,
        message: "Vibe CLI uninstalled successfully",
        output: "Vibe CLI uninstalled successfully",
      },
      verbose: {
        success: true,
        installed: true,
        message: "Vibe CLI uninstalled successfully",
        output: "Vibe CLI uninstalled successfully",
      },
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.title",
    description: "post.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      verbose: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.success.title",
        schema: z.boolean(),
      }),

      installed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.title",
        schema: z.boolean(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.success.description",
        schema: translatedValueSchema,
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.title",
        schema: z.string().optional(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
});

const endpoints = { POST };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type UninstallRequestInput = typeof POST.types.RequestInput;
export type UninstallRequestOutput = typeof POST.types.RequestOutput;
export type UninstallResponseInput = typeof POST.types.ResponseInput;
export type UninstallResponseOutput = typeof POST.types.ResponseOutput;
