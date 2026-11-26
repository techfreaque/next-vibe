/**
 * Default tax rates per country + idempotent per-company seeding.
 *
 * Lives OUTSIDE seeds.ts on purpose: the dev server's exclude-generator-seeds
 * Vite plugin stubs every seeds.ts module to `export default {}` (seeds are
 * CLI-only), so anything imported from a seeds file is silently undefined at
 * runtime. Company onboarding (onboard/repository.ts) calls
 * seedDefaultTaxRates at runtime — it must import from here, not from seeds.
 */

import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  getCountryProfile,
  type ProfileCountry,
  type ProfileVatRate,
} from "./compliance/profiles";
import { taxRates } from "./db";
import { TaxType } from "./enum";

/** Default rates come from the country compliance profile (single source). */
export const DEFAULT_TAX_RATES: Record<
  ProfileCountry,
  readonly ProfileVatRate[]
> = {
  AT: getCountryProfile("AT").vatRates,
  DE: getCountryProfile("DE").vatRates,
  SK: getCountryProfile("SK").vatRates,
  XX: getCountryProfile("XX").vatRates,
};

/**
 * Seed default tax rates for a company by country.
 * Idempotent: skips any rate whose code already exists for the company.
 */
export async function seedDefaultTaxRates(
  companyId: string,
  country: ProfileCountry,
  logger: EndpointLogger,
  executor: Pick<typeof db, "insert"> = db,
): Promise<number> {
  const rates = DEFAULT_TAX_RATES[country];

  const inserted = await executor
    .insert(taxRates)
    .values(
      rates.map((rate) => ({
        companyId,
        name: rate.name,
        code: rate.code,
        type: TaxType.VAT,
        rate: rate.rate,
        country,
        validFrom: rate.validFrom,
        validTo: rate.validTo,
        isDefault: rate.isDefault,
        // Historic statutory rates stay available for corrections but are
        // not offered on new documents (see validOn in the rate list).
        isActive: true,
        isCompound: false,
      })),
    )
    .onConflictDoNothing({ target: [taxRates.companyId, taxRates.code] })
    .returning({ id: taxRates.id });

  logger.debug("Seeded default tax rates", {
    companyId,
    inserted: inserted.length,
    requested: rates.length,
  });
  return inserted.length;
}
