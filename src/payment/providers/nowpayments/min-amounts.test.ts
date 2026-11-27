import { createEndpointLogger } from "next-vibe/logger/server";
import { afterEach, expect, it } from "vitest";

import { ProductIds } from "../../../products/repository-client";
import {
  CRYPTO_FALLBACK_MIN_USD,
  cryptoAcceptsAmount,
  cryptoAmountUsd,
  cryptoMinimumUsd,
} from "../../checkout/crypto-coins";
import { checkCryptoAmount, resetCryptoMinimumCache } from "./min-amounts";

const logger = createEndpointLogger(false, "en-GLOBAL");

// Lowest live NOWPayments minimum 2026-11-27 (LTC, USD, fee paid by buyer).
const LOWEST_LIVE_MIN_USD = 6.29;

afterEach(() => {
  resetCryptoMinimumCache();
});

it("prices crypto checks at the US list price", () => {
  expect(cryptoAmountUsd(ProductIds.SUBSCRIPTION, "month")).toBe(8);
  expect(cryptoAmountUsd(ProductIds.SUBSCRIPTION, "year")).toBe(88);
  expect(cryptoAmountUsd(ProductIds.CREDIT_PACK, "one_time", 3)).toBe(15);
});

it("blocks crypto only below the lowest coin minimum (plus headroom)", () => {
  const floor = cryptoMinimumUsd(LOWEST_LIVE_MIN_USD);
  // Starter monthly ($8) takes crypto.
  expect(cryptoAcceptsAmount(floor, 8)).toBe(true);
  // One $5 pack is below every coin; two packs ($10) pass.
  expect(cryptoAcceptsAmount(floor, 5)).toBe(false);
  expect(cryptoAcceptsAmount(floor, 10)).toBe(true);
  expect(Math.ceil(floor / 5)).toBe(2);
  // Unknown minimums fall back to a fixed floor.
  expect(cryptoMinimumUsd(undefined)).toBe(CRYPTO_FALLBACK_MIN_USD);
  expect(cryptoMinimumUsd(null)).toBe(CRYPTO_FALLBACK_MIN_USD);
});

it("lets Starter monthly through to the NOWPayments page", async () => {
  resetCryptoMinimumCache(LOWEST_LIVE_MIN_USD);
  const starter = await checkCryptoAmount(
    { productId: ProductIds.SUBSCRIPTION, interval: "month", quantity: 1 },
    "en-GLOBAL",
    logger,
  );
  expect(starter.success).toBe(true);

  const twoPacks = await checkCryptoAmount(
    { productId: ProductIds.CREDIT_PACK, interval: "one_time", quantity: 2 },
    "en-GLOBAL",
    logger,
  );
  expect(twoPacks.success).toBe(true);
});

it("refuses an amount below every coin minimum", async () => {
  resetCryptoMinimumCache(LOWEST_LIVE_MIN_USD);
  const onePack = await checkCryptoAmount(
    { productId: ProductIds.CREDIT_PACK, interval: "one_time", quantity: 1 },
    "en-GLOBAL",
    logger,
  );
  expect(onePack.success).toBe(false);
  expect(onePack.message).toContain("below the crypto minimum");

  // Unknown minimums: the fallback floor still refuses one pack.
  resetCryptoMinimumCache(null);
  const unknown = await checkCryptoAmount(
    { productId: ProductIds.CREDIT_PACK, interval: "one_time", quantity: 1 },
    "en-GLOBAL",
    logger,
  );
  expect(unknown.success).toBe(false);
});
