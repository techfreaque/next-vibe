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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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

/**
 * Add Role Endpoint Definition (POST)
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["users", "user", "[id]", "roles"],
  title: "app.api.users.user.id.roles.post.title" as const,
  description: "app.api.users.user.id.roles.post.description" as const,
  icon: "shield" as const,
  category: "app.api.user.category" as const,
  tags: ["app.api.users.user.tag" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.users.user.id.roles.post.container.title" as const,
      description:
        "app.api.users.user.id.roles.post.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.users.user.id.roles.post.id.label" as const,
        description: "app.api.users.user.id.roles.post.id.description" as const,
        placeholder: "app.api.users.user.id.roles.post.id.placeholder" as const,
        columns: 12,
        schema: z.string().uuid("usersErrors.validation.id.invalid"),
      }),

      // === REQUEST BODY ===
      role: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.users.user.id.roles.post.role.label" as const,
        description:
          "app.api.users.user.id.roles.post.role.description" as const,
        placeholder:
          "app.api.users.user.id.roles.post.role.placeholder" as const,
        columns: 12,
        options: UserPermissionRoleOptions,
        schema: z.enum(UserRoleDB),
      }),

      submitButton: submitButton({
        label: "app.api.users.user.id.roles.post.submit.label" as const,
        inline: true,
        usage: { request: "data" },
      }),

      // === RESPONSE ===
      roleId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.roles.post.response.roleId.content" as const,
        schema: z.string().uuid().describe("Role assignment ID"),
      }),
      userId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.roles.post.response.userId.content" as const,
        schema: z.string().uuid().describe("User ID"),
      }),
      assignedRole: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.roles.post.response.assignedRole.content" as const,
        schema: z.string().describe("Assigned role"),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.users.user.id.roles.post.errors.unauthorized.title" as const,
      description:
        "app.api.users.user.id.roles.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.users.user.id.roles.post.errors.validation.title" as const,
      description:
        "app.api.users.user.id.roles.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.users.user.id.roles.post.errors.forbidden.title" as const,
      description:
        "app.api.users.user.id.roles.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.users.user.id.roles.post.errors.notFound.title" as const,
      description:
        "app.api.users.user.id.roles.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.users.user.id.roles.post.errors.conflict.title" as const,
      description:
        "app.api.users.user.id.roles.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.users.user.id.roles.post.errors.network.title" as const,
      description:
        "app.api.users.user.id.roles.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.users.user.id.roles.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.users.user.id.roles.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.users.user.id.roles.post.errors.server.title" as const,
      description:
        "app.api.users.user.id.roles.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.users.user.id.roles.post.errors.unknown.title" as const,
      description:
        "app.api.users.user.id.roles.post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "app.api.users.user.id.roles.post.success.title" as const,
    description:
      "app.api.users.user.id.roles.post.success.description" as const,
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
  method: Methods.DELETE,
  path: ["users", "user", "[id]", "roles"],
  title: "app.api.users.user.id.roles.delete.title" as const,
  description: "app.api.users.user.id.roles.delete.description" as const,
  icon: "shield" as const,
  category: "app.api.user.category" as const,
  tags: ["app.api.users.user.tag" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.users.user.id.roles.delete.container.title" as const,
      description:
        "app.api.users.user.id.roles.delete.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.users.user.id.roles.delete.id.label" as const,
        description:
          "app.api.users.user.id.roles.delete.id.description" as const,
        placeholder:
          "app.api.users.user.id.roles.delete.id.placeholder" as const,
        columns: 12,
        schema: z.string().uuid("usersErrors.validation.id.invalid"),
      }),

      // === REQUEST BODY ===
      role: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.users.user.id.roles.delete.role.label" as const,
        description:
          "app.api.users.user.id.roles.delete.role.description" as const,
        placeholder:
          "app.api.users.user.id.roles.delete.role.placeholder" as const,
        columns: 12,
        options: UserPermissionRoleOptions,
        schema: z.enum(UserRoleDB),
      }),

      submitButton: submitButton({
        label: "app.api.users.user.id.roles.delete.submit.label" as const,
        inline: true,
        usage: { request: "data" },
      }),

      // === RESPONSE ===
      success: responseField({
        type: WidgetType.BADGE,
        text: "app.api.users.user.id.roles.delete.response.success.content" as const,
        schema: z.boolean().describe("Whether the role was removed"),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.users.user.id.roles.delete.errors.unauthorized.title" as const,
      description:
        "app.api.users.user.id.roles.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.users.user.id.roles.delete.errors.validation.title" as const,
      description:
        "app.api.users.user.id.roles.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.users.user.id.roles.delete.errors.forbidden.title" as const,
      description:
        "app.api.users.user.id.roles.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.users.user.id.roles.delete.errors.notFound.title" as const,
      description:
        "app.api.users.user.id.roles.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.users.user.id.roles.delete.errors.conflict.title" as const,
      description:
        "app.api.users.user.id.roles.delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.users.user.id.roles.delete.errors.network.title" as const,
      description:
        "app.api.users.user.id.roles.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.users.user.id.roles.delete.errors.unsavedChanges.title" as const,
      description:
        "app.api.users.user.id.roles.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.users.user.id.roles.delete.errors.server.title" as const,
      description:
        "app.api.users.user.id.roles.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.users.user.id.roles.delete.errors.unknown.title" as const,
      description:
        "app.api.users.user.id.roles.delete.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "app.api.users.user.id.roles.delete.success.title" as const,
    description:
      "app.api.users.user.id.roles.delete.success.description" as const,
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
