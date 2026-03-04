/**
 * Chat Folders API Definition
 * Defines endpoints for listing folders
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseArrayOptionalField,
  scopedObjectFieldNew,
  scopedRequestUrlPathParamsField,
  scopedResponseArrayFieldNew,
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
import { DefaultFolderId } from "../../config";
import { scopedTranslation } from "./i18n";
import { FoldersListContainer } from "./widget/widget";

/**
 * Get Folders List Endpoint (GET)
 * Retrieves all folders for the current user in hierarchical structure
 *
 * Note: PUBLIC role is allowed for anonymous users to access incognito folders
 * The repository layer filters results based on authentication status
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "folders", "[rootFolderId]"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.REMOTE_SKILL,
  ] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  category: "app.endpointCategories.chat",
  tags: ["tags.folders" as const],
  icon: "folder" as const,

  fields: customWidgetObject({
    render: FoldersListContainer,
    noFormElement: true,
    usage: { response: true, request: "urlPathParams" } as const,
    children: {
      // === REQUEST URL PATH PARAMS ===
      rootFolderId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.rootFolderId.label" as const,
        description: "get.rootFolderId.description" as const,
        columns: 12,
        options: [
          {
            value: DefaultFolderId.PRIVATE,
            label: "config.folders.private" as const,
          },
          {
            value: DefaultFolderId.SHARED,
            label: "config.folders.shared" as const,
          },
          {
            value: DefaultFolderId.PUBLIC,
            label: "config.folders.public" as const,
          },
          {
            value: DefaultFolderId.CRON,
            label: "config.folders.cron" as const,
          },
          {
            value: DefaultFolderId.INCOGNITO,
            label: "config.folders.incognito" as const,
          },
        ],
        schema: z
          .enum([
            DefaultFolderId.PRIVATE,
            DefaultFolderId.SHARED,
            DefaultFolderId.PUBLIC,
            DefaultFolderId.CRON,
            DefaultFolderId.INCOGNITO,
          ])
          .describe(
            "Root folder to filter folders (incognito routed to route-client.ts via useClientRoute)",
          ),
      }),

      // === RESPONSE ===
      // Root folder permissions - computed server-side for the requested root folder
      rootFolderPermissions: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.rootFolderPermissions.title" as const,
        description: "get.response.rootFolderPermissions.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { response: true },
        children: {
          canCreateThread: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content:
              "get.response.rootFolderPermissions.canCreateThread.content" as const,
            schema: z
              .boolean()
              .describe(
                "Whether the current user can create threads in the root folder",
              ),
          }),
          canCreateFolder: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content:
              "get.response.rootFolderPermissions.canCreateFolder.content" as const,
            schema: z
              .boolean()
              .describe(
                "Whether the current user can create folders in the root folder",
              ),
          }),
        },
      }),
      folders: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.folders.folder.id.content" as const,
              schema: z.uuid(),
            }),
            userId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.folders.folder.userId.content" as const,
              schema: z.uuid().nullable(),
            }),
            rootFolderId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.folders.folder.rootFolderId.content" as const,
              schema: z.enum(DefaultFolderId),
            }),
            name: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.folders.folder.name.content" as const,
              schema: z.string(),
            }),
            icon: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.folders.folder.icon.content" as const,
              // Runtime: accepts any string (emoji, IconKey), Type: IconKey | null
              schema: iconSchema.nullable(),
            }),
            color: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.folders.folder.color.content" as const,
              schema: z.string().nullable(),
            }),
            parentId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.folders.folder.parentId.content" as const,
              schema: z.uuid().nullable(),
            }),
            expanded: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.folders.folder.expanded.content" as const,
              schema: z.boolean(),
            }),
            sortOrder: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.folders.folder.sortOrder.content" as const,
              schema: z.coerce.number(),
            }),
            rolesView: responseArrayOptionalField(
              {
                type: WidgetType.CONTAINER,
              },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesManage: responseArrayOptionalField(
              {
                type: WidgetType.CONTAINER,
              },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesCreateThread: responseArrayOptionalField(
              {
                type: WidgetType.CONTAINER,
              },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesPost: responseArrayOptionalField(
              {
                type: WidgetType.CONTAINER,
              },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesModerate: responseArrayOptionalField(
              {
                type: WidgetType.CONTAINER,
              },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesAdmin: responseArrayOptionalField(
              {
                type: WidgetType.CONTAINER,
              },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            // Permission flags - computed server-side based on user's roles
            canManage: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.folders.folder.canManage.content" as const,
              schema: z
                .boolean()
                .describe(
                  "Whether the current user can manage (edit/rename) this folder and create subfolders",
                ),
            }),
            canCreateThread: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.folders.folder.canCreateThread.content" as const,
              schema: z
                .boolean()
                .describe(
                  "Whether the current user can create threads in this folder",
                ),
            }),
            canModerate: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.folders.folder.canModerate.content" as const,
              schema: z
                .boolean()
                .describe(
                  "Whether the current user can moderate/hide content in this folder",
                ),
            }),
            canDelete: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.folders.folder.canDelete.content" as const,
              schema: z
                .boolean()
                .describe("Whether the current user can delete this folder"),
            }),
            canManagePermissions: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.folders.folder.canManagePermissions.content" as const,
              schema: z
                .boolean()
                .describe(
                  "Whether the current user can manage permissions for this folder",
                ),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.folders.folder.createdAt.content" as const,
              schema: dateSchema,
            }),
            updatedAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.folders.folder.updatedAt.content" as const,
              schema: dateSchema,
            }),
          },
        }),
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

  useClientRoute: ({ urlPathParams }) =>
    urlPathParams.rootFolderId === DefaultFolderId.INCOGNITO,

  examples: {
    urlPathParams: {
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
export type FolderListUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;
export type FolderListResponseInput = typeof GET.types.ResponseInput;
export type FolderListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
