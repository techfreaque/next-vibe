/**
 * Campaign Starter API Definition
 * POST endpoint to run the campaign starter (called by cron)
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
  path: ["leads", "campaigns", "campaign-starter"],
  title: "app.api.leads.campaigns.campaignStarter.post.title",
  description: "app.api.leads.campaigns.campaignStarter.post.description",
  category: "app.api.leads.category",
  icon: "play",
  tags: ["app.api.leads.campaigns.campaignStarter.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.leads.campaigns.campaignStarter.post.container.title",
      description:
        "app.api.leads.campaigns.campaignStarter.post.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.leads.campaigns.campaignStarter.post.fields.dryRun.label",
        description:
          "app.api.leads.campaigns.campaignStarter.post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      leadsProcessed: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.leads.campaigns.campaignStarter.post.response.leadsProcessed",
        schema: z.number(),
      }),

      leadsStarted: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.leads.campaigns.campaignStarter.post.response.leadsStarted",
        schema: z.number(),
      }),

      leadsSkipped: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.leads.campaigns.campaignStarter.post.response.leadsSkipped",
        schema: z.number(),
      }),

      executionTimeMs: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.leads.campaigns.campaignStarter.post.response.executionTimeMs",
        schema: z.number(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.leads.campaigns.campaignStarter.post.errors.unauthorized.title",
      description:
        "app.api.leads.campaigns.campaignStarter.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.leads.campaigns.campaignStarter.post.errors.forbidden.title",
      description:
        "app.api.leads.campaigns.campaignStarter.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.campaigns.campaignStarter.post.errors.server.title",
      description:
        "app.api.leads.campaigns.campaignStarter.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.leads.campaigns.campaignStarter.post.errors.unknown.title",
      description:
        "app.api.leads.campaigns.campaignStarter.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.leads.campaigns.campaignStarter.post.errors.validation.title",
      description:
        "app.api.leads.campaigns.campaignStarter.post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.leads.campaigns.campaignStarter.post.errors.unknown.title",
      description:
        "app.api.leads.campaigns.campaignStarter.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.leads.campaigns.campaignStarter.post.errors.unknown.title",
      description:
        "app.api.leads.campaigns.campaignStarter.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.leads.campaigns.campaignStarter.post.errors.unknown.title",
      description:
        "app.api.leads.campaigns.campaignStarter.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.leads.campaigns.campaignStarter.post.errors.unknown.title",
      description:
        "app.api.leads.campaigns.campaignStarter.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.leads.campaigns.campaignStarter.post.success.title",
    description:
      "app.api.leads.campaigns.campaignStarter.post.success.description",
  },

  examples: {
    requests: { default: { dryRun: false } },
    responses: {
      default: {
        leadsProcessed: 0,
        leadsStarted: 0,
        leadsSkipped: 0,
        executionTimeMs: 0,
      },
    },
  },
});

export type CampaignStarterPostRequestOutput = typeof POST.types.RequestOutput;
export type CampaignStarterPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
