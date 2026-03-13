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
  path: ["system", "db", "migrate-prod"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.systemDatabase",
  tags: ["tag"],
  icon: "git-branch",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["migrate-prod", "db:migrate-prod"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      skipSeeding: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipSeeding.title",
        description: "fields.skipSeeding.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

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

      environment: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.environment.title",
        schema: z.string(),
      }),

      databaseUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.databaseUrl.title",
        schema: z.string(),
      }),

      migrationsGenerated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.migrationsGenerated.title",
        schema: z.boolean(),
      }),

      migrationsApplied: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.migrationsApplied.title",
        schema: z.boolean(),
      }),

      seedingCompleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.seedingCompleted.title",
        schema: z.boolean(),
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
