/**
 * Admin Dashboard Page
 * Clean dashboard for admin overview
 */

import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface AdminDashboardPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function AdminDashboardPage({
  params,
}: AdminDashboardPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <Div className="p-6 flex flex-col gap-8">
      <Div>
        <H1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("app.admin.dashboard.title")}
        </H1>
        <P className="mt-2 text-gray-600 dark:text-gray-400">{t("app.admin.dashboard.subtitle")}</P>
      </Div>
    </Div>
  );
}
