import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseArrayOptionalField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  UserPermissionRoleOptions,
  UserRole,
  UserRoleDB,
} from "@/app/api/[locale]/user/user-roles/enum";

/**
 * Get Folder Permissions Endpoint (GET)
 * Retrieves the list of moderator IDs for a folder
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "folders", "[id]", "permissions"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.folders.id.permissions.get.title" as const,
  description:
    "app.api.agent.chat.folders.id.permissions.get.description" as const,
  icon: "shield",
  category: "app.api.agent.chat.category" as const,
  tags: [
    "app.api.agent.chat.tags.folders" as const,
    "app.api.agent.chat.tags.permissions" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.agent.chat.folders.id.permissions.get.container.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label:
          "app.api.agent.chat.folders.id.permissions.get.id.label" as const,
        description:
          "app.api.agent.chat.folders.id.permissions.get.id.description" as const,
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      rolesView: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        responseField({
          type: WidgetType.BADGE,
          text: "app.api.agent.chat.folders.id.permissions.get.response.rolesView.label" as const,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesManage: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        responseField({
          type: WidgetType.BADGE,
          text: "app.api.agent.chat.folders.id.permissions.get.response.rolesManage.label" as const,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesCreateThread: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        responseField({
          type: WidgetType.BADGE,
          text: "app.api.agent.chat.folders.id.permissions.get.response.rolesCreateThread.label" as const,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesPost: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        responseField({
          type: WidgetType.BADGE,
          text: "app.api.agent.chat.folders.id.permissions.get.response.rolesPost.label" as const,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesModerate: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        responseField({
          type: WidgetType.BADGE,
          text: "app.api.agent.chat.folders.id.permissions.get.response.rolesModerate.label" as const,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesAdmin: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        responseField({
          type: WidgetType.BADGE,
          text: "app.api.agent.chat.folders.id.permissions.get.response.rolesAdmin.label" as const,
          schema: z.enum(UserRoleDB),
        }),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.folders.id.permissions.get.errors.validation.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.folders.id.permissions.get.errors.network.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.folders.id.permissions.get.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.folders.id.permissions.get.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.folders.id.permissions.get.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.folders.id.permissions.get.errors.server.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.folders.id.permissions.get.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.folders.id.permissions.get.errors.unsaved.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.get.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.folders.id.permissions.get.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.agent.chat.folders.id.permissions.get.success.title" as const,
    description:
      "app.api.agent.chat.folders.id.permissions.get.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { id: "123e4567-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        rolesView: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
        rolesManage: [UserRole.CUSTOMER, UserRole.ADMIN],
        rolesCreateThread: [UserRole.CUSTOMER, UserRole.ADMIN],
        rolesPost: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
        rolesModerate: [UserRole.PARTNER_ADMIN, UserRole.ADMIN],
        rolesAdmin: [UserRole.ADMIN],
      },
    },
  },
});

/**
 * Update Folder Permissions Endpoint (PATCH)
 * Updates the list of moderator IDs for a folder
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["agent", "chat", "folders", "[id]", "permissions"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.folders.id.permissions.patch.title" as const,
  description:
    "app.api.agent.chat.folders.id.permissions.patch.description" as const,
  icon: "shield",
  category: "app.api.agent.chat.category" as const,
  tags: [
    "app.api.agent.chat.tags.folders" as const,
    "app.api.agent.chat.tags.permissions" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.agent.chat.folders.id.permissions.patch.container.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.patch.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label:
          "app.api.agent.chat.folders.id.permissions.patch.id.label" as const,
        description:
          "app.api.agent.chat.folders.id.permissions.patch.id.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      rolesView: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label:
          "app.api.agent.chat.folders.id.permissions.patch.rolesView.label" as const,
        description:
          "app.api.agent.chat.folders.id.permissions.patch.rolesView.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)),
      }),
      rolesManage: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label:
          "app.api.agent.chat.folders.id.permissions.patch.rolesManage.label" as const,
        description:
          "app.api.agent.chat.folders.id.permissions.patch.rolesManage.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)),
      }),
      rolesCreateThread: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label:
          "app.api.agent.chat.folders.id.permissions.patch.rolesCreateThread.label" as const,
        description:
          "app.api.agent.chat.folders.id.permissions.patch.rolesCreateThread.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)),
      }),
      rolesPost: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label:
          "app.api.agent.chat.folders.id.permissions.patch.rolesPost.label" as const,
        description:
          "app.api.agent.chat.folders.id.permissions.patch.rolesPost.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)),
      }),
      rolesModerate: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label:
          "app.api.agent.chat.folders.id.permissions.patch.rolesModerate.label" as const,
        description:
          "app.api.agent.chat.folders.id.permissions.patch.rolesModerate.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)),
      }),
      rolesAdmin: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label:
          "app.api.agent.chat.folders.id.permissions.patch.rolesAdmin.label" as const,
        description:
          "app.api.agent.chat.folders.id.permissions.patch.rolesAdmin.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)),
      }),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.folders.id.permissions.patch.response.title" as const,
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          rolesView: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.BADGE,
              text: "app.api.agent.chat.folders.id.permissions.patch.response.rolesView.label" as const,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesManage: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.BADGE,
              text: "app.api.agent.chat.folders.id.permissions.patch.response.rolesManage.label" as const,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesCreateThread: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.BADGE,
              text: "app.api.agent.chat.folders.id.permissions.patch.response.rolesCreateThread.label" as const,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesPost: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.BADGE,
              text: "app.api.agent.chat.folders.id.permissions.patch.response.rolesPost.label" as const,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesModerate: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.BADGE,
              text: "app.api.agent.chat.folders.id.permissions.patch.response.rolesModerate.label" as const,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesAdmin: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.BADGE,
              text: "app.api.agent.chat.folders.id.permissions.patch.response.rolesAdmin.label" as const,
              schema: z.enum(UserRoleDB),
            }),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.folders.id.permissions.patch.errors.validation.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.folders.id.permissions.patch.errors.network.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.folders.id.permissions.patch.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.folders.id.permissions.patch.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.folders.id.permissions.patch.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.folders.id.permissions.patch.errors.server.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.folders.id.permissions.patch.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.folders.id.permissions.patch.errors.unsaved.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.patch.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.folders.id.permissions.patch.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.folders.id.permissions.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.agent.chat.folders.id.permissions.patch.success.title" as const,
    description:
      "app.api.agent.chat.folders.id.permissions.patch.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { id: "123e4567-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        rolesView: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
        rolesManage: [UserRole.CUSTOMER, UserRole.ADMIN],
        rolesCreateThread: [UserRole.CUSTOMER, UserRole.ADMIN],
        rolesPost: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
        rolesModerate: [UserRole.PARTNER_ADMIN, UserRole.ADMIN],
        rolesAdmin: [UserRole.ADMIN],
      },
    },
    responses: {
      default: {
        response: {
          rolesView: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
          rolesManage: [UserRole.CUSTOMER, UserRole.ADMIN],
          rolesCreateThread: [UserRole.CUSTOMER, UserRole.ADMIN],
          rolesPost: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
          rolesModerate: [UserRole.PARTNER_ADMIN, UserRole.ADMIN],
          rolesAdmin: [UserRole.ADMIN],
        },
      },
    },
  },
});

// Extract types
export type FolderPermissionsGetRequestInput = typeof GET.types.RequestInput;
export type FolderPermissionsGetRequestOutput = typeof GET.types.RequestOutput;
export type FolderPermissionsGetResponseInput = typeof GET.types.ResponseInput;
export type FolderPermissionsGetResponseOutput =
  typeof GET.types.ResponseOutput;
export type FolderPermissionsGetUrlParamsTypeOutput =
  typeof GET.types.UrlVariablesOutput;

export type FolderPermissionsUpdateRequestInput =
  typeof PATCH.types.RequestInput;
export type FolderPermissionsUpdateRequestOutput =
  typeof PATCH.types.RequestOutput;
export type FolderPermissionsUpdateResponseInput =
  typeof PATCH.types.ResponseInput;
export type FolderPermissionsUpdateResponseOutput =
  typeof PATCH.types.ResponseOutput;
export type FolderPermissionsUpdateUrlParamsTypeOutput =
  typeof PATCH.types.UrlVariablesOutput;

const definitions = { GET, PATCH } as const;
export default definitions;
