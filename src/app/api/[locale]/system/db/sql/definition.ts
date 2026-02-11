/**
 * Database SQL Execution Endpoint Definition
 * Production-ready endpoint for executing SQL queries
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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
  path: ["system", "db", "sql"],
  title: "app.api.system.db.sql.post.title",
  description: "app.api.system.db.sql.post.description",
  category: "app.api.system.db.category",
  tags: ["app.api.system.db.sql.tag"],
  icon: "terminal",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["sql", "db:sql"],
  cli: {
    firstCliArgKey: "query",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.db.sql.post.form.title",
      description: "app.api.system.db.sql.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      query: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "app.api.system.db.sql.fields.query.title",
        description: "app.api.system.db.sql.fields.query.description",
        columns: 12,
        schema: z.string().optional(),
      }),

      queryFile: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.db.sql.fields.queryFile.title",
        description: "app.api.system.db.sql.fields.queryFile.description",
        placeholder: "app.api.system.db.sql.fields.queryFile.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.sql.fields.dryRun.title",
        description: "app.api.system.db.sql.fields.dryRun.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      verbose: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.db.sql.fields.verbose.title",
        description: "app.api.system.db.sql.fields.verbose.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      limit: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.system.db.sql.fields.limit.title",
        description: "app.api.system.db.sql.fields.limit.description",
        columns: 4,
        schema: z.coerce.number().optional().default(100),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        label: "app.api.system.db.sql.fields.success.title",
        schema: z.boolean(),
      }),

      output: responseField({
        type: WidgetType.TEXT,
        label: "app.api.system.db.sql.fields.output.title",
        schema: z.string(),
      }),

      results: responseField({
        type: WidgetType.TEXT,
        label: "app.api.system.db.sql.fields.results.title",
        schema: z.array(z.record(z.string(), z.any())).optional(),
      }),

      rowCount: responseField({
        type: WidgetType.TEXT,
        label: "app.api.system.db.sql.fields.rowCount.title",
        schema: z.coerce.number().optional(),
      }),

      queryType: responseField({
        type: WidgetType.TEXT,
        label: "app.api.system.db.sql.fields.queryType.title",
        schema: z.string().optional(),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.db.sql.post.errors.validation.title",
      description: "app.api.system.db.sql.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.db.sql.post.errors.unauthorized.title",
      description: "app.api.system.db.sql.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.db.sql.post.errors.forbidden.title",
      description: "app.api.system.db.sql.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.db.sql.post.errors.server.title",
      description: "app.api.system.db.sql.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.db.sql.post.errors.network.title",
      description: "app.api.system.db.sql.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.db.sql.post.errors.notFound.title",
      description: "app.api.system.db.sql.post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.db.sql.post.errors.conflict.title",
      description: "app.api.system.db.sql.post.errors.conflict.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.db.sql.post.errors.unknown.title",
      description: "app.api.system.db.sql.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.db.sql.post.errors.server.title",
      description: "app.api.system.db.sql.post.errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.db.sql.post.success.title",
    description: "app.api.system.db.sql.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        query: "SELECT * FROM users LIMIT 10",
        dryRun: false,
        verbose: false,
        limit: 100,
      },
      fileUpload: {
        queryFile: "./queries/weekly-users.sql",
        dryRun: false,
        verbose: false,
        limit: 100,
      },
      dryRun: {
        query: "UPDATE users SET email = 'test@example.com' WHERE id = 1",
        dryRun: true,
        verbose: true,
        limit: 100,
      },
      verbose: {
        query: "SELECT COUNT(*) as total_users FROM users",
        dryRun: false,
        verbose: true,
        limit: 100,
      },
      count: {
        query: "SELECT COUNT(*) as total FROM users",
        dryRun: false,
        verbose: false,
        limit: 100,
      },
    },
    responses: {
      default: {
        success: true,
        output: "✅ Query executed successfully",
        results: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" },
        ],
        rowCount: 2,
        queryType: "SELECT",
      },
      dryRun: {
        success: true,
        output: "🔍 Dry run completed - no changes made",
        results: [],
        rowCount: 0,
        queryType: "UPDATE",
      },
      verbose: {
        success: true,
        output: "✅ Query executed with verbose output",
        results: [{ id: 1, name: "John Doe", email: "john@example.com" }],
        rowCount: 1,
        queryType: "SELECT",
      },
      count: {
        success: true,
        output: "✅ Count query executed",
        results: [{ total_users: 150 }],
        rowCount: 1,
        queryType: "SELECT",
      },
    },
  },
});

// Export types
export type SqlRequestInput = typeof POST.types.RequestInput;
export type SqlRequestOutput = typeof POST.types.RequestOutput;
export type SqlResponseInput = typeof POST.types.ResponseInput;
export type SqlResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
