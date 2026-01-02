/**
 * Cron History Page
 * Dedicated page for viewing cron execution history
 */

import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import type React from "react";

import { CronHistoryClient } from "@/app/api/[locale]/system/unified-interface/tasks/cron/history/_components/cron-history-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface CronHistoryPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({ params }: CronHistoryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("app.admin.cron.nav.history"),
    description: t("app.admin.cron.nav.history_description"),
  };
}

export default async function CronHistoryPage({
  params,
}: CronHistoryPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  return (
    <Div className="flex flex-col gap-6">
      {/* History Content */}
      <CronHistoryClient locale={locale} />
    </Div>
  );
}
