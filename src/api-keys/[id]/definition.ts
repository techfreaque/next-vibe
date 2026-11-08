/**
 * API Key revoke - DELETE /api-keys/[id]
 */

import { translatedValueSchema } from "next-vibe/core/definition/common.schema";
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

import { API_KEY_ERROR_TYPES } from "../definition";
import { scopedTranslation } from "../i18n";

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["api-keys", "[id]"],
  title: "revoke.title",
  titleShort: "revoke.titleShort",
  description: "revoke.description",
  icon: "trash",
  category: "account",
  tags: ["revoke.tag"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.AI_TOOL_OFF,
  ] as const,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "revoke.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "revoke.title",
        description: "revoke.description",
        schema: z.string().uuid(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        label: "revoke.response.message",
        schema: translatedValueSchema,
      }),
    },
  }),
  errorTypes: API_KEY_ERROR_TYPES,
  successTypes: {
    title: "revoke.success.title",
    description: "revoke.success.description",
  },
  examples: {
    urlPathParams: { default: { id: "00000000-0000-0000-0000-000000000000" } },
    responses: { default: { message: "revoke.response.message" } },
  },
});

const apiKeyRevokeEndpoints = { DELETE } as const;
export default apiKeyRevokeEndpoints;

export type ApiKeyDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
