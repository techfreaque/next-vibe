/**
 * Users Create API Route Definition
 * Defines endpoints for creating new users
 */

import { z } from "zod";

import { leadId } from "@/app/api/[locale]/leads/types";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  UserRole,
  UserRoleOptions,
} from "@/app/api/[locale]/user/user-roles/enum";
import {
  Countries,
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import { dateSchema } from "../../shared/types/common.schema";
import { scopedTranslation } from "./i18n";
import { UserCreateContainer } from "./widget";

/**
 * Users Create Endpoint Definition
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["users", "create"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "user-plus",
  category: "app.endpointCategories.userManagement",
  tags: ["tags.create" as const, "tags.admin" as const],

  fields: customWidgetObject({
    render: UserCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { response: true },
      }),
      // === ESSENTIAL USER INFORMATION ===
      basicInfo: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.form.title" as const,
        description: "post.form.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          email: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.EMAIL,
            label: "post.email.label" as const,
            description: "post.email.description" as const,
            placeholder: "post.email.label" as const,
            columns: 12,
            schema: z
              .string()
              .email("usersErrors.validation.email.invalid")
              .transform((val) => val.toLowerCase().trim()),
          }),
          password: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.PASSWORD,
            label: "post.password.label" as const,
            description: "post.password.description" as const,
            helpText: "post.password.description" as const,
            columns: 12,
            schema: z
              .string()
              .min(8, "usersErrors.validation.password.tooShort")
              .max(128, "usersErrors.validation.password.tooLong"),
          }),
          privateName: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.privateName.label" as const,
            description: "post.privateName.description" as const,
            columns: 6,
            schema: z
              .string()
              .min(1, "usersErrors.validation.privateName.required")
              .max(255, "usersErrors.validation.privateName.tooLong")
              .transform((val) => val.trim()),
          }),
          publicName: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.publicName.label" as const,
            description: "post.publicName.description" as const,
            columns: 6,
            schema: z
              .string()
              .min(1, "usersErrors.validation.publicName.required")
              .max(255, "usersErrors.validation.publicName.tooLong")
              .transform((val) => val.trim()),
          }),

          country: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.country.label" as const,
            description: "post.country.description" as const,
            options: CountriesOptions,
            columns: 6,
            schema: z.enum(Countries),
          }),

          language: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.language.label" as const,
            description: "post.language.description" as const,
            options: LanguagesOptions,
            columns: 6,
            schema: z.enum(Languages),
          }),
        },
      }),

      // === ADMINISTRATIVE SETTINGS ===
      adminSettings: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.roles.label" as const,
        description: "post.roles.description" as const,
        layoutType: LayoutType.GRID,
        columns: 3,
        usage: { request: "data" },
        children: {
          roles: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MULTISELECT,
            label: "post.roles.label" as const,
            description: "post.roles.description" as const,
            helpText: "post.roles.description" as const,
            columns: 12,
            options: UserRoleOptions,
            schema: z.array(z.enum(UserRole)).optional(),
          }),
          emailVerified: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "post.emailVerified.label" as const,
            description: "post.emailVerified.description" as const,
            columns: 6,
            schema: z.boolean().optional(),
          }),
          isActive: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "post.isActive.label" as const,
            description: "post.isActive.description" as const,
            columns: 6,
            schema: z.boolean().optional(),
          }),
          leadId: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.UUID,
            label: "post.leadId.label" as const,
            description: "post.leadId.description" as const,
            helpText: "post.leadId.description" as const,
            columns: 6,
            schema: leadId.nullable().optional(),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      success: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.success.title" as const,
        description: "post.success.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { response: true },
        children: {
          created: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "post.success.created.content" as const,
            schema: z
              .boolean()
              .describe("Whether the user was successfully created"),
          }),
          message: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.success.message.content" as const,
            schema: z.string().describe("Human-readable success message"),
          }),
        },
      }),
      userInfo: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.title" as const,
        description: "post.response.description" as const,
        layoutType: LayoutType.GRID,
        columns: 3,
        usage: { response: true },
        children: {
          id: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.id.content" as const,
            schema: z.uuid().describe("Generated user ID"),
          }),
          email: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.email.content" as const,
            schema: z.email().describe("User's email address"),
          }),
          privateName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.privateName.content" as const,
            schema: z.string().describe("User's private name"),
          }),
          publicName: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.publicName.content" as const,
            schema: z.string().describe("User's public name"),
          }),
          createdAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.createdAt.content" as const,
            schema: dateSchema.describe("When the user was created"),
          }),
        },
      }),
      responseId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id.content" as const,
        schema: z.uuid(),
      }),
      responseLeadId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadId.content" as const,
        schema: leadId.nullable(),
      }),
      responseEmail: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.email.content" as const,
        schema: z.email(),
      }),
      responsePrivateName: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.privateName.content" as const,
        schema: z.string(),
      }),
      responsePublicName: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.publicName.content" as const,
        schema: z.string(),
      }),
      responseEmailVerified: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.response.emailVerified.content" as const,
        schema: z.boolean(),
      }),
      responseIsActive: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.response.isActive.content" as const,
        schema: z.boolean(),
      }),
      responseStripeCustomerId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.stripeCustomerId.content" as const,
        schema: z.string().nullable(),
      }),
      responseUserRoles: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        usage: { response: true },
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 2,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.userRoles.id.content" as const,
              schema: z.uuid(),
            }),
            role: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.userRoles.role.content" as const,
              schema: z.enum(Object.values(UserRole)),
            }),
          },
        }),
      }),
      responseCreatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.createdAt.content" as const,
        schema: dateSchema,
      }),
      responseUpdatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.updatedAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        basicInfo: {
          email: "customer@example.com",
          password: "password123",
          privateName: "Customer Full Name",
          publicName: "Customer",
          country: "GLOBAL",
          language: "en",
        },
        adminSettings: {
          roles: [UserRole.CUSTOMER],
          emailVerified: false,
          isActive: true,
          leadId: null,
        },
      },
    },
    responses: {
      default: {
        success: {
          created: true,
          message: "User created successfully",
        },
        userInfo: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "customer@example.com",
          privateName: "Customer Full Name",
          publicName: "Customer",
          createdAt: "2023-01-01T00:00:00.000Z",
        },
        responseId: "123e4567-e89b-12d3-a456-426614174000",
        responseLeadId: null,
        responseEmail: "customer@example.com",
        responsePrivateName: "Customer Full Name",
        responsePublicName: "Customer",
        responseEmailVerified: false,
        responseIsActive: true,
        responseStripeCustomerId: null,
        responseUserRoles: [
          {
            id: "role-id",
            role: UserRole.CUSTOMER,
          },
        ],
        responseCreatedAt: "2023-01-01T00:00:00.000Z",
        responseUpdatedAt: "2023-01-01T00:00:00.000Z",
      },
    },
  },
});

// Extract types using the new enhanced system
export type UserCreateRequestInput = typeof POST.types.RequestInput;
export type UserCreateRequestOutput = typeof POST.types.RequestOutput;
export type UserCreateResponseInput = typeof POST.types.ResponseInput;
export type UserCreateResponseOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
} as const;
export default definitions;
