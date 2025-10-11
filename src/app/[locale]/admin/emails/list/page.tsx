/**
 * Emails List Page
 * Server-side page for email list management
 */

import type { Metadata } from "next";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { EmailsListClient } from "./_components/emails-list-client";

interface EmailsListPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: EmailsListPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("emails.nav.campaigns"),
    description: t("emails.admin.description"),
  };
}

export default async function EmailsListPage({
  params,
}: EmailsListPageProps): Promise<JSX.Element> {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      {/* List Content */}
      <EmailsListClient locale={locale} />
    </div>
  );
}
