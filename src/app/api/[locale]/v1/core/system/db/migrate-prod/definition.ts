/**
 * Database Production Migration Command Endpoint Definition
 * Production-ready endpoint for running production migrations
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "db", "migrate-prod"],
  title: "app.api.v1.core.system.db.migrateProd.post.title",
  description: "app.api.v1.core.system.db.migrateProd.post.description",
  category: "app.api.v1.core.system.db.category",
  tags: ["app.api.v1.core.system.db.migrateProd.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["migrate-prod", "db:migrate-prod"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.db.migrateProd.post.form.title",
      description:
        "app.api.v1.core.system.db.migrateProd.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      skipSeeding: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.db.migrateProd.fields.skipSeeding.title",
          description:
            "app.api.v1.core.system.db.migrateProd.fields.skipSeeding.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.migrateProd.fields.force.title",
          description:
            "app.api.v1.core.system.db.migrateProd.fields.force.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.migrateProd.fields.dryRun.title",
          description:
            "app.api.v1.core.system.db.migrateProd.fields.dryRun.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.migrateProd.fields.success.title",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.migrateProd.fields.output.title",
        },
        z.string(),
      ),

      environment: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateProd.fields.environment.title",
        },
        z.string(),
      ),

      databaseUrl: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateProd.fields.databaseUrl.title",
        },
        z.string(),
      ),

      migrationsGenerated: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateProd.fields.migrationsGenerated.title",
        },
        z.boolean(),
      ),

      migrationsApplied: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateProd.fields.migrationsApplied.title",
        },
        z.boolean(),
      ),

      seedingCompleted: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.migrateProd.fields.seedingCompleted.title",
        },
        z.boolean(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.db.migrateProd.post.errors.validation.title",
      description:
        "app.api.v1.core.system.db.migrateProd.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.db.migrateProd.post.errors.network.title",
      description:
        "app.api.v1.core.system.db.migrateProd.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.db.migrateProd.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.db.migrateProd.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.db.migrateProd.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.db.migrateProd.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.db.migrateProd.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.db.migrateProd.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.db.migrateProd.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.migrateProd.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.db.migrateProd.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.db.migrateProd.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.db.migrateProd.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.migrateProd.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.db.migrateProd.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.db.migrateProd.post.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.db.migrateProd.post.success.title",
    description:
      "app.api.v1.core.system.db.migrateProd.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    urlPathVariables: undefined,
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
