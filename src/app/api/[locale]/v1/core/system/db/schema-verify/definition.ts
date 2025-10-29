/**
 * Database Schema Verification Endpoint Definition
 * Production-ready endpoint for verifying database schema integrity
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "db", "schema-verify"],
  title: "app.api.v1.core.system.db.schemaVerify.post.title",
  description: "app.api.v1.core.system.db.schemaVerify.post.description",
  category: "app.api.v1.core.system.db.category",
  tags: ["app.api.v1.core.system.db.schemaVerify.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["schema-verify", "db:schema-verify"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.db.schemaVerify.post.form.title",
      description:
        "app.api.v1.core.system.db.schemaVerify.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      fixIssues: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.db.schemaVerify.fields.fixIssues.title",
          description:
            "app.api.v1.core.system.db.schemaVerify.fields.fixIssues.description",
          layout: { columns: 6 },
        },
        z.boolean().optional().default(false),
      ),

      silent: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.db.schemaVerify.fields.silent.title",
          description:
            "app.api.v1.core.system.db.schemaVerify.fields.silent.description",
          layout: { columns: 6 },
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.schemaVerify.fields.success.title",
        },
        z.boolean(),
      ),

      valid: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.schemaVerify.fields.valid.title",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.schemaVerify.fields.output.title",
        },
        z.string(),
      ),

      issues: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.db.schemaVerify.fields.issues.title",
        },
        z.array(z.string()).optional(),
      ),

      fixedIssues: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.db.schemaVerify.fields.fixedIssues.title",
        },
        z.array(z.string()).optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.db.schemaVerify.post.errors.validation.title",
      description:
        "app.api.v1.core.system.db.schemaVerify.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.db.schemaVerify.post.errors.network.title",
      description:
        "app.api.v1.core.system.db.schemaVerify.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.db.schemaVerify.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.db.schemaVerify.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.db.schemaVerify.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.db.schemaVerify.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.db.schemaVerify.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.schemaVerify.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.db.schemaVerify.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.db.schemaVerify.post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.db.schemaVerify.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.db.schemaVerify.post.errors.conflict.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.db.schemaVerify.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.db.schemaVerify.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.db.schemaVerify.post.errors.server.title",
      description:
        "app.api.v1.core.system.db.schemaVerify.post.errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.db.schemaVerify.post.success.title",
    description:
      "app.api.v1.core.system.db.schemaVerify.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        fixIssues: false,
        silent: false,
      },
      verifyOnly: {
        fixIssues: false,
        silent: false,
      },
      fixIssues: {
        fixIssues: true,
        silent: false,
      },
      silent: {
        fixIssues: false,
        silent: true,
      },
      withIssues: {
        fixIssues: false,
        silent: false,
      },
      fixed: {
        fixIssues: true,
        silent: false,
      },
    },
    responses: {
      default: {
        success: true,
        valid: true,
        output: "✅ Database schema is valid",
        issues: [],
        fixedIssues: [],
      },
      verifyOnly: {
        success: true,
        valid: true,
        output: "✅ Database schema is valid",
        issues: [],
        fixedIssues: [],
      },
      fixIssues: {
        success: true,
        valid: true,
        output: "✅ Database schema issues fixed",
        issues: [],
        fixedIssues: ["Added missing index", "Updated constraint"],
      },
      silent: {
        success: true,
        valid: true,
        output: "",
        issues: [],
        fixedIssues: [],
      },
      withIssues: {
        success: true,
        valid: false,
        output: "⚠️ Database schema has issues",
        issues: [
          "Missing index on table_name.column",
          "Outdated constraint on other_table",
        ],
        fixedIssues: [],
      },
      fixed: {
        success: true,
        valid: true,
        output: "✅ Database schema issues fixed",
        issues: [],
        fixedIssues: ["Added missing index", "Updated constraint"],
      },
    },
    urlPathParams: undefined,
  },
});

const dbSchemaVerifyEndpoints = { POST };
export default dbSchemaVerifyEndpoints;

// Export types
export type SchemaVerifyRequestInput = typeof POST.types.RequestInput;
export type SchemaVerifyRequestOutput = typeof POST.types.RequestOutput;
export type SchemaVerifyResponseInput = typeof POST.types.ResponseInput;
export type SchemaVerifyResponseOutput = typeof POST.types.ResponseOutput;
