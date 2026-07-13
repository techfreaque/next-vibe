/**
 * POS seeds
 * Creates a demo POS terminal for the demo company
 */

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies } from "../companies/db";
import { posTerminals } from "./db";

const DEMO_TERMINAL_NAME = "Main Register";

/**
 * Development seed — creates a demo POS terminal for the demo company
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
    logger.warn("No companies found — skipping POS terminal seed");
    return;
  }

  const company = demoCompanies[0];

  // Check if demo terminal already exists
  const existing = await db
    .select({ id: posTerminals.id })
    .from(posTerminals)
    .where(
      and(
        eq(posTerminals.companyId, company.id),
        eq(posTerminals.name, DEMO_TERMINAL_NAME),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    logger.debug(`Demo POS terminal already exists: ${existing[0].id}`);
    return;
  }

  const [terminal] = await db
    .insert(posTerminals)
    .values({
      companyId: company.id,
      name: DEMO_TERMINAL_NAME,
      location: "Front desk",
      currency: "EUR",
      isActive: true,
    })
    .returning({ id: posTerminals.id });

  logger.debug(
    `Created demo POS terminal: ${terminal.id} for company: ${company.name}`,
  );
  logger.debug("✅ POS seed complete");
}

/**
 * Production seed — same as dev
 */
export async function prod(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  return dev(logger, locale);
}

// Priority: after companies (80)
export const priority = 5;
