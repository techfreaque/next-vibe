/**
 * NOWPayments Provider Implementation
 * Crypto payment provider for Bitcoin, Ethereum, etc.
 */

import "server-only";

import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

import type {
  CheckoutSessionParams,
  CheckoutSessionResult,
  CustomerResult,
  PaymentProvider,
  WebhookEvent,
} from "../types";

export class NOWPaymentsProvider implements PaymentProvider {
  name = "nowpayments";
  private apiKey: string;
  private apiUrl = "https://api.nowpayments.io/v1";

  constructor() {
    // TODO: Add NOWPAYMENTS_API_KEY to env config
    this.apiKey = "";
  }

  async ensureCustomer(
    userId: string,
    email: string,
    name: string | null,
    logger: EndpointLogger,
  ): Promise<ResponseType<CustomerResult>> {
    // NOWPayments doesn't have customer concept - use userId as identifier
    logger.debug("NOWPayments: Using userId as customer identifier", {
      userId,
      email,
    });

    return createSuccessResponse({
      customerId: userId,
    });
  }

  async createCheckoutSession(
    params: CheckoutSessionParams,
    customerId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CheckoutSessionResult>> {
    try {
      logger.debug("Creating NOWPayments checkout session", {
        userId: params.userId,
      });

      // TODO: Implement NOWPayments checkout session creation
      // 1. Get product price from params
      // 2. Create payment via NOWPayments API
      // 3. Return checkout URL

      return createErrorResponse(
        "app.api.v1.core.payment.errors.notImplemented.title",
        ErrorResponseTypes.BAD_REQUEST,
        {
          error: "NOWPayments provider not yet implemented",
        },
      );
    } catch (error) {
      logger.error("Failed to create NOWPayments checkout session", {
        error: parseError(error),
      });
      return createErrorResponse(
        "app.api.v1.core.payment.errors.server.title",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  async verifyWebhook(
    body: string,
    signature: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<WebhookEvent>> {
    try {
      logger.debug("Verifying NOWPayments webhook");

      // TODO: Implement NOWPayments webhook verification
      // 1. Verify signature using NOWPAYMENTS_IPN_SECRET
      // 2. Parse webhook payload
      // 3. Return standardized webhook event

      return createErrorResponse(
        "app.api.v1.core.payment.errors.notImplemented.title",
        ErrorResponseTypes.BAD_REQUEST,
        {
          error: "NOWPayments webhook verification not yet implemented",
        },
      );
    } catch (error) {
      logger.error("Failed to verify NOWPayments webhook", {
        error: parseError(error),
      });
      return createErrorResponse(
        "app.api.v1.core.payment.errors.server.title",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  async retrieveSubscription(
    subscriptionId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ userId: string; currentPeriodEnd?: number }>> {
    // NOWPayments doesn't support subscriptions - only one-time payments
    logger.error("NOWPayments does not support subscriptions", {
      subscriptionId,
    });

    return createErrorResponse(
      "app.api.v1.core.payment.errors.notImplemented.title",
      ErrorResponseTypes.BAD_REQUEST,
      {
        error: "NOWPayments only supports one-time crypto payments",
      },
    );
  }

  async cancelSubscription(
    subscriptionId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // NOWPayments doesn't support subscriptions
    logger.error("NOWPayments does not support subscriptions", {
      subscriptionId,
    });

    return createErrorResponse(
      "app.api.v1.core.payment.errors.notImplemented.title",
      ErrorResponseTypes.BAD_REQUEST,
      {
        error: "NOWPayments only supports one-time crypto payments",
      },
    );
  }
}

