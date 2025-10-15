/**
 * Database Reset Endpoint Definition
 * Production-ready endpoint for resetting database
 * Following migration guide patterns
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

/**
 * Database Reset Endpoint Definition
 */
const { POST } = createEndpoint({
  title: "app.api.v1.core.system.db.reset.post.title",
  description: "app.api.v1.core.system.db.reset.post.description",
  category: "app.api.v1.core.system.db.category",
  tags: ["app.api.v1.core.system.db.reset.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  aliases: ["reset", "db:reset"],
  method: Methods.POST,
  path: ["v1", "core", "system", "db", "reset"],
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
    urlPathVariables: undefined,
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
      title: "app.api.v1.core.system.db.reset.post.form.title",
      description: "app.api.v1.core.system.db.reset.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===

      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.reset.fields.force.title",
          description:
            "app.api.v1.core.system.db.reset.fields.force.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      skipMigrations: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.reset.fields.skipMigrations.title",
          description:
            "app.api.v1.core.system.db.reset.fields.skipMigrations.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      skipSeeds: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.reset.fields.skipSeeds.title",
          description:
            "app.api.v1.core.system.db.reset.fields.skipSeeds.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.reset.fields.dryRun.title",
          description:
            "app.api.v1.core.system.db.reset.fields.dryRun.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.reset.fields.success.title",
        },
        z.boolean(),
      ),

      operations: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.reset.fields.operations.title",
        },
        z.array(
          z.object({
            type: z.enum(["truncate", "migrate", "seed"]),
            status: z.enum(["success", "skipped", "failed", "pending"]),
            details: z.string(),
            count: z.number(),
          }),
        ),
      ),

      tablesAffected: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.reset.fields.tablesAffected.title",
        },
        z.number(),
      ),

      migrationsRun: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.reset.fields.migrationsRun.title",
        },
        z.number(),
      ),

      seedsRun: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.reset.fields.seedsRun.title",
        },
        z.number(),
      ),

      isDryRun: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.reset.fields.isDryRun.title",
        },
        z.boolean(),
      ),

      requiresForce: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.reset.fields.requiresForce.title",
        },
        z.boolean(),
      ),

      duration: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.reset.fields.duration.title",
        },
        z.number(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.system.db.reset.post.errors.validation.title",
      description:
        "app.api.v1.core.system.db.reset.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.system.db.reset.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.db.reset.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.db.reset.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.reset.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.db.reset.post.errors.network.title",
      description:
        "app.api.v1.core.system.db.reset.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.db.reset.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.db.reset.post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.db.reset.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.db.reset.post.errors.conflict.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.system.db.reset.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.db.reset.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.db.reset.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.db.reset.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.db.reset.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.reset.post.errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.db.reset.post.success.title",
    description: "app.api.v1.core.system.db.reset.post.success.description",
  },
});

const endpoints = { POST };
export default endpoints;

// Export types for repository usage - following migration guide pattern
export type DbResetRequestInput = typeof POST.types.RequestInput;
export type DbResetRequestOutput = typeof POST.types.RequestOutput;
export type DbResetResponseInput = typeof POST.types.ResponseInput;
export type DbResetResponseOutput = typeof POST.types.ResponseOutput;
