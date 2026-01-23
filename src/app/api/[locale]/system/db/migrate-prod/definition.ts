/**
 * Database Production Migration Command Endpoint Definition
 * Production-ready endpoint for running production migrations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "db", "migrate-prod"],
  title: "app.api.system.db.migrateProd.post.title",
  description: "app.api.system.db.migrateProd.post.description",
  category: "app.api.system.db.category",
  tags: ["app.api.system.db.migrateProd.tag"],
  icon: "git-branch",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["migrate-prod", "db:migrate-prod"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.db.migrateProd.post.form.title",
      description: "app.api.system.db.migrateProd.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      skipSeeding: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.migrateProd.fields.skipSeeding.title",
        description:
          "app.api.system.db.migrateProd.fields.skipSeeding.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      force: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.migrateProd.fields.force.title",
        description: "app.api.system.db.migrateProd.fields.force.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.migrateProd.fields.dryRun.title",
        description: "app.api.system.db.migrateProd.fields.dryRun.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.migrateProd.fields.success.title",
        schema: z.boolean(),
      }),

      output: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.migrateProd.fields.output.title",
        schema: z.string(),
      }),

      environment: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.migrateProd.fields.environment.title",
        schema: z.string(),
      }),

      databaseUrl: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.migrateProd.fields.databaseUrl.title",
        schema: z.string(),
      }),

      migrationsGenerated: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.db.migrateProd.fields.migrationsGenerated.title",
        schema: z.boolean(),
      }),

      migrationsApplied: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.migrateProd.fields.migrationsApplied.title",
        schema: z.boolean(),
      }),

      seedingCompleted: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.migrateProd.fields.seedingCompleted.title",
        schema: z.boolean(),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.db.migrateProd.post.errors.validation.title",
      description:
        "app.api.system.db.migrateProd.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.db.migrateProd.post.errors.network.title",
      description:
        "app.api.system.db.migrateProd.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.db.migrateProd.post.errors.unauthorized.title",
      description:
        "app.api.system.db.migrateProd.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.db.migrateProd.post.errors.forbidden.title",
      description:
        "app.api.system.db.migrateProd.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.db.migrateProd.post.errors.notFound.title",
      description:
        "app.api.system.db.migrateProd.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.db.migrateProd.post.errors.server.title",
      description:
        "app.api.system.db.migrateProd.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.db.migrateProd.post.errors.unknown.title",
      description:
        "app.api.system.db.migrateProd.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.db.migrateProd.post.errors.server.title",
      description:
        "app.api.system.db.migrateProd.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.db.migrateProd.post.errors.conflict.title",
      description:
        "app.api.system.db.migrateProd.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.db.migrateProd.post.success.title",
    description: "app.api.system.db.migrateProd.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        skipSeeding: false,
        force: false,
        dryRun: false,
      },
      skipSeeding: {
        skipSeeding: true,
        force: false,
        dryRun: false,
      },
      force: {
        skipSeeding: false,
        force: true,
        dryRun: false,
      },
      dryRun: {
        skipSeeding: false,
        force: false,
        dryRun: true,
      },
    },
    responses: {
      default: {
        success: true,
        output:
          "✅ Production migration completed successfully! 🚀 Ready for deployment",
        environment: "production",
        databaseUrl: "postgresql://user:***@prod-server:5432/db",
        migrationsGenerated: true,
        migrationsApplied: true,
        seedingCompleted: true,
      },
      skipSeeding: {
        success: true,
        output:
          "✅ Production migration completed successfully (seeding skipped)! 🚀 Ready for deployment",
        environment: "production",
        databaseUrl: "postgresql://user:***@prod-server:5432/db",
        migrationsGenerated: true,
        migrationsApplied: true,
        seedingCompleted: false,
      },
      dryRun: {
        success: true,
        output: "✅ Dry run completed - no changes made",
        environment: "production",
        databaseUrl: "postgresql://user:***@prod-server:5432/db",
        migrationsGenerated: false,
        migrationsApplied: false,
        seedingCompleted: false,
      },
      force: {
        success: true,
        output:
          "✅ Production migration forced successfully (ignored safety checks)! 🚀 Ready for deployment",
        environment: "production",
        databaseUrl: "postgresql://user:***@prod-server:5432/db",
        migrationsGenerated: true,
        migrationsApplied: true,
        seedingCompleted: true,
      },
    },
  },
});

export type MigrateProdRequestInput = typeof POST.types.RequestInput;
export type MigrateProdRequestOutput = typeof POST.types.RequestOutput;
export type MigrateProdResponseInput = typeof POST.types.ResponseInput;
export type MigrateProdResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
