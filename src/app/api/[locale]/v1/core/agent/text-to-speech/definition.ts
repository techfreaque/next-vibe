/**
 * Text-to-Speech API Route Definition
 * Converts text to speech using Eden AI providers
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/create";
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

import { TtsVoiceOptions } from "./enum";

/**
 * Text-to-Speech Endpoint (POST)
 * Converts text to speech audio using Eden AI
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "agent", "text-to-speech"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
  ],

  title: "app.api.v1.core.agent.textToSpeech.post.title",
  description: "app.api.v1.core.agent.textToSpeech.post.description",
  category: "app.api.v1.core.agent.category",
  tags: [
    "app.api.v1.core.agent.tags.speech",
    "app.api.v1.core.agent.tags.tts",
    "app.api.v1.core.agent.tags.ai",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.textToSpeech.post.form.title",
      description: "app.api.v1.core.agent.textToSpeech.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      text: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.agent.textToSpeech.post.text.label",
          description:
            "app.api.v1.core.agent.textToSpeech.post.text.description",
          columns: 12,
          placeholder:
            "app.api.v1.core.agent.textToSpeech.post.text.placeholder",
        },
        z.string().min(1).max(5000),
      ),
      voice: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.agent.textToSpeech.post.voice.label",
          description:
            "app.api.v1.core.agent.textToSpeech.post.voice.description",
          columns: 12,
          options: TtsVoiceOptions,
        },
        z.string().default("MALE"),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.agent.textToSpeech.post.response.title",
          description:
            "app.api.v1.core.agent.textToSpeech.post.response.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.textToSpeech.post.response.success",
            },
            z.boolean(),
          ),
          audioUrl: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.textToSpeech.post.response.audioUrl",
            },
            z.string(),
          ),
          provider: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.textToSpeech.post.response.provider",
            },
            z.string(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.textToSpeech.post.errors.validation_failed.title",
      description:
        "app.api.v1.core.agent.textToSpeech.post.errors.validation_failed.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.textToSpeech.post.errors.network_error.title",
      description:
        "app.api.v1.core.agent.textToSpeech.post.errors.network_error.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.textToSpeech.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.textToSpeech.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.agent.textToSpeech.post.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.textToSpeech.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.textToSpeech.post.errors.not_found.title",
      description:
        "app.api.v1.core.agent.textToSpeech.post.errors.not_found.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.textToSpeech.post.errors.server_error.title",
      description:
        "app.api.v1.core.agent.textToSpeech.post.errors.server_error.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.textToSpeech.post.errors.unknown_error.title",
      description:
        "app.api.v1.core.agent.textToSpeech.post.errors.unknown_error.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.textToSpeech.post.errors.unsaved_changes.title",
      description:
        "app.api.v1.core.agent.textToSpeech.post.errors.unsaved_changes.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.textToSpeech.post.errors.conflict.title",
      description:
        "app.api.v1.core.agent.textToSpeech.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.textToSpeech.post.success.title",
    description: "app.api.v1.core.agent.textToSpeech.post.success.description",
  },

  examples: {
    requests: {
      default: {
        text: "Hello, this is a test of the text to speech system.",
        voice: "MALE",
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          audioUrl: "https://example.com/audio.mp3",
          provider: "amazon",
        },
      },
    },
    urlPathParams: undefined,
  },
});

// Extract types
export type TextToSpeechPostRequestInput = typeof POST.types.RequestInput;
export type TextToSpeechPostRequestOutput = typeof POST.types.RequestOutput;
export type TextToSpeechPostResponseInput = typeof POST.types.ResponseInput;
export type TextToSpeechPostResponseOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
};

export { POST };
export default definitions;
