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
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
  scopedWidgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";

import { scopedTranslation } from "./i18n";
import { UserRole } from "../../user-roles/enum";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "public", "login"],
  title: "title",
  description: "description",
  icon: "log-in",
  category: "app.endpointCategories.userAuth",
  tags: ["tag"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
    UserRole.REMOTE_SKILL,
  ] as const,
  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    gap: "4",
    usage: { request: "data", response: true },
    children: {
      title: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        content: "title",
        order: 0,
        usage: { request: "data", response: true },
      }),
      subtitle: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "description",
        variant: "body-lg",
        order: 1,
        usage: { request: "data", response: true },
      }),
      email: scopedRequestField(scopedTranslation, {
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

      password: scopedRequestField(scopedTranslation, {
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

      rememberMe: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.rememberMe.label",
        columns: 12,
        helpText: "fields.rememberMe.label",
        order: 4,
        schema: z.boolean().optional().default(true), // Default to true (30 days)
      }),

      // === FORM ALERT (shows validation and API errors) ===
      formAlert: scopedWidgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        order: 5,
        usage: { request: "data" },
      }),

      // === RESPONSE ALERT (outside card) ===
      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.ALERT,
        variant: "default",
        order: 6,
        schema: z.string(),
      }),

      // === SUBMIT BUTTON (inside card) ===
      submitButton: scopedWidgetField(scopedTranslation, {
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

      forgotPassword: scopedWidgetField(scopedTranslation, {
        type: WidgetType.LINK,
        text: "footer.forgotPassword",
        href: "/user/reset-password",
        textAlign: "center",
        external: false,
        order: 8,
        columns: 12,
        usage: { request: "data" },
      }),
      createAccount: scopedWidgetField(scopedTranslation, {
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
