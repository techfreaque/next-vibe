/**
 * Users Create API Route Definition
 * Defines endpoints for creating new users
 */

import { z } from "zod";

import { leadId } from "@/app/api/[locale]/leads/types";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
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
import {
  UserRole,
  UserRoleOptions,
} from "@/app/api/[locale]/user/user-roles/enum";
import {
  CountriesArr,
  LanguagesOptions,
  LanguagesArr,
  CountriesOptions,
} from "@/i18n/core/config";

/**
 * Users Create Endpoint Definition
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["users", "create"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "app.api.users.create.post.title" as const,
  description: "app.api.users.create.post.description" as const,
  category: "app.api.users.category" as const,
  tags: [
    "app.api.users.tags.create" as const,
    "app.api.users.tags.admin" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.users.create.post.form.title" as const,
      description: "app.api.users.create.post.form.description" as const,
      layoutType: LayoutType.VERTICAL,
    },
    { request: "data", response: true },
    {
      // === ESSENTIAL USER INFORMATION ===
      basicInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.create.post.form.title" as const,
          description: "app.api.users.create.post.form.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { request: "data" },
        {
          email: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.users.create.post.email.label" as const,
              description:
                "app.api.users.create.post.email.description" as const,
              placeholder: "app.api.users.create.post.email.label" as const,
              columns: 12,
            },
            z
              .string()
              .email("usersErrors.validation.email.invalid")
              .transform((val) => val.toLowerCase().trim()),
          ),
          password: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label: "app.api.users.create.post.password.label" as const,
              description:
                "app.api.users.create.post.password.description" as const,
              helpText:
                "app.api.users.create.post.password.description" as const,
              columns: 12,
            },
            z
              .string()
              .min(8, "usersErrors.validation.password.tooShort")
              .max(128, "usersErrors.validation.password.tooLong"),
          ),
          privateName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.users.create.post.privateName.label" as const,
              description:
                "app.api.users.create.post.privateName.description" as const,
              columns: 6,
            },
            z
              .string()
              .min(1, "usersErrors.validation.privateName.required")
              .max(255, "usersErrors.validation.privateName.tooLong")
              .transform((val) => val.trim()),
          ),
          publicName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.users.create.post.publicName.label" as const,
              description:
                "app.api.users.create.post.publicName.description" as const,
              columns: 6,
            },
            z
              .string()
              .min(1, "usersErrors.validation.publicName.required")
              .max(255, "usersErrors.validation.publicName.tooLong")
              .transform((val) => val.trim()),
          ),

          country: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.users.create.post.country.label",
              description: "app.api.users.create.post.country.description",
              options: CountriesOptions,
              columns: 6,
            },
            z.enum(CountriesArr),
          ),

          language: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.users.create.post.language.label",
              description: "app.api.users.create.post.language.description",
              options: LanguagesOptions,
              columns: 6,
            },
            z.enum(LanguagesArr),
          ),
        },
      ),

      // === ADMINISTRATIVE SETTINGS ===
      adminSettings: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.create.post.roles.label" as const,
          description: "app.api.users.create.post.roles.description" as const,
          layoutType: LayoutType.GRID,
          columns: 3,
        },
        { request: "data" },
        {
          roles: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.users.create.post.roles.label" as const,
              description:
                "app.api.users.create.post.roles.description" as const,
              helpText: "app.api.users.create.post.roles.description" as const,
              columns: 12,
              options: UserRoleOptions,
            },
            z.array(z.enum(UserRole)).optional(),
          ),
          emailVerified: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.users.create.post.emailVerified.label" as const,
              description:
                "app.api.users.create.post.emailVerified.description" as const,
              columns: 6,
            },
            z.boolean().optional(),
          ),
          isActive: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.users.create.post.isActive.label" as const,
              description:
                "app.api.users.create.post.isActive.description" as const,
              columns: 6,
            },
            z.boolean().optional(),
          ),
          leadId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.UUID,
              label: "app.api.users.create.post.leadId.label" as const,
              description:
                "app.api.users.create.post.leadId.description" as const,
              helpText: "app.api.users.create.post.leadId.description" as const,
              columns: 6,
            },
            leadId.nullable().optional(),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      success: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.create.post.success.title" as const,
          description: "app.api.users.create.post.success.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { response: true },
        {
          created: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.users.create.post.success.created.content" as const,
            },
            z.boolean().describe("Whether the user was successfully created"),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.users.create.post.success.message.content" as const,
            },
            z.string().describe("Human-readable success message"),
          ),
        },
      ),
      userInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.users.create.post.response.title" as const,
          description:
            "app.api.users.create.post.response.description" as const,
          layoutType: LayoutType.GRID,
          columns: 3,
        },
        { response: true },
        {
          id: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.users.create.post.response.id.content" as const,
            },
            z.uuid().describe("Generated user ID"),
          ),
          email: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.users.create.post.response.email.content" as const,
            },
            z.email().describe("User's email address"),
          ),
          privateName: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.users.create.post.response.privateName.content" as const,
            },
            z.string().describe("User's private name"),
          ),
          publicName: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.users.create.post.response.publicName.content" as const,
            },
            z.string().describe("User's public name"),
          ),
          createdAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.users.create.post.response.createdAt.content" as const,
            },
            z.string().datetime().describe("When the user was created"),
          ),
        },
      ),
      responseId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.users.create.post.response.id.content" as const,
        },
        z.uuid(),
      ),
      responseLeadId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.users.create.post.response.leadId.content" as const,
        },
        leadId.nullable(),
      ),
      responseEmail: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.users.create.post.response.email.content" as const,
        },
        z.email(),
      ),
      responsePrivateName: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.users.create.post.response.privateName.content" as const,
        },
        z.string(),
      ),
      responsePublicName: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.users.create.post.response.publicName.content" as const,
        },
        z.string(),
      ),
      responseEmailVerified: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.users.create.post.response.emailVerified.content" as const,
        },
        z.boolean(),
      ),
      responseIsActive: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.users.create.post.response.isActive.content" as const,
        },
        z.boolean(),
      ),
      responseStripeCustomerId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.users.create.post.response.stripeCustomerId.content" as const,
        },
        z.string().nullable(),
      ),
      responseUserRoles: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.users.create.post.response.userRoles.content" as const,
        },
        z.array(
          z.object({
            id: z.uuid(),
            role: z.string(),
          }),
        ),
      ),
      responseCreatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.users.create.post.response.createdAt.content" as const,
        },
        z.string().datetime(),
      ),
      responseUpdatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.users.create.post.response.updatedAt.content" as const,
        },
        z.string().datetime(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.users.create.post.errors.validation.title" as const,
      description:
        "app.api.users.create.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.users.create.post.errors.server.title" as const,
      description:
        "app.api.users.create.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.users.create.post.errors.unauthorized.title" as const,
      description:
        "app.api.users.create.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.users.create.post.errors.forbidden.title" as const,
      description:
        "app.api.users.create.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.users.create.post.errors.notFound.title" as const,
      description:
        "app.api.users.create.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.users.create.post.errors.server.title" as const,
      description:
        "app.api.users.create.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.users.create.post.errors.unknown.title" as const,
      description:
        "app.api.users.create.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.users.create.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.users.create.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.users.create.post.errors.conflict.title" as const,
      description:
        "app.api.users.create.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.users.create.post.success.title" as const,
    description: "app.api.users.create.post.success.description" as const,
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
            role: "app.api.user.userRoles.enums.userRole.customer",
          },
        ],
        responseCreatedAt: "2023-01-01T00:00:00.000Z",
        responseUpdatedAt: "2023-01-01T00:00:00.000Z",
      },
    },
    urlPathParams: undefined,
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
};

export { POST };
export default definitions;
