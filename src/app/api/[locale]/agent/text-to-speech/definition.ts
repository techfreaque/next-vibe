/**
 * Text-to-Speech API Route Definition
 * Converts text to speech using Eden AI providers
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { DEFAULT_TTS_VOICE, TtsVoiceOptions } from "./enum";

/**
 * Text-to-Speech Endpoint (POST)
 * Converts text to speech audio using Eden AI
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "text-to-speech"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
  ],

  title: "app.api.agent.textToSpeech.post.title",
  description: "app.api.agent.textToSpeech.post.description",
  icon: "volume-2",
  category: "app.api.agent.category",
  tags: [
    "app.api.agent.tags.speech",
    "app.api.agent.tags.tts",
    "app.api.agent.tags.ai",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.textToSpeech.post.form.title",
      description: "app.api.agent.textToSpeech.post.form.description",
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
          label: "app.api.agent.textToSpeech.post.text.label",
          description: "app.api.agent.textToSpeech.post.text.description",
          columns: 12,
          placeholder: "app.api.agent.textToSpeech.post.text.placeholder",
        },
        z.string().min(1).max(5000),
      ),
      voice: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.textToSpeech.post.voice.label",
          description: "app.api.agent.textToSpeech.post.voice.description",
          columns: 12,
          options: TtsVoiceOptions,
        },
        z.string().default(DEFAULT_TTS_VOICE),
      ),

      audioUrl: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.textToSpeech.post.response.audioUrl",
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.textToSpeech.post.errors.validation_failed.title",
      description:
        "app.api.agent.textToSpeech.post.errors.validation_failed.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.textToSpeech.post.errors.network_error.title",
      description:
        "app.api.agent.textToSpeech.post.errors.network_error.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.textToSpeech.post.errors.unauthorized.title",
      description:
        "app.api.agent.textToSpeech.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.textToSpeech.post.errors.forbidden.title",
      description:
        "app.api.agent.textToSpeech.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.textToSpeech.post.errors.not_found.title",
      description:
        "app.api.agent.textToSpeech.post.errors.not_found.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.textToSpeech.post.errors.server_error.title",
      description:
        "app.api.agent.textToSpeech.post.errors.server_error.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.textToSpeech.post.errors.unknown_error.title",
      description:
        "app.api.agent.textToSpeech.post.errors.unknown_error.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.textToSpeech.post.errors.unsaved_changes.title",
      description:
        "app.api.agent.textToSpeech.post.errors.unsaved_changes.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.textToSpeech.post.errors.conflict.title",
      description:
        "app.api.agent.textToSpeech.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.textToSpeech.post.success.title",
    description: "app.api.agent.textToSpeech.post.success.description",
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
        audioUrl: "https://example.com/audio.mp3",
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
} as const;
export default definitions;
