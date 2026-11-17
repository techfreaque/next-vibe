/**
 * POST /v1/audio/transcriptions - OpenAI-compatible speech to text
 * (multipart upload). Served at /api/<locale>/v1/audio/transcriptions,
 * authenticated by API key only. The handler answers in the requested
 * response_format (JSON, plain text, SRT or WebVTT); the declared response is
 * nominal.
 */

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
import { V1_AUDIO_TRANSCRIPTIONS_ALIAS } from "../../shared/constants";
import { V1_ERROR_TYPES } from "../../shared/error-types";

export const V1_TRANSCRIPTION_FORMATS = [
  "json",
  "text",
  "srt",
  "verbose_json",
  "vtt",
] as const;
export type V1TranscriptionFormat = (typeof V1_TRANSCRIPTION_FORMATS)[number];

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["v1", "audio", "transcriptions"],
  aliases: [V1_AUDIO_TRANSCRIPTIONS_ALIAS] as const,
  title: "media.transcriptions.title",
  titleShort: "media.transcriptions.titleShort",
  description: "media.transcriptions.description",
  icon: "mic",
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
    title: "media.transcriptions.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      file: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.FILE,
        label: "media.fields.file.label",
        description: "media.fields.file.description",
        schema: z.instanceof(File),
      }),
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.model.label",
        description: "media.fields.model.transcriptionDescription",
        schema: z.string().min(1),
      }),
      language: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.language.label",
        description: "media.fields.language.description",
        schema: z
          .string()
          .regex(/^[a-zA-Z]{2,3}$/)
          .optional(),
      }),
      prompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.prompt.label",
        description: "media.fields.prompt.transcriptionDescription",
        schema: z.string().optional(),
      }),
      response_format: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.responseFormat.label",
        description: "media.fields.responseFormat.transcriptionDescription",
        schema: z.enum(V1_TRANSCRIPTION_FORMATS).optional(),
      }),
      temperature: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "media.fields.temperature.label",
        description: "media.fields.temperature.description",
        schema: z.coerce.number().min(0).max(1).optional(),
      }),
      text: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "media.response.text",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: V1_ERROR_TYPES,
  successTypes: {
    title: "media.transcriptions.success.title",
    description: "media.transcriptions.success.description",
  },
  examples: {
    requests: {
      default: {
        file: new File([], "meeting.mp3", { type: "audio/mpeg" }),
        model: "whisper-1",
        response_format: "json",
      },
    },
    responses: { default: { text: "Thanks everyone for joining." } },
  },
});

const v1AudioTranscriptionsEndpoints = { POST } as const;
export default v1AudioTranscriptionsEndpoints;

export type V1AudioTranscriptionsPostRequestOutput =
  typeof POST.types.RequestOutput;
