// oxlint-disable oxlint-plugin-boilerplate/route-pattern -- Stripe webhook uses raw NextResponse handlers, cannot use endpointsHandler
/**
 * Payment Webhook Route
 * Handles Stripe webhook events for payment processing
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import { Environment } from "next-vibe/env/env-util";
import { createEndpointLogger } from "next-vibe/logger/server";
import { headers } from "next-vibe/ui/lib/headers";
import type { NextRequest } from "next-vibe/ui/lib/request";
import { NextResponse } from "next-vibe/ui/lib/request";

import { env } from "@/config/env";

import { PaymentRepository } from "../../../repository";

// Constants
const ERROR_MISSING_SIGNATURE = "Missing signature";
const ERROR_WEBHOOK_PROCESSING_FAILED = "Webhook processing failed";
const ERROR_INTERNAL_SERVER = "Internal server error";
const ERROR_METHOD_NOT_ALLOWED = "Method not allowed";

/**
 * POST handler for Stripe webhooks
 * Processes incoming webhook events from Stripe
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ locale: CountryLanguage }> },
): Promise<NextResponse> {
  const { locale } = await context.params;
  const logger = createEndpointLogger(
    env.NODE_ENV === Environment.DEVELOPMENT,
    locale,
  );

  try {
    logger.debug("payment.webhook.stripe.received");

    // Get the raw body
    const body = await request.text();

    // Get the Stripe signature from headers
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      logger.error("payment.webhook.stripe.signature.missing");
      return NextResponse.json(
        { error: ERROR_MISSING_SIGNATURE },
        { status: 400 },
      );
    }

    // Process the webhook
    const result = await PaymentRepository.handleWebhook(
      body,
      signature,
      locale,
      logger,
    );

    if (!result.success) {
      logger.error("payment.webhook.stripe.processing.failed", {
        message: result.message,
      });
      return NextResponse.json(
        { error: ERROR_WEBHOOK_PROCESSING_FAILED },
        { status: 400 },
      );
    }

    logger.debug("payment.webhook.stripe.processed.success");
    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("payment.webhook.stripe.handler.error", parseError(error));
    return NextResponse.json({ error: ERROR_INTERNAL_SERVER }, { status: 500 });
  }
}

/**
 * GET handler - not allowed for webhooks
 */
export function GET(): NextResponse {
  return NextResponse.json(
    { error: ERROR_METHOD_NOT_ALLOWED },
    { status: 405 },
  );
}
