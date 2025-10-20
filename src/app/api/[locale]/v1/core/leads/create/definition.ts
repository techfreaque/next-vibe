/**
 * Leads Create API Route Definition
 * Defines endpoint for creating new leads with optimized UI/UX
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { Countries, Languages } from "@/i18n/core/config";

import { UserRole } from "../../user/user-roles/enum";
import { LeadSource, LeadSourceOptions, LeadStatus } from "../enum";

/**
 * Create Lead Endpoint (POST)
 * Creates a new lead in the system with user-friendly interface
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "leads", "create"],
  title: "app.api.v1.core.leads.create.post.title",
  description: "app.api.v1.core.leads.create.post.description",
  category: "app.api.v1.core.leads.category",
  tags: [
    "app.api.v1.core.leads.tags.leads",
    "app.api.v1.core.leads.tags.create",
  ],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.leads.create.post.title",
      description: "app.api.v1.core.leads.create.post.description",
      layout: { type: LayoutType.STACKED },
      children: [],
    },
    {
      [Methods.POST]: { request: "data", response: true },
    },
    {
      // === CONTACT INFORMATION ===
      contactInfo: objectField(
        {
          type: WidgetType.SECTION,
          title: "app.api.v1.core.leads.create.post.contactInfo.title",
          description:
            "app.api.v1.core.leads.create.post.contactInfo.description",
          layout: { type: LayoutType.GRID_2_COLUMNS },
          children: [],
        },
        { request: "data" },
        {
          email: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.v1.core.leads.create.post.email.label",
              description:
                "app.api.v1.core.leads.create.post.email.description",
              placeholder:
                "app.api.v1.core.leads.create.post.email.placeholder",
              layout: { columns: 12 },
              validation: { required: true },
            },
            z.email(),
          ),

          businessName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.v1.core.leads.create.post.businessName.label",
              description:
                "app.api.v1.core.leads.create.post.businessName.description",
              placeholder:
                "app.api.v1.core.leads.create.post.businessName.placeholder",
              layout: { columns: 12 },
              validation: { required: true, maxLength: 255 },
            },
            z.string().min(1).max(255),
          ),

          phone: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PHONE,
              label: "app.api.v1.core.leads.create.post.phone.label",
              description:
                "app.api.v1.core.leads.create.post.phone.description",
              placeholder:
                "app.api.v1.core.leads.create.post.phone.placeholder",
              layout: { columns: 6 },
              validation: { pattern: /^\+?[1-9]\d{1,14}$/.source },
            },
            z
              .string()
              .regex(/^\+?[1-9]\d{1,14}$/)
              .optional(),
          ),

          website: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.URL,
              label: "app.api.v1.core.leads.create.post.website.label",
              description:
                "app.api.v1.core.leads.create.post.website.description",
              placeholder:
                "app.api.v1.core.leads.create.post.website.placeholder",
              layout: { columns: 6 },
            },
            z.string().url().optional(),
          ),
        },
      ),

      // === LOCATION & PREFERENCES ===
      locationPreferences: objectField(
        {
          type: WidgetType.SECTION,
          title: "app.api.v1.core.leads.create.post.locationPreferences.title",
          description:
            "app.api.v1.core.leads.create.post.locationPreferences.description",
          layout: { type: LayoutType.GRID_2_COLUMNS },
          children: [],
        },
        { request: "data" },
        {
          country: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.leads.create.post.country.label",
              description:
                "app.api.v1.core.leads.create.post.country.description",
              placeholder:
                "app.api.v1.core.leads.create.post.country.placeholder",
              layout: { columns: 6 },
              options: Object.entries(Countries).map(
                ([, value]: [string, string]) => ({
                  value: value,
                  label: `app.api.v1.core.leads.enums.country.${value.toLowerCase()}`,
                }),
              ),
              validation: { required: true },
            },
            z.string(),
          ),

          language: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.leads.create.post.language.label",
              description:
                "app.api.v1.core.leads.create.post.language.description",
              placeholder:
                "app.api.v1.core.leads.create.post.language.placeholder",
              layout: { columns: 6 },
              options: Object.entries(Languages).map(
                ([, value]: [string, string]) => ({
                  value: value,
                  label: `app.api.v1.core.leads.enums.language.${value.toLowerCase()}`,
                }),
              ),
              validation: { required: true },
            },
            z.string(),
          ),
        },
      ),

      // === LEAD DETAILS ===
      leadDetails: objectField(
        {
          type: WidgetType.SECTION,
          title: "app.api.v1.core.leads.create.post.leadDetails.title",
          description:
            "app.api.v1.core.leads.create.post.leadDetails.description",
          layout: { type: LayoutType.STACKED },
          children: [],
        },
        { request: "data" },
        {
          source: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.leads.create.post.source.label",
              description:
                "app.api.v1.core.leads.create.post.source.description",
              placeholder:
                "app.api.v1.core.leads.create.post.source.placeholder",
              layout: { columns: 12 },
              options: LeadSourceOptions,
            },
            z.enum(LeadSource).optional(),
          ),

          notes: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label: "app.api.v1.core.leads.create.post.notes.label",
              description:
                "app.api.v1.core.leads.create.post.notes.description",
              placeholder:
                "app.api.v1.core.leads.create.post.notes.placeholder",
              layout: { columns: 12 },
              validation: { maxLength: 1000 },
            },
            z.string().max(1000).optional(),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      lead: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.leads.create.post.response.title",
          description: "app.api.v1.core.leads.create.post.response.description",
          layout: { type: LayoutType.STACKED },
          children: [],
        },
        { response: true },
        {
          // === LEAD SUMMARY ===
          summary: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.v1.core.leads.create.post.response.summary.title",
              layout: { type: LayoutType.GRID_2_COLUMNS },
              children: [],
            },
            { response: true },
            {
              id: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.leads.create.post.response.summary.id",
                },
                z.uuid(),
              ),
              businessName: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.leads.create.post.response.summary.businessName",
                },
                z.string(),
              ),
              email: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.leads.create.post.response.summary.email",
                },
                z.string().email().nullable(),
              ),
              status: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.leads.create.post.response.summary.status",
                },
                z.enum(LeadStatus),
              ),
            },
          ),

          // === CONTACT DETAILS ===
          contactDetails: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.leads.create.post.response.contactDetails.title",
              layout: { type: LayoutType.GRID_2_COLUMNS },
              children: [],
            },
            { response: true },
            {
              phone: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.leads.create.post.response.contactDetails.phone",
                },
                z.string().nullable(),
              ),
              website: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.leads.create.post.response.contactDetails.website",
                },
                z.string().nullable(),
              ),
              country: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.leads.create.post.response.contactDetails.country",
                },
                z.string(),
              ),
              language: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.leads.create.post.response.contactDetails.language",
                },
                z.string(),
              ),
            },
          ),

          // === TRACKING INFO ===
          trackingInfo: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.leads.create.post.response.trackingInfo.title",
              layout: { type: LayoutType.GRID },
              children: [],
            },
            { response: true },
            {
              source: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.leads.create.post.response.trackingInfo.source",
                },
                z.enum(LeadSource).nullable(),
              ),
              emailsSent: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.leads.create.post.response.trackingInfo.emailsSent",
                },
                z.number(),
              ),
              currentCampaignStage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.leads.create.post.response.trackingInfo.currentCampaignStage",
                },
                z.string().nullable(),
              ),
            },
          ),

          // === METADATA ===
          metadata: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.leads.create.post.response.metadata.title",
              layout: { type: LayoutType.GRID_2_COLUMNS },
              children: [],
            },
            { response: true },
            {
              notes: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.leads.create.post.response.metadata.notes",
                },
                z.string().nullable(),
              ),
              createdAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.leads.create.post.response.metadata.createdAt",
                },
                z.string().datetime(),
              ),
              updatedAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.leads.create.post.response.metadata.updatedAt",
                },
                z.string().datetime(),
              ),
            },
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.leads.create.post.errors.validation.title",
      description:
        "app.api.v1.core.leads.create.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.leads.create.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.leads.create.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.leads.create.post.errors.forbidden.title",
      description:
        "app.api.v1.core.leads.create.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.leads.create.post.errors.conflict.title",
      description:
        "app.api.v1.core.leads.create.post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.leads.create.post.errors.server.title",
      description:
        "app.api.v1.core.leads.create.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.leads.create.post.errors.unknown.title",
      description:
        "app.api.v1.core.leads.create.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.leads.create.post.errors.network.title",
      description:
        "app.api.v1.core.leads.create.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.leads.create.post.errors.notFound.title",
      description:
        "app.api.v1.core.leads.create.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.leads.create.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.leads.create.post.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.leads.create.post.success.title",
    description: "app.api.v1.core.leads.create.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        contactInfo: {
          email: "john@example.com",
          businessName: "Example Corp",
          phone: "+1234567890",
          website: "https://example.com",
        },
        locationPreferences: {
          country: "GLOBAL",
          language: "en",
        },
        leadDetails: {
          source: LeadSource.WEBSITE,
          notes: "Interested in premium features",
        },
      },
      minimal: {
        contactInfo: {
          email: "jane@startup.com",
          businessName: "Startup Inc",
        },
        locationPreferences: {
          country: "US",
          language: "en",
        },
        leadDetails: {},
      },
    },
    responses: {
      default: {
        lead: {
          summary: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            businessName: "Example Corp",
            email: "john@example.com",
            status: LeadStatus.NEW,
          },
          contactDetails: {
            phone: "+1234567890",
            website: "https://example.com",
            country: "GLOBAL",
            language: "en",
          },
          trackingInfo: {
            source: LeadSource.WEBSITE,
            emailsSent: 0,
            currentCampaignStage: null,
          },
          metadata: {
            notes: "Interested in premium features",
            createdAt: "2023-01-01T00:00:00.000Z",
            updatedAt: "2023-01-01T00:00:00.000Z",
          },
        },
      },
      minimal: {
        lead: {
          summary: {
            id: "456e7890-e89b-12d3-a456-426614174001",
            businessName: "Startup Inc",
            email: "jane@startup.com",
            status: LeadStatus.NEW,
          },
          contactDetails: {
            phone: null,
            website: null,
            country: "US",
            language: "en",
          },
          trackingInfo: {
            source: null,
            emailsSent: 0,
            currentCampaignStage: null,
          },
          metadata: {
            notes: null,
            createdAt: "2023-01-01T00:00:00.000Z",
            updatedAt: "2023-01-01T00:00:00.000Z",
          },
        },
      },
    },
  },
});

// Export types following migration guide pattern
export type LeadCreatePostRequestInput = typeof POST.types.RequestInput;
export type LeadCreatePostRequestOutput = typeof POST.types.RequestOutput;
export type LeadCreatePostResponseInput = typeof POST.types.ResponseInput;
export type LeadCreatePostResponseOutput = typeof POST.types.ResponseOutput;

// Repository types for standardized import patterns
export type LeadCreateRequestTypeInput = LeadCreatePostRequestInput;
export type LeadCreateRequestTypeOutput = LeadCreatePostRequestOutput;
export type LeadCreateResponseTypeInput = LeadCreatePostResponseInput;
export type LeadCreateResponseTypeOutput = LeadCreatePostResponseOutput;

// Export individual endpoints
export { POST };

const definitions = {
  POST,
};

export default definitions;
