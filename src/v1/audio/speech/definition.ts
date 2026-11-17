/**
 * POST /v1/audio/speech - OpenAI-compatible text to speech. Answers with the
 * audio bytes. Served at /api/<locale>/v1/audio/speech, authenticated by API
 * key only. The declared response is nominal.
 */

import { TTS_OUTPUT_FORMATS } from "next-vibe/agent/text-to-speech/constants";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";
import {
  V1_AUDIO_SPEECH_ALIAS,
  V1_MAX_SPEECH_CHARACTERS,
} from "../../shared/constants";
import { V1_ERROR_TYPES } from "../../shared/error-types";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["v1", "audio", "speech"],
  aliases: [V1_AUDIO_SPEECH_ALIAS] as const,
  title: "media.speech.title",
  titleShort: "media.speech.titleShort",
  description: "media.speech.description",
  icon: "volume-2",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.api"],
  // PUBLIC is allowed so the handler can answer unauthenticated calls with the
  // OpenAI 401 body; it authenticates by API key only (see api-keys/auth.ts).
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.CLI_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.SKILL_OFF,
  ] as const,
  timeoutMs: 0,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "media.speech.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.model.label",
        description: "media.fields.model.speechDescription",
        schema: z.string().min(1),
      }),
      input: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "media.fields.input.label",
        description: "media.fields.input.description",
        schema: z.string().min(1).max(V1_MAX_SPEECH_CHARACTERS),
      }),
      voice: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.voice.label",
        description: "media.fields.voice.description",
        schema: z.string().optional(),
      }),
      response_format: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.responseFormat.label",
        description: "media.fields.responseFormat.speechDescription",
        schema: z.enum(TTS_OUTPUT_FORMATS).optional(),
      }),
      speed: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "media.fields.speed.label",
        description: "media.fields.speed.description",
        schema: z.number().min(0.25).max(4).optional(),
      }),
      instructions: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.instructions.label",
        description: "media.fields.instructions.description",
        schema: z.string().optional(),
      }),
      object: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "media.response.object",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: V1_ERROR_TYPES,
  successTypes: {
    title: "media.speech.success.title",
    description: "media.speech.success.description",
  },
  examples: {
    requests: {
      default: {
        model: "tts-1",
        voice: "nova",
        input: "Your order shipped today.",
        response_format: "mp3",
      },
    },
    responses: { default: { object: "audio" } },
  },
});

const v1AudioSpeechEndpoints = { POST } as const;
export default v1AudioSpeechEndpoints;

export type V1AudioSpeechPostRequestOutput = typeof POST.types.RequestOutput;
