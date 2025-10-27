/**
 * Database Migration Sync Command Endpoint Definition
 * Production-ready endpoint for synchronizing migration state
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "db", "migrate-sync"],
  title: "app.api.v1.core.system.db.migrateSync.post.title",
  description: "app.api.v1.core.system.db.migrateSync.post.description",
  category: "app.api.v1.core.system.db.category",
  tags: ["app.api.v1.core.system.db.migrateSync.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["migrate-sync", "db:migrate-sync"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.db.migrateSync.post.form.title",
      description:
        "app.api.v1.core.system.db.migrateSync.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.migrateSync.fields.force.title",
          description:
            "app.api.v1.core.system.db.migrateSync.fields.force.description",
          layout: { columns: 6 },
        },
        z.boolean().optional().default(false),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.migrateSync.fields.dryRun.title",
          description:
            "app.api.v1.core.system.db.migrateSync.fields.dryRun.description",
          layout: { columns: 6 },
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.migrateSync.fields.success.title",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.migrateSync.fields.output.title",
        },
        z.string(),
      ),

      trackingCleared: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateSync.fields.trackingCleared.title",
        },
        z.boolean(),
      ),

      trackingFilesCreated: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateSync.fields.trackingFilesCreated.title",
        },
        z.boolean(),
      ),

      drizzleMigrationRun: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateSync.fields.drizzleMigrationRun.title",
        },
        z.boolean(),
      ),

      originalFilesRestored: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateSync.fields.originalFilesRestored.title",
        },
        z.boolean(),
      ),

      migrationsProcessed: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateSync.fields.migrationsProcessed.title",
        },
        z.number(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.db.migrateSync.post.errors.validation.title",
      description:
        "app.api.v1.core.system.db.migrateSync.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.db.migrateSync.post.errors.network.title",
      description:
        "app.api.v1.core.system.db.migrateSync.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.db.migrateSync.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.db.migrateSync.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.db.migrateSync.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.db.migrateSync.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.db.migrateSync.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.db.migrateSync.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.db.migrateSync.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.migrateSync.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.db.migrateSync.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.db.migrateSync.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.db.migrateSync.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.migrateSync.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.db.migrateSync.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.db.migrateSync.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.db.migrateSync.post.success.title",
    description:
      "app.api.v1.core.system.db.migrateSync.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    urlPathParams: undefined,
    requests: {
      default: {
        force: false,
        dryRun: false,
      },
      dryRun: {
        force: false,
        dryRun: true,
      },
      force: {
        force: true,
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        output:
          "✅ Migration sync completed successfully! 🚀 Migrations are now properly tracked by Drizzle",
        trackingCleared: true,
        trackingFilesCreated: true,
        drizzleMigrationRun: true,
        originalFilesRestored: true,
        migrationsProcessed: 5,
      },
      dryRun: {
        success: true,
        output: "✅ Dry run completed - no changes made",
        trackingCleared: false,
        trackingFilesCreated: false,
        drizzleMigrationRun: false,
        originalFilesRestored: false,
        migrationsProcessed: 5,
      },
      force: {
        success: true,
        output:
          "✅ Migration sync completed with force option - existing tracking overridden",
        trackingCleared: true,
        trackingFilesCreated: true,
        drizzleMigrationRun: true,
        originalFilesRestored: true,
        migrationsProcessed: 8,
      },
    },
  },
});

export type MigrateSyncRequestInput = typeof POST.types.RequestInput;
export type MigrateSyncRequestOutput = typeof POST.types.RequestOutput;
export type MigrateSyncResponseInput = typeof POST.types.ResponseInput;
export type MigrateSyncResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
