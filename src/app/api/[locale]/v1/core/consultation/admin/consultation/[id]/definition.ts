/**
 * Consultation by ID API Definition
 * Defines the API endpoint for retrieving and updating a single consultation by ID
 */

import { z } from "zod";

import { leadId } from "@/app/api/[locale]/v1/core/leads/definition";
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
  requestUrlParamsField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { ConsultationStatus, ConsultationStatusOptions } from "../../../enum";

/**
 * Get Consultation by ID Endpoint (GET)
 * Retrieves a specific consultation by ID
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "consultation", "admin", "consultation", ":id"],
  title: "app.api.v1.core.consultation.admin.consultation.id.get.title",
  description:
    "app.api.v1.core.consultation.admin.consultation.id.get.description",
  category: "app.api.v1.core.consultation.admin.consultation.id.get.category",
  tags: ["app.api.v1.core.consultation.admin.consultation.id.get.tag"],
  allowedRoles: [UserRole.ADMIN],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.consultation.admin.consultation.id.get.container.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.get.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "urlParams", response: true },
    {
      // URL parameter
      id: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.id.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.id.description",
          layout: { columns: 12 },
        },
        z.uuid(),
      ),

      // Response fields
      userId: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.userId.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.userId.description",
          layout: { columns: 6 },
        },
        z.uuid().nullable(),
      ),

      leadId: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.leadId.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.leadId.description",
          layout: { columns: 6 },
        },
        leadId.nullable(),
      ),

      status: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.status.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.status.description",
          options: ConsultationStatusOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(ConsultationStatus),
      ),

      message: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.message.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.message.description",
          layout: { columns: 12 },
        },
        z.string().nullable(),
      ),

      userEmail: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.userEmail.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.userEmail.description",
          layout: { columns: 6 },
        },
        z.email().nullable(),
      ),

      userName: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.userName.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.userName.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      userBusinessType: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.userBusinessType.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.userBusinessType.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      userContactPhone: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.PHONE,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.userContactPhone.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.userContactPhone.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      preferredDate: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.preferredDate.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.preferredDate.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      preferredTime: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TIME,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.preferredTime.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.preferredTime.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      scheduledDate: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.scheduledDate.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.scheduledDate.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      scheduledTime: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TIME,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.scheduledTime.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.scheduledTime.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      calendarEventId: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.calendarEventId.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.calendarEventId.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      meetingLink: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.URL,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.meetingLink.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.meetingLink.description",
          layout: { columns: 6 },
        },
        z.string().url().nullable(),
      ),

      icsAttachment: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.icsAttachment.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.icsAttachment.description",
          layout: { columns: 12 },
        },
        z.string().nullable(),
      ),

      isNotified: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.isNotified.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.isNotified.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      createdAt: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATETIME,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.get.createdAt.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.get.createdAt.description",
          layout: { columns: 6 },
        },
        z.string(),
      ),
    },
  ),
  examples: {
    responses: {
      default: {
        userId: "456e7890-e89b-12d3-a456-426614174001",
        leadId: null,
        status: ConsultationStatus.SCHEDULED,
        message: "Looking forward to our consultation!",
        userEmail: "john@example.com",
        userName: "John Doe",
        userBusinessType: "Software Development",
        userContactPhone: "+1-555-0123",
        preferredDate: "2024-01-15",
        preferredTime: "14:00",
        scheduledDate: "2024-01-15",
        scheduledTime: "14:30",
        calendarEventId: "cal_123456789",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        icsAttachment: "BEGIN:VCALENDAR...",
        isNotified: true,
        createdAt: "2024-01-10T10:00:00Z",
      },
    },
    urlPathVariables: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.validation.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.network.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.forbidden.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.notFound.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.server.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.unknown.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.conflict.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.get.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.v1.core.consultation.admin.consultation.id.get.success.title",
    description:
      "app.api.v1.core.consultation.admin.consultation.id.get.success.description",
  },
});

// Export schemas and types
export const consultationGetRequestSchema = GET.requestSchema;
export const consultationGetResponseSchema = GET.responseSchema;
export const consultationGetUrlSchema = GET.requestSchema;

export type ConsultationGetRequestTypeInput = typeof GET.types.RequestInput;
export type ConsultationGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type ConsultationGetResponseTypeInput = typeof GET.types.ResponseInput;
export type ConsultationGetResponseTypeOutput = typeof GET.types.ResponseOutput;
export type ConsultationGetUrlVariablesTypeInput =
  typeof GET.types.UrlVariablesInput;
export type ConsultationGetUrlVariablesTypeOutput =
  typeof GET.types.UrlVariablesOutput;

/**
 * Update Consultation Endpoint (PATCH)
 * Updates a specific consultation
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["v1", "core", "consultation", "admin", "consultation", ":id"],
  title: "app.api.v1.core.consultation.admin.consultation.id.patch.title",
  description:
    "app.api.v1.core.consultation.admin.consultation.id.patch.description",
  category: "app.api.v1.core.consultation.admin.consultation.id.patch.category",
  tags: ["app.api.v1.core.consultation.admin.consultation.id.patch.tag"],
  allowedRoles: [UserRole.ADMIN],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.consultation.admin.consultation.id.patch.container.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.patch.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data&urlParams", response: true },
    {
      // URL parameter
      id: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.id.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.id.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.id.patch.id.placeholder",
          layout: { columns: 12 },
        },
        z.uuid(),
      ),

      // Request data fields for PATCH
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.status.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.status.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.id.patch.status.placeholder",
          options: ConsultationStatusOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(ConsultationStatus).optional(),
      ),

      scheduledDate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATETIME,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.scheduledDate.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.scheduledDate.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.id.patch.scheduledDate.placeholder",
          layout: { columns: 6 },
        },
        z.string().datetime().nullable().optional(),
      ),

      scheduledTime: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TIME,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.scheduledTime.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.scheduledTime.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.id.patch.scheduledTime.placeholder",
          layout: { columns: 6 },
        },
        z.string().nullable().optional(),
      ),

      calendarEventId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.calendarEventId.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.calendarEventId.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.id.patch.calendarEventId.placeholder",
          layout: { columns: 6 },
        },
        z.string().nullable().optional(),
      ),

      meetingLink: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.URL,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.meetingLink.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.meetingLink.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.id.patch.meetingLink.placeholder",
          layout: { columns: 6 },
        },
        z.string().nullable().optional(),
      ),

      icsAttachment: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.icsAttachment.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.icsAttachment.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.id.patch.icsAttachment.placeholder",
          layout: { columns: 12 },
        },
        z.string().nullable().optional(),
      ),

      isNotified: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.isNotified.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.isNotified.description",
          layout: { columns: 6 },
        },
        z.boolean().optional(),
      ),

      message: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.message.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.message.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.id.patch.message.placeholder",
          layout: { columns: 12 },
        },
        z.string().nullable().optional(),
      ),

      // Response fields (fields not being updated in request)
      userId: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.userId.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.userId.description",
          layout: { columns: 6 },
        },
        z.uuid().nullable(),
      ),

      leadId: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.leadId.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.leadId.description",
          layout: { columns: 6 },
        },
        leadId.nullable(),
      ),

      userEmail: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.userEmail.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.userEmail.description",
          layout: { columns: 6 },
        },
        z.email().nullable(),
      ),

      userName: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.id.patch.userName.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.id.patch.userName.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),
    },
  ),
  examples: {
    requests: {
      default: {
        status: ConsultationStatus.SCHEDULED,
        scheduledDate: new Date("2023-01-15T10:00:00.000Z").toISOString(),
        scheduledTime: "10:00",
        meetingLink: "https://meet.example.com/consultation-123",
        message: "Looking forward to our consultation!",
        isNotified: true,
      },
    },
    responses: {
      default: {
        userId: "456e7890-e89b-12d3-a456-426614174001",
        leadId: null,
        userEmail: "john@example.com",
        userName: "John Doe",
      },
    },
    urlPathVariables: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.validation.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.network.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.unauthorized.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.forbidden.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.notFound.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.server.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.unknown.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.conflict.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.id.patch.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.v1.core.consultation.admin.consultation.id.patch.success.title",
    description:
      "app.api.v1.core.consultation.admin.consultation.id.patch.success.description",
  },
});

export type ConsultationUpdateRequestTypeInput =
  typeof PATCH.types.RequestInput;
export type ConsultationUpdateRequestTypeOutput =
  typeof PATCH.types.RequestOutput;
export type ConsultationUpdateResponseTypeInput =
  typeof PATCH.types.ResponseInput;
export type ConsultationUpdateResponseTypeOutput =
  typeof PATCH.types.ResponseOutput;
export type ConsultationUpdateUrlVariablesTypeInput =
  typeof PATCH.types.UrlVariablesInput;
export type ConsultationUpdateUrlVariablesTypeOutput =
  typeof PATCH.types.UrlVariablesOutput;

const consultationGetEndpoints = {
  GET,
  PATCH,
} as const;

export default consultationGetEndpoints;
