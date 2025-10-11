/**
 * User Signup API Endpoint Definition
 * Production-ready endpoint for user registration and email checking
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

import {
  PreferredContactMethod,
  PreferredContactMethodOptions,
} from "../../enum";
import { UserRole } from "../../user-roles/enum";
import { SignupType, SignupTypeOptions } from "./enum";

/**
 * POST /signup - User registration
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "user", "public", "signup"],
  title: "app.api.v1.core.user.public.signup.title",
  description: "app.api.v1.core.user.public.signup.description",
  category: "app.api.v1.core.user.category",
  tags: ["app.api.v1.core.user.public.signup.tag"],
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.public.signup.title",
      description: "app.api.v1.core.user.public.signup.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === PERSONAL INFORMATION ===
      personalInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.public.signup.groups.personalInfo.title",
          description:
            "app.api.v1.core.user.public.signup.groups.personalInfo.description",
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { request: "data" },
        {
          firstName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.user.public.signup.fields.firstName.label",
              description:
                "app.api.v1.core.user.public.signup.fields.firstName.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.firstName.placeholder",
              required: true,
              layout: { columns: 6 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.firstName.description",
            },
            z
              .string()
              .min(2, {
                message:
                  "app.api.v1.core.user.public.signup.fields.firstName.validation.minLength",
              })
              .max(50, {
                message:
                  "app.api.v1.core.user.public.signup.fields.firstName.validation.maxLength",
              }),
          ),

          lastName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.v1.core.user.public.signup.fields.lastName.label",
              description:
                "app.api.v1.core.user.public.signup.fields.lastName.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.lastName.placeholder",
              required: true,
              layout: { columns: 6 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.lastName.description",
            },
            z
              .string()
              .min(2, {
                message:
                  "app.api.v1.core.user.public.signup.fields.lastName.validation.minLength",
              })
              .max(50, {
                message:
                  "app.api.v1.core.user.public.signup.fields.lastName.validation.maxLength",
              }),
          ),

          email: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.v1.core.user.public.signup.fields.email.label",
              description:
                "app.api.v1.core.user.public.signup.fields.email.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.email.placeholder",
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.email.description",
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
          title: "app.api.v1.core.user.public.signup.groups.security.title",
          description:
            "app.api.v1.core.user.public.signup.groups.security.description",
          layout: { type: LayoutType.VERTICAL },
        },
        { request: "data" },
        {
          password: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label: "app.api.v1.core.user.public.signup.fields.password.label",
              description:
                "app.api.v1.core.user.public.signup.fields.password.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.password.placeholder",
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.password.help",
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
                "app.api.v1.core.user.public.signup.fields.confirmPassword.label",
              description:
                "app.api.v1.core.user.public.signup.fields.confirmPassword.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.confirmPassword.placeholder",
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.confirmPassword.description",
            },
            z.string().min(8, {
              message:
                "app.api.v1.core.user.public.signup.fields.confirmPassword.validation.minLength",
            }),
          ),
        },
      ),

      // === BUSINESS INFORMATION (OPTIONAL) ===
      businessInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.public.signup.groups.businessInfo.title",
          description:
            "app.api.v1.core.user.public.signup.groups.businessInfo.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { request: "data" },
        {
          company: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.v1.core.user.public.signup.fields.company.label",
              description:
                "app.api.v1.core.user.public.signup.fields.company.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.company.placeholder",
              required: false,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.company.description",
            },
            z
              .string()
              .max(100, {
                message:
                  "app.api.v1.core.user.public.signup.fields.company.validation.maxLength",
              })
              .optional(),
          ),

          phone: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PHONE,
              label: "app.api.v1.core.user.public.signup.fields.phone.label",
              description:
                "app.api.v1.core.user.public.signup.fields.phone.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.phone.placeholder",
              required: false,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.phone.description",
            },
            z
              .string()
              .regex(/^\+?[\d\s\-()]+$/, {
                message:
                  "app.api.v1.core.user.public.signup.fields.phone.validation.format",
              })
              .optional(),
          ),
        },
      ),

      // === PREFERENCES ===
      preferences: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.public.signup.groups.preferences.title",
          description:
            "app.api.v1.core.user.public.signup.groups.preferences.description",
          layout: { type: LayoutType.VERTICAL },
        },
        { request: "data" },
        {
          preferredContactMethod: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label:
                "app.api.v1.core.user.public.signup.fields.preferredContactMethod.label",
              description:
                "app.api.v1.core.user.public.signup.fields.preferredContactMethod.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.preferredContactMethod.placeholder",
              options: PreferredContactMethodOptions,
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.preferredContactMethod.help",
            },
            z.nativeEnum(PreferredContactMethod),
          ),

          signupType: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label:
                "app.api.v1.core.user.public.signup.fields.signupType.label",
              description:
                "app.api.v1.core.user.public.signup.fields.signupType.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.signupType.placeholder",
              options: SignupTypeOptions,
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.signupType.help",
            },
            z.nativeEnum(SignupType),
          ),
        },
      ),

      // === TERMS AND CONSENT ===
      consent: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.public.signup.groups.consent.title",
          description:
            "app.api.v1.core.user.public.signup.groups.consent.description",
          layout: { type: LayoutType.VERTICAL },
        },
        { request: "data" },
        {
          acceptTerms: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.v1.core.user.public.signup.fields.acceptTerms.label",
              description:
                "app.api.v1.core.user.public.signup.fields.acceptTerms.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.acceptTerms.placeholder",
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.acceptTerms.help",
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
                "app.api.v1.core.user.public.signup.fields.subscribeToNewsletter.label",
              description:
                "app.api.v1.core.user.public.signup.fields.subscribeToNewsletter.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.subscribeToNewsletter.placeholder",
              required: false,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.subscribeToNewsletter.help",
            },
            z.boolean().optional().default(false),
          ),
        },
      ),

      // === ADVANCED OPTIONS (PROGRESSIVE DISCLOSURE) ===
      advanced: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.public.signup.groups.advanced.title",
          description:
            "app.api.v1.core.user.public.signup.groups.advanced.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { request: "data" },
        {
          imageUrl: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.URL,
              label: "app.api.v1.core.user.public.signup.fields.imageUrl.label",
              description:
                "app.api.v1.core.user.public.signup.fields.imageUrl.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.imageUrl.placeholder",
              required: false,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.imageUrl.help",
            },
            z
              .string()
              .url({
                message:
                  "app.api.v1.core.user.public.signup.fields.imageUrl.validation.invalidUrl",
              })
              .optional()
              .nullable(),
          ),

          leadId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.UUID,
              label: "app.api.v1.core.user.public.signup.fields.leadId.label",
              description:
                "app.api.v1.core.user.public.signup.fields.leadId.description",
              placeholder:
                "app.api.v1.core.user.public.signup.fields.leadId.placeholder",
              required: false,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.public.signup.fields.leadId.description",
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
          title: "app.api.v1.core.user.public.signup.response.title",
          description:
            "app.api.v1.core.user.public.signup.response.description",
          layout: { type: LayoutType.VERTICAL },
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.user.public.signup.response.success",
            },
            z.boolean().describe("Whether the signup was successful"),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.user.public.signup.response.message",
            },
            z.string().describe("Human-readable signup status message"),
          ),
          user: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.v1.core.user.public.signup.response.title",
              description:
                "app.api.v1.core.user.public.signup.response.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              id: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.public.signup.response.user.id",
                },
                z.string().describe("Newly created user ID"),
              ),
              email: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.public.signup.response.user.email",
                },
                z.string().describe("User email address"),
              ),
              firstName: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.public.signup.response.user.firstName",
                },
                z.string().describe("User first name"),
              ),
              lastName: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.public.signup.response.user.lastName",
                },
                z.string().describe("User last name"),
              ),
              imageUrl: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.public.signup.response.user.imageUrl",
                },
                z.string().nullable().describe("User profile image URL"),
              ),
              verificationRequired: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.user.public.signup.response.user.verificationRequired",
                },
                z.boolean().describe("Whether email verification is required"),
              ),
            },
          ),
          verificationInfo: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.user.public.signup.response.verificationInfo.title",
              description:
                "app.api.v1.core.user.public.signup.response.verificationInfo.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              emailSent: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.user.public.signup.response.verificationInfo.emailSent",
                },
                z.boolean().describe("Whether verification email was sent"),
              ),
              expiresAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.public.signup.response.verificationInfo.expiresAt",
                },
                z
                  .string()
                  .describe("When verification link expires (human-readable)"),
              ),
              checkSpamFolder: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.user.public.signup.response.verificationInfo.checkSpamFolder",
                },
                z.boolean().describe("Whether user should check spam folder"),
              ),
            },
          ),
          nextSteps: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.user.public.signup.response.nextSteps",
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
      title: "app.api.v1.core.user.public.signup.post.errors.validation.title",
      description:
        "app.api.v1.core.user.public.signup.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.user.public.signup.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.user.public.signup.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.user.public.signup.errors.internal.title",
      description:
        "app.api.v1.core.user.public.signup.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.user.public.signup.post.errors.unknown.title",
      description:
        "app.api.v1.core.user.public.signup.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.user.public.signup.post.errors.conflict.title",
      description:
        "app.api.v1.core.user.public.signup.post.errors.conflict.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.user.public.signup.post.errors.forbidden.title",
      description:
        "app.api.v1.core.user.public.signup.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.user.public.signup.post.errors.network.title",
      description:
        "app.api.v1.core.user.public.signup.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.user.public.signup.post.errors.notFound.title",
      description:
        "app.api.v1.core.user.public.signup.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.user.public.signup.post.errors.unsaved.title",
      description:
        "app.api.v1.core.user.public.signup.post.errors.unsaved.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.public.signup.post.success.title",
    description: "app.api.v1.core.user.public.signup.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        personalInfo: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
        security: {
          password: "securepassword123",
          confirmPassword: "securepassword123",
        },
        businessInfo: {
          company: "Example Company",
          phone: "+1234567890",
        },
        preferences: {
          preferredContactMethod: PreferredContactMethod.EMAIL,
          signupType: SignupType.MEETING,
        },
        consent: {
          acceptTerms: true,
          subscribeToNewsletter: true,
        },
        advanced: {
          imageUrl: "https://example.com/avatar.jpg",
          leadId: "550e8400-e29b-41d4-a716-446655440000",
        },
      },
      minimal: {
        personalInfo: {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
        },
        security: {
          password: "securepassword123",
          confirmPassword: "securepassword123",
        },
        businessInfo: {},
        preferences: {
          preferredContactMethod: PreferredContactMethod.EMAIL,
          signupType: SignupType.PRICING,
        },
        consent: {
          acceptTerms: true,
        },
        advanced: {},
      },
      failed: {
        personalInfo: {
          firstName: "Existing",
          lastName: "User",
          email: "existing.user@example.com",
        },
        security: {
          password: "securepassword123",
          confirmPassword: "securepassword123",
        },
        businessInfo: {},
        preferences: {
          preferredContactMethod: PreferredContactMethod.EMAIL,
          signupType: SignupType.MEETING,
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
            firstName: "John",
            lastName: "Doe",
            imageUrl: "https://example.com/avatar.jpg",
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
            firstName: "Jane",
            lastName: "Smith",
            imageUrl: null,
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
            firstName: "",
            lastName: "",
            imageUrl: null,
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
  title: "app.api.v1.core.user.public.signup.emailCheck.title",
  description: "app.api.v1.core.user.public.signup.emailCheck.description",
  category: "app.api.v1.core.user.category",
  tags: ["app.api.v1.core.user.public.signup.emailCheck.tag"],
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.public.signup.emailCheck.title",
      description: "app.api.v1.core.user.public.signup.emailCheck.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      email: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label:
            "app.api.v1.core.user.public.signup.emailCheck.fields.email.label",
          description:
            "app.api.v1.core.user.public.signup.emailCheck.fields.email.description",
          placeholder:
            "app.api.v1.core.user.public.signup.emailCheck.fields.email.placeholder",
          required: true,
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
          title: "app.api.v1.core.user.public.signup.emailCheck.response.title",
          description:
            "app.api.v1.core.user.public.signup.emailCheck.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          available: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.public.signup.emailCheck.response.available",
            },
            z.boolean(),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.public.signup.emailCheck.response.message",
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
        "app.api.v1.core.user.public.signup.emailCheck.errors.validation.title",
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.internal.title",
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.unknown.title",
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.conflict.title",
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.conflict.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.forbidden.title",
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.network.title",
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.notFound.title",
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.unsaved.title",
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.unsaved.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.user.public.signup.emailCheck.errors.unauthorized.title",
      description:
        "app.api.v1.core.user.public.signup.emailCheck.errors.unauthorized.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.public.signup.emailCheck.success.title",
    description:
      "app.api.v1.core.user.public.signup.emailCheck.success.description",
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
