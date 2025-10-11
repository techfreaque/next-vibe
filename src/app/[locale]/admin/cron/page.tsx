/**
 * Cron Admin Page
 * Main cron admin page that redirects to overview
 */

import { redirect } from "next/navigation";

import type { CountryLanguage } from "@/i18n/core/config";

interface CronAdminPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function CronAdminPage({
  params,
}: CronAdminPageProps): Promise<never> {
  const { locale } = await params;

  // Redirect to the stats page
  redirect(`/${locale}/admin/cron/stats`);
}
