/**
 * Leads List Page
 * Uses EndpointsPage component for complete endpoint handling
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadsListClient } from "./leads-list-client";

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
