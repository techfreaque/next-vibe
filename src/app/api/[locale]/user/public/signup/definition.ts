/**
 * User Signup API Endpoint Definition
 * Follows the same pattern as login for consistency
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

/**
 * POST /signup - User registration
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["user", "public", "signup"],
  title: "app.api.user.public.signup.title" as const,
  description: "app.api.user.public.signup.description" as const,
  icon: "user-plus",
  category: "app.api.user.category" as const,
  tags: ["app.api.user.public.signup.tag" as const],
  allowedRoles: [UserRole.PUBLIC, UserRole.AI_TOOL_OFF] as const,
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
        content: "app.api.user.public.signup.form.title",
        order: 0,
        usage: { request: "data", response: true },
      }),
      subtitle: widgetField({
        type: WidgetType.TEXT,
        content: "app.api.user.public.signup.form.description",
        variant: "body-lg",
        order: 1,
        usage: { request: "data", response: true },
      }),

      privateName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.user.public.signup.fields.privateName.label",
        description:
          "app.api.user.public.signup.fields.privateName.description",
        placeholder:
          "app.api.user.public.signup.fields.privateName.placeholder",
        theme: {
          descriptionStyle: "inline",
        },
        columns: 6,
        order: 3,
        schema: z
          .string({
            error:
              "app.api.user.public.signup.fields.privateName.validation.required" satisfies TranslationKey,
          })
          .min(2, {
            message:
              "app.api.user.public.signup.fields.privateName.validation.minLength" satisfies TranslationKey,
          })
          .max(100, {
            message:
              "app.api.user.public.signup.fields.privateName.validation.maxLength" satisfies TranslationKey,
          }),
      }),

      publicName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.user.public.signup.fields.publicName.label",
        description: "app.api.user.public.signup.fields.publicName.description",
        placeholder: "app.api.user.public.signup.fields.publicName.placeholder",
        columns: 6,
        order: 5,
        theme: {
          descriptionStyle: "inline",
        },
        schema: z
          .string({
            error:
              "app.api.user.public.signup.fields.publicName.validation.required" satisfies TranslationKey,
          })
          .min(2, {
            message:
              "app.api.user.public.signup.fields.publicName.validation.minLength" satisfies TranslationKey,
          })
          .max(100, {
            message:
              "app.api.user.public.signup.fields.publicName.validation.maxLength" satisfies TranslationKey,
          }),
      }),

      email: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "app.api.user.public.signup.fields.email.label",
        description: "app.api.user.public.signup.fields.email.description",
        placeholder: "app.api.user.public.signup.fields.email.placeholder",
        columns: 12,
        theme: {
          descriptionStyle: "inline",
        },
        order: 7,
        schema: z
          .string({
            error:
              "app.api.user.public.signup.fields.email.validation.required" satisfies TranslationKey,
          })
          .min(1, {
            message:
              "app.api.user.public.signup.fields.email.validation.required" satisfies TranslationKey,
          })
          .email({
            message:
              "app.api.user.public.signup.fields.email.validation.invalid" satisfies TranslationKey,
          })
          .transform((val) => val.toLowerCase().trim()),
      }),

      password: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "app.api.user.public.signup.fields.password.label",
        description: "app.api.user.public.signup.fields.password.description",
        placeholder: "app.api.user.public.signup.fields.password.placeholder",
        columns: 6,
        order: 9,
        theme: {
          descriptionStyle: "inline",
        },
        schema: z
          .string({
            error:
              "app.api.user.public.signup.fields.password.validation.required" satisfies TranslationKey,
          })
          .min(8, {
            message:
              "app.api.user.public.signup.fields.password.validation.minLength" satisfies TranslationKey,
          })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            message:
              "app.api.user.public.signup.fields.password.validation.complexity" satisfies TranslationKey,
          }),
      }),

      // === PASSWORD STRENGTH INDICATOR ===
      passwordStrength: widgetField({
        type: WidgetType.PASSWORD_STRENGTH,
        watchField: "password",
        columns: 12,
        order: 10,
        usage: { request: "data" },
      }),

      confirmPassword: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "app.api.user.public.signup.fields.confirmPassword.label",
        columns: 6,
        order: 11,
        theme: {
          descriptionStyle: "inline",
        },
        schema: z
          .string({
            error:
              "app.api.user.public.signup.fields.confirmPassword.validation.required" satisfies TranslationKey,
          })
          .min(8, {
            message:
              "app.api.user.public.signup.fields.confirmPassword.validation.minLength" satisfies TranslationKey,
          }),
      }),

      subscribeToNewsletter: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.user.public.signup.fields.subscribeToNewsletter.label",
        description:
          "app.api.user.public.signup.fields.subscribeToNewsletter.description",
        columns: 12,
        theme: {
          descriptionStyle: "inline",
        },
        order: 13,
        schema: z.boolean().optional().default(true),
      }),

      acceptTerms: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.user.public.signup.fields.acceptTerms.label",
        description:
          "app.api.user.public.signup.fields.acceptTerms.description",
        columns: 12,
        theme: {
          descriptionStyle: "inline",
        },
        order: 15,
        schema: z.boolean().refine((val) => val === true, {
          message:
            "app.api.user.public.signup.fields.acceptTerms.validation.required" satisfies TranslationKey,
        }),
      }),

      referralCode: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.user.public.signup.fields.referralCode.label",
        description:
          "app.api.user.public.signup.fields.referralCode.description",
        placeholder:
          "app.api.user.public.signup.fields.referralCode.placeholder",
        columns: 12,
        order: 17,
        theme: {
          descriptionStyle: "inline",
        },
        // Show as readonly card when prefilled from server (only if value unchanged)
        prefillDisplay: {
          variant: "card",
          labelKey: "app.api.user.public.signup.fields.referralCode.label",
        },
        schema: z.string().optional(),
      }),

      // === FORM ALERT (shows validation and API errors) ===
      formAlert: widgetField({
        type: WidgetType.FORM_ALERT,
        columns: 12,
        order: 18,
        usage: { request: "data" },
      }),

      message: responseField({
        type: WidgetType.ALERT,
        variant: "default",
        order: 19,
        schema: z.string(),
      }),

      // === SUBMIT BUTTON (inside card) ===
      submitButton: widgetField({
        type: WidgetType.SUBMIT_BUTTON,
        text: "app.api.user.public.signup.actions.submit",
        loadingText: "app.api.user.public.signup.actions.submitting",
        icon: "user-plus",
        variant: "default",
        size: "default",
        className: "w-full",
        columns: 12,
        order: 21,
        usage: { request: "data" },
      }),

      // === FOOTER LINK (inside card, below button) ===
      alreadyHaveAccount: widgetField({
        type: WidgetType.LINK,
        text: "app.api.user.public.signup.footer.alreadyHaveAccount",
        href: "/user/login",
        textAlign: "center",
        external: false,
        columns: 12,
        order: 23,
        usage: { request: "data" },
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.user.public.signup.errors.validation.title",
      description: "app.api.user.public.signup.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.user.public.signup.errors.unauthorized.title",
      description: "app.api.user.public.signup.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.user.public.signup.errors.server.title",
      description: "app.api.user.public.signup.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.user.public.signup.errors.unknown.title",
      description: "app.api.user.public.signup.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.user.public.signup.errors.conflict.title",
      description: "app.api.user.public.signup.errors.conflict.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.user.public.signup.errors.forbidden.title",
      description: "app.api.user.public.signup.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.user.public.signup.errors.network.title",
      description: "app.api.user.public.signup.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.user.public.signup.errors.notFound.title",
      description: "app.api.user.public.signup.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.user.public.signup.errors.unsaved.title",
      description: "app.api.user.public.signup.errors.unsaved.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.user.public.signup.success.title",
    description: "app.api.user.public.signup.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        privateName: "John Doe",
        publicName: "John D.",
        email: "john.doe@example.com",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: true,
      },
    },
    responses: {
      default: {
        message:
          "Account created successfully! Please check your email to verify your account.",
      },
    },
  },
});

// Export types as required by migration guide
export type SignupPostRequestInput = typeof POST.types.RequestInput;
export type SignupPostRequestOutput = typeof POST.types.RequestOutput;
export type SignupPostResponseInput = typeof POST.types.ResponseInput;
export type SignupPostResponseOutput = typeof POST.types.ResponseOutput;

/**
 * Signup API endpoints
 */
const signupEndpoints = { POST };

export default signupEndpoints;
