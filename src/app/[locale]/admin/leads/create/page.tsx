/**
 * Lead Create Page
 * Server component for authentication + client EndpointsPage rendering
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadCreatePageClient } from "./page-client";

interface LeadCreatePageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function LeadCreatePage({
  params,
}: LeadCreatePageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/create`);

  return <LeadCreatePageClient locale={locale} user={user} />;
}
