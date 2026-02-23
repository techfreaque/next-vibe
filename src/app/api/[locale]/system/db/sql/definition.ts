/**
 * Database SQL Execution Endpoint Definition
 * Production-ready endpoint for executing SQL queries
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
  path: ["system", "db", "sql"],
  title: "post.title",
  description: "post.description",
  category: "category",
  tags: ["tag"],
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

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      query: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "fields.query.title",
        description: "fields.query.description",
        columns: 12,
        schema: z.string().optional(),
      }),

      queryFile: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.queryFile.title",
        description: "fields.queryFile.description",
        placeholder: "fields.queryFile.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      dryRun: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.dryRun.title",
        description: "fields.dryRun.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      verbose: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.verbose.title",
        description: "fields.verbose.description",
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      limit: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit.title",
        description: "fields.limit.description",
        columns: 4,
        schema: z.coerce.number().optional().default(100),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.success.title",
        schema: z.boolean(),
      }),

      output: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.output.title",
        schema: z.string(),
      }),

      results: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.results.title",
        schema: z.array(z.record(z.string(), z.any())).optional(),
      }),

      rowCount: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.rowCount.title",
        schema: z.coerce.number().optional(),
      }),

      queryType: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.queryType.title",
        schema: z.string().optional(),
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
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
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
