/**
 * Vibe Check Command Endpoint Definition
 * Production-ready endpoint for comprehensive code quality checks
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
  scopedWidgetField,
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
  path: ["system", "check", "vibe-check"],
  title: "title",
  description: "description",
  category: "category",
  tags: ["tag"],
  icon: "wrench",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_VISIBLE,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["check", "c"],

  cli: {
    firstCliArgKey: "paths",
  },

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      title: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        content: "title",
        level: 1,
        columns: 12,
        usage: { request: "data" },
      }),

      // Default: check.config.ts vibeCheck.fix ?? false
      fix: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.fix.label",
        description: "fields.fix.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),

      // Default: check.config.ts vibeCheck.timeout ?? 3600
      timeout: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.timeoutSeconds.label",
        description: "fields.timeoutSeconds.description",
        columns: 4,
        schema: z.coerce.number().min(1).max(36000).optional(),
      }),

      paths: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TAGS,
        label: "fields.paths.label",
        description: "fields.paths.description",
        placeholder: "fields.paths.placeholder",
        columns: 8,
        options: [
          {
            value: "src/",
            label: "fields.paths.options.src",
          },
          {
            value: "src/components",
            label: "fields.paths.options.components",
          },
          {
            value: "src/utils",
            label: "fields.paths.options.utils",
          },
          {
            value: "src/pages",
            label: "fields.paths.options.pages",
          },
          {
            value: "src/app",
            label: "fields.paths.options.app",
          },
        ],
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),

      // Default: check.config.ts vibeCheck.limit ?? 200
      limit: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit.label",
        description: "fields.limit.description",
        columns: 4,
        schema: z.coerce.number().min(1).optional(),
      }),

      // Default: 1 (not configurable in check.config.ts)
      page: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.page.label",
        description: "fields.page.description",
        columns: 4,
        schema: z.coerce.number().min(1).optional().default(1),
      }),

      // Filter issues by file path, message, or rule
      filter: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.filter.label",
        description: "fields.filter.description",
        placeholder: "fields.filter.placeholder",
        columns: 8,
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),

      // Only return summary stats, omit items and files lists
      summaryOnly: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.summaryOnly.label",
        description: "fields.summaryOnly.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      editorUriSchema: scopedResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.editorUriScheme.label",
        description: "fields.editorUriScheme.description",
        columns: 8,
        schema: z.string().optional(),
        hidden: true,
      }),
      items: scopedResponseField(scopedTranslation, {
        type: WidgetType.CODE_QUALITY_LIST,
        editorUriSchemaFieldKey: "editorUriSchema",
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

      // === FILES LIST (optional for compact MCP responses) ===
      files: scopedResponseField(scopedTranslation, {
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

      // === SUMMARY STATS ===
      summary: scopedResponseField(scopedTranslation, {
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
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsaved.title",
      description: "errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
            warnings: 0,
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
