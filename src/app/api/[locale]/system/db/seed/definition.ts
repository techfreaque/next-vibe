/**
 * Run database seeds Endpoint Definition
 * Production-ready endpoint for run database seeds
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

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "db", "seed"],
  title: "post.title",
  description: "post.description",
  category: "category",
  tags: ["tag"],
  icon: "leaf",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["seed", "db:seed"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      verbose: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.verbose.title",
        description: "fields.verbose.description",
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

      isDryRun: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.isDryRun.title",
        schema: z.boolean(),
      }),

      seedsExecuted: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.seedsExecuted.title",
        schema: z.coerce.number(),
      }),

      collections: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "fields.collections.title",
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 3,
          usage: { response: true },
          children: {
            name: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.collections.name.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            status: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "fields.collections.status.title",
              schema: z.enum(["success", "skipped", "failed"]),
            }),
            recordsCreated: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "fields.collections.recordsCreated.title",
              fieldType: FieldDataType.NUMBER,
              schema: z.coerce.number(),
            }),
          },
        }),
      }),

      totalRecords: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.totalRecords.title",
        schema: z.coerce.number(),
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
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
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
