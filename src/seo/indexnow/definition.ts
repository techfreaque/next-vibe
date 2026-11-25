/**
 * IndexNow submit (POST, admin + hourly cron): pings the IndexNow API with
 * every sitemap URL that is new or whose lastmod changed since the last
 * successful submission. Submits only on the production instance.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { INDEXNOW_ALIAS } from "./constants";
import { IndexNowStatus, IndexNowStatusOptions } from "./enum";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["seo", "indexnow"],
  aliases: [INDEXNOW_ALIAS],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "devTools",
  subCategory: "tasksCron",
  icon: "search",
  tags: ["post.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    description: "post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.force.label",
        description: "post.fields.force.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        label: "post.response.status",
        enumOptions: IndexNowStatusOptions,
        schema: z.enum(IndexNowStatus),
      }),
      host: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.host",
        schema: z.string(),
      }),
      totalUrls: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.totalUrls",
        schema: z.number(),
      }),
      pendingUrls: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.pendingUrls",
        schema: z.number(),
      }),
      submittedUrls: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.submittedUrls",
        schema: z.number(),
      }),
      requests: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.requests",
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
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
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
    requests: { default: { force: false, dryRun: false } },
    responses: {
      default: {
        status: IndexNowStatus.SUBMITTED,
        host: "unbottled.ai",
        totalUrls: 3185,
        pendingUrls: 14,
        submittedUrls: 14,
        requests: 1,
      },
    },
  },
});

export type IndexNowPostRequestOutput = typeof POST.types.RequestOutput;
export type IndexNowPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
