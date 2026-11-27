/**
 * Live NOWPayments crypto floor: the lowest per-coin minimum (USD, fee paid
 * by the buyer) across NOWPAYMENTS_FLOOR_COIN_CODES that are enabled in the
 * Partner Profile.
 *
 * Read from `GET /merchant/coins` and `GET /min-amount` per probed coin.
 * Cached for CACHE_TTL_MS; a stale cache is served at once and refreshed in
 * the background, so a page read never waits on NOWPayments more than once per
 * process. Fail-open: unknown returns null and callers fall back to
 * CRYPTO_FALLBACK_MIN_USD.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import type { ProductIds } from "../../../products/repository-client";
import {
  cryptoAmountUsd,
  cryptoMinimumUsd,
  NOWPAYMENTS_FLOOR_COIN_CODES,
} from "../../checkout/crypto-coins";
import { scopedTranslation as checkoutScopedTranslation } from "../../checkout/i18n";
import { paymentEnv } from "../../env";
import type { PaymentInterval } from "../types";

const CACHE_TTL_MS = 30 * 60 * 1000;
/** Retry an empty/failed read sooner than a good one. */
const FAILURE_TTL_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 4000;
const MIN_AMOUNT_CONCURRENCY = 3;
/** Longest a cold read may hold a request before it answers "unknown". */
const COLD_WAIT_MS = 3000;

interface MinimumCache {
  /** Lowest coin minimum in USD, null while unknown. */
  lowestMinUsd: number | null;
  at: number;
}

let cache: MinimumCache | null = null;
let inFlight: Promise<number | null> | null = null;

/** Drops the cache, or seeds it with a fixed lowest minimum (tests). */
export function resetCryptoMinimumCache(lowestMinUsd?: number | null): void {
  cache = lowestMinUsd === undefined ? null : { lowestMinUsd, at: Date.now() };
  inFlight = null;
}

const merchantCoinsSchema = z.object({
  selectedCurrencies: z.array(z.string()).optional(),
});
const minAmountSchema = z.object({ fiat_equivalent: z.number().positive() });

async function getJson<TSchema extends z.ZodType>(
  path: string,
  schema: TSchema,
): Promise<z.output<TSchema> | null> {
  // oxlint-disable-next-line restricted/no-raw-fetch -- external API
  const response = await fetch(`${paymentEnv.NOWPAYMENTS_API_URL}${path}`, {
    headers: { "x-api-key": paymentEnv.NOWPAYMENTS_API_KEY ?? "" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    return null;
  }
  const parsed = schema.safeParse(await response.json());
  return parsed.success ? parsed.data : null;
}

async function fetchLowestMinimum(
  logger: EndpointLogger,
): Promise<number | null> {
  try {
    const merchant = await getJson("/merchant/coins", merchantCoinsSchema);
    const selected = merchant?.selectedCurrencies;
    // Unknown selection: probe every listed coin, NOWPayments still checks.
    const enabled = selected
      ? new Set(selected.map((code) => code.toLowerCase()))
      : null;
    const codes = NOWPAYMENTS_FLOOR_COIN_CODES.filter(
      (code) => !enabled || enabled.has(code),
    );
    // A few at a time: NOWPayments rate-limits bursts (429).
    const minimums: number[] = [];
    for (let i = 0; i < codes.length; i += MIN_AMOUNT_CONCURRENCY) {
      const batch = codes.slice(i, i + MIN_AMOUNT_CONCURRENCY);
      const results = await Promise.all(
        batch.map((code) =>
          getJson(
            `/min-amount?currency_from=${code}&currency_to=${code}&fiat_equivalent=usd&is_fee_paid_by_user=true`,
            minAmountSchema,
          ).catch(() => null),
        ),
      );
      for (const data of results) {
        if (data) {
          minimums.push(data.fiat_equivalent);
        }
      }
    }
    if (minimums.length === 0) {
      logger.warn("NOWPayments returned no coin minimums", {
        merchantCoinsRead: merchant !== null,
        probedCoins: codes.length,
      });
      return null;
    }
    return Math.min(...minimums);
  } catch (error) {
    logger.warn("NOWPayments coin minimums read failed", {
      error: parseError(error).message,
    });
    return null;
  }
}

function refresh(logger: EndpointLogger): Promise<number | null> {
  if (!inFlight) {
    inFlight = fetchLowestMinimum(logger)
      .then((lowestMinUsd) => {
        cache = { lowestMinUsd, at: Date.now() };
        return lowestMinUsd;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

/**
 * Lowest coin minimum in USD, null while unknown. `wait` makes a cold read
 * wait for the API (checkout guard); page reads pass false and take whatever
 * is cached within COLD_WAIT_MS.
 */
export async function getLowestCryptoMinimumUsd(
  logger: EndpointLogger,
  { wait }: { wait: boolean },
): Promise<number | null> {
  const configured = Boolean(paymentEnv.NOWPAYMENTS_API_KEY);
  if (cache) {
    const ttl = cache.lowestMinUsd === null ? FAILURE_TTL_MS : CACHE_TTL_MS;
    if (configured && Date.now() - cache.at >= ttl) {
      void refresh(logger);
    }
    return cache.lowestMinUsd;
  }
  if (!configured) {
    return null;
  }
  const pending = refresh(logger);
  if (wait) {
    return pending;
  }
  return Promise.race([
    pending,
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), COLD_WAIT_MS);
    }),
  ]);
}

/**
 * Crypto floor (USD, headroom included) for the buy dialogs: the same value
 * the checkout guard compares against.
 */
export async function getCryptoMinimumUsd(
  logger: EndpointLogger,
): Promise<number> {
  return cryptoMinimumUsd(
    await getLowestCryptoMinimumUsd(logger, { wait: false }),
  );
}

/**
 * Checks a crypto checkout before an invoice is created. The buyer picks the
 * coin on the NOWPayments page (coins below their own minimum are refused
 * there), so this only fails (400) when the amount is below what every coin
 * accepts.
 */
export async function checkCryptoAmount(
  params: {
    productId: ProductIds;
    interval: PaymentInterval;
    quantity: number;
  },
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<void>> {
  // With fiat on, the hosted page also takes cards: no coin floor applies.
  if (paymentEnv.NOWPAYMENTS_FIAT_ENABLED === "true") {
    return success();
  }
  const { t } = checkoutScopedTranslation.scopedT(locale);
  const amountUsd = cryptoAmountUsd(
    params.productId,
    params.interval,
    params.quantity,
  );
  const lowestMinUsd = await getLowestCryptoMinimumUsd(logger, { wait: true });
  const floorUsd = cryptoMinimumUsd(lowestMinUsd);
  if (amountUsd < floorUsd) {
    logger.info("Crypto checkout refused: below every coin minimum", {
      amountUsd,
      floorUsd,
      minimumsKnown: lowestMinUsd !== null,
    });
    return fail({
      message: t("availability.cryptoAmountBelowMinimum"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }
  return success();
}
