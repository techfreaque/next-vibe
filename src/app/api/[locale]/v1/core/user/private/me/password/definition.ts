/**
 * User Password API Endpoint Definition
 * Production-ready endpoint for user password update functionality
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

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "user", "private", "me", "password"],
  title: "app.api.v1.core.user.private.me.password.title",
  description: "app.api.v1.core.user.private.me.password.description",
  category: "app.api.v1.core.user.category",
  tags: ["app.api.v1.core.user.private.me.password.tag"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.private.me.password.title",
      description: "app.api.v1.core.user.private.me.password.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === CURRENT PASSWORD VERIFICATION ===
      currentCredentials: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.private.me.password.groups.currentCredentials.title",
          description:
            "app.api.v1.core.user.private.me.password.groups.currentCredentials.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { request: "data" },
        {
          currentPassword: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label:
                "app.api.v1.core.user.private.me.password.currentPassword.label",
              description:
                "app.api.v1.core.user.private.me.password.currentPassword.description",
              placeholder:
                "app.api.v1.core.user.private.me.password.currentPassword.placeholder",
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.private.me.password.currentPassword.description",
            },
            z.string().min(8, {
              message:
                "app.api.v1.core.user.private.me.password.validation.currentPassword.minLength",
            }),
          ),
        },
      ),

      // === NEW PASSWORD SETUP ===
      newCredentials: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.private.me.password.groups.newCredentials.title",
          description:
            "app.api.v1.core.user.private.me.password.groups.newCredentials.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { request: "data" },
        {
          newPassword: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label:
                "app.api.v1.core.user.private.me.password.newPassword.label",
              description:
                "app.api.v1.core.user.private.me.password.newPassword.description",
              placeholder:
                "app.api.v1.core.user.private.me.password.newPassword.placeholder",
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.private.me.password.newPassword.description",
            },
            z.string().min(8, {
              message:
                "app.api.v1.core.user.private.me.password.validation.newPassword.minLength",
            }),
          ),

          confirmPassword: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label:
                "app.api.v1.core.user.private.me.password.confirmPassword.label",
              description:
                "app.api.v1.core.user.private.me.password.confirmPassword.description",
              placeholder:
                "app.api.v1.core.user.private.me.password.confirmPassword.placeholder",
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.private.me.password.confirmPassword.description",
            },
            z.string().min(8, {
              message:
                "app.api.v1.core.user.private.me.password.validation.confirmPassword.minLength",
            }),
          ),
        },
      ),

      // === RESPONSE FIELD ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.private.me.password.response.title",
          description:
            "app.api.v1.core.user.private.me.password.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.private.me.password.response.success",
            },
            z.boolean(),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.private.me.password.response.message",
            },
            z.string(),
          ),
          securityTip: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.private.me.password.response.securityTip",
            },
            z.string().optional(),
          ),
          nextSteps: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.private.me.password.response.nextSteps.item",
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
      title: "app.api.v1.core.user.private.me.password.errors.validation.title",
      description:
        "app.api.v1.core.user.private.me.password.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.user.private.me.password.errors.unauthorized.title",
      description:
        "app.api.v1.core.user.private.me.password.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.user.private.me.password.errors.server.title",
      description:
        "app.api.v1.core.user.private.me.password.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.user.private.me.password.errors.unknown.title",
      description:
        "app.api.v1.core.user.private.me.password.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.user.private.me.password.errors.network.title",
      description:
        "app.api.v1.core.user.private.me.password.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.user.private.me.password.errors.forbidden.title",
      description:
        "app.api.v1.core.user.private.me.password.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.user.private.me.password.errors.notFound.title",
      description:
        "app.api.v1.core.user.private.me.password.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.user.private.me.password.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.user.private.me.password.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.user.private.me.password.errors.conflict.title",
      description:
        "app.api.v1.core.user.private.me.password.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.private.me.password.success.title",
    description: "app.api.v1.core.user.private.me.password.success.description",
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
