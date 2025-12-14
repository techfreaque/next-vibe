/**
 * Payment Provider Abstraction
 * Interfaces for supporting multiple payment processors
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Countries, CountryLanguage } from "@/i18n/core/config";

import type { ProductIds } from "../../products/repository-client";

export type PaymentInterval = "month" | "year" | "one_time";

export interface CheckoutSessionParams {
  userId: string;
  productId: ProductIds;
  interval: PaymentInterval;
  country: Countries;
  locale: CountryLanguage;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}

export interface CheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
  // Provider-specific IDs (returned for recurring subscriptions to save in DB)
  providerPriceId?: string;
  providerProductId?: string;
}

export interface CustomerResult {
  customerId: string;
}

/**
 * Generic checkout session for credit pack purchases
 * Provider-agnostic interface for webhook handling
 */
export interface CreditPackCheckoutSession {
  id: string;
  metadata?: {
    userId?: string;
    totalCredits?: string;
    type?: string;
  };
}

export interface CheckoutSession {
  id: string;
  metadata?: Record<string, string>;
  customer?: string | null;
  amount_total?: number | null;
}

/**
 * Base type for webhook data objects
 * All provider webhook data must have an id
 */
export interface WebhookData {
  id: string;
  metadata?: {
    userId?: string;
    planId?: string;
    billingInterval?: string;
    provider?: string;
    type?: string;
    totalCredits?: string;
    subscriptionPlanId?: string;
    [key: string]: string | undefined;
  };
  customer?: string | null;
  status?: string;
  cancel_at_period_end?: boolean;
  current_period_start?: number;
  current_period_end?: number;
  amount_total?: number | null;
  subscription?: string;
}

export interface WebhookEvent<T extends WebhookData = WebhookData> {
  id: string;
  type: string;
  data: T;
}

export interface PaymentProvider {
  name: string;

  ensureCustomer(
    userId: string,
    email: string,
    name: string | null,
    logger: EndpointLogger,
  ): Promise<ResponseType<CustomerResult>>;

  createCheckoutSession(
    params: CheckoutSessionParams,
    customerId: string,
    logger: EndpointLogger,
    callbackToken: string,
  ): Promise<ResponseType<CheckoutSessionResult>>;

  verifyWebhook(
    body: string,
    signature: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<WebhookEvent>>;

  retrieveSubscription(
    subscriptionId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      userId: string;
      currentPeriodStart?: number;
      currentPeriodEnd?: number;
    }>
  >;

  cancelSubscription(
    subscriptionId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;
}
