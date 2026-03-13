/**
 * Unified Task Runner Definition
 * API endpoint definition for unified task management
 * Implements spec.md unified runner requirements
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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

import { scopedTranslation } from "./i18n";

/**
 * POST /unified-runner - Manage unified task runner
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "unified-runner"],
  aliases: ["unified-runner", "task-runner", "runner"],
  title: "post.title",
  description: "post.description",
  icon: "check-circle",
  category: "app.endpointCategories.systemTasks",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.MCP_OFF,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ],
  tags: ["post.title"],
  cli: {
    firstCliArgKey: "action",
  },
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    description: "post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // Request fields
      action: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.action.label",
        description: "post.fields.action.description",
        options: [
          {
            value: "start",
            label: "post.fields.action.options.start",
          },
          {
            value: "stop",
            label: "post.fields.action.options.stop",
          },
          {
            value: "status",
            label: "post.fields.action.options.status",
          },
          {
            value: "restart",
            label: "post.fields.action.options.restart",
          },
        ],
        columns: 6,
        schema: z.enum(["start", "stop", "status", "restart"]),
      }),

      taskFilter: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.taskFilter.label",
        description: "post.fields.taskFilter.description",
        options: [
          {
            value: "all",
            label: "post.fields.taskFilter.options.all",
          },
          {
            value: "cron",
            label: "post.fields.taskFilter.options.cron",
          },
          {
            value: "side",
            label: "post.fields.taskFilter.options.side",
          },
        ],
        columns: 6,
        schema: z.enum(["all", "cron", "side"]).optional(),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.success",
        schema: z.boolean(),
      }),

      actionResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.actionResult",
        schema: z.string(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.message",
        schema: z.string(),
      }),

      timestamp: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.timestamp",
        schema: z.string(),
      }),
    },
  }),

  examples: {
    requests: {
      status: {
        action: "status" as const,
        dryRun: false,
      },
      start: {
        action: "start" as const,
        taskFilter: "all" as const,
        dryRun: false,
      },
      stop: {
        action: "stop" as const,
        dryRun: false,
      },
    },
    responses: {
      status: {
        success: true,
        actionResult: "status",
        message: "Task runner is running with 2 active tasks",
        timestamp: "2025-07-25T18:15:00.000Z",
      },
      start: {
        success: true,
        actionResult: "start",
        message: "Task runner started successfully",
        timestamp: "2025-07-25T18:15:00.000Z",
      },
      stop: {
        success: true,
        actionResult: "stop",
        message: "Task runner stopped successfully",
        timestamp: "2025-07-25T18:15:00.000Z",
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsaved.title",
      description: "post.errors.unsaved.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
});

// Export types for use in repository
export type UnifiedRunnerRequestInput = typeof POST.types.RequestInput;
export type UnifiedRunnerRequestOutput = typeof POST.types.RequestOutput;
export type UnifiedRunnerResponseInput = typeof POST.types.ResponseInput;
export type UnifiedRunnerResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
