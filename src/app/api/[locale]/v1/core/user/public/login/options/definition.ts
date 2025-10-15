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
import { SocialProviders } from "./enum";

/**
 * Login Options Endpoint Definition
 *
 * Production-ready endpoint for getting login options and configuration
 * with enhanced field system and comprehensive validation.
 *
 * Features:
 * - Optional email parameter for user-specific options
 * - Social provider configurations
 * - Authentication method preferences
 * - Comprehensive error handling
 */

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "user", "public", "login", "options"],
  title: "app.api.v1.core.user.public.login.options.title",
  description: "app.api.v1.core.user.public.login.options.description",
  category: "app.api.v1.core.user.category",
  tags: ["app.api.v1.core.user.public.login.options.tag"],
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.public.login.options.container.title",
      description:
        "app.api.v1.core.user.public.login.options.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      email: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label: "app.api.v1.core.user.public.login.options.fields.email.label",
          description:
            "app.api.v1.core.user.public.login.options.fields.email.description",
          placeholder:
            "app.api.v1.core.user.public.login.options.fields.email.placeholder",
          required: false,
        },
        z.email().optional(),
      ),

      // === RESPONSE FIELDS ===
      response: responseField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.public.login.options.response.title",
          description:
            "app.api.v1.core.user.public.login.options.response.description",
          layout: { type: LayoutType.VERTICAL },
        },
        z.object({
          success: z
            .boolean()
            .describe("Whether login options were retrieved successfully"),
          message: z.string().describe("Human-readable status message"),
          forUser: z
            .string()
            .optional()
            .describe("Email address these options are specific to"),
          loginMethods: z
            .object({
              password: z
                .object({
                  enabled: z
                    .boolean()
                    .describe("Whether password login is allowed"),
                  description: z
                    .string()
                    .describe("Human-readable description"),
                })
                .describe("Password authentication options"),
              social: z
                .object({
                  enabled: z
                    .boolean()
                    .describe("Whether social login is allowed"),
                  description: z
                    .string()
                    .describe("Human-readable description"),
                  providers: z
                    .array(
                      z.object({
                        name: z
                          .string()
                          .describe(
                            "Provider display name (e.g., 'Google', 'GitHub')",
                          ),
                        id: z.string().describe("Provider identifier"),
                        enabled: z
                          .boolean()
                          .describe("Whether this provider is available"),
                        description: z
                          .string()
                          .describe("Human-readable provider description"),
                      }),
                    )
                    .describe("Available social login providers"),
                })
                .describe("Social authentication options"),
            })
            .describe("Available login methods and their configurations"),
          security: z
            .object({
              maxAttempts: z
                .number()
                .optional()
                .describe("Maximum login attempts allowed"),
              requireTwoFactor: z
                .boolean()
                .optional()
                .describe("Whether 2FA is required for this user"),
              description: z.string().describe("Security requirements summary"),
            })
            .describe("Security requirements and limitations"),
          recommendations: z
            .array(z.string())
            .describe("Recommended login methods for this user"),
        }),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.user.public.login.options.errors.validation.title",
      description:
        "app.api.v1.core.user.public.login.options.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.user.public.login.options.errors.unauthorized.title",
      description:
        "app.api.v1.core.user.public.login.options.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.user.public.login.options.errors.server.title",
      description:
        "app.api.v1.core.user.public.login.options.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.user.public.login.options.errors.unknown.title",
      description:
        "app.api.v1.core.user.public.login.options.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.user.public.login.options.errors.network.title",
      description:
        "app.api.v1.core.user.public.login.options.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.user.public.login.options.errors.forbidden.title",
      description:
        "app.api.v1.core.user.public.login.options.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.user.public.login.options.errors.notFound.title",
      description:
        "app.api.v1.core.user.public.login.options.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.user.public.login.options.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.user.public.login.options.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.user.public.login.options.errors.conflict.title",
      description:
        "app.api.v1.core.user.public.login.options.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.public.login.options.success.title",
    description:
      "app.api.v1.core.user.public.login.options.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        email: "user@example.com",
      },
      withoutEmail: {},
      checkOptions: {
        email: "admin@example.com",
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          message: "Login options retrieved successfully",
          forUser: "user@example.com",
          loginMethods: {
            password: {
              enabled: true,
              description: "Log in with your email and password",
            },
            social: {
              enabled: true,
              description: "Log in with your social media accounts",
              providers: [
                {
                  name: "Google",
                  id: SocialProviders.GOOGLE,
                  enabled: true,
                  description: "Continue with Google account",
                },
                {
                  name: "GitHub",
                  id: SocialProviders.GITHUB,
                  enabled: true,
                  description: "Continue with GitHub account",
                },
                {
                  name: "Facebook",
                  id: SocialProviders.FACEBOOK,
                  enabled: true,
                  description: "Continue with Facebook account",
                },
              ],
            },
          },
          security: {
            maxAttempts: 5,
            requireTwoFactor: false,
            description: "Standard security requirements",
          },
          recommendations: [
            "Try password login first",
            "Social login is faster for new users",
          ],
        },
      },
      withoutEmail: {
        response: {
          success: true,
          message: "General login options available",
          loginMethods: {
            password: {
              enabled: true,
              description: "Log in with your email and password",
            },
            social: {
              enabled: true,
              description: "Log in with your social media accounts",
              providers: [
                {
                  name: "Google",
                  id: SocialProviders.GOOGLE,
                  enabled: true,
                  description: "Continue with Google account",
                },
              ],
            },
          },
          security: {
            maxAttempts: 5,
            requireTwoFactor: false,
            description: "Standard security requirements",
          },
          recommendations: [
            "Enter your email to see personalized login options",
          ],
        },
      },
      checkOptions: {
        response: {
          success: true,
          message: "Personalized login options for admin user",
          forUser: "admin@example.com",
          loginMethods: {
            password: {
              enabled: true,
              description: "Log in with your email and password (2FA required)",
            },
            social: {
              enabled: false,
              description: "Social login disabled for admin accounts",
              providers: [],
            },
          },
          security: {
            maxAttempts: 3,
            requireTwoFactor: true,
            description: "Enhanced security: 2FA required, limited attempts",
          },
          recommendations: [
            "Use password login with 2FA",
            "Keep your authenticator app ready",
          ],
        },
      },
    },
  },
});

// Extract types for use in other files
export type LoginOptionsGetRequestInput = typeof GET.types.RequestInput;
export type LoginOptionsGetRequestOutput = typeof GET.types.RequestOutput;
export type LoginOptionsGetResponseInput = typeof GET.types.ResponseInput;
export type LoginOptionsGetResponseOutput = typeof GET.types.ResponseOutput;

const loginOptionsDefinitions = {
  GET,
};

export { GET };

export default loginOptionsDefinitions;
