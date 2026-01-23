/**
 * Vibe Check Command Endpoint Definition
 * Production-ready endpoint for comprehensive code quality checks
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
  responseArrayOptionalField,
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
  path: ["system", "check", "vibe-check"],
  title: "app.api.system.check.vibeCheck.title",
  description: "app.api.system.check.vibeCheck.description",
  category: "app.api.system.check.vibeCheck.category",
  tags: ["app.api.system.check.vibeCheck.tag"],
  icon: "wrench",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["check", "c"],

  cli: {
    firstCliArgKey: "paths",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.check.vibeCheck.title",
      description: "app.api.system.check.vibeCheck.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      // Default: check.config.ts vibeCheck.fix ?? false
      fix: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.check.vibeCheck.fields.fix.label",
        description: "app.api.system.check.vibeCheck.fields.fix.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      // Default: check.config.ts vibeCheck.timeout ?? 3600
      timeout: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.system.check.vibeCheck.fields.timeoutSeconds.label",
        description:
          "app.api.system.check.vibeCheck.fields.timeoutSeconds.description",
        columns: 4,
        schema: z.coerce.number().min(1).max(36000).optional(),
      }),

      paths: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TAGS,
        label: "app.api.system.check.vibeCheck.fields.paths.label",
        description: "app.api.system.check.vibeCheck.fields.paths.description",
        placeholder: "app.api.system.check.vibeCheck.fields.paths.placeholder",
        columns: 8,
        options: [
          {
            value: "src/",
            label: "app.api.system.check.vibeCheck.fields.paths.options.src",
          },
          {
            value: "src/components",
            label:
              "app.api.system.check.vibeCheck.fields.paths.options.components",
          },
          {
            value: "src/utils",
            label: "app.api.system.check.vibeCheck.fields.paths.options.utils",
          },
          {
            value: "src/pages",
            label: "app.api.system.check.vibeCheck.fields.paths.options.pages",
          },
          {
            value: "src/app",
            label: "app.api.system.check.vibeCheck.fields.paths.options.app",
          },
        ],
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),

      // Default: check.config.ts vibeCheck.limit ?? 200
      limit: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.system.check.vibeCheck.fields.limit.label",
        description: "app.api.system.check.vibeCheck.fields.limit.description",
        columns: 4,
        schema: z.coerce.number().min(1).optional(),
      }),

      // Default: 1 (not configurable in check.config.ts)
      page: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.system.check.vibeCheck.fields.page.label",
        description: "app.api.system.check.vibeCheck.fields.page.description",
        columns: 4,
        schema: z.coerce.number().min(1).optional().default(1),
      }),

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
              title: "app.api.system.check.vibeCheck.response.issues.title",
              description:
                "app.api.system.check.vibeCheck.response.issues.emptyState.description",
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.system.check.vibeCheck.response.issues.title",
                description:
                  "app.api.system.check.vibeCheck.response.issues.emptyState.description",
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                file: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.check.vibeCheck.response.issues.title",
                  schema: z.string(),
                }),
                line: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.check.vibeCheck.response.issues.title",
                  schema: z.coerce.number().optional(),
                }),
                column: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.check.vibeCheck.response.issues.title",
                  schema: z.coerce.number().optional(),
                }),
                rule: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.check.vibeCheck.response.issues.title",
                  schema: z.string().optional(),
                }),
                code: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.check.vibeCheck.response.issues.title",
                  schema: z.string().optional(),
                }),
                severity: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.check.vibeCheck.response.issues.title",
                  schema: z.enum(["error", "warning", "info"]),
                }),
                message: responseField({
                  type: WidgetType.TEXT,
                  content: "app.api.system.check.vibeCheck.response.success",
                  schema: z.string(),
                }),
                type: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.check.vibeCheck.response.issues.title",
                  schema: z.enum(["oxlint", "lint", "type"]),
                }),
              },
            ),
          ),

          // === FILES LIST (optional for compact MCP responses) ===
          files: responseArrayOptionalField(
            {
              type: WidgetType.CODE_QUALITY_FILES,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
              },
              { response: true },
              {
                file: responseField({
                  type: WidgetType.TEXT,
                  schema: z.string(),
                }),
                errors: responseField({
                  type: WidgetType.STAT,
                  schema: z.number(),
                }),
                warnings: responseField({
                  type: WidgetType.STAT,
                  schema: z.number(),
                }),
                total: responseField({
                  type: WidgetType.STAT,
                  schema: z.number(),
                }),
              },
            ),
          ),

          // === SUMMARY STATS ===
          summary: objectField(
            {
              type: WidgetType.CODE_QUALITY_SUMMARY,
            },
            { response: true },
            {
              totalIssues: responseField({
                type: WidgetType.STAT,
                schema: z.number(),
              }),
              totalFiles: responseField({
                type: WidgetType.STAT,
                schema: z.number(),
              }),
              totalErrors: responseField({
                type: WidgetType.STAT,
                schema: z.number(),
              }),
              displayedIssues: responseField({
                type: WidgetType.STAT,
                schema: z.number(),
              }),
              displayedFiles: responseField({
                type: WidgetType.STAT,
                schema: z.number(),
              }),
              truncatedMessage: responseField({
                type: WidgetType.TEXT,
                schema: z.string().optional(),
              }),
              currentPage: responseField({
                type: WidgetType.STAT,
                schema: z.number(),
              }),
              totalPages: responseField({
                type: WidgetType.STAT,
                schema: z.number(),
              }),
            },
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.check.vibeCheck.errors.validation.title",
      description:
        "app.api.system.check.vibeCheck.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.check.vibeCheck.errors.internal.title",
      description: "app.api.system.check.vibeCheck.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.check.vibeCheck.errors.unauthorized.title",
      description:
        "app.api.system.check.vibeCheck.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.check.vibeCheck.errors.forbidden.title",
      description:
        "app.api.system.check.vibeCheck.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.check.vibeCheck.errors.notFound.title",
      description: "app.api.system.check.vibeCheck.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.check.vibeCheck.errors.server.title",
      description: "app.api.system.check.vibeCheck.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.check.vibeCheck.errors.unknown.title",
      description: "app.api.system.check.vibeCheck.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.check.vibeCheck.errors.unsaved.title",
      description: "app.api.system.check.vibeCheck.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.check.vibeCheck.errors.conflict.title",
      description: "app.api.system.check.vibeCheck.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.check.vibeCheck.success.title",
    description: "app.api.system.check.vibeCheck.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        fix: true,
        limit: 100,
        page: 1,
      },
      success: {
        fix: false,
        limit: 100,
        page: 1,
      },
      withErrors: {
        fix: true,
        limit: 100,
        page: 1,
      },
      quickCheck: {
        fix: false,
        limit: 100,
        page: 1,
      },
      specificPaths: {
        fix: true,
        paths: ["src/components", "src/utils"],
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
      success: {
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
      withErrors: {
        issues: {
          items: [
            {
              file: "src/components/example.tsx",
              line: 42,
              column: 10,
              rule: "no-unused-vars",
              code: "unused-variable",
              severity: "error" as const,
              message: "Variable 'example' is defined but never used",
              type: "lint" as const,
            },
          ],
          files: [
            {
              file: "src/components/example.tsx",
              errors: 1,
              warnings: 0,
              total: 1,
            },
          ],
          summary: {
            totalIssues: 1,
            totalFiles: 1,
            totalErrors: 1,
            displayedIssues: 1,
            displayedFiles: 1,
            currentPage: 1,
            totalPages: 1,
          },
        },
      },
      quickCheck: {
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
      specificPaths: {
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
  },
});

export type VibeCheckRequestInput = typeof POST.types.RequestInput;
export type VibeCheckRequestOutput = typeof POST.types.RequestOutput;
export type VibeCheckResponseInput = typeof POST.types.ResponseInput;
export type VibeCheckResponseOutput = typeof POST.types.ResponseOutput;

const vibeCheckEndpoints = { POST };
export default vibeCheckEndpoints;
