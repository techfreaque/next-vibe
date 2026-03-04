/**
 * Folder Contents API Definition
 * Unified endpoint that returns both folders and threads for a given folder level,
 * sorted by sort_order so items can be interleaved.
 */

import { z } from "zod";

import {
  dateSchema,
  iconSchema,
} from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseArrayOptionalField,
  scopedObjectFieldNew,
  scopedRequestField,
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

import { DefaultFolderId } from "../../config";
import { ThreadStatusDB, ThreadStatusOptions } from "../../enum";
import { scopedTranslation } from "./i18n";
import { FolderContentsWidget } from "./widget";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "folder-contents", "[rootFolderId]"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.REMOTE_SKILL,
  ] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  category: "app.endpointCategories.chat",
  tags: ["tags.folderContents" as const],
  icon: "folder" as const,

  fields: customWidgetObject({
    render: FolderContentsWidget,
    noFormElement: true,
    usage: { response: true, request: "data&urlPathParams" } as const,
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
        schema: z.enum([
          DefaultFolderId.PRIVATE,
          DefaultFolderId.SHARED,
          DefaultFolderId.PUBLIC,
          DefaultFolderId.CRON,
          DefaultFolderId.INCOGNITO,
        ]),
      }),

      // === REQUEST BODY PARAMS ===
      subFolderId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.subFolderId.label" as const,
        description: "get.subFolderId.description" as const,
        columns: 12,
        schema: z.string().uuid().nullish(),
        includeInCacheKey: true,
      }),

      // === RESPONSE ===
      // Root folder permissions
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
            schema: z.boolean(),
          }),
          canCreateFolder: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content:
              "get.response.rootFolderPermissions.canCreateFolder.content" as const,
            schema: z.boolean(),
          }),
        },
      }),

      // Unified items array — each item is either a folder or a thread
      items: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 2,
          usage: { response: true },
          children: {
            // Discriminator
            type: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.type.content" as const,
              schema: z.enum(["folder", "thread"]),
            }),
            sortOrder: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.sortOrder.content" as const,
              schema: z.coerce.number(),
            }),

            // === Shared fields ===
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.id.content" as const,
              schema: z.uuid(),
            }),
            userId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.userId.content" as const,
              schema: z.uuid().nullable(),
            }),
            rootFolderId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.rootFolderId.content" as const,
              schema: z.enum(DefaultFolderId),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.createdAt.content" as const,
              schema: dateSchema,
            }),
            updatedAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.updatedAt.content" as const,
              schema: dateSchema,
            }),

            // === Folder-only fields (nullable for thread items) ===
            name: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.name.content" as const,
              schema: z.string().nullable(),
            }),
            icon: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.icon.content" as const,
              schema: iconSchema.nullable(),
            }),
            color: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.color.content" as const,
              schema: z.string().nullable(),
            }),
            parentId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.parentId.content" as const,
              schema: z.uuid().nullable(),
            }),
            expanded: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.expanded.content" as const,
              schema: z.boolean().nullable(),
            }),
            canManage: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.canManage.content" as const,
              schema: z.boolean().nullable(),
            }),
            canCreateThread: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.items.item.canCreateThread.content" as const,
              schema: z.boolean().nullable(),
            }),
            canModerate: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.canModerate.content" as const,
              schema: z.boolean().nullable(),
            }),
            canDelete: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.canDelete.content" as const,
              schema: z.boolean().nullable(),
            }),
            canManagePermissions: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.items.item.canManagePermissions.content" as const,
              schema: z.boolean().nullable(),
            }),
            // Folder role arrays (nullable for thread items)
            rolesView: responseArrayOptionalField(
              { type: WidgetType.CONTAINER },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesManage: responseArrayOptionalField(
              { type: WidgetType.CONTAINER },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesCreateThread: responseArrayOptionalField(
              { type: WidgetType.CONTAINER },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesPost: responseArrayOptionalField(
              { type: WidgetType.CONTAINER },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesModerate: responseArrayOptionalField(
              { type: WidgetType.CONTAINER },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),
            rolesAdmin: responseArrayOptionalField(
              { type: WidgetType.CONTAINER },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            ),

            // === Thread-only fields (nullable for folder items) ===
            title: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.title.content" as const,
              schema: z.string().nullable(),
            }),
            folderId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.folderId.content" as const,
              schema: z.uuid().nullable(),
            }),
            status: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.items.item.status.content" as const,
              enumOptions: ThreadStatusOptions,
              schema: z.enum(ThreadStatusDB).nullable(),
            }),
            preview: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.preview.content" as const,
              schema: z.string().nullable(),
            }),
            pinned: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.pinned.content" as const,
              schema: z.boolean().nullable(),
            }),
            archived: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.archived.content" as const,
              schema: z.boolean().nullable(),
            }),
            canEdit: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.canEdit.content" as const,
              schema: z.boolean().nullable(),
            }),
            canPost: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.canPost.content" as const,
              schema: z.boolean().nullable(),
            }),
            isStreaming: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.items.item.isStreaming.content" as const,
              schema: z.boolean().nullable(),
            }),
            // Thread role arrays (nullable for folder items)
            rolesEdit: responseArrayOptionalField(
              { type: WidgetType.CONTAINER },
              scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                schema: z.enum(UserRoleDB),
              }),
            ),
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
    requests: {
      default: {
        subFolderId: null,
      },
    },
    responses: {
      default: {
        rootFolderPermissions: {
          canCreateThread: true,
          canCreateFolder: true,
        },
        items: [],
      },
    },
  },
});

export type FolderContentsRequestInput = typeof GET.types.RequestInput;
export type FolderContentsRequestOutput = typeof GET.types.RequestOutput;
export type FolderContentsUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
export type FolderContentsResponseInput = typeof GET.types.ResponseInput;
export type FolderContentsResponseOutput = typeof GET.types.ResponseOutput;

export type FolderContentsItem = FolderContentsResponseOutput["items"][number];

const definitions = { GET } as const;
export default definitions;
