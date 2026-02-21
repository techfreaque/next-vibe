/**
 * Pulse Execution History API Definition
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { PulseExecutionStatusDB, PulseHealthStatusDB } from "../../enum";
import { PulseHistoryContainer } from "./widget";

export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["system", "unified-interface", "tasks", "pulse", "history"],
  title: "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.title",
  description:
    "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.description",
  icon: "activity",
  category: "app.api.system.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.system.unifiedInterface.tasks.type.cron"],

  fields: customWidgetObject({
    render: PulseHistoryContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),

      // === REQUEST FIELDS ===
      startDate: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.startDate.label",
        description:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.startDate.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),
      endDate: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.endDate.label",
        description:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.endDate.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),
      status: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.status.label",
        description:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.status.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.status.placeholder",
        schema: z.string().optional(),
      }),
      limit: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.limit.label",
        description:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.limit.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.limit.placeholder",
        schema: z.coerce.number().optional(),
      }),
      offset: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.offset.label",
        description:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.offset.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.fields.offset.placeholder",
        schema: z.coerce.number().optional(),
      }),

      // === RESPONSE FIELDS ===
      executions: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.response.executions.title",
        schema: z.array(
          z.object({
            id: z.string(),
            pulseId: z.string(),
            status: z.enum(PulseExecutionStatusDB),
            healthStatus: z.enum(PulseHealthStatusDB),
            startedAt: z.string(),
            completedAt: z.string().nullable(),
            durationMs: z.coerce.number().nullable(),
            totalTasksDiscovered: z.coerce.number(),
            tasksDue: z.array(z.string()),
            tasksExecuted: z.array(z.string()),
            tasksSucceeded: z.array(z.string()),
            tasksFailed: z.array(z.string()),
            tasksSkipped: z.array(z.string()),
            totalExecutionTimeMs: z.coerce.number().nullable(),
            environment: z.string().nullable(),
            triggeredBy: z.string().nullable(),
            createdAt: z.string(),
          }),
        ),
      }),
      totalCount: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.response.totalCount.title",
        schema: z.coerce.number(),
      }),
      hasMore: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.response.hasMore.title",
        schema: z.boolean(),
      }),
      summary: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.response.summary.title",
        schema: z.object({
          totalExecutions: z.coerce.number(),
          successfulExecutions: z.coerce.number(),
          failedExecutions: z.coerce.number(),
          averageDuration: z.coerce.number().nullable(),
          successRate: z.coerce.number(),
        }),
      }),
    },
  }),
  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.success.title",
    description:
      "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.server.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.unsavedChanges.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.unsavedChanges.title",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.history.get.errors.conflict.description",
    },
  },
  examples: {
    requests: { default: {} },
    responses: {
      default: {
        executions: [],
        totalCount: 0,
        hasMore: false,
        summary: {
          totalExecutions: 0,
          successfulExecutions: 0,
          failedExecutions: 0,
          averageDuration: null,
          successRate: 0,
        },
      },
    },
  },
});

export type PulseHistoryRequestOutput = typeof GET.types.RequestOutput;
export type PulseHistoryResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
