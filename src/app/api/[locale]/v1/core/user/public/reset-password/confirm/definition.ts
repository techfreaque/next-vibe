/**
 * Password Reset Confirmation API Endpoint Definition
 * Production-ready endpoint for confirming password reset with new password
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
 * POST /reset-password/confirm - Confirm password reset
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "user", "public", "reset-password", "confirm"],
  title: "app.api.v1.core.user.public.resetPassword.confirm.title" as const,
  description:
    "app.api.v1.core.user.public.resetPassword.confirm.description" as const,
  category: "app.api.v1.core.user.category" as const,
  tags: ["app.api.v1.core.user.public.resetPassword.confirm.tag" as const],
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.public.resetPassword.confirm.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.confirm.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === VERIFICATION DETAILS ===
      verification: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.public.resetPassword.confirm.groups.verification.title" as const,
          description:
            "app.api.v1.core.user.public.resetPassword.confirm.groups.verification.description" as const,
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { request: "data" },
        {
          token: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.token.label" as const,
              description:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.token.description" as const,
              placeholder:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.token.placeholder" as const,
              required: true,
              layout: { columns: 6 },
              helpText:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.token.help" as const,
            },
            z.string().min(1, {
              message:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.token.validation.required",
            }),
          ),

          email: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.email.label" as const,
              description:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.email.description" as const,
              placeholder:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.email.placeholder" as const,
              required: true,
              layout: { columns: 6 },
            },
            z
              .string()
              .email({
                message:
                  "app.api.v1.core.user.public.resetPassword.confirm.fields.email.validation.invalid",
              })
              .transform((val) => val.toLowerCase().trim()),
          ),
        },
      ),

      // === NEW PASSWORD SETUP ===
      newPassword: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.public.resetPassword.confirm.groups.newPassword.title" as const,
          description:
            "app.api.v1.core.user.public.resetPassword.confirm.groups.newPassword.description" as const,
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { request: "data" },
        {
          password: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.password.label" as const,
              description:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.password.description" as const,
              placeholder:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.password.placeholder" as const,
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.password.help" as const,
            },
            z.string().min(8, {
              message:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.password.validation.minLength",
            }),
          ),

          confirmPassword: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.confirmPassword.label" as const,
              description:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.confirmPassword.description" as const,
              placeholder:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.confirmPassword.placeholder" as const,
              required: true,
              layout: { columns: 12 },
            },
            z.string().min(8, {
              message:
                "app.api.v1.core.user.public.resetPassword.confirm.fields.confirmPassword.validation.minLength",
            }),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      response: responseField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.public.resetPassword.confirm.response.title" as const,
          description:
            "app.api.v1.core.user.public.resetPassword.confirm.response.description" as const,
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        z.object({
          success: z
            .boolean()
            .describe("Whether the password reset was successful"),
          message: z.string().describe("Human-readable status message"),
          securityTip: z
            .string()
            .optional()
            .describe("Optional security recommendation"),
          nextSteps: z
            .array(z.string())
            .describe("Recommended actions after password reset"),
        }),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.validation.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.internal.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.unknown.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.network.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.notFound.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.unsaved.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.conflict.title" as const,
      description:
        "app.api.v1.core.user.public.resetPassword.confirm.errors.conflict.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.v1.core.user.public.resetPassword.confirm.success.title" as const,
    description:
      "app.api.v1.core.user.public.resetPassword.confirm.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        verification: {
          email: "user@example.com",
          token: "abc123",
        },
        newPassword: {
          password: "newPassword123",
          confirmPassword: "newPassword123",
        },
      },
      mismatchedPasswords: {
        verification: {
          email: "user@example.com",
          token: "abc123",
        },
        newPassword: {
          password: "newPassword123",
          confirmPassword: "differentPassword123",
        },
      },
      expiredToken: {
        verification: {
          email: "user@example.com",
          token: "expired-token",
        },
        newPassword: {
          password: "newPassword123",
          confirmPassword: "newPassword123",
        },
      },
    },
    urlPathParams: undefined,
    responses: {
      default: {
        response: {
          success: true,
          message:
            "Password reset successfully! You can now log in with your new password.",
          securityTip:
            "Consider enabling two-factor authentication for better security",
          nextSteps: [
            "Log in with your new password",
            "Update saved passwords in your browser",
            "Consider enabling 2FA for added security",
          ],
        },
      },
      mismatchedPasswords: {
        response: {
          success: false,
          message:
            "Passwords do not match. Please ensure both password fields are identical.",
          nextSteps: [
            "Make sure both password fields match",
            "Use a password manager to avoid typing errors",
          ],
        },
      },
      expiredToken: {
        response: {
          success: false,
          message:
            "Reset token has expired. Please request a new password reset.",
          nextSteps: [
            "Request a new password reset",
            "Complete the reset process within 15 minutes",
          ],
        },
      },
    },
  },
});

/**
 * Reset Password Confirm API endpoints
 */
const resetPasswordConfirmEndpoints = {
  POST,
};

export { POST };

export default resetPasswordConfirmEndpoints;

// Export types as required by migration guide
export type ResetPasswordConfirmPostRequestInput =
  typeof POST.types.RequestInput;
export type ResetPasswordConfirmPostRequestOutput =
  typeof POST.types.RequestOutput;
export type ResetPasswordConfirmPostResponseInput =
  typeof POST.types.ResponseInput;
export type ResetPasswordConfirmPostResponseOutput =
  typeof POST.types.ResponseOutput;
