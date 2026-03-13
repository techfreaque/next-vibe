/**
 * Campaign Stats API Definition
 * GET endpoint for email campaign performance statistics
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
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

import {
  EmailJourneyVariantFilter,
  EmailJourneyVariantFilterOptions,
} from "../../enum";
import { scopedTranslation } from "./i18n";
import { CampaignStatsWidget } from "./widget";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "campaigns", "stats"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.leadsCampaigns",
  icon: "bar-chart-3",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: CampaignStatsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      journeyVariant: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.journeyVariant.label",
        description: "get.fields.journeyVariant.description",
        options: EmailJourneyVariantFilterOptions,
        columns: 6,
        schema: z.enum(EmailJourneyVariantFilter).optional(),
      }),

      // Top-level counts
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total",
        schema: z.number(),
      }),
      pending: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.pending",
        schema: z.number(),
      }),
      sent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.sent",
        schema: z.number(),
      }),
      delivered: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.delivered",
        schema: z.number(),
      }),
      opened: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.opened",
        schema: z.number(),
      }),
      clicked: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.clicked",
        schema: z.number(),
      }),
      failed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.failed",
        schema: z.number(),
      }),

      // Total leads & unique persons
      totalLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalLeads",
        schema: z.number(),
      }),
      linkedLeadsCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.linkedLeadsCount",
        schema: z.number(),
      }),
      uniquePersonsEstimate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.uniquePersonsEstimate",
        schema: z.number(),
      }),

      // Queue health
      pendingLeadsCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.pendingLeadsCount",
        schema: z.number(),
      }),
      emailsScheduledToday: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.emailsScheduledToday",
        schema: z.number(),
      }),

      // Derived rates (0–1 fractions)
      openRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.openRate",
        schema: z.number(),
      }),
      clickRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.clickRate",
        schema: z.number(),
      }),
      deliveryRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deliveryRate",
        schema: z.number(),
      }),
      failureRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.failureRate",
        schema: z.number(),
      }),

      // Breakdowns
      byStage: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.byStage",
        description: "get.response.byStage",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            stage: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.byStage",
              schema: z.string(),
            }),
            total: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.total",
              schema: z.number(),
            }),
            sent: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.sent",
              schema: z.number(),
            }),
            opened: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.opened",
              schema: z.number(),
            }),
            clicked: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.clicked",
              schema: z.number(),
            }),
            failed: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.failed",
              schema: z.number(),
            }),
          },
        }),
      }),

      byJourneyVariant: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.byJourneyVariant",
        description: "get.response.byJourneyVariant",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            variant: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.byJourneyVariant",
              schema: z.string(),
            }),
            total: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.total",
              schema: z.number(),
            }),
            sent: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.sent",
              schema: z.number(),
            }),
            openRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.openRate",
              schema: z.number(),
            }),
            clickRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.clickRate",
              schema: z.number(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    requests: { default: {} },
    responses: {
      default: {
        total: 0,
        pending: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        failed: 0,
        openRate: 0,
        clickRate: 0,
        deliveryRate: 0,
        failureRate: 0,
        totalLeads: 0,
        linkedLeadsCount: 0,
        uniquePersonsEstimate: 0,
        pendingLeadsCount: 0,
        emailsScheduledToday: 0,
        byStage: [],
        byJourneyVariant: [],
      },
    },
  },
});

export type CampaignStatsGetRequestOutput = typeof GET.types.RequestOutput;
export type CampaignStatsGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
