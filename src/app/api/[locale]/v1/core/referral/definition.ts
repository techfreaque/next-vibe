/**
 * Referral API Endpoint Definition
 * Defines the API endpoints for referral code management using createEndpoint
 *
 * NOTE: This is a placeholder implementation. Translation keys need to be registered
 * in the global translation system before this endpoint can be fully functional.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { UserRole } from "../user/user-roles/enum";
import { dateSchema } from "../shared/types/common.schema";

/**
 * POST endpoint for creating a referral code
 */
export const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "referral"],
  title: "app.api.v1.core.referral.post.title",
  description: "app.api.v1.core.referral.post.description",
  category: "app.api.v1.core.referral.category",
  tags: [
    "app.api.v1.core.referral.tags.referral",
    "app.api.v1.core.referral.tags.create",
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.referral.post.form.title",
      description: "app.api.v1.core.referral.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // Request fields
      code: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.referral.form.fields.code.label",
          description: "app.api.v1.core.referral.form.fields.code.description",
          placeholder: "app.api.v1.core.referral.form.fields.code.placeholder",
        },
        z.string().min(3).max(50),
      ),
      label: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.referral.form.fields.label.label",
          description: "app.api.v1.core.referral.form.fields.label.description",
          placeholder: "app.api.v1.core.referral.form.fields.label.placeholder",
        },
        z.string().optional(),
      ),
      maxUses: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.referral.form.fields.maxUses.label",
          description:
            "app.api.v1.core.referral.form.fields.maxUses.description",
          placeholder:
            "app.api.v1.core.referral.form.fields.maxUses.placeholder",
        },
        z.number().positive().optional(),
      ),
      expiresAt: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATETIME,
          label: "app.api.v1.core.referral.form.fields.expiresAt.label",
          description:
            "app.api.v1.core.referral.form.fields.expiresAt.description",
          placeholder:
            "app.api.v1.core.referral.form.fields.expiresAt.placeholder",
        },
        dateSchema.optional(),
      ),

      // Response fields
      id: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.contact.response.success",
        },
        z.string().uuid(),
      ),
      responseCode: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.contact.response.success",
        },
        z.string(),
      ),
      responseLabel: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.contact.response.success",
        },
        z.string().nullable(),
      ),
      responseMaxUses: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.contact.response.success",
        },
        z.number().nullable(),
      ),
      ownerUserId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.contact.response.success",
        },
        z.string().uuid(),
      ),
      currentUses: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.contact.response.success",
        },
        z.number(),
      ),
      isActive: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.contact.response.success",
        },
        z.boolean(),
      ),
      createdAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.contact.response.success",
        },
        z.string(),
      ),
      updatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.contact.response.success",
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.referral.errors.validation.title",
      description: "app.api.v1.core.referral.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.referral.errors.notFound.title",
      description: "app.api.v1.core.referral.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.referral.errors.unauthorized.title",
      description: "app.api.v1.core.referral.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.referral.errors.forbidden.title",
      description: "app.api.v1.core.referral.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.referral.errors.serverError.title",
      description: "app.api.v1.core.referral.errors.serverError.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.referral.errors.network.title",
      description: "app.api.v1.core.referral.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.referral.errors.unknown.title",
      description: "app.api.v1.core.referral.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.referral.errors.unsavedChanges.title",
      description: "app.api.v1.core.referral.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.referral.errors.conflict.title",
      description: "app.api.v1.core.referral.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.referral.success.title",
    description: "app.api.v1.core.referral.success.description",
  },

  examples: {
    requests: {
      default: {
        code: "FRIEND2024",
        label: "Friend Referral",
        maxUses: 100,
      },
      unlimited: {
        code: "UNLIMITED",
      },
    },
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        responseCode: "FRIEND2024",
        responseLabel: "Friend Referral",
        responseMaxUses: 100,
        ownerUserId: "123e4567-e89b-12d3-a456-426614174001",
        currentUses: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      unlimited: {
        id: "123e4567-e89b-12d3-a456-426614174002",
        responseCode: "UNLIMITED",
        responseLabel: null,
        responseMaxUses: null,
        ownerUserId: "123e4567-e89b-12d3-a456-426614174001",
        currentUses: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  },
});

// Export types for use in repository and route handlers
export type ReferralPostRequestOutput = typeof POST.types.RequestOutput;
export type ReferralPostResponseOutput = typeof POST.types.ResponseOutput;

export default { POST };
