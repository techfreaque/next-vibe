/**
 * Generate Expo Indexes Definition
 * API endpoint definition for generating Expo Router index files from Next.js pages
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

/**
 * Generate Expo Indexes Endpoint Definition
 */
const { POST } = createEndpoint({
  scopedTranslation,
  title: "generate.post.title",
  description: "generate.post.description",
  icon: "mobile",
  category: "app.endpointCategories.system",
  tags: ["generate.post.title"],
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF],
  aliases: ["generate:expo", "native:generate"],
  method: Methods.POST,
  path: ["system", "react-native", "generate"],
  examples: {
    responses: {
      default: {
        success: true,
        created: ["src/app/api/[locale]/system/generated/expo-index.ts"],
        skipped: [],
        errors: [],
        message: "Expo index generated successfully",
      },
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "generate.post.title",
    description: "generate.post.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "generate.post.response.fields.success",
        schema: z.boolean(),
      }),

      created: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "generate.post.response.fields.created",
        schema: z.array(z.string()),
      }),

      skipped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "generate.post.response.fields.skipped",
        schema: z.array(z.string()),
      }),

      errors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "generate.post.response.fields.errors",
        schema: z.array(
          z.object({
            file: z.string(),
            error: z.string(),
          }),
        ),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "generate.post.response.fields.message",
        schema: z.string(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "generate.post.errors.validation.title",
      description: "generate.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "generate.post.errors.unauthorized.title",
      description: "generate.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "generate.post.errors.server.title",
      description: "generate.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "generate.post.errors.network.title",
      description: "generate.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "generate.post.errors.forbidden.title",
      description: "generate.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "generate.post.errors.notFound.title",
      description: "generate.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "generate.post.errors.unknown.title",
      description: "generate.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "generate.post.errors.conflict.title",
      description: "generate.post.errors.conflict.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "generate.post.errors.conflict.title",
      description: "generate.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "generate.post.success.title",
    description: "generate.post.success.description",
  },
});

const endpoints = { POST };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type GenerateRequestInput = typeof POST.types.RequestInput;
export type GenerateRequestOutput = typeof POST.types.RequestOutput;
export type GenerateResponseInput = typeof POST.types.ResponseInput;
export type GenerateResponseOutput = typeof POST.types.ResponseOutput;
