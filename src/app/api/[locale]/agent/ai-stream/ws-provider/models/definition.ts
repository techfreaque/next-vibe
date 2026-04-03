/**
 * WS Provider Models API Definition
 * Returns all available AI models with pricing and capability information
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

/**
 * Get WS Provider Models Endpoint (GET)
 * Returns all available AI models grouped by category with pricing
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "ai-stream", "ws-provider", "models"],
  title: "get.title" as const,
  description: "get.description" as const,
  category: "endpointCategories.ai",
  tags: ["tags.models" as const, "tags.aiModels" as const],
  icon: "sparkles",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
  ] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    usage: { response: true } as const,
    children: {
      models: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        title: "get.response.models.title" as const,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true } as const,
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.id.content" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.name.content" as const,
              schema: z.string(),
            }),
            provider: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.provider.content" as const,
              schema: z.string(),
            }),
            category: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.category.content" as const,
              schema: z.string(),
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.description.content" as const,
              schema: z.string(),
            }),
            contextWindow: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.contextWindow.content" as const,
              schema: z.number().nullable(),
            }),
            supportsTools: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.supportsTools.content" as const,
              schema: z.boolean(),
            }),
            creditCost: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.creditCost.content" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  examples: {
    responses: {
      default: {
        models: [
          {
            id: "gpt-5-mini",
            name: "GPT-5 Mini",
            provider: "OpenAI",
            category: "chat",
            description: "Fast and efficient model for everyday tasks",
            contextWindow: 128000,
            supportsTools: true,
            creditCost: 1.5,
          },
          {
            id: "dall-e-3",
            name: "DALL-E 3",
            provider: "OpenAI",
            category: "image",
            description: "High quality image generation",
            contextWindow: null,
            supportsTools: false,
            creditCost: 5.2,
          },
        ],
      },
    },
  },
});

export default { GET } as const;

export type WsProviderModelsGetRequestOutput = typeof GET.types.RequestOutput;
export type WsProviderModelsGetResponseOutput = typeof GET.types.ResponseOutput;
