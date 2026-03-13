/**
 * Payment Portal API Endpoints
 * Defines API endpoints for customer portal management
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

/**
 * POST endpoint for creating customer portal sessions
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "portal"],
  title: "post.title" as const,
  description: "post.description" as const,
  category: "app.endpointCategories.payments",
  icon: "settings" as const,
  tags: ["post.title" as const, "post.title" as const, "post.title" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title" as const,
    description: "post.form.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // REQUEST FIELDS
      returnUrl: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "post.returnUrl.label" as const,
        description: "post.returnUrl.description" as const,
        placeholder: "post.returnUrl.placeholder" as const,
        columns: 12,
        schema: z.string().url().optional(),
      }),

      // RESPONSE FIELDS
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.success" as const,
        schema: z.boolean(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.message" as const,
        schema: z.string().nullable(),
      }),

      customerPortalUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.customerPortalUrl" as const,
        schema: z.string().url().nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
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
} as const;
export default portalEndpoints;
