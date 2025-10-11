/**
 * Email Stats API Definition
 * Defines the API endpoint for email statistics and analytics with historical charts
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
  requestUrlParamsField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { ActivityType, UserAssociation } from "@/app/api/[locale]/v1/core/leads/enum";
import { EngagementLevel } from "@/app/api/[locale]/v1/core/leads/tracking/engagement/enum";
import {
  EmailProvider,
  EmailSortField,
  EmailStatus,
  EmailStatusFilter,
  EmailStatusFilterOptions,
  EmailType,
  EmailTypeFilter,
  EmailTypeFilterOptions,
  RetryRange,
} from "../enum";

/**
 * Email Stats Request Schema
 * Comprehensive filtering for historical email statistics based on database schema
 */
// // Email stats request schema - not needed directly since using field definitions
// // const emailStatsRequestSchema = baseStatsFilterSchema.extend({
//   // Email-specific filters
//   status: z.string().default(EmailStatusFilter.ALL),
//   type: z.string().default(EmailTypeFilter.ALL),
//   search: z.string().optional(),
// 
//   // Email filtering based on database fields
//   hasUserId: z.boolean().optional(), // Filter emails with/without userId
//   hasLeadId: z.boolean().optional(), // Filter emails with/without leadId
//   hasTemplateId: z.boolean().optional(), // Filter emails with/without templateId
//   hasSubject: z.boolean().optional(), // Filter emails with/without subject
//   hasContent: z.boolean().optional(), // Filter emails with/without content
//   hasError: z.boolean().optional(), // Filter emails with/without error
//   hasRetryCount: z.boolean().optional(), // Filter emails with/without retryCount
//   hasOpenedAt: z.boolean().optional(), // Filter emails with/without openedAt
//   hasClickedAt: z.boolean().optional(), // Filter emails with/without clickedAt
// 
//   // Provider and template filtering
//   emailProvider: z.string().optional(), // Filter by email provider (e.g., resend, sendgrid)
//   templateName: z.string().optional(), // Filter by email template name
//   templateId: z.uuid().optional(), // Filter by specific template ID
// 
//   // Recipient and sender filtering
//   recipientEmail: z.email().optional(), // Filter by specific recipient email
//   senderEmail: z.email().optional(), // Filter by specific sender email
// 
//   // User and lead association filtering
//   userId: z.uuid().optional(), // Filter by specific user ID
//   leadId: leadId.optional(), // Filter by specific lead ID
// 
//   // Date range filtering for specific events
//   sentAfter: dateSchema.optional(),
//   sentBefore: dateSchema.optional(),
//   openedAfter: dateSchema.optional(),
//   openedBefore: dateSchema.optional(),
//   clickedAfter: dateSchema.optional(),
//   clickedBefore: dateSchema.optional(),
// 
//   // Error filtering
//   hasSpecificError: z.string().optional(), // Filter by specific error message
//   errorType: z.string().optional(), // Filter by error type
// 
//   // Retry filtering
//   minRetryCount: z.number().int().min(0).optional(),
//   maxRetryCount: z.number().int().min(0).optional(),
// 
//   // Metadata filtering
//   hasMetadata: z.boolean().optional(),
//   metadataKey: z.string().optional(),
//   metadataValue: z.string().optional(),
// 
//   // Sorting options
//   sortBy: z.string().default(EmailSortField.CREATED_AT),
//   sortOrder: z.string().default(SortOrder.DESC),
// });
// 
// export type EmailStatsRequestType = z.infer<typeof emailStatsRequestSchema>;
// 
// /**
//  * Email Stats Response Schema with Historical Data
//  * Comprehensive response including all email metrics with historical data
//  */
// const emailStatsResponseSchema = z.object({
//   // Current period email metrics
//   totalEmails: z.number(),
//   sentEmails: z.number(),
//   deliveredEmails: z.number(),
//   openedEmails: z.number(),
//   clickedEmails: z.number(),
//   bouncedEmails: z.number(),
//   failedEmails: z.number(),
//   draftEmails: z.number(),
// 
//   // Engagement rates
//   deliveryRate: z.number(),
//   openRate: z.number(),
//   clickRate: z.number(),
//   bounceRate: z.number(),
//   failureRate: z.number(),
// 
//   // Provider metrics
//   emailsByProvider: z.record(z.string(), z.number()),
//   emailsByTemplate: z.record(z.string(), z.number()),
//   emailsByStatus: z.record(z.string(), z.number()),
//   emailsByType: z.record(z.string(), z.number()),
// 
//   // User association metrics
//   emailsWithUserId: z.number(),
//   emailsWithoutUserId: z.number(),
//   emailsWithLeadId: z.number(),
//   emailsWithoutLeadId: z.number(),
// 
//   // Error metrics
//   emailsWithErrors: z.number(),
//   emailsWithoutErrors: z.number(),
//   averageRetryCount: z.number(),
//   maxRetryCount: z.number(),
// 
//   // Performance metrics
//   averageProcessingTime: z.number(),
//   averageDeliveryTime: z.number(),
// 
//   // Historical data for every metric
//   historicalData: z.object({
//     totalEmails: historicalDataSeriesSchema,
//     sentEmails: historicalDataSeriesSchema,
//     deliveredEmails: historicalDataSeriesSchema,
//     openedEmails: historicalDataSeriesSchema,
//     clickedEmails: historicalDataSeriesSchema,
//     bouncedEmails: historicalDataSeriesSchema,
//     failedEmails: historicalDataSeriesSchema,
// 
//     deliveryRate: historicalDataSeriesSchema,
//     openRate: historicalDataSeriesSchema,
//     clickRate: historicalDataSeriesSchema,
//     bounceRate: historicalDataSeriesSchema,
//     failureRate: historicalDataSeriesSchema,
//     emailsWithErrors: historicalDataSeriesSchema,
//     averageRetryCount: historicalDataSeriesSchema,
//     averageProcessingTime: historicalDataSeriesSchema,
//     averageDeliveryTime: historicalDataSeriesSchema,
//   }),
// 
//   // Grouped statistics for all categorical fields
//   groupedStats: z.object({
//     byStatus: z.array(
//       z.object({
//         status: z.string(),
//         count: z.number(),
//         percentage: z.number(),
//         historicalData: historicalDataSeriesSchema,
//       }),
//     ),
//     byType: z.array(
//       z.object({
//         type: z.string(),
//         count: z.number(),
//         percentage: z.number(),
//         historicalData: historicalDataSeriesSchema,
//       }),
//     ),
//     byProvider: z.array(
//       z.object({
//         provider: z.string(),
//         count: z.number(),
//         percentage: z.number(),
//         deliveryRate: z.number(),
//         openRate: z.number(),
//         clickRate: z.number(),
//         historicalData: historicalDataSeriesSchema,
//       }),
//     ),
//     byTemplate: z.array(
//       z.object({
//         templateName: z.string(),
//         templateId: z.string(),
//         count: z.number(),
//         percentage: z.number(),
//         openRate: z.number(),
//         clickRate: z.number(),
//         historicalData: historicalDataSeriesSchema,
//       }),
//     ),
//     byEngagement: z.array(
//       z.object({
//         engagementLevel: z.string(),
//         count: z.number(),
//         percentage: z.number(),
//         historicalData: historicalDataSeriesSchema,
//       }),
//     ),
//     byRetryCount: z.array(
//       z.object({
//         retryRange: z.string(), // 0, 1-2, 3-5, 6+
//         count: z.number(),
//         percentage: z.number(),
//         historicalData: historicalDataSeriesSchema,
//       }),
//     ),
//     byUserAssociation: z.array(
//       z.object({
//         associationType: z.string(), // with_user, with_lead, standalone
//         count: z.number(),
//         percentage: z.number(),
//         historicalData: historicalDataSeriesSchema,
//       }),
//     ),
//   }),
// 
//   // Metadata
//   generatedAt: dateSchema,
//   dataRange: z.object({
//     from: dateSchema,
//     to: dateSchema,
//   }),
// 
//   // Recent activity
//   recentActivity: z.array(
//     z.object({
//       type: z.string(),
//       id: z.string(),
//       recipientEmail: z.string(),
//       templateName: z.string().optional(),
//       timestamp: dateSchema,
//       details: z.record(z.unknown()),
//     }),
//   ),
// 
//   // Top performers
//   topPerformingTemplates: z.array(
//     z.object({
//       templateName: z.string(),
//       templateId: z.string(),
//       emailsSent: z.number(),
//       openRate: z.number(),
//       clickRate: z.number(),
//       deliveryRate: z.number(),
//     }),
//   ),
//   topPerformingProviders: z.array(
//     z.object({
//       provider: z.string(),
//       emailsSent: z.number(),
//       deliveryRate: z.number(),
//       openRate: z.number(),
//       clickRate: z.number(),
//       reliability: z.number(),
//     }),
//   ),
// });

/**
 * Get Email Stats Endpoint (GET)
 * Retrieves comprehensive email statistics as historical charts only
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "emails", "messages", "stats"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.emails.messages.stats.get.title",
  description: "app.api.v1.core.emails.messages.stats.get.description",
  category: "app.api.v1.core.emails.category",
  tags: [
    "app.api.v1.core.emails.tags.stats",
    "app.api.v1.core.emails.tags.analytics",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.messages.stats.get.form.title",
      description: "app.api.v1.core.emails.messages.stats.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "urlParams", response: true },
    {
      // === QUERY PARAMETERS ===
      status: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.messages.stats.get.status.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.status.description",
          layout: { columns: 3 },
          options: EmailStatusFilterOptions,
        },
        z.array(z.string()).default([EmailStatusFilter.ALL]),
      ),
      type: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.messages.stats.get.type.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.type.description",
          layout: { columns: 3 },
          options: EmailTypeFilterOptions,
        },
        z.array(z.string()).default([EmailTypeFilter.ALL]),
      ),
      search: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.emails.messages.stats.get.search.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.search.description",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      stats: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.emails.messages.stats.get.response.title",
          description:
            "app.api.v1.core.emails.messages.stats.get.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          totalEmails: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.stats.get.response.totalEmails",
            },
            z.number(),
          ),
          sentEmails: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.stats.get.response.sentEmails",
            },
            z.number(),
          ),
          deliveredEmails: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.stats.get.response.deliveredEmails",
            },
            z.number(),
          ),
          openedEmails: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.stats.get.response.openedEmails",
            },
            z.number(),
          ),
          clickedEmails: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.stats.get.response.clickedEmails",
            },
            z.number(),
          ),
          bouncedEmails: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.stats.get.response.bouncedEmails",
            },
            z.number(),
          ),
          failedEmails: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.stats.get.response.failedEmails",
            },
            z.number(),
          ),
          openRate: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.stats.get.response.openRate",
            },
            z.number(),
          ),
          clickRate: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.stats.get.response.clickRate",
            },
            z.number(),
          ),
          deliveryRate: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.stats.get.response.deliveryRate",
            },
            z.number(),
          ),
        },
      ),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.emails.messages.stats.get.errors.validation.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.emails.messages.stats.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.emails.messages.stats.get.errors.server.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.emails.messages.stats.get.errors.unknown.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.emails.messages.stats.get.errors.network.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.emails.messages.stats.get.errors.forbidden.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.emails.messages.stats.get.errors.notFound.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.emails.messages.stats.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.emails.messages.stats.get.errors.conflict.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.emails.messages.stats.get.success.title",
    description:
      "app.api.v1.core.emails.messages.stats.get.success.description",
  },
  examples: {
    requests: {
      default: {
        status: [EmailStatusFilter.ALL],
        type: [EmailTypeFilter.ALL],
        search: "",
      },
      filtered: {
        status: [EmailStatus.DELIVERED],
        type: [EmailType.MARKETING],
        search: "welcome",
      },
    },
    responses: {
      default: {
        // Current period email metrics
        totalEmails: 1250,
        sentEmails: 1200,
        deliveredEmails: 1155,
        openedEmails: 720,
        clickedEmails: 180,
        bouncedEmails: 45,
        failedEmails: 50,

        draftEmails: 12,

        // Engagement rates
        deliveryRate: 0.9625,
        openRate: 0.6,
        clickRate: 0.15,
        bounceRate: 0.0375,
        failureRate: 0.04,

        // Provider metrics
        emailsByProvider: {
          resend: 850,
          sendgrid: 300,
          mailgun: 100,
        },
        emailsByTemplate: {
          "welcome-email": 450,
          newsletter: 320,
          "password-reset": 280,
          notification: 200,
        },
        emailsByStatus: {
          sent: 1200,
          delivered: 1155,
          opened: 720,
          clicked: 180,
          bounced: 45,
          failed: 50,
        },
        emailsByType: {
          transactional: 850,
          marketing: 400,
        },

        // User association metrics
        emailsWithUserId: 950,
        emailsWithoutUserId: 300,
        emailsWithLeadId: 800,
        emailsWithoutLeadId: 450,

        // Error metrics
        emailsWithErrors: 50,
        emailsWithoutErrors: 1200,
        averageRetryCount: 0.8,
        maxRetryCount: 3,

        // Performance metrics
        averageProcessingTime: 2500,
        averageDeliveryTime: 8500,

        // Historical data for every metric (last 30 days)
        historicalData: {
          totalEmails: {
            name: "emails.admin.stats.metrics.total_emails",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 45 },
              { date: "2024-01-02T00:00:00.000Z", value: 52 },
              { date: "2024-01-03T00:00:00.000Z", value: 48 },
              { date: "2024-01-04T00:00:00.000Z", value: 61 },
              { date: "2024-01-05T00:00:00.000Z", value: 55 },
              { date: "2024-01-06T00:00:00.000Z", value: 58 },
              { date: "2024-01-07T00:00:00.000Z", value: 62 },
            ],
          },
          sentEmails: {
            name: "emails.admin.stats.metrics.sent_emails",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 42 },
              { date: "2024-01-02T00:00:00.000Z", value: 48 },
              { date: "2024-01-03T00:00:00.000Z", value: 45 },
              { date: "2024-01-04T00:00:00.000Z", value: 58 },
              { date: "2024-01-05T00:00:00.000Z", value: 52 },
              { date: "2024-01-06T00:00:00.000Z", value: 55 },
              { date: "2024-01-07T00:00:00.000Z", value: 60 },
            ],
          },
          deliveredEmails: {
            name: "emails.admin.stats.metrics.delivered_emails",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 40 },
              { date: "2024-01-02T00:00:00.000Z", value: 46 },
              { date: "2024-01-03T00:00:00.000Z", value: 43 },
              { date: "2024-01-04T00:00:00.000Z", value: 56 },
              { date: "2024-01-05T00:00:00.000Z", value: 50 },
              { date: "2024-01-06T00:00:00.000Z", value: 53 },
              { date: "2024-01-07T00:00:00.000Z", value: 58 },
            ],
          },
          openedEmails: {
            name: "emails.admin.stats.metrics.opened_emails",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 25 },
              { date: "2024-01-02T00:00:00.000Z", value: 29 },
              { date: "2024-01-03T00:00:00.000Z", value: 27 },
              { date: "2024-01-04T00:00:00.000Z", value: 35 },
              { date: "2024-01-05T00:00:00.000Z", value: 31 },
              { date: "2024-01-06T00:00:00.000Z", value: 33 },
              { date: "2024-01-07T00:00:00.000Z", value: 36 },
            ],
          },
          clickedEmails: {
            name: "emails.admin.stats.metrics.clicked_emails",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 6 },
              { date: "2024-01-02T00:00:00.000Z", value: 7 },
              { date: "2024-01-03T00:00:00.000Z", value: 7 },
              { date: "2024-01-04T00:00:00.000Z", value: 9 },
              { date: "2024-01-05T00:00:00.000Z", value: 8 },
              { date: "2024-01-06T00:00:00.000Z", value: 8 },
              { date: "2024-01-07T00:00:00.000Z", value: 9 },
            ],
          },
          bouncedEmails: {
            name: "emails.admin.stats.metrics.bounced_emails",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 2 },
              { date: "2024-01-02T00:00:00.000Z", value: 1 },
              { date: "2024-01-03T00:00:00.000Z", value: 3 },
              { date: "2024-01-04T00:00:00.000Z", value: 1 },
              { date: "2024-01-05T00:00:00.000Z", value: 2 },
              { date: "2024-01-06T00:00:00.000Z", value: 2 },
              { date: "2024-01-07T00:00:00.000Z", value: 2 },
            ],
          },
          failedEmails: {
            name: "emails.admin.stats.metrics.failed_emails",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 3 },
              { date: "2024-01-02T00:00:00.000Z", value: 4 },
              { date: "2024-01-03T00:00:00.000Z", value: 2 },
              { date: "2024-01-04T00:00:00.000Z", value: 3 },
              { date: "2024-01-05T00:00:00.000Z", value: 3 },
              { date: "2024-01-06T00:00:00.000Z", value: 3 },
              { date: "2024-01-07T00:00:00.000Z", value: 2 },
            ],
          },

          deliveryRate: {
            name: "emails.admin.stats.metrics.delivery_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.952 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.958 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.956 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.966 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.962 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.964 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.967 },
            ],
          },
          openRate: {
            name: "emails.admin.stats.metrics.open_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.625 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.63 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.628 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.625 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.62 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.623 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.621 },
            ],
          },
          clickRate: {
            name: "emails.admin.stats.metrics.click_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.15 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.152 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.163 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.161 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.16 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.152 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.155 },
            ],
          },
          bounceRate: {
            name: "emails.admin.stats.metrics.bounce_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.048 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.021 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.067 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.017 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.038 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.036 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.033 },
            ],
          },
          failureRate: {
            name: "emails.admin.stats.metrics.failure_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.071 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.083 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.044 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.052 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.058 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.055 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.033 },
            ],
          },
          emailsWithErrors: {
            name: "emails.admin.stats.metrics.emails_with_errors",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 3 },
              { date: "2024-01-02T00:00:00.000Z", value: 4 },
              { date: "2024-01-03T00:00:00.000Z", value: 2 },
              { date: "2024-01-04T00:00:00.000Z", value: 3 },
              { date: "2024-01-05T00:00:00.000Z", value: 3 },
              { date: "2024-01-06T00:00:00.000Z", value: 3 },
              { date: "2024-01-07T00:00:00.000Z", value: 2 },
            ],
          },
          averageRetryCount: {
            name: "emails.admin.stats.metrics.average_retry_count",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.7 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.8 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.4 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.6 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.6 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.6 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.4 },
            ],
          },
          averageProcessingTime: {
            name: "emails.admin.stats.metrics.average_processing_time",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 2400 },
              { date: "2024-01-02T00:00:00.000Z", value: 2600 },
              { date: "2024-01-03T00:00:00.000Z", value: 2300 },
              { date: "2024-01-04T00:00:00.000Z", value: 2700 },
              { date: "2024-01-05T00:00:00.000Z", value: 2500 },
              { date: "2024-01-06T00:00:00.000Z", value: 2550 },
              { date: "2024-01-07T00:00:00.000Z", value: 2500 },
            ],
          },
          averageDeliveryTime: {
            name: "emails.admin.stats.metrics.average_delivery_time",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 8200 },
              { date: "2024-01-02T00:00:00.000Z", value: 8800 },
              { date: "2024-01-03T00:00:00.000Z", value: 8100 },
              { date: "2024-01-04T00:00:00.000Z", value: 9200 },
              { date: "2024-01-05T00:00:00.000Z", value: 8500 },
              { date: "2024-01-06T00:00:00.000Z", value: 8600 },
              { date: "2024-01-07T00:00:00.000Z", value: 8500 },
            ],
          },
        },

        // Grouped statistics for all categorical fields
        groupedStats: {
          byStatus: [
            {
              status: EmailStatus.SENT,
              count: 1200,
              percentage: 0.96,
              historicalData: {
                name: "emails.admin.stats.status.sent",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 42 },
                  { date: "2024-01-07T00:00:00.000Z", value: 60 },
                ],
              },
            },
            {
              status: EmailStatus.DELIVERED,
              count: 1155,
              percentage: 0.924,
              historicalData: {
                name: "emails.admin.stats.status.delivered",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 40 },
                  { date: "2024-01-07T00:00:00.000Z", value: 58 },
                ],
              },
            },
            {
              status: EmailStatus.OPENED,
              count: 720,
              percentage: 0.576,
              historicalData: {
                name: "emails.admin.stats.status.opened",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 25 },
                  { date: "2024-01-07T00:00:00.000Z", value: 36 },
                ],
              },
            },
          ],
          byType: [
            {
              type: EmailType.TRANSACTIONAL,
              count: 850,
              percentage: 0.68,
              historicalData: {
                name: "emails.admin.stats.type.transactional",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 30 },
                  { date: "2024-01-07T00:00:00.000Z", value: 42 },
                ],
              },
            },
            {
              type: EmailType.MARKETING,
              count: 400,
              percentage: 0.32,
              historicalData: {
                name: "emails.admin.stats.type.marketing",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 15 },
                  { date: "2024-01-07T00:00:00.000Z", value: 20 },
                ],
              },
            },
          ],
          byProvider: [
            {
              provider: EmailProvider.RESEND,
              count: 850,
              percentage: 0.68,
              deliveryRate: 0.97,
              openRate: 0.62,
              clickRate: 0.16,
              historicalData: {
                name: "emails.admin.stats.grouped.by_status",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 30 },
                  { date: "2024-01-07T00:00:00.000Z", value: 42 },
                ],
              },
            },
            {
              provider: EmailProvider.SENDGRID,
              count: 300,
              percentage: 0.24,
              deliveryRate: 0.95,
              openRate: 0.58,
              clickRate: 0.14,
              historicalData: {
                name: "emails.admin.stats.grouped.by_status",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 10 },
                  { date: "2024-01-07T00:00:00.000Z", value: 15 },
                ],
              },
            },
          ],
          byTemplate: [
            {
              templateName: "welcome-email",
              templateId: "550e8400-e29b-41d4-a716-446655440001",
              count: 450,
              percentage: 0.36,
              openRate: 0.72,
              clickRate: 0.18,
              historicalData: {
                name: "emails.admin.stats.grouped.by_type",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 15 },
                  { date: "2024-01-07T00:00:00.000Z", value: 22 },
                ],
              },
            },
            {
              templateName: "newsletter",
              templateId: "550e8400-e29b-41d4-a716-446655440002",
              count: 320,
              percentage: 0.256,
              openRate: 0.65,
              clickRate: 0.15,
              historicalData: {
                name: "emails.admin.stats.grouped.by_type",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 12 },
                  { date: "2024-01-07T00:00:00.000Z", value: 16 },
                ],
              },
            },
          ],
          byEngagement: [
            {
              engagementLevel: EngagementLevel.HIGH,
              count: 180,
              percentage: 0.144,
              historicalData: {
                name: "emails.admin.stats.grouped.by_status",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 6 },
                  { date: "2024-01-07T00:00:00.000Z", value: 9 },
                ],
              },
            },
            {
              engagementLevel: EngagementLevel.MEDIUM,
              count: 540,
              percentage: 0.432,
              historicalData: {
                name: "emails.admin.stats.grouped.by_status",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 19 },
                  { date: "2024-01-07T00:00:00.000Z", value: 27 },
                ],
              },
            },
            {
              engagementLevel: EngagementLevel.LOW,
              count: 435,
              percentage: 0.348,
              historicalData: {
                name: "emails.admin.stats.grouped.by_status",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 15 },
                  { date: "2024-01-07T00:00:00.000Z", value: 22 },
                ],
              },
            },
            {
              engagementLevel: EngagementLevel.NONE,
              count: 95,
              percentage: 0.076,
              historicalData: {
                name: "emails.admin.stats.grouped.by_status",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 5 },
                  { date: "2024-01-07T00:00:00.000Z", value: 4 },
                ],
              },
            },
          ],
          byRetryCount: [
            {
              retryRange: RetryRange.NO_RETRIES,
              count: 1200,
              percentage: 0.96,
              historicalData: {
                name: "emails.admin.stats.grouped.by_type",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 42 },
                  { date: "2024-01-07T00:00:00.000Z", value: 60 },
                ],
              },
            },
            {
              retryRange: RetryRange.ONE_TO_TWO,
              count: 45,
              percentage: 0.036,
              historicalData: {
                name: "emails.admin.stats.grouped.by_type",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 2 },
                  { date: "2024-01-07T00:00:00.000Z", value: 2 },
                ],
              },
            },
            {
              retryRange: RetryRange.THREE_TO_FIVE,
              count: 5,
              percentage: 0.004,
              historicalData: {
                name: "emails.admin.stats.grouped.by_type",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 1 },
                  { date: "2024-01-07T00:00:00.000Z", value: 0 },
                ],
              },
            },
          ],
          byUserAssociation: [
            {
              associationType: UserAssociation.WITH_USER,
              count: 950,
              percentage: 0.76,
              historicalData: {
                name: "emails.admin.stats.grouped.by_user_association",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 34 },
                  { date: "2024-01-07T00:00:00.000Z", value: 47 },
                ],
              },
            },
            {
              associationType: UserAssociation.WITH_LEAD,
              count: 800,
              percentage: 0.64,
              historicalData: {
                name: "emails.admin.stats.grouped.by_user_association",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 28 },
                  { date: "2024-01-07T00:00:00.000Z", value: 40 },
                ],
              },
            },
            {
              associationType: UserAssociation.STANDALONE,
              count: 300,
              percentage: 0.24,
              historicalData: {
                name: "emails.admin.stats.grouped.by_user_association",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 11 },
                  { date: "2024-01-07T00:00:00.000Z", value: 15 },
                ],
              },
            },
          ],
        },

        // Metadata
        generatedAt: "2024-01-07T12:00:00.000Z",
        dataRange: {
          from: "2023-12-08T00:00:00.000Z",
          to: "2024-01-07T23:59:59.999Z",
        },

        // Recent activity
        recentActivity: [
          {
            type: ActivityType.EMAIL_SENT,
            id: "550e8400-e29b-41d4-a716-446655440001",
            recipientEmail: "john.doe@example.com",
            templateName: "welcome-email",
            timestamp: "2024-01-07T11:30:00.000Z",
            details: {
              provider: EmailProvider.RESEND,
              status: EmailStatus.SENT,
              processingTime: 2500,
            },
          },
          {
            type: ActivityType.EMAIL_OPENED,
            id: "550e8400-e29b-41d4-a716-446655440002",
            recipientEmail: "jane.smith@example.com",
            templateName: "newsletter",
            timestamp: "2024-01-07T10:15:00.000Z",
            details: {
              provider: EmailProvider.RESEND,
              openedAt: "2024-01-07T10:15:00.000Z",
              userAgent: "Mozilla/5.0...",
            },
          },
          {
            type: ActivityType.EMAIL_CLICKED,
            id: "550e8400-e29b-41d4-a716-446655440003",
            recipientEmail: "mike.wilson@example.com",
            templateName: "welcome-email",
            timestamp: "2024-01-07T09:45:00.000Z",
            details: {
              provider: EmailProvider.RESEND,
              clickedUrl: "https://example.com/welcome",
              clickedAt: "2024-01-07T09:45:00.000Z",
            },
          },
        ],

        // Top performers
        topPerformingTemplates: [
          {
            templateName: "welcome-email",
            templateId: "550e8400-e29b-41d4-a716-446655440001",
            emailsSent: 450,
            openRate: 0.72,
            clickRate: 0.18,
            deliveryRate: 0.98,
          },
          {
            templateName: "newsletter",
            templateId: "550e8400-e29b-41d4-a716-446655440002",
            emailsSent: 320,
            openRate: 0.65,
            clickRate: 0.15,
            deliveryRate: 0.96,
          },
          {
            templateName: "password-reset",
            templateId: "550e8400-e29b-41d4-a716-446655440003",
            emailsSent: 280,
            openRate: 0.85,
            clickRate: 0.45,
            deliveryRate: 0.99,
          },
        ],
        topPerformingProviders: [
          {
            provider: EmailProvider.RESEND,
            emailsSent: 850,
            deliveryRate: 0.97,
            openRate: 0.62,
            clickRate: 0.16,
            reliability: 0.98,
          },
          {
            provider: EmailProvider.SENDGRID,
            emailsSent: 300,
            deliveryRate: 0.95,
            openRate: 0.58,
            clickRate: 0.14,
            reliability: 0.96,
          },
          {
            provider: EmailProvider.MAILGUN,
            emailsSent: 100,
            deliveryRate: 0.93,
            openRate: 0.55,
            clickRate: 0.12,
            reliability: 0.94,
          },
        ],
      },
    },
  },
});

// Extract types using the new enhanced system
export type EmailStatsGetRequestTypeInput = typeof GET.types.RequestInput;
export type EmailStatsGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type EmailStatsGetResponseTypeInput = typeof GET.types.ResponseInput;
export type EmailStatsGetResponseTypeOutput = typeof GET.types.ResponseOutput;

/**
 * Export definitions
 */
const emailStatsEndpoints = {
  GET,
};

export { GET };
export default emailStatsEndpoints;
