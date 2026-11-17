/**
 * GET /v1/music/{id}/content - The finished audio file (MP3).
 * Served at /api/<locale>/v1/music/{id}/content, authenticated by API
 * key only. The declared response is nominal.
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
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";
import { V1_MUSIC_CONTENT_ALIAS } from "../../../shared/constants";
import { V1_ERROR_TYPES } from "../../../shared/error-types";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["v1", "music", "[id]", "content"],
  aliases: [V1_MUSIC_CONTENT_ALIAS] as const,
  title: "media.music.content.title",
  titleShort: "media.music.content.titleShort",
  description: "media.music.content.description",
  icon: "download",
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
    title: "media.music.content.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.jobId.label",
        description: "media.fields.jobId.description",
        schema: z.string().min(1).max(100),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "media.response.status",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: V1_ERROR_TYPES,
  successTypes: {
    title: "media.music.content.success.title",
    description: "media.music.content.success.description",
  },
  examples: {
    urlPathParams: { default: { id: "music_3b9d1f7c5e2a4086b4c8d0e2f6a1c3e5" } },
    responses: { default: { status: "completed" } },
  },
});

const v1MusicContentEndpoints = { GET } as const;
export default v1MusicContentEndpoints;
