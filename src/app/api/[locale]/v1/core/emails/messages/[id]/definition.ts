/**
 * Email by ID API Definition
 * Defines the API endpoint for retrieving a single email by ID
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";
import { EmailStatus, EmailType } from "../enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "emails", "messages", "[id]"],
  title: "app.api.v1.core.emails.messages.id.title",
  description: "app.api.v1.core.emails.messages.id.description",
  category: "app.api.v1.core.emails.messages.category",
  tags: ["app.api.v1.core.emails.messages.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.messages.id.container.title",
      description: "app.api.v1.core.emails.messages.id.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMETER ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.emails.messages.id.fields.id.label",
          description:
            "app.api.v1.core.emails.messages.id.fields.id.description",
          layout: { columns: 12 },
        },
        z.uuid(),
      ),

      // === RESPONSE FIELDS ===
      email: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.emails.messages.id.response.email.title",
          description:
            "app.api.v1.core.emails.messages.id.response.email.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          id: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.emails.messages.id.response.email.id",
            },
            z.uuid(),
          ),
          subject: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.subject",
            },
            z.string(),
          ),
          recipientEmail: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.recipientEmail",
            },
            z.email(),
          ),
          recipientName: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.recipientName",
            },
            z.string().nullable(),
          ),
          senderEmail: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.senderEmail",
            },
            z.email(),
          ),
          senderName: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.senderName",
            },
            z.string().nullable(),
          ),
          type: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.emails.messages.id.response.email.type",
            },
            z.enum(EmailType),
          ),
          status: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.emails.messages.id.response.email.status",
            },
            z.enum(EmailStatus),
          ),
          templateName: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.templateName",
            },
            z.string().nullable(),
          ),
          emailProvider: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.emailProvider",
            },
            z.string().nullable(),
          ),
          externalId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.externalId",
            },
            z.string().nullable(),
          ),
          sentAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.sentAt",
            },
            z.string().datetime().nullable(),
          ),
          deliveredAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.deliveredAt",
            },
            z.string().datetime().nullable(),
          ),
          openedAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.openedAt",
            },
            z.string().datetime().nullable(),
          ),
          clickedAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.clickedAt",
            },
            z.string().datetime().nullable(),
          ),
          retryCount: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.retryCount",
            },
            z.number().int(),
          ),
          error: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.error",
            },
            z.string().nullable(),
          ),
          userId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.userId",
            },
            z.uuid().nullable(),
          ),
          leadId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.leadId",
            },
            z.uuid().nullable(),
          ),
          createdAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.createdAt",
            },
            z.string().datetime(),
          ),
          updatedAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.messages.id.response.email.updatedAt",
            },
            z.string().datetime(),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.emails.messages.id.errors.validation.title",
      description:
        "app.api.v1.core.emails.messages.id.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.emails.messages.id.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.messages.id.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.emails.messages.id.errors.notFound.title",
      description:
        "app.api.v1.core.emails.messages.id.errors.notFound.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.emails.messages.id.errors.forbidden.title",
      description:
        "app.api.v1.core.emails.messages.id.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.emails.messages.id.errors.server.title",
      description:
        "app.api.v1.core.emails.messages.id.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.emails.messages.id.errors.conflict.title",
      description:
        "app.api.v1.core.emails.messages.id.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.emails.messages.id.errors.network.title",
      description:
        "app.api.v1.core.emails.messages.id.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.emails.messages.id.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.emails.messages.id.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.emails.messages.id.errors.unknown.title",
      description:
        "app.api.v1.core.emails.messages.id.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.emails.messages.id.success.title",
    description: "app.api.v1.core.emails.messages.id.success.description",
  },

  // === EXAMPLES ===
  examples: {
    urlPathParams: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        email: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          subject: "Welcome to our service",
          recipientEmail: "john@example.com",
          recipientName: "John Doe",
          senderEmail: "noreply@example.com",
          senderName: "Example Corp",
          type: EmailType.TRANSACTIONAL,
          status: EmailStatus.SENT,
          templateName: "welcome_email",
          emailProvider: "resend",
          externalId: "ext_123456",
          sentAt: "2023-01-01T10:05:00.000Z",
          deliveredAt: "2023-01-01T10:06:00.000Z",
          openedAt: null,
          clickedAt: null,
          retryCount: 0,
          error: null,
          userId: null,
          leadId: "456e7890-e89b-12d3-a456-426614174001",
          createdAt: "2023-01-01T10:00:00.000Z",
          updatedAt: "2023-01-01T10:05:00.000Z",
        },
      },
    },
  },
});

// Export types with consistent naming
export type EmailGetRequestInput = typeof GET.types.RequestInput;
export type EmailGetRequestOutput = typeof GET.types.RequestOutput;
export type EmailGetResponseInput = typeof GET.types.ResponseInput;
export type EmailGetResponseOutput = typeof GET.types.ResponseOutput;
export type EmailGetUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;

// Also export with legacy names for backward compatibility
export type EmailGetGETRequestInput = typeof GET.types.RequestInput;
export type EmailGetGETRequestOutput = typeof GET.types.RequestOutput;
export type EmailGetGETResponseInput = typeof GET.types.ResponseInput;
export type EmailGetGETResponseOutput = typeof GET.types.ResponseOutput;
export type EmailGetGETUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;

// Export commonly expected type name
export type EmailGetResponseType = typeof GET.types.ResponseOutput;

const emailGetEndpoints = { GET };
export default emailGetEndpoints;
