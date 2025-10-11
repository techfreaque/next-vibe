/**
 * Admin Dashboard Page
 * Clean dashboard for admin overview
 */

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
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("admin.dashboard.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("admin.dashboard.subtitle")}
        </p>
      </div>
    </div>
  );
}
