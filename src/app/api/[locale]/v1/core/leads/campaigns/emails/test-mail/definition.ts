/**
 * Test Email API Route Definition
 * Defines endpoint for sending test emails with custom lead data
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

import { UserRole } from "../../../../user/user-roles/enum";

/**
 * Send Test Email Endpoint (POST)
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "leads", "campaigns", "emails", "test-mail"],
  title: "app.api.v1.core.leads.campaigns.emails.testMail.post.title",
  description:
    "app.api.v1.core.leads.campaigns.emails.testMail.post.description",
  category: "app.api.v1.core.leads.category",
  tags: [
    "app.api.v1.core.leads.tags.campaigns",
    "app.api.v1.core.leads.tags.leads",
  ],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.leads.campaigns.emails.testMail.post.form.title",
      description:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.form.description",
      layout: { type: LayoutType.STACKED },
      children: [],
    },
    {
      [Methods.POST]: { request: "data", response: true },
    },
    {
      // SMTP Account Selection
      campaignType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.campaignType.label",
          description:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.campaignType.description",
          placeholder:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.campaignType.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),
      emailJourneyVariant: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.emailJourneyVariant.label",
          description:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.emailJourneyVariant.description",
          placeholder:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.emailJourneyVariant.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),
      emailCampaignStage: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.emailCampaignStage.label",
          description:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.emailCampaignStage.description",
          placeholder:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.emailCampaignStage.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      // Test recipient
      testEmail: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.testEmail.label",
          description:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.testEmail.description",
          placeholder:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.testEmail.placeholder",
          layout: { columns: 12 },
          validation: { required: true },
        },
        z
          .string()
          .email()
          .transform((val) => val.toLowerCase().trim()),
      ),

      // Lead data for template rendering
      leadData: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.title",
          description:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.description",
          layout: { type: LayoutType.GRID, columns: 2 },
          children: [],
        },
        { request: "data" },
        {
          businessName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.businessName.label",
              description:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.businessName.description",
              placeholder:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.businessName.placeholder",
              layout: { columns: 6 },
              validation: { required: true, maxLength: 255 },
            },
            z
              .string()
              .min(1)
              .max(255)
              .transform((val) => val.trim()),
          ),
          contactName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.contactName.label",
              description:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.contactName.description",
              placeholder:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.contactName.placeholder",
              layout: { columns: 6 },
              validation: { maxLength: 255 },
            },
            z
              .string()
              .max(255)
              .transform((val) => val?.trim() || null)
              .optional()
              .nullable(),
          ),
          website: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.URL,
              label:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.website.label",
              description:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.website.description",
              placeholder:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.website.placeholder",
              layout: { columns: 6 },
            },
            z
              .string()
              .url()
              .transform((val) => val?.trim() || null)
              .optional()
              .nullable()
              .or(z.literal("")),
          ),
          country: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.country.label",
              description:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.country.description",
              placeholder:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.country.placeholder",
              layout: { columns: 6 },
              validation: { required: true },
            },
            z.string(),
          ),
          language: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.language.label",
              description:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.language.description",
              placeholder:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.language.placeholder",
              layout: { columns: 6 },
              validation: { required: true },
            },
            z.string(),
          ),
          status: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.status.label",
              description:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.status.description",
              placeholder:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.status.placeholder",
              layout: { columns: 6 },
              validation: { required: true },
            },
            z.string(),
          ),
          source: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.source.label",
              description:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.source.description",
              placeholder:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.source.placeholder",
              layout: { columns: 6 },
            },
            z.string().optional().nullable(),
          ),
          notes: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.notes.label",
              description:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.notes.description",
              placeholder:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.leadData.notes.placeholder",
              layout: { columns: 12 },
              validation: { maxLength: 1000 },
            },
            z
              .string()
              .max(1000)
              .transform((val) => val?.trim() || null)
              .optional()
              .nullable(),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      result: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.response.title",
          description:
            "app.api.v1.core.leads.campaigns.emails.testMail.post.response.description",
          layout: { type: LayoutType.STACKED },
          children: [],
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.response.success.content",
            },
            z.boolean(),
          ),
          messageId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.response.messageId.content",
            },
            z.string().optional(),
          ),
          testEmail: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.response.testEmail.content",
            },
            z.string().email(),
          ),
          subject: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.response.subject.content",
            },
            z.string(),
          ),
          sentAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.campaigns.emails.testMail.post.response.sentAt.content",
            },
            z.date(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.validation.title",
      description:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.server.title",
      description:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.unknown.title",
      description:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.network.title",
      description:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.forbidden.title",
      description:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.notFound.title",
      description:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.conflict.title",
      description:
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.leads.campaigns.emails.testMail.post.success.title",
    description:
      "app.api.v1.core.leads.campaigns.emails.testMail.post.success.description",
  },

  examples: {
    urlPathVariables: undefined,
    requests: {
      default: {
        campaignType: "newsletter",
        emailJourneyVariant: "PERSONAL_APPROACH",
        emailCampaignStage: "INITIAL",
        testEmail: "test@example.com",
        leadData: {
          businessName: "Test Company",
          contactName: "John Doe",
          website: "https://example.com",
          country: "GLOBAL",
          language: "en",
          status: "NEW",
          source: "WEBSITE",
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
};

export { POST };
export default definitions;
