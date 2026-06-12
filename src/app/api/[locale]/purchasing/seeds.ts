/**
 * Purchasing seeds
 * Creates demo vendors for the demo company
 */

import { and, eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { companies } from "../companies/db";
import { purchasingVendors } from "./db";

interface DemoVendor {
  name: string;
  code: string;
  email: string;
  defaultCurrency: string;
  defaultPaymentTermsDays: number;
  vatNumber?: string;
  phone?: string;
  city?: string;
  country?: string;
}

const DEMO_VENDORS: DemoVendor[] = [
  {
    name: "Acme Supplies",
    code: "ACME",
    email: "orders@acme.example",
    defaultCurrency: "EUR",
    defaultPaymentTermsDays: 30,
    vatNumber: "DE123456789",
    phone: "+49 30 12345678",
    city: "Berlin",
    country: "DE",
  },
  {
    name: "Tech Components GmbH",
    code: "TECH-DE",
    email: "procurement@techcomp.example",
    defaultCurrency: "EUR",
    defaultPaymentTermsDays: 14,
    vatNumber: "DE987654321",
    phone: "+49 89 98765432",
    city: "Munich",
    country: "DE",
  },
  {
    name: "Global Office Supplies",
    code: "GOS-INT",
    email: "orders@globaloffice.example",
    defaultCurrency: "USD",
    defaultPaymentTermsDays: 45,
    phone: "+1 212 555 0100",
    city: "New York",
    country: "US",
  },
];

/**
 * Development seed — creates demo vendors for the demo company
 */
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  void locale;
  // Find the demo company
  const demoCompanies = await db
    .select({ id: companies.id, name: companies.name })
    .from(companies)
    .limit(1);

  if (demoCompanies.length === 0) {
    logger.warn("No companies found — skipping purchasing vendors seed");
    return;
  }

  const company = demoCompanies[0];

  for (const vendor of DEMO_VENDORS) {
    // Check if vendor with this code already exists for the company
    const existing = await db
      .select({ id: purchasingVendors.id })
      .from(purchasingVendors)
      .where(
        and(
          eq(purchasingVendors.companyId, company.id),
          eq(purchasingVendors.code, vendor.code),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      logger.debug(
        `Vendor ${vendor.code} already exists for company ${company.name}`,
      );
      continue;
    }

    await db.insert(purchasingVendors).values({
      companyId: company.id,
      name: vendor.name,
      code: vendor.code,
      email: vendor.email,
      phone: vendor.phone ?? null,
      defaultCurrency: vendor.defaultCurrency,
      defaultPaymentTermsDays: vendor.defaultPaymentTermsDays,
      vatNumber: vendor.vatNumber ?? null,
      city: vendor.city ?? null,
      country: vendor.country ?? null,
      isActive: true,
    });

    logger.debug(`Created vendor: ${vendor.name} (${vendor.code})`);
  }

  logger.debug("✅ Purchasing vendors seed complete");
}

// Priority: after companies (80), before nothing specific
export const priority = 70;
