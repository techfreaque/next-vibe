/**
 * Vibe Check Command Endpoint Definition
 * Production-ready endpoint for comprehensive code quality checks
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
      fix: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.vibeCheck.fields.fix.label",
          description: "app.api.system.check.vibeCheck.fields.fix.description",
          columns: 4,
        },
        z.boolean().optional().default(false),
      ),

      skipLint: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.vibeCheck.fields.skipLint.label",
          description:
            "app.api.system.check.vibeCheck.fields.skipLint.description",
          columns: 3,
        },
        z.boolean().optional().default(false),
      ),

      skipEslint: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.vibeCheck.fields.skipEslint.label",
          description:
            "app.api.system.check.vibeCheck.fields.skipEslint.description",
          columns: 3,
        },
        z.boolean().optional().default(false),
      ),

      skipOxlint: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.vibeCheck.fields.skipOxlint.label",
          description:
            "app.api.system.check.vibeCheck.fields.skipOxlint.description",
          columns: 3,
        },
        z.boolean().optional().default(false),
      ),

      skipTypecheck: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.vibeCheck.fields.skipTypecheck.label",
          description:
            "app.api.system.check.vibeCheck.fields.skipTypecheck.description",
          columns: 3,
        },
        z.boolean().optional().default(false),
      ),

      createConfig: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.vibeCheck.fields.createConfig.label",
          description:
            "app.api.system.check.vibeCheck.fields.createConfig.description",
          columns: 3,
        },
        z.boolean().optional().default(false),
      ),

      timeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.system.check.vibeCheck.fields.timeoutSeconds.label",
          description:
            "app.api.system.check.vibeCheck.fields.timeoutSeconds.description",
          columns: 4,
        },
        z.coerce.number().min(1).max(3600).default(3600),
      ),

      paths: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.system.check.vibeCheck.fields.paths.label",
          description:
            "app.api.system.check.vibeCheck.fields.paths.description",
          placeholder:
            "app.api.system.check.vibeCheck.fields.paths.placeholder",
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
              label:
                "app.api.system.check.vibeCheck.fields.paths.options.utils",
            },
            {
              value: "src/pages",
              label:
                "app.api.system.check.vibeCheck.fields.paths.options.pages",
            },
            {
              value: "src/app",
              label: "app.api.system.check.vibeCheck.fields.paths.options.app",
            },
          ],
        },
        z.union([z.string(), z.array(z.string())]).optional(),
      ),

      maxIssues: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.system.check.vibeCheck.fields.maxIssues.label",
          description:
            "app.api.system.check.vibeCheck.fields.maxIssues.description",
          columns: 4,
        },
        z.coerce.number().min(1).max(10000).optional().default(100),
      ),

      maxFiles: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.system.check.vibeCheck.fields.maxFiles.label",
          description:
            "app.api.system.check.vibeCheck.fields.maxFiles.description",
          columns: 4,
        },
        z.coerce.number().min(1).max(1000).optional().default(50),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.check.vibeCheck.response.success",
        },
        z.boolean(),
      ),

      issues: responseArrayField(
        {
          type: WidgetType.CODE_QUALITY_LIST,
          groupBy: "file",
          sortBy: "severity",
          showSummary: true,
          layoutType: LayoutType.GRID,
          columns: 1,
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
            file: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.check.vibeCheck.response.issues.title",
              },
              z.string(),
            ),
            line: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.check.vibeCheck.response.issues.title",
              },
              z.coerce.number().optional(),
            ),
            column: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.check.vibeCheck.response.issues.title",
              },
              z.coerce.number().optional(),
            ),
            rule: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.check.vibeCheck.response.issues.title",
              },
              z.string().optional(),
            ),
            code: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.check.vibeCheck.response.issues.title",
              },
              z.string().optional(),
            ),
            severity: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.check.vibeCheck.response.issues.title",
              },
              z.enum(["error", "warning", "info"]),
            ),
            message: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.check.vibeCheck.response.success",
              },
              z.string(),
            ),
            type: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.check.vibeCheck.response.issues.title",
              },
              z.enum(["oxlint", "lint", "type"]),
            ),
          },
        ),
      ),

      // === SUMMARY STATS ===
      summary: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.check.vibeCheck.response.summary.title",
          description:
            "app.api.system.check.vibeCheck.response.summary.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          totalIssues: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.check.vibeCheck.response.summary.totalIssues",
              columns: 3,
            },
            z.number(),
          ),

          totalFiles: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.check.vibeCheck.response.summary.totalFiles",
              columns: 3,
            },
            z.number(),
          ),

          totalErrors: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.check.vibeCheck.response.summary.totalErrors",
              columns: 3,
            },
            z.number(),
          ),

          displayedIssues: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.check.vibeCheck.response.summary.displayedIssues",
              columns: 3,
            },
            z.number(),
          ),

          displayedFiles: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.check.vibeCheck.response.summary.displayedFiles",
              columns: 3,
            },
            z.number(),
          ),

          truncatedMessage: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.system.check.vibeCheck.response.summary.truncatedMessage",
              columns: 12,
            },
            z.string(),
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
        skipLint: false,
        skipEslint: false,
        skipOxlint: false,
        skipTypecheck: false,
        maxIssues: 100,
        maxFiles: 50,
      },
      success: {
        fix: false,
        skipLint: false,
        skipEslint: false,
        skipOxlint: false,
        skipTypecheck: false,
        maxIssues: 100,
        maxFiles: 50,
      },
      withErrors: {
        fix: true,
        skipLint: false,
        skipEslint: false,
        skipOxlint: false,
        skipTypecheck: false,
        maxIssues: 100,
        maxFiles: 50,
      },
      quickCheck: {
        fix: false,
        skipLint: false,
        skipEslint: false,
        skipOxlint: false,
        skipTypecheck: false,
        maxIssues: 100,
        maxFiles: 50,
      },
      specificPaths: {
        fix: true,
        skipLint: false,
        skipEslint: false,
        skipOxlint: false,
        skipTypecheck: false,
        paths: ["src/components", "src/utils"],
        maxIssues: 100,
        maxFiles: 50,
      },
    },
    responses: {
      default: {
        success: true,
        issues: [],
        summary: {
          totalIssues: 0,
          totalFiles: 0,
          totalErrors: 0,
          displayedIssues: 0,
          displayedFiles: 0,
          truncatedMessage: "",
        },
      },
      success: {
        success: true,
        issues: [],
        summary: {
          totalIssues: 0,
          totalFiles: 0,
          totalErrors: 0,
          displayedIssues: 0,
          displayedFiles: 0,
          truncatedMessage: "",
        },
      },
      withErrors: {
        success: false,
        issues: [
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
        summary: {
          totalIssues: 1,
          totalFiles: 1,
          totalErrors: 1,
          displayedIssues: 1,
          displayedFiles: 1,
          truncatedMessage: "",
        },
      },
      quickCheck: {
        success: true,
        issues: [],
        summary: {
          totalIssues: 0,
          totalFiles: 0,
          totalErrors: 0,
          displayedIssues: 0,
          displayedFiles: 0,
          truncatedMessage: "",
        },
      },
      specificPaths: {
        success: true,
        issues: [],
        summary: {
          totalIssues: 0,
          totalFiles: 0,
          totalErrors: 0,
          displayedIssues: 0,
          displayedFiles: 0,
          truncatedMessage: "",
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
