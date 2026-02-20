/**
 * Leads Export Page
 * Server component for leads CSV/Excel export
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadsExportPageClient } from "./page-client";

interface LeadsExportPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function LeadsExportPage({
  params,
}: LeadsExportPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/export`);

  return <LeadsExportPageClient locale={locale} user={user} />;
}
