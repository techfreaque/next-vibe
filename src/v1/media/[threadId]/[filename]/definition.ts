/**
 * GET /v1/media/{threadId}/{filename} - download a file a /v1 media call
 * produced. Credential: the `expires` + `sig` query of the signed URL the API
 * returned (plain HTTP clients, <img> tags), or the owner's API key. Served at
 * /api/<locale>/v1/media/..., answers with the file bytes; the declared
 * response is nominal.
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
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";
import { V1_MEDIA_FILE_ALIAS } from "../../../shared/constants";
import { V1_ERROR_TYPES } from "../../../shared/error-types";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["v1", "media", "[threadId]", "[filename]"],
  aliases: [V1_MEDIA_FILE_ALIAS] as const,
  title: "media.file.title",
  titleShort: "media.file.titleShort",
  description: "media.file.description",
  icon: "file",
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
    title: "media.file.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.threadId.label",
        description: "media.fields.threadId.description",
        schema: z.string().regex(/^[A-Za-z0-9_-]+$/),
      }),
      filename: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.filename.label",
        description: "media.fields.filename.description",
        schema: z.string().regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9]+$/),
      }),
      expires: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "media.fields.expires.label",
        description: "media.fields.expires.description",
        schema: z.coerce.number().int().optional(),
      }),
      sig: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "media.fields.sig.label",
        description: "media.fields.sig.description",
        schema: z.coerce.string().max(128).optional(),
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
    title: "media.file.success.title",
    description: "media.file.success.description",
  },
  examples: {
    urlPathParams: {
      default: {
        threadId: "5b0c7e4a-9d2f-4c1e-8a6b-3f0d2e1c9b7a",
        filename: "0e9d8c7b-6a5f-4e3d-2c1b-0a9f8e7d6c5b.png",
      },
    },
    requests: { default: { expires: 1_767_225_600, sig: "3f9a..." } },
    responses: { default: { object: "file" } },
  },
});

const v1MediaFileEndpoints = { GET } as const;
export default v1MediaFileEndpoints;
