/**
 * Crypto checkout floor (NOWPayments).
 *
 * The buyer picks the coin on the NOWPayments invoice page, which offers every
 * coin enabled in our Partner Profile. A coin below its own minimum is refused
 * there ("amountTo is too small"), but the buyer can still pick another one.
 * Only when the amount is below what EVERY coin accepts does crypto make no
 * sense at all, so that is the one case we block on our side.
 *
 * The floor is the lowest live minimum (USD, fee paid by the buyer, like our
 * invoices) across the popular coins below. Amounts compare as the US list
 * price of the same product: EUR and PLN prices are pegged at or above it, so
 * the check never lets a too-small payment through.
 *
 * Shared by server (checkout guard) and client (buy dialogs). No server-only
 * imports here.
 */

import {
  type ProductIds,
  productsRepository,
} from "../../products/repository-client";
import type { PaymentInterval } from "../providers/types";

/**
 * NOWPayments codes probed for the floor: the coins with the lowest minimums
 * plus the most used ones. The invoice page still offers every coin.
 */
export const NOWPAYMENTS_FLOOR_COIN_CODES = [
  "btc",
  "eth",
  "usdttrc20",
  "usdterc20",
  "usdtbsc",
  "usdc",
  "sol",
  "ltc",
  "xmr",
  "doge",
  "trx",
  "bnbbsc",
] as const;

/**
 * Headroom on top of the API minimum: it moves with network fees between the
 * read (cached) and the buyer's payment.
 */
export const CRYPTO_MIN_SAFETY_FACTOR = 1.05;

/**
 * Floor used while live minimums are unknown (API down, not configured).
 * Live 2026-11-27: the cheapest coins need about $6.3 with the fee paid by the
 * buyer.
 */
export const CRYPTO_FALLBACK_MIN_USD = 7.5;

/**
 * Lowest amount (USD) crypto accepts: the lowest coin minimum plus headroom.
 * Unknown (null/undefined) falls back to CRYPTO_FALLBACK_MIN_USD.
 */
export function cryptoMinimumUsd(
  lowestCoinMinUsd: number | null | undefined,
): number {
  if (lowestCoinMinUsd === null || lowestCoinMinUsd === undefined) {
    return CRYPTO_FALLBACK_MIN_USD;
  }
  return lowestCoinMinUsd * CRYPTO_MIN_SAFETY_FACTOR;
}

/** True when at least one coin accepts `amountUsd` (see cryptoMinimumUsd). */
export function cryptoAcceptsAmount(
  minimumUsd: number,
  amountUsd: number,
): boolean {
  return amountUsd >= minimumUsd;
}

/** US list price of `quantity` x product, the amount crypto checks compare. */
export function cryptoAmountUsd(
  productId: ProductIds,
  interval: PaymentInterval,
  quantity = 1,
): number {
  return (
    productsRepository.getProduct(productId, "en-US", interval).price * quantity
  );
}
