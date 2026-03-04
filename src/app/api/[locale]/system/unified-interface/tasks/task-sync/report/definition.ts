/**
 * Task Report API Definition
 * Accepts execution results from remote instances.
 * Public endpoint (validates API key in handler).
 */

import { z } from "zod";

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
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";

import { scopedTranslation } from "../../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "task-sync", "report"],
  title: "taskReport.post.title",
  description: "taskReport.post.description",
  icon: "upload",
  category: "app.endpointCategories.system",
  tags: ["tags.tasks" as const],
  allowedRoles: envClient.VIBE_IS_CLOUD
    ? ([UserRole.ADMIN] as const)
    : ([] as const),

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // Request
      taskRouteId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().min(1),
      }),
      executionId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),
      status: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.enum([
          CronTaskStatus.RUNNING,
          CronTaskStatus.COMPLETED,
          CronTaskStatus.FAILED,
          CronTaskStatus.CANCELLED,
          CronTaskStatus.TIMEOUT,
        ]),
      }),
      durationMs: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      summary: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().optional(),
      }),
      error: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().optional(),
      }),
      serverTimezone: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),
      executedByInstance: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().optional(),
      }),
      output: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z
          .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
          .optional(),
      }),
      startedAt: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.string().datetime().optional(),
      }),

      // Response
      processed: scopedResponseField(scopedTranslation, {
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
        taskRouteId: "claude-code",
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

export const endpoints = { POST };

export type ReportRequestOutput = typeof POST.types.RequestOutput;
export type ReportResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
