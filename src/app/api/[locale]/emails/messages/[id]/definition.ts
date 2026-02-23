/**
 * Email by ID API Definition
 * Defines the API endpoint for retrieving a single email by ID
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestUrlPathParamsField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { dateSchema } from "../../../shared/types/common.schema";
import { UserRole } from "../../../user/user-roles/enum";
import { EmailStatus, EmailType } from "../enum";
import { scopedTranslation } from "./i18n";
import { EmailDetailContainer } from "./widget";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "messages", "[id]"],
  title: "title",
  description: "description",
  category: "category",
  icon: "message-square",
  tags: ["tags.emails"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: EmailDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "urlPathParams", response: true },
      }),
      // === URL PARAMETER ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.id.label",
        description: "fields.id.description",
        columns: 12,
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      email: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.email.title",
        description: "response.email.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          id: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.id",
            schema: z.uuid(),
          }),
          subject: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.subject",
            schema: z.string(),
          }),
          recipientEmail: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.recipientEmail",
            schema: z.email(),
          }),
          recipientName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.recipientName",
            schema: z.string().nullable(),
          }),
          senderEmail: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.senderEmail",
            schema: z.email(),
          }),
          senderName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.senderName",
            schema: z.string().nullable(),
          }),
          type: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "response.email.type",
            schema: z.enum(EmailType),
          }),
          status: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "response.email.status",
            schema: z.enum(EmailStatus),
          }),
          templateName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.templateName",
            schema: z.string().nullable(),
          }),
          emailProvider: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.emailProvider",
            schema: z.string().nullable(),
          }),
          externalId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.externalId",
            schema: z.string().nullable(),
          }),
          sentAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.sentAt",
            schema: dateSchema.nullable(),
          }),
          deliveredAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.deliveredAt",
            schema: dateSchema.nullable(),
          }),
          openedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.openedAt",
            schema: dateSchema.nullable(),
          }),
          clickedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.clickedAt",
            schema: dateSchema.nullable(),
          }),
          retryCount: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.retryCount",
            schema: z.coerce.number().int(),
          }),
          error: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.error",
            schema: z.string().nullable(),
          }),
          userId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.userId",
            schema: z.uuid().nullable(),
          }),
          leadId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.leadId",
            schema: z.uuid().nullable(),
          }),
          createdAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.createdAt",
            schema: dateSchema,
          }),
          updatedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.updatedAt",
            schema: dateSchema,
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
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
