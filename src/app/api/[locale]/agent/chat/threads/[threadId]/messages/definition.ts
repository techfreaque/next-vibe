/**
 * Chat Messages API Definition
 * Defines endpoints for listing and creating messages in a thread
 */

import { getCurrentUrl, silentReplaceState } from "next-vibe-ui/lib/location";
import { lazy } from "react";
import { z } from "zod";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { DefaultFolderId, rootFolderIdOptions } from "../../../config";
import type { MessageMetadata } from "../../../db";
import {
  ChatMessageRole,
  ThreadStreamingState,
  ThreadStreamingStateDB,
} from "../../../enum";
import {
  finishIncognitoThreadIfIncognito,
  onEventPersistMessage,
  persistMessageIfIncognito,
} from "../../../incognito/event-persist";
import { THREAD_MESSAGES_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const MessagesWidget = lazy(() =>
  import("./widget/widget").then((m) => ({ default: m.MessagesWidget })),
);

/**
 * Get Messages List Endpoint (GET)
 * Retrieves all messages in a thread
 *
 * Note: PUBLIC role is allowed for anonymous users to view public threads
 * The repository layer filters results based on thread permissions
 */

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]", "messages"],
  aliases: [THREAD_MESSAGES_ALIAS] as const,
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "message-circle",
  category: "ai",
  subCategory: "messagesModerating",
  tags: ["tags.messages" as const],

  // The message stream rides the owner's user channel for private threads and a
  // shared channel for PUBLIC/SHARED ones — decided per thread by the route's
  // resolveChannel (the same folder-trust the messages emitter uses).
  channel: { scope: "resolved" } as const,

  events: {
    // ── message-created ──────────────────────────────────────────────────────
    // Framework merges the new message (upsert by id) and sets streamingState.
    // onEvent: clear input store on confirmed user message; remove optimistic
    // assistant placeholder when real server message arrives (same parentId).
    // Also: persist the confirmed message to localStorage for incognito.
    "message-created": {
      remoteEvent: true,
      syncDomain: "threads" as const,
      responseFields: {
        messages: [
          "id",
          "threadId",
          "role",
          "isAI",
          "content",
          "parentId",
          "sequenceId",
          "model",
          "skill",
          "metadata",
          "createdAt",
          "updatedAt",
          "authorId",
          "authorName",
          "errorType",
          "errorCode",
          "errorMessage",
          "upvotes",
          "downvotes",
          "searchVector",
        ],
        streamingState: true,
      } as const,
      urlPathParamsFields: ["threadId"] as const,
      operation: "merge" as const,
      onEvent: async (ctx) => {
        const {
          responseData,
          urlPathParams: { threadId },
          logger,
        } = ctx;
        const arrived = responseData.messages?.[0];
        if (!arrived) {
          return;
        }
        if (arrived.role === ChatMessageRole.USER) {
          const { useChatInputStore } =
            await import("@/app/api/[locale]/agent/ai-stream/stream/hooks/input-store");
          useChatInputStore.getState().reset();
          // When a queued user message is dequeued and re-confirmed, the optimistic
          // assistant placeholder that was added when the message was first sent
          // (parentId = arrived.id) must be removed - the real stream will add its
          // own assistant message shortly. Without this removal the placeholder
          // stays in the cache, the leafMessageId points to it, and after
          // stream-finished removes it the leaf goes stale.
          if (
            arrived.metadata &&
            typeof arrived.metadata === "object" &&
            arrived.metadata.isQueued === true
          ) {
            const msgId = arrived.id;
            if (msgId) {
              const { removeOptimisticByParentId } =
                await import("./hooks/update-messages");
              removeOptimisticByParentId(threadId, msgId, logger);
            }
          }
        } else if (
          arrived.role === ChatMessageRole.ASSISTANT ||
          arrived.role === ChatMessageRole.TOOL
        ) {
          // Real assistant/tool message arrived - remove optimistic placeholder(s)
          // with matching parentId. Done SYNCHRONOUSLY via queryClient to avoid
          // a render frame showing a spurious branch (the async dynamic import
          // previously caused a timing gap where both optimistic + real coexisted).
          // Error role messages are excluded - they are not replacements for
          // optimistic placeholders and must not remove them.
          const newParentId = arrived.parentId;
          if (newParentId) {
            const { removeOptimisticByParentId } =
              await import("./hooks/update-messages");
            removeOptimisticByParentId(threadId, newParentId, logger);
          }
        }
        // Incognito: persist confirmed message to localStorage.
        const rootFolderId =
          typeof ctx.requestData["rootFolderId"] === "string"
            ? ctx.requestData["rootFolderId"]
            : "";
        if (arrived.id) {
          await persistMessageIfIncognito(
            threadId,
            arrived.id,
            rootFolderId,
            logger,
          );
        }
      },
    },

    // ── content-delta ────────────────────────────────────────────────────────
    // Framework appends delta.content to the matching message.
    "content-delta": {
      responseFields: { messages: ["id", "content"] } as const,
      operation: "append" as const,
    },

    // ── content-done ─────────────────────────────────────────────────────────
    // onEvent: persist the final message content to localStorage for incognito.
    "content-done": {
      remoteEvent: true,
      syncDomain: "threads" as const,
      responseFields: { messages: ["id", "content", "metadata"] } as const,
      urlPathParamsFields: ["threadId"] as const,
      operation: "merge" as const,
      onEvent: onEventPersistMessage(),
    },

    // ── reasoning-delta ──────────────────────────────────────────────────────
    // Framework appends delta to message.content (reasoning block).
    "reasoning-delta": {
      responseFields: { messages: ["id", "content"] } as const,
      operation: "append" as const,
    },

    // ── reasoning-done ───────────────────────────────────────────────────────
    // onEvent: persist final reasoning content to localStorage for incognito.
    "reasoning-done": {
      responseFields: { messages: ["id", "content"] } as const,
      operation: "merge" as const,
      onEvent: onEventPersistMessage(),
    },

    // ── tool-input-delta ────────────────────────────────────────────────────
    // Streaming tool call arguments from the AI model. Framework merges the
    // partial metadata (argsText) onto the existing tool message.
    "tool-input-delta": {
      responseFields: { messages: ["id", "metadata"] } as const,
      operation: "merge" as const,
    },

    // ── tool-result ──────────────────────────────────────────────────────────
    // onEvent: persist tool result metadata to localStorage for incognito.
    "tool-result": {
      remoteEvent: true,
      syncDomain: "threads" as const,
      responseFields: { messages: ["id", "metadata"] } as const,
      urlPathParamsFields: ["threadId"] as const,
      operation: "merge" as const,
      onEvent: onEventPersistMessage(),
    },

    // ── tool-result-updated ──────────────────────────────────────────────────
    // onEvent: persist updated tool result metadata to localStorage for incognito.
    "tool-result-updated": {
      remoteEvent: true,
      syncDomain: "threads" as const,
      responseFields: { messages: ["id", "metadata"] } as const,
      urlPathParamsFields: ["threadId"] as const,
      operation: "merge" as const,
      onEvent: onEventPersistMessage(),
    },

    // ── error ────────────────────────────────────────────────────────────────
    // Framework merges the error message (emitter sends full messages partial).
    // onEvent: clear ?message= URL param so the active branch resets to latest.
    // Also: persist the error message to localStorage for incognito.
    error: {
      remoteEvent: true,
      syncDomain: "threads" as const,
      responseFields: {
        messages: [
          "id",
          "role",
          "content",
          "parentId",
          "sequenceId",
          "model",
          "skill",
          "metadata",
          "errorMessage",
          "errorCode",
          "createdAt",
          "updatedAt",
        ],
      } as const,
      urlPathParamsFields: ["threadId"] as const,
      operation: "merge" as const,
      onEvent: async (ctx) => {
        const currentHref = getCurrentUrl();
        if (currentHref) {
          const url = new URL(currentHref);
          url.searchParams.delete("message");
          silentReplaceState(url.toString());
        }
        const rootFolderId =
          typeof ctx.requestData["rootFolderId"] === "string"
            ? ctx.requestData["rootFolderId"]
            : "";
        const msg = ctx.responseData.messages?.[0];
        const msgId = msg?.id;
        const threadId = ctx.urlPathParams["threadId"] ?? "";
        if (msgId) {
          await persistMessageIfIncognito(
            threadId,
            msgId,
            rootFolderId,
            ctx.logger,
            false,
          );
        }
        // Any error arriving mid-stream means the stream is dead.
        // Remove ALL optimistic assistant placeholders so they don't dangle
        // alongside the error message. Covers both the queued case and
        // stream errors / compacting failures that arrive after the stream started.
        const { removeAllOptimistic, removeOptimisticByParentId } =
          await import("./hooks/update-messages");
        removeAllOptimistic(threadId, ctx.logger);
        // When the server queued a message (thread was already streaming),
        // the error message IS the queued placeholder — remove by its id too.
        if (
          msg?.metadata &&
          typeof msg.metadata === "object" &&
          "isQueued" in msg.metadata &&
          msg.metadata.isQueued === true &&
          msgId
        ) {
          removeOptimisticByParentId(threadId, msgId, ctx.logger);
        }
      },
    },

    // ── voice-transcribed ────────────────────────────────────────────────────
    // Framework merges the transcribed message content.
    // onEvent: reset input store and clear draft.
    "voice-transcribed": {
      responseFields: { messages: ["id", "content", "metadata"] } as const,
      operation: "merge" as const,
      onEvent: async () => {
        const { useChatInputStore } =
          await import("@/app/api/[locale]/agent/ai-stream/stream/hooks/input-store");
        useChatInputStore.getState().reset();
      },
    },

    // ── audio-chunk ──────────────────────────────────────────────────────────
    // Enqueues TTS audio for sequential playback - payload typed via response fields.
    "audio-chunk": {
      responseFields: {
        audioData: true as const,
        chunkIndex: true as const,
        audioMessageId: true as const,
        audioIsFinal: true as const,
        audioText: true as const,
      },
      operation: "merge" as const,
      onEvent: async (ctx) => {
        const { responseData, logger } = ctx;
        const audioData = responseData.audioData;
        const chunkIndex = responseData.chunkIndex;
        if (typeof audioData !== "string" || typeof chunkIndex !== "number") {
          return;
        }
        const { getAudioQueue } =
          await import("@/app/api/[locale]/agent/ai-stream/stream/hooks/audio-queue");
        getAudioQueue().enqueue(audioData, chunkIndex, logger);
      },
    },

    // ── files-uploaded ───────────────────────────────────────────────────────
    // The framework's id-based array merger would keep optimistic attachments
    // alongside the permanent ones (different IDs). We bypass it entirely and
    // patch the message metadata directly so the attachments array is replaced.
    "files-uploaded": {
      responseFields: { messages: ["id", "metadata"] } as const,
      operation: "merge" as const,
      onEvent: async (ctx) => {
        const msg = ctx.responseData.messages?.[0];
        const msgId = msg?.id;
        if (!msgId) {
          return;
        }
        const threadId = ctx.urlPathParams["threadId"] ?? "";
        const rawFolderId = ctx.requestData["rootFolderId"];
        if (typeof rawFolderId !== "string") {
          return;
        }
        const { isDefaultFolderId } =
          await import("@/app/api/[locale]/agent/chat/config");
        if (!isDefaultFolderId(rawFolderId)) {
          return;
        }
        const { writeMessagesMetadataPatch } =
          await import("./hooks/update-messages");
        writeMessagesMetadataPatch(threadId, rawFolderId, ctx.logger, msgId, {
          isUploadingAttachments: false,
          attachments: msg.metadata?.attachments,
        });
      },
    },

    // ── tokens-updated ───────────────────────────────────────────────────────
    "tokens-updated": {
      remoteEvent: true,
      syncDomain: "threads" as const,
      responseFields: { messages: ["id", "metadata"] } as const,
      operation: "merge" as const,
    },

    // ── compacting-delta ─────────────────────────────────────────────────────
    // Framework appends delta to message.content.
    "compacting-delta": {
      responseFields: { messages: ["id", "content", "metadata"] } as const,
      operation: "append" as const,
    },

    // ── compacting-done ──────────────────────────────────────────────────────
    // onEvent: persist compacted message content to localStorage for incognito.
    "compacting-done": {
      responseFields: { messages: ["id", "content", "metadata"] } as const,
      operation: "merge" as const,
      onEvent: onEventPersistMessage(),
    },
    // ── stream-finished ──────────────────────────────────────────────────────
    // Framework merges streamingState → "idle" + final messages.
    // Sidebar caches (threads + folder-contents) are updated via their own channels.
    // onEvent: clear pending-create state. isStreaming in input.tsx is now derived
    // from the cache streamingState field, so no nav store update needed here.
    "stream-finished": {
      remoteEvent: true,
      syncDomain: "threads" as const,
      responseFields: {
        streamingState: true as const,
      },
      urlPathParamsFields: ["threadId"] as const,
      operation: "merge" as const,
      onEvent: async (ctx) => {
        const threadId = ctx.urlPathParams["threadId"] ?? "";
        const { useChatStore } = await import("../../../hooks/store");
        useChatStore.getState().clearThreadPendingCreate(threadId);
        // Clear aborting state - the framework already merged
        // streamingState: "idle" into the cache; clear the cancel spinner.
        const { useAIStreamStore } =
          await import("../../../../ai-stream/stream/hooks/store");
        useAIStreamStore.getState().clearThread(threadId);
        // Sweep any dangling optimistic placeholders - normally gone by now
        // (removed when real assistant message-created arrived), but guards
        // against edge cases where the stream ends without emitting a message.
        const { removeAllOptimistic } = await import("./hooks/update-messages");
        removeAllOptimistic(threadId, ctx.logger);
        const rootFolderId =
          typeof ctx.requestData["rootFolderId"] === "string"
            ? ctx.requestData["rootFolderId"]
            : "";
        await finishIncognitoThreadIfIncognito(threadId, rootFolderId);
      },
    },

    // ── task-completed ───────────────────────────────────────────────────────
    // Framework removes the completed task from backgroundTasks (remove by id).
    "task-completed": {
      responseFields: { backgroundTasks: ["id"] as const },
      operation: "remove" as const,
    },

    // ── streaming-state-changed ──────────────────────────────────────────────
    // Framework merges streamingState on messages cache.
    // Sidebar caches (threads + folder-contents) are updated via their own channels.
    "streaming-state-changed": {
      remoteEvent: true,
      syncDomain: "threads" as const,
      responseFields: ["streamingState"] as const,
      urlPathParamsFields: ["threadId"] as const,
      operation: "merge" as const,
    },

    // ── generated-media-added ────────────────────────────────────────────────
    // onEvent: persist media metadata to localStorage for incognito.
    "generated-media-added": {
      responseFields: { messages: ["id", "metadata"] } as const,
      operation: "merge" as const,
      onEvent: onEventPersistMessage(),
    },

    // ── gap-fill-started ─────────────────────────────────────────────────────
    "gap-fill-started": {
      responseFields: { messages: ["id", "metadata"] } as const,
      operation: "merge" as const,
    },

    // ── gap-fill-completed ───────────────────────────────────────────────────
    // Framework merge handles metadata.variants update via applyPartialToCache.
    // onEvent: persist variants metadata to localStorage for incognito.
    "gap-fill-completed": {
      responseFields: { messages: ["id", "metadata"] } as const,
      operation: "merge" as const,
      onEvent: onEventPersistMessage(),
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
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

  fields: customWidgetObject({
    render: MessagesWidget,
    usage: { request: "data&urlPathParams", response: true } as const,
    noFormElement: true,
    children: {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../../definition")).default.GET,
        labelField: "title",
        label: "get.threadId.label" as const,
        description: "get.threadId.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.rootFolderId.label" as const,
        description: "get.rootFolderId.description" as const,
        columns: 6,
        options: rootFolderIdOptions,
        schema: z.enum(DefaultFolderId),
        includeInCacheKey: true,
      }),
      leafMessageId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.leafMessageId.label" as const,
        description: "get.leafMessageId.description" as const,
        columns: 3,
        schema: z.uuid().nullable().optional(),
      }),

      // === RESPONSE ===
      streamingState: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        schema: z.enum(ThreadStreamingStateDB),
      }),
      backgroundTasks: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            displayName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            toolCallId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
          },
        }),
      }),
      messages: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.messages.message.title" as const,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().uuid(),
            }),
            threadId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().uuid(),
            }),
            role: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.enum(ChatMessageRole),
            }),
            content: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            parentId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().uuid().nullable(),
            }),
            sequenceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().uuid().nullable(),
            }),
            authorId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            authorName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            isAI: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.boolean(),
            }),
            model: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.enum(ChatModelId).nullable(),
            }),
            skill: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            errorType: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            errorMessage: responseField(scopedTranslation, {
              type: WidgetType.ALERT,
              schema: z.string().nullable(),
            }),
            errorCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            metadata: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.custom<MessageMetadata>().nullable(),
            }),
            upvotes: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              schema: z.number(),
            }),
            downvotes: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              schema: z.number(),
            }),
            searchVector: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: dateSchema,
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: dateSchema,
            }),
          },
        }),
      }),

      // TTS streaming - audio-chunk event payload (not persisted, event-only transport)
      audioData: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable().optional(),
      }),
      chunkIndex: responseField(scopedTranslation, {
        type: WidgetType.STAT,
        schema: z.number().nullable().optional(),
      }),
      audioMessageId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().uuid().nullable().optional(),
      }),
      audioIsFinal: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        schema: z.boolean().nullable().optional(),
      }),
      audioText: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable().optional(),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  // Route to client (localStorage) for incognito threads - caller passes rootFolderId
  useClientRoute: ({ data }) => data.rootFolderId === DefaultFolderId.INCOGNITO,

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: { rootFolderId: DefaultFolderId.PRIVATE },
    },
    responses: {
      default: {
        streamingState: ThreadStreamingState.IDLE,
        backgroundTasks: [],
        messages: [
          {
            id: "660e8400-e29b-41d4-a716-446655440000",
            threadId: "550e8400-e29b-41d4-a716-446655440000",
            role: ChatMessageRole.USER,
            content: "Hello, how can you help me?",
            parentId: null,
            authorId: "770e8400-e29b-41d4-a716-446655440000",
            authorName: null,
            isAI: false,
            model: null,
            skill: null,
            sequenceId: null,
            metadata: null,
            upvotes: 0,
            downvotes: 0,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            searchVector: null,
            createdAt: "2024-01-15T10:00:00.000Z",
            updatedAt: "2024-01-15T10:00:00.000Z",
          },
          {
            id: "770e8400-e29b-41d4-a716-446655440000",
            threadId: "550e8400-e29b-41d4-a716-446655440000",
            role: ChatMessageRole.ASSISTANT,
            content: "I can help you with various tasks!",
            parentId: "660e8400-e29b-41d4-a716-446655440000",
            authorId: "770e8400-e29b-41d4-a716-446655440000",
            authorName: null,
            isAI: true,
            model: ChatModelId.GPT_5,
            skill: null,
            sequenceId: null,
            metadata: null,
            upvotes: 0,
            downvotes: 0,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            searchVector: null,
            createdAt: "2024-01-15T10:00:00.000Z",
            updatedAt: "2024-01-15T10:00:00.000Z",
          },
        ],
      },
    },
  },
});

/**
 * Create Message Endpoint (POST)
 * Creates a new message in a thread
 *
 * Note: PUBLIC role is allowed for anonymous users to respond in threads
 * The repository layer validates thread access and permissions
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "threads", "[threadId]", "messages"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "message-circle",
  category: "ai",
  subCategory: "messagesModerating",
  tags: ["tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
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

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title" as const,
    description: "post.form.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../../definition")).default.GET,
        labelField: "title",
        label: "post.threadId.label" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.rootFolderId.label" as const,
        description: "post.rootFolderId.description" as const,
        columns: 6,
        options: rootFolderIdOptions,
        schema: z.enum(DefaultFolderId),
      }),
      id: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.id.label" as const,
        description: "post.id.description" as const,
        schema: z.string().uuid().optional(),
      }),
      role: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.role.label" as const,
        description: "post.role.description" as const,
        options: [
          {
            value: ChatMessageRole.USER,
            label: "enums.role.user" as const,
          },
          {
            value: ChatMessageRole.ASSISTANT,
            label: "enums.role.assistant" as const,
          },
        ],
        schema: z
          .enum([ChatMessageRole.USER, ChatMessageRole.ASSISTANT])
          .optional()
          .default(ChatMessageRole.USER),
      }),
      content: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.content.label" as const,
        description: "post.content.description" as const,
        schema: z.string().min(1),
      }),
      parentId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.parentId.label" as const,
        description: "post.parentId.description" as const,
        schema: z.string().uuid().optional(),
      }),
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.model.label" as const,
        description: "post.model.description" as const,
        schema: z.enum(ChatModelId).optional(),
      }),
      skill: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.skill.label" as const,
        description: "post.skill.description" as const,
        schema: z.string().optional(),
      }),
      metadata: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "post.metadata.label" as const,
        description: "post.metadata.description" as const,
        schema: z.custom<MessageMetadata>().optional(),
      }),

      // === RESPONSE ===
      messageId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.message.id.content" as const,
        schema: z.uuid(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.message.createdAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  // Route to client (localStorage) for incognito threads - caller passes rootFolderId
  useClientRoute: ({ data }) => data.rootFolderId === DefaultFolderId.INCOGNITO,

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        rootFolderId: DefaultFolderId.PRIVATE,
        id: "770e8400-e29b-41d4-a716-446655440000",
        role: ChatMessageRole.USER,
        content: "Hello, how can you help me?",
      },
    },
    responses: {
      default: {
        messageId: "660e8400-e29b-41d4-a716-446655440000",
        createdAt: "2024-01-15T10:00:00.000Z",
      },
    },
  },
});

/**
 * Export types
 */
export type MessageListRequestOutput = typeof GET.types.RequestOutput;
export type MessageListUrlParamsTypeOutput =
  typeof GET.types.UrlVariablesOutput;
export type MessageListResponseOutput = typeof GET.types.ResponseOutput;

export type MessagesEventPayloads = typeof GET.types.EventPayloads;

export type MessageCreateRequestOutput = typeof POST.types.RequestOutput;
export type MessageCreateUrlParamsTypeOutput =
  typeof POST.types.UrlVariablesOutput;
export type MessageCreateResponseOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
export default { GET, POST } as const;
