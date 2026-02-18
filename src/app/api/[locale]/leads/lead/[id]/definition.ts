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
  responseField,
  submitButton,
  widgetField,
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
  Countries,
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import { dateSchema } from "../../../shared/types/common.schema";
import {
  EmailCampaignStage,
  EmailCampaignStageOptions,
  EmailJourneyVariant,
  LeadSource,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusOptions,
} from "../../enum";
import { LeadDetailContainer } from "./widget";

/**
 * Delete Lead Endpoint (DELETE)
 * Deletes a lead by ID
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["leads", "lead", "[id]"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.leads.lead.id.delete.title",
  description: "app.api.leads.lead.id.delete.description",
  icon: "trash",
  category: "app.api.leads.category",
  tags: ["app.api.leads.tags.leads", "app.api.leads.tags.management"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
      paddingTop: "6",
      noCard: true,
    },
    { request: "urlPathParams" },
    {
      title: widgetField({
        type: WidgetType.TITLE,
        level: 5,
        content: "app.api.leads.lead.id.delete.container.description",
        usage: { request: "urlPathParams" },
      }),
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.leads.lead.id.delete.id.label",
        description: "app.api.leads.lead.id.delete.id.description",
        hidden: true,

        schema: z.uuid(),
      }),

      // Navigation - back to previous screen
      backButton: backButton({
        label: "app.api.leads.lead.id.delete.backButton.label",
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "urlPathParams" },
      }),
      submitButton: submitButton({
        label: "app.api.leads.lead.id.delete.actions.delete",
        loadingText: "app.api.leads.lead.id.delete.actions.deleting",
        icon: "trash",
        variant: "destructive",
        usage: { request: "urlPathParams" },
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.lead.id.delete.errors.validation.title",
      description: "app.api.leads.lead.id.delete.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.lead.id.delete.errors.network.title",
      description: "app.api.leads.lead.id.delete.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.lead.id.delete.errors.unauthorized.title",
      description:
        "app.api.leads.lead.id.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.lead.id.delete.errors.forbidden.title",
      description: "app.api.leads.lead.id.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.lead.id.delete.errors.notFound.title",
      description: "app.api.leads.lead.id.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.lead.id.delete.errors.server.title",
      description: "app.api.leads.lead.id.delete.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.lead.id.delete.errors.unknown.title",
      description: "app.api.leads.lead.id.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.leads.lead.id.delete.errors.unsavedChanges.title",
      description:
        "app.api.leads.lead.id.delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.lead.id.delete.errors.conflict.title",
      description: "app.api.leads.lead.id.delete.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.leads.lead.id.delete.success.title",
    description: "app.api.leads.lead.id.delete.success.description",
  },

  examples: {
    urlPathParams: {
      delete: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
  },
});

/**
 * Update Lead Endpoint (PATCH)
 * Updates an existing lead
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["leads", "lead", "[id]"],
  title: "app.api.leads.lead.id.patch.title",
  description: "app.api.leads.lead.id.patch.description",
  category: "app.api.leads.category",
  tags: ["app.api.leads.tags.leads", "app.api.leads.tags.management"],
  allowedRoles: [UserRole.ADMIN],
  icon: "user",

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.leads.lead.id.patch.form.title",
      description: "app.api.leads.lead.id.patch.form.description",
      layoutType: LayoutType.STACKED,
      paddingTop: "6",
      noCard: true,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.leads.lead.id.patch.id.label",
        description: "app.api.leads.lead.id.patch.id.description",
        hidden: true,
        schema: z.uuid(),
      }),

      // === UPDATE FIELDS ===
      updates: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.lead.id.patch.updates.title",
          description: "app.api.leads.lead.id.patch.updates.description",
          layoutType: LayoutType.STACKED,
        },
        { request: "data" },
        {
          // Basic Information
          basicInfo: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.patch.basicInfo.title",
              description: "app.api.leads.lead.id.patch.basicInfo.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { request: "data" },
            {
              email: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.EMAIL,
                label: "app.api.leads.lead.id.patch.email.label",
                description: "app.api.leads.lead.id.patch.email.description",
                placeholder: "app.api.leads.lead.id.patch.email.placeholder",
                columns: 6,

                schema: z.string().email().optional(),
              }),
              businessName: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "app.api.leads.lead.id.patch.businessName.label",
                description:
                  "app.api.leads.lead.id.patch.businessName.description",
                placeholder:
                  "app.api.leads.lead.id.patch.businessName.placeholder",
                columns: 6,

                schema: z.string().min(1).max(255).optional(),
              }),
              contactName: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "app.api.leads.lead.id.patch.contactName.label",
                description:
                  "app.api.leads.lead.id.patch.contactName.description",
                placeholder:
                  "app.api.leads.lead.id.patch.contactName.placeholder",
                columns: 6,

                schema: z.string().optional().nullable(),
              }),
              status: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.SELECT,
                label: "app.api.leads.lead.id.patch.status.label",
                description: "app.api.leads.lead.id.patch.status.description",
                placeholder: "app.api.leads.lead.id.patch.status.placeholder",
                columns: 6,
                options: LeadStatusOptions,

                schema: z.enum(LeadStatus).optional(),
              }),
            },
          ),

          // Contact Details
          contactDetails: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.patch.contactDetails.title",
              description:
                "app.api.leads.lead.id.patch.contactDetails.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { request: "data" },
            {
              phone: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEL,
                label: "app.api.leads.lead.id.patch.phone.label",
                description: "app.api.leads.lead.id.patch.phone.description",
                placeholder: "app.api.leads.lead.id.patch.phone.placeholder",
                columns: 6,
                schema: z
                  .string()
                  .regex(/^\+?[1-9]\d{1,14}$/)
                  .optional(),
              }),
              website: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.URL,
                label: "app.api.leads.lead.id.patch.website.label",
                description: "app.api.leads.lead.id.patch.website.description",
                placeholder: "app.api.leads.lead.id.patch.website.placeholder",
                columns: 6,

                schema: z.string().url().optional().or(z.literal("")),
              }),
              country: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.SELECT,
                label: "app.api.leads.lead.id.patch.country.label",
                description: "app.api.leads.lead.id.patch.country.description",
                placeholder: "app.api.leads.lead.id.patch.country.placeholder",
                columns: 6,
                options: CountriesOptions,

                schema: z.enum(Countries).optional(),
              }),
              language: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.SELECT,
                label: "app.api.leads.lead.id.patch.language.label",
                description: "app.api.leads.lead.id.patch.language.description",
                placeholder: "app.api.leads.lead.id.patch.language.placeholder",
                columns: 6,
                options: LanguagesOptions,

                schema: z.enum(Languages).optional(),
              }),
            },
          ),

          // Campaign Management
          campaignManagement: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.patch.campaignManagement.title",
              description:
                "app.api.leads.lead.id.patch.campaignManagement.description",
              layoutType: LayoutType.STACKED,
            },
            { request: "data" },
            {
              source: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.SELECT,
                label: "app.api.leads.lead.id.patch.source.label",
                description: "app.api.leads.lead.id.patch.source.description",
                placeholder: "app.api.leads.lead.id.patch.source.placeholder",
                columns: 12,
                options: LeadSourceOptions,

                schema: z.enum(LeadSource).optional(),
              }),
              currentCampaignStage: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.SELECT,
                label: "app.api.leads.lead.id.patch.currentCampaignStage.label",
                description:
                  "app.api.leads.lead.id.patch.currentCampaignStage.description",
                placeholder:
                  "app.api.leads.lead.id.patch.currentCampaignStage.placeholder",
                columns: 12,
                options: EmailCampaignStageOptions,

                schema: z.enum(EmailCampaignStage).optional(),
              }),
            },
          ),

          // Additional Details
          additionalDetails: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.patch.additionalDetails.title",
              description:
                "app.api.leads.lead.id.patch.additionalDetails.description",
              layoutType: LayoutType.STACKED,
            },
            { request: "data" },
            {
              notes: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXTAREA,
                label: "app.api.leads.lead.id.patch.notes.label",
                description: "app.api.leads.lead.id.patch.notes.description",
                placeholder: "app.api.leads.lead.id.patch.notes.placeholder",
                columns: 12,

                schema: z.string().optional(),
              }),
              metadata: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.JSON,
                label: "app.api.leads.lead.id.patch.metadata.label",
                description: "app.api.leads.lead.id.patch.metadata.description",
                placeholder: "app.api.leads.lead.id.patch.metadata.placeholder",
                columns: 12,
                schema: z
                  .record(
                    z.string(),
                    z.string().or(z.coerce.number()).or(z.boolean()),
                  )
                  .optional(),
              }),
              convertedUserId: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.UUID,
                label: "app.api.leads.lead.id.patch.convertedUserId.label",
                description:
                  "app.api.leads.lead.id.patch.convertedUserId.description",
                placeholder:
                  "app.api.leads.lead.id.patch.convertedUserId.placeholder",
                columns: 12,

                schema: z.uuid().nullable().optional(),
              }),
              subscriptionConfirmedAt: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.DATETIME,
                label:
                  "app.api.leads.lead.id.patch.subscriptionConfirmedAt.label",
                description:
                  "app.api.leads.lead.id.patch.subscriptionConfirmedAt.description",
                placeholder:
                  "app.api.leads.lead.id.patch.subscriptionConfirmedAt.placeholder",
                columns: 12,

                schema: z.coerce.date().nullable().optional(),
              }),
            },
          ),
        },
      ),

      // === RESPONSE FIELDS (same structure as GET) ===
      lead: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.lead.id.patch.response.title",
          description: "app.api.leads.lead.id.patch.response.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          // Using same nested response structure as GET endpoint
          basicInfo: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.patch.response.basicInfo.title",
              description:
                "app.api.leads.lead.id.patch.response.basicInfo.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              id: responseField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.UUID,
                label: "app.api.leads.lead.id.patch.id.label",
                description: "app.api.leads.lead.id.patch.id.description",
                hidden: true,
                schema: z.uuid(),
              }),

              email: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.patch.response.email.content",

                schema: z.string().email().nullable(),
              }),
              businessName: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.businessName.content",

                schema: z.string(),
              }),
              contactName: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.contactName.content",

                schema: z.string().nullable(),
              }),
              status: responseField({
                type: WidgetType.BADGE,
                text: "app.api.leads.lead.id.patch.response.status.content",

                schema: z.enum(LeadStatus),
              }),
            },
          ),

          contactDetails: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.leads.lead.id.patch.response.contactDetails.title",
              description:
                "app.api.leads.lead.id.patch.response.contactDetails.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              phone: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.patch.response.phone.content",

                schema: z.string().nullable(),
              }),
              website: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.patch.response.website.content",

                schema: z.string().nullable(),
              }),
              country: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.patch.response.country.content",

                schema: z.enum(Countries),
              }),
              language: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.patch.response.language.content",

                schema: z.enum(Languages),
              }),
            },
          ),

          campaignTracking: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.leads.lead.id.patch.response.campaignTracking.title",
              description:
                "app.api.leads.lead.id.patch.response.campaignTracking.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              source: responseField({
                type: WidgetType.BADGE,
                text: "app.api.leads.lead.id.patch.response.source.content",

                schema: z.enum(LeadSource).nullable(),
              }),
              currentCampaignStage: responseField({
                type: WidgetType.BADGE,
                text: "app.api.leads.lead.id.patch.response.currentCampaignStage.content",

                schema: z.enum(EmailCampaignStage).nullable(),
              }),
              emailJourneyVariant: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.emailJourneyVariant.content",

                schema: z.enum(EmailJourneyVariant).nullable(),
              }),
              emailsSent: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.emailsSent.content",

                schema: z.coerce.number(),
              }),
              lastEmailSentAt: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.lastEmailSentAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          ),

          engagement: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.patch.response.engagement.title",
              description:
                "app.api.leads.lead.id.patch.response.engagement.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              emailsOpened: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.emailsOpened.content",

                schema: z.coerce.number(),
              }),
              emailsClicked: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.emailsClicked.content",

                schema: z.coerce.number(),
              }),
              lastEngagementAt: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.lastEngagementAt.content",
                schema: dateSchema.nullable(),
              }),
              unsubscribedAt: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.unsubscribedAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          ),

          conversion: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.patch.response.conversion.title",
              description:
                "app.api.leads.lead.id.patch.response.conversion.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              convertedUserId: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.convertedUserId.content",

                schema: z.string().nullable(),
              }),
              convertedAt: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.convertedAt.content",
                schema: dateSchema.nullable(),
              }),
              signedUpAt: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.signedUpAt.content",
                schema: dateSchema.nullable(),
              }),
              subscriptionConfirmedAt: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.patch.response.subscriptionConfirmedAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          ),

          metadata: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.patch.response.metadata.title",
              description:
                "app.api.leads.lead.id.patch.response.metadata.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              notes: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.patch.response.notes.content",

                schema: z.string().nullable(),
              }),
              metadata: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.patch.response.metadata.content",

                schema: z.record(z.string(), z.any()),
              }),
              createdAt: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.patch.response.createdAt.content",
                schema: dateSchema,
              }),
              updatedAt: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.patch.response.updatedAt.content",
                schema: dateSchema,
              }),
            },
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.lead.id.patch.errors.validation.title",
      description: "app.api.leads.lead.id.patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.lead.id.patch.errors.unauthorized.title",
      description:
        "app.api.leads.lead.id.patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.lead.id.patch.errors.forbidden.title",
      description: "app.api.leads.lead.id.patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.lead.id.patch.errors.notFound.title",
      description: "app.api.leads.lead.id.patch.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.lead.id.patch.errors.conflict.title",
      description: "app.api.leads.lead.id.patch.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.lead.id.patch.errors.server.title",
      description: "app.api.leads.lead.id.patch.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.lead.id.patch.errors.unknown.title",
      description: "app.api.leads.lead.id.patch.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.lead.id.patch.errors.network.title",
      description: "app.api.leads.lead.id.patch.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.leads.lead.id.patch.errors.unsavedChanges.title",
      description:
        "app.api.leads.lead.id.patch.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "app.api.leads.lead.id.patch.success.title",
    description: "app.api.leads.lead.id.patch.success.description",
  },

  examples: {
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        updates: {
          basicInfo: {
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
          campaignManagement: {
            source: LeadSource.REFERRAL,
            currentCampaignStage: EmailCampaignStage.FOLLOWUP_1,
          },
          additionalDetails: {
            notes: "Updated notes after meeting",
            metadata: { priority: "high", lastContact: "2024-01-20" },
            convertedUserId: "660e8400-e29b-41d4-a716-446655440000",
            subscriptionConfirmedAt: null,
          },
        },
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
            emailJourneyVariant: EmailJourneyVariant.RESULTS_FOCUSED,
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
  method: Methods.GET,
  path: ["leads", "lead", "[id]"],
  title: "app.api.leads.lead.id.get.title",
  description: "app.api.leads.lead.id.get.description",
  category: "app.api.leads.category",
  tags: ["app.api.leads.tags.leads", "app.api.leads.tags.management"],
  allowedRoles: [UserRole.ADMIN],
  icon: "user",

  fields: customWidgetObject({
    render: LeadDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.leads.lead.id.get.id.label",
        description: "app.api.leads.lead.id.get.id.description",
        disabled: true,
        hidden: true,

        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      lead: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.lead.id.get.response.title",
          description: "app.api.leads.lead.id.get.response.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          // Basic Information
          basicInfo: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.get.response.basicInfo.title",
              description:
                "app.api.leads.lead.id.get.response.basicInfo.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              id: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.id.content",

                schema: z.uuid(),
              }),
              email: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.email.content",

                schema: z.string().email().nullable(),
              }),
              businessName: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.get.response.businessName.content",

                schema: z.string(),
              }),
              contactName: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.contactName.content",

                schema: z.string().nullable(),
              }),
              status: responseField({
                type: WidgetType.BADGE,
                text: "app.api.leads.lead.id.get.response.status.content",

                schema: z.enum(LeadStatus),
              }),
            },
          ),

          // Contact Details
          contactDetails: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.get.response.contactDetails.title",
              description:
                "app.api.leads.lead.id.get.response.contactDetails.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              phone: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.phone.content",

                schema: z.string().nullable(),
              }),
              website: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.website.content",

                schema: z.string().nullable(),
              }),
              country: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.country.content",

                schema: z.enum(Countries),
              }),
              language: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.language.content",

                schema: z.enum(Languages),
              }),
            },
          ),

          // Campaign & Tracking
          campaignTracking: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.leads.lead.id.get.response.campaignTracking.title",
              description:
                "app.api.leads.lead.id.get.response.campaignTracking.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              source: responseField({
                type: WidgetType.BADGE,
                text: "app.api.leads.lead.id.get.response.source.content",

                schema: z.enum(LeadSource).nullable(),
              }),
              currentCampaignStage: responseField({
                type: WidgetType.BADGE,
                text: "app.api.leads.lead.id.get.response.currentCampaignStage.content",

                schema: z.enum(EmailCampaignStage).nullable(),
              }),
              emailJourneyVariant: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.get.response.emailJourneyVariant.content",

                schema: z.enum(EmailJourneyVariant).nullable(),
              }),
              emailsSent: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.emailsSent.content",

                schema: z.coerce.number(),
              }),
              lastEmailSentAt: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.get.response.lastEmailSentAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          ),

          // Engagement
          engagement: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.get.response.engagement.title",
              description:
                "app.api.leads.lead.id.get.response.engagement.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              emailsOpened: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.get.response.emailsOpened.content",

                schema: z.coerce.number(),
              }),
              emailsClicked: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.get.response.emailsClicked.content",

                schema: z.coerce.number(),
              }),
              lastEngagementAt: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.get.response.lastEngagementAt.content",
                schema: dateSchema.nullable(),
              }),
              unsubscribedAt: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.get.response.unsubscribedAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          ),

          // Conversion Tracking
          conversion: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.get.response.conversion.title",
              description:
                "app.api.leads.lead.id.get.response.conversion.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              convertedUserId: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.get.response.convertedUserId.content",

                schema: z.string().nullable(),
              }),
              convertedAt: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.convertedAt.content",
                schema: dateSchema.nullable(),
              }),
              signedUpAt: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.signedUpAt.content",
                schema: dateSchema.nullable(),
              }),
              subscriptionConfirmedAt: responseField({
                type: WidgetType.TEXT,
                label:
                  "app.api.leads.lead.id.get.response.subscriptionConfirmedAt.content",
                schema: dateSchema.nullable(),
              }),
            },
          ),

          // Metadata
          metadata: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.leads.lead.id.get.response.metadata.title",
              description:
                "app.api.leads.lead.id.get.response.metadata.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              notes: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.notes.content",

                schema: z.string().nullable(),
              }),
              metadata: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.metadata.content",

                schema: z.record(z.string(), z.any()),
              }),
              createdAt: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.createdAt.content",
                schema: dateSchema,
              }),
              updatedAt: responseField({
                type: WidgetType.TEXT,
                label: "app.api.leads.lead.id.get.response.updatedAt.content",
                schema: dateSchema,
              }),
            },
          ),
        },
      ),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.lead.id.get.errors.validation.title",
      description: "app.api.leads.lead.id.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.lead.id.get.errors.unauthorized.title",
      description: "app.api.leads.lead.id.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.lead.id.get.errors.forbidden.title",
      description: "app.api.leads.lead.id.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.lead.id.get.errors.notFound.title",
      description: "app.api.leads.lead.id.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.lead.id.get.errors.server.title",
      description: "app.api.leads.lead.id.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.lead.id.get.errors.unknown.title",
      description: "app.api.leads.lead.id.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.lead.id.get.errors.network.title",
      description: "app.api.leads.lead.id.get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.leads.lead.id.get.errors.unsavedChanges.title",
      description:
        "app.api.leads.lead.id.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.lead.id.get.errors.conflict.title",
      description: "app.api.leads.lead.id.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.leads.lead.id.get.success.title",
    description: "app.api.leads.lead.id.get.success.description",
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
            emailJourneyVariant: EmailJourneyVariant.PERSONAL_APPROACH,
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
