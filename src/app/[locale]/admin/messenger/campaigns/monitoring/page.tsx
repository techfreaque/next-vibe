/**
 * Email Campaigns Monitoring Page
 * Shows cron task health, execution history, and alerts
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { EmailCampaignsMonitoringPageClient } from "./page-client";

interface MonitoringPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface MonitoringPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: MonitoringPageProps): Promise<MonitoringPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: MonitoringPageData): JSX.Element {
  return <EmailCampaignsMonitoringPageClient locale={locale} user={user} />;
}

export default async function EmailCampaignsMonitoringPage({
  params,
}: MonitoringPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
