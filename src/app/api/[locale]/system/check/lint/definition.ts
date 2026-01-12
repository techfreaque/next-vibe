/**
 * Run ESLint Endpoint Definition
 * Production-ready endpoint for run eslint
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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
  category: "app.api.system.check.lint.category",
  tags: ["app.api.system.check.lint.tag"],
  icon: "bug",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["eslint", "elint", "el"],

  cli: {
    firstCliArgKey: "path",
  },
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.check.lint.container.title",
      description: "app.api.system.check.lint.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      path: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.check.lint.fields.path.label",
          description: "app.api.system.check.lint.fields.path.description",
          placeholder: "app.api.system.check.lint.fields.path.placeholder",
          columns: 6,
        },
        z.string().optional().default("./"),
      ),

      fix: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.lint.fields.fix.label",
          description: "app.api.system.check.lint.fields.fix.description",
          columns: 3,
        },
        // fix is false by default as it makes it way slower
        z.boolean().default(false),
      ),

      timeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.system.check.lint.fields.timeoutSeconds.label",
          description: "app.api.system.check.lint.fields.timeoutSeconds.description",
          columns: 3,
        },
        z.coerce.number().min(1).max(3600).default(3600),
      ),

      cacheDir: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.check.lint.fields.cacheDir.label",
          description: "app.api.system.check.lint.fields.cacheDir.description",
          columns: 3,
        },
        z.string().optional().default("./.tmp"),
      ),

      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.system.check.lint.fields.limit.label",
          description: "app.api.system.check.lint.fields.limit.description",
          columns: 4,
        },
        z.coerce.number().min(1).optional().default(200),
      ),

      page: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.system.check.lint.fields.page.label",
          description: "app.api.system.check.lint.fields.page.description",
          columns: 4,
        },
        z.coerce.number().min(1).optional().default(1),
      ),

      skipSorting: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.lint.fields.skipSorting.label",
          description: "app.api.system.check.lint.fields.skipSorting.description",
          columns: 3,
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      issues: objectField(
        {
          type: WidgetType.CODE_QUALITY_LIST,
          groupBy: "file",
          sortBy: "severity",
          showSummary: true,
          layoutType: LayoutType.GRID,
          columns: 1,
        },
        { response: true },
        {
          items: responseArrayField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.system.check.lint.response.issues.title",
              description: "app.api.system.check.lint.response.issues.emptyState.description",
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.system.check.lint.response.issues.title",
                description: "app.api.system.check.lint.response.issues.emptyState.description",
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                file: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.system.check.lint.response.issues.title",
                  },
                  z.string(),
                ),
                line: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.system.check.lint.response.issues.title",
                  },
                  z.coerce.number().optional(),
                ),
                column: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.system.check.lint.response.issues.title",
                  },
                  z.coerce.number().optional(),
                ),
                rule: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.system.check.lint.response.issues.title",
                  },
                  z.string().optional(),
                ),
                code: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.system.check.lint.response.issues.title",
                  },
                  z.string().optional(),
                ),
                severity: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.system.check.lint.response.issues.title",
                  },
                  z.enum(["error", "warning", "info"]),
                ),
                message: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.system.check.lint.response.success",
                  },
                  z.string(),
                ),
                type: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.system.check.lint.response.issues.title",
                  },
                  z.enum(["oxlint", "lint", "type"]),
                ),
              },
            ),
          ),

          files: responseField(
            {
              type: WidgetType.CODE_QUALITY_FILES,
            },
            z.array(
              z.object({
                file: z.string(),
                errors: z.number(),
                warnings: z.number(),
                total: z.number(),
              }),
            ),
          ),

          summary: responseField(
            {
              type: WidgetType.CODE_QUALITY_SUMMARY,
            },
            z.object({
              totalIssues: z.number(),
              totalFiles: z.number(),
              totalErrors: z.number(),
              displayedIssues: z.number(),
              displayedFiles: z.number(),
              truncatedMessage: z.string().optional(),
              currentPage: z.number(),
              totalPages: z.number(),
            }),
          ),
        },
      ),
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
        issues: {
          items: [],
          files: [],
          summary: {
            totalIssues: 0,
            totalFiles: 0,
            totalErrors: 0,
            displayedIssues: 0,
            displayedFiles: 0,
            currentPage: 1,
            totalPages: 1,
          },
        },
      },
      verbose: {
        issues: {
          items: [],
          files: [],
          summary: {
            totalIssues: 0,
            totalFiles: 0,
            totalErrors: 0,
            displayedIssues: 0,
            displayedFiles: 0,
            currentPage: 1,
            totalPages: 1,
          },
        },
      },
      fix: {
        issues: {
          items: [],
          files: [],
          summary: {
            totalIssues: 0,
            totalFiles: 0,
            totalErrors: 0,
            displayedIssues: 0,
            displayedFiles: 0,
            currentPage: 1,
            totalPages: 1,
          },
        },
      },
    },
    urlPathParams: undefined,
  },
});

// Export types following migration guide pattern
export type LintRequestInput = typeof POST.types.RequestInput;
export type LintRequestOutput = typeof POST.types.RequestOutput;
export type LintResponseInput = typeof POST.types.ResponseInput;
export type LintResponseOutput = typeof POST.types.ResponseOutput;

export type LintIssue = LintResponseOutput["issues"]["items"][number];

const endpoints = { POST };
export default endpoints;
