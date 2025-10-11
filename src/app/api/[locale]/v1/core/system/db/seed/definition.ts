/**
 * Run database seeds Endpoint Definition
 * Production-ready endpoint for run database seeds
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
  path: ["v1", "core", "system", "db", "seed"],
  title: "app.api.v1.core.system.db.seed.post.title",
  description: "app.api.v1.core.system.db.seed.post.description",
  category: "app.api.v1.core.system.db.category",
  tags: ["app.api.v1.core.system.db.seed.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  aliases: ["seed", "db:seed"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.db.seed.post.form.title",
      description: "app.api.v1.core.system.db.seed.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.seed.fields.verbose.title",
          description:
            "app.api.v1.core.system.db.seed.fields.verbose.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.seed.fields.dryRun.title",
          description:
            "app.api.v1.core.system.db.seed.fields.dryRun.description",
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.seed.fields.success.title",
        },
        z.boolean(),
      ),

      isDryRun: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.seed.fields.isDryRun.title",
        },
        z.boolean(),
      ),

      seedsExecuted: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.seed.fields.seedsExecuted.title",
        },
        z.number(),
      ),

      collections: responseField(
        {
          type: WidgetType.DATA_TABLE,
          title: "app.api.v1.core.system.db.seed.fields.collections.title",
          columns: [
            {
              key: "name",
              label:
                "app.api.v1.core.system.db.seed.fields.collections.name.title",
              type: FieldDataType.TEXT,
            },
            {
              key: "status",
              label:
                "app.api.v1.core.system.db.seed.fields.collections.status.title",
              type: FieldDataType.TEXT,
            },
            {
              key: "recordsCreated",
              label:
                "app.api.v1.core.system.db.seed.fields.collections.recordsCreated.title",
              type: FieldDataType.NUMBER,
            },
          ],
        },
        z.array(
          z.object({
            name: z.string(),
            status: z.enum(["success", "skipped", "failed"]),
            recordsCreated: z.number(),
          }),
        ),
      ),

      totalRecords: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.seed.fields.totalRecords.title",
        },
        z.number(),
      ),

      duration: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.seed.fields.duration.title",
        },
        z.number(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.system.db.seed.post.errors.validation.title",
      description:
        "app.api.v1.core.system.db.seed.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.system.db.seed.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.db.seed.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.db.seed.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.seed.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.db.seed.post.errors.network.title",
      description:
        "app.api.v1.core.system.db.seed.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.system.db.seed.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.db.seed.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.db.seed.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.db.seed.post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.db.seed.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.db.seed.post.errors.conflict.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.db.seed.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.db.seed.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.db.seed.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.seed.post.errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.db.seed.post.success.title",
    description: "app.api.v1.core.system.db.seed.post.success.description",
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
    urlPathVariables: undefined,
  },
});

const endpoints = { POST };
export default endpoints;

// Export types
export type SeedRequestInput = typeof POST.types.RequestInput;
export type SeedRequestOutput = typeof POST.types.RequestOutput;
export type SeedResponseInput = typeof POST.types.ResponseInput;
export type SeedResponseOutput = typeof POST.types.ResponseOutput;
