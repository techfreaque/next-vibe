/**
 * Run TypeScript type checking Endpoint Definition
 * Production-ready endpoint for run typescript type checking
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
  path: ["system", "check", "typecheck"],
  title: "title",
  description: "description",
  category: "category",
  tags: ["tag"],
  icon: "check-circle",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.PRODUCTION_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["typecheck", "tc"],
  cli: {
    firstCliArgKey: "path",
  },

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      title: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        content: "container.title",
        level: 1,
        columns: 12,
        usage: { request: "data" },
      }),

      path: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.path.label",
        description: "fields.path.description",
        placeholder: "fields.path.placeholder",
        columns: 6,
        schema: z.union([z.string(), z.array(z.string())]).optional(),
      }),

      disableFilter: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.disableFilter.label",
        description: "fields.disableFilter.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      timeout: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.timeout.label",
        description: "fields.timeout.description",
        columns: 4,
        schema: z.coerce.number().min(1).max(3600).default(900),
      }),

      limit: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.limit.label",
        description: "fields.limit.description",
        columns: 4,
        schema: z.coerce.number().min(1).optional().default(200),
      }),

      page: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "fields.page.label",
        description: "fields.page.description",
        columns: 4,
        schema: z.coerce.number().min(1).optional().default(1),
      }),

      skipSorting: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipSorting.label",
        description: "fields.skipSorting.description",
        columns: 3,
        schema: z.boolean().default(false),
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
      items: scopedResponseField(scopedTranslation, {
        type: WidgetType.CODE_QUALITY_LIST,
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

  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  examples: {
    requests: {
      default: {
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
    },
  },
});

export type TypecheckRequestInput = typeof POST.types.RequestInput;
export type TypecheckRequestOutput = typeof POST.types.RequestOutput;
export type TypecheckResponseInput = typeof POST.types.ResponseInput;
export type TypecheckResponseOutput = typeof POST.types.ResponseOutput;

export type TypecheckIssue = NonNullable<
  TypecheckResponseOutput["items"]
>[number];

const endpoints = { POST };
export default endpoints;
