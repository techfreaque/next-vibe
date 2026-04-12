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
import { scopedTranslation } from "./i18n";

/**
 * Setup Status Endpoint Definition
 */
const { POST } = createEndpoint({
  scopedTranslation,
  title: "post.title",
  description: "post.description",
  icon: "terminal",
  category: "endpointCategories.interfaces",
  subCategory: "endpointCategories.interfacesCli",
  tags: ["post.title"],
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF, UserRole.AI_TOOL_OFF],
  aliases: ["status", "setup:status"],
  method: Methods.POST,
  path: ["system", "setup", "status"],
  examples: {
    responses: {
      default: {
        success: true,
        installed: true,
        version: "1.0.0",
        path: "/usr/local/bin/vibe",
        message: "Vibe CLI is installed",
      },
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.title",
    description: "post.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.success",
        schema: z.boolean(),
      }),

      installed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.installed",
        schema: z.boolean(),
      }),

      version: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.version",
        schema: z.string().optional(),
      }),

      path: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.path",
        schema: z.string().optional(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fields.message",
        schema: z.string(),
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
export type StatusRequestInput = typeof POST.types.RequestInput;
export type StatusRequestOutput = typeof POST.types.RequestOutput;
export type StatusResponseInput = typeof POST.types.ResponseInput;
export type StatusResponseOutput = typeof POST.types.ResponseOutput;
