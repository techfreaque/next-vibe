/**
 * Leads Batch Operations Page
 * Server component for batch lead updates
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadsBatchPageClient } from "./page-client";

interface LeadsBatchPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function LeadsBatchPage({
  params,
}: LeadsBatchPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/batch`);

  return <LeadsBatchPageClient locale={locale} user={user} />;
}
