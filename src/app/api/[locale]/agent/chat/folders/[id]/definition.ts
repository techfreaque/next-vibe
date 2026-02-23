import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
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

import { dateSchema, iconSchema } from "../../../../shared/types/common.schema";
import { scopedTranslation } from "./i18n";

/**
 * Get Single Folder Endpoint (GET)
 * Retrieves a specific folder by ID
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "folders", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  category: "category" as const,
  tags: ["tags.folders" as const],
  icon: "folder-open" as const,

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true },
    children: {
      // === REQUEST URL PARAMS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.id.label" as const,
        description: "get.id.description" as const,
        schema: z.uuid(),
      }),

      // === RESPONSE ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.title" as const,
        description: "get.response.description" as const,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          folder: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.folder.title" as const,
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              id: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.folder.id.content" as const,
                schema: z.uuid(),
              }),
              userId: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.folder.userId.content" as const,
                schema: z.uuid().nullable(),
              }),
              name: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.folder.name.content" as const,
                schema: z.string(),
              }),
              icon: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.folder.icon.content" as const,
                // Runtime: accepts any string (emoji, IconKey), Type: IconKey | null
                schema: iconSchema.nullable(),
              }),
              color: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.folder.color.content" as const,
                schema: z.string().nullable(),
              }),
              parentId: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.folder.parentId.content" as const,
                schema: z.uuid().nullable(),
              }),
              expanded: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.folder.expanded.content" as const,
                schema: z.boolean(),
              }),
              sortOrder: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.folder.sortOrder.content" as const,
                schema: z.coerce.number(),
              }),
              rolesView: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesManage: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesCreateThread: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesPost: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesModerate: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesAdmin: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              createdAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.folder.createdAt.content" as const,
                schema: dateSchema,
              }),
              updatedAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.folder.updatedAt.content" as const,
                schema: dateSchema,
              }),
            },
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    urlPathParams: {
      default: { id: "123e4567-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        response: {
          folder: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            userId: "123e4567-e89b-12d3-a456-426614174001",
            name: "Work",
            icon: "folder",
            color: "#3b82f6",
            parentId: null,
            expanded: true,
            sortOrder: 0,
            rolesView: [UserRole.PUBLIC, UserRole.CUSTOMER],
            rolesManage: [UserRole.CUSTOMER],
            rolesCreateThread: [UserRole.CUSTOMER],
            rolesPost: [UserRole.PUBLIC, UserRole.CUSTOMER],
            rolesModerate: [UserRole.ADMIN],
            rolesAdmin: [UserRole.ADMIN],
            createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
            updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
          },
        },
      },
    },
  },
});

/**
 * Update Folder Endpoint (PATCH)
 * Updates an existing folder
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "folders", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  category: "category" as const,
  tags: ["tags.folders" as const],
  icon: "folder-pen" as const,

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
      updates: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "patch.sections.updates.title" as const,
        description: "patch.sections.updates.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          name: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "patch.name.label" as const,
            description: "patch.name.description" as const,
            columns: 12,
            schema: z.string().min(1).max(255).optional(),
          }),
          icon: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "patch.icon.label" as const,
            description: "patch.icon.description" as const,
            columns: 6,
            // Runtime: accepts any string (emoji, IconKey), Type: IconKey | null | undefined
            schema: iconSchema.nullish(),
          }),
          color: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "patch.color.label" as const,
            description: "patch.color.description" as const,
            columns: 6,
            schema: z.string().optional(),
          }),
          parentId: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.UUID,
            label: "patch.parentId.label" as const,
            description: "patch.parentId.description" as const,
            columns: 6,
            schema: z.uuid().nullable().optional(),
          }),
          expanded: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "patch.expanded.label" as const,
            description: "patch.expanded.description" as const,
            columns: 6,
            schema: z.boolean().optional(),
          }),
          sortOrder: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "patch.sortOrder.label" as const,
            description: "patch.sortOrder.description" as const,
            columns: 6,
            schema: z.coerce.number().optional(),
          }),
          rolesView: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "patch.rolesView.label" as const,
            description: "patch.rolesView.description" as const,
            columns: 6,
            options: UserPermissionRoleOptions,
            schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
          }),
          rolesManage: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "patch.rolesManage.label" as const,
            description: "patch.rolesManage.description" as const,
            columns: 6,
            options: UserPermissionRoleOptions,
            schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
          }),
          rolesCreateThread: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "patch.rolesCreateThread.label" as const,
            description: "patch.rolesCreateThread.description" as const,
            columns: 6,
            options: UserPermissionRoleOptions,
            schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
          }),
          rolesPost: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "patch.rolesPost.label" as const,
            description: "patch.rolesPost.description" as const,
            columns: 6,
            options: UserPermissionRoleOptions,
            schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
          }),
          rolesModerate: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "patch.rolesModerate.label" as const,
            description: "patch.rolesModerate.description" as const,
            columns: 6,
            options: UserPermissionRoleOptions,
            schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
          }),
          rolesAdmin: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "patch.rolesAdmin.label" as const,
            description: "patch.rolesAdmin.description" as const,
            columns: 6,
            options: UserPermissionRoleOptions,
            schema: z.array(z.enum(UserRoleDB)).nullable().optional(),
          }),
        },
      }),

      // === RESPONSE ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "patch.response.title" as const,
        description: "patch.response.description" as const,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          folder: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.folder.title" as const,
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              id: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.folder.id.content" as const,
                schema: z.uuid(),
              }),
              userId: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.folder.userId.content" as const,
                schema: z.uuid().nullable(),
              }),
              name: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.folder.name.content" as const,
                schema: z.string(),
              }),
              icon: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.folder.icon.content" as const,
                // Runtime: accepts any string (emoji, IconKey), Type: IconKey | null
                schema: iconSchema.nullable(),
              }),
              color: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.folder.color.content" as const,
                schema: z.string().nullable(),
              }),
              parentId: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.folder.parentId.content" as const,
                schema: z.uuid().nullable(),
              }),
              expanded: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.folder.expanded.content" as const,
                schema: z.boolean(),
              }),
              sortOrder: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.folder.sortOrder.content" as const,
                schema: z.coerce.number(),
              }),
              rolesView: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesManage: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesCreateThread: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesPost: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesModerate: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesAdmin: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              createdAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.folder.createdAt.content" as const,
                schema: dateSchema,
              }),
              updatedAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.folder.updatedAt.content" as const,
                schema: dateSchema,
              }),
            },
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title",
      description: "patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title",
      description: "patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title",
      description: "patch.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title",
      description: "patch.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title",
      description: "patch.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title",
      description: "patch.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
  },

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },

  examples: {
    urlPathParams: {
      default: { id: "123e4567-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        updates: {
          name: "Personal",
          color: "#10b981",
          icon: "folder-heart",
        },
      },
    },
    responses: {
      default: {
        response: {
          folder: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            userId: "123e4567-e89b-12d3-a456-426614174001",
            name: "Personal",
            icon: "folder",
            color: "#10b981",
            parentId: null,
            expanded: true,
            sortOrder: 0,
            rolesView: [UserRole.PUBLIC, UserRole.CUSTOMER],
            rolesManage: [UserRole.CUSTOMER],
            rolesCreateThread: [UserRole.CUSTOMER],
            rolesPost: [UserRole.PUBLIC, UserRole.CUSTOMER],
            rolesModerate: [UserRole.ADMIN],
            rolesAdmin: [UserRole.ADMIN],
            createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      },
    },
  },
});

/**
 * Delete Folder Endpoint (DELETE)
 * Deletes a folder (cascade deletes child folders and threads)
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["agent", "chat", "folders", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  category: "category" as const,
  tags: ["tags.folders" as const],
  icon: "folder-x" as const,

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "delete.container.title" as const,
    description: "delete.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true },
    children: {
      // === REQUEST URL PARAMS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "delete.id.label" as const,
        description: "delete.id.description" as const,
        schema: z.uuid(),
      }),

      // === RESPONSE ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "delete.response.title" as const,
        description: "delete.response.description" as const,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          success: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "delete.response.success.content" as const,
            schema: z.boolean(),
          }),
          deletedFolderId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "delete.response.deletedFolderId.content" as const,
            schema: z.uuid(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title",
      description: "delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title",
      description: "delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title",
      description: "delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title",
      description: "delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title",
      description: "delete.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title",
      description: "delete.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title",
      description: "delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title",
      description: "delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title",
      description: "delete.errors.conflict.description",
    },
  },

  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
  },

  examples: {
    urlPathParams: {
      default: { id: "123e4567-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        response: {
          success: true,
          deletedFolderId: "123e4567-e89b-12d3-a456-426614174000",
        },
      },
    },
  },
});

// Extract types
export type FolderGetRequestInput = typeof GET.types.RequestInput;
export type FolderGetRequestOutput = typeof GET.types.RequestOutput;
export type FolderGetResponseInput = typeof GET.types.ResponseInput;
export type FolderGetResponseOutput = typeof GET.types.ResponseOutput;
export type FolderGetUrlParamsTypeOutput = typeof GET.types.UrlVariablesOutput;

export type FolderUpdateRequestInput = typeof PATCH.types.RequestInput;
export type FolderUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type FolderUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type FolderUpdateResponseOutput = typeof PATCH.types.ResponseOutput;
export type FolderUpdateUrlParamsTypeOutput =
  typeof PATCH.types.UrlVariablesOutput;

export type FolderDeleteRequestInput = typeof DELETE.types.RequestInput;
export type FolderDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type FolderDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type FolderDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
export type FolderDeleteUrlParamsTypeOutput =
  typeof DELETE.types.UrlVariablesOutput;

const definitions = { GET, PATCH, DELETE } as const;
export default definitions;
