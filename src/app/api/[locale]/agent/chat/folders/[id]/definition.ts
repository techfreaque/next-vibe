import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  field,
  objectField,
  requestDataField,
  requestUrlPathParamsField,
  responseArrayOptionalField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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

import { iconSchema } from "../../../../shared/types/common.schema";

/**
 * Get Single Folder Endpoint (GET)
 * Retrieves a specific folder by ID
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "folders", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.folders.id.get.title" as const,
  description: "app.api.agent.chat.folders.id.get.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.folders" as const],
  icon: "folder-open" as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.folders.id.get.container.title" as const,
      description:
        "app.api.agent.chat.folders.id.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.folders.id.get.id.label" as const,
          description:
            "app.api.agent.chat.folders.id.get.id.description" as const,
        },
        z.uuid(),
      ),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.folders.id.get.response.title" as const,
          description:
            "app.api.agent.chat.folders.id.get.response.description" as const,
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          folder: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.agent.chat.folders.id.get.response.folder.title" as const,
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              id: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.get.response.folder.id.content" as const,
                },
                z.uuid(),
              ),
              userId: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.get.response.folder.userId.content" as const,
                },
                z.uuid().nullable(),
              ),
              name: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.get.response.folder.name.content" as const,
                },
                z.string(),
              ),
              icon: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.get.response.folder.icon.content" as const,
                },
                // Runtime: accepts any string (emoji, IconKey), Type: IconKey | null
                iconSchema.nullable(),
              ),
              color: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.get.response.folder.color.content" as const,
                },
                z.string().nullable(),
              ),
              parentId: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.get.response.folder.parentId.content" as const,
                },
                z.uuid().nullable(),
              ),
              expanded: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.get.response.folder.expanded.content" as const,
                },
                z.boolean(),
              ),
              sortOrder: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.get.response.folder.sortOrder.content" as const,
                },
                z.coerce.number(),
              ),
              rolesView: responseArrayOptionalField(
                {
                  type: WidgetType.DATA_LIST,
                },
                field(
                  z.enum(UserRoleDB),
                  { response: true },
                  {
                    type: WidgetType.BADGE,
                    enumOptions: UserPermissionRoleOptions,
                  },
                ),
              ),
              rolesManage: responseArrayOptionalField(
                {
                  type: WidgetType.DATA_LIST,
                },
                field(
                  z.enum(UserRoleDB),
                  { response: true },
                  {
                    type: WidgetType.BADGE,
                    enumOptions: UserPermissionRoleOptions,
                  },
                ),
              ),
              rolesCreateThread: responseArrayOptionalField(
                {
                  type: WidgetType.DATA_LIST,
                },
                field(
                  z.enum(UserRoleDB),
                  { response: true },
                  {
                    type: WidgetType.BADGE,
                    enumOptions: UserPermissionRoleOptions,
                  },
                ),
              ),
              rolesPost: responseArrayOptionalField(
                {
                  type: WidgetType.DATA_LIST,
                },
                field(
                  z.enum(UserRoleDB),
                  { response: true },
                  {
                    type: WidgetType.BADGE,
                    enumOptions: UserPermissionRoleOptions,
                  },
                ),
              ),
              rolesModerate: responseArrayOptionalField(
                {
                  type: WidgetType.DATA_LIST,
                },
                field(
                  z.enum(UserRoleDB),
                  { response: true },
                  {
                    type: WidgetType.BADGE,
                    enumOptions: UserPermissionRoleOptions,
                  },
                ),
              ),
              rolesAdmin: responseArrayOptionalField(
                {
                  type: WidgetType.DATA_LIST,
                },
                field(
                  z.enum(UserRoleDB),
                  { response: true },
                  {
                    type: WidgetType.BADGE,
                    enumOptions: UserPermissionRoleOptions,
                  },
                ),
              ),
              createdAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.get.response.folder.createdAt.content" as const,
                },
                z.string().datetime(),
              ),
              updatedAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.get.response.folder.updatedAt.content" as const,
                },
                z.string().datetime(),
              ),
            },
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.folders.id.get.errors.validation.title",
      description:
        "app.api.agent.chat.folders.id.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.folders.id.get.errors.unauthorized.title",
      description:
        "app.api.agent.chat.folders.id.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.folders.id.get.errors.forbidden.title",
      description:
        "app.api.agent.chat.folders.id.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.folders.id.get.errors.notFound.title",
      description:
        "app.api.agent.chat.folders.id.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.folders.id.get.errors.server.title",
      description:
        "app.api.agent.chat.folders.id.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.folders.id.get.errors.network.title",
      description:
        "app.api.agent.chat.folders.id.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.folders.id.get.errors.unknown.title",
      description:
        "app.api.agent.chat.folders.id.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.folders.id.get.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.folders.id.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.folders.id.get.errors.conflict.title",
      description:
        "app.api.agent.chat.folders.id.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.chat.folders.id.get.success.title",
    description: "app.api.agent.chat.folders.id.get.success.description",
  },

  examples: {
    urlPathParams: {
      default: { id: "123e4567-e89b-12d3-a456-426614174000" },
    },
    requests: undefined,
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
  method: Methods.PATCH,
  path: ["agent", "chat", "folders", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.folders.id.patch.title" as const,
  description: "app.api.agent.chat.folders.id.patch.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.folders" as const],
  icon: "folder-pen" as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.folders.id.patch.container.title" as const,
      description:
        "app.api.agent.chat.folders.id.patch.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.folders.id.patch.id.label" as const,
          description:
            "app.api.agent.chat.folders.id.patch.id.description" as const,
        },
        z.uuid(),
      ),

      // === REQUEST DATA ===
      updates: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.folders.id.patch.sections.updates.title" as const,
          description:
            "app.api.agent.chat.folders.id.patch.sections.updates.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { request: "data" },
        {
          name: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.agent.chat.folders.id.patch.name.label" as const,
              description:
                "app.api.agent.chat.folders.id.patch.name.description" as const,
              columns: 12,
            },
            z.string().min(1).max(255).optional(),
          ),
          icon: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.agent.chat.folders.id.patch.icon.label" as const,
              description:
                "app.api.agent.chat.folders.id.patch.icon.description" as const,
              columns: 6,
            },
            // Runtime: accepts any string (emoji, IconKey), Type: IconKey | null | undefined
            iconSchema.nullish(),
          ),
          color: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.agent.chat.folders.id.patch.color.label" as const,
              description:
                "app.api.agent.chat.folders.id.patch.color.description" as const,
              columns: 6,
            },
            z.string().optional(),
          ),
          parentId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.UUID,
              label:
                "app.api.agent.chat.folders.id.patch.parentId.label" as const,
              description:
                "app.api.agent.chat.folders.id.patch.parentId.description" as const,
              columns: 6,
            },
            z.uuid().nullable().optional(),
          ),
          expanded: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.agent.chat.folders.id.patch.expanded.label" as const,
              description:
                "app.api.agent.chat.folders.id.patch.expanded.description" as const,
              columns: 6,
            },
            z.boolean().optional(),
          ),
          sortOrder: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label:
                "app.api.agent.chat.folders.id.patch.sortOrder.label" as const,
              description:
                "app.api.agent.chat.folders.id.patch.sortOrder.description" as const,
              columns: 6,
            },
            z.coerce.number().optional(),
          ),
          rolesView: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.agent.chat.folders.id.patch.rolesView.label" as const,
              description:
                "app.api.agent.chat.folders.id.patch.rolesView.description" as const,
              columns: 6,
              options: UserPermissionRoleOptions,
            },
            z.array(z.enum(UserRoleDB)).nullable().optional(),
          ),
          rolesManage: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.agent.chat.folders.id.patch.rolesManage.label" as const,
              description:
                "app.api.agent.chat.folders.id.patch.rolesManage.description" as const,
              columns: 6,
              options: UserPermissionRoleOptions,
            },
            z.array(z.enum(UserRoleDB)).nullable().optional(),
          ),
          rolesCreateThread: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.agent.chat.folders.id.patch.rolesCreateThread.label" as const,
              description:
                "app.api.agent.chat.folders.id.patch.rolesCreateThread.description" as const,
              columns: 6,
              options: UserPermissionRoleOptions,
            },
            z.array(z.enum(UserRoleDB)).nullable().optional(),
          ),
          rolesPost: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.agent.chat.folders.id.patch.rolesPost.label" as const,
              description:
                "app.api.agent.chat.folders.id.patch.rolesPost.description" as const,
              columns: 6,
              options: UserPermissionRoleOptions,
            },
            z.array(z.enum(UserRoleDB)).nullable().optional(),
          ),
          rolesModerate: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.agent.chat.folders.id.patch.rolesModerate.label" as const,
              description:
                "app.api.agent.chat.folders.id.patch.rolesModerate.description" as const,
              columns: 6,
              options: UserPermissionRoleOptions,
            },
            z.array(z.enum(UserRoleDB)).nullable().optional(),
          ),
          rolesAdmin: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label:
                "app.api.agent.chat.folders.id.patch.rolesAdmin.label" as const,
              description:
                "app.api.agent.chat.folders.id.patch.rolesAdmin.description" as const,
              columns: 6,
              options: UserPermissionRoleOptions,
            },
            z.array(z.enum(UserRoleDB)).nullable().optional(),
          ),
        },
      ),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.folders.id.patch.response.title" as const,
          description:
            "app.api.agent.chat.folders.id.patch.response.description" as const,
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          folder: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.agent.chat.folders.id.patch.response.folder.title" as const,
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              id: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.patch.response.folder.id.content" as const,
                },
                z.uuid(),
              ),
              userId: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.patch.response.folder.userId.content" as const,
                },
                z.uuid().nullable(),
              ),
              name: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.patch.response.folder.name.content" as const,
                },
                z.string(),
              ),
              icon: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.patch.response.folder.icon.content" as const,
                },
                // Runtime: accepts any string (emoji, IconKey), Type: IconKey | null
                iconSchema.nullable(),
              ),
              color: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.patch.response.folder.color.content" as const,
                },
                z.string().nullable(),
              ),
              parentId: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.patch.response.folder.parentId.content" as const,
                },
                z.uuid().nullable(),
              ),
              expanded: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.patch.response.folder.expanded.content" as const,
                },
                z.boolean(),
              ),
              sortOrder: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.patch.response.folder.sortOrder.content" as const,
                },
                z.coerce.number(),
              ),
              rolesView: responseArrayOptionalField(
                {
                  type: WidgetType.DATA_LIST,
                },
                field(
                  z.enum(UserRoleDB),
                  { response: true },
                  {
                    type: WidgetType.BADGE,
                    enumOptions: UserPermissionRoleOptions,
                  },
                ),
              ),
              rolesManage: responseArrayOptionalField(
                {
                  type: WidgetType.DATA_LIST,
                },
                field(
                  z.enum(UserRoleDB),
                  { response: true },
                  {
                    type: WidgetType.BADGE,
                    enumOptions: UserPermissionRoleOptions,
                  },
                ),
              ),
              rolesCreateThread: responseArrayOptionalField(
                {
                  type: WidgetType.DATA_LIST,
                },
                field(
                  z.enum(UserRoleDB),
                  { response: true },
                  {
                    type: WidgetType.BADGE,
                    enumOptions: UserPermissionRoleOptions,
                  },
                ),
              ),
              rolesPost: responseArrayOptionalField(
                {
                  type: WidgetType.DATA_LIST,
                },
                field(
                  z.enum(UserRoleDB),
                  { response: true },
                  {
                    type: WidgetType.BADGE,
                    enumOptions: UserPermissionRoleOptions,
                  },
                ),
              ),
              rolesModerate: responseArrayOptionalField(
                {
                  type: WidgetType.DATA_LIST,
                },
                field(
                  z.enum(UserRoleDB),
                  { response: true },
                  {
                    type: WidgetType.BADGE,
                    enumOptions: UserPermissionRoleOptions,
                  },
                ),
              ),
              rolesAdmin: responseArrayOptionalField(
                {
                  type: WidgetType.DATA_LIST,
                },
                field(
                  z.enum(UserRoleDB),
                  { response: true },
                  {
                    type: WidgetType.BADGE,
                    enumOptions: UserPermissionRoleOptions,
                  },
                ),
              ),
              createdAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.patch.response.folder.createdAt.content" as const,
                },
                z.string().datetime(),
              ),
              updatedAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.agent.chat.folders.id.patch.response.folder.updatedAt.content" as const,
                },
                z.string().datetime(),
              ),
            },
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.folders.id.patch.errors.validation.title",
      description:
        "app.api.agent.chat.folders.id.patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.folders.id.patch.errors.unauthorized.title",
      description:
        "app.api.agent.chat.folders.id.patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.folders.id.patch.errors.forbidden.title",
      description:
        "app.api.agent.chat.folders.id.patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.folders.id.patch.errors.notFound.title",
      description:
        "app.api.agent.chat.folders.id.patch.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.folders.id.patch.errors.server.title",
      description:
        "app.api.agent.chat.folders.id.patch.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.folders.id.patch.errors.network.title",
      description:
        "app.api.agent.chat.folders.id.patch.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.folders.id.patch.errors.unknown.title",
      description:
        "app.api.agent.chat.folders.id.patch.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.folders.id.patch.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.folders.id.patch.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.folders.id.patch.errors.conflict.title",
      description:
        "app.api.agent.chat.folders.id.patch.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.chat.folders.id.patch.success.title",
    description: "app.api.agent.chat.folders.id.patch.success.description",
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
  method: Methods.DELETE,
  path: ["agent", "chat", "folders", "[id]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.folders.id.delete.title" as const,
  description: "app.api.agent.chat.folders.id.delete.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.folders" as const],
  icon: "folder-x" as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.folders.id.delete.container.title" as const,
      description:
        "app.api.agent.chat.folders.id.delete.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.folders.id.delete.id.label" as const,
          description:
            "app.api.agent.chat.folders.id.delete.id.description" as const,
        },
        z.uuid(),
      ),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.folders.id.delete.response.title" as const,
          description:
            "app.api.agent.chat.folders.id.delete.response.description" as const,
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.id.delete.response.success.content" as const,
            },
            z.boolean(),
          ),
          deletedFolderId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.id.delete.response.deletedFolderId.content" as const,
            },
            z.uuid(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.folders.id.delete.errors.validation.title",
      description:
        "app.api.agent.chat.folders.id.delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.folders.id.delete.errors.unauthorized.title",
      description:
        "app.api.agent.chat.folders.id.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.folders.id.delete.errors.forbidden.title",
      description:
        "app.api.agent.chat.folders.id.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.folders.id.delete.errors.notFound.title",
      description:
        "app.api.agent.chat.folders.id.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.folders.id.delete.errors.server.title",
      description:
        "app.api.agent.chat.folders.id.delete.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.folders.id.delete.errors.network.title",
      description:
        "app.api.agent.chat.folders.id.delete.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.folders.id.delete.errors.unknown.title",
      description:
        "app.api.agent.chat.folders.id.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.folders.id.delete.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.folders.id.delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.folders.id.delete.errors.conflict.title",
      description:
        "app.api.agent.chat.folders.id.delete.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.chat.folders.id.delete.success.title",
    description: "app.api.agent.chat.folders.id.delete.success.description",
  },

  examples: {
    urlPathParams: {
      default: { id: "123e4567-e89b-12d3-a456-426614174000" },
    },
    requests: undefined,
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
