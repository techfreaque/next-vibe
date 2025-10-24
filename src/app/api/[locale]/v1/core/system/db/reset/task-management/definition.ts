/**
 * Database Reset Task Management Definition
 * API endpoint definition for database reset task operations
 * Following migration guide: Repository-only logic with proper definition structure
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Task Operation Types
 */
export const { enum: TaskOperationType, options: TaskOperationTypeOptions } =
  createEnumOptions({
    RUN_SAFETY_CHECK:
      "app.api.v1.core.system.db.reset.taskManagement.operations.runSafetyCheck",
    START_AUTO_RESET:
      "app.api.v1.core.system.db.reset.taskManagement.operations.startAutoReset",
    START_BACKUP_VERIFICATION:
      "app.api.v1.core.system.db.reset.taskManagement.operations.startBackupVerification",
    STOP_AUTO_RESET:
      "app.api.v1.core.system.db.reset.taskManagement.operations.stopAutoReset",
    STOP_BACKUP_VERIFICATION:
      "app.api.v1.core.system.db.reset.taskManagement.operations.stopBackupVerification",
    GET_STATUS:
      "app.api.v1.core.system.db.reset.taskManagement.operations.getStatus",
    LIST_TASKS:
      "app.api.v1.core.system.db.reset.taskManagement.operations.listTasks",
  } as const);

/**
 * Task Priority Types
 */
export const { enum: TaskPriority, options: TaskPriorityOptions } =
  createEnumOptions({
    LOW: "app.api.v1.core.system.db.reset.taskManagement.priority.low",
    MEDIUM: "app.api.v1.core.system.db.reset.taskManagement.priority.medium",
    HIGH: "app.api.v1.core.system.db.reset.taskManagement.priority.high",
  } as const);

/**
 * Database Reset Task Management Endpoint Definition
 */
const { POST } = createEndpoint({
  title: "app.api.v1.core.system.db.reset.taskManagement.title",
  description: "app.api.v1.core.system.db.reset.taskManagement.description",
  category: "app.api.v1.core.system.db.reset.taskManagement.category",
  tags: [
    "app.api.v1.core.system.db.reset.taskManagement.tags.tasks",
    "app.api.v1.core.system.db.reset.taskManagement.tags.management",
  ],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["reset-tasks", "db-reset-tasks"],
  method: Methods.POST,
  path: ["v1", "core", "system", "db", "reset", "task-management"],
  examples: {
    urlPathVariables: undefined,
    requests: {
      safetyCheck: {
        operation: [TaskOperationType.RUN_SAFETY_CHECK],
        options: {
          force: false,
        },
      },
      startAutoReset: {
        operation: [TaskOperationType.START_AUTO_RESET],
        options: {
          environment: "development",
        },
      },
      getStatus: {
        operation: [TaskOperationType.GET_STATUS],
        options: {},
      },
      success: {
        operation: [TaskOperationType.RUN_SAFETY_CHECK],
        options: {
          force: false,
        },
      },
      failed: {
        operation: [TaskOperationType.START_AUTO_RESET],
        options: {
          environment: "development",
        },
      },
    },
    responses: {
      safetyCheck: {
        success: true,
        taskName: "db-reset-safety-check",
        status: "completed",
        output: "Safety check completed successfully",
        result: {
          success: true,
          message: "No unauthorized reset operations detected",
        },
      },
      startAutoReset: {
        success: true,
        taskName: "dev-db-auto-reset",
        status: "completed",
        output: "Auto reset started successfully",
        result: {
          success: true,
          message: "Reset operation is now running",
        },
      },
      getStatus: {
        success: true,
        taskName: "db-backup-verification",
        status: "running",
        output: "Backup verification status retrieved",
        result: {
          success: true,
          message: "Verification is active",
        },
      },
      success: {
        success: true,
        taskName: "db-reset-safety-check",
        status: "completed",
        output: "Safety check completed successfully",
        result: {
          success: true,
          message: "No unauthorized reset operations detected",
        },
      },
      failed: {
        success: false,
        taskName: "dev-db-auto-reset",
        status: "failed",
        error: "Auto reset failed: Not in development environment",
        result: {
          success: false,
          message: "Task execution failed",
        },
      },
    },
  },
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.db.reset.taskManagement.container.title",
      description:
        "app.api.v1.core.system.db.reset.taskManagement.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      operation: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.system.db.reset.taskManagement.fields.operation.label",
          description:
            "app.api.v1.core.system.db.reset.taskManagement.fields.operation.description",
          placeholder:
            "app.api.v1.core.system.db.reset.taskManagement.fields.operation.placeholder",
          options: TaskOperationTypeOptions,
          layout: { columns: 12 },
        },
        z.array(z.string()).min(1).describe("Task operations to execute"),
      ),
      options: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label:
            "app.api.v1.core.system.db.reset.taskManagement.fields.options.label",
          description:
            "app.api.v1.core.system.db.reset.taskManagement.fields.options.description",
          placeholder:
            "app.api.v1.core.system.db.reset.taskManagement.fields.options.placeholder",
          layout: { columns: 12 },
        },
        z
          .object({
            force: z
              .boolean()
              .optional()
              .describe("Force operation even with warnings"),
            environment: z
              .string()
              .optional()
              .describe("Target environment for operation"),
            timeout: z
              .number()
              .optional()
              .describe("Operation timeout in milliseconds"),
          })
          .optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.reset.taskManagement.response.success.label",
        },
        z.boolean().describe("Whether the task operation was successful"),
      ),
      taskName: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.reset.taskManagement.response.taskName.label",
        },
        z.string().describe("Name of the task that was operated on"),
      ),
      status: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.reset.taskManagement.response.status.label",
        },
        z.string().describe("Current status of the task"),
      ),
      output: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.reset.taskManagement.response.output.label",
        },
        z.string().optional().describe("Task execution output"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.reset.taskManagement.response.error.label",
        },
        z.string().optional().describe("Error message if task failed"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.reset.taskManagement.response.result.label",
        },
        z
          .object({
            success: z.boolean(),
            message: z.string().optional(),
            data: z.record(z.string(), z.unknown()).optional(),
          })
          .optional()
          .describe("Detailed task result"),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.db.reset.taskManagement.errors.validation.title",
      description:
        "app.api.v1.core.system.db.reset.taskManagement.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.db.reset.taskManagement.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.db.reset.taskManagement.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.db.reset.taskManagement.errors.forbidden.title",
      description:
        "app.api.v1.core.system.db.reset.taskManagement.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.db.reset.taskManagement.errors.internal.title",
      description:
        "app.api.v1.core.system.db.reset.taskManagement.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.db.reset.taskManagement.errors.conflict.title",
      description:
        "app.api.v1.core.system.db.reset.taskManagement.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.db.reset.taskManagement.errors.networkError.title",
      description:
        "app.api.v1.core.system.db.reset.taskManagement.errors.networkError.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.db.reset.taskManagement.errors.notFound.title",
      description:
        "app.api.v1.core.system.db.reset.taskManagement.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.db.reset.taskManagement.errors.unknownError.title",
      description:
        "app.api.v1.core.system.db.reset.taskManagement.errors.unknownError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.db.reset.taskManagement.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.system.db.reset.taskManagement.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.db.reset.taskManagement.success.title",
    description:
      "app.api.v1.core.system.db.reset.taskManagement.success.description",
  },
});

/**
 * Export types for repository to use
 */
export type ResetTaskManagementRequestInput = typeof POST.types.RequestInput;
export type ResetTaskManagementRequestOutput = typeof POST.types.RequestOutput;
export type ResetTaskManagementResponseInput = typeof POST.types.ResponseInput;
export type ResetTaskManagementResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
