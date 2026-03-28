/**
 * Password Reset Request API Endpoint Definition
 * Production-ready endpoint for password reset request functionality
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  objectField,
  requestField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";

import { scopedTranslation } from "../i18n";
import { UserRole } from "../../../user-roles/enum";

/**
 * POST /reset-password/request - Request password reset
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "public", "reset-password", "request"],
  title: "request.title",
  description: "request.description",
  icon: "lock",
  category: "endpointCategories.userAuth",
  tags: ["request.tag"],
  allowedRoles: [UserRole.PUBLIC, UserRole.AI_TOOL_OFF] as const,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      icon: widgetField(scopedTranslation, {
        type: WidgetType.ICON,
        icon: "mail",
        containerSize: "base",
        iconSize: "base",
        borderRadius: "full",
        inline: true,
        order: 0,
        usage: { request: "data", response: true },
      }),
      title: widgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        content: "request.ui.title",
        level: 3,
        order: 1,
        inline: true,
        usage: { request: "data", response: true },
      }),
      subtitle: widgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "request.ui.subtitle",
        order: 2,
        usage: { request: "data", response: true },
      }),

      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "request.fields.email.label",
        description: "request.fields.email.description",
        placeholder: "request.fields.email.placeholder",
        helpText: "request.fields.email.help",
        // theme: {
        //   style: "none",
        // },
        order: 4,
        schema: z
          .string()
          .email({
            message: "request.fields.email.validation.invalid",
          })
          .transform((val) => val.toLowerCase().trim()),
      }),

      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        order: 5,
        usage: { request: "data" },
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        content: "request.response.success.message",
        order: 6,
        schema: z
          .string()
          .describe("Human-readable status message explaining the result"),
      }),
      // === SUBMIT BUTTON (inside card) ===
      submitButton: widgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "request.ui.sendResetLink",
        loadingText: "actions.submitting",
        icon: "mail",
        variant: "default",
        size: "default",
        columns: 12,
        order: 10,
        usage: { request: "data" },
      }),

      // === FOOTER LINK (inside card, below button) ===
      alreadyHaveAccount: widgetField(scopedTranslation, {
        type: WidgetType.LINK,
        text: "request.ui.alreadyHaveAccount",
        href: "/user/login",
        textAlign: "center",
        external: false,
        columns: 12,
        order: 11,
        usage: { request: "data" },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "request.errors.validation.title",
      description: "request.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "request.errors.unauthorized.title",
      description: "request.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "request.errors.internal.title",
      description: "request.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "request.errors.unknown.title",
      description: "request.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "request.errors.network.title",
      description: "request.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "request.errors.forbidden.title",
      description: "request.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "request.errors.notFound.title",
      description: "request.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "request.errors.unsaved.title",
      description: "request.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "request.errors.conflict.title",
      description: "request.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "request.success.title",
    description: "request.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        email: "user@example.com",
      },
      invalidEmail: {
        email: "invalid-email",
      },
      rateLimited: {
        email: "user@example.com",
      },
    },
    responses: {
      default: {
        message: "Password reset link sent successfully",
      },
      invalidEmail: {
        message: "No account found with this email address",
      },
      rateLimited: {
        message: "Too many reset requests. Please wait before trying again.",
      },
    },
  },
});

/**
 * Reset Password Request API endpoints
 */
const resetPasswordRequestEndpoints = {
  POST,
} as const;

export default resetPasswordRequestEndpoints;

// Export types as required by migration guide
export type ResetPasswordRequestPostRequestInput =
  typeof POST.types.RequestInput;
export type ResetPasswordRequestPostRequestOutput =
  typeof POST.types.RequestOutput;
export type ResetPasswordRequestPostResponseInput =
  typeof POST.types.ResponseInput;
export type ResetPasswordRequestPostResponseOutput =
  typeof POST.types.ResponseOutput;
