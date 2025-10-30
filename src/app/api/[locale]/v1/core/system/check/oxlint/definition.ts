/**
 * Run ESLint Endpoint Definition
 * Production-ready endpoint for run eslint
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
  path: ["v1", "core", "system", "check", "oxlint"],
  title: "app.api.v1.core.system.check.oxlint.title",
  description: "app.api.v1.core.system.check.oxlint.description",
  category: "app.api.v1.core.system.check.oxlint.category",
  tags: ["app.api.v1.core.system.check.oxlint.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["olint", "ol"],

  cli: {
    firstCliArgKey: "path",
  },
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.check.oxlint.container.title",
      description: "app.api.v1.core.system.check.oxlint.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      path: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.check.oxlint.fields.path.label",
          description:
            "app.api.v1.core.system.check.oxlint.fields.path.description",
          placeholder:
            "app.api.v1.core.system.check.oxlint.fields.path.placeholder",
          layout: { columns: 6 },
        },
        z.union([z.string(), z.array(z.string())]).optional().default("./"),
      ),

      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.check.oxlint.fields.verbose.label",
          description:
            "app.api.v1.core.system.check.oxlint.fields.verbose.description",
          layout: { columns: 3 },
        },
        z.boolean().default(false),
      ),

      fix: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.system.check.oxlint.fields.fix.label",
          description:
            "app.api.v1.core.system.check.oxlint.fields.fix.description",
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
            "app.api.v1.core.system.check.oxlint.fields.timeoutSeconds.label",
          description:
            "app.api.v1.core.system.check.oxlint.fields.timeoutSeconds.description",
          layout: { columns: 3 },
        },
        z.number().min(1).max(3600).default(3600),
      ),

      cacheDir: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.check.oxlint.fields.cacheDir.label",
          description:
            "app.api.v1.core.system.check.oxlint.fields.cacheDir.description",
          layout: { columns: 3 },
        },
        z.string().optional().default("./.tmp"),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.system.check.oxlint.response.success",
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
            title: "app.api.v1.core.system.check.oxlint.title",
            description: "app.api.v1.core.system.check.oxlint.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            file: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.oxlint.response.errors.item.file",
              },
              z.string(),
            ),
            line: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.oxlint.response.errors.item.line",
              },
              z.number().optional(),
            ),
            column: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.oxlint.response.errors.item.column",
              },
              z.number().optional(),
            ),
            rule: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.oxlint.response.errors.item.rule",
              },
              z.string().optional(),
            ),
            severity: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.oxlint.response.errors.item.severity",
              },
              z.enum(["error", "warning", "info"]),
            ),
            message: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.oxlint.response.errors.item.message",
              },
              z.string(),
            ),
            type: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.check.oxlint.response.errors.item.title",
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
      title: "app.api.v1.core.system.check.oxlint.errors.validation.title",
      description:
        "app.api.v1.core.system.check.oxlint.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.check.oxlint.errors.internal.title",
      description:
        "app.api.v1.core.system.check.oxlint.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.system.check.oxlint.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.check.oxlint.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.system.check.oxlint.errors.forbidden.title",
      description:
        "app.api.v1.core.system.check.oxlint.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.check.oxlint.errors.internal.title",
      description:
        "app.api.v1.core.system.check.oxlint.errors.internal.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.check.oxlint.errors.internal.title",
      description:
        "app.api.v1.core.system.check.oxlint.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.check.oxlint.errors.internal.title",
      description:
        "app.api.v1.core.system.check.oxlint.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.check.oxlint.errors.internal.title",
      description:
        "app.api.v1.core.system.check.oxlint.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.check.oxlint.errors.internal.title",
      description:
        "app.api.v1.core.system.check.oxlint.errors.internal.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.system.check.oxlint.success.title",
    description: "app.api.v1.core.system.check.oxlint.success.description",
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
        path: "src/app/api/[locale]/v1/core/system/unified-interface/cli",
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
    urlPathParams: undefined,
  },
});

// Export types following migration guide pattern
export type OxlintRequestInput = typeof POST.types.RequestInput;
export type OxlintRequestOutput = typeof POST.types.RequestOutput;
export type OxlintResponseInput = typeof POST.types.ResponseInput;
export type OxlintResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
