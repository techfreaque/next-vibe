/**
 * Subscription Dashboard API Endpoint Definition
 * Landing page with KPI counts for the current user's subscription data
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const SubscriptionDashboardWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.SubscriptionDashboardWidget,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["subscription", "dashboard"],
  aliases: ["subscription-dashboard"],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "crown",
  category: "subscriptions",
  subCategory: "Subscriptions",
  tags: ["get.title" as const],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

  fields: customWidgetObject({
    render: SubscriptionDashboardWidgetLazy,
    usage: { response: true } as const,
    children: {
      activeCount: responseField(scopedTranslation, {
        type: WidgetType.STAT,
        label: "get.response.activeCount" as const,
        icon: "check",
        variant: "success",
        format: "compact",
        schema: z.number().describe("Number of active subscriptions"),
      }),
      cancelingCount: responseField(scopedTranslation, {
        type: WidgetType.STAT,
        label: "get.response.cancelingCount" as const,
        icon: "clock",
        variant: "warning",
        format: "compact",
        schema: z
          .number()
          .describe("Subscriptions set to cancel at period end"),
      }),
      trialCount: responseField(scopedTranslation, {
        type: WidgetType.STAT,
        label: "get.response.trialCount" as const,
        icon: "activity",
        variant: "info",
        format: "compact",
        schema: z.number().describe("Subscriptions currently in trial"),
      }),
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.STAT,
        label: "get.response.totalCount" as const,
        icon: "bar-chart-2",
        variant: "default",
        format: "compact",
        schema: z.number().describe("Total subscriptions"),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    responses: {
      default: {
        activeCount: 1,
        cancelingCount: 0,
        trialCount: 0,
        totalCount: 1,
      },
    },
  },
});

// Extract types
export type SubscriptionDashboardRequestInput = typeof GET.types.RequestInput;
export type SubscriptionDashboardRequestOutput = typeof GET.types.RequestOutput;
export type SubscriptionDashboardResponseInput = typeof GET.types.ResponseInput;
export type SubscriptionDashboardResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
