/**
 * Database Reset Task Management Definition
 * API endpoint definition for database reset task operations
 * Following migration guide: Repository-only logic with proper definition structure
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { TaskOperationType, TaskOperationTypeOptions } from "./enum";
import { scopedTranslation } from "./i18n";

/**
 * Database Reset Task Management Endpoint Definition
 */
const { POST } = createEndpoint({
  scopedTranslation,
  title: "title",
  description: "description",
  category: "app.endpointCategories.system",
  tags: ["tags.tasks", "tags.management"],
  icon: "rotate-ccw",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["reset-tasks", "db-reset-tasks"],
  method: Methods.POST,
  path: ["system", "db", "reset", "task-management"],
  examples: {
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
  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    description: "container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      operation: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.operation.label",
        description: "fields.operation.description",
        placeholder: "fields.operation.placeholder",
        options: TaskOperationTypeOptions,
        columns: 12,
        schema: z
          .array(z.string())
          .min(1)
          .describe("Task operations to execute"),
      }),
      options: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "fields.options.label",
        description: "fields.options.description",
        placeholder: "fields.options.placeholder",
        columns: 12,
        schema: z
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
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.success.label",
        schema: z
          .boolean()
          .describe("Whether the task operation was successful"),
      }),
      taskName: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.taskName.label",
        schema: z.string().describe("Name of the task that was operated on"),
      }),
      status: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.status.label",
        schema: z.string().describe("Current status of the task"),
      }),
      output: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.output.label",
        schema: z.string().optional().describe("Task execution output"),
      }),
      error: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.error.label",
        schema: z.string().optional().describe("Error message if task failed"),
      }),
      result: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.result.label",
        schema: z
          .object({
            success: z.boolean(),
            message: z.string().optional(),
            data: z.record(z.string(), z.unknown()).optional(),
          })
          .optional()
          .describe("Detailed task result"),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.networkError.title",
      description: "errors.networkError.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknownError.title",
      description: "errors.unknownError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
