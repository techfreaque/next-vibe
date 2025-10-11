/**
 * Emails List API Definition
 * Defines the API endpoint for listing emails with filtering and pagination
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

import { SortOrder, SortOrderOptions } from "../enum";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import {
  EmailSortField,
  EmailSortFieldOptions,
  EmailStatus,
  EmailStatusFilter,
  EmailStatusFilterOptions,
  EmailType,
  EmailTypeFilter,
  EmailTypeFilterOptions,
} from "../enum";

/**
 * Get Emails List Endpoint (GET)
 * Retrieves a paginated list of emails with filtering
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "emails", "messages", "list"],
  title: "app.api.v1.core.emails.messages.list.title",
  description: "app.api.v1.core.emails.messages.list.description",
  category: "app.api.v1.core.emails.category",
  tags: ["app.api.v1.core.emails.messages.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.messages.list.container.title",
      description: "app.api.v1.core.emails.messages.list.container.description",
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === FILTER AND SEARCH ===
      filters: objectField(
        {
          type: WidgetType.FORM_SECTION,
          title: "app.api.v1.core.emails.messages.list.filters.title",
          description: "app.api.v1.core.emails.messages.list.filters.description",
          layout: { type: LayoutType.GRID_4_COLUMNS },
          collapsed: false,
        },
        { request: "data" },
        {
          search: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SEARCH,
              label: "app.api.v1.core.emails.messages.list.fields.search.label",
              description:
                "app.api.v1.core.emails.messages.list.fields.search.description",
              placeholder:
                "app.api.v1.core.emails.messages.list.fields.search.placeholder",
              layout: { type: LayoutType.FULL_WIDTH },
              helpText: "app.api.v1.core.emails.messages.list.fields.search.help",
            },
            z.string().optional(),
          ),

          status: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.emails.messages.list.fields.status.label",
              description:
                "app.api.v1.core.emails.messages.list.fields.status.description",
              placeholder:
                "app.api.v1.core.emails.messages.list.fields.status.placeholder",
              options: EmailStatusFilterOptions,
              layout: { type: LayoutType.INLINE },
            },
            z.nativeEnum(EmailStatusFilter).default(EmailStatusFilter.ALL),
          ),

          type: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.emails.messages.list.fields.type.label",
              description:
                "app.api.v1.core.emails.messages.list.fields.type.description",
              placeholder:
                "app.api.v1.core.emails.messages.list.fields.type.placeholder",
              options: EmailTypeFilterOptions,
              layout: { type: LayoutType.INLINE },
            },
            z.nativeEnum(EmailTypeFilter).default(EmailTypeFilter.ALL),
          ),

          dateRange: objectField(
            {
              type: WidgetType.FORM_SECTION,
              title: "app.api.v1.core.emails.messages.list.fields.dateRange.title",
              layout: { type: LayoutType.GRID_2_COLUMNS },
            },
            { request: "data" },
            {
              dateFrom: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.DATETIME,
                  label: "app.api.v1.core.emails.messages.list.fields.dateFrom.label",
                  description:
                    "app.api.v1.core.emails.messages.list.fields.dateFrom.description",
                  placeholder:
                    "app.api.v1.core.emails.messages.list.fields.dateFrom.placeholder",
                  layout: { type: LayoutType.INLINE },
                },
                z.string().datetime().optional(),
              ),

              dateTo: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.DATETIME,
                  label: "app.api.v1.core.emails.messages.list.fields.dateTo.label",
                  description:
                    "app.api.v1.core.emails.messages.list.fields.dateTo.description",
                  placeholder:
                    "app.api.v1.core.emails.messages.list.fields.dateTo.placeholder",
                  layout: { type: LayoutType.INLINE },
                },
                z.string().datetime().optional(),
              ),
            },
          ),
        },
      ),

      // === SORTING AND PAGINATION ===
      displayOptions: objectField(
        {
          type: WidgetType.FORM_SECTION,
          title: "app.api.v1.core.emails.messages.list.displayOptions.title",
          layout: { type: LayoutType.GRID_4_COLUMNS },
          collapsed: true,
        },
        { request: "data" },
        {
          sortBy: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.emails.messages.list.fields.sortBy.label",
              description:
                "app.api.v1.core.emails.messages.list.fields.sortBy.description",
              placeholder:
                "app.api.v1.core.emails.messages.list.fields.sortBy.placeholder",
              options: EmailSortFieldOptions,
              layout: { type: LayoutType.INLINE },
            },
            z.nativeEnum(EmailSortField).default(EmailSortField.CREATED_AT),
          ),

          sortOrder: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.emails.messages.list.fields.sortOrder.label",
              description:
                "app.api.v1.core.emails.messages.list.fields.sortOrder.description",
              placeholder:
                "app.api.v1.core.emails.messages.list.fields.sortOrder.placeholder",
              options: SortOrderOptions,
              layout: { type: LayoutType.INLINE },
            },
            z.nativeEnum(SortOrder).default(SortOrder.DESC),
          ),

          page: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.v1.core.emails.messages.list.fields.page.label",
              description:
                "app.api.v1.core.emails.messages.list.fields.page.description",
              placeholder:
                "app.api.v1.core.emails.messages.list.fields.page.placeholder",
              layout: { type: LayoutType.INLINE },
              validation: { min: 1 },
            },
            z.coerce.number().int().min(1).default(1),
          ),

          limit: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.v1.core.emails.messages.list.fields.limit.label",
              description:
                "app.api.v1.core.emails.messages.list.fields.limit.description",
              placeholder:
                "app.api.v1.core.emails.messages.list.fields.limit.placeholder",
              layout: { type: LayoutType.INLINE },
              validation: { min: 1, max: 100 },
            },
            z.coerce.number().int().min(1).max(100).default(20),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      emails: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          title: "app.api.v1.core.emails.messages.list.response.emails.title",
          layout: { type: LayoutType.FULL_WIDTH },
          sortable: true,
          filterable: true,
          exportable: true,
          searchable: true,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.emails.messages.list.response.emails.item.title",
            description:
              "app.api.v1.core.emails.messages.list.response.emails.item.description",
            layout: { type: LayoutType.HORIZONTAL },
          },
          { response: true },
          {
            // === CORE EMAIL INFO ===
            emailCore: objectField(
              {
                type: WidgetType.CONTAINER,
                layout: { type: LayoutType.GRID_3_COLUMNS },
              },
              { response: true },
              {
                id: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.id",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.id.label",
                  },
                  z.uuid(),
                ),
                subject: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.subject",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.subject.label",
                  },
                  z.string(),
                ),
                status: responseField(
                  {
                    type: WidgetType.BADGE,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.status",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.status.label",
                  },
                  z.nativeEnum(EmailStatus),
                ),
              },
            ),

            // === RECIPIENT AND SENDER ===
            emailParties: objectField(
              {
                type: WidgetType.CONTAINER,
                layout: { type: LayoutType.GRID_2_COLUMNS },
              },
              { response: true },
              {
                recipient: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    title: "app.api.v1.core.emails.messages.list.response.emails.item.recipient.title",
                    layout: { type: LayoutType.STACKED },
                  },
                  { response: true },
                  {
                    recipientEmail: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.recipientEmail",
                        label: "app.api.v1.core.emails.messages.list.response.emails.item.recipientEmail.label",
                      },
                      z.email(),
                    ),
                    recipientName: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.recipientName",
                        label: "app.api.v1.core.emails.messages.list.response.emails.item.recipientName.label",
                      },
                      z.string().nullable(),
                    ),
                  },
                ),
                sender: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    title: "app.api.v1.core.emails.messages.list.response.emails.item.sender.title",
                    layout: { type: LayoutType.STACKED },
                  },
                  { response: true },
                  {
                    senderEmail: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.senderEmail",
                        label: "app.api.v1.core.emails.messages.list.response.emails.item.senderEmail.label",
                      },
                      z.email(),
                    ),
                    senderName: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.senderName",
                        label: "app.api.v1.core.emails.messages.list.response.emails.item.senderName.label",
                      },
                      z.string().nullable(),
                    ),
                  },
                ),
              },
            ),

            // === EMAIL METADATA ===
            emailMetadata: objectField(
              {
                type: WidgetType.CONTAINER,
                layout: { type: LayoutType.GRID_4_COLUMNS },
                collapsed: true,
              },
              { response: true },
              {
                type: responseField(
                  {
                    type: WidgetType.BADGE,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.type",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.type.label",
                  },
                  z.nativeEnum(EmailType),
                ),
                templateName: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.templateName",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.templateName.label",
                  },
                  z.string().nullable(),
                ),
                emailProvider: responseField(
                  {
                    type: WidgetType.BADGE,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.emailProvider",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.emailProvider.label",
                  },
                  z.string().nullable(),
                ),
                externalId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.externalId",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.externalId.label",
                  },
                  z.string().nullable(),
                ),
              },
            ),

            // === ENGAGEMENT TRACKING ===
            emailEngagement: objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.v1.core.emails.messages.list.response.emails.item.engagement.title",
                layout: { type: LayoutType.VERTICAL },
              },
              { response: true },
              {
                sentAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.sentAt",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.sentAt.label",
                    eventType: "sent",
                  },
                  z.string().datetime().nullable(),
                ),
                deliveredAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.deliveredAt",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.deliveredAt.label",
                    eventType: "delivered",
                  },
                  z.string().datetime().nullable(),
                ),
                openedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.openedAt",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.openedAt.label",
                    eventType: "opened",
                  },
                  z.string().datetime().nullable(),
                ),
                clickedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.clickedAt",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.clickedAt.label",
                    eventType: "clicked",
                  },
                  z.string().datetime().nullable(),
                ),
              },
            ),

            // === TECHNICAL DETAILS ===
            technicalDetails: objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.v1.core.emails.messages.list.response.emails.item.technicalDetails.title",
                layout: { type: LayoutType.GRID_3_COLUMNS },
                collapsed: true,
              },
              { response: true },
              {
                retryCount: responseField(
                  {
                    type: WidgetType.NUMBER,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.retryCount",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.retryCount.label",
                  },
                  z.number().int(),
                ),
                error: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.error",
                    label: "app.api.v1.core.emails.messages.list.response.emails.item.error.label",
                  },
                  z.string().nullable(),
                ),
                associatedIds: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    title: "app.api.v1.core.emails.messages.list.response.emails.item.associatedIds.title",
                    layout: { type: LayoutType.INLINE },
                  },
                  { response: true },
                  {
                    userId: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.userId",
                        label: "app.api.v1.core.emails.messages.list.response.emails.item.userId.label",
                      },
                      z.uuid().nullable(),
                    ),
                    leadId: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.leadId",
                        label: "app.api.v1.core.emails.messages.list.response.emails.item.leadId.label",
                      },
                      z.uuid().nullable(),
                    ),
                  },
                ),
                timestamps: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    title: "app.api.v1.core.emails.messages.list.response.emails.item.timestamps.title",
                    layout: { type: LayoutType.GRID_2_COLUMNS },
                  },
                  { response: true },
                  {
                    createdAt: responseField(
                      {
                        type: WidgetType.TIMESTAMP,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.createdAt",
                        label: "app.api.v1.core.emails.messages.list.response.emails.item.createdAt.label",
                      },
                      z.string().datetime(),
                    ),
                    updatedAt: responseField(
                      {
                        type: WidgetType.TIMESTAMP,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.updatedAt",
                        label: "app.api.v1.core.emails.messages.list.response.emails.item.updatedAt.label",
                      },
                      z.string().datetime(),
                    ),
                  },
                ),
              },
            ),
          },
        ),
      ),

      pagination: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.messages.list.response.pagination.title",
          description:
            "app.api.v1.core.emails.messages.list.response.pagination.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          page: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.list.response.pagination.page",
            },
            z.number().int().min(1),
          ),
          limit: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.list.response.pagination.limit",
            },
            z.number().int().min(1),
          ),
          total: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.list.response.pagination.total",
            },
            z.number().int().min(0),
          ),
          totalPages: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.list.response.pagination.totalPages",
            },
            z.number().int().min(0),
          ),
        },
      ),

    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.emails.messages.list.errors.validation.title",
      description:
        "app.api.v1.core.emails.messages.list.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.emails.messages.list.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.messages.list.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.emails.messages.list.errors.forbidden.title",
      description:
        "app.api.v1.core.emails.messages.list.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.emails.messages.list.errors.notFound.title",
      description:
        "app.api.v1.core.emails.messages.list.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.emails.messages.list.errors.server.title",
      description:
        "app.api.v1.core.emails.messages.list.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.emails.messages.list.errors.unknown.title",
      description:
        "app.api.v1.core.emails.messages.list.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.emails.messages.list.errors.unsaved.title",
      description:
        "app.api.v1.core.emails.messages.list.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.emails.messages.list.errors.conflict.title",
      description:
        "app.api.v1.core.emails.messages.list.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.emails.messages.list.errors.network.title",
      description:
        "app.api.v1.core.emails.messages.list.errors.network.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.emails.messages.list.success.title",
    description: "app.api.v1.core.emails.messages.list.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        filters: {
          search: "",
          status: EmailStatusFilter.ALL,
          type: EmailTypeFilter.ALL,
        },
        displayOptions: {
          sortBy: EmailSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
          page: 1,
          limit: 20,
        },
      },
      filtered: {
        filters: {
          search: "welcome",
          status: EmailStatusFilter.SENT,
          type: EmailTypeFilter.TRANSACTIONAL,
          dateRange: {
            dateFrom: "2024-01-01T00:00:00.000Z",
            dateTo: "2024-01-31T23:59:59.999Z",
          },
        },
        displayOptions: {
          sortBy: EmailSortField.SENT_AT,
          sortOrder: SortOrder.DESC,
          page: 1,
          limit: 50,
        },
      },
    },
    responses: {
      default: {
        emails: [
          {
            emailCore: {
              id: "123e4567-e89b-12d3-a456-426614174000",
              subject: "Welcome to Our Amazing Service!",
              status: EmailStatus.DELIVERED,
            },
            emailParties: {
              recipient: {
                recipientEmail: "john.doe@example.com",
                recipientName: "John Doe",
              },
              sender: {
                senderEmail: "welcome@company.com",
                senderName: "Company Welcome Team",
              },
            },
            emailMetadata: {
              type: EmailType.TRANSACTIONAL,
              templateName: "welcome_onboarding",
              emailProvider: "resend",
              externalId: "msg_7h8i9j0k1l2m3n4o",
            },
            emailEngagement: {
              sentAt: "2024-01-07T10:00:00.000Z",
              deliveredAt: "2024-01-07T10:01:30.000Z",
              openedAt: "2024-01-07T10:15:45.000Z",
              clickedAt: "2024-01-07T10:22:10.000Z",
            },
            technicalDetails: {
              retryCount: 0,
              error: null,
              associatedIds: {
                userId: "user_abc123def456",
                leadId: "lead_789xyz012abc",
              },
              timestamps: {
                createdAt: "2024-01-07T09:58:00.000Z",
                updatedAt: "2024-01-07T10:22:10.000Z",
              },
            },
          },
          {
            emailCore: {
              id: "456e7890-e89b-12d3-a456-426614174001",
              subject: "Your Weekly Newsletter",
              status: EmailStatus.BOUNCED,
            },
            emailParties: {
              recipient: {
                recipientEmail: "invalid@nonexistent.com",
                recipientName: "Test User",
              },
              sender: {
                senderEmail: "newsletter@company.com",
                senderName: "Company Newsletter",
              },
            },
            emailMetadata: {
              type: EmailType.MARKETING,
              templateName: "weekly_newsletter_v2",
              emailProvider: "sendgrid",
              externalId: "sg_5p6q7r8s9t0u1v2w",
            },
            emailEngagement: {
              sentAt: "2024-01-07T08:00:00.000Z",
              deliveredAt: null,
              openedAt: null,
              clickedAt: null,
            },
            technicalDetails: {
              retryCount: 3,
              error: "550 5.1.1 User unknown in virtual alias table",
              associatedIds: {
                userId: null,
                leadId: "lead_def456ghi789",
              },
              timestamps: {
                createdAt: "2024-01-07T07:55:00.000Z",
                updatedAt: "2024-01-07T08:05:00.000Z",
              },
            },
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          totalPages: 5,
        },
        appliedFilters: objectField(
          {
            type: WidgetType.CONTAINER,
            title: "app.api.v1.core.emails.messages.list.response.appliedFilters.title",
            layout: { type: LayoutType.INLINE },
          },
          { response: true },
          {
            status: responseField(
              {
                type: WidgetType.BADGE,
                content:
                  "app.api.v1.core.emails.messages.list.response.filters.status",
                label: "app.api.v1.core.emails.messages.list.response.filters.status.label",
              },
              z.nativeEnum(EmailStatusFilter),
            ),
            type: responseField(
              {
                type: WidgetType.BADGE,
                content:
                  "app.api.v1.core.emails.messages.list.response.filters.type",
                label: "app.api.v1.core.emails.messages.list.response.filters.type.label",
              },
              z.nativeEnum(EmailTypeFilter),
            ),
            search: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.messages.list.response.filters.search",
                label: "app.api.v1.core.emails.messages.list.response.filters.search.label",
              },
              z.string().optional(),
            ),
            dateRange: objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.v1.core.emails.messages.list.response.filters.dateRange.title",
                layout: { type: LayoutType.INLINE },
              },
              { response: true },
              {
                dateFrom: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.filters.dateFrom",
                    label: "app.api.v1.core.emails.messages.list.response.filters.dateFrom.label",
                  },
                  z.string().datetime().optional(),
                ),
                dateTo: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.filters.dateTo",
                    label: "app.api.v1.core.emails.messages.list.response.filters.dateTo.label",
                  },
                  z.string().datetime().optional(),
                ),
              },
            ),
          },
        ),
      },
    },
    urlPathVariables: {
      default: {},
    },
  },
});

// Export types following migration guide pattern
export type EmailsListRequestInput = typeof GET.types.RequestInput;
export type EmailsListRequestOutput = typeof GET.types.RequestOutput;
export type EmailsListResponseInput = typeof GET.types.ResponseInput;
export type EmailsListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = {
  GET,
};

export default definitions;
