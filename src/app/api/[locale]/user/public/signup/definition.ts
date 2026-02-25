/**
 * User Signup API Endpoint Definition
 * Follows the same pattern as login for consistency
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
  scopedWidgetField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";

import { scopedTranslation } from "./i18n";
import { UserRole } from "../../user-roles/enum";
import { SignupFormContainer } from "./widget";

/**
 * POST /signup - User registration
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "public", "signup"],
  title: "title",
  description: "description",
  icon: "user-plus",
  category: "app.endpointCategories.userAuth",
  tags: ["tag"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
    UserRole.REMOTE_SKILL,
  ] as const,
  allowedLocalModeRoles: [UserRole.ADMIN] as const,
  fields: customWidgetObject({
    render: SignupFormContainer,
    usage: { request: "data", response: true } as const,
    children: {
      title: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        content: "form.title",
        order: 0,
        usage: { request: "data", response: true },
      }),
      subtitle: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "form.description",
        variant: "body-lg",
        order: 1,
        usage: { request: "data", response: true },
      }),

      privateName: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.privateName.label",
        description: "fields.privateName.description",
        placeholder: "fields.privateName.placeholder",
        theme: {
          descriptionStyle: "inline",
        },
        columns: 6,
        order: 3,
        schema: z
          .string({
            error: "fields.privateName.validation.required",
          })
          .min(2, {
            message: "fields.privateName.validation.minLength",
          })
          .max(100, {
            message: "fields.privateName.validation.maxLength",
          }),
      }),

      publicName: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.publicName.label",
        description: "fields.publicName.description",
        placeholder: "fields.publicName.placeholder",
        columns: 6,
        order: 5,
        theme: {
          descriptionStyle: "inline",
        },
        schema: z
          .string({
            error: "fields.publicName.validation.required",
          })
          .min(2, {
            message: "fields.publicName.validation.minLength",
          })
          .max(100, {
            message: "fields.publicName.validation.maxLength",
          }),
      }),

      email: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "fields.email.label",
        description: "fields.email.description",
        placeholder: "fields.email.placeholder",
        columns: 12,
        theme: {
          descriptionStyle: "inline",
        },
        order: 7,
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
        columns: 6,
        order: 9,
        theme: {
          descriptionStyle: "inline",
        },
        schema: z
          .string({
            error: "fields.password.validation.required",
          })
          .min(8, {
            message: "fields.password.validation.minLength",
          })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            message: "fields.password.validation.complexity",
          }),
      }),

      confirmPassword: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.confirmPassword.label",
        columns: 6,
        order: 11,
        theme: {
          descriptionStyle: "inline",
        },
        schema: z
          .string({
            error: "fields.confirmPassword.validation.required",
          })
          .min(8, {
            message: "fields.confirmPassword.validation.minLength",
          }),
      }),

      subscribeToNewsletter: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.subscribeToNewsletter.label",
        description: "fields.subscribeToNewsletter.description",
        columns: 12,
        theme: {
          descriptionStyle: "inline",
        },
        order: 13,
        schema: z.boolean().optional().default(true),
      }),

      acceptTerms: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.acceptTerms.label",
        description: "fields.acceptTerms.description",
        columns: 12,
        theme: {
          descriptionStyle: "inline",
        },
        order: 15,
        schema: z.boolean().refine((val) => val === true, {
          message: "fields.acceptTerms.validation.required",
        }),
      }),

      referralCode: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.referralCode.label",
        description: "fields.referralCode.description",
        placeholder: "fields.referralCode.placeholder",
        columns: 12,
        order: 17,
        theme: {
          descriptionStyle: "inline",
        },
        // Show as readonly card when prefilled from server (only if value unchanged)
        prefillDisplay: {
          variant: "card",
          labelKey: "fields.referralCode.label",
        },
        schema: z.string().optional(),
      }),

      // === FORM ALERT (shows validation and API errors) ===
      formAlert: scopedWidgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        columns: 12,
        order: 18,
        usage: { request: "data" },
      }),

      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.ALERT,
        variant: "default",
        order: 19,
        schema: z.string(),
      }),

      // === SUBMIT BUTTON (inside card) ===
      submitButton: scopedWidgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "actions.submit",
        loadingText: "actions.submitting",
        icon: "user-plus",
        variant: "default",
        size: "default",
        className: "w-full",
        columns: 12,
        order: 21,
        usage: { request: "data" },
      }),

      // === FOOTER LINK (inside card, below button) ===
      alreadyHaveAccount: scopedWidgetField(scopedTranslation, {
        type: WidgetType.LINK,
        text: "footer.alreadyHaveAccount",
        href: "/user/login",
        textAlign: "center",
        external: false,
        columns: 12,
        order: 23,
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
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsaved.title",
      description: "errors.unsaved.description",
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
