/**
 * Email Campaigns Monitoring Page
 * Shows cron task health, execution history, and alerts
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { EmailCampaignsMonitoringPageClient } from "./page-client";

interface MonitoringPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function EmailCampaignsMonitoringPage({
  params,
}: MonitoringPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const user = await requireAdminUser(locale);

  return <EmailCampaignsMonitoringPageClient locale={locale} user={user} />;
}
