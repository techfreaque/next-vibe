/**
 * NOWPayments Webhook Route
 * Handles NOWPayments IPN (Instant Payment Notification) webhook events
 */

import "server-only";

import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseError } from "next-vibe/shared/utils";
import { Environment } from "next-vibe/shared/utils/env-util";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";

import { paymentRepository } from "../../../repository";

// Constants
const ERROR_MISSING_SIGNATURE = "Missing signature";
const ERROR_WEBHOOK_PROCESSING_FAILED = "Webhook processing failed";
const ERROR_INTERNAL_SERVER = "Internal server error";
const ERROR_METHOD_NOT_ALLOWED = "Method not allowed";

/**
 * POST handler for NOWPayments webhooks
 * Processes incoming IPN webhook events from NOWPayments
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const logger = createEndpointLogger(
    env.NODE_ENV === Environment.DEVELOPMENT,
    Date.now(),
    "en-GLOBAL", // Webhooks don't have locale context - use default global locale
  );

  try {
    logger.debug("payment.webhook.nowpayments.received");

    // Get the raw body
    const body = await request.text();

    // Get the NOWPayments signature from headers
    const headersList = await headers();
    const signature = headersList.get("x-nowpayments-sig");

    if (!signature) {
      logger.error("payment.webhook.nowpayments.signature.missing");
      return NextResponse.json(
        { error: ERROR_MISSING_SIGNATURE },
        { status: 400 },
      );
    }

    // Process the webhook using the payment repository
    const result = await paymentRepository.handleWebhook(
      body,
      signature,
      logger,
      "nowpayments", // Specify provider
    );

    if (!result.success) {
      logger.error("payment.webhook.nowpayments.processing.failed", {
        message: result.message,
      });
      return NextResponse.json(
        { error: ERROR_WEBHOOK_PROCESSING_FAILED },
        { status: 400 },
      );
    }

    logger.debug("payment.webhook.nowpayments.processed.success");
    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("payment.webhook.nowpayments.handler.error", parseError(error));
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
