/**
 * PerformanceAnalyzeInsight Tool - Definition
 * Provides detailed information on a specific Performance Insight
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["browser", "performance-analyze-insight"],
  title: "app.api.browser.performance-analyze-insight.title",
  description: "app.api.browser.performance-analyze-insight.description",
  category: "app.api.browser.category",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.performanceAutomation",
  ],

  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.browser.performance-analyze-insight.form.label",
      description:
        "app.api.browser.performance-analyze-insight.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      insightSetId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.browser.performance-analyze-insight.form.fields.insightSetId.label",
          description:
            "app.api.browser.performance-analyze-insight.form.fields.insightSetId.description",
          placeholder:
            "app.api.browser.performance-analyze-insight.form.fields.insightSetId.placeholder",
          columns: 6,
        },
        z
          .string()
          .describe(
            'The id for the specific insight set. Only use the ids given in the "Available insight sets" list.',
          ),
      ),
      insightName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.browser.performance-analyze-insight.form.fields.insightName.label",
          description:
            "app.api.browser.performance-analyze-insight.form.fields.insightName.description",
          placeholder:
            "app.api.browser.performance-analyze-insight.form.fields.insightName.placeholder",
          columns: 6,
        },
        z
          .string()
          .describe(
            'The name of the Insight you want more information on. For example: "DocumentLatency" or "LCPBreakdown"',
          ),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.browser.performance-analyze-insight.response.success",
        },
        z
          .boolean()
          .describe(
            "Whether the performance insight analysis operation succeeded",
          ),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.browser.performance-analyze-insight.response.result",
        },
        z
          .object({
            analyzed: z.boolean().describe("Whether the insight was analyzed"),
            insight: z
              .object({
                name: z.string(),
                value: z.number(),
                details: z.string(),
              })
              .describe("The analyzed insight details"),
          })
          .optional()
          .describe("Result of performance insight analysis"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.performance-analyze-insight.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.browser.performance-analyze-insight.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: { insightSetId: "set_123", insightName: "LCPBreakdown" },
    },
    responses: {
      default: {
        success: true,
        result: {
          analyzed: true,
          insight: {
            name: "LCP",
            value: 2500,
            details: "Largest Contentful Paint",
          },
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.browser.performance-analyze-insight.errors.validation.title",
      description:
        "app.api.browser.performance-analyze-insight.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.performance-analyze-insight.errors.network.title",
      description:
        "app.api.browser.performance-analyze-insight.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.browser.performance-analyze-insight.errors.unauthorized.title",
      description:
        "app.api.browser.performance-analyze-insight.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.browser.performance-analyze-insight.errors.forbidden.title",
      description:
        "app.api.browser.performance-analyze-insight.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.browser.performance-analyze-insight.errors.notFound.title",
      description:
        "app.api.browser.performance-analyze-insight.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.browser.performance-analyze-insight.errors.serverError.title",
      description:
        "app.api.browser.performance-analyze-insight.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.performance-analyze-insight.errors.unknown.title",
      description:
        "app.api.browser.performance-analyze-insight.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.browser.performance-analyze-insight.errors.unsavedChanges.title",
      description:
        "app.api.browser.performance-analyze-insight.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.browser.performance-analyze-insight.errors.conflict.title",
      description:
        "app.api.browser.performance-analyze-insight.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.performance-analyze-insight.success.title",
    description:
      "app.api.browser.performance-analyze-insight.success.description",
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
