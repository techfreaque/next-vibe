/**
 * SMS Service API Definition
 * Provides centralized SMS sending functionality for email-related notifications
 */

import { z } from "zod";

import { createEndpoint } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/create';
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { CampaignType, CampaignTypeOptions } from "../smtp-client/enum";

/**
 * SMS Send Endpoint Definition (POST)
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "emails", "sms-service"],
  title: "app.api.v1.core.emails.smsService.send.title",
  description: "app.api.v1.core.emails.smsService.send.description",
  category: "app.api.v1.core.emails.category",
  tags: ["app.api.v1.core.emails.smsService.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.smsService.send.container.title",
      description:
        "app.api.v1.core.emails.smsService.send.container.description",
      layoutType: LayoutType.GRID, columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      to: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.PHONE,
          label: "app.api.v1.core.emails.smsService.send.to.label",
          description: "app.api.v1.core.emails.smsService.send.to.description",
          placeholder: "app.api.v1.core.emails.smsService.send.to.placeholder",
          columns: 6,
        },
        z.string().min(1),
      ),

      message: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.emails.smsService.send.message.label",
          description:
            "app.api.v1.core.emails.smsService.send.message.description",
          placeholder:
            "app.api.v1.core.emails.smsService.send.message.placeholder",
          columns: 12,
        },
        z.string().min(1).max(1600),
      ),

      campaignType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.smsService.send.campaignType.label",
          description:
            "app.api.v1.core.emails.smsService.send.campaignType.description",
          placeholder:
            "app.api.v1.core.emails.smsService.send.campaignType.placeholder",
          columns: 6,
          options: CampaignTypeOptions,
        },
        z.enum(CampaignType).optional(),
      ),

      leadId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.emails.smsService.send.leadId.label",
          description:
            "app.api.v1.core.emails.smsService.send.leadId.description",
          placeholder:
            "app.api.v1.core.emails.smsService.send.leadId.placeholder",
          columns: 6,
        },
        z.string().optional(),
      ),

      templateName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.emails.smsService.send.templateName.label",
          description:
            "app.api.v1.core.emails.smsService.send.templateName.description",
          placeholder:
            "app.api.v1.core.emails.smsService.send.templateName.placeholder",
          columns: 6,
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      result: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.emails.smsService.send.response.result.title",
          description:
            "app.api.v1.core.emails.smsService.send.response.result.description",
          layoutType: LayoutType.GRID, columns: 12,
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.emails.smsService.send.response.result.success",
            },
            z.boolean(),
          ),
          messageId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smsService.send.response.result.messageId",
            },
            z.string(),
          ),
          sentAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smsService.send.response.result.sentAt",
            },
            z.string(),
          ),
          provider: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smsService.send.response.result.provider",
            },
            z.string().optional(),
          ),
          cost: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.smsService.send.response.result.cost",
            },
            z.number().optional(),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.emails.smsService.send.errors.validation.title",
      description:
        "app.api.v1.core.emails.smsService.send.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.emails.smsService.send.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.smsService.send.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.emails.smsService.send.errors.forbidden.title",
      description:
        "app.api.v1.core.emails.smsService.send.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.emails.smsService.send.errors.conflict.title",
      description:
        "app.api.v1.core.emails.smsService.send.errors.conflict.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.emails.smsService.send.errors.notFound.title",
      description:
        "app.api.v1.core.emails.smsService.send.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.emails.smsService.send.errors.network.title",
      description:
        "app.api.v1.core.emails.smsService.send.errors.network.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.emails.smsService.send.errors.server.title",
      description:
        "app.api.v1.core.emails.smsService.send.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.emails.smsService.send.errors.unknown.title",
      description:
        "app.api.v1.core.emails.smsService.send.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.emails.smsService.send.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.emails.smsService.send.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.emails.smsService.send.success.title",
    description: "app.api.v1.core.emails.smsService.send.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        to: "+1234567890",
        message: "Your verification code is 123456",
        campaignType: CampaignType.TRANSACTIONAL,
        leadId: "lead-123",
        templateName: "verification-code",
      },
    },
    responses: {
      default: {
        result: {
          success: true,
          messageId: "msg-456789",
          sentAt: "2024-01-07T12:00:00.000Z",
          provider: "twilio",
          cost: 0.0075,
        },
      },
    },
  },
});

// Export types following migration guide pattern
export type SmsSendPostRequestInput = typeof POST.types.RequestInput;
export type SmsSendPostRequestOutput = typeof POST.types.RequestOutput;
export type SmsSendPostResponseInput = typeof POST.types.ResponseInput;
export type SmsSendPostResponseOutput = typeof POST.types.ResponseOutput;

// Export repository types for import standardization
export type SmsSendRequestOutput = SmsSendPostRequestOutput;
export type SmsSendResponseOutput = SmsSendPostResponseOutput;

const definitions = {
  POST,
};

export default definitions;
