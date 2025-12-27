/**
 * Run TypeScript type checking Endpoint Definition
 * Production-ready endpoint for run typescript type checking
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
  ComponentVariant,
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "check", "typecheck"],
  title: "app.api.system.check.typecheck.title",
  description: "app.api.system.check.typecheck.description",
  category: "app.api.system.check.typecheck.category",
  tags: ["app.api.system.check.typecheck.tag"],
  icon: "check-circle",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.MCP_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["typecheck", "tc"],
  cli: {
    firstCliArgKey: "path",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.check.typecheck.container.title",
      description: "app.api.system.check.typecheck.container.description",
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
          label: "app.api.system.check.typecheck.fields.path.label",
          description: "app.api.system.check.typecheck.fields.path.description",
          placeholder: "app.api.system.check.typecheck.fields.path.placeholder",
          columns: 6,
        },
        z.string().optional(),
      ),

      disableFilter: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.typecheck.fields.disableFilter.label",
          description:
            "app.api.system.check.typecheck.fields.disableFilter.description",
          columns: 4,
        },
        z.boolean().default(false),
      ),

      createConfig: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.system.check.typecheck.fields.createConfig.label",
          description:
            "app.api.system.check.typecheck.fields.createConfig.description",
          columns: 4,
        },
        z.boolean().default(false),
      ),

      timeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.system.check.typecheck.fields.timeout.label",
          description:
            "app.api.system.check.typecheck.fields.timeout.description",
          columns: 4,
        },
        z.coerce.number().min(1).max(3600).default(900),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.check.typecheck.response.successMessage",
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
            title: "app.api.system.check.typecheck.response.issue.title",
            description:
              "app.api.system.check.typecheck.response.issue.description",
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            file: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.check.typecheck.response.issue.file",
              },
              z.string(),
            ),
            line: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.check.typecheck.response.issue.line",
              },
              z.coerce.number().optional(),
            ),
            column: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.check.typecheck.response.issue.column",
              },
              z.coerce.number().optional(),
            ),
            code: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.system.check.typecheck.response.issue.code",
              },
              z.string().optional(),
            ),
            severity: responseField(
              {
                type: WidgetType.BADGE,
                variant: ComponentVariant.WARNING,
                text: "app.api.system.check.typecheck.response.issue.severity",
              },
              z.enum(["error", "warning", "info"]),
            ),
            message: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.system.check.typecheck.response.issue.message",
              },
              z.string(),
            ),
            type: responseField(
              {
                type: WidgetType.BADGE,
                variant: ComponentVariant.DEFAULT,
                text: "app.api.system.check.typecheck.response.issue.type",
              },
              z.literal("type"),
            ),
          },
        ),
      ),

      // Summary is now handled by the grouped list widget - no separate container needed
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.check.typecheck.errors.validation.title",
      description:
        "app.api.system.check.typecheck.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.check.typecheck.errors.internal.title",
      description: "app.api.system.check.typecheck.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.check.typecheck.errors.unauthorized.title",
      description:
        "app.api.system.check.typecheck.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.check.typecheck.errors.forbidden.title",
      description:
        "app.api.system.check.typecheck.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.check.typecheck.errors.notFound.title",
      description: "app.api.system.check.typecheck.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.check.typecheck.errors.server.title",
      description: "app.api.system.check.typecheck.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.check.typecheck.errors.unknown.title",
      description: "app.api.system.check.typecheck.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.check.typecheck.errors.unsaved.title",
      description: "app.api.system.check.typecheck.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.check.typecheck.errors.conflict.title",
      description: "app.api.system.check.typecheck.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.system.check.typecheck.success.title",
    description: "app.api.system.check.typecheck.success.description",
  },

  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
        success: true,
        issues: [],
      },
    },
  },
});

export type TypecheckRequestInput = typeof POST.types.RequestInput;
export type TypecheckRequestOutput = typeof POST.types.RequestOutput;
export type TypecheckResponseInput = typeof POST.types.ResponseInput;
export type TypecheckResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
