/**
 * Leads Admin Stats Page (Home)
 * Main leads management interface showing statistics and overview
 */

import { Div } from "next-vibe-ui/ui/div";
import type React from "react";

import { LeadsStatsClient } from "@/app/api/[locale]/leads/stats/_components/leads-stats-client";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface AdminLeadsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function AdminLeadsPage({
  params,
}: AdminLeadsPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/leads`);
  return (
    <Div className="flex flex-col gap-6">
      {/* Stats Client Component */}
      <LeadsStatsClient locale={locale} user={user} />
    </Div>
  );
}
