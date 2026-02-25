/**
 * Setup Update Definition
 * API endpoint definition for CLI update (uninstall + reinstall)
 * Following migration guide: Files at level of usage, split god repositories
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";

/**
 * Setup Update Endpoint Definition
 */
const { POST } = createEndpoint({
  scopedTranslation,
  title: "post.title",
  description: "post.description",
  icon: "wrench",
  category: "app.endpointCategories.system",
  tags: ["post.title"],
  allowedRoles: [UserRole.ADMIN],
  aliases: ["update", "setup:update"],
  method: Methods.POST,
  path: ["system", "setup", "update"],
  examples: {
    requests: {
      default: {
        verbose: false,
      },
    },
    responses: {
      default: {
        success: true,
        installed: true,
        version: "1.0.0",
        path: "/usr/local/bin/vibe",
        message: "Vibe CLI updated successfully",
        output: "Vibe CLI updated successfully",
      },
    },
  },

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.title",
    description: "post.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      verbose: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.success.title",
        schema: z.boolean(),
      }),

      installed: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.title",
        schema: z.boolean(),
      }),

      version: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.description",
        schema: z.string().optional(),
      }),

      path: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.title",
        schema: z.string().optional(),
      }),

      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.success.description",
        schema: z.string(),
      }),

      output: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.title",
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
export type UpdateRequestInput = typeof POST.types.RequestInput;
export type UpdateRequestOutput = typeof POST.types.RequestOutput;
export type UpdateResponseInput = typeof POST.types.ResponseInput;
export type UpdateResponseOutput = typeof POST.types.ResponseOutput;
