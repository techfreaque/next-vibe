/**
 * Email Service Definition
 * Provides centralized email sending functionality using SMTP repository
 */

import { z } from "zod";

import {
  EmailCampaignStageDB,
  EmailJourneyVariantDB,
} from "@/app/api/[locale]/leads/enum";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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

import { CampaignType, CampaignTypeOptions } from "../smtp-client/enum";

/**
 * Email Service Send Endpoint (POST)
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["emails", "email-service", "send"],
  title: "app.api.emails.emailService.send.title",
  description: "app.api.emails.emailService.send.description",
  category: "app.api.emails.category",
  icon: "send",
  tags: ["app.api.emails.emailService.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.emailService.send.container.title",
      description: "app.api.emails.emailService.send.container.description",
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === RECIPIENT INFORMATION ===
      recipientInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.emailService.send.recipientInfo.title",
          description:
            "app.api.emails.emailService.send.recipientInfo.description",
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { request: "data" },
        {
          to: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.emails.emailService.send.to.label",
              description: "app.api.emails.emailService.send.to.description",
              placeholder: "app.api.emails.emailService.send.to.placeholder",
              columns: 12,
            },
            z.email(),
          ),

          toName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.emails.emailService.send.toName.label",
              description:
                "app.api.emails.emailService.send.toName.description",
              placeholder:
                "app.api.emails.emailService.send.toName.placeholder",
              columns: 12,
              helpText: "app.api.emails.emailService.send.toName.description",
            },
            z.string().optional(),
          ),
        },
      ),

      // === EMAIL CONTENT ===
      emailContent: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.emailService.send.emailContent.title",
          description:
            "app.api.emails.emailService.send.emailContent.description",
          layoutType: LayoutType.STACKED,
        },
        { request: "data" },
        {
          subject: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.emails.emailService.send.subject.label",
              description:
                "app.api.emails.emailService.send.subject.description",
              placeholder:
                "app.api.emails.emailService.send.subject.placeholder",
              columns: 12,
            },
            z.string().min(1).max(998),
          ),

          html: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label: "app.api.emails.emailService.send.html.label",
              description: "app.api.emails.emailService.send.html.description",
              placeholder: "app.api.emails.emailService.send.html.placeholder",
              columns: 12,
            },
            z.string().min(1),
          ),

          text: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label: "app.api.emails.emailService.send.text.label",
              description: "app.api.emails.emailService.send.text.description",
              placeholder: "app.api.emails.emailService.send.text.placeholder",
              columns: 12,
              helpText: "app.api.emails.emailService.send.text.description",
            },
            z.string().optional(),
          ),
        },
      ),

      // === SENDER SETTINGS ===
      senderSettings: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.emailService.send.senderSettings.title",
          description:
            "app.api.emails.emailService.send.senderSettings.description",
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { request: "data" },
        {
          senderName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.emails.emailService.send.senderName.label",
              description:
                "app.api.emails.emailService.send.senderName.description",
              placeholder:
                "app.api.emails.emailService.send.senderName.placeholder",
              columns: 12,
            },
            z.string().min(1),
          ),

          replyTo: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.emails.emailService.send.replyTo.label",
              description:
                "app.api.emails.emailService.send.replyTo.description",
              placeholder:
                "app.api.emails.emailService.send.replyTo.placeholder",
              columns: 12,
              helpText: "app.api.emails.emailService.send.replyTo.description",
            },
            z.email().optional(),
          ),
        },
      ),

      // === CAMPAIGN SETTINGS ===
      campaignSettings: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.emailService.send.campaignSettings.title",
          description:
            "app.api.emails.emailService.send.campaignSettings.description",
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { request: "data" },
        {
          campaignType: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.emails.emailService.send.campaignType.label",
              description:
                "app.api.emails.emailService.send.campaignType.description",
              placeholder:
                "app.api.emails.emailService.send.campaignType.placeholder",
              options: CampaignTypeOptions,
              columns: 12,
            },
            z.enum(CampaignType).optional(),
          ),

          unsubscribeUrl: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.URL,
              label: "app.api.emails.emailService.send.unsubscribeUrl.label",
              description:
                "app.api.emails.emailService.send.unsubscribeUrl.description",
              placeholder:
                "app.api.emails.emailService.send.unsubscribeUrl.placeholder",
              columns: 12,
              helpText:
                "app.api.emails.emailService.send.unsubscribeUrl.description",
            },
            z.string().url().optional(),
          ),

          emailJourneyVariant: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.emails.emailService.send.emailJourneyVariant.label",
              description:
                "app.api.emails.emailService.send.emailJourneyVariant.description",
              placeholder:
                "app.api.emails.emailService.send.emailJourneyVariant.placeholder",
              columns: 12,
            },
            z.enum(EmailJourneyVariantDB).optional().nullable(),
          ),

          emailCampaignStage: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.emails.emailService.send.emailCampaignStage.label",
              description:
                "app.api.emails.emailService.send.emailCampaignStage.description",
              placeholder:
                "app.api.emails.emailService.send.emailCampaignStage.placeholder",
              columns: 12,
            },
            z.enum(EmailCampaignStageDB).optional().nullable(),
          ),

          leadId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.emails.emailService.send.leadId.label",
              description:
                "app.api.emails.emailService.send.leadId.description",
              placeholder:
                "app.api.emails.emailService.send.leadId.placeholder",
              columns: 12,
            },
            z.string().optional(),
          ),

          campaignId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.emails.emailService.send.campaignId.label",
              description:
                "app.api.emails.emailService.send.campaignId.description",
              placeholder:
                "app.api.emails.emailService.send.campaignId.placeholder",
              columns: 12,
            },
            z.string().optional(),
          ),
        },
      ),

      // === ADVANCED OPTIONS ===
      advancedOptions: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.emailService.send.advancedOptions.title",
          description:
            "app.api.emails.emailService.send.advancedOptions.description",
          layoutType: LayoutType.STACKED,
        },
        { request: "data" },
        {
          skipRateLimitCheck: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.emails.emailService.send.skipRateLimitCheck.label",
              description:
                "app.api.emails.emailService.send.skipRateLimitCheck.description",
              columns: 12,
              helpText:
                "app.api.emails.emailService.send.skipRateLimitCheck.description",
            },
            z.boolean().optional(),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      result: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.emailService.send.response.result.title",
          description:
            "app.api.emails.emailService.send.response.result.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.emails.emailService.send.response.result.success",
            },
            z.boolean(),
          ),
          messageId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.emailService.send.response.result.messageId.label",
            },
            z.string(),
          ),
          accountId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.emailService.send.response.result.accountId.label",
            },
            z.string(),
          ),
          accountName: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.emailService.send.response.result.accountName.label",
            },
            z.string(),
          ),
          response: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.emailService.send.response.result.response.label",
            },
            z.string(),
          ),
          sentAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.emailService.send.response.result.sentAt",
            },
            z.string(),
          ),
        },
      ),

      deliveryStatus: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.emails.emailService.send.response.deliveryStatus.title",
          description:
            "app.api.emails.emailService.send.response.deliveryStatus.description",
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { response: true },
        {
          accepted: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.emailService.send.response.accepted.title",
            },
            z.array(z.string()),
          ),

          rejected: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.emailService.send.response.rejected.title",
            },
            z.array(z.string()),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.emailService.send.errors.validation.title",
      description:
        "app.api.emails.emailService.send.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.emails.emailService.send.errors.unauthorized.title",
      description:
        "app.api.emails.emailService.send.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.emailService.send.errors.forbidden.title",
      description:
        "app.api.emails.emailService.send.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.emailService.send.errors.notFound.title",
      description:
        "app.api.emails.emailService.send.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.emailService.send.errors.conflict.title",
      description:
        "app.api.emails.emailService.send.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.emailService.send.errors.server.title",
      description: "app.api.emails.emailService.send.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.emailService.send.errors.network.title",
      description:
        "app.api.emails.emailService.send.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.emailService.send.errors.unsavedChanges.title",
      description:
        "app.api.emails.emailService.send.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.emailService.send.errors.unknown.title",
      description:
        "app.api.emails.emailService.send.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.emails.emailService.send.success.title",
    description: "app.api.emails.emailService.send.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        recipientInfo: {
          to: "recipient@example.com",
          toName: "John Doe",
        },
        emailContent: {
          subject: "Welcome to Our Service!",
          html: "<div><h1>Welcome!</h1><p>Thank you for joining us.</p></div>",
          text: "Welcome! Thank you for joining us.",
        },
        senderSettings: {
          senderName: "My App",
          replyTo: "support@example.com",
        },
        campaignSettings: {
          campaignType: CampaignType.TRANSACTIONAL,
        },
        advancedOptions: {},
      },
      withCampaign: {
        recipientInfo: {
          to: "lead@example.com",
          toName: "Potential Customer",
        },
        emailContent: {
          subject: "Special Offer Just for You",
          html: "<div><h2>Limited Time Offer</h2><p>Don't miss out!</p></div>",
          text: "Limited Time Offer - Don't miss out!",
        },
        senderSettings: {
          senderName: "Sales Team",
          replyTo: "sales@example.com",
        },
        campaignSettings: {
          campaignType: CampaignType.LEAD_CAMPAIGN,
          leadId: "lead-123",
          campaignId: "campaign-456",
          unsubscribeUrl: "https://example.com/unsubscribe?token=abc123",
        },
        advancedOptions: {},
      },
      withRejection: {
        recipientInfo: {
          to: "invalid@nonexistent.com",
          toName: "Invalid User",
        },
        emailContent: {
          subject: "Test Email",
          html: "<div><h1>Test</h1><p>This is a test email.</p></div>",
          text: "Test - This is a test email.",
        },
        senderSettings: {
          senderName: "Test App",
          replyTo: "test@example.com",
        },
        campaignSettings: {
          campaignType: CampaignType.TRANSACTIONAL,
        },
        advancedOptions: {},
      },
    },
    responses: {
      default: {
        result: {
          success: true,
          messageId: "msg_1234567890abcdef",
          accountId: "acc_smtp_primary",
          accountName: "Primary SMTP Account",
          response: "250 2.0.0 OK 1640995200 abc123def456",
          sentAt: "2024-01-07T14:30:00.000Z",
        },
        deliveryStatus: {
          accepted: ["recipient@example.com"],
          rejected: [],
        },
      },
      withRejection: {
        result: {
          success: false,
          messageId: "msg_error_123",
          accountId: "acc_smtp_backup",
          accountName: "Backup SMTP Account",
          response: "550 5.1.1 User unknown",
          sentAt: "2024-01-07T14:35:00.000Z",
        },
        deliveryStatus: {
          accepted: [],
          rejected: ["invalid@nonexistent.com"],
        },
      },
      withCampaign: {
        result: {
          success: true,
          messageId: "msg_campaign_789",
          accountId: "acc_smtp_campaign",
          accountName: "Campaign SMTP Account",
          response: "250 2.0.0 OK Campaign 1640995800 xyz789abc",
          sentAt: "2024-01-07T15:00:00.000Z",
        },
        deliveryStatus: {
          accepted: ["lead@example.com"],
          rejected: [],
        },
      },
    },
  },
});

// Export types following migration guide pattern
export type EmailServiceSendPostRequestInput = typeof POST.types.RequestInput;
export type EmailServiceSendPostRequestOutput = typeof POST.types.RequestOutput;
export type EmailServiceSendPostResponseInput = typeof POST.types.ResponseInput;
export type EmailServiceSendPostResponseOutput =
  typeof POST.types.ResponseOutput;

// Export repository types for import standardization
// Repository types for standardized import patterns
export type EmailServiceSendRequestOutput = EmailServiceSendPostRequestOutput;
export type EmailServiceSendResponseOutput = EmailServiceSendPostResponseOutput;

// Legacy compatibility types
export type EmailSendRequestOutput = EmailServiceSendPostRequestOutput;
export type EmailSendResponseOutput = EmailServiceSendPostResponseOutput;

const definitions = {
  POST,
};

export default definitions;
