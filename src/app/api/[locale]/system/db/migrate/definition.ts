/**
 * Database Migration Endpoint Definition
 * Production-ready endpoint for running database migrations
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
  path: ["system", "db", "migrate"],
  title: "app.api.system.db.migrate.post.title",
  description: "app.api.system.db.migrate.post.description",
  category: "app.api.system.db.category",
  tags: ["app.api.system.db.migrate.tag"],
  icon: "arrow-right",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["migrate", "db:migrate"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.db.migrate.post.form.title",
      description: "app.api.system.db.migrate.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      generate: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.migrate.fields.generate.title",
        description: "app.api.system.db.migrate.fields.generate.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      redo: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.migrate.fields.redo.title",
        description: "app.api.system.db.migrate.fields.redo.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      schema: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.db.migrate.fields.schema.title",
        description: "app.api.system.db.migrate.fields.schema.description",
        columns: 12,
        schema: z.string().default("public"),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.migrate.fields.dryRun.title",
        description: "app.api.system.db.migrate.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.migrate.fields.success.title",
        schema: z.boolean(),
      }),

      migrationsRun: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.migrate.fields.migrationsRun.title",
        schema: z.coerce.number(),
      }),

      migrationsGenerated: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.migrate.fields.migrationsGenerated.title",
        schema: z.coerce.number(),
      }),

      output: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.migrate.fields.output.title",
        schema: z.string(),
      }),

      duration: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.migrate.fields.duration.title",
        schema: z.coerce.number(),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.db.migrate.post.errors.validation.title",
      description:
        "app.api.system.db.migrate.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.db.migrate.post.errors.network.title",
      description: "app.api.system.db.migrate.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.db.migrate.post.errors.unauthorized.title",
      description:
        "app.api.system.db.migrate.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.db.migrate.post.errors.forbidden.title",
      description:
        "app.api.system.db.migrate.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.db.migrate.post.errors.notFound.title",
      description: "app.api.system.db.migrate.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.db.migrate.post.errors.server.title",
      description: "app.api.system.db.migrate.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.db.migrate.post.errors.unknown.title",
      description: "app.api.system.db.migrate.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.db.migrate.post.errors.server.title",
      description: "app.api.system.db.migrate.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.db.migrate.post.errors.conflict.title",
      description: "app.api.system.db.migrate.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.db.migrate.post.success.title",
    description: "app.api.system.db.migrate.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        generate: false,
        redo: false,
        schema: "public",
        dryRun: false,
      },
      generate: {
        generate: true,
        redo: false,
        schema: "public",
        dryRun: false,
      },
      redo: {
        generate: false,
        redo: true,
        schema: "public",
        dryRun: false,
      },
      dryRun: {
        generate: false,
        redo: false,
        schema: "public",
        dryRun: true,
      },
    },
    responses: {
      default: {
        success: true,
        migrationsRun: 3,
        migrationsGenerated: 0,
        output: "✅ Database migrations completed successfully",
        duration: 1250,
      },
      generate: {
        success: true,
        migrationsRun: 0,
        migrationsGenerated: 2,
        output: "✅ Migration files generated successfully",
        duration: 500,
      },
      redo: {
        success: true,
        migrationsRun: 1,
        migrationsGenerated: 0,
        output: "✅ Last migration rolled back and re-run successfully",
        duration: 800,
      },
      dryRun: {
        success: true,
        migrationsRun: 0,
        migrationsGenerated: 0,
        output: "✅ Dry run completed - 3 migrations would be executed",
        duration: 200,
      },
    },
  },
});

const endpoints = { POST };
export default endpoints;

// Export types
export type MigrateRequestInput = typeof POST.types.RequestInput;
export type MigrateRequestOutput = typeof POST.types.RequestOutput;
export type MigrateResponseInput = typeof POST.types.ResponseInput;
export type MigrateResponseOutput = typeof POST.types.ResponseOutput;
