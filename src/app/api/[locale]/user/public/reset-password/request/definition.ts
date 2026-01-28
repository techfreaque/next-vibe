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
  responseArrayField,
  responseField,
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
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.user.public.resetPassword.request.title" as const,
      description:
        "app.api.user.public.resetPassword.request.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === EMAIL INPUT ===
      emailInput: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.user.public.resetPassword.request.groups.emailInput.title" as const,
          description:
            "app.api.user.public.resetPassword.request.groups.emailInput.description" as const,
          layoutType: LayoutType.VERTICAL,
        },
        { request: "data" },
        {
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
            schema: z
              .string()
              .email({
                message:
                  "app.api.user.public.resetPassword.request.fields.email.validation.invalid",
              })
              .transform((val) => val.toLowerCase().trim()),
          }),
        },
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.user.public.resetPassword.request.response.title" as const,
          description:
            "app.api.user.public.resetPassword.request.response.description" as const,
          layoutType: LayoutType.VERTICAL,
        },
        { response: true },
        {
          success: responseField({
            type: WidgetType.BADGE,
            text: "app.api.user.public.resetPassword.request.success.title" as const,
            schema: z
              .boolean()
              .describe("Whether the reset request was processed successfully"),
          }),
          message: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.user.public.resetPassword.request.response.success.message" as const,
            schema: z
              .string()
              .describe("Human-readable status message explaining the result"),
          }),
        },
      ),
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
        emailInput: {
          email: "user@example.com",
        },
      },
      invalidEmail: {
        emailInput: {
          email: "invalid-email",
        },
      },
      rateLimited: {
        emailInput: {
          email: "user@example.com",
        },
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          message: "Password reset link sent successfully",
        },
      },
      invalidEmail: {
        response: {
          success: false,
          message: "No account found with this email address",
        },
      },
      rateLimited: {
        response: {
          success: false,
          message: "Too many reset requests. Please wait before trying again.",
        },
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
