/**
 * User Profile (Me) API Endpoint Definition
 * Production-ready endpoints for user profile management
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

import { completeUserSchema } from "../../definition";
import { ProfileVisibility, ProfileVisibilityOptions } from "../../enum";
import { UserRole } from "../../user-roles/enum";

/**
 * GET /me - Retrieve current user profile
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "user", "private", "me"],
  title: "app.api.v1.core.user.private.me.get.title",
  description: "app.api.v1.core.user.private.me.get.description",
  category: "app.api.v1.core.user.category",
  tags: ["app.api.v1.core.user.private.me.tag"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.private.me.get.response.title",
      description: "app.api.v1.core.user.private.me.get.response.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      user: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.user.private.me.get.response.user.title",
        },
        completeUserSchema,
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.user.private.me.get.errors.validation.title",
      description:
        "app.api.v1.core.user.private.me.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.user.private.me.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.user.private.me.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.user.private.me.get.errors.forbidden.title",
      description:
        "app.api.v1.core.user.private.me.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.user.private.me.get.errors.notFound.title",
      description:
        "app.api.v1.core.user.private.me.get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.user.private.me.get.errors.conflict.title",
      description:
        "app.api.v1.core.user.private.me.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.user.private.me.get.errors.network.title",
      description:
        "app.api.v1.core.user.private.me.get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.user.private.me.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.user.private.me.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.user.private.me.get.errors.internal.title",
      description:
        "app.api.v1.core.user.private.me.get.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.user.private.me.get.errors.unknown.title",
      description:
        "app.api.v1.core.user.private.me.get.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.private.me.get.success.title",
    description: "app.api.v1.core.user.private.me.get.success.description",
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        user: {
          id: "user-id",
          leadId: null,
          isPublic: false as const,
          email: "user@example.com",
          firstName: "John",
          lastName: "Doe",
          imageUrl: "https://example.com/avatar.jpg",
          userRoles: [
            {
              id: "role-id",
              role: UserRole.CUSTOMER,
            },
          ],
          company: "Customer Company",
          visibility: ProfileVisibility.PUBLIC,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          requireTwoFactor: false,
          marketingConsent: false,
          isActive: true,
          emailVerified: true,
        },
      },
    },
  },
});

/**
 * POST /me - Update current user profile
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "user", "private", "me"],
  title: "app.api.v1.core.user.private.me.update.title",
  description: "app.api.v1.core.user.private.me.update.description",
  category: "app.api.v1.core.user.category",
  tags: ["app.api.v1.core.user.private.me.tag"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.private.me.update.title",
      description: "app.api.v1.core.user.private.me.update.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === BASIC INFORMATION ===
      basicInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.private.me.update.groups.basicInfo.title",
          description:
            "app.api.v1.core.user.private.me.update.groups.basicInfo.description",
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { request: "data" },
        {
          firstName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.user.private.me.update.fields.firstName.label",
              description:
                "app.api.v1.core.user.private.me.update.fields.firstName.description",
              placeholder:
                "app.api.v1.core.user.private.me.update.fields.firstName.placeholder",
              required: false,
              layout: { columns: 6 },
              helpText:
                "app.api.v1.core.user.private.me.update.fields.firstName.description",
            },
            z
              .string()
              .min(2, {
                message:
                  "app.api.v1.core.user.private.me.update.fields.firstName.validation.minLength",
              })
              .max(50, {
                message:
                  "app.api.v1.core.user.private.me.update.fields.firstName.validation.maxLength",
              })
              .optional(),
          ),

          lastName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.user.private.me.update.fields.lastName.label",
              description:
                "app.api.v1.core.user.private.me.update.fields.lastName.description",
              placeholder:
                "app.api.v1.core.user.private.me.update.fields.lastName.placeholder",
              required: false,
              layout: { columns: 6 },
              helpText:
                "app.api.v1.core.user.private.me.update.fields.lastName.description",
            },
            z
              .string()
              .min(2, {
                message:
                  "app.api.v1.core.user.private.me.update.fields.lastName.validation.minLength",
              })
              .max(50, {
                message:
                  "app.api.v1.core.user.private.me.update.fields.lastName.validation.maxLength",
              })
              .optional(),
          ),

          email: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label:
                "app.api.v1.core.user.private.me.update.fields.email.label",
              description:
                "app.api.v1.core.user.private.me.update.fields.email.description",
              placeholder:
                "app.api.v1.core.user.private.me.update.fields.email.placeholder",
              required: false,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.private.me.update.fields.email.description",
            },
            z
              .string()
              .email({
                message:
                  "app.api.v1.core.user.private.me.update.fields.email.validation.invalid",
              })
              .optional(),
          ),
        },
      ),

      // === PROFILE DETAILS ===
      profileDetails: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.private.me.update.groups.profileDetails.title",
          description:
            "app.api.v1.core.user.private.me.update.groups.profileDetails.description",
          layout: { type: LayoutType.VERTICAL },
        },
        { request: "data" },
        {
          imageUrl: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.URL,
              label:
                "app.api.v1.core.user.private.me.update.fields.imageUrl.label",
              description:
                "app.api.v1.core.user.private.me.update.fields.imageUrl.description",
              placeholder:
                "app.api.v1.core.user.private.me.update.fields.imageUrl.placeholder",
              required: false,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.private.me.update.fields.imageUrl.description",
            },
            z
              .string()
              .url({
                message:
                  "app.api.v1.core.user.private.me.update.fields.imageUrl.validation.invalid",
              })
              .optional(),
          ),

          company: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.user.private.me.update.fields.company.label",
              description:
                "app.api.v1.core.user.private.me.update.fields.company.description",
              placeholder:
                "app.api.v1.core.user.private.me.update.fields.company.placeholder",
              required: false,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.private.me.update.fields.company.description",
            },
            z
              .string()
              .max(100, {
                message:
                  "app.api.v1.core.user.private.me.update.fields.company.validation.maxLength",
              })
              .optional(),
          ),

          bio: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label: "app.api.v1.core.user.private.me.update.fields.bio.label",
              description:
                "app.api.v1.core.user.private.me.update.fields.bio.description",
              placeholder:
                "app.api.v1.core.user.private.me.update.fields.bio.placeholder",
              required: false,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.private.me.update.fields.bio.description",
            },
            z
              .string()
              .max(500, {
                message:
                  "app.api.v1.core.user.private.me.update.fields.bio.validation.maxLength",
              })
              .optional(),
          ),
        },
      ),

      // === PRIVACY AND PREFERENCES ===
      privacySettings: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.private.me.update.groups.privacySettings.title",
          description:
            "app.api.v1.core.user.private.me.update.groups.privacySettings.description",
          layout: { type: LayoutType.VERTICAL },
        },
        { request: "data" },
        {
          visibility: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label:
                "app.api.v1.core.user.private.me.update.fields.visibility.label",
              description:
                "app.api.v1.core.user.private.me.update.fields.visibility.description",
              placeholder:
                "app.api.v1.core.user.private.me.update.fields.visibility.placeholder",
              options: ProfileVisibilityOptions,
              required: false,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.private.me.update.fields.visibility.description",
            },
            z.nativeEnum(ProfileVisibility).optional(),
          ),

          marketingConsent: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.v1.core.user.private.me.update.fields.marketingConsent.label",
              description:
                "app.api.v1.core.user.private.me.update.fields.marketingConsent.description",
              placeholder:
                "app.api.v1.core.user.private.me.update.fields.marketingConsent.placeholder",
              required: false,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.private.me.update.fields.marketingConsent.description",
            },
            z.boolean().optional(),
          ),
        },
      ),

      // === RESPONSE FIELD ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.private.me.update.response.title",
          description:
            "app.api.v1.core.user.private.me.update.response.description",
          layout: { type: LayoutType.VERTICAL },
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.user.private.me.update.response.success",
            },
            z.boolean().describe("Whether the profile update was successful"),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.private.me.update.response.message",
            },
            z.string().describe("Human-readable update status message"),
          ),
          user: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.user.private.me.update.response.user",
            },
            completeUserSchema.describe("Updated user profile information"),
          ),
          changesSummary: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.user.private.me.update.response.changesSummary.title",
              description:
                "app.api.v1.core.user.private.me.update.response.changesSummary.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              totalChanges: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.private.me.update.response.changesSummary.totalChanges",
                },
                z.number().describe("Number of fields updated"),
              ),
              changedFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.private.me.update.response.changesSummary.changedFields",
                },
                z.array(z.string()).describe("List of updated field names"),
              ),
              verificationRequired: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.user.private.me.update.response.changesSummary.verificationRequired",
                },
                z.boolean().describe("Whether email verification is needed"),
              ),
              lastUpdated: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.user.private.me.update.response.changesSummary.lastUpdated",
                },
                z
                  .string()
                  .describe(
                    "When the profile was last updated (human-readable)",
                  ),
              ),
            },
          ),
          nextSteps: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.private.me.update.response.nextSteps",
            },
            z
              .array(z.string())
              .describe("Recommended actions after profile update"),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.user.private.me.update.errors.validation.title",
      description:
        "app.api.v1.core.user.private.me.update.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.user.private.me.update.errors.unauthorized.title",
      description:
        "app.api.v1.core.user.private.me.update.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.user.private.me.update.errors.forbidden.title",
      description:
        "app.api.v1.core.user.private.me.update.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.user.private.me.update.errors.notFound.title",
      description:
        "app.api.v1.core.user.private.me.update.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.user.private.me.update.errors.conflict.title",
      description:
        "app.api.v1.core.user.private.me.update.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.user.private.me.update.errors.network.title",
      description:
        "app.api.v1.core.user.private.me.update.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.user.private.me.update.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.user.private.me.update.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.user.private.me.update.errors.internal.title",
      description:
        "app.api.v1.core.user.private.me.update.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.user.private.me.update.errors.unknown.title",
      description:
        "app.api.v1.core.user.private.me.update.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.private.me.update.success.title",
    description: "app.api.v1.core.user.private.me.update.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        basicInfo: {
          firstName: "John",
          lastName: "Doe",
          email: "customer@example.com",
        },
        profileDetails: {
          imageUrl: "/placeholder.svg",
          company: "Example Company",
          bio: "Example bio text",
        },
        privacySettings: {
          visibility: ProfileVisibility.PUBLIC,
          marketingConsent: true,
        },
      },
      failed: {
        basicInfo: {
          firstName: "",
          lastName: "",
          email: "invalid-email",
        },
        profileDetails: {
          imageUrl: "not-a-valid-url",
          company: "",
          bio: "",
        },
        privacySettings: {
          visibility: ProfileVisibility.PRIVATE,
          marketingConsent: false,
        },
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          message: "Profile updated successfully",
          user: {
            id: "user-id",
            leadId: null,
            isPublic: false as const,
            email: "customer@example.com",
            firstName: "John",
            lastName: "Doe",
            imageUrl: "/placeholder.svg",
            userRoles: [
              {
                id: "role-id",
                role: UserRole.CUSTOMER,
              },
            ],
            company: "Example Company",
            visibility: ProfileVisibility.PUBLIC,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            requireTwoFactor: false,
            marketingConsent: true,
            isActive: true,
            emailVerified: true,
          },
          changesSummary: {
            totalChanges: 3,
            changedFields: ["firstName", "lastName", "company"],
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
          user: {
            id: "",
            leadId: null,
            isPublic: false as const,
            email: "",
            firstName: "",
            lastName: "",
            imageUrl: null,
            userRoles: [],
            company: "",
            visibility: ProfileVisibility.PRIVATE,
            createdAt: "",
            updatedAt: "",
            requireTwoFactor: false,
            marketingConsent: false,
            isActive: false,
            emailVerified: false,
          },
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
  path: ["v1", "core", "user", "private", "me"],
  title: "app.api.v1.core.user.private.me.delete.title",
  description: "app.api.v1.core.user.private.me.delete.description",
  category: "app.api.v1.core.user.category",
  tags: ["app.api.v1.core.user.private.me.tag"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.private.me.delete.response.title",
      description:
        "app.api.v1.core.user.private.me.delete.response.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      exists: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.user.private.me.delete.response.title",
        },
        z.boolean(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.user.private.me.delete.errors.validation.title",
      description:
        "app.api.v1.core.user.private.me.delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.user.private.me.delete.errors.unauthorized.title",
      description:
        "app.api.v1.core.user.private.me.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.user.private.me.delete.errors.forbidden.title",
      description:
        "app.api.v1.core.user.private.me.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.user.private.me.delete.errors.notFound.title",
      description:
        "app.api.v1.core.user.private.me.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.user.private.me.delete.errors.conflict.title",
      description:
        "app.api.v1.core.user.private.me.delete.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.user.private.me.delete.errors.network.title",
      description:
        "app.api.v1.core.user.private.me.delete.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.user.private.me.delete.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.user.private.me.delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.user.private.me.delete.errors.internal.title",
      description:
        "app.api.v1.core.user.private.me.delete.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.user.private.me.delete.errors.unknown.title",
      description:
        "app.api.v1.core.user.private.me.delete.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.private.me.delete.success.title",
    description: "app.api.v1.core.user.private.me.delete.success.description",
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
