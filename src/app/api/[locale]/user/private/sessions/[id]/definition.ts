/**
 * Session Revoke API Endpoint Definition
 * DELETE /user/private/sessions/[id]
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestUrlPathParamsField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user-roles/enum";
import { scopedTranslation } from "../i18n";

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["user", "private", "sessions", "[id]"],
  title: "revoke.title",
  description: "revoke.description",
  icon: "trash",
  category: "app.endpointCategories.userAuth",
  tags: ["revoke.tag"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.AI_TOOL_OFF,
  ] as const,
  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "revoke.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "revoke.title",
        description: "revoke.description",
        schema: z.string().uuid(),
      }),
      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.ALERT,
        content: "revoke.response.message",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "revoke.errors.unauthorized.title",
      description: "revoke.errors.unauthorized.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "revoke.errors.unauthorized.title",
      description: "revoke.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "revoke.errors.server.title",
      description: "revoke.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "revoke.errors.unknown.title",
      description: "revoke.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "revoke.errors.network.title",
      description: "revoke.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "revoke.errors.forbidden.title",
      description: "revoke.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "revoke.errors.notFound.title",
      description: "revoke.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "revoke.errors.conflict.title",
      description: "revoke.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "revoke.errors.conflict.title",
      description: "revoke.errors.conflict.description",
    },
  },
  successTypes: {
    title: "revoke.success.title",
    description: "revoke.success.description",
  },
  examples: {
    urlPathParams: {
      default: { id: "00000000-0000-0000-0000-000000000000" },
    },
    responses: {
      default: {
        message: "revoke.response.message",
      },
    },
  },
});

const sessionRevokeEndpoints = { DELETE } as const;
export default sessionRevokeEndpoints;

export type SessionDeleteRequestInput = typeof DELETE.types.RequestInput;
export type SessionDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type SessionDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type SessionDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
