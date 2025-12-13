/**
 * Leads List Page
 * Uses EndpointsPage component for complete endpoint handling
 */

import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { LeadsListClient } from "@/app/api/[locale]/leads/list/_components/leads-list-client";

export default async function LeadsListPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;

  return <LeadsListClient locale={locale} />;
}
