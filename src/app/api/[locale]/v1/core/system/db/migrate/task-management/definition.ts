/**
 * Database Migration Task Management Definition
 * API endpoint definition for database migration task operations
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
 * Migration Task Operation Types
 */
export const {
  enum: MigrationTaskOperationType,
  options: MigrationTaskOperationTypeOptions,
} = createEnumOptions({
  RUN_HEALTH_CHECK:
    "app.api.v1.core.system.db.migrate.taskManagement.operations.runHealthCheck",
  START_AUTO_MIGRATION:
    "app.api.v1.core.system.db.migrate.taskManagement.operations.startAutoMigration",
  START_BACKUP_MONITOR:
    "app.api.v1.core.system.db.migrate.taskManagement.operations.startBackupMonitor",
  STOP_AUTO_MIGRATION:
    "app.api.v1.core.system.db.migrate.taskManagement.operations.stopAutoMigration",
  STOP_BACKUP_MONITOR:
    "app.api.v1.core.system.db.migrate.taskManagement.operations.stopBackupMonitor",
  GET_MIGRATION_STATUS:
    "app.api.v1.core.system.db.migrate.taskManagement.operations.getMigrationStatus",
  LIST_MIGRATION_TASKS:
    "app.api.v1.core.system.db.migrate.taskManagement.operations.listMigrationTasks",
} as const);

/**
 * Migration Task Priority Types
 */
export const {
  enum: MigrationTaskPriority,
  options: MigrationTaskPriorityOptions,
} = createEnumOptions({
  LOW: "app.api.v1.core.system.db.migrate.taskManagement.priority.low",
  MEDIUM: "app.api.v1.core.system.db.migrate.taskManagement.priority.medium",
  HIGH: "app.api.v1.core.system.db.migrate.taskManagement.priority.high",
} as const);

/**
 * Database Migration Task Management Endpoint Definition
 */
const { POST } = createEndpoint({
  title: "app.api.v1.core.system.db.migrate.taskManagement.title",
  description: "app.api.v1.core.system.db.migrate.taskManagement.description",
  category: "app.api.v1.core.system.db.migrate.taskManagement.category",
  tags: [
    "app.api.v1.core.system.db.migrate.taskManagement.tags.migration",
    "app.api.v1.core.system.db.migrate.taskManagement.tags.tasks",
  ],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["migrate-tasks", "db-migrate-tasks"],
  method: Methods.POST,
  path: ["v1", "core", "system", "db", "migrate", "task-management"],
  examples: {
    urlPathParams: undefined,
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
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.db.migrate.taskManagement.container.title",
      description:
        "app.api.v1.core.system.db.migrate.taskManagement.container.description",
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
            "app.api.v1.core.system.db.migrate.taskManagement.fields.operation.label",
          description:
            "app.api.v1.core.system.db.migrate.taskManagement.fields.operation.description",
          placeholder:
            "app.api.v1.core.system.db.migrate.taskManagement.fields.operation.placeholder",
          options: MigrationTaskOperationTypeOptions,
          layout: { columns: 12 },
        },
        z
          .array(z.string())
          .min(1)
          .describe("Migration task operations to execute"),
      ),
      taskName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.db.migrate.taskManagement.fields.taskName.label",
          description:
            "app.api.v1.core.system.db.migrate.taskManagement.fields.taskName.description",
          placeholder:
            "app.api.v1.core.system.db.migrate.taskManagement.fields.taskName.placeholder",
          layout: { columns: 12 },
        },
        z
          .string()
          .optional()
          .describe("Specific migration task name to operate on"),
      ),
      options: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label:
            "app.api.v1.core.system.db.migrate.taskManagement.fields.options.label",
          description:
            "app.api.v1.core.system.db.migrate.taskManagement.fields.options.description",
          placeholder:
            "app.api.v1.core.system.db.migrate.taskManagement.fields.options.placeholder",
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
            dryRun: z
              .boolean()
              .optional()
              .describe("Preview changes without executing"),
          })
          .optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrate.taskManagement.response.success.label",
        },
        z
          .boolean()
          .describe("Whether the migration task operation was successful"),
      ),
      taskExecuted: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrate.taskManagement.response.taskExecuted.label",
        },
        z.string().describe("Name of the migration task that was operated on"),
      ),
      status: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrate.taskManagement.response.status.label",
        },
        z.string().describe("Current status of the migration task"),
      ),
      output: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrate.taskManagement.response.output.label",
        },
        z.string().optional().describe("Migration task execution output"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrate.taskManagement.response.error.label",
        },
        z
          .string()
          .optional()
          .describe("Error message if migration task failed"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrate.taskManagement.response.result.label",
        },
        z
          .object({
            success: z.boolean(),
            message: z.string().optional(),
            data: z.record(z.string(), z.unknown()).optional(),
            migrationsChecked: z.number().optional(),
            pendingMigrations: z.number().optional(),
          })
          .optional()
          .describe("Detailed migration task result"),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.validation.title",
      description:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.forbidden.title",
      description:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.internal.title",
      description:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.conflict.title",
      description:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.networkError.title",
      description:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.networkError.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.notFound.title",
      description:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.unknownError.title",
      description:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.unknownError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.system.db.migrate.taskManagement.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.db.migrate.taskManagement.success.title",
    description:
      "app.api.v1.core.system.db.migrate.taskManagement.success.description",
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
