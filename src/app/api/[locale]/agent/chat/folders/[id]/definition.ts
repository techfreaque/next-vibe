import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  responseArrayOptionalField,
  scopedObjectFieldNew,
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
import { UserRole, UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema, iconSchema } from "../../../../shared/types/common.schema";
import { DefaultFolderId } from "../../config";
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
  category: "app.endpointCategories.chat",
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
        { type: WidgetType.CONTAINER },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesManage: responseArrayOptionalField(
        { type: WidgetType.CONTAINER },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesCreateThread: responseArrayOptionalField(
        { type: WidgetType.CONTAINER },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesPost: responseArrayOptionalField(
        { type: WidgetType.CONTAINER },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesModerate: responseArrayOptionalField(
        { type: WidgetType.CONTAINER },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesAdmin: responseArrayOptionalField(
        { type: WidgetType.CONTAINER },
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
  category: "app.endpointCategories.chat",
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
      userId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.userId.content" as const,
        schema: z.uuid().nullable(),
      }),
      name: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.name.content" as const,
        schema: z.string(),
      }),
      icon: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.icon.content" as const,
        schema: iconSchema.nullable(),
      }),
      color: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.color.content" as const,
        schema: z.string().nullable(),
      }),
      parentId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.parentId.content" as const,
        schema: z.uuid().nullable(),
      }),
      rootFolderId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.rootFolderId.content" as const,
        schema: z.enum(Object.values(DefaultFolderId)),
      }),
      createdAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.createdAt.content" as const,
        schema: dateSchema,
      }),
      updatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.updatedAt.content" as const,
        schema: dateSchema,
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
        userId: "660e8400-e29b-41d4-a716-446655440000",
        name: "Work Projects",
        icon: "folder",
        color: "#3b82f6",
        parentId: null,
        rootFolderId: DefaultFolderId.PRIVATE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

export type FolderDeleteRequestInput = typeof DELETE.types.RequestInput;
export type FolderDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type FolderDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type FolderDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
export type FolderDeleteUrlParamsTypeOutput =
  typeof DELETE.types.UrlVariablesOutput;

const definitions = { GET, DELETE } as const;
export default definitions;
