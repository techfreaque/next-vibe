/**
 * Consultation Status Endpoint Definition
 *
 * Production-ready endpoint for getting consultation status with enhanced
 * multi-select support and comprehensive validation.
 *
 * Features:
 * - Enhanced status filtering
 * - Rich UI configuration
 * - Comprehensive error handling
 * - Type-safe responses
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { ConsultationStatus } from "../enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "consultation", "status"],
  aliases: ["consultation:status"],
  title: "app.api.v1.core.consultation.status.title",
  description: "app.api.v1.core.consultation.status.description",
  category: "app.api.v1.core.consultation.list.category",
  tags: ["app.api.v1.core.consultation.create.tag"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.consultation.status.response.title",
      description: "app.api.v1.core.consultation.status.response.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      isScheduled: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.consultation.status.response.isScheduled",
        },
        z.boolean(),
      ),
      scheduledAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.consultation.status.response.scheduledAt",
        },
        z.string().datetime().optional(),
      ),
      consultant: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.consultation.status.response.consultant",
        },
        z.string().optional(),
      ),
      status: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.consultation.status.response.status",
        },
        z.nativeEnum(ConsultationStatus).optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.consultation.status.errors.validation.title",
      description:
        "app.api.v1.core.consultation.status.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.consultation.status.errors.notFound.title",
      description:
        "app.api.v1.core.consultation.status.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.consultation.status.errors.unauthorized.title",
      description:
        "app.api.v1.core.consultation.status.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.consultation.status.errors.forbidden.title",
      description:
        "app.api.v1.core.consultation.status.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.consultation.status.errors.server.title",
      description:
        "app.api.v1.core.consultation.status.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.consultation.status.errors.network.title",
      description:
        "app.api.v1.core.consultation.status.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.consultation.status.errors.unknown.title",
      description:
        "app.api.v1.core.consultation.status.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.consultation.status.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.consultation.status.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.consultation.status.errors.conflict.title",
      description:
        "app.api.v1.core.consultation.status.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.consultation.status.success.title",
    description: "app.api.v1.core.consultation.status.success.description",
  },

  // === EXAMPLES ===
  examples: {
    urlPathVariables: undefined,
    requests: undefined,
    responses: {
      default: {
        isScheduled: true,
        scheduledAt: "2024-03-15T10:00:00Z",
        consultant: "John Smith",
        status: ConsultationStatus.SCHEDULED,
      },
      notScheduled: {
        isScheduled: false,
      },
    },
  },
});

// Extract types for use in other files
export type ConsultationStatusResponseTypeInput =
  typeof GET.types.ResponseInput;
export type ConsultationStatusResponseTypeOutput =
  typeof GET.types.ResponseOutput;

export { GET };

const statusEndpoints = { GET };
export default statusEndpoints;
