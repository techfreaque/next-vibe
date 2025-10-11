/**
 * Consultation Schedule Endpoint Definition
 * Enhanced endpoint definition for scheduling consultations
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { ConsultationStatus } from "../enum";

/**
 * Enhanced endpoint definition for consultation scheduling
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "consultation", "schedule"],
  aliases: ["consultation:schedule"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.v1.core.consultation.schedule.title",
  description: "app.api.v1.core.consultation.schedule.description",
  category: "app.api.v1.core.consultation.schedule.category",
  tags: ["app.api.v1.core.consultation.schedule.tag"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.consultation.schedule.title",
      description: "app.api.v1.core.consultation.schedule.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST DATA FIELDS ===
      consultationId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.consultation.schedule.consultationId",
          description:
            "app.api.v1.core.consultation.schedule.consultationIdDetails.description",
          placeholder:
            "app.api.v1.core.consultation.schedule.consultationIdDetails.placeholder",
          layout: { columns: 12 },
        },
        z.string().uuid({
          message:
            "app.api.v1.core.consultation.schedule.errors.validation.consultationId",
        }),
      ),

      scheduledDate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATETIME,
          label: "app.api.v1.core.consultation.schedule.selectTime",
          description:
            "app.api.v1.core.consultation.schedule.scheduledDate.description",
          placeholder:
            "app.api.v1.core.consultation.schedule.scheduledDate.placeholder",
          layout: { columns: 6 },
        },
        z.string().datetime({
          message:
            "app.api.v1.core.consultation.schedule.errors.validation.scheduledDate",
        }),
      ),

      scheduledTime: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TIME,
          label: "app.api.v1.core.consultation.schedule.selectTime",
          description:
            "app.api.v1.core.consultation.schedule.scheduledTime.description",
          placeholder:
            "app.api.v1.core.consultation.schedule.scheduledTime.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      meetingLink: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.URL,
          label: "app.api.v1.core.consultation.schedule.meetingLink",
          description:
            "app.api.v1.core.consultation.schedule.meetingLinkDetails.description",
          placeholder:
            "app.api.v1.core.consultation.schedule.meetingLinkDetails.placeholder",
          layout: { columns: 6 },
        },
        z.string().url().optional(),
      ),

      calendarEventId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.consultation.schedule.calendarEventId",
          description:
            "app.api.v1.core.consultation.schedule.calendarEventIdDetails.description",
          placeholder:
            "app.api.v1.core.consultation.schedule.calendarEventIdDetails.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      icsAttachment: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.consultation.schedule.icsAttachment",
          description:
            "app.api.v1.core.consultation.schedule.icsAttachmentDetails.description",
          placeholder:
            "app.api.v1.core.consultation.schedule.icsAttachmentDetails.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      id: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.consultation.schedule.response.id",
        },
        z.uuid(),
      ),
      status: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.consultation.schedule.response.status",
        },
        z.string(),
      ),
      // Note: The following fields are already defined as request fields above
      // and will be included in the response as well due to { request: "data", response: true }
      isNotified: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.consultation.schedule.response.isNotified",
        },
        z.boolean(),
      ),
      updatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.consultation.schedule.response.updatedAt",
        },
        z.string().datetime(),
      ),
    },
  ),

  examples: {
    requests: {
      default: {
        consultationId: "123e4567-e89b-12d3-a456-426614174000",
        scheduledDate: "2024-01-15T10:00:00.000Z",
        scheduledTime: "10:00",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        calendarEventId: "calendar-event-123",
        icsAttachment: "BEGIN:VCALENDAR...",
      },
    },
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        status: ConsultationStatus.SCHEDULED,
        isNotified: false,
        updatedAt: "2024-01-15T09:00:00.000Z",
      },
    },
    urlPathVariables: undefined,
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.consultation.schedule.errors.validation.title",
      description:
        "app.api.v1.core.consultation.schedule.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.consultation.schedule.errors.notFound.title",
      description:
        "app.api.v1.core.consultation.schedule.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.consultation.schedule.errors.unauthorized.title",
      description:
        "app.api.v1.core.consultation.schedule.errors.unauthorized.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.consultation.schedule.errors.conflict.title",
      description:
        "app.api.v1.core.consultation.schedule.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.consultation.schedule.errors.server.title",
      description:
        "app.api.v1.core.consultation.schedule.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.consultation.schedule.errors.network.title",
      description:
        "app.api.v1.core.consultation.schedule.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.consultation.schedule.errors.forbidden.title",
      description:
        "app.api.v1.core.consultation.schedule.errors.forbidden.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.consultation.schedule.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.consultation.schedule.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.consultation.schedule.errors.unknown.title",
      description:
        "app.api.v1.core.consultation.schedule.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.consultation.schedule.success.title",
    description: "app.api.v1.core.consultation.schedule.success.description",
  },
});

// Extract types using the new enhanced system
export type ConsultationScheduleRequestTypeInput =
  typeof POST.types.RequestInput;
export type ConsultationScheduleRequestTypeOutput =
  typeof POST.types.RequestOutput;
export type ConsultationScheduleResponseTypeInput =
  typeof POST.types.ResponseInput;
export type ConsultationScheduleResponseTypeOutput =
  typeof POST.types.ResponseOutput;

/**
 * Export the endpoint definitions
 */
const scheduleEndpoints = {
  POST,
};

export default scheduleEndpoints;
