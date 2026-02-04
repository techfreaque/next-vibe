/**
 * Cron Tasks Management Page
 * Dedicated page for managing cron tasks
 */

import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { CronTasksClient } from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/_components/cron-tasks-client";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
  const user = await requireAdminUser(locale);

  return (
    <Div className="flex flex-col gap-6">
      <CronTasksClient locale={locale} user={user} />
    </Div>
  );
}
