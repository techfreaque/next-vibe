/**
 * Login API endpoint definition
 * Provides user authentication functionality with proper field definitions
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

import { UserRole } from "../../user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["user", "public", "login"],
  title: "app.api.user.public.login.title",
  description: "app.api.user.public.login.description",
  icon: "log-in",
  category: "app.api.user.category",
  tags: ["app.api.user.public.login.tag"],
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
      gap: "4",
    },
    { request: "data", response: true },
    {
      title: widgetField({
        type: WidgetType.TITLE,
        content: "app.api.user.public.login.title",
        order: 0,
        usage: { request: "data", response: true },
      }),
      subtitle: widgetField({
        type: WidgetType.TEXT,
        content: "app.api.user.public.login.description",
        variant: "body-lg",
        order: 1,
        usage: { request: "data", response: true },
      }),
      email: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "app.api.user.public.login.fields.email.label",
        description: "app.api.user.public.login.fields.email.description",
        placeholder: "app.api.user.public.login.fields.email.placeholder",
        columns: 12,
        theme: {
          style: "none",
        },
        helpText: "app.api.user.public.login.fields.email.description",
        order: 2,
        schema: z
          .string({
            error:
              "app.api.user.public.login.fields.email.validation.required" satisfies TranslationKey,
          })
          .min(1, {
            message:
              "app.api.user.public.login.fields.email.validation.required" satisfies TranslationKey,
          })
          .email({
            message:
              "app.api.user.public.login.fields.email.validation.invalid" satisfies TranslationKey,
          })
          .transform((val) => val.toLowerCase().trim()),
      }),

      password: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "app.api.user.public.login.fields.password.label",
        description: "app.api.user.public.login.fields.password.description",
        placeholder: "app.api.user.public.login.fields.password.placeholder",
        columns: 12,
        helpText: "app.api.user.public.login.fields.password.description",
        order: 3,
        theme: {
          style: "none",
        },
        schema: z
          .string({
            error:
              "app.api.user.public.login.fields.password.validation.required" satisfies TranslationKey,
          })
          .min(1, {
            message:
              "app.api.user.public.login.fields.password.validation.required" satisfies TranslationKey,
          }),
      }),

      rememberMe: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.user.public.login.fields.rememberMe.label",
        columns: 12,
        helpText: "app.api.user.public.login.fields.rememberMe.description",
        order: 4,
        schema: z.boolean().optional().default(true), // Default to true (30 days)
      }),

      // === FORM ALERT (shows validation and API errors) ===
      formAlert: widgetField({
        type: WidgetType.FORM_ALERT,
        order: 5,
        usage: { request: "data" },
      }),

      // === RESPONSE ALERT (outside card) ===
      message: responseField({
        type: WidgetType.ALERT,
        variant: "default",
        order: 6,
        schema: z.string(),
      }),

      // === SUBMIT BUTTON (inside card) ===
      submitButton: widgetField({
        type: WidgetType.SUBMIT_BUTTON,
        text: "app.api.user.public.login.actions.submit",
        loadingText: "app.api.user.public.login.actions.submitting",
        icon: "log-in",
        variant: "default",
        size: "default",
        order: 7,
        usage: { request: "data" },
      }),

      // === FOOTER LINKS (inside card, below button) ===

      forgotPassword: widgetField({
        type: WidgetType.LINK,
        text: "app.api.user.public.login.footer.forgotPassword",
        href: "/user/reset-password",
        textAlign: "center",
        external: false,
        order: 8,
        columns: 12,
        usage: { request: "data" },
      }),
      createAccount: widgetField({
        type: WidgetType.LINK,
        text: "app.api.user.public.login.footer.createAccount",
        href: "/user/signup",
        textAlign: "center",
        external: false,
        order: 9,
        columns: 12,
        usage: { request: "data" },
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.user.public.login.errors.validation.title",
      description: "app.api.user.public.login.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.user.public.login.errors.unauthorized.title",
      description: "app.api.user.public.login.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.user.public.login.errors.server.title",
      description: "app.api.user.public.login.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.user.public.login.errors.unknown.title",
      description: "app.api.user.public.login.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.user.public.login.errors.network.title",
      description: "app.api.user.public.login.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.user.public.login.errors.forbidden.title",
      description: "app.api.user.public.login.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.user.public.login.errors.notFound.title",
      description: "app.api.user.public.login.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.user.public.login.errors.unsaved.title",
      description: "app.api.user.public.login.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.user.public.login.errors.conflict.title",
      description: "app.api.user.public.login.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.user.public.login.success.title",
    description: "app.api.user.public.login.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        email: "customer@example.com",
        password: "password123",
        rememberMe: true,
      },
      failed: {
        email: "customer@example.com",
        password: "wrongpassword",
        rememberMe: true,
      },
      withAdvanced: {
        email: "customer@example.com",
        password: "password123",
        rememberMe: false,
      },
      accountLocked: {
        email: "customer@example.com",
        password: "password123",
        rememberMe: true,
      },
    },
    responses: {
      default: {
        message: "Welcome back! You have successfully logged in.",
      },
      failed: {
        message:
          "Invalid email or password. Please check your credentials and try again.",
      },
      withAdvanced: {
        message: "Welcome back! You have successfully logged in.",
      },
      accountLocked: {
        message:
          "Your account has been temporarily locked due to multiple failed login attempts.",
      },
    },
  },
});

// Extract types for use in other files
export type LoginPostRequestInput = typeof POST.types.RequestInput;
export type LoginPostRequestOutput = typeof POST.types.RequestOutput;
export type LoginPostResponseInput = typeof POST.types.ResponseInput;
export type LoginPostResponseOutput = typeof POST.types.ResponseOutput;

const loginEndpoints = { POST } as const;

export default loginEndpoints;
