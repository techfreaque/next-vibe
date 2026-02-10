/**
 * Speech-to-Text API Route Definition
 * Converts audio to text using Eden AI providers
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * Speech-to-Text Endpoint (POST)
 * Transcribes audio to text using Eden AI
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "speech-to-text"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
  ],
  title: "app.api.agent.speechToText.post.title",
  description: "app.api.agent.speechToText.post.description",
  icon: "mic",
  category: "app.api.agent.category",
  tags: [
    "app.api.agent.tags.speech",
    "app.api.agent.tags.transcription",
    "app.api.agent.tags.ai",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.speechToText.post.form.title",
      description: "app.api.agent.speechToText.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === FILE UPLOAD SECTION ===
      fileUpload: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.speechToText.post.fileUpload.title",
          description: "app.api.agent.speechToText.post.fileUpload.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { request: "data" },
        {
          file: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.FILE,
            label: "app.api.agent.speechToText.post.audio.label",
            description: "app.api.agent.speechToText.post.audio.description",
            columns: 12,
            schema: z
              .instanceof(File)
              .refine((file) => file.size <= 25 * 1024 * 1024, {
                message:
                  "app.api.agent.speechToText.post.audio.validation.maxSize",
              })
              .refine(
                (file) => {
                  const allowedTypes = ["audio/", "application/octet-stream"];
                  return allowedTypes.some((type) =>
                    file.type.startsWith(type),
                  );
                },
                {
                  message:
                    "app.api.agent.speechToText.post.audio.validation.audioOnly",
                },
              ),
          }),
        },
      ),

      // // === CONFIG FIELDS ===
      // provider: requestField(
      //   {
      //     type: WidgetType.FORM_FIELD,
      //     fieldType: FieldDataType.SELECT,
      //     label: "app.api.agent.speechToText.post.provider.label",
      //     description: "app.api.agent.speechToText.post.provider.description",
      //     columns: 6,
      //     options: SttProviderOptions,
      //   },
      //   z.string().default("openai"),
      // ),

      // === RESPONSE FIELDS ===
      creditCost: responseField({
        type: WidgetType.TEXT,
        content: "app.api.agent.speechToText.post.response.creditCost",
        schema: z.number().optional(),
      }),
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.speechToText.post.response.title",
          description: "app.api.agent.speechToText.post.response.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          success: responseField({
            type: WidgetType.TEXT,
            content: "app.api.agent.speechToText.post.response.success",
            schema: z.boolean(),
          }),
          text: responseField({
            type: WidgetType.TEXT,
            content: "app.api.agent.speechToText.post.response.text",
            schema: z.string(),
          }),
          provider: responseField({
            type: WidgetType.TEXT,
            content: "app.api.agent.speechToText.post.response.provider",
            schema: z.string(),
          }),
          confidence: responseField({
            type: WidgetType.TEXT,
            content: "app.api.agent.speechToText.post.response.confidence",
            schema: z.coerce.number().optional(),
          }),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.speechToText.post.errors.unauthorized.title",
      description:
        "app.api.agent.speechToText.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.speechToText.post.errors.validation.title",
      description:
        "app.api.agent.speechToText.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.speechToText.post.errors.server.title",
      description: "app.api.agent.speechToText.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.speechToText.post.errors.server.title",
      description: "app.api.agent.speechToText.post.errors.server.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.speechToText.post.errors.unauthorized.title",
      description:
        "app.api.agent.speechToText.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.speechToText.post.errors.server.title",
      description: "app.api.agent.speechToText.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.speechToText.post.errors.server.title",
      description: "app.api.agent.speechToText.post.errors.server.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.speechToText.post.errors.server.title",
      description: "app.api.agent.speechToText.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.speechToText.post.errors.server.title",
      description: "app.api.agent.speechToText.post.errors.server.description",
    },
  },

  successTypes: {
    title: "app.api.agent.speechToText.post.success.title",
    description: "app.api.agent.speechToText.post.success.description",
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
