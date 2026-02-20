/**
 * User Session Management API Endpoint Definitions
 * Allows users to list, create, and revoke their own sessions.
 * Named sessions can be used as long-lived tokens for programmatic access (agents).
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user-roles/enum";

const ALLOWED_ROLES = [
  UserRole.CUSTOMER,
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
  UserRole.REMOTE_SKILL,
] as const;

// ── Shared error types ──────────────────────────────────────────────────────
const SESSION_ERROR_TYPES = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title:
      "app.api.user.private.sessions.create.errors.validation.title" as const,
    description:
      "app.api.user.private.sessions.create.errors.validation.description" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title:
      "app.api.user.private.sessions.create.errors.unauthorized.title" as const,
    description:
      "app.api.user.private.sessions.create.errors.unauthorized.description" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "app.api.user.private.sessions.create.errors.server.title" as const,
    description:
      "app.api.user.private.sessions.create.errors.server.description" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "app.api.user.private.sessions.create.errors.unknown.title" as const,
    description:
      "app.api.user.private.sessions.create.errors.unknown.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "app.api.user.private.sessions.create.errors.network.title" as const,
    description:
      "app.api.user.private.sessions.create.errors.network.description" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title:
      "app.api.user.private.sessions.create.errors.forbidden.title" as const,
    description:
      "app.api.user.private.sessions.create.errors.forbidden.description" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title:
      "app.api.user.private.sessions.create.errors.notFound.title" as const,
    description:
      "app.api.user.private.sessions.create.errors.notFound.description" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title:
      "app.api.user.private.sessions.create.errors.conflict.title" as const,
    description:
      "app.api.user.private.sessions.create.errors.conflict.description" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title:
      "app.api.user.private.sessions.create.errors.conflict.title" as const,
    description:
      "app.api.user.private.sessions.create.errors.conflict.description" as const,
  },
} as const;

// ── GET /user/private/sessions — list sessions ──────────────────────────────
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["user", "private", "sessions"],
  title: "app.api.user.private.sessions.list.title" as const,
  description: "app.api.user.private.sessions.list.description" as const,
  icon: "key",
  category: "app.api.user.category" as const,
  tags: ["app.api.user.private.sessions.list.tag" as const],
  allowedRoles: ALLOWED_ROLES,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.user.private.sessions.list.title" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      sessions: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.user.private.sessions.list.response.sessions" as const,
        schema: z.array(
          z.object({
            id: z.string().uuid(),
            name: z.string().nullable(),
            createdAt: z.string(),
            expiresAt: z.string(),
            isCurrentSession: z.boolean(),
          }),
        ),
      }),
    },
  ),
  errorTypes: SESSION_ERROR_TYPES,
  successTypes: {
    title: "app.api.user.private.sessions.list.success.title" as const,
    description:
      "app.api.user.private.sessions.list.success.description" as const,
  },
  examples: {
    responses: {
      default: {
        sessions: [],
      },
    },
  },
});

// ── POST /user/private/sessions — create named session ──────────────────────
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["user", "private", "sessions"],
  title: "app.api.user.private.sessions.create.title" as const,
  description: "app.api.user.private.sessions.create.description" as const,
  icon: "key",
  category: "app.api.user.category" as const,
  tags: ["app.api.user.private.sessions.create.tag" as const],
  allowedRoles: ALLOWED_ROLES,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.user.private.sessions.create.title" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true } as const,
    {
      name: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.user.private.sessions.create.form.name" as const,
        description:
          "app.api.user.private.sessions.create.form.namePlaceholder" as const,
        schema: z.string().min(1).max(100),
      }),
      token: responseField({
        type: WidgetType.TEXT,
        content: "app.api.user.private.sessions.create.response.token" as const,
        schema: z.string(),
      }),
      id: responseField({
        type: WidgetType.TEXT,
        content: "app.api.user.private.sessions.create.response.id" as const,
        schema: z.string().uuid(),
      }),
      sessionName: responseField({
        type: WidgetType.TEXT,
        content: "app.api.user.private.sessions.create.response.name" as const,
        schema: z.string(),
      }),
      message: responseField({
        type: WidgetType.ALERT,
        content:
          "app.api.user.private.sessions.create.response.message" as const,
        schema: z.string(),
      }),
    },
  ),
  errorTypes: SESSION_ERROR_TYPES,
  successTypes: {
    title: "app.api.user.private.sessions.create.success.title" as const,
    description:
      "app.api.user.private.sessions.create.success.description" as const,
  },
  examples: {
    requests: {
      default: { name: "My agent bot" },
    },
    responses: {
      default: {
        token: "eyJ...",
        id: "00000000-0000-0000-0000-000000000000",
        sessionName: "My agent bot",
        message: "app.api.user.private.sessions.create.response.message",
      },
    },
  },
});

const sessionsEndpoints = { GET, POST } as const;
export default sessionsEndpoints;

export type SessionsGetRequestInput = typeof GET.types.RequestInput;
export type SessionsGetRequestOutput = typeof GET.types.RequestOutput;
export type SessionsGetResponseInput = typeof GET.types.ResponseInput;
export type SessionsGetResponseOutput = typeof GET.types.ResponseOutput;

export type SessionsPostRequestInput = typeof POST.types.RequestInput;
export type SessionsPostRequestOutput = typeof POST.types.RequestOutput;
export type SessionsPostResponseInput = typeof POST.types.ResponseInput;
export type SessionsPostResponseOutput = typeof POST.types.ResponseOutput;
