/**
 * Database Migration Endpoint Definition
 * Production-ready endpoint for running database migrations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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
  path: ["system", "db", "migrate"],
  title: "post.title",
  description: "post.description",
  category: "category",
  tags: ["tag"],
  icon: "arrow-right",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["migrate", "db:migrate"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      generate: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.generate.title",
        description: "fields.generate.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      redo: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.redo.title",
        description: "fields.redo.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      schema: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.schema.title",
        description: "fields.schema.description",
        columns: 12,
        schema: z.string().default("public"),
      }),

      dryRun: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.dryRun.title",
        description: "fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.success.title",
        schema: z.boolean(),
      }),

      migrationsRun: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.migrationsRun.title",
        schema: z.coerce.number(),
      }),

      migrationsGenerated: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.migrationsGenerated.title",
        schema: z.coerce.number(),
      }),

      output: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.output.title",
        schema: z.string(),
      }),

      duration: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.duration.title",
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
