/**
 * Translation Statistics Endpoint Definition
 *
 * This endpoint provides functionality to:
 * - Get translation statistics and analytics
 * - Show translation file usage and key metrics
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Translation Statistics GET Endpoint
 * Retrieves statistics about translation files and key usage
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "translations", "stats"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.system.translations.stats.get.title",
  description: "app.api.v1.core.system.translations.stats.get.description",
  category: "app.api.v1.core.system.translations.category",
  tags: [
    "app.api.v1.core.system.translations.tags.stats",
    "app.api.v1.core.system.translations.tags.analytics",
    "app.api.v1.core.system.translations.tags.i18n",
  ],

  // CLI configuration
  aliases: ["translations:stats", "ts"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.translations.stats.get.container.title" as const,
      description:
        "app.api.v1.core.system.translations.stats.get.container.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.translations.stats.get.success.description",
        },
        z.boolean(),
      ),

      stats: objectField(
        {
          type: WidgetType.STATS_GRID,
          title: "app.api.v1.core.system.translations.stats.get.response.title",
          description:
            "app.api.v1.core.system.translations.stats.get.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          totalKeys: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.stats.get.success.title",
            },
            z.number(),
          ),
          usedKeys: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.stats.get.success.title",
            },
            z.number(),
          ),
          unusedKeys: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.stats.get.success.title",
            },
            z.number(),
          ),
          translationFiles: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.stats.get.success.title",
            },
            z.number(),
          ),
          languages: responseArrayField(
            {
              type: WidgetType.GROUPED_LIST,
              groupBy: "type",
            },
            responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.translations.stats.get.success.title",
              },
              z.string(),
            ),
          ),
          lastAnalyzedAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.stats.get.success.title",
            },
            z.string().datetime(),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.translations.stats.get.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.translations.stats.get.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.translations.stats.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.translations.stats.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.translations.stats.get.errors.forbidden.title",
      description:
        "app.api.v1.core.system.translations.stats.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.translations.stats.get.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.translations.stats.get.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.translations.stats.get.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.translations.stats.get.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.translations.stats.get.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.stats.get.errors.validation.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.translations.stats.get.success.title",
    description:
      "app.api.v1.core.system.translations.stats.get.success.description",
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
