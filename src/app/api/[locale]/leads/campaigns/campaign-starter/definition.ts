/**
 * Campaign Starter API Definition
 * POST endpoint to run the campaign starter (called by cron)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { CampaignStarterWidget } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "campaigns", "campaign-starter"],
  aliases: ["campaign-starter"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.leadsCampaigns",
  icon: "play",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: CampaignStarterWidget,
    usage: { request: "data", response: true } as const,
    children: {
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),
      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.force.label",
        description: "post.fields.force.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      leadsProcessed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadsProcessed",
        schema: z.number(),
      }),

      leadsStarted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadsStarted",
        schema: z.number(),
      }),

      leadsSkipped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadsSkipped",
        schema: z.number(),
      }),

      executionTimeMs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.executionTimeMs",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: { default: { dryRun: false, force: false } },
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
