/**
 * Media Model Prices Endpoint Definition
 * Fetches real-time pricing for image/audio models and updates models.ts
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
  path: ["agent", "models", "media-prices"],
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
  aliases: ["update-media-model-prices"],
  icon: "image",

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    linkable: true,
    title: "get.form.title" as const,
    layoutType: LayoutType.STACKED,
    columns: 12,
    usage: { response: true },
    children: {
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
            columns: 4,
            schema: z.number(),
          }),
          modelsUpdated: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.summary.modelsUpdated" as const,
            columns: 4,
            schema: z.number(),
          }),
          fileUpdated: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            label: "get.response.summary.fileUpdated" as const,
            columns: 4,
            schema: z.boolean(),
          }),
        },
      }),

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
              columns: 4,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.models.model.name" as const,
              columns: 4,
              schema: z.string(),
            }),
            provider: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.models.model.provider" as const,
              columns: 4,
              schema: z.string(),
            }),
            costUsd: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "get.response.models.model.costUsd" as const,
              columns: 3,
              schema: z.number(),
            }),
            creditCost: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "get.response.models.model.creditCost" as const,
              columns: 3,
              schema: z.number(),
            }),
            source: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.models.model.source" as const,
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
          modelsUpdated: 0,
          fileUpdated: false,
        },
        models: [],
      },
    },
  },
});

export default { GET };

export type MediaPricesGetResponseOutput = typeof GET.types.ResponseOutput;
