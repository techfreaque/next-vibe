/**
 * Lead Search API Definition
 * Defines the endpoint for searching leads with pagination and filtering
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
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
import { Countries, Languages } from "@/i18n/core/config";

import { dateSchema } from "../../shared/types/common.schema";
import {
  EmailCampaignStage,
  LeadSource,
  LeadStatus,
  LeadStatusDB,
} from "../enum";
import { scopedTranslation } from "./i18n";
import { LeadsSearchContainer } from "./widget";

// Inline schema to avoid deprecated schema.ts imports
const leadResponseSchema = z.object({
  id: z.uuid(),
  email: z.string().email(),
  businessName: z.string(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  country: z.enum(Countries),
  language: z.enum(Languages),
  status: z.enum(LeadStatus),
  source: z.enum(LeadSource).optional(),
  notes: z.string().max(1000).optional(),
  convertedUserId: z.uuid().nullable(),
  convertedAt: dateSchema.nullable(),
  signedUpAt: dateSchema.nullable(),
  subscriptionConfirmedAt: dateSchema.nullable(),
  currentCampaignStage: z.enum(EmailCampaignStage).nullable(),
  emailsSent: z.coerce.number(),
  lastEmailSentAt: dateSchema.nullable(),
  unsubscribedAt: dateSchema.nullable(),
  emailsOpened: z.coerce.number(),
  emailsClicked: z.coerce.number(),
  lastEngagementAt: dateSchema.nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

/**
 * Lead Search Endpoint (GET)
 * Searches leads with pagination and filtering
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "search"],
  allowedRoles: [UserRole.ADMIN],
  icon: "search",

  title: "get.title",
  description: "get.description",
  category: "endpointCategories.leads",
  tags: ["tags.leads", "tags.search"],

  fields: customWidgetObject({
    render: LeadsSearchContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),
      // === QUERY PARAMETERS ===
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.search.label",
        description: "get.search.description",
        columns: 6,
        placeholder: "get.search.placeholder",
        schema: z.string().optional(),
      }),
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.status.label",
        description: "get.status.description",
        columns: 6,
        schema: z.enum(LeadStatusDB).optional(),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.limit.label",
        description: "get.limit.description",
        columns: 3,
        schema: z.coerce.number().min(1).max(50).default(10),
      }),
      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.offset.label",
        description: "get.offset.description",
        columns: 3,
        schema: z.coerce.number().min(0).default(0),
      }),

      // === RESPONSE FIELDS ===
      response: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.title",
        description: "get.response.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          leads: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.leads.title",
            child: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.leads.item",
              fieldType: FieldDataType.TEXT,
              schema: leadResponseSchema,
            }),
          }),
          total: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.total",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number(),
          }),
          hasMore: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.hasMore",
            fieldType: FieldDataType.BOOLEAN,
            schema: z.boolean(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    requests: {
      default: {
        search: "acme",
        limit: 10,
        offset: 0,
      },
      empty: {
        limit: 10,
        offset: 0,
      },
    },
    responses: {
      default: {
        response: {
          leads: [
            {
              id: "123e4567-e89b-12d3-a456-426614174000",
              email: "contact@acme.com",
              businessName: "Acme Corp",
              phone: "+1234567890",
              website: "https://acme.com",
              country: Countries.GLOBAL,
              language: Languages.EN,
              status: LeadStatus.NEW,
              source: LeadSource.WEBSITE,
              notes: "Interested in premium features",
              convertedUserId: null,
              convertedAt: null,
              signedUpAt: null,
              subscriptionConfirmedAt: null,
              currentCampaignStage: null,
              emailsSent: 0,
              lastEmailSentAt: null,
              unsubscribedAt: null,
              emailsOpened: 0,
              emailsClicked: 0,
              lastEngagementAt: null,
              metadata: {},
              createdAt: "2023-01-01T00:00:00.000Z",
              updatedAt: "2023-01-01T00:00:00.000Z",
            },
          ],
          total: 1,
          hasMore: false,
        },
      },
      empty: {
        response: {
          leads: [],
          total: 0,
          hasMore: false,
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type LeadSearchGetRequestInput = typeof GET.types.RequestInput;
export type LeadSearchGetRequestOutput = typeof GET.types.RequestOutput;
export type LeadSearchGetResponseInput = typeof GET.types.ResponseInput;
export type LeadSearchGetResponseOutput = typeof GET.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  GET,
} as const;
export default definitions;
