/**
 * Admin Consultation Stats Endpoint Definition
 *
 * Production-ready endpoint for admin consultation statistics with comprehensive
 * analytics and data-driven UI metadata.
 */

import { z } from "zod";

import {
  ChartType,
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import {
  ConsultationOutcome,
  ConsultationOutcomeOptions,
  ConsultationStatus,
  ConsultationStatusOptions,
  ConsultationType,
  ConsultationTypeOptions,
} from "../../enum";
import {
  ChartDataField,
  ChartTypeOptions,
  DateRangePreset,
  DateRangePresetOptions,
  GroupByField,
  GroupByFieldOptions,
  TimePeriod,
  TimePeriodOptions,
} from "./enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "consultation", "admin", "stats"],
  title: "app.api.v1.core.consultation.admin.stats.get.title",
  description: "app.api.v1.core.consultation.admin.stats.get.description",
  category: "app.api.v1.core.consultation.list.category",
  tags: ["app.api.v1.core.consultation.create.tag"],
  allowedRoles: [UserRole.ADMIN],
  examples: {
    requests: {
      GET: {
        dateRangePreset: DateRangePreset.LAST_30_DAYS,
        timePeriod: TimePeriod.DAY,
        chartType: ChartType.LINE,
      },
    },
    responses: {
      GET: {
        totalConsultations: 150,
        scheduledConsultations: 45,
        completedConsultations: 80,
        cancelledConsultations: 15,
        noShowConsultations: 10,
        rescheduledConsultations: 5,
        pendingConsultations: 25,
        totalRevenue: 12500.5,
        averageRevenue: 156.25,
        averageDuration: 45.5,
        completionRate: 72.5,
        cancellationRate: 15.0,
        noShowRate: 10.0,
        rescheduleRate: 5.0,
        consultationsByStatus: [
          {
            status: ConsultationStatus.COMPLETED,
            count: 80,
            percentage: 53.3,
          },
          {
            status: ConsultationStatus.SCHEDULED,
            count: 45,
            percentage: 30.0,
          },
        ],
        consultationsByType: [
          { type: "initial", count: 90, percentage: 60.0 },
          { type: "follow_up", count: 60, percentage: 40.0 },
        ],
        consultationsByDuration: [
          { durationRange: "30-60min", count: 75, percentage: 50.0 },
          { durationRange: "60-90min", count: 60, percentage: 40.0 },
        ],
        consultationsByTimeSlot: [
          { timeSlot: "09:00-12:00", count: 60, percentage: 40.0 },
          { timeSlot: "13:00-17:00", count: 90, percentage: 60.0 },
        ],
        consultationsByConsultant: [
          {
            consultantId: "123",
            consultantName: "John Doe",
            count: 50,
            percentage: 33.3,
          },
        ],
        historicalData: [
          {
            date: "2024-01-01",
            count: 10,
            completed: 8,
            cancelled: 1,
            noShow: 1,
          },
        ],
        groupedStats: [
          {
            groupKey: "status",
            groupValue: ConsultationStatus.COMPLETED,
            count: 80,
            percentage: 53.3,
          },
        ],
      },
    },
  },
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.consultation.admin.stats.get.container.title",
      description:
        "app.api.v1.core.consultation.admin.stats.get.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      dateRangePreset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.consultation.admin.stats.get.dateRangePreset.label",
          description:
            "app.api.v1.core.consultation.admin.stats.get.dateRangePreset.description",
          placeholder:
            "app.api.v1.core.consultation.admin.stats.get.dateRangePreset.placeholder",
          options: DateRangePresetOptions,
        },
        z.nativeEnum(DateRangePreset).optional(),
      ),

      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.consultation.admin.stats.get.status.label",
          description:
            "app.api.v1.core.consultation.admin.stats.get.status.description",
          placeholder:
            "app.api.v1.core.consultation.admin.stats.get.status.placeholder",
          options: ConsultationStatusOptions,
        },
        z.array(z.nativeEnum(ConsultationStatus)).optional(),
      ),

      outcome: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.consultation.admin.stats.get.outcome.label",
          description:
            "app.api.v1.core.consultation.admin.stats.get.outcome.description",
          placeholder:
            "app.api.v1.core.consultation.admin.stats.get.outcome.placeholder",
          options: ConsultationOutcomeOptions,
        },
        z.array(z.nativeEnum(ConsultationOutcome)).optional(),
      ),

      consultationType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.consultation.admin.stats.get.consultationType.label",
          description:
            "app.api.v1.core.consultation.admin.stats.get.consultationType.description",
          placeholder:
            "app.api.v1.core.consultation.admin.stats.get.consultationType.placeholder",
          options: ConsultationTypeOptions,
        },
        z.array(z.nativeEnum(ConsultationType)).optional(),
      ),

      timePeriod: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.consultation.admin.stats.get.timePeriod.label",
          description:
            "app.api.v1.core.consultation.admin.stats.get.timePeriod.description",
          placeholder:
            "app.api.v1.core.consultation.admin.stats.get.timePeriod.placeholder",
          options: TimePeriodOptions,
        },
        z.nativeEnum(TimePeriod).optional(),
      ),

      chartType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.consultation.admin.stats.get.chartType.label",
          description:
            "app.api.v1.core.consultation.admin.stats.get.chartType.description",
          placeholder:
            "app.api.v1.core.consultation.admin.stats.get.chartType.placeholder",
          options: ChartTypeOptions,
        },
        z.nativeEnum(ChartType).optional(),
      ),

      userId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.consultation.admin.stats.get.userId.label",
          description:
            "app.api.v1.core.consultation.admin.stats.get.userId.description",
          placeholder:
            "app.api.v1.core.consultation.admin.stats.get.userId.placeholder",
        },
        z.uuid().optional(),
      ),

      leadId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.consultation.admin.stats.get.leadId.label",
          description:
            "app.api.v1.core.consultation.admin.stats.get.leadId.description",
          placeholder:
            "app.api.v1.core.consultation.admin.stats.get.leadId.placeholder",
        },
        z.uuid().optional(),
      ),

      hasUserId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.consultation.admin.stats.get.hasUserId.label",
          description:
            "app.api.v1.core.consultation.admin.stats.get.hasUserId.description",
        },
        z.boolean().optional(),
      ),

      hasLeadId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.consultation.admin.stats.get.hasLeadId.label",
          description:
            "app.api.v1.core.consultation.admin.stats.get.hasLeadId.description",
        },
        z.boolean().optional(),
      ),

      groupBy: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.consultation.admin.stats.get.groupBy.label",
          description:
            "app.api.v1.core.consultation.admin.stats.get.groupBy.description",
          placeholder:
            "app.api.v1.core.consultation.admin.stats.get.groupBy.placeholder",
          options: GroupByFieldOptions,
        },
        z.nativeEnum(GroupByField).optional(),
      ),

      totalConsultations: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.totalConsultations.title",
          value: "totalConsultations",
        },
        z.number().int().min(0),
      ),

      scheduledConsultations: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.scheduledConsultations.title",
          value: "scheduledConsultations",
        },
        z.number().int().min(0),
      ),

      completedConsultations: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.completedConsultations.title",
          value: "completedConsultations",
        },
        z.number().int().min(0),
      ),

      cancelledConsultations: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.cancelledConsultations.title",
          value: "cancelledConsultations",
        },
        z.number().int().min(0),
      ),

      noShowConsultations: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.noShowConsultations.title",
          value: "noShowConsultations",
        },
        z.number().int().min(0),
      ),

      rescheduledConsultations: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.rescheduledConsultations.title",
          value: "rescheduledConsultations",
        },
        z.number().int().min(0),
      ),

      pendingConsultations: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.pendingConsultations.title",
          value: "pendingConsultations",
        },
        z.number().int().min(0),
      ),

      totalRevenue: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.totalRevenue.title",
          value: "totalRevenue",
          format: "currency",
        },
        z.number().min(0),
      ),

      averageRevenue: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.averageRevenue.title",
          value: "averageRevenue",
          format: "currency",
        },
        z.number().min(0),
      ),

      averageDuration: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.averageDuration.title",
          value: "averageDuration",
          format: "number",
        },
        z.number().min(0),
      ),

      completionRate: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.completionRate.title",
          value: "completionRate",
          format: "percentage",
        },
        z.number().min(0).max(100),
      ),

      cancellationRate: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.cancellationRate.title",
          value: "cancellationRate",
          format: "percentage",
        },
        z.number().min(0).max(100),
      ),

      noShowRate: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.noShowRate.title",
          value: "noShowRate",
          format: "percentage",
        },
        z.number().min(0).max(100),
      ),

      rescheduleRate: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.rescheduleRate.title",
          value: "rescheduleRate",
          format: "percentage",
        },
        z.number().min(0).max(100),
      ),

      consultationsByStatus: responseArrayField(
        {
          type: WidgetType.GROUPED_LIST,
          groupBy: "status",
          sortBy: "count",
          showGroupSummary: true,
          layout: { type: LayoutType.GRID, columns: 6 },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.consultation.admin.stats.get.response.consultationsByStatus.title",
            description:
              "app.api.v1.core.consultation.admin.stats.get.response.consultationsByStatus.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            status: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByStatus.status",
              },
              z.string(),
            ),
            count: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByStatus.count",
              },
              z.number().int().min(0),
            ),
            percentage: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByStatus.percentage",
              },
              z.number().min(0).max(100),
            ),
          },
        ),
      ),

      consultationsByType: responseArrayField(
        {
          type: WidgetType.GROUPED_LIST,
          groupBy: "type",
          sortBy: "count",
          showGroupSummary: true,
          layout: { type: LayoutType.GRID, columns: 6 },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.consultation.admin.stats.get.response.consultationsByType.title",
            description:
              "app.api.v1.core.consultation.admin.stats.get.response.consultationsByType.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            type: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByType.item",
              },
              z.string(),
            ),
            count: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByType.count",
              },
              z.number().int().min(0),
            ),
            percentage: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByType.percentage",
              },
              z.number().min(0).max(100),
            ),
          },
        ),
      ),

      consultationsByDuration: responseArrayField(
        {
          type: WidgetType.GROUPED_LIST,
          groupBy: "durationRange",
          sortBy: "count",
          showGroupSummary: true,
          layout: { type: LayoutType.GRID, columns: 6 },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.consultation.admin.stats.get.response.consultationsByDuration.title",
            description:
              "app.api.v1.core.consultation.admin.stats.get.response.consultationsByDuration.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            durationRange: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByDuration.durationRange",
              },
              z.string(),
            ),
            count: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByDuration.count",
              },
              z.number().int().min(0),
            ),
            percentage: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByDuration.percentage",
              },
              z.number().min(0).max(100),
            ),
          },
        ),
      ),

      consultationsByTimeSlot: responseArrayField(
        {
          type: WidgetType.GROUPED_LIST,
          groupBy: "timeSlot",
          sortBy: "count",
          showGroupSummary: true,
          layout: { type: LayoutType.GRID, columns: 6 },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.consultation.admin.stats.get.response.consultationsByTimeSlot.title",
            description:
              "app.api.v1.core.consultation.admin.stats.get.response.consultationsByTimeSlot.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            timeSlot: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByTimeSlot.timeSlot",
              },
              z.string(),
            ),
            count: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByTimeSlot.count",
              },
              z.number().int().min(0),
            ),
            percentage: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByTimeSlot.percentage",
              },
              z.number().min(0).max(100),
            ),
          },
        ),
      ),

      consultationsByConsultant: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "consultantName",
              label:
                "app.api.v1.core.consultation.admin.stats.get.response.consultationsByConsultant.consultantName",
              type: FieldDataType.TEXT,
              sortable: true,
            },
            {
              key: "count",
              label:
                "app.api.v1.core.consultation.admin.stats.get.response.consultationsByConsultant.count",
              type: FieldDataType.NUMBER,
              sortable: true,
            },
            {
              key: "percentage",
              label:
                "app.api.v1.core.consultation.admin.stats.get.response.consultationsByConsultant.percentage",
              type: FieldDataType.NUMBER,
              sortable: true,
            },
          ],
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.consultation.admin.stats.get.response.consultationsByConsultant.title",
            description:
              "app.api.v1.core.consultation.admin.stats.get.response.consultationsByConsultant.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            consultantId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByConsultant.consultantId",
              },
              z.string().nullable(),
            ),
            consultantName: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByConsultant.consultantName",
              },
              z.string(),
            ),
            count: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByConsultant.count",
              },
              z.number().int().min(0),
            ),
            percentage: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.consultationsByConsultant.percentage",
              },
              z.number().min(0).max(100),
            ),
          },
        ),
      ),

      historicalData: responseArrayField(
        {
          type: WidgetType.CHART,
          title:
            "app.api.v1.core.consultation.admin.stats.get.response.historicalData.title",
          chartType: ChartType.LINE,
          data: {
            x: "date",
            y: [
              ChartDataField.COUNT,
              ChartDataField.COMPLETED,
              ChartDataField.CANCELLED,
              ChartDataField.NO_SHOW,
            ],
          },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.consultation.admin.stats.get.response.historicalData.title",
            description:
              "app.api.v1.core.consultation.admin.stats.get.response.historicalData.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            date: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.historicalData.date",
              },
              z.string(),
            ),
            count: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.historicalData.count",
              },
              z.number().int().min(0),
            ),
            completed: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.historicalData.completed",
              },
              z.number().int().min(0),
            ),
            cancelled: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.historicalData.cancelled",
              },
              z.number().int().min(0),
            ),
            noShow: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.historicalData.noShow",
              },
              z.number().int().min(0),
            ),
          },
        ),
      ),

      groupedStats: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "groupKey",
              label:
                "app.api.v1.core.consultation.admin.stats.get.response.groupedStats.groupKey",
              type: FieldDataType.TEXT,
              sortable: true,
            },
            {
              key: "groupValue",
              label:
                "app.api.v1.core.consultation.admin.stats.get.response.groupedStats.groupValue",
              type: FieldDataType.TEXT,
              sortable: true,
            },
            {
              key: "count",
              label:
                "app.api.v1.core.consultation.admin.stats.get.response.groupedStats.count",
              type: FieldDataType.NUMBER,
              sortable: true,
            },
            {
              key: "percentage",
              label:
                "app.api.v1.core.consultation.admin.stats.get.response.groupedStats.percentage",
              type: FieldDataType.NUMBER,
              sortable: true,
            },
          ],
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.consultation.admin.stats.get.response.groupedStats.title",
            description:
              "app.api.v1.core.consultation.admin.stats.get.response.groupedStats.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            groupKey: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.groupedStats.groupKey",
              },
              z.string(),
            ),
            groupValue: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.groupedStats.groupValue",
              },
              z.string(),
            ),
            count: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.groupedStats.count",
              },
              z.number().int().min(0),
            ),
            percentage: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.stats.get.response.groupedStats.percentage",
              },
              z.number().min(0).max(100),
            ),
          },
        ),
      ),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.consultation.admin.stats.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.consultation.admin.stats.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.consultation.admin.stats.get.errors.validation.title",
      description:
        "app.api.v1.core.consultation.admin.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.consultation.admin.stats.get.errors.server.title",
      description:
        "app.api.v1.core.consultation.admin.stats.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.consultation.admin.stats.get.errors.unknown.title",
      description:
        "app.api.v1.core.consultation.admin.stats.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.consultation.admin.stats.get.errors.network.title",
      description:
        "app.api.v1.core.consultation.admin.stats.get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.consultation.admin.stats.get.errors.forbidden.title",
      description:
        "app.api.v1.core.consultation.admin.stats.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.consultation.admin.stats.get.errors.notFound.title",
      description:
        "app.api.v1.core.consultation.admin.stats.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.consultation.admin.stats.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.consultation.admin.stats.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.consultation.admin.stats.get.errors.conflict.title",
      description:
        "app.api.v1.core.consultation.admin.stats.get.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.consultation.admin.stats.get.success.title",
    description:
      "app.api.v1.core.consultation.admin.stats.get.success.description",
  },
});

// Extract types for use in other files
export type ConsultationStatsRequestType = typeof GET.types.RequestInput;
export type ConsultationStatsRequestTypeOutput = typeof GET.types.RequestOutput;
export type ConsultationStatsResponseType = typeof GET.types.ResponseInput;
export type ConsultationStatsResponseTypeOutput =
  typeof GET.types.ResponseOutput;

const adminStatsEndpoints = { GET };
export default adminStatsEndpoints;
