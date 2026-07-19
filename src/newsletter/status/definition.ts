/**
 * Newsletter Status API Endpoint Definition
 * Defines the API endpoint for checking newsletter subscription status
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { NEWSLETTER_STATUS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

/**
 * GET endpoint for checking newsletter subscription status
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["newsletter", "status"],
  title: "title",
  titleShort: "titleShort",
  description: "description",
  icon: "newspaper",
  tags: [],
  category: "newsletter",
  subCategory: "Subscriptions",
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  aliases: [NEWSLETTER_STATUS_ALIAS] as const,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "form.title",
    description: "form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // REQUEST FIELDS
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "email.label",
        description: "email.description",
        placeholder: "email.placeholder",
        helpText: "email.helpText",
        columns: 12,
        schema: z.string().email(),
        order: 1,
      }),
      // RESPONSE FIELDS
      subscribed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.subscribed",
        schema: z.boolean(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.status",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.internal.title",
      description: "errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
  },
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
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
