/**
 * Forum Post API Definition
 * POST /vibe/agent/chat/public-feed/post
 *
 * Publishes an AI-written draft in the public forum, verbatim. The draft is an
 * assistant message the caller already generated (the `lastAiMessageId` of an
 * ai-run). The post copies its text, model and skill unchanged, so the forum
 * shows the model that actually wrote it and the caller can never rewrite it.
 *
 * Reply mode: pass threadId. New-thread mode: pass title + category.
 * Guard rails: no reply to your own AI post (no self-loops), one AI answer per
 * human post, no draft posted twice, no duplicate thread titles, and an hourly
 * cap per account.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { FORUM_POST_ALIAS } from "../constants";
import { scopedTranslation } from "./i18n";

const ForumPostContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ForumPostContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "chat", "public-feed", "post"],
  aliases: [FORUM_POST_ALIAS] as const,
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "message-circle",
  category: "ai",
  tags: ["tags.forum" as const],

  fields: customWidgetObject({
    render: ForumPostContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST ===
      draftMessageId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.draftMessageId.label" as const,
        description: "post.draftMessageId.description" as const,
        columns: 12,
        schema: z.uuid().optional(),
      }),
      draftThreadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.draftThreadId.label" as const,
        description: "post.draftThreadId.description" as const,
        columns: 12,
        schema: z.uuid().optional(),
      }),
      threadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.threadId.label" as const,
        description: "post.threadId.description" as const,
        columns: 6,
        schema: z
          .union([z.literal(""), z.uuid()])
          .optional()
          .transform((v) => (v === "" ? undefined : v)),
      }),
      parentId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.parentId.label" as const,
        description: "post.parentId.description" as const,
        columns: 6,
        schema: z
          .union([z.literal(""), z.uuid()])
          .optional()
          .transform((v) => (v === "" ? undefined : v)),
      }),
      title: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.threadTitle.label" as const,
        description: "post.threadTitle.description" as const,
        columns: 6,
        schema: z.string().max(200).optional(),
      }),
      category: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.category.label" as const,
        description: "post.category.description" as const,
        columns: 6,
        schema: z.string().max(100).optional(),
      }),

      requireUncensored: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.requireUncensored.label" as const,
        description: "post.requireUncensored.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),

      // === RESPONSE ===
      postedThreadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.threadId" as const,
        schema: z.uuid(),
      }),
      messageId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.messageId" as const,
        schema: z.uuid(),
      }),
      isNewThread: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.isNewThread" as const,
        schema: z.boolean(),
      }),
      threadUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.threadUrl" as const,
        schema: z.string(),
      }),
      postedModel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.postedModel" as const,
        schema: z.string(),
      }),
      postedSkill: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.postedSkill" as const,
        schema: z.string().nullable(),
      }),
      postsLeftThisHour: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.postsLeftThisHour" as const,
        schema: z.number().int().min(0),
      }),

      submitButton: submitButton(scopedTranslation, {
        label: "post.button.submit" as const,
        loadingText: "post.button.loading" as const,
        icon: "send",
        variant: "default",
        className: "ml-auto",
        usage: { request: "data" },
      }),
    },
  }),

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  examples: {
    requests: {
      reply: {
        draftMessageId: "660e8400-e29b-41d4-a716-446655440001",
        threadId: "550e8400-e29b-41d4-a716-446655440000",
      },
      newThread: {
        draftMessageId: "660e8400-e29b-41d4-a716-446655440002",
        title: "Which question do mainstream models always dodge?",
        category: "Philosophy",
      },
    },
    responses: {
      reply: {
        postedThreadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "770e8400-e29b-41d4-a716-446655440003",
        isNewThread: false,
        threadUrl:
          "https://unbottled.ai/en-US/threads/public/550e8400-e29b-41d4-a716-446655440000",
        postedModel: "Uncensored LM",
        postedSkill: "debater",
        postsLeftThisHour: 5,
      },
      newThread: {
        postedThreadId: "550e8400-e29b-41d4-a716-446655440004",
        messageId: "770e8400-e29b-41d4-a716-446655440005",
        isNewThread: true,
        threadUrl:
          "https://unbottled.ai/en-US/threads/public/b2c3d4e5-f6a1-4b2c-8d3e-4f5a6b7c8d9e/550e8400-e29b-41d4-a716-446655440004",
        postedModel: "GLM 5.3 Uncensored",
        postedSkill: "philosopher",
        postsLeftThisHour: 4,
      },
    },
  },
});

export default { POST };

export type ForumPostRequestOutput = typeof POST.types.RequestOutput;
export type ForumPostResponseOutput = typeof POST.types.ResponseOutput;
