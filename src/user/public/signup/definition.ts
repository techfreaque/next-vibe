/**
 * User Signup API Endpoint Definition
 * Follows the same pattern as login for consistency
 */

import { chatModelSelectionSchema } from "next-vibe/agent/ai-stream/models";
import { voiceModelSelectionSchema } from "next-vibe/agent/text-to-speech/models";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const SignupFormContainer = lazyWidget(() =>
  import("./widget/widget").then((m) => ({ default: m.SignupFormContainer })),
);

const errorTypes = {
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
} as const;

/**
 * POST /signup - User registration
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "public", "signup"],
  title: "title",
  titleShort: "titleShort",
  description: "description",
  icon: "user-plus",
  category: "account",
  tags: ["tag"],
  allowedRoles: [UserRole.PUBLIC, UserRole.AI_TOOL_OFF] as const,
  fields: customWidgetObject({
    render: SignupFormContainer,
    usage: { request: "data", response: true } as const,
    children: {
      title: widgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        label: "form.title",
        order: 0,
        usage: { request: "data", response: true },
      }),
      subtitle: widgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "form.description",
        variant: "default",
        order: 1,
        usage: { request: "data", response: true },
      }),

      privateName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.privateName.label",
        description: "fields.privateName.description",
        placeholder: "fields.privateName.placeholder",
        theme: {
          style: "none",
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

      publicName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.publicName.label",
        description: "fields.publicName.description",
        placeholder: "fields.publicName.placeholder",
        columns: 6,
        order: 5,
        theme: {
          style: "none",
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

      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "fields.email.label",
        description: "fields.email.description",
        placeholder: "fields.email.placeholder",
        columns: 12,
        theme: {
          style: "none",
          descriptionStyle: "inline",
        },
        order: 7,
        schema: z
          .string({
            error: "fields.email.validation.required",
          })
          // Normalise BEFORE the checks: a pasted " Name@Mail.com " must
          // validate and match the stored lowercase email.
          .trim()
          .toLowerCase()
          .min(1, {
            message: "fields.email.validation.required",
          })
          .email({
            message: "fields.email.validation.invalid",
          }),
      }),

      password: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.password.label",
        description: "fields.password.description",
        placeholder: "fields.password.placeholder",
        columns: 6,
        order: 9,
        theme: {
          style: "none",
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

      confirmPassword: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "fields.confirmPassword.label",
        columns: 6,
        order: 11,
        theme: {
          style: "none",
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

      subscribeToNewsletter: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.subscribeToNewsletter.label",
        description: "fields.subscribeToNewsletter.description",
        columns: 12,
        theme: {
          style: "none",
          descriptionStyle: "tooltip",
        },
        order: 13,
        // Active opt-in (GDPR/UWG): never pre-ticked
        schema: z.boolean().optional().default(false),
      }),

      acceptTerms: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.acceptTerms.label",
        description: "fields.acceptTerms.description",
        columns: 12,
        theme: {
          style: "none",
          descriptionStyle: "inline",
        },
        order: 15,
        schema: z.boolean().refine((val) => val === true, {
          message: "fields.acceptTerms.validation.required",
        }),
      }),

      referralCode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.referralCode.label",
        description: "fields.referralCode.description",
        placeholder: "fields.referralCode.placeholder",
        columns: 12,
        order: 17,
        theme: {
          style: "none",
          descriptionStyle: "inline",
        },
        // Show as readonly card when prefilled from server (only if value unchanged)
        prefillDisplay: {
          variant: "card",
          labelKey: "fields.referralCode.label",
        },
        schema: z.string().optional(),
      }),

      callbackUrl: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "confirmation.callback",
        hidden: true,
        schema: z.string().max(2048).optional(),
      }),
      pendingId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "confirmation.pendingId",
        schema: z.uuid(),
      }),
      // === SUPPORTED SKILL (hidden - set from localStorage last-attributed UUID skill) ===
      supportedSkillId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.supportedSkillId.label",
        hidden: true,
        schema: z.string().uuid().optional(),
      }),

      // === LOCAL FAVORITES (hidden - migrated from localStorage on signup) ===
      localFavorites: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.localFavorites.label",
        hidden: true,
        schema: z
          .array(
            z.object({
              /** Merged skill+variant ID: "skillSlug" or "skillSlug__variantId" */
              skillId: z.string(),
              customVariantName: z.string().nullable().optional(),
              modelSelection: chatModelSelectionSchema.nullable().optional(),
              voiceModelSelection: voiceModelSelectionSchema
                .nullable()
                .optional(),
            }),
          )
          .optional(),
      }),

      // === FORM ALERT (shows validation and API errors) ===
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        columns: 12,
        order: 18,
        usage: { request: "data" },
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        variant: "default",
        order: 19,
        schema: z.string(),
      }),

      // === SUBMIT BUTTON (inside card) ===
      submitButton: widgetField(scopedTranslation, {
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
      alreadyHaveAccount: widgetField(scopedTranslation, {
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
  errorTypes,

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
        message: "Enter the code sent to john.doe@example.com.",
        pendingId: "59326fcc-8877-49ee-85cb-63b4195d35b0",
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
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["user", "public", "signup"],
  aliases: ["signup-confirm"],
  titleShort: "confirmation.link",
  title: "confirmation.title",
  description: "confirmation.description",
  icon: "mail",
  category: "account",
  tags: ["tag"],
  allowedRoles: [UserRole.PUBLIC, UserRole.AI_TOOL_OFF] as const,
  fields: customWidgetObject({
    render: lazyWidget(() =>
      import("./widget/confirmation").then((m) => ({
        default: m.SignupConfirmationWidget,
      })),
    ),
    usage: { request: "data", response: true } as const,
    children: {
      pendingId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "confirmation.pendingId",
        schema: z.uuid().optional(),
      }),
      code: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "confirmation.code",
        schema: z
          .string()
          .regex(/^\d{6}$/)
          .optional(),
      }),
      token: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "confirmation.token",
        schema: z
          .string()
          .regex(/^[A-Za-z0-9_-]{43}$/)
          .optional(),
      }),
      newEmail: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "confirmation.email",
        schema: z.string().trim().toLowerCase().email().max(254).optional(),
      }),
      resend: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "confirmation.resend",
        schema: z.boolean().optional(),
      }),
      address: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "confirmation.email",
        schema: z.string(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "confirmation.title",
        schema: z.string(),
      }),
      bounced: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "confirmation.bounce",
        schema: z.boolean().optional(),
      }),
      resendAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "confirmation.resend",
        schema: z.number().optional(),
      }),
      redirectTo: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "confirmation.callback",
        schema: z.string().optional(),
      }),
    },
  }),
  errorTypes,
  successTypes: {
    title: "confirmation.title",
    description: "success.description",
  },
  examples: {
    requests: {
      default: {
        pendingId: "59326fcc-8877-49ee-85cb-63b4195d35b0",
        code: "123456",
      },
    },
    responses: {
      default: {
        address: "alex@example.com",
        message: "Email confirmed.",
        redirectTo: "/en-US",
      },
    },
  },
});
export type SignupPatchRequestOutput = typeof PATCH.types.RequestOutput;
export type SignupPatchResponseOutput = typeof PATCH.types.ResponseOutput;

const signupEndpoints = { POST, PATCH };

export default signupEndpoints;
