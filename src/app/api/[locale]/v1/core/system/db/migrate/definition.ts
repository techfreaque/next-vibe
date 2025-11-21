/**
 * Database Migration Endpoint Definition
 * Production-ready endpoint for running database migrations
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
  path: ["v1", "core", "system", "db", "migrate"],
  title: "app.api.v1.core.system.db.migrate.post.title",
  description: "app.api.v1.core.system.db.migrate.post.description",
  category: "app.api.v1.core.system.db.category",
  tags: ["app.api.v1.core.system.db.migrate.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["migrate", "db:migrate"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.db.migrate.post.form.title",
      description: "app.api.v1.core.system.db.migrate.post.form.description",
      layoutType: LayoutType.GRID, columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      generate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.migrate.fields.generate.title",
          description:
            "app.api.v1.core.system.db.migrate.fields.generate.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      redo: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.migrate.fields.redo.title",
          description:
            "app.api.v1.core.system.db.migrate.fields.redo.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      schema: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.db.migrate.fields.schema.title",
          description:
            "app.api.v1.core.system.db.migrate.fields.schema.description",
          columns: 12,
        },
        z.string().default("public"),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.migrate.fields.dryRun.title",
          description:
            "app.api.v1.core.system.db.migrate.fields.dryRun.description",
          columns: 6,
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.migrate.fields.success.title",
        },
        z.boolean(),
      ),

      migrationsRun: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrate.fields.migrationsRun.title",
        },
        z.number(),
      ),

      migrationsGenerated: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrate.fields.migrationsGenerated.title",
        },
        z.number(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.migrate.fields.output.title",
        },
        z.string(),
      ),

      duration: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.migrate.fields.duration.title",
        },
        z.number(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.system.db.migrate.post.errors.validation.title",
      description:
        "app.api.v1.core.system.db.migrate.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.db.migrate.post.errors.network.title",
      description:
        "app.api.v1.core.system.db.migrate.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.system.db.migrate.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.db.migrate.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.system.db.migrate.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.db.migrate.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.db.migrate.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.db.migrate.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.db.migrate.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.migrate.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.db.migrate.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.db.migrate.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.db.migrate.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.migrate.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.db.migrate.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.db.migrate.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.db.migrate.post.success.title",
    description: "app.api.v1.core.system.db.migrate.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    urlPathParams: undefined,
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
