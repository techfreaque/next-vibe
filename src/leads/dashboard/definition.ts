/**
 * Leads Dashboard Endpoint
 * GET — KPI counts, status breakdown, recent leads, and conversion metrics
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const LeadsDashboardWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.LeadsDashboardWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "dashboard"],
  aliases: ["leads-dashboard"],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  category: "leads" as const,
  subCategory: "Management" as const,
  icon: "users" as const,
  tags: ["tags.leads" as const, "tags.dashboard" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: LeadsDashboardWidgetLazy,
    children: {
      activeLeadsCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.activeLeadsCount" as const,
        schema: z.number(),
      }),
      newThisWeekCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.newThisWeekCount" as const,
        schema: z.number(),
      }),
      runningCampaignsCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.runningCampaignsCount" as const,
        schema: z.number(),
      }),
      convertedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.convertedCount" as const,
        schema: z.number(),
      }),
      totalLeadsCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.totalLeadsCount" as const,
        schema: z.number(),
      }),
      conversionRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.conversionRate" as const,
        schema: z.number(),
      }),
      statusBreakdown: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.statusBreakdown" as const,
        schema: z.record(z.string(), z.number()),
      }),
      recentLeads: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.recentLeads" as const,
        child: responseField(scopedTranslation, {
          type: WidgetType.TEXT,
          label: "get.response.recentLeads.id" as const,
          schema: z.object({
            id: z.string().uuid(),
            businessName: z.string(),
            email: z.string(),
            status: z.string(),
            source: z.string(),
            createdAt: z.string(),
          }),
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
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
        activeLeadsCount: 142,
        newThisWeekCount: 18,
        runningCampaignsCount: 3,
        convertedCount: 27,
        totalLeadsCount: 215,
        conversionRate: 12.6,
        statusBreakdown: {},
        recentLeads: [
          {
            id: "00000000-0000-0000-0000-000000000001",
            businessName: "Acme Corp",
            email: "hello@acme.com",
            status: "new",
            source: "website",
            createdAt: "2026-05-30T14:00:00.000Z",
          },
        ],
      },
      empty: {
        activeLeadsCount: 0,
        newThisWeekCount: 0,
        runningCampaignsCount: 0,
        convertedCount: 0,
        totalLeadsCount: 0,
        conversionRate: 0,
        statusBreakdown: {},
        recentLeads: [],
      },
    },
  },
});

export type LeadsDashboardResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
