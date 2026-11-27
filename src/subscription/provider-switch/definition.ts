/**
 * Subscription Provider Switch API Definition
 * GET: can this account's card plan move to the new payment provider, and
 *      on what terms (deadline, when new billing starts).
 * POST: open the new provider's checkout for the same plan and interval.
 * Shows nothing while no switch provider is configured and enabled.
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

import { PaymentProvider, PaymentProviderDB } from "../../payment/enum";
import { BillingInterval, SubscriptionPlan } from "../enum";
import {
  SwitchCarryOver,
  SwitchCarryOverOptions,
  SwitchOfferState,
  SwitchOfferStateOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const ProviderSwitchWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ProviderSwitchWidget })),
);

/** Accounts only: guests have no plan to move. */
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
    title: "errors.network.title",
    description: "errors.network.description",
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
    title: "errors.server.title",
    description: "errors.server.description",
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title",
    description: "errors.unknown.description",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title",
    description: "errors.unsavedChanges.description",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title",
    description: "errors.conflict.description",
  },
} as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["subscription", "provider-switch"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "payments",
  subCategory: "Management",
  icon: "credit-card",
  tags: ["tags.subscription", "tags.billing"],
  allowedRoles: ACCOUNT_ROLES,
  aliases: ["subscription-provider-switch"],
  fields: customWidgetObject({
    render: ProviderSwitchWidget,
    usage: { response: true } as const,
    children: {
      offer: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        label: "response.offer",
        enumOptions: SwitchOfferStateOptions,
        schema: z.enum(SwitchOfferState),
      }),
      targetProvider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.targetProvider",
        schema: z.enum(PaymentProviderDB).optional(),
      }),
      plan: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.plan",
        schema: z.enum(SubscriptionPlan).optional(),
      }),
      billingInterval: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.billingInterval",
        schema: z.enum(BillingInterval).optional(),
      }),
      pastDue: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.pastDue",
        schema: z.boolean(),
      }),
      deadline: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.deadline",
        schema: dateSchema.optional(),
      }),
      billingStartAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.billingStartAt",
        schema: dateSchema.optional(),
      }),
      firstPeriodEnd: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.firstPeriodEnd",
        schema: dateSchema.optional(),
      }),
      carryOver: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        label: "response.carryOver",
        enumOptions: SwitchCarryOverOptions,
        schema: z.enum(SwitchCarryOver).optional(),
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
        offer: SwitchOfferState.AVAILABLE,
        targetProvider: PaymentProvider.NOWPAYMENTS,
        plan: SubscriptionPlan.PLUS,
        billingInterval: BillingInterval.MONTHLY,
        pastDue: false,
        deadline: "2026-12-15T00:00:00.000Z",
        billingStartAt: "2026-12-15T00:00:00.000Z",
        firstPeriodEnd: "2027-01-14T00:00:00.000Z",
        carryOver: SwitchCarryOver.EXTEND_FIRST_PERIOD,
      },
      notEligible: {
        offer: SwitchOfferState.NOT_ELIGIBLE,
        pastDue: false,
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["subscription", "provider-switch"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "payments",
  subCategory: "Management",
  icon: "credit-card",
  tags: ["tags.subscription", "tags.billing"],
  allowedRoles: ACCOUNT_ROLES,
  aliases: ["subscription-provider-switch-start"],
  fields: customWidgetObject({
    render: ProviderSwitchWidget,
    usage: { response: true } as const,
    children: {
      checkoutUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.checkoutUrl",
        schema: z.string(),
      }),
      sessionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.sessionId",
        schema: z.string(),
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
        checkoutUrl: "https://nowpayments.io/payment/?iid=123456",
        sessionId: "123456",
      },
    },
  },
});

export type ProviderSwitchGetResponseOutput = typeof GET.types.ResponseOutput;
export type ProviderSwitchPostResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { GET, POST };
export default endpoints;
