/**
 * Database Reset Endpoint Definition
 * Production-ready endpoint for resetting database
 * Following migration guide patterns
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
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

/**
 * Database Reset Endpoint Definition
 */
const { POST } = createEndpoint({
  scopedTranslation,
  title: "post.title",
  description: "post.description",
  category: "category",
  tags: ["tag"],
  icon: "rotate-ccw",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["reset", "db:reset"],
  method: Methods.POST,
  path: ["system", "db", "reset"],
  examples: {
    requests: {
      default: {
        force: false,
        skipMigrations: false,
        skipSeeds: false,
        dryRun: false,
      },
      destructive: {
        force: true,
        skipMigrations: false,
        skipSeeds: false,
        dryRun: false,
      },
      skipSeeds: {
        force: false,
        skipMigrations: false,
        skipSeeds: true,
        dryRun: false,
      },
      dryRun: {
        force: false,
        skipMigrations: false,
        skipSeeds: false,
        dryRun: true,
      },
      forced: {
        force: true,
        skipMigrations: false,
        skipSeeds: false,
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        operations: [
          {
            type: "truncate",
            status: "skipped",
            details: "Requires --force flag",
            count: 0,
          },
          {
            type: "migrate",
            status: "pending",
            details: "Not executed",
            count: 0,
          },
          {
            type: "seed",
            status: "pending",
            details: "Not executed",
            count: 0,
          },
        ],
        tablesAffected: 0,
        migrationsRun: 0,
        seedsRun: 0,
        isDryRun: false,
        requiresForce: true,
        duration: 50,
      },
      forced: {
        success: true,
        operations: [
          {
            type: "truncate",
            status: "success",
            details: "Truncated all tables",
            count: 45,
          },
          {
            type: "migrate",
            status: "success",
            details: "Applied migrations",
            count: 24,
          },
          {
            type: "seed",
            status: "success",
            details: "Seeded data",
            count: 12,
          },
        ],
        tablesAffected: 45,
        migrationsRun: 24,
        seedsRun: 12,
        isDryRun: false,
        requiresForce: false,
        duration: 1200,
      },
      dryRun: {
        success: true,
        operations: [
          {
            type: "truncate",
            status: "skipped",
            details: "Dry run mode",
            count: 45,
          },
          {
            type: "migrate",
            status: "skipped",
            details: "Dry run mode",
            count: 24,
          },
          {
            type: "seed",
            status: "skipped",
            details: "Dry run mode",
            count: 12,
          },
        ],
        tablesAffected: 0,
        migrationsRun: 0,
        seedsRun: 0,
        isDryRun: true,
        requiresForce: false,
        duration: 100,
      },
      destructive: {
        success: true,
        operations: [
          {
            type: "truncate",
            status: "success",
            details: "Truncated all tables",
            count: 45,
          },
          {
            type: "migrate",
            status: "success",
            details: "Applied migrations",
            count: 24,
          },
          {
            type: "seed",
            status: "success",
            details: "Seeded data",
            count: 12,
          },
        ],
        tablesAffected: 45,
        migrationsRun: 24,
        seedsRun: 12,
        isDryRun: false,
        requiresForce: false,
        duration: 1200,
      },
      skipSeeds: {
        success: true,
        operations: [
          {
            type: "truncate",
            status: "success",
            details: "Truncated all tables",
            count: 45,
          },
          {
            type: "migrate",
            status: "success",
            details: "Applied migrations",
            count: 24,
          },
          {
            type: "seed",
            status: "skipped",
            details: "Seeds skipped",
            count: 0,
          },
        ],
        tablesAffected: 45,
        migrationsRun: 24,
        seedsRun: 0,
        isDryRun: false,
        requiresForce: false,
        duration: 800,
      },
    },
  },

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===

      force: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.force.title",
        description: "fields.force.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      skipMigrations: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipMigrations.title",
        description: "fields.skipMigrations.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      skipSeeds: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipSeeds.title",
        description: "fields.skipSeeds.description",
        columns: 6,
        schema: z.boolean().default(false),
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

      operations: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "fields.operations.title",
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 4,
          usage: { response: true },
          children: {
            type: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.operations.type.title",
              fieldType: FieldDataType.TEXT,
              schema: z.enum(["truncate", "migrate", "seed"]),
            }),
            status: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "fields.operations.status.title",
              schema: z.enum(["success", "skipped", "failed", "pending"]),
            }),
            details: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.operations.details.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            count: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.operations.count.title",
              fieldType: FieldDataType.NUMBER,
              schema: z.coerce.number(),
            }),
          },
        }),
      }),

      tablesAffected: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.tablesAffected.title",
        schema: z.coerce.number(),
      }),

      migrationsRun: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.migrationsRun.title",
        schema: z.coerce.number(),
      }),

      seedsRun: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.seedsRun.title",
        schema: z.coerce.number(),
      }),

      isDryRun: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.isDryRun.title",
        schema: z.boolean(),
      }),

      requiresForce: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.requiresForce.title",
        schema: z.boolean(),
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
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
});

const endpoints = { POST };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type DbResetRequestInput = typeof POST.types.RequestInput;
export type DbResetRequestOutput = typeof POST.types.RequestOutput;
export type DbResetResponseInput = typeof POST.types.ResponseInput;
export type DbResetResponseOutput = typeof POST.types.ResponseOutput;
