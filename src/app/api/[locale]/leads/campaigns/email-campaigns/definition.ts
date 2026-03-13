/**
 * Email Campaigns API Definition
 * POST endpoint to run email campaigns processing (called by cron)
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
import { EmailCampaignsWidget } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "campaigns", "email-campaigns"],
  aliases: ["email-campaigns"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.leadsCampaigns",
  icon: "mail",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: EmailCampaignsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      batchSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.batchSize.label",
        description: "post.fields.batchSize.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(100).default(100),
      }),

      maxEmailsPerRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.maxEmailsPerRun.label",
        description: "post.fields.maxEmailsPerRun.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(1000).default(500),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      emailsScheduled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.emailsScheduled",
        schema: z.number(),
      }),

      emailsSent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.emailsSent",
        schema: z.number(),
      }),

      emailsFailed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.emailsFailed",
        schema: z.number(),
      }),

      leadsProcessed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadsProcessed",
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
