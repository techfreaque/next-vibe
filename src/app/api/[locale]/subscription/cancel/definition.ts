/**
 * Subscription Cancel API Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user/user-roles/enum";
import { SubscriptionCancelContainer } from "./widget";

/**
 * DELETE endpoint for canceling subscription
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["subscription", "cancel"],
  title: "app.api.subscription.delete.title" as const,
  description: "app.api.subscription.delete.description" as const,
  icon: "package-x" as const,
  category: "app.api.payment.category" as const,
  tags: [
    "app.api.subscription.tags.subscription" as const,
    "app.api.subscription.tags.cancel" as const,
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  aliases: ["subscription-cancel", "cancel-subscription"] as const,

  fields: customWidgetObject({
    render: SubscriptionCancelContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // REQUEST FIELDS
      cancelAtPeriodEnd: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.subscription.form.fields.cancelAtPeriodEnd.label" as const,
        description:
          "app.api.subscription.form.fields.cancelAtPeriodEnd.description" as const,
        schema: z.boolean().default(true),
      }),
      reason: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.subscription.form.fields.reason.label" as const,
        description:
          "app.api.subscription.form.fields.reason.description" as const,
        schema: z.string().optional(),
      }),

      // RESPONSE FIELDS
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.delete.response.success" as const,
        schema: z.boolean(),
      }),
      message: responseField({
        type: WidgetType.TEXT,
        content: "app.api.subscription.delete.response.message" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.subscription.delete.errors.validation.title" as const,
      description:
        "app.api.subscription.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.subscription.delete.errors.unauthorized.title" as const,
      description:
        "app.api.subscription.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.subscription.delete.errors.notFound.title" as const,
      description:
        "app.api.subscription.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.subscription.delete.errors.conflict.title" as const,
      description:
        "app.api.subscription.delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.subscription.delete.errors.server.title" as const,
      description:
        "app.api.subscription.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.subscription.delete.errors.network.title" as const,
      description:
        "app.api.subscription.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.subscription.delete.errors.unknown.title" as const,
      description:
        "app.api.subscription.delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.subscription.delete.errors.forbidden.title" as const,
      description:
        "app.api.subscription.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.subscription.delete.errors.unsavedChanges.title" as const,
      description:
        "app.api.subscription.delete.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "app.api.subscription.delete.success.title" as const,
    description: "app.api.subscription.delete.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        cancelAtPeriodEnd: true,
        reason: "No longer needed",
      },
    },
    responses: {
      default: {
        success: true,
        message:
          "Subscription will be canceled at the end of the billing period",
      },
    },
  },
});

export default { DELETE } as const;

export type SubscriptionCancelDeleteRequestOutput =
  typeof DELETE.types.RequestOutput;
export type SubscriptionCancelDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;
