/**
 * Newsletter Unsubscribe API Endpoint Definition
 * Defines the API endpoint for newsletter unsubscription
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * POST endpoint for newsletter unsubscribe
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "newsletter", "unsubscribe"],
  title: "app.api.v1.core.newsletter.unsubscribe.post.title" as const,
  description:
    "app.api.v1.core.newsletter.unsubscribe.post.description" as const,
  category: "app.api.v1.core.newsletter.unsubscribe.category" as const,
  tags: ["app.api.v1.core.newsletter.unsubscribe.tags.newsletter" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  aliases: ["newsletter-unsubscribe", "unsubscribe"],

  cli: {
    firstCliArgKey: "email",
  },
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.newsletter.unsubscribe.post.form.title" as const,
      description:
        "app.api.v1.core.newsletter.unsubscribe.post.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      email: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label: "app.api.v1.core.newsletter.unsubscribe.email.label" as const,
          description:
            "app.api.v1.core.newsletter.unsubscribe.email.description" as const,
          placeholder:
            "app.api.v1.core.newsletter.unsubscribe.email.placeholder" as const,
          layout: { columns: 12 },
        },
        z.string().email(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.newsletter.unsubscribe.response.success" as const,
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.newsletter.unsubscribe.response.message" as const,
        },
        z.string(),
      ),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.validation.title" as const,
      description:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.internal.title" as const,
      description:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.internal.title" as const,
      description:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.internal.title" as const,
      description:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.internal.title" as const,
      description:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.internal.title" as const,
      description:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.internal.title" as const,
      description:
        "app.api.v1.core.newsletter.unsubscribe.post.errors.internal.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.newsletter.unsubscribe.post.success.title" as const,
    description:
      "app.api.v1.core.newsletter.unsubscribe.post.success.description" as const,
  },
  examples: {
    requests: {
      default: {
        email: "user@example.com",
      },
    },
    responses: {
      default: {
        success: true,
        message: "Successfully unsubscribed from newsletter",
      },
    },
    urlPathParams: undefined,
  },
});

export type UnsubscribePostRequestInput = typeof POST.types.RequestInput;
export type UnsubscribePostRequestOutput = typeof POST.types.RequestOutput;
export type UnsubscribePostResponseInput = typeof POST.types.ResponseInput;
export type UnsubscribePostResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
