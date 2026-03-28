/**
 * OpenRouter Models Endpoint Definition
 * Fetches model metadata and pricing from OpenRouter API
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

import { scopedTranslation } from "./i18n";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "models", "openrouter"],
  title: "get.title" as const,
  description: "get.description" as const,
  category: "endpointCategories.ai",
  tags: ["tags.models" as const],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PRODUCTION_OFF,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ] as const,
  aliases: ["update-openrouter-models"],
  icon: "database",

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    linkable: true,
    title: "get.form.title" as const,
    layoutType: LayoutType.STACKED,
    columns: 12,
    usage: { response: true },
    children: {
      // Summary statistics section
      summary: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.summary.title" as const,
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          totalModels: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.summary.totalModels" as const,
            columns: 3,
            schema: z.number(),
          }),
          modelsFound: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.summary.modelsFound" as const,
            columns: 3,
            schema: z.number(),
          }),
          modelsUpdated: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.summary.modelsUpdated" as const,
            columns: 3,
            schema: z.number(),
          }),
          fileUpdated: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            label: "get.response.summary.fileUpdated" as const,
            columns: 3,
            schema: z.boolean(),
          }),
        },
      }),

      // Updated models section
      models: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.models.title" as const,
        cardTitle: "name",
        cardSubtitle: "id",
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.models.model.id" as const,
              columns: 6,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.models.model.name" as const,
              columns: 6,
              schema: z.string(),
            }),
            contextLength: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "get.response.models.model.contextLength" as const,
              columns: 4,
              schema: z.number(),
            }),
            inputTokenCost: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "get.response.models.model.inputTokenCost" as const,
              columns: 4,
              schema: z.number(),
            }),
            outputTokenCost: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "get.response.models.model.outputTokenCost" as const,
              columns: 4,
              schema: z.number(),
            }),
            cacheReadTokenCost: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "get.response.models.model.cacheReadTokenCost" as const,
              columns: 4,
              schema: z.number().optional(),
            }),
            cacheWriteTokenCost: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "get.response.models.model.cacheWriteTokenCost" as const,
              columns: 4,
              schema: z.number().optional(),
            }),
          },
        }),
      }),

      // Missing OpenRouter models section
      missingOpenRouterModels: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.missingOpenRouterModels.title" as const,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            modelId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label:
                "get.response.missingOpenRouterModels.model.modelId" as const,
              columns: 4,
              schema: z.string(),
            }),
            openRouterId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label:
                "get.response.missingOpenRouterModels.model.openRouterId" as const,
              columns: 4,
              schema: z.string(),
            }),
            suggestion: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label:
                "get.response.missingOpenRouterModels.model.suggestion" as const,
              columns: 4,
              schema: z.string(),
            }),
          },
        }),
      }),

      // Non-OpenRouter models section
      nonOpenRouterModels: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.nonOpenRouterModels.title" as const,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            modelId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.nonOpenRouterModels.model.modelId" as const,
              columns: 6,
              schema: z.string(),
            }),
            provider: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.nonOpenRouterModels.model.provider" as const,
              columns: 6,
              schema: z.string(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    responses: {
      default: {
        summary: {
          totalModels: 0,
          modelsFound: 0,
          modelsUpdated: 0,
          fileUpdated: false,
        },
        models: [],
        missingOpenRouterModels: [],
        nonOpenRouterModels: [],
      },
    },
  },
});

export default { GET };

export type OpenRouterModelsGetResponseOutput = typeof GET.types.ResponseOutput;
