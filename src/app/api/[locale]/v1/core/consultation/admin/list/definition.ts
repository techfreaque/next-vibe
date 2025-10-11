/**
 * Admin Consultation List Endpoint Definition
 *
 * Production-ready endpoint for admin consultation list management with enhanced
 * multi-select support and comprehensive data-driven UI metadata.
 */

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

import {
  ConsultationSortField,
  ConsultationSortFieldOptions,
  ConsultationStatus,
  ConsultationStatusOptions,
  SortOrder,
  SortOrderOptions,
} from "../../enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "consultation", "admin", "list"],
  title: "app.api.v1.core.consultation.admin.list.get.title",
  description: "app.api.v1.core.consultation.admin.list.get.description",
  category: "app.api.v1.core.consultation.admin.list.get.category",
  tags: ["app.api.v1.core.consultation.admin.list.get.tag"],
  allowedRoles: [UserRole.ADMIN],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.consultation.admin.list.get.container.title",
      description:
        "app.api.v1.core.consultation.admin.list.get.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.consultation.admin.list.get.search.label",
          description:
            "app.api.v1.core.consultation.admin.list.get.search.description",
          placeholder:
            "app.api.v1.core.consultation.admin.list.get.search.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.consultation.admin.list.get.status.label",
          description:
            "app.api.v1.core.consultation.admin.list.get.status.description",
          placeholder:
            "app.api.v1.core.consultation.admin.list.get.status.placeholder",
          options: ConsultationStatusOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(ConsultationStatus)).optional(),
      ),

      page: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.consultation.admin.list.get.page.label",
          description:
            "app.api.v1.core.consultation.admin.list.get.page.description",
          placeholder:
            "app.api.v1.core.consultation.admin.list.get.page.placeholder",
          layout: { columns: 3 },
        },
        z.number().int().min(1).optional(),
      ),

      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.consultation.admin.list.get.limit.label",
          description:
            "app.api.v1.core.consultation.admin.list.get.limit.description",
          placeholder:
            "app.api.v1.core.consultation.admin.list.get.limit.placeholder",
          layout: { columns: 3 },
        },
        z.number().int().min(1).max(100).optional(),
      ),

      sortBy: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.consultation.admin.list.get.sortBy.label",
          description:
            "app.api.v1.core.consultation.admin.list.get.sortBy.description",
          placeholder:
            "app.api.v1.core.consultation.admin.list.get.sortBy.placeholder",
          options: ConsultationSortFieldOptions,
          layout: { columns: 3 },
        },
        z.nativeEnum(ConsultationSortField).optional(),
      ),

      sortOrder: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.consultation.admin.list.get.sortOrder.label",
          description:
            "app.api.v1.core.consultation.admin.list.get.sortOrder.description",
          placeholder:
            "app.api.v1.core.consultation.admin.list.get.sortOrder.placeholder",
          options: SortOrderOptions,
          layout: { columns: 3 },
        },
        z.nativeEnum(SortOrder).optional(),
      ),

      dateFrom: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.consultation.admin.list.get.dateFrom.label",
          description:
            "app.api.v1.core.consultation.admin.list.get.dateFrom.description",
          placeholder:
            "app.api.v1.core.consultation.admin.list.get.dateFrom.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      dateTo: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.consultation.admin.list.get.dateTo.label",
          description:
            "app.api.v1.core.consultation.admin.list.get.dateTo.description",
          placeholder:
            "app.api.v1.core.consultation.admin.list.get.dateTo.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      userEmail: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label: "app.api.v1.core.consultation.admin.list.get.userEmail.label",
          description:
            "app.api.v1.core.consultation.admin.list.get.userEmail.description",
          placeholder:
            "app.api.v1.core.consultation.admin.list.get.userEmail.placeholder",
          layout: { columns: 6 },
        },
        z.email().optional(),
      ),

      // === RESPONSE FIELDS ===
      consultations: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "id",
              label: "app.api.v1.core.consultation.admin.list.get.columns.id",
              type: FieldDataType.UUID,
              sortable: true,
            },
            {
              key: "userName",
              label:
                "app.api.v1.core.consultation.admin.list.get.columns.userName",
              type: FieldDataType.TEXT,
              sortable: true,
            },
            {
              key: "userEmail",
              label:
                "app.api.v1.core.consultation.admin.list.get.columns.userEmail",
              type: FieldDataType.EMAIL,
              sortable: true,
            },
            {
              key: "status",
              label:
                "app.api.v1.core.consultation.admin.list.get.columns.status",
              type: FieldDataType.SELECT,
              sortable: true,
            },
            {
              key: "preferredDate",
              label:
                "app.api.v1.core.consultation.admin.list.get.columns.preferredDate",
              type: FieldDataType.DATE,
              sortable: true,
            },
            {
              key: "preferredTime",
              label:
                "app.api.v1.core.consultation.admin.list.get.columns.preferredTime",
              type: FieldDataType.TIME,
              sortable: true,
            },
            {
              key: "createdAt",
              label:
                "app.api.v1.core.consultation.admin.list.get.columns.createdAt",
              type: FieldDataType.DATETIME,
              sortable: true,
            },
          ],
          pagination: { enabled: true, pageSize: 20 },
          sorting: { enabled: true },
          filtering: { enabled: true },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.consultation.admin.list.get.consultation.title",
            description:
              "app.api.v1.core.consultation.admin.list.get.consultation.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.id",
              },
              z.uuid(),
            ),
            userId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.userId",
              },
              z.uuid().nullable(),
            ),
            leadId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.leadId",
              },
              z.uuid().nullable(),
            ),
            userName: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.userName",
              },
              z.string().nullable(),
            ),
            userEmail: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.userEmail",
              },
              z.email().nullable(),
            ),
            status: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.status",
              },
              z.nativeEnum(ConsultationStatus),
            ),
            preferredDate: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.preferredDate",
              },
              z.string().nullable(),
            ),
            preferredTime: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.preferredTime",
              },
              z.string().nullable(),
            ),
            message: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.message",
              },
              z.string().nullable(),
            ),
            isNotified: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.isNotified",
              },
              z.boolean(),
            ),
            scheduledDate: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.scheduledDate",
              },
              z.string().nullable(),
            ),
            scheduledTime: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.scheduledTime",
              },
              z.string().nullable(),
            ),
            calendarEventId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.calendarEventId",
              },
              z.string().nullable(),
            ),
            meetingLink: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.meetingLink",
              },
              z.string().nullable(),
            ),
            icsAttachment: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.icsAttachment",
              },
              z.string().nullable(),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.createdAt",
              },
              z.string(),
            ),
            updatedAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.updatedAt",
              },
              z.string(),
            ),
            userBusinessType: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.userBusinessType",
              },
              z.string().nullable(),
            ),
            userContactPhone: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.userContactPhone",
              },
              z.string().nullable(),
            ),
            leadEmail: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.leadEmail",
              },
              z.email().nullable(),
            ),
            leadBusinessName: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.leadBusinessName",
              },
              z.string().nullable(),
            ),
            leadPhone: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.admin.list.get.consultation.leadPhone",
              },
              z.string().nullable(),
            ),
          },
        ),
      ),

      pagination: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.consultation.admin.list.get.pagination.title",
          description:
            "app.api.v1.core.consultation.admin.list.get.pagination.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          page: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.consultation.admin.list.get.pagination.page",
            },
            z.number().int(),
          ),
          limit: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.consultation.admin.list.get.pagination.limit",
            },
            z.number().int(),
          ),
          total: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.consultation.admin.list.get.pagination.total",
            },
            z.number().int(),
          ),
          totalPages: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.consultation.admin.list.get.pagination.totalPages",
            },
            z.number().int(),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.consultation.admin.list.get.errors.validation.title",
      description:
        "app.api.v1.core.consultation.admin.list.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.consultation.admin.list.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.consultation.admin.list.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.consultation.admin.list.get.errors.forbidden.title",
      description:
        "app.api.v1.core.consultation.admin.list.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.consultation.admin.list.get.errors.server.title",
      description:
        "app.api.v1.core.consultation.admin.list.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.consultation.admin.list.get.errors.network.title",
      description:
        "app.api.v1.core.consultation.admin.list.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.consultation.admin.list.get.errors.unknown.title",
      description:
        "app.api.v1.core.consultation.admin.list.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.consultation.admin.list.get.errors.notFound.title",
      description:
        "app.api.v1.core.consultation.admin.list.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.consultation.admin.list.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.consultation.admin.list.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.consultation.admin.list.get.errors.conflict.title",
      description:
        "app.api.v1.core.consultation.admin.list.get.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.consultation.admin.list.get.success.title",
    description:
      "app.api.v1.core.consultation.admin.list.get.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        search: "john",
        status: [ConsultationStatus.PENDING, ConsultationStatus.SCHEDULED],
        page: 1,
        limit: 20,
      },
      minimal: {
        page: 1,
        limit: 10,
      },
    },
    urlPathVariables: undefined,
    responses: {
      default: {
        consultations: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            userId: "123e4567-e89b-12d3-a456-426614174001",
            leadId: null,
            userName: "John Doe",
            userEmail: "john@example.com",
            status: ConsultationStatus.PENDING,
            preferredDate: "2024-01-15",
            preferredTime: "14:00",
            message: "Looking for social media strategy help",
            isNotified: false,
            scheduledDate: null,
            scheduledTime: null,
            calendarEventId: null,
            meetingLink: null,
            icsAttachment: null,
            createdAt: "2024-01-10T10:00:00.000Z",
            updatedAt: "2024-01-10T10:00:00.000Z",
            userBusinessType: "E-commerce",
            userContactPhone: "+1234567890",
            leadEmail: null,
            leadBusinessName: null,
            leadPhone: null,
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      },
      minimal: {
        consultations: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      },
    },
  },
});

// Extract types for use in other files
export type ConsultationAdminListGetRequestTypeInput =
  typeof GET.types.RequestInput;
export type ConsultationAdminListGetRequestTypeOutput =
  typeof GET.types.RequestOutput;
export type ConsultationAdminListGetResponseTypeInput =
  typeof GET.types.ResponseInput;
export type ConsultationAdminListGetResponseTypeOutput =
  typeof GET.types.ResponseOutput;

export { GET };

const adminListEndpoints = { GET };
export default adminListEndpoints;
