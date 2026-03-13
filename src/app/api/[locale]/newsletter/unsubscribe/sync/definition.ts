/**
 * Newsletter Unsubscribe Sync API Definition
 * POST endpoint to sync lead statuses for newsletter unsubscribes (called by cron)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["newsletter", "unsubscribe", "sync"],
  title: "unsubscribe.sync.post.title",
  description: "unsubscribe.sync.post.description",
  category: "app.endpointCategories.leadsCampaigns",
  icon: "refresh-cw",
  tags: ["unsubscribe.sync.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "unsubscribe.sync.post.container.title",
    description: "unsubscribe.sync.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      batchSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "unsubscribe.sync.post.fields.batchSize.label",
        description: "unsubscribe.sync.post.fields.batchSize.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(1000).default(500),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "unsubscribe.sync.post.fields.dryRun.label",
        description: "unsubscribe.sync.post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      leadsProcessed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "unsubscribe.sync.post.response.leadsProcessed",
        schema: z.number(),
      }),

      leadsUpdated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "unsubscribe.sync.post.response.leadsUpdated",
        schema: z.number(),
      }),

      executionTimeMs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "unsubscribe.sync.post.response.executionTimeMs",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "unsubscribe.sync.post.errors.unauthorized.title",
      description: "unsubscribe.sync.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "unsubscribe.sync.post.errors.forbidden.title",
      description: "unsubscribe.sync.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "unsubscribe.sync.post.errors.server.title",
      description: "unsubscribe.sync.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "unsubscribe.sync.post.errors.unknown.title",
      description: "unsubscribe.sync.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "unsubscribe.sync.post.errors.validation.title",
      description: "unsubscribe.sync.post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "unsubscribe.sync.post.errors.unknown.title",
      description: "unsubscribe.sync.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "unsubscribe.sync.post.errors.unknown.title",
      description: "unsubscribe.sync.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "unsubscribe.sync.post.errors.unknown.title",
      description: "unsubscribe.sync.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "unsubscribe.sync.post.errors.unknown.title",
      description: "unsubscribe.sync.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "unsubscribe.sync.post.success.title",
    description: "unsubscribe.sync.post.success.description",
  },

  examples: {
    requests: { default: { batchSize: 500, dryRun: false } },
    responses: {
      default: {
        leadsProcessed: 0,
        leadsUpdated: 0,
        executionTimeMs: 0,
      },
    },
  },
});

export type NewsletterUnsubscribeSyncPostRequestOutput =
  typeof POST.types.RequestOutput;
export type NewsletterUnsubscribeSyncPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
