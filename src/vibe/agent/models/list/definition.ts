/**
 * Models List Endpoint Definition
 * Browsable, searchable list of all AI models available on the platform.
 * Used by AI agents to discover models, and by users via web/CLI.
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  ContentLevel,
  ContentLevelOptions,
  IntelligenceLevel,
  IntelligenceLevelOptions,
} from "../../skills/enum";
import { MODEL_LIST_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const ModelsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ModelsListContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "models", "list"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  dynamicTitle: ({ response }) => {
    if (response?.models) {
      return {
        message: "get.dynamicTitle" as const,
        messageParams: { count: response.models.length },
      };
    }
    return undefined;
  },
  icon: "sparkles" as const,
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.models" as const],
  aliases: [MODEL_LIST_ALIAS, "list-models"],

  cli: {
    firstCliArgKey: "modelType",
  },

  fields: customWidgetObject({
    render: ModelsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      query: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.query.label" as const,
        description: "get.fields.query.description" as const,
        placeholder: "get.fields.query.placeholder" as const,
        columns: 8,
        schema: z.string().optional(),
      }),

      modelType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.modelType.label" as const,
        description: "get.fields.modelType.description" as const,
        placeholder: "get.fields.modelType.placeholder" as const,
        options: [
          { value: "text", label: "enums.modelType.text" as const },
          { value: "image", label: "enums.modelType.image" as const },
          { value: "video", label: "enums.modelType.video" as const },
          { value: "audio", label: "enums.modelType.audio" as const },
        ],
        columns: 4,
        schema: z.enum(["text", "image", "video", "audio"] as const),
      }),

      contentLevel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.contentLevel.label" as const,
        description: "get.fields.contentLevel.description" as const,
        placeholder: "get.fields.contentLevel.placeholder" as const,
        options: ContentLevelOptions,
        columns: 4,
        schema: z
          .enum([
            ContentLevel.MAINSTREAM,
            ContentLevel.OPEN,
            ContentLevel.UNCENSORED,
          ] as const)
          .optional(),
      }),

      intelligence: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.intelligence.label" as const,
        description: "get.fields.intelligence.description" as const,
        placeholder: "get.fields.intelligence.placeholder" as const,
        options: IntelligenceLevelOptions,
        columns: 4,
        schema: z
          .enum([
            IntelligenceLevel.QUICK,
            IntelligenceLevel.SMART,
            IntelligenceLevel.BRILLIANT,
          ] as const)
          .optional(),
      }),

      // === RESPONSE FIELDS ===

      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int(),
      }),

      // Model list
      models: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model.id" as const,
              columns: 6,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model.name" as const,
              columns: 6,
              schema: z.string(),
            }),
            provider: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.model.provider" as const,
              columns: 4,
              schema: z.string(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.model.type" as const,
              columns: 3,
              schema: z.string(),
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model.description" as const,
              columns: 12,
              schema: z.string(),
            }),
            contextWindow: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "get.response.model.contextWindow" as const,
              columns: 3,
              schema: z.number().nullable(),
            }),
            parameterCount: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "get.response.model.parameterCount" as const,
              columns: 3,
              schema: z.number().nullable(),
            }),
            intelligence: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.model.intelligence" as const,
              columns: 3,
              schema: z.string(),
            }),
            content: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.model.content" as const,
              columns: 3,
              schema: z.string(),
            }),
            price: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "get.response.model.price" as const,
              columns: 3,
              schema: z.number(),
            }),
            supportsTools: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.model.supportsTools" as const,
              columns: 3,
              schema: z.boolean(),
            }),
            utilities: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model.utilities" as const,
              columns: 12,
              schema: z.array(z.string()),
            }),
            inputs: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model.inputs" as const,
              columns: 6,
              schema: z.array(z.string()),
            }),
            outputs: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model.outputs" as const,
              columns: 6,
              schema: z.array(z.string()),
            }),
            supportedDurations: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model.supportedDurations" as const,
              columns: 6,
              schema: z.array(z.string()).nullable(),
            }),
            supportedAspectRatios: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model.supportedAspectRatios" as const,
              columns: 6,
              schema: z.array(z.string()).nullable(),
            }),
            supportedResolutions: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model.supportedResolutions" as const,
              columns: 6,
              schema: z.array(z.string()).nullable(),
            }),
            supportedFrameImages: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model.supportedFrameImages" as const,
              columns: 6,
              schema: z.array(z.string()).nullable(),
            }),
            generateAudio: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "get.response.model.generateAudio" as const,
              columns: 4,
              schema: z.boolean().nullable(),
            }),
            supportedSizes: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model.supportedSizes" as const,
              columns: 6,
              schema: z.array(z.string()).nullable(),
            }),
            allowedPassthroughParameters: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.model.allowedPassthroughParameters" as const,
              columns: 12,
              schema: z.array(z.string()).nullable(),
            }),
          },
        }),
      }),
    },
  }),

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

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      chatModels: { modelType: "text" as const },
      videoModels: { modelType: "video" as const },
      searchCoding: { query: "coding", modelType: "text" as const },
      uncensoredChat: {
        modelType: "text" as const,
        contentLevel: ContentLevel.UNCENSORED,
      },
      imageModels: { modelType: "image" as const },
      brilliantChat: {
        modelType: "text" as const,
        intelligence: IntelligenceLevel.BRILLIANT,
      },
    },
    responses: {
      chatModels: {
        totalCount: 95,
        models: [
          {
            id: "gpt-5",
            name: "GPT-5",
            provider: "OpenAI",
            type: "text",
            description: "OpenAI's flagship model",
            contextWindow: 128000,
            parameterCount: null,
            intelligence: "brilliant",
            content: "mainstream",
            price: 12,
            supportsTools: true,
            utilities: ["chat", "coding", "analysis", "reasoning"],
            inputs: ["text", "image"],
            outputs: ["text"],
            supportedDurations: null,
            supportedAspectRatios: null,
            supportedResolutions: null,
            supportedFrameImages: null,
            generateAudio: null,
            supportedSizes: null,
            allowedPassthroughParameters: null,
          },
        ],
      },
      videoModels: {
        totalCount: 16,
        models: [
          {
            id: "kling-3-0-t2v",
            name: "Kling 3.0 T2V",
            provider: "Kling AI",
            type: "video",
            description:
              "High-quality text-to-video and image-to-video from Kling AI.",
            contextWindow: null,
            parameterCount: null,
            intelligence: "smart",
            content: "mainstream",
            price: 56,
            supportsTools: false,
            utilities: ["video-generation"],
            inputs: ["text"],
            outputs: ["video"],
            supportedDurations: [
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              "13",
              "14",
              "15",
            ],
            supportedAspectRatios: ["16:9", "9:16", "1:1"],
            supportedResolutions: ["720p"],
            supportedFrameImages: ["first_frame", "last_frame"],
            generateAudio: true,
            supportedSizes: ["1280x720", "720x1280", "720x720"],
            allowedPassthroughParameters: ["negative_prompt", "cfg_scale"],
          },
        ],
      },
    },
  },
});

export default { GET };

export type ModelListGetResponseOutput = typeof GET.types.ResponseOutput;
export type ModelListItem = ModelListGetResponseOutput["models"][number];
