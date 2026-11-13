/**
 * Newsletter Credit Bonus API Endpoint Definition
 * Account-only: GET tells a signed-in account whether the monthly newsletter
 * credit bonus is still on offer; POST subscribes the account email (double
 * opt-in) to claim it. Guests get no newsletter bonus (credits/free-allowance.ts).
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { NewsletterCreditOffer, NewsletterCreditOfferOptions } from "./enum";
import { scopedTranslation } from "./i18n";

const NewsletterCreditBonusWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.NewsletterCreditBonusWidget })),
);

/** Accounts only. PUBLIC is deliberately absent: the bonus needs an account. */
const ACCOUNT_ROLES = [
  UserRole.CUSTOMER,
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

const errorTypes = {
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
    title: "errors.forbidden.title",
    description: "errors.forbidden.description",
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
    title: "errors.internal.title",
    description: "errors.internal.description",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.internal.title",
    description: "errors.internal.description",
  },
} as const;

const exampleResponse = {
  offer: NewsletterCreditOffer.AVAILABLE,
  email: "user@example.com",
  bonusCredits: FREE_CREDIT_ALLOWANCE.newsletterBonus,
  freeRefillAt: "2026-12-01T00:00:00.000Z",
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["newsletter", "credit-bonus"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "newsletter",
  subCategory: "Subscriptions",
  icon: "gift",
  tags: ["tags.newsletter", "tags.credits"],
  allowedRoles: ACCOUNT_ROLES,
  aliases: ["newsletter-credit-bonus"],
  fields: customWidgetObject({
    render: NewsletterCreditBonusWidget,
    usage: { response: true } as const,
    children: {
      offer: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        label: "response.offer",
        enumOptions: NewsletterCreditOfferOptions,
        schema: z.enum(NewsletterCreditOffer),
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
      freeRefillAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.freeRefillAt",
        schema: dateSchema,
      }),
    },
  }),
  errorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    responses: {
      default: exampleResponse,
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["newsletter", "credit-bonus"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "newsletter",
  subCategory: "Subscriptions",
  icon: "gift",
  tags: ["tags.newsletter", "tags.credits"],
  allowedRoles: ACCOUNT_ROLES,
  aliases: ["newsletter-credit-bonus-claim"],
  fields: customWidgetObject({
    render: NewsletterCreditBonusWidget,
    usage: { response: true } as const,
    children: {
      offer: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        label: "response.offer",
        enumOptions: NewsletterCreditOfferOptions,
        schema: z.enum(NewsletterCreditOffer),
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
      freeRefillAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.freeRefillAt",
        schema: dateSchema,
      }),
    },
  }),
  errorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
  examples: {
    responses: {
      default: {
        ...exampleResponse,
        offer: NewsletterCreditOffer.PENDING_CONFIRMATION,
      },
    },
  },
});

export type CreditBonusGetResponseOutput = typeof GET.types.ResponseOutput;
export type CreditBonusPostResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { GET, POST };
export default endpoints;
