/**
 * Run ESLint Endpoint Definition
 * Production-ready endpoint for run eslint
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
  widgetField,
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
  path: ["system", "check", "lint"],
  title: "app.api.system.check.lint.title",
  description: "app.api.system.check.lint.description",
  category: "app.api.system.category",
  tags: ["app.api.system.check.lint.tag"],
  icon: "bug",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["eslint", "elint", "el"],

  cli: {
    firstCliArgKey: "path",
  },
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      title: widgetField({
        type: WidgetType.TITLE,
        content: "app.api.system.check.lint.container.title",
        level: 1,
        columns: 12,
        usage: { request: "data" },
      }),

      path: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.check.lint.fields.path.label",
        description: "app.api.system.check.lint.fields.path.description",
        placeholder: "app.api.system.check.lint.fields.path.placeholder",
        columns: 6,
        schema: z.string().optional().default("./"),
      }),

      fix: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.check.lint.fields.fix.label",
        description: "app.api.system.check.lint.fields.fix.description",
        columns: 3,
        // fix is false by default as it makes it way slower
        schema: z.boolean().default(false),
      }),

      timeout: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.system.check.lint.fields.timeoutSeconds.label",
        description:
          "app.api.system.check.lint.fields.timeoutSeconds.description",
        columns: 3,
        schema: z.coerce.number().min(1).max(3600).default(3600),
      }),

      cacheDir: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.check.lint.fields.cacheDir.label",
        description: "app.api.system.check.lint.fields.cacheDir.description",
        columns: 3,
        schema: z.string().optional().default("./.tmp"),
      }),

      limit: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.system.check.lint.fields.limit.label",
        description: "app.api.system.check.lint.fields.limit.description",
        columns: 4,
        schema: z.coerce.number().min(1).optional().default(200),
      }),

      page: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.system.check.lint.fields.page.label",
        description: "app.api.system.check.lint.fields.page.description",
        columns: 4,
        schema: z.coerce.number().min(1).optional().default(1),
      }),

      skipSorting: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.check.lint.fields.skipSorting.label",
        description: "app.api.system.check.lint.fields.skipSorting.description",
        columns: 3,
        schema: z.boolean().default(false),
      }),

      // Filter issues by file path, message, or rule
      filter: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.check.lint.fields.filter.label",
        description: "app.api.system.check.lint.fields.filter.description",
        placeholder: "app.api.system.check.lint.fields.filter.placeholder",
        columns: 8,
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),

      // Only return summary stats, omit items and files lists
      summaryOnly: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.check.lint.fields.summaryOnly.label",
        description: "app.api.system.check.lint.fields.summaryOnly.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      items: responseField({
        type: WidgetType.CODE_QUALITY_LIST,
        groupBy: "file",
        sortBy: "severity",
        showSummary: true,
        schema: z
          .array(
            z.object({
              file: z.string(),
              line: z.coerce.number().optional(),
              column: z.coerce.number().optional(),
              rule: z.string().optional(),
              severity: z.enum(["error", "warning", "info"]),
              message: z.string(),
            }),
          )
          .optional(),
      }),

      files: responseField({
        type: WidgetType.CODE_QUALITY_FILES,
        schema: z
          .array(
            z.object({
              file: z.string(),
              errors: z.number(),
              warnings: z.number(),
              total: z.number(),
            }),
          )
          .optional(),
      }),

      summary: responseField({
        type: WidgetType.CODE_QUALITY_SUMMARY,
        schema: z.object({
          totalIssues: z.number(),
          totalFiles: z.number(),
          totalErrors: z.number().optional(),
          filteredIssues: z.number().optional(),
          filteredFiles: z.number().optional(),
          displayedIssues: z.number().optional(),
          displayedFiles: z.number().optional(),
          truncatedMessage: z.string().optional(),
          currentPage: z.number().optional(),
          totalPages: z.number().optional(),
        }),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.check.lint.errors.validation.title",
      description: "app.api.system.check.lint.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.check.lint.errors.internal.title",
      description: "app.api.system.check.lint.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.check.lint.errors.unauthorized.title",
      description: "app.api.system.check.lint.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.check.lint.errors.forbidden.title",
      description: "app.api.system.check.lint.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.check.lint.errors.internal.title",
      description: "app.api.system.check.lint.errors.internal.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.check.lint.errors.internal.title",
      description: "app.api.system.check.lint.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.check.lint.errors.internal.title",
      description: "app.api.system.check.lint.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.check.lint.errors.internal.title",
      description: "app.api.system.check.lint.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.check.lint.errors.internal.title",
      description: "app.api.system.check.lint.errors.internal.description",
    },
  },

  successTypes: {
    title: "app.api.system.check.lint.success.title",
    description: "app.api.system.check.lint.success.description",
  },

  examples: {
    requests: {
      default: {
        fix: false,
        limit: 100,
        page: 1,
      },
      verbose: {
        fix: false,
        limit: 100,
        page: 1,
      },
      fix: {
        path: "src/app/api/[locale]/system/unified-interface/cli",
        fix: true,
        limit: 100,
        page: 1,
      },
    },
    responses: {
      default: {
        items: [],
        files: [],
        summary: {
          totalIssues: 0,
          totalFiles: 0,
          totalErrors: 0,
          filteredIssues: 0,
          filteredFiles: 0,
          displayedIssues: 0,
          displayedFiles: 0,
          currentPage: 1,
          totalPages: 1,
        },
      },
      verbose: {
        items: [],
        files: [],
        summary: {
          totalIssues: 0,
          totalFiles: 0,
          totalErrors: 0,
          filteredIssues: 0,
          filteredFiles: 0,
          displayedIssues: 0,
          displayedFiles: 0,
          currentPage: 1,
          totalPages: 1,
        },
      },
      fix: {
        items: [],
        files: [],
        summary: {
          totalIssues: 0,
          totalFiles: 0,
          totalErrors: 0,
          filteredIssues: 0,
          filteredFiles: 0,
          displayedIssues: 0,
          displayedFiles: 0,
          currentPage: 1,
          totalPages: 1,
        },
      },
    },
  },
});

// Export types following migration guide pattern
export type LintRequestInput = typeof POST.types.RequestInput;
export type LintRequestOutput = typeof POST.types.RequestOutput;
export type LintResponseInput = typeof POST.types.ResponseInput;
export type LintResponseOutput = typeof POST.types.ResponseOutput;

export type LintIssue = NonNullable<LintResponseOutput["items"]>[number];

const endpoints = { POST };
export default endpoints;
