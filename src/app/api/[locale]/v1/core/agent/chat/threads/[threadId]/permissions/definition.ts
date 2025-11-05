import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  requestUrlPathParamsField,
  responseArrayField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import {
  UserRole,
  UserRoleDB,
} from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Get Thread Permissions Endpoint (GET)
 * Retrieves the list of moderator IDs for a thread
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "agent", "chat", "threads", "[threadId]", "permissions"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.v1.core.agent.chat.threads.threadId.permissions.get.title" as const,
  description:
    "app.api.v1.core.agent.chat.threads.threadId.permissions.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: [
    "app.api.v1.core.agent.chat.tags.threads" as const,
    "app.api.v1.core.agent.chat.tags.permissions" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    {},
    {
      // === REQUEST URL PARAMS ===
      threadId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.get.threadId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.get.threadId.description" as const,
        },
        z.uuid(),
      ),

      // === RESPONSE FIELDS ===
      rolesRead: responseArrayField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.get.response.rolesRead.content" as const,
        },
        z.enum(UserRoleDB),
      ),
      rolesWrite: responseArrayField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.get.response.rolesWrite.content" as const,
        },
        z.enum(UserRoleDB),
      ),
      rolesHide: responseArrayField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.get.response.rolesHide.content" as const,
        },
        z.enum(UserRoleDB),
      ),
      rolesDelete: responseArrayField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.get.response.rolesDelete.content" as const,
        },
        z.enum(UserRoleDB),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.validation.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.network.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.notFound.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.server.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.unknown.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.unsaved.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.conflict.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.agent.chat.threads.threadId.permissions.get.success.title" as const,
    description:
      "app.api.v1.core.agent.chat.threads.threadId.permissions.get.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { threadId: "123e4567-e89b-12d3-a456-426614174000" },
    },
    requests: undefined,
    responses: {
      default: {
        rolesRead: ["PUBLIC", "CUSTOMER", "ADMIN"],
        rolesWrite: ["CUSTOMER", "ADMIN"],
        rolesHide: ["PARTNER_ADMIN", "ADMIN"],
        rolesDelete: ["ADMIN"],
      },
    },
  },
});

/**
 * Update Thread Permissions Endpoint (PATCH)
 * Updates the list of moderator IDs for a thread
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["v1", "core", "agent", "chat", "threads", "[threadId]", "permissions"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.title" as const,
  description:
    "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: [
    "app.api.v1.core.agent.chat.tags.threads" as const,
    "app.api.v1.core.agent.chat.tags.permissions" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data&urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      threadId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.threadId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.threadId.description" as const,
        },
        z.uuid(),
      ),

      // === REQUEST DATA ===
      rolesRead: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.rolesRead.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.rolesRead.description" as const,
          layout: { columns: 6 },
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).optional(),
      ),
      rolesWrite: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.rolesWrite.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.rolesWrite.description" as const,
          layout: { columns: 6 },
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).optional(),
      ),
      rolesHide: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.rolesHide.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.rolesHide.description" as const,
          layout: { columns: 6 },
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).optional(),
      ),
      rolesDelete: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.rolesDelete.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.rolesDelete.description" as const,
          layout: { columns: 6 },
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).optional(),
      ),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.response.title" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.response.description" as const,
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          rolesRead: responseArrayField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.response.rolesRead.content" as const,
            },
            z.string(),
          ),
          rolesWrite: responseArrayField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.response.rolesWrite.content" as const,
            },
            z.string(),
          ),
          rolesHide: responseArrayField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.response.rolesHide.content" as const,
            },
            z.string(),
          ),
          rolesDelete: responseArrayField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.response.rolesDelete.content" as const,
            },
            z.string(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.validation.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.network.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.notFound.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.server.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.unknown.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.unsaved.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.conflict.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.success.title" as const,
    description:
      "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { threadId: "123e4567-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        rolesRead: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
        rolesWrite: [UserRole.CUSTOMER, UserRole.ADMIN],
        rolesHide: [UserRole.PARTNER_ADMIN, UserRole.ADMIN],
        rolesDelete: [UserRole.ADMIN],
      },
    },
    responses: {
      default: {
        response: {
          rolesRead: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
          rolesWrite: [UserRole.CUSTOMER, UserRole.ADMIN],
          rolesHide: [UserRole.PARTNER_ADMIN, UserRole.ADMIN],
          rolesDelete: [UserRole.ADMIN],
        },
      },
    },
  },
});

// Extract types
export type ThreadPermissionsGetRequestInput = typeof GET.types.RequestInput;
export type ThreadPermissionsGetRequestOutput = typeof GET.types.RequestOutput;
export type ThreadPermissionsGetResponseInput = typeof GET.types.ResponseInput;
export type ThreadPermissionsGetResponseOutput =
  typeof GET.types.ResponseOutput;
export type ThreadPermissionsGetUrlParamsTypeOutput =
  typeof GET.types.UrlVariablesOutput;

export type ThreadPermissionsUpdateRequestInput =
  typeof PATCH.types.RequestInput;
export type ThreadPermissionsUpdateRequestOutput =
  typeof PATCH.types.RequestOutput;
export type ThreadPermissionsUpdateResponseInput =
  typeof PATCH.types.ResponseInput;
export type ThreadPermissionsUpdateResponseOutput =
  typeof PATCH.types.ResponseOutput;
export type ThreadPermissionsUpdateUrlParamsTypeOutput =
  typeof PATCH.types.UrlVariablesOutput;

const definitions = { GET, PATCH } as const;
export default definitions;
