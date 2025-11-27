/**
 * Payment Portal API Endpoints
 * Defines API endpoints for customer portal management
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

/**
 * POST endpoint for creating customer portal sessions
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "payment", "portal"],
  title: "app.api.v1.core.payment.portal.post.title" as const,
  description: "app.api.v1.core.payment.portal.post.description" as const,
  category: "app.api.v1.core.payment.category" as const,
  tags: [
    "app.api.v1.core.payment.tags.payment" as const,
    "app.api.v1.core.payment.tags.info" as const,
    "app.api.v1.core.payment.tags.transactions" as const,
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.payment.portal.post.form.title" as const,
      description:
        "app.api.v1.core.payment.portal.post.form.description" as const,
      layoutType: LayoutType.GRID, columns: 12,
    },
    { request: "data", response: true },
    {
      // REQUEST FIELDS
      returnUrl: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.URL,
          label: "app.api.v1.core.payment.portal.post.returnUrl.label" as const,
          description:
            "app.api.v1.core.payment.portal.post.returnUrl.description" as const,
          placeholder:
            "app.api.v1.core.payment.portal.post.returnUrl.placeholder" as const,
          columns: 12},
        z.string().url().optional(),
      ),

      // RESPONSE FIELDS
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.payment.portal.post.response.success" as const,
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.payment.portal.post.response.message" as const,
        },
        z.string().nullable(),
      ),

      customerPortalUrl: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.payment.portal.post.response.customerPortalUrl" as const,
        },
        z.string().url().nullable(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.payment.portal.post.errors.validation.title" as const,
      description:
        "app.api.v1.core.payment.portal.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.payment.portal.post.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.payment.portal.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.payment.portal.post.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.payment.portal.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.payment.portal.post.errors.notFound.title" as const,
      description:
        "app.api.v1.core.payment.portal.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.payment.portal.post.errors.server.title" as const,
      description:
        "app.api.v1.core.payment.portal.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.payment.portal.post.errors.network.title" as const,
      description:
        "app.api.v1.core.payment.portal.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.payment.portal.post.errors.unknown.title" as const,
      description:
        "app.api.v1.core.payment.portal.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.payment.portal.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.payment.portal.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.payment.portal.post.errors.conflict.title" as const,
      description:
        "app.api.v1.core.payment.portal.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.payment.portal.post.success.title" as const,
    description:
      "app.api.v1.core.payment.portal.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        returnUrl: "https://example.com/dashboard",
      },
      minimal: {
        returnUrl: "https://example.com/billing",
      },
    },
    responses: {
      default: {
        success: true,
        message: null,
        customerPortalUrl: "https://billing.stripe.com/session/abc123",
      },
      minimal: {
        success: true,
        message: "Portal session created",
        customerPortalUrl: "https://billing.stripe.com/session/xyz789",
      },
    },
  },
});

// Export types for repository
export type PaymentPortalRequestInput = typeof POST.types.RequestInput;
export type PaymentPortalRequestOutput = typeof POST.types.RequestOutput;
export type PaymentPortalResponseInput = typeof POST.types.ResponseInput;
export type PaymentPortalResponseOutput = typeof POST.types.ResponseOutput;

/**
 * Combined endpoints
 */
const portalEndpoints = {
  POST,
};

export { POST };
export default portalEndpoints;
