/**
 * Text-to-Speech API Route Definition
 * Converts text to speech using AI providers (OpenAI TTS, ElevenLabs, Eden AI)
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { lazy } from "react";
import { z } from "zod";

import {
  TtsModelId,
  TtsModelIdOptions,
} from "@/app/api/[locale]/agent/text-to-speech/models";

import { DEFAULT_TTS_VOICE_ID } from "./constants";
import { scopedTranslation } from "./i18n";

const TextToSpeechContainer = lazy(() =>
  import("./widget").then((m) => ({ default: m.TextToSpeechContainer })),
);

/**
 * Text-to-Speech Endpoint (POST)
 * Converts text to speech audio using model-based provider routing
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "text-to-speech"],
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
  timeoutMs: 0,
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "volume-2",
  category: "ai",
  subCategory: "Generation",
  tags: ["tags.speech", "tags.tts", "tags.ai"],

  fields: customWidgetObject({
    render: TextToSpeechContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      text: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.text.label",
        description: "post.text.description",
        columns: 12,
        placeholder: "post.text.placeholder",
        schema: z.string().min(1).max(5000),
      }),
      voiceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.voice.label",
        description: "post.voice.description",
        columns: 12,
        options: TtsModelIdOptions,
        schema: z.enum(TtsModelId).default(DEFAULT_TTS_VOICE_ID),
      }),

      audioUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.audioUrl",
        schema: z.string(),
      }),
      creditCost: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.audioUrl",
        schema: z.number().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation_failed.title",
      description: "post.errors.validation_failed.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network_error.title",
      description: "post.errors.network_error.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.not_found.title",
      description: "post.errors.not_found.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server_error.title",
      description: "post.errors.server_error.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown_error.title",
      description: "post.errors.unknown_error.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsaved_changes.title",
      description: "post.errors.unsaved_changes.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        text: "Hello, this is a test of the text to speech system.",
        voiceId: TtsModelId.OPENAI_NOVA,
      },
    },
    responses: {
      default: {
        audioUrl: "https://example.com/audio.mp3",
      },
    },
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
