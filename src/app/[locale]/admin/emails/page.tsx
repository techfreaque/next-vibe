/**
 * Emails Admin Page
 * Main emails admin page that redirects to stats
 */

import { redirect } from "next/navigation";

import type { CountryLanguage } from "@/i18n/core/config";

interface EmailsAdminPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function EmailsAdminPage({
  params,
}: EmailsAdminPageProps): Promise<never> {
  const { locale } = await params;

  // Redirect to the stats page
  redirect(`/${locale}/admin/emails/stats`);
}
