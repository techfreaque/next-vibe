/**
 * Newsletter Subscribe API Endpoint Definition
 * Defines the API endpoint for newsletter subscription
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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
import { scopedTranslation } from "./i18n";

/**
 * POST endpoint for newsletter subscription
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["newsletter", "subscribe"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.leadsCampaigns",
  icon: "bell",
  tags: ["tags.newsletter", "tags.subscription"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  allowedLocalModeRoles: [] as const,
  aliases: ["newsletter-subscribe", "subscribe"],

  cli: {
    firstCliArgKey: "email",
  },
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "email.label",
        description: "email.description",
        placeholder: "email.placeholder",
        helpText: "email.helpText",
        columns: 12,
        schema: z.string().email(),
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "name.label",
        description: "name.description",
        placeholder: "name.placeholder",
        helpText: "name.helpText",
        columns: 12,
        schema: z.string().optional(),
      }),
      preferences: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "preferences.label",
        description: "preferences.description",
        placeholder: "preferences.placeholder",
        helpText: "preferences.helpText",
        options: NewsletterPreferenceOptions,
        columns: 12,
        schema: z.array(z.enum(NewsletterPreference)).optional(),
      }),

      // === RESPONSE FIELDS ===
      // Note: leadId comes from JWT payload (user.leadId) on server-side
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.success",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.message",
        schema: z.string(),
      }),
      leadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadId",
        schema: z.string(),
      }),
      subscriptionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.subscriptionId",
        schema: z.string(),
      }),
      userId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.userId",
        schema: z.string().optional(),
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
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
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
  },
});

export type SubscribePostRequestInput = typeof POST.types.RequestInput;
export type SubscribePostRequestOutput = typeof POST.types.RequestOutput;
export type SubscribePostResponseInput = typeof POST.types.ResponseInput;
export type SubscribePostResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
