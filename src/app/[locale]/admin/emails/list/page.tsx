/**
 * Emails List Page
 * Server-side page for email list management
 */

import { Div } from "next-vibe-ui/ui/div";
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
    title: t("app.admin.emails.list.nav.campaigns"),
    description: t("app.admin.emails.list.admin.description"),
  };
}

export default async function EmailsListPage({
  params,
}: EmailsListPageProps): Promise<JSX.Element> {
  const { locale } = await params;

  return (
    <Div className="flex flex-col gap-6">
      {/* List Content */}
      <EmailsListClient locale={locale} />
    </Div>
  );
}
