/**
 * Run database seeds Endpoint Definition
 * Production-ready endpoint for run database seeds
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

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "db", "seed"],
  title: "app.api.system.db.seed.post.title",
  description: "app.api.system.db.seed.post.description",
  category: "app.api.system.category",
  tags: ["app.api.system.db.seed.tag"],
  icon: "leaf",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["seed", "db:seed"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.db.seed.post.form.title",
      description: "app.api.system.db.seed.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      verbose: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.seed.fields.verbose.title",
        description: "app.api.system.db.seed.fields.verbose.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.seed.fields.dryRun.title",
        description: "app.api.system.db.seed.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.seed.fields.success.title",
        schema: z.boolean(),
      }),

      isDryRun: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.seed.fields.isDryRun.title",
        schema: z.boolean(),
      }),

      seedsExecuted: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.seed.fields.seedsExecuted.title",
        schema: z.coerce.number(),
      }),

      collections: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.db.seed.fields.collections.title",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 3,
          },
          { response: true },
          {
            name: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.db.seed.fields.collections.name.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            status: responseField({
              type: WidgetType.BADGE,
              text: "app.api.system.db.seed.fields.collections.status.title",
              schema: z.enum(["success", "skipped", "failed"]),
            }),
            recordsCreated: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.db.seed.fields.collections.recordsCreated.title",
              fieldType: FieldDataType.NUMBER,
              schema: z.coerce.number(),
            }),
          },
        ),
      ),

      totalRecords: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.seed.fields.totalRecords.title",
        schema: z.coerce.number(),
      }),

      duration: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.db.seed.fields.duration.title",
        schema: z.coerce.number(),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.db.seed.post.errors.validation.title",
      description: "app.api.system.db.seed.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.db.seed.post.errors.unauthorized.title",
      description:
        "app.api.system.db.seed.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.db.seed.post.errors.server.title",
      description: "app.api.system.db.seed.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.db.seed.post.errors.network.title",
      description: "app.api.system.db.seed.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.db.seed.post.errors.forbidden.title",
      description: "app.api.system.db.seed.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.db.seed.post.errors.notFound.title",
      description: "app.api.system.db.seed.post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.db.seed.post.errors.conflict.title",
      description: "app.api.system.db.seed.post.errors.conflict.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.db.seed.post.errors.unknown.title",
      description: "app.api.system.db.seed.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.db.seed.post.errors.server.title",
      description: "app.api.system.db.seed.post.errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.db.seed.post.success.title",
    description: "app.api.system.db.seed.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        verbose: false,
        dryRun: false,
      },
      verbose: {
        verbose: true,
        dryRun: false,
      },
      dryRun: {
        verbose: false,
        dryRun: true,
      },
    },
    responses: {
      default: {
        success: true,
        isDryRun: false,
        seedsExecuted: 12,
        collections: [
          { name: "users", status: "success", recordsCreated: 10 },
          { name: "roles", status: "success", recordsCreated: 5 },
          { name: "permissions", status: "success", recordsCreated: 25 },
        ],
        totalRecords: 260,
        duration: 2500,
      },
      verbose: {
        success: true,
        isDryRun: false,
        seedsExecuted: 12,
        collections: [
          { name: "users", status: "success", recordsCreated: 10 },
          { name: "roles", status: "success", recordsCreated: 5 },
          { name: "permissions", status: "success", recordsCreated: 25 },
          { name: "profiles", status: "success", recordsCreated: 10 },
          { name: "settings", status: "success", recordsCreated: 50 },
          { name: "business-data", status: "success", recordsCreated: 20 },
          { name: "social-accounts", status: "success", recordsCreated: 15 },
          { name: "email-templates", status: "success", recordsCreated: 30 },
          { name: "notifications", status: "success", recordsCreated: 40 },
          { name: "webhooks", status: "success", recordsCreated: 8 },
          { name: "api-keys", status: "success", recordsCreated: 12 },
          { name: "audit-logs", status: "success", recordsCreated: 35 },
        ],
        totalRecords: 260,
        duration: 2800,
      },
      dryRun: {
        success: true,
        isDryRun: true,
        seedsExecuted: 0,
        collections: [
          { name: "users", status: "skipped", recordsCreated: 0 },
          { name: "roles", status: "skipped", recordsCreated: 0 },
          { name: "permissions", status: "skipped", recordsCreated: 0 },
        ],
        totalRecords: 0,
        duration: 500,
      },
    },
  },
});

const endpoints = { POST } as const;
export default endpoints;

// Export types
export type SeedRequestInput = typeof POST.types.RequestInput;
export type SeedRequestOutput = typeof POST.types.RequestOutput;
export type SeedResponseInput = typeof POST.types.ResponseInput;
export type SeedResponseOutput = typeof POST.types.ResponseOutput;
