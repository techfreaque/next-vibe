/**
 * Campaign Queue API Definition
 * GET endpoint for listing leads currently active in email campaigns
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
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

import {
  CampaignTypeFilterDB,
  CampaignTypeFilterOptions,
} from "../../../emails/smtp-client/enum";
import { scopedTranslation } from "./i18n";
import { CampaignQueueWidget } from "./widget";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "campaigns", "queue"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.leads",
  icon: "list",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: CampaignQueueWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // Request fields
      page: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.page.label",
        description: "get.fields.page.description",
        columns: 3,
        schema: z.number().int().min(1).default(1),
      }),

      limit: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.pageSize.label",
        description: "get.fields.pageSize.description",
        columns: 3,
        schema: z.number().int().min(1).max(100).default(20),
      }),

      campaignType: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.campaignType.label",
        description: "get.fields.campaignType.description",
        options: CampaignTypeFilterOptions,
        columns: 6,
        schema: z.enum(CampaignTypeFilterDB).optional(),
      }),

      // Response fields — named distinctly from request fields to avoid duplicate keys
      totalCount: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total",
        schema: z.number(),
      }),

      currentPage: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.page",
        schema: z.number(),
      }),

      pageSize: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.pageSize",
        schema: z.number(),
      }),

      items: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.items",
        description: "get.response.items",
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            leadId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.leadId",
              schema: z.string(),
            }),
            leadEmail: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.leadEmail",
              schema: z.string().nullable(),
            }),
            businessName: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.businessName",
              schema: z.string(),
            }),
            campaignType: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignType",
              schema: z.string(),
            }),
            journeyVariant: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.journeyVariant",
              schema: z.string(),
            }),
            currentStage: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.currentStage",
              schema: z.string(),
            }),
            nextScheduledAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.nextScheduledAt",
              schema: z.string().nullable(),
            }),
            emailsSent: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.emailsSent",
              schema: z.number(),
            }),
            emailsOpened: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.emailsOpened",
              schema: z.number(),
            }),
            emailsClicked: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.emailsClicked",
              schema: z.number(),
            }),
            startedAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.startedAt",
              schema: z.string(),
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
    requests: {
      default: {
        page: 1,
        limit: 20,
      },
    },
    responses: {
      default: {
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
