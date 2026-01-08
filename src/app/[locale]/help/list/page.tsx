/**
 * Help List Page
 * Shows all available commands with filtering options
 */

import { notFound } from "next-vibe-ui/lib/not-found";
import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX } from "react";

import { HelpListView } from "@/app/api/[locale]/system/help/list/_components/help-list-view";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

interface HelpListPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function HelpListPage({ params }: HelpListPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  if (env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <PageLayout scrollable={true}>
      <HelpListView locale={locale} />
    </PageLayout>
  );
}
