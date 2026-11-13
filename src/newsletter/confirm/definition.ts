/**
 * Newsletter Confirm API Endpoint Definition
 * Double opt-in: the welcome email links here with a token. Confirming unlocks
 * the monthly free-credit newsletter bonus for the pool that owns the subscription.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
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

import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { scopedTranslation } from "./i18n";

const NewsletterConfirmWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.NewsletterConfirmWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["newsletter", "confirm"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "newsletter",
  subCategory: "Subscriptions",
  icon: "mail",
  tags: ["tags.newsletter" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],
  aliases: ["newsletter-confirm"],

  cli: {
    firstCliArgKey: "token",
  },
  fields: customWidgetObject({
    render: NewsletterConfirmWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      token: requestField(scopedTranslation, {
        schema: z.string().min(16).max(128),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "token.label",
        description: "token.description",
        placeholder: "token.placeholder",
        columns: 12,
      }),

      // === RESPONSE FIELDS ===
      confirmed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.confirmed",
        schema: z.boolean(),
      }),
      email: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.email",
        schema: z.string(),
      }),
      bonusCredits: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.bonusCredits",
        schema: z.number(),
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
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
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
        token: "Zk3v0b7Qm2xY9pR4sT1uW6aC8dE5fG0h",
      },
    },
    responses: {
      default: {
        confirmed: true,
        email: "user@example.com",
        bonusCredits: FREE_CREDIT_ALLOWANCE.newsletterBonus,
      },
    },
  },
});

export type ConfirmPostRequestInput = typeof POST.types.RequestInput;
export type ConfirmPostRequestOutput = typeof POST.types.RequestOutput;
export type ConfirmPostResponseInput = typeof POST.types.ResponseInput;
export type ConfirmPostResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
