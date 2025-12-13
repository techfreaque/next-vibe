/**
 * Help Interactive Page
 * Interactive mode for CLI - shows info message on web
 */

import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX } from "react";

import { HelpInteractiveView } from "@/app/api/[locale]/system/help/interactive/_components/help-interactive-view";
import type { CountryLanguage } from "@/i18n/core/config";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";

interface HelpInteractivePageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function HelpInteractivePage({
  params,
}: HelpInteractivePageProps): Promise<JSX.Element> {
  const { locale } = await params;

  // Get user for permission filtering
  const user = await requireAdminUser(locale, `/${locale}/help/interactive`);

  return (
    <PageLayout scrollable={true}>
      <HelpInteractiveView locale={locale} user={user} />
    </PageLayout>
  );
}
