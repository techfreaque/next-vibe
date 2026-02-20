/**
 * Session Revoke API Endpoint Definition
 * DELETE /user/private/sessions/[id]
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user-roles/enum";

const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["user", "private", "sessions", "[id]"],
  title: "app.api.user.private.sessions.revoke.title" as const,
  description: "app.api.user.private.sessions.revoke.description" as const,
  icon: "trash",
  category: "app.api.user.category" as const,
  tags: ["app.api.user.private.sessions.revoke.tag" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.REMOTE_SKILL,
  ] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.user.private.sessions.revoke.title" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "urlPathParams", response: true } as const,
    {
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.user.private.sessions.revoke.title" as const,
        description:
          "app.api.user.private.sessions.revoke.description" as const,
        schema: z.string().uuid(),
      }),
      message: responseField({
        type: WidgetType.ALERT,
        content:
          "app.api.user.private.sessions.revoke.response.message" as const,
        schema: z.string(),
      }),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.user.private.sessions.revoke.errors.unauthorized.title" as const,
      description:
        "app.api.user.private.sessions.revoke.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.user.private.sessions.revoke.errors.unauthorized.title" as const,
      description:
        "app.api.user.private.sessions.revoke.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.user.private.sessions.revoke.errors.server.title" as const,
      description:
        "app.api.user.private.sessions.revoke.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.user.private.sessions.revoke.errors.unknown.title" as const,
      description:
        "app.api.user.private.sessions.revoke.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.user.private.sessions.revoke.errors.network.title" as const,
      description:
        "app.api.user.private.sessions.revoke.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.user.private.sessions.revoke.errors.forbidden.title" as const,
      description:
        "app.api.user.private.sessions.revoke.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.user.private.sessions.revoke.errors.notFound.title" as const,
      description:
        "app.api.user.private.sessions.revoke.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.user.private.sessions.revoke.errors.conflict.title" as const,
      description:
        "app.api.user.private.sessions.revoke.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.user.private.sessions.revoke.errors.conflict.title" as const,
      description:
        "app.api.user.private.sessions.revoke.errors.conflict.description" as const,
    },
  },
  successTypes: {
    title: "app.api.user.private.sessions.revoke.success.title" as const,
    description:
      "app.api.user.private.sessions.revoke.success.description" as const,
  },
  examples: {
    urlPathParams: {
      default: { id: "00000000-0000-0000-0000-000000000000" },
    },
    responses: {
      default: {
        message: "app.api.user.private.sessions.revoke.response.message",
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
