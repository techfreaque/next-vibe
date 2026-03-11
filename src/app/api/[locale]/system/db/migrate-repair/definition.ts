/**
 * Database Migration Repair Command Endpoint Definition
 * Production-ready endpoint for repairing migration tracking
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

import { UserRole } from "../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "db", "migrate-repair"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.system",
  tags: ["tag"],
  icon: "refresh-cw",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["migrate-repair", "db:migrate-repair"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.force.title",
        description: "fields.force.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.dryRun.title",
        description: "fields.dryRun.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      reset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.reset.title",
        description: "fields.reset.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.success.title",
        schema: z.boolean(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.output.title",
        schema: z.string(),
      }),

      hasTable: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.hasTable.title",
        schema: z.boolean(),
      }),

      schema: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.schema.title",
        schema: z.string(),
      }),

      tableName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.tableName.title",
        schema: z.string(),
      }),

      trackedMigrations: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.trackedMigrations.title",
        schema: z.coerce.number(),
      }),

      migrationFiles: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.migrationFiles.title",
        schema: z.coerce.number(),
      }),

      repaired: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.repaired.title",
        schema: z.coerce.number(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  // === EXAMPLES ===
  examples: {
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
