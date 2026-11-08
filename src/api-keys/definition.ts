/**
 * API Keys - endpoint definitions
 * GET  /api-keys  list the caller's keys (prefix + last used only) + API base URL
 * POST /api-keys  create a key (full key is returned ONCE)
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { API_KEYS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const ApiKeysContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ApiKeysContainer })),
);

const ALLOWED_ROLES = [
  UserRole.CUSTOMER,
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
  // A key must be created by a human in the UI, never by an agent session.
  UserRole.AI_TOOL_OFF,
] as const;

export const API_KEY_ERROR_TYPES = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title",
    description: "errors.validation.description",
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title",
    description: "errors.unauthorized.description",
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title",
    description: "errors.server.description",
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title",
    description: "errors.unknown.description",
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title",
    description: "errors.network.description",
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title",
    description: "errors.forbidden.description",
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title",
    description: "errors.notFound.description",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title",
    description: "errors.conflict.description",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.conflict.title",
    description: "errors.conflict.description",
  },
} as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["api-keys"],
  aliases: [API_KEYS_ALIAS] as const,
  title: "list.title",
  titleShort: "list.titleShort",
  description: "list.description",
  icon: "key",
  category: "account",
  tags: ["list.tag"],
  allowedRoles: ALLOWED_ROLES,
  fields: customWidgetObject({
    render: ApiKeysContainer,
    usage: { response: true } as const,
    children: {
      baseUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "list.response.baseUrl",
        schema: z.string(),
      }),
      isPaid: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "list.response.isPaid",
        schema: z.boolean(),
      }),
      keys: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "list.response.keys",
        schema: z.array(
          z.object({
            id: z.string().uuid(),
            name: z.string(),
            keyPrefix: z.string(),
            lastUsedAt: dateSchema.nullable(),
            createdAt: dateSchema,
            revokedAt: dateSchema.nullable(),
            rateLimitPerMinute: z.number(),
          }),
        ),
      }),
    },
  }),
  errorTypes: API_KEY_ERROR_TYPES,
  successTypes: {
    title: "list.success.title",
    description: "list.success.description",
  },
  examples: {
    responses: {
      default: {
        baseUrl: "https://example.com/api/en-US/v1",
        isPaid: true,
        keys: [],
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["api-keys"],
  title: "create.title",
  titleShort: "create.titleShort",
  description: "create.description",
  icon: "key",
  category: "account",
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
        schema: z.string().trim().min(1).max(100),
      }),
      key: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "create.response.key",
        schema: z.string(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "create.response.id",
        schema: z.string().uuid(),
      }),
      keyPrefix: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "create.response.keyPrefix",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: API_KEY_ERROR_TYPES,
  successTypes: {
    title: "create.success.title",
    description: "create.success.description",
  },
  examples: {
    requests: { default: { name: "My app" } },
    responses: {
      default: {
        key: "sk-unb-example",
        id: "00000000-0000-0000-0000-000000000000",
        keyPrefix: "sk-unb-example",
      },
    },
  },
});

const apiKeysEndpoints = { GET, POST } as const;
export default apiKeysEndpoints;

export type ApiKeysGetResponseOutput = typeof GET.types.ResponseOutput;
export type ApiKeysPostRequestOutput = typeof POST.types.RequestOutput;
export type ApiKeysPostResponseOutput = typeof POST.types.ResponseOutput;
