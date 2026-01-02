/**
 * Email Send API Route Definition
 * Defines endpoint for sending emails with optional SMS notifications
 */

import { z } from "zod";

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

// No separate z.object() schemas needed - use field definitions directly

/**
 * Email Send Endpoint Definition
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["emails", "send"],
  title: "app.api.emails.send.title",
  description: "app.api.emails.send.description",
  category: "app.api.emails.category",
  icon: "mail",
  tags: ["app.api.emails.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.send.container.title",
      description: "app.api.emails.send.container.description",
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === EMAIL RECIPIENT ===
      recipient: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.send.recipient.title",
          description: "app.api.emails.send.recipient.description",
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { request: "data" },
        {
          to: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.emails.send.to.label",
              description: "app.api.emails.send.to.description",
              placeholder: "app.api.emails.send.to.placeholder",
              columns: 12,
            },
            z.email(),
          ),

          toName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.emails.send.toName.label",
              description: "app.api.emails.send.toName.description",
              placeholder: "app.api.emails.send.toName.placeholder",
              columns: 12,
            },
            z.string().optional(),
          ),
        },
      ),

      // === EMAIL CONTENT ===
      emailContent: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.send.emailContent.title",
          description: "app.api.emails.send.emailContent.description",
          layoutType: LayoutType.STACKED,
        },
        { request: "data" },
        {
          subject: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.emails.send.subject.label",
              description: "app.api.emails.send.subject.description",
              placeholder: "app.api.emails.send.subject.placeholder",
              columns: 12,
            },
            z.string().min(1),
          ),

          html: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label: "app.api.emails.send.html.label",
              description: "app.api.emails.send.html.description",
              placeholder: "app.api.emails.send.html.placeholder",
              columns: 12,
            },
            z.string().min(1),
          ),

          text: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label: "app.api.emails.send.text.label",
              description: "app.api.emails.send.text.description",
              placeholder: "app.api.emails.send.text.placeholder",
              columns: 12,
            },
            z.string().optional(),
          ),
        },
      ),

      // === SENDER SETTINGS ===
      senderSettings: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.send.senderSettings.title",
          description: "app.api.emails.send.senderSettings.description",
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { request: "data" },
        {
          senderName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.emails.send.senderName.label",
              description: "app.api.emails.send.senderName.description",
              placeholder: "app.api.emails.send.senderName.placeholder",
              columns: 6,
            },
            z.string().min(1),
          ),

          replyTo: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.emails.send.replyTo.label",
              description: "app.api.emails.send.replyTo.description",
              placeholder: "app.api.emails.send.replyTo.placeholder",
              columns: 6,
            },
            z.email().optional(),
          ),
        },
      ),

      // === CAMPAIGN & TRACKING ===
      campaignTracking: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.send.groups.campaignTracking.title",
          description: "app.api.emails.send.groups.campaignTracking.description",
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { request: "data" },
        {
          campaignType: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.emails.send.campaignType.label",
              description: "app.api.emails.send.campaignType.description",
              placeholder: "app.api.emails.send.campaignType.placeholder",
              columns: 6,
              options: CampaignTypeOptions,
            },
            z.enum(CampaignType).optional(),
          ),

          leadId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.emails.send.leadId.label",
              description: "app.api.emails.send.leadId.description",
              placeholder: "app.api.emails.send.leadId.placeholder",
              columns: 6,
            },
            z.string().optional(),
          ),
        },
      ),

      // === SMS NOTIFICATIONS ===
      smsNotifications: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.send.groups.smsNotifications.title",
          description: "app.api.emails.send.groups.smsNotifications.description",
          layoutType: LayoutType.STACKED,
        },
        { request: "data" },
        {
          sendSmsNotification: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.emails.send.sendSmsNotification.label",
              description: "app.api.emails.send.sendSmsNotification.description",
              columns: 12,
            },
            z.boolean().default(false),
          ),

          smsPhoneNumber: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PHONE,
              label: "app.api.emails.send.smsPhoneNumber.label",
              description: "app.api.emails.send.smsPhoneNumber.description",
              placeholder: "app.api.emails.send.smsPhoneNumber.placeholder",
              columns: 12,
            },
            z.string().optional(),
          ),

          smsMessage: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label: "app.api.emails.send.smsMessage.label",
              description: "app.api.emails.send.smsMessage.description",
              placeholder: "app.api.emails.send.smsMessage.placeholder",
              columns: 12,
            },
            z.string().max(160).optional(),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.send.response.title",
          description: "app.api.emails.send.response.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          // === EMAIL DELIVERY STATUS ===
          deliveryStatus: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.emails.send.response.deliveryStatus.title",
              layoutType: LayoutType.GRID_2_COLUMNS,
            },
            { response: true },
            {
              success: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.emails.send.response.success.label",
                },
                z.boolean(),
              ),
              messageId: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.emails.send.response.messageId.label",
                },
                z.string(),
              ),
              sentAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.emails.send.response.sentAt.label",
                },
                z.string(),
              ),
              response: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.emails.send.response.response.label",
                },
                z.string(),
              ),
            },
          ),

          // === ACCOUNT INFO ===
          accountInfo: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.emails.send.response.accountInfo.title",
              layoutType: LayoutType.GRID_2_COLUMNS,
            },
            { response: true },
            {
              accountId: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.emails.send.response.accountId.label",
                },
                z.string(),
              ),
              accountName: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.emails.send.response.accountName.label",
                },
                z.string(),
              ),
            },
          ),

          // === DELIVERY RESULTS ===
          deliveryResults: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.emails.send.response.deliveryResults.title",
              layoutType: LayoutType.GRID_2_COLUMNS,
            },
            { response: true },
            {
              accepted: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.emails.send.response.accepted.label",
                },
                z.array(z.string()),
              ),
              rejected: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.emails.send.response.rejected.label",
                },
                z.array(z.string()),
              ),
            },
          ),

          // === SMS NOTIFICATION RESULT ===
          smsResult: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.emails.send.response.smsResult.title",
              description: "app.api.emails.send.response.smsResult.description",
              layoutType: LayoutType.GRID_2_COLUMNS,
            },
            { response: true },
            {
              success: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.emails.send.response.smsResult.success",
                },
                z.boolean(),
              ),
              messageId: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.emails.send.response.smsResult.messageId.label",
                },
                z.string().optional(),
              ),
              sentAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.emails.send.response.smsResult.sentAt.label",
                },
                z.string().optional(),
              ),
              provider: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.emails.send.response.smsResult.provider",
                },
                z.string().optional(),
              ),
              error: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.emails.send.response.smsResult.error.label",
                },
                z.string().optional(),
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
      title: "app.api.emails.send.errors.validation.title",
      description: "app.api.emails.send.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.emails.send.errors.unauthorized.title",
      description: "app.api.emails.send.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.send.errors.server.title",
      description: "app.api.emails.send.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.send.errors.unknown.title",
      description: "app.api.emails.send.errors.unknown.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.send.errors.forbidden.title",
      description: "app.api.emails.send.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.send.errors.network.title",
      description: "app.api.emails.send.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.send.errors.notFound.title",
      description: "app.api.emails.send.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.send.errors.conflict.title",
      description: "app.api.emails.send.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.send.errors.unsavedChanges.title",
      description: "app.api.emails.send.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.emails.send.success.title",
    description: "app.api.emails.send.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        recipient: {
          to: "user@example.com",
          toName: "John Doe",
        },
        emailContent: {
          subject: "Test Email",
          html: "<p>Hello World!</p>",
          text: "Hello World!",
        },
        senderSettings: {
          senderName: "Test App",
          replyTo: "noreply@example.com",
        },
        campaignTracking: {},
        smsNotifications: {
          sendSmsNotification: false,
        },
      },
      withSms: {
        recipient: {
          to: "user@example.com",
          toName: "Jane Smith",
        },
        emailContent: {
          subject: "Important Email",
          html: "<p>Important message</p>",
          text: "Important message",
        },
        senderSettings: {
          senderName: "Test App",
        },
        campaignTracking: {
          campaignType: CampaignType.NEWSLETTER,
          leadId: "lead_123456",
        },
        smsNotifications: {
          sendSmsNotification: true,
          smsPhoneNumber: "+1234567890",
          smsMessage: "You have received an important email",
        },
      },
      minimal: {
        recipient: {
          to: "test@example.com",
        },
        emailContent: {
          subject: "Simple Test",
          html: "<p>Simple test message</p>",
        },
        senderSettings: {
          senderName: "Test System",
        },
        campaignTracking: {},
        smsNotifications: {
          sendSmsNotification: false,
        },
      },
      withError: {
        recipient: {
          to: "invalid@example.com",
        },
        emailContent: {
          subject: "Test Error",
          html: "<p>This should fail</p>",
        },
        senderSettings: {
          senderName: "Test System",
        },
        campaignTracking: {},
        smsNotifications: {
          sendSmsNotification: false,
        },
      },
    },
    responses: {
      default: {
        response: {
          deliveryStatus: {
            success: true,
            messageId: "msg_123456789",
            sentAt: "2024-01-07T12:00:00.000Z",
            response: "250 OK: Message accepted",
          },
          accountInfo: {
            accountId: "acc_primary",
            accountName: "Primary SMTP",
          },
          deliveryResults: {
            accepted: ["user@example.com"],
            rejected: [],
          },
          smsResult: {
            success: false,
            error: "SMS notifications disabled",
          },
        },
      },
      withSms: {
        response: {
          deliveryStatus: {
            success: true,
            messageId: "msg_123456789",
            sentAt: "2024-01-07T12:00:00.000Z",
            response: "250 OK: Message accepted",
          },
          accountInfo: {
            accountId: "acc_primary",
            accountName: "Primary SMTP",
          },
          deliveryResults: {
            accepted: ["user@example.com"],
            rejected: [],
          },
          smsResult: {
            success: true,
            messageId: "sms_987654321",
            sentAt: "2024-01-07T12:00:30.000Z",
            provider: "twilio",
          },
        },
      },
      withError: {
        response: {
          deliveryStatus: {
            success: false,
            messageId: "msg_failed_123",
            sentAt: "2024-01-07T12:00:00.000Z",
            response: "550 Error: Invalid recipient",
          },
          accountInfo: {
            accountId: "acc_primary",
            accountName: "Primary SMTP",
          },
          deliveryResults: {
            accepted: [],
            rejected: ["invalid@example.com"],
          },
          smsResult: {
            success: false,
            error: "Email delivery failed - SMS not sent",
          },
        },
      },
      minimal: {
        response: {
          deliveryStatus: {
            success: true,
            messageId: "msg_min_123",
            sentAt: "2024-01-07T12:00:00.000Z",
            response: "250 OK: Message accepted",
          },
          accountInfo: {
            accountId: "acc_primary",
            accountName: "Primary SMTP",
          },
          deliveryResults: {
            accepted: ["test@example.com"],
            rejected: [],
          },
          smsResult: {
            success: false,
            error: "SMS notifications disabled",
          },
        },
      },
    },
  },
});

export type EmailSendRequestInput = typeof POST.types.RequestInput;
export type EmailSendRequestOutput = typeof POST.types.RequestOutput;
export type EmailSendResponseInput = typeof POST.types.ResponseInput;
export type EmailSendResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
