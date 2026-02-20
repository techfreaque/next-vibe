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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";

import { UserRole } from "../../../user-roles/enum";

/**
 * POST /reset-password/request - Request password reset
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["user", "public", "reset-password", "request"],
  title: "app.api.user.public.resetPassword.request.title" as const,
  description: "app.api.user.public.resetPassword.request.description" as const,
  icon: "lock",
  category: "app.api.user.category" as const,
  tags: ["app.api.user.public.resetPassword.request.tag" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
    UserRole.REMOTE_SKILL,
  ] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
      columns: 12,
    },
    { request: "data", response: true },
    {
      icon: widgetField({
        type: WidgetType.ICON,
        icon: "mail",
        containerSize: "base",
        iconSize: "base",
        borderRadius: "full",
        inline: true,
        order: 0,
        usage: { request: "data", response: true },
      }),
      title: widgetField({
        type: WidgetType.TITLE,
        content: "app.user.other.resetPassword.auth.resetPassword.title",
        level: 3,
        order: 1,
        inline: true,
        usage: { request: "data", response: true },
      }),
      subtitle: widgetField({
        type: WidgetType.TEXT,
        content: "app.user.other.resetPassword.auth.resetPassword.subtitle",
        order: 2,
        usage: { request: "data", response: true },
      }),

      email: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label:
          "app.api.user.public.resetPassword.request.fields.email.label" as const,
        description:
          "app.api.user.public.resetPassword.request.fields.email.description" as const,
        placeholder:
          "app.api.user.public.resetPassword.request.fields.email.placeholder" as const,
        helpText:
          "app.api.user.public.resetPassword.request.fields.email.help" as const,
        // theme: {
        //   style: "none",
        // },
        order: 4,
        schema: z
          .string()
          .email({
            message:
              "app.api.user.public.resetPassword.request.fields.email.validation.invalid",
          })
          .transform((val) => val.toLowerCase().trim()),
      }),

      formAlert: widgetField({
        type: WidgetType.FORM_ALERT,
        order: 5,
        usage: { request: "data" },
      }),

      message: responseField({
        type: WidgetType.ALERT,
        content:
          "app.api.user.public.resetPassword.request.response.success.message" as const,
        order: 6,
        schema: z
          .string()
          .describe("Human-readable status message explaining the result"),
      }),
      // === SUBMIT BUTTON (inside card) ===
      submitButton: widgetField({
        type: WidgetType.SUBMIT_BUTTON,
        text: "app.user.other.resetPassword.auth.resetPassword.sendResetLink",
        loadingText:
          "app.api.user.public.resetPassword.request.actions.submitting",
        icon: "mail",
        variant: "default",
        size: "default",
        columns: 12,
        order: 10,
        usage: { request: "data" },
      }),

      // === FOOTER LINK (inside card, below button) ===
      alreadyHaveAccount: widgetField({
        type: WidgetType.LINK,
        text: "app.api.user.public.signup.footer.alreadyHaveAccount",
        href: "/user/login",
        textAlign: "center",
        external: false,
        columns: 12,
        order: 11,
        usage: { request: "data" },
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.user.public.resetPassword.request.errors.validation.title" as const,
      description:
        "app.api.user.public.resetPassword.request.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.user.public.resetPassword.request.errors.unauthorized.title" as const,
      description:
        "app.api.user.public.resetPassword.request.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.user.public.resetPassword.request.errors.internal.title" as const,
      description:
        "app.api.user.public.resetPassword.request.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.user.public.resetPassword.request.errors.unknown.title" as const,
      description:
        "app.api.user.public.resetPassword.request.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.user.public.resetPassword.request.errors.network.title" as const,
      description:
        "app.api.user.public.resetPassword.request.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.user.public.resetPassword.request.errors.forbidden.title" as const,
      description:
        "app.api.user.public.resetPassword.request.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.user.public.resetPassword.request.errors.notFound.title" as const,
      description:
        "app.api.user.public.resetPassword.request.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.user.public.resetPassword.request.errors.unsaved.title" as const,
      description:
        "app.api.user.public.resetPassword.request.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.user.public.resetPassword.request.errors.conflict.title" as const,
      description:
        "app.api.user.public.resetPassword.request.errors.conflict.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.user.public.resetPassword.request.success.title" as const,
    description:
      "app.api.user.public.resetPassword.request.success.description" as const,
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
