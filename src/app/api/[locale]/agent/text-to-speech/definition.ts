/**
 * Text-to-Speech API Route Definition
 * Converts text to speech using Eden AI providers
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

import { DEFAULT_TTS_VOICE, TtsVoiceOptions } from "./enum";
import { scopedTranslation } from "./i18n";

/**
 * Text-to-Speech Endpoint (POST)
 * Converts text to speech audio using Eden AI
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

  title: "post.title",
  description: "post.description",
  icon: "volume-2",
  category: "app.endpointCategories.ai",
  tags: ["tags.speech", "tags.tts", "tags.ai"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      text: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.text.label",
        description: "post.text.description",
        columns: 12,
        placeholder: "post.text.placeholder",
        schema: z.string().min(1).max(5000),
      }),
      voice: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.voice.label",
        description: "post.voice.description",
        columns: 12,
        options: TtsVoiceOptions,
        schema: z.string().default(DEFAULT_TTS_VOICE),
      }),

      audioUrl: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.audioUrl",
        schema: z.string(),
      }),
      creditCost: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.creditCost",
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
        voice: "MALE",
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
