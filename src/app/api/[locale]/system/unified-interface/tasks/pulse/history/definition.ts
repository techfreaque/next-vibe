/**
 * Pulse Execution History API Definition
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { PulseExecutionStatusDB, PulseHealthStatusDB } from "../../enum";
import { PULSE_HISTORY_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";
import { PulseHistoryContainer } from "./widget";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "unified-interface", "tasks", "pulse", "history"],
  aliases: [PULSE_HISTORY_ALIAS, "pulse:history"],
  title: "get.title",
  description: "get.description",
  icon: "activity",
  category: "app.endpointCategories.system",
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],
  tags: ["tags.pulse" as const],

  fields: customWidgetObject({
    render: PulseHistoryContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),

      // === REQUEST FIELDS ===
      startDate: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.fields.startDate.label",
        description: "get.fields.startDate.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),
      endDate: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.fields.endDate.label",
        description: "get.fields.endDate.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),
      status: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.status.label",
        description: "get.fields.status.description",
        placeholder: "get.fields.status.placeholder",
        schema: z.string().optional(),
      }),
      limit: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.limit.label",
        description: "get.fields.limit.description",
        placeholder: "get.fields.limit.placeholder",
        schema: z.coerce.number().optional(),
      }),
      offset: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.offset.label",
        description: "get.fields.offset.description",
        placeholder: "get.fields.offset.placeholder",
        schema: z.coerce.number().optional(),
      }),

      // === RESPONSE FIELDS ===
      executions: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.executions.title",
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
      totalCount: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalCount.title",
        schema: z.coerce.number(),
      }),
      hasMore: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.hasMore.title",
        schema: z.boolean(),
      }),
      summary: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.summary.title",
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
    title: "get.success.title",
    description: "get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.title",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
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
