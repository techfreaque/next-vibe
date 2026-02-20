/**
 * Email Campaigns API Definition
 * POST endpoint to run email campaigns processing (called by cron)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["leads", "campaigns", "email-campaigns"],
  title: "app.api.leads.campaigns.emailCampaigns.post.title",
  description: "app.api.leads.campaigns.emailCampaigns.post.description",
  category: "app.api.leads.campaigns.category",
  icon: "mail",
  tags: ["app.api.leads.campaigns.emailCampaigns.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.leads.campaigns.emailCampaigns.post.container.title",
      description:
        "app.api.leads.campaigns.emailCampaigns.post.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      batchSize: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.leads.campaigns.emailCampaigns.post.fields.batchSize.label",
        description:
          "app.api.leads.campaigns.emailCampaigns.post.fields.batchSize.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(100).default(100),
      }),

      maxEmailsPerRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.leads.campaigns.emailCampaigns.post.fields.maxEmailsPerRun.label",
        description:
          "app.api.leads.campaigns.emailCampaigns.post.fields.maxEmailsPerRun.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(1000).default(500),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.leads.campaigns.emailCampaigns.post.fields.dryRun.label",
        description:
          "app.api.leads.campaigns.emailCampaigns.post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      emailsScheduled: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.leads.campaigns.emailCampaigns.post.response.emailsScheduled",
        schema: z.number(),
      }),

      emailsSent: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.leads.campaigns.emailCampaigns.post.response.emailsSent",
        schema: z.number(),
      }),

      emailsFailed: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.leads.campaigns.emailCampaigns.post.response.emailsFailed",
        schema: z.number(),
      }),

      leadsProcessed: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.leads.campaigns.emailCampaigns.post.response.leadsProcessed",
        schema: z.number(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.leads.campaigns.emailCampaigns.post.errors.unauthorized.title",
      description:
        "app.api.leads.campaigns.emailCampaigns.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.leads.campaigns.emailCampaigns.post.errors.forbidden.title",
      description:
        "app.api.leads.campaigns.emailCampaigns.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.campaigns.emailCampaigns.post.errors.server.title",
      description:
        "app.api.leads.campaigns.emailCampaigns.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.campaigns.emailCampaigns.post.errors.unknown.title",
      description:
        "app.api.leads.campaigns.emailCampaigns.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.leads.campaigns.emailCampaigns.post.errors.validation.title",
      description:
        "app.api.leads.campaigns.emailCampaigns.post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.campaigns.emailCampaigns.post.errors.unknown.title",
      description:
        "app.api.leads.campaigns.emailCampaigns.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.campaigns.emailCampaigns.post.errors.unknown.title",
      description:
        "app.api.leads.campaigns.emailCampaigns.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.campaigns.emailCampaigns.post.errors.unknown.title",
      description:
        "app.api.leads.campaigns.emailCampaigns.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.leads.campaigns.emailCampaigns.post.errors.unknown.title",
      description:
        "app.api.leads.campaigns.emailCampaigns.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.leads.campaigns.emailCampaigns.post.success.title",
    description:
      "app.api.leads.campaigns.emailCampaigns.post.success.description",
  },

  examples: {
    requests: {
      default: {
        batchSize: 100,
        maxEmailsPerRun: 500,
        dryRun: false,
      },
    },
    responses: {
      default: {
        emailsScheduled: 0,
        emailsSent: 0,
        emailsFailed: 0,
        leadsProcessed: 0,
      },
    },
  },
});

export type EmailCampaignsPostRequestOutput = typeof POST.types.RequestOutput;
export type EmailCampaignsPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
