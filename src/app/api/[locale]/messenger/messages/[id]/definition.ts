/**
 * Email by ID API Definition
 * Defines the API endpoint for retrieving a single email by ID
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  objectField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { dateSchema } from "../../../shared/types/common.schema";
import { UserRole } from "../../../user/user-roles/enum";
import { MessageStatus, MessageType } from "../enum";
import { scopedTranslation } from "./i18n";
import { EmailDetailContainer } from "./widget";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["messenger", "messages", "[id]"],
  title: "title",
  description: "description",
  category: "endpointCategories.messenger",
  subCategory: "endpointCategories.messengerMessages",
  icon: "message-square",
  tags: ["tags.emails"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: EmailDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "urlPathParams", response: true },
      }),
      // === URL PARAMETER ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.id.label",
        description: "fields.id.description",
        columns: 12,
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      email: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.email.title",
        description: "response.email.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.id",
            schema: z.uuid(),
          }),
          subject: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.subject",
            schema: z.string(),
          }),
          recipientEmail: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.recipientEmail",
            schema: z.email(),
          }),
          recipientName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.recipientName",
            schema: z.string().nullable(),
          }),
          senderEmail: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.senderEmail",
            schema: z.email(),
          }),
          senderName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.senderName",
            schema: z.string().nullable(),
          }),
          type: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "response.email.type",
            schema: z.enum(MessageType),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "response.email.status",
            schema: z.enum(MessageStatus),
          }),
          templateName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.templateName",
            schema: z.string().nullable(),
          }),
          sentAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.sentAt",
            schema: dateSchema.nullable(),
          }),
          deliveredAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.deliveredAt",
            schema: dateSchema.nullable(),
          }),
          openedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.openedAt",
            schema: dateSchema.nullable(),
          }),
          clickedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.clickedAt",
            schema: dateSchema.nullable(),
          }),
          retryCount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.retryCount",
            schema: z.coerce.number().int(),
          }),
          error: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.error",
            schema: z.string().nullable(),
          }),
          userId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.userId",
            schema: z.uuid().nullable(),
          }),
          leadId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.leadId",
            schema: z.uuid().nullable(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.email.createdAt",
            schema: dateSchema,
          }),
          updatedAt: responseField(scopedTranslation, {
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
          type: MessageType.TRANSACTIONAL,
          status: MessageStatus.SENT,
          templateName: "welcome_email",
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
