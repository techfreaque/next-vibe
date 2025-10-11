/**
 * Enhanced Template Stats API Definition
 * Provides comprehensive template statistics with advanced filtering
 */

import { z } from "zod";

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";
import {
  objectField,
  requestDataField,
  responseField,
  responseArrayField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { dateSchema } from "next-vibe/shared/types/common.schema";
import {
  DateRangePreset,
  TimePeriod,
} from "next-vibe/shared/types/stats-filtering.schema";

import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { TemplateStatus, TemplateStatusOptions } from "../enum";

// Create enum options for TimePeriod
const { options: TimePeriodOptions } = createEnumOptions(
  Object.entries(TimePeriod).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: `api.v1.templateApi.enhancedStats.timePeriod.${value}`,
    }),
    {},
  ),
);

// Create enum options for DateRangePreset
const { options: DateRangePresetOptions } = createEnumOptions(
  Object.entries(DateRangePreset).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: `api.v1.templateApi.enhancedStats.dateRangePreset.${value}`,
    }),
    {},
  ),
);

// Create enum options for Chart Type
const { enum: ChartType, options: ChartTypeOptions } = createEnumOptions({
  LINE: "app.api.v1.core.templateApi.enhancedStats.chartType.line",
  BAR: "app.api.v1.core.templateApi.enhancedStats.chartType.bar",
  PIE: "app.api.v1.core.templateApi.enhancedStats.chartType.pie",
});

/**
 * Enhanced GET endpoint for template statistics
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "template-api", "enhanced-stats"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  aliases: ["template-api:enhanced-stats", "template:enhanced-stats"],

  title: "app.api.v1.core.templateApi.enhancedStats.title",
  description: "app.api.v1.core.templateApi.enhancedStats.description",
  category: "app.api.v1.core.templateApi.enhancedStats.category",
  tags: [
    "app.api.v1.core.templateApi.enhancedStats.tags.analytics",
    "app.api.v1.core.templateApi.enhancedStats.tags.statistics",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.templateApi.enhancedStats.form.title",
      description: "app.api.v1.core.templateApi.enhancedStats.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === TIME RANGE FIELDS ===
      timePeriod: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.templateApi.enhancedStats.timePeriod.label",
          description:
            "app.api.v1.core.templateApi.enhancedStats.timePeriod.description",
          placeholder:
            "app.api.v1.core.templateApi.enhancedStats.timePeriod.placeholder",
          options: TimePeriodOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(TimePeriod)).optional(),
      ),

      dateRangePreset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.templateApi.enhancedStats.dateRangePreset.label",
          description:
            "app.api.v1.core.templateApi.enhancedStats.dateRangePreset.description",
          placeholder:
            "app.api.v1.core.templateApi.enhancedStats.dateRangePreset.placeholder",
          options: DateRangePresetOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(DateRangePreset)).optional(),
      ),

      dateFrom: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.templateApi.enhancedStats.dateFrom.label",
          description: "app.api.v1.core.templateApi.enhancedStats.dateFrom.description",
          placeholder: "app.api.v1.core.templateApi.enhancedStats.dateFrom.placeholder",
          layout: { columns: 6 },
        },
        dateSchema.optional(),
      ),

      dateTo: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.templateApi.enhancedStats.dateTo.label",
          description: "app.api.v1.core.templateApi.enhancedStats.dateTo.description",
          placeholder: "app.api.v1.core.templateApi.enhancedStats.dateTo.placeholder",
          layout: { columns: 6 },
        },
        dateSchema.optional(),
      ),

      // === FILTER FIELDS ===
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.templateApi.enhancedStats.status.label",
          description: "app.api.v1.core.templateApi.enhancedStats.status.description",
          placeholder: "app.api.v1.core.templateApi.enhancedStats.status.placeholder",
          options: TemplateStatusOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(TemplateStatus)).optional(),
      ),

      userId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.templateApi.enhancedStats.userId.label",
          description: "app.api.v1.core.templateApi.enhancedStats.userId.description",
          placeholder: "app.api.v1.core.templateApi.enhancedStats.userId.placeholder",
          layout: { columns: 6 },
        },
        z.uuid().optional(),
      ),

      tags: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.templateApi.enhancedStats.tags.label",
          description: "app.api.v1.core.templateApi.enhancedStats.tags.description",
          placeholder: "app.api.v1.core.templateApi.enhancedStats.tags.placeholder",
          layout: { columns: 12 },
        },
        z.array(z.string()).optional(),
      ),

      hasDescription: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.templateApi.enhancedStats.hasDescription.label",
          description:
            "app.api.v1.core.templateApi.enhancedStats.hasDescription.description",
          layout: { columns: 4 },
        },
        z.coerce.boolean().optional(),
      ),

      hasContent: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.templateApi.enhancedStats.hasContent.label",
          description:
            "app.api.v1.core.templateApi.enhancedStats.hasContent.description",
          layout: { columns: 4 },
        },
        z.coerce.boolean().optional(),
      ),

      contentLengthMin: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.templateApi.enhancedStats.contentLengthMin.label",
          description:
            "app.api.v1.core.templateApi.enhancedStats.contentLengthMin.description",
          placeholder:
            "app.api.v1.core.templateApi.enhancedStats.contentLengthMin.placeholder",
          layout: { columns: 6 },
        },
        z.coerce.number().min(0).optional(),
      ),

      contentLengthMax: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.templateApi.enhancedStats.contentLengthMax.label",
          description:
            "app.api.v1.core.templateApi.enhancedStats.contentLengthMax.description",
          placeholder:
            "app.api.v1.core.templateApi.enhancedStats.contentLengthMax.placeholder",
          layout: { columns: 6 },
        },
        z.coerce.number().min(0).optional(),
      ),

      // === DATE FILTER FIELDS ===
      createdAfter: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.templateApi.enhancedStats.createdAfter.label",
          description:
            "app.api.v1.core.templateApi.enhancedStats.createdAfter.description",
          placeholder:
            "app.api.v1.core.templateApi.enhancedStats.createdAfter.placeholder",
          layout: { columns: 6 },
        },
        dateSchema.optional(),
      ),

      createdBefore: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.templateApi.enhancedStats.createdBefore.label",
          description:
            "app.api.v1.core.templateApi.enhancedStats.createdBefore.description",
          placeholder:
            "app.api.v1.core.templateApi.enhancedStats.createdBefore.placeholder",
          layout: { columns: 6 },
        },
        dateSchema.optional(),
      ),

      updatedAfter: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.templateApi.enhancedStats.updatedAfter.label",
          description:
            "app.api.v1.core.templateApi.enhancedStats.updatedAfter.description",
          placeholder:
            "app.api.v1.core.templateApi.enhancedStats.updatedAfter.placeholder",
          layout: { columns: 6 },
        },
        dateSchema.optional(),
      ),

      updatedBefore: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.templateApi.enhancedStats.updatedBefore.label",
          description:
            "app.api.v1.core.templateApi.enhancedStats.updatedBefore.description",
          placeholder:
            "app.api.v1.core.templateApi.enhancedStats.updatedBefore.placeholder",
          layout: { columns: 6 },
        },
        dateSchema.optional(),
      ),

      // === SEARCH AND DISPLAY FIELDS ===
      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.templateApi.enhancedStats.search.label",
          description: "app.api.v1.core.templateApi.enhancedStats.search.description",
          placeholder: "app.api.v1.core.templateApi.enhancedStats.search.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      chartType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.templateApi.enhancedStats.chartType.label",
          description: "app.api.v1.core.templateApi.enhancedStats.chartType.description",
          placeholder: "app.api.v1.core.templateApi.enhancedStats.chartType.placeholder",
          options: ChartTypeOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(ChartType)).optional(),
      ),

      includeComparison: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.templateApi.enhancedStats.includeComparison.label",
          description:
            "app.api.v1.core.templateApi.enhancedStats.includeComparison.description",
          layout: { columns: 6 },
        },
        z.coerce.boolean().optional(),
      ),

      comparisonPeriod: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.templateApi.enhancedStats.comparisonPeriod.label",
          description:
            "app.api.v1.core.templateApi.enhancedStats.comparisonPeriod.description",
          placeholder:
            "app.api.v1.core.templateApi.enhancedStats.comparisonPeriod.placeholder",
          options: TimePeriodOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(TimePeriod)).optional(),
      ),

      // === RESPONSE FIELDS ===
      
      // Current period template metrics
      totalTemplates: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          value: "totalTemplates",
        },
        z.number(),
      ),
      
      draftTemplates: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          value: "draftTemplates",
        },
        z.number(),
      ),
      
      publishedTemplates: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          value: "publishedTemplates",
        },
        z.number(),
      ),
      
      archivedTemplates: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          value: "archivedTemplates",
        },
        z.number(),
      ),
      
      newTemplates: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          value: "newTemplates",
        },
        z.number(),
      ),
      
      updatedTemplates: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          value: "updatedTemplates",
        },
        z.number(),
      ),
      
      templatesWithDescription: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          value: "templatesWithDescription",
        },
        z.number(),
      ),
      
      templatesWithoutDescription: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          value: "templatesWithoutDescription",
        },
        z.number(),
      ),
      
      averageContentLength: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          value: "averageContentLength",
        },
        z.number(),
      ),
      
      totalContentLength: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          value: "totalContentLength",
        },
        z.number(),
      ),
      
      totalTags: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          value: "totalTags",
        },
        z.number(),
      ),
      
      // Template distribution metrics
      templatesByStatus: responseField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "status",
              label: "app.api.v1.core.templateApi.enhancedStats.response.templatesByStatus.status",
              type: FieldDataType.TEXT,
            },
            {
              key: "count",
              label: "app.api.v1.core.templateApi.enhancedStats.response.templatesByStatus.count",
              type: FieldDataType.NUMBER,
            },
          ],
        },
        z.record(z.string(), z.number()),
      ),
      
      templatesByUser: responseField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "user",
              label: "app.api.v1.core.templateApi.enhancedStats.response.templatesByUser.user",
              type: FieldDataType.TEXT,
            },
            {
              key: "count",
              label: "app.api.v1.core.templateApi.enhancedStats.response.templatesByUser.count",
              type: FieldDataType.NUMBER,
            },
          ],
        },
        z.record(z.string(), z.number()),
      ),
      
      templatesByContentLength: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          description: "app.api.v1.core.templateApi.enhancedStats.response.templatesByContentLength.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          short: responseField(
            {
              type: WidgetType.METRIC_CARD,
              title: "app.api.v1.core.templateApi.enhancedStats.response.templatesByContentLength.short.title",
              value: "short",
            },
            z.number(),
          ),
          medium: responseField(
            {
              type: WidgetType.METRIC_CARD,
              title: "app.api.v1.core.templateApi.enhancedStats.response.templatesByContentLength.medium.title",
              value: "medium",
            },
            z.number(),
          ),
          long: responseField(
            {
              type: WidgetType.METRIC_CARD,
              title: "app.api.v1.core.templateApi.enhancedStats.response.templatesByContentLength.long.title",
              value: "long",
            },
            z.number(),
          ),
        },
      ),
      
      // Tag analytics
      mostUsedTags: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "tag",
              label: "app.api.v1.core.templateApi.enhancedStats.response.mostUsedTags.tag",
              type: FieldDataType.TEXT,
            },
            {
              key: "count",
              label: "app.api.v1.core.templateApi.enhancedStats.response.mostUsedTags.count",
              type: FieldDataType.NUMBER,
            },
            {
              key: "percentage",
              label: "app.api.v1.core.templateApi.enhancedStats.response.mostUsedTags.percentage",
              type: FieldDataType.NUMBER,
            },
          ],
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title: "app.api.v1.core.templateApi.enhancedStats.response.title",
            description: "app.api.v1.core.templateApi.enhancedStats.response.mostUsedTags.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            tag: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.v1.core.templateApi.enhancedStats.response.mostUsedTags.tag",
              },
              z.string(),
            ),
            count: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.v1.core.templateApi.enhancedStats.response.mostUsedTags.count",
              },
              z.number(),
            ),
            percentage: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.v1.core.templateApi.enhancedStats.response.mostUsedTags.percentage",
              },
              z.number(),
            ),
          },
        ),
      ),
      
      // Metadata
      generatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.templateApi.enhancedStats.response.generatedAt",
        },
        z.string(),
      ),
      
      dataRange: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.templateApi.enhancedStats.response.title",
          description: "app.api.v1.core.templateApi.enhancedStats.response.dataRange.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          from: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.templateApi.enhancedStats.response.dataRange.from",
            },
            z.string(),
          ),
          to: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.templateApi.enhancedStats.response.dataRange.to",
            },
            z.string(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.templateApi.enhancedStats.errors.validation.title",
      description:
        "app.api.v1.core.templateApi.enhancedStats.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.templateApi.enhancedStats.errors.unauthorized.title",
      description:
        "app.api.v1.core.templateApi.enhancedStats.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.templateApi.enhancedStats.errors.forbidden.title",
      description:
        "app.api.v1.core.templateApi.enhancedStats.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.templateApi.enhancedStats.errors.server.title",
      description: "app.api.v1.core.templateApi.enhancedStats.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.templateApi.enhancedStats.errors.network.title",
      description:
        "app.api.v1.core.templateApi.enhancedStats.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.templateApi.enhancedStats.errors.unknown.title",
      description:
        "app.api.v1.core.templateApi.enhancedStats.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.templateApi.enhancedStats.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.templateApi.enhancedStats.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.templateApi.enhancedStats.errors.conflict.title",
      description:
        "app.api.v1.core.templateApi.enhancedStats.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.templateApi.enhancedStats.success.title",
    description: "app.api.v1.core.templateApi.enhancedStats.success.description",
  },

  examples: {
    requests: {
      empty: {},
      basic: {
        status: [TemplateStatus.PUBLISHED],
      },
      advanced: {
        timePeriod: [TimePeriod.WEEK],
        dateRangePreset: [DateRangePreset.LAST_90_DAYS],
        status: [TemplateStatus.PUBLISHED],
        hasDescription: true,
        contentLengthMin: 100,
      },
    },
    urlPathVariables: undefined,
    responses: {
      empty: {
        totalTemplates: 0,
        draftTemplates: 0,
        publishedTemplates: 0,
        archivedTemplates: 0,
        newTemplates: 0,
        updatedTemplates: 0,
        templatesWithDescription: 0,
        templatesWithoutDescription: 0,
        averageContentLength: 0,
        totalContentLength: 0,
        totalTags: 0,
        templatesByStatus: {},
        templatesByUser: {},
        templatesByContentLength: {
          short: 0,
          medium: 0,
          long: 0,
        },
        mostUsedTags: [],
        generatedAt: new Date().toISOString(),
        dataRange: {
          from: new Date().toISOString(),
          to: new Date().toISOString(),
        },
      },
      basic: {
        totalTemplates: 1250,
        draftTemplates: 450,
        publishedTemplates: 750,
        archivedTemplates: 50,
        newTemplates: 125,
        updatedTemplates: 89,
        templatesWithDescription: 980,
        templatesWithoutDescription: 270,
        averageContentLength: 1850,
        totalContentLength: 2312500,
        totalTags: 89,
        templatesByStatus: {
          [TemplateStatus.DRAFT]: 450,
          [TemplateStatus.PUBLISHED]: 750,
          [TemplateStatus.ARCHIVED]: 50,
        },
        templatesByUser: {
          "user-123": 234,
          "user-456": 189,
          "user-789": 156,
        },
        templatesByContentLength: {
          short: 380,
          medium: 620,
          long: 250,
        },
        mostUsedTags: [
          { tag: "marketing", count: 456, percentage: 36.5 },
          { tag: "newsletter", count: 234, percentage: 18.7 },
          { tag: "social", count: 189, percentage: 15.1 },
        ],
        generatedAt: new Date().toISOString(),
        dataRange: {
          from: "2024-01-01T00:00:00Z",
          to: "2024-04-30T23:59:59Z",
        },
      },
      advanced: {
        totalTemplates: 1250,
        draftTemplates: 450,
        publishedTemplates: 750,
        archivedTemplates: 50,
        newTemplates: 125,
        updatedTemplates: 89,
        templatesWithDescription: 980,
        templatesWithoutDescription: 270,
        averageContentLength: 1850,
        totalContentLength: 2312500,
        totalTags: 89,
        templatesByStatus: {
          [TemplateStatus.DRAFT]: 450,
          [TemplateStatus.PUBLISHED]: 750,
          [TemplateStatus.ARCHIVED]: 50,
        },
        templatesByUser: {
          "user-123": 234,
          "user-456": 189,
          "user-789": 156,
        },
        templatesByContentLength: {
          short: 380,
          medium: 620,
          long: 250,
        },
        mostUsedTags: [
          { tag: "marketing", count: 456, percentage: 36.5 },
          { tag: "newsletter", count: 234, percentage: 18.7 },
          { tag: "social", count: 189, percentage: 15.1 },
        ],
        generatedAt: new Date().toISOString(),
        dataRange: {
          from: "2024-01-01T00:00:00Z",
          to: "2024-04-30T23:59:59Z",
        },
      },
    },
  },
});

export type EnhancedTemplateStatsRequestTypeInput =
  typeof GET.types.RequestInput;
export type EnhancedTemplateStatsRequestTypeOutput =
  typeof GET.types.RequestOutput;
export type EnhancedTemplateStatsResponseTypeInput =
  typeof GET.types.ResponseInput;
export type EnhancedTemplateStatsResponseTypeOutput =
  typeof GET.types.ResponseOutput;

/**
 * Export the endpoint definitions
 */
const enhancedStatsEndpoints = {
  GET,
};

export { GET };
export default enhancedStatsEndpoints;
