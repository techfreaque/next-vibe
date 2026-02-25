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
  scopedResponseArrayFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";

import { scopedTranslation } from "./i18n";
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
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "public", "login", "options"],
  title: "title",
  description: "description",
  icon: "key",
  category: "app.endpointCategories.userAuth",
  tags: ["tag"],
  allowedRoles: [UserRole.PUBLIC, UserRole.AI_TOOL_OFF] as const,
  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    description: "container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      email: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "fields.email.label",
        description: "fields.email.description",
        placeholder: "fields.email.placeholder",
        schema: z.email().optional(),
      }),

      // === RESPONSE FIELDS ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.title",
        description: "response.description",
        layoutType: LayoutType.VERTICAL,
        usage: { response: true },
        children: {
          success: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "response.success.badge",
            schema: z
              .boolean()
              .describe("Whether login options were retrieved successfully"),
          }),
          message: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.message.content",
            schema: z.string().describe("Human-readable status message"),
          }),
          forUser: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.forUser.content",
            schema: z
              .string()
              .optional()
              .describe("Email address these options are specific to"),
          }),
          loginMethods: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.loginMethods.title",
            description: "response.loginMethods.description",
            layoutType: LayoutType.VERTICAL,
            usage: { response: true },
            children: {
              password: scopedObjectFieldNew(scopedTranslation, {
                type: WidgetType.CONTAINER,
                title: "response.loginMethods.password.title",
                description: "response.loginMethods.password.description",
                layoutType: LayoutType.HORIZONTAL,
                usage: { response: true },
                children: {
                  enabled: scopedResponseField(scopedTranslation, {
                    type: WidgetType.BADGE,
                    text: "response.loginMethods.password.enabled.badge",
                    schema: z
                      .boolean()
                      .describe("Whether password login is allowed"),
                  }),
                  passwordDescription: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "response.loginMethods.password.description",
                    schema: z.string().describe("Human-readable description"),
                  }),
                },
              }),
              social: scopedObjectFieldNew(scopedTranslation, {
                type: WidgetType.CONTAINER,
                title: "response.loginMethods.social.title",
                description: "response.loginMethods.social.description",
                layoutType: LayoutType.VERTICAL,
                usage: { response: true },
                children: {
                  enabled: scopedResponseField(scopedTranslation, {
                    type: WidgetType.BADGE,
                    text: "response.loginMethods.social.enabled.badge",
                    schema: z
                      .boolean()
                      .describe("Whether social login is allowed"),
                  }),
                  socialDescription: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "response.loginMethods.social.description",
                    schema: z.string().describe("Human-readable description"),
                  }),
                  providers: scopedResponseArrayFieldNew(scopedTranslation, {
                    type: WidgetType.CONTAINER,
                    child: scopedObjectFieldNew(scopedTranslation, {
                      type: WidgetType.CONTAINER,
                      layoutType: LayoutType.HORIZONTAL,
                      usage: { response: true },
                      children: {
                        name: scopedResponseField(scopedTranslation, {
                          type: WidgetType.TEXT,
                          content:
                            "response.loginMethods.social.providers.name.content",
                          schema: z
                            .string()
                            .describe(
                              "Provider display name (e.g., 'Google', 'GitHub')",
                            ),
                        }),
                        id: scopedResponseField(scopedTranslation, {
                          type: WidgetType.TEXT,
                          content:
                            "response.loginMethods.social.providers.id.content",
                          schema: z.string().describe("Provider identifier"),
                        }),
                        enabled: scopedResponseField(scopedTranslation, {
                          type: WidgetType.BADGE,
                          text: "response.loginMethods.social.providers.enabled.badge",
                          schema: z
                            .boolean()
                            .describe("Whether this provider is available"),
                        }),
                        description: scopedResponseField(scopedTranslation, {
                          type: WidgetType.TEXT,
                          content:
                            "response.loginMethods.social.providers.description",
                          schema: z
                            .string()
                            .describe("Human-readable provider description"),
                        }),
                      },
                    }),
                  }),
                },
              }),
            },
          }),
          security: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.security.title",
            description: "response.security.description",
            layoutType: LayoutType.HORIZONTAL,
            usage: { response: true },
            children: {
              maxAttempts: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.security.maxAttempts.content",
                schema: z
                  .number()
                  .optional()
                  .describe("Maximum login attempts allowed"),
              }),
              requireTwoFactor: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.security.requireTwoFactor.badge",
                schema: z
                  .boolean()
                  .optional()
                  .describe("Whether 2FA is required for this user"),
              }),
              securityDescription: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.security.description",
                schema: z.string().describe("Security requirements summary"),
              }),
            },
          }),
        },
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
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
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
} as const;

export default loginOptionsDefinitions;
