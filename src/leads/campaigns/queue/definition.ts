/**
 * Campaign Queue API Definition
 * GET endpoint for listing leads currently active in email campaigns
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import {
  EmailCampaignStage,
  EmailCampaignStageFilter,
  EmailCampaignStageFilterOptions,
  EmailJourneyVariant,
  EmailJourneyVariantFilter,
  EmailJourneyVariantFilterOptions,
} from "next-vibe/identity/lead/enum";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  CampaignType,
  CampaignTypeFilterDB,
  CampaignTypeFilterOptions,
} from "../../../messenger/accounts/enum";
import { CAMPAIGN_QUEUE_ALIAS } from "./constants";
import { QueueDelivery, QueueDeliveryOptions } from "./enum";
import { scopedTranslation } from "./i18n";
const CampaignQueueWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CampaignQueueWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "campaigns", "queue"],
  aliases: [CAMPAIGN_QUEUE_ALIAS] as const,
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "newsletter",
  subCategory: "emailCampaignsQueue",
  icon: "list",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: CampaignQueueWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // Request fields
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.page.label",
        description: "get.fields.page.description",
        columns: 3,
        schema: z.number().int().min(1).default(1),
      }),

      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.pageSize.label",
        description: "get.fields.pageSize.description",
        columns: 3,
        schema: z.number().int().min(1).max(100).default(20),
      }),

      campaignType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.campaignType.label",
        description: "get.fields.campaignType.description",
        options: CampaignTypeFilterOptions,
        columns: 6,
        schema: z.enum(CampaignTypeFilterDB).optional(),
      }),
      delivery: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.delivery.label",
        description: "get.fields.delivery.description",
        placeholder: "get.fields.delivery.placeholder",
        options: QueueDeliveryOptions,
        columns: 4,
        schema: z.enum(QueueDelivery).optional(),
      }),
      journeyVariant: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.journeyVariant.label",
        description: "get.fields.journeyVariant.description",
        placeholder: "get.fields.journeyVariant.placeholder",
        options: EmailJourneyVariantFilterOptions,
        columns: 4,
        schema: z.enum(EmailJourneyVariantFilter).optional(),
      }),
      stage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.stage.label",
        description: "get.fields.stage.description",
        placeholder: "get.fields.stage.placeholder",
        options: EmailCampaignStageFilterOptions,
        columns: 4,
        schema: z.enum(EmailCampaignStageFilter).optional(),
      }),
      locale: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.locale.label",
        description: "get.fields.locale.description",
        placeholder: "get.fields.locale.placeholder",
        columns: 4,
        schema: z.string().trim().max(20).optional(),
      }),
      eventFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.fields.eventFrom.label",
        description: "get.fields.eventFrom.description",
        columns: 4,
        schema: dateSchema.optional(),
      }),
      eventTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.fields.eventTo.label",
        description: "get.fields.eventTo.description",
        columns: 4,
        schema: dateSchema.optional(),
      }),
      leadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.response.leadId",
        hidden: true,
        schema: z.uuid().optional(),
      }),

      // Response fields - named distinctly from request fields to avoid duplicate keys
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.total",
        schema: z.number(),
      }),

      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.page",
        schema: z.number(),
      }),

      pageSize: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.pageSize",
        schema: z.number(),
      }),

      items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.items",
        description: "get.response.items",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            leadId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.leadId",
              schema: z.uuid(),
            }),
            leadEmail: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.leadEmail",
              schema: z.string().nullable(),
            }),
            businessName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.businessName",
              schema: z.string(),
            }),
            campaignType: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.campaignType",
              schema: z.union([z.enum(CampaignType), z.literal("")]),
            }),
            journeyVariant: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.journeyVariant",
              schema: z.union([z.enum(EmailJourneyVariant), z.literal("")]),
            }),
            currentStage: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.currentStage",
              schema: z.union([z.enum(EmailCampaignStage), z.literal("")]),
            }),
            nextScheduledAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.nextScheduledAt",
              schema: z.string().nullable(),
            }),
            daysOverdue: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.daysOverdue",
              schema: z.number().nullable(),
            }),
            nextSubject: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.nextSubject",
              schema: z.string().nullable(),
            }),
            emailsSent: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.emailsSent",
              schema: z.number(),
            }),
            emailsOpened: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.emailsOpened",
              schema: z.number(),
            }),
            emailsClicked: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.emailsClicked",
              schema: z.number(),
            }),
            startedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.startedAt",
              schema: dateSchema.nullable(),
            }),
          },
        }),
      }),
    },
  }),

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 300,
    },
  },

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
    requests: {
      default: {
        page: 1,
        limit: 20,
      },
      empty: {
        page: 1,
        limit: 20,
        leadId: "550e8400-e29b-41d4-a716-446655440099",
      },
    },
    responses: {
      default: {
        totalCount: 1,
        currentPage: 1,
        pageSize: 20,
        items: [
          {
            leadId: "550e8400-e29b-41d4-a716-446655440000",
            leadEmail: "audit-lead@example.invalid",
            businessName: "Harbor Studio",
            campaignType: CampaignType.LEAD_CAMPAIGN,
            journeyVariant: EmailJourneyVariant.UNCENSORED_CONVERT,
            currentStage: EmailCampaignStage.FOLLOWUP_1,
            nextScheduledAt: "2024-01-18T10:00:00.000Z",
            daysOverdue: null,
            nextSubject: "Harbor Studio follow-up",
            emailsSent: 5,
            emailsOpened: 3,
            emailsClicked: 1,
            startedAt: new Date("2024-01-12T09:00:00Z"),
          },
        ],
      },
      empty: {
        totalCount: 0,
        currentPage: 1,
        pageSize: 20,
        items: [],
      },
    },
  },
});

export type CampaignQueueGetRequestOutput = typeof GET.types.RequestOutput;
export type CampaignQueueGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
