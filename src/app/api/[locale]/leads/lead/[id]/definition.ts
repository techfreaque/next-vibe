/**
 * Individual Lead API Route Definition
 * Defines endpoints for specific lead operations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
  submitButton,
  widgetField,
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
  Countries,
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import { dateSchema } from "../../../shared/types/common.schema";
import {
  DeviceType,
  EmailCampaignStage,
  EmailCampaignStageOptions,
  EmailJourneyVariant,
  LeadSource,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusOptions,
} from "../../enum";
import { scopedTranslation } from "./i18n";
import { LeadDetailContainer, LeadEditContainer } from "./widget";

/**
 * Delete Lead Endpoint (DELETE)
 * Deletes a lead by ID
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["leads", "lead", "[id]"],
  allowedRoles: [UserRole.ADMIN],

  title: "delete.title",
  description: "delete.description",
  icon: "trash",
  category: "endpointCategories.leads",
  subCategory: "endpointCategories.leadsManagement",
  tags: ["tags.leads", "tags.management"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    paddingTop: "6",
    noCard: true,
    usage: { request: "urlPathParams" },
    children: {
      title: widgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        level: 5,
        content: "delete.container.description",
        usage: { request: "urlPathParams" },
      }),
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "delete.id.label",
        description: "delete.id.description",
        hidden: true,

        schema: z.uuid(),
      }),

      // Navigation - back to previous screen
      backButton: backButton(scopedTranslation, {
        label: "delete.backButton.label",
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "urlPathParams" },
      }),
      submitButton: submitButton(scopedTranslation, {
        icon: "trash",
        variant: "destructive",
        usage: { request: "urlPathParams" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title",
      description: "delete.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title",
      description: "delete.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title",
      description: "delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title",
      description: "delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title",
      description: "delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title",
      description: "delete.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title",
      description: "delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title",
      description: "delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title",
      description: "delete.errors.conflict.description",
    },
  },

  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
  },

  examples: {
    urlPathParams: {
      delete: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

/**
 * Update Lead Endpoint (PATCH)
 * Updates an existing lead - flat request fields for simpler pre-fill
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["leads", "lead", "[id]"],
  title: "patch.title",
  description: "patch.description",
  category: "endpointCategories.leads",
  subCategory: "endpointCategories.leadsManagement",
  tags: ["tags.leads", "tags.management"],
  allowedRoles: [UserRole.ADMIN],
  icon: "user",

  fields: customWidgetObject({
    render: LeadEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      // Navigation - back to previous screen
      backButton: backButton(scopedTranslation, {
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "urlPathParams" },
      }),

      // Submit button
      submitButton: submitButton(scopedTranslation, {
        icon: "save",
        variant: "default",
        usage: { request: "urlPathParams" },
      }),

      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.id.label",
        description: "patch.id.description",
        hidden: true,
        schema: z.uuid(),
      }),

      // === FLAT REQUEST FIELDS ===
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "patch.email.label",
        description: "patch.email.description",
        placeholder: "patch.email.placeholder",
        columns: 6,
        schema: z.string().email().optional(),
      }),
      businessName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.businessName.label",
        description: "patch.businessName.description",
        placeholder: "patch.businessName.placeholder",
        columns: 6,
        schema: z
          .union([z.string().min(1).max(255), z.literal("")])
          .optional()
          .transform((v) => (v === "" ? undefined : v)),
      }),
      contactName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.contactName.label",
        description: "patch.contactName.description",
        placeholder: "patch.contactName.placeholder",
        columns: 6,
        schema: z.string().optional().nullable(),
      }),
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.status.label",
        description: "patch.status.description",
        placeholder: "patch.status.placeholder",
        columns: 6,
        options: LeadStatusOptions,
        schema: z.enum(LeadStatus).optional(),
      }),
      phone: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEL,
        label: "patch.phone.label",
        description: "patch.phone.description",
        placeholder: "patch.phone.placeholder",
        columns: 6,
        schema: z
          .string()
          .regex(/^\+?[\d\s\-().]{4,20}$/)
          .optional(),
      }),
      website: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "patch.website.label",
        description: "patch.website.description",
        placeholder: "patch.website.placeholder",
        columns: 6,
        schema: z.string().url().optional().or(z.literal("")),
      }),
      country: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.country.label",
        description: "patch.country.description",
        placeholder: "patch.country.placeholder",
        columns: 6,
        options: CountriesOptions,
        schema: z.enum(Countries).optional(),
      }),
      language: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.language.label",
        description: "patch.language.description",
        placeholder: "patch.language.placeholder",
        columns: 6,
        options: LanguagesOptions,
        schema: z.enum(Languages).optional(),
      }),
      source: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.source.label",
        description: "patch.source.description",
        placeholder: "patch.source.placeholder",
        columns: 6,
        options: LeadSourceOptions,
        schema: z.enum(LeadSource).optional(),
      }),
      currentCampaignStage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.currentCampaignStage.label",
        description: "patch.currentCampaignStage.description",
        placeholder: "patch.currentCampaignStage.placeholder",
        columns: 6,
        options: EmailCampaignStageOptions,
        schema: z.enum(EmailCampaignStage).optional(),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.notes.label",
        description: "patch.notes.description",
        placeholder: "patch.notes.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),
      metadata: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "patch.metadata.label",
        description: "patch.metadata.description",
        placeholder: "patch.metadata.placeholder",
        columns: 12,
        schema: z
          .record(z.string(), z.string().or(z.coerce.number()).or(z.boolean()))
          .optional(),
      }),
      convertedUserId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.convertedUserId.label",
        description: "patch.convertedUserId.description",
        placeholder: "patch.convertedUserId.placeholder",
        columns: 12,
        schema: z
          .union([z.uuid(), z.literal("")])
          .nullable()
          .optional()
          .transform((v) => (v === "" ? undefined : v)),
      }),
      subscriptionConfirmedAt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATETIME,
        label: "patch.subscriptionConfirmedAt.label",
        description: "patch.subscriptionConfirmedAt.description",
        placeholder: "patch.subscriptionConfirmedAt.placeholder",
        columns: 12,
        schema: z.coerce.date().nullable().optional(),
      }),

      // === RESPONSE FIELDS ===
      lead: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "patch.response.title",
        description: "patch.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          basicInfo: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.basicInfo.title",
            description: "patch.response.basicInfo.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              id: responseField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.UUID,
                label: "patch.id.label",
                description: "patch.id.description",
                hidden: true,
                schema: z.uuid(),
              }),
              email: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.email.content",
                schema: z.string().email().nullable(),
              }),
              businessName: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.businessName.content",
                schema: z.string(),
              }),
              contactName: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.contactName.content",
                schema: z.string().nullable(),
              }),
              status: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "patch.response.status.content",
                schema: z.enum(LeadStatus),
              }),
            },
          }),

          contactDetails: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.contactDetails.title",
            description: "patch.response.contactDetails.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              phone: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.phone.content",
                schema: z.string().nullable(),
              }),
              website: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.website.content",
                schema: z.string().nullable(),
              }),
              country: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.country.content",
                schema: z.enum(Countries),
              }),
              language: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.language.content",
                schema: z.enum(Languages),
              }),
            },
          }),

          campaignTracking: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.campaignTracking.title",
            description: "patch.response.campaignTracking.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              source: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "patch.response.source.content",
                schema: z.enum(LeadSource).nullable(),
              }),
              currentCampaignStage: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "patch.response.currentCampaignStage.content",
                schema: z.enum(EmailCampaignStage).nullable(),
              }),
              emailJourneyVariant: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.emailJourneyVariant.content",
                schema: z.enum(EmailJourneyVariant).nullable(),
              }),
              emailsSent: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.emailsSent.content",
                schema: z.coerce.number(),
              }),
              lastEmailSentAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.lastEmailSentAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          }),

          engagement: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.engagement.title",
            description: "patch.response.engagement.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              emailsOpened: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.emailsOpened.content",
                schema: z.coerce.number(),
              }),
              emailsClicked: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.emailsClicked.content",
                schema: z.coerce.number(),
              }),
              lastEngagementAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.lastEngagementAt.content",
                schema: dateSchema.nullable(),
              }),
              unsubscribedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.unsubscribedAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          }),

          conversion: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.conversion.title",
            description: "patch.response.conversion.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              convertedUserId: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.convertedUserId.content",
                schema: z.string().nullable(),
              }),
              convertedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.convertedAt.content",
                schema: dateSchema.nullable(),
              }),
              signedUpAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.signedUpAt.content",
                schema: dateSchema.nullable(),
              }),
              subscriptionConfirmedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.subscriptionConfirmedAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          }),

          metadata: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.metadata.title",
            description: "patch.response.metadata.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              notes: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.notes.content",
                schema: z.string().nullable(),
              }),
              metadata: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.metadata.content",
                schema: z.record(z.string(), z.any()),
              }),
              createdAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.createdAt.content",
                schema: dateSchema,
              }),
              updatedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "patch.response.updatedAt.content",
                schema: dateSchema,
              }),
            },
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title",
      description: "patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title",
      description: "patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title",
      description: "patch.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title",
      description: "patch.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title",
      description: "patch.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title",
      description: "patch.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },

  examples: {
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        email: "newemail@example.com",
        businessName: "Updated Business Name",
        contactName: "Jane Smith",
        status: LeadStatus.SIGNED_UP,
        phone: "+9876543210",
        website: "https://newwebsite.com",
        country: Countries.PL,
        language: Languages.EN,
        source: LeadSource.REFERRAL,
        currentCampaignStage: EmailCampaignStage.FOLLOWUP_1,
        notes: "Updated notes after meeting",
        metadata: { priority: "high", lastContact: "2024-01-20" },
        convertedUserId: "660e8400-e29b-41d4-a716-446655440000",
        subscriptionConfirmedAt: null,
      },
    },
    responses: {
      default: {
        lead: {
          basicInfo: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            email: "newemail@example.com",
            businessName: "Updated Business Name",
            contactName: "Jane Smith",
            status: LeadStatus.SIGNED_UP,
          },
          contactDetails: {
            phone: "+9876543210",
            website: "https://newwebsite.com",
            country: Countries.PL,
            language: Languages.EN,
          },
          campaignTracking: {
            source: LeadSource.REFERRAL,
            currentCampaignStage: EmailCampaignStage.FOLLOWUP_1,
            emailJourneyVariant: EmailJourneyVariant.SIDE_HUSTLE,
            emailsSent: 7,
            lastEmailSentAt: new Date("2024-01-20T10:00:00Z"),
          },
          engagement: {
            emailsOpened: 5,
            emailsClicked: 2,
            lastEngagementAt: new Date("2024-01-20T14:30:00Z"),
            unsubscribedAt: null,
          },
          conversion: {
            convertedUserId: "660e8400-e29b-41d4-a716-446655440000",
            convertedAt: null,
            signedUpAt: null,
            subscriptionConfirmedAt: null,
          },
          metadata: {
            notes: "Updated notes after meeting",
            metadata: { priority: "high", lastContact: "2024-01-20" },
            createdAt: new Date("2024-01-10T09:00:00Z"),
            updatedAt: new Date("2024-01-20T16:00:00Z"),
          },
        },
      },
    },
  },
});

/**
 * Get Lead by ID Endpoint (GET)
 * Retrieves a specific lead by ID
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "lead", "[id]"],
  title: "get.title",
  description: "get.description",
  category: "endpointCategories.leads",
  subCategory: "endpointCategories.leadsManagement",
  tags: ["tags.leads", "tags.management"],
  allowedRoles: [UserRole.ADMIN],
  icon: "user",

  fields: customWidgetObject({
    render: LeadDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.id.label",
        description: "get.id.description",
        disabled: true,
        hidden: true,

        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      lead: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.title",
        description: "get.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          // Basic Information
          basicInfo: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.basicInfo.title",
            description: "get.response.basicInfo.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              id: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.id.content",

                schema: z.uuid(),
              }),
              email: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.email.content",

                schema: z.string().email().nullable(),
              }),
              businessName: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.businessName.content",

                schema: z.string(),
              }),
              contactName: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.contactName.content",

                schema: z.string().nullable(),
              }),
              status: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "get.response.status.content",

                schema: z.enum(LeadStatus),
              }),
            },
          }),

          // Contact Details
          contactDetails: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.contactDetails.title",
            description: "get.response.contactDetails.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              phone: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.phone.content",

                schema: z.string().nullable(),
              }),
              website: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.website.content",

                schema: z.string().nullable(),
              }),
              country: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.country.content",

                schema: z.enum(Countries),
              }),
              language: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.language.content",

                schema: z.enum(Languages),
              }),
            },
          }),

          // Campaign & Tracking
          campaignTracking: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.campaignTracking.title",
            description: "get.response.campaignTracking.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              source: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "get.response.source.content",

                schema: z.enum(LeadSource).nullable(),
              }),
              currentCampaignStage: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "get.response.currentCampaignStage.content",

                schema: z.enum(EmailCampaignStage).nullable(),
              }),
              emailJourneyVariant: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.emailJourneyVariant.content",

                schema: z.enum(EmailJourneyVariant).nullable(),
              }),
              emailsSent: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.emailsSent.content",

                schema: z.coerce.number(),
              }),
              lastEmailSentAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.lastEmailSentAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          }),

          // Engagement
          engagement: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.engagement.title",
            description: "get.response.engagement.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              emailsOpened: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.emailsOpened.content",

                schema: z.coerce.number(),
              }),
              emailsClicked: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.emailsClicked.content",

                schema: z.coerce.number(),
              }),
              lastEngagementAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.lastEngagementAt.content",
                schema: dateSchema.nullable(),
              }),
              unsubscribedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.unsubscribedAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          }),

          // Conversion Tracking
          conversion: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.conversion.title",
            description: "get.response.conversion.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              convertedUserId: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.convertedUserId.content",

                schema: z.string().nullable(),
              }),
              convertedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.convertedAt.content",
                schema: dateSchema.nullable(),
              }),
              signedUpAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.signedUpAt.content",
                schema: dateSchema.nullable(),
              }),
              subscriptionConfirmedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.subscriptionConfirmedAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          }),

          // Metadata
          metadata: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.metadata.title",
            description: "get.response.metadata.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              notes: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.notes.content",

                schema: z.string().nullable(),
              }),
              metadata: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.metadata.content",

                schema: z.record(z.string(), z.any()),
              }),
              createdAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.createdAt.content",
                schema: dateSchema,
              }),
              updatedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.updatedAt.content",
                schema: dateSchema,
              }),
            },
          }),

          // Device / Identity (tracking)
          identity: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.identity.title",
            description: "get.response.identity.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              ipAddress: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.ipAddress.content",
                schema: z.string().nullable(),
              }),
              userAgent: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.userAgent.content",
                schema: z.string().nullable(),
              }),
              deviceType: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "get.response.deviceType.content",
                schema: z.enum(DeviceType).nullable(),
              }),
              browser: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.browser.content",
                schema: z.string().nullable(),
              }),
              os: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.os.content",
                schema: z.string().nullable(),
              }),
              referralCode: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.referralCode.content",
                schema: z.string().nullable(),
              }),
            },
          }),

          // Lifecycle timestamps
          lifecycle: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.lifecycle.title",
            description: "get.response.lifecycle.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              bouncedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.bouncedAt.content",
                schema: dateSchema.nullable(),
              }),
              invalidAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.invalidAt.content",
                schema: dateSchema.nullable(),
              }),
              campaignStartedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                label: "get.response.campaignStartedAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          }),

          // Linked Leads
          linkedLeads: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID,
              columns: 2,
              usage: { response: true },
              children: {
                linkedLeadId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedLeads.linkedLeadId.content",
                  schema: z.uuid(),
                }),
                linkReason: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedLeads.linkReason.content",
                  schema: z.string(),
                }),
                linkedAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedLeads.linkedAt.content",
                  schema: dateSchema,
                }),
                email: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedLeads.email.content",
                  schema: z.string().nullable(),
                }),
                businessName: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedLeads.businessName.content",
                  schema: z.string(),
                }),
                status: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "get.response.linkedLeads.status.content",
                  schema: z.enum(LeadStatus),
                }),
                ipAddress: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedLeads.ipAddress.content",
                  schema: z.string().nullable(),
                }),
                userAgent: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedLeads.userAgent.content",
                  schema: z.string().nullable(),
                }),
                createdAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedLeads.createdAt.content",
                  schema: dateSchema,
                }),
              },
            }),
          }),

          // Linked Users
          linkedUsers: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID,
              columns: 2,
              usage: { response: true },
              children: {
                userId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedUsers.userId.content",
                  schema: z.uuid(),
                }),
                linkReason: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedUsers.linkReason.content",
                  schema: z.string(),
                }),
                linkedAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedUsers.linkedAt.content",
                  schema: dateSchema,
                }),
                email: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedUsers.email.content",
                  schema: z.string(),
                }),
                publicName: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.linkedUsers.publicName.content",
                  schema: z.string(),
                }),
              },
            }),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
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
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: {
        lead: {
          basicInfo: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            email: "contact@example.com",
            businessName: "Example Business",
            contactName: "John Doe",
            status: LeadStatus.CAMPAIGN_RUNNING,
          },
          contactDetails: {
            phone: "+1234567890",
            website: "https://example.com",
            country: Countries.DE,
            language: Languages.EN,
          },
          campaignTracking: {
            source: LeadSource.WEBSITE,
            currentCampaignStage: EmailCampaignStage.INITIAL,
            emailJourneyVariant: EmailJourneyVariant.UNCENSORED_CONVERT,
            emailsSent: 5,
            lastEmailSentAt: new Date("2024-01-15T10:00:00Z"),
          },
          engagement: {
            emailsOpened: 3,
            emailsClicked: 1,
            lastEngagementAt: new Date("2024-01-16T14:30:00Z"),
            unsubscribedAt: null,
          },
          conversion: {
            convertedUserId: null,
            convertedAt: null,
            signedUpAt: null,
            subscriptionConfirmedAt: null,
          },
          metadata: {
            notes: "Potential customer for premium plan",
            metadata: { campaignId: "winter-2024", source: "google-ads" },
            createdAt: new Date("2024-01-10T09:00:00Z"),
            updatedAt: new Date("2024-01-16T14:30:00Z"),
          },
          identity: {
            ipAddress: "203.0.113.42",
            userAgent:
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            deviceType: DeviceType.DESKTOP,
            browser: "Chrome",
            os: "Windows",
            referralCode: null,
          },
          lifecycle: {
            bouncedAt: null,
            invalidAt: null,
            campaignStartedAt: new Date("2024-01-12T09:00:00Z"),
          },
          linkedLeads: [],
          linkedUsers: [],
        },
      },
    },
  },
});

// Export types following modern pattern
export type LeadGetRequestInput = typeof GET.types.RequestInput;
export type LeadGetRequestOutput = typeof GET.types.RequestOutput;
export type LeadGetResponseInput = typeof GET.types.ResponseInput;
export type LeadGetResponseOutput = typeof GET.types.ResponseOutput;

export type LeadPatchRequestInput = typeof PATCH.types.RequestInput;
export type LeadPatchRequestOutput = typeof PATCH.types.RequestOutput;
export type LeadPatchResponseInput = typeof PATCH.types.ResponseInput;
export type LeadPatchResponseOutput = typeof PATCH.types.ResponseOutput;

export type LeadDeleteRequestInput = typeof DELETE.types.RequestInput;
export type LeadDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type LeadDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type LeadDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

// Repository types for standardized import patterns
export type LeadUpdateRequestInput = LeadPatchRequestInput;
export type LeadUpdateRequestOutput = LeadPatchRequestOutput;
export type LeadUpdateResponseInput = LeadPatchResponseInput;
export type LeadUpdateResponseOutput = LeadPatchResponseOutput;

/**
 * Export endpoint definitions
 */
const definitions = {
  GET,
  PATCH,
  DELETE,
} as const;

export default definitions;
