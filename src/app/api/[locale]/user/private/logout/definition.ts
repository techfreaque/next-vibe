/**
 * User Logout API Endpoint Definition
 * Production-ready endpoint for user logout functionality
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedResponseField,
  scopedWidgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user-roles/enum";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "private", "logout"],
  title: "title",
  description: "description",
  icon: "log-out",
  category: "category",
  tags: ["tag"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.AI_TOOL_OFF,
    UserRole.REMOTE_SKILL,
  ] as const,
  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.ALERT,
        content: "response.message",
        schema: z.string(),
      }),
      submitButton: scopedWidgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "logoutButton",
        loadingText: "loggingOut",
        icon: "log-out",
        columns: 12,
        usage: { response: true },
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network_error.title",
      description: "errors.network_error.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.not_found.title",
      description: "errors.not_found.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsaved_changes.title",
      description: "errors.unsaved_changes.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        message: "You have been logged out successfully",
      },
      failed: {
        message: "Logout failed, but you may already be logged out",
      },
    },
  },
});

const logoutEndpoints = { POST } as const;
export default logoutEndpoints;

// Export types as required by migration guide
export type LogoutPostRequestInput = typeof POST.types.RequestInput;
export type LogoutPostRequestOutput = typeof POST.types.RequestOutput;
export type LogoutPostResponseInput = typeof POST.types.ResponseInput;
export type LogoutPostResponseOutput = typeof POST.types.ResponseOutput;
