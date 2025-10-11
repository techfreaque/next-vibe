/**
 * User Logout API Endpoint Definition
 * Production-ready endpoint for user logout functionality
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

import { UserRole } from "../../user-roles/enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "user", "private", "logout"],
  title: "app.api.v1.core.user.private.logout.title",
  description: "app.api.v1.core.user.private.logout.description",
  category: "app.api.v1.core.user.category",
  tags: ["app.api.v1.core.user.private.logout.tag"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.private.logout.response.title",
      description: "app.api.v1.core.user.private.logout.response.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.user.private.logout.response.success",
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.user.private.logout.response.message",
        },
        z.string(),
      ),
      sessionsCleaned: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.user.private.logout.response.sessionsCleaned",
        },
        z.number(),
      ),
      nextSteps: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.user.private.logout.response.nextSteps",
        },
        z.array(z.string()),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.user.private.logout.errors.validation.title",
      description:
        "app.api.v1.core.user.private.logout.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.user.private.logout.errors.unauthorized.title",
      description:
        "app.api.v1.core.user.private.logout.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.user.private.logout.errors.internal.title",
      description:
        "app.api.v1.core.user.private.logout.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.user.private.logout.errors.unknown.title",
      description:
        "app.api.v1.core.user.private.logout.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.user.private.logout.errors.conflict.title",
      description:
        "app.api.v1.core.user.private.logout.errors.conflict.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.user.private.logout.errors.forbidden.title",
      description:
        "app.api.v1.core.user.private.logout.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.user.private.logout.errors.network_error.title",
      description:
        "app.api.v1.core.user.private.logout.errors.network_error.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.user.private.logout.errors.not_found.title",
      description:
        "app.api.v1.core.user.private.logout.errors.not_found.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.user.private.logout.errors.unsaved_changes.title",
      description:
        "app.api.v1.core.user.private.logout.errors.unsaved_changes.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.private.logout.success.title",
    description: "app.api.v1.core.user.private.logout.success.description",
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        success: true,
        message: "You have been logged out successfully",
        sessionsCleaned: 3,
        nextSteps: [
          "You can now close this browser tab",
          "Log in again anytime to access your account",
          "Consider clearing browser data for additional security",
        ],
      },
      failed: {
        success: false,
        message: "Logout failed, but you may already be logged out",
        sessionsCleaned: 0,
        nextSteps: [
          "Try refreshing the page",
          "Clear your browser cookies and cache",
          "Contact support if issues persist",
        ],
      },
    },
  },
});

const logoutEndpoints = { GET };

export { GET };

export default logoutEndpoints;

// Export types as required by migration guide
export type LogoutGetRequestInput = typeof GET.types.RequestInput;
export type LogoutGetRequestOutput = typeof GET.types.RequestOutput;
export type LogoutGetResponseInput = typeof GET.types.ResponseInput;
export type LogoutGetResponseOutput = typeof GET.types.ResponseOutput;
