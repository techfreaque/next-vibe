/**
 * PerformanceStartTrace Tool - Definition
 * Starts a performance trace recording on the selected page
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
  path: ["browser", "performance-start-trace"],
  title: "performance-start-trace.title",
  description: "performance-start-trace.description",
  category: "performance-start-trace.category",
  icon: "activity",
  tags: [
    "performance-start-trace.tags.browserAutomation",
    "performance-start-trace.tags.performanceAutomation",
  ],

  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "performance-start-trace.form.label",
    description: "performance-start-trace.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      reload: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "performance-start-trace.form.fields.reload.label",
        description: "performance-start-trace.form.fields.reload.description",
        placeholder: "performance-start-trace.form.fields.reload.placeholder",
        columns: 6,
        schema: z
          .boolean()
          .describe(
            "Determines if, once tracing has started, the page should be automatically reloaded",
          ),
      }),
      autoStop: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "performance-start-trace.form.fields.autoStop.label",
        description: "performance-start-trace.form.fields.autoStop.description",
        placeholder: "performance-start-trace.form.fields.autoStop.placeholder",
        columns: 6,
        schema: z
          .boolean()
          .describe(
            "Determines if the trace recording should be automatically stopped",
          ),
      }),

      // Response fields
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "performance-start-trace.response.success",
        schema: z
          .boolean()
          .describe("Whether the trace start operation succeeded"),
      }),
      result: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "performance-start-trace.response.result",
        schema: z
          .object({
            started: z.boolean().describe("Whether the trace was started"),
            traceId: z.string().describe("Identifier for this trace"),
          })
          .optional()
          .describe("Result of trace start operation"),
      }),
      error: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "performance-start-trace.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "performance-start-trace.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { reload: true, autoStop: true },
    },
    responses: {
      default: {
        success: true,
        result: {
          started: true,
          traceId: "trace_123",
        },
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "performance-start-trace.errors.validation.title",
      description: "performance-start-trace.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "performance-start-trace.errors.network.title",
      description: "performance-start-trace.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "performance-start-trace.errors.unauthorized.title",
      description: "performance-start-trace.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "performance-start-trace.errors.forbidden.title",
      description: "performance-start-trace.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "performance-start-trace.errors.notFound.title",
      description: "performance-start-trace.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "performance-start-trace.errors.serverError.title",
      description: "performance-start-trace.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "performance-start-trace.errors.unknown.title",
      description: "performance-start-trace.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "performance-start-trace.errors.unsavedChanges.title",
      description: "performance-start-trace.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "performance-start-trace.errors.conflict.title",
      description: "performance-start-trace.errors.conflict.description",
    },
  },
  successTypes: {
    title: "performance-start-trace.success.title",
    description: "performance-start-trace.success.description",
  },
});

export type PerformanceStartTraceRequestInput = typeof POST.types.RequestInput;
export type PerformanceStartTraceRequestOutput =
  typeof POST.types.RequestOutput;
export type PerformanceStartTraceResponseInput =
  typeof POST.types.ResponseInput;
export type PerformanceStartTraceResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
