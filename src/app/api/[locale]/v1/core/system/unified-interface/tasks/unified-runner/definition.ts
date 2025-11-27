/**
 * Unified Task Runner Definition
 * API endpoint definition for unified task management
 * Implements spec.md unified runner requirements
 */

import { z } from "zod";

import { createEndpoint } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/create';
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * POST /unified-runner - Manage unified task runner
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "tasks", "unified-runner"],
  aliases: ["unified-runner", "task-runner", "runner"],
  title:
    "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.title",
  description:
    "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.description",
  category: "app.api.v1.core.system.unifiedInterface.tasks.category",
  allowedRoles: [UserRole.ADMIN],
  tags: [
    "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.title",
  ],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.container.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.container.description",
      layoutType: LayoutType.GRID, columns: 12,
    },
    { request: "data", response: true },
    {
      // Request fields
      action: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.action.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.action.description",
          options: [
            {
              value: "start",
              label:
                "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.action.options.start",
            },
            {
              value: "stop",
              label:
                "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.action.options.stop",
            },
            {
              value: "status",
              label:
                "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.action.options.status",
            },
            {
              value: "restart",
              label:
                "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.action.options.restart",
            },
          ],
          columns: 6,
        },
        z.enum(["start", "stop", "status", "restart"]),
      ),

      taskFilter: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.taskFilter.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.taskFilter.description",
          options: [
            {
              value: "all",
              label:
                "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.taskFilter.options.all",
            },
            {
              value: "cron",
              label:
                "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.taskFilter.options.cron",
            },
            {
              value: "side",
              label:
                "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.taskFilter.options.side",
            },
          ],
          columns: 6,
        },
        z.enum(["all", "cron", "side"]).optional(),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.dryRun.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.fields.dryRun.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.response.success",
        },
        z.boolean(),
      ),

      actionResult: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.response.actionResult",
        },
        z.string(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.response.message",
        },
        z.string(),
      ),

      timestamp: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.response.timestamp",
        },
        z.string(),
      ),
    },
  ),

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
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.internal.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.unsaved.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.errors.unsaved.description",
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.success.title",
    description:
      "app.api.v1.core.system.unifiedInterface.tasks.unifiedRunner.post.success.description",
  },
});

// Export types for use in repository
export type UnifiedRunnerRequestInput = typeof POST.types.RequestInput;
export type UnifiedRunnerRequestOutput = typeof POST.types.RequestOutput;
export type UnifiedRunnerResponseInput = typeof POST.types.ResponseInput;
export type UnifiedRunnerResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
