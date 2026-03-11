/**
 * Database Migration Sync Command Endpoint Definition
 * Production-ready endpoint for synchronizing migration state
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
  path: ["system", "db", "migrate-sync"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.system",
  tags: ["tag"],
  icon: "refresh-cw",
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF, UserRole.AI_TOOL_OFF],
  aliases: ["migrate-sync", "db:migrate-sync"],

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
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.dryRun.title",
        description: "fields.dryRun.description",
        columns: 6,
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

      trackingCleared: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.trackingCleared.title",
        schema: z.boolean(),
      }),

      trackingFilesCreated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.trackingFilesCreated.title",
        schema: z.boolean(),
      }),

      drizzleMigrationRun: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.drizzleMigrationRun.title",
        schema: z.boolean(),
      }),

      originalFilesRestored: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.originalFilesRestored.title",
        schema: z.boolean(),
      }),

      migrationsProcessed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.migrationsProcessed.title",
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
