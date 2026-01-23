/**
 * Emails List API Definition
 * Defines the API endpoint for listing emails with filtering and pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  objectOptionalField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema } from "../../../shared/types/common.schema";
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
  path: ["emails", "messages", "list"],
  title: "app.api.emails.messages.list.title",
  description: "app.api.emails.messages.list.description",
  category: "app.api.emails.category",
  icon: "file-text",
  tags: ["app.api.emails.messages.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.messages.list.container.title",
      description: "app.api.emails.messages.list.container.description",
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === FILTER AND SEARCH ===
      filters: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.messages.list.filters.title",
          description: "app.api.emails.messages.list.filters.description",
          layoutType: LayoutType.GRID,
          columns: 4,
        },
        { request: "data" },
        {
          search: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "app.api.emails.messages.list.fields.search.label",
            description:
              "app.api.emails.messages.list.fields.search.description",
            placeholder:
              "app.api.emails.messages.list.fields.search.placeholder",
            helpText: "app.api.emails.messages.list.fields.search.label",
            schema: z.string().optional(),
          }),

          status: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.emails.messages.list.fields.status.label",
            description:
              "app.api.emails.messages.list.fields.status.description",
            placeholder:
              "app.api.emails.messages.list.fields.status.placeholder",
            options: EmailStatusFilterOptions,
            schema: z.enum(EmailStatusFilter).default(EmailStatusFilter.ANY),
          }),

          type: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.emails.messages.list.fields.type.label",
            description: "app.api.emails.messages.list.fields.type.description",
            placeholder: "app.api.emails.messages.list.fields.type.placeholder",
            options: EmailTypeFilterOptions,
            schema: z.enum(EmailTypeFilter).default(EmailTypeFilter.ANY),
          }),

          dateRange: objectOptionalField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.emails.messages.list.fields.dateRange.title",
              layoutType: LayoutType.GRID_2_COLUMNS,
            },
            { request: "data" },
            {
              dateFrom: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.DATETIME,
                label: "app.api.emails.messages.list.fields.dateFrom.label",
                description:
                  "app.api.emails.messages.list.fields.dateFrom.description",
                placeholder:
                  "app.api.emails.messages.list.fields.dateFrom.placeholder",
                schema: dateSchema.optional(),
              }),

              dateTo: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.DATETIME,
                label: "app.api.emails.messages.list.fields.dateTo.label",
                description:
                  "app.api.emails.messages.list.fields.dateTo.description",
                placeholder:
                  "app.api.emails.messages.list.fields.dateTo.placeholder",
                schema: dateSchema.optional(),
              }),
            },
          ),
        },
      ),

      // === SORTING AND PAGINATION ===
      displayOptions: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.messages.list.displayOptions.title",
          layoutType: LayoutType.GRID,
          columns: 4,
        },
        { request: "data" },
        {
          sortBy: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.emails.messages.list.fields.sortBy.label",
            description:
              "app.api.emails.messages.list.fields.sortBy.description",
            placeholder:
              "app.api.emails.messages.list.fields.sortBy.placeholder",
            options: EmailSortFieldOptions,
            schema: z.enum(EmailSortField).default(EmailSortField.CREATED_AT),
          }),

          sortOrder: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.emails.messages.list.fields.sortOrder.label",
            description:
              "app.api.emails.messages.list.fields.sortOrder.description",
            placeholder:
              "app.api.emails.messages.list.fields.sortOrder.placeholder",
            options: SortOrderOptions,
            schema: z.enum(SortOrder).default(SortOrder.DESC),
          }),

          page: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "app.api.emails.messages.list.fields.page.label",
            description: "app.api.emails.messages.list.fields.page.description",
            placeholder: "app.api.emails.messages.list.fields.page.placeholder",
            schema: z.coerce.number().int().min(1).default(1),
          }),

          limit: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "app.api.emails.messages.list.fields.limit.label",
            description:
              "app.api.emails.messages.list.fields.limit.description",
            placeholder:
              "app.api.emails.messages.list.fields.limit.placeholder",
            schema: z.coerce.number().int().min(1).max(100).default(20),
          }),
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
                  "app.api.emails.messages.list.response.emails.item.emailCore.title",
                layoutType: LayoutType.GRID,
                columns: 3,
              },
              { response: true },
              {
                id: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.list.response.emails.item.id",
                  schema: z.uuid(),
                }),
                subject: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.list.response.emails.item.subject",
                  schema: z.string(),
                }),
                status: responseField({
                  type: WidgetType.BADGE,
                  text: "app.api.emails.messages.list.response.emails.item.status",
                  schema: z.enum(EmailStatus),
                }),
              },
            ),

            // === RECIPIENT AND SENDER ===
            emailParties: objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.emails.messages.list.response.emails.item.emailParties.title",
                layoutType: LayoutType.GRID_2_COLUMNS,
              },
              { response: true },
              {
                recipient: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    title:
                      "app.api.emails.messages.list.response.emails.item.recipientEmail",
                    layoutType: LayoutType.STACKED,
                  },
                  { response: true },
                  {
                    recipientEmail: responseField({
                      type: WidgetType.TEXT,
                      content:
                        "app.api.emails.messages.list.response.emails.item.recipientEmail",
                      schema: z.string(),
                    }),
                    recipientName: responseField({
                      type: WidgetType.TEXT,
                      content:
                        "app.api.emails.messages.list.response.emails.item.recipientName",
                      schema: z.string().nullable(),
                    }),
                  },
                ),
                sender: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    title:
                      "app.api.emails.messages.list.response.emails.item.senderEmail",
                    layoutType: LayoutType.STACKED,
                  },
                  { response: true },
                  {
                    senderEmail: responseField({
                      type: WidgetType.TEXT,
                      content:
                        "app.api.emails.messages.list.response.emails.item.senderEmail",
                      schema: z.string(),
                    }),
                    senderName: responseField({
                      type: WidgetType.TEXT,
                      content:
                        "app.api.emails.messages.list.response.emails.item.senderName",
                      schema: z.string().nullable(),
                    }),
                  },
                ),
              },
            ),

            // === EMAIL METADATA ===
            emailMetadata: objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.emails.messages.list.response.emails.item.emailMetadata.title",
                layoutType: LayoutType.GRID,
                columns: 4,
              },
              { response: true },
              {
                type: responseField({
                  type: WidgetType.BADGE,
                  text: "app.api.emails.messages.list.response.emails.item.type",
                  schema: z.enum(EmailType),
                }),
                templateName: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.list.response.emails.item.templateName",
                  schema: z.string().nullable(),
                }),
                emailProvider: responseField({
                  type: WidgetType.BADGE,
                  text: "app.api.emails.messages.list.response.emails.item.emailProvider",
                  schema: z.string().nullable(),
                }),
                externalId: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.list.response.emails.item.externalId",
                  schema: z.string().nullable(),
                }),
              },
            ),

            // === ENGAGEMENT TRACKING ===
            emailEngagement: objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.emails.messages.list.response.emails.item.emailEngagement.title",
                layoutType: LayoutType.VERTICAL,
              },
              { response: true },
              {
                sentAt: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.list.response.emails.item.sentAt",
                  schema: dateSchema.nullable(),
                }),
                deliveredAt: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.list.response.emails.item.deliveredAt",
                  schema: dateSchema.nullable(),
                }),
                openedAt: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.list.response.emails.item.openedAt",
                  schema: dateSchema.nullable(),
                }),
                clickedAt: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.list.response.emails.item.clickedAt",
                  schema: dateSchema.nullable(),
                }),
              },
            ),

            // === TECHNICAL DETAILS ===
            technicalDetails: objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.emails.messages.list.response.emails.item.technicalDetails.title",
                layoutType: LayoutType.GRID,
                columns: 3,
              },
              { response: true },
              {
                retryCount: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.list.response.emails.item.retryCount",
                  schema: z.coerce.number().int(),
                }),
                error: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.list.response.emails.item.error",
                  schema: z.string().nullable(),
                }),
                associatedIds: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    title:
                      "app.api.emails.messages.list.response.emails.item.associatedIds.title",
                    layoutType: LayoutType.HORIZONTAL,
                  },
                  { response: true },
                  {
                    userId: responseField({
                      type: WidgetType.TEXT,
                      content:
                        "app.api.emails.messages.list.response.emails.item.userId",
                      schema: z.string().nullable(),
                    }),
                    leadId: responseField({
                      type: WidgetType.TEXT,
                      content:
                        "app.api.emails.messages.list.response.emails.item.leadId",
                      schema: z.string().nullable(),
                    }),
                  },
                ),
                timestamps: objectField(
                  {
                    type: WidgetType.CONTAINER,
                    title:
                      "app.api.emails.messages.list.response.emails.item.timestamps.title",
                    layoutType: LayoutType.GRID_2_COLUMNS,
                  },
                  { response: true },
                  {
                    createdAt: responseField({
                      type: WidgetType.TEXT,
                      content:
                        "app.api.emails.messages.list.response.emails.item.createdAt",
                      schema: dateSchema,
                    }),
                    updatedAt: responseField({
                      type: WidgetType.TEXT,
                      content:
                        "app.api.emails.messages.list.response.emails.item.updatedAt",
                      schema: dateSchema,
                    }),
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
          title: "app.api.emails.messages.list.response.pagination.title",
          description:
            "app.api.emails.messages.list.response.pagination.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          page: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.messages.list.response.pagination.page",
            schema: z.coerce.number().int().min(1),
          }),
          limit: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.messages.list.response.pagination.limit",
            schema: z.coerce.number().int().min(1),
          }),
          total: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.messages.list.response.pagination.total",
            schema: z.coerce.number().int().min(0),
          }),
          totalPages: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.messages.list.response.pagination.totalPages",
            schema: z.coerce.number().int().min(0),
          }),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.messages.list.errors.validation.title",
      description: "app.api.emails.messages.list.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.emails.messages.list.errors.unauthorized.title",
      description:
        "app.api.emails.messages.list.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.messages.list.errors.forbidden.title",
      description: "app.api.emails.messages.list.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.messages.list.errors.notFound.title",
      description: "app.api.emails.messages.list.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.messages.list.errors.server.title",
      description: "app.api.emails.messages.list.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.messages.list.errors.unknown.title",
      description: "app.api.emails.messages.list.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.messages.list.errors.unsaved.title",
      description: "app.api.emails.messages.list.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.messages.list.errors.conflict.title",
      description: "app.api.emails.messages.list.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.messages.list.errors.network.title",
      description: "app.api.emails.messages.list.errors.network.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.emails.messages.list.success.title",
    description: "app.api.emails.messages.list.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        filters: {
          search: "",
          status: EmailStatusFilter.ANY,
          type: EmailTypeFilter.ANY,
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
