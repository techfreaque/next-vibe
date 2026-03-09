/**
 * Lead Delete Page
 * Server component for authentication + client EndpointsPage rendering
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadDeletePageClient } from "./page-client";

interface LeadDeletePageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export default async function LeadDeletePage({
  params,
}: LeadDeletePageProps): Promise<JSX.Element> {
  const { locale, id } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/leads/${id}/delete`,
  );

  return <LeadDeletePageClient locale={locale} user={user} leadId={id} />;
}
