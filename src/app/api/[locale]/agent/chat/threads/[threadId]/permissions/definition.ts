import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole, UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * Get Thread Permissions Endpoint (GET)
 * Retrieves the list of moderator IDs for a thread
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]", "permissions"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.threads.threadId.permissions.get.title" as const,
  description:
    "app.api.agent.chat.threads.threadId.permissions.get.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: [
    "app.api.agent.chat.tags.threads" as const,
    "app.api.agent.chat.tags.permissions" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.agent.chat.threads.threadId.permissions.get.container.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      threadId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.agent.chat.threads.threadId.permissions.get.threadId.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.permissions.get.threadId.description" as const,
        },
        z.uuid(),
      ),

      // === RESPONSE FIELDS ===
      rolesView: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.agent.chat.threads.threadId.permissions.get.response.rolesView.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.permissions.get.response.rolesView.description" as const,
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).nullable(),
      ),
      rolesEdit: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.agent.chat.threads.threadId.permissions.get.response.rolesEdit.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.permissions.get.response.rolesEdit.description" as const,
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).nullable(),
      ),
      rolesPost: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.agent.chat.threads.threadId.permissions.get.response.rolesPost.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.permissions.get.response.rolesPost.description" as const,
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).nullable(),
      ),
      rolesModerate: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.agent.chat.threads.threadId.permissions.get.response.rolesModerate.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.permissions.get.response.rolesModerate.description" as const,
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).nullable(),
      ),
      rolesAdmin: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.agent.chat.threads.threadId.permissions.get.response.rolesAdmin.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.permissions.get.response.rolesAdmin.description" as const,
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).nullable(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.validation.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.network.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.server.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.unsaved.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.agent.chat.threads.threadId.permissions.get.success.title" as const,
    description:
      "app.api.agent.chat.threads.threadId.permissions.get.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { threadId: "123e4567-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        rolesView: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
        rolesEdit: [UserRole.CUSTOMER, UserRole.ADMIN],
        rolesPost: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
        rolesModerate: [UserRole.PARTNER_ADMIN, UserRole.ADMIN],
        rolesAdmin: [UserRole.ADMIN],
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
  path: ["agent", "chat", "threads", "[threadId]", "permissions"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.threads.threadId.permissions.patch.title" as const,
  description:
    "app.api.agent.chat.threads.threadId.permissions.patch.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: [
    "app.api.agent.chat.tags.threads" as const,
    "app.api.agent.chat.tags.permissions" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.agent.chat.threads.threadId.permissions.patch.container.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.patch.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      threadId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.agent.chat.threads.threadId.permissions.patch.threadId.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.permissions.patch.threadId.description" as const,
        },
        z.uuid(),
      ),

      // === REQUEST DATA ===
      rolesView: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.agent.chat.threads.threadId.permissions.patch.rolesView.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.permissions.patch.rolesView.description" as const,
          columns: 6,
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).nullable().optional(),
      ),
      rolesEdit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.agent.chat.threads.threadId.permissions.patch.rolesEdit.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.permissions.patch.rolesEdit.description" as const,
          columns: 6,
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).nullable().optional(),
      ),
      rolesPost: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.agent.chat.threads.threadId.permissions.patch.rolesPost.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.permissions.patch.rolesPost.description" as const,
          columns: 6,
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).nullable().optional(),
      ),
      rolesModerate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.agent.chat.threads.threadId.permissions.patch.rolesModerate.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.permissions.patch.rolesModerate.description" as const,
          columns: 6,
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).nullable().optional(),
      ),
      rolesAdmin: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.agent.chat.threads.threadId.permissions.patch.rolesAdmin.label" as const,
          description:
            "app.api.agent.chat.threads.threadId.permissions.patch.rolesAdmin.description" as const,
          columns: 6,
          options: UserRoleDB.map((role) => ({ value: role, label: role })),
        },
        z.array(z.enum(UserRoleDB)).nullable().optional(),
      ),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.threads.threadId.permissions.patch.response.title" as const,
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          rolesView: responseField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.agent.chat.threads.threadId.permissions.patch.response.rolesView.label" as const,
              description:
                "app.api.agent.chat.threads.threadId.permissions.patch.response.rolesView.description" as const,
              options: UserRoleDB.map((role) => ({ value: role, label: role })),
            },
            z.array(z.enum(UserRoleDB)).nullable(),
          ),
          rolesEdit: responseField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.agent.chat.threads.threadId.permissions.patch.response.rolesEdit.label" as const,
              description:
                "app.api.agent.chat.threads.threadId.permissions.patch.response.rolesEdit.description" as const,
              options: UserRoleDB.map((role) => ({ value: role, label: role })),
            },
            z.array(z.enum(UserRoleDB)).nullable(),
          ),
          rolesPost: responseField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.agent.chat.threads.threadId.permissions.patch.response.rolesPost.label" as const,
              description:
                "app.api.agent.chat.threads.threadId.permissions.patch.response.rolesPost.description" as const,
              options: UserRoleDB.map((role) => ({ value: role, label: role })),
            },
            z.array(z.enum(UserRoleDB)).nullable(),
          ),
          rolesModerate: responseField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.agent.chat.threads.threadId.permissions.patch.response.rolesModerate.label" as const,
              description:
                "app.api.agent.chat.threads.threadId.permissions.patch.response.rolesModerate.description" as const,
              options: UserRoleDB.map((role) => ({ value: role, label: role })),
            },
            z.array(z.enum(UserRoleDB)).nullable(),
          ),
          rolesAdmin: responseField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.agent.chat.threads.threadId.permissions.patch.response.rolesAdmin.label" as const,
              description:
                "app.api.agent.chat.threads.threadId.permissions.patch.response.rolesAdmin.description" as const,
              options: UserRoleDB.map((role) => ({ value: role, label: role })),
            },
            z.array(z.enum(UserRoleDB)).nullable(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.validation.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.network.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.server.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.unsaved.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.permissions.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.agent.chat.threads.threadId.permissions.patch.success.title" as const,
    description:
      "app.api.agent.chat.threads.threadId.permissions.patch.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { threadId: "123e4567-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        rolesView: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
        rolesEdit: [UserRole.CUSTOMER, UserRole.ADMIN],
        rolesPost: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
        rolesModerate: [UserRole.PARTNER_ADMIN, UserRole.ADMIN],
        rolesAdmin: [UserRole.ADMIN],
      },
    },
    responses: {
      default: {
        response: {
          rolesView: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
          rolesEdit: [UserRole.CUSTOMER, UserRole.ADMIN],
          rolesPost: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
          rolesModerate: [UserRole.PARTNER_ADMIN, UserRole.ADMIN],
          rolesAdmin: [UserRole.ADMIN],
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
