/**
 * Unified Model Prices Endpoint Definition
 * Fetches live pricing for ALL models from ALL providers and updates models.ts.
 * Replaces the separate media-prices and openrouter endpoints.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
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
import { lazyCliWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-cli-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const ModelPricesWidget = lazyCliWidget(() =>
  import("./widget").then((m) => ({ default: m.ModelPricesWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "models", "model-prices"],
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
  aliases: ["update-model-prices"],
  icon: "database",

  fields: customWidgetObject({
    render: ModelPricesWidget,
    usage: { response: true } as const,
    children: {
      summary: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.summary.title" as const,
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          totalProviders: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.summary.totalProviders" as const,
            columns: 3,
            schema: z.number(),
          }),
          totalModels: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            label: "get.response.summary.totalModels" as const,
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

      providerResults: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.providerResults.title" as const,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            provider: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.providerResults.model.provider" as const,
              columns: 3,
              schema: z.string(),
            }),
            modelsFound: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "get.response.providerResults.model.modelsFound" as const,
              columns: 3,
              schema: z.number(),
            }),
            modelsUpdated: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label:
                "get.response.providerResults.model.modelsUpdated" as const,
              columns: 3,
              schema: z.number(),
            }),
            error: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.providerResults.model.error" as const,
              columns: 3,
              schema: z.string().optional(),
            }),
          },
        }),
      }),

      updates: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.updates.title" as const,
        cardTitle: "name",
        cardSubtitle: "modelId",
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            modelId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.updates.model.modelId" as const,
              columns: 3,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.updates.model.name" as const,
              columns: 3,
              schema: z.string(),
            }),
            provider: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.updates.model.provider" as const,
              columns: 2,
              schema: z.string(),
            }),
            field: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.updates.model.field" as const,
              columns: 2,
              schema: z.string(),
            }),
            value: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "get.response.updates.model.value" as const,
              columns: 1,
              schema: z.number(),
            }),
            source: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.updates.model.source" as const,
              columns: 1,
              schema: z.string(),
            }),
          },
        }),
      }),

      failures: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.failures.title" as const,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            modelId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.failures.model.modelId" as const,
              columns: 4,
              schema: z.string(),
            }),
            provider: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.failures.model.provider" as const,
              columns: 4,
              schema: z.string(),
            }),
            reason: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.failures.model.reason" as const,
              columns: 4,
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
          totalProviders: 0,
          totalModels: 0,
          modelsUpdated: 0,
          fileUpdated: false,
        },
        providerResults: [],
        updates: [],
        failures: [],
      },
    },
  },
});

export default { GET };

export type ModelPricesGetResponseOutput = typeof GET.types.ResponseOutput;
