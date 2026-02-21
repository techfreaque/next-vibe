/**
 * Newsletter Unsubscribe API Endpoint Definition
 * Defines the API endpoint for newsletter unsubscription
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { objectField } from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * POST endpoint for newsletter unsubscribe
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["newsletter", "unsubscribe"],
  title: "app.api.newsletter.unsubscribe.post.title" as const,
  description: "app.api.newsletter.unsubscribe.post.description" as const,
  category: "app.api.system.category" as const,
  icon: "bell-off",
  tags: ["app.api.newsletter.unsubscribe.tags.newsletter" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  allowedLocalModeRoles: [] as const,
  aliases: ["newsletter-unsubscribe", "unsubscribe"],

  cli: {
    firstCliArgKey: "email",
  },
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.newsletter.unsubscribe.post.form.title" as const,
      description:
        "app.api.newsletter.unsubscribe.post.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      email: requestField({
        schema: z.string().email(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "app.api.newsletter.unsubscribe.email.label" as const,
        description:
          "app.api.newsletter.unsubscribe.email.description" as const,
        placeholder:
          "app.api.newsletter.unsubscribe.email.placeholder" as const,
        columns: 12,
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.newsletter.unsubscribe.response.success" as const,
        schema: z.boolean(),
      }),
      message: responseField({
        type: WidgetType.TEXT,
        content: "app.api.newsletter.unsubscribe.response.message" as const,
        schema: z.string(),
      }),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.newsletter.unsubscribe.post.errors.validation.title" as const,
      description:
        "app.api.newsletter.unsubscribe.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.newsletter.unsubscribe.post.errors.internal.title" as const,
      description:
        "app.api.newsletter.unsubscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.newsletter.unsubscribe.post.errors.unauthorized.title" as const,
      description:
        "app.api.newsletter.unsubscribe.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.newsletter.unsubscribe.post.errors.forbidden.title" as const,
      description:
        "app.api.newsletter.unsubscribe.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.newsletter.unsubscribe.post.errors.internal.title" as const,
      description:
        "app.api.newsletter.unsubscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.newsletter.unsubscribe.post.errors.internal.title" as const,
      description:
        "app.api.newsletter.unsubscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.newsletter.unsubscribe.post.errors.internal.title" as const,
      description:
        "app.api.newsletter.unsubscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.newsletter.unsubscribe.post.errors.internal.title" as const,
      description:
        "app.api.newsletter.unsubscribe.post.errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.newsletter.unsubscribe.post.errors.internal.title" as const,
      description:
        "app.api.newsletter.unsubscribe.post.errors.internal.description" as const,
    },
  },

  successTypes: {
    title: "app.api.newsletter.unsubscribe.post.success.title" as const,
    description:
      "app.api.newsletter.unsubscribe.post.success.description" as const,
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
