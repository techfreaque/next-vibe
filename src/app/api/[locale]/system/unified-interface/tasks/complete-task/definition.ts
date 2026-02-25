/**
 * Complete Task API Definition
 * MCP tool for Claude Code to mark a cron task as completed/failed.
 * Dev-only (PRODUCTION_OFF) — not available on production instances.
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

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "complete-task"],
  title: "completeTask.post.title",
  description: "completeTask.post.description",
  icon: "check-circle",
  category: "app.endpointCategories.system",
  tags: ["tags.tasks" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.MCP_VISIBLE, UserRole.PRODUCTION_OFF],
  aliases: ["complete-task"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // Request
      taskId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().uuid(),
      }),
      status: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 6,
        schema: z.enum([CronTaskStatus.COMPLETED, CronTaskStatus.FAILED]),
      }),
      summary: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z.string().min(1),
      }),

      // Response
      completed: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
      pushedToRemote: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "completeTask.post.errors.validation.title",
      description: "completeTask.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "completeTask.post.errors.unauthorized.title",
      description: "completeTask.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "completeTask.post.errors.internal.title",
      description: "completeTask.post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "completeTask.post.errors.forbidden.title",
      description: "completeTask.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "completeTask.post.errors.notFound.title",
      description: "completeTask.post.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "completeTask.post.errors.network.title",
      description: "completeTask.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "completeTask.post.errors.unknown.title",
      description: "completeTask.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "completeTask.post.errors.unsaved.title",
      description: "completeTask.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "completeTask.post.errors.conflict.title",
      description: "completeTask.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "completeTask.post.success.title",
    description: "completeTask.post.success.description",
  },

  examples: {
    requests: {
      default: {
        taskId: "550e8400-e29b-41d4-a716-446655440000",
        status: CronTaskStatus.COMPLETED,
        summary: "Implemented the requested feature and all tests pass.",
      },
    },
    responses: {
      default: {
        completed: true,
        pushedToRemote: true,
      },
    },
  },
});

export const endpoints = { POST };

export type CompleteTaskRequestOutput = typeof POST.types.RequestOutput;
export type CompleteTaskResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
