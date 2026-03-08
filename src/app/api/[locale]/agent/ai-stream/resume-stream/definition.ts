/**
 * Resume Stream API Definition
 * POST /agent/ai-stream/resume-stream
 *
 * Continues an existing thread by running a headless AI turn (threadMode: "append").
 * Used as a cron task by handleTaskCompletion to resume a paused AI stream
 * after an async remote task completes (callbackMode=wait or callbackMode=wakeUp).
 *
 * The taskInput carries: threadId, modelId (or favoriteId), characterId.
 * handleTaskCompletion creates a one-shot cron task with routeId="resume-stream"
 * and all needed context flows through taskInput — no DB columns needed.
 */

import { z } from "zod";

import {
  ModelId,
  ModelIdOptions,
} from "@/app/api/[locale]/agent/models/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../stream/i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "ai-stream", "resume-stream"],
  aliases: ["resume-stream"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.AI_TOOL_OFF,
  ],
  title: "resumeStream.post.title",
  description: "resumeStream.post.description",
  icon: "play",
  category: "app.endpointCategories.ai",
  tags: ["tags.ai", "tags.chat"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // ── Required: thread to continue ────────────────────────────────────
      threadId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().uuid(),
      }),

      // ── Favorite shortcut (loads model + character in one shot) ─────────
      favoriteId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z
          .union([z.literal(""), z.string().uuid()])
          .optional()
          .transform((v) => (v === "" ? undefined : v)),
      }),

      // ── Explicit model / character (override or use instead of favorite) ─
      modelId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        columns: 6,
        options: ModelIdOptions,
        schema: z.enum(ModelId).optional(),
      }),

      characterId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),

      // ── wakeUp: original tool message to inject deferred result from ─────
      // Named wakeUpToolMessageId (not toolMessageId) to avoid being picked up
      // by the cron executor's generic completion handler which reads taskInput.toolMessageId
      // and would overwrite the original wakeUp tool message with the resume-stream result.
      wakeUpToolMessageId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().optional(),
      }),

      // ── Cleanup: IDs of cron tasks to delete after revival completes ─────
      // wakeUpTaskId: the originating wakeUp cron task
      // resumeTaskId: this resume-stream task itself
      // Both are deleted after the revival AI message is written.
      wakeUpTaskId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),

      resumeTaskId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),

      // ── Response ────────────────────────────────────────────────────────
      resumed: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),

      lastAiMessageId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().uuid().nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "resumeStream.post.errors.validation.title",
      description: "resumeStream.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "resumeStream.post.errors.unauthorized.title",
      description: "resumeStream.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "resumeStream.post.errors.forbidden.title",
      description: "resumeStream.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "resumeStream.post.errors.notFound.title",
      description: "resumeStream.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "resumeStream.post.errors.internal.title",
      description: "resumeStream.post.errors.internal.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "resumeStream.post.errors.network.title",
      description: "resumeStream.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "resumeStream.post.errors.unknown.title",
      description: "resumeStream.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "resumeStream.post.errors.unsaved.title",
      description: "resumeStream.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "resumeStream.post.errors.conflict.title",
      description: "resumeStream.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "resumeStream.post.success.title",
    description: "resumeStream.post.success.description",
  },

  examples: {
    requests: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        favoriteId: "660e8400-e29b-41d4-a716-446655440001",
      },
      withExplicit: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        modelId: ModelId["CLAUDE_HAIKU_4_5"],
        characterId: "default",
      },
    },
    responses: {
      default: {
        resumed: true,
        lastAiMessageId: "770e8400-e29b-41d4-a716-446655440002",
      },
    },
  },
});

export const endpoints = { POST };

export const resumeStreamRequestSchema = POST.requestSchema;
export type ResumeStreamRequestInput = typeof POST.types.RequestInput;
export type ResumeStreamRequestOutput = typeof POST.types.RequestOutput;
export type ResumeStreamResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
