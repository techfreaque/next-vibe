/**
 * User Signup API Endpoint Definition
 * Production-ready endpoint for user registration and email checking
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

/**
 * POST /signup - User registration
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "user", "public", "signup"],
  title: "app.api.v1.core.user.public.signup.title" as const,
  description: "app.api.v1.core.user.public.signup.description" as const,
  category: "app.api.v1.core.user.category" as const,
  tags: ["app.api.v1.core.user.public.signup.tag" as const],
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.public.signup.title" as const,
      description: "app.api.v1.core.user.public.signup.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === PERSONAL INFORMATION ===
      personalInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.public.signup.groups.personalInfo.title" as const,
          description:
            "app.api.v1.core.user.public.signup.groups.personalInfo.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { request: "data" },
        {
          privateName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.user.public.signup.fields.privateName.label" as const,
              description:
                "app.api.v1.core.user.public.signup.fields.privateName.description" as const,
              placeholder:
                "app.api.v1.core.user.public.signup.fields.privateName.placeholder" as const,
              columns: 6,
            },
            z
              .string()
              .min(2, {
                message:
                  "app.api.v1.core.user.public.signup.fields.privateName.validation.minLength",
              })
              .max(100, {
                message:
                  "app.api.v1.core.user.public.signup.fields.privateName.validation.maxLength",
              }),
          ),

          publicName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.user.public.signup.fields.publicName.label" as const,
              description:
                "app.api.v1.core.user.public.signup.fields.publicName.description" as const,
              placeholder:
                "app.api.v1.core.user.public.signup.fields.publicName.placeholder" as const,
              columns: 6,
            },
            z
              .string()
              .min(2, {
                message:
                  "app.api.v1.core.user.public.signup.fields.publicName.validation.minLength",
              })
              .max(100, {
                message:
                  "app.api.v1.core.user.public.signup.fields.publicName.validation.maxLength",
              }),
          ),

          email: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label:
                "app.api.v1.core.user.public.signup.fields.email.label" as const,
              description:
                "app.api.v1.core.user.public.signup.fields.email.description" as const,
              placeholder:
                "app.api.v1.core.user.public.signup.fields.email.placeholder" as const,
              columns: 12,
            },
            z
              .string()
              .email({
                message:
                  "app.api.v1.core.user.public.signup.fields.email.validation.invalid",
              })
              .transform((val) => val.toLowerCase().trim()),
          ),
        },
      ),

      // === SECURITY CREDENTIALS ===
      security: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.public.signup.groups.security.title" as const,
          description:
            "app.api.v1.core.user.public.signup.groups.security.description" as const,
          layoutType: LayoutType.VERTICAL,
        },
        { request: "data" },
        {
          password: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label:
                "app.api.v1.core.user.public.signup.fields.password.label" as const,
              description:
                "app.api.v1.core.user.public.signup.fields.password.description" as const,
              placeholder:
                "app.api.v1.core.user.public.signup.fields.password.placeholder" as const,
              columns: 12,
            },
            z
              .string()
              .min(8, {
                message:
                  "app.api.v1.core.user.public.signup.fields.password.validation.minLength",
              })
              .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
                message:
                  "app.api.v1.core.user.public.signup.fields.password.validation.complexity",
              }),
          ),

          confirmPassword: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label:
                "app.api.v1.core.user.public.signup.fields.confirmPassword.label" as const,
              description:
                "app.api.v1.core.user.public.signup.fields.confirmPassword.description" as const,
              placeholder:
                "app.api.v1.core.user.public.signup.fields.confirmPassword.placeholder" as const,
              columns: 12,
            },
            z.string().min(8, {
              message:
                "app.api.v1.core.user.public.signup.fields.confirmPassword.validation.minLength",
            }),
          ),
        },
      ),

      // === TERMS AND CONSENT ===
      consent: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.public.signup.groups.consent.title" as const,
          description:
            "app.api.v1.core.user.public.signup.groups.consent.description" as const,
          layoutType: LayoutType.VERTICAL,
        },
        { request: "data" },
        {
          acceptTerms: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.v1.core.user.public.signup.fields.acceptTerms.label" as const,
              description:
                "app.api.v1.core.user.public.signup.fields.acceptTerms.description" as const,
              columns: 12,
            },
            z.boolean().refine((val) => val === true, {
              message:
                "app.api.v1.core.user.public.signup.fields.acceptTerms.validation.required",
            }),
          ),

          subscribeToNewsletter: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.v1.core.user.public.signup.fields.subscribeToNewsletter.label" as const,
              description:
                "app.api.v1.core.user.public.signup.fields.subscribeToNewsletter.description" as const,
              columns: 12,
            },
            z.boolean().optional().default(false),
          ),
        },
      ),

      // === REFERRAL CODE (OPTIONAL) ===
      referralCode: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.user.public.signup.fields.referralCode.label" as const,
          description:
            "app.api.v1.core.user.public.signup.fields.referralCode.description" as const,
          placeholder:
            "app.api.v1.core.user.public.signup.fields.referralCode.placeholder" as const,
          columns: 12,
        },
        z.string().optional(),
      ),

      // === ADVANCED OPTIONS (PROGRESSIVE DISCLOSURE) ===
      advanced: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.public.signup.groups.advanced.title" as const,
          description:
            "app.api.v1.core.user.public.signup.groups.advanced.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { request: "data" },
        {
          leadId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.UUID,
              label:
                "app.api.v1.core.user.public.signup.fields.leadId.label" as const,
              description:
                "app.api.v1.core.user.public.signup.fields.leadId.description" as const,
              placeholder:
                "app.api.v1.core.user.public.signup.fields.leadId.placeholder" as const,
              columns: 12,
            },
            z
              .string()
              .uuid({
                message:
                  "app.api.v1.core.user.public.signup.fields.leadId.validation.invalidUuid",
              })
              .optional(),
          ),
        },
      ),

      // === RESPONSE FIELD ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.public.signup.response.title" as const,
          description:
            "app.api.v1.core.user.public.signup.response.description" as const,
          layoutType: LayoutType.VERTICAL,
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.user.public.signup.response.success" as const,
            },
            z.boolean().describe("Whether the signup was successful"),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.public.signup.response.message" as const,
            },
            z.string().describe("Human-readable signup status message"),
          ),
          user: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.user.public.signup.response.title" as const,
              description:
                "app.api.v1.core.user.public.signup.response.description" as const,
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              id: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.public.signup.response.user.id" as const,
                },
                z.string().describe("Newly created user ID"),
              ),
              email: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.public.signup.response.user.email" as const,
                },
                z.string().describe("User email address"),
              ),
              privateName: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.public.signup.response.user.privateName" as const,
                },
                z.string().describe("User private name"),
              ),
              publicName: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.public.signup.response.user.publicName" as const,
                },
                z.string().describe("User public name"),
              ),
              verificationRequired: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.user.public.signup.response.user.verificationRequired" as const,
                },
                z.boolean().describe("Whether email verification is required"),
              ),
            },
          ),
          verificationInfo: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.user.public.signup.response.verificationInfo.title" as const,
              description:
                "app.api.v1.core.user.public.signup.response.verificationInfo.description" as const,
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              emailSent: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.user.public.signup.response.verificationInfo.emailSent" as const,
                },
                z.boolean().describe("Whether verification email was sent"),
              ),
              expiresAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.public.signup.response.verificationInfo.expiresAt" as const,
                },
                z
                  .string()
                  .describe("When verification link expires (human-readable)"),
              ),
              checkSpamFolder: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.user.public.signup.response.verificationInfo.checkSpamFolder" as const,
                },
                z.boolean().describe("Whether user should check spam folder"),
              ),
            },
          ),
          nextSteps: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.public.signup.response.nextSteps" as const,
            },
            z
              .array(z.string())
              .describe("Step-by-step instructions for the user"),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.user.public.signup.post.errors.validation.title" as const,
      description:
        "app.api.v1.core.user.public.signup.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.user.public.signup.post.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.user.public.signup.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.user.public.signup.errors.internal.title" as const,
      description:
        "app.api.v1.core.user.public.signup.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.user.public.signup.post.errors.unknown.title" as const,
      description:
        "app.api.v1.core.user.public.signup.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.user.public.signup.post.errors.conflict.title" as const,
      description:
        "app.api.v1.core.user.public.signup.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.user.public.signup.post.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.user.public.signup.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.user.public.signup.post.errors.network.title" as const,
      description:
        "app.api.v1.core.user.public.signup.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.user.public.signup.post.errors.notFound.title" as const,
      description:
        "app.api.v1.core.user.public.signup.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.user.public.signup.post.errors.unsaved.title" as const,
      description:
        "app.api.v1.core.user.public.signup.post.errors.unsaved.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.public.signup.post.success.title" as const,
    description:
      "app.api.v1.core.user.public.signup.post.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        personalInfo: {
          privateName: "John Doe",
          publicName: "John D.",
          email: "john.doe@example.com",
        },
        security: {
          password: "securepassword123",
          confirmPassword: "securepassword123",
        },
        consent: {
          acceptTerms: true,
          subscribeToNewsletter: true,
        },
        advanced: {
          leadId: "550e8400-e29b-41d4-a716-446655440000",
        },
      },
      minimal: {
        personalInfo: {
          privateName: "Jane Smith",
          publicName: "Jane S.",
          email: "jane.smith@example.com",
        },
        security: {
          password: "securepassword123",
          confirmPassword: "securepassword123",
        },
        consent: {
          acceptTerms: true,
        },
        advanced: {},
      },
      failed: {
        personalInfo: {
          privateName: "Existing User",
          publicName: "Existing U.",
          email: "existing.user@example.com",
        },
        security: {
          password: "securepassword123",
          confirmPassword: "securepassword123",
        },
        consent: {
          acceptTerms: true,
        },
        advanced: {},
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          message:
            "Account created successfully! Please check your email to verify your account.",
          user: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            email: "john.doe@example.com",
            privateName: "John Doe",
            publicName: "John D.",
            verificationRequired: true,
          },
          verificationInfo: {
            emailSent: true,
            expiresAt: "24 hours from now",
            checkSpamFolder: false,
          },
          nextSteps: [
            "Check your email for verification link",
            "Complete your profile",
            "Explore the platform",
          ],
        },
      },
      minimal: {
        response: {
          success: true,
          message: "Account created successfully!",
          user: {
            id: "123e4567-e89b-12d3-a456-426614174001",
            email: "jane.smith@example.com",
            privateName: "Jane Smith",
            publicName: "Jane S.",
            verificationRequired: true,
          },
          verificationInfo: {
            emailSent: true,
            expiresAt: "24 hours from now",
            checkSpamFolder: false,
          },
          nextSteps: ["Verify your email", "Set up your profile"],
        },
      },
      failed: {
        response: {
          success: false,
          message:
            "Account creation failed. Email address may already be in use.",
          user: {
            id: "",
            email: "",
            privateName: "",
            publicName: "",
            verificationRequired: false,
          },
          verificationInfo: {
            emailSent: false,
            expiresAt: "",
            checkSpamFolder: false,
          },
          nextSteps: [
            "Try a different email",
            "Login if you already have an account",
            "Contact support if needed",
          ],
        },
      },
    },
  },
});

/**
 * GET /signup - Email availability check
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "user", "public", "signup"],
  title: "app.api.v1.core.user.public.signup.emailCheck.title" as const,
  description:
    "app.api.v1.core.user.public.signup.emailCheck.description" as const,
  category: "app.api.v1.core.user.category" as const,
  tags: ["app.api.v1.core.user.public.signup.emailCheck.tag" as const],
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.public.signup.emailCheck.title" as const,
      description:
        "app.api.v1.core.user.public.signup.emailCheck.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      email: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label:
            "app.api.v1.core.user.public.signup.emailCheck.fields.email.label" as const,
          description:
            "app.api.v1.core.user.public.signup.emailCheck.fields.email.description" as const,
          placeholder:
            "app.api.v1.core.user.public.signup.emailCheck.fields.email.placeholder" as const,
        },
        z.string().email({
          message:
            "app.api.v1.core.user.public.signup.emailCheck.fields.email.validation.invalid",
        }),
      ),

      // === RESPONSE FIELD ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.public.signup.emailCheck.response.title" as const,
          description:
            "app.api.v1.core.user.public.signup.emailCheck.response.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          available: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.public.signup.emailCheck.response.available" as const,
            },
            z.boolean(),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.public.signup.emailCheck.response.message" as const,
            },
            z.string(),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.validation.title" as const,
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.internal.title" as const,
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.unknown.title" as const,
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.conflict.title" as const,
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.network.title" as const,
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.notFound.title" as const,
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.unsaved.title" as const,
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.unauthorized.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.v1.core.user.public.signup.emailCheck.success.title" as const,
    description:
      "app.api.v1.core.user.public.signup.emailCheck.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        email: "user@example.com",
      },
      existingUser: {
        email: "existing@example.com",
      },
    },
    responses: {
      default: {
        response: {
          available: true,
          message: "Email address is available for registration",
        },
      },
      existingUser: {
        response: {
          available: false,
          message:
            "Email address is already registered. Try logging in instead.",
        },
      },
    },
  },
});

// Export types as required by migration guide
export type SignupPostRequestInput = typeof POST.types.RequestInput;
export type SignupPostRequestOutput = typeof POST.types.RequestOutput;
export type SignupPostResponseInput = typeof POST.types.ResponseInput;
export type SignupPostResponseOutput = typeof POST.types.ResponseOutput;

export type SignupGetRequestInput = typeof GET.types.RequestInput;
export type SignupGetRequestOutput = typeof GET.types.RequestOutput;
export type SignupGetResponseInput = typeof GET.types.ResponseInput;
export type SignupGetResponseOutput = typeof GET.types.ResponseOutput;

/**
 * Signup API endpoints
 * Combines signup and email check endpoints
 */
const signupEndpoints = { POST, GET };

export default signupEndpoints;
