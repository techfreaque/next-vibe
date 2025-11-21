/**
 * Database Migration Repair Command Endpoint Definition
 * Production-ready endpoint for repairing migration tracking
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
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

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "db", "migrate-repair"],
  title: "app.api.v1.core.system.db.migrateRepair.post.title",
  description: "app.api.v1.core.system.db.migrateRepair.post.description",
  category: "app.api.v1.core.system.db.category",
  tags: ["app.api.v1.core.system.db.migrateRepair.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["migrate-repair", "db:migrate-repair"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.db.migrateRepair.post.form.title",
      description:
        "app.api.v1.core.system.db.migrateRepair.post.form.description",
      layoutType: LayoutType.GRID, columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.migrateRepair.fields.force.title",
          description:
            "app.api.v1.core.system.db.migrateRepair.fields.force.description",
          columns: 4,
        },
        z.boolean().optional().default(false),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.migrateRepair.fields.dryRun.title",
          description:
            "app.api.v1.core.system.db.migrateRepair.fields.dryRun.description",
          columns: 4,
        },
        z.boolean().optional().default(false),
      ),

      reset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.migrateRepair.fields.reset.title",
          description:
            "app.api.v1.core.system.db.migrateRepair.fields.reset.description",
          columns: 4,
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateRepair.fields.success.title",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateRepair.fields.output.title",
        },
        z.string(),
      ),

      hasTable: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateRepair.fields.hasTable.title",
        },
        z.boolean(),
      ),

      schema: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateRepair.fields.schema.title",
        },
        z.string(),
      ),

      tableName: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateRepair.fields.tableName.title",
        },
        z.string(),
      ),

      trackedMigrations: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateRepair.fields.trackedMigrations.title",
        },
        z.number(),
      ),

      migrationFiles: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateRepair.fields.migrationFiles.title",
        },
        z.number(),
      ),

      repaired: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateRepair.fields.repaired.title",
        },
        z.number(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.db.migrateRepair.post.errors.validation.title",
      description:
        "app.api.v1.core.system.db.migrateRepair.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.db.migrateRepair.post.errors.network.title",
      description:
        "app.api.v1.core.system.db.migrateRepair.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.db.migrateRepair.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.db.migrateRepair.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.db.migrateRepair.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.db.migrateRepair.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.db.migrateRepair.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.db.migrateRepair.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.db.migrateRepair.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.migrateRepair.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.db.migrateRepair.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.db.migrateRepair.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.db.migrateRepair.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.migrateRepair.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.db.migrateRepair.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.db.migrateRepair.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.db.migrateRepair.post.success.title",
    description:
      "app.api.v1.core.system.db.migrateRepair.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    urlPathParams: undefined,
    requests: {
      default: {
        force: false,
        dryRun: false,
        reset: false,
      },
      dryRun: {
        force: false,
        dryRun: true,
        reset: false,
      },
      force: {
        force: true,
        dryRun: false,
        reset: false,
      },
      reset: {
        force: true,
        dryRun: false,
        reset: true,
      },
      noRepairNeeded: {
        force: false,
        dryRun: false,
        reset: false,
      },
      repaired: {
        force: false,
        dryRun: false,
        reset: false,
      },
    },
    responses: {
      default: {
        success: true,
        output:
          "✅ Migration repair completed successfully! 🚀 Ready for production builds",
        hasTable: true,
        schema: "drizzle",
        tableName: "__drizzle_migrations__",
        trackedMigrations: 5,
        migrationFiles: 5,
        repaired: 0,
      },
      dryRun: {
        success: true,
        output: "✅ Dry run completed - no changes made",
        hasTable: true,
        schema: "drizzle",
        tableName: "__drizzle_migrations__",
        trackedMigrations: 3,
        migrationFiles: 5,
        repaired: 0,
      },
      repaired: {
        success: true,
        output:
          "✅ Migration repair completed successfully! Marked 2 migrations as applied",
        hasTable: true,
        schema: "drizzle",
        tableName: "__drizzle_migrations__",
        trackedMigrations: 5,
        migrationFiles: 5,
        repaired: 2,
      },
      noRepairNeeded: {
        success: true,
        output: "✅ Migration tracking is up to date - no repair needed",
        hasTable: true,
        schema: "drizzle",
        tableName: "__drizzle_migrations__",
        trackedMigrations: 5,
        migrationFiles: 5,
        repaired: 0,
      },
      force: {
        success: true,
        output: "✅ Migration repair completed with force option",
        hasTable: true,
        schema: "drizzle",
        tableName: "__drizzle_migrations__",
        trackedMigrations: 5,
        migrationFiles: 5,
        repaired: 2,
      },
      reset: {
        success: true,
        output: "✅ Migration tracking reset and repaired successfully",
        hasTable: true,
        schema: "drizzle",
        tableName: "__drizzle_migrations__",
        trackedMigrations: 5,
        migrationFiles: 5,
        repaired: 5,
      },
    },
  },
});

export type MigrateRepairRequestInput = typeof POST.types.RequestInput;
export type MigrateRepairRequestOutput = typeof POST.types.RequestOutput;
export type MigrateRepairResponseInput = typeof POST.types.ResponseInput;
export type MigrateRepairResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
