/**
 * Speech-to-Text API Route Definition
 * Converts audio to text using Eden AI providers
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

/**
 * Speech-to-Text Endpoint (POST)
 * Transcribes audio to text using Eden AI
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "speech-to-text"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
  ],
  title: "post.title",
  description: "post.description",
  icon: "mic",
  category: "category",
  tags: ["hotkey.tags.speech", "hotkey.tags.transcription", "hotkey.tags.ai"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === FILE UPLOAD SECTION ===
      fileUpload: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.fileUpload.title",
        description: "post.fileUpload.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { request: "data" },
        children: {
          file: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.FILE,
            label: "post.audio.label",
            description: "post.audio.description",
            columns: 12,
            schema: z
              .instanceof(File)
              .refine((file) => file.size <= 25 * 1024 * 1024, {
                message: "post.audio.validation.maxSize",
              })
              .refine(
                (file) => {
                  const allowedTypes = ["audio/", "application/octet-stream"];
                  return allowedTypes.some((type) =>
                    file.type.startsWith(type),
                  );
                },
                {
                  message: "post.audio.validation.audioOnly",
                },
              ),
          }),
        },
      }),

      // // === CONFIG FIELDS ===
      // provider: scopedRequestField(scopedTranslation, {
      //   type: WidgetType.FORM_FIELD,
      //   fieldType: FieldDataType.SELECT,
      //   label: "post.provider.label",
      //   description: "post.provider.description",
      //   columns: 6,
      //   options: SttProviderOptions,
      //   schema: z.string().default("openai"),
      // }),

      // === RESPONSE FIELDS ===
      creditCost: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.creditCost",
        schema: z.number().optional(),
      }),
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.title",
        description: "post.response.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          success: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.success",
            schema: z.boolean(),
          }),
          text: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.text",
            schema: z.string(),
          }),
          provider: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.provider",
            schema: z.string(),
          }),
          confidence: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.confidence",
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
          file: new File([""], "audio.mp3", { type: "audio/mpeg" }),
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
