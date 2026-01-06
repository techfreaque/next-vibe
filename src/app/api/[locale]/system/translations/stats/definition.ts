/**
 * Translation Statistics Endpoint Definition
 *
 * This endpoint provides functionality to:
 * - Get translation statistics and analytics
 * - Show translation file usage and key metrics
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema } from "../../../shared/types/common.schema";

/**
 * Translation Statistics GET Endpoint
 * Retrieves statistics about translation files and key usage
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["system", "translations", "stats"],
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF, UserRole.AI_TOOL_OFF, UserRole.PRODUCTION_OFF],

  title: "app.api.system.translations.stats.get.title",
  description: "app.api.system.translations.stats.get.description",
  category: "app.api.system.translations.category",
  tags: [
    "app.api.system.translations.tags.stats",
    "app.api.system.translations.tags.analytics",
    "app.api.system.translations.tags.i18n",
  ],
  icon: "book",

  // CLI configuration
  aliases: ["translations:stats", "ts"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.translations.stats.get.container.title" as const,
      description: "app.api.system.translations.stats.get.container.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.translations.stats.get.success.description",
        },
        z.boolean(),
      ),

      stats: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.translations.stats.get.response.title",
          description: "app.api.system.translations.stats.get.response.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          totalKeys: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.system.translations.stats.get.success.title",
            },
            z.coerce.number(),
          ),
          usedKeys: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.system.translations.stats.get.success.title",
            },
            z.coerce.number(),
          ),
          unusedKeys: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.system.translations.stats.get.success.title",
            },
            z.coerce.number(),
          ),
          translationFiles: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.system.translations.stats.get.success.title",
            },
            z.coerce.number(),
          ),
          languages: responseArrayField(
            {
              type: WidgetType.GROUPED_LIST,
              groupBy: "type",
            },
            responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.translations.stats.get.success.title",
              },
              z.string(),
            ),
          ),
          lastAnalyzedAt: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.system.translations.stats.get.success.title",
            },
            dateSchema,
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.translations.stats.get.errors.validation.title",
      description: "app.api.system.translations.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.translations.stats.get.errors.validation.title",
      description: "app.api.system.translations.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.translations.stats.get.errors.unauthorized.title",
      description: "app.api.system.translations.stats.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.translations.stats.get.errors.forbidden.title",
      description: "app.api.system.translations.stats.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.translations.stats.get.errors.validation.title",
      description: "app.api.system.translations.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.translations.stats.get.errors.validation.title",
      description: "app.api.system.translations.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.translations.stats.get.errors.validation.title",
      description: "app.api.system.translations.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.translations.stats.get.errors.validation.title",
      description: "app.api.system.translations.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.translations.stats.get.errors.validation.title",
      description: "app.api.system.translations.stats.get.errors.validation.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.translations.stats.get.success.title",
    description: "app.api.system.translations.stats.get.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: undefined,
    responses: {
      default: {
        success: true,
        stats: {
          totalKeys: 1247,
          usedKeys: 1189,
          unusedKeys: 58,
          translationFiles: 24,
          languages: ["en", "de", "fr", "es", "pl"],
          lastAnalyzedAt: "2024-01-15T10:30:00.000Z",
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type TranslationStatsRequestInput = typeof GET.types.RequestInput;
export type TranslationStatsRequestOutput = typeof GET.types.RequestOutput;
export type TranslationStatsResponseInput = typeof GET.types.ResponseInput;
export type TranslationStatsResponseOutput = typeof GET.types.ResponseOutput;

const definitions = {
  GET,
};

export default definitions;
