/**
 * Test Email API Route Definition
 * Defines endpoint for sending test emails with custom lead data
 */

import { z } from "zod";

import {
  CampaignType,
  CampaignTypeOptions,
} from "@/app/api/[locale]/emails/smtp-client/enum";
import {
  EmailCampaignStage,
  EmailCampaignStageOptions,
  EmailJourneyVariant,
  EmailJourneyVariantOptions,
  LeadSource,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusOptions,
} from "@/app/api/[locale]/leads/enum";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  scopedObjectFieldNew,
  scopedRequestField,
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
  Countries,
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";
import { TestEmailContainer } from "./widget";

/**
 * Send Test Email Endpoint (POST)
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "campaigns", "emails", "test-mail"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.leads",
  tags: ["tags.campaigns", "tags.leads"],
  allowedRoles: [UserRole.ADMIN],
  icon: "send",

  fields: customWidgetObject({
    render: TestEmailContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),
      // SMTP Account Selection
      campaignType: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.campaignType.label",
        description: "post.campaignType.description",
        placeholder: "post.campaignType.placeholder",
        columns: 12,
        options: CampaignTypeOptions,
        schema: z.enum(CampaignType).optional(),
      }),
      emailJourneyVariant: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.emailJourneyVariant.label",
        description: "post.emailJourneyVariant.description",
        placeholder: "post.emailJourneyVariant.placeholder",
        columns: 12,
        options: EmailJourneyVariantOptions,
        schema: z.enum(EmailJourneyVariant),
      }),
      emailCampaignStage: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.emailCampaignStage.label",
        description: "post.emailCampaignStage.description",
        placeholder: "post.emailCampaignStage.placeholder",
        columns: 12,
        options: EmailCampaignStageOptions,
        schema: z.enum(EmailCampaignStage),
      }),

      // Test recipient
      testEmail: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "post.testEmail.label",
        description: "post.testEmail.description",
        placeholder: "post.testEmail.placeholder",
        columns: 12,
        schema: z
          .string()
          .email()
          .transform((val) => val.toLowerCase().trim()),
      }),

      // Lead data for template rendering
      leadData: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.leadData.title",
        description: "post.leadData.description",
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          businessName: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.leadData.businessName.label",
            description: "post.leadData.businessName.description",
            placeholder: "post.leadData.businessName.placeholder",
            columns: 6,
            schema: z
              .string()
              .min(1)
              .max(255)
              .transform((val) => val.trim()),
          }),
          contactName: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.leadData.contactName.label",
            description: "post.leadData.contactName.description",
            placeholder: "post.leadData.contactName.placeholder",
            columns: 6,
            schema: z
              .string()
              .max(255)
              .transform((val) => val?.trim() || null)
              .optional()
              .nullable(),
          }),
          website: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "post.leadData.website.label",
            description: "post.leadData.website.description",
            placeholder: "post.leadData.website.placeholder",
            columns: 6,
            schema: z
              .string()
              .url()
              .transform((val) => val?.trim() || null)
              .optional()
              .nullable()
              .or(z.literal("")),
          }),
          country: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.leadData.country.label",
            description: "post.leadData.country.description",
            placeholder: "post.leadData.country.placeholder",
            columns: 6,
            options: CountriesOptions,
            schema: z.enum(Countries),
          }),
          language: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.leadData.language.label",
            description: "post.leadData.language.description",
            placeholder: "post.leadData.language.placeholder",
            columns: 6,
            options: LanguagesOptions,
            schema: z.enum(Languages),
          }),
          status: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.leadData.status.label",
            description: "post.leadData.status.description",
            placeholder: "post.leadData.status.placeholder",
            columns: 6,
            options: LeadStatusOptions,
            schema: z.enum(LeadStatus),
          }),
          source: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.leadData.source.label",
            description: "post.leadData.source.description",
            placeholder: "post.leadData.source.placeholder",
            columns: 6,
            options: LeadSourceOptions,
            schema: z.enum(LeadSource).optional().nullable(),
          }),
          notes: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label: "post.leadData.notes.label",
            description: "post.leadData.notes.description",
            placeholder: "post.leadData.notes.placeholder",
            columns: 12,
            schema: z
              .string()
              .max(1000)
              .transform((val) => val?.trim() || null)
              .optional()
              .nullable(),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      result: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.title",
        description: "post.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          success: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.success.content",
            schema: z.boolean(),
          }),
          messageId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.messageId.content",
            schema: z.string().optional(),
          }),
          testEmail: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.testEmail.content",
            schema: z.string().email(),
          }),
          subject: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.subject.content",
            schema: z.string(),
          }),
          sentAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.sentAt.content",
            schema: dateSchema,
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
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
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        campaignType: CampaignType.LEAD_CAMPAIGN,
        emailJourneyVariant: EmailJourneyVariant.UNCENSORED_CONVERT,
        emailCampaignStage: EmailCampaignStage.INITIAL,
        testEmail: "test@example.com",
        leadData: {
          businessName: "Test Company",
          contactName: "John Doe",
          website: "https://example.com",
          country: Countries.GLOBAL,
          language: Languages.EN,
          status: LeadStatus.NEW,
          source: LeadSource.WEBSITE,
          notes: "Test email for campaign validation",
        },
      },
    },
    responses: {
      default: {
        result: {
          success: true,
          messageId: "msg-123456789",
          testEmail: "test@example.com",
          subject: "Test Email: Welcome to Our Platform",
          sentAt: new Date("2024-01-15T10:00:00Z"),
        },
      },
    },
  },
});

// Extract types using the enhanced system
export type TestEmailRequestInput = typeof POST.types.RequestInput;
export type TestEmailRequestOutput = typeof POST.types.RequestOutput;
export type TestEmailResponseInput = typeof POST.types.ResponseInput;
export type TestEmailResponseOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
} as const;
export default definitions;
