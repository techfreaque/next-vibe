/**
 * Email Send API Route Definition
 * Defines endpoint for sending emails with optional SMS notifications
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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
import { scopedTranslation } from "./i18n";

// No separate z.object() schemas needed - use field definitions directly

/**
 * Email Send Endpoint Definition
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["emails", "send"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.email",
  icon: "mail",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    description: "container.description",
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // === EMAIL RECIPIENT ===
      recipient: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "recipient.title",
        description: "recipient.description",
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          to: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.EMAIL,
            label: "to.label",
            description: "to.description",
            placeholder: "to.placeholder",
            columns: 12,
            schema: z.email(),
          }),

          toName: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "toName.label",
            description: "toName.description",
            placeholder: "toName.placeholder",
            columns: 12,
            schema: z.string().optional(),
          }),
        },
      }),

      // === EMAIL CONTENT ===
      emailContent: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "emailContent.title",
        description: "emailContent.description",
        layoutType: LayoutType.STACKED,
        usage: { request: "data" },
        children: {
          subject: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "subject.label",
            description: "subject.description",
            placeholder: "subject.placeholder",
            columns: 12,
            schema: z.string().min(1),
          }),

          html: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label: "html.label",
            description: "html.description",
            placeholder: "html.placeholder",
            columns: 12,
            schema: z.string().min(1),
          }),

          text: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label: "text.label",
            description: "text.description",
            placeholder: "text.placeholder",
            columns: 12,
            schema: z.string().optional(),
          }),
        },
      }),

      // === SENDER SETTINGS ===
      senderSettings: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "senderSettings.title",
        description: "senderSettings.description",
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          senderName: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "senderName.label",
            description: "senderName.description",
            placeholder: "senderName.placeholder",
            columns: 6,
            schema: z.string().min(1),
          }),

          replyTo: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.EMAIL,
            label: "replyTo.label",
            description: "replyTo.description",
            placeholder: "replyTo.placeholder",
            columns: 6,
            schema: z.email().optional(),
          }),
        },
      }),

      // === CAMPAIGN & TRACKING ===
      campaignTracking: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "groups.campaignTracking.title",
        description: "groups.campaignTracking.description",
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          campaignType: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "campaignType.label",
            description: "campaignType.description",
            placeholder: "campaignType.placeholder",
            columns: 6,
            options: CampaignTypeOptions,
            schema: z.enum(CampaignType).optional(),
          }),

          leadId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "leadId.label",
            description: "leadId.description",
            placeholder: "leadId.placeholder",
            columns: 6,
            schema: z.string().optional(),
          }),
        },
      }),

      // === SMS NOTIFICATIONS ===
      smsNotifications: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "groups.smsNotifications.title",
        description: "groups.smsNotifications.description",
        layoutType: LayoutType.STACKED,
        usage: { request: "data" },
        children: {
          sendSmsNotification: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "sendSmsNotification.label",
            description: "sendSmsNotification.description",
            columns: 12,
            schema: z.boolean().default(false),
          }),

          smsPhoneNumber: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEL,
            label: "smsPhoneNumber.label",
            description: "smsPhoneNumber.description",
            placeholder: "smsPhoneNumber.placeholder",
            columns: 12,
            schema: z.string().optional(),
          }),

          smsMessage: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label: "smsMessage.label",
            description: "smsMessage.description",
            placeholder: "smsMessage.placeholder",
            columns: 12,
            schema: z.string().max(160).optional(),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      response: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.title",
        description: "response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          // === EMAIL DELIVERY STATUS ===
          deliveryStatus: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.deliveryStatus.title",
            layoutType: LayoutType.GRID_2_COLUMNS,
            usage: { response: true },
            children: {
              success: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.success.label",
                schema: z.boolean(),
              }),
              messageId: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.messageId.label",
                schema: z.string(),
              }),
              sentAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.sentAt.label",
                schema: z.string(),
              }),
              response: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.response.label",
                schema: z.string(),
              }),
            },
          }),

          // === ACCOUNT INFO ===
          accountInfo: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.accountInfo.title",
            layoutType: LayoutType.GRID_2_COLUMNS,
            usage: { response: true },
            children: {
              accountId: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.accountId.label",
                schema: z.string(),
              }),
              accountName: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.accountName.label",
                schema: z.string(),
              }),
            },
          }),

          // === DELIVERY RESULTS ===
          deliveryResults: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.deliveryResults.title",
            layoutType: LayoutType.GRID_2_COLUMNS,
            usage: { response: true },
            children: {
              accepted: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.accepted.label",
                schema: z.array(z.string()),
              }),
              rejected: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.rejected.label",
                schema: z.array(z.string()),
              }),
            },
          }),

          // === SMS NOTIFICATION RESULT ===
          smsResult: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.smsResult.title",
            description: "response.smsResult.description",
            layoutType: LayoutType.GRID_2_COLUMNS,
            usage: { response: true },
            children: {
              success: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.smsResult.success",
                schema: z.boolean(),
              }),
              messageId: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.smsResult.messageId.label",
                schema: z.string().optional(),
              }),
              sentAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.smsResult.sentAt.label",
                schema: z.string().optional(),
              }),
              provider: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.smsResult.provider",
                schema: z.string().optional(),
              }),
              error: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.smsResult.error.label",
                schema: z.string().optional(),
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
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
