/**
 * Password Reset Token Validation API Endpoint Definition
 * Production-ready endpoint for validating password reset tokens
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
  requestDataField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";

import { UserRole } from "../../../user-roles/enum";

/**
 * GET /reset-password/validate - Validate password reset token
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["user", "public", "reset-password", "validate"],
  title: "app.api.user.public.resetPassword.validate.title" as const,
  description:
    "app.api.user.public.resetPassword.validate.description" as const,
  category: "app.api.user.category" as const,
  tags: ["app.api.user.public.resetPassword.validate.tag" as const],
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.user.public.resetPassword.validate.title" as const,
      description:
        "app.api.user.public.resetPassword.validate.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === TOKEN VALIDATION ===
      tokenInput: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.user.public.resetPassword.validate.groups.tokenInput.title" as const,
          description:
            "app.api.user.public.resetPassword.validate.groups.tokenInput.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { request: "data" },
        {
          token: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.user.public.resetPassword.validate.fields.token.label" as const,
              description:
                "app.api.user.public.resetPassword.validate.fields.token.description" as const,
              placeholder:
                "app.api.user.public.resetPassword.validate.fields.token.placeholder" as const,
              columns: 12,
              helpText:
                "app.api.user.public.resetPassword.validate.fields.token.help" as const,
            },
            z.string().min(1, {
              message:
                "app.api.user.public.resetPassword.validate.fields.token.validation.required",
            }),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.user.public.resetPassword.validate.response.title" as const,
          description:
            "app.api.user.public.resetPassword.validate.response.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          valid: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.user.public.resetPassword.validate.response.valid" as const,
            },
            z.boolean(),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.user.public.resetPassword.validate.response.message" as const,
            },
            z.string(),
          ),
          userId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.user.public.resetPassword.validate.response.userId" as const,
            },
            z.uuid().optional(),
          ),
          expiresAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.user.public.resetPassword.validate.response.expiresAt" as const,
            },
            z.string().optional(),
          ),
          nextSteps: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.user.public.resetPassword.validate.response.nextSteps.item" as const,
            },
            z.array(z.string()),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.user.public.resetPassword.validate.errors.validation.title" as const,
      description:
        "app.api.user.public.resetPassword.validate.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.user.public.resetPassword.validate.errors.unauthorized.title" as const,
      description:
        "app.api.user.public.resetPassword.validate.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.user.public.resetPassword.validate.errors.internal.title" as const,
      description:
        "app.api.user.public.resetPassword.validate.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.user.public.resetPassword.validate.errors.unknown.title" as const,
      description:
        "app.api.user.public.resetPassword.validate.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.user.public.resetPassword.validate.errors.network.title" as const,
      description:
        "app.api.user.public.resetPassword.validate.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.user.public.resetPassword.validate.errors.forbidden.title" as const,
      description:
        "app.api.user.public.resetPassword.validate.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.user.public.resetPassword.validate.errors.notFound.title" as const,
      description:
        "app.api.user.public.resetPassword.validate.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.user.public.resetPassword.validate.errors.unsaved.title" as const,
      description:
        "app.api.user.public.resetPassword.validate.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.user.public.resetPassword.validate.errors.conflict.title" as const,
      description:
        "app.api.user.public.resetPassword.validate.errors.conflict.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.user.public.resetPassword.validate.success.title" as const,
    description:
      "app.api.user.public.resetPassword.validate.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        tokenInput: {
          token: "abc123",
        },
      },
      invalidToken: {
        tokenInput: {
          token: "",
        },
      },
      expiredToken: {
        tokenInput: {
          token: "expired-token",
        },
      },
    },
    urlPathParams: undefined,
    responses: {
      default: {
        response: {
          valid: true,
          message: "Reset token is valid and ready to use",
          userId: "123e4567-e89b-12d3-a456-426614174000",
          expiresAt: "15 minutes from now",
          nextSteps: [
            "Proceed to set your new password",
            "Choose a strong, unique password",
          ],
        },
      },
      invalidToken: {
        response: {
          valid: false,
          message: "Reset token is invalid or has expired",
          nextSteps: [
            "Request a new password reset link",
            "Make sure you're using the latest email",
            "Contact support if issues persist",
          ],
        },
      },
      expiredToken: {
        response: {
          valid: false,
          message: "Reset token has expired",
          nextSteps: [
            "Request a new password reset",
            "Use the reset link within 15 minutes of receiving it",
          ],
        },
      },
    },
  },
});

/**
 * Reset Password Validate API endpoints
 */
const resetPasswordValidateEndpoints = {
  GET,
};

export { GET };

export const resetPasswordValidateEndpoint = resetPasswordValidateEndpoints;

export default resetPasswordValidateEndpoints;

// Export types as required by migration guide
export type ResetPasswordValidateGetRequestInput =
  typeof GET.types.RequestInput;
export type ResetPasswordValidateGetRequestOutput =
  typeof GET.types.RequestOutput;
export type ResetPasswordValidateGetResponseInput =
  typeof GET.types.ResponseInput;
export type ResetPasswordValidateGetResponseOutput =
  typeof GET.types.ResponseOutput;
