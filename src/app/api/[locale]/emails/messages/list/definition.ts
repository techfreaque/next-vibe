/**
 * Emails List API Definition
 * Defines the API endpoint for listing emails with filtering and pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedObjectOptionalField,
  scopedRequestField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
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
  MessageChannel,
  MessageChannelDB,
  MessageChannelFilter,
  MessageChannelFilterOptions,
} from "../../messaging/enum";
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
import { scopedTranslation } from "./i18n";
import { EmailsListContainer } from "./widget";

/**
 * Get Emails List Endpoint (GET)
 * Retrieves a paginated list of emails with filtering
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "messages", "list"],
  title: "title",
  description: "description",
  category: "category",
  icon: "file-text",
  tags: ["tags.emails"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: EmailsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),
      // === FILTER AND SEARCH ===
      filters: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "filters.title",
        description: "filters.description",
        layoutType: LayoutType.GRID,
        columns: 4,
        usage: { request: "data" },
        children: {
          search: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "fields.search.label",
            description: "fields.search.description",
            placeholder: "fields.search.placeholder",
            helpText: "fields.search.label",
            schema: z.string().optional(),
          }),

          channel: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.channel.label",
            description: "fields.channel.description",
            options: MessageChannelFilterOptions,
            schema: z
              .enum(MessageChannelFilter)
              .default(MessageChannelFilter.ANY),
          }),

          status: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.status.label",
            description: "fields.status.description",
            placeholder: "fields.status.placeholder",
            options: EmailStatusFilterOptions,
            schema: z.enum(EmailStatusFilter).default(EmailStatusFilter.ANY),
          }),

          type: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.type.label",
            description: "fields.type.description",
            placeholder: "fields.type.placeholder",
            options: EmailTypeFilterOptions,
            schema: z.enum(EmailTypeFilter).default(EmailTypeFilter.ANY),
          }),

          dateRange: scopedObjectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "fields.dateRange.title",
            layoutType: LayoutType.GRID_2_COLUMNS,
            usage: { request: "data" },
            children: {
              dateFrom: scopedRequestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.DATETIME,
                label: "fields.dateFrom.label",
                description: "fields.dateFrom.description",
                placeholder: "fields.dateFrom.placeholder",
                schema: dateSchema.optional(),
              }),

              dateTo: scopedRequestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.DATETIME,
                label: "fields.dateTo.label",
                description: "fields.dateTo.description",
                placeholder: "fields.dateTo.placeholder",
                schema: dateSchema.optional(),
              }),
            },
          }),
        },
      }),

      // === SORTING AND PAGINATION ===
      displayOptions: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "displayOptions.title",
        layoutType: LayoutType.GRID,
        columns: 4,
        usage: { request: "data" },
        children: {
          sortBy: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.sortBy.label",
            description: "fields.sortBy.description",
            placeholder: "fields.sortBy.placeholder",
            options: EmailSortFieldOptions,
            schema: z.enum(EmailSortField).default(EmailSortField.CREATED_AT),
          }),

          sortOrder: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.sortOrder.label",
            description: "fields.sortOrder.description",
            placeholder: "fields.sortOrder.placeholder",
            options: SortOrderOptions,
            schema: z.enum(SortOrder).default(SortOrder.DESC),
          }),

          page: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "fields.page.label",
            description: "fields.page.description",
            placeholder: "fields.page.placeholder",
            schema: z.coerce.number().int().min(1).default(1),
          }),

          limit: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "fields.limit.label",
            description: "fields.limit.description",
            placeholder: "fields.limit.placeholder",
            schema: z.coerce.number().int().min(1).max(100).default(20),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      emails: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.HORIZONTAL,
          usage: { response: true },
          children: {
            // === CORE EMAIL INFO ===
            emailCore: scopedObjectFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "response.emails.item.emailCore.title",
              layoutType: LayoutType.GRID,
              columns: 3,
              usage: { response: true },
              children: {
                id: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.emails.item.id",
                  schema: z.uuid(),
                }),
                subject: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.emails.item.subject",
                  schema: z.string(),
                }),
                status: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "response.emails.item.status",
                  schema: z.enum(EmailStatus),
                }),
                channel: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "response.emails.item.channel",
                  schema: z
                    .enum(MessageChannelDB)
                    .default(MessageChannel.EMAIL),
                }),
              },
            }),

            // === RECIPIENT AND SENDER ===
            emailParties: scopedObjectFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "response.emails.item.emailParties.title",
              layoutType: LayoutType.GRID_2_COLUMNS,
              usage: { response: true },
              children: {
                recipient: scopedObjectFieldNew(scopedTranslation, {
                  type: WidgetType.CONTAINER,
                  title: "response.emails.item.recipientEmail",
                  layoutType: LayoutType.STACKED,
                  usage: { response: true },
                  children: {
                    recipientEmail: scopedResponseField(scopedTranslation, {
                      type: WidgetType.TEXT,
                      content: "response.emails.item.recipientEmail",
                      schema: z.string(),
                    }),
                    recipientName: scopedResponseField(scopedTranslation, {
                      type: WidgetType.TEXT,
                      content: "response.emails.item.recipientName",
                      schema: z.string().nullable(),
                    }),
                  },
                }),
                sender: scopedObjectFieldNew(scopedTranslation, {
                  type: WidgetType.CONTAINER,
                  title: "response.emails.item.senderEmail",
                  layoutType: LayoutType.STACKED,
                  usage: { response: true },
                  children: {
                    senderEmail: scopedResponseField(scopedTranslation, {
                      type: WidgetType.TEXT,
                      content: "response.emails.item.senderEmail",
                      schema: z.string(),
                    }),
                    senderName: scopedResponseField(scopedTranslation, {
                      type: WidgetType.TEXT,
                      content: "response.emails.item.senderName",
                      schema: z.string().nullable(),
                    }),
                  },
                }),
              },
            }),

            // === EMAIL METADATA ===
            emailMetadata: scopedObjectFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "response.emails.item.emailMetadata.title",
              layoutType: LayoutType.GRID,
              columns: 4,
              usage: { response: true },
              children: {
                type: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "response.emails.item.type",
                  schema: z.enum(EmailType),
                }),
                templateName: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.emails.item.templateName",
                  schema: z.string().nullable(),
                }),
                emailProvider: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "response.emails.item.emailProvider",
                  schema: z.string().nullable(),
                }),
                externalId: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.emails.item.externalId",
                  schema: z.string().nullable(),
                }),
              },
            }),

            // === ENGAGEMENT TRACKING ===
            emailEngagement: scopedObjectFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "response.emails.item.emailEngagement.title",
              layoutType: LayoutType.VERTICAL,
              usage: { response: true },
              children: {
                sentAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.emails.item.sentAt",
                  schema: dateSchema.nullable(),
                }),
                deliveredAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.emails.item.deliveredAt",
                  schema: dateSchema.nullable(),
                }),
                openedAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.emails.item.openedAt",
                  schema: dateSchema.nullable(),
                }),
                clickedAt: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.emails.item.clickedAt",
                  schema: dateSchema.nullable(),
                }),
              },
            }),

            // === TECHNICAL DETAILS ===
            technicalDetails: scopedObjectFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "response.emails.item.technicalDetails.title",
              layoutType: LayoutType.GRID,
              columns: 3,
              usage: { response: true },
              children: {
                retryCount: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.emails.item.retryCount",
                  schema: z.coerce.number().int(),
                }),
                error: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.emails.item.error",
                  schema: z.string().nullable(),
                }),
                associatedIds: scopedObjectFieldNew(scopedTranslation, {
                  type: WidgetType.CONTAINER,
                  title: "response.emails.item.associatedIds.title",
                  layoutType: LayoutType.HORIZONTAL,
                  usage: { response: true },
                  children: {
                    userId: scopedResponseField(scopedTranslation, {
                      type: WidgetType.TEXT,
                      content: "response.emails.item.userId",
                      schema: z.string().nullable(),
                    }),
                    leadId: scopedResponseField(scopedTranslation, {
                      type: WidgetType.TEXT,
                      content: "response.emails.item.leadId",
                      schema: z.string().nullable(),
                    }),
                  },
                }),
                timestamps: scopedObjectFieldNew(scopedTranslation, {
                  type: WidgetType.CONTAINER,
                  title: "response.emails.item.timestamps.title",
                  layoutType: LayoutType.GRID_2_COLUMNS,
                  usage: { response: true },
                  children: {
                    createdAt: scopedResponseField(scopedTranslation, {
                      type: WidgetType.TEXT,
                      content: "response.emails.item.createdAt",
                      schema: dateSchema,
                    }),
                    updatedAt: scopedResponseField(scopedTranslation, {
                      type: WidgetType.TEXT,
                      content: "response.emails.item.updatedAt",
                      schema: dateSchema,
                    }),
                  },
                }),
              },
            }),
          },
        }),
      }),

      pagination: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.pagination.title",
        description: "response.pagination.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          page: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.page",
            schema: z.coerce.number().int().min(1),
          }),
          limit: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.limit",
            schema: z.coerce.number().int().min(1),
          }),
          total: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.total",
            schema: z.coerce.number().int().min(0),
          }),
          totalPages: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.pagination.totalPages",
            schema: z.coerce.number().int().min(0),
          }),
        },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsaved.title",
      description: "errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        filters: {
          search: "",
          status: EmailStatusFilter.ANY,
          type: EmailTypeFilter.ANY,
          dateRange: {
            dateFrom: undefined,
            dateTo: undefined,
          },
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
