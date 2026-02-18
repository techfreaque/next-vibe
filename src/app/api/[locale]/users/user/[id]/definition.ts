/**
 * Individual User API Route Definition
 * Defines endpoints for specific user operations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  requestUrlPathParamsResponseField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
// // leadId schema not needed - using z.uuid() directly // TODO: Remove if not needed
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema } from "../../../shared/types/common.schema";
import { UserDeleteContainer, UserDetailContainer } from "./widget";

/**
 * Get User Endpoint Definition
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["users", "user", "[id]"],
  title: "app.api.users.user.id.id.get.title" as const,
  description: "app.api.users.user.id.id.get.description" as const,
  icon: "user",
  category: "app.api.users.user.category" as const,
  tags: ["app.api.users.user.tag" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  fields: customWidgetObject({
    render: UserDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),
      // === URL PARAMS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.users.user.id.id.get.id.label" as const,
        description: "app.api.users.user.id.id.get.id.description" as const,
        placeholder: "app.api.users.user.id.id.get.id.placeholder" as const,
        columns: 12,
        schema: z.uuid("usersErrors.validation.id.invalid"),
      }),

      // === USER PROFILE INFORMATION ===
      userProfile: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.users.user.id.id.get.response.userProfile.title" as const,
          description:
            "app.api.users.user.id.id.get.response.userProfile.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { response: true },
        {
          basicInfo: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.users.user.id.id.get.response.userProfile.basicInfo.title" as const,
              description:
                "app.api.users.user.id.id.get.response.userProfile.basicInfo.description" as const,
              layoutType: LayoutType.VERTICAL,
            },
            { response: true },
            {
              id: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.users.user.id.id.get.response.userProfile.basicInfo.id.content" as const,
                schema: z.string().uuid().describe("User unique identifier"),
              }),
              email: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.users.user.id.id.get.response.userProfile.basicInfo.email.content" as const,
                schema: z.string().email().describe("User's email address"),
              }),
              privateName: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.users.user.id.id.get.response.userProfile.basicInfo.privateName.content" as const,
                schema: z.string().describe("User's private name"),
              }),
              publicName: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.users.user.id.id.get.response.userProfile.basicInfo.publicName.content" as const,
                schema: z.string().describe("User's public name"),
              }),
            },
          ),
        },
      ),

      // === ACCOUNT STATUS ===
      accountStatus: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.users.user.id.id.get.response.accountStatus.title" as const,
          description:
            "app.api.users.user.id.id.get.response.accountStatus.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { response: true },
        {
          isActive: responseField({
            type: WidgetType.BADGE,
            text: "app.api.users.user.id.id.get.response.accountStatus.isActive.content" as const,
            schema: z.boolean().describe("Account active status"),
          }),
          emailVerified: responseField({
            type: WidgetType.BADGE,
            text: "app.api.users.user.id.id.get.response.accountStatus.emailVerified.content" as const,
            schema: z.boolean().describe("Email verification status"),
          }),
          stripeCustomerId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.users.user.id.id.get.response.accountStatus.stripeCustomerId.content" as const,
            schema: z.string().nullable().describe("Stripe customer ID"),
          }),
          userRoles: responseArrayField(
            {
              type: WidgetType.CONTAINER,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.HORIZONTAL,
              },
              { response: true },
              {
                id: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.users.user.id.id.get.response.accountStatus.userRoles.content" as const,
                  schema: z.uuid().describe("Role ID"),
                }),
                role: responseField({
                  type: WidgetType.BADGE,
                  text: "app.api.users.user.id.id.get.response.accountStatus.userRoles.content" as const,
                  schema: z.string().describe("Role name"),
                }),
              },
            ),
          ),
        },
      ),

      // === TIMESTAMPS ===
      timestamps: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.users.user.id.id.get.response.timestamps.title" as const,
          description:
            "app.api.users.user.id.id.get.response.timestamps.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { response: true },
        {
          createdAt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.users.user.id.id.get.response.timestamps.createdAt.content" as const,
            schema: dateSchema.describe("Account creation date"),
          }),
          updatedAt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.users.user.id.id.get.response.timestamps.updatedAt.content" as const,
            schema: dateSchema.describe("Last update date"),
          }),
        },
      ),

      leadId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.get.response.leadId.content" as const,
        schema: z.uuid().nullable(),
      }),
      email: responseField({
        type: WidgetType.TEXT,
        content: "app.api.users.user.id.id.get.response.email.content" as const,
        schema: z.email(),
      }),
      privateName: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.get.response.privateName.content" as const,
        schema: z.string(),
      }),
      publicName: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.get.response.publicName.content" as const,
        schema: z.string(),
      }),
      emailVerified: responseField({
        type: WidgetType.BADGE,
        text: "app.api.users.user.id.id.get.response.emailVerified.content" as const,
        schema: z.boolean(),
      }),
      isActive: responseField({
        type: WidgetType.BADGE,
        text: "app.api.users.user.id.id.get.response.isActive.content" as const,
        schema: z.boolean(),
      }),
      stripeCustomerId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.get.response.stripeCustomerId.content" as const,
        schema: z.string().nullable(),
      }),
      userRoles: responseArrayField(
        {
          type: WidgetType.CONTAINER,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.HORIZONTAL,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.users.user.id.id.get.response.userRoles.content" as const,
              schema: z.uuid(),
            }),
            role: responseField({
              type: WidgetType.BADGE,
              text: "app.api.users.user.id.id.get.response.userRoles.content" as const,
              schema: z.string(),
            }),
          },
        ),
      ),
      createdAt: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.get.response.createdAt.content" as const,
        schema: dateSchema,
      }),
      updatedAt: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.get.response.updatedAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.users.user.id.id.get.errors.unauthorized.title" as const,
      description:
        "app.api.users.user.id.id.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.users.user.id.id.get.errors.validation.title" as const,
      description:
        "app.api.users.user.id.id.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.users.user.id.id.get.errors.forbidden.title" as const,
      description:
        "app.api.users.user.id.id.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.users.user.id.id.get.errors.notFound.title" as const,
      description:
        "app.api.users.user.id.id.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.users.user.id.id.get.errors.conflict.title" as const,
      description:
        "app.api.users.user.id.id.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.users.user.id.id.get.errors.network.title" as const,
      description:
        "app.api.users.user.id.id.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.users.user.id.id.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.users.user.id.id.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.users.user.id.id.get.errors.server.title" as const,
      description:
        "app.api.users.user.id.id.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.users.user.id.id.get.errors.unknown.title" as const,
      description:
        "app.api.users.user.id.id.get.errors.unknown.description" as const,
    },
  },
  successTypes: {
    title: "app.api.users.user.id.id.get.success.title" as const,
    description: "app.api.users.user.id.id.get.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        userProfile: {
          basicInfo: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            email: "john.doe@example.com",
            privateName: "John Doe",
            publicName: "John D.",
          },
        },
        accountStatus: {
          isActive: true,
          emailVerified: true,
          stripeCustomerId: null,
          userRoles: [
            {
              id: "role-id",
              role: UserRole.CUSTOMER,
            },
          ],
        },
        timestamps: {
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T00:00:00.000Z",
        },
        // Backward compatibility fields
        leadId: null,
        email: "john.doe@example.com",
        privateName: "John Doe",
        publicName: "John D.",
        emailVerified: true,
        isActive: true,
        stripeCustomerId: null,
        userRoles: [
          {
            id: "role-id",
            role: UserRole.CUSTOMER,
          },
        ],
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
      },
    },
  },
});

/**
 * Update User Endpoint Definition
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: ["users", "user", "[id]"],
  title: "app.api.users.user.id.id.put.title" as const,
  description: "app.api.users.user.id.id.put.description" as const,
  icon: "user-check" as const,
  category: "app.api.users.user.category" as const,
  tags: ["app.api.users.user.tag" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.users.user.id.id.put.container.title" as const,
      description:
        "app.api.users.user.id.id.put.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMS ===
      id: requestUrlPathParamsResponseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.users.user.id.id.put.id.label" as const,
        description: "app.api.users.user.id.id.put.id.description" as const,
        placeholder: "app.api.users.user.id.id.put.id.placeholder" as const,
        columns: 12,
        schema: z.string().uuid("usersErrors.validation.id.invalid"),
      }),

      // === BASIC INFORMATION ===
      basicInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.users.user.id.id.put.sections.basicInfo.title" as const,
          description:
            "app.api.users.user.id.id.put.sections.basicInfo.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { request: "data" },
        {
          email: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.EMAIL,
            label: "app.api.users.user.id.id.put.email.label" as const,
            description:
              "app.api.users.user.id.id.put.email.description" as const,
            placeholder:
              "app.api.users.user.id.id.put.email.placeholder" as const,
            columns: 12,
            schema: z
              .string()
              .email("usersErrors.validation.email.invalid")
              .transform((val) => val.toLowerCase().trim())
              .optional(),
          }),
          privateName: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "app.api.users.user.id.id.put.privateName.label" as const,
            description:
              "app.api.users.user.id.id.put.privateName.description" as const,
            columns: 6,
            schema: z
              .string()
              .min(1, "usersErrors.validation.privateName.required")
              .max(255, "usersErrors.validation.privateName.tooLong")
              .transform((val) => val.trim())
              .optional(),
          }),
          publicName: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "app.api.users.user.id.id.put.publicName.label" as const,
            description:
              "app.api.users.user.id.id.put.publicName.description" as const,
            columns: 6,
            schema: z
              .string()
              .min(1, "usersErrors.validation.publicName.required")
              .max(255, "usersErrors.validation.publicName.tooLong")
              .transform((val) => val.trim())
              .optional(),
          }),
        },
      ),

      // === ADMINISTRATIVE SETTINGS ===
      adminSettings: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.users.user.id.id.put.sections.adminSettings.title" as const,
          description:
            "app.api.users.user.id.id.put.sections.adminSettings.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { request: "data" },
        {
          emailVerified: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.users.user.id.id.put.emailVerified.label" as const,
            description:
              "app.api.users.user.id.id.put.emailVerified.description" as const,
            columns: 6,
            schema: z.boolean().optional(),
          }),
          isActive: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.users.user.id.id.put.isActive.label" as const,
            description:
              "app.api.users.user.id.id.put.isActive.description" as const,
            columns: 6,
            schema: z.boolean().optional(),
          }),
          leadId: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.UUID,
            label: "app.api.users.user.id.id.put.leadId.label" as const,
            description:
              "app.api.users.user.id.id.put.leadId.description" as const,
            columns: 6,
            schema: z.uuid().nullable().optional(),
          }),
        },
      ),

      // === RESPONSE FIELDS (same as GET) ===
      leadId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.put.response.leadId.content" as const,
        schema: z.uuid().nullable(),
      }),
      email: responseField({
        type: WidgetType.TEXT,
        content: "app.api.users.user.id.id.put.response.email.content" as const,
        schema: z.email(),
      }),
      privateName: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.put.response.privateName.content" as const,
        schema: z.string(),
      }),
      publicName: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.put.response.publicName.content" as const,
        schema: z.string(),
      }),
      emailVerified: responseField({
        type: WidgetType.BADGE,
        text: "app.api.users.user.id.id.put.response.emailVerified.content" as const,
        schema: z.boolean(),
      }),
      isActive: responseField({
        type: WidgetType.BADGE,
        text: "app.api.users.user.id.id.put.response.isActive.content" as const,
        schema: z.boolean(),
      }),
      stripeCustomerId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.put.response.stripeCustomerId.content" as const,
        schema: z.string().nullable(),
      }),
      userRoles: responseArrayField(
        {
          type: WidgetType.CONTAINER,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.HORIZONTAL,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.users.user.id.id.put.response.userRoles.content" as const,
              schema: z.uuid(),
            }),
            role: responseField({
              type: WidgetType.BADGE,
              text: "app.api.users.user.id.id.put.response.userRoles.content" as const,
              schema: z.string(),
            }),
          },
        ),
      ),
      createdAt: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.put.response.createdAt.content" as const,
        schema: dateSchema,
      }),
      updatedAt: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.put.response.updatedAt.content" as const,
        schema: dateSchema,
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.users.user.id.id.put.errors.unauthorized.title" as const,
      description:
        "app.api.users.user.id.id.put.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.users.user.id.id.put.errors.validation.title" as const,
      description:
        "app.api.users.user.id.id.put.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.users.user.id.id.put.errors.forbidden.title" as const,
      description:
        "app.api.users.user.id.id.put.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.users.user.id.id.put.errors.notFound.title" as const,
      description:
        "app.api.users.user.id.id.put.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.users.user.id.id.put.errors.conflict.title" as const,
      description:
        "app.api.users.user.id.id.put.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.users.user.id.id.put.errors.server.title" as const,
      description:
        "app.api.users.user.id.id.put.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.users.user.id.id.put.errors.network.title" as const,
      description:
        "app.api.users.user.id.id.put.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.users.user.id.id.put.errors.unsavedChanges.title" as const,
      description:
        "app.api.users.user.id.id.put.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.users.user.id.id.put.errors.unknown.title" as const,
      description:
        "app.api.users.user.id.id.put.errors.unknown.description" as const,
    },
  },

  examples: {
    urlPathParams: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    requests: {
      default: {
        basicInfo: {
          privateName: "John Doe",
          publicName: "John D.",
        },
        adminSettings: {
          isActive: true,
        },
      },
    },
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        leadId: null,
        email: "john.doe@example.com",
        privateName: "John Doe",
        publicName: "John D.",
        emailVerified: true,
        isActive: true,
        stripeCustomerId: null,
        userRoles: [
          {
            id: "role-id",
            role: UserRole.CUSTOMER,
          },
        ],
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
      },
    },
  },
  successTypes: {
    title: "app.api.users.user.id.id.put.success.title",
    description: "app.api.users.user.id.id.put.success.description",
  },
});

/**
 * Delete User Endpoint Definition
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["users", "user", "[id]"],
  title: "app.api.users.user.id.id.delete.title" as const,
  description: "app.api.users.user.id.id.delete.description" as const,
  icon: "user-x" as const,
  category: "app.api.users.user.category" as const,
  tags: ["app.api.users.user.tag" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: UserDeleteContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),
      // === URL PARAMS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.users.user.id.id.delete.id.label" as const,
        description: "app.api.users.user.id.id.delete.id.description" as const,
        placeholder: "app.api.users.user.id.id.delete.id.placeholder" as const,
        helpText: "app.api.users.user.id.id.delete.id.helpText" as const,
        columns: 12,
        schema: z.string().uuid("usersErrors.validation.id.invalid"),
      }),

      // === RESPONSE ===
      success: responseField({
        type: WidgetType.BADGE,
        text: "app.api.users.user.id.id.delete.response.deletionResult.success.content" as const,
        schema: z.boolean().describe("Whether the deletion was successful"),
      }),
      message: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.delete.response.deletionResult.message.content" as const,
        schema: z.string().describe("Human-readable result message"),
      }),
      deletedAt: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.users.user.id.id.delete.response.deletionResult.deletedAt.content" as const,
        schema: dateSchema.describe("When the user was deleted"),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.users.user.id.id.delete.errors.unauthorized.title" as const,
      description:
        "app.api.users.user.id.id.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.users.user.id.id.delete.errors.validation.title" as const,
      description:
        "app.api.users.user.id.id.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.users.user.id.id.delete.errors.forbidden.title" as const,
      description:
        "app.api.users.user.id.id.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.users.user.id.id.delete.errors.notFound.title" as const,
      description:
        "app.api.users.user.id.id.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.users.user.id.id.delete.errors.conflict.title" as const,
      description:
        "app.api.users.user.id.id.delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.users.user.id.id.delete.errors.server.title" as const,
      description:
        "app.api.users.user.id.id.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.users.user.id.id.delete.errors.network.title" as const,
      description:
        "app.api.users.user.id.id.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.users.user.id.id.delete.errors.unsavedChanges.title" as const,
      description:
        "app.api.users.user.id.id.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.users.user.id.id.delete.errors.unknown.title" as const,
      description:
        "app.api.users.user.id.id.delete.errors.unknown.description" as const,
    },
  },

  examples: {
    urlPathParams: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        success: true,
        message: "User successfully deleted",
        deletedAt: "2024-01-07T14:30:00.000Z",
      },
    },
  },
  successTypes: {
    title: "app.api.users.user.id.id.delete.success.title",
    description: "app.api.users.user.id.id.delete.success.description",
  },
});

// Extract types using the new enhanced system

export type UserGetRequestInput = typeof GET.types.RequestInput;
export type UserGetRequestOutput = typeof GET.types.RequestOutput;
export type UserGetResponseInput = typeof GET.types.ResponseInput;
export type UserGetResponseOutput = typeof GET.types.ResponseOutput;
export type UserGetUrlParamsTypeInput = typeof GET.types.UrlVariablesInput;
export type UserGetUrlParamsTypeOutput = typeof GET.types.UrlVariablesOutput;

export type UserPutRequestInput = typeof PUT.types.RequestInput;
export type UserPutRequestOutput = typeof PUT.types.RequestOutput;
export type UserPutResponseInput = typeof PUT.types.ResponseInput;
export type UserPutResponseOutput = typeof PUT.types.ResponseOutput;
export type UserPutUrlParamsTypeInput = typeof PUT.types.UrlVariablesInput;
export type UserPutUrlParamsTypeOutput = typeof PUT.types.UrlVariablesOutput;

export type UserDeleteRequestInput = typeof DELETE.types.RequestInput;
export type UserDeleteRequestOutput = typeof DELETE.types.UrlVariablesOutput;
export type UserDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type UserDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
export type UserDeleteUrlParamsTypeInput =
  typeof DELETE.types.UrlVariablesInput;
export type UserDeleteUrlParamsTypeOutput =
  typeof DELETE.types.UrlVariablesOutput;

/**
 * Export definitions
 */
const definitions = {
  GET,
  PUT,
  DELETE,
} as const;

export default definitions;
