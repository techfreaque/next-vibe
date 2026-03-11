/**
 * Database Migration Task Management Definition
 * API endpoint definition for database migration task operations
 * Following migration guide: Repository-only logic with proper definition structure
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

import {
  MigrationTaskOperationType,
  MigrationTaskOperationTypeOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

/**
 * Database Migration Task Management Endpoint Definition
 */
const { POST } = createEndpoint({
  scopedTranslation,
  title: "title",
  description: "description",
  category: "app.endpointCategories.system",
  tags: ["tags.migration", "tags.tasks"],
  icon: "arrow-right",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["migrate-tasks", "db-migrate-tasks"],
  method: Methods.POST,
  path: ["system", "db", "migrate", "task-management"],
  examples: {
    requests: {
      healthCheck: {
        operation: [MigrationTaskOperationType.RUN_HEALTH_CHECK],
        taskName: "db-migration-health-check",
        options: {
          force: false,
        },
      },
      startAutoMigration: {
        operation: [MigrationTaskOperationType.START_AUTO_MIGRATION],
        taskName: "auto-migration-runner",
        options: {
          environment: "development",
        },
      },
      getStatus: {
        operation: [MigrationTaskOperationType.GET_MIGRATION_STATUS],
        taskName: "migration-backup-monitor",
        options: {},
      },
      success: {
        operation: [MigrationTaskOperationType.RUN_HEALTH_CHECK],
        taskName: "db-migration-health-check",
        options: {
          force: false,
        },
      },
      failed: {
        operation: [MigrationTaskOperationType.START_AUTO_MIGRATION],
        taskName: "auto-migration-runner",
        options: {
          environment: "development",
        },
      },
    },
    responses: {
      healthCheck: {
        success: true,
        taskExecuted: "db-migration-health-check",
        status: "completed",
        output: "Migration health check completed successfully",
        result: {
          success: true,
          message: "All migrations are up to date",
        },
      },
      startAutoMigration: {
        success: true,
        taskExecuted: "auto-migration-runner",
        status: "completed",
        output: "Auto migration started successfully",
        result: {
          success: true,
          message: "Auto migration is now running",
        },
      },
      getStatus: {
        success: true,
        taskExecuted: "migration-backup-monitor",
        status: "running",
        output: "Backup monitor status retrieved",
        result: {
          success: true,
          message: "Monitor is active",
        },
      },
      success: {
        success: true,
        taskExecuted: "db-migration-health-check",
        status: "completed",
        output: "Migration health check completed successfully",
        result: {
          success: true,
          message: "All migrations are up to date",
        },
      },
      failed: {
        success: false,
        taskExecuted: "auto-migration-runner",
        status: "failed",
        error: "Auto migration failed: Not in development environment",
        result: {
          success: false,
          message: "Task execution failed",
        },
      },
    },
  },
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    description: "container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      operation: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "fields.operation.label",
        description: "fields.operation.description",
        placeholder: "fields.operation.placeholder",
        options: MigrationTaskOperationTypeOptions,
        columns: 12,
        schema: z
          .array(z.string())
          .min(1)
          .describe("Migration task operations to execute"),
      }),
      taskName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.taskName.label",
        description: "fields.taskName.description",
        placeholder: "fields.taskName.placeholder",
        columns: 12,
        schema: z
          .string()
          .optional()
          .describe("Specific migration task name to operate on"),
      }),
      options: requestField(scopedTranslation, {
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
            dryRun: z
              .boolean()
              .optional()
              .describe("Preview changes without executing"),
          })
          .optional(),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.success.label",
        schema: z
          .boolean()
          .describe("Whether the migration task operation was successful"),
      }),
      taskExecuted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.taskExecuted.label",
        schema: z
          .string()
          .describe("Name of the migration task that was operated on"),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.status.label",
        schema: z.string().describe("Current status of the migration task"),
      }),
      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.output.label",
        schema: z
          .string()
          .optional()
          .describe("Migration task execution output"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.error.label",
        schema: z
          .string()
          .optional()
          .describe("Error message if migration task failed"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.result.label",
        schema: z
          .object({
            success: z.boolean(),
            message: z.string().optional(),
            data: z.record(z.string(), z.unknown()).optional(),
            migrationsChecked: z.coerce.number().optional(),
            pendingMigrations: z.coerce.number().optional(),
          })
          .optional()
          .describe("Detailed migration task result"),
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
export type MigrationTaskManagementRequestInput =
  typeof POST.types.RequestInput;
export type MigrationTaskManagementRequestOutput =
  typeof POST.types.RequestOutput;
export type MigrationTaskManagementResponseInput =
  typeof POST.types.ResponseInput;
export type MigrationTaskManagementResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
