/**
 * Leads Create API Route Definition
 * Defines endpoint for creating new leads with optimized UI/UX
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
  scopedSubmitButton,
  scopedWidgetField,
  widgetObjectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  SpacingSize,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  Countries,
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import { dateSchema } from "../../shared/types/common.schema";
import { UserRole } from "../../user/user-roles/enum";
import { LeadSource, LeadSourceOptions, LeadStatus } from "../enum";
import { scopedTranslation } from "./i18n";
import { LeadCreateContainer } from "./widget";

/**
 * Create Lead Endpoint (POST)
 * Creates a new lead in the system with user-friendly interface
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "create"],
  title: "post.title",
  description: "post.description",
  category: "category",
  tags: ["tags.leads", "tags.create"],
  allowedRoles: [UserRole.ADMIN],
  icon: "user-plus",

  fields: customWidgetObject({
    render: LeadCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),
      // Top action buttons
      topActions: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        { request: "data", response: true },
        {
          backButton: scopedBackButton(scopedTranslation, {
            label: "post.backButton.label" as const,
            icon: "arrow-left",
            variant: "outline",
            usage: { request: "data", response: true },
          }),
          createButton: scopedSubmitButton(scopedTranslation, {
            label: "post.submitButton.label" as const,
            loadingText: "post.submitButton.loadingText" as const,
            icon: "user-plus",
            variant: "primary",
            className: "ml-auto",
            usage: { request: "data", response: true },
          }),
        },
      ),

      // Separator between buttons and content
      separator: scopedWidgetField(scopedTranslation, {
        type: WidgetType.SEPARATOR,
        spacingTop: SpacingSize.RELAXED,
        spacingBottom: SpacingSize.RELAXED,
        usage: { request: "data", response: true },
      }),
      // === CONTACT INFORMATION ===
      contactInfo: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.contactInfo.title",
        description: "post.contactInfo.description",
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          email: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.EMAIL,
            label: "post.email.label",
            description: "post.email.description",
            placeholder: "post.email.placeholder",
            columns: 12,
            schema: z.string().email(),
          }),

          businessName: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.businessName.label",
            description: "post.businessName.description",
            placeholder: "post.businessName.placeholder",
            columns: 12,
            schema: z.string().min(1).max(255),
          }),

          phone: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEL,
            label: "post.phone.label",
            description: "post.phone.description",
            placeholder: "post.phone.placeholder",
            columns: 6,
            schema: z
              .union([z.string().regex(/^\+?[1-9]\d{1,14}$/), z.literal("")])
              .optional()
              .transform((v) => (v === "" ? undefined : v)),
          }),

          website: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "post.website.label",
            description: "post.website.description",
            placeholder: "post.website.placeholder",
            columns: 6,
            schema: z
              .union([z.string().url(), z.literal("")])
              .optional()
              .transform((v) => (v === "" ? undefined : v)),
          }),
        },
      }),

      // === LOCATION & PREFERENCES ===
      locationPreferences: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.locationPreferences.title",
        description: "post.locationPreferences.description",
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          country: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.country.label",
            description: "post.country.description",
            placeholder: "post.country.placeholder",
            columns: 6,
            options: CountriesOptions,
            schema: z.enum(Countries),
          }),

          language: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.language.label",
            description: "post.language.description",
            placeholder: "post.language.placeholder",
            columns: 6,
            options: LanguagesOptions,
            schema: z.enum(Languages),
          }),
        },
      }),

      // === LEAD DETAILS ===
      leadDetails: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.leadDetails.title",
        description: "post.leadDetails.description",
        layoutType: LayoutType.STACKED,
        usage: { request: "data" },
        children: {
          source: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.source.label",
            description: "post.source.description",
            placeholder: "post.source.placeholder",
            columns: 12,
            options: LeadSourceOptions,
            schema: z.enum(LeadSource),
          }),

          notes: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label: "post.notes.label",
            description: "post.notes.description",
            placeholder: "post.notes.placeholder",
            columns: 12,
            schema: z.string().max(1000).optional(),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      lead: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.title",
        description: "post.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          // === LEAD SUMMARY ===
          summary: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "post.response.summary.title",
            layoutType: LayoutType.GRID_2_COLUMNS,
            usage: { response: true },
            children: {
              id: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.summary.id",
                schema: z.uuid(),
              }),
              businessName: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.summary.businessName",
                schema: z.string(),
              }),
              email: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.summary.email",
                schema: z.string().email().nullable(),
              }),
              status: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "post.response.summary.status",
                schema: z.enum(LeadStatus),
              }),
            },
          }),

          // === CONTACT DETAILS ===
          contactDetails: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "post.response.contactDetails.title",
            layoutType: LayoutType.GRID_2_COLUMNS,
            usage: { response: true },
            children: {
              phone: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.contactDetails.phone",
                schema: z.string().nullable(),
              }),
              website: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.contactDetails.website",
                schema: z.string().nullable(),
              }),
              country: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.contactDetails.country",
                schema: z.string(),
              }),
              language: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.contactDetails.language",
                schema: z.string(),
              }),
            },
          }),

          // === TRACKING INFO ===
          trackingInfo: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "post.response.trackingInfo.title",
            layoutType: LayoutType.GRID,
            usage: { response: true },
            children: {
              source: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "post.response.trackingInfo.source",
                schema: z.enum(LeadSource).nullable(),
              }),
              emailsSent: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.trackingInfo.emailsSent",
                schema: z.coerce.number(),
              }),
              currentCampaignStage: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.trackingInfo.currentCampaignStage",
                schema: z.string().nullable(),
              }),
            },
          }),

          // === METADATA ===
          metadata: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "post.response.metadata.title",
            layoutType: LayoutType.GRID_2_COLUMNS,
            usage: { response: true },
            children: {
              notes: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.metadata.notes",
                schema: z.string().nullable(),
              }),
              createdAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.metadata.createdAt",
                schema: dateSchema,
              }),
              updatedAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "post.response.metadata.updatedAt",
                schema: dateSchema,
              }),
            },
          }),
        },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
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
        leadDetails: { source: LeadSource.CSV_IMPORT },
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
            source: LeadSource.WEBSITE,
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

const definitions = {
  POST,
} as const;
export default definitions;
