/**
 * User Logout API Endpoint Definition
 * Production-ready endpoint for user logout functionality
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["user", "private", "logout"],
  title: "app.api.user.private.logout.title" as const,
  description: "app.api.user.private.logout.description" as const,
  category: "app.api.user.category" as const,
  tags: ["app.api.user.private.logout.tag" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.AI_TOOL_OFF,
  ] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.user.private.logout.response.title" as const,
      description: "app.api.user.private.logout.response.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.user.private.logout.response.success" as const,
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.user.private.logout.response.message" as const,
        },
        z.string(),
      ),
      sessionsCleaned: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.user.private.logout.response.sessionsCleaned" as const,
        },
        z.number(),
      ),
      nextSteps: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.user.private.logout.response.nextSteps" as const,
        },
        z.array(z.string()),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.user.private.logout.errors.validation.title" as const,
      description:
        "app.api.user.private.logout.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.user.private.logout.errors.unauthorized.title" as const,
      description:
        "app.api.user.private.logout.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.user.private.logout.errors.internal.title" as const,
      description:
        "app.api.user.private.logout.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.user.private.logout.errors.unknown.title" as const,
      description:
        "app.api.user.private.logout.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.user.private.logout.errors.conflict.title" as const,
      description:
        "app.api.user.private.logout.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.user.private.logout.errors.forbidden.title" as const,
      description:
        "app.api.user.private.logout.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.user.private.logout.errors.network_error.title" as const,
      description:
        "app.api.user.private.logout.errors.network_error.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.user.private.logout.errors.not_found.title" as const,
      description:
        "app.api.user.private.logout.errors.not_found.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.user.private.logout.errors.unsaved_changes.title" as const,
      description:
        "app.api.user.private.logout.errors.unsaved_changes.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.user.private.logout.success.title" as const,
    description: "app.api.user.private.logout.success.description" as const,
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

const logoutEndpoints = { POST };

export { POST };

export default logoutEndpoints;

// Export types as required by migration guide
export type LogoutPostRequestInput = typeof POST.types.RequestInput;
export type LogoutPostRequestOutput = typeof POST.types.RequestOutput;
export type LogoutPostResponseInput = typeof POST.types.ResponseInput;
export type LogoutPostResponseOutput = typeof POST.types.ResponseOutput;
