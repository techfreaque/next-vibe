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
  requestDataField,
  responseField,
  responseArrayField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";

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
  path: ["user", "public", "login", "options"],
  title: "app.api.user.public.login.options.title",
  description: "app.api.user.public.login.options.description",
  icon: "key",
  category: "app.api.user.category",
  tags: ["app.api.user.public.login.options.tag"],
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.user.public.login.options.container.title",
      description: "app.api.user.public.login.options.container.description",
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
          label: "app.api.user.public.login.options.fields.email.label",
          description:
            "app.api.user.public.login.options.fields.email.description",
          placeholder:
            "app.api.user.public.login.options.fields.email.placeholder",
        },
        z.email().optional(),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.user.public.login.options.response.title",
          description: "app.api.user.public.login.options.response.description",
          layoutType: LayoutType.VERTICAL,
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.public.login.options.response.success.badge",
            },
            z
              .boolean()
              .describe("Whether login options were retrieved successfully"),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.user.public.login.options.response.message.content",
            },
            z.string().describe("Human-readable status message"),
          ),
          forUser: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.user.public.login.options.response.forUser.content",
            },
            z
              .string()
              .optional()
              .describe("Email address these options are specific to"),
          ),
          loginMethods: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.user.public.login.options.response.loginMethods.title",
              description:
                "app.api.user.public.login.options.response.loginMethods.description",
              layoutType: LayoutType.VERTICAL,
            },
            { response: true },
            {
              password: objectField(
                {
                  type: WidgetType.CONTAINER,
                  title:
                    "app.api.user.public.login.options.response.loginMethods.password.title",
                  description:
                    "app.api.user.public.login.options.response.loginMethods.password.description",
                  layoutType: LayoutType.HORIZONTAL,
                },
                { response: true },
                {
                  enabled: responseField(
                    {
                      type: WidgetType.BADGE,
                      text: "app.api.user.public.login.options.response.loginMethods.password.enabled.badge",
                    },
                    z.boolean().describe("Whether password login is allowed"),
                  ),
                  passwordDescription: responseField(
                    {
                      type: WidgetType.TEXT,
                      content:
                        "app.api.user.public.login.options.response.loginMethods.password.description",
                    },
                    z.string().describe("Human-readable description"),
                  ),
                },
              ),
              social: objectField(
                {
                  type: WidgetType.CONTAINER,
                  title:
                    "app.api.user.public.login.options.response.loginMethods.social.title",
                  description:
                    "app.api.user.public.login.options.response.loginMethods.social.description",
                  layoutType: LayoutType.VERTICAL,
                },
                { response: true },
                {
                  enabled: responseField(
                    {
                      type: WidgetType.BADGE,
                      text: "app.api.user.public.login.options.response.loginMethods.social.enabled.badge",
                    },
                    z.boolean().describe("Whether social login is allowed"),
                  ),
                  socialDescription: responseField(
                    {
                      type: WidgetType.TEXT,
                      content:
                        "app.api.user.public.login.options.response.loginMethods.social.description",
                    },
                    z.string().describe("Human-readable description"),
                  ),
                  providers: responseArrayField(
                    {
                      type: WidgetType.DATA_LIST,
                    },
                    objectField(
                      {
                        type: WidgetType.CONTAINER,
                        layoutType: LayoutType.HORIZONTAL,
                      },
                      { response: true },
                      {
                        name: responseField(
                          {
                            type: WidgetType.TEXT,
                            content:
                              "app.api.user.public.login.options.response.loginMethods.social.providers.name.content",
                          },
                          z
                            .string()
                            .describe(
                              "Provider display name (e.g., 'Google', 'GitHub')",
                            ),
                        ),
                        id: responseField(
                          {
                            type: WidgetType.TEXT,
                            content:
                              "app.api.user.public.login.options.response.loginMethods.social.providers.id.content",
                          },
                          z.string().describe("Provider identifier"),
                        ),
                        enabled: responseField(
                          {
                            type: WidgetType.BADGE,
                            text: "app.api.user.public.login.options.response.loginMethods.social.providers.enabled.badge",
                          },
                          z
                            .boolean()
                            .describe("Whether this provider is available"),
                        ),
                        description: responseField(
                          {
                            type: WidgetType.TEXT,
                            content:
                              "app.api.user.public.login.options.response.loginMethods.social.providers.description",
                          },
                          z
                            .string()
                            .describe("Human-readable provider description"),
                        ),
                      },
                    ),
                  ),
                },
              ),
            },
          ),
          security: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.user.public.login.options.response.security.title",
              description:
                "app.api.user.public.login.options.response.security.description",
              layoutType: LayoutType.HORIZONTAL,
            },
            { response: true },
            {
              maxAttempts: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.user.public.login.options.response.security.maxAttempts.content",
                },
                z
                  .number()
                  .optional()
                  .describe("Maximum login attempts allowed"),
              ),
              requireTwoFactor: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.user.public.login.options.response.security.requireTwoFactor.badge",
                },
                z
                  .boolean()
                  .optional()
                  .describe("Whether 2FA is required for this user"),
              ),
              securityDescription: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.user.public.login.options.response.security.description",
                },
                z.string().describe("Security requirements summary"),
              ),
            },
          ),
          recommendations: responseArrayField(
            {
              type: WidgetType.LINK_LIST,
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
      title: "app.api.user.public.login.options.errors.validation.title",
      description:
        "app.api.user.public.login.options.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.user.public.login.options.errors.unauthorized.title",
      description:
        "app.api.user.public.login.options.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.user.public.login.options.errors.server.title",
      description:
        "app.api.user.public.login.options.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.user.public.login.options.errors.unknown.title",
      description:
        "app.api.user.public.login.options.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.user.public.login.options.errors.network.title",
      description:
        "app.api.user.public.login.options.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.user.public.login.options.errors.forbidden.title",
      description:
        "app.api.user.public.login.options.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.user.public.login.options.errors.notFound.title",
      description:
        "app.api.user.public.login.options.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.user.public.login.options.errors.unsavedChanges.title",
      description:
        "app.api.user.public.login.options.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.user.public.login.options.errors.conflict.title",
      description:
        "app.api.user.public.login.options.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.user.public.login.options.success.title",
    description: "app.api.user.public.login.options.success.description",
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
              passwordDescription: "Log in with your email and password",
            },
            social: {
              enabled: true,
              socialDescription: "Log in with your social media accounts",
              providers: [
                {
                  name: "Google",
                  id: SocialProviders.GOOGLE,
                  enabled: true,
                  description: "Sign in with your Google account",
                },
                {
                  name: "GitHub",
                  id: SocialProviders.GITHUB,
                  enabled: true,
                  description: "Sign in with your GitHub account",
                },
                {
                  name: "Facebook",
                  id: SocialProviders.FACEBOOK,
                  enabled: true,
                  description: "Sign in with your Facebook account",
                },
              ],
            },
          },
          security: {
            maxAttempts: 5,
            requireTwoFactor: false,
            securityDescription: "Standard security requirements",
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
              passwordDescription: "Log in with your email and password",
            },
            social: {
              enabled: true,
              socialDescription: "Log in with your social media accounts",
              providers: [
                {
                  name: "Google",
                  id: SocialProviders.GOOGLE,
                  enabled: true,
                  description: "Sign in with your Google account",
                },
              ],
            },
          },
          security: {
            maxAttempts: 5,
            requireTwoFactor: false,
            securityDescription: "Standard security requirements",
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
              passwordDescription:
                "Log in with your email and password (2FA required)",
            },
            social: {
              enabled: false,
              socialDescription: "Social login disabled for admin accounts",
              providers: [],
            },
          },
          security: {
            maxAttempts: 3,
            requireTwoFactor: true,
            securityDescription:
              "Enhanced security: 2FA required, limited attempts",
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
