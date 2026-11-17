/**
 * Stripe Prices Ensure - Repository
 * Pre-creates (or, with dryRun, only lists) every Stripe price the shop sells,
 * resolved by lookup key. Safe to run any number of times.
 * Server-only.
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { paymentEnv } from "../env";
import { stripePriceManager } from "../providers/stripe/prices";
import type {
  StripePricesEnsureRequestOutput,
  StripePricesEnsureResponseOutput,
} from "./definition";
import type { StripePricesT } from "./i18n";

export class StripePricesRepository {
  static async ensure(
    data: StripePricesEnsureRequestOutput,
    logger: EndpointLogger,
    t: StripePricesT,
  ): Promise<ResponseType<StripePricesEnsureResponseOutput>> {
    const key = paymentEnv.STRIPE_SECRET_KEY ?? "";
    if (!key) {
      return fail({
        message: t("errors.notConfigured"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const dryRun = data.dryRun ?? true;
    const result = await stripePriceManager.ensureAllPrices(logger, {
      create: !dryRun,
    });
    if (!result.success) {
      return result;
    }
    const prices = result.data.map((row) => ({
      lookupKey: row.lookupKey,
      priceId: row.priceId,
      productId: row.productId,
      amount: `${(row.unitAmount / 100).toFixed(2)} ${row.currency.toUpperCase()}`,
      status: row.status,
    }));
    return success({
      dryRunApplied: dryRun,
      stripeMode:
        key.startsWith("sk_live") || key.startsWith("rk_live")
          ? "live"
          : "test",
      existing: prices.filter((p) => p.status === "existing").length,
      created: prices.filter((p) => p.status === "created").length,
      missing: prices.filter((p) => p.status === "missing").length,
      prices,
    });
  }
}
