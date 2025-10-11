/**
 * Translation Backup Restore Endpoint Definition
 *
 * This endpoint provides functionality to:
 * - Restore translation files from a backup
 * - Validate backup integrity before restoration
 * - Provide safe rollback capabilities
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Translation Backup Restore POST Endpoint
 * Restores translation files from a specified backup
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "translations", "restore-backup"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],

  title: "app.api.v1.core.system.translations.restoreBackup.title",
  description: "app.api.v1.core.system.translations.restoreBackup.description",
  category: "app.api.v1.core.system.translations.category",
  tags: [
    "app.api.v1.core.system.translations.tags.backup",
    "app.api.v1.core.system.translations.tags.restore",
    "app.api.v1.core.system.translations.tags.i18n",
  ],

  // CLI configuration
  aliases: ["translations:restore"],
  cli: {
    firstCliArgKey: "backupPath",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.translations.restoreBackup.container.title" as const,
      description:
        "app.api.v1.core.system.translations.restoreBackup.container.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      backupPath: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.translations.restoreBackup.fields.backupPath.title" as const,
          description:
            "app.api.v1.core.system.translations.restoreBackup.fields.backupPath.description" as const,
          layout: { columns: 12 },
          required: true,
        },
        z.string().min(1, "Backup path is required"),
      ),

      validateOnly: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.translations.restoreBackup.fields.validateOnly.title" as const,
          description:
            "app.api.v1.core.system.translations.restoreBackup.fields.validateOnly.description" as const,
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      createBackupBeforeRestore: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.translations.restoreBackup.fields.createBackupBeforeRestore.title" as const,
          description:
            "app.api.v1.core.system.translations.restoreBackup.fields.createBackupBeforeRestore.description" as const,
          layout: { columns: 6 },
        },
        z.boolean().default(true),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.translations.restoreBackup.success.description",
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.translations.restoreBackup.response.message",
        },
        z.string(),
      ),

      backupInfo: objectField(
        {
          type: WidgetType.STATS_GRID,
          title:
            "app.api.v1.core.system.translations.restoreBackup.response.backupInfo.title",
          description:
            "app.api.v1.core.system.translations.restoreBackup.response.backupInfo.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          backupPath: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.restoreBackup.response.backupInfo.backupPath",
            },
            z.string(),
          ),
          backupDate: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.restoreBackup.response.backupInfo.backupDate",
            },
            z.string().datetime(),
          ),
          filesRestored: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.restoreBackup.response.backupInfo.filesRestored",
            },
            z.number(),
          ),
          newBackupCreated: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.restoreBackup.response.backupInfo.newBackupCreated",
            },
            z.string().optional(),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.translations.restoreBackup.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.restoreBackup.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.translations.restoreBackup.errors.notFound.title",
      description:
        "app.api.v1.core.system.translations.restoreBackup.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.translations.restoreBackup.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.translations.restoreBackup.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.translations.restoreBackup.errors.forbidden.title",
      description:
        "app.api.v1.core.system.translations.restoreBackup.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.translations.restoreBackup.errors.server.title",
      description:
        "app.api.v1.core.system.translations.restoreBackup.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.translations.restoreBackup.errors.conflict.title",
      description:
        "app.api.v1.core.system.translations.restoreBackup.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "error.errorTypes.http_error",
      description: "error.errorTypes.http_error",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "error.errorTypes.internal_error",
      description: "error.errorTypes.internal_error",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "error.errorTypes.validation_error",
      description: "error.errorTypes.validation_error",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.translations.restoreBackup.success.title",
    description:
      "app.api.v1.core.system.translations.restoreBackup.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      success: {
        backupPath: "/path/to/backup/translations-2024-01-15T10-30-00-000Z",
        validateOnly: false,
        createBackupBeforeRestore: true,
      },
      validation: {
        backupPath: "/path/to/backup/translations-2024-01-15T10-30-00-000Z",
        validateOnly: true,
        createBackupBeforeRestore: false,
      },
      restore: {
        backupPath: "/path/to/backup/translations-2024-01-15T10-30-00-000Z",
        validateOnly: false,
        createBackupBeforeRestore: true,
      },
      validateOnly: {
        backupPath: "/path/to/backup/translations-2024-01-15T10-30-00-000Z",
        validateOnly: true,
        createBackupBeforeRestore: false,
      },
    },
    responses: {
      success: {
        success: true,
        message: "Backup restored successfully",
        backupInfo: {
          backupPath: "/path/to/backup/translations-2024-01-15T10-30-00-000Z",
          backupDate: "2024-01-15T10:30:00.000Z",
          filesRestored: 42,
          newBackupCreated:
            "/path/to/new/backup/translations-2024-01-15T11-00-00-000Z",
        },
      },
      validation: {
        success: true,
        message:
          "Backup validation successful - backup is valid and can be restored",
        backupInfo: {
          backupPath: "/path/to/backup/translations-2024-01-15T10-30-00-000Z",
          backupDate: "2024-01-15T10:30:00.000Z",
          filesRestored: 0,
        },
      },
      restore: {
        success: true,
        message: "Backup restored successfully",
        backupInfo: {
          backupPath: "/path/to/backup/translations-2024-01-15T10-30-00-000Z",
          backupDate: "2024-01-15T10:30:00.000Z",
          filesRestored: 42,
          newBackupCreated:
            "/path/to/new/backup/translations-2024-01-15T11-00-00-000Z",
        },
      },
      validateOnly: {
        success: true,
        message:
          "Backup validation successful - backup is valid and can be restored",
        backupInfo: {
          backupPath: "/path/to/backup/translations-2024-01-15T10-30-00-000Z",
          backupDate: "2024-01-15T10:30:00.000Z",
          filesRestored: 0,
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type RestoreBackupRequestInput = typeof POST.types.RequestInput;
export type RestoreBackupRequestOutput = typeof POST.types.RequestOutput;
export type RestoreBackupResponseInput = typeof POST.types.ResponseInput;
export type RestoreBackupResponseOutput = typeof POST.types.ResponseOutput;

const definitions = {
  POST,
};

export default definitions;
