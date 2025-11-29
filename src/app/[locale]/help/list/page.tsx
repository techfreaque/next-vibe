/**
 * Help List Page
 * Shows all available commands with filtering options
 */

import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX } from "react";

import { HelpListView } from "@/app/api/[locale]/v1/core/system/help/list/_components/help-list-view";
import type { CountryLanguage } from "@/i18n/core/config";
import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";

interface HelpListPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function HelpListPage({
  params,
}: HelpListPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/help/list`);

  return (
    <PageLayout scrollable={true}>
      <HelpListView locale={locale} />
    </PageLayout>
  );
}
