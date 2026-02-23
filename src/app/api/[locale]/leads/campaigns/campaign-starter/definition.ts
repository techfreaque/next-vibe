/**
 * Campaign Starter API Definition
 * POST endpoint to run the campaign starter (called by cron)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
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

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "campaigns", "campaign-starter"],
  title: "post.title",
  description: "post.description",
  category: "category",
  icon: "play",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    description: "post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      dryRun: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      leadsProcessed: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadsProcessed",
        schema: z.number(),
      }),

      leadsStarted: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadsStarted",
        schema: z.number(),
      }),

      leadsSkipped: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadsSkipped",
        schema: z.number(),
      }),

      executionTimeMs: scopedResponseField(scopedTranslation, {
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
