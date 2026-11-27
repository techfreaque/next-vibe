import { createEndpointLogger } from "next-vibe/logger/server";
import { afterEach, expect, it } from "vitest";

import { ProductIds } from "../../../products/repository-client";
import {
  cryptoAcceptsAmount,
  cryptoAmountUsd,
  CryptoCoin,
  type CryptoCoinMinimum,
  cryptoMinimumUsd,
  eligibleCryptoCoins,
  CRYPTO_FALLBACK_MIN_USD,
} from "../../checkout/crypto-coins";
import {
  resetCryptoMinimumsCache,
  resolveCryptoPayCurrency,
} from "./min-amounts";

const logger = createEndpointLogger(false, "en-GLOBAL");

// Live NOWPayments minimums 2026-11-27 (USD, fee paid by the buyer).
const LIVE: CryptoCoinMinimum[] = [
  { coin: CryptoCoin.BTC, minUsd: 6.94 },
  { coin: CryptoCoin.ETH, minUsd: 6.48 },
  { coin: CryptoCoin.USDT_TRC20, minUsd: 16.5 },
  { coin: CryptoCoin.LTC, minUsd: 6.29 },
  { coin: CryptoCoin.XMR, minUsd: 12.62 },
];

afterEach(() => {
  resetCryptoMinimumsCache();
});

it("prices crypto checks at the US list price", () => {
  expect(cryptoAmountUsd(ProductIds.SUBSCRIPTION, "month")).toBe(8);
  expect(cryptoAmountUsd(ProductIds.SUBSCRIPTION, "year")).toBe(88);
  expect(cryptoAmountUsd(ProductIds.CREDIT_PACK, "one_time", 3)).toBe(15);
});

it("lists only coins whose minimum (plus headroom) the amount covers", () => {
  // Starter monthly ($8): BTC, ETH, LTC yes; USDT on TRON and Monero no.
  expect(eligibleCryptoCoins(LIVE, 8).map((m) => m.coin)).toEqual([
    CryptoCoin.BTC,
    CryptoCoin.ETH,
    CryptoCoin.LTC,
  ]);
  // One $5 pack is below every coin.
  expect(eligibleCryptoCoins(LIVE, 5)).toEqual([]);
  expect(cryptoAcceptsAmount(LIVE, 5)).toBe(false);
  // Two packs ($10) pass the cheapest coins.
  expect(cryptoAcceptsAmount(LIVE, 10)).toBe(true);
  expect(Math.ceil(cryptoMinimumUsd(LIVE) / 5)).toBe(2);
  // Unknown minimums fall back to a fixed floor.
  expect(cryptoMinimumUsd(undefined)).toBe(CRYPTO_FALLBACK_MIN_USD);
  expect(cryptoAcceptsAmount(null, 8)).toBe(true);
  expect(cryptoAcceptsAmount(null, 5)).toBe(false);
});

it("allows Starter monthly via crypto and passes the picked coin", async () => {
  resetCryptoMinimumsCache(LIVE);
  const btc = await resolveCryptoPayCurrency(
    {
      productId: ProductIds.SUBSCRIPTION,
      interval: "month",
      quantity: 1,
      payCurrency: CryptoCoin.BTC,
    },
    "en-GLOBAL",
    logger,
  );
  expect(btc.success && btc.data).toBe("btc");

  const hosted = await resolveCryptoPayCurrency(
    {
      productId: ProductIds.SUBSCRIPTION,
      interval: "month",
      quantity: 1,
      payCurrency: undefined,
    },
    "en-GLOBAL",
    logger,
  );
  expect(hosted.success && hosted.data).toBeNull();
});

it("refuses a coin below its minimum and an amount below every coin", async () => {
  resetCryptoMinimumsCache(LIVE);
  const tron = await resolveCryptoPayCurrency(
    {
      productId: ProductIds.SUBSCRIPTION,
      interval: "month",
      quantity: 1,
      payCurrency: CryptoCoin.USDT_TRC20,
    },
    "en-GLOBAL",
    logger,
  );
  expect(tron.success).toBe(false);
  expect(tron.message).toContain("below that coin's minimum");

  const onePack = await resolveCryptoPayCurrency(
    {
      productId: ProductIds.CREDIT_PACK,
      interval: "one_time",
      quantity: 1,
      payCurrency: undefined,
    },
    "en-GLOBAL",
    logger,
  );
  expect(onePack.success).toBe(false);

  const twoPacks = await resolveCryptoPayCurrency(
    {
      productId: ProductIds.CREDIT_PACK,
      interval: "one_time",
      quantity: 2,
      payCurrency: CryptoCoin.LTC,
    },
    "en-GLOBAL",
    logger,
  );
  expect(twoPacks.success && twoPacks.data).toBe("ltc");

  // No minimum known for the coin: the pick passes, NOWPayments decides.
  const doge = await resolveCryptoPayCurrency(
    {
      productId: ProductIds.SUBSCRIPTION,
      interval: "year",
      quantity: 1,
      payCurrency: CryptoCoin.DOGE,
    },
    "en-GLOBAL",
    logger,
  );
  expect(doge.success && doge.data).toBe("doge");
});
