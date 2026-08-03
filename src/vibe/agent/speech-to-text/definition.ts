/**
 * Speech-to-Text API Route Definition
 * Converts audio to text using Eden AI providers
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

const SpeechToTextContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SpeechToTextContainer })),
);

import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { DEFAULT_STT_MODEL_ID, TRANSCRIBE_AUDIO_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";
import { SttModelId } from "./models";

/**
 * Speech-to-Text Endpoint (POST)
 * Transcribes audio to text using Eden AI
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "speech-to-text"],
  aliases: [TRANSCRIBE_AUDIO_ALIAS],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
  ],
  defaultWebPinned: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
  ],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  dynamicTitle: ({ response }) => {
    const text = response?.response?.text;
    if (!text?.trim()) {
      return undefined;
    }
    const short = text.length > 50 ? `${text.slice(0, 50)}...` : text;
    return {
      message: "post.dynamicTitle" as const,
      messageParams: { text: short },
    };
  },
  icon: "mic",
  category: "ai",
  subCategory: "Generation",
  tags: ["hotkey.tags.speech", "hotkey.tags.transcription", "hotkey.tags.ai"],
  timeoutMs: 0,
  fields: customWidgetObject({
    render: SpeechToTextContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === FILE UPLOAD SECTION ===
      fileUpload: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.fileUpload.title",
        description: "post.fileUpload.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { request: "data" },
        children: {
          files: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.FILE,
            label: "post.audio.label",
            description: "post.audio.description",
            columns: 12,
            schema: z
              .array(
                z
                  .instanceof(File)
                  .refine((file) => file.size <= 25 * 1024 * 1024, {
                    message: "post.audio.validation.maxSize",
                  })
                  .refine(
                    (file) => {
                      // Note: Bun reports audio/webm recordings as "video/webm" (strips codecs param)
                      // Firefox records Opus as audio/ogg or video/ogg
                      const allowedTypes = [
                        "audio/",
                        "video/webm",
                        "video/ogg",
                        "application/ogg",
                        "application/octet-stream",
                      ];
                      return allowedTypes.some((type) =>
                        file.type.startsWith(type),
                      );
                    },
                    { message: "post.audio.validation.audioOnly" },
                  ),
              )
              .min(1)
              .max(20),
          }),
        },
      }),

      // === MODEL SELECTOR (managed by ModelSelectorTrigger in widget) ===
      modelId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.model.label",
        description: "post.model.description",
        columns: 12,
        schema: z.enum(SttModelId).default(DEFAULT_STT_MODEL_ID),
      }),

      // // === CONFIG FIELDS ===
      // provider: requestField(scopedTranslation, {
      //   type: WidgetType.FORM_FIELD,
      //   fieldType: FieldDataType.SELECT,
      //   label: "post.provider.label",
      //   description: "post.provider.description",
      //   columns: 6,
      //   options: SttProviderOptions,
      //   schema: z.string().default("openai"),
      // }),

      // === RESPONSE FIELDS ===
      creditCost: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.creditCost",
        schema: z.number().optional(),
      }),
      response: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.title",
        description: "post.response.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          success: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.success",
            schema: z.boolean(),
          }),
          text: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.text",
            schema: z.string(),
          }),
          provider: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.provider",
            schema: z.string(),
          }),
          confidence: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.confidence",
            schema: z.coerce.number().optional(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        fileUpload: {
          files: [new File([""], "audio.mp3", { type: "audio/mpeg" })],
        },
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          text: "Hello, this is a test transcription.",
          provider: "openai",
          confidence: 0.98,
        },
      },
    },
  },
});

// Extract types
export type SpeechToTextPostRequestInput = typeof POST.types.RequestInput;
export type SpeechToTextPostRequestOutput = typeof POST.types.RequestOutput;
export type SpeechToTextPostResponseInput = typeof POST.types.ResponseInput;
export type SpeechToTextPostResponseOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
} as const;
export default definitions;
