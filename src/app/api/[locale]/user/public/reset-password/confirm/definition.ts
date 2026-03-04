/**
 * Password Reset Confirmation API Endpoint Definition
 * Production-ready endpoint for confirming password reset with new password
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  customWidgetObject,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";

import { scopedTranslation } from "../i18n";
import { UserRole } from "../../../user-roles/enum";
import { ResetPasswordConfirmContainer } from "./widget/widget";

/**
 * POST /reset-password/confirm - Confirm password reset
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "public", "reset-password", "confirm"],
  title: "confirm.title",
  description: "confirm.description",
  icon: "lock",
  category: "app.endpointCategories.userAuth",
  tags: ["confirm.tag"],
  allowedRoles: [UserRole.PUBLIC, UserRole.AI_TOOL_OFF] as const,
  fields: customWidgetObject({
    render: ResetPasswordConfirmContainer,
    usage: { request: "data", response: true } as const,
    children: {
      token: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "confirm.fields.token.label",
        description: "confirm.fields.token.description",
        placeholder: "confirm.fields.token.placeholder",
        helpText: "confirm.fields.token.help",
        schema: z.string().min(1, {
          message: "confirm.fields.token.validation.required",
        }),
      }),
      email: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "confirm.fields.email.label",
        description: "confirm.fields.email.description",
        placeholder: "confirm.fields.email.placeholder",
        schema: z
          .email({
            message: "confirm.fields.email.validation.invalid",
          })
          .transform((val) => val.toLowerCase().trim()),
      }),
      password: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "confirm.fields.password.label",
        description: "confirm.fields.password.description",
        placeholder: "confirm.fields.password.placeholder",
        helpText: "confirm.fields.password.help",
        schema: z.string().min(8, {
          message: "confirm.fields.password.validation.minLength",
        }),
      }),
      confirmPassword: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "confirm.fields.confirmPassword.label",
        description: "confirm.fields.confirmPassword.description",
        placeholder: "confirm.fields.confirmPassword.placeholder",
        schema: z.string().min(8, {
          message: "confirm.fields.confirmPassword.validation.minLength",
        }),
      }),

      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.ALERT,
        schema: z.string().describe("Human-readable status message"),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "confirm.errors.validation.title",
      description: "confirm.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "confirm.errors.unauthorized.title",
      description: "confirm.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "confirm.errors.internal.title",
      description: "confirm.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "confirm.errors.unknown.title",
      description: "confirm.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "confirm.errors.network.title",
      description: "confirm.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "confirm.errors.forbidden.title",
      description: "confirm.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "confirm.errors.notFound.title",
      description: "confirm.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "confirm.errors.unsaved.title",
      description: "confirm.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "confirm.errors.conflict.title",
      description: "confirm.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "confirm.success.title",
    description: "confirm.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        email: "user@example.com",
        token: "abc123",
        password: "newPassword123",
        confirmPassword: "newPassword123",
      },
      mismatchedPasswords: {
        email: "user@example.com",
        token: "abc123",
        password: "newPassword123",
        confirmPassword: "differentPassword123",
      },
      expiredToken: {
        email: "user@example.com",
        token: "expired-token",
        password: "newPassword123",
        confirmPassword: "newPassword123",
      },
    },
    responses: {
      default: {
        message:
          "Password reset successfully! You can now log in with your new password.",
      },
      mismatchedPasswords: {
        message:
          "Passwords do not match. Please ensure both password fields are identical.",
      },
      expiredToken: {
        message:
          "Reset token has expired. Please request a new password reset.",
      },
    },
  },
});

/**
 * Reset Password Confirm API endpoints
 */
const resetPasswordConfirmEndpoints = {
  POST,
} as const;

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
