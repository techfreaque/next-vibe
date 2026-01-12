/**
 * Lead Search API Definition
 * Defines the endpoint for searching leads with pagination and filtering
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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
import { EmailCampaignStage, LeadSource, LeadStatus } from "../enum";

// Inline schema to avoid deprecated schema.ts imports
const leadResponseSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  businessName: z.string().min(1).max(255),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),
  website: z.string().url().optional(),
  country: z.enum(Countries),
  language: z.enum(Languages),
  status: z.enum(LeadStatus),
  source: z.enum(LeadSource).optional(),
  notes: z.string().max(1000).optional(),
  convertedUserId: z.uuid().nullable(),
  convertedAt: dateSchema.nullable(),
  signedUpAt: dateSchema.nullable(),
  consultationBookedAt: dateSchema.nullable(),
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
  method: Methods.GET,
  path: ["leads", "search"],
  allowedRoles: [UserRole.ADMIN],
  icon: "search",

  title: "app.api.leads.search.get.title" as const,
  description: "app.api.leads.search.get.description" as const,
  category: "app.api.leads.category" as const,
  tags: [
    "app.api.leads.tags.leads" as const,
    "app.api.leads.tags.search" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.leads.search.get.form.title" as const,
      description: "app.api.leads.search.get.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === QUERY PARAMETERS ===
      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.leads.search.get.search.label" as const,
          description: "app.api.leads.search.get.search.description" as const,
          columns: 6,
          placeholder: "app.api.leads.search.get.search.placeholder" as const,
        },
        z.string().optional(),
      ),
      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.leads.search.get.limit.label" as const,
          description: "app.api.leads.search.get.limit.description" as const,
          columns: 3,
        },
        z.coerce.number().min(1).max(50).default(10),
      ),
      offset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.leads.search.get.offset.label" as const,
          description: "app.api.leads.search.get.offset.description" as const,
          columns: 3,
        },
        z.coerce.number().min(0).default(0),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.search.get.response.title" as const,
          description: "app.api.leads.search.get.response.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          leads: responseArrayField(
            {
              type: WidgetType.DATA_TABLE,
              title: "app.api.leads.search.get.response.leads.title" as const,
            },
            responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.leads.search.get.response.leads.item" as const,
                fieldType: FieldDataType.TEXT,
              },
              leadResponseSchema,
            ),
          ),
          total: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.leads.search.get.response.total" as const,
              fieldType: FieldDataType.NUMBER,
            },
            z.coerce.number(),
          ),
          hasMore: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.leads.search.get.response.hasMore" as const,
              fieldType: FieldDataType.BOOLEAN,
            },
            z.boolean(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.search.get.errors.unauthorized.title" as const,
      description:
        "app.api.leads.search.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.search.get.errors.validation.title" as const,
      description:
        "app.api.leads.search.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.search.get.errors.server.title" as const,
      description:
        "app.api.leads.search.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.search.get.errors.unknown.title" as const,
      description:
        "app.api.leads.search.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.search.get.errors.network.title" as const,
      description:
        "app.api.leads.search.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.search.get.errors.forbidden.title" as const,
      description:
        "app.api.leads.search.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.search.get.errors.notFound.title" as const,
      description:
        "app.api.leads.search.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.leads.search.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.leads.search.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.search.get.errors.conflict.title" as const,
      description:
        "app.api.leads.search.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.leads.search.get.success.title" as const,
    description: "app.api.leads.search.get.success.description" as const,
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
              consultationBookedAt: null,
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
