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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user-roles/enum";
import { scopedTranslation } from "./i18n";

const ALLOWED_ROLES = [
  UserRole.CUSTOMER,
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
  UserRole.AI_TOOL_OFF,
] as const;

// ── Shared error types ──────────────────────────────────────────────────────
const SESSION_ERROR_TYPES = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "create.errors.validation.title",
    description: "create.errors.validation.description",
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "create.errors.unauthorized.title",
    description: "create.errors.unauthorized.description",
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "create.errors.server.title",
    description: "create.errors.server.description",
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "create.errors.unknown.title",
    description: "create.errors.unknown.description",
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "create.errors.network.title",
    description: "create.errors.network.description",
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "create.errors.forbidden.title",
    description: "create.errors.forbidden.description",
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "create.errors.notFound.title",
    description: "create.errors.notFound.description",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "create.errors.conflict.title",
    description: "create.errors.conflict.description",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "create.errors.conflict.title",
    description: "create.errors.conflict.description",
  },
} as const;

// ── GET /user/private/sessions — list sessions ──────────────────────────────
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "private", "sessions"],
  title: "list.title",
  description: "list.description",
  icon: "key",
  category: "app.endpointCategories.userAuth",
  tags: ["list.tag"],
  allowedRoles: ALLOWED_ROLES,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "list.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      sessions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list.response.sessions",
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
  }),
  errorTypes: SESSION_ERROR_TYPES,
  successTypes: {
    title: "list.success.title",
    description: "list.success.description",
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
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "private", "sessions"],
  title: "create.title",
  description: "create.description",
  icon: "key",
  category: "app.endpointCategories.userAuth",
  tags: ["create.tag"],
  allowedRoles: ALLOWED_ROLES,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "create.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true } as const,
    children: {
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.form.name",
        description: "create.form.namePlaceholder",
        schema: z.string().min(1).max(100),
      }),
      token: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "create.response.token",
        schema: z.string(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "create.response.id",
        schema: z.string().uuid(),
      }),
      sessionName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "create.response.name",
        schema: z.string(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        content: "create.response.message",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: SESSION_ERROR_TYPES,
  successTypes: {
    title: "create.success.title",
    description: "create.success.description",
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
        message: "create.response.message",
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
