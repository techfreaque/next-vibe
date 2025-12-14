/**
 * NOWPayments Provider Implementation
 * Production-ready crypto payment provider with Stripe-compatible interface
 * Supports both one-time payments and recurring subscriptions
 */

import "server-only";

import { createHmac } from "node:crypto";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import {
  type Product,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";

import { users } from "../../../user/db";
import { paymentInvoices } from "../../db";
import { InvoiceStatus } from "../../enum";
import { paymentEnv } from "../../env";
import type {
  CheckoutSessionParams,
  CheckoutSessionResult,
  CustomerResult,
  PaymentProvider,
  WebhookEvent,
} from "../types";

/**
 * NOWPayments API Response Types
 */

// One-time payment invoice
interface NOWPaymentsInvoiceResponse {
  id: string;
  token_id: string;
  order_id: string;
  order_description: string;
  price_amount: string;
  price_currency: string;
  pay_currency?: string;
  ipn_callback_url?: string;
  invoice_url: string;
  success_url?: string;
  cancel_url?: string;
  partially_paid_url?: string;
  created_at: string;
  updated_at: string;
  is_fixed_rate?: boolean;
  is_fee_paid_by_user?: boolean;
}

// Subscription plan
interface NOWPaymentsSubscriptionPlan {
  id: number;
  title: string;
  interval_day: number; // Billing interval in days
  amount: number;
  currency: string;
  ipn_callback_url?: string;
  success_url?: string;
  cancel_url?: string;
  partially_paid_url?: string;
  created_at: string;
  updated_at: string;
}

// Email subscription (recurring payment)
interface NOWPaymentsSubscription {
  id: number;
  subscription_plan_id: number;
  email: string;
  status: "ACTIVE" | "INACTIVE" | "PAID" | "UNPAID" | "CANCELLED";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  next_payment_date?: string;
}

interface NOWPaymentsPaymentStatus {
  payment_id: string;
  payment_status:
    | "waiting"
    | "confirming"
    | "confirmed"
    | "sending"
    | "partially_paid"
    | "finished"
    | "failed"
    | "refunded"
    | "expired";
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id?: string;
  order_description?: string;
  ipn_callback_url?: string;
  created_at: string;
  updated_at: string;
  purchase_id: string;
  outcome_amount?: number;
  outcome_currency?: string;
}

interface NOWPaymentsIPNPayload {
  payment_id: string;
  invoice_id?: string;
  subscription_id?: number;
  subscription_plan_id?: number;
  payment_status:
    | "waiting"
    | "confirming"
    | "confirmed"
    | "sending"
    | "partially_paid"
    | "finished"
    | "failed"
    | "refunded"
    | "expired";
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  actually_paid: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  purchase_id: string;
  outcome_amount: number;
  outcome_currency: string;
  created_at: string;
  updated_at: string;
}

export class NOWPaymentsProvider implements PaymentProvider {
  name = "nowpayments";
  private apiKey: string;
  private ipnSecret: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = paymentEnv.NOWPAYMENTS_API_KEY;
    this.ipnSecret = paymentEnv.NOWPAYMENTS_IPN_SECRET;
    this.apiUrl = paymentEnv.NOWPAYMENTS_API_URL;
  }

  /**
   * Get authentication headers for NOWPayments API
   * Uses x-api-key header for authentication
   */
  private getAuthHeaders(): Record<string, string> {
    return {
      "x-api-key": this.apiKey,
    };
  }

  /**
   * Ensures customer exists in the system
   * NOWPayments doesn't have a customer concept, so we use userId
   */
  async ensureCustomer(
    userId: string,
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Required by PaymentProvider interface
    _name: string | null,
    logger: EndpointLogger,
  ): Promise<ResponseType<CustomerResult>> {
    try {
      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return fail({
          message:
            "app.api.payment.providers.nowpayments.errors.userNotFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
        });
      }

      logger.debug("NOWPayments: Using userId as customer identifier", {
        userId,
        email,
      });

      return success<CustomerResult>({
        customerId: userId,
      });
    } catch (error) {
      logger.error("Failed to ensure NOWPayments customer", {
        error: parseError(error),
        userId,
      });
      return fail({
        message:
          "app.api.payment.providers.nowpayments.errors.customerCreationFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message, userId },
      });
    }
  }

  /**
   * Creates a checkout session for crypto payment or subscription
   * Compatible with Stripe's interface but uses NOWPayments invoices/subscriptions
   */
  async createCheckoutSession(
    params: CheckoutSessionParams,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Required by PaymentProvider interface
    _customerId: string,
    logger: EndpointLogger,
    callbackToken: string,
  ): Promise<ResponseType<CheckoutSessionResult>> {
    try {
      logger.debug("Creating NOWPayments checkout session", {
        productId: params.productId,
        interval: params.interval,
        country: params.country,
        userId: params.userId,
      });

      // Get product pricing
      const product = productsRepository.getProduct(
        params.productId,
        params.locale,
        params.interval,
      );

      if (!product) {
        return fail({
          message:
            "app.api.payment.providers.nowpayments.errors.productNotFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { productId: params.productId },
        });
      }

      // Get user email for subscriptions
      const [user] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, params.userId))
        .limit(1);

      if (!user?.email) {
        return fail({
          message:
            "app.api.payment.providers.nowpayments.errors.userEmailRequired.title",
          errorType: ErrorResponseTypes.BAD_REQUEST,
          messageParams: { userId: params.userId },
        });
      }

      // Handle recurring subscriptions
      if (params.interval === "month" || params.interval === "year") {
        return this.createSubscriptionCheckout(
          params,
          product,
          user.email,
          logger,
        );
      }

      // Handle one-time payments
      return this.createOneTimeCheckout(params, product, logger, callbackToken);
    } catch (error) {
      logger.error("Failed to create NOWPayments checkout session", {
        error: parseError(error),
        userId: params.userId,
      });
      return fail({
        message:
          "app.api.payment.providers.nowpayments.errors.checkoutCreationFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Creates a one-time payment invoice
   */
  private async createOneTimeCheckout(
    params: CheckoutSessionParams,
    product: Product,
    logger: EndpointLogger,
    callbackToken: string,
  ): Promise<ResponseType<CheckoutSessionResult>> {
    // Get quantity from metadata (defaults to 1 if not provided)
    const quantity = parseInt(params.metadata.quantity || "1", 10);
    const totalAmount = product.price * quantity;
    const totalCredits = product.credits * quantity;

    const invoiceData = {
      price_amount: totalAmount,
      price_currency: product.currency,
      order_id: `${params.userId}_${Date.now()}`,
      order_description: `${params.productId} - ${totalCredits} credits`,
      ipn_callback_url: `${env.NEXT_PUBLIC_APP_URL}/api/${params.locale}/payment/providers/nowpayments/webhook`,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      is_fee_paid_by_user: true,
    };

    logger.info("Creating NOWPayments invoice with data", {
      invoiceData,
      apiUrl: this.apiUrl,
    });

    const response = await fetch(`${this.apiUrl}/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Parse error response
      let errorDetails: { code?: string; message?: string } = {};
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        // If parsing fails, use raw error text
        errorDetails = { message: errorText };
      }

      logger.error("NOWPayments API error", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        errorCode: errorDetails.code,
        errorMessage: errorDetails.message,
      });

      // Provide specific error messages for common issues
      if (errorDetails.code === "INVALID_API_KEY" || response.status === 403) {
        return fail({
          message:
            "app.api.payment.providers.nowpayments.errors.invalidApiKey.title",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: {
            error:
              "Invalid NOWPayments API key. Please check your NOWPAYMENTS_API_KEY environment variable and ensure it's valid. Visit https://nowpayments.io/app/dashboard to get your API key.",
          },
        });
      }
      return fail({
        message:
          "app.api.payment.providers.nowpayments.errors.invoiceCreationFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: errorText },
      });
    }

    const invoice: NOWPaymentsInvoiceResponse = await response.json();

    logger.debug("Created NOWPayments invoice - FULL RESPONSE");

    // Store invoice in database with callback token
    if (callbackToken) {
      try {
        await db.insert(paymentInvoices).values({
          userId: params.userId,
          providerInvoiceId: invoice.id,
          amount: totalAmount.toFixed(2),
          currency: product.currency,
          status: InvoiceStatus.DRAFT,
          invoiceUrl: invoice.invoice_url,
          callbackToken,
          metadata: params.metadata,
        });

        logger.debug("Stored invoice in database", {
          invoiceId: invoice.id,
          userId: params.userId,
          callbackToken: callbackToken.substring(0, 8),
        });
      } catch (dbError) {
        logger.error("Failed to store invoice in database", {
          error: parseError(dbError),
          invoiceId: invoice.id,
        });
        // Continue anyway - webhook can still process the payment
      }
    }

    return success<CheckoutSessionResult>({
      sessionId: invoice.id,
      checkoutUrl: invoice.invoice_url,
      providerPriceId: invoice.price_amount,
      providerProductId: params.productId,
    });
  }

  /**
   * Creates a recurring subscription plan and email subscription
   */
  private async createSubscriptionCheckout(
    params: CheckoutSessionParams,
    product: Product,
    email: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CheckoutSessionResult>> {
    // Convert interval to days
    const intervalDays = params.interval === "month" ? 30 : 365;

    // Step 1: Create or get subscription plan
    const planData = {
      title: `${params.productId}_${params.interval}`,
      interval_day: intervalDays,
      amount: product.price,
      currency: product.currency.toLowerCase(),
      ipn_callback_url: `${env.NEXT_PUBLIC_APP_URL}/api/${params.locale}/payment/providers/nowpayments/webhook`,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    };

    // Create subscription plan
    let planResponse: Response;
    try {
      logger.debug("Creating NOWPayments subscription plan", {
        url: `${this.apiUrl}/subscriptions/plans`,
        planData,
      });

      planResponse = await fetch(`${this.apiUrl}/subscriptions/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(planData),
      });
    } catch (fetchError) {
      logger.error("NOWPayments plan creation fetch error", {
        error: parseError(fetchError),
      });
      return fail({
        message:
          "app.api.payment.providers.nowpayments.errors.planCreationFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(fetchError).message },
      });
    }

    if (!planResponse.ok) {
      const errorText = await planResponse.text();
      logger.error("NOWPayments plan creation error - FULL DETAILS", {
        status: planResponse.status,
        statusText: planResponse.statusText,
        errorText: errorText,
        requestUrl: `${this.apiUrl}/subscriptions/plans`,
        requestBody: JSON.stringify(planData),
        headers: { "x-api-key": `${this.apiKey.substring(0, 10)}...` },
      });
      return fail({
        message:
          "app.api.payment.providers.nowpayments.errors.planCreationFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: errorText },
      });
    }

    const plan: NOWPaymentsSubscriptionPlan = await planResponse.json();

    logger.debug("Created NOWPayments subscription plan", {
      planId: plan.id,
      intervalDays,
      amount: plan.amount,
    });

    // Step 2: Create email subscription
    const subscriptionData = {
      subscription_plan_id: plan.id,
      email,
    };

    const subResponse = await fetch(`${this.apiUrl}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(subscriptionData),
    });

    if (!subResponse.ok) {
      const errorText = await subResponse.text();
      logger.error("NOWPayments subscription creation error", {
        status: subResponse.status,
        error: errorText,
      });
      return fail({
        message:
          "app.api.payment.providers.nowpayments.errors.subscriptionCreationFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: errorText },
      });
    }

    const subscription: NOWPaymentsSubscription = await subResponse.json();

    logger.debug("Created NOWPayments email subscription", {
      subscriptionId: subscription.id,
      planId: plan.id,
      email,
      status: subscription.status,
    });

    // Return the subscription ID as session ID
    // The user will receive payment links via email
    return success<CheckoutSessionResult>({
      sessionId: subscription.id.toString(),
      checkoutUrl: params.successUrl, // User receives link via email
      providerPriceId: plan.id.toString(),
      providerProductId: params.productId,
    });
  }

  /**
   * Verifies webhook signature using HMAC-SHA512
   * NOWPayments uses x-nowpayments-sig header for signature verification
   */
  async verifyWebhook(
    body: string,
    signature: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<WebhookEvent>> {
    try {
      logger.debug("Verifying NOWPayments webhook signature");

      // Calculate HMAC-SHA512 signature
      const hmac = createHmac("sha512", this.ipnSecret);
      hmac.update(body);
      const calculatedSignature = hmac.digest("hex");

      // Compare signatures (constant-time comparison to prevent timing attacks)
      if (
        !this.constantTimeCompare(
          signature.toLowerCase(),
          calculatedSignature.toLowerCase(),
        )
      ) {
        logger.error("NOWPayments webhook signature verification failed", {
          receivedSignature: `${signature.substring(0, 10)}...`,
          calculatedSignature: `${calculatedSignature.substring(0, 10)}...`,
        });
        return fail({
          message:
            "app.api.payment.providers.nowpayments.errors.webhookVerificationFailed.title",
          errorType: ErrorResponseTypes.BAD_REQUEST,
          messageParams: { error: "Invalid signature" },
        });
      }

      // Parse the webhook payload
      const payload: NOWPaymentsIPNPayload = JSON.parse(body);

      logger.debug("NOWPayments webhook verified", {
        paymentId: payload.payment_id,
        paymentStatus: payload.payment_status,
        orderId: payload.order_id,
        subscriptionId: payload.subscription_id,
      });

      // Map NOWPayments status to generic event type
      const eventType = this.mapPaymentStatusToEventType(
        payload.payment_status,
        !!payload.subscription_id,
      );

      // Determine payment type from metadata or subscription presence
      const paymentType = payload.subscription_id
        ? "subscription"
        : "credit_pack";

      // Retrieve stored invoice metadata from database
      let storedMetadata: Record<string, string> = {};
      if (payload.invoice_id) {
        try {
          const [invoice] = await db
            .select()
            .from(paymentInvoices)
            .where(eq(paymentInvoices.providerInvoiceId, payload.invoice_id))
            .limit(1);

          if (invoice?.metadata && typeof invoice.metadata === "object") {
            storedMetadata = Object.fromEntries(
              Object.entries(invoice.metadata).map(([k, v]) => [k, String(v)]),
            );
            logger.debug("Retrieved stored invoice metadata", {
              invoiceId: payload.invoice_id,
              metadata: storedMetadata,
            });
          }
        } catch (dbError) {
          logger.error("Failed to retrieve invoice metadata", {
            error: parseError(dbError),
            invoiceId: payload.invoice_id,
          });
          // Continue without stored metadata
        }
      }

      // Merge webhook payload metadata with stored metadata
      const mergedMetadata = {
        ...storedMetadata, // Stored metadata (includes quantity, totalCredits, etc.)
        userId: payload.order_id.split("_")[0], // Extract userId from order_id
        orderId: payload.order_id,
        paymentId: payload.payment_id,
        subscriptionId: payload.subscription_id?.toString(),
        subscriptionPlanId: payload.subscription_plan_id?.toString(),
        type: paymentType,
      };

      // Return standardized webhook event
      return success<WebhookEvent>({
        id: payload.payment_id,
        type: eventType,
        data: {
          id: payload.invoice_id || payload.payment_id,
          metadata: mergedMetadata,
          customer: payload.order_id.split("_")[0],
          amount_total: Math.round(payload.price_amount * 100), // Convert to cents
        },
      });
    } catch (error) {
      logger.error("Failed to verify NOWPayments webhook", {
        error: parseError(error),
      });
      return fail({
        message:
          "app.api.payment.providers.nowpayments.errors.webhookVerificationFailed.title",
        errorType: ErrorResponseTypes.BAD_REQUEST,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Retrieves subscription information from NOWPayments
   */
  async retrieveSubscription(
    subscriptionId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      userId: string;
      currentPeriodStart?: number;
      currentPeriodEnd?: number;
    }>
  > {
    try {
      const response = await fetch(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          method: "GET",
          headers: {
            ...this.getAuthHeaders(),
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("NOWPayments subscription retrieval error", {
          status: response.status,
          error: errorText,
          subscriptionId,
        });
        return fail({
          message:
            "app.api.payment.providers.nowpayments.errors.subscriptionRetrievalFailed.title",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: { error: errorText },
        });
      }

      const subscription: NOWPaymentsSubscription = await response.json();

      // Get the subscription plan to determine billing interval
      const planResponse = await fetch(
        `${this.apiUrl}/subscriptions/plans/${subscription.subscription_plan_id}`,
        {
          method: "GET",
          headers: {
            ...this.getAuthHeaders(),
          },
        },
      );

      if (!planResponse.ok) {
        logger.warn("Could not retrieve subscription plan", {
          planId: subscription.subscription_plan_id,
        });
      }

      const plan: NOWPaymentsSubscriptionPlan | null = planResponse.ok
        ? await planResponse.json()
        : null;

      // Calculate period dates
      const createdAt = new Date(subscription.created_at).getTime();
      const intervalMs = plan
        ? plan.interval_day * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;
      const currentPeriodStart = createdAt;
      const currentPeriodEnd = subscription.next_payment_date
        ? new Date(subscription.next_payment_date).getTime()
        : createdAt + intervalMs;

      logger.debug("Retrieved NOWPayments subscription", {
        subscriptionId,
        status: subscription.status,
        isActive: subscription.is_active,
        currentPeriodStart,
        currentPeriodEnd,
      });

      // Extract userId from email or metadata (depends on implementation)
      // For now, we'll need to look up in our database
      const userId = ""; // This needs to be populated from DB lookup

      return success({
        userId,
        currentPeriodStart,
        currentPeriodEnd,
      });
    } catch (error) {
      logger.error("Failed to retrieve NOWPayments subscription", {
        error: parseError(error),
        subscriptionId,
      });
      return fail({
        message:
          "app.api.payment.providers.nowpayments.errors.subscriptionRetrievalFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Cancels a NOWPayments subscription (deletes recurring payment)
   */
  async cancelSubscription(
    subscriptionId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      const response = await fetch(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          method: "DELETE",
          headers: {
            ...this.getAuthHeaders(),
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("NOWPayments subscription cancellation error", {
          status: response.status,
          error: errorText,
          subscriptionId,
        });
        return fail({
          message:
            "app.api.payment.providers.nowpayments.errors.subscriptionCancellationFailed.title",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: { error: errorText },
        });
      }

      logger.info("Canceled NOWPayments subscription", { subscriptionId });

      return success(undefined);
    } catch (error) {
      logger.error("Failed to cancel NOWPayments subscription", {
        error: parseError(error),
        subscriptionId,
      });
      return fail({
        message:
          "app.api.payment.providers.nowpayments.errors.subscriptionCancellationFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   */
  private constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  /**
   * Maps NOWPayments payment status to generic event types
   */
  private mapPaymentStatusToEventType(
    status: NOWPaymentsIPNPayload["payment_status"],
    isSubscription: boolean,
  ): string {
    const statusMap: Record<string, string> = {
      waiting: "payment_intent.created",
      confirming: "payment_intent.processing",
      confirmed: "payment_intent.processing",
      sending: "payment_intent.processing",
      finished: isSubscription
        ? "invoice.payment_succeeded"
        : "checkout.session.completed",
      partially_paid: "payment_intent.processing",
      failed: "payment_intent.payment_failed",
      refunded: "charge.refunded",
      expired: "payment_intent.canceled",
    };

    return statusMap[status] || "payment_intent.created";
  }

  /**
   * Get payment status from NOWPayments API
   * Useful for manual status checks
   */
  async getPaymentStatus(
    paymentId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<NOWPaymentsPaymentStatus>> {
    try {
      const response = await fetch(`${this.apiUrl}/payment/${paymentId}`, {
        method: "GET",
        headers: {
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("NOWPayments API error", {
          status: response.status,
          error: errorText,
        });
        return fail({
          message:
            "app.api.payment.providers.nowpayments.errors.paymentStatusFailed.title",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: { error: errorText },
        });
      }

      const paymentStatus: NOWPaymentsPaymentStatus = await response.json();

      logger.debug("Retrieved NOWPayments payment status", {
        paymentId,
        status: paymentStatus.payment_status,
      });

      return success(paymentStatus);
    } catch (error) {
      logger.error("Failed to get NOWPayments payment status", {
        error: parseError(error),
        paymentId,
      });
      return fail({
        message:
          "app.api.payment.providers.nowpayments.errors.paymentStatusFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Lists all subscriptions (recurring payments) for monitoring
   */
  async listSubscriptions(
    filters: {
      status?: "PAID" | "UNPAID" | "ACTIVE" | "INACTIVE" | "CANCELLED";
      subscription_plan_id?: number;
      is_active?: boolean;
      limit?: number;
      offset?: number;
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<NOWPaymentsSubscription[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) {
        queryParams.append("status", filters.status);
      }
      if (filters.subscription_plan_id) {
        queryParams.append(
          "subscription_plan_id",
          filters.subscription_plan_id.toString(),
        );
      }
      if (filters.is_active !== undefined) {
        queryParams.append("is_active", filters.is_active.toString());
      }
      if (filters.limit) {
        queryParams.append("limit", filters.limit.toString());
      }
      if (filters.offset) {
        queryParams.append("offset", filters.offset.toString());
      }

      const response = await fetch(
        `${this.apiUrl}/subscriptions?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            ...this.getAuthHeaders(),
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("NOWPayments subscriptions list error", {
          status: response.status,
          error: errorText,
        });
        return fail({
          message:
            "app.api.payment.providers.nowpayments.errors.subscriptionListFailed.title",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: { error: errorText },
        });
      }

      const subscriptions: NOWPaymentsSubscription[] = await response.json();

      logger.debug("Listed NOWPayments subscriptions", {
        count: subscriptions.length,
        filters,
      });

      return success(subscriptions);
    } catch (error) {
      logger.error("Failed to list NOWPayments subscriptions", {
        error: parseError(error),
      });
      return fail({
        message:
          "app.api.payment.providers.nowpayments.errors.subscriptionListFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
