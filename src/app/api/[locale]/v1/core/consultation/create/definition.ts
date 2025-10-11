/**
 * Create Consultation Endpoint Definition
 *
 * Production-ready endpoint for creating consultations with enhanced
 * multi-select support and comprehensive validation.
 *
 * Features:
 * - Multi-select consultation types
 * - Enhanced form validation
 * - Rich UI configuration
 * - Comprehensive error handling
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

import { ConsultationType, ConsultationTypeOptions } from "../enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "consultation", "create"],
  aliases: ["consultation:create"],
  title: "app.api.v1.core.consultation.create.title",
  description: "app.api.v1.core.consultation.create.description",
  category: "app.api.v1.core.consultation.list.category",
  tags: ["app.api.v1.core.consultation.create.tag"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.consultation.create.container.title",
      description: "app.api.v1.core.consultation.create.container.description",
      layout: { type: LayoutType.STACKED }, // Mobile-first responsive layout
    },
    { request: "data", response: true },
    {
      // === CONSULTATION DETAILS ===
      consultationTypes: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.consultation.create.consultationTypes.label",
          description:
            "app.api.v1.core.consultation.create.consultationTypes.description",
          placeholder:
            "app.api.v1.core.consultation.create.consultationTypes.placeholder",
          options: ConsultationTypeOptions,
          layout: { columns: 12 }, // Full width for multi-select
          validation: { required: false },
        },
        z.array(z.nativeEnum(ConsultationType)).optional(),
      ),

      preferredDate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.consultation.create.preferredDate.label",
          description:
            "app.api.v1.core.consultation.create.preferredDate.description",
          placeholder:
            "app.api.v1.core.consultation.create.preferredDate.placeholder",
          required: true,
          layout: { columns: 6 }, // Half width for date/time pair
          validation: { required: true },
        },
        z.string().min(1, "Date is required"),
      ),

      preferredTime: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TIME,
          label: "app.api.v1.core.consultation.create.preferredTime.label",
          description:
            "app.api.v1.core.consultation.create.preferredTime.description",
          placeholder:
            "app.api.v1.core.consultation.create.preferredTime.placeholder",
          required: true,
          layout: { columns: 6 }, // Pair with preferred date
          validation: { required: true },
        },
        z
          .string()
          .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
      ),

      message: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.consultation.create.message.label",
          description:
            "app.api.v1.core.consultation.create.message.description",
          placeholder:
            "app.api.v1.core.consultation.create.message.placeholder",
          layout: { columns: 12 },
        },
        z.string().max(1000, "Message too long").optional(),
      ),

      // === RESPONSE FIELDS ===
      consultationId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.consultation.create.response.consultationId",
        },
        z.uuid(),
      ),
      // Note: message field is already defined as a request field above
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.consultation.create.errors.validation.title",
      description:
        "app.api.v1.core.consultation.create.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.consultation.create.errors.notFound.title",
      description:
        "app.api.v1.core.consultation.create.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.consultation.create.errors.unauthorized.title",
      description:
        "app.api.v1.core.consultation.create.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.consultation.create.errors.forbidden.title",
      description:
        "app.api.v1.core.consultation.create.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.consultation.create.errors.server.title",
      description:
        "app.api.v1.core.consultation.create.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.consultation.create.errors.network.title",
      description:
        "app.api.v1.core.consultation.create.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.consultation.create.errors.unknown.title",
      description:
        "app.api.v1.core.consultation.create.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.consultation.create.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.consultation.create.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.consultation.create.errors.conflict.title",
      description:
        "app.api.v1.core.consultation.create.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.consultation.create.success.title",
    description: "app.api.v1.core.consultation.create.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        consultationTypes: [ConsultationType.INITIAL, ConsultationType.SALES],
        preferredDate: "2024-01-15",
        preferredTime: "14:00",
        message: "I need help with social media strategy for my online store",
      },
      minimal: {
        preferredDate: "2024-01-16",
        preferredTime: "10:00",
      },
      success: {
        consultationTypes: [ConsultationType.TECHNICAL],
        preferredDate: "2024-01-17",
        preferredTime: "16:00",
        message: "Technical consultation needed",
      },
    },
    urlPathVariables: undefined,
    responses: {
      default: {
        consultationId: "123e4567-e89b-12d3-a456-426614174000",
      },
      minimal: {
        consultationId: "456e7890-e89b-12d3-a456-426614174001",
      },
      success: {
        consultationId: "789e0123-e89b-12d3-a456-426614174002",
      },
    },
  },
});

// Extract types for use in other files
export type ConsultationCreateRequestTypeInput = typeof POST.types.RequestInput;
export type ConsultationCreateRequestTypeOutput =
  typeof POST.types.RequestOutput;
export type ConsultationCreateResponseTypeInput =
  typeof POST.types.ResponseInput;
export type ConsultationCreateResponseTypeOutput =
  typeof POST.types.ResponseOutput;

const createConsultationDefinitions = {
  POST,
};

export default createConsultationDefinitions;
