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
  path: ["newsletter", "unsubscribe", "sync"],
  title: "app.api.newsletter.unsubscribe.sync.post.title",
  description: "app.api.newsletter.unsubscribe.sync.post.description",
  category: "app.api.system.category",
  icon: "refresh-cw",
  tags: ["app.api.newsletter.unsubscribe.sync.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.newsletter.unsubscribe.sync.post.container.title",
      description:
        "app.api.newsletter.unsubscribe.sync.post.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      batchSize: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.newsletter.unsubscribe.sync.post.fields.batchSize.label",
        description:
          "app.api.newsletter.unsubscribe.sync.post.fields.batchSize.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(1000).default(500),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.newsletter.unsubscribe.sync.post.fields.dryRun.label",
        description:
          "app.api.newsletter.unsubscribe.sync.post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      leadsProcessed: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.newsletter.unsubscribe.sync.post.response.leadsProcessed",
        schema: z.number(),
      }),

      leadsUpdated: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.newsletter.unsubscribe.sync.post.response.leadsUpdated",
        schema: z.number(),
      }),

      executionTimeMs: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.newsletter.unsubscribe.sync.post.response.executionTimeMs",
        schema: z.number(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.newsletter.unsubscribe.sync.post.errors.unauthorized.title",
      description:
        "app.api.newsletter.unsubscribe.sync.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.newsletter.unsubscribe.sync.post.errors.forbidden.title",
      description:
        "app.api.newsletter.unsubscribe.sync.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.newsletter.unsubscribe.sync.post.errors.server.title",
      description:
        "app.api.newsletter.unsubscribe.sync.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.newsletter.unsubscribe.sync.post.errors.unknown.title",
      description:
        "app.api.newsletter.unsubscribe.sync.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.newsletter.unsubscribe.sync.post.errors.validation.title",
      description:
        "app.api.newsletter.unsubscribe.sync.post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.newsletter.unsubscribe.sync.post.errors.unknown.title",
      description:
        "app.api.newsletter.unsubscribe.sync.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.newsletter.unsubscribe.sync.post.errors.unknown.title",
      description:
        "app.api.newsletter.unsubscribe.sync.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.newsletter.unsubscribe.sync.post.errors.unknown.title",
      description:
        "app.api.newsletter.unsubscribe.sync.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.newsletter.unsubscribe.sync.post.errors.unknown.title",
      description:
        "app.api.newsletter.unsubscribe.sync.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.newsletter.unsubscribe.sync.post.success.title",
    description: "app.api.newsletter.unsubscribe.sync.post.success.description",
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
