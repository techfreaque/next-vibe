/**
 * Whop Provider (card payments)
 *
 * Hosted checkout through checkout configurations: our metadata (userId,
 * type, planId, billingInterval, quantity, switchId...) rides on the checkout
 * and Whop copies it onto the payment and membership, so the shared webhook
 * handler grants credits and stores subscriptions exactly like Stripe.
 * Plans are real Whop renewal variants (Whop bills renewals and runs
 * dunning); credit packs are one-time variants per total amount.
 *
 * Docs (read 2026-11-27): https://docs.whop.com/developer/guides/accept-payments.md,
 * https://docs.whop.com/developer/guides/webhooks.md, spec
 * https://api.whop.com/api/v1/openapi.json (Api-Version-Date 2026-11-25).
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { productsRepository } from "@/products/repository-client";

import { ensureCheckoutTransaction } from "../../checkout/transaction";
import {
  CheckoutMode,
  PaymentProvider as PaymentProviderEnum,
} from "../../enum";
import type {
  CheckoutSessionParams,
  CheckoutSessionResult,
  CustomerResult,
  PaymentProvider,
  WebhookEvent,
} from "../types";
import {
  getWhopAccountId,
  getWhopMembership,
  getWhopPayment,
  whopCheckoutConfigurationSchema,
  whopMembershipSchema,
  whopRequest,
} from "./api";
import { ensureWhopVariant, whopVariantSpec } from "./catalog";
import { getWhopCredentials, isWhopConfigured } from "./config";
import {
  mapWhopWebhook,
  whopEnvelopeSchema,
  type WhopRelated,
  whopRelatedLookups,
} from "./events";
import { scopedTranslation } from "./i18n";
import {
  decodeWhopSignatureHeaders,
  verifyWhopSignature,
  type WhopSignatureCheck,
} from "./signature";

/** Internal event type for Whop webhooks that need no action. */
export const WHOP_IGNORED_EVENT = "whop.ignored";

/** Whop's own order list, for buyers without a manage link. */
export const WHOP_ORDERS_URL = "https://whop.com/@me/settings/orders/";

/**
 * Whop appends `payment` (pay_ id) and `status` to the return URL, and the
 * checkout is fulfilled by the webhook only. Drop our NOWPayments-style
 * callback token (it would trigger the redirect fulfilment) and the Stripe
 * placeholder.
 */
export function whopRedirectUrl(successUrl: string): string {
  const url = new URL(successUrl);
  url.searchParams.delete("cbtoken");
  url.searchParams.delete("session_id");
  url.searchParams.set("provider", "whop");
  return url.toString();
}

/**
 * Prefill the hosted checkout with the account's email and name. Whop reads
 * `email` and `name` query parameters on the purchase URL (verified on the
 * sandbox checkout 2026-11-27; not in the API docs). The buyer may still
 * edit them: the payment maps to our account through the checkout metadata
 * (userId), never through the email.
 */
export async function whopPrefilledUrl(
  purchaseUrl: string,
  userId: string,
): Promise<string> {
  const [account] = await db
    .select({ email: users.email, privateName: users.privateName })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!account) {
    return purchaseUrl;
  }
  const url = new URL(purchaseUrl);
  if (account.email) {
    url.searchParams.set("email", account.email);
  }
  if (account.privateName) {
    url.searchParams.set("name", account.privateName);
  }
  return url.toString();
}

export class WhopProvider implements PaymentProvider {
  name = PaymentProviderEnum.WHOP;

  async ensureCustomer(
    userId: string,
    // oxlint-disable-next-line no-unused-vars
    _email: string,
    // oxlint-disable-next-line no-unused-vars
    _name: string | null,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CustomerResult>> {
    const { t } = scopedTranslation.scopedT(locale);
    if (!isWhopConfigured()) {
      return fail({
        message: t("errors.notConfigured"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    // Whop creates its own buyer at checkout; our user id rides in metadata.
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user) {
      logger.warn("Whop checkout for unknown user", { userId });
      return fail({
        message: t("errors.userNotFound"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    return success({ customerId: userId });
  }

  async createCheckoutSession(
    params: CheckoutSessionParams,
    // oxlint-disable-next-line no-unused-vars
    _customerId: string,
    logger: EndpointLogger,
    callbackToken: string,
    locale: CountryLanguage,
  ): Promise<ResponseType<CheckoutSessionResult>> {
    const { t } = scopedTranslation.scopedT(locale);
    if (!isWhopConfigured()) {
      return fail({
        message: t("errors.notConfigured"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    try {
      const product = productsRepository.getProduct(
        params.productId,
        params.locale,
        params.interval,
      );
      const quantity =
        params.interval === "one_time"
          ? Math.max(1, Number.parseInt(params.metadata.quantity || "1", 10))
          : 1;
      const total = product.price * quantity;
      if (!(total > 0)) {
        return fail({
          message: t("errors.productNotFound"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }
      const variant = await ensureWhopVariant(
        whopVariantSpec({
          productId: params.productId,
          interval: params.interval,
          price: total,
          currency: product.currency,
        }),
        logger,
      );
      if (!variant.ok || !variant.data.variantId) {
        const error = variant.ok ? "variant missing" : variant.message;
        logger.error("Whop variant could not be ensured", {
          productId: params.productId,
          interval: params.interval,
          error,
        });
        return fail({
          message: t("errors.checkoutFailed", { error }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      const accountId = await getWhopAccountId();
      if (!accountId.ok) {
        return fail({
          message: t("errors.checkoutFailed", { error: accountId.message }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      const metadata: Record<string, string> = {
        ...params.metadata,
        provider: PaymentProviderEnum.WHOP,
        productId: params.productId,
      };
      const checkout = await whopRequest({
        method: "POST",
        path: "/checkout_configurations",
        schema: whopCheckoutConfigurationSchema,
        idempotencyKey: `ub-checkout-${callbackToken}`,
        body: {
          account_id: accountId.data,
          variant_id: variant.data.variantId,
          // Whop only accepts https return URLs; a plain-http dev server
          // keeps Whop's own confirmation page.
          ...(params.successUrl.startsWith("https://")
            ? { redirect_url: whopRedirectUrl(params.successUrl) }
            : {}),
          metadata,
        },
      });
      if (!checkout.ok) {
        logger.error("Whop checkout configuration failed", {
          status: checkout.status,
          error: checkout.message,
          productId: params.productId,
        });
        return fail({
          message: t("errors.checkoutFailed", { error: checkout.message }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }

      await ensureCheckoutTransaction({
        userId: params.userId,
        providerSessionId: checkout.data.id,
        amount: total.toFixed(2),
        currency: product.currency,
        provider: PaymentProviderEnum.WHOP,
        mode:
          params.interval === "one_time"
            ? CheckoutMode.PAYMENT
            : CheckoutMode.SUBSCRIPTION,
        metadata,
      });

      logger.info("Whop checkout opened", {
        checkoutId: checkout.data.id,
        variantId: variant.data.variantId,
        productId: params.productId,
        interval: params.interval,
        environment: getWhopCredentials().environment,
      });
      return success({
        sessionId: checkout.data.id,
        checkoutUrl: await whopPrefilledUrl(
          checkout.data.purchase_url,
          params.userId,
        ),
        providerPriceId: variant.data.variantId,
        providerProductId: variant.data.whopProductId,
      });
    } catch (error) {
      logger.error("Whop checkout failed", parseError(error));
      return fail({
        message: t("errors.checkoutFailed", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }

  /**
   * `signature` is the JSON of the three Standard Webhooks headers
   * (encodeWhopSignatureHeaders in the webhook route).
   */
  async verifyWebhook(
    body: string,
    signature: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<WebhookEvent>> {
    const { t } = scopedTranslation.scopedT(locale);
    const secret = getWhopCredentials().webhookSecret;
    if (!secret) {
      return fail({
        message: t("errors.notConfigured"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const headers = decodeWhopSignatureHeaders(signature);
    const check: WhopSignatureCheck = headers
      ? verifyWhopSignature({ secret, headers, body })
      : { valid: false, reason: "signature" };
    if (!headers || !check.valid) {
      logger.error("Whop webhook signature verification failed", {
        reason: check.valid ? "headers" : check.reason,
        webhookId: headers?.id ?? null,
      });
      return fail({
        message: t("errors.webhookInvalidSignature"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    let envelope: ReturnType<typeof whopEnvelopeSchema.safeParse>;
    try {
      envelope = whopEnvelopeSchema.safeParse(JSON.parse(body));
    } catch (error) {
      return fail({
        message: t("errors.webhookInvalidPayload", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }
    if (!envelope.success) {
      logger.error("Whop webhook payload unreadable", {
        webhookId: headers.id,
        error: envelope.error.message.slice(0, 300),
      });
      return fail({
        message: t("errors.webhookInvalidPayload", {
          error: envelope.error.message.slice(0, 200),
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    // Payloads are lean: periods live on the membership, the cumulative
    // refunded amount on the payment. A failed lookup is retried by Whop
    // only for renewals (the period is required there).
    const lookups = whopRelatedLookups(envelope.data);
    const related: WhopRelated = { membership: null, payment: null };
    if (lookups.membershipId) {
      const membership = await getWhopMembership(lookups.membershipId);
      if (membership.ok) {
        related.membership = membership.data;
      } else {
        logger.warn("Whop membership lookup failed", {
          membershipId: lookups.membershipId,
          error: membership.message,
        });
      }
    }
    if (lookups.paymentId) {
      const payment = await getWhopPayment(lookups.paymentId);
      if (payment.ok) {
        related.payment = payment.data;
      } else {
        logger.warn("Whop payment lookup failed", {
          paymentId: lookups.paymentId,
          error: payment.message,
        });
      }
    }

    const mapped = mapWhopWebhook(envelope.data, related);
    if (mapped.kind === "ignored") {
      const manualPayment =
        envelope.data.type === "payment.succeeded" &&
        mapped.reason.includes("metadata");
      // A paid order we cannot attribute needs a human: grant it by hand.
      if (manualPayment) {
        logger.warn("Whop payment without checkout metadata", {
          webhookId: envelope.data.id,
          paymentId: envelope.data.data.id ?? null,
        });
      } else {
        logger.debug("Whop webhook needs no action", {
          type: envelope.data.type,
          reason: mapped.reason,
        });
      }
      return success({
        id: `whop_${envelope.data.id}`,
        type: WHOP_IGNORED_EVENT,
        data: { id: envelope.data.id },
      });
    }
    logger.debug("Whop webhook verified", {
      whopType: envelope.data.type,
      eventType: mapped.event.type,
      eventId: mapped.event.id,
    });
    return success(mapped.event);
  }

  async retrieveSubscription(
    subscriptionId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      userId: string;
      currentPeriodStart?: number;
      currentPeriodEnd?: number;
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);
    const membership = await getWhopMembership(subscriptionId);
    if (!membership.ok) {
      logger.error("Whop membership retrieval failed", {
        subscriptionId,
        status: membership.status,
        error: membership.message,
      });
      return fail({
        message: t("errors.membershipFailed", { error: membership.message }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const start = membership.data.current_period_start;
    const end = membership.data.current_period_end;
    const userId = membership.data.metadata?.userId;
    return success({
      userId: typeof userId === "string" ? userId : "",
      currentPeriodStart: start ? Date.parse(start) : undefined,
      currentPeriodEnd: end ? Date.parse(end) : undefined,
    });
  }

  async cancelSubscription(
    subscriptionId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
    atPeriodEnd: boolean,
  ): Promise<ResponseType<void>> {
    const { t } = scopedTranslation.scopedT(locale);
    if (!isWhopConfigured()) {
      return fail({
        message: t("errors.notConfigured"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    // cancel_at_period_end=false revokes access at once (API 2026-07-23+).
    const result = await whopRequest({
      method: "POST",
      path: `/memberships/${encodeURIComponent(subscriptionId)}/cancel`,
      schema: whopMembershipSchema,
      body: { cancel_at_period_end: atPeriodEnd },
    });
    if (!result.ok) {
      logger.error("Whop membership cancel failed", {
        subscriptionId,
        atPeriodEnd,
        status: result.status,
        error: result.message,
      });
      return fail({
        message: t("errors.cancelFailed", { error: result.message }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    logger.info("Canceled Whop membership", { subscriptionId, atPeriodEnd });
    return success();
  }

  /**
   * Next charge at `renewAt` (provider switch carry-over). Logged, never
   * fatal: the plan is stored either way and the renewal webhook only
   * grants a period that moves forward.
   */
  async moveRenewalDate(
    membershipId: string,
    renewAt: Date,
    logger: EndpointLogger,
  ): Promise<boolean> {
    const result = await whopRequest({
      method: "PATCH",
      path: `/memberships/${encodeURIComponent(membershipId)}`,
      schema: whopMembershipSchema,
      body: { current_period_end: renewAt.toISOString() },
    });
    if (!result.ok) {
      logger.error("Whop renewal date could not be moved", {
        membershipId,
        renewAt: renewAt.toISOString(),
        status: result.status,
        error: result.message,
      });
      return false;
    }
    logger.info("Whop renewal date moved", {
      membershipId,
      renewAt: renewAt.toISOString(),
    });
    return true;
  }

  /** Buyer's self-service page (update card, cancel, receipts). */
  async getManageUrl(membershipId: string): Promise<string> {
    const membership = await getWhopMembership(membershipId);
    return (membership.ok && membership.data.manage_url) || WHOP_ORDERS_URL;
  }
}
