/**
 * Tax Seeds
 * Default tax rates per country, seeded per company.
 * Idempotent: skips rates where code+companyId already exists.
 *
 * The rate definitions and seedDefaultTaxRates live in default-tax-rates.ts —
 * seeds.ts modules are stubbed out by the dev server (CLI-only), and company
 * onboarding needs seedDefaultTaxRates at runtime.
 */

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db, isPglite } from "next-vibe/database";
import { isTransientConnectError } from "next-vibe/database/pool";
import { formatDatabase } from "next-vibe/logger/formatters";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies } from "../companies/db";
import { findDemoCompany } from "../companies/demo-company.repository";
import { seedDefaultTaxRates } from "./default-tax-rates";
import { companyTaxRegimes } from "./regime/db";
import { CompanyTaxRegime } from "./regime/enum";

export const priority = 50;

// ---- Seed runner: seeds tax rates for all existing companies ----

/**
 * Seed rates for all existing companies, including the seeded demo company.
 */
async function seedCompanyTaxRates(logger: EndpointLogger): Promise<void> {
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

export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  void locale;
  try {
    await seedCompanyTaxRates(logger);
  } catch (error) {
    const cause =
      error instanceof Error && error.cause instanceof Error
        ? error.cause
        : error;
    if (
      !isPglite ||
      !(cause instanceof Error) ||
      !isTransientConnectError(cause)
    ) {
      return Promise.reject(error);
    }
    // A disconnected connection can lose the reply to a committed insert.
    // Every insert here ignores conflicts on the company's existing rate codes.
    logger.error(
      "PGlite connection lost while seeding tax rates. Retrying once.",
      cause,
    );
    await seedCompanyTaxRates(logger);
  }

  const company = await findDemoCompany();
  if (company) {
    const [regime] = await db
      .select({ effectiveFrom: companyTaxRegimes.effectiveFrom })
      .from(companyTaxRegimes)
      .where(eq(companyTaxRegimes.companyId, company.id))
      .limit(1);
    if (!regime) {
      await db
        .insert(companyTaxRegimes)
        .values({
          companyId: company.id,
          effectiveFrom: "2020-01-01",
          regime: CompanyTaxRegime.STANDARD,
          recordedBy: company.adminId,
        })
        .onConflictDoNothing();
    }
  }
}

export async function prod(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  void locale;
  await seedCompanyTaxRates(logger);
}
