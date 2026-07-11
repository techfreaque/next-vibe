/**
 * Default tax rates per country + idempotent per-company seeding.
 *
 * Lives OUTSIDE seeds.ts on purpose: the dev server's exclude-generator-seeds
 * Vite plugin stubs every seeds.ts module to `export default {}` (seeds are
 * CLI-only), so anything imported from a seeds file is silently undefined at
 * runtime. Company onboarding (onboard/repository.ts) calls
 * seedDefaultTaxRates at runtime — it must import from here, not from seeds.
 */

import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { taxRates } from "./db";
import type { TaxTypeDB } from "./enum";
import { TaxType } from "./enum";

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

    logger.debug(`Seeded tax rate: ${rate.code} for company ${companyId}`);
  }
}
