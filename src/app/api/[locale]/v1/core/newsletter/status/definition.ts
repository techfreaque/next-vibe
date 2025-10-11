/**
 * Newsletter Status API Endpoint Definition
 * Defines the API endpoint for checking newsletter subscription status
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
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * GET endpoint for checking newsletter subscription status
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "newsletter", "status"],
  title: "app.api.v1.core.newsletter.status.title" as const,
  description: "app.api.v1.core.newsletter.status.description" as const,
  tags: [],
  category: "app.api.v1.core.newsletter.status.category" as const,
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  aliases: ["newsletter-status", "newsletter:status"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.newsletter.status.form.title" as const,
      description:
        "app.api.v1.core.newsletter.status.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // REQUEST FIELDS
      email: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label: "app.api.v1.core.newsletter.status.email.label" as const,
          description:
            "app.api.v1.core.newsletter.status.email.description" as const,
          placeholder:
            "app.api.v1.core.newsletter.status.email.placeholder" as const,
          helpText: "app.api.v1.core.newsletter.status.email.helpText" as const,
          validation: {
            required: true,
          },
          layout: {
            columns: 12,
            order: 1,
          },
        },
        z.email(),
      ),
      // RESPONSE FIELDS
      subscribed: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.newsletter.status.response.subscribed" as const,
        },
        z.boolean(),
      ),
      status: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.newsletter.status.response.status" as const,
        },
        z.string(),
      ),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.newsletter.status.errors.validation.title" as const,
      description:
        "app.api.v1.core.newsletter.status.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.newsletter.status.errors.internal.title" as const,
      description:
        "app.api.v1.core.newsletter.status.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.newsletter.status.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.newsletter.status.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.newsletter.status.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.newsletter.status.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.newsletter.status.errors.notFound.title" as const,
      description:
        "app.api.v1.core.newsletter.status.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.newsletter.status.errors.internal.title" as const,
      description:
        "app.api.v1.core.newsletter.status.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.newsletter.status.errors.internal.title" as const,
      description:
        "app.api.v1.core.newsletter.status.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.newsletter.status.errors.validation.title" as const,
      description:
        "app.api.v1.core.newsletter.status.errors.validation.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.newsletter.status.errors.validation.title" as const,
      description:
        "app.api.v1.core.newsletter.status.errors.validation.description" as const,
    },
  },
  successTypes: {
    title: "app.api.v1.core.newsletter.status.success.title" as const,
    description:
      "app.api.v1.core.newsletter.status.success.description" as const,
  },
  examples: {
    urlPathVariables: undefined,
    requests: {
      basic: {
        email: "user@example.com",
      },
      subscribed: {
        email: "subscribed@example.com",
      },
      unsubscribed: {
        email: "unsubscribed@example.com",
      },
    },
    responses: {
      basic: {
        subscribed: true,
        status: "SUBSCRIBED",
      },
      subscribed: {
        subscribed: true,
        status: "SUBSCRIBED",
      },
      unsubscribed: {
        subscribed: false,
        status: "UNSUBSCRIBED",
      },
    },
  },
});

export type StatusGetRequestInput = typeof GET.types.RequestInput;
export type StatusGetRequestOutput = typeof GET.types.RequestOutput;
export type StatusGetResponseInput = typeof GET.types.ResponseInput;
export type StatusGetResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
