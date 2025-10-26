/**
 * Password Reset Request API Endpoint Definition
 * Production-ready endpoint for password reset request functionality
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

import { UserRole } from "../../../user-roles/enum";

/**
 * POST /reset-password/request - Request password reset
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "user", "public", "reset-password", "request"],
  title: "app.api.v1.core.user.public.resetPassword.request.title" as const,
  description:
    "app.api.v1.core.user.public.resetPassword.request.description" as const,
  category: "app.api.v1.core.user.category" as const,
  tags: ["app.api.v1.core.user.public.resetPassword.request.tag" as const],
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.public.resetPassword.request.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.request.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === EMAIL INPUT ===
      emailInput: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.public.resetPassword.request.groups.emailInput.title" as const,
          description:
            "app.api.v1.core.user.public.resetPassword.request.groups.emailInput.description" as const,
          layout: { type: LayoutType.VERTICAL },
        },
        { request: "data" },
        {
          email: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label:
                "app.api.v1.core.user.public.resetPassword.request.fields.email.label" as const,
              description:
                "app.api.v1.core.user.public.resetPassword.request.fields.email.description" as const,
              placeholder:
                "app.api.v1.core.user.public.resetPassword.request.fields.email.placeholder" as const,
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.resetPassword.request.fields.email.help" as const,
            },
            z
              .string()
              .email({
                message:
                  "app.api.v1.core.user.public.resetPassword.request.fields.email.validation.invalid",
              })
              .transform((val) => val.toLowerCase().trim()),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      response: responseField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.public.resetPassword.request.response.title" as const,
          description:
            "app.api.v1.core.user.public.resetPassword.request.response.description" as const,
          layout: { type: LayoutType.VERTICAL },
        },
        z.object({
          success: z
            .boolean()
            .describe("Whether the reset request was processed successfully"),
          message: z
            .string()
            .describe("Human-readable status message explaining the result"),
          deliveryInfo: z
            .object({
              emailSent: z
                .boolean()
                .describe("Whether the reset email was sent"),
              estimatedDelivery: z
                .string()
                .describe(
                  "Estimated time for email delivery (e.g., 'within 5 minutes')",
                ),
              expiresAt: z
                .string()
                .describe("When the reset link expires (human-readable)"),
              checkSpamFolder: z
                .boolean()
                .describe("Whether user should check spam folder"),
            })
            .optional()
            .describe("Email delivery details and timing information"),
          securityInfo: z
            .object({
              accountExists: z
                .boolean()
                .optional()
                .describe(
                  "Whether an account exists (may be hidden for security)",
                ),
              rateLimitRemaining: z
                .number()
                .optional()
                .describe("Number of reset requests remaining"),
              cooldownPeriod: z
                .string()
                .optional()
                .describe("Time to wait before next request"),
            })
            .optional()
            .describe("Security-related information about the request"),
          nextSteps: z
            .array(z.string())
            .describe("Step-by-step instructions for the user to follow"),
        }),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.user.public.resetPassword.request.errors.validation.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.request.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.user.public.resetPassword.request.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.request.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.user.public.resetPassword.request.errors.internal.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.request.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.user.public.resetPassword.request.errors.unknown.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.request.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.user.public.resetPassword.request.errors.network.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.request.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.user.public.resetPassword.request.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.request.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.user.public.resetPassword.request.errors.notFound.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.request.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.user.public.resetPassword.request.errors.unsaved.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.request.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.user.public.resetPassword.request.errors.conflict.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.request.errors.conflict.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.v1.core.user.public.resetPassword.request.success.title" as const,
    description:
      "app.api.v1.core.user.public.resetPassword.request.success.description" as const,
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
    urlPathParams: undefined,
    responses: {
      default: {
        response: {
          success: true,
          message: "Password reset link sent successfully",
          deliveryInfo: {
            emailSent: true,
            estimatedDelivery: "within 5 minutes",
            expiresAt: "24 hours from now",
            checkSpamFolder: true,
          },
          nextSteps: [
            "Check your email inbox and spam folder",
            "Click the reset link in the email",
            "Create a new secure password",
          ],
        },
      },
      invalidEmail: {
        response: {
          success: false,
          message: "No account found with this email address",
          nextSteps: [
            "Check your email spelling",
            "Try a different email address",
            "Contact support if you need help",
          ],
        },
      },
      rateLimited: {
        response: {
          success: false,
          message: "Too many reset requests. Please wait before trying again.",
          nextSteps: [
            "Wait 15 minutes before requesting again",
            "Check if you already received a reset email",
          ],
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
};

export { POST };

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
