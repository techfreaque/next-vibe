/**
 * Yearly Credits - Definition
 * POST (daily task, admin): grant this month's credits to every live yearly
 * subscription. Idempotent per subscription and month.
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const YearlyCreditsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.YearlyCreditsWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["subscription", "yearly-credits"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "calendar",
  category: "subscriptions",
  subCategory: "Management",
  tags: ["tags.subscription", "tags.admin"],
  aliases: ["yearly-credits-grant"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: customWidgetObject({
    render: YearlyCreditsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),
      scanned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.scanned",
        schema: z.coerce.number(),
      }),
      granted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.granted",
        schema: z.coerce.number(),
      }),
      credits: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.credits",
        schema: z.coerce.number(),
      }),
    },
  }),

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
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    responses: {
      default: { scanned: 3, granted: 1, credits: 800 },
    },
  },
});

export type YearlyCreditsGrantResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
