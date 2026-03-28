/**
 * Admin Dashboard Page
 * Clean dashboard for admin overview
 */

export const dynamic = "force-dynamic";

import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as pageT } from "./i18n";

interface AdminDashboardPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface AdminDashboardPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: AdminDashboardPageProps): Promise<AdminDashboardPageData> {
  const { locale } = await params;
  return { locale };
}

export function TanstackPage({
  locale,
}: AdminDashboardPageData): React.JSX.Element {
  const { t } = pageT.scopedT(locale);

  return (
    <Div className="p-6 flex flex-col gap-8">
      <P className="text-gray-600 dark:text-gray-400">
        {t("dashboard.subtitle")}
      </P>
    </Div>
  );
}

export default async function AdminDashboardPage({
  params,
}: AdminDashboardPageProps): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
