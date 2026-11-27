// oxlint-disable boilerplate/route-pattern -- Whop webhook uses raw Response handlers, cannot use endpointsHandler
/**
 * Whop Webhook Route
 * POST /api/[locale]/payment/providers/whop/webhook
 * Standard Webhooks headers (webhook-id, webhook-timestamp,
 * webhook-signature); verified and mapped by WhopProvider.verifyWebhook.
 */

import "server-only";

import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import { Environment } from "next-vibe/env/env-util";
import { createEndpointLogger } from "next-vibe/logger/server";
import { headers } from "next-vibe/ui/lib/headers";
import type { NextRequest } from "next-vibe/ui/lib/request";
import { NextResponse } from "next-vibe/ui/lib/request";

import { PaymentProvider } from "../../../enum";
import { PaymentRepository } from "../../../repository";
import { encodeWhopSignatureHeaders } from "../signature";

// Constants
const ERROR_MISSING_SIGNATURE = "Missing signature";
const ERROR_WEBHOOK_PROCESSING_FAILED = "Webhook processing failed";
const ERROR_INTERNAL_SERVER = "Internal server error";
const ERROR_METHOD_NOT_ALLOWED = "Method not allowed";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ locale: CountryLanguage }> },
): Promise<NextResponse> {
  const { locale } = await context.params;
  const logger = createEndpointLogger(
    coreEnv.NODE_ENV === Environment.DEVELOPMENT,
    locale,
  );

  try {
    logger.debug("payment.webhook.whop.received");

    const body = await request.text();
    const headersList = await headers();
    const id = headersList.get("webhook-id");
    const timestamp = headersList.get("webhook-timestamp");
    const signature = headersList.get("webhook-signature");

    if (!id || !timestamp || !signature) {
      logger.error("payment.webhook.whop.signature.missing", {
        hasId: Boolean(id),
        hasTimestamp: Boolean(timestamp),
        hasSignature: Boolean(signature),
      });
      return NextResponse.json(
        { error: ERROR_MISSING_SIGNATURE },
        { status: 400 },
      );
    }

    const result = await PaymentRepository.handleWebhook(
      body,
      encodeWhopSignatureHeaders({ id, timestamp, signature }),
      locale,
      logger,
      PaymentProvider.WHOP,
    );

    if (!result.success) {
      logger.error("payment.webhook.whop.processing.failed", {
        message: result.message,
      });
      return NextResponse.json(
        { error: ERROR_WEBHOOK_PROCESSING_FAILED },
        { status: 400 },
      );
    }

    logger.debug("payment.webhook.whop.processed.success");
    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("payment.webhook.whop.handler.error", parseError(error));
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
