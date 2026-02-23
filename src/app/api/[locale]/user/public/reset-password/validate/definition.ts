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
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";

import { scopedTranslation } from "../i18n";
import { UserRole } from "../../../user-roles/enum";

/**
 * GET /reset-password/validate - Validate password reset token
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "public", "reset-password", "validate"],
  title: "validate.title",
  description: "validate.description",
  icon: "shield",
  category: "validate.category",
  tags: ["validate.tag"],
  allowedRoles: [UserRole.PUBLIC, UserRole.AI_TOOL_OFF] as const,
  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "validate.title",
    description: "validate.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === TOKEN VALIDATION ===
      tokenInput: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "validate.groups.tokenInput.title",
        description: "validate.groups.tokenInput.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { request: "data" },
        children: {
          token: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "validate.fields.token.label",
            description: "validate.fields.token.description",
            placeholder: "validate.fields.token.placeholder",
            columns: 12,
            helpText: "validate.fields.token.help",
            schema: z.string().min(1, {
              message: "validate.fields.token.validation.required",
            }),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "validate.response.title",
        description: "validate.response.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          valid: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "validate.response.valid",
            schema: z.boolean(),
          }),
          message: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "validate.response.message",
            schema: z.string(),
          }),
          userId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "validate.response.userId",
            schema: z.uuid().optional(),
          }),
          expiresAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "validate.response.expiresAt",
            schema: z.string().optional(),
          }),
          nextSteps: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "validate.response.nextSteps.item",
            schema: z.array(z.string()),
          }),
        },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "validate.errors.validation.title",
      description: "validate.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "validate.errors.unauthorized.title",
      description: "validate.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "validate.errors.internal.title",
      description: "validate.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "validate.errors.unknown.title",
      description: "validate.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "validate.errors.network.title",
      description: "validate.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "validate.errors.forbidden.title",
      description: "validate.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "validate.errors.notFound.title",
      description: "validate.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "validate.errors.unsaved.title",
      description: "validate.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "validate.errors.conflict.title",
      description: "validate.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "validate.success.title",
    description: "validate.success.description",
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
} as const;
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
