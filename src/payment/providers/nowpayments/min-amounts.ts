/**
 * Live NOWPayments per-coin minimums (USD, fee paid by the buyer).
 *
 * Read from `GET /merchant/coins` (coins enabled in the Partner Profile) and
 * `GET /min-amount` per offered coin. Cached for CACHE_TTL_MS; a stale cache
 * is served at once and refreshed in the background, so a page read never
 * waits on NOWPayments more than once per process. Fail-open: unknown
 * minimums return null and callers fall back to CRYPTO_FALLBACK_MIN_USD.
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
  CryptoCoinDB,
  type CryptoCoinMinimum,
  cryptoMinimumUsd,
  effectiveCoinMinimumUsd,
  NOWPAYMENTS_COIN_CODES,
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

interface MinimumsCache {
  minimums: CryptoCoinMinimum[] | null;
  at: number;
}

let cache: MinimumsCache | null = null;
let inFlight: Promise<CryptoCoinMinimum[] | null> | null = null;

/** Drops the cache, or seeds it with fixed minimums (tests). */
export function resetCryptoMinimumsCache(
  minimums?: CryptoCoinMinimum[] | null,
): void {
  cache = minimums === undefined ? null : { minimums, at: Date.now() };
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

async function fetchMinimums(
  logger: EndpointLogger,
): Promise<CryptoCoinMinimum[] | null> {
  try {
    const merchant = await getJson("/merchant/coins", merchantCoinsSchema);
    const selected = merchant?.selectedCurrencies;
    // Unknown selection: offer every coin we list, NOWPayments still checks.
    const enabled = selected
      ? new Set(selected.map((code) => code.toLowerCase()))
      : null;
    // A few at a time: NOWPayments rate-limits bursts (429).
    const results: (CryptoCoinMinimum | null)[] = [];
    for (let i = 0; i < CryptoCoinDB.length; i += MIN_AMOUNT_CONCURRENCY) {
      const batch = CryptoCoinDB.slice(i, i + MIN_AMOUNT_CONCURRENCY);
      results.push(
        ...(await Promise.all(
          batch.map(async (coin): Promise<CryptoCoinMinimum | null> => {
            const code = NOWPAYMENTS_COIN_CODES[coin];
            if (enabled && !enabled.has(code)) {
              return null;
            }
            const data = await getJson(
              `/min-amount?currency_from=${code}&currency_to=${code}&fiat_equivalent=usd&is_fee_paid_by_user=true`,
              minAmountSchema,
            ).catch(() => null);
            return data ? { coin, minUsd: data.fiat_equivalent } : null;
          }),
        )),
      );
    }
    const minimums = results.filter(
      (minimum): minimum is CryptoCoinMinimum => minimum !== null,
    );
    if (minimums.length === 0) {
      logger.warn("NOWPayments returned no coin minimums", {
        merchantCoinsRead: merchant !== null,
      });
      return null;
    }
    return minimums;
  } catch (error) {
    logger.warn("NOWPayments coin minimums read failed", {
      error: parseError(error).message,
    });
    return null;
  }
}

function refresh(logger: EndpointLogger): Promise<CryptoCoinMinimum[] | null> {
  if (!inFlight) {
    inFlight = fetchMinimums(logger)
      .then((minimums) => {
        cache = { minimums, at: Date.now() };
        return minimums;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

/**
 * Offered coins with their USD minimums, null while unknown. `wait` makes a
 * cold read wait for the API (checkout guard); page reads pass false and take
 * whatever is cached within COLD_WAIT_MS.
 */
export async function getCryptoCoinMinimums(
  logger: EndpointLogger,
  { wait }: { wait: boolean },
): Promise<CryptoCoinMinimum[] | null> {
  const configured = Boolean(paymentEnv.NOWPAYMENTS_API_KEY);
  if (cache) {
    const ttl = cache.minimums ? CACHE_TTL_MS : FAILURE_TTL_MS;
    if (configured && Date.now() - cache.at >= ttl) {
      void refresh(logger);
    }
    return cache.minimums;
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

function isOfferedCoin(value: string): value is (typeof CryptoCoinDB)[number] {
  return CryptoCoinDB.some((coin) => coin === value);
}

/**
 * Checks a crypto checkout against the coin minimums before an invoice is
 * created. Returns the NOWPayments `pay_currency` for the picked coin, or null
 * when the buyer picks on the hosted page. Fails (400) when the amount is
 * below what the picked coin, or every coin, accepts: the hosted page would
 * otherwise stall on that coin.
 */
export async function resolveCryptoPayCurrency(
  params: {
    productId: ProductIds;
    interval: PaymentInterval;
    quantity: number;
    payCurrency: string | undefined;
  },
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<string | null>> {
  const { t } = checkoutScopedTranslation.scopedT(locale);
  const amountUsd = cryptoAmountUsd(
    params.productId,
    params.interval,
    params.quantity,
  );
  const minimums = await getCryptoCoinMinimums(logger, { wait: true });
  const picked = params.payCurrency;
  if (picked !== undefined && !isOfferedCoin(picked)) {
    return fail({
      message: t("availability.cryptoCoinUnavailable"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }
  if (picked !== undefined) {
    // No minimum known for the coin (API hiccup, not read yet): trust the
    // pick, NOWPayments has the last word. The dialog lists only known coins.
    const minimum = minimums?.find((entry) => entry.coin === picked);
    if (minimum && effectiveCoinMinimumUsd(minimum) > amountUsd) {
      logger.info("Crypto checkout refused: below coin minimum", {
        coin: picked,
        amountUsd,
        minUsd: minimum.minUsd,
      });
      return fail({
        message: t("availability.cryptoCoinBelowMinimum"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }
    return success(NOWPAYMENTS_COIN_CODES[picked]);
  }
  // With fiat on, the hosted page also takes cards: no coin floor applies.
  if (paymentEnv.NOWPAYMENTS_FIAT_ENABLED === "true") {
    return success(null);
  }
  const lowest = cryptoMinimumUsd(minimums);
  if (amountUsd < lowest) {
    logger.info("Crypto checkout refused: below every coin minimum", {
      amountUsd,
      lowestUsd: lowest,
      minimumsKnown: minimums !== null,
    });
    return fail({
      message: t("availability.cryptoAmountBelowMinimum"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }
  return success(null);
}
