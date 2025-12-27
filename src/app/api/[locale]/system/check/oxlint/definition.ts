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
  path: ["system", "check", "oxlint"],
  title: "app.api.system.check.oxlint.title",
  description: "app.api.system.check.oxlint.description",
  category: "app.api.system.check.oxlint.category",
  tags: ["app.api.system.check.oxlint.tag"],
  icon: "shield",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["lint", "l"],

  cli: {
    firstCliArgKey: "path",
  },
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.check.oxlint.container.title",
      description: "app.api.system.check.oxlint.container.description",
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
          label: "app.api.system.check.oxlint.fields.path.label",
          description: "app.api.system.check.oxlint.fields.path.description",
          placeholder: "app.api.system.check.oxlint.fields.path.placeholder",
          columns: 6,
        },
        z
          .union([z.string(), z.array(z.string())])
          .optional()
          .default("./"),
      ),

      verbose: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.oxlint.fields.verbose.label",
          description: "app.api.system.check.oxlint.fields.verbose.description",
          columns: 3,
        },
        z.boolean().default(false),
      ),

      fix: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.oxlint.fields.fix.label",
          description: "app.api.system.check.oxlint.fields.fix.description",
          columns: 3,
        },
        // fix is false by default as it makes it way slower
        z.boolean().default(false),
      ),

      timeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.system.check.oxlint.fields.timeoutSeconds.label",
          description:
            "app.api.system.check.oxlint.fields.timeoutSeconds.description",
          columns: 3,
        },
        z.coerce.number().min(1).max(3600).default(3600),
      ),

      createConfig: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.oxlint.fields.createConfig.label",
          description:
            "app.api.system.check.oxlint.fields.createConfig.description",
          columns: 3,
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.check.oxlint.response.success",
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
            title: "app.api.system.check.oxlint.title",
            description: "app.api.system.check.oxlint.description",
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            file: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.check.oxlint.response.errors.item.file",
              },
              z.string(),
            ),
            line: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.check.oxlint.response.errors.item.line",
              },
              z.coerce.number().optional(),
            ),
            column: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.check.oxlint.response.errors.item.column",
              },
              z.coerce.number().optional(),
            ),
            rule: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.check.oxlint.response.errors.item.rule",
              },
              z.string().optional(),
            ),
            severity: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.check.oxlint.response.errors.item.severity",
              },
              z.enum(["error", "warning", "info"]),
            ),
            message: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.check.oxlint.response.errors.item.message",
              },
              z.string(),
            ),
            type: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.check.oxlint.response.errors.item.type",
              },
              z.literal("lint"),
            ),
          },
        ),
      ),

      // Config status response fields
      configMissing: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.check.oxlint.response.configMissing",
        },
        z.boolean().optional(),
      ),

      configPath: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.check.oxlint.response.configPath",
        },
        z.string().optional(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.check.oxlint.errors.validation.title",
      description: "app.api.system.check.oxlint.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.check.oxlint.errors.internal.title",
      description: "app.api.system.check.oxlint.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.check.oxlint.errors.unauthorized.title",
      description:
        "app.api.system.check.oxlint.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.check.oxlint.errors.forbidden.title",
      description: "app.api.system.check.oxlint.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.check.oxlint.errors.internal.title",
      description: "app.api.system.check.oxlint.errors.internal.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.check.oxlint.errors.internal.title",
      description: "app.api.system.check.oxlint.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.check.oxlint.errors.internal.title",
      description: "app.api.system.check.oxlint.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.check.oxlint.errors.internal.title",
      description: "app.api.system.check.oxlint.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.check.oxlint.errors.internal.title",
      description: "app.api.system.check.oxlint.errors.internal.description",
    },
  },

  successTypes: {
    title: "app.api.system.check.oxlint.success.title",
    description: "app.api.system.check.oxlint.success.description",
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
        path: "src/app/api/[locale]/system/unified-interface/cli",
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
