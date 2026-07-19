/**
 * Task Report API Definition
 * Accepts execution results from remote instances.
 * Public endpoint (validates API key in handler).
 */

import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { scopedTranslation } from "next-vibe/execute-tool/complete/i18n";
import { UserRole } from "next-vibe/identity/roles/enum";
import { taskInputSchema } from "next-vibe/tasks/cron/db";
import { CronTaskStatus } from "next-vibe/tasks/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "execute-tool", "complete"],
  title: "taskReport.post.title",
  titleShort: "taskReport.post.titleShort",
  description: "taskReport.post.description",
  icon: "upload",
  category: "devTools",
  subCategory: "tasksSync",
  tags: ["tags.remoteSync" as const],
  aliases: ["complete-task"],
  allowedRoles: [UserRole.ADMIN, UserRole.MCP_VISIBLE] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // Request
      taskId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().min(1),
      }),
      executionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z
          .enum([
            CronTaskStatus.RUNNING,
            CronTaskStatus.COMPLETED,
            CronTaskStatus.FAILED,
            CronTaskStatus.CANCELLED,
            CronTaskStatus.TIMEOUT,
          ])
          .optional(),
      }),
      durationMs: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      summary: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().optional(),
      }),
      error: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().optional(),
      }),
      serverTimezone: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),
      executedByInstance: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().nullable().optional(),
      }),
      output: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: taskInputSchema.optional(),
      }),
      // AI-caller path (Claude Code / MCP): when status is omitted the caller
      // is signalling its own async work is done. response maps to output and
      // status defaults to COMPLETED.
      response: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: taskInputSchema.optional(),
      }),
      startedAt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().datetime().optional(),
      }),
      // Revival context echoed back from the dispatch request (context-on-wire,
      // see remote-call/spec.md → No Remote Tasks). When present, the report is
      // processed without any local task row lookup.
      wakeUpContext: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z
          .object({
            callbackMode: z.string().nullable(),
            threadId: z.string().nullable(),
            toolMessageId: z.string().nullable(),
            leafMessageId: z.string().nullable(),
            modelId: z.enum(ChatModelId).nullable(),
            skillId: z.string().nullable(),
            favoriteId: z.string().nullable(),
            subAgentDepth: z.number(),
            userId: z.string().min(1),
          })
          .optional(),
      }),

      // Response
      processed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "taskReport.post.errors.validation.title",
      description: "taskReport.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "taskReport.post.errors.unauthorized.title",
      description: "taskReport.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "taskReport.post.errors.internal.title",
      description: "taskReport.post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "taskReport.post.errors.forbidden.title",
      description: "taskReport.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "taskReport.post.errors.notFound.title",
      description: "taskReport.post.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "taskReport.post.errors.network.title",
      description: "taskReport.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "taskReport.post.errors.unknown.title",
      description: "taskReport.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "taskReport.post.errors.unsaved.title",
      description: "taskReport.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "taskReport.post.errors.conflict.title",
      description: "taskReport.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "taskReport.post.success.title",
    description: "taskReport.post.success.description",
  },

  examples: {
    requests: {
      default: {
        taskId: "claude-code",
        status: CronTaskStatus.COMPLETED,
        summary: "Task completed successfully.",
      },
    },
    responses: {
      default: {
        processed: true,
      },
    },
  },
});

export const endpoints = { POST } as const;

export type ReportRequestOutput = typeof POST.types.RequestOutput;
export type ReportResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
