/**
 * PerformanceAnalyzeInsight Tool - Definition
 * Provides detailed information on a specific Performance Insight
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "performance-analyze-insight"],
  title: "performance-analyze-insight.title",
  description: "performance-analyze-insight.description",
  category: "app.endpointCategories.browserAutomation",
  icon: "trending-up",
  tags: [
    "performance-analyze-insight.tags.browserAutomation",
    "performance-analyze-insight.tags.performanceAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "performance-analyze-insight.form.label",
    description: "performance-analyze-insight.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      insightSetId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "performance-analyze-insight.form.fields.insightSetId.label",
        description:
          "performance-analyze-insight.form.fields.insightSetId.description",
        placeholder:
          "performance-analyze-insight.form.fields.insightSetId.placeholder",
        columns: 6,
        schema: z
          .string()
          .describe(
            'The id for the specific insight set. Only use the ids given in the "Available insight sets" list.',
          ),
      }),
      insightName: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "performance-analyze-insight.form.fields.insightName.label",
        description:
          "performance-analyze-insight.form.fields.insightName.description",
        placeholder:
          "performance-analyze-insight.form.fields.insightName.placeholder",
        columns: 6,
        schema: z
          .string()
          .describe(
            'The name of the Insight you want more information on. For example: "DocumentLatency" or "LCPBreakdown"',
          ),
      }),

      // Response fields
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "performance-analyze-insight.response.success",
        schema: z
          .boolean()
          .describe(
            "Whether the performance insight analysis operation succeeded",
          ),
      }),
      result: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "performance-analyze-insight.response.result",
        schema: z
          .array(
            z.object({
              type: z.string().describe("Content type (text or image)"),
              text: z.string().optional().describe("Text content"),
              data: z.string().optional().describe("Base64 encoded data"),
              mimeType: z.string().optional().describe("MIME type for data"),
            }),
          )
          .optional()
          .describe("MCP content blocks returned by the tool"),
      }),
      error: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "performance-analyze-insight.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "performance-analyze-insight.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { insightSetId: "set_123", insightName: "LCPBreakdown" },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# performance_analyze_insight response\nLCP: 2500ms - Largest Contentful Paint",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "performance-analyze-insight.errors.validation.title",
      description: "performance-analyze-insight.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "performance-analyze-insight.errors.network.title",
      description: "performance-analyze-insight.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "performance-analyze-insight.errors.unauthorized.title",
      description:
        "performance-analyze-insight.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "performance-analyze-insight.errors.forbidden.title",
      description: "performance-analyze-insight.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "performance-analyze-insight.errors.notFound.title",
      description: "performance-analyze-insight.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "performance-analyze-insight.errors.serverError.title",
      description: "performance-analyze-insight.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "performance-analyze-insight.errors.unknown.title",
      description: "performance-analyze-insight.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "performance-analyze-insight.errors.unsavedChanges.title",
      description:
        "performance-analyze-insight.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "performance-analyze-insight.errors.conflict.title",
      description: "performance-analyze-insight.errors.conflict.description",
    },
  },
  successTypes: {
    title: "performance-analyze-insight.success.title",
    description: "performance-analyze-insight.success.description",
  },
});

export type PerformanceAnalyzeInsightRequestInput =
  typeof POST.types.RequestInput;
export type PerformanceAnalyzeInsightRequestOutput =
  typeof POST.types.RequestOutput;
export type PerformanceAnalyzeInsightResponseInput =
  typeof POST.types.ResponseInput;
export type PerformanceAnalyzeInsightResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
