/**
 * Credit pack price consistency: every surface (checkout, pricing page, API
 * notice, emails, system prompt) must show the price checkout charges.
 * Checkout reads the one-time price; other surfaces read the default price
 * or the pricing params.
 */

import { describe, expect, test } from "bun:test";
import { availableCountries, type CountryLanguage } from "next-vibe/core/i18n/core/config";

import {
  CREDIT_PACK_PRODUCT_IDS,
  getPricingParams,
  productsRepository,
} from "../repository-client";

const LOCALES: readonly CountryLanguage[] = [
  "en-US",
  "en-GLOBAL",
  "de-DE",
  "pl-PL",
  "fr-FR",
  "fr-GLOBAL",
];

describe("credit pack price", () => {
  test("default price equals the one-time checkout price", () => {
    const definitions = productsRepository.getProductDefinitions();
    for (const id of CREDIT_PACK_PRODUCT_IDS) {
      const def = definitions[id];
      expect(def.oneTimePriceByCountry).toEqual(def.priceByCountry);
    }
  });

  test("every read path returns the checkout price", () => {
    for (const locale of LOCALES) {
      for (const id of CREDIT_PACK_PRODUCT_IDS) {
        const checkout = productsRepository.getProduct(id, locale, "one_time");
        expect(productsRepository.getProduct(id, locale).price).toBe(
          checkout.price,
        );
        expect(productsRepository.getProducts(locale)[id].price).toBe(
          checkout.price,
        );
      }
    }
  });

  test("a regional locale bills the configured currency at the established market price", () => {
    for (const { code, currency, languages } of availableCountries) {
      for (const language of languages) {
        const locale: CountryLanguage = `${language}-${code}`;
        const pack = productsRepository.getProduct(CREDIT_PACK_PRODUCT_IDS[0], locale, "one_time");
        expect(pack.currency).toBe(currency);
        expect(pack.price).toBe(currency === "PLN" ? 19 : 5);
        expect(pack.country).toBe(code);
      }
    }
  });

  test("pricing params show the Polish pack as 19 zł", () => {
    expect(getPricingParams("pl-PL").packPrice).toBe("19 zł");
    expect(getPricingParams("en-US").packPrice).toBe("$5");
    expect(getPricingParams("de-DE").packPrice).toBe("5 €");
    expect(getPricingParams("fr-FR").packPrice).toBe("5 €");
    expect(getPricingParams("es-ES").packPrice).toBe("5 €");
    expect(getPricingParams("it-IT").packPrice).toBe("5 €");
  });
});
