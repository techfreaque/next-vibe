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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "models", "openrouter"],
  title: "app.api.agent.models.openrouter.get.title" as const,
  description: "app.api.agent.models.openrouter.get.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.models.openrouter.tags.models" as const],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PRODUCTION_OFF,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ] as const,
  aliases: ["update-openrouter-models"],
  icon: "database",

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      linkable: true,
      title: "app.api.agent.models.openrouter.get.form.title" as const,
      layoutType: LayoutType.STACKED,
      columns: 12,
    },
    { response: true },
    {
      // Summary statistics section
      summary: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.models.openrouter.get.response.summary.title" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          totalModels: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.agent.models.openrouter.get.response.summary.totalModels" as const,
            columns: 3,
            schema: z.number(),
          }),
          modelsFound: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.agent.models.openrouter.get.response.summary.modelsFound" as const,
            columns: 3,
            schema: z.number(),
          }),
          modelsUpdated: responseField({
            type: WidgetType.STAT,
            label:
              "app.api.agent.models.openrouter.get.response.summary.modelsUpdated" as const,
            columns: 3,
            schema: z.number(),
          }),
          fileUpdated: responseField({
            type: WidgetType.BADGE,
            label:
              "app.api.agent.models.openrouter.get.response.summary.fileUpdated" as const,
            columns: 3,
            schema: z.boolean(),
          }),
        },
      ),

      // Updated models section
      models: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.models.openrouter.get.response.models.title" as const,
          cardTitle: "name",
          cardSubtitle: "id",
          columns: 12,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              label:
                "app.api.agent.models.openrouter.get.response.models.model.id" as const,
              columns: 6,
              schema: z.string(),
            }),
            name: responseField({
              type: WidgetType.TEXT,
              label:
                "app.api.agent.models.openrouter.get.response.models.model.name" as const,
              columns: 6,
              schema: z.string(),
            }),
            contextLength: responseField({
              type: WidgetType.STAT,
              label:
                "app.api.agent.models.openrouter.get.response.models.model.contextLength" as const,
              columns: 4,
              schema: z.number(),
            }),
            inputTokenCost: responseField({
              type: WidgetType.STAT,
              label:
                "app.api.agent.models.openrouter.get.response.models.model.inputTokenCost" as const,
              columns: 4,
              schema: z.number(),
            }),
            outputTokenCost: responseField({
              type: WidgetType.STAT,
              label:
                "app.api.agent.models.openrouter.get.response.models.model.outputTokenCost" as const,
              columns: 4,
              schema: z.number(),
            }),
          },
        ),
      ),

      // Missing OpenRouter models section
      missingOpenRouterModels: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.models.openrouter.get.response.missingOpenRouterModels.title" as const,
          columns: 12,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            modelId: responseField({
              type: WidgetType.TEXT,
              label:
                "app.api.agent.models.openrouter.get.response.missingOpenRouterModels.model.modelId" as const,
              columns: 4,
              schema: z.string(),
            }),
            openRouterId: responseField({
              type: WidgetType.TEXT,
              label:
                "app.api.agent.models.openrouter.get.response.missingOpenRouterModels.model.openRouterId" as const,
              columns: 4,
              schema: z.string(),
            }),
            suggestion: responseField({
              type: WidgetType.TEXT,
              label:
                "app.api.agent.models.openrouter.get.response.missingOpenRouterModels.model.suggestion" as const,
              columns: 4,
              schema: z.string(),
            }),
          },
        ),
      ),

      // Non-OpenRouter models section
      nonOpenRouterModels: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.models.openrouter.get.response.nonOpenRouterModels.title" as const,
          columns: 12,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            modelId: responseField({
              type: WidgetType.TEXT,
              label:
                "app.api.agent.models.openrouter.get.response.nonOpenRouterModels.model.modelId" as const,
              columns: 6,
              schema: z.string(),
            }),
            provider: responseField({
              type: WidgetType.BADGE,
              label:
                "app.api.agent.models.openrouter.get.response.nonOpenRouterModels.model.provider" as const,
              columns: 6,
              schema: z.string(),
            }),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.models.openrouter.get.errors.server.title" as const,
      description:
        "app.api.agent.models.openrouter.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.models.openrouter.get.errors.network.title" as const,
      description:
        "app.api.agent.models.openrouter.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.models.openrouter.get.errors.unknown.title" as const,
      description:
        "app.api.agent.models.openrouter.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.models.openrouter.get.errors.validation.title" as const,
      description:
        "app.api.agent.models.openrouter.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.models.openrouter.get.errors.unauthorized.title" as const,
      description:
        "app.api.agent.models.openrouter.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.models.openrouter.get.errors.forbidden.title" as const,
      description:
        "app.api.agent.models.openrouter.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.models.openrouter.get.errors.notFound.title" as const,
      description:
        "app.api.agent.models.openrouter.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.models.openrouter.get.errors.conflict.title" as const,
      description:
        "app.api.agent.models.openrouter.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.models.openrouter.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.models.openrouter.get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.models.openrouter.get.success.title" as const,
    description:
      "app.api.agent.models.openrouter.get.success.description" as const,
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
