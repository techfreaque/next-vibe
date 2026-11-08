/**
 * Chat Moderation API Definition (admin queue)
 * GET   /agent/chat/moderation - reported / hidden public-feed + shared threads
 * PATCH /agent/chat/moderation - dismiss (restore), remove, or ban the author
 *
 * Mirrors skills/moderation so admins have one mental model.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  ThreadModerationAction,
  ThreadModerationActionDB,
  ThreadModerationStatus,
  ThreadModerationStatusDB,
  ThreadReportReason,
  ThreadReportReasonDB,
} from "../enum";
import { CHAT_MODERATION_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const ChatModerationContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ChatModerationContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "chat", "moderation"],
  aliases: [CHAT_MODERATION_ALIAS],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "shield",
  category: "ai",
  subCategory: "messagesModerating",
  tags: ["tags.moderation" as const],

  fields: customWidgetObject({
    render: ChatModerationContainer,
    usage: { request: "data", response: true } as const,
    children: {
      minReports: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.minReports.label" as const,
        description: "get.fields.minReports.description" as const,
        columns: 4,
        schema: z.number().int().min(0).optional(),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.limit.label" as const,
        description: "get.fields.limit.description" as const,
        columns: 4,
        schema: z.number().int().min(1).max(200).optional(),
      }),
      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.offset.label" as const,
        description: "get.fields.offset.description" as const,
        columns: 4,
        schema: z.number().int().min(0).optional(),
      }),

      threads: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          noCard: true,
          usage: { response: true } as const,
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.uuid(),
            }),
            title: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "base",
              emphasis: "bold",
              schema: z.string(),
            }),
            rootFolderId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string(),
            }),
            authorId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.uuid().nullable(),
            }),
            authorName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            authorBanned: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.boolean(),
            }),
            moderationStatus: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.enum(ThreadModerationStatusDB),
            }),
            reportCount: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.number().int().nonnegative(),
            }),
            reasons: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.array(z.enum(ThreadReportReasonDB)),
            }),
            latestNote: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().datetime(),
            }),
          },
        }),
      }),
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nonnegative(),
      }),

      backButton: backButton(scopedTranslation, {
        label: "get.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      default: { minReports: 1, limit: 50, offset: 0 },
    },
    responses: {
      default: {
        threads: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            title: "Example thread",
            rootFolderId: "public",
            authorId: "660e8400-e29b-41d4-a716-446655440001",
            authorName: "example",
            authorBanned: false,
            moderationStatus: ThreadModerationStatus.UNDER_REVIEW,
            reportCount: 5,
            reasons: [ThreadReportReason.SPAM],
            latestNote: "Repeated ads",
            updatedAt: "2026-03-15T12:00:00.000Z",
          },
        ],
        totalCount: 1,
      },
    },
  },
});

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["vibe", "agent", "chat", "moderation"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "patch.title" as const,
  titleShort: "patch.titleShort" as const,
  description: "patch.description" as const,
  icon: "shield",
  category: "ai",
  subCategory: "messagesModerating",
  tags: ["tags.moderation" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    noCard: true,
    usage: { request: "data", response: true } as const,
    children: {
      id: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.id.label" as const,
        description: "patch.fields.id.description" as const,
        columns: 12,
        schema: z.uuid(),
      }),
      action: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.fields.action.label" as const,
        description: "patch.fields.action.description" as const,
        options: [
          {
            value: ThreadModerationAction.DISMISS,
            label: "patch.actions.dismiss" as const,
          },
          {
            value: ThreadModerationAction.REMOVE,
            label: "patch.actions.remove" as const,
          },
          {
            value: ThreadModerationAction.BAN_AUTHOR,
            label: "patch.actions.banAuthor" as const,
          },
        ],
        columns: 6,
        schema: z.enum(ThreadModerationActionDB),
      }),

      patchId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.uuid(),
      }),
      patchStatus: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.enum(ThreadModerationStatusDB),
      }),
      patchReportCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().int().nonnegative(),
      }),
      authorBanned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title" as const,
      description: "patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        action: ThreadModerationAction.REMOVE,
      },
    },
    responses: {
      default: {
        patchId: "550e8400-e29b-41d4-a716-446655440000",
        patchStatus: ThreadModerationStatus.REMOVED,
        patchReportCount: 5,
        authorBanned: false,
      },
    },
  },
});

export const endpoints = { GET, PATCH };

export type ChatModerationGetResponseOutput = typeof GET.types.ResponseOutput;
export type ChatModerationPatchRequestOutput = typeof PATCH.types.RequestOutput;
export type ChatModerationPatchResponseOutput =
  typeof PATCH.types.ResponseOutput;

export default endpoints;
