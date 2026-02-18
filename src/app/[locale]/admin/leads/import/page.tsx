/**
 * Leads Import Page
 * Upload CSV files and monitor import job status
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadsImportPageClient } from "./page-client";

export default async function LeadsImportPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/import`);

  return <LeadsImportPageClient locale={locale} user={user} />;
}
