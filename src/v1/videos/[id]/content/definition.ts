/**
 * GET /v1/videos/{id}/content - The finished video file (MP4).
 * Served at /api/<locale>/v1/videos/{id}/content, authenticated by API
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
import { V1_VIDEO_CONTENT_ALIAS } from "../../../shared/constants";
import { V1_ERROR_TYPES } from "../../../shared/error-types";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["v1", "videos", "[id]", "content"],
  aliases: [V1_VIDEO_CONTENT_ALIAS] as const,
  title: "media.videos.content.title",
  titleShort: "media.videos.content.titleShort",
  description: "media.videos.content.description",
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
    title: "media.videos.content.title",
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
    title: "media.videos.content.success.title",
    description: "media.videos.content.success.description",
  },
  examples: {
    urlPathParams: {
      default: { id: "video_8f2c0e5a7b1d4c3e9a6f0b2d4e6a8c1f" },
    },
    responses: { default: { status: "completed" } },
  },
});

const v1VideoContentEndpoints = { GET } as const;
export default v1VideoContentEndpoints;
