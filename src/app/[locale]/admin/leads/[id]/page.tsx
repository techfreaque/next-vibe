/**
 * Lead Detail Page
 * Server component for authentication + client EndpointsPage rendering
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadDetailPageClient } from "./page-client";

interface LeadDetailPageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export default async function LeadDetailPage({
  params,
}: LeadDetailPageProps): Promise<JSX.Element> {
  const { locale, id } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/leads/${id}`);

  return <LeadDetailPageClient locale={locale} user={user} leadId={id} />;
}
