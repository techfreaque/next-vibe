/**
 * POST /v1/music - start an async music job. Same flow as POST /v1/videos:
 * answers at once with the queued music object; poll GET /v1/music/{id},
 * download GET /v1/music/{id}/content. No OpenAI standard exists for music;
 * the shape mirrors the video API. Served at /api/<locale>/v1/music,
 * authenticated by API key only. The declared response is nominal.
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

import { scopedTranslation } from "../i18n";
import { V1_MUSIC_ALIAS } from "../shared/constants";
import { V1_ERROR_TYPES } from "../shared/error-types";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["v1", "music"],
  aliases: [V1_MUSIC_ALIAS] as const,
  title: "media.music.create.title",
  titleShort: "media.music.create.titleShort",
  description: "media.music.create.description",
  icon: "music",
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
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "media.music.create.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.model.label",
        description: "media.fields.model.musicDescription",
        schema: z.string().min(1),
      }),
      prompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "media.fields.prompt.label",
        description: "media.fields.prompt.musicDescription",
        schema: z.string().min(1).max(2000),
      }),
      seconds: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "media.fields.seconds.label",
        description: "media.fields.seconds.musicDescription",
        schema: z.coerce.number().int().min(1).max(600).optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "media.response.id",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: V1_ERROR_TYPES,
  successTypes: {
    title: "media.music.create.success.title",
    description: "media.music.create.success.description",
  },
  examples: {
    requests: {
      default: {
        model: "musicgen-stereo",
        prompt: "Lo-fi hip hop beat with warm piano, 80 bpm",
        seconds: 20,
      },
    },
    responses: { default: { id: "music_3b9d1f7c5e2a4086b4c8d0e2f6a1c3e5" } },
  },
});

const v1MusicEndpoints = { POST } as const;
export default v1MusicEndpoints;

export type V1MusicPostRequestOutput = typeof POST.types.RequestOutput;
