/**
 * Vibe Check Command Endpoint Definition
 * Production-ready endpoint for comprehensive code quality checks
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "check", "vibe-check"],
  title: "app.api.v1.core.system.check.vibeCheck.title",
  description: "app.api.v1.core.system.check.vibeCheck.description",
  category: "app.api.v1.core.system.check.vibeCheck.category",
  tags: ["app.api.v1.core.system.check.vibeCheck.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF, UserRole.WEB_OFF],
  aliases: ["check", "c"],

  cli: {
    firstCliArgKey: "paths",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      fix: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.check.vibeCheck.fields.fix.label",
          description:
            "app.api.v1.core.system.check.vibeCheck.fields.fix.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      skipOxlint: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.check.vibeCheck.fields.skipOxlint.label",
          description:
            "app.api.v1.core.system.check.vibeCheck.fields.skipOxlint.description",
          layout: { columns: 3 },
        },
        z.boolean().optional().default(false),
      ),

      skipLint: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.check.vibeCheck.fields.skipLint.label",
          description:
            "app.api.v1.core.system.check.vibeCheck.fields.skipLint.description",
          layout: { columns: 3 },
        },
        z.boolean().optional().default(true),
      ),

      skipTypecheck: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.check.vibeCheck.fields.skipTypecheck.label",
          description:
            "app.api.v1.core.system.check.vibeCheck.fields.skipTypecheck.description",
          layout: { columns: 3 },
        },
        z.boolean().optional().default(false),
      ),

      timeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.check.vibeCheck.fields.timeoutSeconds.label",
          description:
            "app.api.v1.core.system.check.vibeCheck.fields.timeoutSeconds.description",
          layout: { columns: 4 },
        },
        z.number().min(1).max(3600).default(3600),
      ),

      paths: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.system.check.vibeCheck.fields.paths.label",
          description:
            "app.api.v1.core.system.check.vibeCheck.fields.paths.description",
          placeholder:
            "app.api.v1.core.system.check.vibeCheck.fields.paths.placeholder",
          layout: { columns: 8 },
          options: [
            {
              value: "src/",
              label:
                "app.api.v1.core.system.check.vibeCheck.fields.paths.options.src",
            },
            {
              value: "src/components",
              label:
                "app.api.v1.core.system.check.vibeCheck.fields.paths.options.components",
            },
            {
              value: "src/utils",
              label:
                "app.api.v1.core.system.check.vibeCheck.fields.paths.options.utils",
            },
            {
              value: "src/pages",
              label:
                "app.api.v1.core.system.check.vibeCheck.fields.paths.options.pages",
            },
            {
              value: "src/app",
              label:
                "app.api.v1.core.system.check.vibeCheck.fields.paths.options.app",
            },
          ],
        },
        z.union([z.string(), z.array(z.string())]).optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.check.vibeCheck.response.success",
        },
        z.boolean(),
      ),

      issues: responseArrayField(
        {
          type: WidgetType.CODE_QUALITY_LIST,
          groupBy: "file",
          sortBy: "severity",
          showSummary: true,
          layout: {
            type: LayoutType.GRID,
            columns: 1,
          },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.system.check.vibeCheck.response.issues.title",
            description:
              "app.api.v1.core.system.check.vibeCheck.response.issues.emptyState.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            file: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.vibeCheck.response.issues.title",
              },
              z.string(),
            ),
            line: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.vibeCheck.response.issues.title",
              },
              z.number().optional(),
            ),
            column: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.vibeCheck.response.issues.title",
              },
              z.number().optional(),
            ),
            rule: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.vibeCheck.response.issues.title",
              },
              z.string().optional(),
            ),
            code: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.vibeCheck.response.issues.title",
              },
              z.string().optional(),
            ),
            severity: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.vibeCheck.response.issues.title",
              },
              z.enum(["error", "warning", "info"]),
            ),
            message: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.vibeCheck.response.success",
              },
              z.string(),
            ),
            type: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.vibeCheck.response.issues.title",
              },
              z.enum(["oxlint", "lint", "type"]),
            ),
          },
        ),
      ),

      // Summary is now handled by the grouped list widget - no separate container needed
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.system.check.vibeCheck.errors.validation.title",
      description:
        "app.api.v1.core.system.check.vibeCheck.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.check.vibeCheck.errors.internal.title",
      description:
        "app.api.v1.core.system.check.vibeCheck.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.system.check.vibeCheck.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.check.vibeCheck.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.system.check.vibeCheck.errors.forbidden.title",
      description:
        "app.api.v1.core.system.check.vibeCheck.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.check.vibeCheck.errors.notFound.title",
      description:
        "app.api.v1.core.system.check.vibeCheck.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.check.vibeCheck.errors.server.title",
      description:
        "app.api.v1.core.system.check.vibeCheck.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.check.vibeCheck.errors.unknown.title",
      description:
        "app.api.v1.core.system.check.vibeCheck.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.check.vibeCheck.errors.unsaved.title",
      description:
        "app.api.v1.core.system.check.vibeCheck.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.check.vibeCheck.errors.conflict.title",
      description:
        "app.api.v1.core.system.check.vibeCheck.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.check.vibeCheck.success.title",
    description: "app.api.v1.core.system.check.vibeCheck.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        fix: true,
        skipLint: false,
        skipTypecheck: false,
      },
      success: {
        fix: false,
        skipLint: false,
        skipTypecheck: false,
      },
      withErrors: {
        fix: true,
        skipLint: false,
        skipTypecheck: false,
      },
      quickCheck: {
        fix: false,
        skipLint: false,
        skipTypecheck: false,
      },
      specificPaths: {
        fix: true,
        skipLint: false,
        skipTypecheck: false,
        paths: ["src/components", "src/utils"],
      },
    },
    responses: {
      default: {
        success: true,
        issues: [],
      },
      success: {
        success: true,
        issues: [],
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
      },
      quickCheck: {
        success: true,
        issues: [],
      },
      specificPaths: {
        success: true,
        issues: [],
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
