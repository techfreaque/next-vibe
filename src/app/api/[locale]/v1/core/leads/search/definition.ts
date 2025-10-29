/**
 * Lead Search API Definition
 * Defines the endpoint for searching leads with pagination and filtering
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { Countries, Languages } from "@/i18n/core/config";

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
  convertedAt: z.string().datetime().nullable(),
  signedUpAt: z.string().datetime().nullable(),
  consultationBookedAt: z.string().datetime().nullable(),
  subscriptionConfirmedAt: z.string().datetime().nullable(),
  currentCampaignStage: z.enum(EmailCampaignStage).nullable(),
  emailsSent: z.number(),
  lastEmailSentAt: z.string().datetime().nullable(),
  unsubscribedAt: z.string().datetime().nullable(),
  emailsOpened: z.number(),
  emailsClicked: z.number(),
  lastEngagementAt: z.string().datetime().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * Lead Search Endpoint (GET)
 * Searches leads with pagination and filtering
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "leads", "search"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.leads.search.get.title" as const,
  description: "app.api.v1.core.leads.search.get.description" as const,
  category: "app.api.v1.core.leads.category" as const,
  tags: [
    "app.api.v1.core.leads.tags.leads" as const,
    "app.api.v1.core.leads.tags.search" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.leads.search.get.form.title" as const,
      description: "app.api.v1.core.leads.search.get.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === QUERY PARAMETERS ===
      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.leads.search.get.search.label" as const,
          description:
            "app.api.v1.core.leads.search.get.search.description" as const,
          layout: { columns: 6 },
          placeholder:
            "app.api.v1.core.leads.search.get.search.placeholder" as const,
        },
        z.string().optional(),
      ),
      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.leads.search.get.limit.label" as const,
          description:
            "app.api.v1.core.leads.search.get.limit.description" as const,
          layout: { columns: 3 },
        },
        z.coerce.number().min(1).max(50).default(10),
      ),
      offset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.leads.search.get.offset.label" as const,
          description:
            "app.api.v1.core.leads.search.get.offset.description" as const,
          layout: { columns: 3 },
        },
        z.coerce.number().min(0).default(0),
      ),

      // === RESPONSE FIELDS ===
      response: responseField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.leads.search.get.response.title" as const,
          description:
            "app.api.v1.core.leads.search.get.response.description" as const,
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        z.object({
          leads: z.array(leadResponseSchema),
          total: z.number(),
          hasMore: z.boolean(),
        }),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.leads.search.get.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.leads.search.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.leads.search.get.errors.validation.title" as const,
      description:
        "app.api.v1.core.leads.search.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.leads.search.get.errors.server.title" as const,
      description:
        "app.api.v1.core.leads.search.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.leads.search.get.errors.unknown.title" as const,
      description:
        "app.api.v1.core.leads.search.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.leads.search.get.errors.network.title" as const,
      description:
        "app.api.v1.core.leads.search.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.leads.search.get.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.leads.search.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.leads.search.get.errors.notFound.title" as const,
      description:
        "app.api.v1.core.leads.search.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.leads.search.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.leads.search.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.leads.search.get.errors.conflict.title" as const,
      description:
        "app.api.v1.core.leads.search.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.leads.search.get.success.title" as const,
    description:
      "app.api.v1.core.leads.search.get.success.description" as const,
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
};

export { GET };
export default definitions;
