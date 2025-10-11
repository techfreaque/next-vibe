/**
 * Template Stats API Definition
 * Defines endpoint for retrieving template statistics
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
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
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { TemplateStatus, TemplateStatusOptions } from "../enum";

/**
 * Template Stats Endpoint (GET)
 * Retrieves basic template statistics
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "template-api", "stats"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  aliases: ["template-api:stats", "template:stats"],

  title: "app.api.v1.core.templateApi.stats.title",
  description: "app.api.v1.core.templateApi.stats.description",
  category: "app.api.v1.core.templateApi.category",
  tags: [
    "app.api.v1.core.templateApi.tags.statistics",
    "app.api.v1.core.templateApi.tags.analytics",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.templateApi.stats.form.title",
      description: "app.api.v1.core.templateApi.stats.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST DATA FIELDS ===
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.templateApi.stats.status.label",
          description: "app.api.v1.core.templateApi.stats.status.description",
          placeholder: "app.api.v1.core.templateApi.stats.status.placeholder",
          options: TemplateStatusOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(TemplateStatus)).optional(),
      ),

      tags: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.templateApi.stats.tagFilter.label",
          description:
            "app.api.v1.core.templateApi.stats.tagFilter.description",
          placeholder:
            "app.api.v1.core.templateApi.stats.tagFilter.placeholder",
          layout: { columns: 6 },
        },
        z.array(z.string()).optional(),
      ),

      dateFrom: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.templateApi.stats.dateFrom.label",
          description: "app.api.v1.core.templateApi.stats.dateFrom.description",
          placeholder: "app.api.v1.core.templateApi.stats.dateFrom.placeholder",
          layout: { columns: 6 },
        },
        dateSchema.optional(),
      ),

      dateTo: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.templateApi.stats.dateTo.label",
          description: "app.api.v1.core.templateApi.stats.dateTo.description",
          placeholder: "app.api.v1.core.templateApi.stats.dateTo.placeholder",
          layout: { columns: 6 },
        },
        dateSchema.optional(),
      ),

      // === RESPONSE FIELDS ===
      totalTemplates: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.templateApi.stats.response.totalTemplates.title",
          value: "totalTemplates",
        },
        z.number(),
      ),

      draftTemplates: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.templateApi.stats.response.draftTemplates.title",
          value: "draftTemplates",
        },
        z.number(),
      ),

      publishedTemplates: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.templateApi.stats.response.publishedTemplates.title",
          value: "publishedTemplates",
        },
        z.number(),
      ),

      archivedTemplates: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title:
            "app.api.v1.core.templateApi.stats.response.archivedTemplates.title",
          value: "archivedTemplates",
        },
        z.number(),
      ),

      templatesByStatus: responseField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "status",
              label:
                "app.api.v1.core.templateApi.stats.response.templatesByStatus.status",
              type: FieldDataType.TEXT,
            },
            {
              key: "count",
              label:
                "app.api.v1.core.templateApi.stats.response.templatesByStatus.count",
              type: FieldDataType.NUMBER,
            },
          ],
        },
        z.record(z.string(), z.number()),
      ),

      templatesByTag: responseField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "tag",
              label:
                "app.api.v1.core.templateApi.stats.response.templatesByTag.tag",
              type: FieldDataType.TEXT,
            },
            {
              key: "count",
              label:
                "app.api.v1.core.templateApi.stats.response.templatesByTag.count",
              type: FieldDataType.NUMBER,
            },
          ],
        },
        z.record(z.string(), z.number()),
      ),

      recentTemplates: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "name",
              label:
                "app.api.v1.core.templateApi.stats.response.recentTemplates.name",
              type: FieldDataType.TEXT,
            },
            {
              key: "status",
              label:
                "app.api.v1.core.templateApi.stats.response.recentTemplates.status",
              type: FieldDataType.TEXT,
            },
            {
              key: "createdAt",
              label:
                "app.api.v1.core.templateApi.stats.response.recentTemplates.createdAt",
              type: FieldDataType.DATE,
            },
          ],
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.templateApi.stats.response.recentTemplates.title",
            description:
              "app.api.v1.core.templateApi.stats.response.recentTemplates.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.templateApi.stats.response.recentTemplates.id",
              },
              z.uuid(),
            ),
            name: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.templateApi.stats.response.recentTemplates.name",
              },
              z.string(),
            ),
            status: responseField(
              {
                type: WidgetType.BADGE,
                content:
                  "app.api.v1.core.templateApi.stats.response.recentTemplates.status",
              },
              z.nativeEnum(TemplateStatus),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.templateApi.stats.response.recentTemplates.createdAt",
              },
              dateSchema,
            ),
          },
        ),
      ),

      generatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.templateApi.stats.response.generatedAt",
        },
        dateSchema,
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.templateApi.stats.errors.validation.title",
      description:
        "app.api.v1.core.templateApi.stats.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.templateApi.stats.errors.unauthorized.title",
      description:
        "app.api.v1.core.templateApi.stats.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.templateApi.stats.errors.forbidden.title",
      description:
        "app.api.v1.core.templateApi.stats.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.templateApi.stats.errors.notFound.title",
      description:
        "app.api.v1.core.templateApi.stats.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.templateApi.stats.errors.server.title",
      description:
        "app.api.v1.core.templateApi.stats.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.templateApi.stats.errors.network.title",
      description:
        "app.api.v1.core.templateApi.stats.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.templateApi.stats.errors.unknown.title",
      description:
        "app.api.v1.core.templateApi.stats.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.templateApi.stats.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.templateApi.stats.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.templateApi.stats.errors.conflict.title",
      description:
        "app.api.v1.core.templateApi.stats.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.templateApi.stats.success.title",
    description: "app.api.v1.core.templateApi.stats.success.description",
  },

  examples: {
    urlPathVariables: undefined,
    requests: {
      empty: {},
      basic: {
        status: [TemplateStatus.PUBLISHED],
      },
      advanced: {
        status: [TemplateStatus.PUBLISHED, TemplateStatus.DRAFT],
        tags: ["email", "marketing"],
        dateFrom: "2024-01-01",
        dateTo: "2024-12-31",
      },
    },
    responses: {
      empty: {
        response: {
          totalTemplates: 0,
          draftTemplates: 0,
          publishedTemplates: 0,
          archivedTemplates: 0,
          templatesByStatus: {},
          templatesByTag: {},
          recentTemplates: [],
          generatedAt: new Date().toISOString(),
        },
      },
      basic: {
        response: {
          totalTemplates: 125,
          draftTemplates: 45,
          publishedTemplates: 65,
          archivedTemplates: 15,
          templatesByStatus: {
            [TemplateStatus.DRAFT]: 45,
            [TemplateStatus.PUBLISHED]: 65,
            [TemplateStatus.ARCHIVED]: 15,
          },
          templatesByTag: {
            email: 85,
            marketing: 72,
            newsletter: 58,
          },
          recentTemplates: [
            {
              id: "123e4567-e89b-12d3-a456-426614174000",
              name: "Welcome Email",
              status: TemplateStatus.PUBLISHED,
              createdAt: "2024-01-15T10:00:00Z",
            },
            {
              id: "456e7890-e89b-12d3-a456-426614174001",
              name: "Newsletter Template",
              status: TemplateStatus.DRAFT,
              createdAt: "2024-01-14T15:30:00Z",
            },
          ],
          generatedAt: new Date().toISOString(),
        },
      },
      advanced: {
        response: {
          totalTemplates: 87,
          draftTemplates: 32,
          publishedTemplates: 48,
          archivedTemplates: 7,
          templatesByStatus: {
            [TemplateStatus.DRAFT]: 32,
            [TemplateStatus.PUBLISHED]: 48,
            [TemplateStatus.ARCHIVED]: 7,
          },
          templatesByTag: {
            email: 65,
            marketing: 58,
            newsletter: 42,
            campaign: 35,
          },
          recentTemplates: [
            {
              id: "789e0123-e89b-12d3-a456-426614174002",
              name: "Marketing Campaign",
              status: TemplateStatus.PUBLISHED,
              createdAt: "2024-12-30T09:00:00Z",
            },
          ],
          generatedAt: new Date().toISOString(),
        },
      },
    },
  },
});

export type TemplateStatsRequestTypeInput = typeof GET.types.RequestInput;
export type TemplateStatsRequestTypeOutput = typeof GET.types.RequestOutput;
export type TemplateStatsResponseTypeInput = typeof GET.types.ResponseInput;
export type TemplateStatsResponseTypeOutput = typeof GET.types.ResponseOutput;

/**
 * Export the endpoint definitions
 */
const templateStatsEndpoints = {
  GET,
};

export { GET };
export default templateStatsEndpoints;
