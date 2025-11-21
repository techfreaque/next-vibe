/**
 * Emails List API Definition
 * Defines the API endpoint for listing emails with filtering and pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  objectOptionalField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
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
  SortOrder,
  SortOrderOptions,
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
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === FILTER AND SEARCH ===
      filters: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.emails.messages.list.filters.title",
          description:
            "app.api.v1.core.emails.messages.list.filters.description",
          layoutType: LayoutType.GRID,
          columns: 4,
        },
        { request: "data" },
        {
          search: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.v1.core.emails.messages.list.fields.search.label",
              description:
                "app.api.v1.core.emails.messages.list.fields.search.description",
              placeholder:
                "app.api.v1.core.emails.messages.list.fields.search.placeholder",
              helpText:
                "app.api.v1.core.emails.messages.list.fields.search.label",
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
            },
            z.enum(EmailStatusFilter).default(EmailStatusFilter.ALL),
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
            },
            z.enum(EmailTypeFilter).default(EmailTypeFilter.ALL),
          ),

          dateRange: objectOptionalField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.emails.messages.list.fields.dateRange.title",
              layoutType: LayoutType.GRID_2_COLUMNS,
            },
            { request: "data" },
            {
              dateFrom: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.DATETIME,
                  label:
                    "app.api.v1.core.emails.messages.list.fields.dateFrom.label",
                  description:
                    "app.api.v1.core.emails.messages.list.fields.dateFrom.description",
                  placeholder:
                    "app.api.v1.core.emails.messages.list.fields.dateFrom.placeholder",
                },
                z.string().datetime().optional(),
              ),

              dateTo: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.DATETIME,
                  label:
                    "app.api.v1.core.emails.messages.list.fields.dateTo.label",
                  description:
                    "app.api.v1.core.emails.messages.list.fields.dateTo.description",
                  placeholder:
                    "app.api.v1.core.emails.messages.list.fields.dateTo.placeholder",
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
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.emails.messages.list.displayOptions.title",
          layoutType: LayoutType.GRID,
          columns: 4,
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
            },
            z.enum(EmailSortField).default(EmailSortField.CREATED_AT),
          ),

          sortOrder: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label:
                "app.api.v1.core.emails.messages.list.fields.sortOrder.label",
              description:
                "app.api.v1.core.emails.messages.list.fields.sortOrder.description",
              placeholder:
                "app.api.v1.core.emails.messages.list.fields.sortOrder.placeholder",
              options: SortOrderOptions,
            },
            z.enum(SortOrder).default(SortOrder.DESC),
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
            },
            z.coerce.number().int().min(1).max(100).default(20),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      emails: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [],
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.HORIZONTAL,
          },
          { response: true },
          {
            // === CORE EMAIL INFO ===
            emailCore: objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.v1.core.emails.messages.list.response.emails.item.emailCore.title",
                layoutType: LayoutType.GRID,
                columns: 3,
              },
              { response: true },
              {
                id: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.id",
                  },
                  z.uuid(),
                ),
                subject: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.subject",
                  },
                  z.string(),
                ),
                status: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.emails.messages.list.response.emails.item.status",
                  },
                  z.enum(EmailStatus),
                ),
              },
            ),

            // === RECIPIENT AND SENDER ===
            emailParties: objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.v1.core.emails.messages.list.response.emails.item.emailParties.title",
                layoutType: LayoutType.GRID_2_COLUMNS,
              },
              { response: true },
              {
                recipient: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    title:
                      "app.api.v1.core.emails.messages.list.response.emails.item.recipientEmail",
                    layoutType: LayoutType.STACKED,
                  },
                  { response: true },
                  {
                    recipientEmail: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.recipientEmail",
                      },
                      z.string(),
                    ),
                    recipientName: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.recipientName",
                      },
                      z.string().nullable(),
                    ),
                  },
                ),
                sender: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    title:
                      "app.api.v1.core.emails.messages.list.response.emails.item.senderEmail",
                    layoutType: LayoutType.STACKED,
                  },
                  { response: true },
                  {
                    senderEmail: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.senderEmail",
                      },
                      z.string(),
                    ),
                    senderName: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.senderName",
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
                title:
                  "app.api.v1.core.emails.messages.list.response.emails.item.emailMetadata.title",
                layoutType: LayoutType.GRID,
                columns: 4,
              },
              { response: true },
              {
                type: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.emails.messages.list.response.emails.item.type",
                  },
                  z.enum(EmailType),
                ),
                templateName: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.templateName",
                  },
                  z.string().nullable(),
                ),
                emailProvider: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.emails.messages.list.response.emails.item.emailProvider",
                  },
                  z.string().nullable(),
                ),
                externalId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.externalId",
                  },
                  z.string().nullable(),
                ),
              },
            ),

            // === ENGAGEMENT TRACKING ===
            emailEngagement: objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.v1.core.emails.messages.list.response.emails.item.emailEngagement.title",
                layoutType: LayoutType.VERTICAL,
              },
              { response: true },
              {
                sentAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.sentAt",
                  },
                  z.string().datetime().nullable(),
                ),
                deliveredAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.deliveredAt",
                  },
                  z.string().datetime().nullable(),
                ),
                openedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.openedAt",
                  },
                  z.string().datetime().nullable(),
                ),
                clickedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.clickedAt",
                  },
                  z.string().datetime().nullable(),
                ),
              },
            ),

            // === TECHNICAL DETAILS ===
            technicalDetails: objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.v1.core.emails.messages.list.response.emails.item.technicalDetails.title",
                layoutType: LayoutType.GRID,
                columns: 3,
              },
              { response: true },
              {
                retryCount: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.retryCount",
                  },
                  z.number().int(),
                ),
                error: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.emails.messages.list.response.emails.item.error",
                  },
                  z.string().nullable(),
                ),
                associatedIds: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    title:
                      "app.api.v1.core.emails.messages.list.response.emails.item.associatedIds.title",
                    layoutType: LayoutType.HORIZONTAL,
                  },
                  { response: true },
                  {
                    userId: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.userId",
                      },
                      z.string().nullable(),
                    ),
                    leadId: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.leadId",
                      },
                      z.string().nullable(),
                    ),
                  },
                ),
                timestamps: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    title:
                      "app.api.v1.core.emails.messages.list.response.emails.item.timestamps.title",
                    layoutType: LayoutType.GRID_2_COLUMNS,
                  },
                  { response: true },
                  {
                    createdAt: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.createdAt",
                      },
                      z.string().datetime(),
                    ),
                    updatedAt: responseField(
                      {
                        type: WidgetType.TEXT,
                        content:
                          "app.api.v1.core.emails.messages.list.response.emails.item.updatedAt",
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
          layoutType: LayoutType.GRID,
          columns: 12,
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
      },
      filtered: {
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
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      },
    },
  },
});

// Export types following migration guide pattern
export type EmailsListRequestInput = typeof GET.types.RequestInput;
export type EmailsListRequestOutput = typeof GET.types.RequestOutput;
export type EmailsListResponseInput = typeof GET.types.ResponseInput;
export type EmailsListResponseOutput = typeof GET.types.ResponseOutput;

// Also export with alternative naming for compatibility
export type EmailsListRequestType = typeof GET.types.RequestOutput;
export type EmailsListResponseType = typeof GET.types.ResponseOutput;

const definitions = {
  GET,
};

export default definitions;
