/**
 * A/B Testing Settings Page
 * Configure and monitor A/B testing for email campaigns
 */

import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ABTestingClient } from "./ab-testing-client";

interface ABTestingPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function ABTestingPage({
  params,
}: ABTestingPageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return (
    <div className="space-y-6">
      {/* Page Description */}
      <div>
        <p className="text-gray-600 dark:text-gray-400">
          {t("leads.admin.tabs.abTesting_description")}
        </p>
      </div>

      {/* A/B Testing Client Component */}
      <ABTestingClient locale={locale} />
    </div>
  );
}
