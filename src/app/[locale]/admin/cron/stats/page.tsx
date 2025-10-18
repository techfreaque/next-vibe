/**
 * Cron Stats Admin Page
 * Comprehensive cron statistics dashboard for administrators
 */

import type { Metadata } from "next";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CronStatsClient } from "./_components/cron-stats-client";

interface CronStatsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

/**
 * Generate metadata for the cron stats page
 */
export async function generateMetadata({
  params,
}: CronStatsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("app.admin.cron.stats.pageTitle"),
    description: t("app.admin.cron.stats.pageDescription"),
  };
}

/**
 * Cron Stats Admin Page Component
 * Server-side page that renders the client-side stats dashboard
 */
export default async function CronStatsPage({
  params,
}: CronStatsPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  return (
    <div className="space-y-6">
      <CronStatsClient locale={locale} />
    </div>
  );
}
