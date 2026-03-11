/**
 * Login API endpoint definition
 * Provides user authentication functionality with proper field definitions
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
  requestField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";

import { scopedTranslation } from "./i18n";
import { UserRole } from "../../user-roles/enum";
import { LoginFormContainer } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "public", "login"],
  title: "title",
  description: "description",
  icon: "log-in",
  category: "app.endpointCategories.userAuth",
  tags: ["tag"],
  allowedRoles: [UserRole.PUBLIC, UserRole.AI_TOOL_OFF] as const,
  aliases: ["login"],
  fields: customWidgetObject({
    render: LoginFormContainer,
    usage: { request: "data", response: true } as const,
    children: {
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "fields.email.label",
        description: "fields.email.description",
        placeholder: "fields.email.placeholder",
        columns: 12,
        theme: {
          style: "none",
        },
        helpText: "fields.email.description",
        order: 2,
        schema: z
          .string({
            error: "fields.email.validation.required",
          })
          .min(1, {
            message: "fields.email.validation.required",
          })
          .email({
            message: "fields.email.validation.invalid",
          })
          .transform((val) => val.toLowerCase().trim()),
      }),

      password: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.password.label",
        description: "fields.password.description",
        placeholder: "fields.password.placeholder",
        columns: 12,
        helpText: "fields.password.description",
        order: 3,
        theme: {
          style: "none",
        },
        schema: z
          .string({
            error: "fields.password.validation.required",
          })
          .min(1, {
            message: "fields.password.validation.required",
          }),
      }),

      rememberMe: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.rememberMe.label",
        columns: 12,
        helpText: "fields.rememberMe.label",
        order: 4,
        schema: z.boolean().optional().default(true), // Default to true (30 days)
      }),

      // === FORM ALERT (shows validation and API errors) ===
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        order: 5,
        usage: { request: "data" },
      }),

      // === RESPONSE ALERT (outside card) ===
      message: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        variant: "default",
        order: 6,
        schema: z.string(),
      }),

      // === TOKEN + LEAD_ID (for cross-origin remote-connect flows only) ===
      // Returned in the JSON body so a local instance can extract them
      // without needing to read httpOnly Set-Cookie headers (which browsers
      // block for cross-origin responses).
      token: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),
      leadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),

      // === SUBMIT BUTTON (inside card) ===
      submitButton: widgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "actions.submit",
        loadingText: "actions.submitting",
        icon: "log-in",
        variant: "default",
        size: "default",
        order: 7,
        usage: { request: "data" },
      }),

      // === FOOTER LINKS (inside card, below button) ===

      forgotPassword: widgetField(scopedTranslation, {
        type: WidgetType.LINK,
        text: "footer.forgotPassword",
        href: "/user/reset-password",
        textAlign: "center",
        external: false,
        order: 8,
        columns: 12,
        usage: { request: "data" },
      }),
      createAccount: widgetField(scopedTranslation, {
        type: WidgetType.LINK,
        text: "footer.createAccount",
        href: "/user/signup",
        textAlign: "center",
        external: false,
        order: 9,
        columns: 12,
        usage: { request: "data" },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsaved.title",
      description: "errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
        token: undefined,
        leadId: undefined,
      },
      failed: {
        message:
          "Invalid email or password. Please check your credentials and try again.",
        token: undefined,
        leadId: undefined,
      },
      withAdvanced: {
        message: "Welcome back! You have successfully logged in.",
        token: undefined,
        leadId: undefined,
      },
      accountLocked: {
        message:
          "Your account has been temporarily locked due to multiple failed login attempts.",
        token: undefined,
        leadId: undefined,
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
