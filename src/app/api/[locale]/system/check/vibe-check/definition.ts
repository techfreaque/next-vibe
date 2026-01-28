/**
 * Vibe Check Command Endpoint Definition
 * Production-ready endpoint for comprehensive code quality checks
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
    UserRole.MCP_ON,
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
      layoutType: LayoutType.STACKED,
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

      // Filter issues by file path, message, or rule
      filter: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.check.vibeCheck.fields.filter.label",
        description: "app.api.system.check.vibeCheck.fields.filter.description",
        placeholder: "app.api.system.check.vibeCheck.fields.filter.placeholder",
        columns: 8,
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),

      // Only return summary stats, omit items and files lists
      summaryOnly: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.check.vibeCheck.fields.summaryOnly.label",
        description:
          "app.api.system.check.vibeCheck.fields.summaryOnly.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      editorUriSchema: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.check.vibeCheck.fields.editorUriScheme.label",
        description:
          "app.api.system.check.vibeCheck.fields.editorUriScheme.description",
        columns: 8,
        schema: z.string().optional(),
        hidden: true,
      }),
      items: responseField({
        type: WidgetType.CODE_QUALITY_LIST,
        editorUriSchemaFieldKey: "editorUriSchema",
        schema: z.array(
          z.object({
            file: z.string(),
            line: z.coerce.number().optional(),
            column: z.coerce.number().optional(),
            rule: z.string().optional(),
            severity: z.enum(["error", "warning", "info"]),
            message: z.string(),
          }),
        ),
      }),

      // === FILES LIST (optional for compact MCP responses) ===
      files: responseField({
        type: WidgetType.CODE_QUALITY_FILES,
        schema: z
          .array(
            z.object({
              file: z.string(),
              errors: z.number().optional(),
              warnings: z.number().optional(),
              total: z.number(),
            }),
          )
          .optional(),
      }),

      // === SUMMARY STATS ===
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
      success: {
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
      withErrors: {
        items: [
          {
            file: "src/components/example.tsx",
            line: 42,
            column: 10,
            rule: "no-unused-vars",
            severity: "error" as const,
            message: "Variable 'example' is defined but never used",
          },
        ],
        files: [
          {
            file: "src/components/example.tsx",
            errors: 1,
            total: 1,
          },
        ],
        summary: {
          totalIssues: 1,
          totalFiles: 1,
          totalErrors: 1,
          filteredIssues: 1,
          filteredFiles: 1,
          displayedIssues: 1,
          displayedFiles: 1,
          currentPage: 1,
          totalPages: 1,
        },
      },
      quickCheck: {
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
      specificPaths: {
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

export type VibeCheckRequestInput = typeof POST.types.RequestInput;
export type VibeCheckRequestOutput = typeof POST.types.RequestOutput;
export type VibeCheckResponseInput = typeof POST.types.ResponseInput;
export type VibeCheckResponseOutput = typeof POST.types.ResponseOutput;

const vibeCheckEndpoints = { POST };
export default vibeCheckEndpoints;
