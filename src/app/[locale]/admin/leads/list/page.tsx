/**
 * Leads List Page
 * Uses EndpointsPage component for complete endpoint handling
 */

import type { JSX } from "react";

import { LeadsListClient } from "@/app/api/[locale]/leads/list/_components/leads-list-client";
import type { CountryLanguage } from "@/i18n/core/config";

export default async function LeadsListPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;

  return <LeadsListClient locale={locale} />;
}
