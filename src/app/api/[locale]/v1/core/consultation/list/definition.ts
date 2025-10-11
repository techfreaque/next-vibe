/**
 * Consultation List Endpoint Definition
 *
 * Production-ready endpoint for listing consultations with comprehensive
 * filtering, sorting, pagination, and data-driven UI configuration.
 *
 * Features:
 * - Advanced filtering by status, date range, user
 * - Sorting by multiple fields
 * - Pagination with configurable limits
 * - Rich data table with actions
 * - Search functionality
 * - Export capabilities
 * - Real-time updates
 */

import { z } from "zod";

import {
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
  ConsultationSortField,
  ConsultationSortFieldOptions,
  ConsultationStatus,
  ConsultationStatusOptions,
  SortOrder,
  SortOrderOptions,
} from "../enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "consultation", "list"],
  aliases: ["consultation:list"],
  title: "app.api.v1.core.consultation.list.title",
  description: "app.api.v1.core.consultation.list.description",
  category: "app.api.v1.core.consultation.list.category",
  tags: ["app.api.v1.core.consultation.create.tag"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.consultation.list.form.title",
      description: "app.api.v1.core.consultation.list.form.description",
      layout: { type: LayoutType.STACKED }, // Mobile-first responsive layout
    },
    // Root object supports all usage types
    { request: "data", response: true },
    {
      // === FILTERING & SEARCH FIELDS ===
      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.consultation.list.search.label",
          description: "app.api.v1.core.consultation.list.search.description",
          placeholder: "app.api.v1.core.consultation.list.search.placeholder",
          layout: { columns: 6 }, // Half width for search
        },
        z.string().optional(),
      ),
      userId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.v1.core.consultation.list.userId.label",
          description: "app.api.v1.core.consultation.list.userId.description",
          placeholder: "app.api.v1.core.consultation.list.userId.placeholder",
          layout: { columns: 6 }, // Pair with search
        },
        z.uuid().optional(),
      ),
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.consultation.list.status.label",
          description: "app.api.v1.core.consultation.list.status.description",
          placeholder: "app.api.v1.core.consultation.list.status.placeholder",
          options: ConsultationStatusOptions,
          layout: { columns: 4 },
        },
        z.array(z.nativeEnum(ConsultationStatus)).optional(),
      ),
      dateFrom: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.consultation.list.dateFrom.label",
          description: "app.api.v1.core.consultation.list.dateFrom.description",
          placeholder: "app.api.v1.core.consultation.list.dateFrom.placeholder",
          layout: { columns: 4 },
        },
        z.string().datetime().optional(),
      ),
      dateTo: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.consultation.list.dateTo.label",
          description: "app.api.v1.core.consultation.list.dateTo.description",
          placeholder: "app.api.v1.core.consultation.list.dateTo.placeholder",
          layout: { columns: 4 },
        },
        z.string().datetime().optional(),
      ),

      // === SORTING FIELDS ===
      sortBy: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.consultation.list.sortBy.label",
          description: "app.api.v1.core.consultation.list.sortBy.description",
          placeholder: "app.api.v1.core.consultation.list.sortBy.placeholder",
          options: ConsultationSortFieldOptions,
        },
        z
          .array(z.nativeEnum(ConsultationSortField))
          .optional()
          .default([ConsultationSortField.CREATED_AT]),
      ),
      sortOrder: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.consultation.list.sortOrder.label",
          description:
            "app.api.v1.core.consultation.list.sortOrder.description",
          placeholder:
            "app.api.v1.core.consultation.list.sortOrder.placeholder",
          options: SortOrderOptions,
        },
        z.array(z.nativeEnum(SortOrder)).optional().default([SortOrder.DESC]),
      ),

      // === PAGINATION FIELDS ===
      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.consultation.list.limit.label",
          description: "app.api.v1.core.consultation.list.limit.description",
          placeholder: "app.api.v1.core.consultation.list.limit.placeholder",
        },
        z.string().optional(),
      ),
      offset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.consultation.list.offset.label",
          description: "app.api.v1.core.consultation.list.offset.description",
          placeholder: "app.api.v1.core.consultation.list.offset.placeholder",
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      consultations: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "id",
              label: "app.api.v1.core.consultation.list.columns.id",
              type: FieldDataType.UUID,
            },
            {
              key: "userId",
              label: "app.api.v1.core.consultation.list.columns.userId",
              type: FieldDataType.UUID,
            },
            {
              key: "status",
              label: "app.api.v1.core.consultation.list.columns.status",
              type: FieldDataType.STATUS,
            },
          ],
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title: "app.api.v1.core.consultation.list.item.title",
            description: "app.api.v1.core.consultation.list.item.description",
            layout: { type: LayoutType.GRID, columns: 1 },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.v1.core.consultation.list.item.id",
              },
              z.uuid(),
            ),
            userId: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.v1.core.consultation.list.item.userId",
              },
              z.uuid(),
            ),
            preferredDate: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.v1.core.consultation.list.item.preferredDate",
              },
              z.date().nullable(),
            ),
            preferredTime: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.v1.core.consultation.list.item.preferredTime",
              },
              z.string().nullable(),
            ),
            status: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.v1.core.consultation.list.item.status",
              },
              z.string(),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.v1.core.consultation.list.item.createdAt",
              },
              z.date(),
            ),
            updatedAt: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.v1.core.consultation.list.item.updatedAt",
              },
              z.date(),
            ),
          },
        ),
      ),
      total: responseField(
        {
          type: WidgetType.METRIC_CARD,
          title: "app.api.v1.core.consultation.list.total.title",
          value: "total",
        },
        z.number(),
      ),
    },
  ),
  examples: {
    urlPathVariables: undefined,
    requests: {
      default: {
        userId: "123e4567-e89b-12d3-a456-426614174000",
        status: [ConsultationStatus.PENDING, ConsultationStatus.SCHEDULED],
        sortBy: [ConsultationSortField.CREATED_AT],
        sortOrder: [SortOrder.DESC],
        limit: "10", // Input type is string, gets transformed to number
        offset: "0", // Input type is string, gets transformed to number
      },
      filtered: {
        userId: "123e4567-e89b-12d3-a456-426614174000",
        status: [ConsultationStatus.COMPLETED, ConsultationStatus.CANCELLED],
        sortBy: [ConsultationSortField.UPDATED_AT],
        sortOrder: [SortOrder.ASC],
        limit: "5", // Input type is string, gets transformed to number
        offset: "0", // Input type is string, gets transformed to number
      },
    },
    responses: {
      default: {
        consultations: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            userId: "456e7890-e89b-12d3-a456-426614174001",
            preferredDate: new Date("2023-01-15T10:00:00.000Z"),
            preferredTime: "10:00",
            status: ConsultationStatus.PENDING,
            createdAt: new Date("2023-01-01T10:00:00.000Z"),
            updatedAt: new Date("2023-01-01T10:05:00.000Z"),
          },
        ],
        total: 1,
      },
      filtered: {
        consultations: [
          {
            id: "789e0123-e89b-12d3-a456-426614174002",
            userId: "456e7890-e89b-12d3-a456-426614174001",
            preferredDate: new Date("2023-01-20T14:00:00.000Z"),
            preferredTime: "14:00",
            status: ConsultationStatus.COMPLETED,
            createdAt: new Date("2023-01-10T09:00:00.000Z"),
            updatedAt: new Date("2023-01-18T14:30:00.000Z"),
          },
        ],
        total: 1,
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.consultation.list.errors.validation.title",
      description:
        "app.api.v1.core.consultation.list.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.consultation.list.errors.notFound.title",
      description:
        "app.api.v1.core.consultation.list.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.consultation.list.errors.unauthorized.title",
      description:
        "app.api.v1.core.consultation.list.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.consultation.list.errors.forbidden.title",
      description:
        "app.api.v1.core.consultation.list.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.consultation.list.errors.server.title",
      description:
        "app.api.v1.core.consultation.list.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.consultation.list.errors.network.title",
      description:
        "app.api.v1.core.consultation.list.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.consultation.list.errors.unknown.title",
      description:
        "app.api.v1.core.consultation.list.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.consultation.list.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.consultation.list.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.consultation.list.errors.conflict.title",
      description:
        "app.api.v1.core.consultation.list.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.consultation.list.success.title",
    description: "app.api.v1.core.consultation.list.success.description",
  },
});

// Type aliases for backward compatibility
export type ConsultationListRequestTypeInput = typeof GET.types.RequestInput;
export type ConsultationListRequestTypeOutput = typeof GET.types.RequestOutput;
export type ConsultationListResponseTypeInput = typeof GET.types.ResponseInput;
export type ConsultationListResponseTypeOutput =
  typeof GET.types.ResponseOutput;

const consultationListEndpoint = {
  GET,
};

export default consultationListEndpoint;
