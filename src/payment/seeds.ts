/**
 * Payment Seeds
 * Production: replays referral commissions of renewals paid before renewals
 * were recorded (renewal/backfill.ts). Idempotent, a no-op once done.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

export async function prod(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  try {
    const { backfillReferredRenewalCommissions } =
      await import("./renewal/backfill");
    const result = await backfillReferredRenewalCommissions(logger, locale);
    if (result.replayed > 0) {
      logger.info("Payment seeds: missed renewal commissions booked", {
        replayed: result.replayed,
        confirmed: result.confirmed,
      });
    }
  } catch (error) {
    logger.error("Payment production seeds failed", parseError(error));
  }
}

// After users (100) and subscriptions (45): replays need both
export const priority = 10;
