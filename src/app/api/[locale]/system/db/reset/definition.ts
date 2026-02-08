/**
 * Database Reset Endpoint Definition
 * Production-ready endpoint for resetting database
 * Following migration guide patterns
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
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

/**
 * Database Reset Endpoint Definition
 */
const { POST } = createEndpoint({
  title: "app.api.system.db.reset.post.title",
  description: "app.api.system.db.reset.post.description",
  category: "app.api.system.db.category",
  tags: ["app.api.system.db.reset.tag"],
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

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.db.reset.post.form.title",
      description: "app.api.system.db.reset.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===

      force: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.reset.fields.force.title",
        description: "app.api.system.db.reset.fields.force.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      skipMigrations: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.reset.fields.skipMigrations.title",
        description:
          "app.api.system.db.reset.fields.skipMigrations.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      skipSeeds: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.reset.fields.skipSeeds.title",
        description: "app.api.system.db.reset.fields.skipSeeds.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.reset.fields.dryRun.title",
        description: "app.api.system.db.reset.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.reset.fields.success.title",
        schema: z.boolean(),
      }),

      operations: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.db.reset.fields.operations.title",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 4,
          },
          { response: true },
          {
            type: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.db.reset.fields.operations.type.title",
              fieldType: FieldDataType.TEXT,
              schema: z.enum(["truncate", "migrate", "seed"]),
            }),
            status: responseField({
              type: WidgetType.BADGE,
              text: "app.api.system.db.reset.fields.operations.status.title",
              schema: z.enum(["success", "skipped", "failed", "pending"]),
            }),
            details: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.db.reset.fields.operations.details.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            count: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.db.reset.fields.operations.count.title",
              fieldType: FieldDataType.NUMBER,
              schema: z.coerce.number(),
            }),
          },
        ),
      ),

      tablesAffected: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.reset.fields.tablesAffected.title",
        schema: z.coerce.number(),
      }),

      migrationsRun: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.reset.fields.migrationsRun.title",
        schema: z.coerce.number(),
      }),

      seedsRun: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.reset.fields.seedsRun.title",
        schema: z.coerce.number(),
      }),

      isDryRun: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.reset.fields.isDryRun.title",
        schema: z.boolean(),
      }),

      requiresForce: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.reset.fields.requiresForce.title",
        schema: z.boolean(),
      }),

      duration: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.reset.fields.duration.title",
        schema: z.coerce.number(),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.db.reset.post.errors.validation.title",
      description: "app.api.system.db.reset.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.db.reset.post.errors.unauthorized.title",
      description:
        "app.api.system.db.reset.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.db.reset.post.errors.server.title",
      description: "app.api.system.db.reset.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.db.reset.post.errors.network.title",
      description: "app.api.system.db.reset.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.db.reset.post.errors.notFound.title",
      description: "app.api.system.db.reset.post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.db.reset.post.errors.conflict.title",
      description: "app.api.system.db.reset.post.errors.conflict.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.db.reset.post.errors.forbidden.title",
      description: "app.api.system.db.reset.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.db.reset.post.errors.unknown.title",
      description: "app.api.system.db.reset.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.db.reset.post.errors.server.title",
      description: "app.api.system.db.reset.post.errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.db.reset.post.success.title",
    description: "app.api.system.db.reset.post.success.description",
  },
});

const endpoints = { POST };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type DbResetRequestInput = typeof POST.types.RequestInput;
export type DbResetRequestOutput = typeof POST.types.RequestOutput;
export type DbResetResponseInput = typeof POST.types.ResponseInput;
export type DbResetResponseOutput = typeof POST.types.ResponseOutput;
