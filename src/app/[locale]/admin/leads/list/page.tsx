/**
 * Leads List Page
 * Uses EndpointsPage component for complete endpoint handling
 */

import type { JSX } from "react";

import { LeadsListClient } from "@/app/api/[locale]/leads/list/_components/leads-list-client";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

export default async function LeadsListPage({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const { locale } = await params;

  // Require admin user authentication
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/list`);

  return <LeadsListClient locale={locale} user={user} />;
}
