/**
 * Run ESLint Endpoint Definition
 * Production-ready endpoint for run eslint
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";

import { UserRole } from "../../../user/user-roles/enum";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "../../unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "check", "lint"],
  title: "app.api.v1.core.system.check.lint.title",
  description: "app.api.v1.core.system.check.lint.description",
  category: "app.api.v1.core.system.check.lint.category",
  tags: ["app.api.v1.core.system.check.lint.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  aliases: ["lint", "l"],

  cli: {
    firstCliArgKey: "path",
  },
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.check.lint.container.title",
      description: "app.api.v1.core.system.check.lint.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      path: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.check.lint.fields.path.label",
          description:
            "app.api.v1.core.system.check.lint.fields.path.description",
          placeholder:
            "app.api.v1.core.system.check.lint.fields.path.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional().default("./"),
      ),

      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.check.lint.fields.verbose.label",
          description:
            "app.api.v1.core.system.check.lint.fields.verbose.description",
          layout: { columns: 3 },
        },
        z.boolean().default(false),
      ),

      fix: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.check.lint.fields.fix.label",
          description:
            "app.api.v1.core.system.check.lint.fields.fix.description",
          layout: { columns: 3 },
        },
        // fix is false by default as it makes it way slower
        z.boolean().default(false),
      ),

      timeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.check.lint.fields.timeoutSeconds.label",
          description:
            "app.api.v1.core.system.check.lint.fields.timeoutSeconds.description",
          layout: { columns: 3 },
        },
        z.number().min(1).max(3600).default(3600),
      ),

      cacheDir: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.check.lint.fields.cacheDir.label",
          description:
            "app.api.v1.core.system.check.lint.fields.cacheDir.description",
          layout: { columns: 3 },
        },
        z.string().optional().default("./.tmp"),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.check.lint.response.success",
        },
        z.boolean(),
      ),

      issues: responseArrayField(
        {
          type: WidgetType.GROUPED_LIST,
          groupBy: "file",
          sortBy: "severity",
          showGroupSummary: true,
          layout: {
            type: LayoutType.GRID,
            columns: 1,
          },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title: "app.api.v1.core.system.check.lint.title",
            description: "app.api.v1.core.system.check.lint.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            file: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.lint.response.errors.item.file",
              },
              z.string(),
            ),
            line: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.lint.response.errors.item.line",
              },
              z.number().optional(),
            ),
            column: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.lint.response.errors.item.column",
              },
              z.number().optional(),
            ),
            rule: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.lint.response.errors.item.rule",
              },
              z.string().optional(),
            ),
            severity: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.lint.response.errors.item.severity",
              },
              z.enum(["error", "warning", "info"]),
            ),
            message: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.lint.response.errors.item.message",
              },
              z.string(),
            ),
            type: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.lint.response.errors.item.title",
              },
              z.literal("lint"),
            ),
          },
        ),
      ),

      // Summary is now handled by the grouped list widget - no separate container needed
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.system.check.lint.errors.validation.title",
      description:
        "app.api.v1.core.system.check.lint.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.check.lint.errors.internal.title",
      description:
        "app.api.v1.core.system.check.lint.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.system.check.lint.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.check.lint.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.system.check.lint.errors.forbidden.title",
      description:
        "app.api.v1.core.system.check.lint.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.check.lint.errors.internal.title",
      description:
        "app.api.v1.core.system.check.lint.errors.internal.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.check.lint.errors.internal.title",
      description:
        "app.api.v1.core.system.check.lint.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.check.lint.errors.internal.title",
      description:
        "app.api.v1.core.system.check.lint.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.check.lint.errors.internal.title",
      description:
        "app.api.v1.core.system.check.lint.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.check.lint.errors.internal.title",
      description:
        "app.api.v1.core.system.check.lint.errors.internal.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.system.check.lint.success.title",
    description: "app.api.v1.core.system.check.lint.success.description",
  },

  examples: {
    requests: {
      default: {
        verbose: false,
        fix: false,
      },
      verbose: {
        verbose: true,
        fix: false,
      },
      fix: {
        path: "src/app/api/[locale]/v1/core/system/unified-ui/cli",
        verbose: true,
        fix: true,
      },
    },
    responses: {
      default: {
        success: true,
        issues: [],
      },
      verbose: {
        success: true,
        issues: [],
      },
      fix: {
        success: true,
        issues: [],
      },
    },
    urlPathVariables: undefined,
  },
});

// Export types following migration guide pattern
export type LintRequestInput = typeof POST.types.RequestInput;
export type LintRequestOutput = typeof POST.types.RequestOutput;
export type LintResponseInput = typeof POST.types.ResponseInput;
export type LintResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
