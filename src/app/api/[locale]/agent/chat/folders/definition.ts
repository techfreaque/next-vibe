/**
 * Chat Folders API Definition
 * Defines endpoints for listing folders
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
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.REMOTE_SKILL,
  ] as const,

  title: "app.api.agent.chat.folders.get.title" as const,
  description: "app.api.agent.chat.folders.get.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.folders" as const],
  icon: "folder" as const,

  fields: customWidgetObject({
    render: FoldersListContainer,
    usage: { response: true, request: "data" } as const,
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
          {
            value: DefaultFolderId.CRON,
            label: "app.chat.common.cronChats" as const,
          },
        ],
        schema: z
          .enum([
            DefaultFolderId.PRIVATE,
            DefaultFolderId.SHARED,
            DefaultFolderId.PUBLIC,
            DefaultFolderId.CRON,
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

// Extract types
export type FolderListRequestInput = typeof GET.types.RequestInput;
export type FolderListRequestOutput = typeof GET.types.RequestOutput;
export type FolderListResponseInput = typeof GET.types.ResponseInput;
export type FolderListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
