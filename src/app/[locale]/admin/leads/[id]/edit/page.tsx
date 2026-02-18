/**
 * Lead Edit Page
 * Server component for authentication + client EndpointsPage rendering
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadEditPageClient } from "./page-client";

interface LeadEditPageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export default async function LeadEditPage({
  params,
}: LeadEditPageProps): Promise<JSX.Element> {
  const { locale, id } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/leads/${id}/edit`,
  );

  return <LeadEditPageClient locale={locale} user={user} leadId={id} />;
}
