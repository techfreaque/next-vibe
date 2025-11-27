/**
 * Generate Expo Indexes Definition
 * API endpoint definition for generating Expo Router index files from Next.js pages
 * Following migration guide: Files at level of usage, split god repositories
 */

import { z } from "zod";

import { createEndpoint } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/create';
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Generate Expo Indexes Endpoint Definition
 */
const { POST } = createEndpoint({
  title:
    "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.title",
  description:
    "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.description",
  category:
    "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.title",
  tags: [
    "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.title",
  ],
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF],
  aliases: ["generate:expo", "native:generate"],
  method: Methods.POST,
  path: ["v1", "core", "system", "react-native", "generate"],
  examples: {
    requests: {},
    urlPathParams: undefined,
    responses: {},
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.title",
      description:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.response.fields.success",
        },
        z.boolean(),
      ),

      created: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.response.fields.created",
        },
        z.array(z.string()),
      ),

      skipped: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.response.fields.skipped",
        },
        z.array(z.string()),
      ),

      errors: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.response.fields.errors",
        },
        z.array(
          z.object({
            file: z.string(),
            error: z.string(),
          }),
        ),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.response.fields.message",
        },
        z.string(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.server.title",
      description:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.success.title",
    description:
      "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.success.description",
  },
});

const endpoints = { POST };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type GenerateRequestInput = typeof POST.types.RequestInput;
export type GenerateRequestOutput = typeof POST.types.RequestOutput;
export type GenerateResponseInput = typeof POST.types.ResponseInput;
export type GenerateResponseOutput = typeof POST.types.ResponseOutput;
