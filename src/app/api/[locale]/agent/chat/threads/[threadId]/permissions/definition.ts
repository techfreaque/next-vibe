import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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

import { scopedTranslation } from "./i18n";

/**
 * Get Thread Permissions Endpoint (GET)
 * Retrieves the list of moderator IDs for a thread
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]", "permissions"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "shield",
  category: "endpointCategories.chatThreads",
  tags: ["tags.threads" as const, "tags.permissions" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true },
    children: {
      // === REQUEST URL PARAMS ===
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.threadId.label" as const,
        description: "get.threadId.description" as const,
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      rolesView: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "get.response.rolesView.label" as const,
        description: "get.response.rolesView.description" as const,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable(),
      }),
      rolesEdit: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "get.response.rolesEdit.label" as const,
        description: "get.response.rolesEdit.description" as const,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable(),
      }),
      rolesPost: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "get.response.rolesPost.label" as const,
        description: "get.response.rolesPost.description" as const,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable(),
      }),
      rolesModerate: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "get.response.rolesModerate.label" as const,
        description: "get.response.rolesModerate.description" as const,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable(),
      }),
      rolesAdmin: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "get.response.rolesAdmin.label" as const,
        description: "get.response.rolesAdmin.description" as const,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable(),
      }),
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
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "threads", "[threadId]", "permissions"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "shield",
  category: "endpointCategories.chatThreads",
  tags: ["tags.threads" as const, "tags.permissions" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "patch.container.title" as const,
    description: "patch.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === REQUEST URL PARAMS ===
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.threadId.label" as const,
        description: "patch.threadId.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      rolesView: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesView.label" as const,
        description: "patch.rolesView.description" as const,
        columns: 6,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
      }),
      rolesEdit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesEdit.label" as const,
        description: "patch.rolesEdit.description" as const,
        columns: 6,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
      }),
      rolesPost: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesPost.label" as const,
        description: "patch.rolesPost.description" as const,
        columns: 6,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
      }),
      rolesModerate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesModerate.label" as const,
        description: "patch.rolesModerate.description" as const,
        columns: 6,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
      }),
      rolesAdmin: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.rolesAdmin.label" as const,
        description: "patch.rolesAdmin.description" as const,
        columns: 6,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
      }),

      // === RESPONSE ===
      rolesViewResult: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.response.rolesView.label" as const,
        description: "patch.response.rolesView.description" as const,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable(),
      }),
      rolesEditResult: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.response.rolesEdit.label" as const,
        description: "patch.response.rolesEdit.description" as const,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable(),
      }),
      rolesPostResult: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.response.rolesPost.label" as const,
        description: "patch.response.rolesPost.description" as const,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable(),
      }),
      rolesModerateResult: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.response.rolesModerate.label" as const,
        description: "patch.response.rolesModerate.description" as const,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable(),
      }),
      rolesAdminResult: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "patch.response.rolesAdmin.label" as const,
        description: "patch.response.rolesAdmin.description" as const,
        options: UserRoleDB.map((role) => ({ value: role, label: role })),
        schema: z.array(z.enum(UserRoleDB)).nullable(),
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
        rolesViewResult: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
        rolesEditResult: [UserRole.CUSTOMER, UserRole.ADMIN],
        rolesPostResult: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
        rolesModerateResult: [UserRole.PARTNER_ADMIN, UserRole.ADMIN],
        rolesAdminResult: [UserRole.ADMIN],
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
