/**
 * Folder Contents API Definition
 * Unified endpoint that returns both folders and threads for a given folder level,
 * sorted by sort_order so items can be interleaved.
 */

import { lazy } from "react";
import { z } from "zod";

import {
  dateSchema,
  iconSchema,
} from "@/app/api/[locale]/shared/types/common.schema";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseArrayField,
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
import type { EmitEventNamed } from "@/app/api/[locale]/system/unified-interface/websocket/structured-events";
import {
  UserPermissionRoleOptions,
  UserRole,
  UserRoleDB,
} from "@/app/api/[locale]/user/user-roles/enum";

import { DefaultFolderId } from "../../config";
import {
  ThreadStatusDB,
  ThreadStatusOptions,
  ThreadStreamingStateDB,
} from "../../enum";
import { scopedTranslation } from "./i18n";

const FolderContentsWidget = lazy(() =>
  import("./widget").then((m) => ({ default: m.FolderContentsWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "folder-contents", "[rootFolderId]"],
  aliases: ["folder-contents", "get-folder"] as const,
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,

  tags: ["tags.folderContents" as const],
  icon: "folder" as const,
  category: "ai",
  subCategory: "chatOrganization",

  fields: customWidgetObject({
    render: FolderContentsWidget,
    noFormElement: true,
    usage: { response: true, request: "data&urlPathParams" } as const,
    children: {
      // === REQUEST URL PATH PARAMS ===
      rootFolderId: requestUrlPathParamsField(scopedTranslation, {
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
            value: DefaultFolderId.BACKGROUND,
            label: "config.folders.background" as const,
          },
          {
            value: DefaultFolderId.INCOGNITO,
            label: "config.folders.incognito" as const,
          },
          {
            value: DefaultFolderId.REMOTE,
            label: "config.folders.remote" as const,
          },
        ],
        schema: z.enum([
          DefaultFolderId.PRIVATE,
          DefaultFolderId.SHARED,
          DefaultFolderId.PUBLIC,
          DefaultFolderId.BACKGROUND,
          DefaultFolderId.INCOGNITO,
          DefaultFolderId.REMOTE,
        ]),
      }),

      // === REQUEST BODY PARAMS ===
      subFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.subFolderId.label" as const,
        description: "get.subFolderId.description" as const,
        columns: 12,
        schema: z.string().uuid().nullish(),
        includeInCacheKey: true,
      }),
      threadIds: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.threadIds.label" as const,
        description: "get.threadIds.description" as const,
        columns: 12,
        schema: z.array(z.string().uuid()).nullish(),
        includeInCacheKey: true,
      }),

      // === RESPONSE ===
      // Root folder permissions
      rootFolderPermissions: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.rootFolderPermissions.title" as const,
        description: "get.response.rootFolderPermissions.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { response: true },
        children: {
          canCreateThread: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content:
              "get.response.rootFolderPermissions.canCreateThread.content" as const,
            schema: z.boolean(),
          }),
          canCreateFolder: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content:
              "get.response.rootFolderPermissions.canCreateFolder.content" as const,
            schema: z.boolean(),
          }),
        },
      }),

      // Unified items array - each item is either a folder or a thread
      items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 2,
          usage: { response: true },
          children: {
            // Discriminator
            type: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.type.content" as const,
              schema: z.enum(["folder", "thread"]),
            }),
            sortOrder: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.sortOrder.content" as const,
              schema: z.coerce.number(),
            }),

            // === Shared fields ===
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.id.content" as const,
              schema: z.uuid(),
            }),
            userId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.userId.content" as const,
              schema: z.uuid().nullable(),
            }),
            rootFolderId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.rootFolderId.content" as const,
              schema: z.enum(DefaultFolderId),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.createdAt.content" as const,
              schema: dateSchema,
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.updatedAt.content" as const,
              schema: dateSchema,
            }),

            // === Folder-only fields (nullable for thread items) ===
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.name.content" as const,
              schema: z.string().nullable(),
            }),
            icon: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.icon.content" as const,
              schema: iconSchema.nullable(),
            }),
            color: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.color.content" as const,
              schema: z.string().nullable(),
            }),
            parentId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.parentId.content" as const,
              schema: z.uuid().nullable(),
            }),
            expanded: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.expanded.content" as const,
              schema: z.boolean().nullable(),
            }),
            canManage: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.canManage.content" as const,
              schema: z.boolean().nullable(),
            }),
            canCreateThread: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.items.item.canCreateThread.content" as const,
              schema: z.boolean().nullable(),
            }),
            canModerate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.canModerate.content" as const,
              schema: z.boolean().nullable(),
            }),
            canDelete: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.canDelete.content" as const,
              schema: z.boolean().nullable(),
            }),
            canManagePermissions: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.items.item.canManagePermissions.content" as const,
              schema: z.boolean().nullable(),
            }),
            // Folder role arrays (nullable for thread items)
            rolesView: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            }),
            rolesManage: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            }),
            rolesCreateThread: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            }),
            rolesPost: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            }),
            rolesModerate: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            }),
            rolesAdmin: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                enumOptions: UserPermissionRoleOptions,
                schema: z.enum(UserRoleDB),
              }),
            }),

            // === Thread-only fields (nullable for folder items) ===
            title: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.title.content" as const,
              schema: z.string().nullable(),
            }),
            folderId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.folderId.content" as const,
              schema: z.uuid().nullable(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.items.item.status.content" as const,
              enumOptions: ThreadStatusOptions,
              schema: z.enum(ThreadStatusDB).nullable(),
            }),
            preview: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.preview.content" as const,
              schema: z.string().nullable(),
            }),
            pinned: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.pinned.content" as const,
              schema: z.boolean().nullable(),
            }),
            archived: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.archived.content" as const,
              schema: z.boolean().nullable(),
            }),
            canEdit: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.canEdit.content" as const,
              schema: z.boolean().nullable(),
            }),
            canPost: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.canPost.content" as const,
              schema: z.boolean().nullable(),
            }),
            streamingState: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.items.item.streamingState.content" as const,
              schema: z.enum(ThreadStreamingStateDB),
            }),
            // Share link fields (only populated for SHARED folder threads)
            activeShareCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.items.item.activeShareCount.content" as const,
              schema: z.number().nullable(),
            }),
            lastSharedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.items.item.lastSharedAt.content" as const,
              schema: dateSchema.nullable(),
            }),
            // Thread role arrays (nullable for folder items)
            rolesEdit: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                schema: z.enum(UserRoleDB),
              }),
            }),
          },
        }),
      }),

      backButton: backButton(scopedTranslation, {
        label: "get.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data&urlPathParams" },
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
        threadIds: null,
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

  events: {
    // Framework merges the partial into the items array by id (upsert).
    // Emitted by messages/emitter.ts for thread-scoped events that affect the sidebar.
    "thread-title-updated": {
      remoteEvent: true as const,
      syncDomain: "threads" as const,
      responseFields: { items: ["id", "title"] as const },
      urlPathParamsFields: ["rootFolderId"] as const,
      operation: "merge" as const,
      onEvent: async (ctx) => {
        const rootFolderId = ctx.urlPathParams.rootFolderId;
        if (rootFolderId !== DefaultFolderId.INCOGNITO) {
          return;
        }
        const { updateIncognitoThread } =
          await import("@/app/api/[locale]/agent/chat/incognito/storage");
        for (const item of ctx.responseData.items ?? []) {
          if (item?.id) {
            await updateIncognitoThread(item.id, {
              title: item.title ?? undefined,
            });
          }
        }
      },
    },
    "streaming-state-changed": {
      responseFields: { items: ["id", "streamingState"] as const },
      operation: "merge" as const,
      onEvent: async (ctx) => {
        const rootFolderId = ctx.urlPathParams.rootFolderId;
        if (rootFolderId !== DefaultFolderId.INCOGNITO) {
          return;
        }
        const { updateIncognitoThread } =
          await import("@/app/api/[locale]/agent/chat/incognito/storage");
        for (const item of ctx.responseData.items ?? []) {
          if (item?.id) {
            await updateIncognitoThread(item.id, {
              streamingState: item.streamingState,
            });
          }
        }
      },
    },
    "stream-finished": {
      responseFields: {
        items: ["id", "streamingState", "preview", "updatedAt"] as const,
      },
      operation: "merge" as const,
      onEvent: async (ctx) => {
        const rootFolderId = ctx.urlPathParams.rootFolderId;
        if (rootFolderId !== DefaultFolderId.INCOGNITO) {
          return;
        }
        const { updateIncognitoThread } =
          await import("@/app/api/[locale]/agent/chat/incognito/storage");
        for (const item of ctx.responseData.items ?? []) {
          if (item?.id) {
            await updateIncognitoThread(item.id, {
              streamingState: item.streamingState,
              preview: item.preview,
              updatedAt: item.updatedAt,
            });
          }
        }
      },
    },
    // Thread CRUD - emitted by threads/[threadId]/repository.ts
    "thread-updated": {
      responseFields: {
        items: [
          "id",
          "title",
          "folderId",
          "status",
          "preview",
          "rootFolderId",
          "updatedAt",
        ] as const,
      },
      operation: "merge" as const,
      onEvent: async (ctx) => {
        const rootFolderId = ctx.urlPathParams.rootFolderId;
        if (rootFolderId !== DefaultFolderId.INCOGNITO) {
          return;
        }
        const { updateIncognitoThread } =
          await import("@/app/api/[locale]/agent/chat/incognito/storage");
        for (const item of ctx.responseData.items ?? []) {
          if (item?.id) {
            await updateIncognitoThread(item.id, {
              title: item.title ?? undefined,
              folderId: item.folderId,
              preview: item.preview,
            });
          }
        }
      },
    },
    "thread-deleted": {
      responseFields: { items: ["id"] as const },
      operation: "remove" as const,
      onEvent: async (ctx) => {
        const rootFolderId = ctx.urlPathParams.rootFolderId;
        if (rootFolderId !== DefaultFolderId.INCOGNITO) {
          return;
        }
        const { deleteThread } =
          await import("@/app/api/[locale]/agent/chat/incognito/storage");
        for (const item of ctx.responseData.items ?? []) {
          if (item?.id) {
            await deleteThread(item.id);
          }
        }
      },
    },
    // Thread created - emitted by initial-events-handler when a new thread is created
    // during streaming. Ensures the sidebar shows the thread even if the optimistic
    // client-side update missed the cache (e.g. cache was empty, or another tab).
    "thread-created": {
      responseFields: {
        items: [
          "id",
          "type",
          "title",
          "rootFolderId",
          "folderId",
          "status",
          "streamingState",
          "createdAt",
          "updatedAt",
        ] as const,
      },
      operation: "merge" as const,
      onEvent(ctx) {
        // The merge operation (above) runs before onEvent and appends new items
        // into ALL folder-contents caches for this rootFolderId, regardless of
        // subFolderId. Remove threads that don't belong in this cache level.
        const items = ctx.responseData.items;
        if (!items) {
          return;
        }
        const subFolderId = ctx.requestData.subFolderId ?? null;
        const wrongIds = new Set<string>();
        for (const item of items) {
          if (!item) {
            continue;
          }
          const normalizedItemFolder = item.folderId ?? null;
          if (normalizedItemFolder !== subFolderId) {
            wrongIds.add(item.id);
          }
        }
        if (wrongIds.size === 0) {
          return;
        }
        apiClient.updateEndpointData(
          // GET is referenced here after module init — safe at runtime, TS ok
          GET,
          ctx.logger,
          (old) => {
            if (!old?.success || !Array.isArray(old.data?.items)) {
              return old;
            }
            const filtered = old.data.items.filter(
              (it) => !wrongIds.has(it.id),
            );
            if (filtered.length === old.data.items.length) {
              return old;
            }
            return { ...old, data: { ...old.data, items: filtered } };
          },
          {
            urlPathParams: ctx.urlPathParams,
            requestData: {
              subFolderId: ctx.requestData.subFolderId,
              threadIds: ctx.requestData.threadIds,
            },
          },
        );
      },
    },
    // Folder CRUD - emitted by folders/subfolders/[subFolderId]/repository.ts
    "folder-created": {
      responseFields: {
        items: [
          "id",
          "type",
          "sortOrder",
          "name",
          "icon",
          "color",
          "parentId",
        ] as const,
      },
      operation: "merge" as const,
      onEvent(ctx) {
        const items = ctx.responseData.items;
        if (!items || items.length === 0) {
          return;
        }
        const subFolderId = ctx.requestData.subFolderId ?? null;
        const wrongIds = new Set<string>();
        for (const item of items) {
          if (!item) {
            continue;
          }
          const normalizedParent = item.parentId ?? null;
          if (normalizedParent !== subFolderId) {
            wrongIds.add(item.id);
          }
        }
        if (wrongIds.size === 0) {
          return;
        }
        apiClient.updateEndpointData(
          GET,
          ctx.logger,
          (old) => {
            if (!old?.success || !Array.isArray(old.data?.items)) {
              return old;
            }
            const filtered = old.data.items.filter(
              (it) => !wrongIds.has(it.id),
            );
            if (filtered.length === old.data.items.length) {
              return old;
            }
            return { ...old, data: { ...old.data, items: filtered } };
          },
          {
            urlPathParams: ctx.urlPathParams,
            requestData: {
              subFolderId: ctx.requestData.subFolderId,
              threadIds: ctx.requestData.threadIds,
            },
          },
        );
      },
    },
    "folder-updated": {
      responseFields: {
        items: [
          "id",
          "name",
          "icon",
          "color",
          "sortOrder",
          "updatedAt",
        ] as const,
      },
      operation: "merge" as const,
      onEvent: async (ctx) => {
        if (ctx.urlPathParams.rootFolderId !== DefaultFolderId.INCOGNITO) {
          return;
        }
        const { updateIncognitoFolder } =
          await import("@/app/api/[locale]/agent/chat/incognito/storage");
        for (const item of ctx.responseData.items ?? []) {
          if (item?.id) {
            await updateIncognitoFolder(item.id, {
              name: item.name ?? undefined,
              icon: item.icon ?? undefined,
              color: item.color ?? undefined,
              sortOrder: item.sortOrder,
            });
          }
        }
      },
    },
    "folder-deleted": {
      responseFields: { items: ["id"] as const },
      operation: "remove" as const,
      onEvent: async (ctx) => {
        if (ctx.urlPathParams.rootFolderId !== DefaultFolderId.INCOGNITO) {
          return;
        }
        const { deleteFolder } =
          await import("@/app/api/[locale]/agent/chat/incognito/storage");
        for (const item of ctx.responseData.items ?? []) {
          if (item?.id) {
            await deleteFolder(item.id);
          }
        }
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

/** Typed emit callback for the folder-contents GET channel. */
export type FolderContentsGetWsEmit = EmitEventNamed<
  (typeof GET)["types"]["EventResponsePayloads"],
  (typeof GET)["types"]["EventRequestPayloads"],
  (typeof GET)["types"]["EventEmitUrlPayloads"],
  (typeof GET)["types"]["EventPayloadTypes"]
>;

const definitions = { GET } as const;
export default definitions;
