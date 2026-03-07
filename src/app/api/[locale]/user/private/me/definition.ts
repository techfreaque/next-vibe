/**
 * User Profile (Me) API Endpoint Definition
 * Production-ready endpoints for user profile management
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
import { z } from "zod";

import { leadId } from "@/app/api/[locale]/leads/types";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedObjectUnionField,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserRole } from "../../user-roles/enum";
import { userRoleResponseSchema } from "../../user-roles/types";
import { scopedTranslation } from "./i18n";

/**
 * GET /me - Retrieve current user profile or JWT payload
 * Supports both authenticated users (full profile) and public users (JWT payload only)
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "private", "me"],
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "user",
  category: "app.endpointCategories.userAuth",
  tags: ["tag" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.REMOTE_SKILL,
  ] as const,
  fields: scopedObjectUnionField(
    scopedTranslation,
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    { response: true },
    "isPublic",
    [
      // Public user variant (JWT payload only)
      scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.user.title" as const,
        description: "get.response.user.description" as const,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          isPublic: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.isPublic" as const,
            schema: z.literal(true),
          }),
          leadId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.leadId" as const,
            schema: leadId,
          }),
        },
      }),
      // Private user variant (full profile)
      scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.user.title" as const,
        description: "get.response.user.description" as const,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          isPublic: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.isPublic" as const,
            schema: z.literal(false),
          }),
          id: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.id" as const,
            schema: z.uuid(),
          }),
          leadId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.leadId" as const,
            schema: leadId.nullable(),
          }),
          email: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.email" as const,
            schema: z.email({
              message: "validationErrors.user.profile.email_invalid",
            }),
          }),
          privateName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.privateName" as const,
            schema: z.string(),
          }),
          publicName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.publicName" as const,
            schema: z.string(),
          }),
          locale: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.locale" as const,
            schema: z.string() as z.ZodType<CountryLanguage>,
          }),
          isActive: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.isActive" as const,
            schema: z.boolean().nullable(),
          }),
          emailVerified: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.emailVerified" as const,
            schema: z.boolean().nullable(),
          }),
          requireTwoFactor: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.requireTwoFactor" as const,
            schema: z.boolean(),
          }),
          marketingConsent: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.marketingConsent" as const,
            schema: z.boolean(),
          }),
          userRoles: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.userRoles" as const,
            schema: z.array(userRoleResponseSchema),
          }),
          createdAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.createdAt" as const,
            schema: dateSchema,
          }),
          updatedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.updatedAt" as const,
            schema: dateSchema,
          }),
          stripeCustomerId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.stripeCustomerId" as const,
            schema: z.string().nullable(),
          }),
        },
      }),
    ] as const,
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.internal.title" as const,
      description: "get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        leadId: "550e8400-e29b-41d4-a716-446655440001",
        isPublic: false as const,
        email: "user@example.com",
        privateName: "John Doe",
        publicName: "JD",
        locale: "en-GLOBAL" as const,
        userRoles: [
          {
            id: "role-id",
            role: UserRole.CUSTOMER,
          },
        ],
        createdAt: "2024-01-15T10:00:00.000Z",
        updatedAt: "2024-01-15T10:00:00.000Z",
        requireTwoFactor: false,
        marketingConsent: false,
        isActive: true,
        emailVerified: true,
        stripeCustomerId: null,
      },
    },
  },
});

/**
 * POST /me - Update current user profile
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "private", "me"],
  title: "update.title" as const,
  description: "update.description" as const,
  icon: "user-check" as const,
  category: "app.endpointCategories.userAuth",
  tags: ["tag" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "update.title" as const,
    description: "update.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // === BASIC INFORMATION ===
      basicInfo: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "update.groups.basicInfo.title" as const,
        description: "update.groups.basicInfo.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          privateName: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "update.fields.privateName.label" as const,
            description: "update.fields.privateName.description" as const,
            placeholder: "update.fields.privateName.placeholder" as const,
            columns: 6,
            schema: z
              .string()
              .min(2, {
                message: "update.fields.privateName.validation.minLength",
              })
              .max(50, {
                message: "update.fields.privateName.validation.maxLength",
              })
              .optional(),
          }),

          publicName: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "update.fields.publicName.label" as const,
            description: "update.fields.publicName.description" as const,
            placeholder: "update.fields.publicName.placeholder" as const,
            columns: 6,
            schema: z
              .string()
              .min(2, {
                message: "update.fields.publicName.validation.minLength",
              })
              .max(50, {
                message: "update.fields.publicName.validation.maxLength",
              })
              .optional(),
          }),

          email: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.EMAIL,
            label: "update.fields.email.label" as const,
            description: "update.fields.email.description" as const,
            placeholder: "update.fields.email.placeholder" as const,
            columns: 12,
            schema: z
              .string()
              .email({
                message: "update.fields.email.validation.invalid",
              })
              .optional(),
          }),
        },
      }),

      // === PRIVACY AND PREFERENCES ===
      privacySettings: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "update.groups.privacySettings.title" as const,
        description: "update.groups.privacySettings.description" as const,
        layoutType: LayoutType.VERTICAL,
        usage: { request: "data" },
        children: {
          marketingConsent: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "update.fields.marketingConsent.label" as const,
            description: "update.fields.marketingConsent.description" as const,
            columns: 12,
            schema: z.boolean().optional(),
          }),
        },
      }),

      // === RESPONSE FIELD ===
      response: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "update.response.title" as const,
        description: "update.response.description" as const,
        layoutType: LayoutType.VERTICAL,
        usage: { response: true },
        children: {
          success: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "update.response.success" as const,
            schema: z
              .boolean()
              .describe("Whether the profile update was successful"),
          }),
          message: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.message" as const,
            schema: z.string().describe("Human-readable update status message"),
          }),
          // === USER FIELDS (FLATTENED) ===
          id: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.id" as const,
            schema: z.uuid(),
          }),
          leadId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.leadId" as const,
            schema: leadId.nullable(),
          }),
          isPublic: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "update.response.isPublic" as const,
            schema: z.literal(false),
          }),
          email: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.email" as const,
            schema: z.email({
              message: "validationErrors.user.profile.email_invalid",
            }),
          }),
          privateName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.privateName" as const,
            schema: z.string(),
          }),
          publicName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.publicName" as const,
            schema: z.string(),
          }),
          locale: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.locale" as const,
            schema: z.string() as z.ZodType<CountryLanguage>,
          }),
          isActive: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "update.response.isActive" as const,
            schema: z.boolean().nullable(),
          }),
          emailVerified: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "update.response.emailVerified" as const,
            schema: z.boolean().nullable(),
          }),
          requireTwoFactor: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "update.response.requireTwoFactor" as const,
            schema: z.boolean().optional(),
          }),
          marketingConsent: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "update.response.marketingConsent" as const,
            schema: z.boolean().optional(),
          }),
          userRoles: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.userRoles" as const,
            schema: z.array(userRoleResponseSchema),
          }),
          createdAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.createdAt" as const,
            schema: dateSchema,
          }),
          updatedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.updatedAt" as const,
            schema: dateSchema,
          }),
          stripeCustomerId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.stripeCustomerId" as const,
            schema: z.string().nullable(),
          }),
          changesSummary: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "update.response.changesSummary.title" as const,
            description: "update.response.changesSummary.description" as const,
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              totalChanges: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "update.response.changesSummary.totalChanges" as const,
                schema: z.coerce.number().describe("Number of fields updated"),
              }),
              changedFields: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content:
                  "update.response.changesSummary.changedFields" as const,
                schema: z
                  .array(z.string())
                  .describe("List of updated field names"),
              }),
              verificationRequired: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "update.response.changesSummary.verificationRequired" as const,
                schema: z
                  .boolean()
                  .describe("Whether email verification is needed"),
              }),
              lastUpdated: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "update.response.changesSummary.lastUpdated" as const,
                schema: z
                  .string()
                  .describe(
                    "When the profile was last updated (human-readable)",
                  ),
              }),
            },
          }),
          nextSteps: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.nextSteps" as const,
            schema: z
              .array(z.string())
              .describe("Recommended actions after profile update"),
          }),
        },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "update.errors.validation.title" as const,
      description: "update.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "update.errors.unauthorized.title" as const,
      description: "update.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "update.errors.forbidden.title" as const,
      description: "update.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "update.errors.notFound.title" as const,
      description: "update.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "update.errors.conflict.title" as const,
      description: "update.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "update.errors.network.title" as const,
      description: "update.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "update.errors.unsavedChanges.title" as const,
      description: "update.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "update.errors.internal.title" as const,
      description: "update.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "update.errors.unknown.title" as const,
      description: "update.errors.unknown.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "update.success.title" as const,
    description: "update.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        basicInfo: {
          privateName: "John Doe",
          publicName: "JD",
          email: "customer@example.com",
        },
        privacySettings: {
          marketingConsent: true,
        },
      },
      failed: {
        basicInfo: {
          privateName: "",
          publicName: "",
          email: "invalid-email",
        },
        privacySettings: {
          marketingConsent: false,
        },
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          message: "Profile updated successfully",
          id: "550e8400-e29b-41d4-a716-446655440000",
          leadId: "550e8400-e29b-41d4-a716-446655440001",
          isPublic: false as const,
          email: "customer@example.com",
          privateName: "John Doe",
          publicName: "JD",
          locale: "en-GLOBAL" as const,
          userRoles: [
            {
              id: "role-id",
              role: UserRole.CUSTOMER,
            },
          ],
          createdAt: "2024-01-15T10:00:00.000Z",
          updatedAt: "2024-01-15T10:00:00.000Z",
          requireTwoFactor: false,
          marketingConsent: true,
          isActive: true,
          emailVerified: true,
          stripeCustomerId: null,
          changesSummary: {
            totalChanges: 3,
            changedFields: ["privateName", "publicName", "company"],
            verificationRequired: false,
            lastUpdated: "2 seconds ago",
          },
          nextSteps: [
            "Your profile has been updated successfully",
            "Changes are now visible to other users",
          ],
        },
      },
      failed: {
        response: {
          success: false,
          message:
            "Profile update failed. Please check your inputs and try again.",
          id: "550e8400-e29b-41d4-a716-446655440000",
          leadId: "550e8400-e29b-41d4-a716-446655440001",
          isPublic: false as const,
          email: "user@example.com",
          privateName: "John Doe",
          publicName: "JD",
          locale: "en-GLOBAL" as const,
          userRoles: [],
          createdAt: "",
          updatedAt: "",
          requireTwoFactor: false,
          marketingConsent: false,
          isActive: false,
          emailVerified: false,
          stripeCustomerId: null,
          changesSummary: {
            totalChanges: 0,
            changedFields: [],
            verificationRequired: false,
            lastUpdated: "",
          },
          nextSteps: [
            "Please check your input and try again",
            "Contact support if the issue persists",
          ],
        },
      },
    },
  },
});

/**
 * DELETE /me - Delete current user account
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["user", "private", "me"],
  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "user-x" as const,
  category: "app.endpointCategories.userAuth",
  tags: ["tag" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.AI_TOOL_OFF,
  ] as const,
  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "delete.response.title" as const,
    description: "delete.response.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      exists: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.title" as const,
        schema: z.boolean(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.internal.title" as const,
      description: "delete.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        exists: true,
      },
    },
  },
});

/**
 * User Me API endpoints
 * Combines all me endpoints into a single object
 */
const meEndpoints = { GET, POST, DELETE } as const;
export default meEndpoints;

// Export types as required by migration guide
export type MeGetRequestInput = typeof GET.types.RequestInput;
export type MeGetRequestOutput = typeof GET.types.RequestOutput;
export type MeGetResponseInput = typeof GET.types.ResponseInput;
export type MeGetResponseOutput = typeof GET.types.ResponseOutput;

export type MePostRequestInput = typeof POST.types.RequestInput;
export type MePostRequestOutput = typeof POST.types.RequestOutput;
export type MePostResponseInput = typeof POST.types.ResponseInput;
export type MePostResponseOutput = typeof POST.types.ResponseOutput;

export type MeDeleteRequestInput = typeof DELETE.types.RequestInput;
export type MeDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type MeDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type MeDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
