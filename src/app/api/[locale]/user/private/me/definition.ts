/**
 * User Profile (Me) API Endpoint Definition
 * Production-ready endpoints for user profile management
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
import { z } from "zod";

import { leadId } from "@/app/api/[locale]/leads/types";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  objectUnionField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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

/**
 * GET /me - Retrieve current user profile or JWT payload
 * Supports both authenticated users (full profile) and public users (JWT payload only)
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["user", "private", "me"],
  title: "app.api.user.private.me.get.title" as const,
  description: "app.api.user.private.me.get.description" as const,
  icon: "user",
  category: "app.api.user.category" as const,
  tags: ["app.api.user.private.me.tag" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  fields: objectUnionField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.user.private.me.get.response.title" as const,
      description: "app.api.user.private.me.get.response.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    "isPublic",
    [
      // Public user variant (JWT payload only)
      objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.user.private.me.get.response.user.title" as const,
          description: "app.api.user.private.me.get.response.user.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          isPublic: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.private.me.get.response.isPublic" as const,
            },
            z.literal(true),
          ),
          leadId: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.get.response.leadId" as const,
            },
            leadId,
          ),
        },
      ),
      // Private user variant (full profile)
      objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.user.private.me.get.response.user.title" as const,
          description: "app.api.user.private.me.get.response.user.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          isPublic: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.private.me.get.response.isPublic" as const,
            },
            z.literal(false),
          ),
          id: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.get.response.id" as const,
            },
            z.uuid(),
          ),
          leadId: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.get.response.leadId" as const,
            },
            leadId.nullable(),
          ),
          email: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.get.response.email" as const,
            },
            z.email({ message: "validationErrors.user.profile.email_invalid" }),
          ),
          privateName: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.get.response.privateName" as const,
            },
            z.string(),
          ),
          publicName: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.get.response.publicName" as const,
            },
            z.string(),
          ),
          locale: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.get.response.locale" as const,
            },
            z.string() as z.ZodType<CountryLanguage>,
          ),
          isActive: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.private.me.get.response.isActive" as const,
            },
            z.boolean().nullable(),
          ),
          emailVerified: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.private.me.get.response.emailVerified" as const,
            },
            z.boolean().nullable(),
          ),
          requireTwoFactor: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.private.me.get.response.requireTwoFactor" as const,
            },
            z.boolean(),
          ),
          marketingConsent: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.private.me.get.response.marketingConsent" as const,
            },
            z.boolean(),
          ),
          userRoles: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.get.response.userRoles" as const,
            },
            z.array(userRoleResponseSchema),
          ),
          createdAt: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.get.response.createdAt" as const,
            },
            dateSchema,
          ),
          updatedAt: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.get.response.updatedAt" as const,
            },
            dateSchema,
          ),
          stripeCustomerId: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.get.response.stripeCustomerId" as const,
            },
            z.string().nullable(),
          ),
        },
      ),
    ] as const,
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.user.private.me.get.errors.validation.title" as const,
      description: "app.api.user.private.me.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.user.private.me.get.errors.unauthorized.title" as const,
      description: "app.api.user.private.me.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.user.private.me.get.errors.forbidden.title" as const,
      description: "app.api.user.private.me.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.user.private.me.get.errors.notFound.title" as const,
      description: "app.api.user.private.me.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.user.private.me.get.errors.conflict.title" as const,
      description: "app.api.user.private.me.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.user.private.me.get.errors.network.title" as const,
      description: "app.api.user.private.me.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.user.private.me.get.errors.unsavedChanges.title" as const,
      description: "app.api.user.private.me.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.user.private.me.get.errors.internal.title" as const,
      description: "app.api.user.private.me.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.user.private.me.get.errors.unknown.title" as const,
      description: "app.api.user.private.me.get.errors.unknown.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.user.private.me.get.success.title" as const,
    description: "app.api.user.private.me.get.success.description" as const,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
  method: Methods.POST,
  path: ["user", "private", "me"],
  title: "app.api.user.private.me.update.title" as const,
  description: "app.api.user.private.me.update.description" as const,
  icon: "user-check" as const,
  category: "app.api.user.category" as const,
  tags: ["app.api.user.private.me.tag" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.user.private.me.update.title" as const,
      description: "app.api.user.private.me.update.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === BASIC INFORMATION ===
      basicInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.user.private.me.update.groups.basicInfo.title" as const,
          description: "app.api.user.private.me.update.groups.basicInfo.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { request: "data" },
        {
          privateName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.user.private.me.update.fields.privateName.label" as const,
              description: "app.api.user.private.me.update.fields.privateName.description" as const,
              placeholder: "app.api.user.private.me.update.fields.privateName.placeholder" as const,
              columns: 6,
            },
            z
              .string()
              .min(2, {
                message: "app.api.user.private.me.update.fields.privateName.validation.minLength",
              })
              .max(50, {
                message: "app.api.user.private.me.update.fields.privateName.validation.maxLength",
              })
              .optional(),
          ),

          publicName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.user.private.me.update.fields.publicName.label" as const,
              description: "app.api.user.private.me.update.fields.publicName.description" as const,
              placeholder: "app.api.user.private.me.update.fields.publicName.placeholder" as const,
              columns: 6,
            },
            z
              .string()
              .min(2, {
                message: "app.api.user.private.me.update.fields.publicName.validation.minLength",
              })
              .max(50, {
                message: "app.api.user.private.me.update.fields.publicName.validation.maxLength",
              })
              .optional(),
          ),

          email: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.user.private.me.update.fields.email.label" as const,
              description: "app.api.user.private.me.update.fields.email.description" as const,
              placeholder: "app.api.user.private.me.update.fields.email.placeholder" as const,
              columns: 12,
            },
            z
              .string()
              .email({
                message: "app.api.user.private.me.update.fields.email.validation.invalid",
              })
              .optional(),
          ),
        },
      ),

      // === PRIVACY AND PREFERENCES ===
      privacySettings: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.user.private.me.update.groups.privacySettings.title" as const,
          description: "app.api.user.private.me.update.groups.privacySettings.description" as const,
          layoutType: LayoutType.VERTICAL,
        },
        { request: "data" },
        {
          marketingConsent: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.user.private.me.update.fields.marketingConsent.label" as const,
              description:
                "app.api.user.private.me.update.fields.marketingConsent.description" as const,
              columns: 12,
            },
            z.boolean().optional(),
          ),
        },
      ),

      // === RESPONSE FIELD ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.user.private.me.update.response.title" as const,
          description: "app.api.user.private.me.update.response.description" as const,
          layoutType: LayoutType.VERTICAL,
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.private.me.update.response.success" as const,
            },
            z.boolean().describe("Whether the profile update was successful"),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.update.response.message" as const,
            },
            z.string().describe("Human-readable update status message"),
          ),
          // === USER FIELDS (FLATTENED) ===
          id: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.update.response.id" as const,
            },
            z.uuid(),
          ),
          leadId: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.update.response.leadId" as const,
            },
            leadId.nullable(),
          ),
          isPublic: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.private.me.update.response.isPublic" as const,
            },
            z.literal(false),
          ),
          email: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.update.response.email" as const,
            },
            z.email({ message: "validationErrors.user.profile.email_invalid" }),
          ),
          privateName: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.update.response.privateName" as const,
            },
            z.string(),
          ),
          publicName: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.update.response.publicName" as const,
            },
            z.string(),
          ),
          locale: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.update.response.locale" as const,
            },
            z.string() as z.ZodType<CountryLanguage>,
          ),
          isActive: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.private.me.update.response.isActive" as const,
            },
            z.boolean().nullable(),
          ),
          emailVerified: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.private.me.update.response.emailVerified" as const,
            },
            z.boolean().nullable(),
          ),
          requireTwoFactor: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.private.me.update.response.requireTwoFactor" as const,
            },
            z.boolean().optional(),
          ),
          marketingConsent: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.user.private.me.update.response.marketingConsent" as const,
            },
            z.boolean().optional(),
          ),
          userRoles: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.update.response.userRoles" as const,
            },
            z.array(userRoleResponseSchema),
          ),
          createdAt: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.update.response.createdAt" as const,
            },
            dateSchema,
          ),
          updatedAt: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.update.response.updatedAt" as const,
            },
            dateSchema,
          ),
          stripeCustomerId: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.update.response.stripeCustomerId" as const,
            },
            z.string().nullable(),
          ),
          changesSummary: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.user.private.me.update.response.changesSummary.title" as const,
              description:
                "app.api.user.private.me.update.response.changesSummary.description" as const,
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              totalChanges: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.user.private.me.update.response.changesSummary.totalChanges" as const,
                },
                z.coerce.number().describe("Number of fields updated"),
              ),
              changedFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.user.private.me.update.response.changesSummary.changedFields" as const,
                },
                z.array(z.string()).describe("List of updated field names"),
              ),
              verificationRequired: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.user.private.me.update.response.changesSummary.verificationRequired" as const,
                },
                z.boolean().describe("Whether email verification is needed"),
              ),
              lastUpdated: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.user.private.me.update.response.changesSummary.lastUpdated" as const,
                },
                z.string().describe("When the profile was last updated (human-readable)"),
              ),
            },
          ),
          nextSteps: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.user.private.me.update.response.nextSteps" as const,
            },
            z.array(z.string()).describe("Recommended actions after profile update"),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.user.private.me.update.errors.validation.title" as const,
      description: "app.api.user.private.me.update.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.user.private.me.update.errors.unauthorized.title" as const,
      description: "app.api.user.private.me.update.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.user.private.me.update.errors.forbidden.title" as const,
      description: "app.api.user.private.me.update.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.user.private.me.update.errors.notFound.title" as const,
      description: "app.api.user.private.me.update.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.user.private.me.update.errors.conflict.title" as const,
      description: "app.api.user.private.me.update.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.user.private.me.update.errors.network.title" as const,
      description: "app.api.user.private.me.update.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.user.private.me.update.errors.unsavedChanges.title" as const,
      description: "app.api.user.private.me.update.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.user.private.me.update.errors.internal.title" as const,
      description: "app.api.user.private.me.update.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.user.private.me.update.errors.unknown.title" as const,
      description: "app.api.user.private.me.update.errors.unknown.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.user.private.me.update.success.title" as const,
    description: "app.api.user.private.me.update.success.description" as const,
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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
          message: "Profile update failed. Please check your inputs and try again.",
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
  method: Methods.DELETE,
  path: ["user", "private", "me"],
  title: "app.api.user.private.me.delete.title" as const,
  description: "app.api.user.private.me.delete.description" as const,
  icon: "user-x" as const,
  category: "app.api.user.category" as const,
  tags: ["app.api.user.private.me.tag" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.AI_TOOL_OFF,
  ] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.user.private.me.delete.response.title" as const,
      description: "app.api.user.private.me.delete.response.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      exists: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.user.private.me.delete.response.title" as const,
        },
        z.boolean(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.user.private.me.delete.errors.validation.title" as const,
      description: "app.api.user.private.me.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.user.private.me.delete.errors.unauthorized.title" as const,
      description: "app.api.user.private.me.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.user.private.me.delete.errors.forbidden.title" as const,
      description: "app.api.user.private.me.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.user.private.me.delete.errors.notFound.title" as const,
      description: "app.api.user.private.me.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.user.private.me.delete.errors.conflict.title" as const,
      description: "app.api.user.private.me.delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.user.private.me.delete.errors.network.title" as const,
      description: "app.api.user.private.me.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.user.private.me.delete.errors.unsavedChanges.title" as const,
      description: "app.api.user.private.me.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.user.private.me.delete.errors.internal.title" as const,
      description: "app.api.user.private.me.delete.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.user.private.me.delete.errors.unknown.title" as const,
      description: "app.api.user.private.me.delete.errors.unknown.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.user.private.me.delete.success.title" as const,
    description: "app.api.user.private.me.delete.success.description" as const,
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
const meEndpoints = { GET, POST, DELETE };

export { DELETE, GET, POST };

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
