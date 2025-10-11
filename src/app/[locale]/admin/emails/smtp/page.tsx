/**
 * SMTP Admin Main Page
 * Main page for SMTP administration - redirects to accounts
 */

import { redirect } from "next/navigation";

import type { CountryLanguage } from "@/i18n/core/config";

interface SmtpAdminPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function SmtpAdminPage({
  params,
}: SmtpAdminPageProps): Promise<never> {
  const { locale } = await params;

  // Redirect to the accounts page
  redirect(`/${locale}/admin/emails/smtp/accounts`);
}
