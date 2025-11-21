/**
 * Speech-to-Text API Route Definition
 * Converts audio to text using Eden AI providers
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { SttLanguageOptions, SttProviderOptions } from "./enum";

/**
 * Speech-to-Text Endpoint (POST)
 * Transcribes audio to text using Eden AI
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "agent", "speech-to-text"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
  ],
  credits: 2, // Cost 2 credits per STT conversion

  title: "app.api.v1.core.agent.speechToText.post.title",
  description: "app.api.v1.core.agent.speechToText.post.description",
  category: "app.api.v1.core.agent.category",
  tags: [
    "app.api.v1.core.agent.tags.speech",
    "app.api.v1.core.agent.tags.transcription",
    "app.api.v1.core.agent.tags.ai",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.speechToText.post.form.title",
      description: "app.api.v1.core.agent.speechToText.post.form.description",
      layoutType: LayoutType.GRID, columns: 12,
    },
    { request: "data", response: true },
    {
      // === FILE UPLOAD SECTION ===
      fileUpload: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.agent.speechToText.post.fileUpload.title",
          description:
            "app.api.v1.core.agent.speechToText.post.fileUpload.description",
          layoutType: LayoutType.GRID, columns: 12,
        },
        { request: "data" },
        {
          file: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.FILE,
              label: "app.api.v1.core.agent.speechToText.post.audio.label",
              description:
                "app.api.v1.core.agent.speechToText.post.audio.description",
          columns: 12,
            },
            z
              .instanceof(File)
              .refine((file) => file.size <= 25 * 1024 * 1024, {
                message:
                  "app.api.v1.core.agent.speechToText.post.audio.validation.maxSize",
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
                    "app.api.v1.core.agent.speechToText.post.audio.validation.audioOnly",
                },
              ),
          ),
        },
      ),

      // === CONFIG FIELDS ===
      provider: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.agent.speechToText.post.provider.label",
          description:
            "app.api.v1.core.agent.speechToText.post.provider.description",
          columns: 6,
          options: SttProviderOptions,
        },
        z.string().default("openai"),
      ),
      language: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.agent.speechToText.post.language.label",
          description:
            "app.api.v1.core.agent.speechToText.post.language.description",
          columns: 6,
          options: SttLanguageOptions,
        },
        z.string().default("en"),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.agent.speechToText.post.response.title",
          description:
            "app.api.v1.core.agent.speechToText.post.response.description",
          layoutType: LayoutType.GRID, columns: 12,
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.speechToText.post.response.success",
            },
            z.boolean(),
          ),
          text: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.agent.speechToText.post.response.text",
            },
            z.string(),
          ),
          provider: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.speechToText.post.response.provider",
            },
            z.string(),
          ),
          confidence: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.speechToText.post.response.confidence",
            },
            z.number().optional(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.speechToText.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.speechToText.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.agent.speechToText.post.errors.validation.title",
      description:
        "app.api.v1.core.agent.speechToText.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.speechToText.post.errors.server.title",
      description:
        "app.api.v1.core.agent.speechToText.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.speechToText.post.errors.server.title",
      description:
        "app.api.v1.core.agent.speechToText.post.errors.server.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.speechToText.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.speechToText.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.speechToText.post.errors.server.title",
      description:
        "app.api.v1.core.agent.speechToText.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.speechToText.post.errors.server.title",
      description:
        "app.api.v1.core.agent.speechToText.post.errors.server.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.agent.speechToText.post.errors.server.title",
      description:
        "app.api.v1.core.agent.speechToText.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.speechToText.post.errors.server.title",
      description:
        "app.api.v1.core.agent.speechToText.post.errors.server.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.speechToText.post.success.title",
    description: "app.api.v1.core.agent.speechToText.post.success.description",
  },

  examples: {
    requests: {
      default: {
        fileUpload: {
          file: new File([""], "audio.mp3", { type: "audio/mpeg" }),
        },
        provider: "openai",
        language: "en",
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
    urlPathParams: undefined,
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
};

export { POST };
export default definitions;
