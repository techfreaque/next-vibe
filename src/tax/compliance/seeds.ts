/**
 * Slovak demo company (dev only). See ./sk-demo.ts.
 * Runs after chart templates (40) and tax rates (50).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { EndpointLogger } from "next-vibe/logger/types";

import { seedSlovakDemoCompany } from "./sk-demo";

export const priority = 7;

export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  await seedSlovakDemoCompany(logger, locale);
}
