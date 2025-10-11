/**
 * Consultation Availability Endpoint Definition
 * Enhanced endpoint definition for checking consultation availability
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
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Enhanced endpoint definition for consultation availability
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "consultation", "availability"],
  aliases: ["consultation:availability"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.v1.core.consultation.availability.title",
  description: "app.api.v1.core.consultation.availability.description",
  category: "app.api.v1.core.consultation.list.category",
  tags: ["app.api.v1.core.consultation.create.tag"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.consultation.availability.form.title",
      description: "app.api.v1.core.consultation.availability.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST DATA FIELDS ===
      startDate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.consultation.availability.startDate.label",
          description:
            "app.api.v1.core.consultation.availability.startDate.description",
          placeholder:
            "app.api.v1.core.consultation.availability.startDate.placeholder",
          layout: { columns: 6 },
        },
        z.string().datetime({
          message:
            "app.api.v1.core.consultation.availability.errors.validation.message",
        }),
      ),

      endDate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.consultation.availability.endDate.label",
          description:
            "app.api.v1.core.consultation.availability.endDate.description",
          placeholder:
            "app.api.v1.core.consultation.availability.endDate.placeholder",
          layout: { columns: 6 },
        },
        z.string().datetime({
          message:
            "app.api.v1.core.consultation.availability.errors.validation.message",
        }),
      ),

      slotDurationMinutes: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.consultation.availability.slotDuration.label",
          description:
            "app.api.v1.core.consultation.availability.slotDuration.description",
          placeholder:
            "app.api.v1.core.consultation.availability.slotDuration.placeholder",
          layout: { columns: 4 },
        },
        z.number().min(15).max(480).default(60).optional(),
      ),

      // === RESPONSE FIELDS ===
      slots: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "start",
              label:
                "app.api.v1.core.consultation.availability.response.slots.start",
              type: FieldDataType.DATE,
              sortable: true,
            },
            {
              key: "end",
              label:
                "app.api.v1.core.consultation.availability.response.slots.end",
              type: FieldDataType.DATE,
              sortable: true,
            },
            {
              key: "available",
              label:
                "app.api.v1.core.consultation.availability.response.slots.available",
              type: FieldDataType.BOOLEAN,
              sortable: true,
            },
          ],
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.consultation.availability.response.slots.title",
            description:
              "app.api.v1.core.consultation.availability.response.slots.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            start: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.availability.response.slots.start",
              },
              z.date(),
            ),
            end: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.availability.response.slots.end",
              },
              z.date(),
            ),
            available: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.consultation.availability.response.slots.available",
              },
              z.boolean(),
            ),
          },
        ),
      ),
      timezone: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.consultation.availability.response.timezone",
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.consultation.availability.errors.validation.title",
      description:
        "app.api.v1.core.consultation.availability.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.consultation.availability.errors.unauthorized.title",
      description:
        "app.api.v1.core.consultation.availability.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.consultation.availability.errors.server.title",
      description:
        "app.api.v1.core.consultation.availability.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.consultation.availability.errors.unknown.title",
      description:
        "app.api.v1.core.consultation.availability.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.consultation.availability.errors.network.title",
      description:
        "app.api.v1.core.consultation.availability.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.consultation.availability.errors.forbidden.title",
      description:
        "app.api.v1.core.consultation.availability.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.consultation.availability.errors.notFound.title",
      description:
        "app.api.v1.core.consultation.availability.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.consultation.availability.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.consultation.availability.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.consultation.availability.errors.conflict.title",
      description:
        "app.api.v1.core.consultation.availability.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.consultation.availability.success.title",
    description:
      "app.api.v1.core.consultation.availability.success.description",
  },

  examples: {
    urlPathVariables: undefined,
    requests: {
      default: {
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-01-07T23:59:59Z",
        slotDurationMinutes: 60,
      },
      weekView: {
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-01-07T23:59:59Z",
        slotDurationMinutes: 30,
      },
    },
    responses: {
      default: {
        slots: [
          {
            start: new Date("2024-01-01T09:00:00Z"),
            end: new Date("2024-01-01T10:00:00Z"),
            available: true,
          },
          {
            start: new Date("2024-01-01T10:00:00Z"),
            end: new Date("2024-01-01T11:00:00Z"),
            available: false,
          },
        ],
        timezone: "Europe/Zurich",
      },
      weekView: {
        slots: [
          {
            start: new Date("2024-01-01T09:00:00Z"),
            end: new Date("2024-01-01T09:30:00Z"),
            available: true,
          },
          {
            start: new Date("2024-01-01T09:30:00Z"),
            end: new Date("2024-01-01T10:00:00Z"),
            available: true,
          },
        ],
        timezone: "Europe/Zurich",
      },
    },
  },
});

// Extract types using the new enhanced system
export type ConsultationAvailabilityRequestTypeInput =
  typeof GET.types.RequestInput;
export type ConsultationAvailabilityRequestTypeOutput =
  typeof GET.types.RequestOutput;
export type ConsultationAvailabilityResponseTypeInput =
  typeof GET.types.ResponseInput;
export type ConsultationAvailabilityResponseTypeOutput =
  typeof GET.types.ResponseOutput;

/**
 * Export the endpoint definitions
 */
const availabilityEndpoints = {
  GET,
};

export { GET };
export default availabilityEndpoints;
