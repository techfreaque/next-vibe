/**
 * Users Create API Route Definition
 * Defines endpoints for creating new users
 */

import { z } from "zod";

import { leadId } from "@/app/api/[locale]/v1/core/leads/definition";
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
import {
  PreferredContactMethod,
  PreferredContactMethodOptions,
} from "@/app/api/[locale]/v1/core/user/enum";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { UserRoleFilterOptions } from "../enum";

/**
 * Users Create Endpoint Definition
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "users", "create"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN],

  title: "app.api.v1.core.users.create.post.title" as const,
  description: "app.api.v1.core.users.create.post.description" as const,
  category: "app.api.v1.core.users.category" as const,
  tags: [
    "app.api.v1.core.users.tags.create" as const,
    "app.api.v1.core.users.tags.admin" as const,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.users.create.post.form.title" as const,
      description:
        "app.api.v1.core.users.create.post.form.description" as const,
      layout: { type: LayoutType.VERTICAL },
    },
    { request: "data", response: true },
    {
      // === ESSENTIAL USER INFORMATION ===
      basicInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.users.create.post.form.title" as const,
          description:
            "app.api.v1.core.users.create.post.form.description" as const,
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { request: "data" },
        {
          email: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label: "app.api.v1.core.users.create.post.email.label" as const,
              description:
                "app.api.v1.core.users.create.post.email.description" as const,
              placeholder:
                "app.api.v1.core.users.create.post.email.label" as const,
              layout: { columns: 12 },
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
              label:
                "app.api.v1.core.users.create.post.password.label" as const,
              description:
                "app.api.v1.core.users.create.post.password.description" as const,
              helpText:
                "app.api.v1.core.users.create.post.password.description" as const,
              layout: { columns: 12 },
            },
            z
              .string()
              .min(8, "usersErrors.validation.password.tooShort")
              .max(128, "usersErrors.validation.password.tooLong"),
          ),
          firstName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.users.create.post.firstName.label" as const,
              description:
                "app.api.v1.core.users.create.post.firstName.description" as const,
              layout: { columns: 6 },
            },
            z
              .string()
              .min(1, "usersErrors.validation.firstName.required")
              .max(100, "usersErrors.validation.firstName.tooLong")
              .transform((val) => val.trim()),
          ),
          lastName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.users.create.post.lastName.label" as const,
              description:
                "app.api.v1.core.users.create.post.lastName.description" as const,
              layout: { columns: 6 },
            },
            z
              .string()
              .min(1, "usersErrors.validation.lastName.required")
              .max(100, "usersErrors.validation.lastName.tooLong")
              .transform((val) => val.trim()),
          ),
        },
      ),

      // === ORGANIZATION INFORMATION ===
      organizationInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.users.create.post.company.label" as const,
          description:
            "app.api.v1.core.users.create.post.company.description" as const,
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { request: "data" },
        {
          company: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.v1.core.users.create.post.company.label" as const,
              description:
                "app.api.v1.core.users.create.post.company.description" as const,
              layout: { columns: 6 },
            },
            z
              .string()
              .min(1, "usersErrors.validation.company.required")
              .max(255, "usersErrors.validation.company.tooLong")
              .transform((val) => val.trim()),
          ),
          jobTitle: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.users.create.post.jobTitle.label" as const,
              description:
                "app.api.v1.core.users.create.post.jobTitle.description" as const,
              layout: { columns: 6 },
            },
            z
              .string()
              .max(255, "usersErrors.validation.jobTitle.tooLong")
              .transform((val) => val?.trim() || null)
              .optional(),
          ),
        },
      ),

      // === CONTACT INFORMATION ===
      contactInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.users.create.post.phone.label" as const,
          description:
            "app.api.v1.core.users.create.post.phone.description" as const,
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { request: "data" },
        {
          phone: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PHONE,
              label: "app.api.v1.core.users.create.post.phone.label" as const,
              description:
                "app.api.v1.core.users.create.post.phone.description" as const,
              placeholder:
                "app.api.v1.core.users.create.post.phone.label" as const,
              layout: { columns: 6 },
            },
            z
              .string()
              .regex(
                /^\+?[1-9]\d{1,14}$/,
                "usersErrors.validation.phone.invalid",
              )
              .transform((val) => val?.trim() || null)
              .optional(),
          ),
          preferredContactMethod: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label:
                "app.api.v1.core.users.create.post.preferredContactMethod.label" as const,
              description:
                "app.api.v1.core.users.create.post.preferredContactMethod.description" as const,
              helpText:
                "app.api.v1.core.users.create.post.preferredContactMethod.description" as const,
              layout: { columns: 6 },
              options: PreferredContactMethodOptions,
            },
            z.nativeEnum(PreferredContactMethod),
          ),
        },
      ),

      // === PROFILE INFORMATION (OPTIONAL) ===
      profileInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.users.create.post.bio.label" as const,
          description:
            "app.api.v1.core.users.create.post.bio.description" as const,
          layout: { type: LayoutType.VERTICAL },
        },
        { request: "data" },
        {
          imageUrl: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.URL,
              label:
                "app.api.v1.core.users.create.post.imageUrl.label" as const,
              description:
                "app.api.v1.core.users.create.post.imageUrl.description" as const,
              placeholder:
                "app.api.v1.core.users.create.post.imageUrl.label" as const,
              layout: { columns: 12 },
            },
            z
              .string()
              .url("usersErrors.validation.imageUrl.invalid")
              .transform((val) => val?.trim() || null)
              .optional()
              .or(z.literal("")),
          ),
          bio: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label: "app.api.v1.core.users.create.post.bio.label" as const,
              description:
                "app.api.v1.core.users.create.post.bio.description" as const,
              placeholder:
                "app.api.v1.core.users.create.post.bio.label" as const,
              layout: { columns: 12 },
            },
            z
              .string()
              .max(1000, "usersErrors.validation.bio.tooLong")
              .transform((val) => val?.trim() || null)
              .optional(),
          ),
          website: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.URL,
              label: "app.api.v1.core.users.create.post.website.label" as const,
              description:
                "app.api.v1.core.users.create.post.website.description" as const,
              placeholder:
                "app.api.v1.core.users.create.post.website.label" as const,
              layout: { columns: 12 },
            },
            z
              .string()
              .url("usersErrors.validation.website.invalid")
              .transform((val) => val?.trim() || null)
              .optional()
              .or(z.literal("")),
          ),
        },
      ),

      // === ADMINISTRATIVE SETTINGS ===
      adminSettings: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.users.create.post.roles.label" as const,
          description:
            "app.api.v1.core.users.create.post.roles.description" as const,
          layout: { type: LayoutType.GRID, columns: 3 },
        },
        { request: "data" },
        {
          roles: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.MULTISELECT,
              label: "app.api.v1.core.users.create.post.roles.label" as const,
              description:
                "app.api.v1.core.users.create.post.roles.description" as const,
              helpText:
                "app.api.v1.core.users.create.post.roles.description" as const,
              layout: { columns: 12 },
              options: UserRoleFilterOptions,
            },
            z.array(z.string()).optional(),
          ),
          emailVerified: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.v1.core.users.create.post.emailVerified.label" as const,
              description:
                "app.api.v1.core.users.create.post.emailVerified.description" as const,
              layout: { columns: 6 },
            },
            z.boolean().optional(),
          ),
          isActive: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.v1.core.users.create.post.isActive.label" as const,
              description:
                "app.api.v1.core.users.create.post.isActive.description" as const,
              layout: { columns: 6 },
            },
            z.boolean().optional(),
          ),
          leadId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.UUID,
              label: "app.api.v1.core.users.create.post.leadId.label" as const,
              description:
                "app.api.v1.core.users.create.post.leadId.description" as const,
              helpText:
                "app.api.v1.core.users.create.post.leadId.description" as const,
              layout: { columns: 6 },
            },
            leadId.nullable().optional(),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      success: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.users.create.post.success.title" as const,
          description:
            "app.api.v1.core.users.create.post.success.description" as const,
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { response: true },
        {
          created: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.users.create.post.success.created.content" as const,
            },
            z.boolean().describe("Whether the user was successfully created"),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.create.post.success.message.content" as const,
            },
            z.string().describe("Human-readable success message"),
          ),
        },
      ),
      userInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.users.create.post.response.title" as const,
          description:
            "app.api.v1.core.users.create.post.response.description" as const,
          layout: { type: LayoutType.GRID, columns: 3 },
        },
        { response: true },
        {
          id: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.create.post.response.id.content" as const,
            },
            z.uuid().describe("Generated user ID"),
          ),
          email: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.create.post.response.email.content" as const,
            },
            z.email().describe("User's email address"),
          ),
          firstName: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.create.post.response.firstName.content" as const,
            },
            z.string().describe("User's first name"),
          ),
          lastName: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.create.post.response.lastName.content" as const,
            },
            z.string().describe("User's last name"),
          ),
          company: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.create.post.response.company.content" as const,
            },
            z.string().describe("User's company"),
          ),
          createdAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.users.create.post.response.createdAt.content" as const,
            },
            z.string().datetime().describe("When the user was created"),
          ),
        },
      ),
      responseId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.id.content" as const,
        },
        z.uuid(),
      ),
      responseLeadId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.leadId.content" as const,
        },
        leadId.nullable(),
      ),
      responseEmail: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.email.content" as const,
        },
        z.email(),
      ),
      responseFirstName: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.firstName.content" as const,
        },
        z.string(),
      ),
      responseLastName: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.lastName.content" as const,
        },
        z.string(),
      ),
      responseCompany: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.company.content" as const,
        },
        z.string(),
      ),
      responsePhone: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.phone.content" as const,
        },
        z.string().nullable(),
      ),
      responsePreferredContactMethod: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.v1.core.users.create.post.response.preferredContactMethod.content" as const,
        },
        z.nativeEnum(PreferredContactMethod),
      ),
      responseImageUrl: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.imageUrl.content" as const,
        },
        z.string().nullable(),
      ),
      responseBio: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.bio.content" as const,
        },
        z.string().nullable(),
      ),
      responseWebsite: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.website.content" as const,
        },
        z.string().nullable(),
      ),
      responseJobTitle: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.jobTitle.content" as const,
        },
        z.string().nullable(),
      ),
      responseEmailVerified: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.v1.core.users.create.post.response.emailVerified.content" as const,
        },
        z.boolean(),
      ),
      responseIsActive: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.v1.core.users.create.post.response.isActive.content" as const,
        },
        z.boolean(),
      ),
      responseStripeCustomerId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.stripeCustomerId.content" as const,
        },
        z.string().nullable(),
      ),
      responseUserRoles: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.v1.core.users.create.post.response.userRoles.content" as const,
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
            "app.api.v1.core.users.create.post.response.createdAt.content" as const,
        },
        z.string().datetime(),
      ),
      responseUpdatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.users.create.post.response.updatedAt.content" as const,
        },
        z.string().datetime(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.users.create.post.errors.validation.title" as const,
      description:
        "app.api.v1.core.users.create.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.users.create.post.errors.server.title" as const,
      description:
        "app.api.v1.core.users.create.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.users.create.post.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.users.create.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.users.create.post.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.users.create.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.users.create.post.errors.notFound.title" as const,
      description:
        "app.api.v1.core.users.create.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.users.create.post.errors.server.title" as const,
      description:
        "app.api.v1.core.users.create.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.users.create.post.errors.unknown.title" as const,
      description:
        "app.api.v1.core.users.create.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.users.create.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.users.create.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.users.create.post.errors.conflict.title" as const,
      description:
        "app.api.v1.core.users.create.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.users.create.post.success.title" as const,
    description:
      "app.api.v1.core.users.create.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        basicInfo: {
          email: "customer@example.com",
          password: "password123",
          firstName: "Customer",
          lastName: "Name",
        },
        organizationInfo: {
          company: "Customer Company",
          jobTitle: "Customer Representative",
        },
        contactInfo: {
          phone: "+1234567890",
          preferredContactMethod: PreferredContactMethod.EMAIL,
        },
        profileInfo: {
          imageUrl: "",
          bio: "",
          website: "",
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
          firstName: "Customer",
          lastName: "Name",
          company: "Customer Company",
          createdAt: "2023-01-01T00:00:00.000Z",
        },
        responseId: "123e4567-e89b-12d3-a456-426614174000",
        responseLeadId: null,
        responseEmail: "customer@example.com",
        responseFirstName: "Customer",
        responseLastName: "Name",
        responseCompany: "Customer Company",
        responsePhone: "+1234567890",
        responsePreferredContactMethod: PreferredContactMethod.EMAIL,
        responseImageUrl: null,
        responseBio: null,
        responseWebsite: null,
        responseJobTitle: null,
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
    urlPathVariables: undefined,
  },
});

// Extract types using the new enhanced system
export type UserCreateRequestTypeInput = typeof POST.types.RequestInput;
export type UserCreateRequestTypeOutput = typeof POST.types.RequestOutput;
export type UserCreateResponseTypeInput = typeof POST.types.ResponseInput;
export type UserCreateResponseTypeOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
};

export { POST };
export default definitions;
