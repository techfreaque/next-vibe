/**
 * Subscription Cancel API Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user/user-roles/enum";
import { scopedTranslation } from "../i18n";

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const SubscriptionCancelContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SubscriptionCancelContainer })),
);

/**
 * DELETE endpoint for canceling subscription
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["subscription", "cancel"],
  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "package-x",
  category: "endpointCategories.payments",
  subCategory: "endpointCategories.subscriptionManagement",
  tags: ["tags.subscription" as const, "tags.cancel" as const],
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
      cancelAtPeriodEnd: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "form.fields.cancelAtPeriodEnd.label" as const,
        description: "form.fields.cancelAtPeriodEnd.description" as const,
        schema: z.boolean().default(true),
      }),
      reason: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "form.fields.reason.label" as const,
        description: "form.fields.reason.description" as const,
        schema: z.string().optional(),
      }),

      // RESPONSE FIELDS
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.success" as const,
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.message" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title" as const,
      description: "errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "success.title" as const,
    description: "success.description" as const,
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
