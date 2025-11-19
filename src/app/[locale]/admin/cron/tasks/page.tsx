/**
 * Cron Tasks Management Page
 * Dedicated page for managing cron tasks
 */

import type { Metadata } from "next";
import type { JSX } from "react";
import { Div } from "next-vibe-ui/ui/div";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CronTasksClient } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/tasks/_components/cron-tasks-client";

interface CronTasksPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: CronTasksPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("app.admin.cron.nav.tasks"),
    description: t("app.admin.cron.nav.tasks_description"),
  };
}

export default async function CronTasksPage({
  params,
}: CronTasksPageProps): Promise<JSX.Element> {
  const { locale } = await params;

  return (
    <Div className="flex flex-col gap-6">
      <CronTasksClient locale={locale} />
    </Div>
  );
}
