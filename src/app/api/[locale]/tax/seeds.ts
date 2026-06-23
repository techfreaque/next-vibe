/**
 * Tax Seeds
 * Default tax rates per country, seeded per company.
 * Idempotent: skips rates where code+companyId already exists.
 */

import { and, eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { companies } from "../companies/db";
import { taxRates } from "./db";
import type { TaxTypeDB } from "./enum";
import { TaxType } from "./enum";

export const priority = 50;

// ---- Default tax rate definitions per country ----

interface TaxRateDef {
  name: string;
  code: string;
  type: (typeof TaxTypeDB)[number];
  rate: number;
  isDefault: boolean;
}

export const DEFAULT_TAX_RATES: Record<"AT" | "DE" | "XX", TaxRateDef[]> = {
  AT: [
    {
      name: "MwSt 20%",
      code: "AT_VAT_20",
      type: TaxType.VAT,
      rate: 0.2,
      isDefault: true,
    },
    {
      name: "MwSt 10%",
      code: "AT_VAT_10",
      type: TaxType.VAT,
      rate: 0.1,
      isDefault: false,
    },
    {
      name: "MwSt 13%",
      code: "AT_VAT_13",
      type: TaxType.VAT,
      rate: 0.13,
      isDefault: false,
    },
    {
      name: "Steuerfrei",
      code: "AT_VAT_0",
      type: TaxType.VAT,
      rate: 0.0,
      isDefault: false,
    },
  ],
  DE: [
    {
      name: "MwSt 19%",
      code: "DE_VAT_19",
      type: TaxType.VAT,
      rate: 0.19,
      isDefault: true,
    },
    {
      name: "MwSt 7%",
      code: "DE_VAT_7",
      type: TaxType.VAT,
      rate: 0.07,
      isDefault: false,
    },
    {
      name: "Steuerfrei",
      code: "DE_VAT_0",
      type: TaxType.VAT,
      rate: 0.0,
      isDefault: false,
    },
  ],
  XX: [
    {
      name: "VAT 20%",
      code: "VAT_20",
      type: TaxType.VAT,
      rate: 0.2,
      isDefault: true,
    },
    {
      name: "VAT 10%",
      code: "VAT_10",
      type: TaxType.VAT,
      rate: 0.1,
      isDefault: false,
    },
    {
      name: "Tax Exempt",
      code: "VAT_0",
      type: TaxType.VAT,
      rate: 0.0,
      isDefault: false,
    },
  ],
};

/**
 * Seed default tax rates for a company by country.
 * Idempotent: skips any rate whose code already exists for the company.
 */
export async function seedDefaultTaxRates(
  companyId: string,
  country: "AT" | "DE" | "XX",
  logger: EndpointLogger,
): Promise<void> {
  const rates = DEFAULT_TAX_RATES[country];

  for (const rate of rates) {
    const [existing] = await db
      .select({ id: taxRates.id })
      .from(taxRates)
      .where(
        and(eq(taxRates.companyId, companyId), eq(taxRates.code, rate.code)),
      )
      .limit(1);

    if (existing) {
      logger.debug(
        `Tax rate already exists: ${rate.code} for company ${companyId} — skipping`,
      );
      continue;
    }

    await db.insert(taxRates).values({
      companyId,
      name: rate.name,
      code: rate.code,
      type: rate.type,
      rate: rate.rate,
      country,
      isDefault: rate.isDefault,
      isActive: true,
      isCompound: false,
    });

    logger.info(`Seeded tax rate: ${rate.code} for company ${companyId}`);
  }
}

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

  logger.debug(
    `Tax seeds: seeded rates for ${allCompanies.length} company/companies`,
  );
}

export async function prod(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  return dev(logger, locale);
}
