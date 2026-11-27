/**
 * Crypto coins offered at checkout (NOWPayments) and their minimums.
 *
 * NOWPayments refuses a payment below a per-coin minimum ("amountTo is too
 * small"), and its hosted invoice page lists every coin anyway: picking one
 * below its minimum just stalls on "Next step". So the buy dialog shows only
 * the coins that accept the amount and passes the pick as `pay_currency`.
 *
 * Minimums come from the NOWPayments API in USD (fee paid by the buyer, like
 * our invoices). Amounts compare as the US list price of the same product:
 * EUR and PLN prices are pegged at or above it, so the check never lets a
 * too-small payment through.
 *
 * Shared by server (checkout guard) and client (coin picker). No server-only
 * imports here.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import {
  type ProductIds,
  productsRepository,
} from "../../products/repository-client";
import type { PaymentInterval } from "../providers/types";
import { scopedTranslation } from "./i18n";

/** Coins we offer, most used first. */
export const {
  enum: CryptoCoin,
  options: CryptoCoinOptions,
  Value: CryptoCoinValue,
} = createEnumOptions(scopedTranslation, {
  BTC: "cryptoCoin.btc",
  ETH: "cryptoCoin.eth",
  USDT_TRC20: "cryptoCoin.usdtTrc20",
  USDT_ERC20: "cryptoCoin.usdtErc20",
  USDT_BSC: "cryptoCoin.usdtBsc",
  USDC: "cryptoCoin.usdc",
  SOL: "cryptoCoin.sol",
  LTC: "cryptoCoin.ltc",
  XMR: "cryptoCoin.xmr",
  DOGE: "cryptoCoin.doge",
  TRX: "cryptoCoin.trx",
  BNB_BSC: "cryptoCoin.bnbBsc",
});

export const CryptoCoinDB = [
  CryptoCoin.BTC,
  CryptoCoin.ETH,
  CryptoCoin.USDT_TRC20,
  CryptoCoin.USDT_ERC20,
  CryptoCoin.USDT_BSC,
  CryptoCoin.USDC,
  CryptoCoin.SOL,
  CryptoCoin.LTC,
  CryptoCoin.XMR,
  CryptoCoin.DOGE,
  CryptoCoin.TRX,
  CryptoCoin.BNB_BSC,
] as const;

/** NOWPayments currency code per coin (`pay_currency`, `min-amount`). */
export const NOWPAYMENTS_COIN_CODES: Record<typeof CryptoCoinValue, string> = {
  [CryptoCoin.BTC]: "btc",
  [CryptoCoin.ETH]: "eth",
  [CryptoCoin.USDT_TRC20]: "usdttrc20",
  [CryptoCoin.USDT_ERC20]: "usdterc20",
  [CryptoCoin.USDT_BSC]: "usdtbsc",
  [CryptoCoin.USDC]: "usdc",
  [CryptoCoin.SOL]: "sol",
  [CryptoCoin.LTC]: "ltc",
  [CryptoCoin.XMR]: "xmr",
  [CryptoCoin.DOGE]: "doge",
  [CryptoCoin.TRX]: "trx",
  [CryptoCoin.BNB_BSC]: "bnbbsc",
};

/**
 * Headroom on top of the API minimum: it moves with network fees between the
 * read (cached) and the buyer's payment.
 */
export const CRYPTO_MIN_SAFETY_FACTOR = 1.05;

/**
 * Floor used while live minimums are unknown (API down, not configured).
 * Live 2026-11-27: the cheapest coins need about $6.3 with the fee paid by the
 * buyer, BTC $6.9, USDT on TRON $16.5.
 */
export const CRYPTO_FALLBACK_MIN_USD = 7.5;

export interface CryptoCoinMinimum {
  coin: typeof CryptoCoinValue;
  /** NOWPayments minimum in USD, fee paid by the buyer. */
  minUsd: number;
}

/** Smallest amount (USD) a coin accepts, including the safety headroom. */
export function effectiveCoinMinimumUsd(minimum: CryptoCoinMinimum): number {
  return minimum.minUsd * CRYPTO_MIN_SAFETY_FACTOR;
}

/** Coins that accept `amountUsd`, in offer order. */
export function eligibleCryptoCoins(
  minimums: readonly CryptoCoinMinimum[],
  amountUsd: number,
): CryptoCoinMinimum[] {
  return minimums.filter(
    (minimum) => effectiveCoinMinimumUsd(minimum) <= amountUsd,
  );
}

/**
 * Lowest amount (USD) any coin accepts. Unknown minimums (null/undefined or
 * an empty list) fall back to CRYPTO_FALLBACK_MIN_USD.
 */
export function cryptoMinimumUsd(
  minimums: readonly CryptoCoinMinimum[] | null | undefined,
): number {
  if (!minimums || minimums.length === 0) {
    return CRYPTO_FALLBACK_MIN_USD;
  }
  return Math.min(...minimums.map(effectiveCoinMinimumUsd));
}

/** True when at least one coin (or the fallback floor) accepts the amount. */
export function cryptoAcceptsAmount(
  minimums: readonly CryptoCoinMinimum[] | null | undefined,
  amountUsd: number,
): boolean {
  return amountUsd >= cryptoMinimumUsd(minimums);
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
