/**
 * Email Campaigns Dashboard
 * Campaign performance overview
 */

import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CampaignsDashboardClient } from "./_components/campaigns-dashboard-client";

interface EmailCampaignsDashboardProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface EmailCampaignsDashboardData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: EmailCampaignsDashboardProps): Promise<EmailCampaignsDashboardData> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/messenger/campaigns`,
  );
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: EmailCampaignsDashboardData): React.JSX.Element {
  return <CampaignsDashboardClient locale={locale} user={user} />;
}

export default async function EmailCampaignsDashboard({
  params,
}: EmailCampaignsDashboardProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
