/**
 * Tax Seeds
 * Default tax rates per country, seeded per company.
 * Idempotent: skips rates where code+companyId already exists.
 *
 * The rate definitions and seedDefaultTaxRates live in default-tax-rates.ts —
 * seeds.ts modules are stubbed out by the dev server (CLI-only), and company
 * onboarding needs seedDefaultTaxRates at runtime.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { formatDatabase } from "next-vibe/logger/formatters";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies } from "../companies/db";
import { seedDefaultTaxRates } from "./default-tax-rates";

export const priority = 50;

// ---- Seed runner: seeds tax rates for all existing companies ----

/**
 * Dev seed — seeds default tax rates for all existing companies.
 * This ensures the demo company created by the companies seed gets rates.
 */
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  void locale;
  const allCompanies = await db
    .select({ id: companies.id, country: companies.country })
    .from(companies);

  if (allCompanies.length === 0) {
    logger.info("Tax seeds: no companies found — skipping");
    return;
  }

  for (const company of allCompanies) {
    const country =
      company.country === "AT" || company.country === "DE"
        ? company.country
        : "XX";
    await seedDefaultTaxRates(company.id, country, logger);
  }

  logger.info(
    formatDatabase(`Tax rates: ${allCompanies.length} companies`, "🧾"),
  );
}

export async function prod(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  return dev(logger, locale);
}
