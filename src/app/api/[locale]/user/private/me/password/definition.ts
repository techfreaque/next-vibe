/**
 * User Password API Endpoint Definition
 * Production-ready endpoint for user password update functionality
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["user", "private", "me", "password"],
  title: "app.api.user.private.me.password.title" as const,
  description: "app.api.user.private.me.password.description" as const,
  icon: "lock",
  category: "app.api.user.category" as const,
  tags: ["app.api.user.private.me.password.tag" as const],
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
      title: "app.api.user.private.me.password.title" as const,
      description: "app.api.user.private.me.password.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === CURRENT PASSWORD VERIFICATION ===
      currentCredentials: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.user.private.me.password.groups.currentCredentials.title" as const,
          description:
            "app.api.user.private.me.password.groups.currentCredentials.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { request: "data" },
        {
          currentPassword: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.PASSWORD,
            label:
              "app.api.user.private.me.password.currentPassword.label" as const,
            description:
              "app.api.user.private.me.password.currentPassword.description" as const,
            placeholder:
              "app.api.user.private.me.password.currentPassword.placeholder" as const,
            columns: 12,
            helpText:
              "app.api.user.private.me.password.currentPassword.description" as const,
            schema: z.string().min(8, {
              message:
                "app.api.user.private.me.password.validation.currentPassword.minLength",
            }),
          }),
        },
      ),

      // === NEW PASSWORD SETUP ===
      newCredentials: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.user.private.me.password.groups.newCredentials.title" as const,
          description:
            "app.api.user.private.me.password.groups.newCredentials.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { request: "data" },
        {
          newPassword: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.PASSWORD,
            label:
              "app.api.user.private.me.password.newPassword.label" as const,
            description:
              "app.api.user.private.me.password.newPassword.description" as const,
            placeholder:
              "app.api.user.private.me.password.newPassword.placeholder" as const,
            columns: 12,
            helpText:
              "app.api.user.private.me.password.newPassword.description" as const,
            schema: z.string().min(8, {
              message:
                "app.api.user.private.me.password.validation.newPassword.minLength",
            }),
          }),

          confirmPassword: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.PASSWORD,
            label:
              "app.api.user.private.me.password.confirmPassword.label" as const,
            description:
              "app.api.user.private.me.password.confirmPassword.description" as const,
            placeholder:
              "app.api.user.private.me.password.confirmPassword.placeholder" as const,
            columns: 12,
            helpText:
              "app.api.user.private.me.password.confirmPassword.description" as const,
            schema: z.string().min(8, {
              message:
                "app.api.user.private.me.password.validation.confirmPassword.minLength",
            }),
          }),
        },
      ),

      // === TWO-FACTOR AUTHENTICATION (OPTIONAL) ===
      twoFactorCode: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.user.private.me.password.twoFactorCode.label" as const,
        description:
          "app.api.user.private.me.password.twoFactorCode.description" as const,
        placeholder:
          "app.api.user.private.me.password.twoFactorCode.placeholder" as const,
        columns: 12,
        helpText:
          "app.api.user.private.me.password.twoFactorCode.description" as const,
        schema: z.string().length(6).optional(),
      }),

      // === RESPONSE FIELD ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.user.private.me.password.response.title" as const,
          description:
            "app.api.user.private.me.password.response.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          success: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.user.private.me.password.response.success" as const,
            schema: z.boolean(),
          }),
          message: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.user.private.me.password.response.message" as const,
            schema: z.string(),
          }),
          securityTip: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.user.private.me.password.response.securityTip" as const,
            schema: z.string().optional(),
          }),
          nextSteps: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.user.private.me.password.response.nextSteps.item" as const,
            schema: z.array(z.string()),
          }),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.user.private.me.password.errors.validation.title" as const,
      description:
        "app.api.user.private.me.password.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.user.private.me.password.errors.unauthorized.title" as const,
      description:
        "app.api.user.private.me.password.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.user.private.me.password.errors.server.title" as const,
      description:
        "app.api.user.private.me.password.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.user.private.me.password.errors.unknown.title" as const,
      description:
        "app.api.user.private.me.password.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.user.private.me.password.errors.network.title" as const,
      description:
        "app.api.user.private.me.password.errors.network.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.user.private.me.password.errors.forbidden.title" as const,
      description:
        "app.api.user.private.me.password.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.user.private.me.password.errors.notFound.title" as const,
      description:
        "app.api.user.private.me.password.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.user.private.me.password.errors.unsavedChanges.title" as const,
      description:
        "app.api.user.private.me.password.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.user.private.me.password.errors.conflict.title" as const,
      description:
        "app.api.user.private.me.password.errors.conflict.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.user.private.me.password.success.title" as const,
    description:
      "app.api.user.private.me.password.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        currentCredentials: {
          currentPassword: "currentPassword123",
        },
        newCredentials: {
          newPassword: "newPassword456",
          confirmPassword: "newPassword456",
        },
      },
      failed: {
        currentCredentials: {
          currentPassword: "wrongPassword",
        },
        newCredentials: {
          newPassword: "newPassword456",
          confirmPassword: "newPassword456",
        },
      },
      weakPassword: {
        currentCredentials: {
          currentPassword: "currentPassword123",
        },
        newCredentials: {
          newPassword: "weak",
          confirmPassword: "weak",
        },
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          message: "Password changed successfully",
          securityTip:
            "Consider enabling two-factor authentication for additional security",
          nextSteps: [
            "Log out from other devices",
            "Update stored passwords",
            "Enable 2FA if not already active",
          ],
        },
      },
      failed: {
        response: {
          success: false,
          message: "Password change failed. Current password may be incorrect.",
          nextSteps: [
            "Verify your current password",
            "Use password reset if needed",
            "Contact support if issues persist",
          ],
        },
      },
      weakPassword: {
        response: {
          success: false,
          message: "New password does not meet security requirements",
          securityTip:
            "Use a mix of uppercase, lowercase, numbers, and special characters",
          nextSteps: [
            "Choose a stronger password",
            "Consider using a password manager",
          ],
        },
      },
    },
  },
});

// Export types as required by migration guide
export type PasswordPostRequestInput = typeof POST.types.RequestInput;
export type PasswordPostRequestOutput = typeof POST.types.RequestOutput;
export type PasswordPostResponseInput = typeof POST.types.ResponseInput;
export type PasswordPostResponseOutput = typeof POST.types.ResponseOutput;

const passwordEndpoints = { POST };

export default passwordEndpoints;
