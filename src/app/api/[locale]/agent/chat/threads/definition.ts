/**
 * Chat Threads API Definition
 * Defines endpoints for listing and creating chat threads
 */

import { lazy } from "react";
import { z } from "zod";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
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
import { UserRole, UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema } from "../../../shared/types/common.schema";
import { DefaultFolderId } from "../config";
import {
  ThreadStatus,
  ThreadStatusDB,
  ThreadStatusOptions,
  ThreadStreamingState,
  ThreadStreamingStateDB,
} from "../enum";
import { CHAT_THREADS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const ThreadsListContainer = lazy(() =>
  import("./widget/widget").then((m) => ({ default: m.ThreadsListContainer })),
);

/**
 * Get Threads List Endpoint (GET)
 * Retrieves a paginated list of threads with filtering
 *
 * Note: PUBLIC role is allowed for anonymous users to access incognito threads
 * The repository layer filters results based on authentication status
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads"],
  aliases: [CHAT_THREADS_ALIAS] as const,
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "message-square",
  category: "ai",
  tags: ["tags.threads" as const],

  fields: customWidgetObject({
    render: ThreadsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === PAGINATION ===
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label" as const,
        description: "get.page.description" as const,
        columns: 6,
        schema: z.coerce.number().min(1).optional().default(1),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.limit.label" as const,
        description: "get.limit.description" as const,
        columns: 6,
        schema: z.coerce.number().min(1).max(100).optional().default(20),
      }),

      // === FILTERS ===
      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.rootFolderId.label" as const,
        description: "get.rootFolderId.description" as const,
        columns: 6,
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
        schema: z
          .enum([
            DefaultFolderId.PRIVATE,
            DefaultFolderId.SHARED,
            DefaultFolderId.PUBLIC,
            DefaultFolderId.BACKGROUND,
            DefaultFolderId.INCOGNITO,
            DefaultFolderId.REMOTE,
          ])
          .describe(
            "Root folder to filter threads (incognito routed to route-client.ts via useClientRoute)",
          ),
        includeInCacheKey: true,
      }),
      subFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.subFolderId.label" as const,
        description: "get.subFolderId.description" as const,
        columns: 6,
        schema: z.string().uuid().nullish(),
        includeInCacheKey: true,
      }),
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.status.label" as const,
        description: "get.status.description" as const,
        columns: 6,
        options: ThreadStatusOptions,
        schema: z.enum(ThreadStatusDB).optional(),
      }),
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.search.label" as const,
        description: "get.search.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      isPinned: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.isPinned.label" as const,
        description: "get.isPinned.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      dateFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.dateFrom.label" as const,
        description: "get.dateFrom.description" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),
      dateTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.dateTo.label" as const,
        description: "get.dateTo.description" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),

      // === RESPONSE ===
      threads: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.threads.thread.title" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.threads.thread.id.content" as const,
              schema: z.uuid(),
            }),
            title: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.threads.thread.threadTitle.content" as const,
              schema: z.string(),
            }),
            rootFolderId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.threads.thread.rootFolderId.content" as const,
              schema: z.enum(DefaultFolderId),
            }),
            folderId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.threads.thread.folderId.content" as const,
              schema: z.uuid().nullable(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.threads.thread.status.content" as const,
              schema: z.enum(ThreadStatusDB),
            }),
            preview: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.threads.thread.preview.content" as const,
              schema: z.string().nullable(),
            }),
            pinned: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.threads.thread.pinned.content" as const,
              schema: z.boolean(),
            }),
            archived: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.threads.thread.archived.content" as const,
              schema: z.boolean(),
            }),
            // Permission roles - nullable arrays (null = inherit, [] = deny, [roles...] = allow)
            rolesView: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                schema: z.enum(UserRoleDB),
              }),
            }),
            rolesEdit: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                schema: z.enum(UserRoleDB),
              }),
            }),
            rolesPost: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                schema: z.enum(UserRoleDB),
              }),
            }),
            rolesModerate: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                schema: z.enum(UserRoleDB),
              }),
            }),
            rolesAdmin: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                schema: z.enum(UserRoleDB),
              }),
            }),
            // Permission flags - computed server-side based on user's roles
            canEdit: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.threads.thread.canEdit.content" as const,
              schema: z
                .boolean()
                .describe(
                  "Whether the current user can edit this thread (title, settings)",
                ),
            }),
            canPost: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.threads.thread.canPost.content" as const,
              schema: z
                .boolean()
                .describe(
                  "Whether the current user can post messages in this thread",
                ),
            }),
            canModerate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.threads.thread.canModerate.content" as const,
              schema: z
                .boolean()
                .describe(
                  "Whether the current user can moderate/hide messages in this thread",
                ),
            }),
            canDelete: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.threads.thread.canDelete.content" as const,
              schema: z
                .boolean()
                .describe("Whether the current user can delete this thread"),
            }),
            canManagePermissions: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.threads.thread.canManagePermissions.content" as const,
              schema: z
                .boolean()
                .describe(
                  "Whether the current user can manage permissions for this thread",
                ),
            }),
            streamingState: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.threads.thread.streamingState.content" as const,
              schema: z.enum(ThreadStreamingStateDB),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.threads.thread.createdAt.content" as const,
              schema: dateSchema,
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.threads.thread.updatedAt.content" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.totalCount.content" as const,
        schema: z.coerce.number(),
      }),
      pageCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.pageCount.content" as const,
        schema: z.coerce.number(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.page.content" as const,
        schema: z.coerce.number(),
      }),
      pageSize: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.limit.content" as const,
        schema: z.coerce.number(),
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

  useClientRoute: ({ data }) => data.rootFolderId === DefaultFolderId.INCOGNITO,

  events: {
    // Framework merges the partial into the threads array by id (upsert).
    // Emitted by messages/emitter.ts for thread-scoped events that affect the sidebar.
    "thread-title-updated": {
      responseFields: { threads: ["id", "title"] as const },
      operation: "merge" as const,
      onEvent: async (ctx) => {
        if (ctx.requestData.rootFolderId !== DefaultFolderId.INCOGNITO) {
          return;
        }
        const item = ctx.responseData.threads?.[0];
        if (!item?.id) {
          return;
        }
        const { updateIncognitoThread } =
          await import("@/app/api/[locale]/agent/chat/incognito/storage");
        await updateIncognitoThread(item.id, { title: item.title });
      },
    },
    "streaming-state-changed": {
      responseFields: { threads: ["id", "streamingState"] as const },
      operation: "merge" as const,
      onEvent: async (ctx) => {
        if (ctx.requestData.rootFolderId !== DefaultFolderId.INCOGNITO) {
          return;
        }
        const item = ctx.responseData.threads?.[0];
        if (!item?.id) {
          return;
        }
        const { updateIncognitoThread } =
          await import("@/app/api/[locale]/agent/chat/incognito/storage");
        await updateIncognitoThread(item.id, {
          streamingState: item.streamingState,
        });
      },
    },
    "stream-finished": {
      responseFields: {
        threads: ["id", "streamingState", "preview", "updatedAt"] as const,
      },
      operation: "merge" as const,
      onEvent: async (ctx) => {
        if (ctx.requestData.rootFolderId !== DefaultFolderId.INCOGNITO) {
          return;
        }
        const item = ctx.responseData.threads?.[0];
        if (!item?.id) {
          return;
        }
        const { updateIncognitoThread } =
          await import("@/app/api/[locale]/agent/chat/incognito/storage");
        await updateIncognitoThread(item.id, {
          streamingState: item.streamingState,
          preview: item.preview,
          updatedAt: item.updatedAt,
        });
      },
    },
    // Emitted by threads/[threadId]/repository.ts on PATCH and DELETE.
  },

  examples: {
    requests: {
      default: {
        page: 1,
        limit: 20,
        rootFolderId: DefaultFolderId.PRIVATE,
      },
    },
    responses: {
      default: {
        threads: [],
        totalCount: 0,
        pageCount: 0,
        currentPage: 1,
        pageSize: 20,
      },
    },
  },
});

/**
 * Create Thread Endpoint (POST)
 * Creates a new chat thread
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "threads"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "message-square-plus" as const,
  category: "ai",
  subCategory: "threadsManagement",
  tags: ["tags.threads" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title" as const,
    description: "post.form.description" as const,
    layoutType: LayoutType.GRID,
    columns: 2,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      id: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.id.label" as const,
        description: "post.id.description" as const,
        columns: 12,
        schema: z.string().uuid().optional(),
      }),
      title: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.threadTitle.label" as const,
        description: "post.threadTitle.description" as const,
        columns: 12,
        schema: z.string().min(1).max(255).optional().default("New Chat"),
      }),
      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.rootFolderId.label" as const,
        description: "post.rootFolderId.description" as const,
        columns: 6,
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
            value: DefaultFolderId.INCOGNITO,
            label: "config.folders.incognito" as const,
          },
        ],
        schema: z
          .enum(DefaultFolderId)
          .refine((val) => val !== DefaultFolderId.INCOGNITO, {
            message: "post.errors.forbidden.incognitoNotAllowed",
          }),
      }),
      subFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.subFolderId.label" as const,
        description: "post.subFolderId.description" as const,
        columns: 6,
        schema: z.string().uuid().nullish(),
      }),
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.defaultModel.label" as const,
        description: "post.defaultModel.description" as const,
        columns: 6,
        schema: z.enum(ChatModelId),
      }),
      character: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.defaultTone.label" as const,
        description: "post.defaultTone.description" as const,
        columns: 6,
        schema: z.string().optional().nullable(),
      }),
      systemPrompt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.systemPrompt.label" as const,
        description: "post.systemPrompt.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      // === RESPONSE ===
      threadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.thread.id.content" as const,
        schema: z.uuid(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.response.thread.status.content" as const,
        schema: z.enum(ThreadStatusDB),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.thread.createdAt.content" as const,
        schema: dateSchema,
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.thread.updatedAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  // This op owns its `thread-created` event. `requestFields` carry the title +
  // rootFolderId the user submitted (the id rides too); the client onEvent inserts
  // a fresh thread into the sidebar list cache; remoteEvent relays the create
  // cross-instance, where the route's onRemoteEvent re-runs createThread.
  events: {
    "thread-created": {
      remoteEvent: true as const,
      syncDomain: "threads" as const,
      operation: "merge" as const,
      allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
      requestFields: ["id", "title", "rootFolderId"] as const,
      onEvent: async ({ requestData, logger }) => {
        const rootFolderId =
          requestData.rootFolderId ?? DefaultFolderId.PRIVATE;
        const threadId = requestData.id;
        const [{ apiClient }, threadsDefinition] = await Promise.all([
          import("@/app/api/[locale]/system/unified-interface/react/hooks/store"),
          import("./definition"),
        ]);
        if (!threadId) {
          return;
        }
        apiClient.updateEndpointData(
          threadsDefinition.default.GET,
          logger,
          (old) => {
            if (!old?.success) {
              return old;
            }
            if (old.data.threads.some((t) => t.id === threadId)) {
              return old;
            }
            type ThreadListItem = (typeof old.data.threads)[number];
            const now = new Date();
            const newThread: ThreadListItem = {
              id: threadId,
              title: requestData.title ?? "",
              rootFolderId,
              folderId: null,
              status: ThreadStatus.ACTIVE,
              preview: null,
              pinned: false,
              archived: false,
              rolesView: [],
              rolesEdit: [],
              rolesPost: [],
              rolesModerate: [],
              rolesAdmin: [],
              canEdit: true,
              canPost: true,
              canModerate: false,
              canDelete: true,
              canManagePermissions: false,
              streamingState: ThreadStreamingState.STREAMING,
              createdAt: now,
              updatedAt: now,
            };
            return {
              success: true,
              data: {
                ...old.data,
                threads: [newThread, ...old.data.threads],
              },
            };
          },
          { requestData: { rootFolderId, subFolderId: null } },
        );
      },
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        id: "880e8400-e29b-41d4-a716-446655440000",
        title: "New Chat",
        rootFolderId: DefaultFolderId.PRIVATE,
        subFolderId: null,
        model: ChatModelId.GPT_5_NANO,
        character: "default",
      },
    },
    responses: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        status: ThreadStatus.ACTIVE,
        createdAt: "2024-01-15T10:00:00.000Z",
        updatedAt: "2024-01-15T10:00:00.000Z",
      },
    },
  },
});

// Extract types
export type ThreadListRequestInput = typeof GET.types.RequestInput;
export type ThreadListRequestOutput = typeof GET.types.RequestOutput;
export type ThreadListResponseInput = typeof GET.types.ResponseInput;
export type ThreadListResponseOutput = typeof GET.types.ResponseOutput;

export type ThreadCreateRequestInput = typeof POST.types.RequestInput;
export type ThreadCreateRequestOutput = typeof POST.types.RequestOutput;
export type ThreadCreateResponseInput = typeof POST.types.ResponseInput;
export type ThreadCreateResponseOutput = typeof POST.types.ResponseOutput;

/** Inferred payload of the `thread-created` event (id + title + rootFolderId). */
export type ThreadCreatedEventPayload =
  (typeof POST.types.EventPayloads)["thread-created"];

const definitions = { GET, POST } as const;
export default definitions;
