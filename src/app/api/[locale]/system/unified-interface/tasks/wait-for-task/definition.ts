/**
 * Wait For Task API Definition
 * POST /system/unified-interface/tasks/wait-for-task
 *
 * Allows an AI to synchronously wait on a pending background task.
 * If the task is already completed, returns the result immediately.
 * If pending: registers the calling thread (wakeUp mechanism) so that
 * when the task completes, the AI stream is automatically revived.
 *
 * Stream behavior:
 * - If already complete: returns result inline, stream continues.
 * - If pending: stream pauses (TOOL_WAITING), revived via resume-stream
 *   when the original task completes and calls handleTaskCompletion.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { WaitForTaskWidget } from "./widget";
import { taskInputSchema } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskStatus,
  CronTaskStatusDB,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "wait-for-task"],
  title: "waitForTask.post.title",
  description: "waitForTask.post.description",
  icon: "clock",
  statusBadge: {
    loading: {
      label: "waitForTask.post.status.waiting",
      color: "bg-blue-500/10 text-blue-500",
    },
    done: {
      label: "waitForTask.post.status.complete",
      color: "bg-green-500/10 text-green-500",
    },
  },
  category: "endpointCategories.systemTasks",
  tags: ["tags.tasks" as const],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  aliases: ["wait-for-task"],

  fields: customWidgetObject({
    render: WaitForTaskWidget,
    noFormElement: true,
    usage: { request: "data", response: true } as const,
    children: {
      // Request
      taskId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().min(1),
      }),

      // Response
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.enum(CronTaskStatusDB),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        schema: z.unknown().optional(),
      }),
      waiting: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
      // Original tool info for widget rendering - mirrors execute-tool's toolName/input
      originalToolName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().optional(),
      }),
      originalArgs: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        schema: taskInputSchema.optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "waitForTask.post.errors.validation.title",
      description: "waitForTask.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "waitForTask.post.errors.unauthorized.title",
      description: "waitForTask.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "waitForTask.post.errors.internal.title",
      description: "waitForTask.post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "waitForTask.post.errors.forbidden.title",
      description: "waitForTask.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "waitForTask.post.errors.notFound.title",
      description: "waitForTask.post.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "waitForTask.post.errors.network.title",
      description: "waitForTask.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "waitForTask.post.errors.unknown.title",
      description: "waitForTask.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "waitForTask.post.errors.unsaved.title",
      description: "waitForTask.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "waitForTask.post.errors.conflict.title",
      description: "waitForTask.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "waitForTask.post.success.title",
    description: "waitForTask.post.success.description",
  },

  examples: {
    requests: {
      default: {
        taskId: "local-bg-1234567890-abc123",
      },
    },
    responses: {
      immediate: {
        status: CronTaskStatus.COMPLETED,
        result: { data: "task result here" },
        waiting: false,
      },
      waiting: {
        status: CronTaskStatus.PENDING,
        waiting: true,
      },
    },
  },
});

export const endpoints = { POST };

export type WaitForTaskRequestOutput = typeof POST.types.RequestOutput;
export type WaitForTaskResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
