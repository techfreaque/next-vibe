import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseArrayOptionalField,
  scopedObjectFieldNew,
  scopedRequestField,
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
import {
  UserPermissionRoleOptions,
  UserRole,
  UserRoleDB,
} from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { FolderPermissionsContainer } from "./widget";

/**
 * Get Folder Permissions Endpoint (GET)
 * Retrieves the list of moderator IDs for a folder
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "folders", "[id]", "permissions"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "shield",
  category: "category" as const,
  tags: ["tags.folders" as const, "tags.permissions" as const],

  fields: customWidgetObject({
    render: FolderPermissionsContainer,
    usage: { response: true, request: "urlPathParams" } as const,
    children: {
      // === REQUEST URL PARAMS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.id.label" as const,
        description: "get.id.description" as const,
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      rolesView: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.BADGE,
          text: "get.response.rolesView.label" as const,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesManage: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.BADGE,
          text: "get.response.rolesManage.label" as const,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesCreateThread: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.BADGE,
          text: "get.response.rolesCreateThread.label" as const,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesPost: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.BADGE,
          text: "get.response.rolesPost.label" as const,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesModerate: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.BADGE,
          text: "get.response.rolesModerate.label" as const,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesAdmin: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.BADGE,
          text: "get.response.rolesAdmin.label" as const,
          schema: z.enum(UserRoleDB),
        }),
      ),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsaved.title" as const,
      description: "get.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
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
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "folders", "[id]", "permissions"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "shield",
  category: "category" as const,
  tags: ["tags.folders" as const, "tags.permissions" as const],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "patch.container.title" as const,
    description: "patch.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === REQUEST URL PARAMS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.id.label" as const,
        description: "patch.id.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      rolesView: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesView.label" as const,
        description: "patch.rolesView.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)),
      }),
      rolesManage: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesManage.label" as const,
        description: "patch.rolesManage.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)),
      }),
      rolesCreateThread: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesCreateThread.label" as const,
        description: "patch.rolesCreateThread.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)),
      }),
      rolesPost: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesPost.label" as const,
        description: "patch.rolesPost.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)),
      }),
      rolesModerate: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesModerate.label" as const,
        description: "patch.rolesModerate.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)),
      }),
      rolesAdmin: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesAdmin.label" as const,
        description: "patch.rolesAdmin.description" as const,
        columns: 6,
        options: UserPermissionRoleOptions,
        schema: z.array(z.enum(UserRoleDB)),
      }),

      // === RESPONSE ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "patch.response.title" as const,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          rolesView: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "patch.response.rolesView.label" as const,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesManage: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "patch.response.rolesManage.label" as const,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesCreateThread: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "patch.response.rolesCreateThread.label" as const,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesPost: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "patch.response.rolesPost.label" as const,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesModerate: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "patch.response.rolesModerate.label" as const,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesAdmin: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "patch.response.rolesAdmin.label" as const,
              schema: z.enum(UserRoleDB),
            }),
          ),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsaved.title" as const,
      description: "patch.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
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
