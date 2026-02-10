/**
 * Chat Folders API Definition
 * Defines endpoints for listing and creating folders
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
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
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import {
  UserPermissionRoleOptions,
  UserRole,
  UserRoleDB,
} from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema, iconSchema } from "../../../shared/types/common.schema";
import { DefaultFolderId } from "../config";
import { FoldersListContainer } from "./widget";

/**
 * Get Folders List Endpoint (GET)
 * Retrieves all folders for the current user in hierarchical structure
 *
 * Note: PUBLIC role is allowed for anonymous users to access incognito folders
 * The repository layer filters results based on authentication status
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "folders"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.folders.get.title" as const,
  description: "app.api.agent.chat.folders.get.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.folders" as const],
  icon: "folder" as const,

  fields: customWidgetObject({
    render: FoldersListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FILTERS ===
      rootFolderId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.chat.folders.get.rootFolderId.label" as const,
        description:
          "app.api.agent.chat.folders.get.rootFolderId.description" as const,
        columns: 12,
        options: [
          {
            value: DefaultFolderId.PRIVATE,
            label: "app.api.agent.chat.config.folders.private" as const,
          },
          {
            value: DefaultFolderId.SHARED,
            label: "app.api.agent.chat.config.folders.shared" as const,
          },
          {
            value: DefaultFolderId.PUBLIC,
            label: "app.api.agent.chat.config.folders.public" as const,
          },
        ],
        schema: z
          .enum([
            DefaultFolderId.PRIVATE,
            DefaultFolderId.SHARED,
            DefaultFolderId.PUBLIC,
          ])
          .describe(
            "Root folder to filter folders (incognito not allowed - local-only)",
          ),
      }),

      // === RESPONSE ===
      // Root folder permissions - computed server-side for the requested root folder
      rootFolderPermissions: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.folders.get.response.rootFolderPermissions.title" as const,
          description:
            "app.api.agent.chat.folders.get.response.rootFolderPermissions.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { response: true },
        {
          canCreateThread: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.folders.get.response.rootFolderPermissions.canCreateThread.content" as const,
            schema: z
              .boolean()
              .describe(
                "Whether the current user can create threads in the root folder",
              ),
          }),
          canCreateFolder: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.folders.get.response.rootFolderPermissions.canCreateFolder.content" as const,
            schema: z
              .boolean()
              .describe(
                "Whether the current user can create folders in the root folder",
              ),
          }),
        },
      ),
      folders: responseArrayField(
        {
          type: WidgetType.CONTAINER,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.agent.chat.folders.get.response.folders.folder.title" as const,
            layoutType: LayoutType.GRID,
            columns: 2,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.id.content" as const,
              schema: z.uuid(),
            }),
            userId: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.userId.content" as const,
              schema: z.uuid().nullable(),
            }),
            rootFolderId: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.rootFolderId.content" as const,
              schema: z.enum(DefaultFolderId),
            }),
            name: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.name.content" as const,
              schema: z.string(),
            }),
            icon: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.icon.content" as const,
              // Runtime: accepts any string (emoji, IconKey), Type: IconKey | null
              schema: iconSchema.nullable(),
            }),
            color: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.color.content" as const,
              schema: z.string().nullable(),
            }),
            parentId: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.parentId.content" as const,
              schema: z.uuid().nullable(),
            }),
            expanded: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.expanded.content" as const,
              schema: z.boolean(),
            }),
            sortOrder: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.sortOrder.content" as const,
              schema: z.coerce.number(),
            }),
            rolesView: responseArrayOptionalField(
              {
                type: WidgetType.CONTAINER,
              },
              responseField({
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesManage: responseArrayOptionalField(
              {
                type: WidgetType.CONTAINER,
              },
              responseField({
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesCreateThread: responseArrayOptionalField(
              {
                type: WidgetType.CONTAINER,
              },
              responseField({
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesPost: responseArrayOptionalField(
              {
                type: WidgetType.CONTAINER,
              },
              responseField({
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesModerate: responseArrayOptionalField(
              {
                type: WidgetType.CONTAINER,
              },
              responseField({
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesAdmin: responseArrayOptionalField(
              {
                type: WidgetType.CONTAINER,
              },
              responseField({
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            // Permission flags - computed server-side based on user's roles
            canManage: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.canManage.content" as const,
              schema: z
                .boolean()
                .describe(
                  "Whether the current user can manage (edit/rename) this folder and create subfolders",
                ),
            }),
            canCreateThread: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.canCreateThread.content" as const,
              schema: z
                .boolean()
                .describe(
                  "Whether the current user can create threads in this folder",
                ),
            }),
            canModerate: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.canModerate.content" as const,
              schema: z
                .boolean()
                .describe(
                  "Whether the current user can moderate/hide content in this folder",
                ),
            }),
            canDelete: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.canDelete.content" as const,
              schema: z
                .boolean()
                .describe("Whether the current user can delete this folder"),
            }),
            canManagePermissions: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.canManagePermissions.content" as const,
              schema: z
                .boolean()
                .describe(
                  "Whether the current user can manage permissions for this folder",
                ),
            }),
            createdAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.createdAt.content" as const,
              schema: dateSchema,
            }),
            updatedAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.folders.get.response.folders.folder.updatedAt.content" as const,
              schema: dateSchema,
            }),
          },
        ),
      ),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.folders.get.errors.validation.title",
      description:
        "app.api.agent.chat.folders.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.folders.get.errors.unauthorized.title",
      description:
        "app.api.agent.chat.folders.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.folders.get.errors.forbidden.title",
      description:
        "app.api.agent.chat.folders.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.folders.get.errors.notFound.title",
      description: "app.api.agent.chat.folders.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.folders.get.errors.server.title",
      description: "app.api.agent.chat.folders.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.folders.get.errors.network.title",
      description: "app.api.agent.chat.folders.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.folders.get.errors.unknown.title",
      description: "app.api.agent.chat.folders.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.folders.get.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.folders.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.folders.get.errors.conflict.title",
      description: "app.api.agent.chat.folders.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.chat.folders.get.success.title",
    description: "app.api.agent.chat.folders.get.success.description",
  },

  examples: {
    requests: {
      default: {
        rootFolderId: DefaultFolderId.PRIVATE,
      },
    },
    responses: {
      default: {
        rootFolderPermissions: {
          canCreateThread: true,
          canCreateFolder: true,
        },
        folders: [],
      },
    },
  },
});

/**
 * Create Folder Endpoint (POST)
 * Creates a new folder
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "chat", "folders"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.folders.post.title" as const,
  description: "app.api.agent.chat.folders.post.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.folders" as const],
  icon: "folder-plus" as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.folders.post.container.title" as const,
      description:
        "app.api.agent.chat.folders.post.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === REQUEST ===
      folder: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.folders.post.sections.folder.title" as const,
          description:
            "app.api.agent.chat.folders.post.sections.folder.description" as const,
          layoutType: LayoutType.STACKED,
        },
        { request: "data" },
        {
          rootFolderId: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label:
              "app.api.agent.chat.folders.post.sections.folder.rootFolderId.label" as const,
            description:
              "app.api.agent.chat.folders.post.sections.folder.rootFolderId.description" as const,
            columns: 12,
            options: [
              {
                value: DefaultFolderId.PRIVATE,
                label: "app.api.agent.chat.config.folders.private" as const,
              },
              {
                value: DefaultFolderId.SHARED,
                label: "app.api.agent.chat.config.folders.shared" as const,
              },
              {
                value: DefaultFolderId.PUBLIC,
                label: "app.api.agent.chat.config.folders.public" as const,
              },
              {
                value: DefaultFolderId.INCOGNITO,
                label: "app.api.agent.chat.config.folders.incognito" as const,
              },
            ],
            schema: z.enum(DefaultFolderId),
          }),
          name: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label:
              "app.api.agent.chat.folders.post.sections.folder.name.label" as const,
            description:
              "app.api.agent.chat.folders.post.sections.folder.name.description" as const,
            columns: 12,
            schema: z.string().min(1).max(255),
          }),
          icon: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label:
              "app.api.agent.chat.folders.post.sections.folder.icon.label" as const,
            description:
              "app.api.agent.chat.folders.post.sections.folder.icon.description" as const,
            columns: 6,
            // Runtime: accepts any string (emoji, IconKey), Type: IconKey | undefined
            schema: iconSchema.optional(),
          }),
          color: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label:
              "app.api.agent.chat.folders.post.sections.folder.color.label" as const,
            description:
              "app.api.agent.chat.folders.post.sections.folder.color.description" as const,
            columns: 6,
            schema: z.string().optional(),
          }),
          parentId: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.UUID,
            label:
              "app.api.agent.chat.folders.post.sections.folder.parentId.label" as const,
            description:
              "app.api.agent.chat.folders.post.sections.folder.parentId.description" as const,
            columns: 12,
            schema: z.uuid().optional(),
          }),
        },
      ),

      // === RESPONSE ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.folders.post.response.title" as const,
          description:
            "app.api.agent.chat.folders.post.response.description" as const,
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          folder: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.agent.chat.folders.post.response.folder.title" as const,
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              id: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.id.content" as const,
                schema: z.uuid(),
              }),
              userId: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.userId.content" as const,
                schema: z.uuid(),
              }),
              rootFolderId: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.rootFolderId.content" as const,
                schema: z.enum(DefaultFolderId),
              }),
              name: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.name.content" as const,
                schema: z.string(),
              }),
              icon: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.icon.content" as const,
                // Runtime: accepts any string (emoji, IconKey), Type: IconKey | null
                schema: z.string().nullable() as z.ZodType<IconKey | null>,
              }),
              color: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.color.content" as const,
                schema: z.string().nullable(),
              }),
              parentId: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.parentId.content" as const,
                schema: z.uuid().nullable(),
              }),
              expanded: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.expanded.content" as const,
                schema: z.boolean(),
              }),
              sortOrder: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.sortOrder.content" as const,
                schema: z.coerce.number(),
              }),
              rolesView: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                responseField({
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesManage: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                responseField({
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesCreateThread: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                responseField({
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesPost: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                responseField({
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesModerate: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                responseField({
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              rolesAdmin: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                },
                responseField({
                  type: WidgetType.BADGE,
                  enumOptions: UserPermissionRoleOptions,
                  schema: z.enum(UserRoleDB),
                }),
              ),
              createdAt: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.createdAt.content" as const,
                schema: dateSchema,
              }),
              updatedAt: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.folders.post.response.folder.updatedAt.content" as const,
                schema: dateSchema,
              }),
            },
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.folders.post.errors.validation.title",
      description:
        "app.api.agent.chat.folders.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.folders.post.errors.unauthorized.title",
      description:
        "app.api.agent.chat.folders.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.folders.post.errors.forbidden.title",
      description:
        "app.api.agent.chat.folders.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.folders.post.errors.notFound.title",
      description:
        "app.api.agent.chat.folders.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.folders.post.errors.server.title",
      description: "app.api.agent.chat.folders.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.folders.post.errors.network.title",
      description: "app.api.agent.chat.folders.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.folders.post.errors.unknown.title",
      description: "app.api.agent.chat.folders.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.folders.post.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.folders.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.folders.post.errors.conflict.title",
      description:
        "app.api.agent.chat.folders.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.chat.folders.post.success.title",
    description: "app.api.agent.chat.folders.post.success.description",
  },

  examples: {
    requests: {
      default: {
        folder: {
          rootFolderId: DefaultFolderId.PRIVATE,
          name: "Work",
          icon: "folder",
          color: "#3b82f6",
        },
      },
    },
    responses: {
      default: {
        response: {
          folder: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            userId: "123e4567-e89b-12d3-a456-426614174001",
            rootFolderId: DefaultFolderId.PRIVATE,
            name: "Work",
            icon: "folder",
            color: "#3b82f6",
            parentId: null,
            expanded: true,
            sortOrder: 0,
            rolesView: [],
            rolesManage: [],
            rolesCreateThread: [],
            rolesPost: [],
            rolesModerate: [],
            rolesAdmin: [],
            createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
            updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
          },
        },
      },
    },
  },
});

// Extract types
export type FolderListRequestInput = typeof GET.types.RequestInput;
export type FolderListRequestOutput = typeof GET.types.RequestOutput;
export type FolderListResponseInput = typeof GET.types.ResponseInput;
export type FolderListResponseOutput = typeof GET.types.ResponseOutput;

export type FolderCreateRequestInput = typeof POST.types.RequestInput;
export type FolderCreateRequestOutput = typeof POST.types.RequestOutput;
export type FolderCreateResponseInput = typeof POST.types.ResponseInput;
export type FolderCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { GET, POST } as const;
export default definitions;
