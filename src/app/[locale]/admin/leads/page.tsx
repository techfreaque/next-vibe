/**
 * Leads Admin Stats Page (Home)
 * Main leads management interface showing statistics and overview
 */

import type React from "react";
import { Div } from "next-vibe-ui/ui";

import type { CountryLanguage } from "@/i18n/core/config";

import { LeadsStatsClient } from "./stats/_components/leads-stats-client";

interface AdminLeadsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function AdminLeadsPage({
  params,
}: AdminLeadsPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  return (
    <Div className="space-y-6">
      {/* Stats Client Component */}
      <LeadsStatsClient locale={locale} />
    </Div>
  );
}
