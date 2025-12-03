/**
 * Newsletter Subscribe API Endpoint Definition
 * Defines the API endpoint for newsletter subscription
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

import { UserRole } from "../../user/user-roles/enum";
import { NewsletterPreference, NewsletterPreferenceOptions } from "../enum";

/**
 * POST endpoint for newsletter subscription
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["newsletter", "subscribe"],
  title: "app.api.newsletter.subscribe.post.title" as const,
  description: "app.api.newsletter.subscribe.post.description" as const,
  category: "app.api.newsletter.subscribe.category" as const,
  tags: [
    "app.api.newsletter.subscribe.tags.newsletter" as const,
    "app.api.newsletter.subscribe.tags.subscription" as const,
  ],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  aliases: ["newsletter-subscribe", "subscribe"],

  cli: {
    firstCliArgKey: "email",
  },
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.newsletter.subscribe.post.form.title" as const,
      description:
        "app.api.newsletter.subscribe.post.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      email: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label: "app.api.newsletter.subscribe.email.label" as const,
          description:
            "app.api.newsletter.subscribe.email.description" as const,
          placeholder:
            "app.api.newsletter.subscribe.email.placeholder" as const,
          helpText: "app.api.newsletter.subscribe.email.helpText" as const,
          columns: 12,
        },
        z.string().email(),
      ),
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.newsletter.subscribe.name.label" as const,
          description: "app.api.newsletter.subscribe.name.description" as const,
          placeholder: "app.api.newsletter.subscribe.name.placeholder" as const,
          helpText: "app.api.newsletter.subscribe.name.helpText" as const,
          columns: 12,
        },
        z.string().optional(),
      ),
      preferences: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.newsletter.subscribe.preferences.label" as const,
          description:
            "app.api.newsletter.subscribe.preferences.description" as const,
          placeholder:
            "app.api.newsletter.subscribe.preferences.placeholder" as const,
          helpText:
            "app.api.newsletter.subscribe.preferences.helpText" as const,
          options: NewsletterPreferenceOptions,
          columns: 12,
        },
        z.array(z.enum(NewsletterPreference)).optional(),
      ),

      // === RESPONSE FIELDS ===
      // Note: leadId comes from JWT payload (user.leadId) on server-side
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.newsletter.subscribe.response.success" as const,
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.newsletter.subscribe.response.message" as const,
        },
        z.string(),
      ),
      leadId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.newsletter.subscribe.response.leadId" as const,
        },
        z.string(),
      ),
      subscriptionId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.newsletter.subscribe.response.subscriptionId" as const,
        },
        z.string(),
      ),
      userId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.newsletter.subscribe.response.userId" as const,
        },
        z.string().optional(),
      ),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.newsletter.subscribe.post.errors.validation.title" as const,
      description:
        "app.api.newsletter.subscribe.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.newsletter.subscribe.post.errors.internal.title" as const,
      description:
        "app.api.newsletter.subscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.newsletter.subscribe.post.errors.unauthorized.title" as const,
      description:
        "app.api.newsletter.subscribe.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.newsletter.subscribe.post.errors.forbidden.title" as const,
      description:
        "app.api.newsletter.subscribe.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.newsletter.subscribe.post.errors.internal.title" as const,
      description:
        "app.api.newsletter.subscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.newsletter.subscribe.post.errors.internal.title" as const,
      description:
        "app.api.newsletter.subscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.newsletter.subscribe.post.errors.internal.title" as const,
      description:
        "app.api.newsletter.subscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.newsletter.subscribe.post.errors.internal.title" as const,
      description:
        "app.api.newsletter.subscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.newsletter.subscribe.post.errors.conflict.title" as const,
      description:
        "app.api.newsletter.subscribe.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.newsletter.subscribe.post.success.title" as const,
    description:
      "app.api.newsletter.subscribe.post.success.description" as const,
  },
  examples: {
    requests: {
      default: {
        email: "user@example.com",
        name: "John Doe",
        preferences: [
          NewsletterPreference.MARKETING,
          NewsletterPreference.PRODUCT_NEWS,
        ],
      },
      minimal: {
        email: "user@example.com",
      },
    },
    responses: {
      default: {
        success: true,
        message: "Successfully subscribed to newsletter",
        leadId: "123e4567-e89b-12d3-a456-426614174000",
        subscriptionId: "sub_123456789",
        userId: "user_987654321",
      },
      minimal: {
        success: true,
        message: "Successfully subscribed to newsletter",
        leadId: "123e4567-e89b-12d3-a456-426614174000",
        subscriptionId: "sub_123456789",
      },
    },
    urlPathParams: undefined,
  },
});

export type SubscribePostRequestInput = typeof POST.types.RequestInput;
export type SubscribePostRequestOutput = typeof POST.types.RequestOutput;
export type SubscribePostResponseInput = typeof POST.types.ResponseInput;
export type SubscribePostResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
