/**
 * User Role Management API Endpoint Definition
 * Add or remove roles from a specific user (admin only)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  UserPermissionRole,
  UserPermissionRoleOptions,
  UserRole,
  UserRoleDB,
} from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

/**
 * Add Role Endpoint Definition (POST)
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["users", "user", "[id]", "roles"],
  title: "roles.post.title" as const,
  description: "roles.post.description" as const,
  icon: "shield" as const,
  category: "endpointCategories.userAdmin",
  subCategory: "endpointCategories.userAdminManagement",
  tags: ["category" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "roles.post.container.title" as const,
    description: "roles.post.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "roles.post.id.label" as const,
        description: "roles.post.id.description" as const,
        placeholder: "roles.post.id.placeholder" as const,
        columns: 12,
        schema: z.string().uuid("usersErrors.validation.id.invalid"),
      }),

      // === REQUEST BODY ===
      role: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "roles.post.role.label" as const,
        description: "roles.post.role.description" as const,
        placeholder: "roles.post.role.placeholder" as const,
        columns: 12,
        options: UserPermissionRoleOptions,
        schema: z.enum(UserRoleDB),
      }),

      submitButton: submitButton(scopedTranslation, {
        label: "roles.post.submit.label" as const,
        inline: true,
        usage: { request: "data" },
      }),

      // === RESPONSE ===
      roleId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "roles.post.response.roleId.content" as const,
        schema: z.string().uuid().describe("Role assignment ID"),
      }),
      userId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "roles.post.response.userId.content" as const,
        schema: z.string().uuid().describe("User ID"),
      }),
      assignedRole: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "roles.post.response.assignedRole.content" as const,
        schema: z.string().describe("Assigned role"),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "roles.post.errors.unauthorized.title" as const,
      description: "roles.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "roles.post.errors.validation.title" as const,
      description: "roles.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "roles.post.errors.forbidden.title" as const,
      description: "roles.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "roles.post.errors.notFound.title" as const,
      description: "roles.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "roles.post.errors.conflict.title" as const,
      description: "roles.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "roles.post.errors.network.title" as const,
      description: "roles.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "roles.post.errors.unsavedChanges.title" as const,
      description: "roles.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "roles.post.errors.server.title" as const,
      description: "roles.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "roles.post.errors.unknown.title" as const,
      description: "roles.post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "roles.post.success.title" as const,
    description: "roles.post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    requests: {
      default: {
        role: UserPermissionRole.ADMIN,
      },
      customer: {
        role: UserPermissionRole.CUSTOMER,
      },
    },
    responses: {
      default: {
        roleId: "role-assignment-uuid",
        userId: "123e4567-e89b-12d3-a456-426614174000",
        assignedRole: UserPermissionRole.ADMIN,
      },
    },
  },
});

/**
 * Remove Role Endpoint Definition (DELETE)
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["users", "user", "[id]", "roles"],
  title: "roles.delete.title" as const,
  description: "roles.delete.description" as const,
  icon: "shield" as const,
  category: "endpointCategories.userAdmin",
  subCategory: "endpointCategories.userAdminManagement",
  tags: ["category" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "roles.delete.container.title" as const,
    description: "roles.delete.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "roles.delete.id.label" as const,
        description: "roles.delete.id.description" as const,
        placeholder: "roles.delete.id.placeholder" as const,
        columns: 12,
        schema: z.string().uuid("usersErrors.validation.id.invalid"),
      }),

      // === REQUEST BODY ===
      role: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "roles.delete.role.label" as const,
        description: "roles.delete.role.description" as const,
        placeholder: "roles.delete.role.placeholder" as const,
        columns: 12,
        options: UserPermissionRoleOptions,
        schema: z.enum(UserRoleDB),
      }),

      submitButton: submitButton(scopedTranslation, {
        label: "roles.delete.submit.label" as const,
        inline: true,
        usage: { request: "data" },
      }),

      // === RESPONSE ===
      success: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "roles.delete.response.success.content" as const,
        schema: z.boolean().describe("Whether the role was removed"),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "roles.delete.errors.unauthorized.title" as const,
      description: "roles.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "roles.delete.errors.validation.title" as const,
      description: "roles.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "roles.delete.errors.forbidden.title" as const,
      description: "roles.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "roles.delete.errors.notFound.title" as const,
      description: "roles.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "roles.delete.errors.conflict.title" as const,
      description: "roles.delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "roles.delete.errors.network.title" as const,
      description: "roles.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "roles.delete.errors.unsavedChanges.title" as const,
      description: "roles.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "roles.delete.errors.server.title" as const,
      description: "roles.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "roles.delete.errors.unknown.title" as const,
      description: "roles.delete.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "roles.delete.success.title" as const,
    description: "roles.delete.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    requests: {
      default: {
        role: UserPermissionRole.ADMIN,
      },
    },
    responses: {
      default: {
        success: true,
      },
    },
  },
});

export type UserRolePostRequestInput = typeof POST.types.RequestInput;
export type UserRolePostRequestOutput = typeof POST.types.RequestOutput;
export type UserRolePostResponseInput = typeof POST.types.ResponseInput;
export type UserRolePostResponseOutput = typeof POST.types.ResponseOutput;
export type UserRolePostUrlParamsInput = typeof POST.types.UrlVariablesInput;
export type UserRolePostUrlParamsOutput = typeof POST.types.UrlVariablesOutput;

export type UserRoleDeleteRequestInput = typeof DELETE.types.RequestInput;
export type UserRoleDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type UserRoleDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type UserRoleDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
export type UserRoleDeleteUrlParamsInput =
  typeof DELETE.types.UrlVariablesInput;
export type UserRoleDeleteUrlParamsOutput =
  typeof DELETE.types.UrlVariablesOutput;

const definitions = {
  POST,
  DELETE,
} as const;

export default definitions;
