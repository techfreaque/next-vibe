/**
 * Login API endpoint definition
 * Provides user authentication functionality with proper field definitions
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";

import { UserRole } from "../../user-roles/enum";

const loginDefinitions = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "user", "public", "login"],
  title: "app.api.v1.core.user.public.login.title",
  description: "app.api.v1.core.user.public.login.description",
  category: "app.api.v1.core.user.category",
  tags: ["app.api.v1.core.user.public.login.tag"],
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.public.login.title",
      description: "app.api.v1.core.user.public.login.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === MAIN LOGIN CREDENTIALS ===
      credentials: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.public.login.groups.credentials.title",
          description:
            "app.api.v1.core.user.public.login.groups.credentials.description",
          layout: { type: LayoutType.VERTICAL },
        },
        { request: "data" },
        {
          email: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.v1.core.user.public.login.fields.email.label",
              description:
                "app.api.v1.core.user.public.login.fields.email.description",
              placeholder:
                "app.api.v1.core.user.public.login.fields.email.placeholder",
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.login.fields.email.description",
            },
            z
              .string()
              .email({
                message:
                  "app.api.v1.core.user.public.login.fields.email.validation.invalid",
              })
              .transform((val) => val.toLowerCase().trim()),
          ),

          password: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label: "app.api.v1.core.user.public.login.fields.password.label",
              description:
                "app.api.v1.core.user.public.login.fields.password.description",
              placeholder:
                "app.api.v1.core.user.public.login.fields.password.placeholder",
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.login.fields.password.description",
            },
            z.string().min(1, {
              message:
                "app.api.v1.core.user.public.login.fields.password.validation.required",
            }),
          ),
        },
      ),

      // === LOGIN OPTIONS ===
      options: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.public.login.groups.options.title",
          description:
            "app.api.v1.core.user.public.login.groups.options.description",
          layout: { type: LayoutType.HORIZONTAL },
        },
        { request: "data" },
        {
          rememberMe: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.v1.core.user.public.login.fields.rememberMe.label",
              description:
                "app.api.v1.core.user.public.login.fields.rememberMe.description",
              placeholder:
                "app.api.v1.core.user.public.login.fields.rememberMe.placeholder",
              required: false,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.login.fields.rememberMe.description",
            },
            z.boolean().optional().default(false),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.v1.core.user.public.login.response.success",
        },
        z.boolean().describe("Whether the login was successful"),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.user.public.login.response.message",
        },
        z.string().describe("Human-readable login status message"),
      ),
      user: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.public.login.response.user.title",
          description:
            "app.api.v1.core.user.public.login.response.user.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          id: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.user.public.login.response.user.id",
            },
            z.string().describe("User unique identifier"),
          ),
          email: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.user.public.login.response.user.email",
            },
            z.string().describe("User email address"),
          ),
          privateName: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.public.login.response.user.privateName",
            },
            z.string().describe("User private name"),
          ),
          publicName: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.public.login.response.user.publicName",
            },
            z.string().describe("User public name"),
          ),
        },
      ),
      sessionInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.public.login.response.sessionInfo.title",
          description:
            "app.api.v1.core.user.public.login.response.sessionInfo.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          expiresAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.public.login.response.sessionInfo.expiresAt",
            },
            z.string().describe("When the session expires (human-readable)"),
          ),
          rememberMeActive: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.user.public.login.response.sessionInfo.rememberMeActive",
            },
            z.boolean().describe("Whether remember me is active"),
          ),
          loginLocation: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.public.login.response.sessionInfo.loginLocation",
            },
            z.string().optional().describe("Approximate login location"),
          ),
        },
      ),
      nextSteps: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.user.public.login.response.nextSteps.item",
        },
        z
          .array(z.string())
          .optional()
          .describe("Recommended actions for the user after login"),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.user.public.login.errors.validation.title",
      description:
        "app.api.v1.core.user.public.login.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.user.public.login.errors.unauthorized.title",
      description:
        "app.api.v1.core.user.public.login.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.user.public.login.errors.server.title",
      description:
        "app.api.v1.core.user.public.login.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.user.public.login.errors.unknown.title",
      description:
        "app.api.v1.core.user.public.login.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.user.public.login.errors.network.title",
      description:
        "app.api.v1.core.user.public.login.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.user.public.login.errors.forbidden.title",
      description:
        "app.api.v1.core.user.public.login.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.user.public.login.errors.notFound.title",
      description:
        "app.api.v1.core.user.public.login.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.user.public.login.errors.unsaved.title",
      description:
        "app.api.v1.core.user.public.login.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.user.public.login.errors.conflict.title",
      description:
        "app.api.v1.core.user.public.login.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.public.login.success.title",
    description: "app.api.v1.core.user.public.login.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        credentials: {
          email: "customer@example.com",
          password: "password123",
        },
        options: {
          rememberMe: true,
        },
      },
      failed: {
        credentials: {
          email: "customer@example.com",
          password: "wrongpassword",
        },
        options: {
          rememberMe: true,
        },
      },
      withAdvanced: {
        credentials: {
          email: "customer@example.com",
          password: "password123",
        },
        options: {
          rememberMe: false,
        },
      },
      accountLocked: {
        credentials: {
          email: "customer@example.com",
          password: "password123",
        },
        options: {
          rememberMe: true,
        },
      },
    },
    responses: {
      default: {
        success: true,
        message: "Welcome back! You have successfully logged in.",
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "customer@example.com",
          privateName: "John Doe",
          publicName: "John D.",
        },
        sessionInfo: {
          expiresAt: "7 days from now",
          rememberMeActive: true,
          loginLocation: "San Francisco, CA",
        },
        nextSteps: [
          "Explore your dashboard",
          "Check your profile settings",
          "Review recent activity",
        ],
      },
      failed: {
        success: false,
        message:
          "Invalid email or password. Please check your credentials and try again.",
        user: {
          id: "",
          email: "",
          privateName: "",
          publicName: "",
        },
        sessionInfo: {
          expiresAt: "",
          rememberMeActive: false,
          loginLocation: undefined,
        },
        nextSteps: [
          "Verify your email address is correct",
          "Check if Caps Lock is enabled",
          "Use 'Forgot Password' if you can't remember your password",
          "Contact support if you continue having issues",
        ],
      },
      withAdvanced: {
        success: true,
        message: "Welcome back! You have successfully logged in.",
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "customer@example.com",
          privateName: "John Doe",
          publicName: "John D.",
        },
        sessionInfo: {
          expiresAt: "7 days from now",
          rememberMeActive: false,
          loginLocation: "San Francisco, CA",
        },
        nextSteps: [
          "Explore your dashboard",
          "Check your profile settings",
          "Review recent activity",
        ],
      },
      accountLocked: {
        success: false,
        message:
          "Your account has been temporarily locked due to multiple failed login attempts.",
        user: {
          id: "",
          email: "",
          privateName: "",
          publicName: "",
        },
        sessionInfo: {
          expiresAt: "",
          rememberMeActive: false,
          loginLocation: undefined,
        },
        nextSteps: [
          "Wait 15 minutes before trying again",
          "Use password reset to regain access immediately",
          "Contact support if you believe this is an error",
        ],
      },
    },
  },
});

// Extract types for use in other files
export type LoginPostRequestInput =
  typeof loginDefinitions.POST.types.RequestInput;
export type LoginPostRequestOutput =
  typeof loginDefinitions.POST.types.RequestOutput;
export type LoginPostResponseInput =
  typeof loginDefinitions.POST.types.ResponseInput;
export type LoginPostResponseOutput =
  typeof loginDefinitions.POST.types.ResponseOutput;

export default loginDefinitions;
