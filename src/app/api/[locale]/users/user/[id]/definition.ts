/**
 * Individual User API Route Definition
 * Defines endpoints for specific user operations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestResponseField,
  scopedRequestUrlPathParamsField,
  scopedRequestUrlPathParamsResponseField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
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
import { scopedTranslation } from "./i18n";
import {
  UserDeleteContainer,
  UserDetailContainer,
  UserEditContainer,
} from "./widget";

/**
 * Get User Endpoint Definition
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["users", "user", "[id]"],
  title: "id.get.title" as const,
  description: "id.get.description" as const,
  icon: "user",
  category: "category" as const,
  tags: ["tag" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  fields: customWidgetObject({
    render: UserDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { response: true },
      }),
      // === URL PARAMS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "id.get.id.label" as const,
        description: "id.get.id.description" as const,
        placeholder: "id.get.id.placeholder" as const,
        columns: 12,
        schema: z.uuid("usersErrors.validation.id.invalid"),
      }),

      // === USER PROFILE INFORMATION ===
      userProfile: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "id.get.response.userProfile.title" as const,
        description: "id.get.response.userProfile.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { response: true },
        children: {
          basicInfo: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "id.get.response.userProfile.basicInfo.title" as const,
            description:
              "id.get.response.userProfile.basicInfo.description" as const,
            layoutType: LayoutType.VERTICAL,
            usage: { response: true },
            children: {
              id: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content:
                  "id.get.response.userProfile.basicInfo.id.content" as const,
                schema: z.string().uuid().describe("User unique identifier"),
              }),
              email: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content:
                  "id.get.response.userProfile.basicInfo.email.content" as const,
                schema: z.string().email().describe("User's email address"),
              }),
              privateName: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content:
                  "id.get.response.userProfile.basicInfo.privateName.content" as const,
                schema: z.string().describe("User's private name"),
              }),
              publicName: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content:
                  "id.get.response.userProfile.basicInfo.publicName.content" as const,
                schema: z.string().describe("User's public name"),
              }),
            },
          }),
        },
      }),

      // === ACCOUNT STATUS ===
      accountStatus: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "id.get.response.accountStatus.title" as const,
        description: "id.get.response.accountStatus.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { response: true },
        children: {
          isActive: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "id.get.response.accountStatus.isActive.content" as const,
            schema: z.boolean().describe("Account active status"),
          }),
          emailVerified: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "id.get.response.accountStatus.emailVerified.content" as const,
            schema: z.boolean().describe("Email verification status"),
          }),
          stripeCustomerId: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content:
              "id.get.response.accountStatus.stripeCustomerId.content" as const,
            schema: z.string().nullable().describe("Stripe customer ID"),
          }),
          userRoles: scopedResponseArrayFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: scopedObjectFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.HORIZONTAL,
              usage: { response: true },
              children: {
                id: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "id.get.response.accountStatus.userRoles.content" as const,
                  schema: z.uuid().describe("Role ID"),
                }),
                role: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "id.get.response.accountStatus.userRoles.content" as const,
                  schema: z.string().describe("Role name"),
                }),
              },
            }),
          }),
        },
      }),

      // === TIMESTAMPS ===
      timestamps: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "id.get.response.timestamps.title" as const,
        description: "id.get.response.timestamps.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { response: true },
        children: {
          createdAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "id.get.response.timestamps.createdAt.content" as const,
            schema: dateSchema.describe("Account creation date"),
          }),
          updatedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "id.get.response.timestamps.updatedAt.content" as const,
            schema: dateSchema.describe("Last update date"),
          }),
        },
      }),

      leadId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "id.get.response.leadId.content" as const,
        schema: z.uuid().nullable(),
      }),
      email: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "id.get.response.email.content" as const,
        schema: z.email(),
      }),
      privateName: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "id.get.response.privateName.content" as const,
        schema: z.string(),
      }),
      publicName: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "id.get.response.publicName.content" as const,
        schema: z.string(),
      }),
      emailVerified: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "id.get.response.emailVerified.content" as const,
        schema: z.boolean(),
      }),
      isActive: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "id.get.response.isActive.content" as const,
        schema: z.boolean(),
      }),
      stripeCustomerId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "id.get.response.stripeCustomerId.content" as const,
        schema: z.string().nullable(),
      }),
      userRoles: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.HORIZONTAL,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "id.get.response.userRoles.content" as const,
              schema: z.uuid(),
            }),
            role: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "id.get.response.userRoles.content" as const,
              schema: z.string(),
            }),
          },
        }),
      }),
      createdAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "id.get.response.createdAt.content" as const,
        schema: dateSchema,
      }),
      updatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "id.get.response.updatedAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "id.get.errors.unauthorized.title" as const,
      description: "id.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "id.get.errors.validation.title" as const,
      description: "id.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "id.get.errors.forbidden.title" as const,
      description: "id.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "id.get.errors.notFound.title" as const,
      description: "id.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "id.get.errors.conflict.title" as const,
      description: "id.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "id.get.errors.network.title" as const,
      description: "id.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "id.get.errors.unsavedChanges.title" as const,
      description: "id.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "id.get.errors.server.title" as const,
      description: "id.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "id.get.errors.unknown.title" as const,
      description: "id.get.errors.unknown.description" as const,
    },
  },
  successTypes: {
    title: "id.get.success.title" as const,
    description: "id.get.success.description" as const,
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
  scopedTranslation,
  method: Methods.PUT,
  path: ["users", "user", "[id]"],
  title: "id.put.title" as const,
  description: "id.put.description" as const,
  icon: "user-check" as const,
  category: "category" as const,
  tags: ["tag" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  fields: customWidgetObject({
    render: UserEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === URL PARAMS ===
      id: scopedRequestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "id.put.id.label" as const,
        description: "id.put.id.description" as const,
        placeholder: "id.put.id.placeholder" as const,
        columns: 12,
        schema: z.string().uuid("usersErrors.validation.id.invalid"),
      }),

      // === BASIC INFORMATION ===
      email: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "id.put.email.label" as const,
        description: "id.put.email.description" as const,
        placeholder: "id.put.email.placeholder" as const,
        columns: 6,
        schema: z
          .string()
          .email("usersErrors.validation.email.invalid")
          .transform((val) => val.toLowerCase().trim())
          .optional(),
      }),
      privateName: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "id.put.privateName.label" as const,
        description: "id.put.privateName.description" as const,
        columns: 6,
        schema: z
          .string()
          .min(1, "usersErrors.validation.privateName.required")
          .max(255, "usersErrors.validation.privateName.tooLong")
          .transform((val) => val.trim())
          .optional(),
      }),
      publicName: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "id.put.publicName.label" as const,
        description: "id.put.publicName.description" as const,
        columns: 6,
        schema: z
          .string()
          .min(1, "usersErrors.validation.publicName.required")
          .max(255, "usersErrors.validation.publicName.tooLong")
          .transform((val) => val.trim())
          .optional(),
      }),

      // === ADMINISTRATIVE SETTINGS ===
      emailVerified: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "id.put.emailVerified.label" as const,
        description: "id.put.emailVerified.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      isActive: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "id.put.isActive.label" as const,
        description: "id.put.isActive.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      leadId: scopedRequestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "id.put.leadId.label" as const,
        description: "id.put.leadId.description" as const,
        columns: 6,
        schema: z.uuid().nullable().optional(),
      }),

      // === RESPONSE-ONLY FIELDS ===
      stripeCustomerId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "id.put.response.stripeCustomerId.content" as const,
        schema: z.string().nullable(),
      }),
      userRoles: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.HORIZONTAL,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "id.put.response.userRoles.content" as const,
              schema: z.uuid(),
            }),
            role: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "id.put.response.userRoles.content" as const,
              schema: z.string(),
            }),
          },
        }),
      }),
      createdAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "id.put.response.createdAt.content" as const,
        schema: dateSchema,
      }),
      updatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "id.put.response.updatedAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "id.put.errors.unauthorized.title" as const,
      description: "id.put.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "id.put.errors.validation.title" as const,
      description: "id.put.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "id.put.errors.forbidden.title" as const,
      description: "id.put.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "id.put.errors.notFound.title" as const,
      description: "id.put.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "id.put.errors.conflict.title" as const,
      description: "id.put.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "id.put.errors.server.title" as const,
      description: "id.put.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "id.put.errors.network.title" as const,
      description: "id.put.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "id.put.errors.unsavedChanges.title" as const,
      description: "id.put.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "id.put.errors.unknown.title" as const,
      description: "id.put.errors.unknown.description" as const,
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
        privateName: "John Doe",
        publicName: "John D.",
        isActive: true,
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
    title: "id.put.success.title" as const,
    description: "id.put.success.description" as const,
  },
});

/**
 * Delete User Endpoint Definition
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["users", "user", "[id]"],
  title: "id.delete.title" as const,
  description: "id.delete.description" as const,
  icon: "user-x" as const,
  category: "category" as const,
  tags: ["tag" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: UserDeleteContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { response: true },
      }),
      // === URL PARAMS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "id.delete.id.label" as const,
        description: "id.delete.id.description" as const,
        placeholder: "id.delete.id.placeholder" as const,
        helpText: "id.delete.id.helpText" as const,
        columns: 12,
        schema: z.string().uuid("usersErrors.validation.id.invalid"),
      }),

      // === RESPONSE ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "id.delete.response.deletionResult.success.content" as const,
        schema: z.boolean().describe("Whether the deletion was successful"),
      }),
      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "id.delete.response.deletionResult.message.content" as const,
        schema: z.string().describe("Human-readable result message"),
      }),
      deletedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "id.delete.response.deletionResult.deletedAt.content" as const,
        schema: dateSchema.describe("When the user was deleted"),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "id.delete.errors.unauthorized.title" as const,
      description: "id.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "id.delete.errors.validation.title" as const,
      description: "id.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "id.delete.errors.forbidden.title" as const,
      description: "id.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "id.delete.errors.notFound.title" as const,
      description: "id.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "id.delete.errors.conflict.title" as const,
      description: "id.delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "id.delete.errors.server.title" as const,
      description: "id.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "id.delete.errors.network.title" as const,
      description: "id.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "id.delete.errors.unsavedChanges.title" as const,
      description: "id.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "id.delete.errors.unknown.title" as const,
      description: "id.delete.errors.unknown.description" as const,
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
    title: "id.delete.success.title" as const,
    description: "id.delete.success.description" as const,
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
