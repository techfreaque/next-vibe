/**
 * Email Campaigns Dashboard
 * Campaign performance overview
 */

import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { CampaignsDashboardClient } from "./_components/campaigns-dashboard-client";

interface EmailCampaignsDashboardProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function EmailCampaignsDashboard({
  params,
}: EmailCampaignsDashboardProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/campaigns`,
  );

  return <CampaignsDashboardClient locale={locale} user={user} />;
}
