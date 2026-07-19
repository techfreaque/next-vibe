/**
 * Newsletter Unsubscribe API Endpoint Definition
 * Defines the API endpoint for newsletter unsubscription
 */

import { translatedValueSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const UnsubscribeWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UnsubscribeWidget })),
);

/**
 * POST endpoint for newsletter unsubscribe
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["newsletter", "unsubscribe"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "newsletter",
  subCategory: "Subscriptions",
  icon: "bell-off",
  tags: ["tags.newsletter" as const],
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
  fields: customWidgetObject({
    render: UnsubscribeWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      email: requestField(scopedTranslation, {
        schema: z.email(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "email.label",
        description: "email.description",
        placeholder: "email.placeholder",
        columns: 12,
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.success",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.message",
        schema: translatedValueSchema,
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
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
  },
});

export type UnsubscribePostRequestInput = typeof POST.types.RequestInput;
export type UnsubscribePostRequestOutput = typeof POST.types.RequestOutput;
export type UnsubscribePostResponseInput = typeof POST.types.ResponseInput;
export type UnsubscribePostResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
