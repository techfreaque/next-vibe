/**
 * Newsletter Status API Endpoint Definition
 * Defines the API endpoint for checking newsletter subscription status
 */

import { z } from "zod";

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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * GET endpoint for checking newsletter subscription status
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["newsletter", "status"],
  title: "app.api.newsletter.status.title" as const,
  description: "app.api.newsletter.status.description" as const,
  tags: [],
  category: "app.api.newsletter.status.category" as const,
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
      title: "app.api.newsletter.status.form.title" as const,
      description: "app.api.newsletter.status.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // REQUEST FIELDS
      email: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label: "app.api.newsletter.status.email.label" as const,
          description: "app.api.newsletter.status.email.description" as const,
          placeholder: "app.api.newsletter.status.email.placeholder" as const,
          helpText: "app.api.newsletter.status.email.helpText" as const,
          columns: 12,
          order: 1,
        },
        z.string().email(),
      ),
      // RESPONSE FIELDS
      subscribed: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.newsletter.status.response.subscribed" as const,
        },
        z.boolean(),
      ),
      status: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.newsletter.status.response.status" as const,
        },
        z.string(),
      ),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.newsletter.status.errors.validation.title" as const,
      description:
        "app.api.newsletter.status.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.newsletter.status.errors.internal.title" as const,
      description:
        "app.api.newsletter.status.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.newsletter.status.errors.unauthorized.title" as const,
      description:
        "app.api.newsletter.status.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.newsletter.status.errors.unauthorized.title" as const,
      description:
        "app.api.newsletter.status.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.newsletter.status.errors.notFound.title" as const,
      description:
        "app.api.newsletter.status.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.newsletter.status.errors.internal.title" as const,
      description:
        "app.api.newsletter.status.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.newsletter.status.errors.internal.title" as const,
      description:
        "app.api.newsletter.status.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.newsletter.status.errors.validation.title" as const,
      description:
        "app.api.newsletter.status.errors.validation.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.newsletter.status.errors.validation.title" as const,
      description:
        "app.api.newsletter.status.errors.validation.description" as const,
    },
  },
  successTypes: {
    title: "app.api.newsletter.status.success.title" as const,
    description: "app.api.newsletter.status.success.description" as const,
  },
  examples: {
    urlPathParams: undefined,
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
