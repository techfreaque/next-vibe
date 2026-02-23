/**
 * Database Schema Verification Endpoint Definition
 * Production-ready endpoint for verifying database schema integrity
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
  path: ["system", "db", "schema-verify"],
  title: "post.title",
  description: "post.description",
  category: "category",
  tags: ["tag"],
  icon: "database",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],
  aliases: ["schema-verify", "db:schema-verify"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      fixIssues: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.fixIssues.title",
        description: "fields.fixIssues.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      silent: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.silent.title",
        description: "fields.silent.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.success.title",
        schema: z.boolean(),
      }),

      valid: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.valid.title",
        schema: z.boolean(),
      }),

      output: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.output.title",
        schema: z.string(),
      }),

      issues: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.issues.title",
        schema: z.array(z.string()).optional(),
      }),

      fixedIssues: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fields.fixedIssues.title",
        schema: z.array(z.string()).optional(),
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
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
  },
});

const dbSchemaVerifyEndpoints = { POST };
export default dbSchemaVerifyEndpoints;

// Export types
export type SchemaVerifyRequestInput = typeof POST.types.RequestInput;
export type SchemaVerifyRequestOutput = typeof POST.types.RequestOutput;
export type SchemaVerifyResponseInput = typeof POST.types.ResponseInput;
export type SchemaVerifyResponseOutput = typeof POST.types.ResponseOutput;
